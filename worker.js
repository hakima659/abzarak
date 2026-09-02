
// =============================================================
// AI Assistant — Cloudflare Worker + D1 + OpenAI + ZarinPal
// نسخه اصلاح‌شده برای D1 فعلی
// =============================================================

const PLANS = [
  { id: "p400",  title: "پلن ۴۰۰ هزار تومان",  irr: 400000,  usd: 6 },
  { id: "p700",  title: "پلن ۷۰۰ هزار تومان",  irr: 700000,  usd: 10 },
  { id: "p1000", title: "پلن ۱ میلیون تومان",   irr: 1000000, usd: 15 },
  { id: "p1500", title: "پلن ۱.۵ میلیون تومان", irr: 1500000, usd: 22 },
  { id: "p2000", title: "پلن ۲ میلیون تومان",   irr: 2000000, usd: 30 }
];

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store"
    }
  });
}

function err(message, status = 400) {
  return json({ ok: false, error: message }, status);
}

function uuid() {
  return crypto.randomUUID();
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPassword(password, saltHex) {
  const enc = new TextEncoder();

  let salt;

  if (saltHex) {
    salt = Uint8Array.from(
      saltHex.match(/.{2}/g).map(x => parseInt(x, 16))
    );
  } else {
    salt = crypto.getRandomValues(new Uint8Array(16));
  }

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    key,
    256
  );

  const hashHex = Array.from(new Uint8Array(bits))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  const saltOut = Array.from(salt)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  return `${saltOut}:${hashHex}`;
}

async function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;

  const salt = stored.split(":")[0];
  const check = await hashPassword(password, salt);

  return check === stored;
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =============================================================
// USER SESSION
// =============================================================

async function createSession(db, userId) {
  const token = uuid() + uuid();
  const expires = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  await db.prepare(
    `INSERT INTO sessions
     (token, user_id, expires_at)
     VALUES (?, ?, ?)`
  )
  .bind(token, userId, expires)
  .run();

  return token;
}

async function getUser(request, env) {
  const header = request.headers.get("Authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();

  if (!token) return null;

  const session = await env.DB.prepare(
    "SELECT * FROM sessions WHERE token = ?"
  )
  .bind(token)
  .first();

  if (!session) return null;

  if (
    session.expires_at &&
    new Date(session.expires_at).getTime() < Date.now()
  ) {
    return null;
  }

  return await env.DB.prepare(
    `SELECT id, username, name, email, balance, plan, status, created_at
     FROM users
     WHERE id = ?`
  )
  .bind(session.user_id)
  .first();
}

// =============================================================
// REGISTER
// =============================================================

async function register(request, env) {
  const body = await request.json().catch(() => ({}));

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email || !password) {
    return err("ایمیل و رمز عبور را وارد کنید.");
  }

  if (!validEmail(email)) {
    return err("ایمیل معتبر نیست.");
  }

  if (password.length < 6) {
    return err("رمز عبور باید حداقل ۶ کاراکتر باشد.");
  }

  const old = await env.DB.prepare(
    "SELECT id FROM users WHERE email = ?"
  )
  .bind(email)
  .first();

  if (old) {
    return err("این ایمیل قبلاً ثبت‌نام کرده است.");
  }

  const passwordHash = await hashPassword(password);

  // سازگار با users فعلی که id آن INTEGER PRIMARY KEY است
  // و username نیز NOT NULL دارد.
  const username = name || email.split("@")[0];

  const result = await env.DB.prepare(
    `INSERT INTO users
     (username, name, email, password_hash, balance, plan, status)
     VALUES (?, ?, ?, ?, 0, 'free', 'فعال')`
  )
  .bind(
    username,
    name,
    email,
    passwordHash
  )
  .run();

  const userId = result.meta?.last_row_id;

  if (!userId) {
    return err("ثبت‌نام انجام نشد.", 500);
  }

  const token = await createSession(env.DB, userId);

  return json({
    ok: true,
    token,
    message: "ثبت‌نام با موفقیت انجام شد."
  });
}

// =============================================================
// LOGIN
// =============================================================

async function login(request, env) {
  const body = await request.json().catch(() => ({}));

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email || !password) {
    return err("ایمیل و رمز عبور را وارد کنید.");
  }

  const user = await env.DB.prepare(
    "SELECT * FROM users WHERE email = ?"
  )
  .bind(email)
  .first();

  if (!user) {
    return err("ایمیل یا رمز عبور اشتباه است.", 401);
  }

  if (user.status && user.status !== "فعال") {
    return err("حساب کاربری شما فعال نیست.", 403);
  }

  const ok = await verifyPassword(
    password,
    user.password_hash
  );

  if (!ok) {
    return err("ایمیل یا رمز عبور اشتباه است.", 401);
  }

  const token = await createSession(env.DB, user.id);

  return json({
    ok: true,
    token
  });
}

// =============================================================
// FORGOT PASSWORD
// =============================================================

async function forgot(request, env) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();

  if (!email) {
    return err("ایمیل را وارد کنید.");
  }

  return json({
    ok: true,
    message:
      "در صورت وجود این ایمیل در سیستم، اطلاعات بازیابی ارسال خواهد شد."
  });
}

// =============================================================
// ME
// =============================================================

async function me(request, env) {
  const user = await getUser(request, env);

  if (!user) {
    return err("لطفاً وارد حساب شوید.", 401);
  }

  return json({
    ok: true,
    user
  });
}

// =============================================================
// TRANSACTIONS
// =============================================================

async function transactions(request, env) {
  const user = await getUser(request, env);

  if (!user) {
    return err("لطفاً وارد حساب شوید.", 401);
  }

  const result = await env.DB.prepare(
    `SELECT type, amount, status, created_at
     FROM transactions
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 100`
  )
  .bind(user.id)
  .all();

  return json({
    ok: true,
    transactions: result.results || []
  });
}

// =============================================================
// AI
// =============================================================

async function ai(request, env) {
  const user = await getUser(request, env);

  if (!user) {
    return err("لطفاً ابتدا وارد حساب شوید.", 401);
  }

  const body = await request.json().catch(() => ({}));
  const prompt = String(body.prompt || "").trim();

  if (!prompt) {
    return err("متن سؤال خالی است.");
  }

  if (!env.OPENAI_API_KEY) {
    return err(
      "کلید هوش مصنوعی در Cloudflare تنظیم نشده است.",
      500
    );
  }

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful AI assistant. Answer in Persian unless the user asks for another language."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 1200
        })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(text);
      return err(
        "خطا در دریافت پاسخ هوش مصنوعی.",
        502
      );
    }

    const data = await response.json();

    const answer =
      data?.choices?.[0]?.message?.content ||
      "پاسخی دریافت نشد.";

    return json({
      ok: true,
      answer
    });

  } catch (e) {
    console.error(e);

    return err(
      "خطا در ارتباط با سرویس هوش مصنوعی.",
      502
    );
  }
}

// =============================================================
// PAYMENT
// =============================================================

async function payment(request, env) {
  const user = await getUser(request, env);

  if (!user) {
    return err("لطفاً وارد حساب شوید.", 401);
  }

  const body = await request.json().catch(() => ({}));

  const planId = String(body.plan_id || "");
  const currency =
    body.currency === "USD" ? "USD" : "IRR";

  const plan = PLANS.find(p => p.id === planId);

  if (!plan) {
    return err("پلن انتخابی معتبر نیست.");
  }

  const amount =
    currency === "USD"
      ? plan.usd
      : plan.irr;

  const id = uuid();

  try {
    await env.DB.prepare(
      `INSERT INTO payments
       (id, user_id, plan_id, currency, amount, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`
    )
    .bind(
      id,
      user.id,
      planId,
      currency,
      amount
    )
    .run();
  } catch (e) {
    console.error(e);
    return err(
      "خطا در ثبت سفارش پرداخت.",
      500
    );
  }

  // ===========================================================
  // ZARINPAL
  // ===========================================================

  if (
    currency === "IRR" &&
    env.ZARINPAL_MERCHANT_ID
  ) {
    try {
      const result = await fetch(
        "https://api.zarinpal.com/pg/v4/payment/request.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            merchant_id:
              env.ZARINPAL_MERCHANT_ID,

            amount: amount * 10,

            description:
              plan.title,

            callback_url:
              `${new URL(request.url).origin}/api/payment/callback?pid=${id}`,

            metadata: {
              email: user.email || ""
            }
          })
        }
      );

      const data = await result.json();

      if (data?.data?.code === 100) {

        await env.DB.prepare(
          "UPDATE payments SET authority = ? WHERE id = ?"
        )
        .bind(
          data.data.authority,
          id
        )
        .run();

        return json({
          ok: true,
          payment_url:
            `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`
        });
      }

      console.error(
        "ZarinPal:",
        JSON.stringify(data)
      );

      return err(
        "خطا در ایجاد لینک پرداخت زرین‌پال.",
        502
      );

    } catch (e) {
      console.error(e);

      return err(
        "خطا در ارتباط با درگاه پرداخت.",
        502
      );
    }
  }

  return json({
    ok: true,
    message:
      "سفارش ثبت شد. درگاه بین‌المللی هنوز متصل نشده است.",
    payment_id: id
  });
}

// =============================================================
// PAYMENT CALLBACK
// =============================================================

async function paymentCallback(request, env) {
  const url = new URL(request.url);

  const pid =
    url.searchParams.get("pid");

  const authority =
    url.searchParams.get("Authority");

  const status =
    url.searchParams.get("Status");

  if (!pid) {
    return err(
      "شناسه سفارش نامعتبر است."
    );
  }

  const payment = await env.DB.prepare(
    "SELECT * FROM payments WHERE id = ?"
  )
  .bind(pid)
  .first();

  if (!payment) {
    return err(
      "سفارش پیدا نشد.",
      404
    );
  }

  if (payment.status === "success") {
    return Response.redirect(
      `${url.origin}/?payment=success`,
      302
    );
  }

  if (status !== "OK") {

    await env.DB.prepare(
      "UPDATE payments SET status = 'failed' WHERE id = ?"
    )
    .bind(pid)
    .run();

    return Response.redirect(
      `${url.origin}/?payment=failed`,
      302
    );
  }

  if (!env.ZARINPAL_MERCHANT_ID) {
    return Response.redirect(
      `${url.origin}/?payment=failed`,
      302
    );
  }

  try {

    const verify = await fetch(
      "https://api.zarinpal.com/pg/v4/payment/verify.json",
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
            Number(payment.amount) * 10,

          authority
        })
      }
    );

    const data = await verify.json();

    const code = data?.data?.code;

    if (code === 100 || code === 101) {

      const refId =
        String(
          data?.data?.ref_id || ""
        );

      await env.DB.prepare(
        `UPDATE payments
         SET status = 'success',
             ref_id = ?
         WHERE id = ?`
      )
      .bind(
        refId,
        pid
      )
      .run();

      const plan =
        PLANS.find(
          p => p.id === payment.plan_id
        );

      const credit =
        plan
          ? plan.irr
          : Number(payment.amount);

      await env.DB.prepare(
        `UPDATE users
         SET balance = balance + ?
         WHERE id = ?`
      )
      .bind(
        credit,
        payment.user_id
      )
      .run();

      try {
        await env.DB.prepare(
          `INSERT INTO transactions
           (id, user_id, type, amount, status)
           VALUES (?, ?, 'payment', ?, 'success')`
        )
        .bind(
          uuid(),
          payment.user_id,
          credit
        )
        .run();
      } catch (e) {
        console.error(e);
      }

      return Response.redirect(
        `${url.origin}/?payment=success`,
        302
      );
    }

    await env.DB.prepare(
      "UPDATE payments SET status = 'failed' WHERE id = ?"
    )
    .bind(pid)
    .run();

    return Response.redirect(
      `${url.origin}/?payment=failed`,
      302
    );

  } catch (e) {
    console.error(e);

    return Response.redirect(
      `${url.origin}/?payment=failed`,
      302
    );
  }
}

// =============================================================
// WITHDRAW
// =============================================================

async function withdraw(request, env) {
  const user = await getUser(request, env);

  if (!user) {
    return err(
      "لطفاً وارد حساب شوید.",
      401
    );
  }

  const body =
    await request.json().catch(() => ({}));

  const amount =
    Number(body.amount);

  const method =
    body.method === "USDT"
      ? "USDT"
      : "BANK";

  const address =
    String(body.address || "").trim();

  if (!amount || amount < 10000) {
    return err(
      "حداقل مبلغ برداشت ۱۰,۰۰۰ تومان است."
    );
  }

  if (!address) {
    return err(
      "اطلاعات مقصد برداشت را وارد کنید."
    );
  }

  if (amount > Number(user.balance || 0)) {
    return err(
      "موجودی کافی نیست."
    );
  }

  const id = uuid();

  try {

    await env.DB.prepare(
      `INSERT INTO withdrawals
       (id, user_id, amount, method, address, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`
    )
    .bind(
      id,
      user.id,
      amount,
      method,
      address
    )
    .run();

    await env.DB.prepare(
      `UPDATE users
       SET balance = balance - ?
       WHERE id = ?`
    )
    .bind(
      amount,
      user.id
    )
    .run();

    await env.DB.prepare(
      `INSERT INTO transactions
       (id, user_id, type, amount, status)
       VALUES (?, ?, 'withdraw', ?, 'pending')`
    )
    .bind(
      uuid(),
      user.id,
      amount
    )
    .run();

    return json({
      ok: true,
      message:
        "درخواست برداشت ثبت شد و در انتظار تأیید مدیریت است."
    });

  } catch (e) {
    console.error(e);

    return err(
      "خطا در ثبت درخواست برداشت.",
      500
    );
  }
}

// =============================================================
// ADMIN
// =============================================================

async function adminToken(env) {
  if (!env.ADMIN_PASSWORD) return null;

  return await sha256(
    env.ADMIN_PASSWORD +
    (env.JWT_SECRET || "admin-secret")
  );
}

async function checkAdmin(request, env) {
  const token =
    request.headers.get("X-Admin-Token") || "";

  const expected =
    await adminToken(env);

  return !!token &&
    !!expected &&
    token === expected;
}

async function adminLogin(request, env) {
  const body =
    await request.json().catch(() => ({}));

  const password =
    String(body.password || "");

  if (!env.ADMIN_PASSWORD) {
    return err(
      "رمز مدیریت در Cloudflare تنظیم نشده است.",
      500
    );
  }

  if (password !== env.ADMIN_PASSWORD) {
    return err(
      "رمز مدیریت اشتباه است.",
      401
    );
  }

  return json({
    ok: true,
    token: await adminToken(env)
  });
}

// =============================================================
// ADMIN USERS
// =============================================================

async function adminUsers(request, env) {
  if (!(await checkAdmin(request, env))) {
    return err(
      "دسترسی غیرمجاز.",
      401
    );
  }

  const result = await env.DB.prepare(
    `SELECT
       id,
       username,
       name,
       email,
       balance,
       plan,
       status,
       created_at
     FROM users
     ORDER BY created_at DESC
     LIMIT 500`
  ).all();

  return json({
    ok: true,
    users: result.results || []
  });
}

// =============================================================
// ADMIN PAYMENTS
// =============================================================

async function adminPayments(request, env) {
  if (!(await checkAdmin(request, env))) {
    return err(
      "دسترسی غیرمجاز.",
      401
    );
  }

  const result = await env.DB.prepare(
    `SELECT
       p.id,
       p.user_id,
       p.plan_id,
       p.currency,
       p.amount,
       p.authority,
       p.ref_id,
       p.status,
       p.created_at,
       u.email
     FROM payments p
     LEFT JOIN users u
       ON u.id = p.user_id
     ORDER BY p.created_at DESC
     LIMIT 500`
  ).all();

  return json({
    ok: true,
    payments: result.results || []
  });
}

// =============================================================
// ADMIN WITHDRAWALS
// =============================================================

async function adminWithdrawals(request, env) {
  if (!(await checkAdmin(request, env))) {
    return err(
      "دسترسی غیرمجاز.",
      401
    );
  }

  const result = await env.DB.prepare(
    `SELECT
       w.id,
       w.user_id,
       w.amount,
       w.method,
       w.address,
       w.status,
       w.created_at,
       u.email
     FROM withdrawals w
     LEFT JOIN users u
       ON u.id = w.user_id
     ORDER BY w.created_at DESC
     LIMIT 500`
  ).all();

  return json({
    ok: true,
    withdrawals:
      result.results || []
  });
}

// =============================================================
// ADMIN STATS
// =============================================================

async function adminStats(request, env) {
  if (!(await checkAdmin(request, env))) {
    return err(
      "دسترسی غیرمجاز.",
      401
    );
  }

  const users =
    await env.DB.prepare(
      "SELECT COUNT(*) AS count FROM users"
    ).first();

  const balances =
    await env.DB.prepare(
      "SELECT COALESCE(SUM(balance),0) AS total FROM users"
    ).first();

  const payments =
    await env.DB.prepare(
      `SELECT COUNT(*) AS count
       FROM payments
       WHERE status = 'success'`
    ).first();

  const withdrawals =
    await env.DB.prepare(
      `SELECT COUNT(*) AS count
       FROM withdrawals
       WHERE status = 'pending'`
    ).first();

  return json({
    ok: true,
    stats: {
      users: Number(users?.count || 0),
      balance: Number(balances?.total || 0),
      successfulPayments:
        Number(payments?.count || 0),
      pendingWithdrawals:
        Number(withdrawals?.count || 0)
    }
  });
}

// =============================================================
// ADMIN CHANGE BALANCE
// =============================================================

async function adminBalance(request, env) {
  if (!(await checkAdmin(request, env))) {
    return err(
      "دسترسی غیرمجاز.",
      401
    );
  }

  const body =
    await request.json().catch(() => ({}));

  const userId =
    Number(body.user_id);

  const amount =
    Number(body.amount);

  if (!userId || !Number.isFinite(amount)) {
    return err(
      "شناسه کاربر یا مبلغ نامعتبر است."
    );
  }

  const user =
    await env.DB.prepare(
      "SELECT id, balance FROM users WHERE id = ?"
    )
    .bind(userId)
    .first();

  if (!user) {
    return err(
      "کاربر پیدا نشد.",
      404
    );
  }

  const newBalance =
    Number(user.balance || 0) + amount;

  if (newBalance < 0) {
    return err(
      "موجودی نمی‌تواند منفی شود."
    );
  }

  await env.DB.prepare(
    "UPDATE users SET balance = ? WHERE id = ?"
  )
  .bind(
    newBalance,
    userId
  )
  .run();

  try {
    await env.DB.prepare(
      `INSERT INTO transactions
       (id, user_id, type, amount, status)
       VALUES (?, ?, 'admin_adjustment', ?, 'success')`
    )
    .bind(
      uuid(),
      userId,
      amount
    )
    .run();
  } catch (e) {
    console.error(e);
  }

  return json({
    ok: true,
    balance: newBalance,
    message:
      "موجودی با موفقیت تغییر کرد."
  });
}

// =============================================================
// ADMIN WITHDRAW ACTION
// =============================================================

async function adminWithdrawAction(request, env) {
  if (!(await checkAdmin(request, env))) {
    return err(
      "دسترسی غیرمجاز.",
      401
    );
  }

  const body =
    await request.json().catch(() => ({}));

  const id =
    String(body.id || "");

  const action =
    String(body.action || "");

  if (!id) {
    return err(
      "شناسه برداشت نامعتبر است."
    );
  }

  if (
    action !== "approve" &&
    action !== "reject"
  ) {
    return err(
      "عملیات نامعتبر است."
    );
  }

  const withdrawal =
    await env.DB.prepare(
      "SELECT * FROM withdrawals WHERE id = ?"
    )
    .bind(id)
    .first();

  if (!withdrawal) {
    return err(
      "درخواست برداشت پیدا نشد.",
      404
    );
  }

  if (withdrawal.status !== "pending") {
    return err(
      "این درخواست قبلاً بررسی شده است."
    );
  }

  if (action === "approve") {

    await env.DB.prepare(
      `UPDATE withdrawals
       SET status = 'approved'
       WHERE id = ?`
    )
    .bind(id)
    .run();

    await env.DB.prepare(
      `UPDATE transactions
       SET status = 'success'
       WHERE user_id = ?
       AND type = 'withdraw'
       AND amount = ?
       AND status = 'pending'`
    )
    .bind(
      withdrawal.user_id,
      withdrawal.amount
    )
    .run();

    return json({
      ok: true,
      message:
        "برداشت تأیید شد."
    });
  }

  // رد برداشت:
  // مبلغ دوباره به موجودی کاربر برگردانده می‌شود.

  await env.DB.prepare(
    `UPDATE withdrawals
     SET status = 'rejected'
     WHERE id = ?`
  )
  .bind(id)
  .run();

  await env.DB.prepare(
    `UPDATE users
     SET balance = balance + ?
     WHERE id = ?`
  )
  .bind(
    withdrawal.amount,
    withdrawal.user_id
  )
  .run();

  await env.DB.prepare(
    `UPDATE transactions
     SET status = 'rejected'
     WHERE user_id = ?
     AND type = 'withdraw'
     AND amount = ?
     AND status = 'pending'`
  )
  .bind(
    withdrawal.user_id,
    withdrawal.amount
  )
  .run();

  return json({
    ok: true,
    message:
      "برداشت رد شد و مبلغ به موجودی کاربر برگشت."
  });
}

// =============================================================
// SCHEMA
// =============================================================

let schemaReady = false;

async function ensureSchema(env) {
  if (schemaReady || !env.DB) return;

  try {

    await env.DB.batch([

      env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS sessions (
          token TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          expires_at TEXT NOT NULL
        )
      `),

      env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          type TEXT NOT NULL,
          amount INTEGER NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          meta TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
      `),

      env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS payments (
          id TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          plan_id TEXT NOT NULL,
          currency TEXT NOT NULL,
          amount INTEGER NOT NULL,
          authority TEXT,
          ref_id TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
      `),

      env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS withdrawals (
          id TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          amount INTEGER NOT NULL,
          method TEXT NOT NULL,
          address TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
      `)

    ]);

    schemaReady = true;

  } catch (e) {
    console.error(
      "Schema error:",
      e
    );
  }
}

// =============================================================
// HTML
// =============================================================

const HTML = `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>دستیار هوش مصنوعی</title>

<style>
*{
  box-sizing:border-box;
}

html,body{
  margin:0;
  padding:0;
  width:100%;
  min-height:100%;
}

body{
  font-family:Tahoma,Arial,sans-serif;
  background:#f4f7fb;
  color:#172033;
}

header{
  background:#172554;
  color:#fff;
  padding:22px 15px;
  text-align:center;
}

header h1{
  margin:0 0 8px;
  font-size:25px;
}

header p{
  margin:0;
  opacity:.9;
}

nav{
  position:relative;
  z-index:1000;
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  justify-content:center;
  padding:12px;
  background:#fff;
  box-shadow:0 2px 10px #0001;
}

button{
  appearance:none;
  -webkit-appearance:none;
  display:inline-block;
  border:0;
  border-radius:10px;
  padding:12px 16px;
  margin:3px;
  background:#2563eb;
  color:#fff;
  cursor:pointer;
  pointer-events:auto;
  position:relative;
  z-index:1001;
  touch-action:manipulation;
  -webkit-tap-highlight-color:transparent;
  user-select:none;
  font-family:inherit;
  font-size:15px;
}

button:active{
  transform:scale(.97);
}

button:hover{
  opacity:.9;
}

button.secondary{
  background:#64748b;
}

button.danger{
  background:#dc2626;
}

button.success{
  background:#16a34a;
}

button:disabled{
  opacity:.6;
  cursor:not-allowed;
}

.container{
  max-width:1100px;
  margin:20px auto;
  padding:0 12px;
}

section{
  display:none;
}

section.active{
  display:block;
}

.card{
  background:#fff;
  border-radius:16px;
  padding:20px;
  margin-bottom:16px;
  box-shadow:0 4px 18px #0000000d;
}

h2{
  margin-top:0;
}

input,select,textarea{
  width:100%;
  padding:12px;
  margin:7px 0 12px;
  border:1px solid #d5dbe5;
  border-radius:10px;
  font-family:inherit;
  font-size:15px;
}

textarea{
  min-height:160px;
  resize:vertical;
}

.grid{
  display:grid;
  grid-template-columns:repeat(
    auto-fit,
    minmax(210px,1fr)
  );
  gap:14px;
}

.plan{
  border:1px solid #dbe2ec;
  border-radius:14px;
  padding:18px;
  background:#fff;
}

.price{
  font-size:22px;
  font-weight:bold;
  margin:10px 0;
}

.balance{
  font-size:28px;
  font-weight:bold;
  color:#16a34a;
}

.notice{
  padding:12px;
  border-radius:10px;
  background:#eff6ff;
  margin:10px 0;
}

.result{
  white-space:pre-wrap;
  line-height:1.9;
}

.table-wrap{
  overflow-x:auto;
}

table{
  width:100%;
  border-collapse:collapse;
  min-width:700px;
}

th,td{
  padding:9px;
  border-bottom:1px solid #e5e7eb;
  text-align:right;
}

th{
  background:#f8fafc;
}

.small{
  color:#64748b;
  font-size:13px;
}

.stat{
  background:#f8fafc;
  border-radius:14px;
  padding:16px;
  text-align:center;
}

.stat-number{
  font-size:25px;
  font-weight:bold;
  margin-top:8px;
}

.badge{
  display:inline-block;
  padding:5px 9px;
  border-radius:8px;
  background:#e2e8f0;
}

.admin-actions{
  display:flex;
  flex-wrap:wrap;
  gap:5px;
}

@media(max-width:600px){
  nav button{
    flex:1 1 45%;
  }

  header h1{
    font-size:21px;
  }

  .card{
    padding:15px;
  }
}
</style>
</head>

<body>

<header>
<h1>🤖 دستیار هوش مصنوعی</h1>
<p>دستیار هوشمند • حساب کاربری • درآمد • پرداخت • برداشت</p>
</header>

<nav>

<button type="button"
data-action="page"
data-page="login">
🏠 حساب
</button>

<button type="button"
data-action="page"
data-page="ai">
🤖 هوش مصنوعی
</button>

<button type="button"
data-action="page"
data-page="plans">
💰 پلن‌ها
</button>

<button type="button"
data-action="page"
data-page="payment">
💳 پرداخت
</button>

<button type="button"
data-action="page"
data-page="withdraw">
💸 برداشت
</button>

<button type="button"
data-action="page"
data-page="adminLogin">
🛠️ مدیریت
</button>

<button type="button"
data-action="logout">
خروج
</button>

</nav>

<div class="container">

<!-- LOGIN -->

<section id="login" class="active">

<div class="card">

<h2>🔐 ورود به حساب</h2>

<input
id="loginEmail"
type="email"
placeholder="ایمیل">

<input
id="loginPassword"
type="password"
placeholder="رمز عبور">

<button
type="button"
data-action="login">
ورود
</button>

<button
type="button"
class="secondary"
data-action="page"
data-page="register">
ثبت‌نام
</button>

<button
type="button"
class="secondary"
data-action="page"
data-page="forgot">
بازیابی رمز
</button>

<div id="loginMsg"></div>

</div>
</section>

<!-- REGISTER -->

<section id="register">

<div class="card">

<h2>📝 ثبت‌نام</h2>

<input
id="registerName"
type="text"
placeholder="نام">

<input
id="registerEmail"
type="email"
placeholder="ایمیل">

<input
id="registerPassword"
type="password"
placeholder="رمز عبور حداقل ۶ کاراکتر">

<button
type="button"
data-action="register">
ثبت‌نام
</button>

<button
type="button"
class="secondary"
data-action="page"
data-page="login">
بازگشت
</button>

<div id="registerMsg"></div>

</div>
</section>

<!-- FORGOT -->

<section id="forgot">

<div class="card">

<h2>🔑 بازیابی رمز</h2>

<input
id="forgotEmail"
type="email"
placeholder="ایمیل">

<button
type="button"
data-action="forgot">
بازیابی
</button>

<button
type="button"
class="secondary"
data-action="page"
data-page="login">
بازگشت
</button>

<div id="forgotMsg"></div>

</div>
</section>

<!-- HOME -->

<section id="home">

<div class="card">

<h2>👤 حساب کاربری</h2>

<div id="profile">
در حال دریافت اطلاعات...
</div>

</div>

<div class="card">

<h2>💰 موجودی حساب</h2>

<div
id="balance"
class="balance">
0 تومان
</div>

<p class="small">
حداقل برداشت: ۱۰,۰۰۰ تومان
</p>

</div>

<div class="card">

<h2>📊 تراکنش‌ها</h2>

<div id="transactions">
هنوز تراکنشی ثبت نشده است.
</div>

</div>

</section>

<!-- AI -->

<section id="ai">

<div class="card">

<h2>🤖 هوش مصنوعی</h2>

<div class="notice">
سؤال یا درخواست خود را بنویسید.
</div>

<textarea
id="aiPrompt"
placeholder="مثلاً یک متن تبلیغاتی برای فروشگاه اینترنتی بنویس...">
</textarea>

<button
type="button"
id="askAIBtn"
data-action="askAI">
ارسال به هوش مصنوعی
</button>

<div id="aiMsg"></div>

<div
id="aiResult"
class="result">
</div>

</div>
</section>

<!-- PLANS -->

<section id="plans">

<div class="card">

<h2>💰 پلن‌های اشتراک</h2>

<div class="notice">
پلن مورد نظر خود را انتخاب کنید.
</div>

<div
id="plansList"
class="grid">
</div>

</div>
</section>

<!-- PAYMENT -->

<section id="payment">

<div class="card">

<h2>💳 پرداخت</h2>

<select id="paymentPlan">
<option value="">
انتخاب پلن
</option>
</select>

<select id="paymentCurrency">

<option value="IRR">
🇮🇷 تومان / ریال — پرداخت ایران
</option>

<option value="USD">
🌎 USD — بین‌المللی
</option>

</select>

<button
type="button"
id="createPaymentBtn"
data-action="createPayment">
ایجاد سفارش پرداخت
</button>

<div id="paymentMsg"></div>

</div>
</section>

<!-- WITHDRAW -->

<section id="withdraw">

<div class="card">

<h2>💸 درخواست برداشت</h2>

<input
id="withdrawAmount"
type="number"
min="10000"
placeholder="مبلغ برداشت به تومان">

<select id="withdrawMethod">

<option value="BANK">
🇮🇷 حساب بانکی ایران
</option>

<option value="USDT">
🌎 USDT
</option>

</select>

<input
id="withdrawAddress"
placeholder="شماره شبا / شماره حساب / آدرس کیف پول">

<button
type="button"
id="withdrawBtn"
data-action="withdraw">
ثبت درخواست برداشت
</button>

<div id="withdrawMsg"></div>

</div>
</section>

<!-- ADMIN LOGIN -->

<section id="adminLogin">

<div class="card">

<h2>🛠️ ورود مدیریت</h2>

<input
id="adminPassword"
type="password"
placeholder="رمز مدیریت">

<button
type="button"
data-action="adminLogin">
ورود مدیریت
</button>

<div id="adminLoginMsg"></div>

</div>
</section>

<!-- ADMIN -->

<section id="admin">

<div class="card">

<h2>🛠️ پنل مدیریت</h2>

<div class="admin-actions">

<button
type="button"
data-action="adminStats">
📊 آمار
</button>

<button
type="button"
data-action="adminUsers">
👥 کاربران
</button>

<button
type="button"
data-action="adminPayments">
💳 پرداخت‌ها
</button>

<button
type="button"
data-action="adminWithdrawals">
💸 برداشت‌ها
</button>

<button
type="button"
class="danger"
data-action="adminLogout">
خروج مدیریت
</button>

</div>

</div>

<div
id="adminResult"
class="card">
برای مشاهده اطلاعات یکی از گزینه‌های بالا را بزنید.
</div>

</section>

</div>

<script>

(function(){

"use strict";

var plans =
${JSON.stringify(PLANS)};

function $(id){
  return document.getElementById(id);
}

function esc(value){

  return String(
    value == null ? "" : value
  )
  .replace(/&/g,"&amp;")
  .replace(/</g,"&lt;")
  .replace(/>/g,"&gt;")
  .replace(/"/g,"&quot;")
  .replace(/'/g,"&#039;");
}

function message(id,text,ok){

  var el = $(id);

  if(!el) return;

  el.innerHTML =
    '<div class="notice">' +
    (ok ? "✅ " : "❌ ") +
    esc(text) +
    "</div>";
}

function loading(btn,on,text){

  if(!btn) return;

  btn.disabled = on;

  if(on){
    btn.dataset.oldText =
      btn.textContent;
    btn.textContent =
      text || "در حال انجام...";
  }else{
    btn.textContent =
      btn.dataset.oldText ||
      btn.textContent;
  }
}

document.addEventListener(
  "click",
  function(event){

    var btn =
      event.target.closest(
        "button[data-action]"
      );

    if(!btn) return;

    event.preventDefault();

    var action =
      btn.getAttribute(
        "data-action"
      );

    if(action === "page"){
      showPage(
        btn.getAttribute("data-page")
      );
      return;
    }

    if(action === "login"){
      login();
      return;
    }

    if(action === "register"){
      register();
      return;
    }

    if(action === "forgot"){
      forgot();
      return;
    }

    if(action === "askAI"){
      askAI();
      return;
    }

    if(action === "selectPlan"){
      selectPlan(
        btn.getAttribute("data-plan")
      );
      return;
    }

    if(action === "createPayment"){
      createPayment();
      return;
    }

    if(action === "withdraw"){
      withdraw();
      return;
    }

    if(action === "adminLogin"){
      adminLogin();
      return;
    }

    if(action === "adminStats"){
      adminStats();
      return;
    }

    if(action === "adminUsers"){
      adminUsers();
      return;
    }

    if(action === "adminPayments"){
      adminPayments();
      return;
    }

    if(action === "adminWithdrawals"){
      adminWithdrawals();
      return;
    }

    if(action === "adminBalance"){
      adminBalance(
        Number(btn.dataset.id)
      );
      return;
    }

    if(action === "approveWithdraw"){
      withdrawAction(
        btn.dataset.id,
        "approve"
      );
      return;
    }

    if(action === "rejectWithdraw"){
      withdrawAction(
        btn.dataset.id,
        "reject"
      );
      return;
    }

    if(action === "adminLogout"){
      adminLogout();
      return;
    }

    if(action === "logout"){
      logout();
      return;
    }

  },
  false
);

window.showPage =
function(page){

  document
    .querySelectorAll(
      ".container > section"
    )
    .forEach(function(s){
      s.classList.remove("active");
    });

  var target = $(page);

  if(target){
    target.classList.add("active");
  }

  if(page === "home"){
    loadUser();
    loadTransactions();
  }

  if(page === "plans"){
    loadPlans();
  }

  if(page === "payment"){
    loadPlansSelect();
  }

};

window.api =
async function(url,options){

  options =
    options || {};

  options.headers =
    options.headers || {};

  if(
    options.body &&
    !options.headers["Content-Type"]
  ){
    options.headers["Content-Type"] =
      "application/json";
  }

  var token =
    localStorage.getItem(
      "user_token"
    );

  var admin =
    localStorage.getItem(
      "admin_token"
    );

  if(token){
    options.headers[
      "Authorization"
    ] =
      "Bearer " + token;
  }

  if(admin){
    options.headers[
      "X-Admin-Token"
    ] =
      admin;
  }

  var response;

  try{

    response =
      await fetch(
        url,
        options
      );

  }catch(e){

    throw new Error(
      "خطا در اتصال به سرور."
    );
  }

  var text =
    await response.text();

  var data;

  try{
    data =
      JSON.parse(text);
  }catch(e){
    data = {
      ok:false,
      error:
        text ||
        "پاسخ نامعتبر سرور"
    };
  }

  if(!response.ok){

    throw new Error(
      data.error ||
      "خطای سرور"
    );
  }

  return data;
};

// ============================================================
// PLANS
// ============================================================

window.loadPlans =
function(){

  var html = "";

  plans.forEach(
    function(plan){

      html +=
        '<div class="plan">' +

        "<h3>" +
        esc(plan.title) +
        "</h3>" +

        '<div class="price">' +
        Number(plan.irr)
          .toLocaleString("fa-IR") +
        " تومان</div>" +

        "<p>قیمت بین‌المللی: $" +
        plan.usd +
        "</p>" +

        '<button type="button" ' +
        'data-action="selectPlan" ' +
        'data-plan="' +
        esc(plan.id) +
        '">' +
        "انتخاب پلن" +
        "</button>" +

        "</div>";

    }
  );

  $("plansList").innerHTML =
    html;
};

window.selectPlan =
function(planId){

  loadPlansSelect();

  $("paymentPlan").value =
    planId;

  showPage("payment");
};

window.loadPlansSelect =
function(){

  var select =
    $("paymentPlan");

  if(!select) return;

  select.innerHTML =
    '<option value="">انتخاب پلن</option>';

  plans.forEach(
    function(plan){

      var option =
        document.createElement(
          "option"
        );

      option.value =
        plan.id;

      option.textContent =
        plan.title +
        " — " +
        Number(plan.irr)
          .toLocaleString("fa-IR") +
        " تومان / $" +
        plan.usd;

      select.appendChild(
        option
      );

    }
  );
};

// ============================================================
// LOGIN
// ============================================================

window.login =
async function(){

  var email =
    $("loginEmail")
      .value
      .trim();

  var password =
    $("loginPassword")
      .value;

  if(!email || !password){

    message(
      "loginMsg",
      "ایمیل و رمز عبور را وارد کنید.",
      false
    );

    return;
  }

  try{

    var data =
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

    localStorage.setItem(
      "user_token",
      data.token
    );

    showPage("home");

  }catch(e){

    message(
      "loginMsg",
      e.message,
      false
    );
  }

};

// ============================================================
// REGISTER
// ============================================================

window.register =
async function(){

  var name =
    $("registerName")
      .value
      .trim();

  var email =
    $("registerEmail")
      .value
      .trim();

  var password =
    $("registerPassword")
      .value;

  if(!email || !password){

    message(
      "registerMsg",
      "ایمیل و رمز عبور را وارد کنید.",
      false
    );

    return;
  }

  try{

    var data =
      await api(
        "/api/register",
        {
          method:"POST",
          body:JSON.stringify({
            name,
            email,
            password
          })
        }
      );

    if(data.token){

      localStorage.setItem(
        "user_token",
        data.token
      );

      showPage("home");

    }else{

      message(
        "registerMsg",
        data.message ||
        "ثبت‌نام انجام شد.",
        true
      );

    }

  }catch(e){

    message(
      "registerMsg",
      e.message,
      false
    );

  }

};

// ============================================================
// FORGOT
// ============================================================

window.forgot =
async function(){

  var email =
    $("forgotEmail")
      .value
      .trim();

  if(!email){

    message(
      "forgotMsg",
      "ایمیل را وارد کنید.",
      false
    );

    return;
  }

  try{

    var data =
      await api(
        "/api/forgot",
        {
          method:"POST",
          body:JSON.stringify({
            email
          })
        }
      );

    message(
      "forgotMsg",
      data.message,
      true
    );

  }catch(e){

    message(
      "forgotMsg",
      e.message,
      false
    );

  }

};

// ============================================================
// USER
// ============================================================

window.loadUser =
async function(){

  try{

    var data =
      await api(
        "/api/me"
      );

    var user =
      data.user;

    $("profile").innerHTML =
      "<p><b>نام:</b> " +
      esc(user.name || "—") +
      "</p>" +

      "<p><b>ایمیل:</b> " +
      esc(user.email || "—") +
      "</p>" +

      "<p><b>پلن:</b> " +
      esc(user.plan || "free") +
      "</p>";

    $("balance").textContent =
      Number(user.balance || 0)
        .toLocaleString("fa-IR") +
      " تومان";

  }catch(e){

    $("profile").textContent =
      "لطفاً وارد حساب شوید.";

  }

};

window.loadTransactions =
async function(){

  try{

    var data =
      await api(
        "/api/transactions"
      );

    var rows =
      data.transactions || [];

    if(!rows.length){

      $("transactions").innerHTML =
        "هنوز تراکنشی ثبت نشده است.";

      return;
    }

    var html =
      '<div class="table-wrap">' +
      "<table>" +
      "<thead>" +
      "<tr>" +
      "<th>نوع</th>" +
      "<th>مبلغ</th>" +
      "<th>وضعیت</th>" +
      "<th>تاریخ</th>" +
      "</tr>" +
      "</thead><tbody>";

    rows.forEach(
      function(row){

        html +=
          "<tr>" +

          "<td>" +
          esc(row.type) +
          "</td>" +

          "<td>" +
          Number(row.amount || 0)
            .toLocaleString("fa-IR") +
          " تومان</td>" +

          "<td>" +
          esc(row.status) +
          "</td>" +

          "<td>" +
          esc(row.created_at) +
          "</td>" +

          "</tr>";

      }
    );

    html +=
      "</tbody></table></div>";

    $("transactions").innerHTML =
      html;

  }catch(e){

    $("transactions").textContent =
      "تراکنشی برای نمایش وجود ندارد.";

  }

};

// ============================================================
// AI
// ============================================================

window.askAI =
async function(){

  var prompt =
    $("aiPrompt")
      .value
      .trim();

  if(!prompt){

    message(
      "aiMsg",
      "ابتدا سؤال خود را بنویسید.",
      false
    );

    return;
  }

  $("aiResult").textContent =
    "⏳ در حال دریافت پاسخ...";

  loading(
    $("askAIBtn"),
    true,
    "در حال ارسال..."
  );

  try{

    var data =
      await api(
        "/api/ai",
        {
          method:"POST",
          body:JSON.stringify({
            prompt
          })
        }
      );

    $("aiResult").textContent =
      data.answer ||
      "پاسخی دریافت نشد.";

  }catch(e){

    $("aiResult").textContent =
      "";

    message(
      "aiMsg",
      e.message,
      false
    );

  }finally{

    loading(
      $("askAIBtn"),
      false
    );

  }

};

// ============================================================
// PAYMENT
// ============================================================

window.createPayment =
async function(){

  var planId =
    $("paymentPlan").value;

  var currency =
    $("paymentCurrency").value;

  if(!planId){

    message(
      "paymentMsg",
      "ابتدا یک پلن انتخاب کنید.",
      false
    );

    return;
  }

  loading(
    $("createPaymentBtn"),
    true,
    "در حال ایجاد سفارش..."
  );

  try{

    var data =
      await api(
        "/api/payment",
        {
          method:"POST",
          body:JSON.stringify({
            plan_id:planId,
            currency
          })
        }
      );

    if(data.payment_url){

      message(
        "paymentMsg",
        "در حال انتقال به درگاه...",
        true
      );

      setTimeout(
        function(){
          location.href =
            data.payment_url;
        },
        700
      );

    }else{

      message(
        "paymentMsg",
        data.message ||
        "سفارش ایجاد شد.",
        true
      );

    }

  }catch(e){

    message(
      "paymentMsg",
      e.message,
      false
    );

  }finally{

    loading(
      $("createPaymentBtn"),
      false
    );

  }

};

// ============================================================
// WITHDRAW
// ============================================================

window.withdraw =
async function(){

  var amount =
    Number(
      $("withdrawAmount").value
    );

  var method =
    $("withdrawMethod").value;

  var address =
    $("withdrawAddress")
      .value
      .trim();

  if(!amount || amount < 10000){

    message(
      "withdrawMsg",
      "حداقل مبلغ برداشت ۱۰,۰۰۰ تومان است.",
      false
    );

    return;
  }

  if(!address){

    message(
      "withdrawMsg",
      "اطلاعات مقصد برداشت را وارد کنید.",
      false
    );

    return;
  }

  loading(
    $("withdrawBtn"),
    true,
    "در حال ثبت..."
  );

  try{

    var data =
      await api(
        "/api/withdraw",
        {
          method:"POST",
          body:JSON.stringify({
            amount,
            method,
            address
          })
        }
      );

    message(
      "withdrawMsg",
      data.message,
      true
    );

    $("withdrawAmount").value="";
    $("withdrawAddress").value="";

    loadUser();

  }catch(e){

    message(
      "withdrawMsg",
      e.message,
      false
    );

  }finally{

    loading(
      $("withdrawBtn"),
      false
    );

  }

};

// ============================================================
// ADMIN LOGIN
// ============================================================

window.adminLogin =
async function(){

  var password =
    $("adminPassword")
      .value;

  if(!password){

    message(
      "adminLoginMsg",
      "رمز مدیریت را وارد کنید.",
      false
    );

    return;
  }

  try{

    var data =
      await api(
        "/api/admin/login",
        {
          method:"POST",
          body:JSON.stringify({
            password
          })
        }
      );

    localStorage.setItem(
      "admin_token",
      data.token
    );

    showPage("admin");

    adminStats();

  }catch(e){

    message(
      "adminLoginMsg",
      e.message,
      false
    );

  }

};

// ============================================================
// ADMIN STATS
// ============================================================

window.adminStats =
async function(){

  var box =
    $("adminResult");

  box.innerHTML =
    "⏳ در حال دریافت آمار...";

  try{

    var data =
      await api(
        "/api/admin/stats"
      );

    var s =
      data.stats;

    box.innerHTML =
      '<div class="grid">' +

      '<div class="stat">' +
      "<div>👥 کاربران</div>" +
      '<div class="stat-number">' +
      Number(s.users)
        .toLocaleString("fa-IR") +
      "</div></div>" +

      '<div class="stat">' +
      "<div>💰 مجموع موجودی</div>" +
      '<div class="stat-number">' +
      Number(s.balance)
        .toLocaleString("fa-IR") +
      " تومان</div></div>" +

      '<div class="stat">' +
      "<div>💳 پرداخت موفق</div>" +
      '<div class="stat-number">' +
      Number(s.successfulPayments)
        .toLocaleString("fa-IR") +
      "</div></div>" +

      '<div class="stat">' +
      "<div>💸 برداشت در انتظار</div>" +
      '<div class="stat-number">' +
      Number(s.pendingWithdrawals)
        .toLocaleString("fa-IR") +
      "</div></div>" +

      "</div>";

  }catch(e){

    box.textContent =
      e.message;

  }

};

// ============================================================
// ADMIN USERS
// ============================================================

window.adminUsers =
async function(){

  var box =
    $("adminResult");

  box.innerHTML =
    "⏳ در حال دریافت کاربران...";

  try{

    var data =
      await api(
        "/api/admin/users"
      );

    var users =
      data.users || [];

    if(!users.length){

      box.textContent =
        "کاربری وجود ندارد.";

      return;
    }

    var html =
      '<div class="table-wrap">' +
      "<table>" +
      "<thead>" +
      "<tr>" +
      "<th>ID</th>" +
      "<th>نام</th>" +
      "<th>ایمیل</th>" +
      "<th>موجودی</th>" +
      "<th>پلن</th>" +
      "<th>وضعیت</th>" +
      "<th>عملیات</th>" +
      "</tr>" +
      "</thead><tbody>";

    users.forEach(
      function(u){

        html +=
          "<tr>" +

          "<td>" +
          esc(u.id) +
          "</td>" +

          "<td>" +
          esc(
            u.name ||
            u.username ||
            "—"
          ) +
          "</td>" +

          "<td>" +
          esc(u.email || "—") +
          "</td>" +

          "<td>" +
          Number(u.balance || 0)
            .toLocaleString("fa-IR") +
          " تومان</td>" +

          "<td>" +
          esc(u.plan || "free") +
          "</td>" +

          "<td>" +
          esc(u.status || "فعال") +
          "</td>" +

          "<td>" +

          '<button type="button" ' +
          'data-action="adminBalance" ' +
          'data-id="' +
          esc(u.id) +
          '">' +
          "💰 تغییر موجودی" +
          "</button>" +

          "</td>" +

          "</tr>";

      }
    );

    html +=
      "</tbody></table></div>";

    box.innerHTML =
      html;

  }catch(e){

    box.textContent =
      e.message;

  }

};

// ============================================================
// ADMIN BALANCE
// ============================================================

window.adminBalance =
async function(userId){

  var amount =
    prompt(
      "مبلغ تغییر موجودی را وارد کنید.\n" +
      "مثبت = افزایش\n" +
      "منفی = کاهش"
    );

  if(amount === null) return;

  amount =
    Number(amount);

  if(!Number.isFinite(amount)){

    alert(
      "مبلغ نامعتبر است."
    );

    return;
  }

  try{

    var data =
      await api(
        "/api/admin/balance",
        {
          method:"POST",
          body:JSON.stringify({
            user_id:userId,
            amount
          })
        }
      );

    alert(
      data.message +
      "\nموجودی جدید: " +
      Number(data.balance)
        .toLocaleString("fa-IR") +
      " تومان"
    );

    adminUsers();

  }catch(e){

    alert(
      e.message
    );

  }

};

// ============================================================
// ADMIN PAYMENTS
// ============================================================

window.adminPayments =
async function(){

  var box =
    $("adminResult");

  box.innerHTML =
    "⏳ در حال دریافت پرداخت‌ها...";

  try{

    var data =
      await api(
        "/api/admin/payments"
      );

    var rows =
      data.payments || [];

    if(!rows.length){

      box.textContent =
        "پرداختی ثبت نشده است.";

      return;
    }

    var html =
      '<div class="table-wrap">' +
      "<table>" +
      "<thead><tr>" +
      "<th>ایمیل</th>" +
      "<th>پلن</th>" +
      "<th>مبلغ</th>" +
      "<th>ارز</th>" +
      "<th>وضعیت</th>" +
      "<th>تاریخ</th>" +
      "</tr></thead><tbody>";

    rows.forEach(
      function(r){

        var plan =
          plans.find(
            p => p.id === r.plan_id
          );

        html +=
          "<tr>" +

          "<td>" +
          esc(r.email || "—") +
          "</td>" +

          "<td>" +
          esc(
            plan
              ? plan.title
              : r.plan_id
          ) +
          "</td>" +

          "<td>" +
          Number(r.amount || 0)
            .toLocaleString("fa-IR") +
          "</td>" +

          "<td>" +
          esc(r.currency) +
          "</td>" +

          "<td>" +
          '<span class="badge">' +
          esc(r.status) +
          "</span>" +
          "</td>" +

          "<td>" +
          esc(r.created_at) +
          "</td>" +

          "</tr>";

      }
    );

    html +=
      "</tbody></table></div>";

    box.innerHTML =
      html;

  }catch(e){

    box.textContent =
      e.message;

  }

};

// ============================================================
// ADMIN WITHDRAWALS
// ============================================================

window.adminWithdrawals =
async function(){

  var box =
    $("adminResult");

  box.innerHTML =
    "⏳ در حال دریافت برداشت‌ها...";

  try{

    var data =
      await api(
        "/api/admin/withdrawals"
      );

    var rows =
      data.withdrawals || [];

    if(!rows.length){

      box.textContent =
        "درخواستی برای برداشت وجود ندارد.";

      return;
    }

    var html =
      '<div class="table-wrap">' +
      "<table>" +
      "<thead><tr>" +

      "<th>ایمیل</th>" +
      "<th>مبلغ</th>" +
      "<th>روش</th>" +
      "<th>مقصد</th>" +
      "<th>وضعیت</th>" +
      "<th>تاریخ</th>" +
      "<th>عملیات</th>" +

      "</tr></thead><tbody>";

    rows.forEach(
      function(r){

        html +=
          "<tr>" +

          "<td>" +
          esc(r.email || "—") +
          "</td>" +

          "<td>" +
          Number(r.amount || 0)
            .toLocaleString("fa-IR") +
          " تومان</td>" +

          "<td>" +
          esc(r.method) +
          "</td>" +

          "<td>" +
          esc(r.address) +
          "</td>" +

          "<td>" +
          esc(r.status) +
          "</td>" +

          "<td>" +
          esc(r.created_at) +
          "</td>" +

          "<td>";

        if(r.status === "pending"){

          html +=
            '<button type="button" ' +
            'class="success" ' +
            'data-action="approveWithdraw" ' +
            'data-id="' +
            esc(r.id) +
            '">' +
            "✅ تأیید" +
            "</button>" +

            '<button type="button" ' +
            'class="danger" ' +
            'data-action="rejectWithdraw" ' +
            'data-id="' +
            esc(r.id) +
            '">' +
            "❌ رد" +
            "</button>";

        }else{

          html +=
            "بررسی شده";

        }

        html +=
          "</td></tr>";

      }
    );

    html +=
      "</tbody></table></div>";

    box.innerHTML =
      html;

  }catch(e){

    box.textContent =
      e.message;

  }

};

// ============================================================
// WITHDRAW ACTION
// ============================================================

window.withdrawAction =
async function(id,action){

  var question =
    action === "approve"
      ? "برداشت تأیید شود؟"
      : "برداشت رد شود و مبلغ به موجودی کاربر برگردد؟";

  if(!confirm(question)){
    return;
  }

  try{

    var data =
      await api(
        "/api/admin/withdraw-action",
        {
          method:"POST",
          body:JSON.stringify({
            id,
            action
          })
        }
      );

    alert(
      data.message
    );

    adminWithdrawals();

  }catch(e){

    alert(
      e.message
    );

  }

};

// ============================================================
// LOGOUT
// ============================================================

window.adminLogout =
function(){

  localStorage.removeItem(
    "admin_token"
  );

  showPage(
    "adminLogin"
  );
};

window.logout =
function(){

  localStorage.removeItem(
    "user_token"
  );

  showPage(
    "login"
  );
};

// ============================================================
// START
// ============================================================

if(
  localStorage.getItem(
    "user_token"
  )
){

  showPage("home");

}else{

  showPage("login");

}

})();

</script>

</body>
</html>`;

// =============================================================
// ROUTER
// =============================================================

export default {

  async fetch(request, env) {

    const url =
      new URL(request.url);

    const path =
      url.pathname;

    const method =
      request.method;

    if(!env.DB){

      if(path === "/"){

        return new Response(
          HTML,
          {
            headers:{
              "content-type":
                "text/html; charset=UTF-8",
              "cache-control":
                "no-store"
            }
          }
        );

      }

      return err(
        "D1 به Worker متصل نیست.",
        500
      );
    }

    await ensureSchema(env);

    try{

      if(
        method === "GET" &&
        path === "/"
      ){

        return new Response(
          HTML,
          {
            headers:{
              "content-type":
                "text/html; charset=UTF-8",
              "cache-control":
                "no-store"
            }
          }
        );

      }

      // USER

      if(
        method === "POST" &&
        path === "/api/register"
      )
        return await register(
          request,
          env
        );

      if(
        method === "POST" &&
        path === "/api/login"
      )
        return await login(
          request,
          env
        );

      if(
        method === "POST" &&
        path === "/api/forgot"
      )
        return await forgot(
          request,
          env
        );

      if(
        method === "GET" &&
        path === "/api/me"
      )
        return await me(
          request,
          env
        );

      if(
        method === "GET" &&
        path === "/api/transactions"
      )
        return await transactions(
          request,
          env
        );

      if(
        method === "POST" &&
        path === "/api/ai"
      )
        return await ai(
          request,
          env
        );

      // PAYMENT

      if(
        method === "POST" &&
        path === "/api/payment"
      )
        return await payment(
          request,
          env
        );

      if(
        method === "GET" &&
        path === "/api/payment/callback"
      )
        return await paymentCallback(
          request,
          env
        );

      // WITHDRAW

      if(
        method === "POST" &&
        path === "/api/withdraw"
      )
        return await withdraw(
          request,
          env
        );

      // ADMIN

      if(
        method === "POST" &&
        path === "/api/admin/login"
      )
        return await adminLogin(
          request,
          env
        );

      if(
        method === "GET" &&
        path === "/api/admin/users"
      )
        return await adminUsers(
          request,
          env
        );

      if(
        method === "GET" &&
        path === "/api/admin/payments"
      )
        return await adminPayments(
          request,
          env
        );

      if(
        method === "GET" &&
        path === "/api/admin/withdrawals"
      )
        return await adminWithdrawals(
          request,
          env
        );

      if(
        method === "GET" &&
        path === "/api/admin/stats"
      )
        return await adminStats(
          request,
          env
        );

      if(
        method === "POST" &&
        path === "/api/admin/balance"
      )
        return await adminBalance(
          request,
          env
        );

      if(
        method === "POST" &&
        path === "/api/admin/withdraw-action"
      )
        return await adminWithdrawAction(
          request,
          env
        );

      return err(
        "مسیر پیدا نشد.",
        404
      );

    }catch(e){

      console.error(
        "Worker error:",
        e
      );

      return err(
        "خطای داخلی سرور.",
        500
      );
    }
  }
};
