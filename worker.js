// ============================================================
// AI ASSISTANT + USER ACCOUNT + D1 BALANCE + WITHDRAWALS
// Cloudflare Worker
//
// Required bindings:
//   DB  = D1 database
//   AI  = Workers AI (optional; AI endpoint falls back if absent)
//
// Required secret:
//   ADMIN_PASSWORD
// ============================================================

export default {
  async fetch(request, env) {
    try {
      await initDB(env.DB);

      const url = new URL(request.url);
      const path = url.pathname;

      if (request.method === "GET" && path === "/") {
        return htmlResponse(APP_HTML);
      }

      if (path === "/api/register" && request.method === "POST")
        return register(request, env);

      if (path === "/api/login" && request.method === "POST")
        return login(request, env);

      if (path === "/api/logout" && request.method === "POST")
        return logout(request, env);

      if (path === "/api/me" && request.method === "GET")
        return me(request, env);

      if (path === "/api/transactions" && request.method === "GET")
        return transactions(request, env);

      if (path === "/api/withdraw" && request.method === "POST")
        return withdraw(request, env);

      if (path === "/api/ai" && request.method === "POST")
        return ai(request, env);

      if (path === "/api/admin/login" && request.method === "POST")
        return adminLogin(request, env);

      if (path === "/api/admin/me" && request.method === "GET")
        return adminMe(request, env);

      if (path === "/api/admin/users" && request.method === "GET")
        return adminUsers(request, env);

      if (path === "/api/admin/balance" && request.method === "POST")
        return adminBalance(request, env);

      if (path === "/api/admin/user-status" && request.method === "POST")
        return adminUserStatus(request, env);

      if (path === "/api/admin/withdrawals" && request.method === "GET")
        return adminWithdrawals(request, env);

      if (path === "/api/admin/withdrawal" && request.method === "POST")
        return adminWithdrawalAction(request, env);

      return json({ ok: false, error: "Not found" }, 404);

    } catch (e) {
      return json({
        ok: false,
        error: "Server error",
        detail: String(e?.message || e)
      }, 500);
    }
  }
};

// ============================================================
// DATABASE
// ============================================================

async function initDB(DB) {
  if (!DB) {
    throw new Error("D1 binding با نام DB متصل نیست.");
  }

  await DB.batch([
    DB.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        balance REAL NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `),

    DB.prepare(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT NOT NULL UNIQUE,
        user_id INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expires_at TEXT NOT NULL
      )
    `),

    DB.prepare(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `),

    DB.prepare(`
      CREATE TABLE IF NOT EXISTS withdrawals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        method TEXT NOT NULL,
        network TEXT,
        wallet_address TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        processed_at TEXT,
        admin_note TEXT
      )
    `),

    DB.prepare(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expires_at TEXT NOT NULL
      )
    `)
  ]);
}

// ============================================================
// HELPERS
// ============================================================

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store"
    }
  });
}

function htmlResponse(html) {
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
      "cache-control": "no-store"
    }
  });
}

async function body(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return [...bytes]
    .map(x => x.toString(16).padStart(2, "0"))
    .join("");
}

function cleanEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function cleanName(name) {
  return String(name || "").trim();
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cookieToken(request, name) {
  const cookie = request.headers.get("cookie") || "";

  const match = cookie.match(
    new RegExp("(?:^|;\\s*)" + name + "=([^;]+)")
  );

  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name, value, maxAge = 604800) {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

function clearCookie(name) {
  return `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function responseWithCookie(data, cookie, status = 200) {
  const r = json(data, status);
  r.headers.append("Set-Cookie", cookie);
  return r;
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return [...new Uint8Array(hash)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function requireUser(request, env) {
  const token = cookieToken(request, "session");

  if (!token) {
    throw new Error("AUTH_REQUIRED");
  }

  const row = await env.DB.prepare(`
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.balance,
      u.status,
      u.created_at
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ?
      AND datetime(s.expires_at) > datetime('now')
  `).bind(token).first();

  if (!row) {
    throw new Error("AUTH_REQUIRED");
  }

  if (row.status !== "active") {
    throw new Error("ACCOUNT_DISABLED");
  }

  return row;
}

async function requireAdmin(request, env) {
  const token = cookieToken(request, "admin_session");

  if (!token) {
    throw new Error("ADMIN_REQUIRED");
  }

  const row = await env.DB.prepare(`
    SELECT id
    FROM admin_sessions
    WHERE token = ?
      AND datetime(expires_at) > datetime('now')
  `).bind(token).first();

  if (!row) {
    throw new Error("ADMIN_REQUIRED");
  }

  return true;
}

function authError(e) {
  if (e.message === "AUTH_REQUIRED") {
    return json({ ok: false, error: "لطفاً وارد حساب شوید." }, 401);
  }

  if (e.message === "ACCOUNT_DISABLED") {
    return json({ ok: false, error: "حساب شما غیرفعال است." }, 403);
  }

  if (e.message === "ADMIN_REQUIRED") {
    return json({ ok: false, error: "ورود مدیریت لازم است." }, 401);
  }

  return null;
}

// ============================================================
// USER REGISTER
// ============================================================

async function register(request, env) {
  const data = await body(request);

  const fullName = cleanName(data.fullName);
  const email = cleanEmail(data.email);
  const password = String(data.password || "");

  if (!fullName) {
    return json({ ok: false, error: "نام کامل را وارد کنید." }, 400);
  }

  if (!validEmail(email)) {
    return json({ ok: false, error: "ایمیل معتبر نیست." }, 400);
  }

  if (password.length < 6) {
    return json({
      ok: false,
      error: "رمز عبور باید حداقل ۶ کاراکتر باشد."
    }, 400);
  }

  const exists = await env.DB.prepare(`
    SELECT id FROM users WHERE email = ?
  `).bind(email).first();

  if (exists) {
    return json({
      ok: false,
      error: "این ایمیل قبلاً ثبت‌نام کرده است."
    }, 409);
  }

  const passwordHash = await sha256(password);

  const result = await env.DB.prepare(`
    INSERT INTO users
      (full_name, email, password_hash, balance, status)
    VALUES
      (?, ?, ?, 0, 'active')
  `).bind(
    fullName,
    email,
    passwordHash
  ).run();

  const userId = result.meta.last_row_id;

  const token = randomToken();

  await env.DB.prepare(`
    INSERT INTO sessions
      (token, user_id, expires_at)
    VALUES
      (?, ?, datetime('now', '+7 days'))
  `).bind(token, userId).run();

  return responseWithCookie({
    ok: true,
    message: "ثبت‌نام با موفقیت انجام شد.",
    user: {
      id: userId,
      full_name: fullName,
      email,
      balance: 0,
      status: "active"
    }
  }, setCookie("session", token));
}

// ============================================================
// USER LOGIN
// ============================================================

async function login(request, env) {
  const data = await body(request);

  const email = cleanEmail(data.email);
  const password = String(data.password || "");

  const passwordHash = await sha256(password);

  const user = await env.DB.prepare(`
    SELECT
      id,
      full_name,
      email,
      balance,
      status
    FROM users
    WHERE email = ?
      AND password_hash = ?
  `).bind(email, passwordHash).first();

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

  const token = randomToken();

  await env.DB.prepare(`
    INSERT INTO sessions
      (token, user_id, expires_at)
    VALUES
      (?, ?, datetime('now', '+7 days'))
  `).bind(token, user.id).run();

  return responseWithCookie({
    ok: true,
    message: "ورود موفق بود.",
    user
  }, setCookie("session", token));
}

// ============================================================
// LOGOUT
// ============================================================

async function logout(request, env) {
  const token = cookieToken(request, "session");

  if (token) {
    await env.DB.prepare(`
      DELETE FROM sessions WHERE token = ?
    `).bind(token).run();
  }

  return responseWithCookie(
    { ok: true },
    clearCookie("session")
  );
}

// ============================================================
// CURRENT USER
// ============================================================

async function me(request, env) {
  try {
    const user = await requireUser(request, env);

    return json({
      ok: true,
      user
    });

  } catch (e) {
    const er = authError(e);
    if (er) return er;
    throw e;
  }
}

// ============================================================
// TRANSACTIONS
// ============================================================

async function transactions(request, env) {
  try {
    const user = await requireUser(request, env);

    const rows = await env.DB.prepare(`
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
    `).bind(user.id).all();

    return json({
      ok: true,
      transactions: rows.results || []
    });

  } catch (e) {
    const er = authError(e);
    if (er) return er;
    throw e;
  }
}

// ============================================================
// WITHDRAWAL REQUEST
// ============================================================

async function withdraw(request, env) {
  try {
    const user = await requireUser(request, env);
    const data = await body(request);

    const amount = Number(data.amount);
    const method = String(data.method || "USDT").trim();
    const network = String(data.network || "").trim();
    const walletAddress = String(data.walletAddress || "").trim();

    if (!Number.isFinite(amount) || amount <= 0) {
      return json({
        ok: false,
        error: "مبلغ برداشت معتبر نیست."
      }, 400);
    }

    if (amount < 1) {
      return json({
        ok: false,
        error: "حداقل برداشت $1 است."
      }, 400);
    }

    if (!walletAddress) {
      return json({
        ok: false,
        error: "آدرس کیف پول را وارد کنید."
      }, 400);
    }

    if (amount > Number(user.balance)) {
      return json({
        ok: false,
        error: "موجودی کافی نیست."
      }, 400);
    }

    // برداشت را در تراکنش D1 ثبت می‌کنیم.
    // موجودی تا زمان تأیید مدیریت رزرو می‌شود.
    const result = await env.DB.batch([
      env.DB.prepare(`
        UPDATE users
        SET balance = balance - ?
        WHERE id = ?
          AND balance >= ?
          AND status = 'active'
      `).bind(amount, user.id, amount),

      env.DB.prepare(`
        INSERT INTO withdrawals
          (user_id, amount, method, network, wallet_address, status)
        VALUES
          (?, ?, ?, ?, ?, 'pending')
      `).bind(
        user.id,
        amount,
        method,
        network,
        walletAddress
      )
    ]);

    const updated = result[0]?.meta?.changes || 0;

    if (updated !== 1) {
      return json({
        ok: false,
        error: "موجودی کافی نیست یا حساب غیرفعال است."
      }, 400);
    }

    await env.DB.prepare(`
      INSERT INTO transactions
        (user_id, type, amount, description)
      VALUES
        (?, 'withdraw_pending', ?, ?)
    `).bind(
      user.id,
      -amount,
      `درخواست برداشت ${method}${network ? " - " + network : ""}`
    ).run();

    const fresh = await env.DB.prepare(`
      SELECT id, full_name, email, balance, status
      FROM users
      WHERE id = ?
    `).bind(user.id).first();

    return json({
      ok: true,
      message: "درخواست برداشت ثبت شد و در انتظار بررسی مدیریت است.",
      user: fresh
    });

  } catch (e) {
    const er = authError(e);
    if (er) return er;
    throw e;
  }
}

// ============================================================
// AI
// ============================================================

async function ai(request, env) {
  try {
    const user = await requireUser(request, env);
    const data = await body(request);

    const message = String(data.message || "").trim();

    if (!message) {
      return json({
        ok: false,
        error: "سؤال خود را بنویسید."
      }, 400);
    }

    if (!env.AI) {
      return json({
        ok: true,
        answer:
          "دستیار AI فعال است، اما binding با نام AI هنوز به Worker متصل نشده است. " +
          "در Cloudflare یک Workers AI binding با نام AI اضافه کنید."
      });
    }

    const result = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages: [
          {
            role: "system",
            content:
              "You are a helpful Persian-speaking AI assistant. " +
              "Answer clearly, safely and concisely."
          },
          {
            role: "user",
            content: message
          }
        ]
      }
    );

    return json({
      ok: true,
      answer:
        result?.response ||
        result?.result?.response ||
        "پاسخی دریافت نشد."
    });

  } catch (e) {
    const er = authError(e);
    if (er) return er;
    throw e;
  }
}

// ============================================================
// ADMIN LOGIN
// ============================================================

async function adminLogin(request, env) {
  const data = await body(request);

  const password = String(data.password || "");

  if (!env.ADMIN_PASSWORD) {
    return json({
      ok: false,
      error: "ADMIN_PASSWORD در Worker تنظیم نشده است."
    }, 500);
  }

  if (password !== env.ADMIN_PASSWORD) {
    return json({
      ok: false,
      error: "رمز مدیریت اشتباه است."
    }, 401);
  }

  const token = randomToken();

  await env.DB.prepare(`
    INSERT INTO admin_sessions
      (token, expires_at)
    VALUES
      (?, datetime('now', '+7 days'))
  `).bind(token).run();

  return responseWithCookie({
    ok: true,
    message: "ورود مدیریت موفق بود."
  }, setCookie("admin_session", token));
}

// ============================================================
// ADMIN ME
// ============================================================

async function adminMe(request, env) {
  try {
    await requireAdmin(request, env);

    return json({
      ok: true,
      admin: true
    });

  } catch (e) {
    const er = authError(e);
    if (er) return er;
    throw e;
  }
}

// ============================================================
// ADMIN USERS
// ============================================================

async function adminUsers(request, env) {
  try {
    await requireAdmin(request, env);

    const rows = await env.DB.prepare(`
      SELECT
        id,
        full_name,
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

  } catch (e) {
    const er = authError(e);
    if (er) return er;
    throw e;
  }
}

// ============================================================
// ADMIN BALANCE
// ============================================================

async function adminBalance(request, env) {
  try {
    await requireAdmin(request, env);

    const data = await body(request);

    const userId = Number(data.userId);
    const amount = Number(data.amount);
    const note = String(data.note || "تغییر موجودی توسط مدیریت").trim();

    if (!Number.isInteger(userId)) {
      return json({
        ok: false,
        error: "کاربر نامعتبر است."
      }, 400);
    }

    if (!Number.isFinite(amount) || amount === 0) {
      return json({
        ok: false,
        error: "مبلغ معتبر نیست."
      }, 400);
    }

    const user = await env.DB.prepare(`
      SELECT id, balance, status
      FROM users
      WHERE id = ?
    `).bind(userId).first();

    if (!user) {
      return json({
        ok: false,
        error: "کاربر پیدا نشد."
      }, 404);
    }

    const newBalance = Number(user.balance) + amount;

    if (newBalance < 0) {
      return json({
        ok: false,
        error: "موجودی نمی‌تواند منفی شود."
      }, 400);
    }

    await env.DB.batch([
      env.DB.prepare(`
        UPDATE users
        SET balance = ?
        WHERE id = ?
      `).bind(newBalance, userId),

      env.DB.prepare(`
        INSERT INTO transactions
          (user_id, type, amount, description)
        VALUES
          (?, ?, ?, ?)
      `).bind(
        userId,
        amount > 0 ? "admin_credit" : "admin_debit",
        amount,
        note
      )
    ]);

    return json({
      ok: true,
      message: "موجودی با موفقیت تغییر کرد.",
      balance: newBalance
    });

  } catch (e) {
    const er = authError(e);
    if (er) return er;
    throw e;
  }
}

// ============================================================
// ADMIN USER STATUS
// ============================================================

async function adminUserStatus(request, env) {
  try {
    await requireAdmin(request, env);

    const data = await body(request);

    const userId = Number(data.userId);
    const status =
      data.status === "disabled"
        ? "disabled"
        : "active";

    await env.DB.prepare(`
      UPDATE users
      SET status = ?
      WHERE id = ?
    `).bind(status, userId).run();

    return json({
      ok: true,
      message:
        status === "active"
          ? "حساب فعال شد."
          : "حساب غیرفعال شد."
    });

  } catch (e) {
    const er = authError(e);
    if (er) return er;
    throw e;
  }
}

// ============================================================
// ADMIN WITHDRAWALS
// ============================================================

async function adminWithdrawals(request, env) {
  try {
    await requireAdmin(request, env);

    const rows = await env.DB.prepare(`
      SELECT
        w.id,
        w.user_id,
        u.full_name,
        u.email,
        w.amount,
        w.method,
        w.network,
        w.wallet_address,
        w.status,
        w.created_at,
        w.processed_at,
        w.admin_note
      FROM withdrawals w
      JOIN users u ON u.id = w.user_id
      ORDER BY w.id DESC
      LIMIT 200
    `).all();

    return json({
      ok: true,
      withdrawals: rows.results || []
    });

  } catch (e) {
    const er = authError(e);
    if (er) return er;
    throw e;
  }
}

// ============================================================
// ADMIN WITHDRAWAL ACTION
// ============================================================

async function adminWithdrawalAction(request, env) {
  try {
    await requireAdmin(request, env);

    const data = await body(request);

    const withdrawalId = Number(data.withdrawalId);
    const action = String(data.action || "").trim();
    const note = String(data.note || "").trim();

    if (!Number.isInteger(withdrawalId)) {
      return json({
        ok: false,
        error: "درخواست برداشت نامعتبر است."
      }, 400);
    }

    if (!["approve", "reject"].includes(action)) {
      return json({
        ok: false,
        error: "عملیات نامعتبر است."
      }, 400);
    }

    const w = await env.DB.prepare(`
      SELECT
        id,
        user_id,
        amount,
        status
      FROM withdrawals
      WHERE id = ?
    `).bind(withdrawalId).first();

    if (!w) {
      return json({
        ok: false,
        error: "درخواست برداشت پیدا نشد."
      }, 404);
    }

    if (w.status !== "pending") {
      return json({
        ok: false,
        error: "این درخواست قبلاً پردازش شده است."
      }, 400);
    }

    if (action === "approve") {

      // تأیید داخلی درخواست.
      // پرداخت واقعی USDT باید توسط سرویس/کیف پول متصل انجام شود.
      await env.DB.batch([
        env.DB.prepare(`
          UPDATE withdrawals
          SET
            status = 'approved',
            processed_at = CURRENT_TIMESTAMP,
            admin_note = ?
          WHERE id = ?
            AND status = 'pending'
        `).bind(note, withdrawalId),

        env.DB.prepare(`
          INSERT INTO transactions
            (user_id, type, amount, description)
          VALUES
            (?, 'withdraw_approved', 0, ?)
        `).bind(
          w.user_id,
          "درخواست برداشت تأیید شد."
        )
      ]);

      return json({
        ok: true,
        message:
          "درخواست برداشت تأیید شد. پرداخت واقعی باید توسط درگاه/کیف پول متصل انجام شود."
      });
    }

    // REJECT:
    // مبلغ رزروشده به موجودی کاربر برمی‌گردد.
    await env.DB.batch([
      env.DB.prepare(`
        UPDATE withdrawals
        SET
          status = 'rejected',
          processed_at = CURRENT_TIMESTAMP,
          admin_note = ?
        WHERE id = ?
          AND status = 'pending'
      `).bind(note, withdrawalId),

      env.DB.prepare(`
        UPDATE users
        SET balance = balance + ?
        WHERE id = ?
      `).bind(w.amount, w.user_id),

      env.DB.prepare(`
        INSERT INTO transactions
          (user_id, type, amount, description)
        VALUES
          (?, 'withdraw_rejected', ?, ?)
      `).bind(
        w.user_id,
        w.amount,
        note || "برداشت رد شد و مبلغ به موجودی برگشت."
      )
    ]);

    return json({
      ok: true,
      message: "برداشت رد شد و مبلغ به موجودی کاربر برگشت."
    });

  } catch (e) {
    const er = authError(e);
    if (er) return er;
    throw e;
  }
}

// ============================================================
// HTML
// ============================================================

const APP_HTML = String.raw`<!DOCTYPE html>
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

.container{
  max-width:1000px;
  margin:auto;
  padding:16px;
}

.card{
  background:#fff;
  border-radius:18px;
  padding:18px;
  margin-bottom:16px;
  box-shadow:0 5px 25px rgba(0,0,0,.07);
}

h1,h2,h3{
  margin-top:0;
}

input,select,textarea{
  width:100%;
  padding:13px;
  border:1px solid #d9dfeb;
  border-radius:12px;
  margin:6px 0 10px;
  font-size:15px;
}

textarea{
  min-height:100px;
  resize:vertical;
}

button{
  border:0;
  border-radius:12px;
  padding:12px 16px;
  cursor:pointer;
  background:#2563eb;
  color:white;
  font-size:15px;
  margin:4px;
}

button.secondary{
  background:#64748b;
}

button.danger{
  background:#dc2626;
}

button.success{
  background:#16a34a;
}

button.dark{
  background:#111827;
}

.hidden{
  display:none !important;
}

.top{
  display:flex;
  gap:10px;
  align-items:center;
  justify-content:space-between;
  flex-wrap:wrap;
}

.balance{
  font-size:30px;
  font-weight:bold;
}

.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:12px;
}

.nav{
  display:flex;
  flex-wrap:wrap;
  gap:5px;
}

.nav button{
  background:#e8eefc;
  color:#1e3a8a;
}

.nav button.active{
  background:#2563eb;
  color:white;
}

.status{
  padding:5px 9px;
  border-radius:20px;
  background:#dcfce7;
  color:#166534;
  display:inline-block;
}

.item{
  border:1px solid #e5e7eb;
  border-radius:14px;
  padding:12px;
  margin:8px 0;
}

.small{
  color:#64748b;
  font-size:13px;
}

pre{
  white-space:pre-wrap;
  word-break:break-word;
}

#toast{
  position:fixed;
  bottom:15px;
  left:15px;
  right:15px;
  max-width:600px;
  margin:auto;
  background:#111827;
  color:#fff;
  padding:14px;
  border-radius:12px;
  display:none;
  z-index:9999;
}
</style>
</head>

<body>

<div class="container">

<div class="card">
  <div class="top">
    <div>
      <h1>🤖 دستیار هوش مصنوعی</h1>
      <div class="small">
        دستیار هوشمند + حساب کاربری + موجودی + برداشت
      </div>
    </div>

    <div id="authButtons">
      <button onclick="showAuth('login')">ورود</button>
      <button onclick="showAuth('register')">ثبت‌نام</button>
    </div>
  </div>
</div>

<div id="authBox" class="card hidden">

  <h2 id="authTitle">ورود</h2>

  <div id="nameBox">
    <label>نام کامل</label>
    <input id="fullName" placeholder="نام کامل">
  </div>

  <label>ایمیل</label>
  <input id="email" type="email" placeholder="example@email.com">

  <label>رمز عبور</label>
  <input id="password" type="password" placeholder="حداقل ۶ کاراکتر">

  <button onclick="submitAuth()">ادامه</button>
  <button class="secondary" onclick="hideAuth()">بستن</button>

</div>

<div id="app" class="hidden">

  <div class="card">

    <div class="top">
      <div>
        <div class="small">کاربر</div>
        <h2 id="userName">-</h2>
      </div>

      <div>
        <div class="small">موجودی</div>
        <div class="balance" id="balance">$0.00</div>
      </div>

      <div>
        <div class="small">وضعیت حساب</div>
        <span class="status" id="userStatus">فعال</span>
      </div>
    </div>

    <div class="nav">
      <button onclick="showSection('ai')">🤖 دستیار AI</button>
      <button onclick="showSection('account')">👤 حساب</button>
      <button onclick="showSection('withdraw')">💵 برداشت</button>
      <button onclick="showSection('transactions')">📊 تراکنش‌ها</button>
      <button class="secondary" onclick="logoutUser()">خروج</button>
    </div>

  </div>

  <div id="aiSection" class="card">

    <h2>💬 دستیار هوش مصنوعی</h2>

    <div id="chat"></div>

    <textarea
      id="question"
      placeholder="سوال خود را بنویسید..."
    ></textarea>

    <button onclick="askAI()">ارسال</button>
    <button class="secondary" onclick="clearChat()">🗑️ پاک کردن گفتگو</button>

  </div>

  <div id="accountSection" class="card hidden">

    <h2>👤 حساب کاربری</h2>

    <div class="grid">

      <div class="item">
        <div class="small">نام کامل</div>
        <strong id="accountName">-</strong>
      </div>

      <div class="item">
        <div class="small">ایمیل</div>
        <strong id="accountEmail">-</strong>
      </div>

      <div class="item">
        <div class="small">موجودی</div>
        <strong id="accountBalance">$0.00</strong>
      </div>

      <div class="item">
        <div class="small">وضعیت</div>
        <strong id="accountStatus">فعال</strong>
      </div>

    </div>

  </div>

  <div id="withdrawSection" class="card hidden">

    <h2>💵 برداشت</h2>

    <div class="small">
      درخواست برداشت پس از ثبت توسط مدیریت بررسی می‌شود.
    </div>

    <label>مبلغ</label>
    <input id="withdrawAmount" type="number" min="1" step="0.01" placeholder="مثلاً 10">

    <label>روش برداشت</label>
    <select id="withdrawMethod">
      <option value="USDT">USDT</option>
    </select>

    <label>شبکه</label>
    <select id="withdrawNetwork">
      <option value="TRC20">TRC20</option>
      <option value="BEP20">BEP20</option>
      <option value="ERC20">ERC20</option>
      <option value="TON">TON</option>
    </select>

    <label>آدرس کیف پول</label>
    <input
      id="walletAddress"
      placeholder="آدرس کیف پول دریافت‌کننده"
    >

    <button onclick="requestWithdraw()">ثبت درخواست برداشت</button>

  </div>

  <div id="transactionsSection" class="card hidden">

    <h2>📊 تراکنش‌ها</h2>

    <div id="transactions"></div>

  </div>

  <div class="card">

    <h2>🛠️ مدیریت</h2>

    <button onclick="showAdminLogin()">
      ورود مدیریت
    </button>

    <div id="adminLoginBox" class="hidden">

      <input
        id="adminPassword"
        type="password"
        placeholder="رمز مدیریت"
      >

      <button onclick="adminLogin()">
        ورود
      </button>

    </div>

  </div>

  <div id="adminPanel" class="hidden">

    <div class="card">

      <h2>🛠️ پنل مدیریت</h2>

      <div class="nav">
        <button onclick="adminShow('users')">👥 کاربران</button>
        <button onclick="adminShow('withdrawals')">💵 برداشت‌ها</button>
      </div>

    </div>

    <div id="adminUsersSection" class="card">

      <h2>👥 کاربران</h2>

      <div id="users"></div>

    </div>

    <div id="adminWithdrawalsSection" class="card hidden">

      <h2>💵 درخواست‌های برداشت</h2>

      <div id="withdrawals"></div>

    </div>

  </div>

</div>

</div>

<div id="toast"></div>

<script>
let authMode = "login";
let currentUser = null;

function toast(message){
  const el = document.getElementById("toast");
  el.textContent = message;
  el.style.display = "block";

  setTimeout(() => {
    el.style.display = "none";
  }, 3500);
}

async function api(path, options = {}){
  const r = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers: {
      "content-type":"application/json",
      ...(options.headers || {})
    }
  });

  let data;

  try {
    data = await r.json();
  } catch {
    data = {
      ok:false,
      error:"پاسخ نامعتبر از سرور"
    };
  }

  if (!r.ok && !data.error) {
    data.error = "خطایی رخ داد.";
  }

  return data;
}

function showAuth(mode){
  authMode = mode;

  document.getElementById("authBox").classList.remove("hidden");

  document.getElementById("authTitle").textContent =
    mode === "login" ? "ورود" : "ثبت‌نام";

  document.getElementById("nameBox").classList.toggle(
    "hidden",
    mode === "login"
  );
}

function hideAuth(){
  document.getElementById("authBox").classList.add("hidden");
}

async function submitAuth(){

  const fullName =
    document.getElementById("fullName").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value;

  const path =
    authMode === "login"
      ? "/api/login"
      : "/api/register";

  const data = await api(path, {
    method:"POST",
    body:JSON.stringify({
      fullName,
      email,
      password
    })
  });

  if (!data.ok) {
    toast(data.error || "خطا");
    return;
  }

  toast(data.message || "موفق");

  hideAuth();

  await loadMe();
}

async function loadMe(){

  const data = await api("/api/me");

  if (!data.ok) {
    document.getElementById("app").classList.add("hidden");
    document.getElementById("authButtons").classList.remove("hidden");
    return;
  }

  currentUser = data.user;

  document.getElementById("app").classList.remove("hidden");
  document.getElementById("authButtons").classList.add("hidden");

  renderUser();

  loadTransactions();
}

function renderUser(){

  if (!currentUser) return;

  const balance =
    Number(currentUser.balance || 0).toFixed(2);

  document.getElementById("userName").textContent =
    currentUser.full_name;

  document.getElementById("balance").textContent =
    "$" + balance;

  document.getElementById("userStatus").textContent =
    currentUser.status === "active"
      ? "فعال"
      : "غیرفعال";

  document.getElementById("accountName").textContent =
    currentUser.full_name;

  document.getElementById("accountEmail").textContent =
    currentUser.email;

  document.getElementById("accountBalance").textContent =
    "$" + balance;

  document.getElementById("accountStatus").textContent =
    currentUser.status === "active"
      ? "فعال"
      : "غیرفعال";
}

async function logoutUser(){

  await api("/api/logout", {
    method:"POST",
    body:"{}"
  });

  currentUser = null;

  document.getElementById("app").classList.add("hidden");
  document.getElementById("authButtons").classList.remove("hidden");

  toast("خارج شدید.");
}

function showSection(name){

  const sections = [
    "aiSection",
    "accountSection",
    "withdrawSection",
    "transactionsSection"
  ];

  sections.forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });

  const map = {
    ai:"aiSection",
    account:"accountSection",
    withdraw:"withdrawSection",
    transactions:"transactionsSection"
  };

  document.getElementById(map[name]).classList.remove("hidden");

  if (name === "transactions") {
    loadTransactions();
  }
}

async function askAI(){

  const input = document.getElementById("question");
  const message = input.value.trim();

  if (!message) {
    toast("سؤال خود را بنویسید.");
    return;
  }

  const chat = document.getElementById("chat");

  chat.innerHTML +=
    '<div class="item"><strong>شما:</strong><br>' +
    escapeHtml(message) +
    '</div>';

  input.value = "";

  const data = await api("/api/ai", {
    method:"POST",
    body:JSON.stringify({message})
  });

  chat.innerHTML +=
    '<div class="item"><strong>🤖 دستیار:</strong><br>' +
    escapeHtml(data.answer || data.error || "خطا") +
    '</div>';

  chat.scrollIntoView({
    behavior:"smooth",
    block:"end"
  });
}

function clearChat(){
  document.getElementById("chat").innerHTML = "";
}

function escapeHtml(value){
  return String(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

async function loadTransactions(){

  const data = await api("/api/transactions");

  if (!data.ok) return;

  const box = document.getElementById("transactions");

  if (!data.transactions.length) {
    box.innerHTML =
      '<div class="item">هنوز تراکنشی وجود ندارد.</div>';
    return;
  }

  box.innerHTML = data.transactions.map(t => `
    <div class="item">
      <strong>${escapeHtml(t.type)}</strong>
      <br>
      مبلغ:
      $${Number(t.amount || 0).toFixed(2)}
      <br>
      <span class="small">
        ${escapeHtml(t.description || "")}
      </span>
      <br>
      <span class="small">
        ${escapeHtml(t.created_at || "")}
      </span>
    </div>
  `).join("");
}

async function requestWithdraw(){

  const amount =
    Number(document.getElementById("withdrawAmount").value);

  const method =
    document.getElementById("withdrawMethod").value;

  const network =
    document.getElementById("withdrawNetwork").value;

  const walletAddress =
    document.getElementById("walletAddress").value.trim();

  if (!amount || amount <= 0) {
    toast("مبلغ را وارد کنید.");
    return;
  }

  if (!walletAddress) {
    toast("آدرس کیف پول را وارد کنید.");
    return;
  }

  const data = await api("/api/withdraw", {
    method:"POST",
    body:JSON.stringify({
      amount,
      method,
      network,
      walletAddress
    })
  });

  if (!data.ok) {
    toast(data.error || "خطا");
    return;
  }

  toast(data.message);

  currentUser = data.user;
  renderUser();

  document.getElementById("withdrawAmount").value = "";
  document.getElementById("walletAddress").value = "";

  loadTransactions();
}

function showAdminLogin(){
  document
    .getElementById("adminLoginBox")
    .classList.toggle("hidden");
}

async function adminLogin(){

  const password =
    document.getElementById("adminPassword").value;

  const data = await api("/api/admin/login", {
    method:"POST",
    body:JSON.stringify({password})
  });

  if (!data.ok) {
    toast(data.error || "خطا");
    return;
  }

  toast(data.message);

  document
    .getElementById("adminPanel")
    .classList.remove("hidden");

  loadAdminUsers();
}

function adminShow(name){

  document
    .getElementById("adminUsersSection")
    .classList.toggle("hidden", name !== "users");

  document
    .getElementById("adminWithdrawalsSection")
    .classList.toggle("hidden", name !== "withdrawals");

  if (name === "users") {
    loadAdminUsers();
  }

  if (name === "withdrawals") {
    loadAdminWithdrawals();
  }
}

async function loadAdminUsers(){

  const data = await api("/api/admin/users");

  if (!data.ok) {
    toast(data.error || "خطا");
    return;
  }

  const box = document.getElementById("users");

  if (!data.users.length) {
    box.innerHTML =
      '<div class="item">کاربری وجود ندارد.</div>';
    return;
  }

  box.innerHTML = data.users.map(u => `

    <div class="item">

      <strong>
        ${escapeHtml(u.full_name)}
      </strong>

      <br>

      ایمیل:
      ${escapeHtml(u.email)}

      <br>

      موجودی:
      <strong>
        $${Number(u.balance || 0).toFixed(2)}
      </strong>

      <br>

      وضعیت:
      ${u.status === "active" ? "فعال" : "غیرفعال"}

      <br><br>

      <button
        onclick="changeBalance(${u.id})"
      >
        افزایش/کاهش موجودی
      </button>

      <button
        class="${u.status === "active" ? "danger" : "success"}"
        onclick="changeStatus(${u.id}, '${u.status}')"
      >
        ${
          u.status === "active"
            ? "غیرفعال کردن"
            : "فعال کردن"
        }
      </button>

    </div>

  `).join("");
}

async function changeBalance(userId){

  const value =
    prompt("مبلغ را وارد نمایید. برای کاهش عدد منفی بنویسید:");

  if (value === null) return;

  const amount = Number(value);

  if (!Number.isFinite(amount) || amount === 0) {
    toast("مبلغ نامعتبر است.");
    return;
  }

  const note =
    prompt("توضیح تراکنش:", "تغییر موجودی توسط مدیریت")
    || "تغییر موجودی توسط مدیریت";

  const data = await api("/api/admin/balance", {
    method:"POST",
    body:JSON.stringify({
      userId,
      amount,
      note
    })
  });

  if (!data.ok) {
    toast(data.error || "خطا");
    return;
  }

  toast(data.message);
  loadAdminUsers();
  loadMe();
}

async function changeStatus(userId, oldStatus){

  const status =
    oldStatus === "active"
      ? "disabled"
      : "active";

  const data = await api("/api/admin/user-status", {
    method:"POST",
    body:JSON.stringify({
      userId,
      status
    })
  });

  if (!data.ok) {
    toast(data.error || "خطا");
    return;
  }

  toast(data.message);
  loadAdminUsers();
}

async function loadAdminWithdrawals(){

  const data = await api("/api/admin/withdrawals");

  if (!data.ok) {
    toast(data.error || "خطا");
    return;
  }

  const box =
    document.getElementById("withdrawals");

  if (!data.withdrawals.length) {
    box.innerHTML =
      '<div class="item">درخواست برداشتی وجود ندارد.</div>';
    return;
  }

  box.innerHTML = data.withdrawals.map(w => `

    <div class="item">

      <strong>
        ${escapeHtml(w.full_name)}
      </strong>

      <br>

      ایمیل:
      ${escapeHtml(w.email)}

      <br>

      مبلغ:
      <strong>
        $${Number(w.amount || 0).toFixed(2)}
      </strong>

      <br>

      روش:
      ${escapeHtml(w.method)}

      <br>

      شبکه:
      ${escapeHtml(w.network || "-")}

      <br>

      آدرس:
      <div style="word-break:break-all">
        ${escapeHtml(w.wallet_address)}
      </div>

      <br>

      وضعیت:
      <strong>
        ${escapeHtml(w.status)}
      </strong>

      <br>

      تاریخ:
      ${escapeHtml(w.created_at || "")}

      ${
        w.status === "pending"
        ? `
          <br><br>

          <button
            class="success"
            onclick="withdrawAction(${w.id}, 'approve')"
          >
            ✅ تأیید برداشت
          </button>

          <button
            class="danger"
            onclick="withdrawAction(${w.id}, 'reject')"
          >
            ❌ رد برداشت
          </button>
        `
        : ""
      }

    </div>

  `).join("");
}

async function withdrawAction(id, action){

  const note =
    prompt(
      action === "approve"
        ? "توضیح تأیید:"
        : "دلیل رد برداشت:",
      ""
    ) || "";

  const data = await api("/api/admin/withdrawal", {
    method:"POST",
    body:JSON.stringify({
      withdrawalId:id,
      action,
      note
    })
  });

  if (!data.ok) {
    toast(data.error || "خطا");
    return;
  }

  toast(data.message);
  loadAdminWithdrawals();
  loadAdminUsers();
  loadMe();
}

window.addEventListener("load", () => {
  loadMe();
});
</script>

</body>
</html>`;
