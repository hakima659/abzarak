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
    // پاسخ JSON
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
    // ایجاد جداول D1
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
    }

    // =========================================================
    // کاربر
    // =========================================================
    async function getUser(username) {
      let user = await env.DB
        .prepare("SELECT * FROM users WHERE username = ?")
        .bind(username)
        .first();

      if (!user) {
        await env.DB
          .prepare("INSERT INTO users (username, balance) VALUES (?, 0)")
          .bind(username)
          .run();

        user = await env.DB
          .prepare("SELECT * FROM users WHERE username = ?")
          .bind(username)
          .first();
      }

      return user;
    }

    // =========================================================
    // صفحه اصلی
    // =========================================================
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(HTML, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/html; charset=UTF-8"
        }
      });
    }

    // =========================================================
    // ایجاد جداول
    // =========================================================
    if (url.pathname === "/api/init" && request.method === "POST") {
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
    // دریافت حساب
    // =========================================================
    if (url.pathname === "/api/account" && request.method === "POST") {
      try {
        await initDB();

        const body = await request.json();
        const username = String(body.username || "").trim();

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
    if (url.pathname === "/api/ai" && request.method === "POST") {
      try {
        await initDB();

        const body = await request.json();

        const username = String(body.username || "guest").trim();
        const prompt = String(body.prompt || "").trim();

        if (!prompt) {
          return json({
            success: false,
            error: "لطفاً پیام خود را وارد کنید."
          }, 400);
        }

        // اگر Workers AI متصل نشده باشد
        if (!env.AI) {
          return json({
            success: false,
            error: "اتصال Workers AI انجام نشده است. Binding با نام AI اضافه کنید."
          }, 500);
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",
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
            INSERT INTO messages (username, prompt, answer)
            VALUES (?, ?, ?)
          `)
          .bind(username, prompt, answer)
          .run();

        return json({
          success: true,
          answer
        });

      } catch (error) {
        return json({
          success: false,
          error: "خطا در دریافت پاسخ هوش مصنوعی: " + error.message
        }, 500);
      }
    }

    // =========================================================
    // درخواست برداشت
    // =========================================================
    if (url.pathname === "/api/withdraw" && request.method === "POST") {
      try {
        await initDB();

        const body = await request.json();

        const username = String(body.username || "").trim();
        const amount = Number(body.amount);
        const method = String(body.method || "").trim();
        const account = String(body.account || "").trim();

        if (!username || !amount || !method || !account) {
          return json({
            success: false,
            error: "همه اطلاعات برداشت را کامل کنید."
          }, 400);
        }

        if (amount < 10000) {
          return json({
            success: false,
            error: "حداقل مبلغ برداشت ۱۰٬۰۰۰ تومان است."
          }, 400);
        }

        const user = await getUser(username);

        const balance = Number(user.balance || 0);

        if (amount > balance) {
          return json({
            success: false,
            error: "موجودی شما کافی نیست."
          }, 400);
        }

        await env.DB
          .prepare(`
            INSERT INTO withdrawals
            (username, amount, method, account, status)
            VALUES (?, ?, ?, ?, 'pending')
          `)
          .bind(username, amount, method, account)
          .run();

        await env.DB
          .prepare(`
            UPDATE users
            SET balance = balance - ?
            WHERE username = ?
          `)
          .bind(amount, username)
          .run();

        return json({
          success: true,
          message: "درخواست برداشت ثبت شد."
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
    if (url.pathname === "/api/admin/login" && request.method === "POST") {
      try {
        const body = await request.json();
        const password = String(body.password || "");

        if (password !== ADMIN_PASSWORD) {
          return json({
            success: false,
            error: "رمز مدیریت اشتباه است."
          }, 401);
        }

        return json({
          success: true,
          message: "ورود مدیریت موفق بود."
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
    if (url.pathname === "/api/admin/data" && request.method === "POST") {
      try {
        const body = await request.json();
        const password = String(body.password || "");

        if (password !== ADMIN_PASSWORD) {
          return json({
            success: false,
            error: "رمز مدیریت اشتباه است."
          }, 401);
        }

        await initDB();

        const users = await env.DB
          .prepare(`
            SELECT id, username, balance, created_at
            FROM users
            ORDER BY id DESC
          `)
          .all();

        const withdrawals = await env.DB
          .prepare(`
            SELECT *
            FROM withdrawals
            ORDER BY id DESC
          `)
          .all();

        return json({
          success: true,
          users: users.results || [],
          withdrawals: withdrawals.results || []
        });

      } catch (error) {
        return json({
          success: false,
          error: error.message
        }, 500);
      }
    }

    // =========================================================
    // افزایش موجودی توسط مدیریت
    // =========================================================
    if (url.pathname === "/api/admin/add-balance" && request.method === "POST") {
      try {
        const body = await request.json();

        const password = String(body.password || "");
        const username = String(body.username || "").trim();
        const amount = Number(body.amount);

        if (password !== ADMIN_PASSWORD) {
          return json({
            success: false,
            error: "رمز مدیریت اشتباه است."
          }, 401);
        }

        if (!username || !amount || amount <= 0) {
          return json({
            success: false,
            error: "نام کاربری و مبلغ معتبر وارد کنید."
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
          .bind(amount, username)
          .run();

        return json({
          success: true,
          message: "موجودی افزایش یافت."
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
    if (url.pathname === "/api/admin/withdraw-status" && request.method === "POST") {
      try {
        const body = await request.json();

        const password = String(body.password || "");
        const id = Number(body.id);
        const status = String(body.status || "");

        if (password !== ADMIN_PASSWORD) {
          return json({
            success: false,
            error: "رمز مدیریت اشتباه است."
          }, 401);
        }

        if (!id || !["pending", "paid", "rejected"].includes(status)) {
          return json({
            success: false,
            error: "اطلاعات نامعتبر است."
          }, 400);
        }

        await initDB();

        const withdrawal = await env.DB
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
            error: "درخواست پیدا نشد."
          }, 404);
        }

        // اگر قبلاً pending بوده و رد شود،
        // پول به حساب کاربر برمی‌گردد.
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
          .bind(status, id)
          .run();

        return json({
          success: true,
          message: "وضعیت برداشت تغییر کرد."
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
      error: "صفحه یا API مورد نظر پیدا نشد."
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
<meta name="viewport" content="width=device-width,initial-scale=1.0">

<title>ابزارک هوش مصنوعی</title>

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
    linear-gradient(135deg,#f5f7fb,#e8eef8);
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
    0 8px 30px rgba(0,0,0,.08);
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

.row{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px;
}

.message{
  padding:12px;
  border-radius:12px;
  margin-top:8px;
  background:#f3f4f6;
}

.small{
  font-size:13px;
  color:#777;
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

@media(max-width:600px){

  .row{
    grid-template-columns:1fr;
  }

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

  <div class="card">

    <h1>🤖 دستیار هوش مصنوعی</h1>

    <div class="subtitle">
      سوالت را بنویس و از دستیار هوش مصنوعی کمک بگیر.
    </div>

  </div>


  <!-- حساب -->

  <div class="card">

    <h2>👤 حساب من</h2>

    <input
      id="username"
      placeholder="نام کاربری"
      value="user1"
    >

    <button onclick="loadAccount()">
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

    <h2>🤖 هوش مصنوعی</h2>

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


  <!-- برداشت -->

  <div class="card">

    <h2>💸 درخواست برداشت</h2>

    <div class="small">
      حداقل مبلغ برداشت: ۱۰٬۰۰۰ تومان
    </div>

    <input
      id="withdrawAmount"
      type="number"
      placeholder="مبلغ برداشت"
    >

    <select id="withdrawMethod">

      <option value="">
        روش پرداخت را انتخاب کنید
      </option>

      <option value="bank">
        کارت بانکی
      </option>

      <option value="usdt">
        USDT
      </option>

    </select>

    <input
      id="withdrawAccount"
      placeholder="شماره کارت / آدرس کیف پول"
    >

    <button
      class="green"
      onclick="withdraw()"
    >
      ثبت درخواست برداشت
    </button>

    <div
      id="withdrawMessage"
      class="small"
    ></div>

  </div>


  <!-- مدیریت -->

  <div class="card admin">

    <h2>🔐 مدیریت</h2>

    <input
      id="adminPassword"
      type="password"
      placeholder="رمز مدیریت"
    >

    <button
      onclick="adminLogin()"
    >
      ورود مدیریت
    </button>

    <div id="adminPanel" class="hidden">

      <hr>

      <h3>➕ افزایش موجودی</h3>

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

      <h3>📊 اطلاعات</h3>

      <button
        onclick="loadAdminData()"
      >
        بروزرسانی اطلاعات
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
// پیام
// =========================================================

function show(id,text){

  document.getElementById(id).textContent = text;

}


// =========================================================
// حساب
// =========================================================

async function loadAccount(){

  const username =
    document.getElementById("username").value.trim();

  if(!username){

    show(
      "accountMessage",
      "نام کاربری را وارد کنید."
    );

    return;
  }

  try{

    const response =
      await fetch(API + "/api/account",{

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({
          username
        })

      });

    const data =
      await response.json();

    if(!data.success){

      show(
        "accountMessage",
        data.error || "خطا"
      );

      return;
    }

    document.getElementById("balance")
      .textContent =
      Number(data.user.balance)
        .toLocaleString("fa-IR");

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
    document.getElementById("prompt")
      .value.trim();

  const username =
    document.getElementById("username")
      .value.trim() || "guest";

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

  document.getElementById("answer")
    .textContent =
    "لطفاً صبر کنید...";

  try{

    const response =
      await fetch(API + "/api/ai",{

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({
          username,
          prompt
        })

      });

    const data =
      await response.json();

    if(!data.success){

      document.getElementById("answer")
        .textContent =
        data.error || "خطا";

      show(
        "aiStatus",
        "❌ خطا"
      );

      return;
    }

    document.getElementById("answer")
      .textContent =
      data.answer;

    show(
      "aiStatus",
      "✅ پاسخ دریافت شد."
    );

  }catch(error){

    document.getElementById("answer")
      .textContent =
      "خطا در اتصال به سرور.";

    show(
      "aiStatus",
      "❌ خطا"
    );

  }

}


// =========================================================
// برداشت
// =========================================================

async function withdraw(){

  const username =
    document.getElementById("username")
      .value.trim();

  const amount =
    Number(
      document.getElementById("withdrawAmount")
        .value
    );

  const method =
    document.getElementById("withdrawMethod")
      .value;

  const account =
    document.getElementById("withdrawAccount")
      .value.trim();

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
            "Content-Type":"application/json"
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
            "Content-Type":"application/json"
          },

          body:JSON.stringify({
            password
          })
        }
      );

    const data =
      await response.json();

    if(!data.success){

      alert(
        data.error || "رمز اشتباه است."
      );

      return;
    }

    document.getElementById(
      "adminPanel"
    ).classList.remove("hidden");

    alert(
      "ورود مدیریت موفق بود."
    );

    loadAdminData();

  }catch(error){

    alert(
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
            "Content-Type":"application/json"
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

  const response =
    await fetch(
      API + "/api/admin/data",
      {
        method:"POST",

        headers:{
          "Content-Type":"application/json"
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

  html += "<h4>👥 کاربران</h4>";

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
        <td>${user.id}</td>
        <td>${escapeHtml(user.username)}</td>
        <td>${Number(user.balance).toLocaleString("fa-IR")}</td>
        <td>${escapeHtml(user.created_at)}</td>
      </tr>
    `;

  }

  html += "</table>";

  html += "<h4>💸 برداشت‌ها</h4>";

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

        <td>${w.id}</td>

        <td>
          ${escapeHtml(w.username)}
        </td>

        <td>
          ${Number(w.amount).toLocaleString("fa-IR")}
        </td>

        <td>
          ${escapeHtml(w.method)}
        </td>

        <td>
          ${escapeHtml(w.account)}
        </td>

        <td>
          ${escapeHtml(w.status)}
        </td>

        <td>

          <button
            onclick="changeWithdrawalStatus(${w.id},'paid')"
          >
            پرداخت شد
          </button>

          <button
            class="red"
            onclick="changeWithdrawalStatus(${w.id},'rejected')"
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

  const response =
    await fetch(
      API + "/api/admin/withdraw-status",
      {
        method:"POST",

        headers:{
          "Content-Type":"application/json"
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
      ? "وضعیت تغییر کرد."
      : data.error
  );

  if(data.success){

    loadAdminData();

  }

}


// =========================================================
// جلوگیری از HTML Injection
// =========================================================

function escapeHtml(value){

  return String(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

}

</script>

</body>
</html>
`;
