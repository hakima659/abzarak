// =============================================================
// ABZARAK AI — BACKEND API
// Added after renderHomepage()
// Auth / D1 / AI / Plans / Resend / Admin / Withdrawals
// =============================================================

const FREE_DAILY_LIMIT = 10;

const PLAN_PRICES = {
  basic: 400000,
  standard: 1000000,
  pro: 2000000,
  special: 3000000
};

const PLAN_USD = {
  basic: 5,
  standard: 10,
  pro: 15,
  special: 20
};

const PLAN_NAMES = {
  basic: "Basic",
  standard: "Standard",
  pro: "Pro",
  special: "Special"
};

const PLAN_FEATURES = {
  basic: [
    "استفاده بیشتر از هوش مصنوعی",
    "گفتگو با دستیار هوشمند",
    "پشتیبانی چندزبانه"
  ],
  standard: [
    "استفاده گسترده‌تر از هوش مصنوعی",
    "گفتگو و تولید محتوا",
    "ترجمه و بازنویسی",
    "پشتیبانی چندزبانه"
  ],
  pro: [
    "استفاده حرفه‌ای از هوش مصنوعی",
    "تولید و بازنویسی متن",
    "ترجمه",
    "ایده‌پردازی و خلاصه‌سازی",
    "دسترسی گسترده"
  ],
  special: [
    "استفاده ویژه از هوش مصنوعی",
    "تمام امکانات حرفه‌ای",
    "استفاده گسترده",
    "پشتیبانی چندزبانه"
  ]
};


// =============================================================
// RESPONSE HELPERS
// =============================================================

function json(data, status = 200) {

  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
      }
    }
  );

}


function html(data, status = 200) {

  return new Response(
    data,
    {
      status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store"
      }
    }
  );

}


function cors(response) {

  const headers = new Headers(response.headers);

  headers.set(
    "Access-Control-Allow-Origin",
    "*"
  );

  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );

  return new Response(
    response.body,
    {
      status: response.status,
      statusText: response.statusText,
      headers
    }
  );

}


// =============================================================
// JSON BODY
// =============================================================

async function bodyJson(request) {

  try {

    return await request.json();

  } catch {

    return {};

  }

}


// =============================================================
// RANDOM
// =============================================================

function randomHex(bytes = 32) {

  const data =
    new Uint8Array(bytes);

  crypto.getRandomValues(data);

  return Array.from(data)
    .map(x => x.toString(16).padStart(2, "0"))
    .join("");

}


function randomCode() {

  const data =
    new Uint32Array(1);

  crypto.getRandomValues(data);

  return String(
    100000 + (data[0] % 900000)
  );

}


// =============================================================
// PASSWORD HASH
// =============================================================

async function hashPassword(password) {

  const data =
    new TextEncoder().encode(password);

  const hash =
    await crypto.subtle.digest(
      "SHA-256",
      data
    );

  return Array.from(
    new Uint8Array(hash)
  )
    .map(x =>
      x.toString(16).padStart(2, "0")
    )
    .join("");

}


// =============================================================
// JWT-LIKE TOKEN
// =============================================================

function base64url(data) {

  let binary = "";

  if (typeof data === "string") {

    binary = btoa(data);

  } else {

    binary = btoa(
      String.fromCharCode(...data)
    );

  }

  return binary
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");

}


function decodeBase64url(value) {

  value =
    value
      .replaceAll("-", "+")
      .replaceAll("_", "/");

  while (value.length % 4)
    value += "=";

  return atob(value);

}


async function hmacSign(
  value,
  secret
) {

  const key =
    await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      {
        name: "HMAC",
        hash: "SHA-256"
      },
      false,
      ["sign"]
    );

  const signature =
    await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(value)
    );

  return base64url(
    new Uint8Array(signature)
  );

}


async function createToken(
  payload,
  secret
) {

  const encoded =
    base64url(
      JSON.stringify(payload)
    );

  const signature =
    await hmacSign(
      encoded,
      secret
    );

  return encoded + "." + signature;

}


async function verifyToken(
  token,
  secret
) {

  if (!token)
    return null;

  const parts =
    token.split(".");

  if (parts.length !== 2)
    return null;

  const payloadPart =
    parts[0];

  const signature =
    parts[1];

  const expected =
    await hmacSign(
      payloadPart,
      secret
    );

  if (signature !== expected)
    return null;

  try {

    const payload =
      JSON.parse(
        decodeBase64url(payloadPart)
      );

    if (
      payload.exp &&
      Date.now() > payload.exp
    ) {

      return null;

    }

    return payload;

  } catch {

    return null;

  }

}


// =============================================================
// TOKEN EXTRACTION
// =============================================================

function bearerToken(request) {

  const auth =
    request.headers.get(
      "Authorization"
    );

  if (!auth)
    return "";

  if (
    !auth.toLowerCase()
      .startsWith("bearer ")
  )
    return "";

  return auth.slice(7).trim();

}


// =============================================================
// DATABASE INITIALIZATION
// =============================================================

let dbReady = false;


async function initDatabase(env) {

  if (!env.DB)
    throw new Error(
      "D1 binding DB تنظیم نشده است."
    );

  if (dbReady)
    return;

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      balance INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `).run();


  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS plans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price_toman INTEGER NOT NULL,
      price_usd REAL NOT NULL,
      features TEXT NOT NULL
    )
  `).run();


  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      starts_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active'
    )
  `).run();


  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS usage (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      usage_date TEXT NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      UNIQUE(user_id, usage_date)
    )
  `).run();


  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `).run();


  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      amount_toman INTEGER NOT NULL,
      authority TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      paid_at TEXT
    )
  `).run();


  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS withdrawals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      method TEXT NOT NULL,
      destination TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      processed_at TEXT
    )
  `).run();


  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL
    )
  `).run();


  for (const id of Object.keys(PLAN_PRICES)) {

    const exists =
      await env.DB.prepare(
        "SELECT id FROM plans WHERE id = ?"
      )
        .bind(id)
        .first();

    if (!exists) {

      await env.DB.prepare(`
        INSERT INTO plans
        (id,name,price_toman,price_usd,features)
        VALUES (?,?,?,?,?)
      `)
        .bind(
          id,
          PLAN_NAMES[id],
          PLAN_PRICES[id],
          PLAN_USD[id],
          JSON.stringify(
            PLAN_FEATURES[id]
          )
        )
        .run();

    } else {

      await env.DB.prepare(`
        UPDATE plans
        SET
          price_toman = ?,
          price_usd = ?,
          features = ?
        WHERE id = ?
      `)
        .bind(
          PLAN_PRICES[id],
          PLAN_USD[id],
          JSON.stringify(
            PLAN_FEATURES[id]
          ),
          id
        )
        .run();

    }

  }

  dbReady = true;

}


// =============================================================
// USER AUTH
// =============================================================

async function requireUser(
  request,
  env
) {

  const token =
    bearerToken(request);

  if (!token)
    return null;

  const secret =
    env.JWT_SECRET ||
    env.ADMIN_PASSWORD ||
    "abzarak-default-secret";

  const payload =
    await verifyToken(
      token,
      secret
    );

  if (!payload || !payload.userId)
    return null;

  const user =
    await env.DB.prepare(`
      SELECT *
      FROM users
      WHERE id = ?
    `)
      .bind(payload.userId)
      .first();

  return user || null;

}


// =============================================================
// ADMIN AUTH
// =============================================================

async function requireAdmin(
  request,
  env
) {

  const token =
    bearerToken(request);

  if (!token)
    return false;

  const secret =
    env.JWT_SECRET ||
    env.ADMIN_PASSWORD ||
    "abzarak-default-secret";

  const payload =
    await verifyToken(
      token,
      secret
    );

  return !!(
    payload &&
    payload.admin === true
  );

}


// =============================================================
// DATE
// =============================================================

function today() {

  return new Date()
    .toISOString()
    .slice(0, 10);

}


function addDays(
  days
) {

  return new Date(
    Date.now() +
    days * 86400000
  ).toISOString();

}


// =============================================================
// USAGE
// =============================================================

async function getUsage(
  env,
  userId
) {

  const date =
    today();

  let row =
    await env.DB.prepare(`
      SELECT *
      FROM usage
      WHERE user_id = ?
      AND usage_date = ?
    `)
      .bind(
        userId,
        date
      )
      .first();

  if (!row) {

    await env.DB.prepare(`
      INSERT INTO usage
      (id,user_id,usage_date,used)
      VALUES (?,?,?,0)
    `)
      .bind(
        randomHex(16),
        userId,
        date
      )
      .run();

    row = {
      used: 0
    };

  }

  return row;

}


// =============================================================
// ACTIVE SUBSCRIPTION
// =============================================================

async function getSubscription(
  env,
  userId
) {

  return await env.DB.prepare(`
    SELECT
      s.*,
      p.id AS plan_id_real,
      p.name AS plan_name,
      p.price_toman,
      p.price_usd,
      p.features
    FROM subscriptions s
    LEFT JOIN plans p
      ON p.id = s.plan_id
    WHERE s.user_id = ?
      AND s.status = 'active'
      AND s.expires_at > ?
    ORDER BY s.expires_at DESC
    LIMIT 1
  `)
    .bind(
      userId,
      new Date().toISOString()
    )
    .first();

}


// =============================================================
// SEND RESEND EMAIL
// =============================================================

async function sendRecoveryEmail(
  env,
  email,
  code
) {

  if (!env.RESEND_API_KEY) {

    return {
      ok: false,
      status: 500,
      error:
        "سرویس ایمیل تنظیم نشده است (RESEND_API_KEY وجود ندارد)"
    };

  }


  const from =
    env.RESEND_FROM_EMAIL;

  if (!from) {

    return {
      ok: false,
      status: 500,
      error:
        "آدرس ارسال ایمیل تنظیم نشده است (RESEND_FROM_EMAIL وجود ندارد)"
    };

  }


  const response =
    await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          "Authorization":
            `Bearer ${env.RESEND_API_KEY}`,

          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({

            from,

            to: [email],

            subject:
              "کد بازیابی رمز عبور ابزارک",

            html: `
              <!doctype html>
              <html lang="fa" dir="rtl">
              <head>
                <meta charset="UTF-8">
              </head>
              <body style="
                margin:0;
                padding:30px;
                background:#f6f8ff;
                font-family:Tahoma,Arial,sans-serif;
                direction:rtl;
              ">

                <div style="
                  max-width:560px;
                  margin:auto;
                  background:#ffffff;
                  border-radius:20px;
                  padding:30px;
                  box-shadow:0 10px 40px rgba(15,23,42,.08);
                ">

                  <h2 style="
                    color:#1e1b4b;
                    margin-top:0;
                  ">
                    🔐 بازیابی رمز عبور ابزارک
                  </h2>

                  <p style="
                    color:#475569;
                    line-height:2;
                  ">
                    کد بازیابی رمز عبور شما:
                  </p>

                  <div style="
                    font-size:36px;
                    font-weight:900;
                    letter-spacing:8px;
                    text-align:center;
                    padding:20px;
                    border-radius:16px;
                    background:#eef2ff;
                    color:#3730a3;
                  ">
                    ${code}
                  </div>

                  <p style="
                    color:#64748b;
                    line-height:2;
                  ">
                    این کد تا ۱۵ دقیقه معتبر است.
                  </p>

                  <p style="
                    color:#64748b;
                    line-height:2;
                  ">
                    اگر این درخواست توسط شما انجام نشده است،
                    این ایمیل را نادیده بگیرید.
                  </p>

                  <hr style="
                    border:0;
                    border-top:1px solid #e5e7eb;
                    margin:25px 0;
                  ">

                  <div style="
                    text-align:center;
                    color:#64748b;
                  ">
                    🤖 Abzarak AI
                  </div>

                </div>

              </body>
              </html>
            `

          })

      }
    );


  if (!response.ok) {

    let details = "";

    try {

      details =
        await response.text();

    } catch {}

    return {
      ok: false,
      status: response.status,
      error:
        "ارسال ایمیل ناموفق بود",
      details
    };

  }


  return {
    ok: true
  };

}


// =============================================================
// SIGNUP
// =============================================================

async function signupApi(
  request,
  env
) {

  const body =
    await bodyJson(request);

  const name =
    String(body.name || "").trim();

  const email =
    String(body.email || "")
      .trim()
      .toLowerCase();

  const password =
    String(body.password || "");

  if (!name)
    return json(
      { error: "نام را وارد کنید." },
      400
    );

  if (!email)
    return json(
      { error: "ایمیل را وارد کنید." },
      400
    );

  if (
    !email.includes("@") ||
    !email.includes(".")
  )
    return json(
      { error: "ایمیل معتبر نیست." },
      400
    );

  if (password.length < 6)
    return json(
      {
        error:
          "رمز عبور باید حداقل ۶ کاراکتر باشد."
      },
      400
    );


  const existing =
    await env.DB.prepare(`
      SELECT id
      FROM users
      WHERE email = ?
    `)
      .bind(email)
      .first();

  if (existing)
    return json(
      {
        error:
          "این ایمیل قبلاً ثبت شده است."
      },
      409
    );


  const id =
    randomHex(16);

  const passwordHash =
    await hashPassword(password);

  await env.DB.prepare(`
    INSERT INTO users
    (id,name,email,password_hash,balance,created_at)
    VALUES (?,?,?,?,0,?)
  `)
    .bind(
      id,
      name,
      email,
      passwordHash,
      new Date().toISOString()
    )
    .run();


  const secret =
    env.JWT_SECRET ||
    env.ADMIN_PASSWORD ||
    "abzarak-default-secret";

  const token =
    await createToken(
      {
        userId: id,
        exp:
          Date.now() +
          30 * 86400000
      },
      secret
    );


  return json({
    token
  });

}


// =============================================================
// LOGIN
// =============================================================

async function loginApi(
  request,
  env
) {

  const body =
    await bodyJson(request);

  const email =
    String(body.email || "")
      .trim()
      .toLowerCase();

  const password =
    String(body.password || "");


  const user =
    await env.DB.prepare(`
      SELECT *
      FROM users
      WHERE email = ?
    `)
      .bind(email)
      .first();


  if (!user)
    return json(
      {
        error:
          "ایمیل یا رمز عبور اشتباه است."
      },
      401
    );


  const hash =
    await hashPassword(password);

  if (
    hash !==
    user.password_hash
  )
    return json(
      {
        error:
          "ایمیل یا رمز عبور اشتباه است."
      },
      401
    );


  const secret =
    env.JWT_SECRET ||
    env.ADMIN_PASSWORD ||
    "abzarak-default-secret";

  const token =
    await createToken(
      {
        userId: user.id,
        exp:
          Date.now() +
          30 * 86400000
      },
      secret
    );


  return json({
    token
  });

}


// =============================================================
// ME
// =============================================================

async function meApi(
  request,
  env
) {

  const user =
    await requireUser(
      request,
      env
    );

  if (!user)
    return json(
      {
        error:
          "نشست نامعتبر است."
      },
      401
    );


  const subscription =
    await getSubscription(
      env,
      user.id
    );


  const usage =
    await getUsage(
      env,
      user.id
    );


  let subscriptionData =
    null;


  if (subscription) {

    subscriptionData = {

      plan_id:
        subscription.plan_id,

      expires_at:
        subscription.expires_at,

      plan: {
        id:
          subscription.plan_id,

        name:
          subscription.plan_name,

        features:
          JSON.parse(
            subscription.features ||
            "[]"
          )
      }

    };

  }


  return json({

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      balance: user.balance
    },

    subscription:
      subscriptionData,

    usage: {
      used:
        Number(usage.used || 0),

      limit:
        subscription
          ? 999999999
          : FREE_DAILY_LIMIT
    }

  });

}


// =============================================================
// FORGOT PASSWORD
// =============================================================

async function forgotPasswordApi(
  request,
  env
) {

  const body =
    await bodyJson(request);

  const email =
    String(body.email || "")
      .trim()
      .toLowerCase();


  if (!email)
    return json(
      {
        error:
          "ایمیل را وارد کنید."
      },
      400
    );


  const user =
    await env.DB.prepare(`
      SELECT id,email,name
      FROM users
      WHERE email = ?
    `)
      .bind(email)
      .first();


  /*
    برای جلوگیری از افشای وجود حساب،
    اگر ایمیل وجود نداشته باشد پاسخ عمومی می‌دهیم.
  */

  if (!user) {

    return json({
      message:
        "اگر این ایمیل در ابزارک ثبت شده باشد، کد بازیابی ارسال خواهد شد."
    });

  }


  const code =
    randomCode();

  const codeHash =
    await hashPassword(code);

  const id =
    randomHex(16);


  await env.DB.prepare(`
    UPDATE password_resets
    SET used = 1
    WHERE user_id = ?
      AND used = 0
  `)
    .bind(user.id)
    .run();


  await env.DB.prepare(`
    INSERT INTO password_resets
    (id,user_id,code_hash,expires_at,used,created_at)
    VALUES (?,?,?,?,0,?)
  `)
    .bind(
      id,
      user.id,
      codeHash,
      new Date(
        Date.now() +
        15 * 60 * 1000
      ).toISOString(),
      new Date().toISOString()
    )
    .run();


  const mail =
    await sendRecoveryEmail(
      env,
      email,
      code
    );


  if (!mail.ok) {

    return json(
      {
        error:
          mail.error ||
          "ارسال ایمیل ناموفق بود.",
        details:
          mail.details || undefined
      },
      mail.status || 500
    );

  }


  return json({
    message:
      "کد بازیابی به ایمیل شما ارسال شد."
  });

}


// =============================================================
// RESET PASSWORD
// =============================================================

async function resetPasswordApi(
  request,
  env
) {

  const body =
    await bodyJson(request);

  const email =
    String(body.email || "")
      .trim()
      .toLowerCase();

  const code =
    String(body.code || "")
      .trim();

  const newPassword =
    String(body.newPassword || "");


  if (!email || !code)
    return json(
      {
        error:
          "ایمیل و کد بازیابی الزامی است."
      },
      400
    );


  if (newPassword.length < 6)
    return json(
      {
        error:
          "رمز جدید باید حداقل ۶ کاراکتر باشد."
      },
      400
    );


  const user =
    await env.DB.prepare(`
      SELECT id
      FROM users
      WHERE email = ?
    `)
      .bind(email)
      .first();


  if (!user)
    return json(
      {
        error:
          "کد بازیابی معتبر نیست."
      },
      400
    );


  const reset =
    await env.DB.prepare(`
      SELECT *
      FROM password_resets
      WHERE user_id = ?
        AND used = 0
      ORDER BY created_at DESC
      LIMIT 1
    `)
      .bind(user.id)
      .first();


  if (!reset)
    return json(
      {
        error:
          "کد بازیابی معتبر نیست یا منقضی شده است."
      },
      400
    );


  if (
    Date.now() >
    new Date(
      reset.expires_at
    ).getTime()
  ) {

    await env.DB.prepare(`
      UPDATE password_resets
      SET used = 1
      WHERE id = ?
    `)
      .bind(reset.id)
      .run();

    return json(
      {
        error:
          "کد بازیابی منقضی شده است."
      },
      400
    );

  }


  const codeHash =
    await hashPassword(code);


  if (
    codeHash !==
    reset.code_hash
  )
    return json(
      {
        error:
          "کد بازیابی اشتباه است."
      },
      400
    );


  const passwordHash =
    await hashPassword(
      newPassword
    );


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
    UPDATE password_resets
    SET used = 1
    WHERE id = ?
  `)
    .bind(reset.id)
    .run();


  return json({
    message:
      "رمز عبور با موفقیت تغییر کرد."
  });

}


// =============================================================
// PLANS
// =============================================================

async function plansApi(
  env
) {

  const rows =
    await env.DB.prepare(`
      SELECT *
      FROM plans
      ORDER BY
        CASE id
          WHEN 'basic' THEN 1
          WHEN 'standard' THEN 2
          WHEN 'pro' THEN 3
          WHEN 'special' THEN 4
          ELSE 99
        END
    `)
      .all();


  const plans =
    (rows.results || [])
      .map(x => ({

        id: x.id,

        name: x.name,

        price_toman:
          Number(x.price_toman),

        price_usd:
          Number(x.price_usd),

        features:
          JSON.parse(
            x.features || "[]"
          )

      }));


  return json({

    plans,

    plans_usd:
      plans

  });

}


// =============================================================
// AI CHAT
// =============================================================

async function aiChatApi(
  request,
  env
) {

  const user =
    await requireUser(
      request,
      env
    );

  if (!user)
    return json(
      {
        error:
          "برای استفاده از هوش مصنوعی وارد حساب شوید."
      },
      401
    );


  const body =
    await bodyJson(request);

  const message =
    String(
      body.message || ""
    ).trim();


  if (!message)
    return json(
      {
        error:
          "پیام خالی است."
      },
      400
    );


  if (message.length > 12000)
    return json(
      {
        error:
          "پیام بیش از حد طولانی است."
      },
      400
    );


  const subscription =
    await getSubscription(
      env,
      user.id
    );


  const usage =
    await getUsage(
      env,
      user.id
    );


  if (
    !subscription &&
    Number(usage.used || 0)
      >= FREE_DAILY_LIMIT
  ) {

    return json(
      {
        error:
          "سهمیه روزانه شما تمام شده است.",
        upgrade_required:
          true
      },
      429
    );

  }


  if (!env.AI) {

    return json(
      {
        error:
          "سرویس هوش مصنوعی تنظیم نشده است."
      },
      500
    );

  }


  let result;


  try {

    result =
      await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct-fast",
        {
          messages: [
            {
              role: "system",
              content:
                "You are Abzarak AI, a helpful multilingual AI assistant. Answer in the same language as the user whenever possible. Be clear, useful and concise."
            },
            {
              role: "user",
              content:
                message
            }
          ]
        }
      );

  } catch (error) {

    return json(
      {
        error:
          "خطا در سرویس هوش مصنوعی."
      },
      500
    );

  }


  let reply = "";


  if (
    typeof result === "string"
  ) {

    reply = result;

  } else if (
    result &&
    typeof result.response === "string"
  ) {

    reply =
      result.response;

  } else if (
    result &&
    typeof result.result === "string"
  ) {

    reply =
      result.result;

  } else {

    try {

      reply =
        JSON.stringify(
          result
        );

    } catch {

      reply =
        "پاسخی دریافت نشد.";

    }

  }


  if (!subscription) {

    await env.DB.prepare(`
      UPDATE usage
      SET used = used + 1
      WHERE user_id = ?
        AND usage_date = ?
    `)
      .bind(
        user.id,
        today()
      )
      .run();

  }


  return json({
    reply
  });

}


// =============================================================
// PAYMENT REQUEST
// =============================================================

async function paymentRequestApi(
  request,
  env
) {

  const user =
    await requireUser(
      request,
      env
    );

  if (!user)
    return json(
      {
        error:
          "برای خرید ابتدا وارد حساب شوید."
      },
      401
    );


  const body =
    await bodyJson(request);

  const planId =
    String(
      body.planId || ""
    );


  if (
    !Object.prototype.hasOwnProperty.call(
      PLAN_PRICES,
      planId
    )
  ) {

    return json(
      {
        error:
          "پلن انتخاب‌شده معتبر نیست."
      },
      400
    );

  }


  const amount =
    PLAN_PRICES[planId];


  const paymentId =
    randomHex(16);


  await env.DB.prepare(`
    INSERT INTO payments
    (id,user_id,plan_id,amount_toman,status,created_at)
    VALUES (?,?,?,?,?,?)
  `)
    .bind(
      paymentId,
      user.id,
      planId,
      amount,
      "pending",
      new Date().toISOString()
    )
    .run();


  /*
    اگر ZARINPAL_MERCHANT_ID هنوز تنظیم نشده باشد،
    پرداخت را فعال نمی‌کنیم تا لینک ساختگی ایجاد نشود.
  */

  if (!env.ZARINPAL_MERCHANT_ID) {

    return json(
      {
        error:
          "درگاه زرین‌پال هنوز در Worker تنظیم نشده است."
      },
      503
    );

  }


  const callback =
    env.PUBLIC_BASE_URL
      ? env.PUBLIC_BASE_URL +
        "/api/payment/verify?payment_id=" +
        encodeURIComponent(paymentId)
      : new URL(
          "/api/payment/verify?payment_id=" +
          encodeURIComponent(paymentId),
          request.url
        ).toString();


  try {

    const response =
      await fetch(
        "https://payment.zarinpal.com/pg/v4/payment/request.json",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({

              merchant_id:
                env.ZARINPAL_MERCHANT_ID,

              amount,

              description:
                `Abzarak AI - ${PLAN_NAMES[planId]}`,

              callback_url:
                callback,

              metadata: {
                email:
                  user.email,

                mobile:
                  ""
              }

            })

        }
      );


    const data =
      await response.json();


    if (
      !response.ok ||
      !data.data ||
      !data.data.authority
    ) {

      return json(
        {
          error:
            "ایجاد درخواست پرداخت ناموفق بود.",
          details:
            data.errors ||
            data.data ||
            null
        },
        502
      );

    }


    const authority =
      data.data.authority;


    await env.DB.prepare(`
      UPDATE payments
      SET authority = ?
      WHERE id = ?
    `)
      .bind(
        authority,
        paymentId
      )
      .run();


    return json({

      payment_url:
        "https://www.zarinpal.com/pg/StartPay/" +
        authority,

      payment_id:
        paymentId

    });


  } catch {

    return json(
      {
        error:
          "ارتباط با درگاه پرداخت ناموفق بود."
      },
      502
    );

  }

}


// =============================================================
// PAYMENT VERIFY
// =============================================================

async function paymentVerifyApi(
  request,
  env
) {

  const url =
    new URL(request.url);

  const paymentId =
    url.searchParams.get(
      "payment_id"
    );

  const authority =
    url.searchParams.get(
      "Authority"
    );

  const status =
    url.searchParams.get(
      "Status"
    );


  if (!paymentId) {

    return Response.redirect(
      new URL(
        "/?payment=error",
        request.url
      ).toString(),
      302
    );

  }


  const payment =
    await env.DB.prepare(`
      SELECT *
      FROM payments
      WHERE id = ?
    `)
      .bind(paymentId)
      .first();


  if (!payment) {

    return Response.redirect(
      new URL(
        "/?payment=error&reason=payment-not-found",
        request.url
      ).toString(),
      302
    );

  }


  if (
    status !== "OK" ||
    !authority
  ) {

    await env.DB.prepare(`
      UPDATE payments
      SET status = 'cancelled'
      WHERE id = ?
    `)
      .bind(paymentId)
      .run();


    return Response.redirect(
      new URL(
        "/?payment=cancel",
        request.url
      ).toString(),
      302
    );

  }


  if (!env.ZARINPAL_MERCHANT_ID) {

    return Response.redirect(
      new URL(
        "/?payment=error&reason=merchant-not-configured",
        request.url
      ).toString(),
      302
    );

  }


  try {

    const response =
      await fetch(
        "https://payment.zarinpal.com/pg/v4/payment/verify.json",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({

              merchant_id:
                env.ZARINPAL_MERCHANT_ID,

              amount:
                Number(
                  payment.amount_toman
                ),

              authority

            })

          }
        );


    const data =
      await response.json();


    if (
      !response.ok ||
      !data.data
    ) {

      return Response.redirect(
        new URL(
          "/?payment=failed",
          request.url
        ).toString(),
        302
      );

    }


    const code =
      Number(
        data.data.code
      );


    if (
      code !== 100 &&
      code !== 101
    ) {

      await env.DB.prepare(`
        UPDATE payments
        SET status = 'failed'
        WHERE id = ?
      `)
        .bind(paymentId)
        .run();


      return Response.redirect(
        new URL(
          "/?payment=failed",
          request.url
        ).toString(),
        302
      );

    }


    const existingSubscription =
      await env.DB.prepare(`
        SELECT id
        FROM subscriptions
        WHERE user_id = ?
          AND plan_id = ?
          AND status = 'active'
          AND expires_at > ?
        ORDER BY expires_at DESC
        LIMIT 1
      `)
        .bind(
          payment.user_id,
          payment.plan_id,
          new Date().toISOString()
        )
        .first();


    if (existingSubscription) {

      await env.DB.prepare(`
        UPDATE subscriptions
        SET expires_at = ?
        WHERE id = ?
      `)
        .bind(
          addDays(30),
          existingSubscription.id
        )
        .run();

    } else {

      await env.DB.prepare(`
        INSERT INTO subscriptions
        (id,user_id,plan_id,starts_at,expires_at,status)
        VALUES (?,?,?,?,?,'active')
      `)
        .bind(
          randomHex(16),
          payment.user_id,
          payment.plan_id,
          new Date().toISOString(),
          addDays(30)
        )
        .run();

    }


    await env.DB.prepare(`
      UPDATE payments
      SET
        status = 'paid',
        paid_at = ?
      WHERE id = ?
    `)
      .bind(
        new Date().toISOString(),
        paymentId
      )
      .run();


    return Response.redirect(
      new URL(
        "/?payment=success",
        request.url
      ).toString(),
      302
    );


  } catch {

    return Response.redirect(
      new URL(
        "/?payment=error&reason=verify-error",
        request.url
      ).toString(),
      302
    );

  }

}


// =============================================================
// WITHDRAWAL
// =============================================================

async function withdrawalApi(
  request,
  env
) {

  const user =
    await requireUser(
      request,
      env
    );

  if (!user)
    return json(
      {
        error:
          "برای برداشت وارد حساب شوید."
      },
      401
    );


  const body =
    await bodyJson(request);

  const amount =
    Number(body.amount || 0);

  const method =
    String(
      body.method || "bank"
    );

  const destination =
    String(
      body.destination || ""
    ).trim();


  if (
    !Number.isFinite(amount) ||
    amount <= 0
  )
    return json(
      {
        error:
          "مبلغ برداشت معتبر نیست."
      },
      400
    );


  if (!destination)
    return json(
      {
        error:
          "مقصد برداشت را وارد کنید."
      },
      400
    );


  if (
    amount >
    Number(user.balance || 0)
  )
    return json(
      {
        error:
          "موجودی کافی نیست."
      },
      400
    );


  const withdrawalId =
    randomHex(16);


  /*
    مبلغ در زمان ثبت درخواست از موجودی
    رزرو می‌شود تا درخواست تکراری ایجاد نشود.
  */

  const result =
    await env.DB.prepare(`
      UPDATE users
      SET balance = balance - ?
      WHERE id = ?
        AND balance >= ?
    `)
      .bind(
        amount,
        user.id,
        amount
      )
      .run();


  if (
    !result.meta ||
    result.meta.changes !== 1
  )
    return json(
      {
        error:
          "موجودی کافی نیست."
      },
      400
    );


  await env.DB.prepare(`
    INSERT INTO withdrawals
    (id,user_id,amount,method,destination,status,created_at)
    VALUES (?,?,?,?,?,'pending',?)
  `)
    .bind(
      withdrawalId,
      user.id,
      amount,
      method,
      destination,
      new Date().toISOString()
    )
    .run();


  return json({
    message:
      "درخواست برداشت ثبت شد."
  });

}


// =============================================================
// MY WITHDRAWALS
// =============================================================

async function myWithdrawalsApi(
  request,
  env
) {

  const user =
    await requireUser(
      request,
      env
    );

  if (!user)
    return json(
      {
        error:
          "نشست نامعتبر است."
      },
      401
    );


  const rows =
    await env.DB.prepare(`
      SELECT
        id,
        amount,
        method,
        destination,
        status,
        created_at
      FROM withdrawals
      WHERE user_id = ?
      ORDER BY created_at DESC
    `)
      .bind(user.id)
      .all();


  return json({
    withdrawals:
      rows.results || []
  });

}


// =============================================================
// ADMIN LOGIN
// =============================================================

async function adminLoginApi(
  request,
  env
) {

  const body =
    await bodyJson(request);

  const password =
    String(
      body.password || ""
    );


  if (!env.ADMIN_PASSWORD)
    return json(
      {
        error:
          "ADMIN_PASSWORD در Worker تنظیم نشده است."
      },
      500
    );


  if (
    password !==
    env.ADMIN_PASSWORD
  )
    return json(
      {
        error:
          "رمز مدیریت اشتباه است."
      },
      401
    );


  const secret =
    env.JWT_SECRET ||
    env.ADMIN_PASSWORD;


  const token =
    await createToken(
      {
        admin: true,
        exp:
          Date.now() +
          12 * 60 * 60 * 1000
      },
      secret
    );


  return json({
    token
  });

}


// =============================================================
// ADMIN USERS
// =============================================================

async function adminUsersApi(
  request,
  env
) {

  if (
    !(await requireAdmin(
      request,
      env
    ))
  )
    return json(
      {
        error:
          "دسترسی غیرمجاز."
      },
      403
    );


  const rows =
    await env.DB.prepare(`
      SELECT
        id,
        name,
        email,
        balance,
        created_at
      FROM users
      ORDER BY created_at DESC
    `)
      .all();


  return json({
    users:
      rows.results || []
  });

}


// =============================================================
// ADMIN PAYMENTS
// =============================================================

async function adminPaymentsApi(
  request,
  env
) {

  if (
    !(await requireAdmin(
      request,
      env
    ))
  )
    return json(
      {
        error:
          "دسترسی غیرمجاز."
      },
      403
    );


  const rows =
    await env.DB.prepare(`
      SELECT
        p.*,
        u.email
      FROM payments p
      LEFT JOIN users u
        ON u.id = p.user_id
      ORDER BY p.created_at DESC
    `)
      .all();


  return json({
    payments:
      (rows.results || [])
        .map(x => ({

          id:
            x.id,

          email:
            x.email,

          plan_id:
            x.plan_id,

          amount_toman:
            x.amount_toman,

          status:
            x.status,

          authority:
            x.authority,

          created_at:
            x.created_at,

          paid_at:
            x.paid_at

        }))

  });

}


// =============================================================
// ADMIN WITHDRAWALS
// =============================================================

async function adminWithdrawalsApi(
  request,
  env
) {

  if (
    !(await requireAdmin(
      request,
      env
    ))
  )
    return json(
      {
        error:
          "دسترسی غیرمجاز."
      },
      403
    );


  const rows =
    await env.DB.prepare(`
      SELECT
        w.*,
        u.email
      FROM withdrawals w
      LEFT JOIN users u
        ON u.id = w.user_id
      ORDER BY w.created_at DESC
    `)
      .all();


  return json({
    withdrawals:
      rows.results || []
  });

}


// =============================================================
// ADMIN PROCESS WITHDRAWAL
// =============================================================

async function adminProcessWithdrawalApi(
  request,
  env
) {

  if (
    !(await requireAdmin(
      request,
      env
    ))
  )
    return json(
      {
        error:
          "دسترسی غیرمجاز."
      },
      403
    );


  const body =
    await bodyJson(request);

  const id =
    String(body.id || "");

  const action =
    String(body.action || "");


  if (
    !id ||
    ![
      "paid",
      "rejected"
    ].includes(action)
  )
    return json(
      {
        error:
          "عملیات نامعتبر است."
      },
      400
    );


  const withdrawal =
    await env.DB.prepare(`
      SELECT *
      FROM withdrawals
      WHERE id = ?
    `)
      .bind(id)
      .first();


  if (!withdrawal)
    return json(
      {
        error:
          "درخواست برداشت پیدا نشد."
      },
      404
    );


  if (
    withdrawal.status !==
    "pending"
  )
    return json(
      {
        error:
          "این درخواست قبلاً پردازش شده است."
      },
      400
    );


  if (
    action ===
    "rejected"
  ) {

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

  }


  await env.DB.prepare(`
    UPDATE withdrawals
    SET
      status = ?,
      processed_at = ?
    WHERE id = ?
  `)
    .bind(
      action,
      new Date().toISOString(),
      id
    )
    .run();


  return json({
    message:
      action === "paid"
        ? "برداشت پرداخت شد."
        : "درخواست برداشت رد شد و مبلغ به موجودی برگشت."
  });

}


// =============================================================
// HEALTH
// =============================================================

async function healthApi(
  env
) {

  return json({
    ok: true,
    service:
      "Abzarak AI",
    time:
      new Date().toISOString(),
    database:
      !!env.DB,
    ai:
      !!env.AI,
    resend:
      !!env.RESEND_API_KEY
  });

}


// =============================================================
// MAIN WORKER
// =============================================================

export default {

  async fetch(
    request,
    env,
    ctx
  ) {

    try {

      if (
        request.method ===
        "OPTIONS"
      ) {

        return cors(
          new Response(
            null,
            {
              status: 204
            }
          )
        );

      }


      await initDatabase(env);


      const url =
        new URL(request.url);

      const path =
        url.pathname;


      let response;


      // -------------------------------------------------------
      // HEALTH
      // -------------------------------------------------------

      if (
        path ===
        "/health"
      ) {

        response =
          await healthApi(env);

      }


      // -------------------------------------------------------
      // AUTH
      // -------------------------------------------------------

      else if (
        path ===
        "/api/signup" &&
        request.method === "POST"
      ) {

        response =
          await signupApi(
            request,
            env
          );

      }


      else if (
        path ===
        "/api/login" &&
        request.method === "POST"
      ) {

        response =
          await loginApi(
            request,
            env
          );

      }


      else if (
        path ===
        "/api/me" &&
        request.method === "GET"
      ) {

        response =
          await meApi(
            request,
            env
          );

      }


      // -------------------------------------------------------
      // PASSWORD RECOVERY
      // -------------------------------------------------------

      else if (
        path ===
        "/api/forgot-password" &&
        request.method === "POST"
      ) {

        response =
          await forgotPasswordApi(
            request,
            env
          );

      }


      else if (
        path ===
        "/api/reset-password" &&
        request.method === "POST"
      ) {

        response =
          await resetPasswordApi(
            request,
            env
          );

      }


      // -------------------------------------------------------
      // AI
      // -------------------------------------------------------

      else if (
        path ===
        "/api/ai/chat" &&
        request.method === "POST"
      ) {

        response =
          await aiChatApi(
            request,
            env
          );

      }


      // -------------------------------------------------------
      // PLANS
      // -------------------------------------------------------

      else if (
        path ===
        "/api/plans" &&
        request.method === "GET"
      ) {

        response =
          await plansApi(env);

      }


      // -------------------------------------------------------
      // PAYMENT
      // -------------------------------------------------------

      else if (
        path ===
        "/api/payment/request" &&
        request.method === "POST"
      ) {

        response =
          await paymentRequestApi(
            request,
            env
          );

      }


      else if (
        path ===
        "/api/payment/verify" &&
        request.method === "GET"
      ) {

        response =
          await paymentVerifyApi(
            request,
            env
          );

      }


      // -------------------------------------------------------
      // WITHDRAWAL
      // -------------------------------------------------------

      else if (
        path ===
        "/api/withdrawal" &&
        request.method === "POST"
      ) {

        response =
          await withdrawalApi(
            request,
            env
          );

      }


      else if (
        path ===
        "/api/my-withdrawals" &&
        request.method === "GET"
      ) {

        response =
          await myWithdrawalsApi(
            request,
            env
          );

      }


      // -------------------------------------------------------
      // ADMIN
      // -------------------------------------------------------

      else if (
        path ===
        "/api/admin/login" &&
        request.method === "POST"
      ) {

        response =
          await adminLoginApi(
            request,
            env
          );

      }


      else if (
        path ===
        "/api/admin/users" &&
        request.method === "GET"
      ) {

        response =
          await adminUsersApi(
            request,
            env
          );

      }


      else if (
        path ===
        "/api/admin/payments" &&
        request.method === "GET"
      ) {

        response =
          await adminPaymentsApi(
            request,
            env
          );

      }


      else if (
        path ===
        "/api/admin/withdrawals" &&
        request.method === "GET"
      ) {

        response =
          await adminWithdrawalsApi(
            request,
            env
          );

      }


      else if (
        path ===
        "/api/admin/withdrawals/process" &&
        request.method === "POST"
      ) {

        response =
          await adminProcessWithdrawalApi(
            request,
            env
          );

      }


      // -------------------------------------------------------
      // HOMEPAGE
      // -------------------------------------------------------

      else if (
        path === "/" ||
        path === "/index.html"
      ) {

        response =
          html(
            renderHomepage()
          );

      }


      // -------------------------------------------------------
      // 404
      // -------------------------------------------------------

      else {

        response =
          json(
            {
              error:
                "Not Found"
            },
            404
          );

      }


      return cors(response);


    } catch (error) {

      console.error(
        "WORKER ERROR:",
        error
      );


      return cors(
        json(
          {
            error:
              "خطای داخلی سرور.",
            details:
              error?.message ||
              String(error)
          },
          500
        )
      );

    }

  }

};
