// =============================================================
// worker.js — دستیار هوشمند: صفحه اصلی + احراز هویت + حساب + پلن‌ها + هوش مصنوعی
//            + بازیابی رمز + پنل مدیریت + پرداخت (Stripe - دلاری)
//
// Bindings required in Cloudflare dashboard:
//   DB -> D1 database
//   AI -> Workers AI binding
//
// Variables/Secrets required:
//   ADMIN_PASSWORD    -> رمز ورود به پنل مدیریت (از قبل دارید)
//   RESEND_API_KEY    -> کلید API سرویس Resend برای ارسال ایمیل بازیابی رمز
//   RESEND_FROM_EMAIL -> ایمیل فرستنده (مثلاً no-reply@yourdomain.com)
//   STRIPE_SECRET_KEY -> کلید مخفی Stripe (برای پرداخت دلاری)
//   STRIPE_WEBHOOK_SECRET -> کلید تایید وبهوک Stripe
//   PUBLIC_BASE_URL   -> آدرس کامل سایت، مثل https://xxxx.workers.dev
// =============================================================

// ---------------- Utilities ----------------

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
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function uuid() {
  return crypto.randomUUID();
}

function randomCode(len = 6) {
  const digits = "0123456789";
  let out = "";
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  for (let i = 0; i < len; i++) {
    out += digits[bytes[i] % digits.length];
  }
  return out;
}

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
  const parts = stored.split(":");

  if (parts.length !== 4 || parts[0] !== "pbkdf2") {
    return false;
  }

  const iterations = parseInt(parts[1], 10);

  const saltBytes = new Uint8Array(
    parts[2].match(/.{1,2}/g).map((b) => parseInt(b, 16))
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
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function getUserFromToken(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");

  if (!token) return null;

  const session = await env.DB
    .prepare("SELECT user_id FROM sessions WHERE token = ?")
    .bind(token)
    .first();

  if (!session) return null;

  const user = await env.DB
    .prepare(
      "SELECT id, name, email, balance FROM users WHERE id = ?"
    )
    .bind(session.user_id)
    .first();

  return user || null;
}

function getAdminToken(request) {
  const auth = request.headers.get("Authorization") || "";
  return auth.replace(/^Bearer\s+/i, "");
}

async function requireAdmin(request, env) {
  const token = getAdminToken(request);
  if (!token) return false;

  const session = await env.DB
    .prepare(
      "SELECT id FROM admin_sessions WHERE token = ?"
    )
    .bind(token)
    .first();

  return !!session;
}

// ---------------- Email sending (Resend) ----------------

async function sendEmail(env, to, subject, htmlBody) {
  if (!env.RESEND_API_KEY) {
    return {
      ok: false,
      error:
        "سرویس ایمیل تنظیم نشده است (RESEND_API_KEY وجود ندارد)",
    };
  }

  const fromEmail =
    env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { ok: false, error: errText };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err?.message || String(err) };
  }
}

// ---------------- Auth routes ----------------

async function handleSignup(request, env) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json({ error: "بدنه درخواست نامعتبر است" }, 400);
  }

  const { name, email, password } = body;

  if (!email || !password) {
    return json({ error: "ایمیل و رمز عبور الزامی است" }, 400);
  }

  if (!isValidEmail(email)) {
    return json({ error: "فرمت ایمیل نامعتبر است" }, 400);
  }

  if (password.length < 6) {
    return json(
      { error: "رمز عبور باید حداقل ۶ کاراکتر باشد" },
      400
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await env.DB
    .prepare("SELECT id FROM users WHERE email = ?")
    .bind(normalizedEmail)
    .first();

  if (existing) {
    return json(
      { error: "این ایمیل قبلاً ثبت‌نام کرده است" },
      409
    );
  }

  const passwordHash = await hashPassword(password);
  const userId = uuid();
  const createdAt = new Date().toISOString();

  await env.DB
    .prepare(
      "INSERT INTO users (id, name, email, password_hash, balance, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(userId, name || "", normalizedEmail, passwordHash, 0, createdAt)
    .run();

  const token = uuid() + uuid();

  await env.DB
    .prepare(
      "INSERT INTO sessions (id, user_id, token, created_at) VALUES (?, ?, ?, ?)"
    )
    .bind(uuid(), userId, token, createdAt)
    .run();

  return json({
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
    return json({ error: "بدنه درخواست نامعتبر است" }, 400);
  }

  const { email, password } = body;

  if (!email || !password) {
    return json({ error: "ایمیل و رمز عبور الزامی است" }, 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await env.DB
    .prepare(
      "SELECT id, name, email, password_hash, balance FROM users WHERE email = ?"
    )
    .bind(normalizedEmail)
    .first();

  const genericError = { error: "ایمیل یا رمز عبور اشتباه است" };

  if (!user) {
    return json(genericError, 401);
  }

  const isValid = await verifyPassword(password, user.password_hash);

  if (!isValid) {
    if (!user.password_hash.startsWith("pbkdf2:")) {
      return json(
        {
          error: "رمز عبور این حساب نیاز به بازیابی دارد (فرمت قدیمی)",
        },
        401
      );
    }
    return json(genericError, 401);
  }

  const token = uuid() + uuid();

  await env.DB
    .prepare(
      "INSERT INTO sessions (id, user_id, token, created_at) VALUES (?, ?, ?, ?)"
    )
    .bind(uuid(), user.id, token, new Date().toISOString())
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

async function handleMe(request, env) {
  const user = await getUserFromToken(request, env);

  if (!user) {
    return json({ error: "نشست نامعتبر یا منقضی شده است" }, 401);
  }

  return json({ user });
}

// ---------------- Password reset ----------------

async function handleForgotPassword(request, env) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json({ error: "بدنه درخواست نامعتبر است" }, 400);
  }

  const { email } = body;

  if (!email || !isValidEmail(email)) {
    return json({ error: "ایمیل معتبر وارد کنید" }, 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await env.DB
    .prepare("SELECT id FROM users WHERE email = ?")
    .bind(normalizedEmail)
    .first();

  // به دلایل امنیتی، حتی اگر کاربر پیدا نشد پیام یکسان می‌دهیم
  if (!user) {
    return json({
      success: true,
      message: "اگر این ایمیل ثبت شده باشد، کد بازیابی ارسال می‌شود.",
    });
  }

  const code = randomCode(6);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  await env.DB
    .prepare(
      "INSERT INTO reset_codes (id, user_id, code, expires_at, used, created_at) VALUES (?, ?, ?, ?, 0, ?)"
    )
    .bind(uuid(), user.id, code, expiresAt, new Date().toISOString())
    .run();

  const emailResult = await sendEmail(
    env,
    normalizedEmail,
    "کد بازیابی رمز عبور",
    `<div dir="rtl" style="font-family:Tahoma,sans-serif;">
       <p>کد بازیابی رمز عبور شما:</p>
       <h2 style="letter-spacing:4px;">${code}</h2>
       <p>این کد تا ۱۵ دقیقه دیگر معتبر است.</p>
     </div>`
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
    message: "کد بازیابی به ایمیل شما ارسال شد.",
  });
}

async function handleResetPassword(request, env) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json({ error: "بدنه درخواست نامعتبر است" }, 400);
  }

  const { email, code, newPassword } = body;

  if (!email || !code || !newPassword) {
    return json(
      { error: "ایمیل، کد و رمز جدید الزامی است" },
      400
    );
  }

  if (newPassword.length < 6) {
    return json(
      { error: "رمز عبور باید حداقل ۶ کاراکتر باشد" },
      400
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await env.DB
    .prepare("SELECT id FROM users WHERE email = ?")
    .bind(normalizedEmail)
    .first();

  if (!user) {
    return json({ error: "کد نامعتبر یا منقضی شده است" }, 400);
  }

  const resetRow = await env.DB
    .prepare(
      "SELECT id, expires_at, used FROM reset_codes WHERE user_id = ? AND code = ? ORDER BY created_at DESC LIMIT 1"
    )
    .bind(user.id, code)
    .first();

  if (!resetRow) {
    return json({ error: "کد نامعتبر یا منقضی شده است" }, 400);
  }

  if (resetRow.used) {
    return json({ error: "این کد قبلاً استفاده شده است" }, 400);
  }

  if (new Date(resetRow.expires_at).getTime() < Date.now()) {
    return json({ error: "کد منقضی شده است" }, 400);
  }

  const newHash = await hashPassword(newPassword);

  await env.DB
    .prepare("UPDATE users SET password_hash = ? WHERE id = ?")
    .bind(newHash, user.id)
    .run();

  await env.DB
    .prepare("UPDATE reset_codes SET used = 1 WHERE id = ?")
    .bind(resetRow.id)
    .run();

  // همه نشست‌های قبلی این کاربر باطل می‌شود برای امنیت بیشتر
  await env.DB
    .prepare("DELETE FROM sessions WHERE user_id = ?")
    .bind(user.id)
    .run();

  return json({
    success: true,
    message: "رمز عبور با موفقیت تغییر کرد. اکنون وارد شوید.",
  });
}

// =============================================================
// AI CHAT
// =============================================================

async function handleAiChat(request, env) {
  const user = await getUserFromToken(request, env);

  if (!user) {
    return json(
      { error: "برای استفاده از هوش مصنوعی ابتدا وارد حساب شوید" },
      401
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json({ error: "بدنه درخواست نامعتبر است" }, 400);
  }

  const { message } = body;

  if (!message || typeof message !== "string") {
    return json({ error: "پیام الزامی است" }, 400);
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
    const aiResponse = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct-fast",
      {
        messages: [
          {
            role: "system",
            content:
              "تو یک دستیار هوشمند فارسی‌زبان هستی. مفید، دقیق، کوتاه و مودب پاسخ بده.",
          },
          { role: "user", content: message },
        ],
        max_tokens: 512,
        temperature: 0.6,
      }
    );

    const reply =
      aiResponse?.response ||
      aiResponse?.result?.response ||
      "پاسخی از هوش مصنوعی دریافت نشد.";

    return json({ success: true, reply });
  } catch (err) {
    console.error("Workers AI Error:", err);
    return json(
      {
        error:
          "خطا در ارتباط با هوش مصنوعی: " +
          (err?.message || String(err)),
      },
      500
    );
  }
}

// ---------------- Plans route ----------------

const PLANS = [
  {
    id: "free",
    name: "رایگان",
    price_usd: 0,
    period: "monthly",
    messages_per_day: 10,
    features: ["۱۰ پیام در روز"],
  },
  {
    id: "basic",
    name: "پایه",
    price_usd: 9,
    period: "monthly",
    messages_per_day: null,
    features: ["پیام نامحدود", "امکانات پایه"],
  },
  {
    id: "plus",
    name: "پیشرفته",
    price_usd: 19,
    period: "monthly",
    messages_per_day: null,
    features: ["پیام نامحدود", "پاسخ سریع‌تر"],
  },
  {
    id: "pro",
    name: "ویژه",
    price_usd: 39,
    period: "monthly",
    messages_per_day: null,
    features: ["پیام نامحدود", "اولویت صف پاسخ‌دهی", "پشتیبانی اختصاصی"],
  },
];

async function handlePlans(request, env) {
  return json({ plans: PLANS });
}

// =============================================================
// PAYMENTS (Stripe - USD)
// =============================================================

async function handleCreateCheckout(request, env) {
  const user = await getUserFromToken(request, env);

  if (!user) {
    return json({ error: "ابتدا وارد حساب شوید" }, 401);
  }

  if (!env.STRIPE_SECRET_KEY) {
    return json(
      {
        error:
          "درگاه پرداخت هنوز تنظیم نشده است. STRIPE_SECRET_KEY را اضافه کنید.",
      },
      503
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "بدنه درخواست نامعتبر است" }, 400);
  }

  const { planId } = body;
  const plan = PLANS.find((p) => p.id === planId);

  if (!plan || plan.price_usd <= 0) {
    return json({ error: "پلن نامعتبر است" }, 400);
  }

  const baseUrl = env.PUBLIC_BASE_URL || new URL(request.url).origin;

  try {
    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("success_url", `${baseUrl}/?payment=success`);
    params.set("cancel_url", `${baseUrl}/?payment=cancel`);
    params.set("customer_email", user.email);
    params.set("line_items[0][quantity]", "1");
    params.set(
      "line_items[0][price_data][currency]",
      "usd"
    );
    params.set(
      "line_items[0][price_data][unit_amount]",
      String(Math.round(plan.price_usd * 100))
    );
    params.set(
      "line_items[0][price_data][product_data][name]",
      `اشتراک ${plan.name}`
    );
    params.set("metadata[user_id]", user.id);
    params.set("metadata[plan_id]", plan.id);

    const res = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return json(
        { error: "خطای Stripe: " + (data?.error?.message || "نامشخص") },
        502
      );
    }

    await env.DB
      .prepare(
        "INSERT INTO payments (id, user_id, plan_id, amount_usd, status, stripe_session_id, created_at) VALUES (?, ?, ?, ?, 'pending', ?, ?)"
      )
      .bind(
        uuid(),
        user.id,
        plan.id,
        plan.price_usd,
        data.id,
        new Date().toISOString()
      )
      .run();

    return json({ success: true, checkout_url: data.url });
  } catch (err) {
    return json(
      { error: "خطا در ساخت پرداخت: " + (err?.message || String(err)) },
      500
    );
  }
}

async function handleStripeWebhook(request, env) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return json({ error: "وبهوک تنظیم نشده است" }, 503);
  }

  // توجه: تایید امضای Stripe (signature verification) در این نسخه
  // پیاده‌سازی نشده و باید قبل از استفاده در محیط واقعی اضافه شود.
  let event;
  try {
    event = await request.json();
  } catch {
    return json({ error: "بدنه نامعتبر" }, 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id;
    const planId = session.metadata?.plan_id;

    if (userId && planId) {
      await env.DB
        .prepare(
          "UPDATE payments SET status = 'paid' WHERE stripe_session_id = ?"
        )
        .bind(session.id)
        .run();

      await env.DB
        .prepare(
          "INSERT INTO subscriptions (id, user_id, plan_id, status, started_at) VALUES (?, ?, ?, 'active', ?)"
        )
        .bind(uuid(), userId, planId, new Date().toISOString())
        .run();
    }
  }

  return json({ received: true });
}

// =============================================================
// ADMIN PANEL
// =============================================================

async function handleAdminLogin(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "بدنه درخواست نامعتبر است" }, 400);
  }

  const { password } = body;

  if (!env.ADMIN_PASSWORD) {
    return json({ error: "رمز مدیریت تنظیم نشده است" }, 503);
  }

  if (password !== env.ADMIN_PASSWORD) {
    return json({ error: "رمز اشتباه است" }, 401);
  }

  const token = uuid() + uuid();

  await env.DB
    .prepare(
      "INSERT INTO admin_sessions (id, token, created_at) VALUES (?, ?, ?)"
    )
    .bind(uuid(), token, new Date().toISOString())
    .run();

  return json({ success: true, token });
}

async function handleAdminUsers(request, env) {
  const isAdmin = await requireAdmin(request, env);
  if (!isAdmin) return json({ error: "دسترسی غیرمجاز" }, 401);

  const { results } = await env.DB
    .prepare(
      "SELECT id, name, email, balance, created_at FROM users ORDER BY created_at DESC LIMIT 200"
    )
    .all();

  return json({ users: results });
}

async function handleAdminPayments(request, env) {
  const isAdmin = await requireAdmin(request, env);
  if (!isAdmin) return json({ error: "دسترسی غیرمجاز" }, 401);

  const { results } = await env.DB
    .prepare(
      `SELECT payments.id, payments.plan_id, payments.amount_usd, payments.status,
              payments.created_at, users.email
       FROM payments
       JOIN users ON users.id = payments.user_id
       ORDER BY payments.created_at DESC LIMIT 200`
    )
    .all();

  return json({ payments: results });
}

// ---------------- Homepage HTML ----------------

function renderHomepage() {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>دستیار هوشمند 🤖</title>
<style>
* { box-sizing: border-box; }
body { font-family: Tahoma, sans-serif; margin: 0; background: #f4f6fb; color: #1a1a2e; }
header { background: #12163a; color: white; padding: 20px; }
header h1 { margin: 0; font-size: 1.4rem; }
header p { margin: 6px 0 0; opacity: 0.8; font-size: 0.85rem; }
nav { display: flex; gap: 10px; padding: 16px; flex-wrap: wrap; background: white; }
nav button { background: #2952e3; color: white; border: none; border-radius: 10px; padding: 12px 18px; font-size: 0.95rem; cursor: pointer; }
main { padding: 20px; max-width: 480px; margin: 0 auto; }
.card { background: white; border-radius: 16px; padding: 24px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.card h2 { margin-top: 0; text-align: right; }
input { width: 100%; padding: 12px; margin: 8px 0; border-radius: 10px; border: 1px solid #dcdfe8; background: #f0f2fa; font-size: 1rem; }
.actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px; flex-wrap: wrap; }
.actions button { padding: 10px 20px; border-radius: 10px; border: none; cursor: pointer; font-size: 0.95rem; }
.btn-primary { background: #2952e3; color: white; }
.btn-secondary { background: #6b7280; color: white; }
.link-btn { background: none; color: #2952e3; text-decoration: underline; padding: 4px; font-size: 0.85rem; }
.msg { padding: 12px; border-radius: 10px; margin-top: 10px; }
.msg.error { background: #fdeaea; color: #b91c1c; }
.msg.success { background: #eafaf0; color: #15803d; }
.hidden { display: none; }
.chat-box { max-height: 320px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.bubble { padding: 10px 14px; border-radius: 12px; max-width: 85%; white-space: pre-wrap; word-break: break-word; }
.bubble.user { background: #2952e3; color: white; align-self: flex-start; }
.bubble.ai { background: #eef0f7; align-self: flex-end; }
table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
table th, table td { border: 1px solid #e5e7eb; padding: 6px; text-align: right; }
table th { background: #f0f2fa; }
.plan-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px; margin-bottom: 10px; }
.plan-price { color: #2952e3; font-size: 1.1rem; }
</style>
</head>
<body>

<header>
  <h1>🤖 دستیار هوش مصنوعی</h1>
  <p>دستیار هوشمند • حساب کاربری</p>
</header>

<nav>
  <button onclick="showView('account')">🏠 حساب</button>
  <button onclick="showView('ai')">🤖 هوش مصنوعی</button>
  <button onclick="showView('plans')">💰 پلن‌ها</button>
  <button onclick="showView('admin-login')">🛠️ مدیریت</button>
</nav>

<main>

  <div id="view-login" class="card">
    <h2>🔑 ورود به حساب</h2>
    <input id="login-email" type="email" placeholder="ایمیل">
    <input id="login-password" type="password" placeholder="رمز عبور">
    <div class="actions">
      <button class="link-btn" onclick="showView('forgot')">فراموشی رمز عبور؟</button>
    </div>
    <div class="actions">
      <button class="btn-secondary" onclick="showView('signup')">ثبت‌نام</button>
      <button class="btn-primary" onclick="doLogin()">ورود</button>
    </div>
    <div id="login-msg"></div>
  </div>

  <div id="view-signup" class="card hidden">
    <h2>📝 ثبت‌نام</h2>
    <input id="signup-name" type="text" placeholder="نام">
    <input id="signup-email" type="email" placeholder="ایمیل">
    <input id="signup-password" type="password" placeholder="رمز عبور (حداقل ۶ کاراکتر)">
    <div class="actions">
      <button class="btn-secondary" onclick="showView('login')">بازگشت</button>
      <button class="btn-primary" onclick="doSignup()">ثبت‌نام</button>
    </div>
    <div id="signup-msg"></div>
  </div>

  <div id="view-forgot" class="card hidden">
    <h2>🔐 فراموشی رمز عبور</h2>
    <p style="font-size:0.85rem;color:#555;">ایمیل خود را وارد کنید تا کد بازیابی برایتان ارسال شود.</p>
    <input id="forgot-email" type="email" placeholder="ایمیل">
    <div class="actions">
      <button class="btn-secondary" onclick="showView('login')">بازگشت</button>
      <button class="btn-primary" onclick="doForgotPassword()">ارسال کد</button>
    </div>
    <div id="forgot-msg"></div>

    <hr style="margin:16px 0;border:none;border-top:1px solid #eee;">

    <p style="font-size:0.85rem;color:#555;">کد دریافتی و رمز جدید را وارد کنید:</p>
    <input id="reset-code" type="text" placeholder="کد ۶ رقمی">
    <input id="reset-password" type="password" placeholder="رمز عبور جدید">
    <div class="actions">
      <button class="btn-primary" onclick="doResetPassword()">تغییر رمز عبور</button>
    </div>
    <div id="reset-msg"></div>
  </div>

  <div id="view-account" class="card hidden">
    <h2>🏠 حساب من</h2>
    <div id="account-info">در حال بارگذاری...</div>
    <div class="actions">
      <button class="btn-secondary" onclick="logout()">خروج</button>
    </div>
  </div>

  <div id="view-ai" class="card hidden">
    <h2>🤖 گفتگو با هوش مصنوعی</h2>
    <div class="chat-box" id="chat-box"></div>
    <input id="ai-input" type="text" placeholder="پیام خود را بنویسید..." onkeydown="if(event.key === 'Enter') sendAiMessage()">
    <div class="actions">
      <button class="btn-primary" onclick="sendAiMessage()">ارسال</button>
    </div>
    <div id="ai-msg"></div>
  </div>

  <div id="view-plans" class="card hidden">
    <h2>💰 پلن‌ها (قیمت به دلار)</h2>
    <div id="plans-list">در حال بارگذاری...</div>
  </div>

  <div id="view-admin-login" class="card hidden">
    <h2>🛠️ ورود به پنل مدیریت</h2>
    <input id="admin-password" type="password" placeholder="رمز مدیریت">
    <div class="actions">
      <button class="btn-secondary" onclick="showView('login')">بازگشت</button>
      <button class="btn-primary" onclick="doAdminLogin()">ورود</button>
    </div>
    <div id="admin-login-msg"></div>
  </div>

  <div id="view-admin-panel" class="card hidden">
    <h2>🛠️ پنل مدیریت</h2>
    <div class="actions">
      <button class="btn-secondary" onclick="loadAdminUsers()">کاربران</button>
      <button class="btn-secondary" onclick="loadAdminPayments()">تراکنش‌ها</button>
      <button class="btn-secondary" onclick="adminLogout()">خروج از مدیریت</button>
    </div>
    <div id="admin-content" style="margin-top:14px;overflow-x:auto;"></div>
  </div>

</main>

<script>

let token = localStorage.getItem('token') || null;
let adminToken = localStorage.getItem('adminToken') || null;

function showMsg(elId, text, type) {
  const el = document.getElementById(elId);
  el.innerHTML = '<div class="msg ' + type + '">' + escapeHtml(text) + '</div>';
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showView(name) {
  const views = ['login', 'signup', 'forgot', 'account', 'ai', 'plans', 'admin-login', 'admin-panel'];
  views.forEach(v => {
    document.getElementById('view-' + v).classList.add('hidden');
  });

  if ((name === 'account' || name === 'ai') && !token) {
    name = 'login';
  }

  if (name === 'admin-panel' && !adminToken) {
    name = 'admin-login';
  }

  document.getElementById('view-' + name).classList.remove('hidden');

  if (name === 'account') loadAccount();
  if (name === 'plans') loadPlans();
  if (name === 'admin-panel') loadAdminUsers();
}

async function doSignup() {
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  try {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      showMsg('signup-msg', data.error || ('خطای ناشناخته (کد ' + res.status + ')'), 'error');
      return;
    }

    token = data.token;
    localStorage.setItem('token', token);
    showView('account');
  } catch (err) {
    showMsg('signup-msg', 'خطای فنی: ' + err.message, 'error');
  }
}

async function doLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      showMsg('login-msg', data.error || ('خطای ناشناخته (کد ' + res.status + ')'), 'error');
      return;
    }

    token = data.token;
    localStorage.setItem('token', token);
    showView('account');
  } catch (err) {
    showMsg('login-msg', 'خطای فنی: ' + err.message, 'error');
  }
}

async function doForgotPassword() {
  const email = document.getElementById('forgot-email').value;

  try {
    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();

    if (!res.ok) {
      showMsg('forgot-msg', data.error || ('خطای ناشناخته (کد ' + res.status + ')'), 'error');
      return;
    }

    showMsg('forgot-msg', data.message || 'کد ارسال شد.', 'success');
  } catch (err) {
    showMsg('forgot-msg', 'خطای فنی: ' + err.message, 'error');
  }
}

async function doResetPassword() {
  const email = document.getElementById('forgot-email').value;
  const code = document.getElementById('reset-code').value;
  const newPassword = document.getElementById('reset-password').value;

  try {
    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword })
    });
    const data = await res.json();

    if (!res.ok) {
      showMsg('reset-msg', data.error || ('خطای ناشناخته (کد ' + res.status + ')'), 'error');
      return;
    }

    showMsg('reset-msg', data.message || 'رمز تغییر کرد.', 'success');
    setTimeout(() => showView('login'), 1500);
  } catch (err) {
    showMsg('reset-msg', 'خطای فنی: ' + err.message, 'error');
  }
}

function logout() {
  token = null;
  localStorage.removeItem('token');
  showView('login');
}

async function loadAccount() {
  try {
    const res = await fetch('/api/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();

    if (!res.ok) {
      logout();
      return;
    }

    document.getElementById('account-info').innerHTML =
      '<p><b>نام:</b> ' + escapeHtml(data.user.name || '-') + '</p>' +
      '<p><b>ایمیل:</b> ' + escapeHtml(data.user.email) + '</p>' +
      '<p><b>موجودی:</b> ' + escapeHtml(data.user.balance) + '</p>';
  } catch (err) {
    document.getElementById('account-info').innerHTML =
      '<div class="msg error">خطا در دریافت حساب: ' + escapeHtml(err.message) + '</div>';
  }
}

async function loadPlans() {
  try {
    const res = await fetch('/api/plans');
    const data = await res.json();

    document.getElementById('plans-list').innerHTML = data.plans.map(p =>
      '<div class="plan-card">' +
        '<b>' + escapeHtml(p.name) + '</b><br>' +
        '<span class="plan-price">' +
          (p.price_usd > 0 ? '$' + p.price_usd + ' / ماهانه' : 'رایگان') +
        '</span><br>' +
        '<ul style="margin:6px 0 0;padding-right:18px;">' +
          p.features.map(f => '<li>' + escapeHtml(f) + '</li>').join('') +
        '</ul>' +
        (p.price_usd > 0
          ? '<div class="actions"><button class="btn-primary" onclick="buyPlan(\\'' + p.id + '\\')">خرید این پلن</button></div>'
          : '') +
      '</div>'
    ).join('');
  } catch (err) {
    document.getElementById('plans-list').innerHTML =
      '<div class="msg error">خطا در دریافت پلن‌ها: ' + escapeHtml(err.message) + '</div>';
  }
}

async function buyPlan(planId) {
  if (!token) {
    showView('login');
    return;
  }

  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ planId })
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'خطا در ساخت پرداخت');
      return;
    }

    window.location.href = data.checkout_url;
  } catch (err) {
    alert('خطای فنی: ' + err.message);
  }
}

async function sendAiMessage() {
  if (!token) {
    showView('login');
    return;
  }

  const input = document.getElementById('ai-input');
  const message = input.value.trim();
  if (!message) return;

  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML += '<div class="bubble user">' + escapeHtml(message) + '</div>';
  input.value = '';
  document.getElementById('ai-msg').innerHTML = '';

  const sendButton = document.querySelector('#view-ai .btn-primary');
  if (sendButton) {
    sendButton.disabled = true;
    sendButton.textContent = 'در حال پاسخ...';
  }

  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ message })
    });
    const data = await res.json();

    if (!res.ok) {
      showMsg('ai-msg', data.error || ('خطای ناشناخته (کد ' + res.status + ')'), 'error');
      return;
    }

    chatBox.innerHTML += '<div class="bubble ai">' + escapeHtml(data.reply || 'پاسخی دریافت نشد.') + '</div>';
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    showMsg('ai-msg', 'خطای فنی: ' + err.message, 'error');
  } finally {
    if (sendButton) {
      sendButton.disabled = false;
      sendButton.textContent = 'ارسال';
    }
  }
}

async function doAdminLogin() {
  const password = document.getElementById('admin-password').value;

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();

    if (!res.ok) {
      showMsg('admin-login-msg', data.error || 'خطا', 'error');
      return;
    }

    adminToken = data.token;
    localStorage.setItem('adminToken', adminToken);
    showView('admin-panel');
  } catch (err) {
    showMsg('admin-login-msg', 'خطای فنی: ' + err.message, 'error');
  }
}

function adminLogout() {
  adminToken = null;
  localStorage.removeItem('adminToken');
  showView('login');
}

async function loadAdminUsers() {
  const content = document.getElementById('admin-content');
  content.innerHTML = 'در حال بارگذاری...';

  try {
    const res = await fetch('/api/admin/users', {
      headers: { 'Authorization': 'Bearer ' + adminToken }
    });
    const data = await res.json();

    if (!res.ok) {
      content.innerHTML = '<div class="msg error">' + escapeHtml(data.error || 'خطا') + '</div>';
      return;
    }

    content.innerHTML = '<table><tr><th>نام</th><th>ایمیل</th><th>موجودی</th><th>تاریخ ثبت‌نام</th></tr>' +
      data.users.map(u =>
        '<tr><td>' + escapeHtml(u.name || '-') + '</td><td>' + escapeHtml(u.email) +
        '</td><td>' + escapeHtml(u.balance) + '</td><td>' + escapeHtml(u.created_at) + '</td></tr>'
      ).join('') + '</table>';
  } catch (err) {
    content.innerHTML = '<div class="msg error">خطای فنی: ' + escapeHtml(err.message) + '</div>';
  }
}

async function loadAdminPayments() {
  const content = document.getElementById('admin-content');
  content.innerHTML = 'در حال بارگذاری...';

  try {
    const res = await fetch('/api/admin/payments', {
      headers: { 'Authorization': 'Bearer ' + adminToken }
    });
    const data = await res.json();

    if (!res.ok) {
      content.innerHTML = '<div class="msg error">' + escapeHtml(data.error || 'خطا') + '</div>';
      return;
    }

    content.innerHTML = '<table><tr><th>ایمیل</th><th>پلن</th><th>مبلغ ($)</th><th>وضعیت</th><th>تاریخ</th></tr>' +
      data.payments.map(p =>
        '<tr><td>' + escapeHtml(p.email) + '</td><td>' + escapeHtml(p.plan_id) +
        '</td><td>' + escapeHtml(p.amount_usd) + '</td><td>' + escapeHtml(p.status) +
        '</td><td>' + escapeHtml(p.created_at) + '</td></tr>'
      ).join('') + '</table>';
  } catch (err) {
    content.innerHTML = '<div class="msg error">خطای فنی: ' + escapeHtml(err.message) + '</div>';
  }
}

// Initial view
showView(token ? 'account' : 'login');

</script>

</body>
</html>`;
}

// ---------------- Router ----------------

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return json({}, 204);
    }

    if (url.pathname === "/" && request.method === "GET") {
      return html(renderHomepage());
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

    if (url.pathname === "/api/forgot-password" && request.method === "POST") {
      return handleForgotPassword(request, env);
    }

    if (url.pathname === "/api/reset-password" && request.method === "POST") {
      return handleResetPassword(request, env);
    }

    if (url.pathname === "/api/plans" && request.method === "GET") {
      return handlePlans(request, env);
    }

    if (url.pathname === "/api/ai/chat" && request.method === "POST") {
      return handleAiChat(request, env);
    }

    if (url.pathname === "/api/checkout" && request.method === "POST") {
      return handleCreateCheckout(request, env);
    }

    if (url.pathname === "/api/stripe/webhook" && request.method === "POST") {
      return handleStripeWebhook(request, env);
    }

    if (url.pathname === "/api/admin/login" && request.method === "POST") {
      return handleAdminLogin(request, env);
    }

    if (url.pathname === "/api/admin/users" && request.method === "GET") {
      return handleAdminUsers(request, env);
    }

    if (url.pathname === "/api/admin/payments" && request.method === "GET") {
      return handleAdminPayments(request, env);
    }

    return json({ error: "مسیر یافت نشد" }, 404);
  },
};
