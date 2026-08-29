export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // صفحه اصلی
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(HTML, {
        headers: {
          "content-type": "text/html; charset=UTF-8"
        }
      });
    }

    // آماده‌سازی پایگاه داده
    if (request.method === "POST" && url.pathname === "/api/setup") {
      try {
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            balance REAL DEFAULT 0,
            plan TEXT DEFAULT 'free',
            created_at TEXT
          )
        `).run();

        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS deposits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account_id INTEGER,
            amount REAL,
            description TEXT,
            status TEXT DEFAULT 'pending',
            created_at TEXT
          )
        `).run();

        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS withdrawals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account_id INTEGER,
            amount REAL,
            method TEXT,
            payment TEXT,
            status TEXT DEFAULT 'pending',
            created_at TEXT
          )
        `).run();

        return Response.json({
          success: true,
          message: "پایگاه داده آماده شد."
        });
      } catch (error) {
        return Response.json(
          { error: error?.message || String(error) },
          { status: 500 }
        );
      }
    }

    // هوش مصنوعی
    if (request.method === "POST" && url.pathname === "/api/ai") {
      try {
        const body = await request.json();
        const prompt = String(body.prompt || "").trim();

        if (!prompt) {
          return Response.json(
            { error: "لطفاً پیام خود را بنویسید." },
            { status: 400 }
          );
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct-fast",
          {
            messages: [
              {
                role: "system",
                content:
                  "تو یک دستیار هوش مصنوعی فارسی هستی. پاسخ‌ها را واضح، مفید و دوستانه به زبان فارسی بده."
              },
              {
                role: "user",
                content: prompt
              }
            ]
          }
        );

        return Response.json({
          response: result.response || "پاسخی دریافت نشد."
        });
      } catch (error) {
        return Response.json(
          {
            error:
              "خطا در دریافت پاسخ هوش مصنوعی: " +
              (error?.message || String(error))
          },
          { status: 500 }
        );
      }
    }

    // دریافت حساب
    if (request.method === "GET" && url.pathname === "/api/account") {
      try {
        const account = await env.DB.prepare(
          "SELECT * FROM accounts ORDER BY id ASC LIMIT 1"
        ).first();

        return Response.json({
          account: account || null
        });
      } catch (error) {
        return Response.json(
          { error: error?.message || String(error) },
          { status: 500 }
        );
      }
    }

    // ذخیره حساب
    if (request.method === "POST" && url.pathname === "/api/account") {
      try {
        const body = await request.json();

        const name = String(body.name || "").trim();
        const email = String(body.email || "").trim();

        if (!name || !email) {
          return Response.json(
            { error: "نام و ایمیل را وارد کنید." },
            { status: 400 }
          );
        }

        const existing = await env.DB.prepare(
          "SELECT id FROM accounts ORDER BY id ASC LIMIT 1"
        ).first();

        if (existing) {
          await env.DB.prepare(
            "UPDATE accounts SET name = ?, email = ? WHERE id = ?"
          )
            .bind(name, email, existing.id)
            .run();
        } else {
          await env.DB.prepare(`
            INSERT INTO accounts
            (name, email, balance, plan, created_at)
            VALUES (?, ?, 0, 'free', ?)
          `)
            .bind(name, email, new Date().toISOString())
            .run();
        }

        return Response.json({
          success: true,
          message: "اطلاعات حساب ذخیره شد."
        });
      } catch (error) {
        return Response.json(
          { error: error?.message || String(error) },
          { status: 500 }
        );
      }
    }

    // ثبت واریز
    if (request.method === "POST" && url.pathname === "/api/deposit") {
      try {
        const body = await request.json();

        const amount = Number(body.amount);
        const description = String(body.description || "").trim();

        if (!Number.isFinite(amount) || amount <= 0) {
          return Response.json(
            { error: "مبلغ واریز معتبر نیست." },
            { status: 400 }
          );
        }

        const account = await env.DB.prepare(
          "SELECT * FROM accounts ORDER BY id ASC LIMIT 1"
        ).first();

        if (!account) {
          return Response.json(
            { error: "ابتدا حساب کاربری را ایجاد کنید." },
            { status: 400 }
          );
        }

        await env.DB.prepare(`
          INSERT INTO deposits
          (account_id, amount, description, status, created_at)
          VALUES (?, ?, ?, 'pending', ?)
        `)
          .bind(
            account.id,
            amount,
            description,
            new Date().toISOString()
          )
          .run();

        return Response.json({
          success: true,
          message: "درخواست واریز ثبت شد و منتظر تأیید مدیر است."
        });
      } catch (error) {
        return Response.json(
          { error: error?.message || String(error) },
          { status: 500 }
        );
      }
    }

    // ثبت برداشت
    if (request.method === "POST" && url.pathname === "/api/withdraw") {
      try {
        const body = await request.json();

        const amount = Number(body.amount);
        const method = String(body.method || "").trim();
        const payment = String(body.payment || "").trim();

        if (!Number.isFinite(amount) || amount < 1) {
          return Response.json(
            { error: "حداقل مبلغ برداشت $1 است." },
            { status: 400 }
          );
        }

        if (!payment) {
          return Response.json(
            { error: "اطلاعات دریافت را وارد کنید." },
            { status: 400 }
          );
        }

        const account = await env.DB.prepare(
          "SELECT * FROM accounts ORDER BY id ASC LIMIT 1"
        ).first();

        if (!account) {
          return Response.json(
            { error: "ابتدا حساب کاربری را ذخیره کنید." },
            { status: 400 }
          );
        }

        if (Number(account.balance) < amount) {
          return Response.json(
            { error: "موجودی کافی نیست." },
            { status: 400 }
          );
        }

        await env.DB.prepare(`
          INSERT INTO withdrawals
          (account_id, amount, method, payment, status, created_at)
          VALUES (?, ?, ?, ?, 'pending', ?)
        `)
          .bind(
            account.id,
            amount,
            method,
            payment,
            new Date().toISOString()
          )
          .run();

        await env.DB.prepare(
          "UPDATE accounts SET balance = balance - ? WHERE id = ?"
        )
          .bind(amount, account.id)
          .run();

        return Response.json({
          success: true,
          message: "درخواست برداشت ثبت شد."
        });
      } catch (error) {
        return Response.json(
          { error: error?.message || String(error) },
          { status: 500 }
        );
      }
    }

    // ورود مدیریت
    if (
      request.method === "POST" &&
      url.pathname === "/api/admin/login"
    ) {
      try {
        const body = await request.json();
        const password = String(body.password || "");

        const adminPassword =
          env.ADMIN_PASSWORD || "123456";

        if (password !== adminPassword) {
          return Response.json(
            { error: "رمز مدیریت اشتباه است." },
            { status: 401 }
          );
        }

        return Response.json({
          success: true,
          token: "ADMIN_OK"
        });
      } catch (error) {
        return Response.json(
          { error: error?.message || String(error) },
          { status: 500 }
        );
      }
    }

    // اطلاعات مدیریت
    if (
      request.method === "GET" &&
      url.pathname === "/api/admin/data"
    ) {
      if (
        request.headers.get("x-admin-token") !== "ADMIN_OK"
      ) {
        return Response.json(
          { error: "دسترسی غیرمجاز." },
          { status: 401 }
        );
      }

      try {
        const accounts = await env.DB.prepare(`
          SELECT * FROM accounts
          ORDER BY id DESC
        `).all();

        const deposits = await env.DB.prepare(`
          SELECT deposits.*, accounts.name, accounts.email
          FROM deposits
          LEFT JOIN accounts
          ON deposits.account_id = accounts.id
          ORDER BY deposits.id DESC
        `).all();

        const withdrawals = await env.DB.prepare(`
          SELECT withdrawals.*, accounts.name, accounts.email
          FROM withdrawals
          LEFT JOIN accounts
          ON withdrawals.account_id = accounts.id
          ORDER BY withdrawals.id DESC
        `).all();

        return Response.json({
          accounts: accounts.results || [],
          deposits: deposits.results || [],
          withdrawals: withdrawals.results || []
        });
      } catch (error) {
        return Response.json(
          { error: error?.message || String(error) },
          { status: 500 }
        );
      }
    }

    // تأیید واریز
    if (
      request.method === "POST" &&
      url.pathname === "/api/admin/deposit/approve"
    ) {
      if (
        request.headers.get("x-admin-token") !== "ADMIN_OK"
      ) {
        return Response.json(
          { error: "دسترسی غیرمجاز." },
          { status: 401 }
        );
      }

      try {
        const { id } = await request.json();

        const deposit = await env.DB.prepare(
          "SELECT * FROM deposits WHERE id = ?"
        )
          .bind(Number(id))
          .first();

        if (!deposit) {
          return Response.json(
            { error: "واریز پیدا نشد." },
            { status: 404 }
          );
        }

        if (deposit.status !== "pending") {
          return Response.json(
            { error: "این تراکنش قبلاً بررسی شده است." },
            { status: 400 }
          );
        }

        await env.DB.prepare(
          "UPDATE deposits SET status = 'approved' WHERE id = ?"
        )
          .bind(Number(id))
          .run();

        await env.DB.prepare(
          "UPDATE accounts SET balance = balance + ? WHERE id = ?"
        )
          .bind(deposit.amount, deposit.account_id)
          .run();

        return Response.json({
          success: true,
          message: "واریز تأیید شد و موجودی افزایش یافت."
        });
      } catch (error) {
        return Response.json(
          { error: error?.message || String(error) },
          { status: 500 }
        );
      }
    }

    // رد واریز
    if (
      request.method === "POST" &&
      url.pathname === "/api/admin/deposit/reject"
    ) {
      if (
        request.headers.get("x-admin-token") !== "ADMIN_OK"
      ) {
        return Response.json(
          { error: "دسترسی غیرمجاز." },
          { status: 401 }
        );
      }

      try {
        const { id } = await request.json();

        await env.DB.prepare(
          "UPDATE deposits SET status = 'rejected' WHERE id = ? AND status = 'pending'"
        )
          .bind(Number(id))
          .run();

        return Response.json({
          success: true,
          message: "واریز رد شد."
        });
      } catch (error) {
        return Response.json(
          { error: error?.message || String(error) },
          { status: 500 }
        );
      }
    }

    // تأیید برداشت
    if (
      request.method === "POST" &&
      url.pathname === "/api/admin/withdraw/approve"
    ) {
      if (
        request.headers.get("x-admin-token") !== "ADMIN_OK"
      ) {
        return Response.json(
          { error: "دسترسی غیرمجاز." },
          { status: 401 }
        );
      }

      try {
        const { id } = await request.json();

        const withdrawal = await env.DB.prepare(
          "SELECT * FROM withdrawals WHERE id = ?"
        )
          .bind(Number(id))
          .first();

        if (!withdrawal) {
          return Response.json(
            { error: "درخواست برداشت پیدا نشد." },
            { status: 404 }
          );
        }

        if (withdrawal.status !== "pending") {
          return Response.json(
            { error: "این درخواست قبلاً بررسی شده است." },
            { status: 400 }
          );
        }

        await env.DB.prepare(
          "UPDATE withdrawals SET status = 'approved' WHERE id = ?"
        )
          .bind(Number(id))
          .run();

        return Response.json({
          success: true,
          message: "برداشت تأیید شد."
        });
      } catch (error) {
        return Response.json(
          { error: error?.message || String(error) },
          { status: 500 }
        );
      }
    }

    // رد برداشت
    if (
      request.method === "POST" &&
      url.pathname === "/api/admin/withdraw/reject"
    ) {
      if (
        request.headers.get("x-admin-token") !== "ADMIN_OK"
      ) {
        return Response.json(
          { error: "دسترسی غیرمجاز." },
          { status: 401 }
        );
      }

      try {
        const { id } = await request.json();

        const withdrawal = await env.DB.prepare(
          "SELECT * FROM withdrawals WHERE id = ?"
        )
          .bind(Number(id))
          .first();

        if (!withdrawal) {
          return Response.json(
            { error: "درخواست برداشت پیدا نشد." },
            { status: 404 }
          );
        }

        if (withdrawal.status !== "pending") {
          return Response.json(
            { error: "این درخواست قبلاً بررسی شده است." },
            { status: 400 }
          );
        }

        await env.DB.prepare(
          "UPDATE withdrawals SET status = 'rejected' WHERE id = ?"
        )
          .bind(Number(id))
          .run();

        await env.DB.prepare(
          "UPDATE accounts SET balance = balance + ? WHERE id = ?"
        )
          .bind(withdrawal.amount, withdrawal.account_id)
          .run();

        return Response.json({
          success: true,
          message: "برداشت رد شد و مبلغ برگشت."
        });
      } catch (error) {
        return Response.json(
          { error: error?.message || String(error) },
          { status: 500 }
        );
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};


// ======================================================
// HTML
// ======================================================

const HTML = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ابزارک AI</title>

<style>
*{box-sizing:border-box}

body{
 margin:0;
 padding:15px;
 background:#f4f6fb;
 font-family:Tahoma,Arial,sans-serif
}

.container{
 max-width:750px;
 margin:auto
}

.card{
 background:#fff;
 border-radius:18px;
 padding:18px;
 margin-bottom:15px;
 box-shadow:0 4px 20px rgba(0,0,0,.08)
}

h1,h2,h3{
 margin-top:5px
}

.subtitle{
 text-align:center;
 color:#777;
 margin-bottom:20px
}

.balance{
 text-align:center;
 font-size:30px;
 font-weight:bold;
 margin:10px
}

.balance-label{
 text-align:center;
 color:#777
}

button{
 border:none;
 border-radius:10px;
 padding:12px 16px;
 font-size:15px;
 cursor:pointer;
 margin:4px
}

.primary{
 background:#2563eb;
 color:white
}

.success{
 background:#16a34a;
 color:white
}

.danger{
 background:#dc2626;
 color:white
}

.gray{
 background:#eee
}

input,textarea,select{
 width:100%;
 padding:13px;
 border:1px solid #ddd;
 border-radius:10px;
 margin-top:8px;
 margin-bottom:10px;
 font-size:15px;
 font-family:Tahoma
}

textarea{
 min-height:110px;
 resize:vertical
}

.hidden{
 display:none
}

.notice{
 background:#fff7ed;
 padding:12px;
 border-radius:10px;
 margin:10px 0;
 line-height:1.8
}

.plan{
 border:1px solid #ddd;
 border-radius:14px;
 padding:15px;
 margin:10px 0
}

.plan h3{
 margin:0 0 8px
}

.answer{
 margin-top:15px;
 background:#f8fafc;
 padding:15px;
 border-radius:12px;
 line-height:2;
 white-space:pre-wrap
}

.item{
 background:#f8fafc;
 padding:12px;
 border-radius:10px;
 margin:8px 0;
 line-height:2
}
</style>
</head>

<body>

<div class="container">

<div class="card">

<h1>🤖 ابزارک AI</h1>

<div class="subtitle">
ابزارهای سریع و کاربردی برای کارهای روزمره و تولید محتوا
</div>

<textarea id="prompt" placeholder="سوالت را بنویس..."></textarea>

<button class="primary" onclick="sendMessage()">ارسال</button>

<button class="gray" onclick="clearChat()">🗑️ پاک کردن گفتگو</button>

<div id="answer"></div>

</div>


<div class="card">

<h2>🚀 اشتراک ابزارک</h2>

<div class="plan">
<h3>🆓 رایگان</h3>
<strong>۰ تومان</strong>
<p>استفاده محدود از ابزارهای پایه</p>
<button class="gray">پلن فعلی</button>
</div>

<div class="plan">
<h3>⭐ حرفه‌ای</h3>
<strong>۳۹۹٬۰۰۰ تومان</strong>
<p>اشتراک یک‌ماهه</p>
<p>استفاده بیشتر از ابزارها و امکانات حرفه‌ای</p>
<button class="primary" onclick="requestPlan('professional')">
خرید اشتراک حرفه‌ای
</button>
</div>

<div class="plan">
<h3>👑 ویژه</h3>
<strong>۷۹۹٬۰۰۰ تومان</strong>
<p>اشتراک یک‌ماهه</p>
<p>سقف استفاده بسیار بالا و امکانات ویژه</p>
<button class="primary" onclick="requestPlan('special')">
خرید اشتراک ویژه
</button>
</div>

</div>


<div class="card">

<h2>💳 وضعیت اشتراک</h2>

<div id="planStatus">
پلن فعلی: رایگان
</div>

</div>


<div class="card">

<h2>💰 موجودی قابل برداشت</h2>

<div class="balance">
$<span id="balance">0.00</span>
</div>

<div class="notice">
موجودی فقط پس از ثبت و تأیید تراکنش افزایش پیدا می‌کند.
</div>

<button class="success" onclick="showDeposit()">💵 واریز</button>

<button class="gray" onclick="showAccount()">👤 حساب کاربری</button>

<button class="gray" onclick="showWithdraw()">💸 درخواست برداشت</button>

</div>


<div class="card hidden" id="account">

<h2>👤 حساب کاربری</h2>

<input id="name" placeholder="نام شما">

<input id="email" type="email" placeholder="ایمیل شما">

<button class="primary" onclick="saveAccount()">
ذخیره اطلاعات
</button>

<div id="accountMessage"></div>

</div>


<div class="card hidden" id="deposit">

<h2>💵 ثبت واریز</h2>

<div class="notice">
مبلغ واریز را وارد کنید. پس از بررسی و تأیید مدیر، مبلغ به موجودی اضافه می‌شود.
</div>

<input id="depositAmount" type="number" step="0.01" placeholder="مبلغ">

<input id="depositDescription" placeholder="شماره پیگیری یا توضیح">

<button class="success" onclick="requestDeposit()">
ثبت درخواست واریز
</button>

<button class="gray" onclick="hideDeposit()">بستن</button>

<div id="depositMessage"></div>

</div>


<div class="card hidden" id="withdraw">

<h2>💸 درخواست برداشت</h2>

<select id="method">
<option value="Bank">حساب بانکی</option>
<option value="USDT">USDT</option>
<option value="Wallet">کیف پول</option>
</select>

<input id="withdrawAmount" type="number" step="0.01" placeholder="مبلغ برداشت">

<input id="payment" placeholder="شماره حساب / آدرس کیف پول">

<button class="success" onclick="requestWithdraw()">
ثبت درخواست برداشت
</button>

<button class="gray" onclick="hideWithdraw()">بستن</button>

<div id="withdrawMessage"></div>

</div>


<div class="card">

<h2>🧰 ابزارهای کاربردی</h2>

<div class="item">
🧮 محاسبه درصد
<input id="percentA" type="number" placeholder="عدد">
<input id="percentB" type="number" placeholder="درصد">
<button class="primary" onclick="calcPercent()">محاسبه</button>
<div id="percentResult"></div>
</div>

<div class="item">
💵 دلار به تومان
<input id="usd" type="number" placeholder="مبلغ دلار">
<input id="rate" type="number" placeholder="نرخ دلار">
<button class="primary" onclick="calcDollar()">محاسبه</button>
<div id="dollarResult"></div>
</div>

<div class="item">
🏷️ محاسبه تخفیف
<input id="price" type="number" placeholder="قیمت">
<input id="discount" type="number" placeholder="درصد تخفیف">
<button class="primary" onclick="calcDiscount()">محاسبه</button>
<div id="discountResult"></div>
</div>

<div class="item">
📈 محاسبه سود
<input id="buy" type="number" placeholder="قیمت خرید">
<input id="sell" type="number" placeholder="قیمت فروش">
<button class="primary" onclick="calcProfit()">محاسبه</button>
<div id="profitResult"></div>
</div>

<div class="item">
📏 کیلومتر به متر
<input id="km" type="number" placeholder="کیلومتر">
<button class="primary" onclick="calcKm()">تبدیل</button>
<div id="kmResult"></div>
</div>

<div class="item">
💳 محاسبه اقساط
<input id="loan" type="number" placeholder="مبلغ">
<input id="months" type="number" placeholder="تعداد ماه">
<button class="primary" onclick="calcLoan()">محاسبه</button>
<div id="loanResult"></div>
</div>

<div class="item">
🎂 محاسبه سن
<input id="birth" type="number" placeholder="سال تولد">
<button class="primary" onclick="calcAge()">محاسبه</button>
<div id="ageResult"></div>
</div>

<div class="item">
📝 تولید متن معرفی
<input id="introName" placeholder="نام / موضوع">
<button class="primary" onclick="makeIntro()">تولید متن</button>
<div id="introResult"></div>
</div>

</div>


<div class="card">

<h3>📋 وضعیت حساب</h3>

<div id="status">
حساب فعال است.
</div>

</div>


<div class="card">

<h2>🔐 پنل مدیریت</h2>

<input id="adminPassword" type="password" placeholder="رمز مدیریت">

<button class="danger" onclick="adminLogin()">
ورود مدیر
</button>

<div id="adminMessage"></div>

</div>


<div class="card hidden" id="adminPanel">

<h2>📊 مدیریت</h2>

<button class="primary" onclick="loadAdminData()">
🔄 بروزرسانی
</button>

<h3>👥 کاربران</h3>
<div id="adminAccounts"></div>

<h3>💵 واریزها</h3>
<div id="adminDeposits"></div>

<h3>💸 برداشت‌ها</h3>
<div id="adminWithdrawals"></div>

</div>

</div>


<script>

let balance = 0;
let adminToken = "";


function updateBalance(value) {
  balance = Number(value || 0);
  document.getElementById("balance").textContent =
    balance.toFixed(2);
}


async function loadAccount() {
  try {
    const r = await fetch("/api/account");
    const d = await r.json();

    if (d.account) {
      updateBalance(d.account.balance);

      document.getElementById("name").value =
        d.account.name || "";

      document.getElementById("email").value =
        d.account.email || "";

      document.getElementById("planStatus").textContent =
        "پلن فعلی: " +
        (
          d.account.plan === "professional"
            ? "⭐ حرفه‌ای"
            : d.account.plan === "special"
              ? "👑 ویژه"
              : "🆓 رایگان"
        );
    }
  } catch (e) {
    console.log(e);
  }
}


async function sendMessage() {

  const prompt =
    document.getElementById("prompt").value.trim();

  const answer =
    document.getElementById("answer");

  if (!prompt) {
    answer.innerHTML =
      '<div class="answer">لطفاً پیام خود را بنویسید.</div>';
    return;
  }

  answer.innerHTML =
    '<div class="answer">⏳ در حال دریافت پاسخ...</div>';

  try {

    const r = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const d = await r.json();

    if (d.error) {
      answer.innerHTML =
        '<div class="answer">❌ ' +
        escapeHtml(d.error) +
        '</div>';
      return;
    }

    answer.innerHTML =
      '<div class="answer">' +
      escapeHtml(d.response) +
      '</div>';

  } catch (e) {

    answer.innerHTML =
      '<div class="answer">❌ خطا در اتصال به سرور</div>';
  }
}


function clearChat() {
  document.getElementById("prompt").value = "";
  document.getElementById("answer").innerHTML = "";
}


function showAccount() {
  document.getElementById("account")
    .classList.remove("hidden");
}


function showDeposit() {
  document.getElementById("deposit")
    .classList.remove("hidden");
}


function hideDeposit() {
  document.getElementById("deposit")
    .classList.add("hidden");
}


function showWithdraw() {
  document.getElementById("withdraw")
    .classList.remove("hidden");
}


function hideWithdraw() {
  document.getElementById("withdraw")
    .classList.add("hidden");
}


async function saveAccount() {

  const name =
    document.getElementById("name").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const msg =
    document.getElementById("accountMessage");

  if (!name || !email) {
    msg.innerHTML =
      '<div class="notice">❌ نام و ایمیل را وارد کنید.</div>';
    return;
  }

  try {

    const r = await fetch("/api/account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email })
    });

    const d = await r.json();

    msg.innerHTML =
      '<div class="notice">' +
      (
        d.error
          ? "❌ " + escapeHtml(d.error)
          : "✅ اطلاعات ذخیره شد."
      ) +
      '</div>';

  } catch (e) {

    msg.innerHTML =
      '<div class="notice">❌ خطا در اتصال</div>';
  }
}


async function requestDeposit() {

  const amount =
    Number(document.getElementById("depositAmount").value);

  const description =
    document.getElementById("depositDescription").value.trim();

  const msg =
    document.getElementById("depositMessage");

  if (!Number.isFinite(amount) || amount <= 0) {
    msg.innerHTML =
      '<div class="notice">❌ مبلغ معتبر وارد کنید.</div>';
    return;
  }

  try {

    const r = await fetch("/api/deposit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount,
        description
      })
    });

    const d = await r.json();

    msg.innerHTML =
      '<div class="notice">' +
      (
        d.error
          ? "❌ " + escapeHtml(d.error)
          : "✅ " + escapeHtml(d.message)
      ) +
      '</div>';

  } catch (e) {

    msg.innerHTML =
      '<div class="notice">❌ خطا در اتصال</div>';
  }
}


async function requestWithdraw() {

  const amount =
    Number(document.getElementById("withdrawAmount").value);

  const method =
    document.getElementById("method").value;

  const payment =
    document.getElementById("payment").value.trim();

  const msg =
    document.getElementById("withdrawMessage");

  if (!Number.isFinite(amount) || amount < 1) {
    msg.innerHTML =
      '<div class="notice">❌ حداقل برداشت $1 است.</div>';
    return;
  }

  if (amount > balance) {
    msg.innerHTML =
      '<div class="notice">❌ موجودی کافی نیست.</div>';
    return;
  }

  if (!payment) {
    msg.innerHTML =
      '<div class="notice">❌ اطلاعات دریافت را وارد کنید.</div>';
    return;
  }

  try {

    const r = await fetch("/api/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount,
        method,
        payment
      })
    });

    const d = await r.json();

    msg.innerHTML =
      '<div class="notice">' +
      (
        d.error
          ? "❌ " + escapeHtml(d.error)
          : "✅ " + escapeHtml(d.message)
      ) +
      '</div>';

    await loadAccount();

  } catch (e) {

    msg.innerHTML =
      '<div class="notice">❌ خطا در اتصال</div>';
  }
}


function requestPlan(plan) {

  const amount =
    plan === "professional"
      ? 399000
      : 799000;

  const description =
    plan === "professional"
      ? "خرید اشتراک حرفه‌ای"
      : "خرید اشتراک ویژه";

  const ok = confirm(
    description +
    "\\nمبلغ: " +
    amount.toLocaleString("fa-IR") +
    " تومان" +
    "\\n\\nپرداخت واقعی هنوز به درگاه متصل نشده است. درخواست واریز ثبت شود؟"
  );

  if (!ok) return;

  document.getElementById("deposit")
    .classList.remove("hidden");

  document.getElementById("depositAmount").value =
    amount;

  document.getElementById("depositDescription").value =
    description;
}


async function adminLogin() {

  const password =
    document.getElementById("adminPassword").value;

  const msg =
    document.getElementById("adminMessage");

  try {

    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    const d = await r.json();

    if (!d.success) {
      msg.innerHTML =
        '<div class="notice">❌ ' +
        escapeHtml(d.error) +
        '</div>';
      return;
    }

    adminToken = d.token;

    document.getElementById("adminPanel")
      .classList.remove("hidden");

    msg.innerHTML =
      '<div class="notice">✅ ورود مدیر موفق بود.</div>';

    loadAdminData();

  } catch (e) {

    msg.innerHTML =
      '<div class="notice">❌ خطا در ورود</div>';
  }
}


async function loadAdminData() {

  if (!adminToken) return;

  try {

    const r = await fetch("/api/admin/data", {
      headers: {
        "x-admin-token": adminToken
      }
    });

    const d = await r.json();

    if (d.error) {
      alert(d.error);
      return;
    }

    renderAccounts(d.accounts || []);
    renderDeposits(d.deposits || []);
    renderWithdrawals(d.withdrawals || []);

  } catch (e) {

    alert("خطا در دریافت اطلاعات مدیریت");
  }
}


function renderAccounts(items) {

  const box =
    document.getElementById("adminAccounts");

  if (!items.length) {
    box.innerHTML =
      '<div class="item">کاربری وجود ندارد.</div>';
    return;
  }

  box.innerHTML = items.map(function(a) {

    return `
      <div class="item">
        👤 ${escapeHtml(a.name || "-")}
        <br>
        📧 ${escapeHtml(a.email || "-")}
        <br>
        💰 موجودی: $${Number(a.balance || 0).toFixed(2)}
        <br>
        ⭐ پلن: ${escapeHtml(a.plan || "free")}
      </div>
    `;

  }).join("");
}


function renderDeposits(items) {

  const box =
    document.getElementById("adminDeposits");

  if (!items.length) {
    box.innerHTML =
      '<div class="item">واریزی وجود ندارد.</div>';
    return;
  }

  box.innerHTML = items.map(function(d) {

    let buttons = "";

    if (d.status === "pending") {
      buttons = `
        <button class="success"
          onclick="approveDeposit(${Number(d.id)})">
          ✅ تأیید
        </button>

        <button class="danger"
          onclick="rejectDeposit(${Number(d.id)})">
          ❌ رد
        </button>
      `;
    }

    return `
      <div class="item">
        💵 مبلغ: ${Number(d.amount).toLocaleString()}
        <br>
        👤 ${escapeHtml(d.name || "-")}
        <br>
        📌 وضعیت: ${statusText(d.status)}
        <br>
        📝 ${escapeHtml(d.description || "-")}
        <br>
        ${buttons}
      </div>
    `;

  }).join("");
}


function renderWithdrawals(items) {

  const box =
    document.getElementById("adminWithdrawals");

  if (!items.length) {
    box.innerHTML =
      '<div class="item">درخواستی وجود ندارد.</div>';
    return;
  }

  box.innerHTML = items.map(function(w) {

    let buttons = "";

    if (w.status === "pending") {
      buttons = `
        <button class="success"
          onclick="approveWithdraw(${Number(w.id)})">
          ✅ تأیید
        </button>

        <button class="danger"
          onclick="rejectWithdraw(${Number(w.id)})">
          ❌ رد و برگشت موجودی
        </button>
      `;
    }

    return `
      <div class="item">
        💸 مبلغ: $${Number(w.amount).toFixed(2)}
        <br>
        👤 ${escapeHtml(w.name || "-")}
        <br>
        💳 روش: ${escapeHtml(w.method || "-")}
        <br>
        📌 ${statusText(w.status)}
        <br>
        📍 ${escapeHtml(w.payment || "-")}
        <br>
        ${buttons}
      </div>
    `;

  }).join("");
}


function statusText(s) {

  if (s === "pending") return "⏳ در انتظار";
  if (s === "approved") return "✅ تأیید شده";
  if (s === "rejected") return "❌ رد شده";

  return s || "-";
}


async function adminAction(url, id) {

  try {

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": adminToken
      },
      body: JSON.stringify({ id })
    });

    const d = await r.json();

    alert(d.message || d.error || "انجام شد");

    await loadAdminData();
    await loadAccount();

  } catch (e) {

    alert("خطا در انجام عملیات");
  }
}


function approveDeposit(id) {
  adminAction("/api/admin/deposit/approve", id);
}


function rejectDeposit(id) {
  adminAction("/api/admin/deposit/reject", id);
}


function approveWithdraw(id) {
  adminAction("/api/admin/withdraw/approve", id);
}


function rejectWithdraw(id) {
  adminAction("/api/admin/withdraw/reject", id);
}


function calcPercent() {

  const a =
    Number(document.getElementById("percentA").value);

  const b =
    Number(document.getElementById("percentB").value);

  document.getElementById("percentResult").textContent =
    "نتیجه: " + ((a * b) / 100);
}


function calcDollar() {

  const usd =
    Number(document.getElementById("usd").value);

  const rate =
    Number(document.getElementById("rate").value);

  document.getElementById("dollarResult").textContent =
    "نتیجه: " + (usd * rate).toLocaleString();
}


function calcDiscount() {

  const price =
    Number(document.getElementById("price").value);

  const discount =
    Number(document.getElementById("discount").value);

  const result =
    price - (price * discount / 100);

  document.getElementById("discountResult").textContent =
    "قیمت نهایی: " + result.toLocaleString();
}


function calcProfit() {

  const buy =
    Number(document.getElementById("buy").value);

  const sell =
    Number(document.getElementById("sell").value);

  document.getElementById("profitResult").textContent =
    "سود: " + (sell - buy).toLocaleString();
}


function calcKm() {

  const km =
    Number(document.getElementById("km").value);

  document.getElementById("kmResult").textContent =
    "نتیجه: " + (km * 1000) + " متر";
}


function calcLoan() {

  const loan =
    Number(document.getElementById("loan").value);

  const months =
    Number(document.getElementById("months").value);

  if (months <= 0) return;

  document.getElementById("loanResult").textContent =
    "قسط ماهانه: " +
    (loan / months).toLocaleString();
}


function calcAge() {

  const birth =
    Number(document.getElementById("birth").value);

  const year =
    new Date().getFullYear();

  document.getElementById("ageResult").textContent =
    "سن تقریبی: " + (year - birth);
}


function makeIntro() {

  const name =
    document.getElementById("introName").value.trim();

  document.getElementById("introResult").textContent =
    name
      ? "سلام! من " + name +
        " هستم و آماده ارائه خدمات و کمک به شما هستم."
      : "لطفاً نام یا موضوع را وارد کنید.";
}


function escapeHtml(text) {

  const div =
    document.createElement("div");

  div.textContent = String(text);

  return div.innerHTML;
}


document
  .getElementById("prompt")
  .addEventListener("keydown", function(event) {

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }

  });


loadAccount();

</script>

</body>
</html>
`;
