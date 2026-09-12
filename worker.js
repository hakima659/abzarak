// =============================================================
// worker.js — ابزارک | دستیار هوش مصنوعی چندزبانه
// Auth + Account + AI + Plans + ZarinPal + Admin + PWA + SEO
// =============================================================

const AI_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";
const USD_TO_TOMAN_RATE = 70000;

// =============================================================
// BASIC HELPERS
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
  return (env.PUBLIC_BASE_URL || new URL(request.url).origin)
    .replace(/\/+$/, "");
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
     viewBox="0 0 512 512"
     width="512"
     height="512">
  <defs>
    <linearGradient id="bg"
      x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6d5dfc"/>
      <stop offset="55%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#111936"/>
    </linearGradient>

    <linearGradient id="orb"
      x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#b9c7ff"/>
    </linearGradient>
  </defs>

  <rect width="512" height="512"
        rx="120" fill="url(#bg)"/>

  <circle cx="256" cy="238"
          r="145"
          fill="rgba(255,255,255,.12)"/>

  <circle cx="256" cy="238"
          r="112"
          fill="url(#orb)"/>

  <path d="M190 250
           C190 210 220 180 256 180
           C292 180 322 210 322 250
           C322 290 292 320 256 320
           C220 320 190 290 190 250Z"
        fill="#1b2450"/>

  <circle cx="230" cy="245"
          r="11"
          fill="#ffffff"/>

  <circle cx="282" cy="245"
          r="11"
          fill="#ffffff"/>

  <path d="M220 278
           Q256 302 292 278"
        fill="none"
        stroke="#ffffff"
        stroke-width="10"
        stroke-linecap="round"/>

  <text x="256"
        y="430"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="55"
        font-weight="700"
        fill="#ffffff">AI</text>
</svg>`;
}

function renderServiceWorker() {
  return `
const CACHE_NAME = "abzarak-pwa-v3";

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

  const token = auth
    .replace(/^Bearer\s+/i, "")
    .trim();

  if (!token) {
    return null;
  }

  try {
    const session = await env.DB
      .prepare(
        `SELECT user_id
         FROM sessions
         WHERE token = ?`
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
    console.error(
      "getUserFromToken:",
      error
    );

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
        `SELECT id
         FROM admin_sessions
         WHERE token = ?`
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

    return {
      ok: true,
    };
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
      {
        error:
          "بدنه درخواست نامعتبر است.",
      },
      400
    );
  }

  const name =
    String(body.name || "").trim();

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
    const existing = await env.DB
      .prepare(
        `SELECT id
         FROM users
         WHERE email = ?`
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
        name || "کاربر",
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
        name: name || "کاربر",
        email,
        balance: 0,
      },
    });
  } catch (error) {
    console.error(
      "Signup:",
      error
    );

    return json(
      {
        error:
          "خطا در ثبت‌نام: " +
          (error?.message ||
            String(error)),
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
      {
        error:
          "بدنه درخواست نامعتبر است.",
      },
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
    const user = await env.DB
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
        balance:
          Number(user.balance || 0),
      },
    });
  } catch (error) {
    console.error(
      "Login:",
      error
    );

    return json(
      {
        error:
          "خطا در ورود: " +
          (error?.message ||
            String(error)),
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

  return json({
    user: {
      ...user,
      balance:
        Number(user.balance || 0),
    },
  });
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
      {
        error:
          "بدنه درخواست نامعتبر است.",
      },
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
    const user = await env.DB
      .prepare(
        `SELECT id
         FROM users
         WHERE email = ?`
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
        Date.now() +
        15 * 60 * 1000
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
        <div dir="rtl"
             style="font-family:Arial,sans-serif">
          <h2>🤖 ابزارک</h2>
          <p>کد بازیابی رمز عبور شما:</p>
          <div style="
            font-size:32px;
            font-weight:bold;
            letter-spacing:8px;
            padding:20px;
            background:#f1f5f9;
            border-radius:15px;
            text-align:center;
          ">${code}</div>
          <p>این کد تا ۱۵ دقیقه معتبر است.</p>
        </div>
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
          (error?.message ||
            String(error)),
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
      {
        error:
          "بدنه درخواست نامعتبر است.",
      },
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
    const user = await env.DB
      .prepare(
        `SELECT id
         FROM users
         WHERE email = ?`
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
        `UPDATE users
         SET password_hash = ?
         WHERE id = ?`
      )
      .bind(
        passwordHash,
        user.id
      )
      .run();

    await env.DB
      .prepare(
        `UPDATE reset_codes
         SET used = 1
         WHERE id = ?`
      )
      .bind(resetRow.id)
      .run();

    await env.DB
      .prepare(
        `DELETE FROM sessions
         WHERE user_id = ?`
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
          (error?.message ||
            String(error)),
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
      {
        error:
          "بدنه درخواست نامعتبر است.",
      },
      400
    );
  }

  const message =
    String(body.message || "")
      .trim();

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
- Support Persian, English, Arabic, Turkish,
  Azerbaijani, Kurdish, French, German,
  Spanish, Italian, Russian, Urdu, Hindi,
  Chinese, Japanese and other languages when possible.
- If the user requests translation,
  follow the requested target language.
- If the user mixes languages,
  respond naturally using the dominant language.

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
          (error?.message ||
            String(error)),
      },
      500
    );
  }
}

// =============================================================
// PLANS — 400,000 TO 2,000,000 TOMAN
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
    price_toman: 400000,
    period: "monthly",
    messages_per_day: null,
    features: [
      "پیام نامحدود",
      "دستیار هوش مصنوعی",
      "پشتیبانی چندزبانه",
      "مناسب استفاده روزمره",
    ],
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
      "پشتیبانی چندزبانه",
    ],
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
      "پشتیبانی اختصاصی",
    ],
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
      "پشتیبانی اختصاصی",
    ],
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
      "دسترسی زودهنگام به امکانات جدید",
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
      "Multilingual AI",
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
      "More features",
    ],
  },

  {
    id: "usd_pro",
    name: "Pro",
    price_usd: 15,
    period: "monthly",
    features: [
      "Unlimited messages",
      "Priority responses",
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
      {
        error:
          "بدنه درخواست نامعتبر است.",
      },
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

  const paymentId =
    uuid();

  // تومان -> ریال
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
      Object.keys(
        data.errors
      ).length
    ) {
      return json(
        {
          error:
            "خطای زرین‌پال: " +
            (
              data.errors.message ||
              JSON.stringify(
                data.errors
              )
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
    } catch {
      // Optional column
    }

    const paymentUrl =
      env.ZARINPAL_SANDBOX === "true"
        ? `https://sandbox.zarinpal.com/pg/StartPay/${authority}`
        : `https://www.zarinpal.com/pg/StartPay/${authority}`;

    return json({
      success: true,
      payment_url:
        paymentUrl,
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
          (error?.message ||
            String(error)),
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
      payment.status ===
      "paid"
    ) {
      return Response.redirect(
        `${baseUrl}/?payment=success`,
        302
      );
    }

    if (
      status !== "OK"
    ) {
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
      {
        error:
          "بدنه درخواست نامعتبر است.",
      },
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
          (error?.message ||
            String(error)),
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
      {
        error:
          "دسترسی غیرمجاز.",
      },
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
          (error?.message ||
            String(error)),
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
      {
        error:
          "دسترسی غیرمجاز.",
      },
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
             ON users.id =
                payments.user_id
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
                  Number(
                    payment.amount || 0
                  ) / 10
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
          (error?.message ||
            String(error)),
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
      {
        error:
          "دسترسی غیرمجاز.",
      },
      401
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json(
      {
        error:
          "بدنه درخواست نامعتبر است.",
      },
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
          `SELECT
             id,
             balance
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
    } catch {
      // Optional table
    }

    return json({
      success: true,
      user_id: userId,
      new_balance:
        newBalance,
    });
  } catch (error) {
    return json(
      {
        error:
          "خطا در تعدیل موجودی: " +
          (error?.message ||
            String(error)),
      },
      500
    );
  }
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
      content="width=device-width, initial-scale=1.0, viewport-fit=cover">

<meta name="theme-color"
      content="#12163a">

<meta name="mobile-web-app-capable"
      content="yes">

<meta name="apple-mobile-web-app-capable"
      content="yes">

<meta name="apple-mobile-web-app-status-bar-style"
      content="default">

<meta name="apple-mobile-web-app-title"
      content="ابزارک">

<title>ابزارک | دستیار هوش مصنوعی چندزبانه</title>

<meta name="description"
      content="ابزارک یک دستیار هوش مصنوعی چندزبانه برای کاربران سراسر جهان است.">

<meta name="keywords"
      content="ابزارک, هوش مصنوعی, AI, AI Assistant, دستیار هوش مصنوعی, چت هوش مصنوعی, multilingual AI">

<meta name="robots"
      content="index, follow">

<link rel="manifest"
      href="/manifest.json">

<link rel="icon"
      href="/icon.svg"
      type="image/svg+xml">

<meta property="og:type"
      content="website">

<meta property="og:site_name"
      content="ابزارک">

<meta property="og:title"
      content="ابزارک | دستیار هوش مصنوعی">

<meta property="og:description"
      content="دستیار هوش مصنوعی چندزبانه برای کاربران سراسر جهان.">

<meta property="og:url"
      content="https://abzarakai.ir/">

<meta property="og:locale"
      content="fa_IR">

<meta property="og:locale:alternate"
      content="en_US">

<meta name="twitter:card"
      content="summary">

<meta name="twitter:title"
      content="ابزارک | AI Assistant">

<meta name="twitter:description"
      content="A multilingual AI assistant for users worldwide.">

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
      180deg,
      #f6f8ff 0%,
      #eef2ff 100%
    );
  color:#17203a;
}

button,
input{
  font:inherit;
}

button{
  cursor:pointer;
}

a{
  text-decoration:none;
}

.hidden{
  display:none !important;
}

.container{
  width:min(1180px,92%);
  margin:auto;
}

header{
  position:sticky;
  top:0;
  z-index:100;
  backdrop-filter:blur(18px);
  background:
    rgba(255,255,255,.88);
  border-bottom:
    1px solid #e5e7eb;
}

.nav{
  min-height:72px;
  display:flex;
  align-items:center;
  gap:12px;
  flex-wrap:wrap;
  padding:10px 0;
}

.brand{
  display:flex;
  align-items:center;
  gap:9px;
  color:#12163a;
  font-size:20px;
  font-weight:900;
  margin-left:auto;
}

.brand-icon{
  width:42px;
  height:42px;
  border-radius:13px;
  box-shadow:
    0 8px 25px
    rgba(79,70,229,.25);
}

.nav-links{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:5px;
  flex-wrap:wrap;
}

.nav-links button{
  border:0;
  background:transparent;
  color:#4b5563;
  padding:10px 12px;
  border-radius:12px;
  font-weight:700;
}

.nav-links button:hover{
  background:#eef2ff;
  color:#3730a3;
}

.install-btn,
.lang-switch{
  border:0;
  border-radius:12px;
  padding:10px 13px;
  font-weight:800;
}

.install-btn{
  background:#111936;
  color:white;
}

.lang-switch{
  background:#eef2ff;
  color:#312e81;
}

.hero{
  margin-top:25px;
  border-radius:32px;
  overflow:hidden;
  padding:70px 35px;
  color:white;
  position:relative;
  background:
    radial-gradient(
      circle at 80% 15%,
      rgba(255,255,255,.28),
      transparent 25%
    ),
    radial-gradient(
      circle at 15% 85%,
      rgba(34,211,238,.25),
      transparent 30%
    ),
    linear-gradient(
      135deg,
      #111936,
      #4338ca 52%,
      #2563eb
    );
  box-shadow:
    0 25px 80px
    rgba(37,48,120,.25);
}

.hero:after{
  content:"";
  position:absolute;
  width:260px;
  height:260px;
  border-radius:50%;
  border:1px solid
    rgba(255,255,255,.22);
  right:-80px;
  bottom:-100px;
}

.hero-content{
  position:relative;
  z-index:2;
  max-width:760px;
}

.badge{
  display:inline-flex;
  padding:9px 14px;
  border-radius:999px;
  background:
    rgba(255,255,255,.12);
  border:
    1px solid
    rgba(255,255,255,.18);
  font-weight:800;
}

.hero h1{
  font-size:
    clamp(32px,6vw,64px);
  margin:
    20px 0 15px;
  line-height:1.15;
}

.hero p{
  font-size:18px;
  line-height:2;
  color:#e8ebff;
  max-width:720px;
}

.actions{
  display:flex;
  gap:12px;
  flex-wrap:wrap;
  margin-top:25px;
}

.btn{
  border:0;
  border-radius:14px;
  padding:13px 18px;
  font-weight:900;
  transition:
    transform .15s,
    box-shadow .15s;
}

.btn:hover{
  transform:translateY(-2px);
}

.btn-primary{
  background:
    linear-gradient(
      135deg,
      #4f46e5,
      #2563eb
    );
  color:white;
  box-shadow:
    0 10px 25px
    rgba(37,99,235,.2);
}

.btn-light{
  background:white;
  color:#202657;
}

.btn-secondary{
  background:#eef2ff;
  color:#312e81;
}

.btn-danger{
  background:#fee2e2;
  color:#991b1b;
}

.section{
  padding:45px 0;
}

.section h2{
  font-size:30px;
  margin-bottom:10px;
}

.muted{
  color:#64748b;
  line-height:1.9;
}

.features{
  display:grid;
  grid-template-columns:
    repeat(3,1fr);
  gap:18px;
  margin-top:25px;
}

.card{
  background:white;
  border:
    1px solid #e5e7eb;
  border-radius:22px;
  padding:25px;
  box-shadow:
    0 12px 35px
    rgba(15,23,42,.06);
}

.feature-icon{
  font-size:38px;
  margin-bottom:10px;
}

.view{
  display:none;
  padding:35px 0 60px;
}

.view.active{
  display:block;
}

.form-card{
  max-width:520px;
  margin:auto;
}

.input{
  width:100%;
  border:
    1px solid #d7dce8;
  background:white;
  border-radius:14px;
  padding:14px 15px;
  outline:none;
  margin:
    7px 0;
}

.input:focus{
  border-color:#6366f1;
  box-shadow:
    0 0 0 4px
    rgba(99,102,241,.1);
}

.link-btn{
  border:0;
  background:transparent;
  color:#4f46e5;
  font-weight:800;
  padding:12px 0;
}

.account-grid{
  display:grid;
  grid-template-columns:
    repeat(3,1fr);
  gap:15px;
  margin-top:20px;
}

.account-value{
  font-size:24px;
  font-weight:900;
  margin-top:8px;
}

.ai-box{
  max-width:900px;
  margin:auto;
}

.chat{
  min-height:360px;
  max-height:600px;
  overflow:auto;
  background:white;
  border:
    1px solid #e5e7eb;
  border-radius:22px;
  padding:18px;
  margin-bottom:12px;
}

.message{
  padding:14px 16px;
  border-radius:17px;
  margin:
    8px 0;
  line-height:1.9;
  white-space:pre-wrap;
}

.message.user{
  background:#eef2ff;
  margin-right:12%;
}

.message.ai{
  background:#f8fafc;
  border:
    1px solid #e2e8f0;
  margin-left:12%;
}

.ai-row{
  display:flex;
  gap:8px;
}

.ai-row .input{
  margin:0;
}

.ai-row .btn{
  white-space:nowrap;
}

.currency-switch{
  display:flex;
  gap:8px;
  margin:20px 0;
}

.plans{
  display:grid;
  grid-template-columns:
    repeat(3,1fr);
  gap:18px;
}

.plan{
  background:white;
  border:
    1px solid #e5e7eb;
  border-radius:24px;
  padding:25px;
  position:relative;
  box-shadow:
    0 14px 35px
    rgba(15,23,42,.06);
}

.plan.popular{
  border:
    2px solid #6366f1;
  transform:translateY(-4px);
}

.popular-label{
  position:absolute;
  top:-13px;
  right:18px;
  background:#4f46e5;
  color:white;
  padding:6px 11px;
  border-radius:999px;
  font-size:12px;
  font-weight:900;
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

.price small{
  font-size:13px;
  color:#64748b;
}

.plan ul{
  padding-right:20px;
  line-height:2;
  color:#475569;
  min-height:130px;
}

.admin-actions{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  margin-bottom:18px;
}

.table-wrap{
  overflow:auto;
  background:white;
  border-radius:18px;
  border:1px solid #e5e7eb;
}

table{
  width:100%;
  border-collapse:collapse;
  min-width:650px;
}

th,
td{
  padding:12px;
  border-bottom:
    1px solid #edf0f5;
  text-align:right;
}

th{
  background:#f8fafc;
}

.status{
  padding:5px 9px;
  border-radius:999px;
  font-size:12px;
  font-weight:900;
}

.status-paid{
  background:#dcfce7;
  color:#166534;
}

.status-pending{
  background:#fef3c7;
  color:#92400e;
}

.status-failed,
.status-cancelled{
  background:#fee2e2;
  color:#991b1b;
}

footer{
  text-align:center;
  color:#64748b;
  padding:
    30px 0 50px;
}

.notice{
  background:#eff6ff;
  border:
    1px solid #bfdbfe;
  color:#1e40af;
  border-radius:16px;
  padding:14px;
  margin:15px 0;
  line-height:1.8;
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

  .nav{
    justify-content:center;
  }

  .nav-links{
    width:100%;
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

  .hero p{
    font-size:16px;
  }

  .ai-row{
    flex-direction:column;
  }

  .message.user{
    margin-right:0;
  }

  .message.ai{
    margin-left:0;
  }

  .nav-links button{
    padding:8px;
    font-size:13px;
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
  <img src="/icon.svg"
       class="brand-icon"
       alt="ابزارک">
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
  id="install-app-btn"
  class="install-btn hidden"
  onclick="installPwa()">
  📲 نصب اپ
</button>

<button
  class="lang-switch"
  onclick="toggleLang()"
  id="lang-button">
  English
</button>

</div>
</header>

<main class="container">

<!-- HOME -->

<section id="view-home"
         class="view active">

<div class="hero">

<div class="hero-content">

<div class="badge">
✨ هوش مصنوعی چندزبانه
</div>

<h1>
دستیار هوشمند شما،
همیشه آماده
</h1>

<p>
با ابزارک گفتگو کنید، سؤال بپرسید،
ترجمه کنید، محتوا بسازید و کارهای
روزمره خود را سریع‌تر انجام دهید.
</p>

<div class="actions">

<button
  class="btn btn-light"
  onclick="showView('ai')">
  🤖 شروع گفتگو
</button>

<button
  class="btn"
  style="background:rgba(255,255,255,.14);color:white;"
  onclick="showView('plans')">
  💎 مشاهده پلن‌ها
</button>

</div>

</div>
</div>

<div class="section">

<h2>
🌍 دستیار هوش مصنوعی برای همه
</h2>

<p class="muted">
ابزارک یک دستیار هوش مصنوعی چندزبانه
است که برای کاربران سراسر جهان طراحی شده است.
</p>

<div class="features">

<div class="card">
<div class="feature-icon">🤖</div>
<h3>AI</h3>
<p class="muted">
دستیار هوشمند برای پاسخ به پرسش‌ها
و انجام کارهای روزمره.
</p>
</div>

<div class="card">
<div class="feature-icon">🌍</div>
<h3>Multi</h3>
<p class="muted">
پشتیبانی از زبان‌های مختلف جهان.
</p>
</div>

<div class="card">
<div class="feature-icon">📱</div>
<h3>PWA</h3>
<p class="muted">
قابل نصب روی موبایل و قابل استفاده
روی کامپیوتر.
</p>
</div>

</div>
</div>

<div class="section">

<h2>
چرا ابزارک؟
</h2>

<div class="features">

<div class="card">
<h3>💬 گفتگو</h3>
<p class="muted">
گفتگوی متنی با هوش مصنوعی.
</p>
</div>

<div class="card">
<h3>🌐 چندزبانه</h3>
<p class="muted">
پاسخ در زبان مورد استفاده شما.
</p>
</div>

<div class="card">
<h3>📲 همیشه در دسترس</h3>
<p class="muted">
قابل استفاده در موبایل و کامپیوتر.
</p>
</div>

</div>
</div>

</section>

<!-- LOGIN -->

<section id="view-login"
         class="view">

<div class="card form-card">

<h2>🔑 ورود به حساب</h2>

<input
  id="login-email"
  class="input"
  type="email"
  placeholder="ایمیل">

<input
  id="login-password"
  class="input"
  type="password"
  placeholder="رمز عبور">

<button
  class="btn btn-primary"
  style="width:100%;"
  onclick="doLogin()">
  ورود
</button>

<button
  class="link-btn"
  onclick="showView('forgot')">
  فراموشی رمز عبور؟
</button>

<button
  class="btn btn-secondary"
  style="width:100%;"
  onclick="showView('signup')">
  ثبت‌نام
</button>

</div>

</section>

<!-- SIGNUP -->

<section id="view-signup"
         class="view">

<div class="card form-card">

<h2>📝 ثبت‌نام</h2>

<input
  id="signup-name"
  class="input"
  placeholder="نام">

<input
  id="signup-email"
  class="input"
  type="email"
  placeholder="ایمیل">

<input
  id="signup-password"
  class="input"
  type="password"
  placeholder="رمز عبور حداقل ۶ کاراکتر">

<button
  class="btn btn-primary"
  style="width:100%;"
  onclick="doSignup()">
  ثبت‌نام
</button>

<button
  class="btn btn-secondary"
  style="width:100%;margin-top:8px;"
  onclick="showView('login')">
  بازگشت
</button>

</div>

</section>

<!-- FORGOT -->

<section id="view-forgot"
         class="view">

<div class="card form-card">

<h2>🔐 بازیابی رمز</h2>

<p class="muted">
ایمیل خود را وارد کنید.
</p>

<input
  id="forgot-email"
  class="input"
  type="email"
  placeholder="ایمیل">

<button
  class="btn btn-primary"
  style="width:100%;"
  onclick="doForgotPassword()">
  ارسال کد
</button>

<button
  class="btn btn-secondary"
  style="width:100%;margin-top:8px;"
  onclick="showView('reset')">
  کد را دارم
</button>

</div>

</section>

<!-- RESET -->

<section id="view-reset"
         class="view">

<div class="card form-card">

<h2>🔑 تغییر رمز</h2>

<input
  id="reset-email"
  class="input"
  type="email"
  placeholder="ایمیل">

<input
  id="reset-code"
  class="input"
  placeholder="کد ۶ رقمی">

<input
  id="reset-password"
  class="input"
  type="password"
  placeholder="رمز عبور جدید">

<button
  class="btn btn-primary"
  style="width:100%;"
  onclick="doResetPassword()">
  تغییر رمز
</button>

</div>

</section>

<!-- ACCOUNT -->

<section id="view-account"
         class="view">

<div class="card">

<h2>🏠 حساب من</h2>

<div id="account-content">
در حال بررسی حساب...
</div>

</div>

</section>

<!-- AI -->

<section id="view-ai"
         class="view">

<div class="ai-box">

<div class="card">

<h2>🤖 گفتگو با هوش مصنوعی</h2>

<p class="muted">
هر زبانی که استفاده کنید،
ابزارک تلاش می‌کند به همان زبان پاسخ دهد.
</p>

<div id="chat"
     class="chat">
</div>

<div class="ai-row">

<input
  id="ai-input"
  class="input"
  placeholder="پیام خود را بنویسید..."
  onkeydown="if(event.key==='Enter')sendAiMessage()">

<button
  class="btn btn-primary"
  onclick="sendAiMessage()">
  ارسال
</button>

</div>

</div>

</div>

</section>

<!-- PLANS -->

<section id="view-plans"
         class="view">

<h2>💰 پلن‌های اشتراک</h2>

<p class="muted">
پلن موردنظر خود را انتخاب کنید.
</p>

<div class="currency-switch">

<button
  id="currency-irt"
  class="btn btn-secondary active"
  onclick="setPlanCurrency('irt')">
  تومان 🇮🇷
</button>

<button
  id="currency-usd"
  class="btn btn-secondary"
  onclick="setPlanCurrency('usd')">
  USD 🌍
</button>

</div>

<div id="plans-container"
     class="plans">
در حال بارگذاری پلن‌ها...
</div>

</section>

<!-- ADMIN LOGIN -->

<section id="view-admin"
         class="view">

<div id="admin-login-box"
     class="card form-card">

<h2>🛠️ ورود مدیریت</h2>

<input
  id="admin-password"
  class="input"
  type="password"
  placeholder="رمز مدیریت">

<button
  class="btn btn-primary"
  style="width:100%;"
  onclick="doAdminLogin()">
  ورود
</button>

</div>

<div id="admin-panel"
     class="hidden">

<div class="card">

<h2>🛠️ پنل مدیریت</h2>

<div class="admin-actions">

<button
  class="btn btn-secondary"
  onclick="loadAdminUsers()">
  👥 کاربران
</button>

<button
  class="btn btn-secondary"
  onclick="loadAdminPayments()">
  💳 تراکنش‌ها
</button>

<button
  class="btn btn-secondary"
  onclick="showAdjustBalanceForm()">
  💰 تعدیل موجودی
</button>

<button
  class="btn btn-danger"
  onclick="adminLogout()">
  خروج
</button>

</div>

<div id="admin-content"></div>

</div>

</div>

</section>

</main>

<footer>
© 2026 ابزارک — دستیار هوش مصنوعی چندزبانه
</footer>

<script>

const API = "";

let currentPlanCurrency = "irt";
let plansCache = null;

let pwaPrompt = null;

let userToken =
  localStorage.getItem("abzarak_token") || "";

let adminToken =
  localStorage.getItem("abzarak_admin_token") || "";

function api(path, options = {}) {

  const headers =
    options.headers || {};

  headers["Content-Type"] =
    "application/json";

  if (userToken) {
    headers["Authorization"] =
      "Bearer " + userToken;
  }

  return fetch(
    API + path,
    {
      ...options,
      headers
    }
  );
}

function adminApi(path, options = {}) {

  const headers =
    options.headers || {};

  headers["Content-Type"] =
    "application/json";

  if (adminToken) {
    headers["Authorization"] =
      "Bearer " + adminToken;
  }

  return fetch(
    API + path,
    {
      ...options,
      headers
    }
  );
}

function showView(name) {

  document
    .querySelectorAll(".view")
    .forEach(view =>
      view.classList.remove("active")
    );

  const target =
    document.getElementById(
      "view-" + name
    );

  if (target) {
    target.classList.add("active");
  }

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

  if (name === "account") {
    loadAccount();
  }

  if (name === "plans") {
    loadPlans();
  }

  if (name === "admin") {
    if (adminToken) {
      showAdminPanel();
    }
  }
}

function showMessage(message) {
  alert(message);
}

async function doSignup() {

  const name =
    document.getElementById(
      "signup-name"
    ).value.trim();

  const email =
    document.getElementById(
      "signup-email"
    ).value.trim();

  const password =
    document.getElementById(
      "signup-password"
    ).value;

  try {

    const response =
      await api(
        "/api/signup",
        {
          method:"POST",
          body:JSON.stringify({
            name,
            email,
            password
          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "خطا در ثبت‌نام"
      );
    }

    userToken =
      data.token;

    localStorage.setItem(
      "abzarak_token",
      userToken
    );

    showMessage(
      "ثبت‌نام با موفقیت انجام شد."
    );

    showView("account");

  } catch(error) {

    showMessage(
      error.message
    );
  }
}

async function doLogin() {

  const email =
    document.getElementById(
      "login-email"
    ).value.trim();

  const password =
    document.getElementById(
      "login-password"
    ).value;

  try {

    const response =
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

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "خطا در ورود"
      );
    }

    userToken =
      data.token;

    localStorage.setItem(
      "abzarak_token",
      userToken
    );

    showMessage(
      "ورود موفق بود."
    );

    showView("account");

  } catch(error) {

    showMessage(
      error.message
    );
  }
}

async function loadAccount() {

  const box =
    document.getElementById(
      "account-content"
    );

  box.innerHTML =
    "در حال دریافت اطلاعات...";

  if (!userToken) {

    box.innerHTML = `
      <p class="muted">
        برای مشاهده حساب ابتدا وارد شوید.
      </p>

      <button
        class="btn btn-primary"
        onclick="showView('login')">
        🔑 ورود
      </button>

      <button
        class="btn btn-secondary"
        onclick="showView('signup')">
        📝 ثبت‌نام
      </button>
    `;

    return;
  }

  try {

    const response =
      await api(
        "/api/me"
      );

    const data =
      await response.json();

    if (!response.ok) {

      userToken = "";

      localStorage.removeItem(
        "abzarak_token"
      );

      throw new Error(
        data.error ||
        "نشست نامعتبر است."
      );
    }

    const user =
      data.user;

    box.innerHTML = `

      <div class="account-grid">

        <div class="card">
          <div class="muted">
            نام
          </div>
          <div class="account-value">
            ${escapeHtml(
              user.name || "کاربر"
            )}
          </div>
        </div>

        <div class="card">
          <div class="muted">
            ایمیل
          </div>
          <div class="account-value"
               style="font-size:17px;word-break:break-all;">
            ${escapeHtml(
              user.email
            )}
          </div>
        </div>

        <div class="card">
          <div class="muted">
            موجودی
          </div>
          <div class="account-value">
            ${formatNumber(
              user.balance || 0
            )}
            تومان
          </div>
        </div>

      </div>

      <div class="actions">

        <button
          class="btn btn-primary"
          onclick="showView('ai')">
          🤖 ورود به هوش مصنوعی
        </button>

        <button
          class="btn btn-secondary"
          onclick="showView('plans')">
          💎 خرید اشتراک
        </button>

        <button
          class="btn btn-danger"
          onclick="logout()">
          خروج از حساب
        </button>

      </div>

      <div class="notice">
        💡 بخش برداشت موجودی برای مدیریت
        مالی در حال آماده‌سازی است.
      </div>
    `;

  } catch(error) {

    box.innerHTML =
      `<p class="muted">
        ${escapeHtml(
          error.message
        )}
      </p>`;

  }
}

function logout() {

  userToken = "";

  localStorage.removeItem(
    "abzarak_token"
  );

  showView("home");
}

async function doForgotPassword() {

  const email =
    document.getElementById(
      "forgot-email"
    ).value.trim();

  try {

    const response =
      await api(
        "/api/forgot-password",
        {
          method:"POST",
          body:JSON.stringify({
            email
          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "خطا در ارسال کد"
      );
    }

    showMessage(
      data.message ||
      "کد ارسال شد."
    );

    document.getElementById(
      "reset-email"
    ).value = email;

    showView("reset");

  } catch(error) {

    showMessage(
      error.message
    );
  }
}

async function doResetPassword() {

  const email =
    document.getElementById(
      "reset-email"
    ).value.trim();

  const code =
    document.getElementById(
      "reset-code"
    ).value.trim();

  const newPassword =
    document.getElementById(
      "reset-password"
    ).value;

  try {

    const response =
      await api(
        "/api/reset-password",
        {
          method:"POST",
          body:JSON.stringify({
            email,
            code,
            newPassword
          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "خطا در تغییر رمز"
      );
    }

    showMessage(
      data.message ||
      "رمز تغییر کرد."
    );

    showView("login");

  } catch(error) {

    showMessage(
      error.message
    );
  }
}

async function sendAiMessage() {

  const input =
    document.getElementById(
      "ai-input"
    );

  const chat =
    document.getElementById(
      "chat"
    );

  const message =
    input.value.trim();

  if (!message) {
    return;
  }

  if (!userToken) {

    showMessage(
      "برای استفاده از هوش مصنوعی ابتدا وارد حساب شوید."
    );

    showView("login");

    return;
  }

  addChatMessage(
    "user",
    message
  );

  input.value = "";

  const loadingId =
    "loading-" + Date.now();

  addChatMessage(
    "ai",
    "در حال پاسخ...",
    loadingId
  );

  try {

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

    const loading =
      document.getElementById(
        loadingId
      );

    if (loading) {
      loading.remove();
    }

    if (!response.ok) {
      throw new Error(
        data.error ||
        "خطا در هوش مصنوعی"
      );
    }

    addChatMessage(
      "ai",
      data.reply ||
      "پاسخی دریافت نشد."
    );

  } catch(error) {

    const loading =
      document.getElementById(
        loadingId
      );

    if (loading) {
      loading.remove();
    }

    addChatMessage(
      "ai",
      "❌ " +
      error.message
    );
  }
}

function addChatMessage(
  type,
  text,
  id = ""
) {

  const chat =
    document.getElementById(
      "chat"
    );

  const div =
    document.createElement(
      "div"
    );

  div.className =
    "message " + type;

  if (id) {
    div.id = id;
  }

  div.textContent =
    text;

  chat.appendChild(div);

  chat.scrollTop =
    chat.scrollHeight;
}

async function loadPlans() {

  const container =
    document.getElementById(
      "plans-container"
    );

  if (!container) {
    return;
  }

  container.innerHTML =
    "در حال بارگذاری پلن‌ها...";

  try {

    if (!plansCache) {

      const response =
        await api(
          "/api/plans"
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "خطا در دریافت پلن‌ها"
        );
      }

      plansCache = data;
    }

    renderPlans();

  } catch(error) {

    container.innerHTML =
      `<div class="card">
        ❌ ${escapeHtml(
          error.message
        )}
      </div>`;
  }
}

function renderPlans() {

  const container =
    document.getElementById(
      "plans-container"
    );

  if (!plansCache) {
    return;
  }

  const plans =
    currentPlanCurrency === "usd"
      ? plansCache.plans_usd
      : plansCache.plans;

  container.innerHTML =
    plans.map(
      (plan, index) => {

        const isUsd =
          currentPlanCurrency ===
          "usd";

        const price =
          isUsd
            ? `$${plan.price_usd}`
            : formatNumber(
                plan.price_toman
              );

        const period =
          "ماهانه";

        const features =
          (plan.features || [])
            .map(
              feature =>
                `<li>${escapeHtml(
                  feature
                )}</li>`
            )
            .join("");

        const popular =
          (
            currentPlanCurrency ===
            "irt" &&
            (
              plan.id === "pro" ||
              plan.id === "special"
            )
          ) ||
          (
            currentPlanCurrency ===
            "usd" &&
            plan.id === "usd_pro"
          );

        const buyButton =
          plan.price_toman === 0 ||
          plan.price_usd === 0
            ? `
              <button
                class="btn btn-secondary"
                style="width:100%;"
                onclick="showView('ai')">
                شروع استفاده
              </button>
            `
            : `
              <button
                class="btn btn-primary"
                style="width:100%;"
                onclick="buyPlan('${plan.id}')">
                💳 خرید این پلن
              </button>
            `;

        return `
          <div class="plan ${
            popular
              ? "popular"
              : ""
          }">

            ${
              popular
                ? `
                <div class="popular-label">
                  محبوب
                </div>
                `
                : ""
            }

            <h3>
              ${escapeHtml(
                plan.name
              )}
            </h3>

            <div class="price">
              ${price}
              <small>
                ${isUsd
                  ? " / month"
                  : " تومان / ماه"}
              </small>
            </div>

            <ul>
              ${features}
            </ul>

            ${buyButton}

          </div>
        `;
      }
    ).join("");
}

function setPlanCurrency(
  currency
) {

  currentPlanCurrency =
    currency;

  const irt =
    document.getElementById(
      "currency-irt"
    );

  const usd =
    document.getElementById(
      "currency-usd"
    );

  if (irt) {
    irt.classList.toggle(
      "active",
      currency === "irt"
    );
  }

  if (usd) {
    usd.classList.toggle(
      "active",
      currency === "usd"
    );
  }

  renderPlans();
}

async function buyPlan(
  planId
) {

  if (!userToken) {

    showMessage(
      "برای خرید ابتدا وارد حساب شوید."
    );

    showView("login");

    return;
  }

  try {

    const response =
      await api(
        "/api/payment/request",
        {
          method:"POST",
          body:JSON.stringify({
            planId
          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "خطا در ایجاد پرداخت"
      );
    }

    if (
      !data.payment_url
    ) {
      throw new Error(
        "لینک پرداخت دریافت نشد."
      );
    }

    window.location.href =
      data.payment_url;

  } catch(error) {

    showMessage(
      error.message
    );
  }
}

async function doAdminLogin() {

  const password =
    document.getElementById(
      "admin-password"
    ).value;

  try {

    const response =
      await adminApi(
        "/api/admin/login",
        {
          method:"POST",
          body:JSON.stringify({
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

    showAdminPanel();

  } catch(error) {

    showMessage(
      error.message
    );
  }
}

function showAdminPanel() {

  document
    .getElementById(
      "admin-login-box"
    )
    .classList.add("hidden");

  document
    .getElementById(
      "admin-panel"
    )
    .classList.remove("hidden");

  loadAdminUsers();
}

async function loadAdminUsers() {

  const content =
    document.getElementById(
      "admin-content"
    );

  content.innerHTML =
    "در حال دریافت کاربران...";

  try {

    const response =
      await adminApi(
        "/api/admin/users"
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "خطا"
      );
    }

    const users =
      data.users || [];

    content.innerHTML = `

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

          ${
            users.map(
              user => `
                <tr>
                  <td>
                    ${escapeHtml(
                      user.name ||
                      "کاربر"
                    )}
                  </td>

                  <td>
                    ${escapeHtml(
                      user.email
                    )}
                  </td>

                  <td>
                    ${formatNumber(
                      user.balance || 0
                    )}
                    تومان
                  </td>

                  <td>
                    ${escapeHtml(
                      user.created_at || ""
                    )}
                  </td>
                </tr>
              `
            ).join("")
          }

        </tbody>

      </table>

      </div>
    `;

  } catch(error) {

    content.innerHTML =
      `<div class="notice">
        ${escapeHtml(
          error.message
        )}
      </div>`;
  }
}

async function loadAdminPayments() {

  const content =
    document.getElementById(
      "admin-content"
    );

  content.innerHTML =
    "در حال دریافت تراکنش‌ها...";

  try {

    const response =
      await adminApi(
        "/api/admin/payments"
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "خطا"
      );
    }

    const payments =
      data.payments || [];

    content.innerHTML = `

      <h3>💳 تراکنش‌ها</h3>

      <div class="table-wrap">

      <table>

        <thead>
          <tr>
            <th>ایمیل</th>
            <th>پلن</th>
            <th>مبلغ</th>
            <th>وضعیت</th>
            <th>تاریخ</th>
          </tr>
        </thead>

        <tbody>

        ${
          payments.map(
            payment => {

              const status =
                payment.status ||
                "";

              return `
                <tr>

                  <td>
                    ${escapeHtml(
                      payment.email ||
                      ""
                    )}
                  </td>

                  <td>
                    ${escapeHtml(
                      payment.plan_id ||
                      ""
                    )}
                  </td>

                  <td>
                    ${formatNumber(
                      payment.amount_toman ||
                      0
                    )}
                    تومان
                  </td>

                  <td>
                    <span class="status status-${escapeHtml(status)}">
                      ${escapeHtml(
                        status
                      )}
                    </span>
                  </td>

                  <td>
                    ${escapeHtml(
                      payment.created_at ||
                      ""
                    )}
                  </td>

                </tr>
              `;
            }
          ).join("")
        }

        </tbody>

      </table>

      </div>
    `;

  } catch(error) {

    content.innerHTML =
      `<div class="notice">
        ${escapeHtml(
          error.message
        )}
      </div>`;
  }
}

function showAdjustBalanceForm() {

  const content =
    document.getElementById(
      "admin-content"
    );

  content.innerHTML = `

    <h3>💰 تعدیل موجودی</h3>

    <p class="muted">
      مبلغ مثبت برای افزایش موجودی
      و مبلغ منفی برای کاهش موجودی است.
      مبلغ به تومان وارد شود.
    </p>

    <input
      id="adjust-user-id"
      class="input"
      placeholder="شناسه کاربر">

    <input
      id="adjust-amount"
      class="input"
      type="number"
      placeholder="مبلغ به تومان">

    <input
      id="adjust-reason"
      class="input"
      placeholder="دلیل">

    <button
      class="btn btn-primary"
      onclick="adjustBalance()">
      ثبت تغییر
    </button>
  `;
}

async function adjustBalance() {

  const userId =
    document.getElementById(
      "adjust-user-id"
    ).value.trim();

  const amount =
    Number(
      document.getElementById(
        "adjust-amount"
      ).value
    );

  const reason =
    document.getElementById(
      "adjust-reason"
    ).value.trim();

  try {

    const response =
      await adminApi(
        "/api/admin/adjust-balance",
        {
          method:"POST",
          body:JSON.stringify({
            userId,
            amount,
            reason
          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "خطا"
      );
    }

    showMessage(
      "موجودی با موفقیت تغییر کرد."
    );

    loadAdminUsers();

  } catch(error) {

    showMessage(
      error.message
    );
  }
}

function adminLogout() {

  adminToken = "";

  localStorage.removeItem(
    "abzarak_admin_token"
  );

  document
    .getElementById(
      "admin-login-box"
    )
    .classList.remove("hidden");

  document
    .getElementById(
      "admin-panel"
    )
    .classList.add("hidden");
}

function formatNumber(value) {

  return Number(
    value || 0
  ).toLocaleString(
    "fa-IR"
  );
}

function escapeHtml(value) {

  return String(
    value ?? ""
  )
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function toggleLang() {

  const html =
    document.documentElement;

  const button =
    document.getElementById(
      "lang-button"
    );

  if (
    html.lang === "fa"
  ) {

    html.lang = "en";
    html.dir = "ltr";

    button.textContent =
      "فارسی";

    document.title =
      "Abzarak | AI Assistant";

  } else {

    html.lang = "fa";
    html.dir = "rtl";

    button.textContent =
      "English";

    document.title =
      "ابزارک | دستیار هوش مصنوعی چندزبانه";
  }
}

window.addEventListener(
  "beforeinstallprompt",
  event => {

    event.preventDefault();

    pwaPrompt =
      event;

    const button =
      document.getElementById(
        "install-app-btn"
      );

    if (button) {
      button.classList.remove(
        "hidden"
      );
    }
  }
);

async function installPwa() {

  if (!pwaPrompt) {
    showMessage(
      "اگر مرورگر نصب اپ را پیشنهاد نمی‌کند، از منوی مرورگر گزینه «افزودن به صفحه اصلی» را انتخاب کنید."
    );
    return;
  }

  pwaPrompt.prompt();

  await pwaPrompt.userChoice;

  pwaPrompt = null;

  const button =
    document.getElementById(
      "install-app-btn"
    );

  if (button) {
    button.classList.add(
      "hidden"
    );
  }
}

function handlePaymentResult() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  const payment =
    params.get("payment");

  if (!payment) {
    return;
  }

  if (
    payment === "success"
  ) {

    alert(
      "✅ پرداخت با موفقیت انجام شد و اشتراک شما فعال شد."
    );

  } else if (
    payment === "cancel"
  ) {

    alert(
      "پرداخت لغو شد."
    );

  } else if (
    payment === "failed"
  ) {

    alert(
      "❌ پرداخت تأیید نشد."
    );

  } else if (
    payment === "error"
  ) {

    alert(
      "❌ خطا در پرداخت."
    );
  }

  history.replaceState(
    {},
    document.title,
    "/"
  );
}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    handlePaymentResult();

    loadPlans();

    if (userToken) {
      loadAccount();
    }

    if ("serviceWorker" in navigator) {

      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {});
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
          status:200,
          headers:{
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
          headers:{
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
          headers:{
            "Content-Type":
              "application/xml; charset=utf-8"
          }
        }
      );
    }

    // ---------------------------------------------------------
    // SIGNUP
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

    // ---------------------------------------------------------
    // LOGIN
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // ME
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // FORGOT
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // RESET
    // ---------------------------------------------------------

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
    // PAYMENT REQUEST
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

    // ---------------------------------------------------------
    // PAYMENT VERIFY
    // ---------------------------------------------------------

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
    // ADMIN LOGIN
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

    // ---------------------------------------------------------
    // ADMIN USERS
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // ADMIN PAYMENTS
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // ADMIN BALANCE
    // ---------------------------------------------------------

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
