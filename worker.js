
// =============================================================
// worker.js — ابزارک: دستیار هوش مصنوعی چندزبانه برای کاربران سراسر جهان
//            + احراز هویت + حساب + پلن‌ها + هوش مصنوعی
//            + بازیابی رمز + پنل مدیریت + پرداخت زرین‌پال
//
// Bindings required in Cloudflare dashboard:
//   DB -> D1 database
//   AI -> Workers AI binding
//
// Variables/Secrets required:
//   ADMIN_PASSWORD
//   RESEND_API_KEY
//   RESEND_FROM_EMAIL
//   ZARINPAL_MERCHANT_ID
//   ZARINPAL_SANDBOX
//   PUBLIC_BASE_URL -> https://abzarakai.ir
//
// D1 schema note:
//   جدول payments باید ستون zarinpal_authority داشته باشد:
//   ALTER TABLE payments ADD COLUMN zarinpal_authority TEXT;
//
//   برای پلن‌های دلاری:
//   ALTER TABLE payments ADD COLUMN plan_currency TEXT DEFAULT 'irt';
//
//   برای تعدیل موجودی ادمین:
//   CREATE TABLE IF NOT EXISTS balance_adjustments (
//     id TEXT PRIMARY KEY,
//     user_id TEXT NOT NULL,
//     amount INTEGER NOT NULL,
//     reason TEXT,
//     created_at TEXT NOT NULL
//   );
// =============================================================


// =============================================================
// Utilities
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

function html(content) {
  return new Response(content, {
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
  let out = "";

  const bytes = crypto.getRandomValues(
    new Uint8Array(len)
  );

  for (let i = 0; i < len; i++) {
    out += digits[bytes[i] % digits.length];
  }

  return out;
}

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
  const parts = stored.split(":");

  if (
    parts.length !== 4 ||
    parts[0] !== "pbkdf2"
  ) {
    return false;
  }

  const iterations = parseInt(parts[1], 10);

  const saltBytes = new Uint8Array(
    parts[2]
      .match(/.{1,2}/g)
      .map((b) => parseInt(b, 16))
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
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// =============================================================
// Authentication
// =============================================================

async function getUserFromToken(request, env) {
  const auth =
    request.headers.get("Authorization") || "";

  const token = auth.replace(
    /^Bearer\s+/i,
    ""
  );

  if (!token) {
    return null;
  }

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
      "SELECT id, name, email, balance FROM users WHERE id = ?"
    )
    .bind(session.user_id)
    .first();

  return user || null;
}

function getAdminToken(request) {
  const auth =
    request.headers.get("Authorization") || "";

  return auth.replace(
    /^Bearer\s+/i,
    "");
}

async function requireAdmin(request, env) {
  const token = getAdminToken(request);

  if (!token) {
    return false;
  }

  const session = await env.DB
    .prepare(
      "SELECT id FROM admin_sessions WHERE token = ?"
    )
    .bind(token)
    .first();

  return !!session;
}


// =============================================================
// Email sending - Resend
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
        "سرویس ایمیل تنظیم نشده است (RESEND_API_KEY وجود ندارد)",
    };
  }

  const fromEmail =
    env.RESEND_FROM_EMAIL ||
    "onboarding@resend.dev";

  try {
    const res = await fetch(
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

    if (!res.ok) {
      const errText = await res.text();

      return {
        ok: false,
        error: errText,
      };
    }

    return {
      ok: true,
    };

  } catch (err) {
    return {
      ok: false,
      error:
        err?.message ||
        String(err),
    };
  }
}


// =============================================================
// Signup
// =============================================================

async function handleSignup(request, env) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json(
      {
        error:
          "بدنه درخواست نامعتبر است",
      },
      400
    );
  }

  const {
    name,
    email,
    password,
  } = body;

  if (!email || !password) {
    return json(
      {
        error:
          "ایمیل و رمز عبور الزامی است",
      },
      400
    );
  }

  if (!isValidEmail(email)) {
    return json(
      {
        error:
          "فرمت ایمیل نامعتبر است",
      },
      400
    );
  }

  if (password.length < 6) {
    return json(
      {
        error:
          "رمز عبور باید حداقل ۶ کاراکتر باشد",
      },
      400
    );
  }

  const normalizedEmail =
    email.trim().toLowerCase();

  const existing =
    await env.DB
      .prepare(
        "SELECT id FROM users WHERE email = ?"
      )
      .bind(normalizedEmail)
      .first();

  if (existing) {
    return json(
      {
        error:
          "این ایمیل قبلاً ثبت‌نام کرده است",
      },
      409
    );
  }

  const passwordHash =
    await hashPassword(password);

  const userId = uuid();

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
      name || "",
      normalizedEmail,
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
    user: {
      id: userId,
      name: name || "",
      email: normalizedEmail,
      balance: 0,
    },
    token,
  });
}


// =============================================================
// Login
// =============================================================

async function handleLogin(request, env) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json(
      {
        error:
          "بدنه درخواست نامعتبر است",
      },
      400
    );
  }

  const {
    email,
    password,
  } = body;

  if (!email || !password) {
    return json(
      {
        error:
          "ایمیل و رمز عبور الزامی است",
      },
      400
    );
  }

  const normalizedEmail =
    email.trim().toLowerCase();

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
      .bind(normalizedEmail)
      .first();

  const genericError = {
    error:
      "ایمیل یا رمز عبور اشتباه است",
  };

  if (!user) {
    return json(
      genericError,
      401
    );
  }

  const isValid =
    await verifyPassword(
      password,
      user.password_hash
    );

  if (!isValid) {
    if (
      !user.password_hash.startsWith(
        "pbkdf2:"
      )
    ) {
      return json(
        {
          error:
            "رمز عبور این حساب نیاز به بازیابی دارد (فرمت قدیمی)",
        },
        401
      );
    }

    return json(
      genericError,
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
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      balance: user.balance,
    },
    token,
  });
}


// =============================================================
// Me
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
          "نشست نامعتبر یا منقضی شده است",
      },
      401
    );
  }

  return json({
    user,
  });
}


// =============================================================
// Forgot Password
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
          "بدنه درخواست نامعتبر است",
      },
      400
    );
  }

  const { email } = body;

  if (
    !email ||
    !isValidEmail(email)
  ) {
    return json(
      {
        error:
          "ایمیل معتبر وارد کنید",
      },
      400
    );
  }

  const normalizedEmail =
    email.trim().toLowerCase();

  const user =
    await env.DB
      .prepare(
        "SELECT id FROM users WHERE email = ?"
      )
      .bind(normalizedEmail)
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
      normalizedEmail,
      "کد بازیابی رمز عبور",
      `
      <div
        dir="rtl"
        style="font-family:Tahoma,sans-serif;"
      >
        <p>
          کد بازیابی رمز عبور شما:
        </p>

        <h2
          style="letter-spacing:4px;"
        >
          ${code}
        </h2>

        <p>
          این کد تا ۱۵ دقیقه دیگر معتبر است.
        </p>
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
}


// =============================================================
// Reset Password
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
          "بدنه درخواست نامعتبر است",
      },
      400
    );
  }

  const {
    email,
    code,
    newPassword,
  } = body;

  if (
    !email ||
    !code ||
    !newPassword
  ) {
    return json(
      {
        error:
          "ایمیل، کد و رمز جدید الزامی است",
      },
      400
    );
  }

  if (
    newPassword.length < 6
  ) {
    return json(
      {
        error:
          "رمز عبور باید حداقل ۶ کاراکتر باشد",
      },
      400
    );
  }

  const normalizedEmail =
    email.trim().toLowerCase();

  const user =
    await env.DB
      .prepare(
        "SELECT id FROM users WHERE email = ?"
      )
      .bind(normalizedEmail)
      .first();

  if (!user) {
    return json(
      {
        error:
          "کد نامعتبر یا منقضی شده است",
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
          "کد نامعتبر یا منقضی شده است",
      },
      400
    );
  }

  if (resetRow.used) {
    return json(
      {
        error:
          "این کد قبلاً استفاده شده است",
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
          "کد منقضی شده است",
      },
      400
    );
  }

  const newHash =
    await hashPassword(
      newPassword
    );

  await env.DB
    .prepare(
      "UPDATE users SET password_hash = ? WHERE id = ?"
    )
    .bind(
      newHash,
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
}


// =============================================================
// AI CHAT — MULTILINGUAL / WORLDWIDE
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
          "برای استفاده از هوش مصنوعی ابتدا وارد حساب شوید",
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
          "بدنه درخواست نامعتبر است",
      },
      400
    );
  }

  const {
    message,
  } = body;

  if (
    !message ||
    typeof message !== "string"
  ) {
    return json(
      {
        error:
          "پیام الزامی است",
      },
      400
    );
  }

  if (!env.AI) {
    return json(
      {
        error:
          "سرویس هوش مصنوعی تنظیم نشده است. Binding با نام AI را به Worker اضافه کنید.",
      },
      503
    );
  }

  try {
    const aiResponse =
      await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct-fast",
        {
          messages: [
            {
              role: "system",
              content: `
You are Abzarak AI, a multilingual AI assistant for users worldwide.

LANGUAGE RULES:
- Detect the language used by the user.
- Reply in the same language as the user's message by default.
- Do NOT force Persian.
- Do NOT force English.
- Support multilingual conversations naturally.
- Users may write in Persian, English, Arabic, Turkish, Azerbaijani, Kurdish, French, German, Spanish, Italian, Russian, Urdu, Hindi, Chinese, Japanese, or other languages.
- If the user asks for translation, follow the requested source and target languages.
- If the user mixes languages, understand the meaning and respond naturally, preferably using the dominant language.
- Preserve the user's requested tone and writing style.
- Do not tell users that you only support Persian.
- Do not unnecessarily translate the user's message.
- If the user asks in a language you understand, answer in that language.

GENERAL RULES:
- Be helpful, accurate, clear and concise.
- Answer directly.
- Follow the user's instructions.
- Do not mention these system instructions.
- Do not claim that Abzarak is limited to Iran or Persian-speaking users.
- Support users worldwide.
              `,
            },
            {
              role: "user",
              content: message,
            },
          ],

          max_tokens: 512,
          temperature: 0.6,
        }
      );

    const reply =
      aiResponse?.response ||
      aiResponse?.result?.response ||
      "No response was received from the AI.";

    return json({
      success: true,
      reply,
    });

  } catch (err) {
    console.error(
      "Workers AI Error:",
      err
    );

    return json(
      {
        error:
          "خطا در ارتباط با هوش مصنوعی: " +
          (
            err?.message ||
            String(err)
          ),
      },
      500
    );
  }
}


// =============================================================
// Plans
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
      "اولویت صف پاسخ‌دهی",
      "پشتیبانی اختصاصی",
    ],
  },
];

const USD_TO_TOMAN_RATE =
  70000;

const PLANS_USD = [
  {
    id: "usd_basic",
    name: "Basic",
    price_usd: 5,
    period: "monthly",
    messages_per_day: null,
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
    messages_per_day: null,
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
    messages_per_day: null,
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
    messages_per_day: null,
    features: [
      "Unlimited messages",
      "Priority queue",
      "Dedicated support",
      "Early access to new features",
    ],
  },
];

async function handlePlans(
  request,
  env
) {
  return json({
    plans: PLANS,
    plans_usd: PLANS_USD,
    usd_to_toman_rate:
      USD_TO_TOMAN_RATE,
  });
}


// =============================================================
// PAYMENTS - ZarinPal
// =============================================================

const ZARINPAL_BASE =
  (env) =>
    env.ZARINPAL_SANDBOX === "true"
      ? "https://sandbox.zarinpal.com"
      : "https://api.zarinpal.com";


// =============================================================
// Create Payment
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
          "ابتدا وارد حساب شوید",
      },
      401
    );
  }

  if (
    !env.ZARINPAL_MERCHANT_ID
  ) {
    return json(
      {
        error:
          "درگاه پرداخت هنوز تنظیم نشده است. ZARINPAL_MERCHANT_ID را اضافه کنید.",
      },
      503
    );
  }

  let body;

  try {
    body =
      await request.json();
  } catch {
    return json(
      {
        error:
          "بدنه درخواست نامعتبر است",
      },
      400
    );
  }

  const {
    planId,
  } = body;

  let plan =
    PLANS.find(
      (p) =>
        p.id === planId
    );

  let planCurrency = "irt";

  let priceToman =
    plan
      ? plan.price_toman
      : null;

  let planName =
    plan
      ? plan.name
      : null;

  if (!plan) {
    const usdPlan =
      PLANS_USD.find(
        (p) =>
          p.id === planId
      );

    if (usdPlan) {
      plan =
        usdPlan;

      planCurrency =
        "usd";

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
          "پلن نامعتبر است",
      },
      400
    );
  }

  const baseUrl =
    env.PUBLIC_BASE_URL ||
    new URL(request.url).origin;

  const paymentId =
    uuid();

  const amountRial =
    priceToman * 10;

  try {
    const res =
      await fetch(
        `${ZARINPAL_BASE(env)}/pg/v4/payment/request.json`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              merchant_id:
                env.ZARINPAL_MERCHANT_ID,

              amount:
                amountRial,

              callback_url:
                `${baseUrl}/api/payment/verify?pid=${paymentId}`,

              description:
                `اشتراک ${planName}`,

              metadata: {
                email:
                  user.email,
              },
            }),
        }
      );

    const data =
      await res.json();

    if (
      data?.errors &&
      Object.keys(
        data.errors
      ).length > 0
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
            "پاسخ نامعتبر از زرین‌پال",
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
         VALUES
         (
           ?,
           ?,
           ?,
           'irt',
           ?,
           'pending',
           ?,
           ?
         )`
      )
      .bind(
        paymentId,
        user.id,
        plan.id,
        amountRial,
        authority,
        new Date().toISOString()
      )
      .run();

    if (
      planCurrency ===
      "usd"
    ) {
      try {
        await env.DB
          .prepare(
            "UPDATE payments SET plan_currency = 'usd' WHERE id = ?"
          )
          .bind(
            paymentId
          )
          .run();
      } catch (e) {
        console.error(
          "plan_currency column missing?",
          e?.message ||
          e
        );
      }
    }

    const sandboxPrefix =
      env.ZARINPAL_SANDBOX ===
      "true"
        ? "sandbox"
        : "www";

    const paymentUrl =
      `https://${sandboxPrefix}.zarinpal.com/pg/StartPay/${authority}`;

    return json({
      success: true,
      payment_url:
        paymentUrl,
    });

  } catch (err) {
    return json(
      {
        error:
          "خطا در ساخت پرداخت: " +
          (
            err?.message ||
            String(err)
          ),
      },
      500
    );
  }
}


// =============================================================
// Verify Payment
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
    env.PUBLIC_BASE_URL ||
    url.origin;

  if (
    !authority ||
    !paymentId
  ) {
    return Response.redirect(
      `${baseUrl}/?payment=error&reason=missing_params`,
      302
    );
  }

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
        "UPDATE payments SET status = 'cancelled' WHERE id = ?"
      )
      .bind(
        paymentId
      )
      .run();

    return Response.redirect(
      `${baseUrl}/?payment=cancel`,
      302
    );
  }

  try {
    const verifyRes =
      await fetch(
        `${ZARINPAL_BASE(env)}/pg/v4/payment/verify.json`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              merchant_id:
                env.ZARINPAL_MERCHANT_ID,

              amount:
                payment.amount,

              authority:
                authority,
            }),
        }
      );

    const verifyData =
      await verifyRes.json();

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
             VALUES
             (
               ?,
               ?,
               ?,
               'active',
               ?
             )`
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
        `${baseUrl}/?payment=success&ref=${refId}`,
        302
      );

    } else {
      await env.DB
        .prepare(
          "UPDATE payments SET status = 'failed' WHERE id = ?"
        )
        .bind(
          paymentId
        )
        .run();

      return Response.redirect(
        `${baseUrl}/?payment=failed`,
        302
      );
    }

  } catch (err) {
    console.error(
      "ZarinPal verify error:",
      err
    );

    const reason =
      encodeURIComponent(
        (
          err?.message ||
          String(err)
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
    body =
      await request.json();
  } catch {
    return json(
      {
        error:
          "بدنه درخواست نامعتبر است",
      },
      400
    );
  }

  const {
    password,
  } = body;

  if (!env.ADMIN_PASSWORD) {
    return json(
      {
        error:
          "رمز مدیریت تنظیم نشده است",
      },
      503
    );
  }

  if (
    password !==
    env.ADMIN_PASSWORD
  ) {
    return json(
      {
        error:
          "رمز اشتباه است",
      },
      401
    );
  }

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
}


// =============================================================
// ADMIN USERS
// =============================================================

async function handleAdminUsers(
  request,
  env
) {
  const isAdmin =
    await requireAdmin(
      request,
      env
    );

  if (!isAdmin) {
    return json(
      {
        error:
          "دسترسی غیرمجاز",
      },
      401
    );
  }

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
    users: results,
  });
}


// =============================================================
// ADMIN PAYMENTS
// =============================================================

async function handleAdminPayments(
  request,
  env
) {
  const isAdmin =
    await requireAdmin(
      request,
      env
    );

  if (!isAdmin) {
    return json(
      {
        error:
          "دسترسی غیرمجاز",
      },
      401
    );
  }

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

  const paymentsToman =
    results.map(
      (p) => ({
        ...p,

        amount_toman:
          p.currency === "irt"
            ? Math.round(
                p.amount / 10
              )
            : p.amount,
      })
    );

  return json({
    payments:
      paymentsToman,
  });
}


// =============================================================
// ADMIN ADJUST BALANCE
// =============================================================

async function handleAdminAdjustBalance(
  request,
  env
) {
  const isAdmin =
    await requireAdmin(
      request,
      env
    );

  if (!isAdmin) {
    return json(
      {
        error:
          "دسترسی غیرمجاز",
      },
      401
    );
  }

  let body;

  try {
    body =
      await request.json();
  } catch {
    return json(
      {
        error:
          "بدنه درخواست نامعتبر است",
      },
      400
    );
  }

  const {
    userId,
    amount,
    reason,
  } = body;

  if (
    !userId ||
    typeof amount !==
      "number" ||
    amount === 0
  ) {
    return json(
      {
        error:
          "شناسه کاربر و مبلغ (غیر صفر، به تومان) الزامی است",
      },
      400
    );
  }

  const user =
    await env.DB
      .prepare(
        "SELECT id, balance FROM users WHERE id = ?"
      )
      .bind(userId)
      .first();

  if (!user) {
    return json(
      {
        error:
          "کاربر یافت نشد",
      },
      404
    );
  }

  const newBalance =
    (user.balance || 0) +
    amount;

  if (
    newBalance < 0
  ) {
    return json(
      {
        error:
          "موجودی نمی‌تواند منفی شود",
      },
      400
    );
  }

  await env.DB
    .prepare(
      "UPDATE users SET balance = ? WHERE id = ?"
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
         (
           id,
           user_id,
           amount,
           reason,
           created_at
         )
         VALUES (?, ?, ?, ?, ?)`
      )
      .bind(
        uuid(),
        userId,
        amount,
        reason || "",
        new Date().toISOString()
      )
      .run();

  } catch (e) {
    console.error(
      "balance_adjustments table missing?",
      e?.message ||
      e
    );
  }

  return json({
    success: true,
    user_id:
      userId,
    new_balance:
      newBalance,
  });
}


// =============================================================
// HOMEPAGE
// =============================================================

function renderHomepage() {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
>

<meta
  name="enamad"
  content="36032134"
/>

<!-- ========================= SEO ========================= -->

<title>
ابزارک | دستیار هوش مصنوعی چندزبانه برای کاربران سراسر جهان
</title>

<meta
  name="description"
  content="ابزارک یک دستیار هوش مصنوعی چندزبانه برای کاربران سراسر جهان است. گفتگو، پاسخ به سوالات، ترجمه، تولید محتوا و کمک در کارهای روزمره با پشتیبانی از زبان‌های مختلف."
>

<meta
  name="keywords"
  content="ابزارک, AI Assistant, multilingual AI, دستیار هوش مصنوعی, هوش مصنوعی چندزبانه, AI chatbot, multilingual chatbot, artificial intelligence"
>

<meta
  name="author"
  content="ابزارک"
>

<meta
  name="robots"
  content="index, follow"
>

<link
  rel="canonical"
  href="https://abzarakai.ir/"
>

<!-- Open Graph -->

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
  content="ابزارک | دستیار هوش مصنوعی چندزبانه"
>

<meta
  property="og:description"
  content="ابزارک یک دستیار هوش مصنوعی چندزبانه برای کاربران سراسر جهان است."
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

<!-- Twitter -->

<meta
  name="twitter:card"
  content="summary"
>

<meta
  name="twitter:title"
  content="ابزارک | Multilingual AI Assistant"
>

<meta
  name="twitter:description"
  content="A multilingual AI assistant designed for users worldwide."
>

<!-- ====================================================== -->


<style>

* {
  box-sizing: border-box;
}

body {
  font-family:
    Tahoma,
    "Segoe UI",
    Arial,
    sans-serif;

  margin: 0;

  background:
    #f4f6fb;

  color:
    #1a1a2e;
}

header {
  background:
    #12163a;

  color:
    white;

  padding:
    20px;

  display:
    flex;

  justify-content:
    space-between;

  align-items:
    flex-start;

  gap:
    12px;
}

header h1 {
  margin:
    0;

  font-size:
    1.4rem;
}

header p {
  margin:
    6px 0 0;

  opacity:
    0.8;

  font-size:
    0.85rem;
}

.lang-switch {
  background:
    rgba(255,255,255,0.12);

  border:
    1px solid
    rgba(255,255,255,0.3);

  color:
    white;

  border-radius:
    8px;

  padding:
    6px 12px;

  font-size:
    0.8rem;

  cursor:
    pointer;

  white-space:
    nowrap;
}

nav {
  display:
    flex;

  gap:
    10px;

  padding:
    16px;

  flex-wrap:
    wrap;

  background:
    white;
}

nav button {
  background:
    #2952e3;

  color:
    white;

  border:
    none;

  border-radius:
    10px;

  padding:
    12px 18px;

  font-size:
    0.95rem;

  cursor:
    pointer;
}

main {
  padding:
    20px;

  max-width:
    480px;

  margin:
    0 auto;
}

.card {
  background:
    white;

  border-radius:
    16px;

  padding:
    24px;

  margin-bottom:
    16px;

  box-shadow:
    0 2px 8px
    rgba(0,0,0,0.06);
}

.card h2 {
  margin-top:
    0;

  text-align:
    start;
}

input,
select {
  width:
    100%;

  padding:
    12px;

  margin:
    8px 0;

  border-radius:
    10px;

  border:
    1px solid
    #dcdfe8;

  background:
    #f0f2fa;

  font-size:
    1rem;
}

.actions {
  display:
    flex;

  gap:
    10px;

  justify-content:
    flex-end;

  margin-top:
    10px;

  flex-wrap:
    wrap;
}

.actions button {
  padding:
    10px 20px;

  border-radius:
    10px;

  border:
    none;

  cursor:
    pointer;

  font-size:
    0.95rem;
}

.btn-primary {
  background:
    #2952e3;

  color:
    white;
}

.btn-secondary {
  background:
    #6b7280;

  color:
    white;
}

.link-btn {
  background:
    none;

  color:
    #2952e3;

  text-decoration:
    underline;

  padding:
    4px;

  font-size:
    0.85rem;
}

.msg {
  padding:
    12px;

  border-radius:
    10px;

  margin-top:
    10px;
}

.msg.error {
  background:
    #fdeaea;

  color:
    #b91c1c;
}

.msg.success {
  background:
    #eafaf0;

  color:
    #15803d;
}

.hidden {
  display:
    none;
}

.chat-box {
  max-height:
    320px;

  overflow-y:
    auto;

  display:
    flex;

  flex-direction:
    column;

  gap:
    8px;

  margin-bottom:
    12px;
}

.bubble {
  padding:
    10px 14px;

  border-radius:
    12px;

  max-width:
    85%;

  white-space:
    pre-wrap;

  word-break:
    break-word;
}

.bubble.user {
  background:
    #2952e3;

  color:
    white;

  align-self:
    flex-start;
}

.bubble.ai {
  background:
    #eef0f7;

  align-self:
    flex-end;
}

table {
  width:
    100%;

  border-collapse:
    collapse;

  font-size:
    0.85rem;
}

table th,
table td {
  border:
    1px solid
    #e5e7eb;

  padding:
    6px;

  text-align:
    start;
}

table th {
  background:
    #f0f2fa;
}

.plan-card {
  border:
    1px solid
    #e5e7eb;

  border-radius:
    12px;

  padding:
    14px;

  margin-bottom:
    10px;
}

.plan-price {
  color:
    #2952e3;

  font-size:
    1.1rem;
}

.note {
  font-size:
    0.85rem;

  color:
    #555;
}

.currency-toggle {
  display:
    flex;

  gap:
    8px;

  margin-bottom:
    14px;
}

.currency-toggle button {
  flex:
    1;

  padding:
    10px;

  border-radius:
    10px;

  border:
    1px solid
    #dcdfe8;

  background:
    #f0f2fa;

  cursor:
    pointer;

  font-size:
    0.9rem;
}

.currency-toggle button.active {
  background:
    #2952e3;

  color:
    white;

  border-color:
    #2952e3;
}

.seo-content {
  line-height:
    1.9;
}

.seo-content h2 {
  font-size:
    1.15rem;

  margin-top:
    0;
}

.seo-content h3 {
  font-size:
    1rem;

  margin:
    16px 0 6px;
}

.seo-content ul {
  margin:
    6px 0;

  padding-inline-start:
    20px;
}

.seo-content p {
  margin:
    8px 0;

  color:
    #333;
}

</style>

</head>


<body>


<header>

  <div>

    <h1
      data-i18n="app_title"
    >
      🤖 دستیار هوش مصنوعی
    </h1>

    <p
      data-i18n="app_subtitle"
    >
      دستیار هوشمند • حساب کاربری
    </p>

  </div>

  <button
    class="lang-switch"
    id="lang-switch-btn"
    onclick="toggleLang()"
  >
    English
  </button>

</header>


<nav>

  <button
    onclick="showView('account')"
    data-i18n="nav_account"
  >
    🏠 حساب
  </button>

  <button
    onclick="showView('ai')"
    data-i18n="nav_ai"
  >
    🤖 هوش مصنوعی
  </button>

  <button
    onclick="showView('plans')"
    data-i18n="nav_plans"
  >
    💰 پلن‌ها
  </button>

  <button
    onclick="showView('admin-login')"
    data-i18n="nav_admin"
  >
    🛠️ مدیریت
  </button>

</nav>


<main>


<!-- LOGIN -->

<div
  id="view-login"
  class="card"
>

  <h2
    data-i18n="login_title"
  >
    🔑 ورود به حساب
  </h2>

  <input
    id="login-email"
    type="email"
    data-i18n-placeholder="email_placeholder"
    placeholder="ایمیل"
  >

  <input
    id="login-password"
    type="password"
    data-i18n-placeholder="password_placeholder"
    placeholder="رمز عبور"
  >

  <div class="actions">

    <button
      class="link-btn"
      onclick="showView('forgot')"
      data-i18n="forgot_link"
    >
      فراموشی رمز عبور؟
    </button>

  </div>

  <div class="actions">

    <button
      class="btn-secondary"
      onclick="showView('signup')"
      data-i18n="signup_link"
    >
      ثبت‌نام
    </button>

    <button
      class="btn-primary"
      onclick="doLogin()"
      data-i18n="login_button"
    >
      ورود
    </button>

  </div>

  <div id="login-msg"></div>

</div>


<!-- SIGNUP -->

<div
  id="view-signup"
  class="card hidden"
>

  <h2
    data-i18n="signup_title"
  >
    📝 ثبت‌نام
  </h2>

  <input
    id="signup-name"
    type="text"
    data-i18n-placeholder="name_placeholder"
    placeholder="نام"
  >

  <input
    id="signup-email"
    type="email"
    data-i18n-placeholder="email_placeholder"
    placeholder="ایمیل"
  >

  <input
    id="signup-password"
    type="password"
    data-i18n-placeholder="signup_password_placeholder"
    placeholder="رمز عبور (حداقل ۶ کاراکتر)"
  >

  <div class="actions">

    <button
      class="btn-secondary"
      onclick="showView('login')"
      data-i18n="back_button"
    >
      بازگشت
    </button>

    <button
      class="btn-primary"
      onclick="doSignup()"
      data-i18n="signup_button"
    >
      ثبت‌نام
    </button>

  </div>

  <div id="signup-msg"></div>

</div>


<!-- FORGOT -->

<div
  id="view-forgot"
  class="card hidden"
>

  <h2
    data-i18n="forgot_title"
  >
    🔐 فراموشی رمز عبور
  </h2>

  <p
    class="note"
    data-i18n="forgot_intro"
  >
    ایمیل خود را وارد کنید تا کد بازیابی برایتان ارسال شود.
  </p>

  <input
    id="forgot-email"
    type="email"
    data-i18n-placeholder="email_placeholder"
    placeholder="ایمیل"
  >

  <div class="actions">

    <button
      class="btn-secondary"
      onclick="showView('login')"
      data-i18n="back_button"
    >
      بازگشت
    </button>

    <button
      class="btn-primary"
      onclick="doForgotPassword()"
      data-i18n="send_code_button"
    >
      ارسال کد
    </button>

  </div>

  <div id="forgot-msg"></div>

  <hr
    style="margin:16px 0;border:none;border-top:1px solid #eee;"
  >

  <p
    class="note"
    data-i18n="reset_intro"
  >
    کد دریافتی و رمز جدید را وارد کنید:
  </p>

  <input
    id="reset-code"
    type="text"
    data-i18n-placeholder="code_placeholder"
    placeholder="کد ۶ رقمی"
  >

  <input
    id="reset-password"
    type="password"
    data-i18n-placeholder="new_password_placeholder"
    placeholder="رمز عبور جدید"
  >

  <div class="actions">

    <button
      class="btn-primary"
      onclick="doResetPassword()"
      data-i18n="reset_button"
    >
      تغییر رمز عبور
    </button>

  </div>

  <div id="reset-msg"></div>

</div>


<!-- ACCOUNT -->

<div
  id="view-account"
  class="card hidden"
>

  <h2
    data-i18n="account_title"
  >
    🏠 حساب من
  </h2>

  <div
    id="account-info"
    data-i18n="loading"
  >
    در حال بارگذاری...
  </div>

  <div class="actions">

    <button
      class="btn-secondary"
      onclick="logout()"
      data-i18n="logout_button"
    >
      خروج
    </button>

  </div>

</div>


<!-- AI -->

<div
  id="view-ai"
  class="card hidden"
>

  <h2
    data-i18n="ai_title"
  >
    🤖 گفتگو با هوش مصنوعی
  </h2>

  <div
    class="chat-box"
    id="chat-box"
  ></div>

  <input
    id="ai-input"
    type="text"
    data-i18n-placeholder="ai_input_placeholder"
    placeholder="پیام خود را بنویسید..."
    onkeydown="if(event.key === 'Enter') sendAiMessage()"
  >

  <div class="actions">

    <button
      class="btn-primary"
      onclick="sendAiMessage()"
      data-i18n="send_button"
    >
      ارسال
    </button>

  </div>

  <div id="ai-msg"></div>

</div>


<!-- PLANS -->

<div
  id="view-plans"
  class="card hidden"
>

  <h2
    data-i18n="plans_title"
  >
    💰 پلن‌ها
  </h2>

  <div class="currency-toggle">

    <button
      id="currency-btn-irt"
      class="active"
      onclick="setPlanCurrency('irt')"
      data-i18n="currency_toman"
    >
      تومان (ایران)
    </button>

    <button
      id="currency-btn-usd"
      onclick="setPlanCurrency('usd')"
      data-i18n="currency_usd"
    >
      USD (Worldwide)
    </button>

  </div>

  <div
    id="plans-list"
    data-i18n="loading"
  >
    در حال بارگذاری...
  </div>

</div>


<!-- ADMIN LOGIN -->

<div
  id="view-admin-login"
  class="card hidden"
>

  <h2
    data-i18n="admin_login_title"
  >
    🛠️ ورود به پنل مدیریت
  </h2>

  <input
    id="admin-password"
    type="password"
    data-i18n-placeholder="admin_password_placeholder"
    placeholder="رمز مدیریت"
  >

  <div class="actions">

    <button
      class="btn-secondary"
      onclick="showView('login')"
      data-i18n="back_button"
    >
      بازگشت
    </button>

    <button
      class="btn-primary"
      onclick="doAdminLogin()"
      data-i18n="login_button"
    >
      ورود
    </button>

  </div>

  <div id="admin-login-msg"></div>

</div>


<!-- ADMIN PANEL -->

<div
  id="view-admin-panel"
  class="card hidden"
>

  <h2
    data-i18n="admin_panel_title"
  >
    🛠️ پنل مدیریت
  </h2>

  <div class="actions">

    <button
      class="btn-secondary"
      onclick="loadAdminUsers()"
      data-i18n="admin_users_button"
    >
      کاربران
    </button>

    <button
      class="btn-secondary"
      onclick="loadAdminPayments()"
      data-i18n="admin_payments_button"
    >
      تراکنش‌ها
    </button>

    <button
      class="btn-secondary"
      onclick="showAdjustBalanceForm()"
      data-i18n="admin_adjust_balance_button"
    >
      تعدیل موجودی
    </button>

    <button
      class="btn-secondary"
      onclick="adminLogout()"
      data-i18n="admin_logout_button"
    >
      خروج از مدیریت
    </button>

  </div>

  <div
    id="admin-content"
    style="margin-top:14px;overflow-x:auto;"
  ></div>

</div>


<!-- SEO CONTENT -->

<div
  class="card seo-content"
  id="seo-content"
>

  <h2
    data-i18n="seo_h1"
  >
    ابزارک، دستیار هوش مصنوعی چندزبانه شما
  </h2>

  <p
    data-i18n="seo_intro_p1"
  >
    ابزارک یک دستیار هوش مصنوعی چندزبانه برای کاربران سراسر جهان است که برای گفتگو، پاسخ‌گویی، ترجمه، تولید محتوا و کمک در کارهای روزمره طراحی شده است.
  </p>

  <h3
    data-i18n="seo_h2_about"
  >
    درباره دستیار هوش مصنوعی ابزارک
  </h3>

  <p
    data-i18n="seo_about_p1"
  >
    ابزارک می‌تواند زبان پیام کاربر را تشخیص دهد و به همان زبان پاسخ دهد. هدف ابزارک فراهم کردن دسترسی ساده و کاربردی به هوش مصنوعی برای کاربران سراسر جهان است.
  </p>

  <h3
    data-i18n="seo_h2_features"
  >
    امکانات ابزارک
  </h3>

  <ul>

    <li
      data-i18n="seo_feature_1"
    >
      گفتگوی متنی با هوش مصنوعی به زبان‌های مختلف
    </li>

    <li
      data-i18n="seo_feature_2"
    >
      پاسخ‌گویی سریع و دقیق به سوالات روزمره
    </li>

    <li
      data-i18n="seo_feature_3"
    >
      حساب کاربری امن با امکان بازیابی رمز عبور
    </li>

    <li
      data-i18n="seo_feature_4"
    >
      پلن‌های رایگان و اشتراکی متناسب با نیاز شما
    </li>

    <li
      data-i18n="seo_feature_5"
    >
      پشتیبانی از کاربران سراسر جهان و زبان‌های مختلف
    </li>

  </ul>

  <h3
    data-i18n="seo_h2_plans"
  >
    پلن‌های اشتراک
  </h3>

  <p
    data-i18n="seo_plans_p1"
  >
    ابزارک یک پلن رایگان با محدودیت پیام روزانه و پلن‌های اشتراکی برای کاربران مختلف ارائه می‌دهد. سرویس هوش مصنوعی برای کاربران سراسر جهان و زبان‌های مختلف طراحی شده است.
  </p>

</div>


</main>


<script>


// =============================================================
// i18n
// =============================================================

const translations = {

  fa: {

    page_title:
      'دستیار هوشمند 🤖',

    app_title:
      '🤖 دستیار هوش مصنوعی',

    app_subtitle:
      'دستیار هوشمند • حساب کاربری',

    nav_account:
      '🏠 حساب',

    nav_ai:
      '🤖 هوش مصنوعی',

    nav_plans:
      '💰 پلن‌ها',

    nav_admin:
      '🛠️ مدیریت',

    login_title:
      '🔑 ورود به حساب',

    email_placeholder:
      'ایمیل',

    password_placeholder:
      'رمز عبور',

    forgot_link:
      'فراموشی رمز عبور؟',

    signup_link:
      'ثبت‌نام',

    login_button:
      'ورود',

    signup_title:
      '📝 ثبت‌نام',

    name_placeholder:
      'نام',

    signup_password_placeholder:
      'رمز عبور (حداقل ۶ کاراکتر)',

    back_button:
      'بازگشت',

    signup_button:
      'ثبت‌نام',

    forgot_title:
      '🔐 فراموشی رمز عبور',

    forgot_intro:
      'ایمیل خود را وارد کنید تا کد بازیابی برایتان ارسال شود.',

    send_code_button:
      'ارسال کد',

    reset_intro:
      'کد دریافتی و رمز جدید را وارد کنید:',

    code_placeholder:
      'کد ۶ رقمی',

    new_password_placeholder:
      'رمز عبور جدید',

    reset_button:
      'تغییر رمز عبور',

    account_title:
      '🏠 حساب من',

    loading:
      'در حال بارگذاری...',

    logout_button:
      'خروج',

    ai_title:
      '🤖 گفتگو با هوش مصنوعی',

    ai_input_placeholder:
      'پیام خود را بنویسید...',

    send_button:
      'ارسال',

    sending_button:
      'در حال پاسخ...',

    plans_title:
      '💰 پلن‌ها',

    currency_toman:
      'تومان (ایران)',

    currency_usd:
      'دلار (جهانی)',

    admin_login_title:
      '🛠️ ورود به پنل مدیریت',

    admin_password_placeholder:
      'رمز مدیریت',

    admin_panel_title:
      '🛠️ پنل مدیریت',

    admin_users_button:
      'کاربران',

    admin_payments_button:
      'تراکنش‌ها',

    admin_adjust_balance_button:
      'تعدیل موجودی',

    admin_logout_button:
      'خروج از مدیریت',

    label_name:
      'نام',

    label_email:
      'ایمیل',

    label_balance:
      'موجودی',

    label_signup_date:
      'تاریخ ثبت‌نام',

    label_plan:
      'پلن',

    label_amount_toman:
      'مبلغ (تومان)',

    label_status:
      'وضعیت',

    label_date:
      'تاریخ',

    monthly_suffix:
      'تومان / ماهانه',

    monthly_suffix_usd:
      '$ / ماهانه',

    free_label:
      'رایگان',

    buy_plan_button:
      'خرید این پلن',

    unknown_error:
      'خطای ناشناخته (کد {status})',

    technical_error:
      'خطای فنی: {message}',

    code_sent:
      'کد ارسال شد.',

    password_changed:
      'رمز عبور با موفقیت تغییر کرد.',

    error_fetching_account:
      'خطا در دریافت حساب: {message}',

    error_fetching_plans:
      'خطا در دریافت پلن‌ها: {message}',

    error_creating_payment:
      'خطا در ساخت پرداخت',

    no_reply:
      'پاسخی دریافت نشد.',

    generic_error:
      'خطا',

    adjust_balance_title:
      'تعدیل موجودی کاربر',

    adjust_balance_user_id_placeholder:
      'شناسه کاربر (User ID)',

    adjust_balance_amount_placeholder:
      'مبلغ به تومان (منفی برای کسر)',

    adjust_balance_reason_placeholder:
      'دلیل (اختیاری)',

    adjust_balance_submit:
      'اعمال تغییر',

    adjust_balance_success:
      'موجودی با موفقیت به‌روزرسانی شد. موجودی جدید: {balance}',

    adjust_balance_hint:
      'شناسه کاربر را از جدول «کاربران» کپی کنید.',

    seo_h1:
      'ابزارک، دستیار هوش مصنوعی چندزبانه شما',

    seo_intro_p1:
      'ابزارک یک دستیار هوش مصنوعی چندزبانه برای کاربران سراسر جهان است که برای گفتگو، پاسخ‌گویی، ترجمه، تولید محتوا و کمک در کارهای روزمره طراحی شده است.',

    seo_h2_about:
      'درباره دستیار هوش مصنوعی ابزارک',

    seo_about_p1:
      'ابزارک می‌تواند زبان پیام کاربر را تشخیص دهد و به همان زبان پاسخ دهد. هدف ابزارک فراهم کردن دسترسی ساده و کاربردی به هوش مصنوعی برای کاربران سراسر جهان است.',

    seo_h2_features:
      'امکانات ابزارک',

    seo_feature_1:
      'گفتگوی متنی با هوش مصنوعی به زبان‌های مختلف',

    seo_feature_2:
      'پاسخ‌گویی سریع و دقیق به سوالات روزمره',

    seo_feature_3:
      'حساب کاربری امن با امکان بازیابی رمز عبور',

    seo_feature_4:
      'پلن‌های رایگان و اشتراکی متناسب با نیاز شما',

    seo_feature_5:
      'پشتیبانی از کاربران سراسر جهان و زبان‌های مختلف',

    seo_h2_plans:
      'پلن‌های اشتراک',

    seo_plans_p1:
      'ابزارک یک پلن رایگان با محدودیت پیام روزانه و پلن‌های اشتراکی برای کاربران مختلف ارائه می‌دهد. سرویس هوش مصنوعی برای کاربران سراسر جهان و زبان‌های مختلف طراحی شده است.'

  },


  en: {

    page_title:
      'AI Assistant 🤖',

    app_title:
      '🤖 AI Assistant',

    app_subtitle:
      'Smart assistant • Your account',

    nav_account:
      '🏠 Account',

    nav_ai:
      '🤖 AI Chat',

    nav_plans:
      '💰 Plans',

    nav_admin:
      '🛠️ Admin',

    login_title:
      '🔑 Sign In',

    email_placeholder:
      'Email',

    password_placeholder:
      'Password',

    forgot_link:
      'Forgot password?',

    signup_link:
      'Sign Up',

    login_button:
      'Sign In',

    signup_title:
      '📝 Sign Up',

    name_placeholder:
      'Name',

    signup_password_placeholder:
      'Password (min. 6 characters)',

    back_button:
      'Back',

    signup_button:
      'Sign Up',

    forgot_title:
      '🔐 Forgot Password',

    forgot_intro:
      'Enter your email to receive a recovery code.',

    send_code_button:
      'Send Code',

    reset_intro:
      'Enter the code you received and your new password:',

    code_placeholder:
      '6-digit code',

    new_password_placeholder:
      'New password',

    reset_button:
      'Change Password',

    account_title:
      '🏠 My Account',

    loading:
      'Loading...',

    logout_button:
      'Log Out',

    ai_title:
      '🤖 Chat with AI',

    ai_input_placeholder:
      'Type your message...',

    send_button:
      'Send',

    sending_button:
      'Sending...',

    plans_title:
      '💰 Plans',

    currency_toman:
      'Toman (Iran)',

    currency_usd:
      'USD (Worldwide)',

    admin_login_title:
      '🛠️ Admin Login',

    admin_password_placeholder:
      'Admin password',

    admin_panel_title:
      '🛠️ Admin Panel',

    admin_users_button:
      'Users',

    admin_payments_button:
      'Payments',

    admin_adjust_balance_button:
      'Adjust Balance',

    admin_logout_button:
      'Log Out of Admin',

    label_name:
      'Name',

    label_email:
      'Email',

    label_balance:
      'Balance',

    label_signup_date:
      'Signup Date',

    label_plan:
      'Plan',

    label_amount_toman:
      'Amount (Toman)',

    label_status:
      'Status',

    label_date:
      'Date',

    monthly_suffix:
      'Toman / month',

    monthly_suffix_usd:
      '$ / month',

    free_label:
      'Free',

    buy_plan_button:
      'Buy this plan',

    unknown_error:
      'Unknown error (code {status})',

    technical_error:
      'Technical error: {message}',

    code_sent:
      'Code sent.',

    password_changed:
      'Password changed successfully.',

    error_fetching_account:
      'Error fetching account: {message}',

    error_fetching_plans:
      'Error fetching plans: {message}',

    error_creating_payment:
      'Error creating payment',

    no_reply:
      'No reply received.',

    generic_error:
      'Error',

    adjust_balance_title:
      'Adjust User Balance',

    adjust_balance_user_id_placeholder:
      'User ID',

    adjust_balance_amount_placeholder:
      'Amount in Toman (negative to deduct)',

    adjust_balance_reason_placeholder:
      'Reason (optional)',

    adjust_balance_submit:
      'Apply',

    adjust_balance_success:
      'Balance updated successfully. New balance: {balance}',

    adjust_balance_hint:
      'Copy the user ID from the "Users" table.',

    seo_h1:
      'Abzarak — Multilingual AI Assistant for Users Worldwide',

    seo_intro_p1:
      'Abzarak is a multilingual AI assistant designed for users worldwide. Chat naturally, ask questions, translate text, create content, and get help with everyday tasks in multiple languages.',

    seo_h2_about:
      'About Abzarak AI Assistant',

    seo_about_p1:
      'Abzarak can detect the language of the user and respond naturally in the same language. The service is designed to provide simple and useful access to AI for users around the world.',

    seo_h2_features:
      'Features',

    seo_feature_1:
      'Multilingual text conversations with AI',

    seo_feature_2:
      'Fast and accurate answers to everyday questions',

    seo_feature_3:
      'Secure account with password recovery',

    seo_feature_4:
      'Free and paid plans for different needs',

    seo_feature_5:
      'Designed for users worldwide with multilingual AI support',

    seo_h2_plans:
      'Subscription Plans',

    seo_plans_p1:
      'Abzarak offers a free plan with a daily message limit and subscription plans for users who need more access and features. The AI service is designed for users worldwide and supports multiple languages.'

  }

};


let currentLang =
  localStorage.getItem(
    'lang'
  ) || 'fa';

let currentPlanCurrency =
  'irt';


function t(
  key,
  vars
) {
  const dict =
    translations[
      currentLang
    ] ||
    translations.fa;

  let text =
    dict[key] ||
    translations.fa[key] ||
    key;

  if (vars) {
    Object.keys(vars)
      .forEach(
        (k) => {
          text =
            text.replace(
              '{' + k + '}',
              vars[k]
            );
        }
      );
  }

  return text;
}


function applyTranslations() {

  document.documentElement.lang =
    currentLang === 'fa'
      ? 'fa'
      : 'en';

  document.documentElement.dir =
    currentLang === 'fa'
      ? 'rtl'
      : 'ltr';

  document
    .querySelectorAll(
      '[data-i18n]'
    )
    .forEach(
      (el) => {

        const key =
          el.getAttribute(
            'data-i18n'
          );

        el.textContent =
          t(key);
      }
    );

  document
    .querySelectorAll(
      '[data-i18n-placeholder]'
    )
    .forEach(
      (el) => {

        const key =
          el.getAttribute(
            'data-i18n-placeholder'
          );

        el.setAttribute(
          'placeholder',
          t(key)
        );

      }
    );

  const btn =
    document.getElementById(
      'lang-switch-btn'
    );

  if (btn) {
    btn.textContent =
      currentLang === 'fa'
        ? 'English'
        : 'فارسی';
  }
}


function toggleLang() {

  currentLang =
    currentLang === 'fa'
      ? 'en'
      : 'fa';

  localStorage.setItem(
    'lang',
    currentLang
  );

  applyTranslations();

  const activeView =
    document.querySelector(
      'main > div:not(.hidden)'
    );

  if (activeView) {

    const id =
      activeView.id.replace(
        'view-',
        ''
      );

    if (
      id === 'account' &&
      token
    ) {
      loadAccount();
    }

    if (
      id === 'plans'
    ) {
      loadPlans();
    }

  }
}


// =============================================================
// App Logic
// =============================================================

let token =
  localStorage.getItem(
    'token'
  ) || null;

let adminToken =
  localStorage.getItem(
    'adminToken'
  ) || null;

let cachedPlansData =
  null;


function showMsg(
  elId,
  text,
  type
) {

  const el =
    document.getElementById(
      elId
    );

  el.innerHTML =
    '<div class="msg ' +
    type +
    '">' +
    escapeHtml(text) +
    '</div>';
}


function escapeHtml(
  text
) {

  return String(text)
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#039;'
    );
}


function showView(
  name
) {

  const views = [
    'login',
    'signup',
    'forgot',
    'account',
    'ai',
    'plans',
    'admin-login',
    'admin-panel'
  ];

  views.forEach(
    (v) => {

      document
        .getElementById(
          'view-' + v
        )
        .classList.add(
          'hidden'
        );

    }
  );

  if (
    (
      name === 'account' ||
      name === 'ai'
    ) &&
    !token
  ) {
    name =
      'login';
  }

  if (
    name === 'admin-panel' &&
    !adminToken
  ) {
    name =
      'admin-login';
  }

  document
    .getElementById(
      'view-' + name
    )
    .classList.remove(
      'hidden'
    );

  if (
    name === 'account'
  ) {
    loadAccount();
  }

  if (
    name === 'plans'
  ) {
    loadPlans();
  }

  if (
    name === 'admin-panel'
  ) {
    loadAdminUsers();
  }
}


// =============================================================
// Signup Frontend
// =============================================================

async function doSignup() {

  const name =
    document.getElementById(
      'signup-name'
    ).value;

  const email =
    document.getElementById(
      'signup-email'
    ).value;

  const password =
    document.getElementById(
      'signup-password'
    ).value;

  try {

    const res =
      await fetch(
        '/api/signup',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify({
              name,
              email,
              password
            })
        }
      );

    const data =
      await res.json();

    if (!res.ok) {

      showMsg(
        'signup-msg',
        data.error ||
          t(
            'unknown_error',
            {
              status:
                res.status
            }
          ),
        'error'
      );

      return;
    }

    token =
      data.token;

    localStorage.setItem(
      'token',
      token
    );

    showView(
      'account'
    );

  } catch (err) {

    showMsg(
      'signup-msg',
      t(
        'technical_error',
        {
          message:
            err.message
        }
      ),
      'error'
    );
  }
}


// =============================================================
// Login Frontend
// =============================================================

async function doLogin() {

  const email =
    document.getElementById(
      'login-email'
    ).value;

  const password =
    document.getElementById(
      'login-password'
    ).value;

  try {

    const res =
      await fetch(
        '/api/login',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify({
              email,
              password
            })
        }
      );

    const data =
      await res.json();

    if (!res.ok) {

      showMsg(
        'login-msg',
        data.error ||
          t(
            'unknown_error',
            {
              status:
                res.status
            }
          ),
        'error'
      );

      return;
    }

    token =
      data.token;

    localStorage.setItem(
      'token',
      token
    );

    showView(
      'account'
    );

  } catch (err) {

    showMsg(
      'login-msg',
      t(
        'technical_error',
        {
          message:
            err.message
        }
      ),
      'error'
    );
  }
}


// =============================================================
// Forgot Frontend
// =============================================================

async function doForgotPassword() {

  const email =
    document.getElementById(
      'forgot-email'
    ).value;

  try {

    const res =
      await fetch(
        '/api/forgot-password',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify({
              email
            })
        }
      );

    const data =
      await res.json();

    if (!res.ok) {

      showMsg(
        'forgot-msg',
        data.error ||
          t(
            'unknown_error',
            {
              status:
                res.status
            }
          ),
        'error'
      );

      return;
    }

    showMsg(
      'forgot-msg',
      data.message ||
        t('code_sent'),
      'success'
    );

  } catch (err) {

    showMsg(
      'forgot-msg',
      t(
        'technical_error',
        {
          message:
            err.message
        }
      ),
      'error'
    );
  }
}


// =============================================================
// Reset Password Frontend
// =============================================================

async function doResetPassword() {

  const email =
    document.getElementById(
      'forgot-email'
    ).value;

  const code =
    document.getElementById(
      'reset-code'
    ).value;

  const newPassword =
    document.getElementById(
      'reset-password'
    ).value;

  try {

    const res =
      await fetch(
        '/api/reset-password',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify({
              email,
              code,
              newPassword
            })
        }
      );

    const data =
      await res.json();

    if (!res.ok) {

      showMsg(
        'reset-msg',
        data.error ||
          t(
            'unknown_error',
            {
              status:
                res.status
            }
          ),
        'error'
      );

      return;
    }

    showMsg(
      'reset-msg',
      data.message ||
        t('password_changed'),
      'success'
    );

    setTimeout(
      () =>
        showView(
          'login'
        ),
      1500
    );

  } catch (err) {

    showMsg(
      'reset-msg',
      t(
        'technical_error',
        {
          message:
            err.message
        }
      ),
      'error'
    );
  }
}


// =============================================================
// Logout
// =============================================================

function logout() {

  token =
    null;

  localStorage.removeItem(
    'token'
  );

  showView(
    'login'
  );
}


// =============================================================
// Account
// =============================================================

async function loadAccount() {

  try {

    const res =
      await fetch(
        '/api/me',
        {
          headers: {
            'Authorization':
              'Bearer ' +
              token
          }
        }
      );

    const data =
      await res.json();

    if (!res.ok) {

      logout();

      return;
    }

    document.getElementById(
      'account-info'
    ).innerHTML =

      '<p><b>' +
      t('label_name') +
      ':</b> ' +
      escapeHtml(
        data.user.name ||
        '-'
      ) +
      '</p>' +

      '<p><b>' +
      t('label_email') +
      ':</b> ' +
      escapeHtml(
        data.user.email
      ) +
      '</p>' +

      '<p><b>' +
      t('label_balance') +
      ':</b> ' +
      escapeHtml(
        data.user.balance
      ) +
      '</p>';

  } catch (err) {

    document.getElementById(
      'account-info'
    ).innerHTML =
      '<div class="msg error">' +
      t(
        'error_fetching_account',
        {
          message:
            err.message
        }
      ) +
      '</div>';
  }
}


// =============================================================
// Plans Frontend
// =============================================================

function setPlanCurrency(
  currency
) {

  currentPlanCurrency =
    currency;

  document
    .getElementById(
      'currency-btn-irt'
    )
    .classList.toggle(
      'active',
      currency === 'irt'
    );

  document
    .getElementById(
      'currency-btn-usd'
    )
    .classList.toggle(
      'active',
      currency === 'usd'
    );

  renderPlansList();
}


function renderPlansList() {

  if (!cachedPlansData) {
    return;
  }

  const list =
    currentPlanCurrency ===
    'usd'
      ? cachedPlansData.plans_usd
      : cachedPlansData.plans;

  const isUsd =
    currentPlanCurrency ===
    'usd';

  document.getElementById(
    'plans-list'
  ).innerHTML =

    list.map(
      (p) => {

        const priceLine =
          isUsd

            ? (
                p.price_usd > 0
                  ? '$' +
                    Number(
                      p.price_usd
                    ).toLocaleString(
                      'en-US'
                    ) +
                    ' ' +
                    t(
                      'monthly_suffix_usd'
                    )

                  : t(
                      'free_label'
                    )
              )

            : (
                p.price_toman > 0
                  ? Number(
                      p.price_toman
                    ).toLocaleString(
                      currentLang === 'fa'
                        ? 'fa-IR'
                        : 'en-US'
                    ) +
                    ' ' +
                    t(
                      'monthly_suffix'
                    )

                  : t(
                      'free_label'
                    )
              );

        const hasPrice =
          isUsd
            ? p.price_usd > 0
            : p.price_toman > 0;

        return (

          '<div class="plan-card">' +

          '<b>' +
          escapeHtml(
            p.name
          ) +
          '</b><br>' +

          '<span class="plan-price">' +
          priceLine +
          '</span><br>' +

          '<ul style="margin:6px 0 0;padding-inline-start:18px;">' +

          p.features
            .map(
              (f) =>
                '<li>' +
                escapeHtml(f) +
                '</li>'
            )
            .join('') +

          '</ul>' +

          (
            hasPrice

              ? '<div class="actions">' +
                '<button class="btn-primary" onclick="buyPlan(\\'' +
                p.id +
                '\\')">' +
                t(
                  'buy_plan_button'
                ) +
                '</button>' +
                '</div>'

              : ''
          ) +

          '</div>'
        );
      }
    ).join('');
}


async function loadPlans() {

  try {

    const res =
      await fetch(
        '/api/plans'
      );

    const data =
      await res.json();

    cachedPlansData =
      data;

    renderPlansList();

  } catch (err) {

    document.getElementById(
      'plans-list'
    ).innerHTML =
      '<div class="msg error">' +
      t(
        'error_fetching_plans',
        {
          message:
            err.message
        }
      ) +
      '</div>';
  }
}


// =============================================================
// Buy Plan
// =============================================================

async function buyPlan(
  planId
) {

  if (!token) {

    showView(
      'login'
    );

    return;
  }

  try {

    const res =
      await fetch(
        '/api/payment/request',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            'Authorization':
              'Bearer ' +
              token
          },

          body:
            JSON.stringify({
              planId
            })
        }
      );

    const data =
      await res.json();

    if (!res.ok) {

      alert(
        data.error ||
        t(
          'error_creating_payment'
        )
      );

      return;
    }

    window.location.href =
      data.payment_url;

  } catch (err) {

    alert(
      t(
        'technical_error',
        {
          message:
            err.message
        }
      )
    );
  }
}


// =============================================================
// AI Frontend
// =============================================================

async function sendAiMessage() {

  if (!token) {

    showView(
      'login'
    );

    return;
  }

  const input =
    document.getElementById(
      'ai-input'
    );

  const message =
    input.value.trim();

  if (!message) {
    return;
  }

  const chatBox =
    document.getElementById(
      'chat-box'
    );

  chatBox.innerHTML +=
    '<div class="bubble user">' +
    escapeHtml(
      message
    ) +
    '</div>';

  input.value =
    '';

  document.getElementById(
    'ai-msg'
  ).innerHTML =
    '';

  const sendButton =
    document.querySelector(
      '#view-ai .btn-primary'
    );

  if (sendButton) {

    sendButton.disabled =
      true;

    sendButton.textContent =
      t(
        'sending_button'
      );
  }

  try {

    const res =
      await fetch(
        '/api/ai/chat',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            'Authorization':
              'Bearer ' +
              token
          },

          body:
            JSON.stringify({
              message
            })
        }
      );

    const data =
      await res.json();

    if (!res.ok) {

      showMsg(
        'ai-msg',
        data.error ||
          t(
            'unknown_error',
            {
              status:
                res.status
            }
          ),
        'error'
      );

      return;
    }

    chatBox.innerHTML +=
      '<div class="bubble ai">' +
      escapeHtml(
        data.reply ||
        t('no_reply')
      ) +
      '</div>';

    chatBox.scrollTop =
      chatBox.scrollHeight;

  } catch (err) {

    showMsg(
      'ai-msg',
      t(
        'technical_error',
        {
          message:
            err.message
        }
      ),
      'error'
    );

  } finally {

    if (sendButton) {

      sendButton.disabled =
        false;

      sendButton.textContent =
        t(
          'send_button'
        );
    }
  }
}


// =============================================================
// Admin Login Frontend
// =============================================================

async function doAdminLogin() {

  const password =
    document.getElementById(
      'admin-password'
    ).value;

  try {

    const res =
      await fetch(
        '/api/admin/login',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify({
              password
            })
        }
      );

    const data =
      await res.json();

    if (!res.ok) {

      showMsg(
        'admin-login-msg',
        data.error ||
          t('generic_error'),
        'error'
      );

      return;
    }

    adminToken =
      data.token;

    localStorage.setItem(
      'adminToken',
      adminToken
    );

    showView(
      'admin-panel'
    );

  } catch (err) {

    showMsg(
      'admin-login-msg',
      t(
        'technical_error',
        {
          message:
            err.message
        }
      ),
      'error'
    );
  }
}


// =============================================================
// Admin Logout
// =============================================================

function adminLogout() {

  adminToken =
    null;

  localStorage.removeItem(
    'adminToken'
  );

  showView(
    'login'
  );
}


// =============================================================
// Admin Users
// =============================================================

async function loadAdminUsers() {

  const content =
    document.getElementById(
      'admin-content'
    );

  content.innerHTML =
    t('loading');

  try {

    const res =
      await fetch(
        '/api/admin/users',
        {
          headers: {
            'Authorization':
              'Bearer ' +
              adminToken
          }
        }
      );

    const data =
      await res.json();

    if (!res.ok) {

      content.innerHTML =
        '<div class="msg error">' +
        escapeHtml(
          data.error ||
          t('generic_error')
        ) +
        '</div>';

      return;
    }

    content.innerHTML =

      '<table>' +

      '<tr>' +

      '<th>' +
      t('label_name') +
      '</th>' +

      '<th>' +
      t('label_email') +
      '</th>' +

      '<th>' +
      t('label_balance') +
      '</th>' +

      '<th>' +
      t('label_signup_date') +
      '</th>' +

      '<th>ID</th>' +

      '</tr>' +

      data.users
        .map(
          (u) =>

            '<tr>' +

            '<td>' +
            escapeHtml(
              u.name ||
              '-'
            ) +
            '</td>' +

            '<td>' +
            escapeHtml(
              u.email
            ) +
            '</td>' +

            '<td>' +
            escapeHtml(
              u.balance
            ) +
            '</td>' +

            '<td>' +
            escapeHtml(
              u.created_at
            ) +
            '</td>' +

            '<td style="font-size:0.7rem;">' +
            escapeHtml(
              u.id
            ) +
            '</td>' +

            '</tr>'
        )
        .join('') +

      '</table>';

  } catch (err) {

    content.innerHTML =
      '<div class="msg error">' +
      t(
        'technical_error',
        {
          message:
            err.message
        }
      ) +
      '</div>';
  }
}


// =============================================================
// Admin Payments
// =============================================================

async function loadAdminPayments() {

  const content =
    document.getElementById(
      'admin-content'
    );

  content.innerHTML =
    t('loading');

  try {

    const res =
      await fetch(
        '/api/admin/payments',
        {
          headers: {
            'Authorization':
              'Bearer ' +
              adminToken
          }
        }
      );

    const data =
      await res.json();

    if (!res.ok) {

      content.innerHTML =
        '<div class="msg error">' +
        escapeHtml(
          data.error ||
          t('generic_error')
        ) +
        '</div>';

      return;
    }

    content.innerHTML =

      '<table>' +

      '<tr>' +

      '<th>' +
      t('label_email') +
      '</th>' +

      '<th>' +
      t('label_plan') +
      '</th>' +

      '<th>' +
      t('label_amount_toman') +
      '</th>' +

      '<th>' +
      t('label_status') +
      '</th>' +

      '<th>' +
      t('label_date') +
      '</th>' +

      '</tr>' +

      data.payments
        .map(
          (p) =>

            '<tr>' +

            '<td>' +
            escapeHtml(
              p.email
            ) +
            '</td>' +

            '<td>' +
            escapeHtml(
              p.plan_id
            ) +
            '</td>' +

            '<td>' +
            escapeHtml(
              p.amount_toman
            ) +
            '</td>' +

            '<td>' +
            escapeHtml(
              p.status
            ) +
            '</td>' +

            '<td>' +
            escapeHtml(
              p.created_at
            ) +
            '</td>' +

            '</tr>'
        )
        .join('') +

      '</table>';

  } catch (err) {

    content.innerHTML =
      '<div class="msg error">' +
      t(
        'technical_error',
        {
          message:
            err.message
        }
      ) +
      '</div>';
  }
}


// =============================================================
// Admin Balance Adjustment
// =============================================================

function showAdjustBalanceForm() {

  const content =
    document.getElementById(
      'admin-content'
    );

  content.innerHTML =

    '<h3>' +
    t(
      'adjust_balance_title'
    ) +
    '</h3>' +

    '<p class="note">' +
    t(
      'adjust_balance_hint'
    ) +
    '</p>' +

    '<input id="adjust-user-id" type="text" placeholder="' +
    t(
      'adjust_balance_user_id_placeholder'
    ) +
    '">' +

    '<input id="adjust-amount" type="number" placeholder="' +
    t(
      'adjust_balance_amount_placeholder'
    ) +
    '">' +

    '<input id="adjust-reason" type="text" placeholder="' +
    t(
      'adjust_balance_reason_placeholder'
    ) +
    '">' +

    '<div class="actions">' +

    '<button class="btn-primary" onclick="submitAdjustBalance()">' +

    t(
      'adjust_balance_submit'
    ) +

    '</button>' +

    '</div>' +

    '<div id="adjust-balance-msg"></div>';
}


async function submitAdjustBalance() {

  const userId =
    document.getElementById(
      'adjust-user-id'
    ).value.trim();

  const amount =
    Number(
      document.getElementById(
        'adjust-amount'
      ).value
    );

  const reason =
    document.getElementById(
      'adjust-reason'
    ).value.trim();

  if (
    !userId ||
    !amount
  ) {

    showMsg(
      'adjust-balance-msg',
      t('generic_error'),
      'error'
    );

    return;
  }

  try {

    const res =
      await fetch(
        '/api/admin/adjust-balance',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            'Authorization':
              'Bearer ' +
              adminToken
          },

          body:
            JSON.stringify({
              userId,
              amount,
              reason
            })
        }
      );

    const data =
      await res.json();

    if (!res.ok) {

      showMsg(
        'adjust-balance-msg',
        data.error ||
          t('generic_error'),
        'error'
      );

      return;
    }

    showMsg(
      'adjust-balance-msg',
      t(
        'adjust_balance_success',
        {
          balance:
            data.new_balance
        }
      ),
      'success'
    );

  } catch (err) {

    showMsg(
      'adjust-balance-msg',
      t(
        'technical_error',
        {
          message:
            err.message
        }
      ),
      'error'
    );
  }
}


// =============================================================
// Initial setup
// =============================================================

applyTranslations();

showView(
  token
    ? 'account'
    : 'login'
);


</script>

</body>
</html>`;
}


// =============================================================
// robots.txt
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
// sitemap.xml
// =============================================================

function renderSitemapXml(
  baseUrl
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

</urlset>
`;
}


// =============================================================
// Router
// =============================================================

export default {

  async fetch(
    request,
    env
  ) {

    const url =
      new URL(request.url);

    if (
      request.method ===
      "OPTIONS"
    ) {
      return json(
        {},
        204
      );
    }


    // Homepage

    if (
      url.pathname === "/" &&
      request.method === "GET"
    ) {
      return html(
        renderHomepage()
      );
    }


    // eNamad verification

    if (
      url.pathname ===
        "/36032134.txt" &&
      request.method === "GET"
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


    // robots.txt

    if (
      url.pathname ===
        "/robots.txt" &&
      request.method === "GET"
    ) {

      const baseUrl =
        env.PUBLIC_BASE_URL ||
        url.origin;

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


    // sitemap.xml

    if (
      url.pathname ===
        "/sitemap.xml" &&
      request.method === "GET"
    ) {

      const baseUrl =
        env.PUBLIC_BASE_URL ||
        url.origin;

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


    // Signup

    if (
      url.pathname ===
        "/api/signup" &&
      request.method === "POST"
    ) {
      return handleSignup(
        request,
        env
      );
    }


    // Login

    if (
      url.pathname ===
        "/api/login" &&
      request.method === "POST"
    ) {
      return handleLogin(
        request,
        env
      );
    }


    // Me

    if (
      url.pathname ===
        "/api/me" &&
      request.method === "GET"
    ) {
      return handleMe(
        request,
        env
      );
    }


    // Forgot password

    if (
      url.pathname ===
        "/api/forgot-password" &&
      request.method === "POST"
    ) {
      return handleForgotPassword(
        request,
        env
      );
    }


    // Reset password

    if (
      url.pathname ===
        "/api/reset-password" &&
      request.method === "POST"
    ) {
      return handleResetPassword(
        request,
        env
      );
    }


    // Plans

    if (
      url.pathname ===
        "/api/plans" &&
      request.method === "GET"
    ) {
      return handlePlans(
        request,
        env
      );
    }


    // AI Chat

    if (
      url.pathname ===
        "/api/ai/chat" &&
      request.method === "POST"
    ) {
      return handleAiChat(
        request,
        env
      );
    }


    // Payment request

    if (
      url.pathname ===
        "/api/payment/request" &&
      request.method === "POST"
    ) {
      return handleCreatePayment(
        request,
        env
      );
    }


    // Payment verification

    if (
      url.pathname ===
        "/api/payment/verify" &&
      request.method === "GET"
    ) {
      return handleVerifyPayment(
        request,
        env
      );
    }


    // Admin login

    if (
      url.pathname ===
        "/api/admin/login" &&
      request.method === "POST"
    ) {
      return handleAdminLogin(
        request,
        env
      );
    }


    // Admin users

    if (
      url.pathname ===
        "/api/admin/users" &&
      request.method === "GET"
    ) {
      return handleAdminUsers(
        request,
        env
      );
    }


    // Admin payments

    if (
      url.pathname ===
        "/api/admin/payments" &&
      request.method === "GET"
    ) {
      return handleAdminPayments(
        request,
        env
      );
    }


    // Admin balance adjustment

    if (
      url.pathname ===
        "/api/admin/adjust-balance" &&
      request.method === "POST"
    ) {
      return handleAdminAdjustBalance(
        request,
        env
      );
    }


    return json(
      {
        error:
          "مسیر یافت نشد"
      },
      404
    );
  },
};
