export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: {
          "content-type": "application/json; charset=UTF-8",
          "cache-control": "no-store"
        }
      });

    // =========================
    // امنیت و توابع کمکی
    // =========================

    async function hashPassword(password) {
      const data = new TextEncoder().encode(password);
      const hash = await crypto.subtle.digest("SHA-256", data);
      return [...new Uint8Array(hash)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
    }

    function randomToken() {
      return crypto.randomUUID() + "-" + crypto.randomUUID();
    }

    async function body(request) {
      try {
        return await request.json();
      } catch {
        return {};
      }
    }

    function getToken(request) {
      const h = request.headers.get("authorization") || "";
      if (!h.startsWith("Bearer ")) return "";
      return h.substring(7);
    }

    async function getUser(request) {
      const token = getToken(request);
      if (!token || !env.DB) return null;

      const result = await env.DB
        .prepare(`
          SELECT u.*
          FROM sessions s
          JOIN users u ON u.id = s.user_id
          WHERE s.token = ?
          LIMIT 1
        `)
        .bind(token)
        .first();

      return result || null;
    }

    async function ensureTables() {
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          balance REAL NOT NULL DEFAULT 0,
          status TEXT NOT NULL DEFAULT 'فعال',
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `).run();

      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          token TEXT NOT NULL UNIQUE,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `).run();

      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          type TEXT NOT NULL,
          amount REAL NOT NULL,
          description TEXT,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `).run();

      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS withdrawals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          amount REAL NOT NULL,
          method TEXT NOT NULL,
          address TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'در انتظار',
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `).run();
    }

    // =========================
    // API: ثبت نام
    // =========================

    if (url.pathname === "/api/register" && request.method === "POST") {
      try {
        await ensureTables();

        const data = await body(request);

        const name = String(data.name || "").trim();
        const email = String(data.email || "").trim().toLowerCase();
        const password = String(data.password || "");

        if (!name || !email || password.length < 6) {
          return json({
            ok: false,
            error: "نام، ایمیل و رمز حداقل ۶ کاراکتری لازم است."
          }, 400);
        }

        const exists = await env.DB
          .prepare("SELECT id FROM users WHERE email = ? LIMIT 1")
          .bind(email)
          .first();

        if (exists) {
          return json({
            ok: false,
            error: "این ایمیل قبلاً ثبت شده است."
          }, 400);
        }

        const passwordHash = await hashPassword(password);

        const inserted = await env.DB
          .prepare(`
            INSERT INTO users
            (name,email,password_hash,balance,status)
            VALUES (?,?,?,?,?)
          `)
          .bind(name, email, passwordHash, 0, "فعال")
          .run();

        const userId = inserted.meta.last_row_id;
        const token = randomToken();

        await env.DB
          .prepare(`
            INSERT INTO sessions (user_id,token)
            VALUES (?,?)
          `)
          .bind(userId, token)
          .run();

        return json({
          ok: true,
          token
        });

      } catch (e) {
        return json({
          ok: false,
          error: "خطا در ثبت‌نام",
          detail: String(e.message || e)
        }, 500);
      }
    }

    // =========================
    // API: ورود
    // =========================

    if (url.pathname === "/api/login" && request.method === "POST") {
      try {
        await ensureTables();

        const data = await body(request);

        const email = String(data.email || "").trim().toLowerCase();
        const password = String(data.password || "");

        if (!email || !password) {
          return json({
            ok: false,
            error: "ایمیل و رمز عبور را وارد کنید."
          }, 400);
        }

        const passwordHash = await hashPassword(password);

        const user = await env.DB
          .prepare(`
            SELECT *
            FROM users
            WHERE email = ?
            AND password_hash = ?
            LIMIT 1
          `)
          .bind(email, passwordHash)
          .first();

        if (!user) {
          return json({
            ok: false,
            error: "ایمیل یا رمز عبور اشتباه است."
          }, 401);
        }

        const token = randomToken();

        await env.DB
          .prepare(`
            INSERT INTO sessions (user_id,token)
            VALUES (?,?)
          `)
          .bind(user.id, token)
          .run();

        return json({
          ok: true,
          token
        });

      } catch (e) {
        return json({
          ok: false,
          error: "خطا در ورود",
          detail: String(e.message || e)
        }, 500);
      }
    }

    // =========================
    // API: اطلاعات کاربر
    // =========================

    if (url.pathname === "/api/me" && request.method === "GET") {
      try {
        await ensureTables();

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
            balance: Number(user.balance || 0),
            status: user.status
          }
        });

      } catch (e) {
        return json({
          ok: false,
          error: "خطا در دریافت حساب",
          detail: String(e.message || e)
        }, 500);
      }
    }

    // =========================
    // API: هوش مصنوعی
    // =========================

    if (url.pathname === "/api/ai" && request.method === "POST") {
      try {
        await ensureTables();

        const user = await getUser(request);

        if (!user) {
          return json({
            ok: false,
            error: "ابتدا وارد حساب شوید."
          }, 401);
        }

        const data = await body(request);
        const message = String(data.message || "").trim();

        if (!message) {
          return json({
            ok: false,
            error: "پیام خالی است."
          }, 400);
        }

        if (!env.AI) {
          return json({
            ok: false,
            error: "Binding مربوط به Workers AI با نام AI متصل نیست."
          }, 500);
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",
          {
            messages: [
              {
                role: "system",
                content:
                  "تو یک دستیار هوش مصنوعی فارسی‌زبان هستی. پاسخ‌ها را واضح، مفید و تا حد امکان به زبان فارسی ارائه کن."
              },
              {
                role: "user",
                content: message
              }
            ]
          }
        );

        const answer =
          result?.response ||
          result?.result?.response ||
          "پاسخی دریافت نشد.";

        return json({
          ok: true,
          answer
        });

      } catch (e) {
        return json({
          ok: false,
          error: "خطا در هوش مصنوعی",
          detail: String(e.message || e)
        }, 500);
      }
    }

    // =========================
    // API: درخواست برداشت
    // =========================

    if (url.pathname === "/api/withdraw" && request.method === "POST") {
      try {
        await ensureTables();

        const user = await getUser(request);

        if (!user) {
          return json({
            ok: false,
            error: "ابتدا وارد حساب شوید."
          }, 401);
        }

        const data = await body(request);

        const amount = Number(data.amount);
        const method = String(data.method || "USDT").trim();
        const address = String(data.address || "").trim();

        if (!Number.isFinite(amount) || amount < 10) {
          return json({
            ok: false,
            error: "حداقل مبلغ برداشت $10 است."
          }, 400);
        }

        if (!address) {
          return json({
            ok: false,
            error: "آدرس کیف پول USDT را وارد کنید."
          }, 400);
        }

        if (Number(user.balance) < amount) {
          return json({
            ok: false,
            error: "موجودی حساب کافی نیست."
          }, 400);
        }

        // کسر موجودی و ثبت برداشت در یک تراکنش منطقی
        await env.DB
          .prepare(`
            UPDATE users
            SET balance = balance - ?
            WHERE id = ?
            AND balance >= ?
          `)
          .bind(amount, user.id, amount)
          .run();

        const updated = await env.DB
          .prepare(`
            SELECT balance
            FROM users
            WHERE id = ?
          `)
          .bind(user.id)
          .first();

        if (!updated || Number(updated.balance) < 0) {
          return json({
            ok: false,
            error: "خطا در کسر موجودی."
          }, 400);
        }

        await env.DB
          .prepare(`
            INSERT INTO withdrawals
            (user_id,amount,method,address,status)
            VALUES (?,?,?,?,?)
          `)
          .bind(
            user.id,
            amount,
            method,
            address,
            "در انتظار"
          )
          .run();

        await env.DB
          .prepare(`
            INSERT INTO transactions
            (user_id,type,amount,description)
            VALUES (?,?,?,?)
          `)
          .bind(
            user.id,
            "برداشت",
            -amount,
            "درخواست برداشت " + method
          )
          .run();

        return json({
          ok: true,
          message: "درخواست برداشت با موفقیت ثبت شد."
        });

      } catch (e) {
        return json({
          ok: false,
          error: "خطا در ثبت برداشت",
          detail: String(e.message || e)
        }, 500);
      }
    }

    // =========================
    // API: تراکنش‌ها
    // =========================

    if (url.pathname === "/api/transactions" && request.method === "GET") {
      try {
        await ensureTables();

        const user = await getUser(request);

        if (!user) {
          return json({
            ok: false,
            error: "ابتدا وارد حساب شوید."
          }, 401);
        }

        const result = await env.DB
          .prepare(`
            SELECT
              id,
              type,
              amount,
              description,
              created_at
            FROM transactions
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT 100
          `)
          .bind(user.id)
          .all();

        return json({
          ok: true,
          transactions: result.results || []
        });

      } catch (e) {
        return json({
          ok: false,
          error: "خطا در دریافت تراکنش‌ها",
          detail: String(e.message || e)
        }, 500);
      }
    }

    // =========================
    // ADMIN LOGIN
    // =========================

    if (url.pathname === "/api/admin/login" && request.method === "POST") {
      try {
        const data = await body(request);
        const password = String(data.password || "");

        if (!env.ADMIN_PASSWORD) {
          return json({
            ok: false,
            error: "ADMIN_PASSWORD در تنظیمات Worker تعریف نشده است."
          }, 500);
        }

        if (password !== env.ADMIN_PASSWORD) {
          return json({
            ok: false,
            error: "رمز مدیریت اشتباه است."
          }, 401);
        }

        const token = randomToken();

        return json({
          ok: true,
          token
        });

      } catch (e) {
        return json({
          ok: false,
          error: "خطا در ورود مدیریت"
        }, 500);
      }
    }

    function checkAdmin(request) {
      const t = request.headers.get("x-admin-token") || "";
      return t.length > 20;
    }

    // =========================
    // ADMIN USERS
    // =========================

    if (url.pathname === "/api/admin/users" && request.method === "GET") {
      try {
        await ensureTables();

        if (!checkAdmin(request)) {
          return json({
            ok: false,
            error: "دسترسی مدیریت لازم است."
          }, 403);
        }

        const result = await env.DB
          .prepare(`
            SELECT
              id,
              name,
              email,
              balance,
              status,
              created_at
            FROM users
            ORDER BY id DESC
          `)
          .all();

        return json({
          ok: true,
          users: result.results || []
        });

      } catch (e) {
        return json({
          ok: false,
          error: "خطا در دریافت کاربران",
          detail: String(e.message || e)
        }, 500);
      }
    }

    // =========================
    // ADMIN WITHDRAWALS
    // =========================

    if (
      url.pathname === "/api/admin/withdrawals" &&
      request.method === "GET"
    ) {
      try {
        await ensureTables();

        if (!checkAdmin(request)) {
          return json({
            ok: false,
            error: "دسترسی مدیریت لازم است."
          }, 403);
        }

        const result = await env.DB
          .prepare(`
            SELECT
              w.id,
              w.user_id,
              u.name,
              u.email,
              w.amount,
              w.method,
              w.address,
              w.status,
              w.created_at
            FROM withdrawals w
            JOIN users u ON u.id = w.user_id
            ORDER BY w.id DESC
            LIMIT 200
          `)
          .all();

        return json({
          ok: true,
          withdrawals: result.results || []
        });

      } catch (e) {
        return json({
          ok: false,
          error: "خطا در دریافت برداشت‌ها",
          detail: String(e.message || e)
        }, 500);
      }
    }

    // =========================
    // ADMIN APPROVE / REJECT
    // =========================

    if (
      url.pathname === "/api/admin/withdrawal-action" &&
      request.method === "POST"
    ) {
      try {
        await ensureTables();

        if (!checkAdmin(request)) {
          return json({
            ok: false,
            error: "دسترسی مدیریت لازم است."
          }, 403);
        }

        const data = await body(request);

        const id = Number(data.id);
        const action = String(data.action || "");

        if (!id || !["approve", "reject"].includes(action)) {
          return json({
            ok: false,
            error: "اطلاعات نامعتبر است."
          }, 400);
        }

        const withdrawal = await env.DB
          .prepare(`
            SELECT *
            FROM withdrawals
            WHERE id = ?
            LIMIT 1
          `)
          .bind(id)
          .first();

        if (!withdrawal) {
          return json({
            ok: false,
            error: "درخواست برداشت پیدا نشد."
          }, 404);
        }

        if (withdrawal.status !== "در انتظار") {
          return json({
            ok: false,
            error: "این درخواست قبلاً بررسی شده است."
          }, 400);
        }

        if (action === "approve") {
          await env.DB
            .prepare(`
              UPDATE withdrawals
              SET status = 'تأیید شده'
              WHERE id = ?
            `)
            .bind(id)
            .run();

          return json({
            ok: true,
            message: "برداشت تأیید شد."
          });
        }

        // اگر رد شد، پول به موجودی برگردد
        await env.DB
          .prepare(`
            UPDATE withdrawals
            SET status = 'رد شده'
            WHERE id = ?
          `)
          .bind(id)
          .run();

        await env.DB
          .prepare(`
            UPDATE users
            SET balance = balance + ?
            WHERE id = ?
          `)
          .bind(withdrawal.amount, withdrawal.user_id)
          .run();

        await env.DB
          .prepare(`
            INSERT INTO transactions
            (user_id,type,amount,description)
            VALUES (?,?,?,?)
          `)
          .bind(
            withdrawal.user_id,
            "بازگشت برداشت",
            withdrawal.amount,
            "بازگشت مبلغ درخواست برداشت ردشده"
          )
          .run();

        return json({
          ok: true,
          message: "برداشت رد شد و مبلغ به موجودی برگشت."
        });

      } catch (e) {
        return json({
          ok: false,
          error: "خطا در بررسی برداشت",
          detail: String(e.message || e)
        }, 500);
      }
    }

    // =========================
    // صفحه اصلی
    // =========================

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(HTML, {
        headers: {
          "content-type": "text/html; charset=UTF-8",
          "cache-control": "no-store"
        }
      });
    }

    return json({
      ok: false,
      error: "مسیر پیدا نشد."
    }, 404);
  }
};


const HTML = `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>دستیار هوش مصنوعی</title>

<style>
*{box-sizing:border-box}

body{
  margin:0;
  font-family:Tahoma,Arial,sans-serif;
  background:#f4f7fb;
  color:#172033
}

header{
  background:#111827;
  color:white;
  padding:18px;
  text-align:center;
  position:sticky;
  top:0;
  z-index:5
}

header h1{
  margin:0;
  font-size:21px
}

header p{
  margin:7px 0 0;
  color:#cbd5e1;
  font-size:13px
}

.container{
  max-width:900px;
  margin:auto;
  padding:15px
}

.card{
  background:white;
  border-radius:18px;
  padding:16px;
  margin:12px 0;
  box-shadow:0 5px 20px rgba(0,0,0,.06)
}

input,textarea,select{
  width:100%;
  padding:13px;
  border:1px solid #d7deea;
  border-radius:12px;
  margin:6px 0 10px;
  font-family:inherit;
  font-size:15px;
  outline:none
}

textarea{
  min-height:100px;
  resize:vertical
}

button{
  border:0;
  border-radius:12px;
  padding:12px 16px;
  cursor:pointer;
  font-family:inherit;
  font-size:14px;
  margin:4px
}

.primary{background:#2563eb;color:white}
.green{background:#16a34a;color:white}
.red{background:#dc2626;color:white}
.gray{background:#e5e7eb;color:#111827}
.dark{background:#111827;color:white}
.orange{background:#f59e0b;color:white}

button:disabled{
  opacity:.5;
  cursor:not-allowed
}

.hidden{
  display:none!important
}

.balance{
  font-size:30px;
  font-weight:bold;
  margin:8px 0
}

.grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:10px
}

.stat{
  background:#f8fafc;
  padding:14px;
  border-radius:14px;
  text-align:center
}

.chat{
  min-height:300px;
  max-height:500px;
  overflow:auto;
  padding:8px
}

.msg{
  padding:12px;
  border-radius:14px;
  margin:8px 0;
  line-height:1.8;
  white-space:pre-wrap
}

.user{
  background:#dbeafe;
  margin-right:15%
}

.bot{
  background:#f1f5f9;
  margin-left:15%
}

.small{
  font-size:12px;
  color:#64748b
}

.item{
  padding:12px;
  border-bottom:1px solid #e5e7eb
}

.ok{
  color:#15803d
}

.err{
  color:#b91c1c
}

.adminItem{
  background:#f8fafc;
  padding:12px;
  margin:8px 0;
  border-radius:12px
}

@media(max-width:600px){
  .grid{
    grid-template-columns:1fr
  }

  .user{
    margin-right:5%
  }

  .bot{
    margin-left:5%
  }
}
</style>
</head>

<body>

<header>
<h1>🤖 دستیار هوش مصنوعی</h1>
<p>دستیار هوشمند + حساب کاربری + موجودی + برداشت</p>
</header>

<div class="container">

<!-- AUTH -->

<div id="authBox" class="card">

<h2>👤 حساب کاربری</h2>

<div id="loginForm">

<input
id="loginEmail"
type="email"
placeholder="ایمیل">

<input
id="loginPassword"
type="password"
placeholder="رمز عبور">

<button
class="primary"
onclick="login()">
ورود
</button>

<button
class="gray"
onclick="showRegister()">
ثبت‌نام
</button>

</div>

<div id="registerForm" class="hidden">

<input
id="regName"
placeholder="نام">

<input
id="regEmail"
type="email"
placeholder="ایمیل">

<input
id="regPassword"
type="password"
placeholder="رمز عبور حداقل 6 کاراکتر">

<button
class="green"
onclick="register()">
ایجاد حساب
</button>

<button
class="gray"
onclick="showLogin()">
بازگشت
</button>

</div>

<div id="authMsg" class="small"></div>

</div>


<!-- APP -->

<div id="appBox" class="hidden">

<div class="card">

<div class="small">کاربر</div>

<h3 id="userName">-</h3>

<div class="grid">

<div class="stat">

<div class="small">
موجودی
</div>

<div
id="balance"
class="balance">
$0.00
</div>

</div>

<div class="stat">

<div class="small">
وضعیت حساب
</div>

<div id="accountStatus">
فعال
</div>

</div>

</div>

<button
class="red"
onclick="logout()">
خروج
</button>

<button
class="green"
onclick="showWithdraw()">
💵 برداشت
</button>

<button
class="gray"
onclick="loadTransactions()">
📊 تراکنش‌ها
</button>

</div>


<!-- CHAT -->

<div class="card">

<h2>
💬 دستیار هوش مصنوعی
</h2>

<div
id="chat"
class="chat">

<div class="msg bot">
سلام! 👋 سوالت را بنویس.
</div>

</div>

<textarea
id="question"
placeholder="سوال خود را بنویسید..."></textarea>

<button
id="sendBtn"
class="primary"
onclick="askAI()">
ارسال
</button>

<button
class="gray"
onclick="clearChat()">
🗑️ پاک کردن گفتگو
</button>

</div>


<!-- WITHDRAW -->

<div
id="withdrawBox"
class="card hidden">

<h2>
💵 درخواست برداشت
</h2>

<div class="small">
حداقل برداشت: $10
</div>

<input
id="withdrawAmount"
type="number"
min="10"
step="0.01"
placeholder="مبلغ به دلار">

<select id="withdrawMethod">
<option value="USDT">
USDT
</option>
</select>

<input
id="withdrawAddress"
placeholder="آدرس کیف پول USDT">

<button
class="green"
onclick="withdraw()">
ثبت درخواست برداشت
</button>

<button
class="gray"
onclick="hideWithdraw()">
بستن
</button>

<div
id="withdrawMsg"
class="small">
</div>

</div>


<!-- TRANSACTIONS -->

<div
id="transactionsBox"
class="card hidden">

<h2>
📊 تراکنش‌ها
</h2>

<div id="transactions">
</div>

</div>

</div>


<!-- ADMIN -->

<div
id="adminBox"
class="card">

<h2>
🛠️ پنل مدیریت
</h2>

<input
id="adminPassword"
type="password"
placeholder="رمز مدیریت">

<button
class="dark"
onclick="adminLogin()">
ورود مدیریت
</button>

<div
id="adminMsg"
class="small">
</div>

<div
id="adminPanel"
class="hidden">

<hr>

<button
class="gray"
onclick="adminUsers()">
👥 کاربران
</button>

<button
class="gray"
onclick="adminWithdrawals()">
💵 برداشت‌ها
</button>

<div id="adminResult"></div>

</div>

</div>

</div>


<script>

let token =
localStorage.getItem("ai_token") || "";

let adminToken =
localStorage.getItem("admin_token") || "";


async function api(path, options={}){

  const headers = {
    "content-type":"application/json",
    ...(options.headers || {})
  };

  if(token){
    headers.authorization =
      "Bearer " + token;
  }

  if(adminToken){
    headers["x-admin-token"] =
      adminToken;
  }

  try{

    const res =
      await fetch(path,{
        ...options,
        headers
      });

    let data;

    try{
      data = await res.json();
    }catch{
      data = {
        ok:false,
        error:"پاسخ نامعتبر از سرور"
      };
    }

    if(!res.ok && !data.error){
      data.error="خطای سرور";
    }

    return data;

  }catch(e){

    return {
      ok:false,
      error:"ارتباط با سرور برقرار نشد."
    };

  }
}


function showRegister(){

  document
    .getElementById("loginForm")
    .classList.add("hidden");

  document
    .getElementById("registerForm")
    .classList.remove("hidden");

  document
    .getElementById("authMsg")
    .textContent="";
}


function showLogin(){

  document
    .getElementById("registerForm")
    .classList.add("hidden");

  document
    .getElementById("loginForm")
    .classList.remove("hidden");

  document
    .getElementById("authMsg")
    .textContent="";
}


function msg(text,ok=false){

  const el =
    document.getElementById("authMsg");

  el.textContent=text;

  el.className =
    ok ? "small ok" : "small err";
}


async function register(){

  const name =
    document.getElementById("regName")
    .value.trim();

  const email =
    document.getElementById("regEmail")
    .value.trim();

  const password =
    document.getElementById("regPassword")
    .value;

  if(!name || !email || password.length<6){

    msg(
      "نام، ایمیل و رمز حداقل ۶ کاراکتری لازم است."
    );

    return;
  }

  const r =
    await api(
      "/api/register",
      {
        method:"POST",
        body:JSON.stringify({
          name,
          email,
          password
        })
      }
    );

  if(!r.ok){

    msg(
      r.error || "ثبت‌نام ناموفق بود"
    );

    return;
  }

  token=r.token;

  localStorage.setItem(
    "ai_token",
    token
  );

  msg(
    "ثبت‌نام موفق بود.",
    true
  );

  await loadMe();
}


async function login(){

  const email =
    document.getElementById("loginEmail")
    .value.trim();

  const password =
    document.getElementById("loginPassword")
    .value;

  const r =
    await api(
      "/api/login",
      {
        method:"POST",
        body:JSON.stringify({
          email,
          password
        })
      }
    );

  if(!r.ok){

    msg(
      r.error || "ورود ناموفق بود"
    );

    return;
  }

  token=r.token;

  localStorage.setItem(
    "ai_token",
    token
  );

  await loadMe();
}


async function loadMe(){

  const r =
    await api("/api/me");

  if(!r.ok){

    localStorage.removeItem(
      "ai_token"
    );

    token="";

    document
      .getElementById("authBox")
      .classList.remove("hidden");

    document
      .getElementById("appBox")
      .classList.add("hidden");

    return;
  }

  document
    .getElementById("authBox")
    .classList.add("hidden");

  document
    .getElementById("appBox")
    .classList.remove("hidden");

  document
    .getElementById("userName")
    .textContent=r.user.name;

  document
    .getElementById("balance")
    .textContent=
      "$"+
      Number(r.user.balance)
      .toFixed(2);

  document
    .getElementById("accountStatus")
    .textContent=
      r.user.status || "فعال";
}


function logout(){

  localStorage.removeItem(
    "ai_token"
  );

  token="";

  location.reload();
}


function addMessage(text,type){

  const chat =
    document.getElementById("chat");

  const div =
    document.createElement("div");

  div.className =
    "msg " + type;

  div.textContent=text;

  chat.appendChild(div);

  chat.scrollTop=
    chat.scrollHeight;
}


async function askAI(){

  const input =
    document.getElementById("question");

  const question =
    input.value.trim();

  if(!question)return;

  addMessage(
    question,
    "user"
  );

  input.value="";

  const btn =
    document.getElementById("sendBtn");

  btn.disabled=true;

  btn.textContent=
    "در حال پاسخ...";

  const r =
    await api(
      "/api/ai",
      {
        method:"POST",
        body:JSON.stringify({
          message:question
        })
      }
    );

  if(r.ok){

    addMessage(
      r.answer ||
      "پاسخی دریافت نشد.",
      "bot"
    );

    await loadMe();

  }else{

    addMessage(
      "خطا: "+
      (r.error ||
       "خطا در دریافت پاسخ"),
      "bot"
    );
  }

  btn.disabled=false;

  btn.textContent="ارسال";
}


function clearChat(){

  document
    .getElementById("chat")
    .innerHTML=
      '<div class="msg bot">گفتگو پاک شد. سوال جدیدت را بنویس.</div>';
}


function showWithdraw(){

  document
    .getElementById("withdrawBox")
    .classList.remove("hidden");
}


function hideWithdraw(){

  document
    .getElementById("withdrawBox")
    .classList.add("hidden");
}


async function withdraw(){

  const amount =
    Number(
      document
      .getElementById("withdrawAmount")
      .value
    );

  const method =
    document
    .getElementById("withdrawMethod")
    .value;

  const address =
    document
    .getElementById("withdrawAddress")
    .value
    .trim();

  const out =
    document
    .getElementById("withdrawMsg");


  if(!Number.isFinite(amount) ||
     amount<10){

    out.textContent=
      "حداقل مبلغ برداشت $10 است.";

    out.className=
      "small err";

    return;
  }


  if(!address){

    out.textContent=
      "آدرس کیف پول USDT را وارد کنید.";

    out.className=
      "small err";

    return;
  }


  out.textContent=
    "در حال ثبت درخواست...";

  out.className=
    "small";


  const r =
    await api(
      "/api/withdraw",
      {
        method:"POST",
        body:JSON.stringify({
          amount,
          method,
          address
        })
      }
    );


  if(!r.ok){

    out.textContent=
      r.error ||
      "ثبت برداشت ناموفق بود.";

    out.className=
      "small err";

    return;
  }


  out.textContent=
    r.message ||
    "درخواست برداشت ثبت شد.";

  out.className=
    "small ok";


  document
    .getElementById("withdrawAmount")
    .value="";

  document
    .getElementById("withdrawAddress")
    .value="";


  await loadMe();

  await loadTransactions();
}


async function loadTransactions(){

  const box =
    document
    .getElementById("transactionsBox");

  box.classList.remove("hidden");


  const el =
    document
    .getElementById("transactions");

  el.innerHTML=
    "در حال دریافت...";


  const r =
    await api(
      "/api/transactions"
    );


  if(!r.ok){

    el.innerHTML=
      '<div class="err">'+
      (r.error || "خطا")+
      '</div>';

    return;
  }


  if(!r.transactions ||
     !r.transactions.length){

    el.innerHTML=
      '<div class="small">تراکنشی وجود ندارد.</div>';

    return;
  }


  el.innerHTML=
    r.transactions
    .map(t => `

      <div class="item">

        <b>${escapeHtml(t.type)}</b>

        <div>
          مبلغ:
          ${Number(t.amount).toFixed(2)}
          $
        </div>

        <div class="small">
          ${escapeHtml(t.description || "")}
        </div>

        <div class="small">
          ${escapeHtml(t.created_at || "")}
        </div>

      </div>

    `)
    .join("");
}


async function adminLogin(){

  const password =
    document
    .getElementById("adminPassword")
    .value;

  const out =
    document
    .getElementById("adminMsg");


  const r =
    await api(
      "/api/admin/login",
      {
        method:"POST",
        body:JSON.stringify({
          password
        })
      }
    );


  if(!r.ok){

    out.textContent=
      r.error ||
      "ورود مدیریت ناموفق بود";

    out.className=
      "small err";

    return;
  }


  adminToken=r.token;

  localStorage.setItem(
    "admin_token",
    adminToken
  );


  out.textContent=
    "ورود مدیریت موفق بود.";

  out.className=
    "small ok";


  document
    .getElementById("adminPanel")
    .classList.remove("hidden");
}


async function adminUsers(){

  const box =
    document
    .getElementById("adminResult");

  box.innerHTML=
    "در حال دریافت کاربران...";


  const r =
    await api(
      "/api/admin/users"
    );


  if(!r.ok){

    box.innerHTML=
      '<div class="err">'+
      (r.error || "خطا")+
      '</div>';

    return;
  }


  if(!r.users.length){

    box.innerHTML=
      '<div class="small">کاربری وجود ندارد.</div>';

    return;
  }


  box.innerHTML=
    r.users
    .map(u => `

      <div class="adminItem">

        <b>${escapeHtml(u.name)}</b>

        <div>
          ${escapeHtml(u.email)}
        </div>

        <div>
          موجودی:
          $${Number(u.balance).toFixed(2)}
        </div>

        <div>
          وضعیت:
          ${escapeHtml(u.status)}
        </div>

      </div>

    `)
    .join("");
}


async function adminWithdrawals(){

  const box =
    document
    .getElementById("adminResult");

  box.innerHTML=
    "در حال دریافت برداشت‌ها...";


  const r =
    await api(
      "/api/admin/withdrawals"
    );


  if(!r.ok){

    box.innerHTML=
      '<div class="err">'+
      (r.error || "خطا")+
      '</div>';

    return;
  }


  if(!r.withdrawals.length){

    box.innerHTML=
      '<div class="small">درخواست برداشتی وجود ندارد.</div>';

    return;
  }


  box.innerHTML=
    r.withdrawals
    .map(w => `

      <div class="adminItem">

        <b>
          ${escapeHtml(w.name)}
        </b>

        <div>
          مبلغ:
          $${Number(w.amount).toFixed(2)}
        </div>

        <div>
          روش:
          ${escapeHtml(w.method)}
        </div>

        <div>
          آدرس:
          ${escapeHtml(w.address)}
        </div>

        <div>
          وضعیت:
          ${escapeHtml(w.status)}
        </div>

        <div class="small">
          ${escapeHtml(w.created_at)}
        </div>

        ${
          w.status === "در انتظار"
          ? `
            <button
              class="green"
              onclick="withdrawalAction(${w.id},'approve')">
              تأیید
            </button>

            <button
              class="red"
              onclick="withdrawalAction(${w.id},'reject')">
              رد
            </button>
          `
          : ""
        }

      </div>

    `)
    .join("");
}


async function withdrawalAction(id,action){

  const r =
    await api(
      "/api/admin/withdrawal-action",
      {
        method:"POST",
        body:JSON.stringify({
          id,
          action
        })
      }
    );


  if(!r.ok){

    alert(
      r.error ||
      "عملیات ناموفق بود."
    );

    return;
  }


  alert(
    r.message ||
    "عملیات انجام شد."
  );


  await adminWithdrawals();
}


function escapeHtml(value){

  return String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}


// =========================
// شروع
// =========================

loadMe();

</script>

</body>
</html>`;
