export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    function json(data, status = 200) {
      return new Response(JSON.stringify(data), {
        status,
        headers: {
          "content-type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    try {
      if (!env.DB) {
        return json({
          success: false,
          error: "Binding دیتابیس DB پیدا نشد."
        }, 500);
      }

      // =========================
      // ساخت جدول‌ها
      // =========================

      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          balance REAL DEFAULT 0,
          plan TEXT DEFAULT 'free',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `).run();

      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS deposits (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          amount REAL NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `).run();

      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS withdrawals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          amount REAL NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `).run();

      async function getUser(username) {
        username = String(username || "guest").trim() || "guest";

        let user = await env.DB
          .prepare("SELECT * FROM users WHERE username = ?")
          .bind(username)
          .first();

        if (!user) {
          await env.DB
            .prepare(`
              INSERT INTO users
              (username, balance, plan)
              VALUES (?, 0, 'free')
            `)
            .bind(username)
            .run();

          user = await env.DB
            .prepare("SELECT * FROM users WHERE username = ?")
            .bind(username)
            .first();
        }

        return user;
      }

      // =========================
      // صفحه اصلی
      // =========================

      if (request.method === "GET" && url.pathname === "/") {
        return new Response(HTML, {
          headers: {
            "content-type": "text/html; charset=UTF-8"
          }
        });
      }

      // =========================
      // حساب کاربری
      // =========================

      if (url.pathname === "/api/account" && request.method === "POST") {
        const body = await request.json();
        const user = await getUser(body.username || "guest");

        return json({
          success: true,
          user: {
            id: user.id,
            username: user.username,
            balance: Number(user.balance || 0),
            plan: user.plan
          }
        });
      }

      // =========================
      // هوش مصنوعی
      // =========================

      if (url.pathname === "/api/ai" && request.method === "POST") {
        const body = await request.json();

        const prompt = String(body.prompt || "").trim();

        if (!prompt) {
          return json({
            success: false,
            error: "لطفاً متن خود را وارد کنید."
          }, 400);
        }

        if (!env.AI) {
          return json({
            success: false,
            error: "Binding هوش مصنوعی AI پیدا نشد."
          }, 500);
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct-fast",
          {
            messages: [
              {
                role: "system",
                content:
                  "تو یک دستیار هوش مصنوعی فارسی‌زبان، دقیق، مفید و محترمانه هستی."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 1024,
            temperature: 0.6
          }
        );

        return json({
          success: true,
          response: result?.response || "پاسخی دریافت نشد."
        });
      }

      // =========================
      // ثبت واریز
      // =========================

      if (url.pathname === "/api/deposit" && request.method === "POST") {
        const body = await request.json();

        const username = String(body.username || "guest").trim();
        const amount = Number(body.amount);

        if (!amount || amount <= 0) {
          return json({
            success: false,
            error: "مبلغ واریز معتبر نیست."
          }, 400);
        }

        await getUser(username);

        await env.DB.prepare(`
          INSERT INTO deposits
          (username, amount, status)
          VALUES (?, ?, 'pending')
        `)
        .bind(username, amount)
        .run();

        return json({
          success: true,
          message: "درخواست واریز ثبت شد و منتظر تأیید مدیر است."
        });
      }

      // =========================
      // درخواست برداشت
      // =========================

      if (url.pathname === "/api/withdraw" && request.method === "POST") {
        const body = await request.json();

        const username = String(body.username || "guest").trim();
        const amount = Number(body.amount);

        if (!amount || amount <= 0) {
          return json({
            success: false,
            error: "مبلغ برداشت معتبر نیست."
          }, 400);
        }

        const user = await getUser(username);

        if (Number(user.balance || 0) < amount) {
          return json({
            success: false,
            error: "موجودی کافی نیست."
          }, 400);
        }

        await env.DB.prepare(`
          INSERT INTO withdrawals
          (username, amount, status)
          VALUES (?, ?, 'pending')
        `)
        .bind(username, amount)
        .run();

        return json({
          success: true,
          message: "درخواست برداشت ثبت شد و منتظر تأیید مدیر است."
        });
      }

      // =========================
      // ورود مدیر
      // =========================

      if (
        url.pathname === "/api/admin/login" &&
        request.method === "POST"
      ) {
        const body = await request.json();

        if (!env.ADMIN_PASSWORD) {
          return json({
            success: false,
            error: "ADMIN_PASSWORD تنظیم نشده است."
          }, 500);
        }

        if (String(body.password || "") !== env.ADMIN_PASSWORD) {
          return json({
            success: false,
            error: "رمز مدیریت اشتباه است."
          }, 401);
        }

        return json({
          success: true,
          message: "ورود مدیر موفق بود."
        });
      }

      // =========================
      // آمار مدیریت
      // =========================

      if (
        url.pathname === "/api/admin/stats" &&
        request.method === "GET"
      ) {
        const users = await env.DB
          .prepare("SELECT COUNT(*) AS count FROM users")
          .first();

        const deposits = await env.DB
          .prepare("SELECT COUNT(*) AS count FROM deposits")
          .first();

        const withdrawals = await env.DB
          .prepare("SELECT COUNT(*) AS count FROM withdrawals")
          .first();

        const balance = await env.DB
          .prepare("SELECT COALESCE(SUM(balance),0) AS total FROM users")
          .first();

        return json({
          success: true,
          users: Number(users?.count || 0),
          deposits: Number(deposits?.count || 0),
          withdrawals: Number(withdrawals?.count || 0),
          totalBalance: Number(balance?.total || 0)
        });
      }

      // =========================
      // کاربران
      // =========================

      if (
        url.pathname === "/api/admin/users" &&
        request.method === "GET"
      ) {
        const result = await env.DB
          .prepare(`
            SELECT id, username, balance, plan, created_at
            FROM users
            ORDER BY id DESC
          `)
          .all();

        return json({
          success: true,
          users: result.results || []
        });
      }

      // =========================
      // واریزها
      // =========================

      if (
        url.pathname === "/api/admin/deposits" &&
        request.method === "GET"
      ) {
        const result = await env.DB
          .prepare(`
            SELECT *
            FROM deposits
            ORDER BY id DESC
          `)
          .all();

        return json({
          success: true,
          deposits: result.results || []
        });
      }

      // =========================
      // برداشت‌ها
      // =========================

      if (
        url.pathname === "/api/admin/withdrawals" &&
        request.method === "GET"
      ) {
        const result = await env.DB
          .prepare(`
            SELECT *
            FROM withdrawals
            ORDER BY id DESC
          `)
          .all();

        return json({
          success: true,
          withdrawals: result.results || []
        });
      }

      // =========================
      // تأیید واریز
      // =========================

      if (
        url.pathname === "/api/admin/deposit/approve" &&
        request.method === "POST"
      ) {
        const body = await request.json();
        const id = Number(body.id);

        const deposit = await env.DB
          .prepare("SELECT * FROM deposits WHERE id = ?")
          .bind(id)
          .first();

        if (!deposit || deposit.status !== "pending") {
          return json({
            success: false,
            error: "واریز معتبر یا در انتظار تأیید نیست."
          }, 400);
        }

        await env.DB.prepare(`
          UPDATE users
          SET balance = balance + ?
          WHERE username = ?
        `)
        .bind(Number(deposit.amount), deposit.username)
        .run();

        await env.DB.prepare(`
          UPDATE deposits
          SET status = 'approved'
          WHERE id = ?
        `)
        .bind(id)
        .run();

        return json({
          success: true,
          message: "واریز تأیید شد و موجودی افزایش یافت."
        });
      }

      // =========================
      // رد واریز
      // =========================

      if (
        url.pathname === "/api/admin/deposit/reject" &&
        request.method === "POST"
      ) {
        const body = await request.json();

        await env.DB.prepare(`
          UPDATE deposits
          SET status = 'rejected'
          WHERE id = ? AND status = 'pending'
        `)
        .bind(Number(body.id))
        .run();

        return json({
          success: true,
          message: "واریز رد شد."
        });
      }

      // =========================
      // تأیید برداشت
      // =========================

      if (
        url.pathname === "/api/admin/withdraw/approve" &&
        request.method === "POST"
      ) {
        const body = await request.json();
        const id = Number(body.id);

        const withdrawal = await env.DB
          .prepare("SELECT * FROM withdrawals WHERE id = ?")
          .bind(id)
          .first();

        if (!withdrawal || withdrawal.status !== "pending") {
          return json({
            success: false,
            error: "برداشت معتبر یا در انتظار تأیید نیست."
          }, 400);
        }

        const user = await env.DB
          .prepare("SELECT * FROM users WHERE username = ?")
          .bind(withdrawal.username)
          .first();

        if (!user || Number(user.balance) < Number(withdrawal.amount)) {
          return json({
            success: false,
            error: "موجودی کاربر کافی نیست."
          }, 400);
        }

        await env.DB.prepare(`
          UPDATE users
          SET balance = balance - ?
          WHERE username = ?
        `)
        .bind(
          Number(withdrawal.amount),
          withdrawal.username
        )
        .run();

        await env.DB.prepare(`
          UPDATE withdrawals
          SET status = 'approved'
          WHERE id = ?
        `)
        .bind(id)
        .run();

        return json({
          success: true,
          message: "برداشت تأیید شد."
        });
      }

      // =========================
      // رد برداشت
      // =========================

      if (
        url.pathname === "/api/admin/withdraw/reject" &&
        request.method === "POST"
      ) {
        const body = await request.json();

        await env.DB.prepare(`
          UPDATE withdrawals
          SET status = 'rejected'
          WHERE id = ? AND status = 'pending'
        `)
        .bind(Number(body.id))
        .run();

        return json({
          success: true,
          message: "برداشت رد شد."
        });
      }

      return json({
        success: false,
        error: "مسیر موردنظر پیدا نشد."
      }, 404);

    } catch (error) {
      return json({
        success: false,
        error: error?.message || "خطای داخلی Worker"
      }, 500);
    }
  }
};


// ======================================================
// صفحه سایت
// ======================================================

const HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>ابزارک AI</title>

<style>

*{
box-sizing:border-box;
}

body{
margin:0;
font-family:Tahoma,Arial,sans-serif;
background:#f4f7fb;
color:#172033;
}

.container{
width:min(1100px,94%);
margin:20px auto;
}

.header{
background:linear-gradient(135deg,#172554,#2563eb);
color:white;
padding:25px;
border-radius:20px;
margin-bottom:20px;
}

.card{
background:white;
padding:20px;
border-radius:18px;
margin-bottom:18px;
box-shadow:0 5px 20px #0000000d;
}

.chat{
min-height:250px;
max-height:450px;
overflow:auto;
}

.msg{
padding:12px;
border-radius:14px;
margin:8px 0;
line-height:1.9;
}

.user{
background:#dbeafe;
}

.ai{
background:#f1f5f9;
}

textarea,
input{
width:100%;
padding:13px;
border:1px solid #d5dbe5;
border-radius:12px;
font-family:inherit;
margin:6px 0;
}

button{
border:0;
border-radius:12px;
padding:12px 18px;
cursor:pointer;
background:#2563eb;
color:white;
font-family:inherit;
margin:4px;
}

.success{
background:#16a34a;
}

.danger{
background:#dc2626;
}

.gray{
background:#64748b;
}

.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
gap:15px;
}

.stat{
padding:18px;
background:#f8fafc;
border-radius:15px;
}

.stat strong{
display:block;
font-size:25px;
margin-top:8px;
}

.plan{
border:1px solid #e5e7eb;
border-radius:16px;
padding:18px;
}

.price{
font-size:25px;
font-weight:bold;
margin:10px 0;
}

.hidden{
display:none;
}

table{
width:100%;
border-collapse:collapse;
margin-top:10px;
}

th,td{
border-bottom:1px solid #eee;
padding:10px;
text-align:right;
}

</style>

</head>

<body>

<div class="container">

<div class="header">

<h1>🤖 ابزارک AI</h1>

<p>
ابزارهای سریع و کاربردی برای کارهای روزمره و تولید محتوا
</p>

</div>


<!-- ================= CHAT ================= -->

<div class="card">

<h2>💬 دستیار هوش مصنوعی</h2>

<div id="chat" class="chat">

<div class="msg ai">
سلام! 👋 سوالت را بنویس.
</div>

</div>

<textarea
id="prompt"
rows="3"
placeholder="پیامت را بنویس..."
></textarea>

<button onclick="sendAI()">
ارسال
</button>

<button class="gray" onclick="clearChat()">
🗑️ پاک کردن گفتگو
</button>

</div>


<!-- ================= PLANS ================= -->

<div class="card">

<h2>💳 وضعیت اشتراک</h2>

<div class="grid">

<div class="plan">

<h3>🆓 رایگان</h3>

<div class="price">
۰ تومان
</div>

<p>
استفاده محدود از ابزارهای پایه
</p>

<button class="gray">
پلن فعلی
</button>

</div>


<div class="plan">

<h3>⭐ حرفه‌ای</h3>

<div class="price">
۳۹۹٬۰۰۰ تومان
</div>

<p>
اشتراک یک‌ماهه
</p>

<p>
استفاده بیشتر از ابزارها
</p>

<button onclick="alert('درگاه پرداخت هنوز متصل نشده است.')">
خرید اشتراک حرفه‌ای
</button>

</div>


<div class="plan">

<h3>👑 ویژه</h3>

<div class="price">
۷۹۹٬۰۰۰ تومان
</div>

<p>
اشتراک یک‌ماهه
</p>

<p>
سقف استفاده بسیار بالا
</p>

<button onclick="alert('درگاه پرداخت هنوز متصل نشده است.')">
خرید اشتراک ویژه
</button>

</div>

</div>

</div>


<!-- ================= ACCOUNT ================= -->

<div class="card">

<h2>💰 حساب من</h2>

<input
id="username"
value="guest"
placeholder="نام کاربری"
/>

<button onclick="loadAccount()">
دریافت موجودی
</button>

<div class="grid">

<div class="stat">

موجودی قابل برداشت

<strong id="balance">
$0.00
</strong>

</div>


<div class="stat">

پلن

<strong id="plan">
رایگان
</strong>

</div>

</div>


<h3>💵 واریز</h3>

<input
id="depositAmount"
type="number"
step="0.01"
placeholder="مبلغ دلار"
/>

<button class="success"
onclick="deposit()">

ثبت واریز

</button>


<h3>💸 درخواست برداشت</h3>

<input
id="withdrawAmount"
type="number"
step="0.01"
placeholder="مبلغ دلار"
/>

<button class="danger"
onclick="withdraw()">

درخواست برداشت

</button>

</div>


<!-- ================= TOOLS ================= -->

<div class="card">

<h2>🧰 ابزارهای کاربردی</h2>

<div class="grid">

<div>

<h3>🧮 محاسبه درصد</h3>

<input id="pnum" type="number" placeholder="عدد">

<input id="pper" type="number" placeholder="درصد">

<button onclick="percent()">
محاسبه
</button>

<p id="presult"></p>

</div>


<div>

<h3>💵 دلار به تومان</h3>

<input id="usd" type="number" placeholder="مبلغ دلار">

<input id="rate" type="number" placeholder="نرخ دلار">

<button onclick="dollar()">
محاسبه
</button>

<p id="dresult"></p>

</div>


<div>

<h3>🏷️ محاسبه تخفیف</h3>

<input id="price" type="number" placeholder="قیمت">

<input id="discount" type="number" placeholder="درصد تخفیف">

<button onclick="discountCalc()">
محاسبه
</button>

<p id="discountResult"></p>

</div>


<div>

<h3>📈 محاسبه سود</h3>

<input id="buy" type="number" placeholder="قیمت خرید">

<input id="sell" type="number" placeholder="قیمت فروش">

<button onclick="profit()">
محاسبه
</button>

<p id="profitResult"></p>

</div>


<div>

<h3>📏 کیلومتر به متر</h3>

<input id="km" type="number" placeholder="کیلومتر">

<button onclick="kmToM()">
تبدیل
</button>

<p id="mResult"></p>

</div>


<div>

<h3>💳 محاسبه اقساط</h3>

<input id="loan" type="number" placeholder="مبلغ">

<input id="months" type="number" placeholder="تعداد ماه">

<button onclick="installment()">
محاسبه
</button>

<p id="installResult"></p>

</div>


<div>

<h3>🎂 محاسبه سن</h3>

<input id="birth" type="number" placeholder="سال تولد">

<button onclick="age()">
محاسبه
</button>

<p id="ageResult"></p>

</div>


<div>

<h3>📝 تولید متن معرفی</h3>

<input id="topic" placeholder="نام / موضوع">

<button onclick="generateText()">
تولید متن
</button>

<p id="textResult"></p>

</div>

</div>

</div>


<!-- ================= ADMIN ================= -->

<div class="card">

<h2>🔐 پنل مدیریت</h2>

<input
id="adminPassword"
type="password"
placeholder="رمز مدیریت"
/>

<button onclick="adminLogin()">
ورود مدیر
</button>

<p id="adminMessage"></p>


<div id="adminPanel" class="hidden">

<h2>📊 مدیریت</h2>

<button onclick="adminStats()">
🔄 بروزرسانی
</button>

<button onclick="loadUsers()">
👥 کاربران
</button>

<button onclick="loadDeposits()">
💵 واریزها
</button>

<button onclick="loadWithdrawals()">
💸 برداشت‌ها
</button>


<div class="grid">

<div class="stat">

کاربران

<strong id="usersCount">
0
</strong>

</div>


<div class="stat">

واریزها

<strong id="depositsCount">
0
</strong>

</div>


<div class="stat">

برداشت‌ها

<strong id="withdrawalsCount">
0
</strong>

</div>


<div class="stat">

کل موجودی

<strong id="totalBalance">
$0.00
</strong>

</div>

</div>


<div id="adminData"></div>

</div>

</div>

</div>


<script>

async function api(url,options={}){

const response=await fetch(url,options);

return await response.json();

}


function money(value){

return "$"+Number(value||0).toFixed(2);

}


function username(){

return document.getElementById("username")
.value.trim() || "guest";

}


async function loadAccount(){

const data=await api("/api/account",{

method:"POST",

headers:{
"content-type":"application/json"
},

body:JSON.stringify({
username:username()
})

});


if(!data.success){

alert(data.error||"خطا");

return;

}


document.getElementById("balance")
.textContent=money(data.user.balance);

document.getElementById("plan")
.textContent=
data.user.plan==="free"
?"رایگان"
:data.user.plan;

}


function addMessage(text,type){

const div=document.createElement("div");

div.className="msg "+type;

div.textContent=text;

document.getElementById("chat")
.appendChild(div);

const chat=document.getElementById("chat");

chat.scrollTop=chat.scrollHeight;

}


async function sendAI(){

const input=document.getElementById("prompt");

const text=input.value.trim();

if(!text){

alert("لطفاً پیام خود را بنویس.");

return;

}

addMessage(text,"user");

input.value="";

addMessage("در حال دریافت پاسخ...","ai");

try{

const data=await api("/api/ai",{

method:"POST",

headers:{
"content-type":"application/json"
},

body:JSON.stringify({
prompt:text,
username:username()
})

});

const chat=document.getElementById("chat");

chat.lastElementChild.textContent=
data.success
?data.response
:"خطا: "+(data.error||"خطای نامشخص");

}catch(e){

document
.getElementById("chat")
.lastElementChild
.textContent=
"خطا در ارتباط با هوش مصنوعی.";

}

}


function clearChat(){

document.getElementById("chat").innerHTML=
'<div class="msg ai">گفتگو پاک شد. 👋</div>';

}


async function deposit(){

const amount=Number(
document.getElementById("depositAmount").value
);

if(amount<=0){

alert("مبلغ را وارد کن.");

return;

}

const data=await api("/api/deposit",{

method:"POST",

headers:{
"content-type":"application/json"
},

body:JSON.stringify({
username:username(),
amount
})

});

alert(data.message||data.error);

}


async function withdraw(){

const amount=Number(
document.getElementById("withdrawAmount").value
);

if(amount<=0){

alert("مبلغ را وارد کن.");

return;

}

const data=await api("/api/withdraw",{

method:"POST",

headers:{
"content-type":"application/json"
},

body:JSON.stringify({
username:username(),
amount
})

});

alert(data.message||data.error);

}


function percent(){

const n=Number(
document.getElementById("pnum").value
);

const p=Number(
document.getElementById("pper").value
);

document.getElementById("presult")
.textContent=n*p/100;

}


function dollar(){

const usd=Number(
document.getElementById("usd").value
);

const rate=Number(
document.getElementById("rate").value
);

document.getElementById("dresult")
.textContent=
(usd*rate).toLocaleString("fa-IR")
+" تومان";

}


function discountCalc(){

const price=Number(
document.getElementById("price").value
);

const d=Number(
document.getElementById("discount").value
);

const result=price-(price*d/100);

document.getElementById("discountResult")
.textContent=
result.toLocaleString("fa-IR");

}


function profit(){

const buy=Number(
document.getElementById("buy").value
);

const sell=Number(
document.getElementById("sell").value
);

document.getElementById("profitResult")
.textContent=
(sell-buy).toLocaleString("fa-IR");

}


function kmToM(){

const km=Number(
document.getElementById("km").value
);

document.getElementById("mResult")
.textContent=
(km*1000).toLocaleString("fa-IR")
+" متر";

}


function installment(){

const loan=Number(
document.getElementById("loan").value
);

const months=Number(
document.getElementById("months").value
);

if(months<=0)return;

document.getElementById("installResult")
.textContent=
(loan/months).toLocaleString("fa-IR");

}


function age(){

const birth=Number(
document.getElementById("birth").value
);

const year=new Date().getFullYear();

document.getElementById("ageResult")
.textContent=
(year-birth)+" سال";

}


function generateText(){

const topic=document
.getElementById("topic")
.value.trim();

document.getElementById("textResult")
.textContent=topic
?"این متن معرفی درباره «"+topic+
"» برای معرفی حرفه‌ای و جذاب آماده شده است."
:"موضوع را وارد کن.";

}


async function adminLogin(){

const password=
document.getElementById("adminPassword").value;

const data=await api("/api/admin/login",{

method:"POST",

headers:{
"content-type":"application/json"
},

body:JSON.stringify({
password
})

});

document.getElementById("adminMessage")
.textContent=data.message||data.error;

if(data.success){

document
.getElementById("adminPanel")
.classList.remove("hidden");

adminStats();

}

}


async function adminStats(){

const data=await api("/api/admin/stats");

if(!data.success){

alert(data.error);

return;

}

document.getElementById("usersCount")
.textContent=data.users;

document.getElementById("depositsCount")
.textContent=data.deposits;

document.getElementById("withdrawalsCount")
.textContent=data.withdrawals;

document.getElementById("totalBalance")
.textContent=money(data.totalBalance);

}


async function loadUsers(){

const data=await api("/api/admin/users");

if(!data.success)return;

let html="<h3>👥 کاربران</h3>";

html+=
"<table><tr>"+
"<th>شناسه</th>"+
"<th>کاربر</th>"+
"<th>موجودی</th>"+
"<th>پلن</th>"+
"</tr>";

for(const u of data.users){

html+=
"<tr>"+
"<td>"+u.id+"</td>"+
"<td>"+u.username+"</td>"+
"<td>"+money(u.balance)+"</td>"+
"<td>"+u.plan+"</td>"+
"</tr>";

}

html+="</table>";

document.getElementById("adminData")
.innerHTML=html;

}


async function loadDeposits(){

const data=await api("/api/admin/deposits");

if(!data.success)return;

let html="<h3>💵 واریزها</h3>";

html+=
"<table><tr>"+
"<th>کاربر</th>"+
"<th>مبلغ</th>"+
"<th>وضعیت</th>"+
"<th>عملیات</th>"+
"</tr>";

for(const d of data.deposits){

let action="";

if(d.status==="pending"){

action=
'<button class="success" onclick="approveDeposit('+
d.id+')">تأیید</button>'+
'<button class="danger" onclick="rejectDeposit('+
d.id+')">رد</button>';

}

html+=
"<tr>"+
"<td>"+d.username+"</td>"+
"<td>"+money(d.amount)+"</td>"+
"<td>"+d.status+"</td>"+
"<td>"+action+"</td>"+
"</tr>";

}

html+="</table>";

document.getElementById("adminData")
.innerHTML=html;

}


async function loadWithdrawals(){

const data=await api("/api/admin/withdrawals");

if(!data.success)return;

let html="<h3>💸 برداشت‌ها</h3>";

html+=
"<table><tr>"+
"<th>کاربر</th>"+
"<th>مبلغ</th>"+
"<th>وضعیت</th>"+
"<th>عملیات</th>"+
"</tr>";

for(const d of data.withdrawals){

let action="";

if(d.status==="pending"){

action=
'<button class="success" onclick="approveWithdraw('+
d.id+')">تأیید</button>'+
'<button class="danger" onclick="rejectWithdraw('+
d.id+')">رد</button>';

}

html+=
"<tr>"+
"<td>"+d.username+"</td>"+
"<td>"+money(d.amount)+"</td>"+
"<td>"+d.status+"</td>"+
"<td>"+action+"</td>"+
"</tr>";

}

html+="</table>";

document.getElementById("adminData")
.innerHTML=html;

}


async function approveDeposit(id){

const data=await api(
"/api/admin/deposit/approve",
{

method:"POST",

headers:{
"content-type":"application/json"
},

body:JSON.stringify({id})

});

alert(data.message||data.error);

loadDeposits();
adminStats();
loadAccount();

}


async function rejectDeposit(id){

const data=await api(
"/api/admin/deposit/reject",
{

method:"POST",

headers:{
"content-type":"application/json"
},

body:JSON.stringify({id})

});

alert(data.message||data.error);

loadDeposits();

}


async function approveWithdraw(id){

const data=await api(
"/api/admin/withdraw/approve",
{

method:"POST",

headers:{
"content-type":"application/json"
},

body:JSON.stringify({id})

});

alert(data.message||data.error);

loadWithdrawals();
adminStats();
loadAccount();

}


async function rejectWithdraw(id){

const data=await api(
"/api/admin/withdraw/reject",
{

method:"POST",

headers:{
"content-type":"application/json"
},

body:JSON.stringify({id})

});

alert(data.message||data.error);

loadWithdrawals();

}


loadAccount();

</script>

</body>
</html>`;
