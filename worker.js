export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: {
          "content-type": "application/json; charset=UTF-8",
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET,POST,OPTIONS",
          "access-control-allow-headers": "Content-Type, Authorization"
        }
      });

    if (method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET,POST,OPTIONS",
          "access-control-allow-headers": "Content-Type, Authorization"
        }
      });
    }

    if (!env.DB) {
      return json({
        ok: false,
        error: "D1 binding با نام DB متصل نیست."
      }, 500);
    }

    async function body() {
      try {
        return await request.json();
      } catch {
        return {};
      }
    }

    async function initDB() {
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          balance INTEGER NOT NULL DEFAULT 0,
          status TEXT NOT NULL DEFAULT 'active',
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `).run();

      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          type TEXT NOT NULL,
          amount INTEGER NOT NULL,
          description TEXT,
          status TEXT NOT NULL DEFAULT 'completed',
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `).run();

      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS withdrawals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          amount INTEGER NOT NULL,
          method TEXT NOT NULL,
          destination TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `).run();

      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS reset_codes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          code TEXT NOT NULL,
          expires_at INTEGER NOT NULL,
          used INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `).run();
    }

    async function hashPassword(password) {
      const data = new TextEncoder().encode(password);
      const hash = await crypto.subtle.digest("SHA-256", data);
      return [...new Uint8Array(hash)]
        .map(x => x.toString(16).padStart(2, "0"))
        .join("");
    }

    function randomToken() {
      const a = new Uint8Array(32);
      crypto.getRandomValues(a);
      return [...a].map(x => x.toString(16).padStart(2, "0")).join("");
    }

    const sessions = new Map();

    async function getUser(request) {
      const auth = request.headers.get("Authorization") || "";
      if (!auth.startsWith("Bearer ")) return null;

      const token = auth.substring(7);
      const userId = sessions.get(token);
      if (!userId) return null;

      const result = await env.DB.prepare(
        "SELECT * FROM users WHERE id = ? AND status = 'active'"
      ).bind(userId).first();

      return result || null;
    }

    async function adminOK(request) {
      const auth = request.headers.get("Authorization") || "";
      if (!auth.startsWith("Admin ")) return false;

      const supplied = auth.substring(6);

      if (!env.ADMIN_PASSWORD) return false;

      return supplied === env.ADMIN_PASSWORD;
    }

    try {
      await initDB();

      /* =========================
         FRONTEND
      ========================= */

      if (path === "/" || path === "/index.html") {
        return new Response(HTML, {
          headers: {
            "content-type": "text/html; charset=UTF-8"
          }
        });
      }

      /* =========================
         REGISTER
      ========================= */

      if (path === "/api/register" && method === "POST") {
        const b = await body();

        const name = String(b.name || "").trim();
        const email = String(b.email || "").trim().toLowerCase();
        const password = String(b.password || "");

        if (!name || !email || !password) {
          return json({
            ok: false,
            error: "نام، ایمیل و رمز عبور الزامی است."
          }, 400);
        }

        if (password.length < 6) {
          return json({
            ok: false,
            error: "رمز عبور باید حداقل ۶ کاراکتر باشد."
          }, 400);
        }

        const exists = await env.DB.prepare(
          "SELECT id FROM users WHERE email = ?"
        ).bind(email).first();

        if (exists) {
          return json({
            ok: false,
            error: "این ایمیل قبلاً ثبت شده است."
          }, 409);
        }

        const hash = await hashPassword(password);

        const result = await env.DB.prepare(`
          INSERT INTO users
          (name,email,password_hash,balance,status)
          VALUES (?,?,?,?,?)
        `).bind(
          name,
          email,
          hash,
          0,
          "active"
        ).run();

        return json({
          ok: true,
          message: "ثبت‌نام با موفقیت انجام شد.",
          user_id: result.meta.last_row_id
        });
      }

      /* =========================
         LOGIN
      ========================= */

      if (path === "/api/login" && method === "POST") {
        const b = await body();

        const email = String(b.email || "").trim().toLowerCase();
        const password = String(b.password || "");

        const user = await env.DB.prepare(
          "SELECT * FROM users WHERE email = ?"
        ).bind(email).first();

        if (!user) {
          return json({
            ok: false,
            error: "ایمیل یا رمز عبور اشتباه است."
          }, 401);
        }

        if (user.status !== "active") {
          return json({
            ok: false,
            error: "حساب کاربری غیرفعال است."
          }, 403);
        }

        const hash = await hashPassword(password);

        if (hash !== user.password_hash) {
          return json({
            ok: false,
            error: "ایمیل یا رمز عبور اشتباه است."
          }, 401);
        }

        const token = randomToken();
        sessions.set(token, user.id);

        return json({
          ok: true,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            balance: user.balance
          }
        });
      }

      /* =========================
         ME
      ========================= */

      if (path === "/api/me" && method === "GET") {
        const user = await getUser(request);

        if (!user) {
          return json({
            ok: false,
            error: "وارد حساب نشده‌اید."
          }, 401);
        }

        return json({
          ok: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            balance: user.balance,
            status: user.status
          }
        });
      }

      /* =========================
         FORGOT PASSWORD
      ========================= */

      if (path === "/api/forgot-password" && method === "POST") {
        const b = await body();
        const email = String(b.email || "").trim().toLowerCase();

        if (!email) {
          return json({
            ok: false,
            error: "ایمیل را وارد کنید."
          }, 400);
        }

        const user = await env.DB.prepare(
          "SELECT id,email FROM users WHERE email = ?"
        ).bind(email).first();

        /*
         برای امنیت، وجود یا عدم وجود ایمیل
         مستقیماً اعلام نمی‌شود.
        */

        if (!user) {
          return json({
            ok: true,
            message: "اگر این ایمیل ثبت شده باشد، کد بازیابی ایجاد شد."
          });
        }

        const code =
          Math.floor(100000 + Math.random() * 900000).toString();

        const expires =
          Date.now() + (10 * 60 * 1000);

        await env.DB.prepare(`
          INSERT INTO reset_codes
          (user_id,code,expires_at,used)
          VALUES (?,?,?,0)
        `).bind(
          user.id,
          code,
          expires
        ).run();

        /*
         فعلاً کد در پاسخ توسعه‌ای برگردانده می‌شود.
         برای محیط واقعی باید Email Provider متصل شود.
        */

        return json({
          ok: true,
          message: "کد بازیابی ایجاد شد.",
          development_code: code,
          expires_in: 600
        });
      }

      /* =========================
         RESET PASSWORD
      ========================= */

      if (path === "/api/reset-password" && method === "POST") {
        const b = await body();

        const email = String(b.email || "").trim().toLowerCase();
        const code = String(b.code || "").trim();
        const password = String(b.password || "");

        if (!email || !code || !password) {
          return json({
            ok: false,
            error: "ایمیل، کد و رمز جدید الزامی است."
          }, 400);
        }

        if (password.length < 6) {
          return json({
            ok: false,
            error: "رمز جدید باید حداقل ۶ کاراکتر باشد."
          }, 400);
        }

        const user = await env.DB.prepare(
          "SELECT id FROM users WHERE email = ?"
        ).bind(email).first();

        if (!user) {
          return json({
            ok: false,
            error: "کد بازیابی معتبر نیست."
          }, 400);
        }

        const reset = await env.DB.prepare(`
          SELECT * FROM reset_codes
          WHERE user_id = ?
          AND code = ?
          AND used = 0
          ORDER BY id DESC
          LIMIT 1
        `).bind(
          user.id,
          code
        ).first();

        if (!reset) {
          return json({
            ok: false,
            error: "کد بازیابی اشتباه است."
          }, 400);
        }

        if (Date.now() > Number(reset.expires_at)) {
          return json({
            ok: false,
            error: "کد بازیابی منقضی شده است."
          }, 400);
        }

        const hash = await hashPassword(password);

        await env.DB.prepare(
          "UPDATE users SET password_hash = ? WHERE id = ?"
        ).bind(hash, user.id).run();

        await env.DB.prepare(
          "UPDATE reset_codes SET used = 1 WHERE id = ?"
        ).bind(reset.id).run();

        return json({
          ok: true,
          message: "رمز عبور با موفقیت تغییر کرد."
        });
      }

      /* =========================
         TRANSACTIONS
      ========================= */

      if (path === "/api/transactions" && method === "GET") {
        const user = await getUser(request);

        if (!user) {
          return json({
            ok: false,
            error: "دسترسی غیرمجاز."
          }, 401);
        }

        const rows = await env.DB.prepare(`
          SELECT *
          FROM transactions
          WHERE user_id = ?
          ORDER BY id DESC
        `).bind(user.id).all();

        return json({
          ok: true,
          transactions: rows.results || []
        });
      }

      /* =========================
         WITHDRAW
      ========================= */

      if (path === "/api/withdraw" && method === "POST") {
        const user = await getUser(request);

        if (!user) {
          return json({
            ok: false,
            error: "ابتدا وارد حساب شوید."
          }, 401);
        }

        const b = await body();

        const amount = Number(b.amount || 0);
        const methodName = String(b.method || "").trim();
        const destination = String(b.destination || "").trim();

        if (!Number.isFinite(amount) || amount <= 0) {
          return json({
            ok: false,
            error: "مبلغ برداشت نامعتبر است."
          }, 400);
        }

        if (amount < 10000) {
          return json({
            ok: false,
            error: "حداقل مبلغ برداشت ۱۰٬۰۰۰ تومان است."
          }, 400);
        }

        if (amount > Number(user.balance)) {
          return json({
            ok: false,
            error: "موجودی کافی نیست."
          }, 400);
        }

        if (!methodName || !destination) {
          return json({
            ok: false,
            error: "روش و مقصد پرداخت را وارد کنید."
          }, 400);
        }

        await env.DB.prepare(
          "UPDATE users SET balance = balance - ? WHERE id = ?"
        ).bind(amount, user.id).run();

        await env.DB.prepare(`
          INSERT INTO withdrawals
          (user_id,amount,method,destination,status)
          VALUES (?,?,?,?,?)
        `).bind(
          user.id,
          amount,
          methodName,
          destination,
          "pending"
        ).run();

        await env.DB.prepare(`
          INSERT INTO transactions
          (user_id,type,amount,description,status)
          VALUES (?,?,?,?,?)
        `).bind(
          user.id,
          "withdrawal",
          amount,
          "درخواست برداشت",
          "pending"
        ).run();

        return json({
          ok: true,
          message: "درخواست برداشت ثبت شد."
        });
      }

      /* =========================
         ADMIN LOGIN
      ========================= */

      if (path === "/api/admin/login" && method === "POST") {
        const b = await body();
        const password = String(b.password || "");

        if (!env.ADMIN_PASSWORD) {
          return json({
            ok: false,
            error: "ADMIN_PASSWORD در تنظیمات Worker وجود ندارد."
          }, 500);
        }

        if (password !== env.ADMIN_PASSWORD) {
          return json({
            ok: false,
            error: "رمز مدیریت اشتباه است."
          }, 401);
        }

        return json({
          ok: true,
          admin_token: env.ADMIN_PASSWORD,
          message: "ورود مدیریت موفق بود."
        });
      }

      /* =========================
         ADMIN USERS
      ========================= */

      if (path === "/api/admin/users" && method === "GET") {
        if (!(await adminOK(request))) {
          return json({
            ok: false,
            error: "دسترسی مدیریت غیرمجاز است."
          }, 403);
        }

        const rows = await env.DB.prepare(`
          SELECT
            id,
            name,
            email,
            balance,
            status,
            created_at
          FROM users
          ORDER BY id DESC
        `).all();

        return json({
          ok: true,
          users: rows.results || []
        });
      }

      /* =========================
         ADMIN ADD BALANCE
      ========================= */

      if (path === "/api/admin/balance" && method === "POST") {
        if (!(await adminOK(request))) {
          return json({
            ok: false,
            error: "دسترسی مدیریت غیرمجاز است."
          }, 403);
        }

        const b = await body();

        const userId = Number(b.user_id || 0);
        const amount = Number(b.amount || 0);
        const description =
          String(b.description || "افزایش موجودی توسط مدیریت");

        if (!userId || !Number.isFinite(amount) || amount <= 0) {
          return json({
            ok: false,
            error: "کاربر یا مبلغ نامعتبر است."
          }, 400);
        }

        const user = await env.DB.prepare(
          "SELECT id FROM users WHERE id = ?"
        ).bind(userId).first();

        if (!user) {
          return json({
            ok: false,
            error: "کاربر پیدا نشد."
          }, 404);
        }

        await env.DB.prepare(
          "UPDATE users SET balance = balance + ? WHERE id = ?"
        ).bind(amount, userId).run();

        await env.DB.prepare(`
          INSERT INTO transactions
          (user_id,type,amount,description,status)
          VALUES (?,?,?,?,?)
        `).bind(
          userId,
          "income",
          amount,
          description,
          "completed"
        ).run();

        return json({
          ok: true,
          message: "موجودی با موفقیت افزایش یافت."
        });
      }

      /* =========================
         ADMIN INCOME
      ========================= */

      if (path === "/api/admin/income" && method === "POST") {
        if (!(await adminOK(request))) {
          return json({
            ok: false,
            error: "دسترسی مدیریت غیرمجاز است."
          }, 403);
        }

        const b = await body();

        const userId = Number(b.user_id || 0);
        const amount = Number(b.amount || 0);
        const description =
          String(b.description || "ثبت درآمد");

        if (!userId || !Number.isFinite(amount) || amount <= 0) {
          return json({
            ok: false,
            error: "کاربر یا مبلغ نامعتبر است."
          }, 400);
        }

        const user = await env.DB.prepare(
          "SELECT id FROM users WHERE id = ?"
        ).bind(userId).first();

        if (!user) {
          return json({
            ok: false,
            error: "کاربر پیدا نشد."
          }, 404);
        }

        await env.DB.prepare(
          "UPDATE users SET balance = balance + ? WHERE id = ?"
        ).bind(amount, userId).run();

        await env.DB.prepare(`
          INSERT INTO transactions
          (user_id,type,amount,description,status)
          VALUES (?,?,?,?,?)
        `).bind(
          userId,
          "income",
          amount,
          description,
          "completed"
        ).run();

        return json({
          ok: true,
          message: "درآمد ثبت شد."
        });
      }

      /* =========================
         ADMIN PAYMENTS
      ========================= */

      if (path === "/api/admin/payments" && method === "GET") {
        if (!(await adminOK(request))) {
          return json({
            ok: false,
            error: "دسترسی مدیریت غیرمجاز است."
          }, 403);
        }

        const rows = await env.DB.prepare(`
          SELECT
            t.*,
            u.name,
            u.email
          FROM transactions t
          LEFT JOIN users u
          ON u.id = t.user_id
          WHERE t.type IN ('payment','deposit')
          ORDER BY t.id DESC
        `).all();

        return json({
          ok: true,
          payments: rows.results || []
        });
      }

      /* =========================
         ADMIN WITHDRAWALS
      ========================= */

      if (path === "/api/admin/withdrawals" && method === "GET") {
        if (!(await adminOK(request))) {
          return json({
            ok: false,
            error: "دسترسی مدیریت غیرمجاز است."
          }, 403);
        }

        const rows = await env.DB.prepare(`
          SELECT
            w.*,
            u.name,
            u.email
          FROM withdrawals w
          LEFT JOIN users u
          ON u.id = w.user_id
          ORDER BY w.id DESC
        `).all();

        return json({
          ok: true,
          withdrawals: rows.results || []
        });
      }

      /* =========================
         ADMIN WITHDRAW STATUS
      ========================= */

      if (path === "/api/admin/withdrawal-status" && method === "POST") {
        if (!(await adminOK(request))) {
          return json({
            ok: false,
            error: "دسترسی مدیریت غیرمجاز است."
          }, 403);
        }

        const b = await body();

        const id = Number(b.id || 0);
        const status = String(b.status || "").trim();

        if (!id || !["approved", "rejected"].includes(status)) {
          return json({
            ok: false,
            error: "اطلاعات نامعتبر است."
          }, 400);
        }

        const withdrawal = await env.DB.prepare(
          "SELECT * FROM withdrawals WHERE id = ?"
        ).bind(id).first();

        if (!withdrawal) {
          return json({
            ok: false,
            error: "درخواست برداشت پیدا نشد."
          }, 404);
        }

        if (withdrawal.status !== "pending") {
          return json({
            ok: false,
            error: "این درخواست قبلاً بررسی شده است."
          }, 400);
        }

        if (status === "approved") {
          await env.DB.prepare(
            "UPDATE withdrawals SET status = 'approved' WHERE id = ?"
          ).bind(id).run();

          await env.DB.prepare(`
            UPDATE transactions
            SET status = 'completed'
            WHERE user_id = ?
            AND type = 'withdrawal'
            AND amount = ?
            AND status = 'pending'
          `).bind(
            withdrawal.user_id,
            withdrawal.amount
          ).run();
        }

        if (status === "rejected") {
          await env.DB.prepare(
            "UPDATE withdrawals SET status = 'rejected' WHERE id = ?"
          ).bind(id).run();

          await env.DB.prepare(
            "UPDATE users SET balance = balance + ? WHERE id = ?"
          ).bind(
            withdrawal.amount,
            withdrawal.user_id
          ).run();

          await env.DB.prepare(`
            UPDATE transactions
            SET status = 'rejected'
            WHERE user_id = ?
            AND type = 'withdrawal'
            AND amount = ?
            AND status = 'pending'
          `).bind(
            withdrawal.user_id,
            withdrawal.amount
          ).run();
        }

        return json({
          ok: true,
          message: "وضعیت برداشت تغییر کرد."
        });
      }

      /* =========================
         ADMIN STATS
      ========================= */

      if (path === "/api/admin/stats" && method === "GET") {
        if (!(await adminOK(request))) {
          return json({
            ok: false,
            error: "دسترسی مدیریت غیرمجاز است."
          }, 403);
        }

        const users = await env.DB.prepare(
          "SELECT COUNT(*) AS count FROM users"
        ).first();

        const balance = await env.DB.prepare(
          "SELECT COALESCE(SUM(balance),0) AS total FROM users"
        ).first();

        const income = await env.DB.prepare(`
          SELECT COALESCE(SUM(amount),0) AS total
          FROM transactions
          WHERE type = 'income'
          AND status = 'completed'
        `).first();

        const withdrawals = await env.DB.prepare(`
          SELECT COALESCE(SUM(amount),0) AS total
          FROM withdrawals
          WHERE status = 'approved'
        `).first();

        const pending = await env.DB.prepare(`
          SELECT COUNT(*) AS count
          FROM withdrawals
          WHERE status = 'pending'
        `).first();

        return json({
          ok: true,
          stats: {
            users: Number(users?.count || 0),
            balance: Number(balance?.total || 0),
            income: Number(income?.total || 0),
            withdrawals: Number(withdrawals?.total || 0),
            pending_withdrawals: Number(pending?.count || 0)
          }
        });
      }

      return json({
        ok: false,
        error: "مسیر پیدا نشد.",
        path
      }, 404);

    } catch (err) {
      return json({
        ok: false,
        error: "خطای داخلی سرور",
        detail: String(err?.message || err)
      }, 500);
    }
  }
};


/* =========================================================
   FRONTEND
========================================================= */

const HTML = `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<title>دستیار هوش مصنوعی</title>

<style>

*{
  box-sizing:border-box;
}

body{
  margin:0;
  font-family:Tahoma,Arial,sans-serif;
  background:#f4f7fb;
  color:#172033;
}

header{
  background:linear-gradient(135deg,#111827,#2563eb);
  color:white;
  padding:28px 16px;
  text-align:center;
}

header h1{
  margin:0 0 8px;
  font-size:26px;
}

header p{
  margin:0;
  opacity:.9;
}

.container{
  max-width:1100px;
  margin:20px auto;
  padding:0 14px;
}

.card{
  background:white;
  border-radius:18px;
  padding:20px;
  margin-bottom:18px;
  box-shadow:0 8px 25px rgba(0,0,0,.07);
}

h2{
  margin-top:0;
}

input,select,button{
  width:100%;
  padding:13px;
  margin:6px 0;
  border-radius:10px;
  border:1px solid #d8dee9;
  font-family:inherit;
}

button{
  border:0;
  background:#2563eb;
  color:white;
  cursor:pointer;
  font-weight:bold;
}

button:hover{
  opacity:.9;
}

button.danger{
  background:#dc2626;
}

button.success{
  background:#16a34a;
}

button.gray{
  background:#475569;
}

.hidden{
  display:none!important;
}

.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:12px;
}

.stat{
  background:#f8fafc;
  border:1px solid #e2e8f0;
  padding:18px;
  border-radius:14px;
}

.stat b{
  display:block;
  font-size:23px;
  margin-top:8px;
}

.nav{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(130px,1fr));
  gap:8px;
  margin-bottom:15px;
}

.nav button{
  background:#334155;
}

.nav button.active{
  background:#2563eb;
}

table{
  width:100%;
  border-collapse:collapse;
  overflow:hidden;
}

th,td{
  padding:10px;
  border-bottom:1px solid #e5e7eb;
  text-align:right;
}

.small{
  color:#64748b;
  font-size:13px;
}

.balance{
  font-size:30px;
  font-weight:bold;
  color:#16a34a;
}

.message{
  padding:12px;
  border-radius:10px;
  margin-top:8px;
  background:#eff6ff;
}

.plan{
  border:2px solid #e2e8f0;
  border-radius:15px;
  padding:18px;
  text-align:center;
}

.plan h3{
  margin:0 0 8px;
}

.price{
  font-size:24px;
  font-weight:bold;
}

</style>
</head>

<body>

<header>
<h1>🤖 دستیار هوش مصنوعی</h1>
<p>حساب کاربری • افزایش موجودی • درآمد • تراکنش • برداشت</p>
</header>

<div class="container">

<!-- LOGIN -->

<section id="auth" class="card">

<h2>👤 حساب کاربری</h2>

<input id="name" placeholder="نام کامل">

<input id="email" type="email" placeholder="ایمیل">

<input id="password" type="password" placeholder="رمز عبور">

<div class="grid">

<button onclick="register()">📝 ثبت‌نام</button>

<button onclick="login()">🔐 ورود</button>

</div>

<button class="gray" onclick="showForgot()">
🔑 بازیابی رمز عبور
</button>

<div id="authMsg"></div>

</section>


<!-- FORGOT -->

<section id="forgot" class="card hidden">

<h2>🔑 بازیابی رمز عبور</h2>

<p class="small">
ایمیل حساب خود را وارد کنید.
</p>

<input id="forgotEmail" type="email" placeholder="ایمیل">

<button onclick="forgotPassword()">
📧 دریافت کد بازیابی
</button>

<input id="resetCode"
placeholder="کد ۶ رقمی">

<input id="newPassword"
type="password"
placeholder="رمز عبور جدید">

<button onclick="resetPassword()">
🔐 تغییر رمز عبور
</button>

<button class="gray" onclick="hideForgot()">
بازگشت
</button>

<div id="forgotMsg"></div>

</section>


<!-- USER -->

<section id="userPanel" class="hidden">

<div class="card">

<h2>👤 حساب کاربری</h2>

<div class="grid">

<div class="stat">
ایمیل
<b id="userEmail">-</b>
</div>

<div class="stat">
موجودی
<b class="balance" id="balance">۰ تومان</b>
</div>

</div>

<button class="danger" onclick="logout()">
🚪 خروج
</button>

</div>


<div class="card">

<h2>💰 افزایش موجودی</h2>

<div class="grid">

<div class="plan">
<h3>پلن شروع</h3>
<div class="price">۴۰۰٬۰۰۰ تومان</div>
<button onclick="paymentAlert(400000)">
انتخاب
</button>
</div>

<div class="plan">
<h3>پلن حرفه‌ای</h3>
<div class="price">۷۰۰٬۰۰۰ تومان</div>
<button onclick="paymentAlert(700000)">
انتخاب
</button>
</div>

<div class="plan">
<h3>پلن ویژه</h3>
<div class="price">۱٬۰۰۰٬۰۰۰ تومان</div>
<button onclick="paymentAlert(1000000)">
انتخاب
</button>
</div>

</div>

<div id="paymentMsg"></div>

</div>


<div class="card">

<h2>💸 درخواست برداشت</h2>

<input id="withdrawAmount"
type="number"
placeholder="مبلغ برداشت به تومان">

<select id="withdrawMethod">
<option value="">روش پرداخت</option>
<option value="bank">حساب بانکی</option>
<option value="wallet">کیف پول</option>
</select>

<input id="withdrawDestination"
placeholder="شماره حساب / شماره کارت / آدرس کیف پول">

<button onclick="withdraw()">
💵 ثبت درخواست برداشت
</button>

<div class="small">
حداقل برداشت: ۱۰٬۰۰۰ تومان
</div>

<div id="withdrawMsg"></div>

</div>


<div class="card">

<h2>🧾 تراکنش‌های من</h2>

<button onclick="loadTransactions()">
🔄 بروزرسانی
</button>

<div id="transactions"></div>

</div>

</section>


<!-- ADMIN -->

<section id="adminPanel" class="hidden">

<div class="card">

<h2>🛠️ مدیریت سیستم</h2>

<div class="nav">

<button onclick="adminPage('users')">
👥 کاربران
</button>

<button onclick="adminPage('income')">
💰 ثبت درآمد
</button>

<button onclick="adminPage('payments')">
💳 پرداخت‌ها
</button>

<button onclick="adminPage('withdrawals')">
💵 برداشت‌ها
</button>

<button onclick="adminPage('stats')">
📊 آمار
</button>

</div>

<div id="adminContent"></div>

</div>

</section>


<!-- ADMIN LOGIN -->

<section id="adminLogin" class="card">

<h2>🛠️ مدیریت سیستم</h2>

<input id="adminPassword"
type="password"
placeholder="🔐 رمز مدیریت">

<button onclick="adminLogin()">
🔐 ورود مدیریت
</button>

<div id="adminMsg"></div>

</section>

</div>


<script>

let token = localStorage.getItem("user_token") || "";
let adminToken = localStorage.getItem("admin_token") || "";

async function api(url, options={}){

  options.headers = {
    ...(options.headers || {}),
    "Content-Type":"application/json"
  };

  if(token){
    options.headers.Authorization =
      "Bearer " + token;
  }

  return fetch(url,options);
}


function msg(id,text){

  document.getElementById(id).innerHTML =
    '<div class="message">' + text + '</div>';

}


async function register(){

  const res = await api("/api/register",{
    method:"POST",
    body:JSON.stringify({
      name:document.getElementById("name").value,
      email:document.getElementById("email").value,
      password:document.getElementById("password").value
    })
  });

  const data = await res.json();

  msg("authMsg",data.message || data.error || "خطا");
}


async function login(){

  const res = await api("/api/login",{
    method:"POST",
    body:JSON.stringify({
      email:document.getElementById("email").value,
      password:document.getElementById("password").value
    })
  });

  const data = await res.json();

  if(data.ok){

    token=data.token;

    localStorage.setItem(
      "user_token",
      token
    );

    document.getElementById("auth")
      .classList.add("hidden");

    document.getElementById("userPanel")
      .classList.remove("hidden");

    loadMe();

  }else{

    msg("authMsg",data.error || "خطا");

  }
}


function showForgot(){

  document.getElementById("auth")
    .classList.add("hidden");

  document.getElementById("forgot")
    .classList.remove("hidden");

}


function hideForgot(){

  document.getElementById("forgot")
    .classList.add("hidden");

  document.getElementById("auth")
    .classList.remove("hidden");

}


async function forgotPassword(){

  const email =
    document.getElementById("forgotEmail").value;

  const res = await api("/api/forgot-password",{
    method:"POST",
    body:JSON.stringify({email})
  });

  const data = await res.json();

  let text = data.message || data.error || "خطا";

  if(data.development_code){

    text +=
      "<br><b>کد بازیابی:</b> " +
      data.development_code +
      "<br><span class='small'>این کد فعلاً برای تست نمایش داده می‌شود.</span>";

  }

  msg("forgotMsg",text);

}


async function resetPassword(){

  const res = await api("/api/reset-password",{
    method:"POST",
    body:JSON.stringify({

      email:
        document.getElementById("forgotEmail").value,

      code:
        document.getElementById("resetCode").value,

      password:
        document.getElementById("newPassword").value

    })
  });

  const data = await res.json();

  msg(
    "forgotMsg",
    data.message || data.error || "خطا"
  );

}


async function loadMe(){

  const res = await api("/api/me");

  const data = await res.json();

  if(!data.ok){

    logout();
    return;

  }

  document.getElementById("userEmail")
    .textContent=data.user.email;

  document.getElementById("balance")
    .textContent=
      Number(data.user.balance).toLocaleString("fa-IR")
      + " تومان";

}


function logout(){

  token="";
  localStorage.removeItem("user_token");

  document.getElementById("userPanel")
    .classList.add("hidden");

  document.getElementById("auth")
    .classList.remove("hidden");

}


function paymentAlert(amount){

  msg(
    "paymentMsg",
    "پلن " +
    Number(amount).toLocaleString("fa-IR") +
    " تومان انتخاب شد. برای دریافت وجه واقعی باید درگاه پرداخت متصل شود."
  );

}


async function withdraw(){

  const amount =
    Number(document.getElementById("withdrawAmount").value);

  const method =
    document.getElementById("withdrawMethod").value;

  const destination =
    document.getElementById("withdrawDestination").value;

  const res = await api("/api/withdraw",{
    method:"POST",
    body:JSON.stringify({
      amount,
      method,
      destination
    })
  });

  const data = await res.json();

  msg(
    "withdrawMsg",
    data.message || data.error || "خطا"
  );

  if(data.ok){
    loadMe();
    loadTransactions();
  }

}


async function loadTransactions(){

  const res = await api("/api/transactions");

  const data = await res.json();

  if(!data.ok){
    return;
  }

  let html =
    "<table><tr>" +
    "<th>نوع</th>" +
    "<th>مبلغ</th>" +
    "<th>وضعیت</th>" +
    "<th>توضیح</th>" +
    "</tr>";

  for(const x of data.transactions){

    html +=
      "<tr>" +
      "<td>" + x.type + "</td>" +
      "<td>" +
      Number(x.amount).toLocaleString("fa-IR") +
      " تومان</td>" +
      "<td>" + x.status + "</td>" +
      "<td>" + (x.description || "-") + "</td>" +
      "</tr>";

  }

  html += "</table>";

  document.getElementById("transactions")
    .innerHTML=html;

}


async function adminLogin(){

  const password =
    document.getElementById("adminPassword").value;

  const res = await fetch("/api/admin/login",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({password})
  });

  const data = await res.json();

  if(data.ok){

    adminToken=data.admin_token;

    localStorage.setItem(
      "admin_token",
      adminToken
    );

    document.getElementById("adminLogin")
      .classList.add("hidden");

    document.getElementById("adminPanel")
      .classList.remove("hidden");

    msg(
      "adminMsg",
      "✅ ورود مدیریت موفق بود."
    );

    adminPage("stats");

  }else{

    msg(
      "adminMsg",
      data.error || "خطا"
    );

  }

}


async function adminFetch(url,options={}){

  options.headers={
    ...(options.headers || {}),
    "Content-Type":"application/json",
    "Authorization":
      "Admin " + adminToken
  };

  return fetch(url,options);

}


async function adminPage(page){

  const box =
    document.getElementById("adminContent");

  box.innerHTML =
    "<div class='message'>⏳ در حال دریافت اطلاعات...</div>";

  if(page==="users"){

    const res =
      await adminFetch("/api/admin/users");

    const data=await res.json();

    if(!data.ok){
      box.innerHTML=
        "<div class='message'>"+data.error+"</div>";
      return;
    }

    let html =
      "<h3>👥 کاربران</h3>" +
      "<table><tr>" +
      "<th>ID</th>" +
      "<th>نام</th>" +
      "<th>ایمیل</th>" +
      "<th>موجودی</th>" +
      "<th>وضعیت</th>" +
      "</tr>";

    for(const u of data.users){

      html +=
        "<tr>" +
        "<td>"+u.id+"</td>" +
        "<td>"+u.name+"</td>" +
        "<td>"+u.email+"</td>" +
        "<td>"+
        Number(u.balance).toLocaleString("fa-IR")+
        "</td>" +
        "<td>"+u.status+"</td>" +
        "</tr>";

    }

    html+="</table>";

    box.innerHTML=html;

  }


  if(page==="income"){

    box.innerHTML=`

      <h3>💰 ثبت درآمد / افزایش موجودی</h3>

      <input id="incomeUser"
        type="number"
        placeholder="شناسه کاربر">

      <input id="incomeAmount"
        type="number"
        placeholder="مبلغ به تومان">

      <input id="incomeDescription"
        placeholder="توضیح">

      <button onclick="addIncome()">
        💰 ثبت درآمد
      </button>

      <div id="incomeMsg"></div>

    `;

  }


  if(page==="payments"){

    const res =
      await adminFetch("/api/admin/payments");

    const data=await res.json();

    if(!data.ok){
      box.innerHTML=
        "<div class='message'>"+data.error+"</div>";
      return;
    }

    let html=
      "<h3>💳 پرداخت‌ها</h3>" +
      "<table><tr>" +
      "<th>کاربر</th>" +
      "<th>ایمیل</th>" +
      "<th>مبلغ</th>" +
      "<th>وضعیت</th>" +
      "</tr>";

    for(const p of data.payments){

      html+=
        "<tr>" +
        "<td>"+(p.name || "-")+"</td>" +
        "<td>"+(p.email || "-")+"</td>" +
        "<td>"+
        Number(p.amount).toLocaleString("fa-IR")+
        "</td>" +
        "<td>"+p.status+"</td>" +
        "</tr>";

    }

    html+="</table>";

    box.innerHTML=html;

  }


  if(page==="withdrawals"){

    const res =
      await adminFetch("/api/admin/withdrawals");

    const data=await res.json();

    if(!data.ok){
      box.innerHTML=
        "<div class='message'>"+data.error+"</div>";
      return;
    }

    let html=
      "<h3>💵 برداشت‌ها</h3>" +
      "<table><tr>" +
      "<th>کاربر</th>" +
      "<th>مبلغ</th>" +
      "<th>روش</th>" +
      "<th>مقصد</th>" +
      "<th>وضعیت</th>" +
      "<th>عملیات</th>" +
      "</tr>";

    for(const w of data.withdrawals){

      html+=
        "<tr>" +
        "<td>"+(w.name || "-")+"</td>" +
        "<td>"+
        Number(w.amount).toLocaleString("fa-IR")+
        "</td>" +
        "<td>"+w.method+"</td>" +
        "<td>"+w.destination+"</td>" +
        "<td>"+w.status+"</td>" +
        "<td>";

      if(w.status==="pending"){

        html+=
          "<button class='success' " +
          "onclick='withdrawStatus("+
          w.id+",\"approved\")'>" +
          "تأیید" +
          "</button>" +

          "<button class='danger' " +
          "onclick='withdrawStatus("+
          w.id+",\"rejected\")'>" +
          "رد" +
          "</button>";

      }else{

        html+="بررسی شده";

      }

      html+="</td></tr>";

    }

    html+="</table>";

    box.innerHTML=html;

  }


  if(page==="stats"){

    const res =
      await adminFetch("/api/admin/stats");

    const data=await res.json();

    if(!data.ok){
      box.innerHTML=
        "<div class='message'>"+data.error+"</div>";
      return;
    }

    const s=data.stats;

    box.innerHTML=`

      <h3>📊 آمار سیستم</h3>

      <div class="grid">

        <div class="stat">
          👥 کاربران
          <b>${s.users.toLocaleString("fa-IR")}</b>
        </div>

        <div class="stat">
          💰 مجموع موجودی
          <b>${s.balance.toLocaleString("fa-IR")} تومان</b>
        </div>

        <div class="stat">
          📈 درآمد ثبت‌شده
          <b>${s.income.toLocaleString("fa-IR")} تومان</b>
        </div>

        <div class="stat">
          💵 برداشت تأییدشده
          <b>${s.withdrawals.toLocaleString("fa-IR")} تومان</b>
        </div>

        <div class="stat">
          ⏳ برداشت‌های در انتظار
          <b>${s.pending_withdrawals.toLocaleString("fa-IR")}</b>
        </div>

      </div>

    `;

  }

}


async function addIncome(){

  const user_id =
    Number(document.getElementById("incomeUser").value);

  const amount =
    Number(document.getElementById("incomeAmount").value);

  const description =
    document.getElementById("incomeDescription").value;

  const res =
    await adminFetch("/api/admin/income",{
      method:"POST",
      body:JSON.stringify({
        user_id,
        amount,
        description
      })
    });

  const data=await res.json();

  msg(
    "incomeMsg",
    data.message || data.error || "خطا"
  );

}


async function withdrawStatus(id,status){

  const res =
    await adminFetch(
      "/api/admin/withdrawal-status",
      {
        method:"POST",
        body:JSON.stringify({
          id,
          status
        })
      }
    );

  const data=await res.json();

  alert(
    data.message || data.error || "خطا"
  );

  adminPage("withdrawals");

}


if(token){

  document.getElementById("auth")
    .classList.add("hidden");

  document.getElementById("userPanel")
    .classList.remove("hidden");

  loadMe();

}


if(adminToken){

  document.getElementById("adminLogin")
    .classList.add("hidden");

  document.getElementById("adminPanel")
    .classList.remove("hidden");

  adminPage("stats");

}

</script>

</body>
</html>`;
