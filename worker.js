export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const JSON_HEADERS = {
      "content-type": "application/json; charset=UTF-8",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "Content-Type, Authorization"
    };

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: JSON_HEADERS
      });

    if (method === "OPTIONS") {
      return new Response(null, { headers: JSON_HEADERS });
    }

    if (!env.DB) {
      return json({
        ok: false,
        error: "D1 با نام DB به Worker متصل نیست."
      }, 500);
    }

    const body = async () => {
      try {
        return await request.json();
      } catch {
        return {};
      }
    };

    const clean = (v, max = 500) =>
      String(v ?? "").trim().slice(0, max);

    const hash = async (text) => {
      const data = new TextEncoder().encode(text);
      const h = await crypto.subtle.digest("SHA-256", data);
      return [...new Uint8Array(h)]
        .map(x => x.toString(16).padStart(2, "0"))
        .join("");
    };

    const randomToken = () => {
      const a = new Uint8Array(32);
      crypto.getRandomValues(a);
      return [...a]
        .map(x => x.toString(16).padStart(2, "0"))
        .join("");
    };

    async function initDB() {
      await env.DB.batch([
        env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            balance INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'active',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `),

        env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS transactions(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            amount INTEGER NOT NULL DEFAULT 0,
            description TEXT,
            status TEXT NOT NULL DEFAULT 'completed',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `),

        env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS withdrawals(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            amount INTEGER NOT NULL,
            method TEXT NOT NULL,
            destination TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `),

        env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS reset_codes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            code TEXT NOT NULL,
            expires_at INTEGER NOT NULL,
            used INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `),

        env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS payments(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            amount INTEGER NOT NULL,
            plan TEXT,
            authority TEXT,
            ref_id TEXT,
            status TEXT NOT NULL DEFAULT 'pending',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `)
      ]);
    }

    const sessions = globalThis.__AI_SESSIONS ||
      new Map();

    globalThis.__AI_SESSIONS = sessions;

    async function getUser() {
      const auth =
        request.headers.get("Authorization") || "";

      if (!auth.startsWith("Bearer ")) return null;

      const token = auth.slice(7);
      const id = sessions.get(token);

      if (!id) return null;

      return await env.DB.prepare(`
        SELECT id,name,email,balance,status,created_at
        FROM users
        WHERE id=?
        AND status='active'
      `).bind(id).first();
    }

    function adminOK() {
      const auth =
        request.headers.get("Authorization") || "";

      if (!auth.startsWith("Admin ")) return false;
      if (!env.ADMIN_PASSWORD) return false;

      return auth.slice(6) === env.ADMIN_PASSWORD;
    }

    try {
      await initDB();

      /* =========================
         HOME
      ========================= */

      if (path === "/" || path === "/index.html") {
        return new Response(HTML, {
          headers: {
            "content-type": "text/html; charset=UTF-8",
            "cache-control": "no-cache"
          }
        });
      }

      /* =========================
         REGISTER
      ========================= */

      if (path === "/api/register" && method === "POST") {
        const b = await body();

        const name = clean(b.name, 100);
        const email =
          clean(b.email, 150).toLowerCase();
        const password =
          String(b.password || "");

        if (!name || !email || !password) {
          return json({
            ok: false,
            error: "نام، ایمیل و رمز عبور الزامی است."
          }, 400);
        }

        if (!email.includes("@")) {
          return json({
            ok: false,
            error: "ایمیل معتبر وارد کنید."
          }, 400);
        }

        if (password.length < 6) {
          return json({
            ok: false,
            error: "رمز عبور حداقل ۶ کاراکتر باشد."
          }, 400);
        }

        const exists = await env.DB.prepare(
          "SELECT id FROM users WHERE email=?"
        ).bind(email).first();

        if (exists) {
          return json({
            ok: false,
            error: "این ایمیل قبلاً ثبت شده است."
          }, 409);
        }

        const passwordHash = await hash(password);

        const result = await env.DB.prepare(`
          INSERT INTO users
          (name,email,password_hash,balance,status)
          VALUES(?,?,?,?,?)
        `).bind(
          name,
          email,
          passwordHash,
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

        const email =
          clean(b.email, 150).toLowerCase();
        const password =
          String(b.password || "");

        const user = await env.DB.prepare(
          "SELECT * FROM users WHERE email=?"
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
            error: "حساب شما غیرفعال است."
          }, 403);
        }

        const passwordHash =
          await hash(password);

        if (passwordHash !== user.password_hash) {
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
            balance: Number(user.balance || 0)
          }
        });
      }

      /* =========================
         LOGOUT
      ========================= */

      if (path === "/api/logout" && method === "POST") {
        const auth =
          request.headers.get("Authorization") || "";

        if (auth.startsWith("Bearer ")) {
          sessions.delete(auth.slice(7));
        }

        return json({
          ok: true,
          message: "خروج انجام شد."
        });
      }

      /* =========================
         ME
      ========================= */

      if (path === "/api/me") {
        const user = await getUser();

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
            balance: Number(user.balance || 0),
            status: user.status,
            created_at: user.created_at
          }
        });
      }

      /* =========================
         PROFILE
      ========================= */

      if (path === "/api/profile" && method === "POST") {
        const user = await getUser();

        if (!user) {
          return json({
            ok: false,
            error: "ابتدا وارد شوید."
          }, 401);
        }

        const b = await body();
        const name = clean(b.name, 100);

        if (!name) {
          return json({
            ok: false,
            error: "نام معتبر نیست."
          }, 400);
        }

        await env.DB.prepare(
          "UPDATE users SET name=? WHERE id=?"
        ).bind(name, user.id).run();

        return json({
          ok: true,
          message: "پروفایل به‌روزرسانی شد."
        });
      }

      /* =========================
         TRANSACTIONS
      ========================= */

      if (path === "/api/transactions") {
        const user = await getUser();

        if (!user) {
          return json({
            ok: false,
            error: "دسترسی غیرمجاز."
          }, 401);
        }

        const rows = await env.DB.prepare(`
          SELECT *
          FROM transactions
          WHERE user_id=?
          ORDER BY id DESC
          LIMIT 200
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
        const user = await getUser();

        if (!user) {
          return json({
            ok: false,
            error: "ابتدا وارد حساب شوید."
          }, 401);
        }

        const b = await body();

        const amount =
          Math.floor(Number(b.amount || 0));

        const methodName =
          clean(b.method, 40);

        const destination =
          clean(b.destination, 250);

        if (!Number.isSafeInteger(amount) ||
            amount < 10000) {
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
            error: "روش و مقصد برداشت را وارد کنید."
          }, 400);
        }

        await env.DB.batch([
          env.DB.prepare(`
            UPDATE users
            SET balance=balance-?
            WHERE id=?
          `).bind(amount, user.id),

          env.DB.prepare(`
            INSERT INTO withdrawals
            (user_id,amount,method,destination,status)
            VALUES(?,?,?,?,?)
          `).bind(
            user.id,
            amount,
            methodName,
            destination,
            "pending"
          ),

          env.DB.prepare(`
            INSERT INTO transactions
            (user_id,type,amount,description,status)
            VALUES(?,?,?,?,?)
          `).bind(
            user.id,
            "withdrawal",
            amount,
            "درخواست برداشت",
            "pending"
          )
        ]);

        return json({
          ok: true,
          message: "درخواست برداشت ثبت شد."
        });
      }

      /* =========================
         FORGOT PASSWORD
      ========================= */

      if (
        path === "/api/forgot-password" &&
        method === "POST"
      ) {
        const b = await body();

        const email =
          clean(b.email, 150).toLowerCase();

        const user = await env.DB.prepare(
          "SELECT id FROM users WHERE email=?"
        ).bind(email).first();

        if (!user) {
          return json({
            ok: true,
            message:
              "اگر ایمیل وجود داشته باشد، کد ایجاد شد."
          });
        }

        const code =
          String(
            Math.floor(
              100000 + Math.random() * 900000
            )
          );

        const expires =
          Date.now() + 10 * 60 * 1000;

        await env.DB.prepare(`
          INSERT INTO reset_codes
          (user_id,code,expires_at,used)
          VALUES(?,?,?,0)
        `).bind(
          user.id,
          code,
          expires
        ).run();

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

      if (
        path === "/api/reset-password" &&
        method === "POST"
      ) {
        const b = await body();

        const email =
          clean(b.email, 150).toLowerCase();

        const code =
          clean(b.code, 20);

        const password =
          String(b.password || "");

        const user = await env.DB.prepare(
          "SELECT id FROM users WHERE email=?"
        ).bind(email).first();

        if (!user) {
          return json({
            ok: false,
            error: "کد معتبر نیست."
          }, 400);
        }

        const reset = await env.DB.prepare(`
          SELECT *
          FROM reset_codes
          WHERE user_id=?
          AND code=?
          AND used=0
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

        if (
          Date.now() >
          Number(reset.expires_at)
        ) {
          return json({
            ok: false,
            error: "کد منقضی شده است."
          }, 400);
        }

        if (password.length < 6) {
          return json({
            ok: false,
            error: "رمز جدید حداقل ۶ کاراکتر باشد."
          }, 400);
        }

        const passwordHash =
          await hash(password);

        await env.DB.batch([
          env.DB.prepare(`
            UPDATE users
            SET password_hash=?
            WHERE id=?
          `).bind(
            passwordHash,
            user.id
          ),

          env.DB.prepare(`
            UPDATE reset_codes
            SET used=1
            WHERE id=?
          `).bind(reset.id)
        ]);

        return json({
          ok: true,
          message: "رمز عبور تغییر کرد."
        });
      }

      /* =========================
         AI
      ========================= */

      if (path === "/api/ai" && method === "POST") {
        const user = await getUser();

        if (!user) {
          return json({
            ok: false,
            error: "برای استفاده از دستیار وارد شوید."
          }, 401);
        }

        const b = await body();
        const prompt = clean(b.prompt, 4000);

        if (!prompt) {
          return json({
            ok: false,
            error: "متن سؤال را وارد کنید."
          }, 400);
        }

        if (!env.AI) {
          return json({
            ok: false,
            error:
              "Workers AI به Worker متصل نیست."
          }, 503);
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",
          {
            messages: [
              {
                role: "system",
                content:
                  "شما یک دستیار هوش مصنوعی فارسی، دقیق، مفید و محترم هستید."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 800
          }
        );

        return json({
          ok: true,
          answer:
            result?.response ||
            result?.result?.response ||
            "پاسخی دریافت نشد."
        });
      }

      /* =========================
         PAYMENT - WAITING ZARINPAL
      ========================= */

      if (
        path === "/api/payment/start" &&
        method === "POST"
      ) {
        const user = await getUser();

        if (!user) {
          return json({
            ok: false,
            error: "ابتدا وارد حساب شوید."
          }, 401);
        }

        const b = await body();

        const amount =
          Math.floor(Number(b.amount || 0));

        const plan =
          clean(b.plan, 100);

        if (
          !Number.isSafeInteger(amount) ||
          amount < 400000
        ) {
          return json({
            ok: false,
            error:
              "حداقل مبلغ پلن ۴۰۰٬۰۰۰ تومان است."
          }, 400);
        }

        await env.DB.prepare(`
          INSERT INTO payments
          (user_id,amount,plan,status)
          VALUES(?,?,?,'pending')
        `).bind(
          user.id,
          amount,
          plan
        ).run();

        return json({
          ok: false,
          pending: true,
          message:
            "درگاه زرین‌پال هنوز فعال نشده است. بعد از تأیید حساب، پرداخت واقعی متصل می‌شود."
        }, 503);
      }

      /* =========================
         ADMIN LOGIN
      ========================= */

      if (
        path === "/api/admin/login" &&
        method === "POST"
      ) {
        const b = await body();

        if (!env.ADMIN_PASSWORD) {
          return json({
            ok: false,
            error:
              "ADMIN_PASSWORD در Worker تنظیم نشده است."
          }, 500);
        }

        if (
          String(b.password || "") !==
          env.ADMIN_PASSWORD
        ) {
          return json({
            ok: false,
            error: "رمز مدیریت اشتباه است."
          }, 401);
        }

        return json({
          ok: true,
          admin_token: env.ADMIN_PASSWORD
        });
      }

      /* =========================
         ADMIN USERS
      ========================= */

      if (
        path === "/api/admin/users" &&
        method === "GET"
      ) {
        if (!adminOK()) {
          return json({
            ok: false,
            error: "دسترسی غیرمجاز."
          }, 403);
        }

        const rows = await env.DB.prepare(`
          SELECT id,name,email,balance,status,created_at
          FROM users
          ORDER BY id DESC
        `).all();

        return json({
          ok: true,
          users: rows.results || []
        });
      }

      /* =========================
         ADMIN USER STATUS
      ========================= */

      if (
        path === "/api/admin/user-status" &&
        method === "POST"
      ) {
        if (!adminOK()) {
          return json({
            ok: false,
            error: "دسترسی غیرمجاز."
          }, 403);
        }

        const b = await body();

        const id =
          Number(b.user_id || 0);

        const status =
          clean(b.status, 20);

        if (
          !id ||
          !["active", "blocked"].includes(status)
        ) {
          return json({
            ok: false,
            error: "اطلاعات نامعتبر."
          }, 400);
        }

        await env.DB.prepare(
          "UPDATE users SET status=? WHERE id=?"
        ).bind(status, id).run();

        return json({
          ok: true,
          message: "وضعیت کاربر تغییر کرد."
        });
      }

      /* =========================
         ADMIN BALANCE
      ========================= */

      if (
        path === "/api/admin/balance" &&
        method === "POST"
      ) {
        if (!adminOK()) {
          return json({
            ok: false,
            error: "دسترسی غیرمجاز."
          }, 403);
        }

        const b = await body();

        const id =
          Number(b.user_id || 0);

        const amount =
          Math.floor(Number(b.amount || 0));

        const description =
          clean(b.description, 200) ||
          "تغییر موجودی توسط مدیریت";

        if (!id || !Number.isSafeInteger(amount) ||
            amount === 0) {
          return json({
            ok: false,
            error: "کاربر یا مبلغ نامعتبر."
          }, 400);
        }

        const user = await env.DB.prepare(
          "SELECT id,balance FROM users WHERE id=?"
        ).bind(id).first();

        if (!user) {
          return json({
            ok: false,
            error: "کاربر پیدا نشد."
          }, 404);
        }

        if (
          amount < 0 &&
          Math.abs(amount) >
          Number(user.balance || 0)
        ) {
          return json({
            ok: false,
            error: "موجودی کافی نیست."
          }, 400);
        }

        const type =
          amount > 0 ? "income" : "adjustment";

        const value =
          Math.abs(amount);

        await env.DB.batch([
          env.DB.prepare(
            amount > 0
              ? "UPDATE users SET balance=balance+? WHERE id=?"
              : "UPDATE users SET balance=balance-? WHERE id=?"
          ).bind(value, id),

          env.DB.prepare(`
            INSERT INTO transactions
            (user_id,type,amount,description,status)
            VALUES(?,?,?,?,?)
          `).bind(
            id,
            type,
            value,
            description,
            "completed"
          )
        ]);

        return json({
          ok: true,
          message: "موجودی تغییر کرد."
        });
      }

      /* =========================
         ADMIN PAYMENTS
      ========================= */

      if (
        path === "/api/admin/payments" &&
        method === "GET"
      ) {
        if (!adminOK()) {
          return json({
            ok: false,
            error: "دسترسی غیرمجاز."
          }, 403);
        }

        const rows = await env.DB.prepare(`
          SELECT
            p.*,
            u.name,
            u.email
          FROM payments p
          LEFT JOIN users u
          ON u.id=p.user_id
          ORDER BY p.id DESC
        `).all();

        return json({
          ok: true,
          payments: rows.results || []
        });
      }

      /* =========================
         ADMIN WITHDRAWALS
      ========================= */

      if (
        path === "/api/admin/withdrawals" &&
        method === "GET"
      ) {
        if (!adminOK()) {
          return json({
            ok: false,
            error: "دسترسی غیرمجاز."
          }, 403);
        }

        const rows = await env.DB.prepare(`
          SELECT
            w.*,
            u.name,
            u.email
          FROM withdrawals w
          LEFT JOIN users u
          ON u.id=w.user_id
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

      if (
        path === "/api/admin/withdrawal-status" &&
        method === "POST"
      ) {
        if (!adminOK()) {
          return json({
            ok: false,
            error: "دسترسی غیرمجاز."
          }, 403);
        }

        const b = await body();

        const id = Number(b.id || 0);
        const status = clean(b.status, 20);

        if (
          !id ||
          !["approved", "rejected"].includes(status)
        ) {
          return json({
            ok: false,
            error: "اطلاعات نامعتبر."
          }, 400);
        }

        const w = await env.DB.prepare(
          "SELECT * FROM withdrawals WHERE id=?"
        ).bind(id).first();

        if (!w) {
          return json({
            ok: false,
            error: "درخواست پیدا نشد."
          }, 404);
        }

        if (w.status !== "pending") {
          return json({
            ok: false,
            error: "این درخواست قبلاً بررسی شده."
          }, 400);
        }

        if (status === "approved") {
          await env.DB.batch([
            env.DB.prepare(
              "UPDATE withdrawals SET status='approved' WHERE id=?"
            ).bind(id),

            env.DB.prepare(`
              UPDATE transactions
              SET status='completed'
              WHERE user_id=?
              AND type='withdrawal'
              AND amount=?
              AND status='pending'
            `).bind(w.user_id, w.amount)
          ]);
        } else {
          await env.DB.batch([
            env.DB.prepare(
              "UPDATE withdrawals SET status='rejected' WHERE id=?"
            ).bind(id),

            env.DB.prepare(
              "UPDATE users SET balance=balance+? WHERE id=?"
            ).bind(w.amount, w.user_id),

            env.DB.prepare(`
              UPDATE transactions
              SET status='rejected'
              WHERE user_id=?
              AND type='withdrawal'
              AND amount=?
              AND status='pending'
            `).bind(w.user_id, w.amount)
          ]);
        }

        return json({
          ok: true,
          message: "وضعیت برداشت تغییر کرد."
        });
      }

      /* =========================
         ADMIN STATS
      ========================= */

      if (
        path === "/api/admin/stats" &&
        method === "GET"
      ) {
        if (!adminOK()) {
          return json({
            ok: false,
            error: "دسترسی غیرمجاز."
          }, 403);
        }

        const users = await env.DB.prepare(
          "SELECT COUNT(*) count FROM users"
        ).first();

        const balance = await env.DB.prepare(
          "SELECT COALESCE(SUM(balance),0) total FROM users"
        ).first();

        const income = await env.DB.prepare(`
          SELECT COALESCE(SUM(amount),0) total
          FROM transactions
          WHERE type='income'
          AND status='completed'
        `).first();

        const payments = await env.DB.prepare(`
          SELECT COALESCE(SUM(amount),0) total
          FROM payments
          WHERE status='paid'
        `).first();

        const withdrawals = await env.DB.prepare(`
          SELECT COALESCE(SUM(amount),0) total
          FROM withdrawals
          WHERE status='approved'
        `).first();

        const pending = await env.DB.prepare(`
          SELECT COUNT(*) count
          FROM withdrawals
          WHERE status='pending'
        `).first();

        return json({
          ok: true,
          stats: {
            users: Number(users?.count || 0),
            balance: Number(balance?.total || 0),
            income: Number(income?.total || 0),
            payments: Number(payments?.total || 0),
            withdrawals:
              Number(withdrawals?.total || 0),
            pending:
              Number(pending?.count || 0)
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

<meta name="viewport"
content="width=device-width,initial-scale=1">

<title>دستیار هوش مصنوعی | ابزارک</title>

<meta name="description"
content="دستیار هوش مصنوعی، حساب کاربری، ابزارهای کاربردی، درآمد و مدیریت حساب">

<meta name="robots"
content="index,follow">

<style>

*{
 box-sizing:border-box;
}

html{
 scroll-behavior:smooth;
}

body{
 margin:0;
 font-family:
 Tahoma,
 Arial,
 sans-serif;
 background:
 linear-gradient(
  135deg,
  #eef4ff,
  #f8fafc
 );
 color:#172033;
}

button,
input,
select,
textarea{
 font-family:inherit;
}

button{
 cursor:pointer;
}

.top{
 background:
 linear-gradient(
  135deg,
  #111827,
  #2563eb,
  #7c3aed
 );
 color:white;
 padding:35px 16px;
 text-align:center;
}

.logo{
 font-size:42px;
 margin-bottom:8px;
}

.top h1{
 margin:0;
 font-size:30px;
}

.top p{
 margin:10px 0 0;
 opacity:.9;
}

.container{
 max-width:1150px;
 margin:25px auto;
 padding:0 14px;
}

.card{
 background:#fff;
 border-radius:22px;
 padding:22px;
 margin-bottom:18px;
 box-shadow:
  0 12px 35px
  rgba(15,23,42,.08);
 border:1px solid #edf1f7;
}

.hero{
 text-align:center;
 padding:35px 20px;
}

.hero h2{
 font-size:28px;
 margin:8px 0;
}

.hero p{
 color:#64748b;
 line-height:1.9;
}

.grid{
 display:grid;
 grid-template-columns:
 repeat(auto-fit,minmax(210px,1fr));
 gap:14px;
}

.two{
 display:grid;
 grid-template-columns:
 repeat(auto-fit,minmax(300px,1fr));
 gap:18px;
}

input,
select,
textarea{
 width:100%;
 padding:14px;
 margin:6px 0;
 border-radius:13px;
 border:1px solid #dbe2ea;
 outline:none;
 background:#fff;
}

textarea{
 min-height:120px;
 resize:vertical;
}

input:focus,
select:focus,
textarea:focus{
 border-color:#2563eb;
 box-shadow:
 0 0 0 3px rgba(37,99,235,.1);
}

button{
 width:100%;
 padding:14px;
 border:0;
 border-radius:13px;
 background:#2563eb;
 color:white;
 font-weight:bold;
 margin:5px 0;
 transition:.2s;
}

button:hover{
 transform:translateY(-1px);
 opacity:.94;
}

.primary{
 background:#2563eb;
}

.green{
 background:#16a34a;
}

.red{
 background:#dc2626;
}

.gray{
 background:#475569;
}

.purple{
 background:#7c3aed;
}

.orange{
 background:#ea580c;
}

.hidden{
 display:none!important;
}

.msg{
 margin-top:10px;
 padding:13px;
 border-radius:13px;
 background:#eff6ff;
 color:#1e3a8a;
 line-height:1.8;
}

.stat{
 background:
 linear-gradient(
  135deg,
  #f8fafc,
  #eef4ff
 );
 border:1px solid #e2e8f0;
 border-radius:17px;
 padding:20px;
}

.stat .icon{
 font-size:27px;
}

.stat b{
 display:block;
 margin-top:9px;
 font-size:23px;
}

.balance{
 color:#16a34a!important;
}

.nav{
 display:grid;
 grid-template-columns:
 repeat(auto-fit,minmax(130px,1fr));
 gap:8px;
}

.nav button{
 background:#334155;
}

.plan{
 position:relative;
 padding:22px;
 border:2px solid #e2e8f0;
 border-radius:20px;
 text-align:center;
 background:white;
 transition:.2s;
}

.plan:hover{
 transform:translateY(-4px);
 box-shadow:
 0 12px 30px
 rgba(37,99,235,.12);
}

.plan.featured{
 border-color:#2563eb;
}

.badge{
 display:inline-block;
 padding:6px 10px;
 border-radius:20px;
 background:#dbeafe;
 color:#1d4ed8;
 font-size:12px;
 margin-bottom:10px;
}

.price{
 font-size:25px;
 font-weight:bold;
 margin:12px 0;
 color:#111827;
}

.feature{
 color:#64748b;
 font-size:13px;
 line-height:2;
}

.aiBox{
 background:
 linear-gradient(
  135deg,
  #f8faff,
  #eef2ff
 );
 border-radius:18px;
 padding:16px;
 min-height:120px;
 margin-bottom:10px;
 white-space:pre-wrap;
 line-height:2;
}

.chat{
 max-height:430px;
 overflow:auto;
 padding:5px;
}

.userMsg,
.aiMsg{
 padding:13px 16px;
 border-radius:16px;
 margin:8px 0;
 line-height:1.9;
}

.userMsg{
 background:#dbeafe;
 margin-left:20%;
}

.aiMsg{
 background:#f1f5f9;
 margin-right:20%;
}

table{
 width:100%;
 border-collapse:collapse;
 min-width:650px;
}

.tableWrap{
 overflow:auto;
}

th,
td{
 padding:12px;
 border-bottom:1px solid #e5e7eb;
 text-align:right;
}

th{
 background:#f8fafc;
}

.small{
 color:#64748b;
 font-size:13px;
 line-height:1.8;
}

.sectionTitle{
 display:flex;
 justify-content:space-between;
 align-items:center;
 gap:10px;
 flex-wrap:wrap;
}

footer{
 text-align:center;
 padding:30px 15px;
 color:#64748b;
}

.link{
 color:#2563eb;
 cursor:pointer;
 font-weight:bold;
}

.notice{
 background:#fff7ed;
 color:#9a3412;
 border:1px solid #fed7aa;
 padding:14px;
 border-radius:14px;
 line-height:1.9;
}

.successBox{
 background:#f0fdf4;
 color:#166534;
 border:1px solid #bbf7d0;
 padding:14px;
 border-radius:14px;
}

@media(max-width:600px){

 .top{
  padding:25px 12px;
 }

 .top h1{
  font-size:24px;
 }

 .logo{
  font-size:35px;
 }

 .card{
  padding:16px;
  border-radius:18px;
 }

 .userMsg{
  margin-left:5%;
 }

 .aiMsg{
  margin-right:5%;
 }

}

</style>
</head>

<body>

<header class="top">

<div class="logo">🤖</div>

<h1>دستیار هوش مصنوعی</h1>

<p>
دستیار هوشمند • ابزارهای کاربردی • حساب کاربری • درآمد
</p>

</header>


<div class="container">


<!-- HOME -->

<section class="card hero">

<h2>
✨ به دستیار هوش مصنوعی خوش آمدید
</h2>

<p>
یک محیط ساده و حرفه‌ای برای استفاده از
هوش مصنوعی، مدیریت حساب، تراکنش‌ها
و امکانات کاربردی.
</p>

<div class="grid">

<button onclick="showAuth()">
👤 ورود / ثبت‌نام
</button>

<button class="purple"
onclick="showPlans()">
💳 مشاهده پلن‌ها
</button>

<button class="gray"
onclick="showAbout()">
ℹ️ درباره سیستم
</button>

</div>

</section>


<!-- AUTH -->

<section id="auth" class="card">

<h2>👤 حساب کاربری</h2>

<input
id="name"
placeholder="نام کامل">

<input
id="email"
type="email"
placeholder="ایمیل">

<input
id="password"
type="password"
placeholder="رمز عبور">

<div class="grid">

<button onclick="register()">
📝 ثبت‌نام
</button>

<button onclick="login()">
🔐 ورود
</button>

</div>

<button
class="gray"
onclick="showForgot()">
🔑 فراموشی رمز
</button>

<div id="authMsg"></div>

</section>


<!-- FORGOT -->

<section id="forgot"
class="card hidden">

<h2>🔑 بازیابی رمز عبور</h2>

<input
id="forgotEmail"
type="email"
placeholder="ایمیل حساب">

<button onclick="forgotPassword()">
📧 دریافت کد
</button>

<input
id="resetCode"
placeholder="کد ۶ رقمی">

<input
id="newPassword"
type="password"
placeholder="رمز جدید">

<button
class="green"
onclick="resetPassword()">
🔐 تغییر رمز
</button>

<button
class="gray"
onclick="hideForgot()">
↩️ بازگشت
</button>

<div id="forgotMsg"></div>

</section>


<!-- USER -->

<section id="userPanel"
class="hidden">


<!-- USER HEADER -->

<section class="card">

<div class="sectionTitle">

<div>
<h2>👋 سلام <span id="userName">کاربر</span></h2>
<div class="small" id="userEmail">-</div>
</div>

<button
class="red"
style="max-width:130px"
onclick="logout()">
🚪 خروج
</button>

</div>

</section>


<!-- STATS -->

<section class="card">

<h2>📊 داشبورد من</h2>

<div class="grid">

<div class="stat">
<div class="icon">💰</div>
موجودی
<b class="balance" id="balance">
۰ تومان
</b>
</div>

<div class="stat">
<div class="icon">🧾</div>
تراکنش‌ها
<b id="transactionCount">
۰
</b>
</div>

<div class="stat">
<div class="icon">💸</div>
برداشت
<b id="withdrawCount">
۰
</b>
</div>

<div class="stat">
<div class="icon">🤖</div>
دستیار
<b>فعال</b>
</div>

</div>

</section>


<!-- AI -->

<section class="card">

<h2>🤖 دستیار هوش مصنوعی</h2>

<div id="chat"
class="chat">

<div class="aiMsg">
سلام 👋
من دستیار هوش مصنوعی شما هستم.
سؤالتان را بنویسید.
</div>

</div>

<textarea
id="aiPrompt"
placeholder="مثلاً: برای من یک متن تبلیغاتی بنویس..."></textarea>

<div class="grid">

<button onclick="askAI()">
✨ ارسال سؤال
</button>

<button
class="gray"
onclick="clearChat()">
🗑️ پاک کردن گفتگو
</button>

</div>

<div id="aiMsg"></div>

</section>


<!-- PLANS -->

<section id="plans"
class="card">

<h2>💳 پلن‌های استفاده</h2>

<div class="notice">
درگاه پرداخت فعلاً منتظر تأیید زرین‌پال است.
بعد از تأیید، پرداخت واقعی از همین قسمت فعال می‌شود.
</div>

<br>

<div class="grid">


<div class="plan">

<div class="badge">
شروع
</div>

<h3>
پلن شروع
</h3>

<div class="price">
۴۰۰٬۰۰۰ تومان
</div>

<div class="feature">
✓ دسترسی به امکانات پایه<br>
✓ حساب کاربری<br>
✓ پشتیبانی سیستم
</div>

<button
onclick="pay(400000,'پلن شروع')">
انتخاب پلن
</button>

</div>


<div class="plan featured">

<div class="badge">
محبوب
</div>

<h3>
پلن حرفه‌ای
</h3>

<div class="price">
۷۰۰٬۰۰۰ تومان
</div>

<div class="feature">
✓ امکانات بیشتر<br>
✓ دسترسی حرفه‌ای<br>
✓ اولویت استفاده
</div>

<button
class="purple"
onclick="pay(700000,'پلن حرفه‌ای')">
انتخاب پلن
</button>

</div>


<div class="plan">

<div class="badge">
ویژه
</div>

<h3>
پلن ویژه
</h3>

<div class="price">
۱٬۰۰۰٬۰۰۰ تومان
</div>

<div class="feature">
✓ امکانات کامل<br>
✓ سطح ویژه<br>
✓ اولویت بالا
</div>

<button
class="orange"
onclick="pay(1000000,'پلن ویژه')">
انتخاب پلن
</button>

</div>


<div class="plan">

<div class="badge">
پیشرفته
</div>

<h3>
پلن پیشرفته
</h3>

<div class="price">
۲٬۰۰۰٬۰۰۰ تومان
</div>

<div class="feature">
✓ امکانات پیشرفته<br>
✓ استفاده گسترده<br>
✓ خدمات ویژه
</div>

<button
onclick="pay(2000000,'پلن پیشرفته')">
انتخاب پلن
</button>

</div>

</div>

<div id="paymentMsg"></div>

</section>


<!-- PROFILE -->

<section class="card">

<h2>👤 پروفایل من</h2>

<input
id="profileName"
placeholder="نام جدید">

<button
onclick="updateProfile()">
💾 ذخیره اطلاعات
</button>

<div id="profileMsg"></div>

</section>


<!-- WITHDRAW -->

<section class="card">

<h2>💸 درخواست برداشت</h2>

<div class="small">
حداقل برداشت: ۱۰٬۰۰۰ تومان
</div>

<input
id="withdrawAmount"
type="number"
placeholder="مبلغ برداشت">

<select id="withdrawMethod">

<option value="">
انتخاب روش برداشت
</option>

<option value="bank">
🏦 حساب بانکی
</option>

<option value="card">
💳 کارت بانکی
</option>

<option value="wallet">
👛 کیف پول
</option>

</select>

<input
id="withdrawDestination"
placeholder="شماره کارت / حساب / آدرس کیف پول">

<button
class="green"
onclick="withdraw()">
💵 ثبت درخواست
</button>

<div id="withdrawMsg"></div>

</section>


<!-- TRANSACTIONS -->

<section class="card">

<div class="sectionTitle">

<h2>🧾 تراکنش‌های من</h2>

<button
style="max-width:150px"
onclick="loadTransactions()">
🔄 بروزرسانی
</button>

</div>

<div
id="transactions"
class="tableWrap">
</div>

</section>


<!-- INFO -->

<section class="card">

<h2>🔔 پیام سیستم</h2>

<div class="successBox">
حساب کاربری شما فعال است.
درگاه پرداخت پس از تأیید اطلاعات زرین‌پال
به سیستم اضافه خواهد شد.
</div>

</section>

</section>


<!-- ADMIN LOGIN -->

<section id="adminLogin"
class="card">

<h2>🛠️ مدیریت سیستم</h2>

<p class="small">
ورود مخصوص مدیر سیستم
</p>

<input
id="adminPassword"
type="password"
placeholder="رمز مدیریت">

<button
class="gray"
onclick="adminLogin()">
🔐 ورود مدیریت
</button>

<div id="adminMsg"></div>

</section>


<!-- ADMIN -->

<section id="adminPanel"
class="hidden">

<section class="card">

<div class="sectionTitle">

<h2>🛠️ پنل مدیریت</h2>

<button
class="red"
style="max-width:130px"
onclick="adminLogout()">
🚪 خروج
</button>

</div>

<div class="nav">

<button onclick="adminPage('stats')">
📊 آمار
</button>

<button onclick="adminPage('users')">
👥 کاربران
</button>

<button onclick="adminPage('balance')">
💰 موجودی
</button>

<button onclick="adminPage('payments')">
💳 پرداخت‌ها
</button>

<button onclick="adminPage('withdrawals')">
💸 برداشت‌ها
</button>

</div>

<div
id="adminContent"
style="margin-top:18px">
</div>

</section>

</section>


<!-- ABOUT -->

<section
id="about"
class="card hidden">

<h2>ℹ️ درباره سیستم</h2>

<p class="small">
دستیار هوش مصنوعی یک سیستم آنلاین برای
استفاده از ابزارهای هوشمند، مدیریت حساب،
تراکنش و امکانات مالی است.
</p>

<h3>🔐 امنیت</h3>

<p class="small">
اطلاعات حساب کاربران در پایگاه داده D1 ذخیره می‌شود.
</p>

<h3>💳 پرداخت</h3>

<p class="small">
اتصال پرداخت واقعی پس از تأیید درگاه انجام می‌شود.
</p>

</section>


</div>


<footer>
© ۲۰۲۶ — دستیار هوش مصنوعی
</footer>


<script>

let token =
localStorage.getItem("user_token") || "";

let adminToken =
localStorage.getItem("admin_token") || "";


function el(id){
 return document.getElementById(id);
}


function msg(id,text){
 const x=el(id);
 if(x){
  x.innerHTML=
   '<div class="msg">'+text+'</div>';
 }
}


async function api(url,options={}){

 options.headers={
  ...(options.headers||{}),
  "Content-Type":"application/json"
 };

 if(token){
  options.headers.Authorization=
   "Bearer "+token;
 }

 const r=
  await fetch(url,options);

 return r;
}


/* =========================
   AUTH
========================= */

async function register(){

 const r=await api(
  "/api/register",
  {
   method:"POST",
   body:JSON.stringify({
    name:el("name").value,
    email:el("email").value,
    password:el("password").value
   })
  }
 );

 const d=await r.json();

 msg(
  "authMsg",
  d.message||d.error||"خطا"
 );

 if(d.ok){
  el("password").value="";
 }
}


async function login(){

 const r=await api(
  "/api/login",
  {
   method:"POST",
   body:JSON.stringify({
    email:el("email").value,
    password:el("password").value
   })
  }
 );

 const d=await r.json();

 if(!d.ok){
  msg("authMsg",d.error||"خطا");
  return;
 }

 token=d.token;

 localStorage.setItem(
  "user_token",
  token
 );

 el("auth").classList.add("hidden");

 el("userPanel")
  .classList.remove("hidden");

 loadMe();
 loadTransactions();
}


async function loadMe(){

 const r=await api("/api/me");
 const d=await r.json();

 if(!d.ok){
  logout();
  return;
 }

 el("userName").textContent=
  d.user.name;

 el("userEmail").textContent=
  d.user.email;

 el("balance").textContent=
  Number(d.user.balance)
   .toLocaleString("fa-IR")
  +" تومان";

 el("profileName").value=
  d.user.name;
}


async function logout(){

 if(token){
  await api(
   "/api/logout",
   {method:"POST"}
  ).catch(()=>{});
 }

 token="";

 localStorage.removeItem(
  "user_token"
 );

 el("userPanel")
  .classList.add("hidden");

 el("auth")
  .classList.remove("hidden");
}


function showAuth(){
 el("auth").classList.remove("hidden");
 el("auth").scrollIntoView();
}


function showForgot(){
 el("auth").classList.add("hidden");
 el("forgot").classList.remove("hidden");
}


function hideForgot(){
 el("forgot").classList.add("hidden");
 el("auth").classList.remove("hidden");
}


async function forgotPassword(){

 const r=await api(
  "/api/forgot-password",
  {
   method:"POST",
   body:JSON.stringify({
    email:el("forgotEmail").value
   })
  }
 );

 const d=await r.json();

 let text=
  d.message||d.error||"خطا";

 if(d.development_code){
  text+=
   "<br><b>کد آزمایشی:</b> "+
   d.development_code;
 }

 msg("forgotMsg",text);
}


async function resetPassword(){

 const r=await api(
  "/api/reset-password",
  {
   method:"POST",
   body:JSON.stringify({
    email:el("forgotEmail").value,
    code:el("resetCode").value,
    password:el("newPassword").value
   })
  }
 );

 const d=await r.json();

 msg(
  "forgotMsg",
  d.message||d.error||"خطا"
 );
}


/* =========================
   PROFILE
========================= */

async function updateProfile(){

 const r=await api(
  "/api/profile",
  {
   method:"POST",
   body:JSON.stringify({
    name:el("profileName").value
   })
  }
 );

 const d=await r.json();

 msg(
  "profileMsg",
  d.message||d.error||"خطا"
 );

 if(d.ok){
  loadMe();
 }
}


/* =========================
   AI
========================= */

async function askAI(){

 const prompt=
  el("aiPrompt").value.trim();

 if(!prompt){
  msg(
   "aiMsg",
   "سؤال خود را وارد کنید."
  );
  return;
 }

 const chat=el("chat");

 chat.innerHTML+=
  '<div class="userMsg">'+
  escapeHTML(prompt)+
  '</div>';

 el("aiPrompt").value="";

 msg(
  "aiMsg",
  "⏳ در حال دریافت پاسخ..."
 );

 try{

  const r=await api(
   "/api/ai",
   {
    method:"POST",
    body:JSON.stringify({
     prompt
    })
   }
  );

  const d=await r.json();

  if(!d.ok){

   msg(
    "aiMsg",
    d.error||"خطا در اتصال به هوش مصنوعی."
   );

   return;
  }

  chat.innerHTML+=
   '<div class="aiMsg">'+
   escapeHTML(d.answer)+
   '</div>';

  el("aiMsg").innerHTML="";

  chat.scrollTop=
   chat.scrollHeight;

 }catch(e){

  msg(
   "aiMsg",
   "خطا در اتصال به سرور."
  );
 }
}


function clearChat(){

 el("chat").innerHTML=
  '<div class="aiMsg">'+
  'گفتگو پاک شد. دوباره سؤال خود را بنویسید.'+
  '</div>';
}


function escapeHTML(value){

 return String(value)
  .replace(/&/g,"&amp;")
  .replace(/</g,"&lt;")
  .replace(/>/g,"&gt;")
  .replace(/"/g,"&quot;")
  .replace(/'/g,"&#039;");
}


/* =========================
   PLANS
========================= */

function showPlans(){

 el("plans")
  .scrollIntoView({
   behavior:"smooth"
  });
}


async function pay(amount,plan){

 if(!token){
  msg(
   "paymentMsg",
   "ابتدا وارد حساب شوید."
  );
  showAuth();
  return;
 }

 const r=await api(
  "/api/payment/start",
  {
   method:"POST",
   body:JSON.stringify({
    amount,
    plan
   })
  }
 );

 const d=await r.json();

 msg(
  "paymentMsg",
  d.message||d.error||
  "پرداخت در انتظار اتصال درگاه است."
 );
}


/* =========================
   WITHDRAW
========================= */

async function withdraw(){

 const amount=
  Number(el("withdrawAmount").value);

 const method=
  el("withdrawMethod").value;

 const destination=
  el("withdrawDestination").value;

 const r=await api(
  "/api/withdraw",
  {
   method:"POST",
   body:JSON.stringify({
    amount,
    method,
    destination
   })
  }
 );

 const d=await r.json();

 msg(
  "withdrawMsg",
  d.message||d.error||"خطا"
 );

 if(d.ok){
  loadMe();
  loadTransactions();
 }
}


/* =========================
   TRANSACTIONS
========================= */

async function loadTransactions(){

 const r=
  await api("/api/transactions");

 const d=await r.json();

 if(!d.ok)return;

 const list=
  d.transactions||[];

 el("transactionCount")
  .textContent=
  list.length.toLocaleString("fa-IR");

 const withdrawals=
  list.filter(
   x=>x.type==="withdrawal"
  );

 el("withdrawCount")
  .textContent=
  withdrawals.length
   .toLocaleString("fa-IR");

 if(!list.length){

  el("transactions").innerHTML=
   '<div class="msg">'+
   'هنوز تراکنشی ثبت نشده است.'+
   '</div>';

  return;
 }

 let html=
  '<table>'+
  '<tr>'+
  '<th>نوع</th>'+
  '<th>مبلغ</th>'+
  '<th>وضعیت</th>'+
  '<th>توضیح</th>'+
  '<th>تاریخ</th>'+
  '</tr>';

 for(const x of list){

  html+=
   '<tr>'+
   '<td>'+escapeHTML(x.type)+'</td>'+
   '<td>'+
   Number(x.amount)
    .toLocaleString("fa-IR")+
   ' تومان</td>'+
   '<td>'+
   escapeHTML(x.status)+
   '</td>'+
   '<td>'+
   escapeHTML(x.description||"-")+
   '</td>'+
   '<td>'+
   escapeHTML(x.created_at||"-")+
   '</td>'+
   '</tr>';
 }

 html+='</table>';

 el("transactions")
  .innerHTML=html;
}


/* =========================
   ADMIN
========================= */

async function adminLogin(){

 const password=
  el("adminPassword").value;

 const r=await fetch(
  "/api/admin/login",
  {
   method:"POST",
   headers:{
    "Content-Type":
     "application/json"
   },
   body:JSON.stringify({
    password
   })
  }
 );

 const d=await r.json();

 if(!d.ok){

  msg(
   "adminMsg",
   d.error||"خطا"
  );

  return;
 }

 adminToken=
  d.admin_token;

 localStorage.setItem(
  "admin_token",
  adminToken
 );

 el("adminLogin")
  .classList.add("hidden");

 el("adminPanel")
  .classList.remove("hidden");

 adminPage("stats");
}


function adminLogout(){

 adminToken="";

 localStorage.removeItem(
  "admin_token"
 );

 el("adminPanel")
  .classList.add("hidden");

 el("adminLogin")
  .classList.remove("hidden");
}


async function adminFetch(
 url,
 options={}
){

 options.headers={
  ...(options.headers||{}),
  "Content-Type":
   "application/json",
  "Authorization":
   "Admin "+adminToken
 };

 return fetch(url,options);
}


async function adminPage(page){

 const box=
  el("adminContent");

 box.innerHTML=
  '<div class="msg">⏳ در حال دریافت...</div>';


 if(page==="stats"){

  const r=
   await adminFetch(
    "/api/admin/stats"
   );

  const d=await r.json();

  if(!d.ok){
   box.innerHTML=
    '<div class="msg">'+
    escapeHTML(d.error)+
    '</div>';
   return;
  }

  const s=d.stats;

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
     💳 پرداخت‌ها
     <b>${s.payments.toLocaleString("fa-IR")} تومان</b>
    </div>

    <div class="stat">
     💸 برداشت تأییدشده
     <b>${s.withdrawals.toLocaleString("fa-IR")} تومان</b>
    </div>

    <div class="stat">
     ⏳ برداشت در انتظار
     <b>${s.pending.toLocaleString("fa-IR")}</b>
    </div>

   </div>
  `;

  return;
 }


 if(page==="users"){

  const r=
   await adminFetch(
    "/api/admin/users"
   );

  const d=await r.json();

  if(!d.ok){
   box.innerHTML=
    '<div class="msg">'+
    escapeHTML(d.error)+
    '</div>';
   return;
  }

  let html=
   '<h3>👥 کاربران</h3>'+
   '<div class="tableWrap">'+
   '<table>'+
   '<tr>'+
   '<th>ID</th>'+
   '<th>نام</th>'+
   '<th>ایمیل</th>'+
   '<th>موجودی</th>'+
   '<th>وضعیت</th>'+
   '<th>عملیات</th>'+
   '</tr>';

  for(const u of d.users){

   html+=
    '<tr>'+
    '<td>'+u.id+'</td>'+
    '<td>'+escapeHTML(u.name)+'</td>'+
    '<td>'+escapeHTML(u.email)+'</td>'+
    '<td>'+
    Number(u.balance)
     .toLocaleString("fa-IR")+
    ' تومان</td>'+
    '<td>'+escapeHTML(u.status)+'</td>'+
    '<td>'+
    '<button onclick="changeUserStatus('+
    u.id+',\''+
    (u.status==="active"
     ?"blocked"
     :"active")+
    '\')">'+
    (u.status==="active"
     ?"🚫 غیرفعال"
     :"✅ فعال")+
    '</button>'+
    '</td>'+
    '</tr>';
  }

  html+='</table></div>';

  box.innerHTML=html;

  return;
 }


 if(page==="balance"){

  box.innerHTML=`

   <h3>💰 مدیریت موجودی</h3>

   <input
    id="adminUserId"
    type="number"
    placeholder="شناسه کاربر">

   <input
    id="adminAmount"
    type="number"
    placeholder="مبلغ؛ مثبت افزایش، منفی کاهش">

   <input
    id="adminDescription"
    placeholder="توضیح">

   <button
    class="green"
    onclick="changeBalance()">
    💰 ثبت تغییر موجودی
   </button>

   <div id="balanceAdminMsg"></div>
  `;

  return;
 }


 if(page==="payments"){

  const r=
   await adminFetch(
    "/api/admin/payments"
   );

  const d=await r.json();

  if(!d.ok){
   box.innerHTML=
    '<div class="msg">'+
    escapeHTML(d.error)+
    '</div>';
   return;
  }

  let html=
   '<h3>💳 پرداخت‌ها</h3>'+
   '<div class="tableWrap">'+
   '<table>'+
   '<tr>'+
   '<th>کاربر</th>'+
   '<th>ایمیل</th>'+
   '<th>مبلغ</th>'+
   '<th>پلن</th>'+
   '<th>وضعیت</th>'+
   '<th>تاریخ</th>'+
   '</tr>';

  for(const p of d.payments){

   html+=
    '<tr>'+
    '<td>'+
    escapeHTML(p.name||"-")+
    '</td>'+
    '<td>'+
    escapeHTML(p.email||"-")+
    '</td>'+
    '<td>'+
    Number(p.amount)
     .toLocaleString("fa-IR")+
    ' تومان</td>'+
    '<td>'+
    escapeHTML(p.plan||"-")+
    '</td>'+
    '<td>'+
    escapeHTML(p.status)+
    '</td>'+
    '<td>'+
    escapeHTML(p.created_at||"-")+
    '</td>'+
    '</tr>';
  }

  html+=
   '</table></div>';

  box.innerHTML=html;

  return;
 }


 if(page==="withdrawals"){

  const r=
   await adminFetch(
    "/api/admin/withdrawals"
   );

  const d=await r.json();

  if(!d.ok){
   box.innerHTML=
    '<div class="msg">'+
    escapeHTML(d.error)+
    '</div>';
   return;
  }

  let html=
   '<h3>💸 درخواست‌های برداشت</h3>'+
   '<div class="tableWrap">'+
   '<table>'+
   '<tr>'+
   '<th>کاربر</th>'+
   '<th>مبلغ</th>'+
   '<th>روش</th>'+
   '<th>مقصد</th>'+
   '<th>وضعیت</th>'+
   '<th>عملیات</th>'+
   '</tr>';

  for(const w of d.withdrawals){

   html+=
    '<tr>'+
    '<td>'+
    escapeHTML(w.name||"-")+
    '</td>'+
    '<td>'+
    Number(w.amount)
     .toLocaleString("fa-IR")+
    ' تومان</td>'+
    '<td>'+
    escapeHTML(w.method)+
    '</td>'+
    '<td>'+
    escapeHTML(w.destination)+
    '</td>'+
    '<td>'+
    escapeHTML(w.status)+
    '</td>'+
    '<td>';

   if(w.status==="pending"){

    html+=
     '<button class="green" '+
     'onclick="withdrawStatus('+
     w.id+',\\'approved\\')">'+
     '✅ تأیید'+
     '</button>'+
     '<button class="red" '+
     'onclick="withdrawStatus('+
     w.id+',\\'rejected\\')">'+
     '❌ رد'+
     '</button>';

   }else{

    html+="بررسی شده";
   }

   html+=
    '</td></tr>';
  }

  html+=
   '</table></div>';

  box.innerHTML=html;
 }
}


async function changeBalance(){

 const user_id=
  Number(el("adminUserId").value);

 const amount=
  Number(el("adminAmount").value);

 const description=
  el("adminDescription").value;

 const r=
  await adminFetch(
   "/api/admin/balance",
   {
    method:"POST",
    body:JSON.stringify({
     user_id,
     amount,
     description
    })
   }
  );

 const d=await r.json();

 msg(
  "balanceAdminMsg",
  d.message||d.error||"خطا"
 );
}


async function changeUserStatus(
 id,
 status
){

 const r=
  await adminFetch(
   "/api/admin/user-status",
   {
    method:"POST",
    body:JSON.stringify({
     user_id:id,
     status
    })
   }
  );

 const d=await r.json();

 alert(
  d.message||d.error||"خطا"
 );

 adminPage("users");
}


async function withdrawStatus(
 id,
 status
){

 const r=
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

 const d=await r.json();

 alert(
  d.message||d.error||"خطا"
 );

 adminPage("withdrawals");
}


/* =========================
   ABOUT
========================= */

function showAbout(){

 const x=el("about");

 x.classList.remove("hidden");

 x.scrollIntoView({
  behavior:"smooth"
 });
}


/* =========================
   AUTO LOGIN
========================= */

if(token){

 el("auth")
  .classList.add("hidden");

 el("userPanel")
  .classList.remove("hidden");

 loadMe();
 loadTransactions();
}


if(adminToken){

 el("adminLogin")
  .classList.add("hidden");

 el("adminPanel")
  .classList.remove("hidden");

 adminPage("stats");
}

</script>

</body>
</html>`;
