// ============================================================
// AI ASSISTANT + USER ACCOUNT + D1 + BALANCE + WITHDRAWALS
// CLOUDFLARE WORKER - COMPLETE VERSION
//
// REQUIRED BINDINGS:
//
// D1 DATABASE:
//   DB
//
// WORKERS AI:
//   AI
//
// SECRET:
//   ADMIN_PASSWORD
//
// ============================================================

export default {
  async fetch(request, env) {
    try {
      if (!env.DB) {
        return json({
          ok: false,
          error: "D1 binding با نام DB متصل نیست."
        }, 500);
      }

      await initDB(env.DB);

      const url = new URL(request.url);
      const path = url.pathname;

      // --------------------------------------------------------
      // MAIN PAGE
      // --------------------------------------------------------

      if (request.method === "GET" && path === "/") {
        return htmlResponse(APP_HTML);
      }

      // --------------------------------------------------------
      // USER
      // --------------------------------------------------------

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

      if (
        path === "/api/transactions" &&
        request.method === "GET"
      ) {
        return transactions(request, env);
      }

      if (
        path === "/api/withdraw" &&
        request.method === "POST"
      ) {
        return withdraw(request, env);
      }

      if (
        path === "/api/withdrawals" &&
        request.method === "GET"
      ) {
        return userWithdrawals(request, env);
      }

      // --------------------------------------------------------
      // AI
      // --------------------------------------------------------

      if (path === "/api/ai" && request.method === "POST") {
        return ai(request, env);
      }

      // --------------------------------------------------------
      // ADMIN
      // --------------------------------------------------------

      if (
        path === "/api/admin/login" &&
        request.method === "POST"
      ) {
        return adminLogin(request, env);
      }

      if (
        path === "/api/admin/logout" &&
        request.method === "POST"
      ) {
        return adminLogout(request, env);
      }

      if (
        path === "/api/admin/me" &&
        request.method === "GET"
      ) {
        return adminMe(request, env);
      }

      if (
        path === "/api/admin/users" &&
        request.method === "GET"
      ) {
        return adminUsers(request, env);
      }

      if (
        path === "/api/admin/balance" &&
        request.method === "POST"
      ) {
        return adminBalance(request, env);
      }

      if (
        path === "/api/admin/user-status" &&
        request.method === "POST"
      ) {
        return adminUserStatus(request, env);
      }

      if (
        path === "/api/admin/withdrawals" &&
        request.method === "GET"
      ) {
        return adminWithdrawals(request, env);
      }

      if (
        path === "/api/admin/withdrawal" &&
        request.method === "POST"
      ) {
        return adminWithdrawalAction(request, env);
      }

      if (
        path === "/api/admin/stats" &&
        request.method === "GET"
      ) {
        return adminStats(request, env);
      }

      return json({
        ok: false,
        error: "Not found"
      }, 404);

    } catch (e) {

      console.error(e);

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
        method TEXT NOT NULL DEFAULT 'USDT',
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
// RESPONSE HELPERS
// ============================================================

function json(data, status = 200) {

  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "content-type":
          "application/json; charset=UTF-8",

        "cache-control":
          "no-store"
      }
    }
  );
}


function htmlResponse(html) {

  return new Response(
    html,
    {
      headers: {
        "content-type":
          "text/html; charset=UTF-8",

        "cache-control":
          "no-store"
      }
    }
  );
}


// ============================================================
// BODY
// ============================================================

async function body(request) {

  try {
    return await request.json();
  } catch {
    return {};
  }
}


// ============================================================
// SECURITY HELPERS
// ============================================================

function randomToken() {

  const bytes =
    new Uint8Array(32);

  crypto.getRandomValues(bytes);

  return Array.from(bytes)
    .map(
      x =>
        x.toString(16)
          .padStart(2, "0")
    )
    .join("");
}


async function sha256(text) {

  const data =
    new TextEncoder()
      .encode(text);

  const hash =
    await crypto.subtle.digest(
      "SHA-256",
      data
    );

  return Array.from(
    new Uint8Array(hash)
  )
    .map(
      b =>
        b.toString(16)
          .padStart(2, "0")
    )
    .join("");
}


// ============================================================
// VALIDATION
// ============================================================

function cleanEmail(email) {

  return String(email || "")
    .trim()
    .toLowerCase();
}


function cleanName(name) {

  return String(name || "")
    .trim()
    .replace(/\s+/g, " ");
}


function validEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);
}


function validPassword(password) {

  return password.length >= 6;
}


function validAmount(amount) {

  return (
    Number.isFinite(amount) &&
    amount > 0
  );
}


// ============================================================
// COOKIE
// ============================================================

function cookieToken(request, name) {

  const cookie =
    request.headers.get("cookie") || "";

  const match =
    cookie.match(
      new RegExp(
        "(?:^|;\\s*)" +
        name +
        "=([^;]+)"
      )
    );

  if (!match) {
    return null;
  }

  try {
    return decodeURIComponent(
      match[1]
    );
  } catch {
    return null;
  }
}


function setCookie(
  name,
  value,
  maxAge = 604800
) {

  return (
    name +
    "=" +
    encodeURIComponent(value) +
    "; Path=/" +
    "; HttpOnly" +
    "; Secure" +
    "; SameSite=Lax" +
    "; Max-Age=" +
    maxAge
  );
}


function clearCookie(name) {

  return (
    name +
    "=;" +
    " Path=/" +
    " HttpOnly" +
    " Secure" +
    " SameSite=Lax" +
    " Max-Age=0"
  );
}


function responseWithCookie(
  data,
  cookie,
  status = 200
) {

  const response =
    json(data, status);

  response.headers.append(
    "Set-Cookie",
    cookie
  );

  return response;
}


// ============================================================
// AUTH USER
// ============================================================

async function requireUser(
  request,
  env
) {

  const token =
    cookieToken(
      request,
      "session"
    );

  if (!token) {
    throw new Error(
      "AUTH_REQUIRED"
    );
  }

  const user =
    await env.DB
      .prepare(`
        SELECT
          u.id,
          u.full_name,
          u.email,
          u.balance,
          u.status,
          u.created_at
        FROM sessions s
        INNER JOIN users u
          ON u.id = s.user_id
        WHERE
          s.token = ?
          AND datetime(s.expires_at)
              > datetime('now')
      `)
      .bind(token)
      .first();

  if (!user) {
    throw new Error(
      "AUTH_REQUIRED"
    );
  }

  if (user.status !== "active") {
    throw new Error(
      "ACCOUNT_DISABLED"
    );
  }

  return user;
}


// ============================================================
// AUTH ADMIN
// ============================================================

async function requireAdmin(
  request,
  env
) {

  const token =
    cookieToken(
      request,
      "admin_session"
    );

  if (!token) {
    throw new Error(
      "ADMIN_REQUIRED"
    );
  }

  const admin =
    await env.DB
      .prepare(`
        SELECT id
        FROM admin_sessions
        WHERE
          token = ?
          AND datetime(expires_at)
              > datetime('now')
      `)
      .bind(token)
      .first();

  if (!admin) {
    throw new Error(
      "ADMIN_REQUIRED"
    );
  }

  return true;
}


// ============================================================
// AUTH ERROR
// ============================================================

function authError(e) {

  if (
    e?.message ===
    "AUTH_REQUIRED"
  ) {

    return json({
      ok: false,
      error:
        "لطفاً ابتدا وارد حساب شوید."
    }, 401);
  }

  if (
    e?.message ===
    "ACCOUNT_DISABLED"
  ) {

    return json({
      ok: false,
      error:
        "حساب شما غیرفعال است."
    }, 403);
  }

  if (
    e?.message ===
    "ADMIN_REQUIRED"
  ) {

    return json({
      ok: false,
      error:
        "ورود مدیریت لازم است."
    }, 401);
  }

  return null;
}


// ============================================================
// REGISTER
// ============================================================

async function register(
  request,
  env
) {

  const data =
    await body(request);

  const fullName =
    cleanName(
      data.fullName
    );

  const email =
    cleanEmail(
      data.email
    );

  const password =
    String(
      data.password || ""
    );

  if (!fullName) {

    return json({
      ok: false,
      error:
        "نام کامل را وارد کنید."
    }, 400);
  }

  if (fullName.length < 2) {

    return json({
      ok: false,
      error:
        "نام کامل معتبر نیست."
    }, 400);
  }

  if (!validEmail(email)) {

    return json({
      ok: false,
      error:
        "ایمیل معتبر نیست."
    }, 400);
  }

  if (!validPassword(password)) {

    return json({
      ok: false,
      error:
        "رمز عبور باید حداقل ۶ کاراکتر باشد."
    }, 400);
  }

  const exists =
    await env.DB
      .prepare(`
        SELECT id
        FROM users
        WHERE email = ?
      `)
      .bind(email)
      .first();

  if (exists) {

    return json({
      ok: false,
      error:
        "این ایمیل قبلاً ثبت‌نام کرده است."
    }, 409);
  }

  const passwordHash =
    await sha256(password);

  let userId;

  try {

    const result =
      await env.DB
        .prepare(`
          INSERT INTO users
          (
            full_name,
            email,
            password_hash,
            balance,
            status
          )
          VALUES
          (?, ?, ?, 0, 'active')
        `)
        .bind(
          fullName,
          email,
          passwordHash
        )
        .run();

    userId =
      result.meta.last_row_id;

  } catch (e) {

    if (
      String(e.message)
        .toLowerCase()
        .includes("unique")
    ) {

      return json({
        ok: false,
        error:
          "این ایمیل قبلاً ثبت شده است."
      }, 409);
    }

    throw e;
  }

  const token =
    randomToken();

  await env.DB
    .prepare(`
      INSERT INTO sessions
      (
        token,
        user_id,
        expires_at
      )
      VALUES
      (
        ?,
        ?,
        datetime('now', '+7 days')
      )
    `)
    .bind(
      token,
      userId
    )
    .run();

  return responseWithCookie(
    {
      ok: true,
      message:
        "ثبت‌نام با موفقیت انجام شد.",
      user: {
        id: userId,
        full_name: fullName,
        email,
        balance: 0,
        status: "active"
      }
    },
    setCookie(
      "session",
      token
    )
  );
}


// ============================================================
// LOGIN
// ============================================================

async function login(
  request,
  env
) {

  const data =
    await body(request);

  const email =
    cleanEmail(
      data.email
    );

  const password =
    String(
      data.password || ""
    );

  if (!validEmail(email)) {

    return json({
      ok: false,
      error:
        "ایمیل معتبر نیست."
    }, 400);
  }

  if (!password) {

    return json({
      ok: false,
      error:
        "رمز عبور را وارد کنید."
    }, 400);
  }

  const passwordHash =
    await sha256(password);

  const user =
    await env.DB
      .prepare(`
        SELECT
          id,
          full_name,
          email,
          balance,
          status,
          created_at
        FROM users
        WHERE
          email = ?
          AND password_hash = ?
      `)
      .bind(
        email,
        passwordHash
      )
      .first();

  if (!user) {

    return json({
      ok: false,
      error:
        "ایمیل یا رمز عبور اشتباه است."
    }, 401);
  }

  if (
    user.status !==
    "active"
  ) {

    return json({
      ok: false,
      error:
        "حساب شما غیرفعال است."
    }, 403);
  }

  const token =
    randomToken();

  await env.DB
    .prepare(`
      INSERT INTO sessions
      (
        token,
        user_id,
        expires_at
      )
      VALUES
      (
        ?,
        ?,
        datetime('now', '+7 days')
      )
    `)
    .bind(
      token,
      user.id
    )
    .run();

  return responseWithCookie(
    {
      ok: true,
      message:
        "ورود موفق بود.",
      user
    },
    setCookie(
      "session",
      token
    )
  );
}


// ============================================================
// LOGOUT
// ============================================================

async function logout(
  request,
  env
) {

  const token =
    cookieToken(
      request,
      "session"
    );

  if (token) {

    await env.DB
      .prepare(`
        DELETE FROM sessions
        WHERE token = ?
      `)
      .bind(token)
      .run();
  }

  return responseWithCookie(
    {
      ok: true,
      message:
        "با موفقیت خارج شدید."
    },
    clearCookie("session")
  );
}


// ============================================================
// ME
// ============================================================

async function me(
  request,
  env
) {

  try {

    const user =
      await requireUser(
        request,
        env
      );

    return json({
      ok: true,
      user
    });

  } catch (e) {

    const error =
      authError(e);

    if (error) {
      return error;
    }

    throw e;
  }
}


// ============================================================
// TRANSACTIONS
// ============================================================

async function transactions(
  request,
  env
) {

  try {

    const user =
      await requireUser(
        request,
        env
      );

    const rows =
      await env.DB
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
      transactions:
        rows.results || []
    });

  } catch (e) {

    const error =
      authError(e);

    if (error) {
      return error;
    }

    throw e;
  }
}


// ============================================================
// USER WITHDRAWALS
// ============================================================

async function userWithdrawals(
  request,
  env
) {

  try {

    const user =
      await requireUser(
        request,
        env
      );

    const rows =
      await env.DB
        .prepare(`
          SELECT
            id,
            amount,
            method,
            network,
            wallet_address,
            status,
            created_at,
            processed_at,
            admin_note
          FROM withdrawals
          WHERE user_id = ?
          ORDER BY id DESC
          LIMIT 100
        `)
        .bind(user.id)
        .all();

    return json({
      ok: true,
      withdrawals:
        rows.results || []
    });

  } catch (e) {

    const error =
      authError(e);

    if (error) {
      return error;
    }

    throw e;
  }
}


// ============================================================
// WITHDRAW
// ============================================================

async function withdraw(
  request,
  env
) {

  try {

    const user =
      await requireUser(
        request,
        env
      );

    const data =
      await body(request);

    const amount =
      Number(data.amount);

    const method =
      String(
        data.method || "USDT"
      )
      .trim()
      .toUpperCase();

    const network =
      String(
        data.network || ""
      )
      .trim()
      .toUpperCase();

    const walletAddress =
      String(
        data.walletAddress || ""
      )
      .trim();

    if (!validAmount(amount)) {

      return json({
        ok: false,
        error:
          "مبلغ برداشت معتبر نیست."
      }, 400);
    }

    if (amount < 1) {

      return json({
        ok: false,
        error:
          "حداقل برداشت 1 دلار است."
      }, 400);
    }

    if (method !== "USDT") {

      return json({
        ok: false,
        error:
          "روش برداشت فعلاً فقط USDT است."
      }, 400);
    }

    const networks = [
      "TRC20",
      "BEP20",
      "ERC20",
      "TON"
    ];

    if (
      !networks.includes(network)
    ) {

      return json({
        ok: false,
        error:
          "شبکه انتخاب‌شده معتبر نیست."
      }, 400);
    }

    if (
      walletAddress.length < 10 ||
      walletAddress.length > 200
    ) {

      return json({
        ok: false,
        error:
          "آدرس کیف پول معتبر نیست."
      }, 400);
    }

    /*
      تمام عملیات رزرو موجودی،
      ثبت برداشت و ثبت تراکنش
      داخل یک D1 batch انجام می‌شوند.
    */

    const withdrawalId =
      crypto.randomUUID();

    const result =
      await env.DB.batch([

        env.DB.prepare(`
          UPDATE users
          SET balance =
            balance - ?
          WHERE
            id = ?
            AND balance >= ?
            AND status = 'active'
        `)
        .bind(
          amount,
          user.id,
          amount
        ),

        env.DB.prepare(`
          INSERT INTO withdrawals
          (
            user_id,
            amount,
            method,
            network,
            wallet_address,
            status
          )
          SELECT
            ?,
            ?,
            ?,
            ?,
            ?,
            'pending'
          WHERE EXISTS (
            SELECT 1
            FROM users
            WHERE id = ?
              AND balance >= 0
          )
        `)
        .bind(
          user.id,
          amount,
          method,
          network,
          walletAddress,
          user.id
        ),

        env.DB.prepare(`
          INSERT INTO transactions
          (
            user_id,
            type,
            amount,
            description
          )
          VALUES
          (
            ?,
            'withdraw_pending',
            ?,
            ?
          )
        `)
        .bind(
          user.id,
          -amount,
          "درخواست برداشت " +
          method +
          " - " +
          network
        )
      ]);

    const updated =
      result[0]?.meta?.changes || 0;

    if (updated !== 1) {

      return json({
        ok: false,
        error:
          "موجودی کافی نیست یا حساب غیرفعال است."
      }, 400);
    }

    const fresh =
      await env.DB
        .prepare(`
          SELECT
            id,
            full_name,
            email,
            balance,
            status
          FROM users
          WHERE id = ?
        `)
        .bind(user.id)
        .first();

    return json({
      ok: true,
      message:
        "درخواست برداشت ثبت شد و در انتظار بررسی مدیریت است.",
      user: fresh
    });

  } catch (e) {

    const error =
      authError(e);

    if (error) {
      return error;
    }

    throw e;
  }
}


// ============================================================
// AI
// ============================================================

async function ai(
  request,
  env
) {

  try {

    await requireUser(
      request,
      env
    );

    const data =
      await body(request);

    const message =
      String(
        data.message || ""
      ).trim();

    if (!message) {

      return json({
        ok: false,
        error:
          "سؤال خود را بنویسید."
      }, 400);
    }

    if (!env.AI) {

      return json({
        ok: false,
        error:
          "Workers AI با نام AI متصل نیست."
      }, 500);
    }

    const result =
      await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct",
        {
          messages: [
            {
              role: "system",
              content:
                "You are a helpful Persian-speaking AI assistant. " +
                "Answer in Persian unless the user asks for another language. " +
                "Be clear, useful and concise."
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

    const error =
      authError(e);

    if (error) {
      return error;
    }

    throw e;
  }
}


// ============================================================
// ADMIN LOGIN
// ============================================================

async function adminLogin(
  request,
  env
) {

  const data =
    await body(request);

  const password =
    String(
      data.password || ""
    );

  if (!env.ADMIN_PASSWORD) {

    return json({
      ok: false,
      error:
        "ADMIN_PASSWORD در Worker تنظیم نشده است."
    }, 500);
  }

  if (
    password !==
    env.ADMIN_PASSWORD
  ) {

    return json({
      ok: false,
      error:
        "رمز مدیریت اشتباه است."
    }, 401);
  }

  const token =
    randomToken();

  await env.DB
    .prepare(`
      INSERT INTO admin_sessions
      (
        token,
        expires_at
      )
      VALUES
      (
        ?,
        datetime('now', '+7 days')
      )
    `)
    .bind(token)
    .run();

  return responseWithCookie(
    {
      ok: true,
      message:
        "ورود مدیریت موفق بود."
    },
    setCookie(
      "admin_session",
      token
    )
  );
}


// ============================================================
// ADMIN LOGOUT
// ============================================================

async function adminLogout(
  request,
  env
) {

  const token =
    cookieToken(
      request,
      "admin_session"
    );

  if (token) {

    await env.DB
      .prepare(`
        DELETE FROM admin_sessions
        WHERE token = ?
      `)
      .bind(token)
      .run();
  }

  return responseWithCookie(
    {
      ok: true
    },
    clearCookie(
      "admin_session"
    )
  );
}


// ============================================================
// ADMIN ME
// ============================================================

async function adminMe(
  request,
  env
) {

  try {

    await requireAdmin(
      request,
      env
    );

    return json({
      ok: true,
      admin: true
    });

  } catch (e) {

    const error =
      authError(e);

    if (error) {
      return error;
    }

    throw e;
  }
}


// ============================================================
// ADMIN USERS
// ============================================================

async function adminUsers(
  request,
  env
) {

  try {

    await requireAdmin(
      request,
      env
    );

    const rows =
      await env.DB
        .prepare(`
          SELECT
            id,
            full_name,
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
      users:
        rows.results || []
    });

  } catch (e) {

    const error =
      authError(e);

    if (error) {
      return error;
    }

    throw e;
  }
}


// ============================================================
// ADMIN BALANCE
// ============================================================

async function adminBalance(
  request,
  env
) {

  try {

    await requireAdmin(
      request,
      env
    );

    const data =
      await body(request);

    const userId =
      Number(data.userId);

    const amount =
      Number(data.amount);

    const note =
      String(
        data.note ||
        "تغییر موجودی توسط مدیریت"
      ).trim();

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {

      return json({
        ok: false,
        error:
          "کاربر نامعتبر است."
      }, 400);
    }

    if (
      !Number.isFinite(amount) ||
      amount === 0
    ) {

      return json({
        ok: false,
        error:
          "مبلغ معتبر نیست."
      }, 400);
    }

    const user =
      await env.DB
        .prepare(`
          SELECT
            id,
            balance,
            status
          FROM users
          WHERE id = ?
        `)
        .bind(userId)
        .first();

    if (!user) {

      return json({
        ok: false,
        error:
          "کاربر پیدا نشد."
      }, 404);
    }

    const current =
      Number(user.balance || 0);

    const newBalance =
      current + amount;

    if (newBalance < 0) {

      return json({
        ok: false,
        error:
          "موجودی نمی‌تواند منفی شود."
      }, 400);
    }

    await env.DB.batch([

      env.DB.prepare(`
        UPDATE users
        SET balance = ?
        WHERE id = ?
      `)
      .bind(
        newBalance,
        userId
      ),

      env.DB.prepare(`
        INSERT INTO transactions
        (
          user_id,
          type,
          amount,
          description
        )
        VALUES
        (
          ?,
          ?,
          ?,
          ?
        )
      `)
      .bind(
        userId,
        amount > 0
          ? "admin_credit"
          : "admin_debit",
        amount,
        note
      )
    ]);

    return json({
      ok: true,
      message:
        "موجودی با موفقیت تغییر کرد.",
      balance:
        newBalance
    });

  } catch (e) {

    const error =
      authError(e);

    if (error) {
      return error;
    }

    throw e;
  }
}


// ============================================================
// ADMIN USER STATUS
// ============================================================

async function adminUserStatus(
  request,
  env
) {

  try {

    await requireAdmin(
      request,
      env
    );

    const data =
      await body(request);

    const userId =
      Number(data.userId);

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {

      return json({
        ok: false,
        error:
          "کاربر نامعتبر است."
      }, 400);
    }

    const status =
      data.status ===
      "disabled"
        ? "disabled"
        : "active";

    const result =
      await env.DB
        .prepare(`
          UPDATE users
          SET status = ?
          WHERE id = ?
        `)
        .bind(
          status,
          userId
        )
        .run();

    if (
      (result.meta.changes || 0) !== 1
    ) {

      return json({
        ok: false,
        error:
          "کاربر پیدا نشد."
      }, 404);
    }

    return json({
      ok: true,
      message:
        status === "active"
          ? "حساب فعال شد."
          : "حساب غیرفعال شد."
    });

  } catch (e) {

    const error =
      authError(e);

    if (error) {
      return error;
    }

    throw e;
  }
}


// ============================================================
// ADMIN WITHDRAWALS
// ============================================================

async function adminWithdrawals(
  request,
  env
) {

  try {

    await requireAdmin(
      request,
      env
    );

    const rows =
      await env.DB
        .prepare(`
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
          INNER JOIN users u
            ON u.id = w.user_id
          ORDER BY w.id DESC
          LIMIT 200
        `)
        .all();

    return json({
      ok: true,
      withdrawals:
        rows.results || []
    });

  } catch (e) {

    const error =
      authError(e);

    if (error) {
      return error;
    }

    throw e;
  }
}


// ============================================================
// ADMIN WITHDRAWAL ACTION
// ============================================================

async function adminWithdrawalAction(
  request,
  env
) {

  try {

    await requireAdmin(
      request,
      env
    );

    const data =
      await body(request);

    const withdrawalId =
      Number(
        data.withdrawalId
      );

    const action =
      String(
        data.action || ""
      ).trim();

    const note =
      String(
        data.note || ""
      ).trim();

    if (
      !Number.isInteger(
        withdrawalId
      ) ||
      withdrawalId <= 0
    ) {

      return json({
        ok: false,
        error:
          "درخواست برداشت نامعتبر است."
      }, 400);
    }

    if (
      !["approve", "reject"]
        .includes(action)
    ) {

      return json({
        ok: false,
        error:
          "عملیات نامعتبر است."
      }, 400);
    }

    const w =
      await env.DB
        .prepare(`
          SELECT
            id,
            user_id,
            amount,
            status
          FROM withdrawals
          WHERE id = ?
        `)
        .bind(
          withdrawalId
        )
        .first();

    if (!w) {

      return json({
        ok: false,
        error:
          "درخواست برداشت پیدا نشد."
      }, 404);
    }

    if (
      w.status !== "pending"
    ) {

      return json({
        ok: false,
        error:
          "این درخواست قبلاً پردازش شده است."
      }, 400);
    }

    // --------------------------------------------------------
    // APPROVE
    // --------------------------------------------------------

    if (action === "approve") {

      const result =
        await env.DB.batch([

          env.DB.prepare(`
            UPDATE withdrawals
            SET
              status = 'approved',
              processed_at =
                CURRENT_TIMESTAMP,
              admin_note = ?
            WHERE
              id = ?
              AND status = 'pending'
          `)
          .bind(
            note,
            withdrawalId
          ),

          env.DB.prepare(`
            INSERT INTO transactions
            (
              user_id,
              type,
              amount,
              description
            )
            VALUES
            (
              ?,
              'withdraw_approved',
              0,
              ?
            )
          `)
          .bind(
            w.user_id,
            note ||
            "درخواست برداشت تأیید شد."
          )

        ]);

      if (
        (result[0]?.meta?.changes || 0)
        !== 1
      ) {

        return json({
          ok: false,
          error:
            "این درخواست قبلاً پردازش شده است."
        }, 409);
      }

      return json({
        ok: true,
        message:
          "درخواست برداشت تأیید شد. پرداخت USDT باید از طریق کیف پول یا سرویس پرداخت متصل انجام شود."
      });
    }

    // --------------------------------------------------------
    // REJECT
    // --------------------------------------------------------

    const result =
      await env.DB.batch([

        env.DB.prepare(`
          UPDATE withdrawals
          SET
            status = 'rejected',
            processed_at =
              CURRENT_TIMESTAMP,
            admin_note = ?
          WHERE
            id = ?
            AND status = 'pending'
        `)
        .bind(
          note,
          withdrawalId
        ),

        env.DB.prepare(`
          UPDATE users
          SET balance =
            balance + ?
          WHERE id = ?
        `)
        .bind(
          w.amount,
          w.user_id
        ),

        env.DB.prepare(`
          INSERT INTO transactions
          (
            user_id,
            type,
            amount,
            description
          )
          VALUES
          (
            ?,
            'withdraw_rejected',
            ?,
            ?
          )
        `)
        .bind(
          w.user_id,
          w.amount,
          note ||
          "برداشت رد شد و مبلغ برگشت داده شد."
        )

      ]);

    if (
      (result[0]?.meta?.changes || 0)
      !== 1
    ) {

      return json({
        ok: false,
        error:
          "این درخواست قبلاً پردازش شده است."
      }, 409);
    }

    return json({
      ok: true,
      message:
        "برداشت رد شد و مبلغ به موجودی کاربر برگشت."
    });

  } catch (e) {

    const error =
      authError(e);

    if (error) {
      return error;
    }

    throw e;
  }
}


// ============================================================
// ADMIN STATS
// ============================================================

async function adminStats(
  request,
  env
) {

  try {

    await requireAdmin(
      request,
      env
    );

    const users =
      await env.DB
        .prepare(`
          SELECT COUNT(*) AS count
          FROM users
        `)
        .first();

    const active =
      await env.DB
        .prepare(`
          SELECT COUNT(*) AS count
          FROM users
          WHERE status = 'active'
        `)
        .first();

    const disabled =
      await env.DB
        .prepare(`
          SELECT COUNT(*) AS count
          FROM users
          WHERE status = 'disabled'
        `)
        .first();

    const balance =
      await env.DB
        .prepare(`
          SELECT
            COALESCE(
              SUM(balance),
              0
            ) AS total
          FROM users
        `)
        .first();

    const pending =
      await env.DB
        .prepare(`
          SELECT
            COUNT(*) AS count,
            COALESCE(
              SUM(amount),
              0
            ) AS amount
          FROM withdrawals
          WHERE status = 'pending'
        `)
        .first();

    return json({
      ok: true,
      stats: {
        users:
          Number(users?.count || 0),

        active:
          Number(active?.count || 0),

        disabled:
          Number(disabled?.count || 0),

        total_balance:
          Number(balance?.total || 0),

        pending_withdrawals:
          Number(pending?.count || 0),

        pending_amount:
          Number(pending?.amount || 0)
      }
    });

  } catch (e) {

    const error =
      authError(e);

    if (error) {
      return error;
    }

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

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<title>
دستیار هوش مصنوعی
</title>

<style>

*{
  box-sizing:border-box;
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
      #eef2ff,
      #f8fafc
    );
  color:#172033;
}

.container{
  width:100%;
  max-width:1050px;
  margin:auto;
  padding:15px;
}

.card{
  background:#fff;
  border-radius:20px;
  padding:20px;
  margin-bottom:16px;
  box-shadow:
    0 8px 30px
    rgba(15,23,42,.08);
}

.top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:15px;
  flex-wrap:wrap;
}

h1,
h2,
h3{
  margin-top:0;
}

h1{
  font-size:26px;
}

input,
select,
textarea{
  width:100%;
  border:1px solid #d7deea;
  background:#fff;
  border-radius:13px;
  padding:13px;
  margin-top:6px;
  margin-bottom:12px;
  font-size:15px;
  outline:none;
}

input:focus,
select:focus,
textarea:focus{
  border-color:#2563eb;
}

textarea{
  min-height:110px;
  resize:vertical;
}

button{
  border:0;
  border-radius:13px;
  padding:12px 17px;
  background:#2563eb;
  color:#fff;
  font-size:15px;
  cursor:pointer;
  margin:3px;
}

button:hover{
  opacity:.92;
}

button.secondary{
  background:#64748b;
}

button.success{
  background:#16a34a;
}

button.danger{
  background:#dc2626;
}

button.dark{
  background:#111827;
}

.hidden{
  display:none !important;
}

.small{
  color:#64748b;
  font-size:13px;
}

.balance{
  font-size:32px;
  font-weight:800;
  color:#16a34a;
}

.status{
  display:inline-block;
  border-radius:30px;
  padding:6px 12px;
  background:#dcfce7;
  color:#166534;
}

.grid{
  display:grid;
  grid-template-columns:
    repeat(
      auto-fit,
      minmax(220px,1fr)
    );
  gap:12px;
}

.item{
  border:1px solid #e5e7eb;
  border-radius:15px;
  padding:14px;
  margin:9px 0;
  background:#fff;
}

.nav{
  display:flex;
  flex-wrap:wrap;
  gap:5px;
  margin-top:15px;
}

.nav button{
  background:#e8eefc;
  color:#1e3a8a;
}

.nav button.active{
  background:#2563eb;
  color:#fff;
}

.chat-user{
  border-right:
    4px solid #2563eb;
}

.chat-ai{
  border-right:
    4px solid #16a34a;
}

.admin-stat{
  text-align:center;
  padding:20px;
  border-radius:15px;
  background:#f8fafc;
}

.admin-stat strong{
  display:block;
  font-size:25px;
  margin-top:7px;
}

.wallet{
  direction:ltr;
  text-align:left;
  word-break:break-all;
  background:#f8fafc;
  padding:10px;
  border-radius:10px;
}

#toast{
  position:fixed;
  left:15px;
  right:15px;
  bottom:15px;
  max-width:650px;
  margin:auto;
  padding:15px;
  border-radius:14px;
  background:#111827;
  color:#fff;
  text-align:center;
  display:none;
  z-index:99999;
}

hr{
  border:0;
  border-top:1px solid #e5e7eb;
  margin:18px 0;
}

</style>

</head>

<body>

<div class="container">

<!-- ===================================================== -->
<!-- HEADER -->
<!-- ===================================================== -->

<div class="card">

  <div class="top">

    <div>

      <h1>
        🤖 دستیار هوش مصنوعی
      </h1>

      <div class="small">
        دستیار هوشمند + حساب کاربری +
        موجودی + برداشت
      </div>

    </div>

    <div id="authButtons">

      <button
        onclick="showAuth('login')"
      >
        ورود
      </button>

      <button
        onclick="showAuth('register')"
      >
        ثبت‌نام
      </button>

    </div>

  </div>

</div>


<!-- ===================================================== -->
<!-- AUTH -->
<!-- ===================================================== -->

<div
  id="authBox"
  class="card hidden"
>

  <h2 id="authTitle">
    ورود
  </h2>

  <div id="nameBox">

    <label>
      نام کامل
    </label>

    <input
      id="fullName"
      placeholder="نام و نام خانوادگی"
    >

  </div>

  <label>
    ایمیل
  </label>

  <input
    id="email"
    type="email"
    placeholder="example@email.com"
  >

  <label>
    رمز عبور
  </label>

  <input
    id="password"
    type="password"
    placeholder="حداقل ۶ کاراکتر"
  >

  <button
    onclick="submitAuth()"
  >
    ادامه
  </button>

  <button
    class="secondary"
    onclick="hideAuth()"
  >
    بستن
  </button>

</div>


<!-- ===================================================== -->
<!-- APPLICATION -->
<!-- ===================================================== -->

<div
  id="app"
  class="hidden"
>


<!-- USER HEADER -->

<div class="card">

  <div class="top">

    <div>

      <div class="small">
        کاربر
      </div>

      <h2 id="userName">
        -
      </h2>

    </div>

    <div>

      <div class="small">
        موجودی
      </div>

      <div
        id="balance"
        class="balance"
      >
        $0.00
      </div>

    </div>

    <div>

      <div class="small">
        وضعیت حساب
      </div>

      <span
        id="userStatus"
        class="status"
      >
        فعال
      </span>

    </div>

  </div>


  <div class="nav">

    <button
      onclick="showSection('ai')"
    >
      🤖 دستیار AI
    </button>

    <button
      onclick="showSection('account')"
    >
      👤 حساب
    </button>

    <button
      onclick="showSection('withdraw')"
    >
      💵 برداشت
    </button>

    <button
      onclick="showSection('transactions')"
    >
      📊 تراکنش‌ها
    </button>

    <button
      onclick="showSection('myWithdrawals')"
    >
      📋 درخواست‌های برداشت
    </button>

    <button
      class="secondary"
      onclick="logoutUser()"
    >
      خروج
    </button>

  </div>

</div>


<!-- ===================================================== -->
<!-- AI -->
<!-- ===================================================== -->

<div
  id="aiSection"
  class="card"
>

  <h2>
    💬 دستیار هوش مصنوعی
  </h2>

  <div
    id="chat"
  ></div>

  <textarea
    id="question"
    placeholder="سؤال خود را بنویسید..."
  ></textarea>

  <button
    onclick="askAI()"
  >
    ارسال
  </button>

  <button
    class="secondary"
    onclick="clearChat()"
  >
    🗑️ پاک کردن گفتگو
  </button>

</div>


<!-- ===================================================== -->
<!-- ACCOUNT -->
<!-- ===================================================== -->

<div
  id="accountSection"
  class="card hidden"
>

  <h2>
    👤 حساب کاربری
  </h2>

  <div class="grid">

    <div class="item">

      <div class="small">
        نام کامل
      </div>

      <strong id="accountName">
        -
      </strong>

    </div>

    <div class="item">

      <div class="small">
        ایمیل
      </div>

      <strong id="accountEmail">
        -
      </strong>

    </div>

    <div class="item">

      <div class="small">
        موجودی
      </div>

      <strong id="accountBalance">
        $0.00
      </strong>

    </div>

    <div class="item">

      <div class="small">
        وضعیت
      </div>

      <strong id="accountStatus">
        فعال
      </strong>

    </div>

    <div class="item">

      <div class="small">
        تاریخ ثبت‌نام
      </div>

      <strong id="accountCreated">
        -
      </strong>

    </div>

  </div>

</div>


<!-- ===================================================== -->
<!-- WITHDRAW -->
<!-- ===================================================== -->

<div
  id="withdrawSection"
  class="card hidden"
>

  <h2>
    💵 برداشت USDT
  </h2>

  <div class="small">
    حداقل مبلغ برداشت 1 دلار است.
  </div>

  <hr>

  <label>
    مبلغ برداشت
  </label>

  <input
    id="withdrawAmount"
    type="number"
    min="1"
    step="0.01"
    placeholder="مثلاً 10"
  >

  <label>
    روش برداشت
  </label>

  <select
    id="withdrawMethod"
  >

    <option value="USDT">
      USDT
    </option>

  </select>

  <label>
    شبکه
  </label>

  <select
    id="withdrawNetwork"
  >

    <option value="TRC20">
      TRC20
    </option>

    <option value="BEP20">
      BEP20
    </option>

    <option value="ERC20">
      ERC20
    </option>

    <option value="TON">
      TON
    </option>

  </select>

  <label>
    آدرس کیف پول
  </label>

  <input
    id="walletAddress"
    placeholder="آدرس کیف پول دریافت‌کننده"
  >

  <button
    onclick="requestWithdraw()"
  >
    ثبت درخواست برداشت
  </button>

</div>


<!-- ===================================================== -->
<!-- TRANSACTIONS -->
<!-- ===================================================== -->

<div
  id="transactionsSection"
  class="card hidden"
>

  <h2>
    📊 تراکنش‌ها
  </h2>

  <div
    id="transactions"
  ></div>

</div>


<!-- ===================================================== -->
<!-- MY WITHDRAWALS -->
<!-- ===================================================== -->

<div
  id="myWithdrawalsSection"
  class="card hidden"
>

  <h2>
    📋 درخواست‌های برداشت من
  </h2>

  <div
    id="myWithdrawals"
  ></div>

</div>


<!-- ===================================================== -->
<!-- ADMIN LOGIN -->
<!-- ===================================================== -->

<div class="card">

  <h2>
    🛠️ مدیریت
  </h2>

  <button
    onclick="showAdminLogin()"
  >
    ورود مدیریت
  </button>

  <div
    id="adminLoginBox"
    class="hidden"
  >

    <input
      id="adminPassword"
      type="password"
      placeholder="رمز مدیریت"
    >

    <button
      onclick="adminLogin()"
    >
      ورود مدیریت
    </button>

  </div>

</div>


<!-- ===================================================== -->
<!-- ADMIN PANEL -->
<!-- ===================================================== -->

<div
  id="adminPanel"
  class="hidden"
>


<div class="card">

  <div class="top">

    <h2>
      🛠️ پنل مدیریت
    </h2>

    <button
      class="danger"
      onclick="adminLogout()"
    >
      خروج مدیریت
    </button>

  </div>

</div>


<!-- ADMIN STATS -->

<div class="card">

  <h2>
    📈 آمار
  </h2>

  <div
    id="adminStats"
    class="grid"
  ></div>

</div>


<!-- ADMIN NAV -->

<div class="card">

  <div class="nav">

    <button
      onclick="adminShow('users')"
    >
      👥 کاربران
    </button>

    <button
      onclick="adminShow('withdrawals')"
    >
      💵 برداشت‌ها
    </button>

  </div>

</div>


<!-- USERS -->

<div
  id="adminUsersSection"
  class="card"
>

  <h2>
    👥 کاربران
  </h2>

  <div
    id="users"
  ></div>

</div>


<!-- WITHDRAWALS -->

<div
  id="adminWithdrawalsSection"
  class="card hidden"
>

  <h2>
    💵 درخواست‌های برداشت
  </h2>

  <div
    id="withdrawals"
  ></div>

</div>


</div>

</div>


<div
  id="toast"
></div>


<script>

// ==========================================================
// GLOBAL
// ==========================================================

let authMode = "login";

let currentUser = null;


// ==========================================================
// TOAST
// ==========================================================

function toast(message){

  const el =
    document.getElementById(
      "toast"
    );

  el.textContent =
    message;

  el.style.display =
    "block";

  clearTimeout(
    window.toastTimer
  );

  window.toastTimer =
    setTimeout(
      () => {
        el.style.display =
          "none";
      },
      3500
    );
}


// ==========================================================
// API
// ==========================================================

async function api(
  path,
  options = {}
){

  try {

    const r =
      await fetch(
        path,
        {
          credentials:
            "same-origin",

          ...options,

          headers:{
            "content-type":
              "application/json",

            ...(options.headers || {})
          }
        }
      );

    let data;

    try {

      data =
        await r.json();

    } catch {

      data = {
        ok:false,
        error:
          "پاسخ نامعتبر از سرور."
      };
    }

    return data;

  } catch (e) {

    return {
      ok:false,
      error:
        "اتصال به سرور برقرار نشد."
    };
  }
}


// ==========================================================
// AUTH UI
// ==========================================================

function showAuth(
  mode
){

  authMode =
    mode;

  document
    .getElementById(
      "authBox"
    )
    .classList
    .remove("hidden");

  document
    .getElementById(
      "authTitle"
    )
    .textContent =
      mode === "login"
        ? "ورود به حساب"
        : "ثبت‌نام";

  document
    .getElementById(
      "nameBox"
    )
    .classList
    .toggle(
      "hidden",
      mode === "login"
    );
}


function hideAuth(){

  document
    .getElementById(
      "authBox"
    )
    .classList
    .add("hidden");
}


// ==========================================================
// REGISTER / LOGIN
// ==========================================================

async function submitAuth(){

  const fullName =
    document
      .getElementById(
        "fullName"
      )
      .value
      .trim();

  const email =
    document
      .getElementById(
        "email"
      )
      .value
      .trim();

  const password =
    document
      .getElementById(
        "password"
      )
      .value;

  if (
    authMode === "register" &&
    !fullName
  ){

    toast(
      "نام کامل را وارد کنید."
    );

    return;
  }

  if (!email){

    toast(
      "ایمیل را وارد کنید."
    );

    return;
  }

  if (!password){

    toast(
      "رمز عبور را وارد کنید."
    );

    return;
  }

  const endpoint =
    authMode === "login"
      ? "/api/login"
      : "/api/register";

  const data =
    await api(
      endpoint,
      {
        method:"POST",

        body:
          JSON.stringify({
            fullName,
            email,
            password
          })
      }
    );

  if (!data.ok){

    toast(
      data.error ||
      "خطا"
    );

    return;
  }

  toast(
    data.message ||
    "موفق"
  );

  hideAuth();

  await loadMe();
}


// ==========================================================
// LOAD USER
// ==========================================================

async function loadMe(){

  const data =
    await api(
      "/api/me"
    );

  if (!data.ok){

    currentUser =
      null;

    document
      .getElementById(
        "app"
      )
      .classList
      .add("hidden");

    document
      .getElementById(
        "authButtons"
      )
      .classList
      .remove("hidden");

    return;
  }

  currentUser =
    data.user;

  document
    .getElementById(
      "app"
    )
    .classList
    .remove("hidden");

  document
    .getElementById(
      "authButtons"
    )
    .classList
    .add("hidden");

  renderUser();

  await loadTransactions();

  await loadMyWithdrawals();
}


// ==========================================================
// RENDER USER
// ==========================================================

function renderUser(){

  if (!currentUser) {
    return;
  }

  const balance =
    Number(
      currentUser.balance || 0
    ).toFixed(2);

  document
    .getElementById(
      "userName"
    )
    .textContent =
      currentUser.full_name;

  document
    .getElementById(
      "balance"
    )
    .textContent =
      "$" + balance;

  document
    .getElementById(
      "userStatus"
    )
    .textContent =
      currentUser.status ===
      "active"
        ? "فعال"
        : "غیرفعال";

  document
    .getElementById(
      "accountName"
    )
    .textContent =
      currentUser.full_name;

  document
    .getElementById(
      "accountEmail"
    )
    .textContent =
      currentUser.email;

  document
    .getElementById(
      "accountBalance"
    )
    .textContent =
      "$" + balance;

  document
    .getElementById(
      "accountStatus"
    )
    .textContent =
      currentUser.status ===
      "active"
        ? "فعال"
        : "غیرفعال";

  document
    .getElementById(
      "accountCreated"
    )
    .textContent =
      currentUser.created_at ||
      "-";
}


// ==========================================================
// LOGOUT USER
// ==========================================================

async function logoutUser(){

  await api(
    "/api/logout",
    {
      method:"POST",
      body:"{}"
    }
  );

  currentUser =
    null;

  document
    .getElementById(
      "app"
    )
    .classList
    .add("hidden");

  document
    .getElementById(
      "authButtons"
    )
    .classList
    .remove("hidden");

  toast(
    "از حساب خارج شدید."
  );
}


// ==========================================================
// SECTIONS
// ==========================================================

function showSection(
  name
){

  const sections = [

    "aiSection",

    "accountSection",

    "withdrawSection",

    "transactionsSection",

    "myWithdrawalsSection"

  ];

  sections.forEach(
    id => {

      document
        .getElementById(id)
        .classList
        .add("hidden");

    }
  );

  const map = {

    ai:
      "aiSection",

    account:
      "accountSection",

    withdraw:
      "withdrawSection",

    transactions:
      "transactionsSection",

    myWithdrawals:
      "myWithdrawalsSection"

  };

  const id =
    map[name];

  if (!id) {
    return;
  }

  document
    .getElementById(id)
    .classList
    .remove("hidden");

  if (
    name ===
    "transactions"
  ){

    loadTransactions();
  }

  if (
    name ===
    "myWithdrawals"
  ){

    loadMyWithdrawals();
  }
}


// ==========================================================
// AI
// ==========================================================

async function askAI(){

  const input =
    document
      .getElementById(
        "question"
      );

  const message =
    input.value.trim();

  if (!message){

    toast(
      "سؤال خود را بنویسید."
    );

    return;
  }

  const chat =
    document
      .getElementById(
        "chat"
      );

  chat.innerHTML +=
    `
      <div class="item chat-user">
        <strong>
          شما:
        </strong>
        <br>
        ${escapeHtml(message)}
      </div>
    `;

  input.value = "";

  const data =
    await api(
      "/api/ai",
      {
        method:"POST",

        body:
          JSON.stringify({
            message
          })
      }
    );

  chat.innerHTML +=
    `
      <div class="item chat-ai">
        <strong>
          🤖 دستیار:
        </strong>
        <br>
        ${escapeHtml(
          data.answer ||
          data.error ||
          "خطا"
        )}
      </div>
    `;

  chat.scrollIntoView({
    behavior:"smooth",
    block:"end"
  });
}


function clearChat(){

  document
    .getElementById(
      "chat"
    )
    .innerHTML = "";
}


// ==========================================================
// ESCAPE HTML
// ==========================================================

function escapeHtml(
  value
){

  return String(value)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}


// ==========================================================
// TRANSACTIONS
// ==========================================================

async function loadTransactions(){

  const data =
    await api(
      "/api/transactions"
    );

  if (!data.ok){
    return;
  }

  const box =
    document
      .getElementById(
        "transactions"
      );

  const list =
    data.transactions ||
    [];

  if (!list.length){

    box.innerHTML =
      `
        <div class="item">
          هنوز تراکنشی وجود ندارد.
        </div>
      `;

    return;
  }

  box.innerHTML =
    list
      .map(
        t => `

          <div class="item">

            <strong>
              ${escapeHtml(
                t.type
              )}
            </strong>

            <br>

            مبلغ:
            <strong>
              $${Number(
                t.amount || 0
              ).toFixed(2)}
            </strong>

            <br>

            <span class="small">
              ${escapeHtml(
                t.description ||
                ""
              )}
            </span>

            <br>

            <span class="small">
              ${escapeHtml(
                t.created_at ||
                ""
              )}
            </span>

          </div>

        `
      )
      .join("");
}


// ==========================================================
// WITHDRAW REQUEST
// ==========================================================

async function requestWithdraw(){

  const amount =
    Number(
      document
        .getElementById(
          "withdrawAmount"
        )
        .value
    );

  const method =
    document
      .getElementById(
        "withdrawMethod"
      )
      .value;

  const network =
    document
      .getElementById(
        "withdrawNetwork"
      )
      .value;

  const walletAddress =
    document
      .getElementById(
        "walletAddress"
      )
      .value
      .trim();

  if (
    !Number.isFinite(amount) ||
    amount < 1
  ){

    toast(
      "حداقل برداشت 1 دلار است."
    );

    return;
  }

  if (!walletAddress){

    toast(
      "آدرس کیف پول را وارد کنید."
    );

    return;
  }

  const data =
    await api(
      "/api/withdraw",
      {
        method:"POST",

        body:
          JSON.stringify({
            amount,
            method,
            network,
            walletAddress
          })
      }
    );

  if (!data.ok){

    toast(
      data.error ||
      "خطا"
    );

    return;
  }

  toast(
    data.message
  );

  currentUser =
    data.user;

  renderUser();

  document
    .getElementById(
      "withdrawAmount"
    )
    .value = "";

  document
    .getElementById(
      "walletAddress"
    )
    .value = "";

  await loadTransactions();

  await loadMyWithdrawals();
}


// ==========================================================
// MY WITHDRAWALS
// ==========================================================

async function loadMyWithdrawals(){

  const data =
    await api(
      "/api/withdrawals"
    );

  if (!data.ok){
    return;
  }

  const box =
    document
      .getElementById(
        "myWithdrawals"
      );

  const list =
    data.withdrawals ||
    [];

  if (!list.length){

    box.innerHTML =
      `
        <div class="item">
          هنوز درخواست برداشتی ثبت نکرده‌اید.
        </div>
      `;

    return;
  }

  box.innerHTML =
    list
      .map(
        w => {

          let status =
            w.status;

          if (
            status ===
            "pending"
          ){
            status =
              "در انتظار بررسی";
          }

          if (
            status ===
            "approved"
          ){
            status =
              "تأیید شده";
          }

          if (
            status ===
            "rejected"
          ){
            status =
              "رد شده";
          }

          return `

            <div class="item">

              <strong>
                $${Number(
                  w.amount || 0
                ).toFixed(2)}
              </strong>

              <br>

              روش:
              ${escapeHtml(
                w.method
              )}

              <br>

              شبکه:
              ${escapeHtml(
                w.network ||
                "-"
              )}

              <br>

              وضعیت:
              <strong>
                ${escapeHtml(
                  status
                )}
              </strong>

              <br>

              تاریخ:
              ${escapeHtml(
                w.created_at ||
                ""
              )}

              ${
                w.admin_note
                  ? `
                    <br>
                    توضیح مدیریت:
                    ${escapeHtml(
                      w.admin_note
                    )}
                  `
                  : ""
              }

            </div>

          `;
        }
      )
      .join("");
}


// ==========================================================
// ADMIN LOGIN UI
// ==========================================================

function showAdminLogin(){

  document
    .getElementById(
      "adminLoginBox"
    )
    .classList
    .toggle("hidden");
}


// ==========================================================
// ADMIN LOGIN
// ==========================================================

async function adminLogin(){

  const password =
    document
      .getElementById(
        "adminPassword"
      )
      .value;

  if (!password){

    toast(
      "رمز مدیریت را وارد کنید."
    );

    return;
  }

  const data =
    await api(
      "/api/admin/login",
      {
        method:"POST",

        body:
          JSON.stringify({
            password
          })
      }
    );

  if (!data.ok){

    toast(
      data.error ||
      "خطا"
    );

    return;
  }

  toast(
    data.message
  );

  document
    .getElementById(
      "adminPanel"
    )
    .classList
    .remove("hidden");

  await loadAdminStats();

  await loadAdminUsers();
}


// ==========================================================
// ADMIN LOGOUT
// ==========================================================

async function adminLogout(){

  await api(
    "/api/admin/logout",
    {
      method:"POST",
      body:"{}"
    }
  );

  document
    .getElementById(
      "adminPanel"
    )
    .classList
    .add("hidden");

  toast(
    "از مدیریت خارج شدید."
  );
}


// ==========================================================
// ADMIN SECTIONS
// ==========================================================

function adminShow(
  name
){

  document
    .getElementById(
      "adminUsersSection"
    )
    .classList
    .toggle(
      "hidden",
      name !== "users"
    );

  document
    .getElementById(
      "adminWithdrawalsSection"
    )
    .classList
    .toggle(
      "hidden",
      name !== "withdrawals"
    );

  if (
    name === "users"
  ){

    loadAdminUsers();
  }

  if (
    name === "withdrawals"
  ){

    loadAdminWithdrawals();
  }
}


// ==========================================================
// ADMIN STATS
// ==========================================================

async function loadAdminStats(){

  const data =
    await api(
      "/api/admin/stats"
    );

  if (!data.ok){

    toast(
      data.error ||
      "خطا"
    );

    return;
  }

  const s =
    data.stats;

  document
    .getElementById(
      "adminStats"
    )
    .innerHTML = `

      <div class="admin-stat">

        <div class="small">
          کل کاربران
        </div>

        <strong>
          ${s.users}
        </strong>

      </div>

      <div class="admin-stat">

        <div class="small">
          کاربران فعال
        </div>

        <strong>
          ${s.active}
        </strong>

      </div>

      <div class="admin-stat">

        <div class="small">
          کاربران غیرفعال
        </div>

        <strong>
          ${s.disabled}
        </strong>

      </div>

      <div class="admin-stat">

        <div class="small">
          کل موجودی
        </div>

        <strong>
          $${Number(
            s.total_balance
          ).toFixed(2)}
        </strong>

      </div>

      <div class="admin-stat">

        <div class="small">
          برداشت‌های در انتظار
        </div>

        <strong>
          ${s.pending_withdrawals}
        </strong>

      </div>

      <div class="admin-stat">

        <div class="small">
          مبلغ در انتظار
        </div>

        <strong>
          $${Number(
            s.pending_amount
          ).toFixed(2)}
        </strong>

      </div>

  `;
}


// ==========================================================
// ADMIN USERS
// ==========================================================

async function loadAdminUsers(){

  const data =
    await api(
      "/api/admin/users"
    );

  if (!data.ok){

    toast(
      data.error ||
      "خطا"
    );

    return;
  }

  const box =
    document
      .getElementById(
        "users"
      );

  const list =
    data.users ||
    [];

  if (!list.length){

    box.innerHTML =
      `
        <div class="item">
          کاربری وجود ندارد.
        </div>
      `;

    return;
  }

  box.innerHTML =
    list
      .map(
        u => `

          <div class="item">

            <strong>
              ${escapeHtml(
                u.full_name
              )}
            </strong>

            <br>

            ایمیل:
            ${escapeHtml(
              u.email
            )}

            <br>

            موجودی:
            <strong>
              $${Number(
                u.balance || 0
              ).toFixed(2)}
            </strong>

            <br>

            وضعیت:
            ${
              u.status === "active"
                ? "فعال"
                : "غیرفعال"
            }

            <br>

            ثبت‌نام:
            ${escapeHtml(
              u.created_at ||
              ""
            )}

            <br><br>

            <button
              onclick="changeBalance(${u.id})"
            >
              💰 تغییر موجودی
            </button>

            <button
              class="${
                u.status === "active"
                  ? "danger"
                  : "success"
              }"
              onclick="
                changeStatus(
                  ${u.id},
                  '${u.status}'
                )
              "
            >
              ${
                u.status === "active"
                  ? "غیرفعال کردن"
                  : "فعال کردن"
              }
            </button>

          </div>

        `
      )
      .join("");
}


// ==========================================================
// CHANGE BALANCE
// ==========================================================

async function changeBalance(
  userId
){

  const value =
    prompt(
      "مبلغ را وارد کنید.\n" +
      "برای افزایش عدد مثبت و " +
      "برای کاهش عدد منفی بنویسید."
    );

  if (
    value === null
  ){
    return;
  }

  const amount =
    Number(value);

  if (
    !Number.isFinite(amount) ||
    amount === 0
  ){

    toast(
      "مبلغ نامعتبر است."
    );

    return;
  }

  const note =
    prompt(
      "توضیح تراکنش:",
      "تغییر موجودی توسط مدیریت"
    ) ||
    "تغییر موجودی توسط مدیریت";

  const data =
    await api(
      "/api/admin/balance",
      {
        method:"POST",

        body:
          JSON.stringify({
            userId,
            amount,
            note
          })
      }
    );

  if (!data.ok){

    toast(
      data.error ||
      "خطا"
    );

    return;
  }

  toast(
    data.message
  );

  await loadAdminUsers();

  await loadAdminStats();

  await loadMe();
}


// ==========================================================
// CHANGE USER STATUS
// ==========================================================

async function changeStatus(
  userId,
  oldStatus
){

  const status =
    oldStatus === "active"
      ? "disabled"
      : "active";

  const data =
    await api(
      "/api/admin/user-status",
      {
        method:"POST",

        body:
          JSON.stringify({
            userId,
            status
          })
      }
    );

  if (!data.ok){

    toast(
      data.error ||
      "خطا"
    );

    return;
  }

  toast(
    data.message
  );

  await loadAdminUsers();

  await loadAdminStats();

  await loadMe();
}


// ==========================================================
// ADMIN WITHDRAWALS
// ==========================================================

async function loadAdminWithdrawals(){

  const data =
    await api(
      "/api/admin/withdrawals"
    );

  if (!data.ok){

    toast(
      data.error ||
      "خطا"
    );

    return;
  }

  const box =
    document
      .getElementById(
        "withdrawals"
      );

  const list =
    data.withdrawals ||
    [];

  if (!list.length){

    box.innerHTML =
      `
        <div class="item">
          درخواست برداشتی وجود ندارد.
        </div>
      `;

    return;
  }

  box.innerHTML =
    list
      .map(
        w => {

          let status =
            w.status;

          if (
            status === "pending"
          ){
            status =
              "در انتظار بررسی";
          }

          if (
            status === "approved"
          ){
            status =
              "تأیید شده";
          }

          if (
            status === "rejected"
          ){
            status =
              "رد شده";
          }

          return `

            <div class="item">

              <strong>
                ${escapeHtml(
                  w.full_name
                )}
              </strong>

              <br>

              ایمیل:
              ${escapeHtml(
                w.email
              )}

              <br>

              مبلغ:
              <strong>
                $${Number(
                  w.amount || 0
                ).toFixed(2)}
              </strong>

              <br>

              روش:
              ${escapeHtml(
                w.method
              )}

              <br>

              شبکه:
              ${escapeHtml(
                w.network ||
                "-"
              )}

              <br>

              وضعیت:
              <strong>
                ${escapeHtml(
                  status
                )}
              </strong>

              <br>

              آدرس کیف پول:

              <div
                class="wallet"
              >
                ${escapeHtml(
                  w.wallet_address
                )}
              </div>

              <br>

              تاریخ:
              ${escapeHtml(
                w.created_at ||
                ""
              )}

              ${
                w.status ===
                "pending"
                  ? `

                    <br><br>

                    <button
                      class="success"
                      onclick="
                        withdrawAction(
                          ${w.id},
                          'approve'
                        )
                      "
                    >
                      ✅ تأیید برداشت
                    </button>

                    <button
                      class="danger"
                      onclick="
                        withdrawAction(
                          ${w.id},
                          'reject'
                        )
                      "
                    >
                      ❌ رد برداشت
                    </button>

                  `
                  : ""
              }

            </div>

          `;
        }
      )
      .join("");
}


// ==========================================================
// ADMIN WITHDRAW ACTION
// ==========================================================

async function withdrawAction(
  id,
  action
){

  const question =
    action === "approve"
      ? "توضیح تأیید برداشت:"
      : "دلیل رد برداشت:";

  const note =
    prompt(
      question,
      ""
    );

  if (
    note === null
  ){
    return;
  }

  const data =
    await api(
      "/api/admin/withdrawal",
      {
        method:"POST",

        body:
          JSON.stringify({
            withdrawalId:id,
            action,
            note
          })
      }
    );

  if (!data.ok){

    toast(
      data.error ||
      "خطا"
    );

    return;
  }

  toast(
    data.message
  );

  await loadAdminWithdrawals();

  await loadAdminUsers();

  await loadAdminStats();

  await loadMe();

  await loadMyWithdrawals();
}


// ==========================================================
// ENTER KEY
// ==========================================================

document
  .getElementById(
    "question"
  )
  ?.addEventListener(
    "keydown",
    function(e){

      if (
        e.key === "Enter" &&
        !e.shiftKey
      ){

        e.preventDefault();

        askAI();
      }

    }
  );


// ==========================================================
// PAGE LOAD
// ==========================================================

window.addEventListener(
  "load",
  async () => {

    await loadMe();

    const admin =
      await api(
        "/api/admin/me"
      );

    if (admin.ok){

      document
        .getElementById(
          "adminPanel"
        )
        .classList
        .remove("hidden");

      await loadAdminStats();

      await loadAdminUsers();
    }

  }
);

</script>

</body>

</html>`;
