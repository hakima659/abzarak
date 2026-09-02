
// =============================================================
// AI Assistant Worker — Cloudflare Workers + D1 + OpenAI
// =============================================================
//
// Required bindings (wrangler.toml):
//   [[d1_databases]]
//   binding = "DB"
//   database_name = "ai-assistant-db"
//   database_id = "..."
//
// Required secrets (set with `wrangler secret put NAME`):
//   OPENAI_API_KEY   - your OpenAI API key
//   ADMIN_PASSWORD   - password for the admin panel
//   JWT_SECRET       - random long string used to sign session tokens
//   ZARINPAL_MERCHANT_ID (optional, for real IRR payments)
//
// =============================================================

const PLANS = [
  { id: "p400",  title: "پلن ۴۰۰ هزار تومان",  irr: 400000,  usd: 6 },
  { id: "p700",  title: "پلن ۷۰۰ هزار تومان",  irr: 700000,  usd: 10 },
  { id: "p1000", title: "پلن ۱ میلیون تومان",   irr: 1000000, usd: 15 },
  { id: "p1500", title: "پلن ۱.۵ میلیون تومان", irr: 1500000, usd: 22 },
  { id: "p2000", title: "پلن ۲ میلیون تومان",   irr: 2000000, usd: 30 }
];

// ---------- small helpers ----------

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=UTF-8" }
  });
}

function err(message, status = 400) {
  return json({ ok: false, error: message }, status);
}

function uuid() {
  return crypto.randomUUID();
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Password hashing with per-user random salt (PBKDF2 via WebCrypto)
async function hashPassword(password, saltHex) {
  const enc = new TextEncoder();
  const salt = saltHex
    ? Uint8Array.from(saltHex.match(/.{2}/g).map((b) => parseInt(b, 16)))
    : crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );

  const hashHex = Array.from(new Uint8Array(bits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const saltOut = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${saltOut}:${hashHex}`;
}

async function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [saltHex, hashHex] = stored.split(":");
  const recomputed = await hashPassword(password, saltHex);
  return recomputed === stored ? true : recomputed.split(":")[1] === hashHex;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------- auth ----------

async function createSession(db, userId) {
  const token = uuid() + uuid(); // long random token
  const expires = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
  await db
    .prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(token, userId, expires)
    .run();
  return token;
}

async function getUserFromRequest(request, env) {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const session = await env.DB
    .prepare("SELECT * FROM sessions WHERE token = ?")
    .bind(token)
    .first();

  if (!session) return null;
  if (new Date(session.expires_at) < new Date()) return null;

  const user = await env.DB
    .prepare("SELECT id, name, email, balance, created_at FROM users WHERE id = ?")
    .bind(session.user_id)
    .first();

  return user || null;
}

// ---------- route handlers ----------

async function handleRegister(request, env) {
  const body = await request.json().catch(() => ({}));
  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  if (!email || !password) return err("ایمیل و رمز عبور را وارد کنید.");
  if (!isValidEmail(email)) return err("ایمیل معتبر نیست.");
  if (password.length < 6) return err("رمز عبور باید حداقل ۶ کاراکتر باشد.");

  const existing = await env.DB
    .prepare("SELECT id FROM users WHERE email = ?")
    .bind(email)
    .first();

  if (existing) return err("این ایمیل قبلاً ثبت‌نام کرده است.");

  const id = uuid();
  const passwordHash = await hashPassword(password);

  await env.DB
    .prepare("INSERT INTO users (id, name, email, password_hash, balance) VALUES (?, ?, ?, ?, 0)")
    .bind(id, name, email, passwordHash)
    .run();

  const token = await createSession(env.DB, id);

  return json({ ok: true, token });
}

async function handleLogin(request, env) {
  const body = await request.json().catch(() => ({}));
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  if (!email || !password) return err("ایمیل و رمز عبور را وارد کنید.");

  const user = await env.DB
    .prepare("SELECT * FROM users WHERE email = ?")
    .bind(email)
    .first();

  if (!user) return err("ایمیل یا رمز عبور اشتباه است.", 401);

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return err("ایمیل یا رمز عبور اشتباه است.", 401);

  const token = await createSession(env.DB, user.id);

  return json({ ok: true, token });
}

async function handleForgot(request, env) {
  const body = await request.json().catch(() => ({}));
  const email = (body.email || "").trim().toLowerCase();

  if (!email) return err("ایمیل را وارد کنید.");

  // NOTE: real email sending requires an email provider (e.g. Resend, SendGrid).
  // This just checks the user exists and responds generically for security.
  const user = await env.DB
    .prepare("SELECT id FROM users WHERE email = ?")
    .bind(email)
    .first();

  // Always respond the same way, whether the user exists or not (avoid email enumeration)
  return json({
    ok: true,
    message: "در صورت وجود این ایمیل در سیستم، لینک بازیابی ارسال شد."
  });
}

async function handleMe(request, env) {
  const user = await getUserFromRequest(request, env);
  if (!user) return err("لطفاً وارد حساب شوید.", 401);
  return json({ ok: true, user });
}

async function handleTransactions(request, env) {
  const user = await getUserFromRequest(request, env);
  if (!user) return err("لطفاً وارد حساب شوید.", 401);

  const { results } = await env.DB
    .prepare(
      "SELECT type, amount, status, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50"
    )
    .bind(user.id)
    .all();

  return json({ ok: true, transactions: results });
}

async function handleAI(request, env) {
  const user = await getUserFromRequest(request, env);
  if (!user) return err("لطفاً وارد حساب شوید.", 401);

  const body = await request.json().catch(() => ({}));
  const prompt = (body.prompt || "").trim();

  if (!prompt) return err("متن سؤال خالی است.");
  if (!env.OPENAI_API_KEY) return err("سرویس هوش مصنوعی پیکربندی نشده است.", 500);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant. Respond in Persian (Farsi) unless the user writes in another language." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI error:", errText);
      return err("خطا در دریافت پاسخ از هوش مصنوعی.", 502);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "پاسخی دریافت نشد.";

    return json({ ok: true, answer });
  } catch (e) {
    console.error(e);
    return err("خطا در ارتباط با سرویس هوش مصنوعی.", 502);
  }
}

async function handlePayment(request, env) {
  const user = await getUserFromRequest(request, env);
  if (!user) return err("لطفاً وارد حساب شوید.", 401);

  const body = await request.json().catch(() => ({}));
  const planId = body.plan_id;
  const currency = body.currency === "USD" ? "USD" : "IRR";

  const plan = PLANS.find((p) => p.id === planId);
  if (!plan) return err("پلن انتخابی معتبر نیست.");

  const amount = currency === "USD" ? plan.usd : plan.irr;
  const paymentId = uuid();

  await env.DB
    .prepare(
      "INSERT INTO payments (id, user_id, plan_id, currency, amount, status) VALUES (?, ?, ?, ?, ?, 'pending')"
    )
    .bind(paymentId, user.id, planId, currency, amount)
    .run();

  // --- Real gateway integration goes here ---
  // Example for Zarinpal (IRR only):
  if (currency === "IRR" && env.ZARINPAL_MERCHANT_ID) {
    try {
      const zpRes = await fetch("https://api.zarinpal.com/pg/v4/payment/request.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_id: env.ZARINPAL_MERCHANT_ID,
          amount: amount * 10, // Zarinpal expects Rial, plan is in Toman
          description: `${plan.title}`,
          callback_url: `${new URL(request.url).origin}/api/payment/callback?pid=${paymentId}`,
          metadata: { email: user.email }
        })
      });

      const zpData = await zpRes.json();

      if (zpData?.data?.code === 100) {
        await env.DB
          .prepare("UPDATE payments SET authority = ? WHERE id = ?")
          .bind(zpData.data.authority, paymentId)
          .run();

        return json({
          ok: true,
          payment_url: `https://www.zarinpal.com/pg/StartPay/${zpData.data.authority}`
        });
      }

      return err("خطا در ایجاد لینک پرداخت زرین‌پال.", 502);
    } catch (e) {
      console.error(e);
      return err("خطا در ارتباط با درگاه پرداخت.", 502);
    }
  }

  // Fallback: no gateway configured yet
  return json({
    ok: true,
    message: `سفارش ثبت شد (شناسه: ${paymentId}). درگاه پرداخت هنوز متصل نشده است.`
  });
}

async function handlePaymentCallback(request, env) {
  const url = new URL(request.url);
  const pid = url.searchParams.get("pid");
  const authority = url.searchParams.get("Authority");
  const status = url.searchParams.get("Status");

  if (!pid) return err("شناسه سفارش نامعتبر است.");

  const payment = await env.DB
    .prepare("SELECT * FROM payments WHERE id = ?")
    .bind(pid)
    .first();

  if (!payment) return err("سفارش پیدا نشد.", 404);

  if (status !== "OK") {
    await env.DB.prepare("UPDATE payments SET status = 'failed' WHERE id = ?").bind(pid).run();
    return Response.redirect(`${url.origin}/?payment=failed`, 302);
  }

  if (env.ZARINPAL_MERCHANT_ID) {
    const verifyRes = await fetch("https://api.zarinpal.com/pg/v4/payment/verify.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: env.ZARINPAL_MERCHANT_ID,
        amount: payment.amount * 10,
        authority
      })
    });

    const verifyData = await verifyRes.json();

    if (verifyData?.data?.code === 100 || verifyData?.data?.code === 101) {
      await env.DB
        .prepare("UPDATE payments SET status = 'success', ref_id = ? WHERE id = ?")
        .bind(String(verifyData.data.ref_id || ""), pid)
        .run();

      const plan = PLANS.find((p) => p.id === payment.plan_id);

      await env.DB
        .prepare("UPDATE users SET balance = balance + ? WHERE id = ?")
        .bind(plan ? plan.irr : payment.amount, payment.user_id)
        .run();

      await env.DB
        .prepare(
          "INSERT INTO transactions (id, user_id, type, amount, status) VALUES (?, ?, 'payment', ?, 'success')"
        )
        .bind(uuid(), payment.user_id, plan ? plan.irr : payment.amount)
        .run();

      return Response.redirect(`${url.origin}/?payment=success`, 302);
    }
  }

  await env.DB.prepare("UPDATE payments SET status = 'failed' WHERE id = ?").bind(pid).run();
  return Response.redirect(`${url.origin}/?payment=failed`, 302);
}

async function handleWithdraw(request, env) {
  const user = await getUserFromRequest(request, env);
  if (!user) return err("لطفاً وارد حساب شوید.", 401);

  const body = await request.json().catch(() => ({}));
  const amount = Number(body.amount);
  const method = body.method === "USDT" ? "USDT" : "BANK";
  const address = (body.address || "").trim();

  if (!amount || amount < 10000) return err("حداقل مبلغ برداشت ۱۰,۰۰۰ تومان است.");
  if (!address) return err("اطلاعات مقصد برداشت را وارد کنید.");
  if (amount > user.balance) return err("موجودی کافی نیست.");

  const id = uuid();

  await env.DB
    .prepare(
      "INSERT INTO withdrawals (id, user_id, amount, method, address, status) VALUES (?, ?, ?, ?, ?, 'pending')"
    )
    .bind(id, user.id, amount, method, address)
    .run();

  await env.DB
    .prepare("UPDATE users SET balance = balance - ? WHERE id = ?")
    .bind(amount, user.id)
    .run();

  await env.DB
    .prepare(
      "INSERT INTO transactions (id, user_id, type, amount, status) VALUES (?, ?, 'withdraw', ?, 'pending')"
    )
    .bind(uuid(), user.id, amount)
    .run();

  return json({ ok: true, message: "درخواست برداشت ثبت شد و در انتظار تأیید است." });
}

// ---------- admin ----------

async function handleAdminLogin(request, env) {
  const body = await request.json().catch(() => ({}));
  const password = body.password || "";

  if (!env.ADMIN_PASSWORD) return err("پنل مدیریت پیکربندی نشده است.", 500);
  if (password !== env.ADMIN_PASSWORD) return err("رمز مدیریت اشتباه است.", 401);

  // Simple admin token: hash of password + secret, valid until changed.
  const token = await sha256(password + (env.JWT_SECRET || "admin-secret"));

  return json({ ok: true, token });
}

function checkAdminToken(request, env) {
  return (async () => {
    const token = request.headers.get("X-Admin-Token") || "";
    if (!token || !env.ADMIN_PASSWORD) return false;
    const expected = await sha256(env.ADMIN_PASSWORD + (env.JWT_SECRET || "admin-secret"));
    return token === expected;
  })();
}

async function handleAdminUsers(request, env) {
  if (!(await checkAdminToken(request, env))) return err("دسترسی غیرمجاز.", 401);

  const { results } = await env.DB
    .prepare("SELECT id, name, email, balance, created_at FROM users ORDER BY created_at DESC LIMIT 200")
    .all();

  return json({ ok: true, users: results });
}

async function handleAdminWithdrawals(request, env) {
  if (!(await checkAdminToken(request, env))) return err("دسترسی غیرمجاز.", 401);

  const { results } = await env.DB
    .prepare(
      `SELECT w.id, w.amount, w.method, w.address, w.status, w.created_at, u.email
       FROM withdrawals w JOIN users u ON u.id = w.user_id
       ORDER BY w.created_at DESC LIMIT 200`
    )
    .all();

  return json({ ok: true, withdrawals: results });
}

async function handleAdminPayments(request, env) {
  if (!(await checkAdminToken(request, env))) return err("دسترسی غیرمجاز.", 401);

  const { results } = await env.DB
    .prepare(
      `SELECT p.id, p.plan_id, p.currency, p.amount, p.status, p.ref_id, p.created_at, u.email
       FROM payments p JOIN users u ON u.id = p.user_id
       ORDER BY p.created_at DESC LIMIT 200`
    )
    .all();

  return json({ ok: true, payments: results });
}

// ---------- auto migration (no separate schema step needed) ----------

let migrated = false;

async function ensureSchema(env) {
  if (migrated) return;
  if (!env.DB) return;

  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      balance INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      meta TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      currency TEXT NOT NULL,
      amount INTEGER NOT NULL,
      authority TEXT,
      ref_id TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS withdrawals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      method TEXT NOT NULL,
      address TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`)
  ]);

  migrated = true;
}

// ---------- router ----------

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (!env.DB) {
      if (path === "/") {
        return new Response(HTML, {
          headers: { "content-type": "text/html; charset=UTF-8", "cache-control": "no-store" }
        });
      }
      return err(
        "دیتابیس D1 وصل نشده است. در wrangler.toml بخش d1_databases را تنظیم کن و دوباره deploy کن.",
        500
      );
    }

    await ensureSchema(env);

    try {
      if (method === "GET" && path === "/") {
        return new Response(HTML, {
          headers: {
            "content-type": "text/html; charset=UTF-8",
            "cache-control": "no-store"
          }
        });
      }

      if (method === "POST" && path === "/api/register") return await handleRegister(request, env);
      if (method === "POST" && path === "/api/login") return await handleLogin(request, env);
      if (method === "POST" && path === "/api/forgot") return await handleForgot(request, env);
      if (method === "GET" && path === "/api/me") return await handleMe(request, env);
      if (method === "GET" && path === "/api/transactions") return await handleTransactions(request, env);
      if (method === "POST" && path === "/api/ai") return await handleAI(request, env);
      if (method === "POST" && path === "/api/payment") return await handlePayment(request, env);
      if (method === "GET" && path === "/api/payment/callback") return await handlePaymentCallback(request, env);
      if (method === "POST" && path === "/api/withdraw") return await handleWithdraw(request, env);

      if (method === "POST" && path === "/api/admin/login") return await handleAdminLogin(request, env);
      if (method === "GET" && path === "/api/admin/users") return await handleAdminUsers(request, env);
      if (method === "GET" && path === "/api/admin/withdrawals") return await handleAdminWithdrawals(request, env);
      if (method === "GET" && path === "/api/admin/payments") return await handleAdminPayments(request, env);

      return err("مسیر پیدا نشد", 404);
    } catch (e) {
      console.error(e);
      return err("خطای داخلی سرور", 500);
    }
  }
};

// =============================================================
// FRONTEND HTML
// =============================================================

const HTML = `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>دستیار هوش مصنوعی</title>
<style>
*{box-sizing:border-box}
html,body{margin:0;padding:0;width:100%;min-height:100%}
body{font-family:Tahoma,Arial,sans-serif;background:#f4f7fb;color:#172033}
header{background:#172554;color:white;padding:22px 15px;text-align:center}
header h1{margin:0 0 8px;font-size:25px}
header p{margin:0;opacity:.9}
nav{position:relative;z-index:1000;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:12px;background:#fff;box-shadow:0 2px 10px #0001}
button{appearance:none;-webkit-appearance:none;display:inline-block;border:0;border-radius:10px;padding:12px 16px;margin:3px;background:#2563eb;color:#fff;cursor:pointer;pointer-events:auto;position:relative;z-index:1001;touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none;font-family:inherit;font-size:15px}
button:active{transform:scale(.97)}
button:hover{opacity:.9}
button.secondary{background:#64748b}
button.danger{background:#dc2626}
button.success{background:#16a34a}
button:disabled{opacity:.6;cursor:not-allowed}
.container{max-width:1000px;margin:20px auto;padding:0 12px}
section{display:none}
section.active{display:block}
.card{background:#fff;border-radius:16px;padding:20px;margin-bottom:16px;box-shadow:0 4px 18px #0000000d}
h2{margin-top:0}
input,select,textarea{width:100%;padding:12px;margin:7px 0 12px;border:1px solid #d5dbe5;border-radius:10px;font-family:inherit;font-size:15px}
textarea{min-height:160px;resize:vertical}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px}
.plan{border:1px solid #dbe2ec;border-radius:14px;padding:18px;background:#fff}
.price{font-size:22px;font-weight:bold;margin:10px 0}
.balance{font-size:28px;font-weight:bold;color:#16a34a}
.notice{padding:12px;border-radius:10px;background:#eff6ff;margin:10px 0}
.result{white-space:pre-wrap;line-height:1.9}
table{width:100%;border-collapse:collapse}
th,td{padding:9px;border-bottom:1px solid #e5e7eb;text-align:right}
.small{color:#64748b;font-size:13px}
@media(max-width:600px){nav button{flex:1 1 45%}header h1{font-size:21px}}
</style>
</head>
<body>
<header>
<h1>🤖 دستیار هوش مصنوعی</h1>
<p>دستیار هوشمند • حساب کاربری • درآمد • پرداخت • برداشت</p>
</header>
<nav>
<button type="button" data-action="page" data-page="login">🏠 حساب</button>
<button type="button" data-action="page" data-page="ai">🤖 هوش مصنوعی</button>
<button type="button" data-action="page" data-page="plans">💰 پلن‌ها</button>
<button type="button" data-action="page" data-page="payment">💳 پرداخت</button>
<button type="button" data-action="page" data-page="withdraw">💸 برداشت</button>
<button type="button" data-action="page" data-page="adminLogin">🛠️ مدیریت</button>
<button type="button" data-action="logout">خروج</button>
</nav>
<div class="container">

<section id="login" class="active">
<div class="card">
<h2>🔐 ورود به حساب</h2>
<input id="loginEmail" type="email" placeholder="ایمیل">
<input id="loginPassword" type="password" placeholder="رمز عبور">
<button type="button" data-action="login">ورود</button>
<button type="button" class="secondary" data-action="page" data-page="register">ثبت‌نام</button>
<button type="button" class="secondary" data-action="page" data-page="forgot">بازیابی رمز</button>
<div id="loginMsg"></div>
</div>
</section>

<section id="register">
<div class="card">
<h2>📝 ثبت‌نام</h2>
<input id="registerName" type="text" placeholder="نام">
<input id="registerEmail" type="email" placeholder="ایمیل">
<input id="registerPassword" type="password" placeholder="رمز عبور (حداقل ۶ کاراکتر)">
<button type="button" data-action="register">ثبت‌نام</button>
<button type="button" class="secondary" data-action="page" data-page="login">بازگشت به ورود</button>
<div id="registerMsg"></div>
</div>
</section>

<section id="forgot">
<div class="card">
<h2>🔑 بازیابی رمز</h2>
<input id="forgotEmail" type="email" placeholder="ایمیل">
<button type="button" data-action="forgot">بازیابی</button>
<button type="button" class="secondary" data-action="page" data-page="login">بازگشت</button>
<div id="forgotMsg"></div>
</div>
</section>

<section id="home">
<div class="card">
<h2>👤 حساب کاربری</h2>
<div id="profile">برای ورود به حساب، وارد شوید.</div>
</div>
<div class="card">
<h2>💰 موجودی حساب</h2>
<div id="balance" class="balance">0 تومان</div>
<p class="small">حداقل برداشت: ۱۰,۰۰۰ تومان</p>
</div>
<div class="card">
<h2>📊 تراکنش‌ها</h2>
<div id="transactions">هنوز تراکنشی ثبت نشده است.</div>
</div>
</section>

<section id="ai">
<div class="card">
<h2>🤖 هوش مصنوعی</h2>
<div class="notice">سؤال یا درخواست خود را بنویسید.</div>
<textarea id="aiPrompt" placeholder="مثلاً: یک متن تبلیغاتی برای فروشگاه اینترنتی بنویس..."></textarea>
<button type="button" data-action="askAI" id="askAIBtn">ارسال به هوش مصنوعی</button>
<div id="aiMsg"></div>
<div id="aiResult" class="result"></div>
</div>
</section>

<section id="plans">
<div class="card">
<h2>💰 پلن‌های اشتراک</h2>
<div class="notice">پلن مناسب خود را انتخاب کنید.</div>
<div id="plansList"></div>
</div>
</section>

<section id="payment">
<div class="card">
<h2>💳 پرداخت</h2>
<select id="paymentPlan"><option value="">انتخاب پلن</option></select>
<select id="paymentCurrency">
<option value="IRR">🇮🇷 تومان / ریال — پرداخت ایران</option>
<option value="USD">🌎 USD — پرداخت بین‌المللی</option>
</select>
<button type="button" data-action="createPayment" id="createPaymentBtn">ایجاد سفارش پرداخت</button>
<div id="paymentMsg"></div>
</div>
</section>

<section id="withdraw">
<div class="card">
<h2>💸 درخواست برداشت</h2>
<input id="withdrawAmount" type="number" min="10000" placeholder="مبلغ برداشت به تومان">
<select id="withdrawMethod">
<option value="BANK">🇮🇷 حساب بانکی ایران</option>
<option value="USDT">🌎 USDT</option>
</select>
<input id="withdrawAddress" placeholder="شماره شبا / شماره حساب / آدرس کیف پول">
<button type="button" data-action="withdraw" id="withdrawBtn">ثبت درخواست برداشت</button>
<div id="withdrawMsg"></div>
</div>
</section>

<section id="adminLogin">
<div class="card">
<h2>🛠️ ورود مدیریت</h2>
<input id="adminPassword" type="password" placeholder="رمز مدیریت">
<button type="button" data-action="adminLogin">ورود مدیریت</button>
<div id="adminLoginMsg"></div>
</div>
</section>

<section id="admin">
<div class="card">
<h2>🛠️ پنل مدیریت</h2>
<button type="button" data-action="adminUsers">👥 کاربران</button>
<button type="button" data-action="adminWithdrawals">💸 برداشت‌ها</button>
<button type="button" data-action="adminPayments">💳 پرداخت‌ها</button>
<button type="button" class="danger" data-action="adminLogout">خروج مدیریت</button>
</div>
<div id="adminResult" class="card"></div>
</section>

</div>

<script>
(function(){
"use strict";

var plans = ${JSON.stringify(PLANS)};

function $(id){ return document.getElementById(id); }

function msg(id,text,ok){
  var el=$(id);
  if(!el) return;
  el.innerHTML = '<div class="notice" style="margin-top:12px">' + (ok ? "✅ " : "❌ ") + String(text || "") + "</div>";
}

function setLoading(btn, loading, loadingText, normalText){
  if(!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? (loadingText || "در حال ارسال...") : normalText;
}

document.addEventListener("click",function(event){
  var btn=event.target.closest("button[data-action]");
  if(!btn) return;
  event.preventDefault();
  event.stopPropagation();
  var action=btn.getAttribute("data-action");

  if(action==="page"){ showPage(btn.getAttribute("data-page")); return; }
  if(action==="login"){ login(); return; }
  if(action==="register"){ register(); return; }
  if(action==="forgot"){ forgot(); return; }
  if(action==="askAI"){ askAI(); return; }
  if(action==="selectPlan"){ selectPlan(btn.getAttribute("data-plan")); return; }
  if(action==="createPayment"){ createPayment(); return; }
  if(action==="withdraw"){ withdraw(); return; }
  if(action==="adminLogin"){ adminLogin(); return; }
  if(action==="adminUsers"){ adminUsers(); return; }
  if(action==="adminWithdrawals"){ adminWithdrawals(); return; }
  if(action==="adminPayments"){ adminPayments(); return; }
  if(action==="adminLogout"){ adminLogout(); return; }
  if(action==="logout"){ logout(); return; }
},false);

window.showPage=function(page){
  document.querySelectorAll(".container > section").forEach(function(section){
    section.classList.remove("active");
  });
  var target=$(page);
  if(target){ target.classList.add("active"); }
  if(page==="home"){ loadUser(); loadTransactions(); }
  if(page==="plans"){ loadPlans(); }
  if(page==="payment"){ loadPlansSelect(); }
};

window.api=async function(url,options){
  options=options || {};
  options.headers=options.headers || {};
  options.headers["Content-Type"]="application/json";
  var token=localStorage.getItem("user_token");
  var adminToken=localStorage.getItem("admin_token");
  if(token){ options.headers["Authorization"]="Bearer "+token; }
  if(adminToken){ options.headers["X-Admin-Token"]=adminToken; }

  var response;
  try{
    response = await fetch(url,options);
  }catch(networkErr){
    throw new Error("خطا در اتصال به سرور. اتصال اینترنت را بررسی کنید.");
  }

  var text=await response.text();
  var data;
  try{ data=JSON.parse(text); }
  catch(e){ data={ ok:false, error:text || "پاسخ نامعتبر سرور" }; }

  if(!response.ok){ throw new Error(data.error || "خطای سرور"); }
  return data;
};

window.loadPlans=function(){
  var html="";
  plans.forEach(function(plan){
    html += '<div class="plan"><h3>'+plan.title+'</h3>'+
      '<div class="price">'+ Number(plan.irr).toLocaleString("fa-IR") +" تومان</div>"+
      "<p>قیمت بین‌المللی: $"+plan.usd+"</p>"+
      '<button type="button" data-action="selectPlan" data-plan="'+plan.id+'">انتخاب پلن</button>'+
      "</div>";
  });
  $("plansList").innerHTML=html;
};

window.selectPlan=function(planId){
  var select=$("paymentPlan");
  if(select){ loadPlansSelect(); select.value=planId; }
  showPage("payment");
};

window.loadPlansSelect=function(){
  var select=$("paymentPlan");
  if(!select) return;
  select.innerHTML='<option value="">انتخاب پلن</option>';
  plans.forEach(function(plan){
    var option=document.createElement("option");
    option.value=plan.id;
    option.textContent=plan.title+" — "+Number(plan.irr).toLocaleString("fa-IR")+" تومان / $"+plan.usd;
    select.appendChild(option);
  });
};

window.login=async function(){
  var email=$("loginEmail").value.trim();
  var password=$("loginPassword").value;
  if(!email || !password){ msg("loginMsg","ایمیل و رمز عبور را وارد کنید.",false); return; }
  try{
    var data=await api("/api/login",{ method:"POST", body:JSON.stringify({ email:email, password:password }) });
    if(!data.token){ throw new Error(data.error || "ورود ناموفق بود."); }
    localStorage.setItem("user_token",data.token);
    showPage("home");
  }catch(error){ msg("loginMsg",error.message,false); }
};

window.register=async function(){
  var name=$("registerName").value.trim();
  var email=$("registerEmail").value.trim();
  var password=$("registerPassword").value;
  if(!email || !password){ msg("registerMsg","ایمیل و رمز عبور را وارد کنید.",false); return; }
  try{
    var data=await api("/api/register",{ method:"POST", body:JSON.stringify({ name:name, email:email, password:password }) });
    if(data.token){ localStorage.setItem("user_token",data.token); showPage("home"); }
    else{ msg("registerMsg",data.message || "ثبت‌نام انجام شد.",true); showPage("login"); }
  }catch(error){ msg("registerMsg",error.message,false); }
};

window.forgot=async function(){
  var email=$("forgotEmail").value.trim();
  if(!email){ msg("forgotMsg","ایمیل را وارد کنید.",false); return; }
  try{
    var data=await api("/api/forgot",{ method:"POST", body:JSON.stringify({ email:email }) });
    msg("forgotMsg",data.message || "درخواست بازیابی ثبت شد.",true);
  }catch(error){ msg("forgotMsg",error.message,false); }
};

window.loadUser=async function(){
  try{
    var data=await api("/api/me");
    var user=data.user || data;
    $("profile").innerHTML="<p><b>نام:</b> "+(user.name || "—")+"</p><p><b>ایمیل:</b> "+(user.email || "—")+"</p>";
    $("balance").textContent=Number(user.balance || 0).toLocaleString("fa-IR")+" تومان";
  }catch(error){ $("profile").textContent="لطفاً وارد حساب شوید."; }
};

window.loadTransactions=async function(){
  try{
    var data=await api("/api/transactions");
    var rows=data.transactions || [];
    if(!rows.length){ $("transactions").innerHTML="هنوز تراکنشی ثبت نشده است."; return; }
    var html="<table><thead><tr><th>نوع</th><th>مبلغ</th><th>وضعیت</th></tr></thead><tbody>";
    rows.forEach(function(row){
      html+="<tr><td>"+(row.type || "—")+"</td><td>"+Number(row.amount || 0).toLocaleString("fa-IR")+" تومان</td><td>"+(row.status || "—")+"</td></tr>";
    });
    html+="</tbody></table>";
    $("transactions").innerHTML=html;
  }catch(error){ $("transactions").textContent="هنوز تراکنشی ثبت نشده است."; }
};

window.askAI=async function(){
  var prompt=$("aiPrompt").value.trim();
  if(!prompt){ msg("aiMsg","ابتدا سؤال خود را بنویسید.",false); return; }
  msg("aiMsg","",false); $("aiMsg").innerHTML="";
  $("aiResult").textContent="⏳ در حال دریافت پاسخ...";
  setLoading($("askAIBtn"), true, "در حال ارسال...", "ارسال به هوش مصنوعی");
  try{
    var data=await api("/api/ai",{ method:"POST", body:JSON.stringify({ prompt:prompt }) });
    $("aiResult").textContent=data.answer || data.response || data.result || "پاسخی دریافت نشد.";
  }catch(error){
    $("aiResult").textContent="";
    msg("aiMsg",error.message,false);
  }finally{
    setLoading($("askAIBtn"), false, "", "ارسال به هوش مصنوعی");
  }
};

window.createPayment=async function(){
  var planId=$("paymentPlan").value;
  var currency=$("paymentCurrency").value;
  if(!planId){ msg("paymentMsg","ابتدا یک پلن انتخاب کنید.",false); return; }
  setLoading($("createPaymentBtn"), true, "در حال ایجاد سفارش...", "ایجاد سفارش پرداخت");
  try{
    var data=await api("/api/payment",{ method:"POST", body:JSON.stringify({ plan_id:planId, currency:currency }) });
    if(data.payment_url){
      msg("paymentMsg","در حال انتقال به درگاه...",true);
      setTimeout(function(){ location.href=data.payment_url; },700);
    }else{
      msg("paymentMsg",data.message || "سفارش ایجاد شد.",true);
    }
  }catch(error){ msg("paymentMsg",error.message,false); }
  finally{ setLoading($("createPaymentBtn"), false, "", "ایجاد سفارش پرداخت"); }
};

window.withdraw=async function(){
  var amount=Number($("withdrawAmount").value);
  var method=$("withdrawMethod").value;
  var address=$("withdrawAddress").value.trim();
  if(!amount || amount<10000){ msg("withdrawMsg","حداقل مبلغ برداشت ۱۰,۰۰۰ تومان است.",false); return; }
  if(!address){ msg("withdrawMsg","اطلاعات مقصد برداشت را وارد کنید.",false); return; }
  setLoading($("withdrawBtn"), true, "در حال ثبت...", "ثبت درخواست برداشت");
  try{
    var data=await api("/api/withdraw",{ method:"POST", body:JSON.stringify({ amount:amount, method:method, address:address }) });
    msg("withdrawMsg",data.message || "درخواست برداشت ثبت شد.",true);
  }catch(error){ msg("withdrawMsg",error.message,false); }
  finally{ setLoading($("withdrawBtn"), false, "", "ثبت درخواست برداشت"); }
};

window.adminLogin=async function(){
  var password=$("adminPassword").value;
  if(!password){ msg("adminLoginMsg","رمز مدیریت را وارد کنید.",false); return; }
  try{
    var data=await api("/api/admin/login",{ method:"POST", body:JSON.stringify({ password:password }) });
    if(!data.token){ throw new Error(data.error || "ورود مدیریت ناموفق بود."); }
    localStorage.setItem("admin_token",data.token);
    showPage("admin");
  }catch(error){ msg("adminLoginMsg",error.message,false); }
};

window.adminUsers=async function(){
  try{ var data=await api("/api/admin/users"); $("adminResult").textContent=JSON.stringify(data.users || data,null,2); }
  catch(error){ $("adminResult").textContent=error.message; }
};

window.adminWithdrawals=async function(){
  try{ var data=await api("/api/admin/withdrawals"); $("adminResult").textContent=JSON.stringify(data.withdrawals || data,null,2); }
  catch(error){ $("adminResult").textContent=error.message; }
};

window.adminPayments=async function(){
  try{ var data=await api("/api/admin/payments"); $("adminResult").textContent=JSON.stringify(data.payments || data,null,2); }
  catch(error){ $("adminResult").textContent=error.message; }
};

window.adminLogout=function(){ localStorage.removeItem("admin_token"); showPage("adminLogin"); };
window.logout=function(){ localStorage.removeItem("user_token"); showPage("login"); };

showPage(localStorage.getItem("user_token") ? "home" : "login");

})();
</script>
</body>
</html>`;
