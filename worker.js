export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const JSON_HEADERS = {
      "content-type": "application/json; charset=UTF-8",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "Content-Type, Authorization"
    };

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: JSON_HEADERS
      });

    if (method === "OPTIONS") {
      return new Response(null, { headers: JSON_HEADERS });
    }

    if (!env.DB) {
      return json({
        ok: false,
        error: "D1 با نام DB به Worker متصل نیست."
      }, 500);
    }

    try {
      await initDB(env.DB);

      if (path === "/" || path === "/index.html") {
        return new Response(HTML, {
          headers: {
            "content-type": "text/html; charset=UTF-8"
          }
        });
      }

      // =========================
      // REGISTER
      // =========================

      if (path === "/api/register" && method === "POST") {
        const b = await body(request);

        const name = clean(b.name);
        const email = clean(b.email).toLowerCase();
        const password = String(b.password || "");

        if (!name || !email || !password) {
          return json({
            ok: false,
            error: "نام، ایمیل و رمز عبور را وارد کنید."
          }, 400);
        }

        if (password.length < 6) {
          return json({
            ok: false,
            error: "رمز عبور باید حداقل ۶ کاراکتر باشد."
          }, 400);
        }

        const exists = await env.DB.prepare(
          "SELECT id FROM users WHERE email=? LIMIT 1"
        ).bind(email).first();

        if (exists) {
          return json({
            ok: false,
            error: "این ایمیل قبلاً ثبت شده است."
          }, 409);
        }

        const passwordHash = await hash(password);

        const username = email;

        await env.DB.prepare(`
          INSERT INTO users
          (username,name,email,password_hash,balance,plan,status)
          VALUES (?,?,?,?,0,'free','فعال')
        `).bind(
          username,
          name,
          email,
          passwordHash
        ).run();

        return json({
          ok: true,
          message: "ثبت‌نام با موفقیت انجام شد."
        });
      }

      // =========================
      // LOGIN
      // =========================

      if (path === "/api/login" && method === "POST") {
        const b = await body(request);

        const email = clean(b.email).toLowerCase();
        const password = String(b.password || "");

        const user = await env.DB.prepare(`
          SELECT
            id,
            username,
            name,
            email,
            password_hash,
            balance,
            plan,
            status,
            created_at
          FROM users
          WHERE email=?
          LIMIT 1
        `).bind(email).first();

        if (!user) {
          return json({
            ok: false,
            error: "ایمیل یا رمز عبور اشتباه است."
          }, 401);
        }

        if (user.status !== "فعال") {
          return json({
            ok: false,
            error: "حساب شما مسدود است."
          }, 403);
        }

        const passwordHash = await hash(password);

        if (passwordHash !== user.password_hash) {
          return json({
            ok: false,
            error: "ایمیل یا رمز عبور اشتباه است."
          }, 401);
        }

        const token = randomToken();

        await env.DB.prepare(`
          INSERT INTO sessions(user_id,token)
          VALUES(?,?)
        `).bind(user.id, token).run();

        return json({
          ok: true,
          token,
          user: publicUser(user)
        });
      }

      // =========================
      // LOGOUT
      // =========================

      if (path === "/api/logout" && method === "POST") {
        const token = getToken(request);

        if (token) {
          await env.DB.prepare(
            "DELETE FROM sessions WHERE token=?"
          ).bind(token).run();
        }

        return json({ ok: true });
      }

      // =========================
      // ME
      // =========================

      if (path === "/api/me" && method === "GET") {
        const user = await getUser(request, env.DB);

        if (!user) {
          return json({
            ok: false,
            error: "وارد حساب کاربری شوید."
          }, 401);
        }

        return json({
          ok: true,
          user
        });
      }

      // =========================
      // PROFILE
      // =========================

      if (path === "/api/profile" && method === "POST") {
        const user = await getUser(request, env.DB);

        if (!user) {
          return json({
            ok: false,
            error: "ابتدا وارد شوید."
          }, 401);
        }

        const b = await body(request);
        const name = clean(b.name);

        if (!name) {
          return json({
            ok: false,
            error: "نام را وارد کنید."
          }, 400);
        }

        await env.DB.prepare(`
          UPDATE users
          SET name=?
          WHERE id=?
        `).bind(name, user.id).run();

        return json({
          ok: true,
          message: "پروفایل ذخیره شد."
        });
      }

      // =========================
      // TRANSACTIONS
      // =========================

      if (path === "/api/transactions" && method === "GET") {
        const user = await getUser(request, env.DB);

        if (!user) {
          return json({
            ok: false,
            error: "ابتدا وارد شوید."
          }, 401);
        }

        const result = await env.DB.prepare(`
          SELECT
            id,
            type,
            amount,
            description,
            created_at
          FROM transactions
          WHERE user_id=?
          ORDER BY id DESC
          LIMIT 200
        `).bind(user.id).all();

        return json({
          ok: true,
          transactions: result.results || []
        });
      }

      // =========================
      // WITHDRAW
      // =========================

      if (path === "/api/withdraw" && method === "POST") {
        const user = await getUser(request, env.DB);

        if (!user) {
          return json({
            ok: false,
            error: "ابتدا وارد شوید."
          }, 401);
        }

        const b = await body(request);

        const amount = Number(b.amount);
        const withdrawMethod = clean(b.method) || "USDT";
        const address = clean(b.destination || b.address);

        if (!Number.isFinite(amount) || amount < 10000) {
          return json({
            ok: false,
            error: "حداقل مبلغ برداشت ۱۰,۰۰۰ تومان است."
          }, 400);
        }

        if (!address) {
          return json({
            ok: false,
            error: "شماره کارت یا آدرس کیف پول را وارد کنید."
          }, 400);
        }

        const fresh = await env.DB.prepare(`
          SELECT id,username,balance
          FROM users
          WHERE id=? AND status='فعال'
          LIMIT 1
        `).bind(user.id).first();

        if (!fresh) {
          return json({
            ok: false,
            error: "کاربر پیدا نشد."
          }, 404);
        }

        if (Number(fresh.balance || 0) < amount) {
          return json({
            ok: false,
            error: "موجودی کافی نیست."
          }, 400);
        }

        await env.DB.batch([
          env.DB.prepare(`
            UPDATE users
            SET balance=balance-?
            WHERE id=? AND balance>=?
          `).bind(amount, fresh.id, amount),

          env.DB.prepare(`
            INSERT INTO withdrawals
            (username,amount,status,method,address)
            VALUES(?,?,'pending',?,?)
          `).bind(
            fresh.username,
            amount,
            withdrawMethod,
            address
          ),

          env.DB.prepare(`
            INSERT INTO transactions
            (user_id,type,amount,description)
            VALUES(?,?,?,?)
          `).bind(
            fresh.id,
            "withdrawal",
            amount,
            "درخواست برداشت (در انتظار)"
          )
        ]);

        return json({
          ok: true,
          message: "درخواست برداشت ثبت شد."
        });
      }

      // =========================
      // FORGOT PASSWORD
      // =========================

      if (path === "/api/forgot-password" && method === "POST") {
        const b = await body(request);
        const email = clean(b.email).toLowerCase();

        const user = await env.DB.prepare(`
          SELECT id
          FROM users
          WHERE email=?
          LIMIT 1
        `).bind(email).first();

        if (!user) {
          return json({
            ok: true,
            message: "اگر ایمیل وجود داشته باشد، کد بازیابی ایجاد می‌شود."
          });
        }

        const code =
          String(Math.floor(100000 + Math.random() * 900000));

        await env.DB.prepare(`
          DELETE FROM reset_codes
          WHERE user_id=?
        `).bind(user.id).run();

        await env.DB.prepare(`
          INSERT INTO reset_codes
          (user_id,code,expires_at)
          VALUES(?,?,?)
        `).bind(
          user.id,
          code,
          Date.now() + 15 * 60 * 1000
        ).run();

        return json({
          ok: true,
          message: "کد بازیابی ایجاد شد.",
          development_code: code
        });
      }

      // =========================
      // RESET PASSWORD
      // =========================

      if (path === "/api/reset-password" && method === "POST") {
        const b = await body(request);

        const email = clean(b.email).toLowerCase();
        const code = clean(b.code);
        const password = String(b.password || "");

        if (password.length < 6) {
          return json({
            ok: false,
            error: "رمز جدید باید حداقل ۶ کاراکتر باشد."
          }, 400);
        }

        const user = await env.DB.prepare(`
          SELECT id
          FROM users
          WHERE email=?
          LIMIT 1
        `).bind(email).first();

        if (!user) {
          return json({
            ok: false,
            error: "اطلاعات بازیابی صحیح نیست."
          }, 400);
        }

        const reset = await env.DB.prepare(`
          SELECT id
          FROM reset_codes
          WHERE user_id=?
          AND code=?
          AND expires_at>?
          ORDER BY id DESC
          LIMIT 1
        `).bind(
          user.id,
          code,
          Date.now()
        ).first();

        if (!reset) {
          return json({
            ok: false,
            error: "کد اشتباه یا منقضی شده است."
          }, 400);
        }

        const passwordHash = await hash(password);

        await env.DB.batch([
          env.DB.prepare(`
            UPDATE users
            SET password_hash=?
            WHERE id=?
          `).bind(passwordHash, user.id),

          env.DB.prepare(`
            DELETE FROM reset_codes
            WHERE id=?
          `).bind(reset.id),

          env.DB.prepare(`
            DELETE FROM sessions
            WHERE user_id=?
          `).bind(user.id)
        ]);

        return json({
          ok: true,
          message: "رمز عبور تغییر کرد."
        });
      }

      // =========================
      // AI
      // =========================

      if (path === "/api/ai" && method === "POST") {
        const user = await getUser(request, env.DB);

        if (!user) {
          return json({
            ok: false,
            error: "ابتدا وارد حساب شوید."
          }, 401);
        }

        if (!env.AI) {
          return json({
            ok: false,
            error: "Workers AI با نام AI متصل نیست."
          }, 500);
        }

        const b = await body(request);
        const message = clean(b.message);

        if (!message) {
          return json({
            ok: false,
            error: "پیام را وارد کنید."
          }, 400);
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",
          {
            messages: [
              {
                role: "system",
                content:
                  "تو یک دستیار هوش مصنوعی فارسی هستی. واضح، مفید و محترمانه پاسخ بده."
              },
              {
                role: "user",
                content: message
              }
            ],
            max_tokens: 800
          }
        );

        return json({
          ok: true,
          answer:
            result?.response ||
            result?.result?.response ||
            "پاسخی دریافت نشد."
        });
      }

      // =========================
      // PAYMENT START
      // =========================

      if (path === "/api/payment/start" && method === "POST") {
        const user = await getUser(request, env.DB);

        if (!user) {
          return json({
            ok: false,
            error: "ابتدا وارد حساب شوید."
          }, 401);
        }

        const b = await body(request);

        const amount = Number(b.amount);
        const plan = clean(b.plan) || "شروع";

        const allowedPlans = {
          "شروع": 400000,
          "حرفه‌ای": 700000,
          "ویژه": 1000000,
          "پیشرفته": 2000000
        };

        if (!Number.isFinite(amount)) {
          return json({
            ok: false,
            error: "مبلغ نامعتبر است."
          }, 400);
        }

        if (!allowedPlans[plan] || allowedPlans[plan] !== amount) {
          return json({
            ok: false,
            error: "پلن یا مبلغ نامعتبر است."
          }, 400);
        }

        const result = await env.DB.prepare(`
          INSERT INTO deposits
          (username,amount,status)
          VALUES(?,?,'pending')
        `).bind(
          user.username,
          amount
        ).run();

        await env.DB.prepare(`
          INSERT INTO subscriptions
          (username,plan,price,status)
          VALUES(?,?,?,'pending')
        `).bind(
          user.username,
          plan,
          amount
        ).run();

        return json({
          ok: false,
          pending: true,
          payment_id: result.meta?.last_row_id || null,
          message:
            "درخواست پرداخت ثبت شد. درگاه زرین‌پال هنوز به Worker متصل نشده است."
        }, 503);
      }

      // ==================================================
      // ADMIN LOGIN
      // ==================================================

      if (path === "/api/admin/login" && method === "POST") {
        const b = await body(request);
        const password = String(b.password || "");

        if (!env.ADMIN_PASSWORD) {
          return json({
            ok: false,
            error: "ADMIN_PASSWORD در Variables تعریف نشده است."
          }, 500);
        }

        if (password !== env.ADMIN_PASSWORD) {
          return json({
            ok: false,
            error: "رمز مدیریت اشتباه است."
          }, 401);
        }

        const token = randomToken();

        globalThis.__ADMIN_SESSIONS =
          globalThis.__ADMIN_SESSIONS || new Map();

        globalThis.__ADMIN_SESSIONS.set(token, {
          created: Date.now()
        });

        return json({
          ok: true,
          token
        });
      }

      // ==================================================
      // ADMIN USERS
      // ==================================================

      if (path === "/api/admin/users" && method === "GET") {
        if (!adminOK(request, env)) {
          return json({
            ok: false,
            error: "دسترسی مدیریت ندارید."
          }, 403);
        }

        const result = await env.DB.prepare(`
          SELECT
            id,
            username,
            name,
            email,
            balance,
            plan,
            status,
            created_at
          FROM users
          ORDER BY id DESC
          LIMIT 500
        `).all();

        return json({
          ok: true,
          users: result.results || []
        });
      }

      // ==================================================
      // ADMIN USER STATUS
      // ==================================================

      if (path === "/api/admin/user-status" && method === "POST") {
        if (!adminOK(request, env)) {
          return json({
            ok: false,
            error: "دسترسی مدیریت ندارید."
          }, 403);
        }

        const b = await body(request);

        const userId = Number(b.user_id);
        const status =
          b.status === "blocked"
            ? "blocked"
            : "فعال";

        await env.DB.prepare(`
          UPDATE users
          SET status=?
          WHERE id=?
        `).bind(
          status,
          userId
        ).run();

        return json({
          ok: true,
          message: "وضعیت کاربر تغییر کرد."
        });
      }

      // ==================================================
      // ADMIN BALANCE
      // ==================================================

      if (path === "/api/admin/balance" && method === "POST") {
        if (!adminOK(request, env)) {
          return json({
            ok: false,
            error: "دسترسی مدیریت ندارید."
          }, 403);
        }

        const b = await body(request);

        const userId = Number(b.user_id);
        const amount = Number(b.amount);

        const description =
          clean(b.description) ||
          "تغییر موجودی توسط مدیریت";

        if (
          !Number.isFinite(userId) ||
          !Number.isFinite(amount) ||
          amount === 0
        ) {
          return json({
            ok: false,
            error: "کاربر یا مبلغ صحیح نیست."
          }, 400);
        }

        const user = await env.DB.prepare(`
          SELECT id,balance
          FROM users
          WHERE id=?
          LIMIT 1
        `).bind(userId).first();

        if (!user) {
          return json({
            ok: false,
            error: "کاربر پیدا نشد."
          }, 404);
        }

        const newBalance =
          Number(user.balance || 0) + amount;

        if (newBalance < 0) {
          return json({
            ok: false,
            error: "موجودی نمی‌تواند منفی شود."
          }, 400);
        }

        await env.DB.batch([
          env.DB.prepare(`
            UPDATE users
            SET balance=balance+?
            WHERE id=?
          `).bind(
            amount,
            userId
          ),

          env.DB.prepare(`
            INSERT INTO transactions
            (user_id,type,amount,description)
            VALUES(?,?,?,?)
          `).bind(
            userId,
            amount > 0 ? "income" : "adjustment",
            Math.abs(amount),
            description
          )
        ]);

        return json({
          ok: true,
          message: "موجودی تغییر کرد."
        });
      }

      // ==================================================
      // ADMIN PAYMENTS
      // ==================================================

      if (path === "/api/admin/payments" && method === "GET") {
        if (!adminOK(request, env)) {
          return json({
            ok: false,
            error: "دسترسی مدیریت ندارید."
          }, 403);
        }

        const result = await env.DB.prepare(`
          SELECT
            d.id,
            d.username,
            d.amount,
            d.status,
            d.created_at,
            u.name,
            u.email
          FROM deposits d
          LEFT JOIN users u
            ON u.username=d.username
          ORDER BY d.id DESC
          LIMIT 500
        `).all();

        return json({
          ok: true,
          payments: result.results || []
        });
      }

      // ==================================================
      // ADMIN WITHDRAWALS
      // ==================================================

      if (path === "/api/admin/withdrawals" && method === "GET") {
        if (!adminOK(request, env)) {
          return json({
            ok: false,
            error: "دسترسی مدیریت ندارید."
          }, 403);
        }

        const result = await env.DB.prepare(`
          SELECT
            w.id,
            w.username,
            w.amount,
            w.status,
            w.created_at,
            w.method,
            w.address,
            u.id AS user_id,
            u.name,
            u.email
          FROM withdrawals w
          LEFT JOIN users u
            ON u.username=w.username
          ORDER BY w.id DESC
          LIMIT 500
        `).all();

        return json({
          ok: true,
          withdrawals: result.results || []
        });
      }

      // ==================================================
      // ADMIN WITHDRAWAL STATUS
      // ==================================================

      if (path === "/api/admin/withdrawal-status" && method === "POST") {
        if (!adminOK(request, env)) {
          return json({
            ok: false,
            error: "دسترسی مدیریت ندارید."
          }, 403);
        }

        const b = await body(request);

        const withdrawalId = Number(b.id);

        const status =
          b.status === "approved"
            ? "approved"
            : b.status === "rejected"
              ? "rejected"
              : null;

        if (!status) {
          return json({
            ok: false,
            error: "وضعیت نامعتبر است."
          }, 400);
        }

        const withdrawal = await env.DB.prepare(`
          SELECT
            id,
            username,
            amount,
            status
          FROM withdrawals
          WHERE id=?
          LIMIT 1
        `).bind(withdrawalId).first();

        if (!withdrawal) {
          return json({
            ok: false,
            error: "درخواست برداشت پیدا نشد."
          }, 404);
        }

        if (withdrawal.status !== "pending") {
          return json({
            ok: false,
            error: "این درخواست قبلاً بررسی شده است."
          }, 400);
        }

        const user = await env.DB.prepare(`
          SELECT id,balance
          FROM users
          WHERE username=?
          LIMIT 1
        `).bind(withdrawal.username).first();

        if (!user) {
          return json({
            ok: false,
            error: "کاربر پیدا نشد."
          }, 404);
        }

        if (status === "approved") {

          await env.DB.batch([
            env.DB.prepare(`
              UPDATE withdrawals
              SET status='approved'
              WHERE id=?
            `).bind(withdrawalId),

            env.DB.prepare(`
              UPDATE transactions
              SET description='برداشت تأیید شد'
              WHERE id=(
                SELECT id
                FROM transactions
                WHERE user_id=?
                  AND type='withdrawal'
                  AND amount=?
                ORDER BY id DESC
                LIMIT 1
              )
            `).bind(
              user.id,
              withdrawal.amount
            )
          ]);

        } else {

          await env.DB.batch([
            env.DB.prepare(`
              UPDATE withdrawals
              SET status='rejected'
              WHERE id=?
            `).bind(withdrawalId),

            env.DB.prepare(`
              UPDATE users
              SET balance=balance+?
              WHERE id=?
            `).bind(
              withdrawal.amount,
              user.id
            ),

            env.DB.prepare(`
              UPDATE transactions
              SET description='برداشت رد شد و مبلغ برگشت داده شد'
              WHERE id=(
                SELECT id
                FROM transactions
                WHERE user_id=?
                  AND type='withdrawal'
                  AND amount=?
                ORDER BY id DESC
                LIMIT 1
              )
            `).bind(
              user.id,
              withdrawal.amount
            )
          ]);
        }

        return json({
          ok: true,
          message:
            status === "approved"
              ? "برداشت تأیید شد."
              : "برداشت رد شد و مبلغ برگشت داده شد."
        });
      }

      // ==================================================
      // ADMIN STATS
      // ==================================================

      if (path === "/api/admin/stats" && method === "GET") {
        if (!adminOK(request, env)) {
          return json({
            ok: false,
            error: "دسترسی مدیریت ندارید."
          }, 403);
        }

        const users = await env.DB.prepare(`
          SELECT COUNT(*) AS count
          FROM users
        `).first();

        const balance = await env.DB.prepare(`
          SELECT COALESCE(SUM(balance),0) AS total
          FROM users
        `).first();

        const income = await env.DB.prepare(`
          SELECT COALESCE(SUM(amount),0) AS total
          FROM transactions
          WHERE type='income'
        `).first();

        const payments = await env.DB.prepare(`
          SELECT COALESCE(SUM(amount),0) AS total
          FROM deposits
          WHERE status='paid'
        `).first();

        const withdrawals = await env.DB.prepare(`
          SELECT COALESCE(SUM(amount),0) AS total
          FROM withdrawals
          WHERE status='approved'
        `).first();

        const pending = await env.DB.prepare(`
          SELECT COUNT(*) AS count
          FROM withdrawals
          WHERE status='pending'
        `).first();

        return json({
          ok: true,
          stats: {
            users: Number(users?.count || 0),
            balance: Number(balance?.total || 0),
            income: Number(income?.total || 0),
            payments: Number(payments?.total || 0),
            withdrawals: Number(withdrawals?.total || 0),
            pending_withdrawals:
              Number(pending?.count || 0)
          }
        });
      }

      return json({
        ok: false,
        error: "مسیر موردنظر پیدا نشد."
      }, 404);

    } catch (error) {
      return json({
        ok: false,
        error: "خطای داخلی Worker",
        detail: error?.message || String(error)
      }, 500);
    }
  }
};


// ==================================================
// DATABASE INITIALIZATION
// ==================================================

async function initDB(DB) {

  await DB.prepare(`
    CREATE TABLE IF NOT EXISTS reset_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      code TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    )
  `).run();
}


// ==================================================
// HELPERS
// ==================================================

async function body(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}


function clean(value) {
  return String(value ?? "").trim();
}


async function hash(value) {
  const data = new TextEncoder().encode(value);

  const digest = await crypto.subtle.digest(
    "SHA-256",
    data
  );

  return [...new Uint8Array(digest)]
    .map(x => x.toString(16).padStart(2, "0"))
    .join("");
}


function randomToken() {
  const bytes = new Uint8Array(32);

  crypto.getRandomValues(bytes);

  return [...bytes]
    .map(x => x.toString(16).padStart(2, "0"))
    .join("");
}


function getToken(request) {
  const auth =
    request.headers.get("Authorization") || "";

  if (!auth.startsWith("Bearer ")) {
    return null;
  }

  return auth.slice(7).trim();
}


async function getUser(request, DB) {

  const token = getToken(request);

  if (!token) {
    return null;
  }

  const row = await DB.prepare(`
    SELECT
      u.id,
      u.username,
      u.name,
      u.email,
      u.balance,
      u.plan,
      u.status,
      u.created_at
    FROM sessions s
    INNER JOIN users u
      ON u.id=s.user_id
    WHERE s.token=?
      AND u.status='فعال'
    LIMIT 1
  `).bind(token).first();

  if (!row) {
    return null;
  }

  return publicUser(row);
}


function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    balance: Number(user.balance || 0),
    plan: user.plan || "free",
    status: user.status,
    created_at: user.created_at
  };
}


function adminOK(request, env) {

  const auth =
    request.headers.get("Authorization") || "";

  if (!auth.startsWith("Admin ")) {
    return false;
  }

  const token = auth.slice(6).trim();

  if (!token) {
    return false;
  }

  if (
    env.ADMIN_PASSWORD &&
    token === env.ADMIN_PASSWORD
  ) {
    return true;
  }

  const sessions =
    globalThis.__ADMIN_SESSIONS;

  if (!sessions) {
    return false;
  }

  const item = sessions.get(token);

  if (!item) {
    return false;
  }

  if (
    Date.now() - item.created >
    12 * 60 * 60 * 1000
  ) {
    sessions.delete(token);
    return false;
  }

  return true;
}


// ==================================================
// FULL HTML
// ==================================================

const HTML = `<!doctype html>
<html lang="fa" dir="rtl">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<title>دستیار هوش مصنوعی</title>

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
  width:min(1100px,94%);
  margin:25px auto;
}

.header{
  background:
    linear-gradient(
      135deg,
      #4f46e5,
      #7c3aed
    );
  color:white;
  padding:25px;
  border-radius:22px;
  box-shadow:
    0 15px 40px
    rgba(79,70,229,.20);
  margin-bottom:20px;
}

.header h1{
  margin:0 0 8px;
  font-size:28px;
}

.header p{
  margin:0;
  opacity:.9;
}

.card{
  background:white;
  border-radius:20px;
  padding:22px;
  margin-bottom:18px;
  box-shadow:
    0 8px 30px
    rgba(15,23,42,.08);
}

.grid{
  display:grid;
  grid-template-columns:
    repeat(auto-fit,minmax(260px,1fr));
  gap:18px;
}

input,
select,
textarea{
  width:100%;
  padding:13px;
  margin:7px 0;
  border:1px solid #dbe1ea;
  border-radius:12px;
  font-size:15px;
  outline:none;
}

input:focus,
select:focus,
textarea:focus{
  border-color:#6366f1;
}

textarea{
  min-height:120px;
  resize:vertical;
}

button{
  border:0;
  padding:13px 18px;
  border-radius:12px;
  cursor:pointer;
  font-weight:bold;
  font-size:15px;
  background:#4f46e5;
  color:white;
  margin:4px;
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
  background:#059669;
}

.hidden{
  display:none !important;
}

.center{
  text-align:center;
}

.balance{
  font-size:34px;
  font-weight:bold;
  color:#4f46e5;
}

.plan-grid{
  display:grid;
  grid-template-columns:
    repeat(auto-fit,minmax(210px,1fr));
  gap:15px;
}

.plan{
  border:2px solid #e5e7eb;
  border-radius:18px;
  padding:20px;
  text-align:center;
  transition:.2s;
}

.plan:hover{
  transform:translateY(-3px);
  border-color:#6366f1;
}

.plan h3{
  margin-top:0;
}

.price{
  font-size:25px;
  font-weight:bold;
  margin:12px 0;
  color:#4f46e5;
}

table{
  width:100%;
  border-collapse:collapse;
}

th,
td{
  padding:11px;
  border-bottom:1px solid #edf0f5;
  text-align:right;
}

.chat{
  min-height:250px;
  max-height:450px;
  overflow:auto;
  background:#f8fafc;
  border-radius:15px;
  padding:15px;
}

.msg{
  padding:12px;
  margin:8px 0;
  border-radius:13px;
}

.user-msg{
  background:#e0e7ff;
}

.ai-msg{
  background:#dcfce7;
}

.status{
  padding:8px 12px;
  border-radius:10px;
  background:#f1f5f9;
  display:inline-block;
}

.nav{
  display:flex;
  flex-wrap:wrap;
  gap:7px;
  margin-bottom:18px;
}

.nav button{
  background:#fff;
  color:#334155;
  border:1px solid #e2e8f0;
}

.nav button.active{
  background:#4f46e5;
  color:#fff;
}

.small{
  font-size:13px;
  color:#64748b;
}

.notice{
  background:#fff7ed;
  border:1px solid #fed7aa;
  padding:12px;
  border-radius:12px;
  margin:10px 0;
}

</style>

</head>

<body>

<div class="container">

<header class="header">

<h1>🤖 دستیار هوش مصنوعی</h1>

<p>
دستیار هوشمند + حساب کاربری + موجودی + برداشت
</p>

</header>


<!-- AUTH -->

<section id="auth">

<div class="grid">

<div class="card">

<h2>📝 ثبت‌نام</h2>

<input
 id="regName"
 placeholder="نام کامل"
>

<input
 id="regEmail"
 type="email"
 placeholder="ایمیل"
>

<input
 id="regPassword"
 type="password"
 placeholder="رمز عبور"
>

<button onclick="register()">
ثبت‌نام
</button>

</div>


<div class="card">

<h2>🔐 ورود</h2>

<input
 id="loginEmail"
 type="email"
 placeholder="ایمیل"
>

<input
 id="loginPassword"
 type="password"
 placeholder="رمز عبور"
>

<button onclick="login()">
ورود
</button>

<button
 class="secondary"
 onclick="showForgot()"
>
فراموشی رمز
</button>

</div>

</div>

</section>


<!-- FORGOT -->

<section
 id="forgotBox"
 class="card hidden"
>

<h2>🔑 بازیابی رمز</h2>

<input
 id="forgotEmail"
 type="email"
 placeholder="ایمیل"
>

<button onclick="forgotPassword()">
دریافت کد
</button>

<div
 id="resetArea"
 class="hidden"
>

<input
 id="resetCode"
 placeholder="کد بازیابی"
>

<input
 id="newPassword"
 type="password"
 placeholder="رمز جدید"
>

<button onclick="resetPassword()">
تغییر رمز
</button>

</div>

</section>


<!-- USER -->

<section
 id="userPanel"
 class="hidden"
>

<div class="nav">

<button
 class="active"
 onclick="showTab('home',this)"
>
🏠 خانه
</button>

<button
 onclick="showTab('ai',this)"
>
🤖 هوش مصنوعی
</button>

<button
 onclick="showTab('plans',this)"
>
💳 پلن‌ها
</button>

<button
 onclick="showTab('withdraw',this)"
>
💸 برداشت
</button>

<button
 onclick="showTab('transactions',this)"
>
📊 تراکنش‌ها
</button>

<button
 onclick="showTab('profile',this)"
>
👤 حساب
</button>

<button
 class="danger"
 onclick="logout()"
>
خروج
</button>

</div>


<!-- HOME -->

<div id="tab-home">

<div class="grid">

<div class="card center">

<h3>موجودی حساب</h3>

<div
 id="balance"
 class="balance"
>
0 تومان
</div>

</div>

<div class="card center">

<h3>پلن فعلی</h3>

<div
 id="currentPlan"
 class="status"
>
رایگان
</div>

</div>

<div class="card center">

<h3>نام کاربر</h3>

<div id="userName">
-
</div>

</div>

</div>

<div class="card">

<h2>👋 خوش آمدید</h2>

<p id="welcome">
-
</p>

</div>

</div>


<!-- AI -->

<div
 id="tab-ai"
 class="hidden"
>

<div class="card">

<h2>🤖 دستیار هوش مصنوعی</h2>

<div
 id="chat"
 class="chat"
>
<div class="small">
پیام خود را بنویسید و ارسال کنید.
</div>
</div>

<textarea
 id="aiMessage"
 placeholder="مثلاً برای من یک متن تبلیغاتی بنویس..."
></textarea>

<button onclick="sendAI()">
ارسال پیام
</button>

</div>

</div>


<!-- PLANS -->

<div
 id="tab-plans"
 class="hidden"
>

<div class="card">

<h2>💳 انتخاب پلن</h2>

<div class="notice">
پرداخت آنلاین پس از اتصال درگاه زرین‌پال فعال می‌شود.
</div>

<div class="plan-grid">

<div class="plan">

<h3>پلن شروع</h3>

<div class="price">
۴۰۰,۰۰۰ تومان
</div>

<p>
مناسب شروع استفاده
</p>

<button
 onclick="pay('شروع',400000)"
>
انتخاب
</button>

</div>


<div class="plan">

<h3>پلن حرفه‌ای</h3>

<div class="price">
۷۰۰,۰۰۰ تومان
</div>

<p>
امکانات بیشتر
</p>

<button
 onclick="pay('حرفه‌ای',700000)"
>
انتخاب
</button>

</div>


<div class="plan">

<h3>پلن ویژه</h3>

<div class="price">
۱,۰۰۰,۰۰۰ تومان
</div>

<p>
برای کاربران حرفه‌ای
</p>

<button
 onclick="pay('ویژه',1000000)"
>
انتخاب
</button>

</div>


<div class="plan">

<h3>پلن پیشرفته</h3>

<div class="price">
۲,۰۰۰,۰۰۰ تومان
</div>

<p>
بیشترین امکانات
</p>

<button
 onclick="pay('پیشرفته',2000000)"
>
انتخاب
</button>

</div>

</div>

</div>

</div>


<!-- WITHDRAW -->

<div
 id="tab-withdraw"
 class="hidden"
>

<div class="card">

<h2>💸 درخواست برداشت</h2>

<p class="small">
حداقل برداشت: ۱۰,۰۰۰ تومان
</p>

<input
 id="withdrawAmount"
 type="number"
 placeholder="مبلغ برداشت"
/>

<select id="withdrawMethod">

<option value="Bank">
حساب بانکی
</option>

<option value="Card">
کارت بانکی
</option>

<option value="USDT">
کیف پول USDT
</option>

</select>

<input
 id="withdrawDestination"
 placeholder="شماره کارت / حساب / آدرس کیف پول"
/>

<button onclick="withdraw()">
ثبت درخواست برداشت
</button>

</div>

</div>


<!-- TRANSACTIONS -->

<div
 id="tab-transactions"
 class="hidden"
>

<div class="card">

<h2>📊 تراکنش‌ها</h2>

<div id="transactionsBox">
در حال بارگذاری...
</div>

</div>

</div>


<!-- PROFILE -->

<div
 id="tab-profile"
 class="hidden"
>

<div class="card">

<h2>👤 حساب کاربری</h2>

<input
 id="profileName"
 placeholder="نام"
/>

<input
 id="profileEmail"
 disabled
>

<button onclick="saveProfile()">
ذخیره
</button>

</div>

</div>

</section>


<!-- ADMIN -->

<section
 id="adminLogin"
 class="card"
>

<h2>🛠️ مدیریت</h2>

<input
 id="adminPassword"
 type="password"
 placeholder="رمز مدیریت"
>

<button onclick="adminLogin()">
ورود مدیریت
</button>

</section>


<section
 id="adminPanel"
 class="hidden"
>

<div class="nav">

<button
 onclick="adminTab('stats')"
>
📊 آمار
</button>

<button
 onclick="adminTab('users')"
>
👥 کاربران
</button>

<button
 onclick="adminTab('payments')"
>
💳 پرداخت‌ها
</button>

<button
 onclick="adminTab('withdrawals')"
>
💸 برداشت‌ها
</button>

<button
 class="danger"
 onclick="adminLogout()"
>
خروج
</button>

</div>


<div
 id="adminStats"
 class="card"
>

<h2>📊 آمار سیستم</h2>

<div id="statsBox">
در حال بارگذاری...
</div>

</div>


<div
 id="adminUsers"
 class="card hidden"
>

<h2>👥 کاربران</h2>

<div id="usersBox">
در حال بارگذاری...
</div>

</div>


<div
 id="adminPayments"
 class="card hidden"
>

<h2>💳 پرداخت‌ها</h2>

<div id="paymentsBox">
در حال بارگذاری...
</div>

</div>


<div
 id="adminWithdrawals"
 class="card hidden"
>

<h2>💸 درخواست‌های برداشت</h2>

<div id="withdrawalsBox">
در حال بارگذاری...
</div>

</div>

</section>


</div>


<script>

let token =
  localStorage.getItem("user_token") || "";

let adminToken =
  localStorage.getItem("admin_token") || "";


function api(path, options={}) {

  options.headers =
    Object.assign(
      {
        "Content-Type":
          "application/json"
      },
      options.headers || {}
    );

  if (token) {
    options.headers.Authorization =
      "Bearer " + token;
  }

  return fetch(path, options)
    .then(async r => {

      const data =
        await r.json()
          .catch(() => ({
            ok:false,
            error:"پاسخ نامعتبر"
          }));

      if (!r.ok && !data.error) {
        data.error =
          "خطا در درخواست";
      }

      return data;

    });

}


async function register() {

  const data = await api(
    "/api/register",
    {
      method:"POST",
      body:JSON.stringify({
        name:
          document.getElementById(
            "regName"
          ).value,

        email:
          document.getElementById(
            "regEmail"
          ).value,

        password:
          document.getElementById(
            "regPassword"
          ).value
      })
    }
  );

  alert(
    data.ok
      ? "ثبت‌نام با موفقیت انجام شد."
      : data.error
  );

  if (data.ok) {

    document.getElementById(
      "loginEmail"
    ).value =
      document.getElementById(
        "regEmail"
      ).value;

  }

}


async function login() {

  const data = await api(
    "/api/login",
    {
      method:"POST",
      body:JSON.stringify({
        email:
          document.getElementById(
            "loginEmail"
          ).value,

        password:
          document.getElementById(
            "loginPassword"
          ).value
      })
    }
  );

  if (!data.ok) {

    alert(data.error);
    return;

  }

  token = data.token;

  localStorage.setItem(
    "user_token",
    token
  );

  showUser();

}


async function showUser() {

  const data =
    await api("/api/me");

  if (!data.ok) {

    token = "";

    localStorage.removeItem(
      "user_token"
    );

    return;

  }

  document
    .getElementById("auth")
    .classList.add("hidden");

  document
    .getElementById("forgotBox")
    .classList.add("hidden");

  document
    .getElementById("userPanel")
    .classList.remove("hidden");

  updateUser(data.user);

  loadTransactions();

}


function updateUser(user) {

  document.getElementById(
    "balance"
  ).textContent =
    formatMoney(user.balance) +
    " تومان";

  document.getElementById(
    "currentPlan"
  ).textContent =
    planName(user.plan);

  document.getElementById(
    "userName"
  ).textContent =
    user.name || "-";

  document.getElementById(
    "welcome"
  ).textContent =
    "سلام " +
    (user.name || "") +
    " عزیز؛ به دستیار هوش مصنوعی خوش آمدید.";

  document.getElementById(
    "profileName"
  ).value =
    user.name || "";

  document.getElementById(
    "profileEmail"
  ).value =
    user.email || "";

}


function formatMoney(n) {

  return Number(n || 0)
    .toLocaleString("fa-IR");

}


function planName(plan) {

  const names = {
    free:"رایگان",
    "شروع":"پلن شروع",
    "حرفه‌ای":"پلن حرفه‌ای",
    "ویژه":"پلن ویژه",
    "پیشرفته":"پلن پیشرفته"
  };

  return names[plan] || plan || "رایگان";

}


async function logout() {

  await api(
    "/api/logout",
    {
      method:"POST"
    }
  );

  token = "";

  localStorage.removeItem(
    "user_token"
  );

  location.reload();

}


function showTab(name, btn) {

  [
    "home",
    "ai",
    "plans",
    "withdraw",
    "transactions",
    "profile"
  ].forEach(x => {

    const el =
      document.getElementById(
        "tab-" + x
      );

    if (el) {
      el.classList.add("hidden");
    }

  });

  document
    .getElementById(
      "tab-" + name
    )
    .classList.remove("hidden");

  document
    .querySelectorAll(
      ".nav button"
    )
    .forEach(x =>
      x.classList.remove("active")
    );

  if (btn) {
    btn.classList.add("active");
  }

}


function showForgot() {

  document
    .getElementById("forgotBox")
    .classList.toggle("hidden");

}


async function forgotPassword() {

  const email =
    document.getElementById(
      "forgotEmail"
    ).value;

  const data =
    await api(
      "/api/forgot-password",
      {
        method:"POST",
        body:JSON.stringify({
          email
        })
      }
    );

  alert(
    data.development_code
      ? "کد بازیابی: " +
        data.development_code
      : data.message ||
        data.error
  );

  if (data.ok) {

    document
      .getElementById(
        "resetArea"
      )
      .classList.remove("hidden");

  }

}


async function resetPassword() {

  const data =
    await api(
      "/api/reset-password",
      {
        method:"POST",
        body:JSON.stringify({

          email:
            document.getElementById(
              "forgotEmail"
            ).value,

          code:
            document.getElementById(
              "resetCode"
            ).value,

          password:
            document.getElementById(
              "newPassword"
            ).value

        })
      }
    );

  alert(
    data.ok
      ? "رمز با موفقیت تغییر کرد."
      : data.error
  );

}


async function saveProfile() {

  const data =
    await api(
      "/api/profile",
      {
        method:"POST",
        body:JSON.stringify({

          name:
            document.getElementById(
              "profileName"
            ).value

        })
      }
    );

  alert(
    data.ok
      ? "پروفایل ذخیره شد."
      : data.error
  );

  if (data.ok) {
    showUser();
  }

}


async function sendAI() {

  const input =
    document.getElementById(
      "aiMessage"
    );

  const message =
    input.value.trim();

  if (!message) return;

  const chat =
    document.getElementById(
      "chat"
    );

  chat.innerHTML +=
    '<div class="msg user-msg">' +
    escapeHtml(message) +
    "</div>";

  input.value = "";

  chat.innerHTML +=
    '<div id="loadingAI" class="msg ai-msg">' +
    "در حال پاسخ..." +
    "</div>";

  chat.scrollTop =
    chat.scrollHeight;

  const data =
    await api(
      "/api/ai",
      {
        method:"POST",
        body:JSON.stringify({
          message
        })
      }
    );

  const loading =
    document.getElementById(
      "loadingAI"
    );

  if (loading) {
    loading.remove();
  }

  chat.innerHTML +=
    '<div class="msg ai-msg">' +
    escapeHtml(
      data.ok
        ? data.answer
        : data.error
    ) +
    "</div>";

  chat.scrollTop =
    chat.scrollHeight;

}


async function pay(plan, amount) {

  const data =
    await api(
      "/api/payment/start",
      {
        method:"POST",
        body:JSON.stringify({
          plan,
          amount
        })
      }
    );

  alert(
    data.message ||
    data.error ||
    "نتیجه نامشخص"
  );

}


async function withdraw() {

  const amount =
    Number(
      document.getElementById(
        "withdrawAmount"
      ).value
    );

  const method =
    document.getElementById(
      "withdrawMethod"
    ).value;

  const destination =
    document.getElementById(
      "withdrawDestination"
    ).value;

  const data =
    await api(
      "/api/withdraw",
      {
        method:"POST",
        body:JSON.stringify({
          amount,
          method,
          destination
        })
      }
    );

  alert(
    data.ok
      ? data.message
      : data.error
  );

  if (data.ok) {
    showUser();
  }

}


async function loadTransactions() {

  const box =
    document.getElementById(
      "transactionsBox"
    );

  const data =
    await api(
      "/api/transactions"
    );

  if (!data.ok) {

    box.innerHTML =
      "<p>" +
      escapeHtml(data.error) +
      "</p>";

    return;

  }

  if (
    !data.transactions ||
    !data.transactions.length
  ) {

    box.innerHTML =
      "<p>هنوز تراکنشی وجود ندارد.</p>";

    return;

  }

  let html =
    "<table><tr>" +
    "<th>نوع</th>" +
    "<th>مبلغ</th>" +
    "<th>توضیح</th>" +
    "<th>تاریخ</th>" +
    "</tr>";

  data.transactions.forEach(t => {

    html +=
      "<tr>" +
      "<td>" +
      escapeHtml(t.type) +
      "</td>" +

      "<td>" +
      formatMoney(t.amount) +
      " تومان</td>" +

      "<td>" +
      escapeHtml(
        t.description || ""
      ) +
      "</td>" +

      "<td>" +
      escapeHtml(
        t.created_at || ""
      ) +
      "</td>" +

      "</tr>";

  });

  html += "</table>";

  box.innerHTML = html;

}


async function adminLogin() {

  const password =
    document.getElementById(
      "adminPassword"
    ).value;

  const data =
    await fetch(
      "/api/admin/login",
      {
        method:"POST",
        headers:{
          "Content-Type":
            "application/json"
        },
        body:JSON.stringify({
          password
        })
      }
    ).then(r => r.json());

  if (!data.ok) {

    alert(data.error);
    return;

  }

  adminToken =
    data.token;

  localStorage.setItem(
    "admin_token",
    adminToken
  );

  document
    .getElementById(
      "adminLogin"
    )
    .classList.add("hidden");

  document
    .getElementById(
      "adminPanel"
    )
    .classList.remove("hidden");

  loadStats();

}


function adminFetch(path, options={}) {

  options.headers =
    Object.assign(
      {
        "Content-Type":
          "application/json",
        "Authorization":
          "Admin " +
          adminToken
      },
      options.headers || {}
    );

  return fetch(
    path,
    options
  ).then(r => r.json());

}


function adminTab(name) {

  [
    "stats",
    "users",
    "payments",
    "withdrawals"
  ].forEach(x => {

    document
      .getElementById(
        "admin" +
        x.charAt(0).toUpperCase() +
        x.slice(1)
      )
      .classList.add("hidden");

  });

  const target =
    document.getElementById(
      "admin" +
      name.charAt(0).toUpperCase() +
      name.slice(1)
    );

  if (target) {
    target.classList.remove("hidden");
  }

  if (name === "stats") {
    loadStats();
  }

  if (name === "users") {
    loadUsers();
  }

  if (name === "payments") {
    loadPayments();
  }

  if (name === "withdrawals") {
    loadWithdrawals();
  }

}


async function loadStats() {

  const data =
    await adminFetch(
      "/api/admin/stats"
    );

  if (!data.ok) {

    document.getElementById(
      "statsBox"
    ).innerHTML =
      "<p>" +
      escapeHtml(data.error) +
      "</p>";

    return;

  }

  const s = data.stats;

  document.getElementById(
    "statsBox"
  ).innerHTML =

    "<div class='grid'>" +

    "<div class='card'>" +
    "<b>کاربران</b><br>" +
    formatMoney(s.users) +
    "</div>" +

    "<div class='card'>" +
    "<b>مجموع موجودی</b><br>" +
    formatMoney(s.balance) +
    " تومان</div>" +

    "<div class='card'>" +
    "<b>درآمد ثبت‌شده</b><br>" +
    formatMoney(s.income) +
    " تومان</div>" +

    "<div class='card'>" +
    "<b>برداشت تأییدشده</b><br>" +
    formatMoney(s.withdrawals) +
    " تومان</div>" +

    "<div class='card'>" +
    "<b>برداشت‌های در انتظار</b><br>" +
    formatMoney(s.pending_withdrawals) +
    "</div>" +

    "</div>";

}


async function loadUsers() {

  const data =
    await adminFetch(
      "/api/admin/users"
    );

  if (!data.ok) {

    document.getElementById(
      "usersBox"
    ).innerHTML =
      "<p>" +
      escapeHtml(data.error) +
      "</p>";

    return;

  }

  let html =
    "<table><tr>" +
    "<th>نام</th>" +
    "<th>ایمیل</th>" +
    "<th>موجودی</th>" +
    "<th>پلن</th>" +
    "<th>وضعیت</th>" +
    "<th>عملیات</th>" +
    "</tr>";

  data.users.forEach(u => {

    html +=
      "<tr>" +

      "<td>" +
      escapeHtml(u.name || "") +
      "</td>" +

      "<td>" +
      escapeHtml(u.email || "") +
      "</td>" +

      "<td>" +
      formatMoney(u.balance) +
      "</td>" +

      "<td>" +
      planName(u.plan) +
      "</td>" +

      "<td>" +
      escapeHtml(u.status) +
      "</td>" +

      "<td>" +

      "<button onclick='changeStatus(" +
      u.id +
      ",\"فعال\")'>فعال</button>" +

      "<button class='danger' onclick='changeStatus(" +
      u.id +
      ",\"blocked\")'>مسدود</button>" +

      "</td>" +

      "</tr>";

  });

  html += "</table>";

  document.getElementById(
    "usersBox"
  ).innerHTML = html;

}


async function changeStatus(
  userId,
  status
) {

  const data =
    await adminFetch(
      "/api/admin/user-status",
      {
        method:"POST",
        body:JSON.stringify({
          user_id:userId,
          status
        })
      }
    );

  alert(
    data.ok
      ? data.message
      : data.error
  );

  if (data.ok) {
    loadUsers();
  }

}


async function loadPayments() {

  const data =
    await adminFetch(
      "/api/admin/payments"
    );

  if (!data.ok) {

    document.getElementById(
      "paymentsBox"
    ).innerHTML =
      "<p>" +
      escapeHtml(data.error) +
      "</p>";

    return;

  }

  if (
    !data.payments ||
    !data.payments.length
  ) {

    document.getElementById(
      "paymentsBox"
    ).innerHTML =
      "<p>پرداختی ثبت نشده است.</p>";

    return;

  }

  let html =
    "<table><tr>" +
    "<th>کاربر</th>" +
    "<th>مبلغ</th>" +
    "<th>وضعیت</th>" +
    "<th>تاریخ</th>" +
    "</tr>";

  data.payments.forEach(p => {

    html +=
      "<tr>" +

      "<td>" +
      escapeHtml(
        p.name ||
        p.username ||
        ""
      ) +
      "</td>" +

      "<td>" +
      formatMoney(p.amount) +
      " تومان</td>" +

      "<td>" +
      escapeHtml(p.status) +
      "</td>" +

      "<td>" +
      escapeHtml(p.created_at) +
      "</td>" +

      "</tr>";

  });

  html += "</table>";

  document.getElementById(
    "paymentsBox"
  ).innerHTML = html;

}


async function loadWithdrawals() {

  const data =
    await adminFetch(
      "/api/admin/withdrawals"
    );

  if (!data.ok) {

    document.getElementById(
      "withdrawalsBox"
    ).innerHTML =
      "<p>" +
      escapeHtml(data.error) +
      "</p>";

    return;

  }

  if (
    !data.withdrawals ||
    !data.withdrawals.length
  ) {

    document.getElementById(
      "withdrawalsBox"
    ).innerHTML =
      "<p>درخواستی وجود ندارد.</p>";

    return;

  }

  let html =
    "<table><tr>" +
    "<th>کاربر</th>" +
    "<th>مبلغ</th>" +
    "<th>روش</th>" +
    "<th>مقصد</th>" +
    "<th>وضعیت</th>" +
    "<th>عملیات</th>" +
    "</tr>";

  data.withdrawals.forEach(w => {

    html +=
      "<tr>" +

      "<td>" +
      escapeHtml(
        w.name ||
        w.username ||
        ""
      ) +
      "</td>" +

      "<td>" +
      formatMoney(w.amount) +
      " تومان</td>" +

      "<td>" +
      escapeHtml(w.method || "") +
      "</td>" +

      "<td>" +
      escapeHtml(w.address || "") +
      "</td>" +

      "<td>" +
      escapeHtml(w.status || "") +
      "</td>" +

      "<td>";

    if (w.status === "pending") {

      html +=
        "<button class='success' " +
        "onclick='withdrawalStatus(" +
        w.id +
        ",\"approved\")'>" +
        "تأیید" +
        "</button>" +

        "<button class='danger' " +
        "onclick='withdrawalStatus(" +
        w.id +
        ",\"rejected\")'>" +
        "رد" +
        "</button>";

    } else {

      html += "-";

    }

    html +=
      "</td></tr>";

  });

  html += "</table>";

  document.getElementById(
    "withdrawalsBox"
  ).innerHTML = html;

}


async function withdrawalStatus(
  id,
  status
) {

  const data =
    await adminFetch(
      "/api/admin/withdrawal-status",
      {
        method:"POST",
        body:JSON.stringify({
          id,
          status
        })
      }
    );

  alert(
    data.ok
      ? data.message
      : data.error
  );

  if (data.ok) {
    loadWithdrawals();
    loadStats();
  }

}


function adminLogout() {

  adminToken = "";

  localStorage.removeItem(
    "admin_token"
  );

  location.reload();

}


function escapeHtml(value) {

  return String(value ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

}


// اگر قبلاً وارد شده باشیم
if (token) {
  showUser();
}

if (adminToken) {

  document
    .getElementById(
      "adminLogin"
    )
    .classList.add("hidden");

  document
    .getElementById(
      "adminPanel"
    )
    .classList.remove("hidden");

  loadStats();

}

</script>

</body>
</html>`;
