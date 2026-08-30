
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // =========================================================
    // تنظیمات
    // =========================================================

    const ADMIN_PASSWORD = env.ADMIN_PASSWORD || "123456";

    // =========================================================
    // CORS
    // =========================================================

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // =========================================================
    // JSON
    // =========================================================

    function json(data, status = 200) {
      return new Response(JSON.stringify(data), {
        status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json; charset=UTF-8"
        }
      });
    }

    // =========================================================
    // پایگاه داده
    // =========================================================

    async function initDB() {

      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          balance REAL DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `).run();

      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS withdrawals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          amount REAL NOT NULL,
          method TEXT NOT NULL,
          account TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `).run();

      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          prompt TEXT NOT NULL,
          answer TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `).run();

      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS deposits (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          amount REAL NOT NULL,
          reference TEXT,
          status TEXT DEFAULT 'pending',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `).run();
    }

    // =========================================================
    // کاربر
    // =========================================================

    async function getUser(username) {

      let user = await env.DB
        .prepare(
          "SELECT * FROM users WHERE username = ?"
        )
        .bind(username)
        .first();

      if (!user) {

        await env.DB
          .prepare(
            "INSERT INTO users (username, balance) VALUES (?, 0)"
          )
          .bind(username)
          .run();

        user = await env.DB
          .prepare(
            "SELECT * FROM users WHERE username = ?"
          )
          .bind(username)
          .first();
      }

      return user;
    }

    // =========================================================
    // صفحه اصلی
    // =========================================================

    if (
      request.method === "GET" &&
      url.pathname === "/"
    ) {

      return new Response(HTML, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/html; charset=UTF-8"
        }
      });
    }

    // =========================================================
    // آماده سازی D1
    // =========================================================

    if (
      url.pathname === "/api/init" &&
      request.method === "POST"
    ) {

      try {

        await initDB();

        return json({
          success: true,
          message: "پایگاه داده آماده شد."
        });

      } catch (error) {

        return json({
          success: false,
          error: error.message
        }, 500);
      }
    }

    // =========================================================
    // حساب کاربر
    // =========================================================

    if (
      url.pathname === "/api/account" &&
      request.method === "POST"
    ) {

      try {

        await initDB();

        const body = await request.json();

        const username =
          String(body.username || "").trim();

        if (!username) {

          return json({
            success: false,
            error: "نام کاربری وارد نشده است."
          }, 400);
        }

        const user = await getUser(username);

        return json({
          success: true,
          user: {
            username: user.username,
            balance: Number(user.balance || 0),
            created_at: user.created_at
          }
        });

      } catch (error) {

        return json({
          success: false,
          error: error.message
        }, 500);
      }
    }

    // =========================================================
    // هوش مصنوعی
    // =========================================================

    if (
      url.pathname === "/api/ai" &&
      request.method === "POST"
    ) {

      try {

        await initDB();

        const body = await request.json();

        const username =
          String(body.username || "guest").trim();

        const prompt =
          String(body.prompt || "").trim();

        if (!prompt) {

          return json({
            success: false,
            error: "لطفاً پیام خود را وارد کنید."
          }, 400);
        }

        if (!env.AI) {

          return json({
            success: false,
            error:
              "Workers AI متصل نیست. Binding با نام AI را اضافه کنید."
          }, 500);
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct-fast",
          {
            messages: [
              {
                role: "system",
                content:
                  "تو یک دستیار هوش مصنوعی فارسی هستی. پاسخ‌ها را واضح، مفید و تا حد امکان کوتاه بده."
              },
              {
                role: "user",
                content: prompt
              }
            ]
          }
        );

        const answer =
          result?.response ||
          result?.result?.response ||
          "پاسخی دریافت نشد.";

        await env.DB
          .prepare(`
            INSERT INTO messages
            (username, prompt, answer)
            VALUES (?, ?, ?)
          `)
          .bind(
            username,
            prompt,
            answer
          )
          .run();

        return json({
          success: true,
          answer
        });

      } catch (error) {

        return json({
          success: false,
          error:
            "خطا در دریافت پاسخ هوش مصنوعی: " +
            error.message
        }, 500);
      }
    }

    // =========================================================
    // ثبت واریز
    // =========================================================

    if (
      url.pathname === "/api/deposit" &&
      request.method === "POST"
    ) {

      try {

        await initDB();

        const body = await request.json();

        const username =
          String(body.username || "").trim();

        const amount =
          Number(body.amount);

        const reference =
          String(body.reference || "").trim();

        if (
          !username ||
          !amount ||
          amount <= 0
        ) {

          return json({
            success: false,
            error: "مبلغ معتبر وارد کنید."
          }, 400);
        }

        await getUser(username);

        await env.DB
          .prepare(`
            INSERT INTO deposits
            (username, amount, reference, status)
            VALUES (?, ?, ?, 'pending')
          `)
          .bind(
            username,
            amount,
            reference
          )
          .run();

        return json({
          success: true,
          message:
            "درخواست واریز ثبت شد و منتظر تأیید مدیر است."
        });

      } catch (error) {

        return json({
          success: false,
          error: error.message
        }, 500);
      }
    }

    // =========================================================
    // برداشت
    // =========================================================

    if (
      url.pathname === "/api/withdraw" &&
      request.method === "POST"
    ) {

      try {

        await initDB();

        const body = await request.json();

        const username =
          String(body.username || "").trim();

        const amount =
          Number(body.amount);

        const method =
          String(body.method || "").trim();

        const account =
          String(body.account || "").trim();

        if (
          !username ||
          !amount ||
          !method ||
          !account
        ) {

          return json({
            success: false,
            error:
              "همه اطلاعات برداشت را کامل کنید."
          }, 400);
        }

        if (amount < 10000) {

          return json({
            success: false,
            error:
              "حداقل مبلغ برداشت ۱۰٬۰۰۰ تومان است."
          }, 400);
        }

        const user =
          await getUser(username);

        const balance =
          Number(user.balance || 0);

        if (amount > balance) {

          return json({
            success: false,
            error:
              "موجودی شما کافی نیست."
          }, 400);
        }

        await env.DB
          .prepare(`
            INSERT INTO withdrawals
            (username, amount, method, account, status)
            VALUES (?, ?, ?, ?, 'pending')
          `)
          .bind(
            username,
            amount,
            method,
            account
          )
          .run();

        await env.DB
          .prepare(`
            UPDATE users
            SET balance = balance - ?
            WHERE username = ?
          `)
          .bind(
            amount,
            username
          )
          .run();

        return json({
          success: true,
          message:
            "درخواست برداشت ثبت شد."
        });

      } catch (error) {

        return json({
          success: false,
          error: error.message
        }, 500);
      }
    }

    // =========================================================
    // ورود مدیریت
    // =========================================================

    if (
      url.pathname === "/api/admin/login" &&
      request.method === "POST"
    ) {

      try {

        const body =
          await request.json();

        const password =
          String(body.password || "");

        if (
          password !== ADMIN_PASSWORD
        ) {

          return json({
            success: false,
            error:
              "رمز مدیریت اشتباه است."
          }, 401);
        }

        return json({
          success: true,
          message:
            "ورود مدیریت موفق بود."
        });

      } catch (error) {

        return json({
          success: false,
          error: error.message
        }, 500);
      }
    }

    // =========================================================
    // اطلاعات مدیریت
    // =========================================================

    if (
      url.pathname === "/api/admin/data" &&
      request.method === "POST"
    ) {

      try {

        const body =
          await request.json();

        const password =
          String(body.password || "");

        if (
          password !== ADMIN_PASSWORD
        ) {

          return json({
            success: false,
            error:
              "رمز مدیریت اشتباه است."
          }, 401);
        }

        await initDB();

        const users =
          await env.DB
            .prepare(`
              SELECT
                id,
                username,
                balance,
                created_at
              FROM users
              ORDER BY id DESC
            `)
            .all();

        const withdrawals =
          await env.DB
            .prepare(`
              SELECT *
              FROM withdrawals
              ORDER BY id DESC
            `)
            .all();

        const deposits =
          await env.DB
            .prepare(`
              SELECT *
              FROM deposits
              ORDER BY id DESC
            `)
            .all();

        return json({
          success: true,
          users: users.results || [],
          withdrawals:
            withdrawals.results || [],
          deposits:
            deposits.results || []
        });

      } catch (error) {

        return json({
          success: false,
          error: error.message
        }, 500);
      }
    }

    // =========================================================
    // افزایش موجودی
    // =========================================================

    if (
      url.pathname === "/api/admin/add-balance" &&
      request.method === "POST"
    ) {

      try {

        const body =
          await request.json();

        const password =
          String(body.password || "");

        const username =
          String(body.username || "").trim();

        const amount =
          Number(body.amount);

        if (
          password !== ADMIN_PASSWORD
        ) {

          return json({
            success: false,
            error:
              "رمز مدیریت اشتباه است."
          }, 401);
        }

        if (
          !username ||
          !amount ||
          amount <= 0
        ) {

          return json({
            success: false,
            error:
              "نام کاربری و مبلغ معتبر وارد کنید."
          }, 400);
        }

        await initDB();

        await getUser(username);

        await env.DB
          .prepare(`
            UPDATE users
            SET balance = balance + ?
            WHERE username = ?
          `)
          .bind(
            amount,
            username
          )
          .run();

        return json({
          success: true,
          message:
            "موجودی افزایش یافت."
        });

      } catch (error) {

        return json({
          success: false,
          error: error.message
        }, 500);
      }
    }

    // =========================================================
    // تأیید یا رد واریز
    // =========================================================

    if (
      url.pathname === "/api/admin/deposit-status" &&
      request.method === "POST"
    ) {

      try {

        const body =
          await request.json();

        const password =
          String(body.password || "");

        const id =
          Number(body.id);

        const status =
          String(body.status || "");

        if (
          password !== ADMIN_PASSWORD
        ) {

          return json({
            success: false,
            error:
              "رمز مدیریت اشتباه است."
          }, 401);
        }

        if (
          !id ||
          ![
            "pending",
            "approved",
            "rejected"
          ].includes(status)
        ) {

          return json({
            success: false,
            error:
              "اطلاعات نامعتبر است."
          }, 400);
        }

        await initDB();

        const deposit =
          await env.DB
            .prepare(`
              SELECT *
              FROM deposits
              WHERE id = ?
            `)
            .bind(id)
            .first();

        if (!deposit) {

          return json({
            success: false,
            error:
              "واریز پیدا نشد."
          }, 404);
        }

        if (
          deposit.status === "pending" &&
          status === "approved"
        ) {

          await env.DB
            .prepare(`
              UPDATE users
              SET balance = balance + ?
              WHERE username = ?
            `)
            .bind(
              Number(deposit.amount),
              deposit.username
            )
            .run();
        }

        await env.DB
          .prepare(`
            UPDATE deposits
            SET status = ?
            WHERE id = ?
          `)
          .bind(
            status,
            id
          )
          .run();

        return json({
          success: true,
          message:
            "وضعیت واریز تغییر کرد."
        });

      } catch (error) {

        return json({
          success: false,
          error: error.message
        }, 500);
      }
    }

    // =========================================================
    // تغییر وضعیت برداشت
    // =========================================================

    if (
      url.pathname === "/api/admin/withdraw-status" &&
      request.method === "POST"
    ) {

      try {

        const body =
          await request.json();

        const password =
          String(body.password || "");

        const id =
          Number(body.id);

        const status =
          String(body.status || "");

        if (
          password !== ADMIN_PASSWORD
        ) {

          return json({
            success: false,
            error:
              "رمز مدیریت اشتباه است."
          }, 401);
        }

        if (
          !id ||
          ![
            "pending",
            "paid",
            "rejected"
          ].includes(status)
        ) {

          return json({
            success: false,
            error:
              "اطلاعات نامعتبر است."
          }, 400);
        }

        await initDB();

        const withdrawal =
          await env.DB
            .prepare(`
              SELECT *
              FROM withdrawals
              WHERE id = ?
            `)
            .bind(id)
            .first();

        if (!withdrawal) {

          return json({
            success: false,
            error:
              "درخواست برداشت پیدا نشد."
          }, 404);
        }

        if (
          withdrawal.status === "pending" &&
          status === "rejected"
        ) {

          await env.DB
            .prepare(`
              UPDATE users
              SET balance = balance + ?
              WHERE username = ?
            `)
            .bind(
              Number(withdrawal.amount),
              withdrawal.username
            )
            .run();
        }

        await env.DB
          .prepare(`
            UPDATE withdrawals
            SET status = ?
            WHERE id = ?
          `)
          .bind(
            status,
            id
          )
          .run();

        return json({
          success: true,
          message:
            "وضعیت برداشت تغییر کرد."
        });

      } catch (error) {

        return json({
          success: false,
          error: error.message
        }, 500);
      }
    }

    // =========================================================
    // مسیر نامعتبر
    // =========================================================

    return json({
      success: false,
      error:
        "صفحه یا API مورد نظر پیدا نشد."
    }, 404);
  }
};


// =============================================================
// HTML
// =============================================================

const HTML = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1.0"
>

<title>
ابزارک هوش مصنوعی
</title>

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
      #f5f7fb,
      #e8eef8
    );

  color:#222;
}

.container{
  width:min(950px,94%);
  margin:25px auto;
}

.card{
  background:#fff;
  border-radius:20px;
  padding:20px;
  margin-bottom:18px;

  box-shadow:
    0 8px 30px
    rgba(0,0,0,.08);
}

h1{
  text-align:center;
  margin-top:0;
  color:#333;
}

.subtitle{
  text-align:center;
  color:#777;
}

input,
select,
textarea,
button{
  width:100%;
  padding:13px;
  margin-top:8px;
  margin-bottom:10px;

  border-radius:12px;
  border:1px solid #ddd;

  font-family:inherit;
  font-size:15px;
}

textarea{
  min-height:110px;
  resize:vertical;
}

button{
  cursor:pointer;
  border:none;
  background:#222;
  color:white;
  font-weight:bold;
}

button:hover{
  opacity:.9;
}

.ai-button{
  background:#2563eb;
}

.green{
  background:#16a34a;
}

.red{
  background:#dc2626;
}

.orange{
  background:#d97706;
}

.admin{
  background:#111827;
  color:white;
}

.balance{
  font-size:30px;
  font-weight:bold;
  text-align:center;
  margin:15px 0;
}

.answer{
  white-space:pre-wrap;
  background:#f6f7f9;
  border-radius:12px;
  padding:15px;
  min-height:60px;
}

.hidden{
  display:none;
}

.small{
  font-size:13px;
  color:#777;
}

.admin .small{
  color:#d1d5db;
}

.admin-box{
  overflow:auto;
}

table{
  width:100%;
  border-collapse:collapse;
  margin-top:15px;
}

th,
td{
  border:1px solid #ddd;
  padding:8px;
  text-align:center;
  white-space:nowrap;
}

th{
  background:#f3f4f6;
}

hr{
  border:none;
  border-top:1px solid #374151;
  margin:20px 0;
}

@media(max-width:600px){

  .container{
    width:96%;
  }

  .card{
    padding:15px;
  }
}

</style>

</head>

<body>

<div class="container">

  <!-- عنوان -->

  <div class="card">

    <h1>
      🤖 ابزارک هوش مصنوعی
    </h1>

    <div class="subtitle">
      ابزارهای سریع و کاربردی برای کارهای روزمره و تولید محتوا
    </div>

  </div>


  <!-- حساب -->

  <div class="card">

    <h2>
      👤 حساب من
    </h2>

    <input
      id="username"
      placeholder="نام کاربری"
      value="user1"
    >

    <button
      onclick="loadAccount()"
    >
      ورود به حساب
    </button>

    <div class="balance">

      💰

      <span id="balance">
        0
      </span>

      تومان

    </div>

    <div
      id="accountMessage"
      class="small"
    ></div>

  </div>


  <!-- هوش مصنوعی -->

  <div class="card">

    <h2>
      🤖 هوش مصنوعی
    </h2>

    <textarea
      id="prompt"
      placeholder="پیامت را بنویس..."
    ></textarea>

    <button
      class="ai-button"
      onclick="askAI()"
    >
      ارسال
    </button>

    <div
      id="aiStatus"
      class="small"
    ></div>

    <div
      id="answer"
      class="answer"
    >
      پاسخ اینجا نمایش داده می‌شود.
    </div>

  </div>


  <!-- اشتراک -->

  <div class="card">

    <h2>
      🚀 اشتراک ابزارک
    </h2>

    <div class="card">

      <h3>
        🆓 رایگان
      </h3>

      <strong>
        ۰ تومان
      </strong>

      <p>
        استفاده محدود از ابزارهای پایه
      </p>

      <button>
        پلن فعلی
      </button>

    </div>

    <div class="card">

      <h3>
        ⭐ حرفه‌ای
      </h3>

      <strong>
        ۳۹۹٬۰۰۰ تومان
      </strong>

      <p>
        اشتراک یک‌ماهه
      </p>

      <p>
        استفاده بیشتر از ابزارها و امکانات حرفه‌ای
      </p>

      <button
        class="orange"
        onclick="alert('پرداخت اشتراک در مرحله بعد فعال می‌شود.')"
      >
        خرید اشتراک حرفه‌ای
      </button>

    </div>

    <div class="card">

      <h3>
        👑 ویژه
      </h3>

      <strong>
        ۷۹۹٬۰۰۰ تومان
      </strong>

      <p>
        اشتراک یک‌ماهه
      </p>

      <p>
        سقف استفاده بسیار بالا و امکانات ویژه
      </p>

      <button
        class="orange"
        onclick="alert('پرداخت اشتراک در مرحله بعد فعال می‌شود.')"
      >
        خرید اشتراک ویژه
      </button>

    </div>

  </div>


  <!-- وضعیت اشتراک -->

  <div class="card">

    <h2>
      💳 وضعیت اشتراک
    </h2>

    <p>
      پلن فعلی:
      <strong>
        رایگان
      </strong>
    </p>

  </div>


  <!-- موجودی -->

  <div class="card">

    <h2>
      💰 موجودی قابل برداشت
    </h2>

    <div class="balance">

      $

      <span id="dollarBalance">
        0.00
      </span>

    </div>

    <p class="small">
      موجودی فقط پس از ثبت و تأیید تراکنش افزایش پیدا می‌کند.
    </p>

    <button
      onclick="openDeposit()"
    >
      💵 واریز
    </button>

    <button
      onclick="loadAccount()"
    >
      👤 حساب کاربری
    </button>

    <button
      onclick="document.getElementById('withdrawAmount').scrollIntoView({behavior:'smooth'})"
    >
      💸 درخواست برداشت
    </button>

  </div>


  <!-- واریز -->

  <div
    id="depositCard"
    class="card hidden"
  >

    <h2>
      💵 ثبت واریز
    </h2>

    <p class="small">
      مبلغ واریز را وارد کنید. پس از بررسی و تأیید مدیر، مبلغ به موجودی اضافه می‌شود.
    </p>

    <input
      id="depositAmount"
      type="number"
      placeholder="مبلغ"
    >

    <input
      id="depositReference"
      placeholder="شماره پیگیری یا توضیح"
    >

    <button
      class="green"
      onclick="deposit()"
    >
      ثبت درخواست واریز
    </button>

    <button
      onclick="document.getElementById('depositCard').classList.add('hidden')"
    >
      بستن
    </button>

    <div
      id="depositMessage"
      class="small"
    ></div>

  </div>


  <!-- ابزارهای کاربردی -->

  <div class="card">

    <h2>
      🧰 ابزارهای کاربردی
    </h2>

    <h3>
      🧮 محاسبه درصد
    </h3>

    <input
      id="percentNumber"
      type="number"
      placeholder="عدد"
    >

    <input
      id="percentValue"
      type="number"
      placeholder="درصد"
    >

    <button onclick="calculatePercent()">
      محاسبه
    </button>

    <div id="percentResult"></div>


    <h3>
      💵 دلار به تومان
    </h3>

    <input
      id="dollarAmount"
      type="number"
      placeholder="مبلغ دلار"
    >

    <input
      id="dollarRate"
      type="number"
      placeholder="نرخ دلار"
    >

    <button onclick="calculateDollar()">
      محاسبه
    </button>

    <div id="dollarResult"></div>


    <h3>
      🏷️ محاسبه تخفیف
    </h3>

    <input
      id="discountPrice"
      type="number"
      placeholder="قیمت"
    >

    <input
      id="discountPercent"
      type="number"
      placeholder="درصد تخفیف"
    >

    <button onclick="calculateDiscount()">
      محاسبه
    </button>

    <div id="discountResult"></div>


    <h3>
      📈 محاسبه سود
    </h3>

    <input
      id="buyPrice"
      type="number"
      placeholder="قیمت خرید"
    >

    <input
      id="sellPrice"
      type="number"
      placeholder="قیمت فروش"
    >

    <button onclick="calculateProfit()">
      محاسبه
    </button>

    <div id="profitResult"></div>


    <h3>
      📏 کیلومتر به متر
    </h3>

    <input
      id="km"
      type="number"
      placeholder="کیلومتر"
    >

    <button onclick="convertKm()">
      تبدیل
    </button>

    <div id="kmResult"></div>


    <h3>
      💳 محاسبه اقساط
    </h3>

    <input
      id="loanAmount"
      type="number"
      placeholder="مبلغ"
    >

    <input
      id="loanMonths"
      type="number"
      placeholder="تعداد ماه"
    >

    <button onclick="calculateLoan()">
      محاسبه
    </button>

    <div id="loanResult"></div>


    <h3>
      🎂 محاسبه سن
    </h3>

    <input
      id="birthYear"
      type="number"
      placeholder="سال تولد"
    >

    <button onclick="calculateAge()">
      محاسبه
    </button>

    <div id="ageResult"></div>


    <h3>
      📝 تولید متن معرفی
    </h3>

    <input
      id="introTopic"
      placeholder="نام / موضوع"
    >

    <button onclick="generateIntro()">
      تولید متن
    </button>

    <div
      id="introResult"
      class="answer"
    ></div>

  </div>


  <!-- مدیریت -->

  <div class="card admin">

    <h2>
      🔐 پنل مدیریت
    </h2>

    <input
      id="adminPassword"
      type="password"
      placeholder="رمز مدیریت"
    >

    <button
      onclick="adminLogin()"
    >
      ورود مدیر
    </button>

    <div
      id="adminLoginMessage"
      class="small"
    ></div>

    <div
      id="adminPanel"
      class="hidden"
    >

      <hr>

      <h3>
        ➕ افزایش موجودی
      </h3>

      <input
        id="adminUsername"
        placeholder="نام کاربری"
      >

      <input
        id="adminAmount"
        type="number"
        placeholder="مبلغ"
      >

      <button
        class="green"
        onclick="addBalance()"
      >
        افزایش موجودی
      </button>

      <hr>

      <h3>
        📊 اطلاعات
      </h3>

      <button
        onclick="loadAdminData()"
      >
        🔄 بروزرسانی
      </button>

      <div
        id="adminData"
        class="admin-box"
      ></div>

    </div>

  </div>

</div>


<script>

const API = "";


// =========================================================
// نمایش پیام
// =========================================================

function show(id, text){

  const element =
    document.getElementById(id);

  if(element){
    element.textContent = text;
  }
}


// =========================================================
// حساب
// =========================================================

async function loadAccount(){

  const username =
    document.getElementById(
      "username"
    ).value.trim();

  if(!username){

    show(
      "accountMessage",
      "نام کاربری را وارد کنید."
    );

    return;
  }

  try{

    const response =
      await fetch(
        API + "/api/account",
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json"
          },

          body:JSON.stringify({
            username
          })
        }
      );

    const data =
      await response.json();

    if(!data.success){

      show(
        "accountMessage",
        data.error || "خطا"
      );

      return;
    }

    const balance =
      Number(
        data.user.balance || 0
      );

    document.getElementById(
      "balance"
    ).textContent =
      balance.toLocaleString("fa-IR");

    document.getElementById(
      "dollarBalance"
    ).textContent =
      balance.toFixed(2);

    show(
      "accountMessage",
      "حساب با موفقیت آماده شد."
    );

  }catch(error){

    show(
      "accountMessage",
      "خطا در اتصال."
    );
  }
}


// =========================================================
// هوش مصنوعی
// =========================================================

async function askAI(){

  const prompt =
    document.getElementById(
      "prompt"
    ).value.trim();

  const username =
    document.getElementById(
      "username"
    ).value.trim() || "guest";

  if(!prompt){

    show(
      "aiStatus",
      "لطفاً پیام خود را بنویس."
    );

    return;
  }

  show(
    "aiStatus",
    "⏳ در حال دریافت پاسخ..."
  );

  document.getElementById(
    "answer"
  ).textContent =
    "لطفاً صبر کنید...";

  try{

    const response =
      await fetch(
        API + "/api/ai",
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json"
          },

          body:JSON.stringify({
            username,
            prompt
          })
        }
      );

    const data =
      await response.json();

    if(!data.success){

      document.getElementById(
        "answer"
      ).textContent =
        data.error || "خطا";

      show(
        "aiStatus",
        "❌ خطا"
      );

      return;
    }

    document.getElementById(
      "answer"
    ).textContent =
      data.answer;

    show(
      "aiStatus",
      "✅ پاسخ دریافت شد."
    );

  }catch(error){

    document.getElementById(
      "answer"
    ).textContent =
      "خطا در اتصال به سرور.";

    show(
      "aiStatus",
      "❌ خطا"
    );
  }
}


// =========================================================
// واریز
// =========================================================

function openDeposit(){

  document.getElementById(
    "depositCard"
  ).classList.remove(
    "hidden"
  );

  document.getElementById(
    "depositCard"
  ).scrollIntoView({
    behavior:"smooth"
  });
}


async function deposit(){

  const username =
    document.getElementById(
      "username"
    ).value.trim();

  const amount =
    Number(
      document.getElementById(
        "depositAmount"
      ).value
    );

  const reference =
    document.getElementById(
      "depositReference"
    ).value.trim();

  if(!username){

    show(
      "depositMessage",
      "ابتدا نام کاربری را وارد کنید."
    );

    return;
  }

  if(!amount || amount <= 0){

    show(
      "depositMessage",
      "مبلغ معتبر وارد کنید."
    );

    return;
  }

  try{

    const response =
      await fetch(
        API + "/api/deposit",
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json"
          },

          body:JSON.stringify({
            username,
            amount,
            reference
          })
        }
      );

    const data =
      await response.json();

    show(
      "depositMessage",
      data.success
        ? "✅ درخواست واریز ثبت شد."
        : "❌ " + data.error
    );

    if(data.success){

      document.getElementById(
        "depositAmount"
      ).value = "";

      document.getElementById(
        "depositReference"
      ).value = "";
    }

  }catch(error){

    show(
      "depositMessage",
      "خطا در اتصال."
    );
  }
}


// =========================================================
// برداشت
// =========================================================

async function withdraw(){

  const username =
    document.getElementById(
      "username"
    ).value.trim();

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

  const account =
    document.getElementById(
      "withdrawAccount"
    ).value.trim();

  if(!username){

    show(
      "withdrawMessage",
      "ابتدا نام کاربری را وارد کنید."
    );

    return;
  }

  if(!amount || amount < 10000){

    show(
      "withdrawMessage",
      "حداقل برداشت ۱۰٬۰۰۰ تومان است."
    );

    return;
  }

  if(!method || !account){

    show(
      "withdrawMessage",
      "اطلاعات برداشت را کامل کنید."
    );

    return;
  }

  try{

    const response =
      await fetch(
        API + "/api/withdraw",
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json"
          },

          body:JSON.stringify({
            username,
            amount,
            method,
            account
          })
        }
      );

    const data =
      await response.json();

    show(
      "withdrawMessage",
      data.success
        ? "✅ درخواست برداشت ثبت شد."
        : "❌ " + data.error
    );

    if(data.success){

      document.getElementById(
        "withdrawAmount"
      ).value = "";

      document.getElementById(
        "withdrawAccount"
      ).value = "";

      loadAccount();
    }

  }catch(error){

    show(
      "withdrawMessage",
      "خطا در اتصال."
    );
  }
}


// =========================================================
// ورود مدیریت
// =========================================================

async function adminLogin(){

  const password =
    document.getElementById(
      "adminPassword"
    ).value;

  try{

    const response =
      await fetch(
        API + "/api/admin/login",
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
      );

    const data =
      await response.json();

    if(!data.success){

      show(
        "adminLoginMessage",
        "❌ " +
        (
          data.error ||
          "رمز اشتباه است."
        )
      );

      return;
    }

    document.getElementById(
      "adminPanel"
    ).classList.remove(
      "hidden"
    );

    show(
      "adminLoginMessage",
      "✅ ورود مدیر موفق بود."
    );

    loadAdminData();

  }catch(error){

    show(
      "adminLoginMessage",
      "خطا در اتصال."
    );
  }
}


// =========================================================
// افزایش موجودی
// =========================================================

async function addBalance(){

  const password =
    document.getElementById(
      "adminPassword"
    ).value;

  const username =
    document.getElementById(
      "adminUsername"
    ).value.trim();

  const amount =
    Number(
      document.getElementById(
        "adminAmount"
      ).value
    );

  try{

    const response =
      await fetch(
        API + "/api/admin/add-balance",
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json"
          },

          body:JSON.stringify({
            password,
            username,
            amount
          })
        }
      );

    const data =
      await response.json();

    alert(
      data.success
        ? "موجودی افزایش یافت."
        : data.error
    );

    if(data.success){

      loadAdminData();
      loadAccount();
    }

  }catch(error){

    alert(
      "خطا در اتصال."
    );
  }
}


// =========================================================
// اطلاعات مدیریت
// =========================================================

async function loadAdminData(){

  const password =
    document.getElementById(
      "adminPassword"
    ).value;

  try{

    const response =
      await fetch(
        API + "/api/admin/data",
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
      );

    const data =
      await response.json();

    if(!data.success){

      document.getElementById(
        "adminData"
      ).textContent =
        data.error;

      return;
    }

    let html = "";

    // کاربران

    html +=
      "<h4>👥 کاربران</h4>";

    html += "<table>";

    html += `
      <tr>
        <th>ID</th>
        <th>نام</th>
        <th>موجودی</th>
        <th>تاریخ</th>
      </tr>
    `;

    for(
      const user of data.users
    ){

      html += `
        <tr>

          <td>
            ${user.id}
          </td>

          <td>
            ${escapeHtml(
              user.username
            )}
          </td>

          <td>
            ${Number(
              user.balance || 0
            ).toLocaleString("fa-IR")}
          </td>

          <td>
            ${escapeHtml(
              user.created_at
            )}
          </td>

        </tr>
      `;
    }

    html += "</table>";


    // واریزها

    html +=
      "<h4>💵 واریزها</h4>";

    html += "<table>";

    html += `
      <tr>
        <th>ID</th>
        <th>کاربر</th>
        <th>مبلغ</th>
        <th>پیگیری</th>
        <th>وضعیت</th>
        <th>عملیات</th>
      </tr>
    `;

    for(
      const d of data.deposits
    ){

      html += `
        <tr>

          <td>
            ${d.id}
          </td>

          <td>
            ${escapeHtml(
              d.username
            )}
          </td>

          <td>
            ${Number(
              d.amount || 0
            ).toLocaleString("fa-IR")}
          </td>

          <td>
            ${escapeHtml(
              d.reference || "-"
            )}
          </td>

          <td>
            ${escapeHtml(
              d.status
            )}
          </td>

          <td>

            <button
              class="green"
              onclick="changeDepositStatus(
                ${d.id},
                'approved'
              )"
            >
              تأیید
            </button>

            <button
              class="red"
              onclick="changeDepositStatus(
                ${d.id},
                'rejected'
              )"
            >
              رد
            </button>

          </td>

        </tr>
      `;
    }

    html += "</table>";


    // برداشت‌ها

    html +=
      "<h4>💸 برداشت‌ها</h4>";

    html += "<table>";

    html += `
      <tr>
        <th>ID</th>
        <th>کاربر</th>
        <th>مبلغ</th>
        <th>روش</th>
        <th>حساب</th>
        <th>وضعیت</th>
        <th>عملیات</th>
      </tr>
    `;

    for(
      const w of data.withdrawals
    ){

      html += `
        <tr>

          <td>
            ${w.id}
          </td>

          <td>
            ${escapeHtml(
              w.username
            )}
          </td>

          <td>
            ${Number(
              w.amount || 0
            ).toLocaleString("fa-IR")}
          </td>

          <td>
            ${escapeHtml(
              w.method
            )}
          </td>

          <td>
            ${escapeHtml(
              w.account
            )}
          </td>

          <td>
            ${escapeHtml(
              w.status
            )}
          </td>

          <td>

            <button
              class="green"
              onclick="changeWithdrawalStatus(
                ${w.id},
                'paid'
              )"
            >
              پرداخت شد
            </button>

            <button
              class="red"
              onclick="changeWithdrawalStatus(
                ${w.id},
                'rejected'
              )"
            >
              رد
            </button>

          </td>

        </tr>
      `;
    }

    html += "</table>";

    document.getElementById(
      "adminData"
    ).innerHTML = html;

  }catch(error){

    document.getElementById(
      "adminData"
    ).textContent =
      "خطا در اتصال.";
  }
}


// =========================================================
// تغییر وضعیت واریز
// =========================================================

async function changeDepositStatus(
  id,
  status
){

  const password =
    document.getElementById(
      "adminPassword"
    ).value;

  try{

    const response =
      await fetch(
        API +
        "/api/admin/deposit-status",
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json"
          },

          body:JSON.stringify({
            password,
            id,
            status
          })
        }
      );

    const data =
      await response.json();

    alert(
      data.success
        ? "وضعیت واریز تغییر کرد."
        : data.error
    );

    if(data.success){

      loadAdminData();
      loadAccount();
    }

  }catch(error){

    alert(
      "خطا در اتصال."
    );
  }
}


// =========================================================
// تغییر وضعیت برداشت
// =========================================================

async function changeWithdrawalStatus(
  id,
  status
){

  const password =
    document.getElementById(
      "adminPassword"
    ).value;

  try{

    const response =
      await fetch(
        API +
        "/api/admin/withdraw-status",
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json"
          },

          body:JSON.stringify({
            password,
            id,
            status
          })
        }
      );

    const data =
      await response.json();

    alert(
      data.success
        ? "وضعیت برداشت تغییر کرد."
        : data.error
    );

    if(data.success){

      loadAdminData();
      loadAccount();
    }

  }catch(error){

    alert(
      "خطا در اتصال."
    );
  }
}


// =========================================================
// ابزارهای کاربردی
// =========================================================

function calculatePercent(){

  const number =
    Number(
      document.getElementById(
        "percentNumber"
      ).value
    );

  const percent =
    Number(
      document.getElementById(
        "percentValue"
      ).value
    );

  const result =
    number * percent / 100;

  document.getElementById(
    "percentResult"
  ).textContent =
    "نتیجه: " +
    result.toLocaleString("fa-IR");
}


function calculateDollar(){

  const dollar =
    Number(
      document.getElementById(
        "dollarAmount"
      ).value
    );

  const rate =
    Number(
      document.getElementById(
        "dollarRate"
      ).value
    );

  const result =
    dollar * rate;

  document.getElementById(
    "dollarResult"
  ).textContent =
    "نتیجه: " +
    result.toLocaleString("fa-IR") +
    " تومان";
}


function calculateDiscount(){

  const price =
    Number(
      document.getElementById(
        "discountPrice"
      ).value
    );

  const percent =
    Number(
      document.getElementById(
        "discountPercent"
      ).value
    );

  const discount =
    price * percent / 100;

  const finalPrice =
    price - discount;

  document.getElementById(
    "discountResult"
  ).textContent =
    "مبلغ تخفیف: " +
    discount.toLocaleString("fa-IR") +
    " | قیمت نهایی: " +
    finalPrice.toLocaleString("fa-IR");
}


function calculateProfit(){

  const buy =
    Number(
      document.getElementById(
        "buyPrice"
      ).value
    );

  const sell =
    Number(
      document.getElementById(
        "sellPrice"
      ).value
    );

  const profit =
    sell - buy;

  document.getElementById(
    "profitResult"
  ).textContent =
    "سود: " +
    profit.toLocaleString("fa-IR");
}


function convertKm(){

  const km =
    Number(
      document.getElementById(
        "km"
      ).value
    );

  const meter =
    km * 1000;

  document.getElementById(
    "kmResult"
  ).textContent =
    meter.toLocaleString("fa-IR") +
    " متر";
}


function calculateLoan(){

  const amount =
    Number(
      document.getElementById(
        "loanAmount"
      ).value
    );

  const months =
    Number(
      document.getElementById(
        "loanMonths"
      ).value
    );

  if(!months){

    document.getElementById(
      "loanResult"
    ).textContent =
      "تعداد ماه معتبر نیست.";

    return;
  }

  const monthly =
    amount / months;

  document.getElementById(
    "loanResult"
  ).textContent =
    "قسط ماهانه: " +
    monthly.toLocaleString("fa-IR");
}


function calculateAge(){

  const birthYear =
    Number(
      document.getElementById(
        "birthYear"
      ).value
    );

  const currentYear = 1405;

  const age =
    currentYear - birthYear;

  document.getElementById(
    "ageResult"
  ).textContent =
    "سن تقریبی: " +
    age.toLocaleString("fa-IR") +
    " سال";
}


function generateIntro(){

  const topic =
    document.getElementById(
      "introTopic"
    ).value.trim();

  if(!topic){

    document.getElementById(
      "introResult"
    ).textContent =
      "لطفاً نام یا موضوع را وارد کنید.";

    return;
  }

  document.getElementById(
    "introResult"
  ).textContent =
    "معرفی " +
    topic +
    ":\n" +
    topic +
    " یک موضوع کاربردی و جذاب است که می‌تواند برای کاربران مفید و ارزشمند باشد. هدف ما ارائه اطلاعات ساده، واضح و کاربردی درباره این موضوع است.";
}


// =========================================================
// جلوگیری از HTML Injection
// =========================================================

function escapeHtml(value){

  return String(value)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}

</script>

</body>
</html>
`;
