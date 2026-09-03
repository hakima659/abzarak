
// =============================================================
// worker.js — Cloudflare Worker: Auth (Signup / Login) API
// Matches the existing D1 "users" table:
//   id TEXT PRIMARY KEY, name TEXT, email TEXT UNIQUE NOT NULL,
//   password_hash TEXT NOT NULL, balance INTEGER DEFAULT 0,
//   created_at TEXT DEFAULT (datetime('now'))
//
// Bindings required (set in wrangler.toml or Cloudflare dashboard):
//   DB  -> your D1 database binding
// =============================================================

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// ---- Password hashing: PBKDF2 with per-user salt ----
// Stored format: "pbkdf2:<iterations>:<saltHex>:<hashHex>"
async function hashPassword(password) {
  const iterations = 100000;
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = [...saltBytes].map((b) => b.toString(16).padStart(2, "0")).join("");

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations, hash: "SHA-256" },
    keyMaterial,
    256
  );

  const hashHex = [...new Uint8Array(derivedBits)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `pbkdf2:${iterations}:${saltHex}:${hashHex}`;
}

async function verifyPassword(password, stored) {
  // Only supports the pbkdf2:iterations:salt:hash format.
  // Older/incompatible hash formats in the DB will not verify —
  // those accounts need a password reset.
  const parts = stored.split(":");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;

  const iterations = parseInt(parts[1], 10);
  const saltHex = parts[2];
  const expectedHashHex = parts[3];

  const saltBytes = new Uint8Array(saltHex.match(/.{1,2}/g).map((b) => parseInt(b, 16)));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations, hash: "SHA-256" },
    keyMaterial,
    256
  );

  const hashHex = [...new Uint8Array(derivedBits)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time-ish comparison
  if (hashHex.length !== expectedHashHex.length) return false;
  let diff = 0;
  for (let i = 0; i < hashHex.length; i++) {
    diff |= hashHex.charCodeAt(i) ^ expectedHashHex.charCodeAt(i);
  }
  return diff === 0;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateUUID() {
  return crypto.randomUUID();
}

// ---- Simple session token (signed, stateless) ----
// For production, prefer storing sessions in the "sessions" table
// you already have, keyed by a random token. This example does that.
async function createSession(db, userId) {
  const token = generateUUID() + generateUUID(); // long random token
  const createdAt = new Date().toISOString();
  await db
    .prepare(
      "INSERT INTO sessions (id, user_id, token, created_at) VALUES (?, ?, ?, ?)"
    )
    .bind(generateUUID(), userId, token, createdAt)
    .run();
  return token;
}

// =============================================================
// Route handlers
// =============================================================

async function handleSignup(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "بدنه درخواست نامعتبر است" }, 400);
  }

  const { name, email, password } = body;

  if (!email || !password) {
    return jsonResponse({ error: "ایمیل و رمز عبور الزامی است" }, 400);
  }
  if (!isValidEmail(email)) {
    return jsonResponse({ error: "فرمت ایمیل نامعتبر است" }, 400);
  }
  if (password.length < 6) {
    return jsonResponse({ error: "رمز عبور باید حداقل ۶ کاراکتر باشد" }, 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?")
    .bind(normalizedEmail)
    .first();

  if (existing) {
    return jsonResponse({ error: "این ایمیل قبلاً ثبت‌نام کرده است" }, 409);
  }

  const passwordHash = await hashPassword(password);
  const userId = generateUUID();
  const createdAt = new Date().toISOString();

  await env.DB.prepare(
    "INSERT INTO users (id, name, email, password_hash, balance, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind(userId, name || "", normalizedEmail, passwordHash, 0, createdAt)
    .run();

  const token = await createSession(env.DB, userId);

  return jsonResponse({
    success: true,
    user: { id: userId, name: name || "", email: normalizedEmail, balance: 0 },
    token,
  });
}

async function handleLogin(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "بدنه درخواست نامعتبر است" }, 400);
  }

  const { email, password } = body;

  if (!email || !password) {
    return jsonResponse({ error: "ایمیل و رمز عبور الزامی است" }, 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await env.DB.prepare(
    "SELECT id, name, email, password_hash, balance FROM users WHERE email = ?"
  )
    .bind(normalizedEmail)
    .first();

  // Generic error message on purpose — don't reveal whether the
  // email exists or the password was wrong (prevents enumeration).
  const genericError = { error: "ایمیل یا رمز عبور اشتباه است" };

  if (!user) {
    return jsonResponse(genericError, 401);
  }

  const isValid = await verifyPassword(password, user.password_hash);

  if (!isValid) {
    // If the stored hash isn't in our pbkdf2 format, it's a
    // legacy/incompatible hash — surface a clearer message so
    // this doesn't look like a silent bug again.
    if (!user.password_hash.startsWith("pbkdf2:")) {
      return jsonResponse(
        {
          error:
            "رمز عبور این حساب با فرمت قدیمی ذخیره شده و نیاز به بازیابی رمز دارد",
        },
        401
      );
    }
    return jsonResponse(genericError, 401);
  }

  const token = await createSession(env.DB, user.id);

  return jsonResponse({
    success: true,
    user: { id: user.id, name: user.name, email: user.email, balance: user.balance },
    token,
  });
}

async function handleMe(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");

  if (!token) {
    return jsonResponse({ error: "توکن ارسال نشده است" }, 401);
  }

  const session = await env.DB.prepare(
    "SELECT user_id FROM sessions WHERE token = ?"
  )
    .bind(token)
    .first();

  if (!session) {
    return jsonResponse({ error: "نشست نامعتبر یا منقضی شده است" }, 401);
  }

  const user = await env.DB.prepare(
    "SELECT id, name, email, balance FROM users WHERE id = ?"
  )
    .bind(session.user_id)
    .first();

  if (!user) {
    return jsonResponse({ error: "کاربر یافت نشد" }, 404);
  }

  return jsonResponse({ user });
}

// =============================================================
// Router
// =============================================================

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return jsonResponse({}, 204);
    }

    if (url.pathname === "/api/signup" && request.method === "POST") {
      return handleSignup(request, env);
    }

    if (url.pathname === "/api/login" && request.method === "POST") {
      return handleLogin(request, env);
    }

    if (url.pathname === "/api/me" && request.method === "GET") {
      return handleMe(request, env);
    }

    return jsonResponse({ error: "مسیر یافت نشد" }, 404);
  },
};
