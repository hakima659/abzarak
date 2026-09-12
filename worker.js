// =============================================================
// worker.js — ابزارک | دستیار هوش مصنوعی چندزبانه
// Auth + Account + AI + Plans + ZarinPal + Withdrawals
// Admin + PWA + SEO
// =============================================================

const AI_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";
const USD_TO_TOMAN_RATE = 70000;
const FREE_DAILY_LIMIT = 10;

// =============================================================
// HELPERS
// =============================================================

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

function html(content, status = 200) {
  return new Response(content, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    }
  });
}

function uuid() {
  return crypto.randomUUID();
}

function randomCode(length = 6) {
  const digits = "0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let result = "";

  for (let i = 0; i < length; i++) {
    result += digits[bytes[i] % 10];
  }

  return result;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

function getBaseUrl(request, env) {
  return (
    env.PUBLIC_BASE_URL ||
    new URL(request.url).origin
  ).replace(/\/+$/, "");
}

function addDays(date, days) {
  return new Date(
    new Date(date).getTime() +
    days * 24 * 60 * 60 * 1000
  ).toISOString();
}

function todayKey() {
  const d = new Date();

  return [
    d.getUTCFullYear(),
    String(d.getUTCMonth() + 1).padStart(2, "0"),
    String(d.getUTCDate()).padStart(2, "0")
  ].join("-");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// =============================================================
// PASSWORD
// =============================================================

async function hashPassword(password) {
  const iterations = 100000;

  const saltBytes = crypto.getRandomValues(
    new Uint8Array(16)
  );

  const saltHex = [...saltBytes]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  const keyMaterial =
    await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );

  const derivedBits =
    await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: saltBytes,
        iterations,
        hash: "SHA-256"
      },
      keyMaterial,
      256
    );

  const hashHex =
    [...new Uint8Array(derivedBits)]
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

  return `pbkdf2:${iterations}:${saltHex}:${hashHex}`;
}

async function verifyPassword(password, stored) {
  try {
    const parts = String(stored || "").split(":");

    if (
      parts.length !== 4 ||
      parts[0] !== "pbkdf2"
    ) {
      return false;
    }

    const iterations = parseInt(parts[1], 10);

    if (!Number.isFinite(iterations)) {
      return false;
    }

    const saltPairs = parts[2].match(/.{1,2}/g);

    if (!saltPairs) {
      return false;
    }

    const saltBytes = new Uint8Array(
      saltPairs.map(b => parseInt(b, 16))
    );

    const keyMaterial =
      await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
      );

    const derivedBits =
      await crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          salt: saltBytes,
          iterations,
          hash: "SHA-256"
        },
        keyMaterial,
        256
      );

    const hashHex =
      [...new Uint8Array(derivedBits)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

    if (hashHex.length !== parts[3].length) {
      return false;
    }

    let diff = 0;

    for (let i = 0; i < hashHex.length; i++) {
      diff |=
        hashHex.charCodeAt(i) ^
        parts[3].charCodeAt(i);
    }

    return diff === 0;
  } catch {
    return false;
  }
}

// =============================================================
// PLANS
// =============================================================

const PLANS = [
  {
    id: "free",
    name: "رایگان",
    price_toman: 0,
    period: "monthly",
    messages_per_day: 10,
    features: [
      "۱۰ پیام در روز",
      "دستیار هوش مصنوعی",
      "پشتیبانی چندزبانه"
    ]
  },

  {
    id: "basic",
    name: "پایه",
    price_toman: 400000,
    period: "monthly",
    messages_per_day: null,
    features: [
      "پیام نامحدود",
      "دستیار هوش مصنوعی",
      "پشتیبانی چندزبانه",
      "مناسب استفاده روزمره"
    ]
  },

  {
    id: "plus",
    name: "پیشرفته",
    price_toman: 700000,
    period: "monthly",
    messages_per_day: null,
    features: [
      "پیام نامحدود",
      "پاسخ سریع‌تر",
      "امکانات بیشتر",
      "پشتیبانی چندزبانه"
    ]
  },

  {
    id: "pro",
    name: "حرفه‌ای",
    price_toman: 1000000,
    period: "monthly",
    messages_per_day: null,
    features: [
      "پیام نامحدود",
      "اولویت پاسخ‌دهی",
      "امکانات حرفه‌ای",
      "پشتیبانی اختصاصی"
    ]
  },

  {
    id: "special",
    name: "ویژه",
    price_toman: 1500000,
    period: "monthly",
    messages_per_day: null,
    features: [
      "پیام نامحدود",
      "اولویت بالا",
      "امکانات ویژه",
      "پشتیبانی اختصاصی"
    ]
  },

  {
    id: "vip",
    name: "VIP",
    price_toman: 2000000,
    period: "monthly",
    messages_per_day: null,
    features: [
      "پیام نامحدود",
      "بالاترین اولویت",
      "تمام امکانات ویژه",
      "پشتیبانی VIP",
      "دسترسی زودهنگام"
    ]
  }
];

const PLANS_USD = [
  {
    id: "usd_basic",
    name: "Basic",
    price_usd: 5,
    features: [
      "Unlimited messages",
      "Basic AI",
      "Multilingual support"
    ]
  },
  {
    id: "usd_plus",
    name: "Plus",
    price_usd: 10,
    features: [
      "Unlimited messages",
      "Faster responses",
      "More features"
    ]
  },
  {
    id: "usd_pro",
    name: "Pro",
    price_usd: 15,
    features: [
      "Unlimited messages",
      "Priority responses",
      "Dedicated support"
    ]
  },
  {
    id: "usd_premium",
    name: "Premium",
    price_usd: 20,
    features: [
      "Unlimited messages",
      "Priority queue",
      "Dedicated support",
      "Early access"
    ]
  }
];

function getPlan(planId) {
  return PLANS.find(p => p.id === planId) || null;
}

// =============================================================
// INTERNAL TABLES
// These tables are created automatically and do not replace
// your existing D1 tables.
// =============================================================

async function ensureInternalTables(env) {
  if (!env.DB) return;

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS ai_usage (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      usage_date TEXT NOT NULL,
      message_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_usage_user_date
    ON ai_usage(user_id, usage_date)
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS payment_meta (
      payment_id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      plan_currency TEXT NOT NULL DEFAULT 'irt',
      price_toman INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS subscription_meta (
      id TEXT PRIMARY KEY,
      subscription_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS withdrawal_requests (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      method TEXT NOT NULL,
      destination TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      note TEXT,
      created_at TEXT NOT NULL,
      processed_at TEXT
    )
  `).run();
}

// =============================================================
// AUTH
// =============================================================

async function getUserFromToken(request, env) {
  const auth =
    request.headers.get("Authorization") || "";

  const token =
    auth.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    return null;
  }

  try {
    const session =
      await env.DB.prepare(`
        SELECT user_id
        FROM sessions
        WHERE token = ?
      `)
      .bind(token)
      .first();

    if (!session) {
      return null;
    }

    return await env.DB.prepare(`
      SELECT id, name, email, balance
      FROM users
      WHERE id = ?
    `)
    .bind(session.user_id)
    .first();

  } catch (error) {
    console.error("getUserFromToken", error);
    return null;
  }
}

function getAdminToken(request) {
  return (
    request.headers.get("Authorization") || ""
  )
    .replace(/^Bearer\s+/i, "")
    .trim();
}

async function requireAdmin(request, env) {
  const token = getAdminToken(request);

  if (!token) return false;

  try {
    const row =
      await env.DB.prepare(`
        SELECT id
        FROM admin_sessions
        WHERE token = ?
      `)
      .bind(token)
      .first();

    return !!row;
  } catch {
    return false;
  }
}

// =============================================================
// SUBSCRIPTION
// =============================================================

async function getActiveSubscription(userId, env) {
  try {
    const rows =
      await env.DB.prepare(`
        SELECT
          id,
          user_id,
          plan_id,
          status,
          started_at
        FROM subscriptions
        WHERE user_id = ?
          AND status = 'active'
        ORDER BY started_at DESC
        LIMIT 10
      `)
      .bind(userId)
      .all();

    const subscriptions =
      rows.results || [];

    const now = Date.now();

    for (const sub of subscriptions) {
      let expiresAt = null;

      try {
        const meta =
          await env.DB.prepare(`
            SELECT expires_at
            FROM subscription_meta
            WHERE subscription_id = ?
            LIMIT 1
          `)
          .bind(sub.id)
          .first();

        if (meta?.expires_at) {
          expiresAt = meta.expires_at;
        }
      } catch {}

      if (!expiresAt) {
        expiresAt = addDays(
          sub.started_at,
          30
        );
      }

      if (
        new Date(expiresAt).getTime() > now
      ) {
        return {
          ...sub,
          expires_at: expiresAt,
          plan: getPlan(sub.plan_id)
        };
      }
    }

    return null;
  } catch (error) {
    console.error(
      "getActiveSubscription",
      error
    );

    return null;
  }
}

// =============================================================
// AI QUOTA
// =============================================================

async function checkAndUseAiQuota(
  userId,
  env
) {
  await ensureInternalTables(env);

  const subscription =
    await getActiveSubscription(
      userId,
      env
    );

  // Paid plan = unlimited
  if (subscription) {
    return {
      allowed: true,
      used: null,
      limit: null,
      subscription
    };
  }

  const date = todayKey();

  const row =
    await env.DB.prepare(`
      SELECT id, message_count
      FROM ai_usage
      WHERE user_id = ?
        AND usage_date = ?
      LIMIT 1
    `)
    .bind(userId, date)
    .first();

  const used =
    Number(row?.message_count || 0);

  if (used >= FREE_DAILY_LIMIT) {
    return {
      allowed: false,
      used,
      limit: FREE_DAILY_LIMIT,
      subscription: null
    };
  }

  if (row) {
    await env.DB.prepare(`
      UPDATE ai_usage
      SET message_count = message_count + 1,
          updated_at = ?
      WHERE id = ?
    `)
    .bind(
      new Date().toISOString(),
      row.id
    )
    .run();
  } else {
    const now =
      new Date().toISOString();

    await env.DB.prepare(`
      INSERT INTO ai_usage
      (id, user_id, usage_date, message_count, created_at, updated_at)
      VALUES (?, ?, ?, 1, ?, ?)
    `)
    .bind(
      uuid(),
      userId,
      date,
      now,
      now
    )
    .run();
  }

  return {
    allowed: true,
    used: used + 1,
    limit: FREE_DAILY_LIMIT,
    subscription: null
  };
}

// =============================================================
// EMAIL
// =============================================================

async function sendEmail(
  env,
  to,
  subject,
  htmlBody
) {
  if (!env.RESEND_API_KEY) {
    return {
      ok: false,
      error: "RESEND_API_KEY تنظیم نشده است."
    };
  }

  const fromEmail =
    env.RESEND_FROM_EMAIL ||
    "onboarding@resend.dev";

  try {
    const response =
      await fetch(
        "https://api.resend.com/emails",
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [to],
            subject,
            html: htmlBody
          })
        }
      );

    if (!response.ok) {
      return {
        ok: false,
        error: await response.text()
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error:
        error?.message ||
        String(error)
    };
  }
}

// =============================================================
// SIGNUP
// =============================================================

async function handleSignup(request, env) {
  try {
    const body = await request.json();

    const name =
      String(body.name || "").trim();

    const email =
      String(body.email || "")
        .trim()
        .toLowerCase();

    const password =
      String(body.password || "");

    if (!email || !password) {
      return json({
        error:
          "ایمیل و رمز عبور الزامی است."
      }, 400);
    }

    if (!isValidEmail(email)) {
      return json({
        error:
          "فرمت ایمیل نامعتبر است."
      }, 400);
    }

    if (password.length < 6) {
      return json({
        error:
          "رمز عبور باید حداقل ۶ کاراکتر باشد."
      }, 400);
    }

    const existing =
      await env.DB.prepare(`
        SELECT id
        FROM users
        WHERE email = ?
      `)
      .bind(email)
      .first();

    if (existing) {
      return json({
        error:
          "این ایمیل قبلاً ثبت‌نام کرده است."
      }, 409);
    }

    const userId = uuid();
    const passwordHash =
      await hashPassword(password);

    const createdAt =
      new Date().toISOString();

    await env.DB.prepare(`
      INSERT INTO users
      (id, name, email, password_hash, balance, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .bind(
      userId,
      name || "کاربر",
      email,
      passwordHash,
      0,
      createdAt
    )
    .run();

    const token =
      uuid() + uuid();

    await env.DB.prepare(`
      INSERT INTO sessions
      (id, user_id, token, created_at)
      VALUES (?, ?, ?, ?)
    `)
    .bind(
      uuid(),
      userId,
      token,
      createdAt
    )
    .run();

    return json({
      success: true,
      token,
      user: {
        id: userId,
        name: name || "کاربر",
        email,
        balance: 0
      }
    });

  } catch (error) {
    return json({
      error:
        "خطا در ثبت‌نام: " +
        (error?.message || String(error))
    }, 500);
  }
}

// =============================================================
// LOGIN
// =============================================================

async function handleLogin(request, env) {
  try {
    const body = await request.json();

    const email =
      String(body.email || "")
        .trim()
        .toLowerCase();

    const password =
      String(body.password || "");

    const user =
      await env.DB.prepare(`
        SELECT
          id,
          name,
          email,
          password_hash,
          balance
        FROM users
        WHERE email = ?
      `)
      .bind(email)
      .first();

    if (!user) {
      return json({
        error:
          "ایمیل یا رمز عبور اشتباه است."
      }, 401);
    }

    const valid =
      await verifyPassword(
        password,
        user.password_hash
      );

    if (!valid) {
      return json({
        error:
          "ایمیل یا رمز عبور اشتباه است."
      }, 401);
    }

    const token =
      uuid() + uuid();

    await env.DB.prepare(`
      INSERT INTO sessions
      (id, user_id, token, created_at)
      VALUES (?, ?, ?, ?)
    `)
    .bind(
      uuid(),
      user.id,
      token,
      new Date().toISOString()
    )
    .run();

    return json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance:
          Number(user.balance || 0)
      }
    });

  } catch (error) {
    return json({
      error:
        "خطا در ورود: " +
        (error?.message || String(error))
    }, 500);
  }
}

// =============================================================
// ME / ACCOUNT
// =============================================================

async function handleMe(request, env) {
  const user =
    await getUserFromToken(
      request,
      env
    );

  if (!user) {
    return json({
      error:
        "نشست نامعتبر است."
    }, 401);
  }

  await ensureInternalTables(env);

  const subscription =
    await getActiveSubscription(
      user.id,
      env
    );

  let usage = {
    used: 0,
    limit: FREE_DAILY_LIMIT
  };

  if (!subscription) {
    const row =
      await env.DB.prepare(`
        SELECT message_count
        FROM ai_usage
        WHERE user_id = ?
          AND usage_date = ?
        LIMIT 1
      `)
      .bind(
        user.id,
        todayKey()
      )
      .first();

    usage.used =
      Number(row?.message_count || 0);
  } else {
    usage = {
      used: null,
      limit: null
    };
  }

  return json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      balance:
        Number(user.balance || 0)
    },

    subscription,

    usage
  });
}

// =============================================================
// FORGOT PASSWORD
// =============================================================

async function handleForgotPassword(
  request,
  env
) {
  try {
    const body =
      await request.json();

    const email =
      String(body.email || "")
        .trim()
        .toLowerCase();

    if (!isValidEmail(email)) {
      return json({
        error:
          "ایمیل معتبر وارد کنید."
      }, 400);
    }

    const user =
      await env.DB.prepare(`
        SELECT id
        FROM users
        WHERE email = ?
      `)
      .bind(email)
      .first();

    if (!user) {
      return json({
        success: true,
        message:
          "اگر این ایمیل ثبت شده باشد، کد ارسال می‌شود."
      });
    }

    const code =
      randomCode(6);

    const expiresAt =
      new Date(
        Date.now() +
        15 * 60 * 1000
      ).toISOString();

    await env.DB.prepare(`
      INSERT INTO reset_codes
      (id, user_id, code, expires_at, used, created_at)
      VALUES (?, ?, ?, ?, 0, ?)
    `)
    .bind(
      uuid(),
      user.id,
      code,
      expiresAt,
      new Date().toISOString()
    )
    .run();

    const sent =
      await sendEmail(
        env,
        email,
        "کد بازیابی رمز عبور ابزارک",
        `
        <div dir="rtl"
             style="font-family:Arial">
          <h2>🤖 ابزارک</h2>
          <p>کد بازیابی شما:</p>
          <div style="
            font-size:32px;
            font-weight:bold;
            letter-spacing:8px;
            padding:20px;
            background:#f1f5f9;
            text-align:center;
            border-radius:15px">
            ${code}
          </div>
          <p>این کد تا ۱۵ دقیقه معتبر است.</p>
        </div>
        `
      );

    if (!sent.ok) {
      return json({
        error:
          "ارسال ایمیل ناموفق بود: " +
          sent.error
      }, 503);
    }

    return json({
      success: true,
      message:
        "کد بازیابی به ایمیل شما ارسال شد."
    });

  } catch (error) {
    return json({
      error:
        "خطا: " +
        (error?.message || String(error))
    }, 500);
  }
}

// =============================================================
// RESET PASSWORD
// =============================================================

async function handleResetPassword(
  request,
  env
) {
  try {
    const body =
      await request.json();

    const email =
      String(body.email || "")
        .trim()
        .toLowerCase();

    const code =
      String(body.code || "").trim();

    const newPassword =
      String(body.newPassword || "");

    if (
      !email ||
      !code ||
      !newPassword
    ) {
      return json({
        error:
          "ایمیل، کد و رمز جدید الزامی است."
      }, 400);
    }

    if (newPassword.length < 6) {
      return json({
        error:
          "رمز جدید باید حداقل ۶ کاراکتر باشد."
      }, 400);
    }

    const user =
      await env.DB.prepare(`
        SELECT id
        FROM users
        WHERE email = ?
      `)
      .bind(email)
      .first();

    if (!user) {
      return json({
        error:
          "کد نامعتبر است."
      }, 400);
    }

    const row =
      await env.DB.prepare(`
        SELECT
          id,
          expires_at,
          used
        FROM reset_codes
        WHERE user_id = ?
          AND code = ?
        ORDER BY created_at DESC
        LIMIT 1
      `)
      .bind(
        user.id,
        code
      )
      .first();

    if (!row) {
      return json({
        error:
          "کد نامعتبر است."
      }, 400);
    }

    if (Number(row.used) === 1) {
      return json({
        error:
          "این کد قبلاً استفاده شده است."
      }, 400);
    }

    if (
      new Date(row.expires_at).getTime() <
      Date.now()
    ) {
      return json({
        error:
          "کد منقضی شده است."
      }, 400);
    }

    const passwordHash =
      await hashPassword(newPassword);

    await env.DB.prepare(`
      UPDATE users
      SET password_hash = ?
      WHERE id = ?
    `)
    .bind(
      passwordHash,
      user.id
    )
    .run();

    await env.DB.prepare(`
      UPDATE reset_codes
      SET used = 1
      WHERE id = ?
    `)
    .bind(row.id)
    .run();

    await env.DB.prepare(`
      DELETE FROM sessions
      WHERE user_id = ?
    `)
    .bind(user.id)
    .run();

    return json({
      success: true,
      message:
        "رمز عبور با موفقیت تغییر کرد."
    });

  } catch (error) {
    return json({
      error:
        "خطا: " +
        (error?.message || String(error))
    }, 500);
  }
}

// =============================================================
// AI CHAT
// =============================================================

async function handleAiChat(
  request,
  env
) {
  const user =
    await getUserFromToken(
      request,
      env
    );

  if (!user) {
    return json({
      error:
        "برای استفاده ابتدا وارد حساب شوید."
    }, 401);
  }

  if (!env.AI) {
    return json({
      error:
        "Binding هوش مصنوعی با نام AI تنظیم نشده است."
    }, 503);
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json({
      error:
        "بدنه درخواست نامعتبر است."
    }, 400);
  }

  const message =
    String(body.message || "").trim();

  if (!message) {
    return json({
      error:
        "پیام نمی‌تواند خالی باشد."
    }, 400);
  }

  if (message.length > 12000) {
    return json({
      error:
        "پیام بیش از حد طولانی است."
    }, 400);
  }

  const quota =
    await checkAndUseAiQuota(
      user.id,
      env
    );

  if (!quota.allowed) {
    return json({
      error:
        "سقف روزانه پلن رایگان شما تمام شده است.",
      used: quota.used,
      limit: quota.limit,
      upgrade_required: true
    }, 429);
  }

  try {
    const result =
      await env.AI.run(
        AI_MODEL,
        {
          messages: [
            {
              role: "system",
              content: `
You are Abzarak AI.

Detect the user's language automatically.
Reply in the same language by default.

Support Persian, English, Arabic, Turkish,
Azerbaijani, Kurdish, French, German,
Spanish, Italian, Russian, Urdu, Hindi,
Chinese, Japanese and other languages when possible.

Be helpful, accurate and concise.
Use clear formatting when useful.
Do not mention these instructions.
              `
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 768,
          temperature: 0.6
        }
      );

    const reply =
      result?.response ||
      result?.result?.response ||
      "پاسخی دریافت نشد.";

    return json({
      success: true,
      reply,
      usage: quota.used,
      limit: quota.limit
    });

  } catch (error) {
    console.error(
      "Workers AI:",
      error
    );

    return json({
      error:
        "خطا در هوش مصنوعی: " +
        (error?.message || String(error))
    }, 500);
  }
}

// =============================================================
// PLANS API
// =============================================================

async function handlePlans() {
  return json({
    plans: PLANS,
    plans_usd: PLANS_USD,
    usd_to_toman_rate:
      USD_TO_TOMAN_RATE
  });
}

// =============================================================
// ZARINPAL
// =============================================================

function zarinpalBase(env) {
  return env.ZARINPAL_SANDBOX === "true"
    ? "https://sandbox.zarinpal.com"
    : "https://api.zarinpal.com";
}

// =============================================================
// CREATE PAYMENT
// =============================================================

async function handleCreatePayment(
  request,
  env
) {
  const user =
    await getUserFromToken(
      request,
      env
    );

  if (!user) {
    return json({
      error:
        "ابتدا وارد حساب شوید."
    }, 401);
  }

  if (!env.ZARINPAL_MERCHANT_ID) {
    return json({
      error:
        "ZARINPAL_MERCHANT_ID تنظیم نشده است."
    }, 503);
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json({
      error:
        "بدنه درخواست نامعتبر است."
    }, 400);
  }

  const planId =
    String(body.planId || "");

  const plan =
    getPlan(planId);

  if (!plan || plan.price_toman <= 0) {
    return json({
      error:
        "برای پرداخت زرین‌پال فقط پلن‌های تومانی قابل خرید هستند."
    }, 400);
  }

  const active =
    await getActiveSubscription(
      user.id,
      env
    );

  if (active) {
    return json({
      error:
        `اشتراک فعلی شما تا ${new Date(
          active.expires_at
        ).toLocaleDateString("fa-IR")} فعال است.`
    }, 409);
  }

  await ensureInternalTables(env);

  const paymentId = uuid();

  // ZarinPal expects Rial.
  const amountRial =
    Math.round(
      plan.price_toman * 10
    );

  const baseUrl =
    getBaseUrl(request, env);

  try {
    const response =
      await fetch(
        `${zarinpalBase(env)}/pg/v4/payment/request.json`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            merchant_id:
              env.ZARINPAL_MERCHANT_ID,
            amount:
              amountRial,
            callback_url:
              `${baseUrl}/api/payment/verify?pid=${paymentId}`,
            description:
              `اشتراک ابزارک - ${plan.name}`,
            metadata: {
              email: user.email
            }
          })
        }
      );

    const data =
      await response.json();

    if (
      data?.errors &&
      Object.keys(data.errors).length
    ) {
      return json({
        error:
          "خطای زرین‌پال: " +
          (
            data.errors.message ||
            JSON.stringify(data.errors)
          )
      }, 502);
    }

    const authority =
      data?.data?.authority;

    if (!authority) {
      return json({
        error:
          "زرین‌پال Authority معتبر برنگرداند."
      }, 502);
    }

    /*
     * Keep the original payments schema compatible.
     * plan information is stored in payment_meta.
     */

    try {
      await env.DB.prepare(`
        INSERT INTO payments
        (
          id,
          user_id,
          amount,
          status,
          zarinpal_authority,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(
        paymentId,
        user.id,
        amountRial,
        "pending",
        authority,
        new Date().toISOString()
      )
      .run();
    } catch (firstError) {
      /*
       * Compatibility fallback for schemas that contain
       * plan_id/currency columns.
       */
      await env.DB.prepare(`
        INSERT INTO payments
        (
          id,
          user_id,
          plan_id,
          currency,
          amount,
          status,
          zarinpal_authority,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        paymentId,
        user.id,
        plan.id,
        "irt",
        amountRial,
        "pending",
        authority,
        new Date().toISOString()
      )
      .run();
    }

    await env.DB.prepare(`
      INSERT INTO payment_meta
      (
        payment_id,
        plan_id,
        plan_currency,
        price_toman,
        created_at
      )
      VALUES (?, ?, 'irt', ?, ?)
    `)
    .bind(
      paymentId,
      plan.id,
      plan.price_toman,
      new Date().toISOString()
    )
    .run();

    const paymentUrl =
      env.ZARINPAL_SANDBOX === "true"
        ? `https://sandbox.zarinpal.com/pg/StartPay/${authority}`
        : `https://www.zarinpal.com/pg/StartPay/${authority}`;

    return json({
      success: true,
      payment_url: paymentUrl
    });

  } catch (error) {
    console.error(
      "Create payment:",
      error
    );

    return json({
      error:
        "خطا در ساخت پرداخت: " +
        (error?.message || String(error))
    }, 500);
  }
}

// =============================================================
// VERIFY PAYMENT
// =============================================================

async function handleVerifyPayment(
  request,
  env
) {
  const url =
    new URL(request.url);

  const authority =
    url.searchParams.get("Authority");

  const status =
    url.searchParams.get("Status");

  const paymentId =
    url.searchParams.get("pid");

  const baseUrl =
    getBaseUrl(request, env);

  if (!authority || !paymentId) {
    return Response.redirect(
      `${baseUrl}/?payment=error&reason=missing_params`,
      302
    );
  }

  try {
    await ensureInternalTables(env);

    const payment =
      await env.DB.prepare(`
        SELECT *
        FROM payments
        WHERE id = ?
          AND zarinpal_authority = ?
      `)
      .bind(
        paymentId,
        authority
      )
      .first();

    if (!payment) {
      return Response.redirect(
        `${baseUrl}/?payment=error&reason=payment_not_found`,
        302
      );
    }

    if (payment.status === "paid") {
      return Response.redirect(
        `${baseUrl}/?payment=success&already=1`,
        302
      );
    }

    if (status !== "OK") {
      await env.DB.prepare(`
        UPDATE payments
        SET status = 'cancelled'
        WHERE id = ?
      `)
      .bind(paymentId)
      .run();

      return Response.redirect(
        `${baseUrl}/?payment=cancel`,
        302
      );
    }

    const verifyResponse =
      await fetch(
        `${zarinpalBase(env)}/pg/v4/payment/verify.json`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            merchant_id:
              env.ZARINPAL_MERCHANT_ID,
            amount:
              payment.amount,
            authority
          })
        }
      );

    const verifyData =
      await verifyResponse.json();

    const code =
      verifyData?.data?.code;

    if (code === 100 || code === 101) {
      const refId =
        verifyData?.data?.ref_id || "";

      await env.DB.prepare(`
        UPDATE payments
        SET status = 'paid'
        WHERE id = ?
      `)
      .bind(paymentId)
      .run();

      try {
        await env.DB.prepare(`
          UPDATE payments
          SET ref_id = ?
          WHERE id = ?
        `)
        .bind(
          String(refId),
          paymentId
        )
        .run();
      } catch {}

      const meta =
        await env.DB.prepare(`
          SELECT plan_id, price_toman
          FROM payment_meta
          WHERE payment_id = ?
        `)
        .bind(paymentId)
        .first();

      const planId =
        meta?.plan_id ||
        payment.plan_id;

      const plan =
        getPlan(planId);

      if (!plan) {
        return Response.redirect(
          `${baseUrl}/?payment=error&reason=plan_not_found`,
          302
        );
      }

      const existing =
        await getActiveSubscription(
          payment.user_id,
          env
        );

      if (!existing) {
        const subscriptionId =
          uuid();

        const startedAt =
          new Date().toISOString();

        const expiresAt =
          addDays(
            startedAt,
            30
          );

        await env.DB.prepare(`
          INSERT INTO subscriptions
          (
            id,
            user_id,
            plan_id,
            status,
            started_at
          )
          VALUES (?, ?, ?, 'active', ?)
        `)
        .bind(
          subscriptionId,
          payment.user_id,
          plan.id,
          startedAt
        )
        .run();

        await env.DB.prepare(`
          INSERT INTO subscription_meta
          (
            id,
            subscription_id,
            expires_at,
            created_at
          )
          VALUES (?, ?, ?, ?)
        `)
        .bind(
          uuid(),
          subscriptionId,
          expiresAt,
          startedAt
        )
        .run();
      }

      return Response.redirect(
        `${baseUrl}/?payment=success&ref=${encodeURIComponent(
          String(refId)
        )}`,
        302
      );
    }

    await env.DB.prepare(`
      UPDATE payments
      SET status = 'failed'
      WHERE id = ?
    `)
    .bind(paymentId)
    .run();

    const reason =
      encodeURIComponent(
        String(
          verifyData?.errors?.message ||
          `ZarinPal code ${code || "unknown"}`
        ).slice(0, 180)
      );

    return Response.redirect(
      `${baseUrl}/?payment=error&reason=${reason}`,
      302
    );

  } catch (error) {
    console.error(
      "Verify payment:",
      error
    );

    const reason =
      encodeURIComponent(
        String(
          error?.message ||
          error
        ).slice(0, 180)
      );

    return Response.redirect(
      `${baseUrl}/?payment=error&reason=${reason}`,
      302
    );
  }
}

// =============================================================
// USER TRANSACTIONS
// =============================================================

async function handleTransactions(
  request,
  env
) {
  const user =
    await getUserFromToken(
      request,
      env
    );

  if (!user) {
    return json({
      error:
        "ابتدا وارد حساب شوید."
    }, 401);
  }

  try {
    const result =
      await env.DB.prepare(`
        SELECT
          id,
          amount,
          status,
          zarinpal_authority,
          created_at
        FROM payments
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 50
      `)
      .bind(user.id)
      .all();

    return json({
      transactions:
        result.results || []
    });

  } catch (error) {
    return json({
      error:
        "خطا در دریافت تراکنش‌ها: " +
        (error?.message || String(error))
    }, 500);
  }
}

// =============================================================
// WITHDRAWAL REQUEST
// =============================================================

async function handleWithdrawal(
  request,
  env
) {
  const user =
    await getUserFromToken(
      request,
      env
    );

  if (!user) {
    return json({
      error:
        "ابتدا وارد حساب شوید."
    }, 401);
  }

  await ensureInternalTables(env);

  let body;

  try {
    body = await request.json();
  } catch {
    return json({
      error:
        "بدنه درخواست نامعتبر است."
    }, 400);
  }

  const amount =
    Math.floor(
      Number(body.amount)
    );

  const method =
    String(
      body.method || "bank"
    ).trim();

  const destination =
    String(
      body.destination || ""
    ).trim();

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return json({
      error:
        "مبلغ برداشت معتبر نیست."
    }, 400);
  }

  if (!destination) {
    return json({
      error:
        "اطلاعات مقصد برداشت الزامی است."
    }, 400);
  }

  if (amount < 100000) {
    return json({
      error:
        "حداقل مبلغ برداشت ۱۰۰ هزار تومان است."
    }, 400);
  }

  const currentBalance =
    Number(user.balance || 0);

  if (amount > currentBalance) {
    return json({
      error:
        "موجودی کافی نیست."
    }, 400);
  }

  /*
   * Reserve the balance immediately.
   * The withdrawal request stays pending until admin processes it.
   */
  const newBalance =
    currentBalance - amount;

  await env.DB.prepare(`
    UPDATE users
    SET balance = ?
    WHERE id = ?
  `)
  .bind(
    newBalance,
    user.id
  )
  .run();

  try {
    await env.DB.prepare(`
      INSERT INTO withdrawal_requests
      (
        id,
        user_id,
        amount,
        method,
        destination,
        status,
        note,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)
    `)
    .bind(
      uuid(),
      user.id,
      amount,
      method,
      destination,
      "در انتظار بررسی مدیریت",
      new Date().toISOString()
    )
    .run();

  } catch (error) {
    // Return reserved money if request insertion fails.
    await env.DB.prepare(`
      UPDATE users
      SET balance = ?
      WHERE id = ?
    `)
    .bind(
      currentBalance,
      user.id
    )
    .run();

    return json({
      error:
        "ثبت درخواست برداشت ناموفق بود: " +
        (error?.message || String(error))
    }, 500);
  }

  return json({
    success: true,
    message:
      "درخواست برداشت ثبت شد و پس از بررسی مدیریت پرداخت می‌شود.",
    balance:
      newBalance
  });
}

// =============================================================
// USER WITHDRAWALS
// =============================================================

async function handleMyWithdrawals(
  request,
  env
) {
  const user =
    await getUserFromToken(
      request,
      env
    );

  if (!user) {
    return json({
      error:
        "ابتدا وارد حساب شوید."
    }, 401);
  }

  await ensureInternalTables(env);

  const result =
    await env.DB.prepare(`
      SELECT
        id,
        amount,
        method,
        destination,
        status,
        note,
        created_at,
        processed_at
      FROM withdrawal_requests
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `)
    .bind(user.id)
    .all();

  return json({
    withdrawals:
      result.results || []
  });
}

// =============================================================
// ADMIN LOGIN
// =============================================================

async function handleAdminLogin(
  request,
  env
) {
  try {
    const body =
      await request.json();

    if (!env.ADMIN_PASSWORD) {
      return json({
        error:
          "ADMIN_PASSWORD تنظیم نشده است."
      }, 503);
    }

    if (
      String(body.password || "") !==
      env.ADMIN_PASSWORD
    ) {
      return json({
        error:
          "رمز مدیریت اشتباه است."
      }, 401);
    }

    const token =
      uuid() + uuid();

    await env.DB.prepare(`
      INSERT INTO admin_sessions
      (id, token, created_at)
      VALUES (?, ?, ?)
    `)
    .bind(
      uuid(),
      token,
      new Date().toISOString()
    )
    .run();

    return json({
      success: true,
      token
    });

  } catch (error) {
    return json({
      error:
        "خطا در ورود مدیریت: " +
        (error?.message || String(error))
    }, 500);
  }
}

// =============================================================
// ADMIN USERS
// =============================================================

async function handleAdminUsers(
  request,
  env
) {
  if (
    !(await requireAdmin(request, env))
  ) {
    return json({
      error:
        "دسترسی غیرمجاز."
    }, 401);
  }

  try {
    const result =
      await env.DB.prepare(`
        SELECT
          id,
          name,
          email,
          balance,
          created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT 200
      `)
      .all();

    return json({
      users:
        result.results || []
    });

  } catch (error) {
    return json({
      error:
        "خطا: " +
        (error?.message || String(error))
    }, 500);
  }
}

// =============================================================
// ADMIN PAYMENTS
// =============================================================

async function handleAdminPayments(
  request,
  env
) {
  if (
    !(await requireAdmin(request, env))
  ) {
    return json({
      error:
        "دسترسی غیرمجاز."
    }, 401);
  }

  try {
    await ensureInternalTables(env);

    const result =
      await env.DB.prepare(`
        SELECT
          p.id,
          p.user_id,
          p.amount,
          p.status,
          p.created_at,
          u.email,
          m.plan_id
        FROM payments p
        JOIN users u
          ON u.id = p.user_id
        LEFT JOIN payment_meta m
          ON m.payment_id = p.id
        ORDER BY p.created_at DESC
        LIMIT 200
      `)
      .all();

    const payments =
      (result.results || []).map(p => ({
        ...p,
        amount_toman:
          Math.round(
            Number(p.amount || 0) / 10
          )
      }));

    return json({ payments });

  } catch (error) {
    return json({
      error:
        "خطا در تراکنش‌ها: " +
        (error?.message || String(error))
    }, 500);
  }
}

// =============================================================
// ADMIN WITHDRAWALS
// =============================================================

async function handleAdminWithdrawals(
  request,
  env
) {
  if (
    !(await requireAdmin(request, env))
  ) {
    return json({
      error:
        "دسترسی غیرمجاز."
    }, 401);
  }

  await ensureInternalTables(env);

  try {
    const result =
      await env.DB.prepare(`
        SELECT
          w.id,
          w.user_id,
          w.amount,
          w.method,
          w.destination,
          w.status,
          w.note,
          w.created_at,
          w.processed_at,
          u.name,
          u.email
        FROM withdrawal_requests w
        JOIN users u
          ON u.id = w.user_id
        ORDER BY w.created_at DESC
        LIMIT 200
      `)
      .all();

    return json({
      withdrawals:
        result.results || []
    });

  } catch (error) {
    return json({
      error:
        "خطا در درخواست‌های برداشت: " +
        (error?.message || String(error))
    }, 500);
  }
}

// =============================================================
// ADMIN PROCESS WITHDRAWAL
// =============================================================

async function handleAdminProcessWithdrawal(
  request,
  env
) {
  if (
    !(await requireAdmin(request, env))
  ) {
    return json({
      error:
        "دسترسی غیرمجاز."
    }, 401);
  }

  await ensureInternalTables(env);

  let body;

  try {
    body = await request.json();
  } catch {
    return json({
      error:
        "بدنه درخواست نامعتبر است."
    }, 400);
  }

  const withdrawalId =
    String(body.id || "");

  const action =
    String(body.action || "");

  const note =
    String(body.note || "");

  if (
    !withdrawalId ||
    !["paid", "rejected"].includes(action)
  ) {
    return json({
      error:
        "درخواست نامعتبر است."
    }, 400);
  }

  const withdrawal =
    await env.DB.prepare(`
      SELECT *
      FROM withdrawal_requests
      WHERE id = ?
      LIMIT 1
    `)
    .bind(withdrawalId)
    .first();

  if (!withdrawal) {
    return json({
      error:
        "درخواست برداشت پیدا نشد."
    }, 404);
  }

  if (
    withdrawal.status !== "pending"
  ) {
    return json({
      error:
        "این درخواست قبلاً پردازش شده است."
    }, 409);
  }

  if (action === "rejected") {
    /*
     * Return reserved balance to user.
     */
    const user =
      await env.DB.prepare(`
        SELECT balance
        FROM users
        WHERE id = ?
      `)
      .bind(withdrawal.user_id)
      .first();

    const balance =
      Number(user?.balance || 0);

    await env.DB.prepare(`
      UPDATE users
      SET balance = ?
      WHERE id = ?
    `)
    .bind(
      balance +
        Number(withdrawal.amount || 0),
      withdrawal.user_id
    )
    .run();
  }

  await env.DB.prepare(`
    UPDATE withdrawal_requests
    SET
      status = ?,
      note = ?,
      processed_at = ?
    WHERE id = ?
  `)
  .bind(
    action,
    note ||
      (
        action === "paid"
          ? "پرداخت شد"
          : "رد شد و مبلغ به موجودی برگشت"
      ),
    new Date().toISOString(),
    withdrawalId
  )
  .run();

  return json({
    success: true,
    message:
      action === "paid"
        ? "درخواست برداشت به‌عنوان پرداخت‌شده ثبت شد."
        : "درخواست رد شد و مبلغ به موجودی کاربر برگشت."
  });
}

// =============================================================
// ADMIN BALANCE
// =============================================================

async function handleAdminAdjustBalance(
  request,
  env
) {
  if (
    !(await requireAdmin(request, env))
  ) {
    return json({
      error:
        "دسترسی غیرمجاز."
    }, 401);
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json({
      error:
        "بدنه درخواست نامعتبر است."
    }, 400);
  }

  const userId =
    String(body.userId || "");

  const amount =
    Number(body.amount);

  const reason =
    String(body.reason || "");

  if (
    !userId ||
    !Number.isFinite(amount) ||
    amount === 0
  ) {
    return json({
      error:
        "شناسه کاربر و مبلغ معتبر الزامی است."
    }, 400);
  }

  const user =
    await env.DB.prepare(`
      SELECT id, balance
      FROM users
      WHERE id = ?
    `)
    .bind(userId)
    .first();

  if (!user) {
    return json({
      error:
        "کاربر پیدا نشد."
    }, 404);
  }

  const newBalance =
    Number(user.balance || 0) +
    amount;

  if (newBalance < 0) {
    return json({
      error:
        "موجودی نمی‌تواند منفی شود."
    }, 400);
  }

  await env.DB.prepare(`
    UPDATE users
    SET balance = ?
    WHERE id = ?
  `)
  .bind(
    newBalance,
    userId
  )
  .run();

  try {
    await env.DB.prepare(`
      INSERT INTO balance_adjustments
      (id, user_id, amount, reason, created_at)
      VALUES (?, ?, ?, ?, ?)
    `)
    .bind(
      uuid(),
      userId,
      amount,
      reason,
      new Date().toISOString()
    )
    .run();
  } catch {}

  return json({
    success: true,
    new_balance:
      newBalance
  });
}

// =============================================================
// PWA
// =============================================================

function renderManifest(baseUrl) {
  return JSON.stringify({
    name:
      "ابزارک | دستیار هوش مصنوعی",
    short_name:
      "ابزارک",
    description:
      "دستیار هوش مصنوعی چندزبانه",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation:
      "portrait-primary",
    background_color:
      "#f4f6fb",
    theme_color:
      "#12163a",
    lang: "fa",
    dir: "rtl",
    icons: [
      {
        src:
          `${baseUrl}/icon.svg`,
        sizes:
          "512x512",
        type:
          "image/svg+xml",
        purpose:
          "any maskable"
      }
    ]
  }, null, 2);
}

function renderIconSvg() {
  return `
<svg xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 512 512">
<defs>
<linearGradient id="g"
x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="#6d5dfc"/>
<stop offset="55%" stop-color="#3b82f6"/>
<stop offset="100%" stop-color="#111936"/>
</linearGradient>
</defs>

<rect width="512"
height="512"
rx="120"
fill="url(#g)"/>

<circle
cx="256"
cy="238"
r="115"
fill="#eef2ff"/>

<circle
cx="220"
cy="240"
r="13"
fill="#172554"/>

<circle
cx="292"
cy="240"
r="13"
fill="#172554"/>

<path
d="M210 285 Q256 320 302 285"
fill="none"
stroke="#172554"
stroke-width="12"
stroke-linecap="round"/>

<text
x="256"
y="430"
text-anchor="middle"
font-family="Arial"
font-size="58"
font-weight="bold"
fill="white">
AI
</text>
</svg>`;
}

function renderServiceWorker() {
  return `
const CACHE = "abzarak-pwa-v4";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache =>
        cache.addAll([
          "/",
          "/manifest.json",
          "/icon.svg"
        ])
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(k => k !== CACHE)
            .map(k => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url =
    new URL(event.request.url);

  if (
    url.origin !== location.origin ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.status === 200) {
          const copy =
            response.clone();

          caches.open(CACHE)
            .then(cache =>
              cache.put(
                event.request,
                copy
              )
            )
            .catch(() => {});
        }

        return response;
      })
      .catch(() =>
        caches.match(event.request)
          .then(cached =>
            cached ||
            caches.match("/")
          )
      )
  );
});
`;
}

// =============================================================
// HOMEPAGE
// =============================================================

function renderHomepage() {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width,initial-scale=1,viewport-fit=cover">

<meta name="theme-color"
content="#12163a">

<meta name="mobile-web-app-capable"
content="yes">

<meta name="apple-mobile-web-app-capable"
content="yes">

<meta name="robots"
content="index,follow">

<title>
ابزارک | دستیار هوش مصنوعی چندزبانه
</title>

<meta name="description"
content="ابزارک، دستیار هوش مصنوعی چندزبانه برای گفتگو، تولید محتوا، ترجمه و کارهای روزمره.">

<meta name="keywords"
content="ابزارک, هوش مصنوعی, AI, دستیار هوش مصنوعی, چت AI, AI Assistant">

<link rel="manifest"
href="/manifest.json">

<link rel="icon"
href="/icon.svg"
type="image/svg+xml">

<style>

*{
box-sizing:border-box;
}

body{
margin:0;
font-family:
Tahoma,Arial,sans-serif;
background:
linear-gradient(
180deg,
#f6f8ff,
#eef2ff
);
color:#17203a;
}

button,input{
font:inherit;
}

button{
cursor:pointer;
}

.hidden{
display:none!important;
}

.container{
width:min(1180px,94%);
margin:auto;
}

header{
position:sticky;
top:0;
z-index:50;
background:
rgba(255,255,255,.92);
backdrop-filter:blur(15px);
border-bottom:
1px solid #e5e7eb;
}

.nav{
min-height:72px;
display:flex;
align-items:center;
gap:8px;
flex-wrap:wrap;
padding:10px 0;
}

.brand{
display:flex;
align-items:center;
gap:8px;
color:#12163a;
font-size:20px;
font-weight:900;
margin-left:auto;
text-decoration:none;
}

.brand img{
width:42px;
height:42px;
border-radius:13px;
}

.nav-links{
display:flex;
gap:4px;
flex-wrap:wrap;
justify-content:center;
}

.nav-links button{
border:0;
background:transparent;
padding:10px 11px;
border-radius:12px;
font-weight:800;
color:#475569;
}

.nav-links button:hover{
background:#eef2ff;
color:#3730a3;
}

.top-btn{
border:0;
border-radius:12px;
padding:10px 13px;
font-weight:900;
}

.install{
background:#111936;
color:#fff;
}

.lang{
background:#eef2ff;
color:#312e81;
}

.view{
display:none;
padding:
35px 0 60px;
}

.view.active{
display:block;
}

.hero{
margin-top:25px;
padding:70px 35px;
border-radius:32px;
color:#fff;
background:
radial-gradient(
circle at 85% 10%,
rgba(255,255,255,.3),
transparent 25%
),
linear-gradient(
135deg,
#111936,
#4338ca 55%,
#2563eb
);
box-shadow:
0 25px 80px
rgba(37,48,120,.22);
}

.hero h1{
font-size:
clamp(34px,6vw,62px);
line-height:1.15;
margin:20px 0;
}

.hero p{
font-size:18px;
line-height:2;
color:#e8ebff;
max-width:750px;
}

.badge{
display:inline-block;
padding:9px 14px;
border-radius:999px;
background:
rgba(255,255,255,.12);
font-weight:900;
}

.actions{
display:flex;
gap:10px;
flex-wrap:wrap;
margin-top:20px;
}

.btn{
border:0;
border-radius:14px;
padding:13px 18px;
font-weight:900;
}

.primary{
background:
linear-gradient(
135deg,
#4f46e5,
#2563eb
);
color:#fff;
}

.secondary{
background:#eef2ff;
color:#312e81;
}

.danger{
background:#fee2e2;
color:#991b1b;
}

.light{
background:#fff;
color:#202657;
}

.section{
padding:42px 0;
}

.features,
.plans,
.account-grid{
display:grid;
grid-template-columns:
repeat(3,1fr);
gap:18px;
margin-top:20px;
}

.card,
.plan{
background:#fff;
border:1px solid #e5e7eb;
border-radius:22px;
padding:23px;
box-shadow:
0 12px 35px
rgba(15,23,42,.06);
}

.form{
max-width:520px;
margin:auto;
}

.input{
width:100%;
border:1px solid #d7dce8;
border-radius:14px;
padding:14px;
margin:6px 0;
outline:none;
background:#fff;
}

.input:focus{
border-color:#6366f1;
box-shadow:
0 0 0 4px
rgba(99,102,241,.1);
}

.muted{
color:#64748b;
line-height:1.9;
}

.account-value{
font-size:23px;
font-weight:900;
margin-top:7px;
}

.chat{
height:420px;
overflow:auto;
background:#fff;
border:1px solid #e5e7eb;
border-radius:20px;
padding:15px;
margin:15px 0;
}

.message{
padding:13px 15px;
border-radius:16px;
margin:8px 0;
line-height:1.9;
white-space:pre-wrap;
}

.message.user{
background:#eef2ff;
margin-right:12%;
}

.message.ai{
background:#f8fafc;
border:1px solid #e2e8f0;
margin-left:12%;
}

.ai-row{
display:flex;
gap:8px;
}

.ai-row input{
margin:0;
}

.ai-row button{
white-space:nowrap;
}

.currency{
display:flex;
gap:8px;
margin:20px 0;
}

.plan.popular{
border:2px solid #6366f1;
}

.plan h3{
font-size:23px;
margin:0 0 10px;
}

.price{
font-size:30px;
font-weight:950;
color:#1e1b4b;
}

.plan ul{
min-height:130px;
line-height:2;
color:#475569;
}

.notice{
background:#eff6ff;
border:1px solid #bfdbfe;
color:#1e40af;
border-radius:15px;
padding:14px;
line-height:1.9;
margin:12px 0;
}

.table-wrap{
overflow:auto;
background:#fff;
border:1px solid #e5e7eb;
border-radius:16px;
}

table{
width:100%;
border-collapse:collapse;
min-width:700px;
}

th,td{
padding:11px;
border-bottom:
1px solid #edf0f5;
text-align:right;
}

th{
background:#f8fafc;
}

footer{
text-align:center;
padding:30px 0 50px;
color:#64748b;
}

@media(max-width:850px){

.features,
.plans,
.account-grid{
grid-template-columns:
repeat(2,1fr);
}

.brand{
width:100%;
justify-content:center;
margin:0;
}

}

@media(max-width:600px){

.container{
width:94%;
}

.hero{
padding:45px 22px;
border-radius:25px;
}

.features,
.plans,
.account-grid{
grid-template-columns:1fr;
}

.ai-row{
flex-direction:column;
}

.message.user,
.message.ai{
margin-left:0;
margin-right:0;
}

.nav{
justify-content:center;
}

.nav-links{
width:100%;
}

.nav-links button{
font-size:13px;
padding:8px;
}

}

</style>
</head>

<body>

<header>
<div class="container nav">

<a class="brand"
href="/"
onclick="showView('home');return false;">

<img src="/icon.svg">

🤖 ابزارک

</a>

<nav class="nav-links">

<button onclick="showView('home')">
🏠 خانه
</button>

<button onclick="showView('account')">
👤 حساب
</button>

<button onclick="showView('ai')">
🤖 هوش مصنوعی
</button>

<button onclick="showView('plans')">
💰 پلن‌ها
</button>

<button onclick="showView('admin')">
🛠️ مدیریت
</button>

</nav>

<button
id="installBtn"
class="top-btn install hidden"
onclick="installPwa()">
📲 نصب اپ
</button>

<button
id="langBtn"
class="top-btn lang"
onclick="toggleLang()">
English
</button>

</div>
</header>

<main class="container">

<section id="view-home"
class="view active">

<div class="hero">

<div class="badge">
✨ دستیار هوش مصنوعی چندزبانه
</div>

<h1>
دستیار هوشمند شما،
همیشه آماده
</h1>

<p>
با ابزارک گفتگو کنید، سؤال بپرسید،
ترجمه کنید، محتوا بسازید و
کارهای روزمره خود را سریع‌تر انجام دهید.
</p>

<div class="actions">

<button
class="btn light"
onclick="showView('ai')">
🤖 شروع گفتگو
</button>

<button
class="btn"
style="background:rgba(255,255,255,.15);color:white"
onclick="showView('plans')">
💎 مشاهده پلن‌ها
</button>

</div>

</div>

<div class="section">

<h2>
🌍 یک دستیار برای کارهای روزمره
</h2>

<p class="muted">
ابزارک برای موبایل، تبلت و کامپیوتر
طراحی شده و از زبان‌های مختلف پشتیبانی می‌کند.
</p>

<div class="features">

<div class="card">
<h2>🤖</h2>
<h3>هوش مصنوعی</h3>
<p class="muted">
پاسخ به پرسش‌ها و کمک در کارهای روزمره.
</p>
</div>

<div class="card">
<h2>🌍</h2>
<h3>چندزبانه</h3>
<p class="muted">
پشتیبانی از زبان‌های مختلف جهان.
</p>
</div>

<div class="card">
<h2>📱</h2>
<h3>PWA</h3>
<p class="muted">
قابل نصب روی موبایل و استفاده روی کامپیوتر.
</p>
</div>

</div>

</div>

</section>

<section id="view-login"
class="view">

<div class="card form">

<h2>🔑 ورود</h2>

<input
id="loginEmail"
class="input"
type="email"
placeholder="ایمیل">

<input
id="loginPassword"
class="input"
type="password"
placeholder="رمز عبور">

<button
class="btn primary"
style="width:100%"
onclick="login()">
ورود
</button>

<button
class="btn secondary"
style="width:100%;margin-top:8px"
onclick="showView('signup')">
📝 ثبت‌نام
</button>

<button
class="btn"
style="width:100%;margin-top:8px;background:transparent;color:#4f46e5"
onclick="showView('forgot')">
فراموشی رمز عبور؟
</button>

</div>

</section>

<section id="view-signup"
class="view">

<div class="card form">

<h2>📝 ثبت‌نام</h2>

<input
id="signupName"
class="input"
placeholder="نام">

<input
id="signupEmail"
class="input"
type="email"
placeholder="ایمیل">

<input
id="signupPassword"
class="input"
type="password"
placeholder="رمز عبور حداقل ۶ کاراکتر">

<button
class="btn primary"
style="width:100%"
onclick="signup()">
ثبت‌نام
</button>

</div>

</section>

<section id="view-forgot"
class="view">

<div class="card form">

<h2>🔐 بازیابی رمز</h2>

<input
id="forgotEmail"
class="input"
type="email"
placeholder="ایمیل">

<button
class="btn primary"
style="width:100%"
onclick="forgotPassword()">
ارسال کد
</button>

<button
class="btn secondary"
style="width:100%;margin-top:8px"
onclick="showView('reset')">
کد را دارم
</button>

</div>

</section>

<section id="view-reset"
class="view">

<div class="card form">

<h2>🔑 تغییر رمز</h2>

<input
id="resetEmail"
class="input"
type="email"
placeholder="ایمیل">

<input
id="resetCode"
class="input"
placeholder="کد ۶ رقمی">

<input
id="resetPassword"
class="input"
type="password"
placeholder="رمز جدید">

<button
class="btn primary"
style="width:100%"
onclick="resetPassword()">
تغییر رمز
</button>

</div>

</section>

<section id="view-account"
class="view">

<div class="card">

<h2>🏠 حساب من</h2>

<div id="accountBox">
در حال دریافت اطلاعات...
</div>

</div>

</section>

<section id="view-ai"
class="view">

<div class="card">

<h2>🤖 گفتگو با هوش مصنوعی</h2>

<p class="muted">
هر زبانی که استفاده کنید، ابزارک تلاش می‌کند
به همان زبان پاسخ دهد.
</p>

<div id="chat"
class="chat"></div>

<div class="ai-row">

<input
id="aiInput"
class="input"
placeholder="پیام خود را بنویسید..."
onkeydown="if(event.key==='Enter')sendAi()">

<button
class="btn primary"
onclick="sendAi()">
ارسال
</button>

</div>

</div>

</section>

<section id="view-plans"
class="view">

<h2>💰 پلن‌های اشتراک</h2>

<p class="muted">
پلن موردنظر خود را انتخاب کنید.
</p>

<div class="currency">

<button
class="btn secondary"
onclick="setCurrency('irt')">
تومان 🇮🇷
</button>

<button
class="btn secondary"
onclick="setCurrency('usd')">
USD 🌍
</button>

</div>

<div id="plansBox"
class="plans">
در حال بارگذاری...
</div>

</section>

<section id="view-admin"
class="view">

<div id="adminLogin"
class="card form">

<h2>🛠️ مدیریت</h2>

<input
id="adminPassword"
class="input"
type="password"
placeholder="رمز مدیریت">

<button
class="btn primary"
style="width:100%"
onclick="adminLogin()">
ورود
</button>

</div>

<div id="adminPanel"
class="hidden">

<div class="card">

<h2>🛠️ پنل مدیریت</h2>

<div class="actions">

<button
class="btn secondary"
onclick="adminUsers()">
👥 کاربران
</button>

<button
class="btn secondary"
onclick="adminPayments()">
💳 تراکنش‌ها
</button>

<button
class="btn secondary"
onclick="adminWithdrawals()">
💸 برداشت‌ها
</button>

<button
class="btn danger"
onclick="adminLogout()">
خروج
</button>

</div>

<div id="adminContent"></div>

</div>

</div>

</section>

</main>

<footer>
© 2026 ابزارک — دستیار هوش مصنوعی چندزبانه
</footer>

<script>

let token =
localStorage.getItem("abzarak_token") || "";

let adminToken =
localStorage.getItem("abzarak_admin_token") || "";

let currency = "irt";

let plansData = null;

let pwaPrompt = null;

function api(path, options = {}) {

const headers =
options.headers || {};

headers["Content-Type"] =
"application/json";

if(token){
headers["Authorization"] =
"Bearer " + token;
}

return fetch(path,{
...options,
headers
});

}

function adminApi(path,options={}){

const headers =
options.headers || {};

headers["Content-Type"] =
"application/json";

if(adminToken){
headers["Authorization"] =
"Bearer " + adminToken;
}

return fetch(path,{
...options,
headers
});

}

function showView(name){

document
.querySelectorAll(".view")
.forEach(x =>
x.classList.remove("active")
);

const view =
document.getElementById(
"view-" + name
);

if(view){
view.classList.add("active");
}

window.scrollTo({
top:0,
behavior:"smooth"
});

if(name === "account"){
loadAccount();
}

if(name === "plans"){
loadPlans();
}

}

function msg(text){
alert(text);
}

async function signup(){

try{

const response =
await api("/api/signup",{
method:"POST",
body:JSON.stringify({
name:
document.getElementById(
"signupName"
).value.trim(),

email:
document.getElementById(
"signupEmail"
).value.trim(),

password:
document.getElementById(
"signupPassword"
).value
})
});

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
"خطا در ثبت‌نام"
);

token=data.token;

localStorage.setItem(
"abzarak_token",
token
);

msg("ثبت‌نام با موفقیت انجام شد.");

showView("account");

}catch(e){
msg(e.message);
}

}

async function login(){

try{

const response =
await api("/api/login",{
method:"POST",
body:JSON.stringify({
email:
document.getElementById(
"loginEmail"
).value.trim(),

password:
document.getElementById(
"loginPassword"
).value
})
});

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
"خطا در ورود"
);

token=data.token;

localStorage.setItem(
"abzarak_token",
token
);

msg("ورود موفق بود.");

showView("account");

}catch(e){
msg(e.message);
}

}

async function loadAccount(){

const box =
document.getElementById(
"accountBox"
);

if(!token){

box.innerHTML=`
<p class="muted">
برای مشاهده حساب وارد شوید.
</p>

<button
class="btn primary"
onclick="showView('login')">
🔑 ورود
</button>

<button
class="btn secondary"
onclick="showView('signup')">
📝 ثبت‌نام
</button>
`;

return;
}

box.innerHTML =
"در حال دریافت اطلاعات...";

try{

const response =
await api("/api/me");

const data =
await response.json();

if(!response.ok){

token="";

localStorage.removeItem(
"abzarak_token"
);

throw new Error(
data.error ||
"نشست نامعتبر است."
);

}

const user=data.user;
const sub=data.subscription;
const usage=data.usage;

let subscriptionHtml = "";

if(sub){

subscriptionHtml=`
<div class="notice">
💎 اشتراک فعال:
<strong>
${esc(sub.plan?.name || sub.plan_id)}
</strong>
<br>
📅 پایان اشتراک:
<strong>
${new Date(
sub.expires_at
).toLocaleDateString("fa-IR")}
</strong>
<br>
🚀 پیام‌های AI:
نامحدود
</div>
`;

}else{

subscriptionHtml=`
<div class="notice">
🆓 پلن رایگان
<br>
📊 مصرف امروز:
<strong>
${usage.used}
</strong>
از
<strong>
${usage.limit}
</strong>
پیام
</div>
`;

}

box.innerHTML=`

<div class="account-grid">

<div class="card">
<div class="muted">
نام
</div>
<div class="account-value">
${esc(user.name)}
</div>
</div>

<div class="card">
<div class="muted">
ایمیل
</div>
<div class="account-value"
style="font-size:16px">
${esc(user.email)}
</div>
</div>

<div class="card">
<div class="muted">
موجودی
</div>
<div class="account-value">
${num(user.balance)}
تومان
</div>
</div>

</div>

${subscriptionHtml}

<div class="actions">

<button
class="btn primary"
onclick="showView('ai')">
🤖 هوش مصنوعی
</button>

<button
class="btn secondary"
onclick="showView('plans')">
💎 پلن‌ها
</button>

<button
class="btn secondary"
onclick="withdraw()">
💸 برداشت موجودی
</button>

<button
class="btn secondary"
onclick="myWithdrawals()">
📋 وضعیت برداشت‌ها
</button>

<button
class="btn danger"
onclick="logout()">
خروج
</button>

</div>

<div id="accountExtra"></div>
`;

}catch(e){

box.innerHTML=`
<div class="notice">
${esc(e.message)}
</div>
`;

}

}

async function withdraw(){

if(!token){
showView("login");
return;
}

const amount =
prompt(
"مبلغ برداشت به تومان را وارد کنید:"
);

if(!amount) return;

const destination =
prompt(
"شماره شبا / حساب مقصد را وارد کنید:"
);

if(!destination) return;

try{

const response =
await api(
"/api/withdrawal",
{
method:"POST",
body:JSON.stringify({
amount:Number(amount),
method:"bank",
destination
})
}
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
"خطا در برداشت"
);

msg(
"درخواست برداشت ثبت شد و پس از بررسی مدیریت پرداخت می‌شود."
);

loadAccount();

}catch(e){
msg(e.message);
}

}

async function myWithdrawals(){

try{

const response =
await api(
"/api/my-withdrawals"
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error || "خطا"
);

const rows =
data.withdrawals || [];

const box =
document.getElementById(
"accountExtra"
);

box.innerHTML=`

<div class="card"
style="margin-top:15px">

<h3>
📋 درخواست‌های برداشت
</h3>

<div class="table-wrap">

<table>

<thead>
<tr>
<th>مبلغ</th>
<th>روش</th>
<th>وضعیت</th>
<th>تاریخ</th>
</tr>
</thead>

<tbody>

${rows.map(x=>`

<tr>

<td>
${num(x.amount)}
تومان
</td>

<td>
${esc(x.method)}
</td>

<td>
${esc(x.status)}
</td>

<td>
${esc(x.created_at)}
</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>
`;

}catch(e){
msg(e.message);
}

}

function logout(){

token="";

localStorage.removeItem(
"abzarak_token"
);

showView("home");

}

async function forgotPassword(){

try{

const email =
document.getElementById(
"forgotEmail"
).value.trim();

const response =
await api(
"/api/forgot-password",
{
method:"POST",
body:JSON.stringify({email})
}
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error || "خطا"
);

document.getElementById(
"resetEmail"
).value=email;

msg(
data.message ||
"کد ارسال شد."
);

showView("reset");

}catch(e){
msg(e.message);
}

}

async function resetPassword(){

try{

const response =
await api(
"/api/reset-password",
{
method:"POST",
body:JSON.stringify({
email:
document.getElementById(
"resetEmail"
).value.trim(),

code:
document.getElementById(
"resetCode"
).value.trim(),

newPassword:
document.getElementById(
"resetPassword"
).value
})
}
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error || "خطا"
);

msg(
data.message ||
"رمز تغییر کرد."
);

showView("login");

}catch(e){
msg(e.message);
}

}

async function sendAi(){

const input =
document.getElementById(
"aiInput"
);

const message =
input.value.trim();

if(!message)
return;

if(!token){

msg(
"برای استفاده از هوش مصنوعی ابتدا وارد حساب شوید."
);

showView("login");

return;
}

addMessage(
"user",
message
);

input.value="";

const loading =
"loading_" + Date.now();

addMessage(
"ai",
"در حال پاسخ...",
loading
);

try{

const response =
await api(
"/api/ai/chat",
{
method:"POST",
body:JSON.stringify({
message
})
}
);

const data =
await response.json();

const el =
document.getElementById(
loading
);

if(el)
el.remove();

if(!response.ok){

if(data.upgrade_required){

addMessage(
"ai",
"⚠️ سقف ۱۰ پیام روزانه پلن رایگان شما تمام شده است. برای ادامه استفاده، یکی از پلن‌های اشتراکی را انتخاب کنید."
);

}else{

addMessage(
"ai",
"❌ " +
(data.error || "خطا")
);

}

return;
}

addMessage(
"ai",
data.reply ||
"پاسخی دریافت نشد."
);

}catch(e){

const el =
document.getElementById(
loading
);

if(el)
el.remove();

addMessage(
"ai",
"❌ " + e.message
);

}

}

function addMessage(
type,
text,
id=""
){

const chat =
document.getElementById(
"chat"
);

const div =
document.createElement("div");

div.className =
"message " + type;

if(id)
div.id=id;

div.textContent=text;

chat.appendChild(div);

chat.scrollTop =
chat.scrollHeight;

}

async function loadPlans(){

const box =
document.getElementById(
"plansBox"
);

if(!plansData){

try{

const response =
await api("/api/plans");

plansData =
await response.json();

}catch(e){

box.innerHTML =
"خطا در دریافت پلن‌ها.";

return;
}

}

renderPlans();

}

function setCurrency(x){

currency=x;

renderPlans();

}

function renderPlans(){

if(!plansData)
return;

const box =
document.getElementById(
"plansBox"
);

const plans =
currency === "usd"
? plansData.plans_usd
: plansData.plans;

box.innerHTML =
plans.map((plan,i)=>{

const usd =
currency === "usd";

const price =
usd
? "$" + plan.price_usd
: num(plan.price_toman);

const isPopular =
plan.id === "pro" ||
plan.id === "special";

const button =
plan.price_toman === 0
? `
<button
class="btn secondary"
style="width:100%"
onclick="showView('ai')">
شروع استفاده
</button>
`
:
usd
? `
<button
class="btn secondary"
style="width:100%"
onclick="msg('پرداخت دلاری به‌زودی فعال می‌شود. درگاه زرین‌پال برای پرداخت تومانی است.')">
پرداخت بین‌المللی
</button>
`
:
`
<button
class="btn primary"
style="width:100%"
onclick="buyPlan('${plan.id}')">
💳 خرید پلن
</button>
`;

return `

<div class="plan ${
isPopular ? "popular" : ""
}">

${isPopular ? `
<div class="badge">
محبوب
</div>
` : ""}

<h3>
${esc(plan.name)}
</h3>

<div class="price">
${price}

<small>
${usd
? " / month"
: " تومان / ماه"}
</small>

</div>

<ul>

${(plan.features || [])
.map(f =>
`<li>${esc(f)}</li>`
)
.join("")}

</ul>

${button}

</div>

`;

}).join("");

}

async function buyPlan(id){

if(!token){

msg(
"برای خرید ابتدا وارد حساب شوید."
);

showView("login");

return;
}

try{

const response =
await api(
"/api/payment/request",
{
method:"POST",
body:JSON.stringify({
planId:id
})
}
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
"خطا در پرداخت"
);

window.location.href =
data.payment_url;

}catch(e){

msg(e.message);

}

}

async function adminLogin(){

try{

const response =
await adminApi(
"/api/admin/login",
{
method:"POST",
body:JSON.stringify({
password:
document.getElementById(
"adminPassword"
).value
})
}
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
"خطا"
);

adminToken=data.token;

localStorage.setItem(
"abzarak_admin_token",
adminToken
);

showAdmin();

}catch(e){
msg(e.message);
}

}

function showAdmin(){

document
.getElementById("adminLogin")
.classList.add("hidden");

document
.getElementById("adminPanel")
.classList.remove("hidden");

adminUsers();

}

async function adminUsers(){

const box =
document.getElementById(
"adminContent"
);

box.innerHTML =
"در حال دریافت کاربران...";

try{

const response =
await adminApi(
"/api/admin/users"
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error || "خطا"
);

box.innerHTML=`

<h3>👥 کاربران</h3>

<div class="table-wrap">

<table>

<thead>
<tr>
<th>نام</th>
<th>ایمیل</th>
<th>موجودی</th>
<th>تاریخ</th>
</tr>
</thead>

<tbody>

${(data.users || [])
.map(x=>`

<tr>

<td>
${esc(x.name)}
</td>

<td>
${esc(x.email)}
</td>

<td>
${num(x.balance)}
تومان
</td>

<td>
${esc(x.created_at)}
</td>

</tr>

`).join("")}

</tbody>

</table>

</div>
`;

}catch(e){

box.innerHTML =
`<div class="notice">
${esc(e.message)}
</div>`;

}

}

async function adminPayments(){

const box =
document.getElementById(
"adminContent"
);

box.innerHTML =
"در حال دریافت تراکنش‌ها...";

try{

const response =
await adminApi(
"/api/admin/payments"
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error || "خطا"
);

box.innerHTML=`

<h3>💳 تراکنش‌ها</h3>

<div class="table-wrap">

<table>

<thead>
<tr>
<th>ایمیل</th>
<th>پلن</th>
<th>مبلغ</th>
<th>وضعیت</th>
</tr>
</thead>

<tbody>

${(data.payments || [])
.map(x=>`

<tr>

<td>
${esc(x.email)}
</td>

<td>
${esc(x.plan_id || "-")}
</td>

<td>
${num(x.amount_toman)}
تومان
</td>

<td>
${esc(x.status)}
</td>

</tr>

`).join("")}

</tbody>

</table>

</div>
`;

}catch(e){

box.innerHTML =
`<div class="notice">
${esc(e.message)}
</div>`;

}

}

async function adminWithdrawals(){

const box =
document.getElementById(
"adminContent"
);

box.innerHTML =
"در حال دریافت برداشت‌ها...";

try{

const response =
await adminApi(
"/api/admin/withdrawals"
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error || "خطا"
);

const rows =
data.withdrawals || [];

box.innerHTML=`

<h3>💸 درخواست‌های برداشت</h3>

<div class="table-wrap">

<table>

<thead>

<tr>
<th>ایمیل</th>
<th>مبلغ</th>
<th>مقصد</th>
<th>وضعیت</th>
<th>عملیات</th>
</tr>

</thead>

<tbody>

${rows.map(x=>`

<tr>

<td>
${esc(x.email)}
</td>

<td>
${num(x.amount)}
تومان
</td>

<td>
${esc(x.destination)}
</td>

<td>
${esc(x.status)}
</td>

<td>

${
x.status === "pending"
? `
<button
class="btn primary"
onclick="processWithdrawal('${x.id}','paid')">
پرداخت شد
</button>

<button
class="btn danger"
onclick="processWithdrawal('${x.id}','rejected')">
رد
</button>
`
: "-"
}

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>
`;

}catch(e){

box.innerHTML =
`<div class="notice">
${esc(e.message)}
</div>`;

}

}

async function processWithdrawal(
id,
action
){

try{

const response =
await adminApi(
"/api/admin/withdrawals/process",
{
method:"POST",
body:JSON.stringify({
id,
action
})
}
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error || "خطا"
);

msg(
data.message ||
"انجام شد."
);

adminWithdrawals();

}catch(e){
msg(e.message);
}

}

function adminLogout(){

adminToken="";

localStorage.removeItem(
"abzarak_admin_token"
);

document
.getElementById("adminLogin")
.classList.remove("hidden");

document
.getElementById("adminPanel")
.classList.add("hidden");

}

function num(x){

return Number(
x || 0
).toLocaleString("fa-IR");

}

function esc(x){

return String(x ?? "")
.replaceAll("&","&amp;")
.replaceAll("<","&lt;")
.replaceAll(">","&gt;")
.replaceAll('"',"&quot;")
.replaceAll("'","&#039;");

}

function toggleLang(){

const html =
document.documentElement;

const btn =
document.getElementById(
"langBtn"
);

if(html.lang === "fa"){

html.lang="en";
html.dir="ltr";

btn.textContent="فارسی";

document.title =
"Abzarak | AI Assistant";

}else{

html.lang="fa";
html.dir="rtl";

btn.textContent="English";

document.title =
"ابزارک | دستیار هوش مصنوعی چندزبانه";

}

}

window.addEventListener(
"beforeinstallprompt",
event=>{

event.preventDefault();

pwaPrompt=event;

document
.getElementById("installBtn")
.classList.remove("hidden");

}
);

async function installPwa(){

if(!pwaPrompt){

msg(
"از منوی Chrome گزینه «افزودن به صفحه اصلی» را انتخاب کنید."
);

return;
}

pwaPrompt.prompt();

await pwaPrompt.userChoice;

pwaPrompt=null;

document
.getElementById("installBtn")
.classList.add("hidden");

}

function paymentResult(){

const p =
new URLSearchParams(
location.search
).get("payment");

if(!p)
return;

if(p === "success")
alert(
"✅ پرداخت موفق بود و اشتراک شما فعال شد."
);

if(p === "cancel")
alert(
"پرداخت لغو شد."
);

if(p === "failed")
alert(
"❌ پرداخت تأیید نشد."
);

if(p === "error")
alert(
"❌ خطا در پرداخت."
);

history.replaceState(
{},
document.title,
"/"
);

}

document.addEventListener(
"DOMContentLoaded",
()=>{

paymentResult();

loadPlans();

if(token)
loadAccount();

if(adminToken){

document
.getElementById("adminLogin")
.classList.add("hidden");

document
.getElementById("adminPanel")
.classList.remove("hidden");

}

if("serviceWorker" in navigator){

navigator.serviceWorker
.register("/sw.js")
.catch(()=>{});

}

}
);

</script>

</body>
</html>`;
}

// =============================================================
// ROBOTS
// =============================================================

function renderRobotsTxt(baseUrl) {
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
}

// =============================================================
// SITEMAP
// =============================================================

function renderSitemapXml(baseUrl) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<url>
<loc>${baseUrl}/</loc>
<changefreq>weekly</changefreq>
<priority>1.0</priority>
</url>

</urlset>`;
}

// =============================================================
// ROUTER
// =============================================================

export default {

  async fetch(request, env) {

    const url =
      new URL(request.url);

    // ---------------------------------------------------------
    // OPTIONS
    // ---------------------------------------------------------

    if (
      request.method === "OPTIONS"
    ) {
      return json({}, 204);
    }

    // ---------------------------------------------------------
    // MANIFEST
    // ---------------------------------------------------------

    if (
      url.pathname === "/manifest.json" &&
      request.method === "GET"
    ) {

      return new Response(
        renderManifest(
          getBaseUrl(request, env)
        ),
        {
          headers: {
            "Content-Type":
              "application/manifest+json; charset=utf-8",
            "Cache-Control":
              "public,max-age=3600"
          }
        }
      );
    }

    // ---------------------------------------------------------
    // SERVICE WORKER
    // ---------------------------------------------------------

    if (
      url.pathname === "/sw.js" &&
      request.method === "GET"
    ) {

      return new Response(
        renderServiceWorker(),
        {
          headers: {
            "Content-Type":
              "application/javascript; charset=utf-8",
            "Cache-Control":
              "no-cache",
            "Service-Worker-Allowed":
              "/"
          }
        }
      );
    }

    // ---------------------------------------------------------
    // ICON
    // ---------------------------------------------------------

    if (
      url.pathname === "/icon.svg" &&
      request.method === "GET"
    ) {

      return new Response(
        renderIconSvg(),
        {
          headers: {
            "Content-Type":
              "image/svg+xml; charset=utf-8",
            "Cache-Control":
              "public,max-age=86400"
          }
        }
      );
    }

    // ---------------------------------------------------------
    // HOME
    // ---------------------------------------------------------

    if (
      url.pathname === "/" &&
      request.method === "GET"
    ) {

      return html(
        renderHomepage()
      );
    }

    // ---------------------------------------------------------
    // ENAMAD
    // ---------------------------------------------------------

    if (
      url.pathname === "/36032134.txt" &&
      request.method === "GET"
    ) {

      return new Response(
        "",
        {
          headers: {
            "Content-Type":
              "text/plain; charset=utf-8"
          }
        }
      );
    }

    // ---------------------------------------------------------
    // ROBOTS
    // ---------------------------------------------------------

    if (
      url.pathname === "/robots.txt" &&
      request.method === "GET"
    ) {

      return new Response(
        renderRobotsTxt(
          getBaseUrl(request, env)
        ),
        {
          headers: {
            "Content-Type":
              "text/plain; charset=utf-8"
          }
        }
      );
    }

    // ---------------------------------------------------------
    // SITEMAP
    // ---------------------------------------------------------

    if (
      url.pathname === "/sitemap.xml" &&
      request.method === "GET"
    ) {

      return new Response(
        renderSitemapXml(
          getBaseUrl(request, env)
        ),
        {
          headers: {
            "Content-Type":
              "application/xml; charset=utf-8"
          }
        }
      );
    }

    // ---------------------------------------------------------
    // AUTH
    // ---------------------------------------------------------

    if (
      url.pathname === "/api/signup" &&
      request.method === "POST"
    ) {
      return handleSignup(
        request,
        env
      );
    }

    if (
      url.pathname === "/api/login" &&
      request.method === "POST"
    ) {
      return handleLogin(
        request,
        env
      );
    }

    if (
      url.pathname === "/api/me" &&
      request.method === "GET"
    ) {
      return handleMe(
        request,
        env
      );
    }

    if (
      url.pathname === "/api/forgot-password" &&
      request.method === "POST"
    ) {
      return handleForgotPassword(
        request,
        env
      );
    }

    if (
      url.pathname === "/api/reset-password" &&
      request.method === "POST"
    ) {
      return handleResetPassword(
        request,
        env
      );
    }

    // ---------------------------------------------------------
    // PLANS
    // ---------------------------------------------------------

    if (
      url.pathname === "/api/plans" &&
      request.method === "GET"
    ) {
      return handlePlans();
    }

    // ---------------------------------------------------------
    // AI
    // ---------------------------------------------------------

    if (
      url.pathname === "/api/ai/chat" &&
      request.method === "POST"
    ) {
      return handleAiChat(
        request,
        env
      );
    }

    // ---------------------------------------------------------
    // PAYMENTS
    // ---------------------------------------------------------

    if (
      url.pathname === "/api/payment/request" &&
      request.method === "POST"
    ) {
      return handleCreatePayment(
        request,
        env
      );
    }

    if (
      url.pathname === "/api/payment/verify" &&
      request.method === "GET"
    ) {
      return handleVerifyPayment(
        request,
        env
      );
    }

    if (
      url.pathname === "/api/transactions" &&
      request.method === "GET"
    ) {
      return handleTransactions(
        request,
        env
      );
    }

    // ---------------------------------------------------------
    // WITHDRAWALS
    // ---------------------------------------------------------

    if (
      url.pathname === "/api/withdrawal" &&
      request.method === "POST"
    ) {
      return handleWithdrawal(
        request,
        env
      );
    }

    if (
      url.pathname === "/api/my-withdrawals" &&
      request.method === "GET"
    ) {
      return handleMyWithdrawals(
        request,
        env
      );
    }

    // ---------------------------------------------------------
    // ADMIN
    // ---------------------------------------------------------

    if (
      url.pathname === "/api/admin/login" &&
      request.method === "POST"
    ) {
      return handleAdminLogin(
        request,
        env
      );
    }

    if (
      url.pathname === "/api/admin/users" &&
      request.method === "GET"
    ) {
      return handleAdminUsers(
        request,
        env
      );
    }

    if (
      url.pathname === "/api/admin/payments" &&
      request.method === "GET"
    ) {
      return handleAdminPayments(
        request,
        env
      );
    }

    if (
      url.pathname === "/api/admin/withdrawals" &&
      request.method === "GET"
    ) {
      return handleAdminWithdrawals(
        request,
        env
      );
    }

    if (
      url.pathname === "/api/admin/withdrawals/process" &&
      request.method === "POST"
    ) {
      return handleAdminProcessWithdrawal(
        request,
        env
      );
    }

    if (
      url.pathname === "/api/admin/adjust-balance" &&
      request.method === "POST"
    ) {
      return handleAdminAdjustBalance(
        request,
        env
      );
    }

    // ---------------------------------------------------------
    // 404
    // ---------------------------------------------------------

    return json({
      error:
        "مسیر یافت نشد."
    }, 404);
  }
};
