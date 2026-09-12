// =============================================================
// worker.js — ابزارک | دستیار هوش مصنوعی چندزبانه
// Auth + Account + AI + Plans + ZarinPal + Admin + PWA + SEO
// =============================================================

const AI_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";
const USD_TO_TOMAN_RATE = 70000;

// =============================================================
// BASIC RESPONSE HELPERS
// =============================================================

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

function html(content, status = 200) {
  return new Response(content, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

function uuid() {
  return crypto.randomUUID();
}

function randomCode(len = 6) {
  const digits = "0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  let result = "";

  for (let i = 0; i < len; i++) {
    result += digits[bytes[i] % 10];
  }

  return result;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

function getBaseUrl(request, env) {
  return (env.PUBLIC_BASE_URL || new URL(request.url).origin)
    .replace(/\/+$/, "");
}

// =============================================================
// PASSWORD HASH
// =============================================================

async function hashPassword(password) {
  const iterations = 100000;

  const saltBytes = crypto.getRandomValues(new Uint8Array(16));

  const saltHex = [...saltBytes]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const hashHex = [...new Uint8Array(derivedBits)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `pbkdf2:${iterations}:${saltHex}:${hashHex}`;
}

async function verifyPassword(password, stored) {
  try {
    const parts = String(stored || "").split(":");

    if (parts.length !== 4 || parts[0] !== "pbkdf2") {
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
      saltPairs.map((b) => parseInt(b, 16))
    );

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: saltBytes,
        iterations,
        hash: "SHA-256",
      },
      keyMaterial,
      256
    );

    const hashHex = [...new Uint8Array(derivedBits)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (hashHex.length !== parts[3].length) {
      return false;
    }

    let diff = 0;

    for (let i = 0; i < hashHex.length; i++) {
      diff |= hashHex.charCodeAt(i) ^ parts[3].charCodeAt(i);
    }

    return diff === 0;
  } catch {
    return false;
  }
}

// =============================================================
// PWA
// =============================================================

function renderManifest(baseUrl) {
  return JSON.stringify(
    {
      name: "ابزارک | دستیار هوش مصنوعی",
      short_name: "ابزارک",
      description:
        "دستیار هوش مصنوعی چندزبانه برای کاربران سراسر جهان",
      start_url: "/",
      scope: "/",
      display: "standalone",
      display_override: [
        "window-controls-overlay",
        "standalone",
      ],
      orientation: "portrait-primary",
      background_color: "#f4f6fb",
      theme_color: "#12163a",
      lang: "fa",
      dir: "rtl",
      categories: [
        "productivity",
        "utilities",
        "education",
      ],
      icons: [
        {
          src: `${baseUrl}/icon.svg`,
          sizes: "192x192",
          type: "image/svg+xml",
          purpose: "any maskable",
        },
        {
          src: `${baseUrl}/icon.svg`,
          sizes: "512x512",
          type: "image/svg+xml",
          purpose: "any maskable",
        },
      ],
    },
    null,
    2
  );
}

function renderIconSvg() {
  return `
<svg xmlns="http://www.w3.org/2000/svg"
     width="512"
     height="512"
     viewBox="0 0 512 512">

  <defs>
    <linearGradient id="bg"
      x1="0"
      y1="0"
      x2="1"
      y2="1">
      <stop offset="0%" stop-color="#12163a"/>
      <stop offset="55%" stop-color="#3446c7"/>
      <stop offset="100%" stop-color="#6d5dfc"/>
    </linearGradient>

    <linearGradient id="orb"
      x1="0"
      y1="0"
      x2="1"
      y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#aab8ff"/>
    </linearGradient>
  </defs>

  <rect
    width="512"
    height="512"
    rx="120"
    fill="url(#bg)"
  />

  <circle
    cx="256"
    cy="220"
    r="112"
    fill="url(#orb)"
    opacity="0.98"
  />

  <path
    d="M185 220
       C185 178 216 146 256 146
       C296 146 327 178 327 220
       C327 262 296 294 256 294
       C216 294 185 262 185 220Z"
    fill="#12163a"
  />

  <circle cx="225" cy="218" r="13" fill="#ffffff"/>
  <circle cx="287" cy="218" r="13" fill="#ffffff"/>

  <path
    d="M220 255
       C239 270 273 270 292 255"
    fill="none"
    stroke="#ffffff"
    stroke-width="10"
    stroke-linecap="round"
  />

  <path
    d="M256 106 V75
       M150 145 L128 123
       M362 145 L384 123"
    stroke="#ffffff"
    stroke-width="10"
    stroke-linecap="round"
    opacity="0.9"
  />

  <text
    x="256"
    y="390"
    text-anchor="middle"
    font-family="Arial, sans-serif"
    font-size="55"
    font-weight="bold"
    fill="#ffffff">
    ابزارک
  </text>

  <text
    x="256"
    y="435"
    text-anchor="middle"
    font-family="Arial, sans-serif"
    font-size="25"
    fill="#dce2ff">
    AI Assistant
  </text>
</svg>
`;
}

function renderServiceWorker() {
  return `
const CACHE_NAME = "abzarak-pwa-v2";

const APP_SHELL = [
  "/",
  "/manifest.json",
  "/icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(request)
      .then(response => {

        if (
          response &&
          response.status === 200 &&
          response.type === "basic"
        ) {
          const copy = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, copy))
            .catch(() => {});
        }

        return response;
      })
      .catch(() =>
        caches.match(request)
          .then(cached =>
            cached || caches.match("/")
          )
      )
  );
});
`;
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
    const session = await env.DB
      .prepare(
        "SELECT user_id FROM sessions WHERE token = ?"
      )
      .bind(token)
      .first();

    if (!session) {
      return null;
    }

    const user = await env.DB
      .prepare(
        `SELECT id, name, email, balance
         FROM users
         WHERE id = ?`
      )
      .bind(session.user_id)
      .first();

    return user || null;
  } catch (error) {
    console.error("getUserFromToken:", error);
    return null;
  }
}

function getAdminToken(request) {
  const auth =
    request.headers.get("Authorization") || "";

  return auth
    .replace(/^Bearer\s+/i, "")
    .trim();
}

async function requireAdmin(request, env) {
  const token = getAdminToken(request);

  if (!token) {
    return false;
  }

  try {
    const session = await env.DB
      .prepare(
        "SELECT id FROM admin_sessions WHERE token = ?"
      )
      .bind(token)
      .first();

    return !!session;
  } catch {
    return false;
  }
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
      error:
        "RESEND_API_KEY تنظیم نشده است.",
    };
  }

  const fromEmail =
    env.RESEND_FROM_EMAIL ||
    "onboarding@resend.dev";

  try {
    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject,
          html: htmlBody,
        }),
      }
    );

    if (!response.ok) {
      return {
        ok: false,
        error: await response.text(),
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error:
        error?.message ||
        String(error),
    };
  }
}

// =============================================================
// SIGNUP
// =============================================================

async function handleSignup(request, env) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json(
      { error: "بدنه درخواست نامعتبر است." },
      400
    );
  }

  const name =
    String(body.name || "").trim();

  const email =
    String(body.email || "").trim().toLowerCase();

  const password =
    String(body.password || "");

  if (!email || !password) {
    return json(
      {
        error:
          "ایمیل و رمز عبور الزامی است.",
      },
      400
    );
  }

  if (!isValidEmail(email)) {
    return json(
      {
        error:
          "فرمت ایمیل نامعتبر است.",
      },
      400
    );
  }

  if (password.length < 6) {
    return json(
      {
        error:
          "رمز عبور باید حداقل ۶ کاراکتر باشد.",
      },
      400
    );
  }

  try {
    const existing =
      await env.DB
        .prepare(
          "SELECT id FROM users WHERE email = ?"
        )
        .bind(email)
        .first();

    if (existing) {
      return json(
        {
          error:
            "این ایمیل قبلاً ثبت‌نام کرده است.",
        },
        409
      );
    }

    const userId = uuid();

    const passwordHash =
      await hashPassword(password);

    const createdAt =
      new Date().toISOString();

    await env.DB
      .prepare(
        `INSERT INTO users
        (id, name, email, password_hash, balance, created_at)
        VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(
        userId,
        name,
        email,
        passwordHash,
        0,
        createdAt
      )
      .run();

    const token =
      uuid() + uuid();

    await env.DB
      .prepare(
        `INSERT INTO sessions
        (id, user_id, token, created_at)
        VALUES (?, ?, ?, ?)`
      )
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
        name,
        email,
        balance: 0,
      },
    });
  } catch (error) {
    console.error("Signup:", error);

    return json(
      {
        error:
          "خطا در ثبت‌نام: " +
          (error?.message || String(error)),
      },
      500
    );
  }
}

// =============================================================
// LOGIN
// =============================================================

async function handleLogin(request, env) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json(
      { error: "بدنه درخواست نامعتبر است." },
      400
    );
  }

  const email =
    String(body.email || "")
      .trim()
      .toLowerCase();

  const password =
    String(body.password || "");

  if (!email || !password) {
    return json(
      {
        error:
          "ایمیل و رمز عبور الزامی است.",
      },
      400
    );
  }

  try {
    const user =
      await env.DB
        .prepare(
          `SELECT
             id,
             name,
             email,
             password_hash,
             balance
           FROM users
           WHERE email = ?`
        )
        .bind(email)
        .first();

    if (!user) {
      return json(
        {
          error:
            "ایمیل یا رمز عبور اشتباه است.",
        },
        401
      );
    }

    const valid =
      await verifyPassword(
        password,
        user.password_hash
      );

    if (!valid) {
      return json(
        {
          error:
            "ایمیل یا رمز عبور اشتباه است.",
        },
        401
      );
    }

    const token =
      uuid() + uuid();

    await env.DB
      .prepare(
        `INSERT INTO sessions
        (id, user_id, token, created_at)
        VALUES (?, ?, ?, ?)`
      )
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
        balance: user.balance || 0,
      },
    });
  } catch (error) {
    console.error("Login:", error);

    return json(
      {
        error:
          "خطا در ورود: " +
          (error?.message || String(error)),
      },
      500
    );
  }
}

// =============================================================
// ME
// =============================================================

async function handleMe(request, env) {
  const user =
    await getUserFromToken(
      request,
      env
    );

  if (!user) {
    return json(
      {
        error:
          "نشست نامعتبر یا منقضی شده است.",
      },
      401
    );
  }

  return json({ user });
}

// =============================================================
// FORGOT PASSWORD
// =============================================================

async function handleForgotPassword(
  request,
  env
) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json(
      { error: "بدنه درخواست نامعتبر است." },
      400
    );
  }

  const email =
    String(body.email || "")
      .trim()
      .toLowerCase();

  if (!isValidEmail(email)) {
    return json(
      {
        error:
          "ایمیل معتبر وارد کنید.",
      },
      400
    );
  }

  try {
    const user =
      await env.DB
        .prepare(
          "SELECT id FROM users WHERE email = ?"
        )
        .bind(email)
        .first();

    if (!user) {
      return json({
        success: true,
        message:
          "اگر این ایمیل ثبت شده باشد، کد بازیابی ارسال می‌شود.",
      });
    }

    const code =
      randomCode(6);

    const expiresAt =
      new Date(
        Date.now() + 15 * 60 * 1000
      ).toISOString();

    await env.DB
      .prepare(
        `INSERT INTO reset_codes
        (id, user_id, code, expires_at, used, created_at)
        VALUES (?, ?, ?, ?, 0, ?)`
      )
      .bind(
        uuid(),
        user.id,
        code,
        expiresAt,
        new Date().toISOString()
      )
      .run();

    const emailResult =
      await sendEmail(
        env,
        email,
        "کد بازیابی رمز عبور ابزارک",
        `
<!doctype html>
<html lang="fa" dir="rtl">
<body style="font-family:Arial,sans-serif;background:#f5f7fb;padding:30px;">
<div style="max-width:520px;margin:auto;background:white;padding:30px;border-radius:20px;">
<h2>🤖 ابزارک</h2>
<p>کد بازیابی رمز عبور شما:</p>
<h1 style="letter-spacing:8px;text-align:center;">
${code}
</h1>
<p>این کد تا ۱۵ دقیقه معتبر است.</p>
</div>
</body>
</html>
`
      );

    if (!emailResult.ok) {
      return json(
        {
          error:
            "کد ساخته شد اما ارسال ایمیل ناموفق بود: " +
            emailResult.error,
        },
        503
      );
    }

    return json({
      success: true,
      message:
        "کد بازیابی به ایمیل شما ارسال شد.",
    });
  } catch (error) {
    console.error(
      "Forgot password:",
      error
    );

    return json(
      {
        error:
          "خطا در ارسال کد: " +
          (error?.message || String(error)),
      },
      500
    );
  }
}

// =============================================================
// RESET PASSWORD
// =============================================================

async function handleResetPassword(
  request,
  env
) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json(
      { error: "بدنه درخواست نامعتبر است." },
      400
    );
  }

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
    return json(
      {
        error:
          "ایمیل، کد و رمز جدید الزامی است.",
      },
      400
    );
  }

  if (newPassword.length < 6) {
    return json(
      {
        error:
          "رمز عبور باید حداقل ۶ کاراکتر باشد.",
      },
      400
    );
  }

  try {
    const user =
      await env.DB
        .prepare(
          "SELECT id FROM users WHERE email = ?"
        )
        .bind(email)
        .first();

    if (!user) {
      return json(
        {
          error:
            "کد نامعتبر یا منقضی شده است.",
        },
        400
      );
    }

    const resetRow =
      await env.DB
        .prepare(
          `SELECT
             id,
             expires_at,
             used
           FROM reset_codes
           WHERE user_id = ?
           AND code = ?
           ORDER BY created_at DESC
           LIMIT 1`
        )
        .bind(
          user.id,
          code
        )
        .first();

    if (!resetRow) {
      return json(
        {
          error:
            "کد نامعتبر یا منقضی شده است.",
        },
        400
      );
    }

    if (Number(resetRow.used) === 1) {
      return json(
        {
          error:
            "این کد قبلاً استفاده شده است.",
        },
        400
      );
    }

    if (
      new Date(
        resetRow.expires_at
      ).getTime() < Date.now()
    ) {
      return json(
        {
          error:
            "کد منقضی شده است.",
        },
        400
      );
    }

    const passwordHash =
      await hashPassword(
        newPassword
      );

    await env.DB
      .prepare(
        "UPDATE users SET password_hash = ? WHERE id = ?"
      )
      .bind(
        passwordHash,
        user.id
      )
      .run();

    await env.DB
      .prepare(
        "UPDATE reset_codes SET used = 1 WHERE id = ?"
      )
      .bind(resetRow.id)
      .run();

    await env.DB
      .prepare(
        "DELETE FROM sessions WHERE user_id = ?"
      )
      .bind(user.id)
      .run();

    return json({
      success: true,
      message:
        "رمز عبور با موفقیت تغییر کرد. اکنون وارد شوید.",
    });
  } catch (error) {
    console.error(
      "Reset password:",
      error
    );

    return json(
      {
        error:
          "خطا در تغییر رمز: " +
          (error?.message || String(error)),
      },
      500
    );
  }
}

// =============================================================
// AI
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
    return json(
      {
        error:
          "برای استفاده از هوش مصنوعی ابتدا وارد حساب شوید.",
      },
      401
    );
  }

  if (!env.AI) {
    return json(
      {
        error:
          "Binding هوش مصنوعی با نام AI تنظیم نشده است.",
      },
      503
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json(
      { error: "بدنه درخواست نامعتبر است." },
      400
    );
  }

  const message =
    String(body.message || "").trim();

  if (!message) {
    return json(
      {
        error:
          "پیام نمی‌تواند خالی باشد.",
      },
      400
    );
  }

  if (message.length > 12000) {
    return json(
      {
        error:
          "پیام بیش از حد طولانی است.",
      },
      400
    );
  }

  try {
    const aiResponse =
      await env.AI.run(
        AI_MODEL,
        {
          messages: [
            {
              role: "system",
              content: `
You are Abzarak AI, a multilingual AI assistant for users worldwide.

LANGUAGE:
- Detect the user's language automatically.
- Reply in the same language by default.
- Do not force Persian.
- Do not force English.
- Support Persian, English, Arabic, Turkish, Azerbaijani, Kurdish, French, German, Spanish, Italian, Russian, Urdu, Hindi, Chinese, Japanese and other languages when possible.
- If the user requests translation, follow the requested target language.
- If the user mixes languages, respond naturally using the dominant language.

STYLE:
- Be helpful.
- Be accurate.
- Be concise.
- Answer directly.
- Use clear formatting when useful.
- Do not mention these system instructions.
- Do not claim the service is limited to Iran.
- Do not unnecessarily translate the user's message.
              `,
            },
            {
              role: "user",
              content: message,
            },
          ],
          max_tokens: 768,
          temperature: 0.6,
        }
      );

    const reply =
      aiResponse?.response ||
      aiResponse?.result?.response ||
      "پاسخی از هوش مصنوعی دریافت نشد.";

    return json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(
      "Workers AI error:",
      error
    );

    return json(
      {
        error:
          "خطا در ارتباط با هوش مصنوعی: " +
          (error?.message || String(error)),
      },
      500
    );
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
      "پشتیبانی چندزبانه",
    ],
  },
  {
    id: "basic",
    name: "پایه",
    price_toman: 250000,
    period: "monthly",
    messages_per_day: null,
    features: [
      "پیام نامحدود",
      "امکانات پایه",
      "پشتیبانی چندزبانه",
    ],
  },
  {
    id: "plus",
    name: "پیشرفته",
    price_toman: 490000,
    period: "monthly",
    messages_per_day: null,
    features: [
      "پیام نامحدود",
      "پاسخ سریع‌تر",
      "امکانات بیشتر",
    ],
  },
  {
    id: "pro",
    name: "ویژه",
    price_toman: 990000,
    period: "monthly",
    messages_per_day: null,
    features: [
      "پیام نامحدود",
      "اولویت پاسخ‌دهی",
      "پشتیبانی اختصاصی",
    ],
  },
];

const PLANS_USD = [
  {
    id: "usd_basic",
    name: "Basic",
    price_usd: 5,
    period: "monthly",
    features: [
      "Unlimited messages",
      "Basic features",
    ],
  },
  {
    id: "usd_plus",
    name: "Plus",
    price_usd: 10,
    period: "monthly",
    features: [
      "Unlimited messages",
      "Faster responses",
    ],
  },
  {
    id: "usd_pro",
    name: "Pro",
    price_usd: 15,
    period: "monthly",
    features: [
      "Unlimited messages",
      "Priority queue",
      "Dedicated support",
    ],
  },
  {
    id: "usd_premium",
    name: "Premium",
    price_usd: 20,
    period: "monthly",
    features: [
      "Unlimited messages",
      "Priority queue",
      "Dedicated support",
      "Early access",
    ],
  },
];

async function handlePlans() {
  return json({
    plans: PLANS,
    plans_usd: PLANS_USD,
    usd_to_toman_rate:
      USD_TO_TOMAN_RATE,
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
    return json(
      {
        error:
          "ابتدا وارد حساب شوید.",
      },
      401
    );
  }

  if (!env.ZARINPAL_MERCHANT_ID) {
    return json(
      {
        error:
          "ZARINPAL_MERCHANT_ID تنظیم نشده است.",
      },
      503
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json(
      { error: "بدنه درخواست نامعتبر است." },
      400
    );
  }

  const planId =
    String(body.planId || "");

  let plan =
    PLANS.find(
      p => p.id === planId
    );

  let planCurrency = "irt";
  let priceToman = null;
  let planName = null;

  if (plan) {
    priceToman =
      plan.price_toman;
    planName =
      plan.name;
  } else {
    const usdPlan =
      PLANS_USD.find(
        p => p.id === planId
      );

    if (usdPlan) {
      plan = usdPlan;
      planCurrency = "usd";

      priceToman =
        Math.round(
          usdPlan.price_usd *
          USD_TO_TOMAN_RATE
        );

      planName =
        usdPlan.name;
    }
  }

  if (
    !plan ||
    !priceToman ||
    priceToman <= 0
  ) {
    return json(
      {
        error:
          "پلن نامعتبر است.",
      },
      400
    );
  }

  const baseUrl =
    (
      env.PUBLIC_BASE_URL ||
      new URL(request.url).origin
    ).replace(/\/+$/, "");

  const paymentId = uuid();

  // ZarinPal expects Rial.
  const amountRial =
    Math.round(
      priceToman * 10
    );

  try {
    const response =
      await fetch(
        `${zarinpalBase(env)}/pg/v4/payment/request.json`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            merchant_id:
              env.ZARINPAL_MERCHANT_ID,
            amount:
              amountRial,
            callback_url:
              `${baseUrl}/api/payment/verify?pid=${paymentId}`,
            description:
              `اشتراک ابزارک - ${planName}`,
            metadata: {
              email: user.email,
            },
          }),
        }
      );

    const data =
      await response.json();

    if (
      data?.errors &&
      Object.keys(data.errors).length
    ) {
      return json(
        {
          error:
            "خطای زرین‌پال: " +
            (
              data.errors.message ||
              JSON.stringify(data.errors)
            ),
        },
        502
      );
    }

    const authority =
      data?.data?.authority;

    if (!authority) {
      return json(
        {
          error:
            "پاسخ معتبر از زرین‌پال دریافت نشد.",
          details: data,
        },
        502
      );
    }

    await env.DB
      .prepare(
        `INSERT INTO payments
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
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
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

    try {
      await env.DB
        .prepare(
          `UPDATE payments
           SET plan_currency = ?
           WHERE id = ?`
        )
        .bind(
          planCurrency,
          paymentId
        )
        .run();
    } catch (error) {
      console.log(
        "plan_currency column not available:",
        error?.message
      );
    }

    const paymentUrl =
      env.ZARINPAL_SANDBOX === "true"
        ? `https://sandbox.zarinpal.com/pg/StartPay/${authority}`
        : `https://www.zarinpal.com/pg/StartPay/${authority}`;

    return json({
      success: true,
      payment_url: paymentUrl,
    });
  } catch (error) {
    console.error(
      "Create payment:",
      error
    );

    return json(
      {
        error:
          "خطا در ساخت پرداخت: " +
          (error?.message || String(error)),
      },
      500
    );
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
    url.searchParams.get(
      "Authority"
    );

  const status =
    url.searchParams.get(
      "Status"
    );

  const paymentId =
    url.searchParams.get(
      "pid"
    );

  const baseUrl =
    (
      env.PUBLIC_BASE_URL ||
      url.origin
    ).replace(/\/+$/, "");

  if (
    !authority ||
    !paymentId
  ) {
    return Response.redirect(
      `${baseUrl}/?payment=error&reason=missing_params`,
      302
    );
  }

  try {
    const payment =
      await env.DB
        .prepare(
          `SELECT *
           FROM payments
           WHERE id = ?
           AND zarinpal_authority = ?`
        )
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

    if (
      payment.status === "paid"
    ) {
      return Response.redirect(
        `${baseUrl}/?payment=success`,
        302
      );
    }

    if (status !== "OK") {
      await env.DB
        .prepare(
          `UPDATE payments
           SET status = 'cancelled'
           WHERE id = ?`
        )
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
              "application/json",
          },
          body: JSON.stringify({
            merchant_id:
              env.ZARINPAL_MERCHANT_ID,
            amount:
              payment.amount,
            authority,
          }),
        }
      );

    const verifyData =
      await verifyResponse.json();

    const code =
      verifyData?.data?.code;

    if (
      code === 100 ||
      code === 101
    ) {
      const refId =
        verifyData?.data?.ref_id ||
        "";

      await env.DB
        .prepare(
          `UPDATE payments
           SET status = 'paid',
               ref_id = ?
           WHERE id = ?`
        )
        .bind(
          String(refId),
          paymentId
        )
        .run();

      const existingSub =
        await env.DB
          .prepare(
            `SELECT id
             FROM subscriptions
             WHERE user_id = ?
             AND plan_id = ?
             AND status = 'active'
             AND started_at > ?`
          )
          .bind(
            payment.user_id,
            payment.plan_id,
            new Date(
              Date.now() -
              60000
            ).toISOString()
          )
          .first();

      if (!existingSub) {
        await env.DB
          .prepare(
            `INSERT INTO subscriptions
            (
              id,
              user_id,
              plan_id,
              status,
              started_at
            )
            VALUES (?, ?, ?, 'active', ?)`
          )
          .bind(
            uuid(),
            payment.user_id,
            payment.plan_id,
            new Date().toISOString()
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

    await env.DB
      .prepare(
        `UPDATE payments
         SET status = 'failed'
         WHERE id = ?`
      )
      .bind(paymentId)
      .run();

    return Response.redirect(
      `${baseUrl}/?payment=failed`,
      302
    );
  } catch (error) {
    console.error(
      "Verify payment:",
      error
    );

    const reason =
      encodeURIComponent(
        (
          error?.message ||
          String(error)
        ).slice(0, 200)
      );

    return Response.redirect(
      `${baseUrl}/?payment=error&reason=${reason}`,
      302
    );
  }
}

// =============================================================
// ADMIN LOGIN
// =============================================================

async function handleAdminLogin(
  request,
  env
) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json(
      { error: "بدنه درخواست نامعتبر است." },
      400
    );
  }

  if (!env.ADMIN_PASSWORD) {
    return json(
      {
        error:
          "ADMIN_PASSWORD تنظیم نشده است.",
      },
      503
    );
  }

  const password =
    String(body.password || "");

  if (
    password !==
    env.ADMIN_PASSWORD
  ) {
    return json(
      {
        error:
          "رمز مدیریت اشتباه است.",
      },
      401
    );
  }

  try {
    const token =
      uuid() + uuid();

    await env.DB
      .prepare(
        `INSERT INTO admin_sessions
        (id, token, created_at)
        VALUES (?, ?, ?)`
      )
      .bind(
        uuid(),
        token,
        new Date().toISOString()
      )
      .run();

    return json({
      success: true,
      token,
    });
  } catch (error) {
    return json(
      {
        error:
          "خطا در ورود مدیریت: " +
          (error?.message || String(error)),
      },
      500
    );
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
    !(await requireAdmin(
      request,
      env
    ))
  ) {
    return json(
      { error: "دسترسی غیرمجاز." },
      401
    );
  }

  try {
    const { results } =
      await env.DB
        .prepare(
          `SELECT
             id,
             name,
             email,
             balance,
             created_at
           FROM users
           ORDER BY created_at DESC
           LIMIT 200`
        )
        .all();

    return json({
      users: results || [],
    });
  } catch (error) {
    return json(
      {
        error:
          "خطا در دریافت کاربران: " +
          (error?.message || String(error)),
      },
      500
    );
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
    !(await requireAdmin(
      request,
      env
    ))
  ) {
    return json(
      { error: "دسترسی غیرمجاز." },
      401
    );
  }

  try {
    const { results } =
      await env.DB
        .prepare(
          `SELECT
             payments.id,
             payments.plan_id,
             payments.amount,
             payments.currency,
             payments.status,
             payments.created_at,
             users.email
           FROM payments
           JOIN users
           ON users.id = payments.user_id
           ORDER BY payments.created_at DESC
           LIMIT 200`
        )
        .all();

    const payments =
      (results || []).map(
        payment => ({
          ...payment,
          amount_toman:
            payment.currency === "irt"
              ? Math.round(
                  Number(payment.amount || 0) /
                  10
                )
              : payment.amount,
        })
      );

    return json({
      payments,
    });
  } catch (error) {
    return json(
      {
        error:
          "خطا در دریافت تراکنش‌ها: " +
          (error?.message || String(error)),
      },
      500
    );
  }
}

// =============================================================
// ADMIN BALANCE
// =============================================================

async function handleAdminAdjustBalance(
  request,
  env
) {
  if (
    !(await requireAdmin(
      request,
      env
    ))
  ) {
    return json(
      { error: "دسترسی غیرمجاز." },
      401
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json(
      { error: "بدنه درخواست نامعتبر است." },
      400
    );
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
    return json(
      {
        error:
          "شناسه کاربر و مبلغ معتبر الزامی است.",
      },
      400
    );
  }

  try {
    const user =
      await env.DB
        .prepare(
          `SELECT id, balance
           FROM users
           WHERE id = ?`
        )
        .bind(userId)
        .first();

    if (!user) {
      return json(
        {
          error:
            "کاربر پیدا نشد.",
        },
        404
      );
    }

    const newBalance =
      Number(user.balance || 0) +
      amount;

    if (newBalance < 0) {
      return json(
        {
          error:
            "موجودی نمی‌تواند منفی شود.",
        },
        400
      );
    }

    await env.DB
      .prepare(
        `UPDATE users
         SET balance = ?
         WHERE id = ?`
      )
      .bind(
        newBalance,
        userId
      )
      .run();

    try {
      await env.DB
        .prepare(
          `INSERT INTO balance_adjustments
          (id, user_id, amount, reason, created_at)
          VALUES (?, ?, ?, ?, ?)`
        )
        .bind(
          uuid(),
          userId,
          amount,
          reason,
          new Date().toISOString()
        )
        .run();
    } catch (error) {
      console.log(
        "balance_adjustments unavailable:",
        error?.message
      );
    }

    return json({
      success: true,
      user_id: userId,
      new_balance: newBalance,
    });
  } catch (error) {
    return json(
      {
        error:
          "خطا در تعدیل موجودی: " +
          (error?.message || String(error)),
      },
      500
    );
  }
}

// =============================================================
// HOMEPAGE
// =============================================================

function renderHomepage() {
  return `
<!doctype html>
<html lang="fa" dir="rtl">
<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, viewport-fit=cover"
>

<meta
  name="theme-color"
  content="#12163a"
>

<meta
  name="mobile-web-app-capable"
  content="yes"
>

<meta
  name="apple-mobile-web-app-capable"
  content="yes"
>

<meta
  name="apple-mobile-web-app-status-bar-style"
  content="default"
>

<meta
  name="apple-mobile-web-app-title"
  content="ابزارک"
>

<title>
ابزارک | دستیار هوش مصنوعی چندزبانه
</title>

<meta
  name="description"
  content="ابزارک یک دستیار هوش مصنوعی چندزبانه برای کاربران سراسر جهان است."
>

<meta
  name="keywords"
  content="ابزارک, هوش مصنوعی, AI, AI Assistant, دستیار هوش مصنوعی, چت هوش مصنوعی, multilingual AI"
>

<meta
  name="robots"
  content="index, follow"
>

<meta
  property="og:type"
  content="website"
>

<meta
  property="og:site_name"
  content="ابزارک"
>

<meta
  property="og:title"
  content="ابزارک | دستیار هوش مصنوعی"
>

<meta
  property="og:description"
  content="دستیار هوش مصنوعی چندزبانه برای کاربران سراسر جهان."
>

<meta
  property="og:url"
  content="https://abzarakai.ir/"
>

<meta
  property="og:locale"
  content="fa_IR"
>

<meta
  property="og:locale:alternate"
  content="en_US"
>

<meta
  name="twitter:card"
  content="summary"
>

<meta
  name="twitter:title"
  content="ابزارک | AI Assistant"
>

<meta
  name="twitter:description"
  content="A multilingual AI assistant for users worldwide."
>

<link
  rel="manifest"
  href="/manifest.json"
>

<link
  rel="icon"
  href="/icon.svg"
  type="image/svg+xml"
>

<style>

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family:
    Tahoma,
    Arial,
    sans-serif;
  background:
    radial-gradient(
      circle at 10% 10%,
      rgba(104, 87, 255, .20),
      transparent 30%
    ),
    radial-gradient(
      circle at 90% 10%,
      rgba(25, 190, 255, .18),
      transparent 28%
    ),
    linear-gradient(
      135deg,
      #f5f7ff,
      #eef1ff 45%,
      #f9fbff
    );
  color: #171a35;
}

button,
input,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.hidden {
  display: none !important;
}

.app {
  width: 100%;
  min-height: 100vh;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(18px);
  background:
    rgba(255,255,255,.88);
  border-bottom:
    1px solid rgba(20,25,70,.08);
}

.topbar-inner {
  max-width: 1180px;
  margin: auto;
  padding:
    14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  color: #171a35;
  text-decoration: none;
}

.brand-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  box-shadow:
    0 10px 25px
    rgba(50,60,180,.25);
}

.brand-text {
  font-size: 19px;
}

.nav {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  justify-content: center;
}

.nav button {
  border: 0;
  background: transparent;
  color: #343853;
  padding: 10px 12px;
  border-radius: 12px;
}

.nav button:hover {
  background: #eef0ff;
}

.hero {
  max-width: 1180px;
  margin: auto;
  padding:
    55px 18px
    25px;
}

.hero-box {
  position: relative;
  overflow: hidden;
  border-radius: 32px;
  padding:
    55px 45px;
  color: white;
  background:
    radial-gradient(
      circle at 80% 20%,
      rgba(117, 135, 255, .65),
      transparent 30%
    ),
    linear-gradient(
      135deg,
      #111638,
      #2f3fb0 55%,
      #6957ed
    );
  box-shadow:
    0 25px 70px
    rgba(38,48,140,.25);
}

.hero-box::before {
  content: "";
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background:
    rgba(255,255,255,.08);
  left: -80px;
  bottom: -100px;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 720px;
}

.hero-badge {
  display: inline-flex;
  padding: 8px 13px;
  border-radius: 100px;
  background:
    rgba(255,255,255,.13);
  border:
    1px solid
    rgba(255,255,255,.16);
  font-size: 13px;
  margin-bottom: 18px;
}

.hero h1 {
  font-size:
    clamp(34px, 6vw, 64px);
  line-height: 1.12;
  margin:
    0 0 18px;
}

.hero p {
  font-size: 18px;
  line-height: 2;
  color: #e7eaff;
  margin-bottom: 25px;
}

.hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.hero-orb {
  position: absolute;
  left: 65px;
  top: 55px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background:
    radial-gradient(
      circle at 35% 30%,
      #fff,
      #b9c3ff 45%,
      #6b62e9
    );
  opacity: .16;
  filter: blur(1px);
}

.container {
  max-width: 1050px;
  margin: auto;
  padding:
    20px 18px 60px;
}

.view {
  display: none;
}

.view.active {
  display: block;
}

.card {
  background:
    rgba(255,255,255,.94);
  border:
    1px solid
    rgba(20,25,70,.08);
  border-radius: 24px;
  padding: 25px;
  box-shadow:
    0 15px 45px
    rgba(30,40,100,.08);
  margin-bottom: 20px;
}

.card h2,
.card h3 {
  margin-top: 0;
}

.form {
  max-width: 500px;
  margin: 25px auto;
}

.input {
  width: 100%;
  padding:
    14px 16px;
  border:
    1px solid #dfe3f3;
  border-radius: 14px;
  outline: none;
  background: #fff;
  margin-bottom: 12px;
}

.input:focus {
  border-color: #6371e9;
  box-shadow:
    0 0 0 4px
    rgba(99,113,233,.10);
}

.btn {
  border: 0;
  border-radius: 14px;
  padding:
    13px 18px;
  min-height: 46px;
  font-weight: 800;
  transition:
    transform .15s,
    box-shadow .15s;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  color: white;
  background:
    linear-gradient(
      135deg,
      #4857d9,
      #705ce9
    );
  box-shadow:
    0 10px 25px
    rgba(80,85,210,.22);
}

.btn-secondary {
  background: #eef0fb;
  color: #222746;
}

.btn-light {
  background: white;
  color: #222746;
}

.btn-danger {
  background: #ffe8eb;
  color: #a32235;
}

.link-btn {
  border: 0;
  background: transparent;
  color: #4b58c9;
  padding: 10px;
}

.install-btn {
  border: 0;
  background:
    linear-gradient(
      135deg,
      #21c79a,
      #159cce
    );
  color: white;
  padding:
    11px 15px;
  border-radius: 13px;
  font-weight: 800;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lang-switch {
  border: 0;
  background: #eef0fb;
  padding: 10px 13px;
  border-radius: 12px;
  font-weight: 700;
}

.notice {
  padding: 13px 15px;
  border-radius: 14px;
  background: #f1f3ff;
  color: #343a75;
  margin: 12px 0;
}

.error {
  background: #fff0f2;
  color: #a12539;
}

.success {
  background: #eafbf5;
  color: #146b52;
}

.account-box {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 15px;
}

.stat {
  padding: 20px;
  border-radius: 18px;
  background:
    linear-gradient(
      135deg,
      #f7f8ff,
      #edf0ff
    );
}

.stat strong {
  display: block;
  font-size: 25px;
  margin-top: 8px;
}

.ai-box {
  max-width: 850px;
  margin: auto;
}

.chat-messages {
  min-height: 320px;
  max-height: 560px;
  overflow-y: auto;
  padding: 15px;
  border-radius: 20px;
  background:
    linear-gradient(
      180deg,
      #f6f8ff,
      #eef1ff
    );
  margin-bottom: 12px;
}

.msg {
  padding:
    13px 16px;
  border-radius: 18px;
  margin-bottom: 10px;
  line-height: 1.9;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.msg.user {
  background:
    linear-gradient(
      135deg,
      #5361dc,
      #705fe8
    );
  color: white;
  margin-right: 20%;
}

.msg.ai {
  background: white;
  color: #20243e;
  margin-left: 10%;
  box-shadow:
    0 5px 18px
    rgba(20,30,90,.06);
}

.ai-input-row {
  display: flex;
  gap: 8px;
}

.ai-input {
  flex: 1;
  margin: 0;
}

.plans-grid {
  display: grid;
  grid-template-columns:
    repeat(4, 1fr);
  gap: 16px;
}

.plan {
  position: relative;
  padding: 24px;
  border-radius: 23px;
  background: white;
  border:
    1px solid #e1e4f5;
  box-shadow:
    0 12px 35px
    rgba(30,40,100,.07);
}

.plan.featured {
  border:
    2px solid #6370e9;
  transform: translateY(-6px);
}

.plan h3 {
  font-size: 22px;
}

.price {
  font-size: 28px;
  font-weight: 900;
  color: #404cc5;
}

.plan ul {
  padding-right: 20px;
  line-height: 2;
  min-height: 110px;
}

.currency-switch {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.currency-switch button.active {
  background:
    #515fd8;
  color: white;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th,
.admin-table td {
  border-bottom:
    1px solid #edf0f7;
  padding: 11px 7px;
  text-align: right;
}

.seo-section {
  line-height: 2;
}

.footer {
  max-width: 1050px;
  margin: auto;
  padding:
    20px 18px 45px;
  text-align: center;
  color: #777d9b;
}

.loading {
  text-align: center;
  padding: 25px;
}

@media (max-width: 900px) {

  .nav {
    display: none;
  }

  .topbar-inner {
    flex-wrap: wrap;
  }

  .plans-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .account-box {
    grid-template-columns:
      1fr;
  }

  .hero-orb {
    left: -80px;
    top: 30px;
  }
}

@media (max-width: 600px) {

  .hero {
    padding-top: 20px;
  }

  .hero-box {
    padding:
      38px 23px;
    border-radius: 25px;
  }

  .hero h1 {
    font-size: 36px;
  }

  .hero p {
    font-size: 15px;
  }

  .plans-grid {
    grid-template-columns:
      1fr;
  }

  .plan.featured {
    transform: none;
  }

  .ai-input-row {
    flex-direction: column;
  }

  .msg.user {
    margin-right: 5%;
  }

  .msg.ai {
    margin-left: 5%;
  }

  .topbar-inner {
    padding:
      10px 12px;
  }

  .brand-text {
    font-size: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .card {
    padding: 18px;
    border-radius: 19px;
  }
}

</style>

</head>

<body>

<div class="app">

<header class="topbar">

<div class="topbar-inner">

<a
  href="/"
  class="brand"
  onclick="showView('home');return false;"
>

<img
  src="/icon.svg"
  class="brand-icon"
  alt="ابزارک"
>

<span class="brand-text">
🤖 ابزارک
</span>

</a>

<nav class="nav">

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

<button onclick="showView('admin-login')">
🛠️ مدیریت
</button>

</nav>

<div class="header-actions">

<button
  id="install-app-btn"
  class="install-btn hidden"
  onclick="installPwa()"
>
📲 نصب اپ
</button>

<button
  class="lang-switch"
  onclick="toggleLang()"
  id="lang-button"
>
English
</button>

</div>

</div>

</header>

<section class="hero">

<div class="hero-box">

<div class="hero-orb"></div>

<div class="hero-content">

<div class="hero-badge">
✨ هوش مصنوعی چندزبانه
</div>

<h1>
دستیار هوشمند شما، همیشه آماده
</h1>

<p>
با ابزارک گفتگو کنید، سؤال بپرسید،
ترجمه کنید، محتوا بسازید و کارهای
روزمره خود را سریع‌تر انجام دهید.
</p>

<div class="hero-actions">

<button
  class="btn btn-light"
  onclick="showView('ai')"
>
🤖 شروع گفتگو
</button>

<button
  class="btn"
  style="background:rgba(255,255,255,.14);color:white;"
  onclick="showView('plans')"
>
💎 مشاهده پلن‌ها
</button>

</div>

</div>

</div>

</section>

<main class="container">

<!-- HOME -->

<section
  id="view-home"
  class="view active"
>

<div class="card">

<h2>
🌍 دستیار هوش مصنوعی برای همه
</h2>

<p>
ابزارک یک دستیار هوش مصنوعی چندزبانه
است که برای کاربران سراسر جهان طراحی شده است.
</p>

<div class="account-box">

<div class="stat">
<span>🤖</span>
<strong>AI</strong>
دستیار هوشمند
</div>

<div class="stat">
<span>🌍</span>
<strong>Multi</strong>
پشتیبانی چندزبانه
</div>

<div class="stat">
<span>📱</span>
<strong>PWA</strong>
قابل نصب روی موبایل
</div>

</div>

</div>

<div class="card seo-section">

<h2>
چرا ابزارک؟
</h2>

<p>
ابزارک برای گفتگو با هوش مصنوعی،
پاسخ به پرسش‌ها، تولید محتوا،
ترجمه و کمک در کارهای روزمره ساخته شده است.
</p>

<h3>
ویژگی‌ها
</h3>

<ul>
<li>گفتگوی متنی با هوش مصنوعی</li>
<li>پشتیبانی از زبان‌های مختلف</li>
<li>حساب کاربری و مدیریت اشتراک</li>
<li>نسخه قابل نصب روی موبایل</li>
<li>قابل استفاده در کامپیوتر و موبایل</li>
</ul>

</div>

</section>

<!-- LOGIN -->

<section
  id="view-login"
  class="view"
>

<div class="card form">

<h2>
🔑 ورود به حساب
</h2>

<input
  id="login-email"
  class="input"
  type="email"
  placeholder="ایمیل"
>

<input
  id="login-password"
  class="input"
  type="password"
  placeholder="رمز عبور"
>

<div id="login-message"></div>

<button
  class="btn btn-primary"
  style="width:100%;"
  onclick="doLogin()"
>
ورود
</button>

<button
  class="link-btn"
  onclick="showView('forgot')"
>
فراموشی رمز عبور؟
</button>

<button
  class="btn btn-secondary"
  style="width:100%;"
  onclick="showView('signup')"
>
ثبت‌نام
</button>

</div>

</section>

<!-- SIGNUP -->

<section
  id="view-signup"
  class="view"
>

<div class="card form">

<h2>
📝 ثبت‌نام
</h2>

<input
  id="signup-name"
  class="input"
  placeholder="نام"
>

<input
  id="signup-email"
  class="input"
  type="email"
  placeholder="ایمیل"
>

<input
  id="signup-password"
  class="input"
  type="password"
  placeholder="رمز عبور حداقل ۶ کاراکتر"
>

<div id="signup-message"></div>

<button
  class="btn btn-primary"
  style="width:100%;"
  onclick="doSignup()"
>
ثبت‌نام
</button>

<button
  class="btn btn-secondary"
  style="width:100%;margin-top:8px;"
  onclick="showView('login')"
>
بازگشت
</button>

</div>

</section>

<!-- FORGOT -->

<section
  id="view-forgot"
  class="view"
>

<div class="card form">

<h2>
🔐 بازیابی رمز
</h2>

<p>
ایمیل خود را وارد کنید.
</p>

<input
  id="forgot-email"
  class="input"
  type="email"
  placeholder="ایمیل"
>

<div id="forgot-message"></div>

<button
  class="btn btn-primary"
  style="width:100%;"
  onclick="doForgotPassword()"
>
ارسال کد
</button>

<button
  class="btn btn-secondary"
  style="width:100%;margin-top:8px;"
  onclick="showView('reset')"
>
کد را دارم
</button>

</div>

</section>

<!-- RESET -->

<section
  id="view-reset"
  class="view"
>

<div class="card form">

<h2>
🔑 تغییر رمز
</h2>

<input
  id="reset-email"
  class="input"
  type="email"
  placeholder="ایمیل"
>

<input
  id="reset-code"
  class="input"
  placeholder="کد ۶ رقمی"
>

<input
  id="reset-password"
  class="input"
  type="password"
  placeholder="رمز عبور جدید"
>

<div id="reset-message"></div>

<button
  class="btn btn-primary"
  style="width:100%;"
  onclick="doResetPassword()"
>
تغییر رمز
</button>

</div>

</section>

<!-- ACCOUNT -->

<section
  id="view-account"
  class="view"
>

<div class="card">

<h2>
🏠 حساب من
</h2>

<div id="account-content">
<div class="loading">
در حال بررسی حساب...
</div>
</div>

</div>

</section>

<!-- AI -->

<section
  id="view-ai"
  class="view"
>

<div class="card ai-box">

<h2>
🤖 گفتگو با هوش مصنوعی
</h2>

<p>
هر زبانی که استفاده کنید،
ابزارک تلاش می‌کند به همان زبان پاسخ دهد.
</p>

<div
  id="chat-messages"
  class="chat-messages"
></div>

<div class="ai-input-row">

<input
  id="ai-input"
  class="input ai-input"
  placeholder="پیام خود را بنویسید..."
  onkeydown="if(event.key==='Enter')sendAiMessage()"
>

<button
  class="btn btn-primary"
  onclick="sendAiMessage()"
>
ارسال
</button>

</div>

</div>

</section>

<!-- PLANS -->

<section
  id="view-plans"
  class="view"
>

<div class="card">

<h2>
💰 پلن‌های اشتراک
</h2>

<div class="currency-switch">

<button
  id="currency-irt"
  class="btn btn-secondary active"
  onclick="setPlanCurrency('irt')"
>
تومان 🇮🇷
</button>

<button
  id="currency-usd"
  class="btn btn-secondary"
  onclick="setPlanCurrency('usd')"
>
USD 🌍
</button>

</div>

<div
  id="plans-container"
  class="plans-grid"
>
<div class="loading">
در حال بارگذاری پلن‌ها...
</div>
</div>

</div>

</section>

<!-- ADMIN LOGIN -->

<section
  id="view-admin-login"
  class="view"
>

<div class="card form">

<h2>
🛠️ ورود مدیریت
</h2>

<input
  id="admin-password"
  class="input"
  type="password"
  placeholder="رمز مدیریت"
>

<div id="admin-login-message"></div>

<button
  class="btn btn-primary"
  style="width:100%;"
  onclick="doAdminLogin()"
>
ورود
</button>

</div>

</section>

<!-- ADMIN -->

<section
  id="view-admin"
  class="view"
>

<div class="card">

<h2>
🛠️ پنل مدیریت
</h2>

<div style="display:flex;gap:8px;flex-wrap:wrap;">

<button
  class="btn btn-secondary"
  onclick="loadAdminUsers()"
>
👥 کاربران
</button>

<button
  class="btn btn-secondary"
  onclick="loadAdminPayments()"
>
💳 تراکنش‌ها
</button>

<button
  class="btn btn-secondary"
  onclick="showAdjustBalanceForm()"
>
💰 تعدیل موجودی
</button>

<button
  class="btn btn-danger"
  onclick="adminLogout()"
>
خروج
</button>

</div>

<div id="admin-content" style="margin-top:20px;">
</div>

</div>

</section>

</main>

<footer class="footer">

© 2026 ابزارک — دستیار هوش مصنوعی چندزبانه

</footer>

</div>

<script>

let authToken =
  localStorage.getItem("abzarak_token") || "";

let adminToken =
  localStorage.getItem("abzarak_admin_token") || "";

let currentCurrency = "irt";

let deferredInstallPrompt = null;

const $ = id =>
  document.getElementById(id);

function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

function showView(name) {

  document
    .querySelectorAll(".view")
    .forEach(v =>
      v.classList.remove("active")
    );

  const target =
    $("view-" + name);

  if (target) {
    target.classList.add("active");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (name === "account") {
    loadAccount();
  }

  if (name === "plans") {
    loadPlans();
  }

}

function setMessage(
  id,
  message,
  type = ""
) {

  const el = $(id);

  if (!el) return;

  el.innerHTML =
    message
      ? '<div class="notice ' +
        escapeHtml(type) +
        '">' +
        escapeHtml(message) +
        "</div>"
      : "";

}

async function api(
  path,
  options = {}
) {

  const headers = {
    ...(options.headers || {})
  };

  if (
    options.body &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] =
      "application/json";
  }

  if (authToken) {
    headers.Authorization =
      "Bearer " + authToken;
  }

  const response =
    await fetch(
      path,
      {
        ...options,
        headers
      }
    );

  const text =
    await response.text();

  let data = {};

  try {
    data =
      text
        ? JSON.parse(text)
        : {};
  } catch {
    data = {
      error:
        text ||
        "پاسخ نامعتبر از سرور"
    };
  }

  if (!response.ok) {
    throw new Error(
      data.error ||
      "خطای سرور"
    );
  }

  return data;

}

async function doSignup() {

  const name =
    $("signup-name").value.trim();

  const email =
    $("signup-email").value.trim();

  const password =
    $("signup-password").value;

  setMessage(
    "signup-message",
    ""
  );

  try {

    const data =
      await api(
        "/api/signup",
        {
          method: "POST",
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

    authToken =
      data.token;

    localStorage.setItem(
      "abzarak_token",
      authToken
    );

    setMessage(
      "signup-message",
      "ثبت‌نام با موفقیت انجام شد.",
      "success"
    );

    setTimeout(
      () => showView("account"),
      600
    );

  } catch (error) {

    setMessage(
      "signup-message",
      error.message,
      "error"
    );

  }

}

async function doLogin() {

  const email =
    $("login-email").value.trim();

  const password =
    $("login-password").value;

  setMessage(
    "login-message",
    ""
  );

  try {

    const data =
      await api(
        "/api/login",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password
          })
        }
      );

    authToken =
      data.token;

    localStorage.setItem(
      "abzarak_token",
      authToken
    );

    setMessage(
      "login-message",
      "ورود موفق بود.",
      "success"
    );

    setTimeout(
      () => showView("account"),
      400
    );

  } catch (error) {

    setMessage(
      "login-message",
      error.message,
      "error"
    );

  }

}

async function doForgotPassword() {

  const email =
    $("forgot-email").value.trim();

  setMessage(
    "forgot-message",
    ""
  );

  try {

    const data =
      await api(
        "/api/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({
            email
          })
        }
      );

    setMessage(
      "forgot-message",
      data.message ||
        "کد ارسال شد.",
      "success"
    );

    $("reset-email").value =
      email;

  } catch (error) {

    setMessage(
      "forgot-message",
      error.message,
      "error"
    );

  }

}

async function doResetPassword() {

  const email =
    $("reset-email").value.trim();

  const code =
    $("reset-code").value.trim();

  const newPassword =
    $("reset-password").value;

  setMessage(
    "reset-message",
    ""
  );

  try {

    const data =
      await api(
        "/api/reset-password",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            code,
            newPassword
          })
        }
      );

    setMessage(
      "reset-message",
      data.message ||
        "رمز تغییر کرد.",
      "success"
    );

    setTimeout(
      () => showView("login"),
      900
    );

  } catch (error) {

    setMessage(
      "reset-message",
      error.message,
      "error"
    );

  }

}

async function loadAccount() {

  const container =
    $("account-content");

  if (!container) return;

  if (!authToken) {

    container.innerHTML = `
      <div class="notice">
        برای مشاهده حساب ابتدا وارد شوید.
      </div>

      <button
        class="btn btn-primary"
        onclick="showView('login')"
      >
        ورود
      </button>
    `;

    return;

  }

  try {

    const data =
      await api(
        "/api/me"
      );

    const user =
      data.user;

    container.innerHTML = `
      <div class="account-box">

        <div class="stat">
          👤 نام
          <strong>
            ${escapeHtml(
              user.name || "-"
            )}
          </strong>
        </div>

        <div class="stat">
          📧 ایمیل
          <strong style="font-size:16px;">
            ${escapeHtml(
              user.email
            )}
          </strong>
        </div>

        <div class="stat">
          💰 موجودی
          <strong>
            ${Number(
              user.balance || 0
            ).toLocaleString("fa-IR")}
          </strong>
        </div>

      </div>

      <div style="margin-top:20px;display:flex;gap:8px;flex-wrap:wrap;">

        <button
          class="btn btn-primary"
          onclick="showView('ai')"
        >
          🤖 ورود به هوش مصنوعی
        </button>

        <button
          class="btn btn-secondary"
          onclick="showView('plans')"
        >
          💎 خرید اشتراک
        </button>

        <button
          class="btn btn-danger"
          onclick="logout()"
        >
          خروج
        </button>

      </div>
    `;

  } catch {

    localStorage.removeItem(
      "abzarak_token"
    );

    authToken = "";

    container.innerHTML = `
      <div class="notice error">
        نشست شما معتبر نیست. دوباره وارد شوید.
      </div>
    `;

  }

}

function logout() {

  authToken = "";

  localStorage.removeItem(
    "abzarak_token"
  );

  showView("home");

}

function addChatMessage(
  text,
  type
) {

  const container =
    $("chat-messages");

  const div =
    document.createElement("div");

  div.className =
    "msg " + type;

  div.textContent =
    text;

  container.appendChild(div);

  container.scrollTop =
    container.scrollHeight;

}

async function sendAiMessage() {

  if (!authToken) {

    showView("login");

    return;

  }

  const input =
    $("ai-input");

  const message =
    input.value.trim();

  if (!message) return;

  input.value = "";

  addChatMessage(
    message,
    "user"
  );

  const loading =
    document.createElement("div");

  loading.className =
    "msg ai";

  loading.textContent =
    "در حال فکر کردن...";

  loading.id =
    "ai-loading-message";

  $("chat-messages")
    .appendChild(loading);

  $("chat-messages").scrollTop =
    $("chat-messages").scrollHeight;

  try {

    const data =
      await api(
        "/api/ai/chat",
        {
          method: "POST",
          body: JSON.stringify({
            message
          })
        }
      );

    loading.remove();

    addChatMessage(
      data.reply ||
        "پاسخی دریافت نشد.",
      "ai"
    );

  } catch (error) {

    loading.remove();

    addChatMessage(
      "خطا: " +
        error.message,
      "ai"
    );

  }

}

async function loadPlans() {

  const container =
    $("plans-container");

  if (!container) return;

  container.innerHTML =
    '<div class="loading">در حال بارگذاری...</div>';

  try {

    const data =
      await api(
        "/api/plans"
      );

    renderPlans(
      currentCurrency === "usd"
        ? data.plans_usd
        : data.plans
    );

  } catch (error) {

    container.innerHTML =
      '<div class="notice error">' +
      escapeHtml(
        error.message
      ) +
      "</div>";

  }

}

function setPlanCurrency(
  currency
) {

  currentCurrency =
    currency;

  $("currency-irt")
    .classList.toggle(
      "active",
      currency === "irt"
    );

  $("currency-usd")
    .classList.toggle(
      "active",
      currency === "usd"
    );

  loadPlans();

}

function renderPlans(
  plans
) {

  const container =
    $("plans-container");

  container.innerHTML = "";

  plans.forEach(
    (plan, index) => {

      const div =
        document.createElement(
          "div"
        );

      div.className =
        "plan " +
        (
          index === 1
            ? "featured"
            : ""
        );

      const isUsd =
        currentCurrency === "usd";

      const price =
        isUsd
          ? "$" +
            Number(
              plan.price_usd || 0
            )
          : Number(
              plan.price_toman || 0
            ).toLocaleString(
              "fa-IR"
            ) +
            " تومان";

      const features =
        (plan.features || [])
          .map(
            feature =>
              "<li>" +
              escapeHtml(
                feature
              ) +
              "</li>"
          )
          .join("");

      div.innerHTML = `
        <h3>
          ${escapeHtml(
            plan.name
          )}
        </h3>

        <div class="price">
          ${price}
        </div>

        <p>
          ماهانه
        </p>

        <ul>
          ${features}
        </ul>

        ${
          plan.id === "free"
            ? `
              <button
                class="btn btn-secondary"
                style="width:100%;"
                onclick="showView('ai')"
              >
                شروع رایگان
              </button>
            `
            : `
              <button
                class="btn btn-primary"
                style="width:100%;"
                onclick="buyPlan('${escapeHtml(
                  plan.id
                )}')"
              >
                خرید اشتراک
              </button>
            `
        }

      `;

      container.appendChild(
        div
      );

    }
  );

}

async function buyPlan(
  planId
) {

  if (!authToken) {

    showView("login");

    return;

  }

  try {

    const data =
      await api(
        "/api/payment/request",
        {
          method: "POST",
          body: JSON.stringify({
            planId
          })
        }
      );

    if (
      data.payment_url
    ) {

      window.location.href =
        data.payment_url;

    } else {

      alert(
        "لینک پرداخت دریافت نشد."
      );

    }

  } catch (error) {

    alert(
      error.message
    );

  }

}

async function doAdminLogin() {

  const password =
    $("admin-password").value;

  setMessage(
    "admin-login-message",
    ""
  );

  try {

    const response =
      await fetch(
        "/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            password
          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "خطا در ورود مدیریت"
      );
    }

    adminToken =
      data.token;

    localStorage.setItem(
      "abzarak_admin_token",
      adminToken
    );

    showView("admin");

    loadAdminUsers();

  } catch (error) {

    setMessage(
      "admin-login-message",
      error.message,
      "error"
    );

  }

}

async function adminApi(
  path,
  options = {}
) {

  const headers = {
    ...(options.headers || {}),
    Authorization:
      "Bearer " +
      adminToken
  };

  if (
    options.body &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] =
      "application/json";
  }

  const response =
    await fetch(
      path,
      {
        ...options,
        headers
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
      "خطای مدیریت"
    );
  }

  return data;

}

async function loadAdminUsers() {

  const container =
    $("admin-content");

  container.innerHTML =
    '<div class="loading">در حال دریافت کاربران...</div>';

  try {

    const data =
      await adminApi(
        "/api/admin/users"
      );

    const users =
      data.users || [];

    if (!users.length) {

      container.innerHTML =
        '<div class="notice">کاربری وجود ندارد.</div>';

      return;

    }

    container.innerHTML = `
      <h3>👥 کاربران</h3>

      <div style="overflow:auto;">

      <table class="admin-table">

        <thead>
          <tr>
            <th>نام</th>
            <th>ایمیل</th>
            <th>موجودی</th>
          </tr>
        </thead>

        <tbody>

          ${users.map(
            user => `
              <tr>
                <td>
                  ${escapeHtml(
                    user.name || "-"
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    user.email
                  )}
                </td>

                <td>
                  ${Number(
                    user.balance || 0
                  ).toLocaleString(
                    "fa-IR"
                  )}
                </td>
              </tr>
            `
          ).join("")}

        </tbody>

      </table>

      </div>
    `;

  } catch (error) {

    container.innerHTML =
      '<div class="notice error">' +
      escapeHtml(
        error.message
      ) +
      "</div>";

  }

}

async function loadAdminPayments() {

  const container =
    $("admin-content");

  container.innerHTML =
    '<div class="loading">در حال دریافت تراکنش‌ها...</div>';

  try {

    const data =
      await adminApi(
        "/api/admin/payments"
      );

    const payments =
      data.payments || [];

    container.innerHTML = `
      <h3>💳 تراکنش‌ها</h3>

      <div style="overflow:auto;">

      <table class="admin-table">

        <thead>
          <tr>
            <th>ایمیل</th>
            <th>پلن</th>
            <th>مبلغ</th>
            <th>وضعیت</th>
          </tr>
        </thead>

        <tbody>

          ${payments.map(
            payment => `
              <tr>
                <td>
                  ${escapeHtml(
                    payment.email
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    payment.plan_id
                  )}
                </td>

                <td>
                  ${Number(
                    payment.amount_toman || 0
                  ).toLocaleString(
                    "fa-IR"
                  )}
                  تومان
                </td>

                <td>
                  ${escapeHtml(
                    payment.status
                  )}
                </td>
              </tr>
            `
          ).join("")}

        </tbody>

      </table>

      </div>
    `;

  } catch (error) {

    container.innerHTML =
      '<div class="notice error">' +
      escapeHtml(
        error.message
      ) +
      "</div>";

  }

}

function showAdjustBalanceForm() {

  $("admin-content").innerHTML = `

    <h3>
      💰 تعدیل موجودی
    </h3>

    <input
      id="adjust-user-id"
      class="input"
      placeholder="شناسه کاربر"
    >

    <input
      id="adjust-amount"
      class="input"
      type="number"
      placeholder="مبلغ به تومان - برای کسر منفی وارد کنید"
    >

    <input
      id="adjust-reason"
      class="input"
      placeholder="دلیل"
    >

    <button
      class="btn btn-primary"
      onclick="adjustBalance()"
    >
      ثبت
    </button>

    <div
      id="adjust-message"
      style="margin-top:12px;"
    ></div>

  `;

}

async function adjustBalance() {

  const userId =
    $("adjust-user-id").value.trim();

  const amount =
    Number(
      $("adjust-amount").value
    );

  const reason =
    $("adjust-reason").value.trim();

  try {

    const data =
      await adminApi(
        "/api/admin/adjust-balance",
        {
          method: "POST",
          body: JSON.stringify({
            userId,
            amount,
            reason
          })
        }
      );

    $("adjust-message").innerHTML =
      '<div class="notice success">' +
      "موجودی جدید: " +
      Number(
        data.new_balance
      ).toLocaleString("fa-IR") +
      " تومان" +
      "</div>";

  } catch (error) {

    $("adjust-message").innerHTML =
      '<div class="notice error">' +
      escapeHtml(
        error.message
      ) +
      "</div>";

  }

}

function adminLogout() {

  adminToken = "";

  localStorage.removeItem(
    "abzarak_admin_token"
  );

  showView(
    "admin-login"
  );

}

function toggleLang() {

  const button =
    $("lang-button");

  const current =
    document.documentElement.lang;

  if (current === "fa") {

    document.documentElement.lang =
      "en";

    document.documentElement.dir =
      "ltr";

    button.textContent =
      "فارسی";

    document
      .querySelector(".hero h1")
      .textContent =
      "Your Smart AI Assistant";

    document
      .querySelector(".hero p")
      .textContent =
      "Chat with AI, ask questions, translate, create content and get help with everyday tasks.";

  } else {

    document.documentElement.lang =
      "fa";

    document.documentElement.dir =
      "rtl";

    button.textContent =
      "English";

    document
      .querySelector(".hero h1")
      .textContent =
      "دستیار هوشمند شما، همیشه آماده";

    document
      .querySelector(".hero p")
      .textContent =
      "با ابزارک گفتگو کنید، سؤال بپرسید، ترجمه کنید، محتوا بسازید و کارهای روزمره خود را سریع‌تر انجام دهید.";

  }

}

function initInstallPrompt() {

  window.addEventListener(
    "beforeinstallprompt",
    event => {

      event.preventDefault();

      deferredInstallPrompt =
        event;

      $("install-app-btn")
        .classList.remove(
          "hidden"
        );

    }
  );

  window.addEventListener(
    "appinstalled",
    () => {

      deferredInstallPrompt =
        null;

      $("install-app-btn")
        .classList.add(
          "hidden"
        );

    }
  );

}

async function installPwa() {

  if (!deferredInstallPrompt) {

    alert(
      "اگر گزینه نصب نمایش داده نمی‌شود، از منوی Chrome گزینه «افزودن به صفحه اصلی» یا «Install app» را انتخاب کنید."
    );

    return;

  }

  deferredInstallPrompt.prompt();

  await deferredInstallPrompt.userChoice;

  deferredInstallPrompt =
    null;

  $("install-app-btn")
    .classList.add(
      "hidden"
    );

}

function handlePaymentResult() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  const payment =
    params.get("payment");

  if (!payment) return;

  let message = "";

  if (
    payment === "success"
  ) {

    message =
      "پرداخت با موفقیت انجام شد.";

  } else if (
    payment === "cancel"
  ) {

    message =
      "پرداخت لغو شد.";

  } else if (
    payment === "failed"
  ) {

    message =
      "پرداخت ناموفق بود.";

  } else if (
    payment === "error"
  ) {

    message =
      "خطا در پرداخت.";

  }

  if (message) {

    setTimeout(
      () => {
        alert(message);
        history.replaceState(
          {},
          "",
          "/"
        );
      },
      300
    );

  }

}

window.addEventListener(
  "DOMContentLoaded",
  () => {

    initInstallPrompt();

    handlePaymentResult();

    loadPlans();

    if (authToken) {
      loadAccount();
    }

  }
);

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register(
          "/sw.js"
        )
        .catch(
          error =>
            console.log(
              "Service Worker:",
              error
            )
        );

    }
  );

}

</script>

</body>
</html>
`;
}

// =============================================================
// ROBOTS
// =============================================================

function renderRobotsTxt(
  baseUrl
) {
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
}

// =============================================================
// SITEMAP
// =============================================================

function renderSitemapXml(
  baseUrl
) {
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

  async fetch(
    request,
    env
  ) {

    const url =
      new URL(request.url);

    // ---------------------------------------------------------
    // OPTIONS
    // ---------------------------------------------------------

    if (
      request.method ===
      "OPTIONS"
    ) {
      return json(
        {},
        204
      );
    }

    // ---------------------------------------------------------
    // MANIFEST
    // ---------------------------------------------------------

    if (
      url.pathname ===
        "/manifest.json" &&
      request.method ===
        "GET"
    ) {

      const baseUrl =
        getBaseUrl(
          request,
          env
        );

      return new Response(
        renderManifest(
          baseUrl
        ),
        {
          headers: {
            "Content-Type":
              "application/manifest+json; charset=utf-8",
            "Cache-Control":
              "public, max-age=3600"
          }
        }
      );

    }

    // ---------------------------------------------------------
    // SERVICE WORKER
    // ---------------------------------------------------------

    if (
      url.pathname ===
        "/sw.js" &&
      request.method ===
        "GET"
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
      url.pathname ===
        "/icon.svg" &&
      request.method ===
        "GET"
    ) {

      return new Response(
        renderIconSvg(),
        {
          headers: {
            "Content-Type":
              "image/svg+xml; charset=utf-8",
            "Cache-Control":
              "public, max-age=86400"
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
      url.pathname ===
        "/36032134.txt" &&
      request.method ===
        "GET"
    ) {

      return new Response(
        "",
        {
          status: 200,
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
      url.pathname ===
        "/robots.txt" &&
      request.method ===
        "GET"
    ) {

      const baseUrl =
        getBaseUrl(
          request,
          env
        );

      return new Response(
        renderRobotsTxt(
          baseUrl
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
      url.pathname ===
        "/sitemap.xml" &&
      request.method ===
        "GET"
    ) {

      const baseUrl =
        getBaseUrl(
          request,
          env
        );

      return new Response(
        renderSitemapXml(
          baseUrl
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
      url.pathname ===
        "/api/signup" &&
      request.method ===
        "POST"
    ) {
      return handleSignup(
        request,
        env
      );
    }

    if (
      url.pathname ===
        "/api/login" &&
      request.method ===
        "POST"
    ) {
      return handleLogin(
        request,
        env
      );
    }

    if (
      url.pathname ===
        "/api/me" &&
      request.method ===
        "GET"
    ) {
      return handleMe(
        request,
        env
      );
    }

    if (
      url.pathname ===
        "/api/forgot-password" &&
      request.method ===
        "POST"
    ) {
      return handleForgotPassword(
        request,
        env
      );
    }

    if (
      url.pathname ===
        "/api/reset-password" &&
      request.method ===
        "POST"
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
      url.pathname ===
        "/api/plans" &&
      request.method ===
        "GET"
    ) {
      return handlePlans();
    }

    // ---------------------------------------------------------
    // AI
    // ---------------------------------------------------------

    if (
      url.pathname ===
        "/api/ai/chat" &&
      request.method ===
        "POST"
    ) {
      return handleAiChat(
        request,
        env
      );
    }

    // ---------------------------------------------------------
    // PAYMENT
    // ---------------------------------------------------------

    if (
      url.pathname ===
        "/api/payment/request" &&
      request.method ===
        "POST"
    ) {
      return handleCreatePayment(
        request,
        env
      );
    }

    if (
      url.pathname ===
        "/api/payment/verify" &&
      request.method ===
        "GET"
    ) {
      return handleVerifyPayment(
        request,
        env
      );
    }

    // ---------------------------------------------------------
    // ADMIN
    // ---------------------------------------------------------

    if (
      url.pathname ===
        "/api/admin/login" &&
      request.method ===
        "POST"
    ) {
      return handleAdminLogin(
        request,
        env
      );
    }

    if (
      url.pathname ===
        "/api/admin/users" &&
      request.method ===
        "GET"
    ) {
      return handleAdminUsers(
        request,
        env
      );
    }

    if (
      url.pathname ===
        "/api/admin/payments" &&
      request.method ===
        "GET"
    ) {
      return handleAdminPayments(
        request,
        env
      );
    }

    if (
      url.pathname ===
        "/api/admin/adjust-balance" &&
      request.method ===
        "POST"
    ) {
      return handleAdminAdjustBalance(
        request,
        env
      );
    }

    // ---------------------------------------------------------
    // 404
    // ---------------------------------------------------------

    return json(
      {
        error:
          "مسیر یافت نشد."
      },
      404
    );

  }

};
