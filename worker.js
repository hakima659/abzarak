// =============================================================
// تابع تایید امضای Stripe (signature verification)
// این تابع رو باید به بخش "Email sending (Resend)" یا هرجای
// مناسب دیگه توی worker.js اضافه کنی — قبل از handleStripeWebhook
// =============================================================

async function verifyStripeSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader) {
    return { valid: false, reason: "هدر Stripe-Signature وجود ندارد" };
  }

  // پارس کردن هدر: "t=1614556800,v1=abcdef123..."
  const parts = signatureHeader.split(",").reduce((acc, part) => {
    const [key, value] = part.split("=");
    if (key === "t") acc.timestamp = value;
    if (key === "v1") acc.signatures = acc.signatures || [];
    if (key === "v1") acc.signatures.push(value);
    return acc;
  }, {});

  if (!parts.timestamp || !parts.signatures || parts.signatures.length === 0) {
    return { valid: false, reason: "فرمت هدر Stripe-Signature نامعتبر است" };
  }

  // جلوگیری از replay attack: رد کردن رویدادهای قدیمی‌تر از ۵ دقیقه
  const timestampSeconds = parseInt(parts.timestamp, 10);
  const nowSeconds = Math.floor(Date.now() / 1000);
  const tolerance = 5 * 60; // ۵ دقیقه

  if (Math.abs(nowSeconds - timestampSeconds) > tolerance) {
    return { valid: false, reason: "زمان رویداد خیلی قدیمی یا نامعتبر است (احتمال replay attack)" };
  }

  // ساخت signed_payload طبق مستندات Stripe: "{timestamp}.{raw_body}"
  const signedPayload = `${parts.timestamp}.${rawBody}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signedPayload)
  );

  const computedSignature = [...new Uint8Array(signatureBuffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // مقایسه timing-safe با تمام امضاهای v1 موجود در هدر
  // (Stripe ممکنه چند نسخه امضا بفرسته موقع rotate کردن secret)
  const isValid = parts.signatures.some((sig) =>
    timingSafeEqual(sig, computedSignature)
  );

  if (!isValid) {
    return { valid: false, reason: "امضا با مقدار محاسبه‌شده مطابقت ندارد" };
  }

  return { valid: true };
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// =============================================================
// نسخه اصلاح‌شده handleStripeWebhook
// این تابع باید جایگزین نسخه فعلی توی worker.js بشه
// =============================================================

async function handleStripeWebhook(request, env) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return json({ error: "وبهوک تنظیم نشده است" }, 503);
  }

  // مهم: باید raw body رو قبل از parse کردن JSON بخونیم،
  // چون امضا روی متن خام محاسبه شده، نه روی آبجکت parse‌شده
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("Stripe-Signature");

  const verification = await verifyStripeSignature(
    rawBody,
    signatureHeader,
    env.STRIPE_WEBHOOK_SECRET
  );

  if (!verification.valid) {
    console.error("Stripe webhook signature verification failed:", verification.reason);
    return json({ error: "امضای نامعتبر: " + verification.reason }, 400);
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return json({ error: "بدنه نامعتبر" }, 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id;
    const planId = session.metadata?.plan_id;

    if (userId && planId) {
      // جلوگیری از پردازش تکراری همان session
      // (Stripe ممکنه یک event رو بیش از یک بار بفرسته)
      const existingPayment = await env.DB
        .prepare("SELECT status FROM payments WHERE stripe_session_id = ?")
        .bind(session.id)
        .first();

      if (existingPayment && existingPayment.status === "paid") {
        // قبلاً پردازش شده، دوباره subscription نسازیم
        return json({ received: true, note: "already processed" });
      }

      await env.DB
        .prepare(
          "UPDATE payments SET status = 'paid', ref_id = ? WHERE stripe_session_id = ?"
        )
        .bind(session.payment_intent || "", session.id)
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
