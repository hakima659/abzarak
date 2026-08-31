export default {
  async fetch(request, env) {
    try {
      await initDB(env.DB);

      const url = new URL(request.url);
      const path = url.pathname;

      if (request.method === "GET" && path === "/") {
        return htmlResponse(APP_HTML);
      }

      if (path === "/api/register" && request.method === "POST") {
        return register(request, env);
      }

      if (path === "/api/login" && request.method === "POST") {
        return login(request, env);
      }

      if (path === "/api/logout" && request.method === "POST") {
        return logout(request, env);
      }

      if (path === "/api/me" && request.method === "GET") {
        return me(request, env);
      }

      if (path === "/api/transactions" && request.method === "GET") {
        return transactions(request, env);
      }

      if (path === "/api/withdraw" && request.method === "POST") {
        return withdraw(request, env);
      }

      if (path === "/api/ai" && request.method === "POST") {
        return ai(request, env);
      }

      if (path === "/api/admin/login" && request.method === "POST") {
        return adminLogin(request, env);
      }

      if (path === "/api/admin/me" && request.method === "GET") {
        return adminMe(request, env);
      }

      if (path === "/api/admin/users" && request.method === "GET") {
        return adminUsers(request, env);
      }

      if (path === "/api/admin/balance" && request.method === "POST") {
        return adminBalance(request, env);
      }

      if (path === "/api/admin/status" && request.method === "POST") {
        return adminStatus(request, env);
      }

      if (path === "/api/admin/withdrawals" && request.method === "GET") {
        return adminWithdrawals(request, env);
      }

      if (path === "/api/admin/withdrawal" && request.method === "POST") {
        return adminWithdrawal(request, env);
      }

      return json({ ok: false, error: "مسیر پیدا نشد" }, 404);

    } catch (e) {
      return json({
        ok: false,
        error: "خطای سرور",
        detail: String(e.message || e)
      }, 500);
    }
  }
};


/* =========================================================
   DATABASE
========================================================= */

async function initDB(DB) {
  await DB.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      balance REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  await DB.prepare(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token_hash TEXT NOT NULL UNIQUE,
      user_id INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  await DB.prepare(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  await DB.prepare(`
    CREATE TABLE IF NOT EXISTS withdrawals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      method TEXT NOT NULL,
      destination TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      processed_at TEXT
    )
  `).run();
}


/* =========================================================
   HELPERS
========================================================= */

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store",
      ...extraHeaders
    }
  });
}

function htmlResponse(html) {
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=UTF-8"
    }
  });
}

async function readJSON(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function cookie(request, name) {
  const raw = request.headers.get("Cookie") || "";
  const parts = raw.split(";");

  for (const part of parts) {
    const [k, ...v] = part.trim().split("=");

    if (k === name) {
      return decodeURIComponent(v.join("="));
    }
  }

  return null;
}

function setCookie(name, value, maxAge) {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

function deleteCookie(name) {
  return `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function money(n) {
  return Number(Number(n || 0).toFixed(2));
}


/* =========================================================
   PASSWORD HASH
========================================================= */

function bytesToBase64(bytes) {
  let binary = "";

  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }

  return btoa(binary);
}

function base64ToBytes(str) {
  const binary = atob(str);
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}

function randomBytes(length = 16) {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return arr;
}

async function hashPassword(password, saltBytes = randomBytes(16)) {
  const salt = bytesToBase64(saltBytes);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations: 120000,
      hash: "SHA-256"
    },
    keyMaterial,
    256
  );

  const hash = bytesToBase64(new Uint8Array(bits));

  return `${salt}.${hash}`;
}

async function verifyPassword(password, stored) {
  const [salt, expected] = String(stored).split(".");

  if (!salt || !expected) return false;

  const result = await hashPassword(
    password,
    base64ToBytes(salt)
  );

  return result.split(".")[1] === expected;
}


/* =========================================================
   SESSION
========================================================= */

async function sha256(text) {
  const data = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );

  return bytesToBase64(new Uint8Array(data));
}

async function createSession(DB, userId) {
  const tokenBytes = randomBytes(32);
  const token = bytesToBase64(tokenBytes);
  const tokenHash = await sha256(token);

  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;

  await DB.prepare(`
    INSERT INTO sessions (token_hash, user_id, expires_at)
    VALUES (?, ?, ?)
  `)
    .bind(tokenHash, userId, expires)
    .run();

  return token;
}

async function getUser(request, env) {
  const token = cookie(request, "session");

  if (!token) return null;

  const tokenHash = await sha256(token);

  const result = await env.DB.prepare(`
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.balance,
      u.status,
      u.created_at
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ?
      AND s.expires_at > ?
    LIMIT 1
  `)
    .bind(tokenHash, Date.now())
    .first();

  if (!result) return null;

  return result;
}

async function requireUser(request, env) {
  const user = await getUser(request, env);

  if (!user) {
    return {
      error: json({
        ok: false,
        error: "ابتدا وارد حساب شوید"
      }, 401)
    };
  }

  if (user.status !== "active") {
    return {
      error: json({
        ok: false,
        error: "حساب شما غیرفعال است"
      }, 403)
    };
  }

  return { user };
}


/* =========================================================
   REGISTER
========================================================= */

async function register(request, env) {
  const data = await readJSON(request);

  const fullName = String(data.full_name || "").trim();
  const email = String(data.email || "").trim().toLowerCase();
  const password = String(data.password || "");

  if (fullName.length < 2) {
    return json({
      ok: false,
      error: "نام کامل را وارد کنید"
    }, 400);
  }

  if (!validEmail(email)) {
    return json({
      ok: false,
      error: "ایمیل معتبر نیست"
    }, 400);
  }

  if (password.length < 6) {
    return json({
      ok: false,
      error: "رمز عبور باید حداقل ۶ کاراکتر باشد"
    }, 400);
  }

  const exists = await env.DB.prepare(`
    SELECT id FROM users WHERE email = ? LIMIT 1
  `)
    .bind(email)
    .first();

  if (exists) {
    return json({
      ok: false,
      error: "این ایمیل قبلاً ثبت شده است"
    }, 409);
  }

  const passwordHash = await hashPassword(password);

  const result = await env.DB.prepare(`
    INSERT INTO users
      (full_name, email, password_hash, balance, status)
    VALUES
      (?, ?, ?, 0, 'active')
  `)
    .bind(fullName, email, passwordHash)
    .run();

  const userId = result.meta.last_row_id;

  await env.DB.prepare(`
    INSERT INTO transactions
      (user_id, type, amount, description)
    VALUES
      (?, 'account', 0, 'ایجاد حساب کاربری')
  `)
    .bind(userId)
    .run();

  const token = await createSession(env.DB, userId);

  return json({
    ok: true,
    message: "ثبت‌نام با موفقیت انجام شد",
    user: {
      id: userId,
      full_name: fullName,
      email,
      balance: 0,
      status: "active"
    }
  }, 201, {
    "Set-Cookie": setCookie("session", token, 604800)
  });
}


/* =========================================================
   LOGIN
========================================================= */

async function login(request, env) {
  const data = await readJSON(request);

  const email = String(data.email || "").trim().toLowerCase();
  const password = String(data.password || "");

  const user = await env.DB.prepare(`
    SELECT * FROM users
    WHERE email = ?
    LIMIT 1
  `)
    .bind(email)
    .first();

  if (!user) {
    return json({
      ok: false,
      error: "ایمیل یا رمز عبور اشتباه است"
    }, 401);
  }

  const valid = await verifyPassword(
    password,
    user.password_hash
  );

  if (!valid) {
    return json({
      ok: false,
      error: "ایمیل یا رمز عبور اشتباه است"
    }, 401);
  }

  if (user.status !== "active") {
    return json({
      ok: false,
      error: "حساب شما غیرفعال است"
    }, 403);
  }

  const token = await createSession(env.DB, user.id);

  return json({
    ok: true,
    message: "ورود موفق بود",
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      balance: money(user.balance),
      status: user.status
    }
  }, 200, {
    "Set-Cookie": setCookie("session", token, 604800)
  });
}


/* =========================================================
   LOGOUT
========================================================= */

async function logout(request, env) {
  const token = cookie(request, "session");

  if (token) {
    const tokenHash = await sha256(token);

    await env.DB.prepare(`
      DELETE FROM sessions WHERE token_hash = ?
    `)
      .bind(tokenHash)
      .run();
  }

  return json({
    ok: true,
    message: "خارج شدید"
  }, 200, {
    "Set-Cookie": deleteCookie("session")
  });
}


/* =========================================================
   CURRENT USER
========================================================= */

async function me(request, env) {
  const user = await getUser(request, env);

  if (!user) {
    return json({
      ok: false,
      logged_in: false
    });
  }

  return json({
    ok: true,
    logged_in: true,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      balance: money(user.balance),
      status: user.status,
      created_at: user.created_at
    }
  });
}


/* =========================================================
   TRANSACTIONS
========================================================= */

async function transactions(request, env) {
  const auth = await requireUser(request, env);

  if (auth.error) return auth.error;

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
  `)
    .bind(auth.user.id)
    .all();

  return json({
    ok: true,
    transactions: rows.results || []
  });
}


/* =========================================================
   WITHDRAW
========================================================= */

async function withdraw(request, env) {
  const auth = await requireUser(request, env);

  if (auth.error) return auth.error;

  const data = await readJSON(request);

  const amount = money(data.amount);
  const method = String(data.method || "").trim();
  const destination = String(data.destination || "").trim();

  if (!amount || amount <= 0) {
    return json({
      ok: false,
      error: "مبلغ برداشت معتبر نیست"
    }, 400);
  }

  if (amount < 10) {
    return json({
      ok: false,
      error: "حداقل مبلغ برداشت $10 است"
    }, 400);
  }

  if (!method || !destination) {
    return json({
      ok: false,
      error: "روش برداشت و مقصد را وارد کنید"
    }, 400);
  }

  const user = await env.DB.prepare(`
    SELECT balance, status
    FROM users
    WHERE id = ?
  `)
    .bind(auth.user.id)
    .first();

  if (!user || user.status !== "active") {
    return json({
      ok: false,
      error: "حساب فعال نیست"
    }, 403);
  }

  if (Number(user.balance) < amount) {
    return json({
      ok: false,
      error: "موجودی کافی نیست"
    }, 400);
  }

  const pending = await env.DB.prepare(`
    SELECT id
    FROM withdrawals
    WHERE user_id = ?
      AND status = 'pending'
    LIMIT 1
  `)
    .bind(auth.user.id)
    .first();

  if (pending) {
    return json({
      ok: false,
      error: "یک درخواست برداشت در حال بررسی دارید"
    }, 400);
  }

  await env.DB.prepare(`
    UPDATE users
    SET balance = balance - ?
    WHERE id = ?
  `)
    .bind(amount, auth.user.id)
    .run();

  const result = await env.DB.prepare(`
    INSERT INTO withdrawals
      (user_id, amount, method, destination, status)
    VALUES
      (?, ?, ?, ?, 'pending')
  `)
    .bind(
      auth.user.id,
      amount,
      method,
      destination
    )
    .run();

  await env.DB.prepare(`
    INSERT INTO transactions
      (user_id, type, amount, description)
    VALUES
      (?, 'withdrawal_pending', ?, ?)
  `)
    .bind(
      auth.user.id,
      -amount,
      `درخواست برداشت #${result.meta.last_row_id}`
    )
    .run();

  return json({
    ok: true,
    message: "درخواست برداشت ثبت شد",
    withdrawal_id: result.meta.last_row_id
  });
}


/* =========================================================
   AI ASSISTANT
========================================================= */

async function ai(request, env) {
  const auth = await requireUser(request, env);

  if (auth.error) return auth.error;

  const data = await readJSON(request);
  const question = String(data.question || "").trim();

  if (!question) {
    return json({
      ok: false,
      error: "سوال را وارد کنید"
    }, 400);
  }

  if (!env.AI) {
    return json({
      ok: false,
      error: "Workers AI به Worker متصل نیست"
    }, 500);
  }

  const result = await env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct",
    {
      messages: [
        {
          role: "system",
          content:
            "You are a helpful Persian-speaking AI assistant. Answer clearly and safely in Persian."
        },
        {
          role: "user",
          content: question
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
}


/* =========================================================
   ADMIN LOGIN
========================================================= */

async function adminLogin(request, env) {
  const data = await readJSON(request);

  const password = String(data.password || "");

  if (!env.ADMIN_PASSWORD) {
    return json({
      ok: false,
      error: "ADMIN_PASSWORD تنظیم نشده است"
    }, 500);
  }

  if (password !== env.ADMIN_PASSWORD) {
    return json({
      ok: false,
      error: "رمز مدیریت اشتباه است"
    }, 401);
  }

  const token = bytesToBase64(randomBytes(32));

  const hash = await sha256(token);

  await env.DB.prepare(`
    DELETE FROM sessions
    WHERE user_id = 0
  `).run();

  await env.DB.prepare(`
    INSERT INTO sessions
      (token_hash, user_id, expires_at)
    VALUES
      (?, 0, ?)
  `)
    .bind(
      "ADMIN_" + hash,
      Date.now() + 24 * 60 * 60 * 1000
    )
    .run();

  return json({
    ok: true,
    message: "ورود مدیریت موفق بود"
  }, 200, {
    "Set-Cookie": setCookie(
      "admin_session",
      token,
      86400
    )
  });
}

async function isAdmin(request, env) {
  const token = cookie(request, "admin_session");

  if (!token) return false;

  const hash = await sha256(token);

  const row = await env.DB.prepare(`
    SELECT id
    FROM sessions
    WHERE token_hash = ?
      AND expires_at > ?
      AND user_id = 0
    LIMIT 1
  `)
    .bind(
      "ADMIN_" + hash,
      Date.now()
    )
    .first();

  return !!row;
}

async function requireAdmin(request, env) {
  if (!(await isAdmin(request, env))) {
    return json({
      ok: false,
      error: "دسترسی مدیریت لازم است"
    }, 403);
  }

  return null;
}


/* =========================================================
   ADMIN ME
========================================================= */

async function adminMe(request, env) {
  const denied = await requireAdmin(request, env);

  if (denied) return denied;

  return json({
    ok: true,
    admin: true
  });
}


/* =========================================================
   ADMIN USERS
========================================================= */

async function adminUsers(request, env) {
  const denied = await requireAdmin(request, env);

  if (denied) return denied;

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
}


/* =========================================================
   ADMIN BALANCE
========================================================= */

async function adminBalance(request, env) {
  const denied = await requireAdmin(request, env);

  if (denied) return denied;

  const data = await readJSON(request);

  const userId = Number(data.user_id);
  const amount = money(data.amount);
  const description =
    String(data.description || "تغییر موجودی توسط مدیریت");

  if (!Number.isInteger(userId) || userId <= 0) {
    return json({
      ok: false,
      error: "کاربر معتبر نیست"
    }, 400);
  }

  if (!amount || amount === 0) {
    return json({
      ok: false,
      error: "مبلغ معتبر نیست"
    }, 400);
  }

  const user = await env.DB.prepare(`
    SELECT id, balance
    FROM users
    WHERE id = ?
  `)
    .bind(userId)
    .first();

  if (!user) {
    return json({
      ok: false,
      error: "کاربر پیدا نشد"
    }, 404);
  }

  if (Number(user.balance) + amount < 0) {
    return json({
      ok: false,
      error: "موجودی نمی‌تواند منفی شود"
    }, 400);
  }

  await env.DB.prepare(`
    UPDATE users
    SET balance = balance + ?
    WHERE id = ?
  `)
    .bind(amount, userId)
    .run();

  await env.DB.prepare(`
    INSERT INTO transactions
      (user_id, type, amount, description)
    VALUES
      (?, 'admin_adjustment', ?, ?)
  `)
    .bind(
      userId,
      amount,
      description
    )
    .run();

  return json({
    ok: true,
    message: "موجودی با موفقیت تغییر کرد"
  });
}


/* =========================================================
   ADMIN STATUS
========================================================= */

async function adminStatus(request, env) {
  const denied = await requireAdmin(request, env);

  if (denied) return denied;

  const data = await readJSON(request);

  const userId = Number(data.user_id);
  const status = String(data.status || "");

  if (!["active", "disabled"].includes(status)) {
    return json({
      ok: false,
      error: "وضعیت نامعتبر است"
    }, 400);
  }

  const result = await env.DB.prepare(`
    UPDATE users
    SET status = ?
    WHERE id = ?
  `)
    .bind(status, userId)
    .run();

  if (!result.meta.changes) {
    return json({
      ok: false,
      error: "کاربر پیدا نشد"
    }, 404);
  }

  return json({
    ok: true,
    message: "وضعیت کاربر تغییر کرد"
  });
}


/* =========================================================
   ADMIN WITHDRAWALS
========================================================= */

async function adminWithdrawals(request, env) {
  const denied = await requireAdmin(request, env);

  if (denied) return denied;

  const rows = await env.DB.prepare(`
    SELECT
      w.id,
      w.user_id,
      u.full_name,
      u.email,
      w.amount,
      w.method,
      w.destination,
      w.status,
      w.created_at,
      w.processed_at
    FROM withdrawals w
    JOIN users u ON u.id = w.user_id
    ORDER BY w.id DESC
    LIMIT 200
  `).all();

  return json({
    ok: true,
    withdrawals: rows.results || []
  });
}


/* =========================================================
   ADMIN PROCESS WITHDRAWAL
========================================================= */

async function adminWithdrawal(request, env) {
  const denied = await requireAdmin(request, env);

  if (denied) return denied;

  const data = await readJSON(request);

  const withdrawalId = Number(data.withdrawal_id);
  const action = String(data.action || "");

  if (!Number.isInteger(withdrawalId) || withdrawalId <= 0) {
    return json({
      ok: false,
      error: "درخواست معتبر نیست"
    }, 400);
  }

  if (!["approve", "reject"].includes(action)) {
    return json({
      ok: false,
      error: "عملیات نامعتبر است"
    }, 400);
  }

  const withdrawal = await env.DB.prepare(`
    SELECT *
    FROM withdrawals
    WHERE id = ?
    LIMIT 1
  `)
    .bind(withdrawalId)
    .first();

  if (!withdrawal) {
    return json({
      ok: false,
      error: "درخواست برداشت پیدا نشد"
    }, 404);
  }

  if (withdrawal.status !== "pending") {
    return json({
      ok: false,
      error: "این درخواست قبلاً بررسی شده است"
    }, 400);
  }

  if (action === "approve") {

    await env.DB.prepare(`
      UPDATE withdrawals
      SET status = 'approved',
          processed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(withdrawalId)
      .run();

    await env.DB.prepare(`
      INSERT INTO transactions
        (user_id, type, amount, description)
      VALUES
        (?, 'withdrawal_approved', ?, ?)
    `)
      .bind(
        withdrawal.user_id,
        0,
        `برداشت #${withdrawalId} تأیید شد`
      )
      .run();

    return json({
      ok: true,
      message: "برداشت تأیید شد"
    });
  }

  await env.DB.prepare(`
    UPDATE users
    SET balance = balance + ?
    WHERE id = ?
  `)
    .bind(
      withdrawal.amount,
      withdrawal.user_id
    )
    .run();

  await env.DB.prepare(`
    UPDATE withdrawals
    SET status = 'rejected',
        processed_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
    .bind(withdrawalId)
    .run();

  await env.DB.prepare(`
    INSERT INTO transactions
      (user_id, type, amount, description)
    VALUES
      (?, ?, ?, ?)
  `)
    .bind(
      withdrawal.user_id,
      "withdrawal_rejected",
      withdrawal.amount,
      `مبلغ برداشت #${withdrawalId} برگشت داده شد`
    )
    .run();

  return json({
    ok: true,
    message: "برداشت رد شد و مبلغ برگشت داده شد"
  });
}


/* =========================================================
   HTML APPLICATION
========================================================= */

const APP_HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport"
      content="width=device-width,initial-scale=1">

<title>دستیار هوش مصنوعی</title>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Tahoma, Arial, sans-serif;
  background: #f3f5f9;
  color: #172033;
}

.container {
  width: min(100% - 24px, 900px);
  margin: auto;
}

header {
  background: #172033;
  color: white;
  padding: 18px 0;
}

header h1 {
  margin: 0;
  font-size: 22px;
}

header p {
  margin: 7px 0 0;
  opacity: .8;
}

.card {
  background: white;
  margin: 16px 0;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0,0,0,.06);
}

h2 {
  margin-top: 0;
}

input,
select,
textarea,
button {
  width: 100%;
  padding: 13px;
  margin: 6px 0;
  border-radius: 10px;
  border: 1px solid #d8dde8;
  font-family: inherit;
  font-size: 15px;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

button {
  cursor: pointer;
  background: #172033;
  color: white;
  border: none;
}

button.secondary {
  background: #e8edf5;
  color: #172033;
}

button.danger {
  background: #b42318;
}

button.success {
  background: #087443;
}

.hidden {
  display: none !important;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat {
  background: #f6f8fc;
  border-radius: 14px;
  padding: 15px;
}

.stat strong {
  display: block;
  font-size: 22px;
  margin-top: 7px;
}

.nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.message {
  padding: 12px;
  background: #f4f6fa;
  border-radius: 12px;
  margin: 8px 0;
}

.user-row,
.withdraw-row {
  border: 1px solid #e2e6ee;
  border-radius: 12px;
  padding: 12px;
  margin: 10px 0;
}

small {
  color: #667085;
}

@media(max-width:600px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .nav {
    grid-template-columns: 1fr;
  }
</style>
</head>

<body>

<header>
<div class="container">
<h1>🤖 دستیار هوش مصنوعی</h1>
<p>دستیار هوشمند + حساب کاربری + موجودی + برداشت</p>
</div>
</header>

<main class="container">

<div id="auth" class="card">

<h2>👤 حساب کاربری</h2>

<div id="registerBox">

<input id="regName"
placeholder="نام کامل">

<input id="regEmail"
type="email"
placeholder="ایمیل">

<input id="regPassword"
type="password"
placeholder="رمز عبور">

<button onclick="registerUser()">
ثبت‌نام
</button>

<button class="secondary"
onclick="showLogin()">
قبلاً ثبت‌نام کرده‌ام
</button>

</div>

<div id="loginBox" class="hidden">

<input id="loginEmail"
type="email"
placeholder="ایمیل">

<input id="loginPassword"
type="password"
placeholder="رمز عبور">

<button onclick="loginUser()">
ورود
</button>

<button class="secondary"
onclick="showRegister()">
ثبت‌نام جدید
</button>

</div>

<div id="authMsg"></div>

</div>


<div id="dashboard" class="hidden">

<div class="card">

<div class="grid">

<div class="stat">
👤 کاربر
<strong id="fullName">-</strong>
</div>

<div class="stat">
💰 موجودی
<strong>$<span id="balance">0.00</span></strong>
</div>

<div class="stat">
🟢 وضعیت حساب
<strong id="status">فعال</strong>
</div>

<div class="stat">
📧 ایمیل
<strong id="email">-</strong>
</div>

</div>

</div>


<div class="card">

<div class="nav">

<button onclick="showSection('ai')">
🤖 دستیار AI
</button>

<button onclick="showSection('withdraw')">
💵 برداشت
</button>

<button onclick="showSection('transactions')">
📊 تراکنش‌ها
</button>

</div>

<button class="secondary"
onclick="logoutUser()">
خروج
</button>

</div>


<div id="ai" class="card">

<h2>💬 دستیار هوش مصنوعی</h2>

<div id="chat"></div>

<textarea id="question"
placeholder="سوال خود را بنویسید..."></textarea>

<button onclick="askAI()">
ارسال
</button>

<button class="secondary"
onclick="document.getElementById('chat').innerHTML=''">
🗑️ پاک کردن گفتگو
</button>

</div>


<div id="withdraw" class="card hidden">

<h2>💵 درخواست برداشت</h2>

<p>
حداقل برداشت: $10
</p>

<input
id="withdrawAmount"
type="number"
step="0.01"
placeholder="مبلغ">

<select id="withdrawMethod">
<option value="">روش برداشت</option>
<option value="USDT">USDT</option>
<option value="Bank">Bank</option>
</select>

<input
id="withdrawDestination"
placeholder="آدرس کیف پول / مقصد">

<button onclick="requestWithdraw()">
ثبت درخواست برداشت
</button>

<div id="withdrawMsg"></div>

</div>


<div id="transactions" class="card hidden">

<h2>📊 تراکنش‌ها</h2>

<div id="transactionList">
در حال بارگذاری...
</div>

</div>

</div>


<div id="admin" class="hidden">

<div class="card">

<h2>🛠️ مدیریت</h2>

<input
id="adminPassword"
type="password"
placeholder="رمز مدیریت">

<button onclick="adminLogin()">
ورود مدیریت
</button>

<div id="adminMsg"></div>

</div>


<div id="adminPanel" class="hidden">

<div class="card">

<h2>👥 کاربران</h2>

<div id="usersList"></div>

</div>


<div class="card">

<h2>💵 درخواست‌های برداشت</h2>

<div id="withdrawalsList"></div>

</div>

</div>

</div>


<div class="card">

<button class="secondary"
onclick="openAdmin()">
🛠️ مدیریت
</button>

</div>

</main>


<script>

let currentUser = null;

function msg(id, text) {
  document.getElementById(id).innerHTML =
    '<div class="message">' + text + '</div>';
}

async function api(url, options = {}) {

  const res = await fetch(url, {
    credentials: "same-origin",
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers || {})
    }
  });

  return await res.json();
}


function showLogin() {
  document.getElementById("registerBox")
    .classList.add("hidden");

  document.getElementById("loginBox")
    .classList.remove("hidden");
}


function showRegister() {
  document.getElementById("loginBox")
    .classList.add("hidden");

  document.getElementById("registerBox")
    .classList.remove("hidden");
}


async function registerUser() {

  const data = {
    full_name:
      document.getElementById("regName").value,

    email:
      document.getElementById("regEmail").value,

    password:
      document.getElementById("regPassword").value
  };

  const r = await api("/api/register", {
    method: "POST",
    body: JSON.stringify(data)
  });

  if (!r.ok) {
    msg("authMsg", r.error);
    return;
  }

  currentUser = r.user;
  showDashboard();
}


async function loginUser() {

  const data = {
    email:
      document.getElementById("loginEmail").value,

    password:
      document.getElementById("loginPassword").value
  };

  const r = await api("/api/login", {
    method: "POST",
    body: JSON.stringify(data)
  });

  if (!r.ok) {
    msg("authMsg", r.error);
    return;
  }

  currentUser = r.user;
  showDashboard();
}


async function logoutUser() {

  await api("/api/logout", {
    method: "POST"
  });

  location.reload();
}


async function checkLogin() {

  const r = await api("/api/me");

  if (r.logged_in) {
    currentUser = r.user;
    showDashboard();
  }
}


function showDashboard() {

  document.getElementById("auth")
    .classList.add("hidden");

  document.getElementById("dashboard")
    .classList.remove("hidden");

  document.getElementById("fullName")
    .textContent = currentUser.full_name;

  document.getElementById("email")
    .textContent = currentUser.email;

  document.getElementById("balance")
    .textContent =
      Number(currentUser.balance || 0)
      .toFixed(2);

  document.getElementById("status")
    .textContent =
      currentUser.status === "active"
      ? "فعال"
      : "غیرفعال";

  loadTransactions();
}


function showSection(section) {

  ["ai", "withdraw", "transactions"]
    .forEach(id => {
      document.getElementById(id)
        .classList.add("hidden");
    });

  document.getElementById(section)
    .classList.remove("hidden");

  if (section === "transactions") {
    loadTransactions();
  }
}


async function askAI() {

  const question =
    document.getElementById("question").value.trim();

  if (!question) return;

  const chat =
    document.getElementById("chat");

  chat.innerHTML +=
    '<div class="message"><b>شما:</b> ' +
    escapeHtml(question) +
    '</div>';

  document.getElementById("question").value = "";

  const r = await api("/api/ai", {
    method: "POST",
    body: JSON.stringify({ question })
  });

  if (!r.ok) {
    chat.innerHTML +=
      '<div class="message">' +
      escapeHtml(r.error) +
      '</div>';
    return;
  }

  chat.innerHTML +=
    '<div class="message"><b>AI:</b><br>' +
    escapeHtml(r.answer) +
    '</div>';
}


async function requestWithdraw() {

  const amount =
    Number(document.getElementById("withdrawAmount").value);

  const method =
    document.getElementById("withdrawMethod").value;

  const destination =
    document.getElementById("withdrawDestination").value;

  const r = await api("/api/withdraw", {
    method: "POST",
    body: JSON.stringify({
      amount,
      method,
      destination
    })
  });

  msg("withdrawMsg", r.ok
    ? "درخواست برداشت ثبت شد."
    : r.error
  );

  if (r.ok) {
    await refreshUser();
  }
}


async function refreshUser() {

  const r = await api("/api/me");

  if (r.logged_in) {
    currentUser = r.user;

    document.getElementById("balance")
      .textContent =
      Number(currentUser.balance || 0)
      .toFixed(2);
  }
}


async function loadTransactions() {

  const box =
    document.getElementById("transactionList");

  const r =
    await api("/api/transactions");

  if (!r.ok) {
    box.textContent = r.error;
    return;
  }

  if (!r.transactions.length) {
    box.textContent = "هنوز تراکنشی وجود ندارد.";
    return;
  }

  box.innerHTML =
    r.transactions.map(t => `
      <div class="message">
        <b>${escapeHtml(t.description || t.type)}</b>
        <br>
        مبلغ:
        $${Number(t.amount || 0).toFixed(2)}
        <br>
        <small>${escapeHtml(t.created_at)}</small>
      </div>
    `).join("");
}


function openAdmin() {

  document.getElementById("admin")
    .classList.remove("hidden");

  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  });
}


async function adminLogin() {

  const password =
    document.getElementById("adminPassword").value;

  const r = await api("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ password })
  });

  if (!r.ok) {
    msg("adminMsg", r.error);
    return;
  }

  document.getElementById("adminPanel")
    .classList.remove("hidden");

  loadAdminUsers();
  loadAdminWithdrawals();
}


async function loadAdminUsers() {

  const r =
    await api("/api/admin/users");

  if (!r.ok) return;

  const box =
    document.getElementById("usersList");

  box.innerHTML =
    r.users.map(u => `
      <div class="user-row">

        <b>${escapeHtml(u.full_name)}</b>

        <br>

        ${escapeHtml(u.email)}

        <br>

        موجودی:
        $${Number(u.balance || 0).toFixed(2)}

        <br>

        وضعیت:
        ${escapeHtml(u.status)}

        <input
          id="amount-${u.id}"
          type="number"
          step="0.01"
          placeholder="مبلغ + یا -">

        <input
          id="desc-${u.id}"
          placeholder="توضیح">

        <button
          onclick="changeBalance(${u.id})">
          💰 تغییر موجودی
        </button>

        <button
          class="secondary"
          onclick="changeStatus(${u.id}, 'active')">
          فعال
        </button>

        <button
          class="danger"
          onclick="changeStatus(${u.id}, 'disabled')">
          غیرفعال
        </button>

      </div>
    `).join("");
}


async function changeBalance(id) {

  const amount =
    Number(document.getElementById(
      "amount-" + id
    ).value);

  const description =
    document.getElementById(
      "desc-" + id
    ).value;

  const r = await api("/api/admin/balance", {
    method: "POST",
    body: JSON.stringify({
      user_id: id,
      amount,
      description
    })
  });

  alert(r.ok ? "موجودی تغییر کرد" : r.error);

  if (r.ok) {
    loadAdminUsers();
  }
}


async function changeStatus(id, status) {

  const r = await api("/api/admin/status", {
    method: "POST",
    body: JSON.stringify({
      user_id: id,
      status
    })
  });

  alert(r.ok ? "وضعیت تغییر کرد" : r.error);

  if (r.ok) {
    loadAdminUsers();
  }
}


async function loadAdminWithdrawals() {

  const r =
    await api("/api/admin/withdrawals");

  if (!r.ok) return;

  const box =
    document.getElementById("withdrawalsList");

  if (!r.withdrawals.length) {
    box.textContent =
      "درخواست برداشتی وجود ندارد.";
    return;
  }

  box.innerHTML =
    r.withdrawals.map(w => `
      <div class="withdraw-row">

        <b>#${w.id}</b>

        <br>

        ${escapeHtml(w.full_name)}

        <br>

        مبلغ:
        $${Number(w.amount).toFixed(2)}

        <br>

        روش:
        ${escapeHtml(w.method)}

        <br>

        مقصد:
        ${escapeHtml(w.destination)}

        <br>

        وضعیت:
        ${escapeHtml(w.status)}

        <br>

        ${
          w.status === "pending"
          ? `
            <button
              class="success"
              onclick="processWithdrawal(${w.id}, 'approve')">
              تأیید
            </button>

            <button
              class="danger"
              onclick="processWithdrawal(${w.id}, 'reject')">
              رد و برگشت مبلغ
            </button>
          `
          : ""
        }

      </div>
    `).join("");
}


async function processWithdrawal(id, action) {

  const r =
    await api("/api/admin/withdrawal", {
      method: "POST",
      body: JSON.stringify({
        withdrawal_id: id,
        action
      })
    });

  alert(r.ok ? r.message : r.error);

  if (r.ok) {
    loadAdminUsers();
    loadAdminWithdrawals();
  }
}


function escapeHtml(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


checkLogin();

</script>

</body>
</html>`;
