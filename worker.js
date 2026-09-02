const PLANS = [
  { id: "p400", title: "پلن ۴۰۰ هزار تومان", irr: 400000, usd: 6 },
  { id: "p700", title: "پلن ۷۰۰ هزار تومان", irr: 700000, usd: 10 },
  { id: "p1000", title: "پلن ۱ میلیون تومان", irr: 1000000, usd: 15 },
  { id: "p1500", title: "پلن ۱.۵ میلیون تومان", irr: 1500000, usd: 22 },
  { id: "p2000", title: "پلن ۲ میلیون تومان", irr: 2000000, usd: 30 }
];

const HTML = `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>دستیار هوش مصنوعی</title>

<style>
*{box-sizing:border-box}

body{
 margin:0;
 font-family:Arial,Tahoma,sans-serif;
 background:#f4f7fb;
 color:#172033
}

header{
 background:#111827;
 color:#fff;
 padding:20px;
 text-align:center
}

.container{
 max-width:1050px;
 margin:auto;
 padding:18px
}

.card{
 background:#fff;
 border-radius:18px;
 padding:20px;
 margin:15px 0;
 box-shadow:0 5px 20px #0001
}

.grid{
 display:grid;
 grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
 gap:15px
}

.plan{
 border:2px solid #e5e7eb;
 border-radius:16px;
 padding:18px;
 transition:.2s
}

.plan:hover{
 transform:translateY(-3px);
 box-shadow:0 5px 15px #0001
}

.plan strong{
 font-size:22px;
 display:block;
 margin:8px 0
}

input,select,button{
 width:100%;
 padding:13px;
 margin:7px 0;
 border-radius:10px;
 border:1px solid #d7dce5;
 font-size:15px
}

button{
 background:#2563eb;
 color:#fff;
 border:0;
 cursor:pointer
}

button:hover{
 opacity:.9
}

.danger{
 background:#dc2626
}

.dark{
 background:#111827
}

.success{
 background:#16a34a
}

.hidden{
 display:none
}

.msg{
 padding:12px;
 border-radius:10px;
 margin:8px 0;
 background:#eef2ff
}

.nav{
 display:flex;
 gap:8px;
 flex-wrap:wrap;
 margin-bottom:15px
}

.nav button{
 width:auto
}

.balance{
 font-size:28px;
 font-weight:bold
}

table{
 width:100%;
 border-collapse:collapse
}

th,td{
 padding:10px;
 border-bottom:1px solid #eee;
 text-align:right
}

pre{
 white-space:pre-wrap;
 word-break:break-word
}

.planButton{
 margin-top:10px
}

.badge{
 display:inline-block;
 padding:5px 10px;
 border-radius:20px;
 background:#eef2ff;
 font-size:13px
}
</style>
</head>

<body>

<header>
<h1>🤖 دستیار هوش مصنوعی</h1>
<div>دستیار هوشمند • حساب کاربری • درآمد • پرداخت • برداشت</div>
</header>

<div class="container">

<!-- AUTH -->

<div id="auth">

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

<button onclick="login()">ورود</button>

<button class="dark" onclick="showRegister()">
ثبت‌نام
</button>

<button onclick="showForgot()">
بازیابی رمز
</button>

<div id="loginMsg"></div>
</div>


<div id="registerBox" class="card hidden">

<h2>📝 ثبت‌نام</h2>

<input
 id="regName"
 placeholder="نام">

<input
 id="regEmail"
 type="email"
 placeholder="ایمیل">

<input
 id="regPassword"
 type="password"
 placeholder="رمز عبور">

<button onclick="register()">
ایجاد حساب
</button>

<button class="dark" onclick="hideBoxes()">
بازگشت
</button>

<div id="regMsg"></div>

</div>


<div id="forgotBox" class="card hidden">

<h2>🔑 بازیابی رمز</h2>

<input
 id="forgotEmail"
 type="email"
 placeholder="ایمیل">

<button onclick="forgot()">
بازیابی
</button>

<button class="dark" onclick="hideBoxes()">
بازگشت
</button>

<div id="forgotMsg"></div>

</div>


<div class="card">

<h3>🛠️ پنل مدیریت</h3>

<h4>🔐 ورود مدیر</h4>

<input
 id="adminPassword"
 type="password"
 placeholder="رمز مدیریت">

<button onclick="adminLogin()">
ورود مدیریت
</button>

<div id="adminLoginMsg"></div>

</div>

</div>


<!-- USER APP -->

<div id="app" class="hidden">

<div class="nav">

<button onclick="showPanel('home')">
🏠 حساب
</button>

<button onclick="showPanel('plans')">
💰 پلن‌ها
</button>

<button onclick="showPanel('payments')">
💳 پرداخت
</button>

<button onclick="showPanel('withdraw')">
💸 برداشت
</button>

<button class="danger" onclick="logout()">
خروج
</button>

</div>


<!-- HOME -->

<div id="home" class="panel">

<div class="card">

<h2>👤 حساب کاربری</h2>

<div id="profile">
در حال بارگذاری...
</div>

</div>


<div class="card">

<h2>💰 موجودی</h2>

<div id="balance" class="balance">
در حال بارگذاری...
</div>

</div>


<div class="card">

<h2>📊 تراکنش‌ها</h2>

<div id="transactions">
در حال بارگذاری...
</div>

</div>

</div>


<!-- PLANS -->

<div id="plans" class="panel hidden">

<div class="card">

<h2>💰 پلن‌های اشتراک</h2>

<p>
🇮🇷 ایران: تومان
|
🌎 خارج از ایران: دلار
</p>

<div id="plansBox" class="grid"></div>

</div>

</div>


<!-- PAYMENT -->

<div id="payments" class="panel hidden">

<div class="card">

<h2>💳 پرداخت</h2>

<label>
نوع پرداخت
</label>

<select id="currency">

<option value="IRR">
🇮🇷 تومان - ایران
</option>

<option value="USD">
🌎 دلار - خارج از ایران
</option>

</select>


<label>
انتخاب پلن
</label>

<select id="paymentPlan">
<option value="">
در حال بارگذاری پلن‌ها...
</option>
</select>


<button onclick="createPayment()">
💳 ایجاد سفارش پرداخت
</button>

<div id="paymentMsg"></div>

</div>

</div>


<!-- WITHDRAW -->

<div id="withdraw" class="panel hidden">

<div class="card">

<h2>💸 درخواست برداشت</h2>

<input
 id="withdrawAmount"
 type="number"
 placeholder="مبلغ برداشت">

<select id="withdrawMethod">

<option value="USDT">
USDT
</option>

<option value="BANK">
حساب بانکی
</option>

</select>

<input
 id="withdrawAddress"
 placeholder="آدرس کیف پول یا اطلاعات حساب">

<button onclick="withdraw()">
ثبت درخواست برداشت
</button>

<div id="withdrawMsg"></div>

</div>

</div>

</div>


<!-- ADMIN -->

<div id="admin" class="hidden">

<div class="nav">

<button onclick="adminUsers()">
👥 کاربران
</button>

<button onclick="adminWithdrawals()">
💸 برداشت‌ها
</button>

<button onclick="adminPayments()">
💳 پرداخت‌ها
</button>

<button onclick="adminPlans()">
💰 پلن‌ها
</button>

<button class="danger" onclick="adminLogout()">
خروج مدیریت
</button>

</div>

<div id="adminContent"></div>

</div>

</div>


<script>

let token=localStorage.getItem("user_token")||"";
let adminToken=localStorage.getItem("admin_token")||"";


function $(id){
 return document.getElementById(id);
}


function msg(id,text){

 $(id).innerHTML=
 '<div class="msg">'+text+'</div>';

}


function hideBoxes(){

 $("registerBox").classList.add("hidden");
 $("forgotBox").classList.add("hidden");

}


function showRegister(){

 $("registerBox").classList.remove("hidden");
 $("forgotBox").classList.add("hidden");

}


function showForgot(){

 $("forgotBox").classList.remove("hidden");
 $("registerBox").classList.add("hidden");

}


function showPanel(id){

 document
 .querySelectorAll(".panel")
 .forEach(x=>x.classList.add("hidden"));

 $(id).classList.remove("hidden");

}


/* API */

async function api(url,options={}){

 const headers=options.headers||{};

 headers["Content-Type"]="application/json";

 if(token){
  headers["Authorization"]="Bearer "+token;
 }

 if(adminToken){
  headers["X-Admin-Token"]=adminToken;
 }

 const r=await fetch(
  url,
  {
   ...options,
   headers
  }
 );

 const text=await r.text();

 let data;

 try{
  data=JSON.parse(text);
 }
 catch(e){
  throw new Error("پاسخ نامعتبر از سرور");
 }

 if(!r.ok||data.ok===false){

  throw new Error(
   data.error||"خطای سرور"
  );

 }

 return data;

}


/* REGISTER */

async function register(){

 try{

  await api(
   "/api/register",
   {
    method:"POST",
    body:JSON.stringify({
     name:$("regName").value.trim(),
     email:$("regEmail").value.trim(),
     password:$("regPassword").value
    })
   }
  );

  msg(
   "regMsg",
   "✅ ثبت‌نام با موفقیت انجام شد."
  );

  $("registerBox").classList.add("hidden");

 }catch(e){

  msg(
   "regMsg",
   "❌ "+e.message
  );

 }

}


/* LOGIN */

async function login(){

 try{

  const data=await api(
   "/api/login",
   {
    method:"POST",
    body:JSON.stringify({
     email:$("loginEmail").value.trim(),
     password:$("loginPassword").value
    })
   }
  );

  token=data.token;

  localStorage.setItem(
   "user_token",
   token
  );

  $("auth").classList.add("hidden");

  $("app").classList.remove("hidden");

  loadUser();

  loadPlans();

 }catch(e){

  msg(
   "loginMsg",
   "❌ "+e.message
  );

 }

}


/* FORGOT */

async function forgot(){

 try{

  const data=await api(
   "/api/forgot",
   {
    method:"POST",
    body:JSON.stringify({
     email:$("forgotEmail").value.trim()
    })
   }
  );

  msg(
   "forgotMsg",
   data.message||"درخواست ثبت شد."
  );

 }catch(e){

  msg(
   "forgotMsg",
   "❌ "+e.message
  );

 }

}


/* USER */

async function loadUser(){

 try{

  const data=await api("/api/me");

  const u=data.user;

  $("profile").innerHTML=
   "<b>"+escapeHTML(
    u.name||u.username||"کاربر"
   )+"</b><br>"+
   "📧 "+escapeHTML(
    u.email||"-"
   )+"<br>"+
   "📌 وضعیت: "+escapeHTML(
    u.status||"فعال"
   )+"<br>"+
   "📦 پلن: "+escapeHTML(
    u.plan||"free"
   );

  $("balance").textContent=
   Number(
    u.balance||0
   ).toLocaleString("fa-IR")
   +" تومان";

  loadTransactions();

 }catch(e){

  $("profile").innerHTML=
   "❌ خطا: "+escapeHTML(e.message);

  $("balance").textContent="خطا";

 }

}


/* TRANSACTIONS */

async function loadTransactions(){

 try{

  const data=await api(
   "/api/transactions"
  );

  if(
   !data.transactions||
   !data.transactions.length
  ){

   $("transactions").innerHTML=
    "تراکنشی ثبت نشده است.";

   return;

  }


  $("transactions").innerHTML=

   "<table>"+
   "<tr>"+
   "<th>مبلغ</th>"+
   "<th>نوع</th>"+
   "<th>وضعیت</th>"+
   "<th>تاریخ</th>"+
   "</tr>"+

   data.transactions.map(x=>

    "<tr>"+
    "<td>"+
    Number(
     x.amount||0
    ).toLocaleString("fa-IR")+
    "</td>"+

    "<td>"+
    escapeHTML(x.type||"-")+
    "</td>"+

    "<td>"+
    escapeHTML(x.status||"-")+
    "</td>"+

    "<td>"+
    escapeHTML(x.created_at||"-")+
    "</td>"+

    "</tr>"

   ).join("")+

   "</table>";

 }catch(e){

  $("transactions").innerHTML=
   "❌ خطا: "+escapeHTML(e.message);

 }

}


/* HTML SECURITY */

function escapeHTML(value){

 return String(value??"")
  .replace(/&/g,"&amp;")
  .replace(/</g,"&lt;")
  .replace(/>/g,"&gt;")
  .replace(/"/g,"&quot;")
  .replace(/'/g,"&#039;");

}


/* PLANS */

function loadPlans(){

 const box=$("plansBox");
 const select=$("paymentPlan");

 box.innerHTML="";
 select.innerHTML="";


 /* گزینه اولیه */

 const firstOption=
  document.createElement("option");

 firstOption.value="";
 firstOption.textContent=
  "یک پلن انتخاب کنید";

 select.appendChild(firstOption);


 /* ساخت پلن‌ها */

 PLANS.forEach(p=>{

  const div=
   document.createElement("div");

  div.className="plan";

  div.innerHTML=
   "<h3>"+
   escapeHTML(p.title)+
   "</h3>"+

   "<strong>"+
   Number(p.irr).toLocaleString("fa-IR")+
   " تومان</strong>"+

   "<div>🌎 "+
   Number(p.usd).toLocaleString("en-US")+
   " USD</div>"+

   "<small>"+
   "اشتراک دستیار هوش مصنوعی"+
   "</small>"+

   "<button class='planButton' "+
   "onclick=\"selectPlan('"+
   escapeHTML(p.id)+
   "')\">"+
   "انتخاب این پلن"+
   "</button>";

  box.appendChild(div);


  const option=
   document.createElement("option");

  option.value=p.id;

  option.textContent=
   p.title+
   " | "+
   Number(p.irr).toLocaleString("fa-IR")+
   " تومان / "+
   p.usd+
   " USD";

  select.appendChild(option);

 });

}


/* SELECT PLAN */

function selectPlan(planId){

 const select=$("paymentPlan");

 const exists=
  PLANS.some(
   p=>String(p.id)===String(planId)
  );

 if(!exists){

  msg(
   "paymentMsg",
   "❌ این پلن معتبر نیست."
  );

  return;

 }

 select.value=String(planId);

 showPanel("payments");

 msg(
  "paymentMsg",
  "✅ پلن انتخاب شد. نوع پرداخت را انتخاب کنید."
 );

}


/* CREATE PAYMENT */

async function createPayment(){

 try{

  const planId=
   String(
    $("paymentPlan").value||""
   ).trim();

  if(!planId){

   msg(
    "paymentMsg",
    "❌ ابتدا یک پلن انتخاب کنید."
   );

   return;

  }


  const localPlan=
   PLANS.find(
    p=>String(p.id)===planId
   );

  if(!localPlan){

   msg(
    "paymentMsg",
    "❌ پلن انتخاب‌شده معتبر نیست."
   );

   return;

  }


  const currency=
   $("currency").value==="USD"
   ? "USD"
   : "IRR";


  const data=await api(
   "/api/payment",
   {
    method:"POST",

    body:JSON.stringify({
     plan_id:planId,
     currency:currency
    })
   }
  );


  const displayAmount=
   currency==="USD"
   ? Number(data.amount).toLocaleString("en-US")
   : Number(data.amount).toLocaleString("fa-IR");


  msg(
   "paymentMsg",

   "✅ سفارش با موفقیت ایجاد شد.<br>"+

   "🧾 شماره سفارش: "+
   escapeHTML(data.payment_id)+
   "<br>"+

   "💰 پلن: "+
   escapeHTML(data.plan)+
   "<br>"+

   "💵 مبلغ: "+
   displayAmount+
   " "+
   escapeHTML(data.currency)+
   "<br>"+

   "<span class='badge'>در انتظار پرداخت</span>"+
   "<br><br>"+

   "<small>"+
   "⚠️ درگاه واقعی هنوز متصل نشده است."+
   "</small>"
  );


 }catch(e){

  msg(
   "paymentMsg",
   "❌ "+e.message
  );

 }

}


/* WITHDRAW */

async function withdraw(){

 try{

  const amount=
   Number(
    $("withdrawAmount").value
   );

  const method=
   String(
    $("withdrawMethod").value||"USDT"
   );

  const address=
   $("withdrawAddress").value.trim();


  await api(
   "/api/withdraw",
   {
    method:"POST",

    body:JSON.stringify({
     amount:amount,
     method:method,
     address:address
    })
   }
  );


  msg(
   "withdrawMsg",
   "✅ درخواست برداشت ثبت شد."
  );

  loadUser();


 }catch(e){

  msg(
   "withdrawMsg",
   "❌ "+e.message
  );

 }

}


/* LOGOUT */

function logout(){

 token="";

 localStorage.removeItem(
  "user_token"
 );

 $("app").classList.add("hidden");

 $("auth").classList.remove("hidden");

}


/* ADMIN LOGIN */

async function adminLogin(){

 try{

  const data=await api(
   "/api/admin/login",
   {
    method:"POST",

    body:JSON.stringify({
     password:
      $("adminPassword").value
    })
   }
  );


  adminToken=data.token;

  localStorage.setItem(
   "admin_token",
   adminToken
  );


  $("auth").classList.add("hidden");

  $("admin").classList.remove("hidden");

  adminUsers();


 }catch(e){

  msg(
   "adminLoginMsg",
   "❌ "+e.message
  );

 }

}


/* ADMIN USERS */

async function adminUsers(){

 $("adminContent").innerHTML=
  '<div class="card">در حال بارگذاری کاربران...</div>';


 try{

  const data=await api(
   "/api/admin/users"
  );


  if(
   !data.users||
   !data.users.length
  ){

   $("adminContent").innerHTML=
    '<div class="card">کاربری وجود ندارد.</div>';

   return;

  }


  $("adminContent").innerHTML=

   '<div class="card">'+
   '<h2>👥 کاربران</h2>'+
   '<table>'+
   '<tr>'+
   '<th>ID</th>'+
   '<th>نام</th>'+
   '<th>ایمیل</th>'+
   '<th>موجودی</th>'+
   '<th>پلن</th>'+
   '<th>وضعیت</th>'+
   '</tr>'+

   data.users.map(u=>

    '<tr>'+

    '<td>'+
    escapeHTML(u.id)+
    '</td>'+

    '<td>'+
    escapeHTML(
     u.name||u.username||"-"
    )+
    '</td>'+

    '<td>'+
    escapeHTML(u.email||"-")+
    '</td>'+

    '<td>'+
    Number(
     u.balance||0
    ).toLocaleString("fa-IR")+
    '</td>'+

    '<td>'+
    escapeHTML(u.plan||"free")+
    '</td>'+

    '<td>'+
    escapeHTML(u.status||"-")+
    '</td>'+

    '</tr>'

   ).join("")+

   '</table>'+
   '</div>';


 }catch(e){

  $("adminContent").innerHTML=
   '<div class="card">'+
   '❌ خطا در بارگذاری کاربران:<br>'+
   escapeHTML(e.message)+
   '</div>';

 }

}


/* ADMIN WITHDRAWALS */

async function adminWithdrawals(){

 $("adminContent").innerHTML=
  '<div class="card">در حال بارگذاری برداشت‌ها...</div>';


 try{

  const data=await api(
   "/api/admin/withdrawals"
  );


  if(
   !data.withdrawals||
   !data.withdrawals.length
  ){

   $("adminContent").innerHTML=
    '<div class="card">درخواستی وجود ندارد.</div>';

   return;

  }


  $("adminContent").innerHTML=

   '<div class="card">'+

   '<h2>💸 برداشت‌ها</h2>'+

   '<table>'+

   '<tr>'+
   '<th>ID</th>'+
   '<th>کاربر</th>'+
   '<th>مبلغ</th>'+
   '<th>روش</th>'+
   '<th>آدرس</th>'+
   '<th>وضعیت</th>'+
   '</tr>'+

   data.withdrawals.map(w=>

    '<tr>'+

    '<td>'+
    escapeHTML(w.id)+
    '</td>'+

    '<td>'+
    escapeHTML(w.username)+
    '</td>'+

    '<td>'+
    Number(
     w.amount||0
    ).toLocaleString("fa-IR")+
    '</td>'+

    '<td>'+
    escapeHTML(w.method)+
    '</td>'+

    '<td>'+
    escapeHTML(w.address)+
    '</td>'+

    '<td>'+
    escapeHTML(w.status)+
    '</td>'+

    '</tr>'

   ).join("")+

   '</table>'+
   '</div>';


 }catch(e){

  $("adminContent").innerHTML=
   '<div class="card">❌ خطا:<br>'+
   escapeHTML(e.message)+
   '</div>';

 }

}


/* ADMIN PAYMENTS */

async function adminPayments(){

 $("adminContent").innerHTML=
  '<div class="card">در حال بارگذاری پرداخت‌ها...</div>';


 try{

  const data=await api(
   "/api/admin/payments"
  );


  if(
   !data.payments||
   !data.payments.length
  ){

   $("adminContent").innerHTML=
    '<div class="card">پرداختی وجود ندارد.</div>';

   return;

  }


  $("adminContent").innerHTML=

   '<div class="card">'+

   '<h2>💳 پرداخت‌ها</h2>'+

   '<table>'+

   '<tr>'+
   '<th>ID</th>'+
   '<th>کاربر</th>'+
   '<th>مبلغ</th>'+
   '<th>وضعیت</th>'+
   '<th>تاریخ</th>'+
   '</tr>'+

   data.payments.map(p=>

    '<tr>'+

    '<td>'+
    escapeHTML(p.id||"-")+
    '</td>'+

    '<td>'+
    escapeHTML(p.username||"-")+
    '</td>'+

    '<td>'+
    Number(
     p.amount||0
    ).toLocaleString("fa-IR")+
    '</td>'+

    '<td>'+
    escapeHTML(p.status||"-")+
    '</td>'+

    '<td>'+
    escapeHTML(p.created_at||"-")+
    '</td>'+

    '</tr>'

   ).join("")+

   '</table>'+

   '</div>';


 }catch(e){

  $("adminContent").innerHTML=
   '<div class="card">❌ خطا:<br>'+
   escapeHTML(e.message)+
   '</div>';

 }

}


/* ADMIN PLANS */

function adminPlans(){

 $("adminContent").innerHTML=

  '<div class="card">'+

  '<h2>💰 پلن‌ها</h2>'+

  '<div class="grid">'+

  PLANS.map(p=>

   '<div class="plan">'+

   '<h3>'+
   escapeHTML(p.title)+
   '</h3>'+

   '<strong>'+
   Number(p.irr).toLocaleString("fa-IR")+
   ' تومان</strong>'+

   '<div>🌎 '+
   p.usd+
   ' USD</div>'+

   '<div style="margin-top:8px">'+
   '<span class="badge">'+
   escapeHTML(p.id)+
   '</span>'+
   '</div>'+

   '</div>'

  ).join("")+

  '</div>'+

  '</div>';

}


/* ADMIN LOGOUT */

function adminLogout(){

 adminToken="";

 localStorage.removeItem(
  "admin_token"
 );

 $("admin").classList.add("hidden");

 $("auth").classList.remove("hidden");

}


/* EXISTING USER SESSION */

if(token){

 $("auth").classList.add("hidden");

 $("app").classList.remove("hidden");

 loadUser();

 loadPlans();

}

</script>

</body>
</html>`;


/* JSON RESPONSE */

function json(data,status=200){

 return new Response(
  JSON.stringify(data),
  {
   status:status,

   headers:{
    "content-type":
     "application/json;charset=UTF-8",

    "access-control-allow-origin":"*",

    "access-control-allow-headers":
     "Content-Type, Authorization, X-Admin-Token",

    "access-control-allow-methods":
     "GET,POST,OPTIONS"
   }
  }
 );

}


/* TOKEN */

function token(){

 return crypto.randomUUID()+
  "-"+
  crypto.randomUUID();

}


/* PASSWORD HASH */

async function hashPassword(password){

 const data=
  new TextEncoder().encode(password);

 const hash=
  await crypto.subtle.digest(
   "SHA-256",
   data
  );

 return [...new Uint8Array(hash)]
  .map(
   b=>b.toString(16).padStart(2,"0")
  )
  .join("");

}


/* BEARER */

function getBearer(request){

 const h=
  request.headers.get("Authorization")||"";

 return h.startsWith("Bearer ")
  ? h.slice(7)
  : "";

}


/* GET USER */

async function getUser(request,env){

 const t=getBearer(request);

 if(!t) return null;


 const row=
  await env.DB.prepare(
   `SELECT u.*
    FROM sessions s
    JOIN users u ON u.id=s.user_id
    WHERE s.token=?
    LIMIT 1`
  )
  .bind(t)
  .first();


 return row||null;

}


/* REQUIRE ADMIN */

async function requireAdmin(request,env){

 const t=
  request.headers.get(
   "X-Admin-Token"
  )||"";

 if(!t) return false;


 const row=
  await env.DB.prepare(
   "SELECT token,expires_at FROM admin_sessions WHERE token=? LIMIT 1"
  )
  .bind(t)
  .first();


 if(!row) return false;


 if(
  Number(row.expires_at)<=
  Math.floor(Date.now()/1000)
 ){

  try{

   await env.DB.prepare(
    "DELETE FROM admin_sessions WHERE token=?"
   )
   .bind(t)
   .run();

  }catch(e){}

  return false;

 }


 return true;

}


/* MAIN HANDLER */

async function handle(request,env){

 const url=
  new URL(request.url);

 const path=
  url.pathname;


 /* OPTIONS */

 if(request.method==="OPTIONS"){

  return new Response(
   null,
   {
    headers:{
     "access-control-allow-origin":"*",

     "access-control-allow-headers":
      "Content-Type, Authorization, X-Admin-Token",

     "access-control-allow-methods":
      "GET,POST,OPTIONS"
    }
   }
  );

 }


 /* HOME */

 if(path==="/"){

  return new Response(
   HTML,
   {
    headers:{
     "content-type":
      "text/html;charset=UTF-8"
    }
   }
  );

 }


 /* REGISTER */

 if(
  path==="/api/register" &&
  request.method==="POST"
 ){

  const body=
   await request.json();

  const name=
   String(body.name||"").trim();

  const email=
   String(body.email||"")
   .trim()
   .toLowerCase();

  const password=
   String(body.password||"");


  if(!email||!password){

   return json(
    {
     ok:false,
     error:
      "ایمیل و رمز عبور الزامی است"
    },
    400
   );

  }


  if(password.length<6){

   return json(
    {
     ok:false,
     error:
      "رمز عبور حداقل ۶ کاراکتر باشد"
    },
    400
   );

  }


  const exists=
   await env.DB.prepare(
    "SELECT id FROM users WHERE email=? LIMIT 1"
   )
   .bind(email)
   .first();


  if(exists){

   return json(
    {
     ok:false,
     error:
      "این ایمیل قبلاً ثبت شده است"
    },
    400
   );

  }


  const hash=
   await hashPassword(password);

  const username=
   email.split("@")[0];


  const result=
   await env.DB.prepare(
    `INSERT INTO users
    (username,balance,plan,email,password_hash,status,name)
    VALUES(?,?,?,?,?,?,?)`
   )
   .bind(
    username,
    0,
    "free",
    email,
    hash,
    "فعال",
    name
   )
   .run();


  return json(
   {
    ok:true,
    id:
     result.meta?.last_row_id||null
   }
  );

 }


 /* LOGIN */

 if(
  path==="/api/login" &&
  request.method==="POST"
 ){

  const body=
   await request.json();

  const email=
   String(body.email||"")
   .trim()
   .toLowerCase();

  const password=
   String(body.password||"");


  const hash=
   await hashPassword(password);


  const user=
   await env.DB.prepare(
    `SELECT *
     FROM users
     WHERE email=? AND password_hash=?
     LIMIT 1`
   )
   .bind(
    email,
    hash
   )
   .first();


  if(!user){

   return json(
    {
     ok:false,
     error:
      "ایمیل یا رمز عبور اشتباه است"
    },
    401
   );

  }


  const t=token();


  await env.DB.prepare(
   "INSERT INTO sessions(user_id,token) VALUES(?,?)"
  )
  .bind(
   user.id,
   t
  )
  .run();


  return json(
   {
    ok:true,
    token:t,
    user:user
   }
  );

 }


 /* ME */

 if(
  path==="/api/me" &&
  request.method==="GET"
 ){

  const user=
   await getUser(request,env);


  if(!user){

   return json(
    {
     ok:false,
     error:
      "نشست کاربر معتبر نیست"
    },
    401
   );

  }


  return json(
   {
    ok:true,
    user:user
   }
  );

 }


 /* TRANSACTIONS */

 if(
  path==="/api/transactions" &&
  request.method==="GET"
 ){

  const user=
   await getUser(request,env);


  if(!user){

   return json(
    {
     ok:false,
     error:
      "وارد حساب شوید"
    },
    401
   );

  }


  const result=
   await env.DB.prepare(
    `SELECT *
     FROM transactions
     WHERE username=?
     ORDER BY id DESC
     LIMIT 100`
   )
   .bind(user.username)
   .all();


  return json(
   {
    ok:true,
    transactions:
     result.results||[]
   }
  );

 }


 /* FORGOT */

 if(
  path==="/api/forgot" &&
  request.method==="POST"
 ){

  const body=
   await request.json();

  const email=
   String(body.email||"")
   .trim()
   .toLowerCase();


  const user=
   await env.DB.prepare(
    "SELECT id FROM users WHERE email=? LIMIT 1"
   )
   .bind(email)
   .first();


  if(!user){

   return json(
    {
     ok:true,
     message:
      "اگر این ایمیل وجود داشته باشد، درخواست بازیابی ثبت شد."
    }
   );

  }


  const code=
   String(
    Math.floor(
     100000+
     Math.random()*900000
    )
   );


  await env.DB.prepare(
   `INSERT INTO reset_codes
   (user_id,code,created_at)
   VALUES(?,?,CURRENT_TIMESTAMP)`
  )
  .bind(
   user.id,
   code
  )
  .run();


  return json(
   {
    ok:true,
    message:
     "کد بازیابی ایجاد شد. اتصال ارسال ایمیل باید تنظیم شود."
   }
  );

 }


 /* PAYMENT */

 if(
  path==="/api/payment" &&
  request.method==="POST"
 ){

  const user=
   await getUser(request,env);


  if(!user){

   return json(
    {
     ok:false,
     error:
      "ابتدا وارد حساب شوید"
    },
    401
   );

  }


  const body=
   await request.json();


  /*
   * دریافت امن شناسه پلن
   */

  const planId=
   String(
    body.plan_id||
    body.planId||
    body.id||
    ""
   )
   .trim();


  /*
   * پیدا کردن پلن
   */

  const plan=
   PLANS.find(
    x=>String(x.id)===planId
   );


  if(!plan){

   return json(
    {
     ok:false,
     error:
      "پلن نامعتبر است",
     received_plan_id:
      planId,
     available_plans:
      PLANS.map(x=>x.id)
    },
    400
   );

  }


  /*
   * ارز
   */

  const currency=
   body.currency==="USD"
   ? "USD"
   : "IRR";


  /*
   * مبلغ
   */

  const amount=
   currency==="USD"
   ? plan.usd
   : plan.irr;


  /*
   * شناسه سفارش
   */

  const paymentId=
   crypto.randomUUID();


  try{

   await env.DB.prepare(
    `INSERT INTO payments
    (username,amount,status,created_at)
    VALUES(?,?,?,CURRENT_TIMESTAMP)`
   )
   .bind(
    user.username,
    amount,
    "pending"
   )
   .run();


  }catch(e){

   return json(
    {
     ok:false,
     error:
      "ثبت سفارش پرداخت انجام نشد: "+
      e.message
    },
    500
   );

  }


  return json(
   {
    ok:true,

    payment_id:
     paymentId,

    amount:
     amount,

    currency:
     currency,

    plan:
     plan.title,

    plan_id:
     plan.id,

    status:
     "pending"
   }
  );

 }


 /* WITHDRAW */

 if(
  path==="/api/withdraw" &&
  request.method==="POST"
 ){

  const user=
   await getUser(request,env);


  if(!user){

   return json(
    {
     ok:false,
     error:
      "ابتدا وارد حساب شوید"
    },
    401
   );

  }


  const body=
   await request.json();


  const amount=
   Number(body.amount||0);

  const method=
   String(
    body.method||"USDT"
   );

  const address=
   String(
    body.address||""
   ).trim();


  if(
   !Number.isFinite(amount)||
   amount<=0
  ){

   return json(
    {
     ok:false,
     error:
      "مبلغ برداشت نامعتبر است"
    },
    400
   );

  }


  if(
   amount>
   Number(user.balance||0)
  ){

   return json(
    {
     ok:false,
     error:
      "موجودی کافی نیست"
    },
    400
   );

  }


  if(!address){

   return json(
    {
     ok:false,
     error:
      "آدرس برداشت را وارد کنید"
    },
    400
   );

  }


  await env.DB.prepare(
   `INSERT INTO withdrawals
   (username,amount,status,method,address)
   VALUES(?,?,?,?,?)`
  )
  .bind(
   user.username,
   amount,
   "pending",
   method,
   address
  )
  .run();


  return json(
   {
    ok:true,
    message:
     "درخواست برداشت ثبت شد."
   }
  );

 }


 /* ADMIN LOGIN */

 if(
  path==="/api/admin/login" &&
  request.method==="POST"
 ){

  const body=
   await request.json();

  const password=
   String(body.password||"");


  const adminPassword=
   env.ADMIN_PASSWORD||
   "Admin@123456";


  if(password!==adminPassword){

   return json(
    {
     ok:false,
     error:
      "رمز مدیریت اشتباه است"
    },
    401
   );

  }


  const t=token();


  const expiresAt=
   Math.floor(
    Date.now()/1000
   )+
   (24*60*60);


  try{

   await env.DB.prepare(
    `INSERT INTO admin_sessions
    (token,expires_at)
    VALUES(?,?)`
   )
   .bind(
    t,
    expiresAt
   )
   .run();


  }catch(e){

   return json(
    {
     ok:false,
     error:
      "خطا در ساخت نشست مدیریت",
     detail:
      e.message
    },
    500
   );

  }


  return json(
   {
    ok:true,
    token:t,
    expires_at:expiresAt
   }
  );

 }


 /* ADMIN USERS */

 if(
  path==="/api/admin/users" &&
  request.method==="GET"
 ){

  if(
   !(await requireAdmin(
    request,
    env
   ))
  ){

   return json(
    {
     ok:false,
     error:
      "دسترسی مدیریت لازم است"
    },
    401
   );

  }


  const result=
   await env.DB.prepare(
    `SELECT id,username,balance,plan,created_at,
    email,status,name
    FROM users
    ORDER BY id DESC`
   )
   .all();


  return json(
   {
    ok:true,
    users:
     result.results||[]
   }
  );

 }


 /* ADMIN WITHDRAWALS */

 if(
  path==="/api/admin/withdrawals" &&
  request.method==="GET"
 ){

  if(
   !(await requireAdmin(
    request,
    env
   ))
  ){

   return json(
    {
     ok:false,
     error:
      "دسترسی مدیریت لازم است"
    },
    401
   );

  }


  const result=
   await env.DB.prepare(
    `SELECT *
     FROM withdrawals
     ORDER BY id DESC
     LIMIT 500`
   )
   .all();


  return json(
   {
    ok:true,
    withdrawals:
     result.results||[]
   }
  );

 }


 /* ADMIN PAYMENTS */

 if(
  path==="/api/admin/payments" &&
  request.method==="GET"
 ){

  if(
   !(await requireAdmin(
    request,
    env
   ))
  ){

   return json(
    {
     ok:false,
     error:
      "دسترسی مدیریت لازم است"
    },
    401
   );

  }


  const result=
   await env.DB.prepare(
    `SELECT *
     FROM payments
     ORDER BY id DESC
     LIMIT 500`
   )
   .all();


  return json(
   {
    ok:true,
    payments:
     result.results||[]
   }
  );

 }


 /* 404 */

 return json(
  {
   ok:false,
   error:
    "مسیر پیدا نشد"
  },
  404
 );

}


/* WORKER */

export default {

 async fetch(request,env){

  try{

   if(!env.DB){

    return json(
     {
      ok:false,
      error:
       "اتصال D1 با نام DB پیدا نشد"
     },
     500
    );

   }


   return await handle(
    request,
    env
   );


  }catch(e){

   return json(
    {
     ok:false,
     error:
      "خطای داخلی سرور",
     detail:
      e.message
    },
    500
   );

  }

 }

};
