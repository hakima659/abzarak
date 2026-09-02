
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

        // چون جدول users ستون username اجباری دارد،
        // ایمیل را به عنوان username قرار می‌دهیم.
        const username = email;

        const result = await env.DB.prepare(`
          INSERT INTO users
          (username,name,email,password_hash,balance,plan,status)
          VALUES (?,?,?,?,0,'free','فعال')
        `).bind(
          username,
          name,
          email,
          passwordHash
        ).run();

        if (!result.success) {
          return json({
            ok: false,
            error: "ثبت‌نام انجام نشد."
          }, 500);
        }

        return json({
          ok: true,
          message: "ثبت‌نام با موفقیت انجام شد."
        });
      }

      if (path === "/api/login" && method === "POST") {
        const b = await body(request);

        const email = clean(b.email).toLowerCase();
        const password = String(b.password || "");

        const user = await env.DB.prepare(`
          SELECT id,username,name,email,password_hash,balance,plan,status,created_at
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
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            balance: Number(user.balance || 0),
            plan: user.plan || "free",
            created_at: user.created_at
          }
        });
      }

      if (path === "/api/logout" && method === "POST") {
        const token = getToken(request);

        if (token) {
          await env.DB.prepare(
            "DELETE FROM sessions WHERE token=?"
          ).bind(token).run();
        }

        return json({
          ok: true
        });
      }

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

      if (path === "/api/transactions" && method === "GET") {
        const user = await getUser(request, env.DB);

        if (!user) {
          return json({
            ok: false,
            error: "ابتدا وارد شوید."
          }, 401);
        }

        const result = await env.DB.prepare(`
          SELECT id,type,amount,description,created_at
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
        const methodName = clean(b.method) || "USDT";
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
            error: "شماره کارت، حساب یا آدرس کیف پول را وارد کنید."
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
            error: "موجودی حساب کافی نیست."
          }, 400);
        }

        const statements = [
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
            methodName,
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
        ];

        await env.DB.batch(statements);

        return json({
          ok: true,
          message: "درخواست برداشت با موفقیت ثبت شد."
        });
      }

      if (path === "/api/forgot-password" && method === "POST") {
        const b = await body(request);
        const email = clean(b.email).toLowerCase();

        const user = await env.DB.prepare(`
          SELECT id
          FROM users
          WHERE email=?
          LIMIT 1
        `).bind(email).first();

        // پاسخ یکسان برای جلوگیری از لو رفتن وجود ایمیل
        if (!user) {
          return json({
            ok: true,
            message: "اگر این ایمیل وجود داشته باشد، کد بازیابی ایجاد می‌شود."
          });
        }

        const code = String(Math.floor(100000 + Math.random() * 900000));

        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS reset_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            code TEXT NOT NULL,
            expires_at INTEGER NOT NULL
          )
        `).run();

        await env.DB.prepare(
          "DELETE FROM reset_codes WHERE user_id=?"
        ).bind(user.id).run();

        await env.DB.prepare(`
          INSERT INTO reset_codes(user_id,code,expires_at)
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
          WHERE user_id=? AND code=? AND expires_at>?
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
            error: "کد بازیابی اشتباه یا منقضی شده است."
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
          message: "رمز عبور با موفقیت تغییر کرد."
        });
      }

      if (path === "/api/ai" && method === "POST") {
        const user = await getUser(request, env.DB);

        if (!user) {
          return json({
            ok: false,
            error: "برای استفاده از دستیار ابتدا وارد شوید."
          }, 401);
        }

        if (!env.AI) {
          return json({
            ok: false,
            error: "Workers AI با نام AI به Worker متصل نیست."
          }, 500);
        }

        const b = await body(request);
        const message = clean(b.message);

        if (!message) {
          return json({
            ok: false,
            error: "پیام خود را وارد کنید."
          }, 400);
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",
          {
            messages: [
              {
                role: "system",
                content:
                  "تو یک دستیار هوش مصنوعی فارسی و مفید هستی. پاسخ‌ها را واضح، محترمانه و تا حد امکان کوتاه بده."
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

      // شروع پرداخت
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

        if (!Number.isFinite(amount) || amount < 400000) {
          return json({
            ok: false,
            error: "حداقل مبلغ خرید ۴۰۰,۰۰۰ تومان است."
          }, 400);
        }

        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            plan TEXT NOT NULL,
            authority TEXT DEFAULT '',
            status TEXT DEFAULT 'pending',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `).run();

        const result = await env.DB.prepare(`
          INSERT INTO payments
          (user_id,amount,plan,status)
          VALUES(?,?,?,'pending')
        `).bind(
          user.id,
          amount,
          plan
        ).run();

        return json({
          ok: false,
          pending: true,
          payment_id: result.meta?.last_row_id || null,
          message:
            "درخواست پرداخت ثبت شد، اما درگاه زرین‌پال هنوز به Worker متصل نشده است."
        }, 503);
      }

      // ---------- ADMIN ----------

      if (path === "/api/admin/login" && method === "POST") {
        const b = await body(request);
        const password = String(b.password || "");

        if (!env.ADMIN_PASSWORD) {
          return json({
            ok: false,
            error: "ADMIN_PASSWORD در تنظیمات Worker تعریف نشده است."
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

      if (path === "/api/admin/users" && method === "GET") {
        if (!adminOK(request, env)) {
          return json({
            ok: false,
            error: "دسترسی مدیریت ندارید."
          }, 403);
        }

        const result = await env.DB.prepare(`
          SELECT id,username,name,email,balance,plan,status,created_at
          FROM users
          ORDER BY id DESC
          LIMIT 500
        `).all();

        return json({
          ok: true,
          users: result.results || []
        });
      }

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
          b.status === "blocked" ? "blocked" : "فعال";

        await env.DB.prepare(`
          UPDATE users
          SET status=?
          WHERE id=?
        `).bind(status, userId).run();

        return json({
          ok: true,
          message: "وضعیت کاربر تغییر کرد."
        });
      }

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
          clean(b.description) || "تغییر موجودی توسط مدیریت";

        if (!Number.isFinite(userId) ||
            !Number.isFinite(amount) ||
            amount === 0) {
          return json({
            ok: false,
            error: "مبلغ یا کاربر صحیح نیست."
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

        if (Number(user.balance || 0) + amount < 0) {
          return json({
            ok: false,
            error: "موجودی نمی‌تواند منفی شود."
          }, 400);
        }

        const type = amount > 0 ? "income" : "adjustment";

        await env.DB.batch([
          env.DB.prepare(`
            UPDATE users
            SET balance=balance+?
            WHERE id=?
          `).bind(amount, userId),

          env.DB.prepare(`
            INSERT INTO transactions
            (user_id,type,amount,description)
            VALUES(?,?,?,?)
          `).bind(
            userId,
            type,
            Math.abs(amount),
            description
          )
        ]);

        return json({
          ok: true,
          message: "موجودی با موفقیت تغییر کرد."
        });
      }

      if (path === "/api/admin/payments" && method === "GET") {
        if (!adminOK(request, env)) {
          return json({
            ok: false,
            error: "دسترسی مدیریت ندارید."
          }, 403);
        }

        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            plan TEXT NOT NULL,
            authority TEXT DEFAULT '',
            status TEXT DEFAULT 'pending',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `).run();

        const result = await env.DB.prepare(`
          SELECT
            p.id,
            p.user_id,
            p.amount,
            p.plan,
            p.authority,
            p.status,
            p.created_at,
            u.name,
            u.email
          FROM payments p
          LEFT JOIN users u ON u.id=p.user_id
          ORDER BY p.id DESC
          LIMIT 500
        `).all();

        return json({
          ok: true,
          payments: result.results || []
        });
      }

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
          LEFT JOIN users u ON u.username=w.username
          ORDER BY w.id DESC
          LIMIT 500
        `).all();

        return json({
          ok: true,
          withdrawals: result.results || []
        });
      }

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
          SELECT id,username,amount,status
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
            error: "کاربر مربوط به برداشت پیدا نشد."
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
              : "برداشت رد شد و مبلغ به موجودی برگشت."
        });
      }

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
          FROM payments
          WHERE status='paid'
        `).first().catch(() => ({ total: 0 }));

        const withdrawals = await env.DB.prepare(`
          SELECT COALESCE(SUM(amount),0) AS total
          FROM withdrawals
          WHERE status='approved'
        `).first();

        const pendingWithdrawals = await env.DB.prepare(`
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
              Number(pendingWithdrawals?.count || 0)
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


// =========================
// FUNCTIONS
// =========================

async function initDB(DB) {

  await DB.prepare(`
    CREATE TABLE IF NOT EXISTS reset_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      code TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    )
  `).run();

  await DB.prepare(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      plan TEXT NOT NULL,
      authority TEXT DEFAULT '',
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}


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
  const auth = request.headers.get("Authorization") || "";

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
    INNER JOIN users u ON u.id=s.user_id
    WHERE s.token=?
      AND u.status='فعال'
    LIMIT 1
  `).bind(token).first();

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    username: row.username,
    name: row.name,
    email: row.email,
    balance: Number(row.balance || 0),
    plan: row.plan || "free",
    status: row.status,
    created_at: row.created_at
  };
}


function adminOK(request, env) {
  const auth = request.headers.get("Authorization") || "";

  if (!auth.startsWith("Admin ")) {
    return false;
  }

  const token = auth.slice(6).trim();

  if (!token) {
    return false;
  }

  if (env.ADMIN_PASSWORD && token === env.ADMIN_PASSWORD) {
    return true;
  }

  const sessions = globalThis.__ADMIN_SESSIONS;

  if (!sessions) {
    return false;
  }

  const item = sessions.get(token);

  if (!item) {
    return false;
  }

  // اعتبار نشست مدیریت: ۱۲ ساعت
  if (Date.now() - item.created > 12 * 60 * 60 * 1000) {
    sessions.delete(token);
    return false;
  }

  return true;
}
