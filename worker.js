/* =========================================================
   🤖 دستیار هوش مصنوعی
   Cloudflare Worker + D1 + Workers AI
   نسخه کامل
   ========================================================= */

/* ---------- HTML ---------- */

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
 font-family:Tahoma,Arial,sans-serif;
 background:#f5f7fb;
 color:#172033
}
button,input,select,textarea{font-family:inherit}
button{cursor:pointer}
.container{max-width:1100px;margin:auto;padding:18px}
header{
 background:linear-gradient(135deg,#4f46e5,#7c3aed);
 color:#fff;
 padding:25px 18px;
 border-radius:0 0 25px 25px;
 box-shadow:0 8px 30px #0002
}
header h1{margin:0 0 8px;font-size:25px}
header p{margin:0;opacity:.9}
.card{
 background:#fff;
 border-radius:18px;
 padding:20px;
 margin:15px 0;
 box-shadow:0 5px 20px #0000000c;
 border:1px solid #eee
}
.hidden{display:none!important}
.grid{
 display:grid;
 grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
 gap:14px
}
.stat{
 padding:18px;
 border-radius:16px;
 background:#f8f9ff;
 border:1px solid #e7e8ff
}
.stat b{display:block;font-size:22px;margin-top:8px}
.btn{
 border:0;
 border-radius:12px;
 padding:12px 17px;
 background:#4f46e5;
 color:white;
 font-weight:bold
}
.btn:hover{opacity:.9}
.btn.red{background:#dc2626}
.btn.green{background:#16a34a}
.btn.gray{background:#64748b}
.btn.orange{background:#ea580c}
input,select,textarea{
 width:100%;
 padding:13px;
 border:1px solid #ddd;
 border-radius:12px;
 outline:none;
 margin:6px 0 12px;
 background:#fff
}
input:focus,select:focus,textarea:focus{border-color:#6366f1}
label{font-weight:bold;font-size:14px}
.nav{
 display:flex;
 gap:8px;
 flex-wrap:wrap;
 margin:15px 0
}
.nav button{
 border:0;
 padding:10px 13px;
 border-radius:10px;
 background:#e9eafe;
 color:#3730a3
}
.nav button.active{background:#4f46e5;color:white}
.plan{
 border:2px solid #eee;
 border-radius:18px;
 padding:20px;
 position:relative
}
.plan:hover{border-color:#6366f1}
.price{font-size:25px;font-weight:bold;color:#4f46e5;margin:12px 0}
.feature{margin:7px 0}
.badge{
 display:inline-block;
 padding:5px 10px;
 border-radius:20px;
 background:#ede9fe;
 color:#5b21b6;
 font-size:12px
}
table{width:100%;border-collapse:collapse}
th,td{padding:11px;border-bottom:1px solid #eee;text-align:right}
th{background:#f8f8ff}
.table-wrap{overflow:auto}
.msg{
 padding:12px;
 border-radius:12px;
 margin:10px 0;
 background:#eef2ff
}
.msg.error{background:#fee2e2;color:#991b1b}
.msg.success{background:#dcfce7;color:#166534}
.chat{
 height:330px;
 overflow:auto;
 background:#f8fafc;
 padding:15px;
 border-radius:15px
}
.chatmsg{
 padding:12px;
 margin:8px 0;
 border-radius:14px;
 max-width:90%
}
.chatmsg.user{background:#ddd6fe;margin-right:auto}
.chatmsg.ai{background:#e2e8f0}
.modal{
 position:fixed;
 inset:0;
 background:#0008;
 display:flex;
 align-items:center;
 justify-content:center;
 padding:15px;
 z-index:100
}
.modalbox{
 width:100%;
 max-width:430px;
 background:white;
 border-radius:20px;
 padding:22px
}
.small{font-size:12px;color:#64748b}
.danger{color:#b91c1c}
</style>
</head>

<body>

<header>
 <div class="container">
  <h1>🤖 دستیار هوش مصنوعی</h1>
  <p>دستیار هوشمند، حساب کاربری، درآمد، پرداخت و برداشت</p>
 </div>
</header>

<div class="container">

<!-- AUTH -->
<section id="auth">
 <div class="card">
  <h2>ورود به حساب</h2>

  <div class="nav">
   <button onclick="authTab('login')" id="tabLogin">ورود</button>
   <button onclick="authTab('register')" id="tabRegister">ثبت‌نام</button>
   <button onclick="authTab('forgot')" id="tabForgot">بازیابی رمز</button>
  </div>

  <div id="authMsg"></div>

  <div id="loginBox">
   <label>ایمیل</label>
   <input id="loginEmail" type="email" placeholder="ایمیل">

   <label>رمز عبور</label>
   <input id="loginPassword" type="password" placeholder="رمز عبور">

   <button class="btn" onclick="login()">ورود</button>
  </div>

  <div id="registerBox" class="hidden">
   <label>نام و نام خانوادگی</label>
   <input id="regName" placeholder="نام کامل">

   <label>ایمیل</label>
   <input id="regEmail" type="email" placeholder="ایمیل">

   <label>رمز عبور</label>
   <input id="regPassword" type="password" placeholder="حداقل 6 کاراکتر">

   <button class="btn green" onclick="register()">ثبت‌نام</button>
  </div>

  <div id="forgotBox" class="hidden">
   <label>ایمیل</label>
   <input id="forgotEmail" type="email" placeholder="ایمیل">

   <button class="btn orange" onclick="forgotPassword()">ارسال کد</button>

   <div id="resetArea" class="hidden">
    <label>کد بازیابی</label>
    <input id="resetCode" placeholder="کد">

    <label>رمز جدید</label>
    <input id="resetPassword" type="password" placeholder="رمز جدید">

    <button class="btn" onclick="resetPassword()">تغییر رمز</button>
   </div>
  </div>
 </div>

 <div class="card">
  <h3>🛠️ پنل مدیریت</h3>
  <p>مدیریت کاربران، پرداخت‌ها، برداشت‌ها و موجودی</p>
  <button class="btn gray" onclick="openAdmin()">ورود مدیریت</button>
 </div>
</section>


<!-- USER -->
<section id="userApp" class="hidden">

 <div class="card">
  <h2>👋 خوش آمدید <span id="userName"></span></h2>

  <div class="grid">
   <div class="stat">
    موجودی حساب
    <b id="balance">0 تومان</b>
   </div>

   <div class="stat">
    وضعیت حساب
    <b id="userStatus">فعال</b>
   </div>

   <div class="stat">
    اشتراک
    <b id="userPlan">رایگان</b>
   </div>
  </div>
 </div>

 <div class="nav">
  <button onclick="page('home')">🏠 خانه</button>
  <button onclick="page('profile')">👤 حساب کاربری</button>
  <button onclick="page('plans')">⭐ اشتراک</button>
  <button onclick="page('deposit')">💳 افزایش موجودی</button>
  <button onclick="page('withdraw')">💸 برداشت</button>
  <button onclick="page('transactions')">📜 تراکنش‌ها</button>
  <button onclick="page('ai')">🤖 هوش مصنوعی</button>
  <button class="btn red" onclick="logout()">خروج</button>
 </div>

 <div id="homePage" class="page">
  <div class="card">
   <h2>🤖 دستیار هوشمند</h2>
   <p>
    از بخش هوش مصنوعی برای گفتگو استفاده کنید.
    برای استفاده از امکانات ویژه می‌توانید اشتراک تهیه کنید.
   </p>
  </div>

  <div class="grid">
   <div class="card">
    <h3>💰 درآمد</h3>
    <p>موجودی شما:</p>
    <b id="homeBalance">0 تومان</b>
   </div>

   <div class="card">
    <h3>⭐ اشتراک</h3>
    <p id="homePlan">رایگان</p>
   </div>

   <div class="card">
    <h3>💸 برداشت</h3>
    <p>حداقل برداشت: ۱۰٬۰۰۰ تومان</p>
   </div>
  </div>
 </div>

 <div id="profilePage" class="page hidden">
  <div class="card">
   <h2>👤 حساب کاربری</h2>

   <label>نام</label>
   <input id="profileName">

   <label>ایمیل</label>
   <input id="profileEmail" disabled>

   <button class="btn" onclick="saveProfile()">ذخیره اطلاعات</button>

   <div id="profileMsg"></div>
  </div>
 </div>


 <div id="plansPage" class="page hidden">
  <div class="card">
   <h2>⭐ پلن‌های اشتراک</h2>

   <div class="grid">

    <div class="plan">
     <span class="badge">رایگان</span>
     <h3>Free</h3>
     <div class="price">۰ تومان</div>
     <div class="feature">✓ استفاده پایه</div>
     <div class="feature">✓ حساب کاربری</div>
     <div class="feature">✓ ثبت تراکنش</div>
     <button class="btn gray" onclick="selectPlan('رایگان',0)">انتخاب</button>
    </div>

    <div class="plan">
     <span class="badge">محبوب</span>
     <h3>Professional</h3>
     <div class="price">۴۹۹٬۰۰۰ تومان</div>
     <div class="feature">✓ امکانات حرفه‌ای</div>
     <div class="feature">✓ اولویت استفاده</div>
     <div class="feature">✓ امکانات بیشتر AI</div>
     <button class="btn" onclick="selectPlan('حرفه‌ای',499000)">خرید پلن</button>
    </div>

    <div class="plan">
     <span class="badge">ویژه</span>
     <h3>Special</h3>
     <div class="price">۹۹۹٬۰۰۰ تومان</div>
     <div class="feature">✓ همه امکانات</div>
     <div class="feature">✓ استفاده ویژه</div>
     <div class="feature">✓ اولویت بالا</div>
     <button class="btn orange" onclick="selectPlan('ویژه',999000)">خرید پلن</button>
    </div>

   </div>
  </div>
 </div>


 <div id="depositPage" class="page hidden">
  <div class="card">
   <h2>💳 افزایش موجودی</h2>

   <p class="small">
    مبلغ موردنظر را انتخاب کنید. درخواست پرداخت ثبت می‌شود.
   </p>

   <label>مبلغ</label>
   <select id="depositAmount">
    <option value="100000">۱۰۰٬۰۰۰ تومان</option>
    <option value="300000">۳۰۰٬۰۰۰ تومان</option>
    <option value="500000">۵۰۰٬۰۰۰ تومان</option>
    <option value="1000000">۱٬۰۰۰٬۰۰۰ تومان</option>
    <option value="3000000">۳٬۰۰۰٬۰۰۰ تومان</option>
    <option value="5000000">۵٬۰۰۰٬۰۰۰ تومان</option>
    <option value="10000000">۱۰٬۰۰۰٬۰۰۰ تومان</option>
   </select>

   <label>روش پرداخت</label>
   <select id="depositMethod">
    <option value="زرین‌پال">زرین‌پال</option>
    <option value="درگاه بانکی">درگاه بانکی</option>
   </select>

   <button class="btn green" onclick="startDeposit()">ادامه پرداخت</button>

   <div id="depositMsg"></div>
  </div>
 </div>


 <div id="withdrawPage" class="page hidden">
  <div class="card">
   <h2>💸 درخواست برداشت</h2>

   <p>حداقل برداشت: <b>۱۰٬۰۰۰ تومان</b></p>

   <label>مبلغ برداشت</label>
   <input id="withdrawAmount" type="number" min="10000" placeholder="مثلاً 50000">

   <label>روش برداشت</label>
   <select id="withdrawMethod" onchange="withdrawMethodChanged()">
    <option value="بانک">واریز بانکی</option>
    <option value="USDT">USDT</option>
   </select>

   <div id="bankFields">
    <label>شماره کارت یا شبا</label>
    <input id="bankAddress" placeholder="شماره کارت یا شبا">
   </div>

   <div id="cryptoFields" class="hidden">
    <label>شبکه</label>
    <select id="withdrawNetwork">
     <option value="TRC20">TRC20</option>
     <option value="BEP20">BEP20</option>
     <option value="ERC20">ERC20</option>
    </select>

    <label>آدرس کیف پول</label>
    <input id="cryptoAddress" placeholder="آدرس کیف پول">
   </div>

   <button class="btn orange" onclick="withdraw()">ثبت درخواست برداشت</button>

   <div id="withdrawMsg"></div>
  </div>
 </div>


 <div id="transactionsPage" class="page hidden">
  <div class="card">
   <h2>📜 تراکنش‌ها</h2>
   <div id="transactions"></div>
  </div>
 </div>


 <div id="aiPage" class="page hidden">
  <div class="card">
   <h2>🤖 هوش مصنوعی</h2>

   <div id="chat" class="chat"></div>

   <textarea id="aiInput" rows="3"
    placeholder="پیام خود را بنویسید..."></textarea>

   <button class="btn" onclick="sendAI()">ارسال پیام</button>

   <div id="aiMsg"></div>
  </div>
 </div>

</section>


<!-- ADMIN -->
<section id="adminApp" class="hidden">

 <div class="card">
  <h2>🛠️ پنل مدیریت</h2>
  <p>مدیریت کاربران، پرداخت‌ها، برداشت‌ها و موجودی</p>

  <button class="btn red" onclick="adminLogout()">خروج مدیر</button>
 </div>

 <div class="nav">
  <button onclick="adminPage('stats')">📊 آمار</button>
  <button onclick="adminPage('users')">👥 کاربران</button>
  <button onclick="adminPage('payments')">💳 پرداخت‌ها</button>
  <button onclick="adminPage('withdrawals')">💸 برداشت‌ها</button>
 </div>

 <div id="adminStats" class="adminpage">
  <div class="card">
   <h2>📊 آمار</h2>
   <div class="grid">
    <div class="stat">کاربران<b id="statUsers">0</b></div>
    <div class="stat">پرداخت‌ها<b id="statPayments">0</b></div>
    <div class="stat">برداشت‌ها<b id="statWithdrawals">0</b></div>
    <div class="stat">موجودی<b id="statBalance">0</b></div>
   </div>
  </div>
 </div>

 <div id="adminUsers" class="adminpage hidden">
  <div class="card">
   <h2>👥 کاربران</h2>
   <div class="table-wrap">
    <table>
     <thead>
      <tr>
       <th>ID</th>
       <th>نام</th>
       <th>ایمیل</th>
       <th>موجودی</th>
       <th>وضعیت</th>
       <th>عملیات</th>
      </tr>
     </thead>
     <tbody id="usersTable"></tbody>
    </table>
   </div>
  </div>
 </div>

 <div id="adminPayments" class="adminpage hidden">
  <div class="card">
   <h2>💳 پرداخت‌ها</h2>
   <div class="table-wrap">
    <table>
     <thead>
      <tr>
       <th>ID</th>
       <th>User</th>
       <th>مبلغ</th>
       <th>روش</th>
       <th>وضعیت</th>
       <th>عملیات</th>
      </tr>
     </thead>
     <tbody id="paymentsTable"></tbody>
    </table>
   </div>
  </div>
 </div>

 <div id="adminWithdrawals" class="adminpage hidden">
  <div class="card">
   <h2>💸 برداشت‌ها</h2>
   <div class="table-wrap">
    <table>
     <thead>
      <tr>
       <th>ID</th>
       <th>User</th>
       <th>مبلغ</th>
       <th>روش</th>
       <th>آدرس</th>
       <th>وضعیت</th>
       <th>عملیات</th>
      </tr>
     </thead>
     <tbody id="withdrawalsTable"></tbody>
    </table>
   </div>
  </div>
 </div>

 <div id="adminMsg"></div>

</section>

</div>


<!-- ADMIN LOGIN MODAL -->
<div id="adminModal" class="modal hidden">
 <div class="modalbox">
  <h2>🔐 ورود مدیر</h2>

  <label>رمز مدیریت</label>
  <input id="adminPassword" type="password" placeholder="رمز مدیریت">

  <div id="adminLoginMsg"></div>

  <button class="btn" onclick="adminLogin()">ورود</button>
  <button class="btn gray" onclick="closeAdmin()">بستن</button>
 </div>
</div>


<script>

let token=localStorage.getItem("token")||"";
let adminToken=localStorage.getItem("admin_token")||"";
let currentUser=null;


/* ---------- API ---------- */

async function request(url,options={}){
 options.headers=options.headers||{};

 if(token){
  options.headers.Authorization="Bearer "+token;
 }

 if(options.body && typeof options.body!=="string"){
  options.headers["Content-Type"]="application/json";
  options.body=JSON.stringify(options.body);
 }

 const r=await fetch(url,options);

 let data={};
 try{
  data=await r.json();
 }catch(e){
  data={ok:false,error:"پاسخ نامعتبر از سرور"};
 }

 if(!r.ok && !data.error){
  data.error="خطای سرور";
 }

 return data;
}


async function adminRequest(url,options={}){
 options.headers=options.headers||{};

 if(adminToken){
  options.headers.Authorization="Admin "+adminToken;
 }

 if(options.body && typeof options.body!=="string"){
  options.headers["Content-Type"]="application/json";
  options.body=JSON.stringify(options.body);
 }

 const r=await fetch(url,options);

 let data={};
 try{
  data=await r.json();
 }catch(e){
  data={ok:false,error:"پاسخ نامعتبر"};
 }

 return data;
}


/* ---------- AUTH ---------- */

function authTab(type){

 document.getElementById("loginBox").classList.toggle("hidden",type!=="login");
 document.getElementById("registerBox").classList.toggle("hidden",type!=="register");
 document.getElementById("forgotBox").classList.toggle("hidden",type!=="forgot");

 document.getElementById("authMsg").innerHTML="";
}


function showAuthMessage(text,type=""){
 document.getElementById("authMsg").innerHTML=
  '<div class="msg '+type+'">'+escapeHtml(text)+'</div>';
}


async function login(){

 const email=document.getElementById("loginEmail").value.trim();
 const password=document.getElementById("loginPassword").value;

 if(!email||!password){
  showAuthMessage("ایمیل و رمز عبور را وارد کنید","error");
  return;
 }

 const d=await request("/api/login",{
  method:"POST",
  body:{email,password}
 });

 if(!d.ok){
  showAuthMessage(d.error||"ورود ناموفق بود","error");
  return;
 }

 token=d.token;
 localStorage.setItem("token",token);

 await loadMe();
}


async function register(){

 const name=document.getElementById("regName").value.trim();
 const email=document.getElementById("regEmail").value.trim();
 const password=document.getElementById("regPassword").value;

 if(!name||!email||!password){
  showAuthMessage("همه اطلاعات را وارد کنید","error");
  return;
 }

 const d=await request("/api/register",{
  method:"POST",
  body:{name,email,password}
 });

 if(!d.ok){
  showAuthMessage(d.error||"ثبت‌نام ناموفق بود","error");
  return;
 }

 token=d.token;
 localStorage.setItem("token",token);

 await loadMe();
}


async function forgotPassword(){

 const email=document.getElementById("forgotEmail").value.trim();

 if(!email){
  showAuthMessage("ایمیل را وارد کنید","error");
  return;
 }

 const d=await request("/api/forgot",{
  method:"POST",
  body:{email}
 });

 if(!d.ok){
  showAuthMessage(d.error||"خطا","error");
  return;
 }

 showAuthMessage(
  d.message||"کد ارسال شد",
  "success"
 );

 document.getElementById("resetArea").classList.remove("hidden");
}


async function resetPassword(){

 const email=document.getElementById("forgotEmail").value.trim();
 const code=document.getElementById("resetCode").value.trim();
 const password=document.getElementById("resetPassword").value;

 const d=await request("/api/reset",{
  method:"POST",
  body:{email,code,password}
 });

 if(!d.ok){
  showAuthMessage(d.error||"خطا","error");
  return;
 }

 showAuthMessage("رمز عبور تغییر کرد. اکنون وارد شوید.","success");
 authTab("login");
}


/* ---------- USER ---------- */

async function loadMe(){

 if(!token){
  showAuth();
  return;
 }

 const d=await request("/api/me");

 if(!d.ok){
  token="";
  localStorage.removeItem("token");
  showAuth();
  return;
 }

 currentUser=d.user;

 document.getElementById("userName").textContent=currentUser.name||"کاربر";
 document.getElementById("balance").textContent=formatMoney(currentUser.balance);
 document.getElementById("homeBalance").textContent=formatMoney(currentUser.balance);
 document.getElementById("userStatus").textContent=currentUser.status||"فعال";
 document.getElementById("userPlan").textContent=currentUser.plan||"رایگان";
 document.getElementById("homePlan").textContent=currentUser.plan||"رایگان";

 document.getElementById("profileName").value=currentUser.name||"";
 document.getElementById("profileEmail").value=currentUser.email||"";

 document.getElementById("auth").classList.add("hidden");
 document.getElementById("userApp").classList.remove("hidden");

 page("home");
}


function showAuth(){
 document.getElementById("auth").classList.remove("hidden");
 document.getElementById("userApp").classList.add("hidden");
 document.getElementById("adminApp").classList.add("hidden");
}


function page(name){

 document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));

 const el=document.getElementById(name+"Page");

 if(el)el.classList.remove("hidden");

 if(name==="transactions")loadTransactions();
}


async function saveProfile(){

 const name=document.getElementById("profileName").value.trim();

 const d=await request("/api/profile",{
  method:"POST",
  body:{name}
 });

 const box=document.getElementById("profileMsg");

 if(!d.ok){
  box.innerHTML='<div class="msg error">'+escapeHtml(d.error||"خطا")+'</div>';
  return;
 }

 box.innerHTML='<div class="msg success">اطلاعات ذخیره شد</div>';
 await loadMe();
}


function selectPlan(name,amount){

 if(amount===0){
  alert("پلن رایگان انتخاب شد");
  return;
 }

 document.getElementById("depositAmount").value=amount;
 page("deposit");

 document.getElementById("depositMsg").innerHTML=
  '<div class="msg">پلن '+escapeHtml(name)+' انتخاب شد. مبلغ را پرداخت کنید.</div>';
}


async function startDeposit(){

 const amount=Number(document.getElementById("depositAmount").value);
 const method=document.getElementById("depositMethod").value;

 const d=await request("/api/payment/start",{
  method:"POST",
  body:{
   amount,
   method,
   plan_name:"افزایش موجودی"
  }
 });

 const box=document.getElementById("depositMsg");

 if(!d.ok){
  box.innerHTML='<div class="msg error">'+escapeHtml(d.error||"خطا در پرداخت")+'</div>';
  return;
 }

 if(d.url){
  location.href=d.url;
  return;
 }

 box.innerHTML=
  '<div class="msg success">'+
  escapeHtml(d.message||"درخواست پرداخت ثبت شد")+
  '</div>';
}


function withdrawMethodChanged(){

 const method=document.getElementById("withdrawMethod").value;

 document.getElementById("bankFields")
  .classList.toggle("hidden",method!=="بانک");

 document.getElementById("cryptoFields")
  .classList.toggle("hidden",method!=="USDT");
}


async function withdraw(){

 const amount=Number(document.getElementById("withdrawAmount").value);
 const method=document.getElementById("withdrawMethod").value;

 let address="";
 let network="TRC20";

 if(method==="بانک"){
  address=document.getElementById("bankAddress").value.trim();
 }else{
  address=document.getElementById("cryptoAddress").value.trim();
  network=document.getElementById("withdrawNetwork").value;
 }

 const d=await request("/api/withdraw",{
  method:"POST",
  body:{
   amount,
   method,
   network,
   address
  }
 });

 const box=document.getElementById("withdrawMsg");

 if(!d.ok){
  box.innerHTML='<div class="msg error">'+escapeHtml(d.error||"خطا")+'</div>';
  return;
 }

 box.innerHTML=
  '<div class="msg success">درخواست برداشت ثبت شد و در انتظار بررسی است.</div>';

 await loadMe();
}


async function loadTransactions(){

 const d=await request("/api/transactions");

 const box=document.getElementById("transactions");

 if(!d.ok){
  box.innerHTML='<div class="msg error">'+escapeHtml(d.error||"خطا")+'</div>';
  return;
 }

 if(!d.transactions.length){
  box.innerHTML='<div class="msg">هنوز تراکنشی ثبت نشده است.</div>';
  return;
 }

 box.innerHTML=
  '<div class="table-wrap"><table>'+
  '<thead><tr><th>نوع</th><th>مبلغ</th><th>شرح</th><th>تاریخ</th></tr></thead>'+
  '<tbody>'+
  d.transactions.map(x=>
   '<tr>'+
   '<td>'+escapeHtml(x.type)+'</td>'+
   '<td>'+formatMoney(x.amount)+'</td>'+
   '<td>'+escapeHtml(x.description||"")+'</td>'+
   '<td>'+escapeHtml(x.created_at||"")+'</td>'+
   '</tr>'
  ).join("")+
  '</tbody></table></div>';
}


/* ---------- AI ---------- */

function addChat(text,type){

 const chat=document.getElementById("chat");

 const div=document.createElement("div");
 div.className="chatmsg "+type;
 div.textContent=text;

 chat.appendChild(div);
 chat.scrollTop=chat.scrollHeight;
}


async function sendAI(){

 const input=document.getElementById("aiInput");
 const text=input.value.trim();

 if(!text)return;

 addChat(text,"user");
 input.value="";

 const loading=document.createElement("div");
 loading.className="chatmsg ai";
 loading.textContent="در حال پاسخ...";
 loading.id="aiLoading";

 document.getElementById("chat").appendChild(loading);

 const d=await request("/api/ai",{
  method:"POST",
  body:{message:text}
 });

 const el=document.getElementById("aiLoading");
 if(el)el.remove();

 if(!d.ok){
  addChat(d.error||"خطا در هوش مصنوعی","ai");
  return;
 }

 addChat(d.answer||"پاسخی دریافت نشد","ai");
}


/* ---------- ADMIN ---------- */

function openAdmin(){
 document.getElementById("adminModal").classList.remove("hidden");
 document.getElementById("adminLoginMsg").innerHTML="";
}


function closeAdmin(){
 document.getElementById("adminModal").classList.add("hidden");
}


async function adminLogin(){

 const password=document.getElementById("adminPassword").value;

 if(!password){
  document.getElementById("adminLoginMsg").innerHTML=
   '<div class="msg error">رمز را وارد کنید</div>';
  return;
 }

 const d=await adminRequest("/api/admin/login",{
  method:"POST",
  body:{password}
 });

 if(!d.ok){
  document.getElementById("adminLoginMsg").innerHTML=
   '<div class="msg error">'+escapeHtml(d.error||"ورود ناموفق")+'</div>';
  return;
 }

 adminToken=d.token;
 localStorage.setItem("admin_token",adminToken);

 closeAdmin();

 document.getElementById("auth").classList.add("hidden");
 document.getElementById("userApp").classList.add("hidden");
 document.getElementById("adminApp").classList.remove("hidden");

 await loadAdminStats();
}


async function loadAdminStats(){

 const d=await adminRequest("/api/admin/stats");

 if(!d.ok){
  document.getElementById("adminMsg").innerHTML=
   '<div class="msg error">'+escapeHtml(d.error||"دسترسی مدیر لازم است.")+'</div>';
  return;
 }

 document.getElementById("statUsers").textContent=d.stats.users;
 document.getElementById("statPayments").textContent=d.stats.payments;
 document.getElementById("statWithdrawals").textContent=d.stats.withdrawals;
 document.getElementById("statBalance").textContent=formatMoney(d.stats.balance);

 await loadAdminUsers();
 await loadAdminPayments();
 await loadAdminWithdrawals();
}


function adminPage(name){

 document.querySelectorAll(".adminpage").forEach(x=>x.classList.add("hidden"));

 const el=document.getElementById("admin"+name.charAt(0).toUpperCase()+name.slice(1));

 if(el)el.classList.remove("hidden");

 if(name==="users")loadAdminUsers();
 if(name==="payments")loadAdminPayments();
 if(name==="withdrawals")loadAdminWithdrawals();
 if(name==="stats")loadAdminStats();
}


async function loadAdminUsers(){

 const d=await adminRequest("/api/admin/users");

 if(!d.ok)return;

 document.getElementById("usersTable").innerHTML=d.users.map(u=>
  '<tr>'+
  '<td>'+u.id+'</td>'+
  '<td>'+escapeHtml(u.name)+'</td>'+
  '<td>'+escapeHtml(u.email)+'</td>'+
  '<td>'+formatMoney(u.balance)+'</td>'+
  '<td>'+escapeHtml(u.status)+'</td>'+
  '<td>'+
  '<button class="btn green" onclick="changeBalance('+u.id+')">موجودی</button> '+
  '<button class="btn gray" onclick="changeStatus('+u.id+')">وضعیت</button>'+
  '</td>'+
  '</tr>'
 ).join("");
}


async function changeBalance(id){

 const amount=prompt("مبلغ تغییر موجودی را وارد کنید. برای کم کردن عدد منفی بزنید:");

 if(amount===null)return;

 const n=Number(amount);

 if(!Number.isFinite(n)){
  alert("مبلغ نامعتبر است");
  return;
 }

 const d=await adminRequest("/api/admin/user/balance",{
  method:"POST",
  body:{user_id:id,amount:n}
 });

 if(!d.ok){
  alert(d.error||"خطا");
  return;
 }

 await loadAdminStats();
}


async function changeStatus(id){

 const status=prompt("وضعیت جدید را وارد کنید: فعال / مسدود");

 if(!status)return;

 const d=await adminRequest("/api/admin/user/status",{
  method:"POST",
  body:{user_id:id,status}
 });

 if(!d.ok){
  alert(d.error||"خطا");
  return;
 }

 await loadAdminUsers();
}


async function loadAdminPayments(){

 const d=await adminRequest("/api/admin/payments");

 if(!d.ok)return;

 document.getElementById("paymentsTable").innerHTML=d.payments.map(p=>
  '<tr>'+
  '<td>'+p.id+'</td>'+
  '<td>'+p.user_id+'</td>'+
  '<td>'+formatMoney(p.amount_toman)+'</td>'+
  '<td>'+escapeHtml(p.method)+'</td>'+
  '<td>'+escapeHtml(p.status)+'</td>'+
  '<td>'+
  '<button class="btn green" onclick="paymentStatus('+p.id+',\\'موفق\\')">تأیید</button> '+
  '<button class="btn red" onclick="paymentStatus('+p.id+',\\'رد شده\\')">رد</button>'+
  '</td>'+
  '</tr>'
 ).join("");
}


async function paymentStatus(id,status){

 const d=await adminRequest("/api/admin/payment/status",{
  method:"POST",
  body:{id,status}
 });

 if(!d.ok){
  alert(d.error||"خطا");
  return;
 }

 await loadAdminStats();
}


async function loadAdminWithdrawals(){

 const d=await adminRequest("/api/admin/withdrawals");

 if(!d.ok)return;

 document.getElementById("withdrawalsTable").innerHTML=d.withdrawals.map(w=>
  '<tr>'+
  '<td>'+w.id+'</td>'+
  '<td>'+w.user_id+'</td>'+
  '<td>'+formatMoney(w.amount)+'</td>'+
  '<td>'+escapeHtml(w.method)+'</td>'+
  '<td>'+escapeHtml(w.address)+'</td>'+
  '<td>'+escapeHtml(w.status)+'</td>'+
  '<td>'+
  '<button class="btn green" onclick="withdrawStatus('+w.id+',\\'پرداخت شد\\')">پرداخت شد</button> '+
  '<button class="btn red" onclick="withdrawStatus('+w.id+',\\'رد شده\\')">رد</button>'+
  '</td>'+
  '</tr>'
 ).join("");
}


async function withdrawStatus(id,status){

 const d=await adminRequest("/api/admin/withdrawal/status",{
  method:"POST",
  body:{id,status}
 });

 if(!d.ok){
  alert(d.error||"خطا");
  return;
 }

 await loadAdminStats();
}


function adminLogout(){

 adminToken="";
 localStorage.removeItem("admin_token");

 document.getElementById("adminApp").classList.add("hidden");
 showAuth();
}


function logout(){

 token="";
 localStorage.removeItem("token");

 currentUser=null;

 showAuth();
 authTab("login");
}


/* ---------- HELPERS ---------- */

function formatMoney(n){

 n=Number(n||0);

 return new Intl.NumberFormat("fa-IR").format(Math.round(n))+" تومان";
}


function escapeHtml(value){

 return String(value??"")
  .replaceAll("&","&amp;")
  .replaceAll("<","&lt;")
  .replaceAll(">","&gt;")
  .replaceAll('"',"&quot;")
  .replaceAll("'","&#039;");
}


/* ---------- START ---------- */

document.addEventListener("DOMContentLoaded",async()=>{

 authTab("login");

 if(token){
  await loadMe();
 }

 if(adminToken){
  const d=await adminRequest("/api/admin/stats");

  if(d.ok){
   document.getElementById("auth").classList.add("hidden");
   document.getElementById("userApp").classList.add("hidden");
   document.getElementById("adminApp").classList.remove("hidden");
   await loadAdminStats();
  }else{
   adminToken="";
   localStorage.removeItem("admin_token");
  }
 }

});

</script>

</body>
</html>`;


/* =========================================================
   HELPERS
   ========================================================= */

function json(data,status=200){

 return new Response(
  JSON.stringify(data),
  {
   status,
   headers:{
    "content-type":"application/json;charset=UTF-8",
    "cache-control":"no-store"
   }
  }
 );
}


function htmlResponse(){

 return new Response(HTML,{
  headers:{
   "content-type":"text/html;charset=UTF-8",
   "cache-control":"no-store"
  }
 });
}


/* ---------- Binding Detection ---------- */

function getDB(env){

 return env.DB ||
        env["دی‌بی"] ||
        env.D1 ||
        env.DATABASE ||
        null;
}


function getAI(env){

 return env.AI ||
        env["هوش مصنوعی"] ||
        null;
}


/* ---------- Hash ---------- */

async function hashPassword(password){

 const data=new TextEncoder().encode(password);

 const hash=await crypto.subtle.digest(
  "SHA-256",
  data
 );

 return [...new Uint8Array(hash)]
  .map(x=>x.toString(16).padStart(2,"0"))
  .join("");
}


/* ---------- Random ---------- */

function randomToken(){

 return crypto.randomUUID()+"-"+crypto.randomUUID();
}


function randomCode(){

 return String(
  Math.floor(100000+Math.random()*900000)
 );
}


/* =========================================================
   DATABASE
   ========================================================= */

async function tableExists(db,name){

 try{

  const r=await db.prepare(
   "SELECT name FROM sqlite_master WHERE type='table' AND name=?"
  ).bind(name).first();

  return !!r;

 }catch(e){

  return false;
 }
}


async function getColumns(db,table){

 try{

  const r=await db.prepare(
   "PRAGMA table_info("+table+")"
  ).all();

  return (r.results||[]).map(x=>x.name);

 }catch(e){

  return [];
 }
}


async function initDB(db){

 /*
   نکته:
   این دستورات فقط جدول‌هایی را که ندارند می‌سازند.
   جدول users موجود شما دستکاری نمی‌شود.
 */

 await db.prepare(`
  CREATE TABLE IF NOT EXISTS sessions (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   token TEXT UNIQUE,
   user_id INTEGER NOT NULL,
   created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
 `).run();


 await db.prepare(`
  CREATE TABLE IF NOT EXISTS transactions (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   user_id INTEGER NOT NULL,
   type TEXT NOT NULL,
   amount REAL NOT NULL,
   description TEXT,
   created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
 `).run();


 await db.prepare(`
  CREATE TABLE IF NOT EXISTS admin_sessions (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   token TEXT UNIQUE,
   created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
 `).run();


 await db.prepare(`
  CREATE TABLE IF NOT EXISTS reset_codes (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   user_id INTEGER NOT NULL,
   code TEXT NOT NULL,
   expires_at INTEGER NOT NULL
  )
 `).run();


 await db.prepare(`
  CREATE TABLE IF NOT EXISTS deposits (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   user_id INTEGER NOT NULL,
   plan_name TEXT NOT NULL,
   amount_toman INTEGER NOT NULL,
   method TEXT NOT NULL,
   reference TEXT NOT NULL,
   note TEXT,
   status TEXT NOT NULL DEFAULT 'در انتظار',
   created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
 `).run();


 await db.prepare(`
  CREATE TABLE IF NOT EXISTS withdrawals (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   user_id INTEGER NOT NULL,
   amount REAL NOT NULL,
   method TEXT NOT NULL,
   network TEXT NOT NULL DEFAULT 'TRC20',
   address TEXT NOT NULL,
   status TEXT NOT NULL DEFAULT 'در انتظار',
   created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
 `).run();


 await db.prepare(`
  CREATE TABLE IF NOT EXISTS subscriptions (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   user_id INTEGER NOT NULL,
   plan_name TEXT NOT NULL,
   amount INTEGER NOT NULL DEFAULT 0,
   status TEXT NOT NULL DEFAULT 'فعال',
   created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
 `).run();
}


/* =========================================================
   USER
   ========================================================= */

async function getUserById(db,id){

 return await db.prepare(
  "SELECT * FROM users WHERE id=? LIMIT 1"
 ).bind(id).first();
}


async function getUserByEmail(db,email){

 return await db.prepare(
  "SELECT * FROM users WHERE lower(email)=lower(?) LIMIT 1"
 ).bind(email).first();
}


async function createSession(db,userId){

 const token=randomToken();

 await db.prepare(
  "INSERT INTO sessions(token,user_id) VALUES(?,?)"
 ).bind(token,userId).run();

 return token;
}


async function getUserFromRequest(db,request){

 const auth=request.headers.get("Authorization")||"";

 if(!auth.startsWith("Bearer "))return null;

 const token=auth.slice(7).trim();

 if(!token)return null;

 const row=await db.prepare(`
  SELECT u.*
  FROM sessions s
  JOIN users u ON u.id=s.user_id
  WHERE s.token=?
  LIMIT 1
 `).bind(token).first();

 return row||null;
}


async function getPlan(db,userId){

 const row=await db.prepare(`
  SELECT plan_name
  FROM subscriptions
  WHERE user_id=? AND status='فعال'
  ORDER BY id DESC
  LIMIT 1
 `).bind(userId).first();

 return row?.plan_name||"رایگان";
}


/* =========================================================
   ADMIN
   ========================================================= */

async function adminAuth(db,request){

 const auth=request.headers.get("Authorization")||"";

 if(!auth.startsWith("Admin "))return false;

 const token=auth.slice(6).trim();

 if(!token)return false;

 const row=await db.prepare(
  "SELECT id FROM admin_sessions WHERE token=? LIMIT 1"
 ).bind(token).first();

 return !!row;
}


async function requireAdmin(db,request){

 const ok=await adminAuth(db,request);

 if(!ok){
  return json({
   ok:false,
   error:"دسترسی مدیر لازم است."
  },403);
 }

 return null;
}


/* =========================================================
   FETCH
   ========================================================= */

export default {

 async fetch(request,env){

  try{

   /* ---------- Find DB ---------- */

   const db=getDB(env);

   if(!db){

    return json({
     ok:false,
     error:"D1 پیدا نشد.",
     detail:"Binding دیتابیس باید با نام DB به Worker متصل باشد."
    },500);
   }


   await initDB(db);


   const url=new URL(request.url);
   const path=url.pathname;
   const method=request.method;


   /* ---------- Home ---------- */

   if(path==="/" || path==="/index.html"){

    return htmlResponse();
   }


   /* =====================================================
      REGISTER
      ===================================================== */

   if(path==="/api/register" && method==="POST"){

    const body=await request.json();

    const name=String(body.name||"").trim();
    const email=String(body.email||"").trim().toLowerCase();
    const password=String(body.password||"");

    if(!name||!email||!password){

     return json({
      ok:false,
      error:"نام، ایمیل و رمز عبور الزامی است."
     },400);
    }


    if(password.length<6){

     return json({
      ok:false,
      error:"رمز عبور باید حداقل ۶ کاراکتر باشد."
     },400);
    }


    const exists=await getUserByEmail(db,email);

    if(exists){

     return json({
      ok:false,
      error:"این ایمیل قبلاً ثبت شده است."
     },409);
    }


    const passwordHash=await hashPassword(password);

    const cols=await getColumns(db,"users");

    let result;

    if(cols.includes("username")){

     result=await db.prepare(`
      INSERT INTO users
      (name,username,email,password_hash,balance,status)
      VALUES(?,?,?,?,0,'فعال')
     `).bind(
      name,
      email,
      email,
      passwordHash
     ).run();

    }else{

     result=await db.prepare(`
      INSERT INTO users
      (name,email,password_hash,balance,status)
      VALUES(?,?,?,0,'فعال')
     `).bind(
      name,
      email,
      passwordHash
     ).run();
    }


    const userId=result.meta.last_row_id;

    const token=await createSession(db,userId);


    await db.prepare(`
     INSERT INTO transactions
     (user_id,type,amount,description)
     VALUES(?,'ثبت‌نام',0,'ایجاد حساب کاربری')
    `).bind(userId).run();


    return json({
     ok:true,
     token
    });
   }


   /* =====================================================
      LOGIN
      ===================================================== */

   if(path==="/api/login" && method==="POST"){

    const body=await request.json();

    const email=String(body.email||"").trim().toLowerCase();
    const password=String(body.password||"");

    const user=await getUserByEmail(db,email);

    if(!user){

     return json({
      ok:false,
      error:"ایمیل یا رمز عبور اشتباه است."
     },401);
    }


    if(user.status==="مسدود"){

     return json({
      ok:false,
      error:"حساب شما مسدود شده است."
     },403);
    }


    const hash=await hashPassword(password);

    if(hash!==user.password_hash){

     return json({
      ok:false,
      error:"ایمیل یا رمز عبور اشتباه است."
     },401);
    }


    const token=await createSession(db,user.id);

    return json({
     ok:true,
     token
    });
   }


   /* =====================================================
      ME
      ===================================================== */

   if(path==="/api/me" && method==="GET"){

    const user=await getUserFromRequest(db,request);

    if(!user){

     return json({
      ok:false,
      error:"وارد حساب شوید."
     },401);
    }


    const plan=await getPlan(db,user.id);

    return json({
     ok:true,
     user:{
      id:user.id,
      name:user.name,
      email:user.email,
      balance:Number(user.balance||0),
      status:user.status,
      plan
     }
    });
   }


   /* =====================================================
      PROFILE
      ===================================================== */

   if(path==="/api/profile" && method==="POST"){

    const user=await getUserFromRequest(db,request);

    if(!user){
     return json({ok:false,error:"ورود لازم است."},401);
    }


    const body=await request.json();
    const name=String(body.name||"").trim();

    if(!name){
     return json({ok:false,error:"نام نمی‌تواند خالی باشد."},400);
    }


    await db.prepare(
     "UPDATE users SET name=? WHERE id=?"
    ).bind(name,user.id).run();


    return json({
     ok:true,
     message:"اطلاعات ذخیره شد."
    });
   }


   /* =====================================================
      LOGOUT
      ===================================================== */

   if(path==="/api/logout" && method==="POST"){

    const auth=request.headers.get("Authorization")||"";

    if(auth.startsWith("Bearer ")){

     const token=auth.slice(7).trim();

     await db.prepare(
      "DELETE FROM sessions WHERE token=?"
     ).bind(token).run();
    }

    return json({ok:true});
   }


   /* =====================================================
      TRANSACTIONS
      ===================================================== */

   if(path==="/api/transactions" && method==="GET"){

    const user=await getUserFromRequest(db,request);

    if(!user){
     return json({ok:false,error:"ورود لازم است."},401);
    }


    const r=await db.prepare(`
     SELECT id,type,amount,description,created_at
     FROM transactions
     WHERE user_id=?
     ORDER BY id DESC
     LIMIT 100
    `).bind(user.id).all();


    return json({
     ok:true,
     transactions:r.results||[]
    });
   }


   /* =====================================================
      PAYMENT START
      ===================================================== */

   if(path==="/api/payment/start" && method==="POST"){

    const user=await getUserFromRequest(db,request);

    if(!user){
     return json({ok:false,error:"ورود لازم است."},401);
    }


    const body=await request.json();

    const amount=Number(body.amount||0);
    const methodName=String(body.method||"زرین‌پال");
    const planName=String(body.plan_name||"افزایش موجودی");

    if(!Number.isFinite(amount)||amount<10000){

     return json({
      ok:false,
      error:"مبلغ پرداخت نامعتبر است."
     },400);
    }


    const reference=
     "DEP-"+Date.now()+"-"+Math.floor(Math.random()*100000);


    await db.prepare(`
     INSERT INTO deposits
     (user_id,plan_name,amount_toman,method,reference,note,status)
     VALUES(?,?,?,?,?,?,'در انتظار')
    `).bind(
     user.id,
     planName,
     amount,
     methodName,
     reference,
     "درخواست پرداخت"
    ).run();


    const paymentUrl=env.PAYMENT_URL||"";

    if(paymentUrl){

     const target=
      paymentUrl+
      (paymentUrl.includes("?")?"&":"?")+
      "amount="+encodeURIComponent(amount)+
      "&reference="+encodeURIComponent(reference);

     return json({
      ok:true,
      url:target,
      reference
     });
    }


    return json({
     ok:true,
     reference,
     message:
      "درخواست پرداخت ثبت شد. برای اتصال پرداخت واقعی، درگاه پرداخت باید به Worker متصل شود."
    });
   }


   /* =====================================================
      WITHDRAW
      ===================================================== */

   if(path==="/api/withdraw" && method==="POST"){

    const user=await getUserFromRequest(db,request);

    if(!user){
     return json({ok:false,error:"ورود لازم است."},401);
    }


    const body=await request.json();

    const amount=Number(body.amount||0);
    const methodName=String(body.method||"بانک");
    const network=String(body.network||"TRC20");
    const address=String(body.address||"").trim();


    if(!Number.isFinite(amount)||amount<10000){

     return json({
      ok:false,
      error:"حداقل مبلغ برداشت ۱۰٬۰۰۰ تومان است."
     },400);
    }


    if(!address){

     return json({
      ok:false,
      error:"اطلاعات مقصد برداشت را وارد کنید."
     },400);
    }


    const fresh=await getUserById(db,user.id);
    const balance=Number(fresh?.balance||0);


    if(amount>balance){

     return json({
      ok:false,
      error:"موجودی حساب کافی نیست."
     },400);
    }


    /*
      موجودی هنگام ثبت برداشت رزرو/کم می‌شود.
    */

    await db.prepare(
     "UPDATE users SET balance=balance-? WHERE id=?"
    ).bind(amount,user.id).run();


    await db.prepare(`
     INSERT INTO withdrawals
     (user_id,amount,method,network,address,status)
     VALUES(?,?,?,?,?,'در انتظار')
    `).bind(
     user.id,
     amount,
     methodName,
     network,
     address
    ).run();


    await db.prepare(`
     INSERT INTO transactions
     (user_id,type,amount,description)
     VALUES(?,'برداشت',?,'درخواست برداشت')
    `).bind(user.id,-amount).run();


    return json({
     ok:true,
     message:"درخواست برداشت ثبت شد."
    });
   }


   /* =====================================================
      FORGOT
      ===================================================== */

   if(path==="/api/forgot" && method==="POST"){

    const body=await request.json();

    const email=String(body.email||"").trim().toLowerCase();

    const user=await getUserByEmail(db,email);

    /*
      برای جلوگیری از لو رفتن وجود ایمیل،
      پاسخ عمومی می‌دهیم.
    */

    if(!user){

     return json({
      ok:true,
      message:"اگر ایمیل وجود داشته باشد، کد بازیابی ایجاد می‌شود."
     });
    }


    const code=randomCode();
    const expires=Date.now()+15*60*1000;


    await db.prepare(`
     DELETE FROM reset_codes WHERE user_id=?
    `).bind(user.id).run();


    await db.prepare(`
     INSERT INTO reset_codes
     (user_id,code,expires_at)
     VALUES(?,?,?)
    `).bind(
     user.id,
     code,
     expires
    ).run();


    /*
      در نسخه بدون سرویس ایمیل، کد برای تست برگردانده می‌شود.
      بعداً می‌توان سرویس ارسال ایمیل اضافه کرد.
    */

    return json({
     ok:true,
     message:"کد بازیابی ایجاد شد.",
     code
    });
   }


   /* =====================================================
      RESET PASSWORD
      ===================================================== */

   if(path==="/api/reset" && method==="POST"){

    const body=await request.json();

    const email=String(body.email||"").trim().toLowerCase();
    const code=String(body.code||"").trim();
    const password=String(body.password||"");

    if(password.length<6){

     return json({
      ok:false,
      error:"رمز جدید باید حداقل ۶ کاراکتر باشد."
     },400);
    }


    const user=await getUserByEmail(db,email);

    if(!user){

     return json({
      ok:false,
      error:"کد یا ایمیل نامعتبر است."
     },400);
    }


    const row=await db.prepare(`
     SELECT *
     FROM reset_codes
     WHERE user_id=? AND code=?
     ORDER BY id DESC
     LIMIT 1
    `).bind(user.id,code).first();


    if(!row||Number(row.expires_at)<Date.now()){

     return json({
      ok:false,
      error:"کد بازیابی نامعتبر یا منقضی شده است."
     },400);
    }


    const hash=await hashPassword(password);


    await db.prepare(
     "UPDATE users SET password_hash=? WHERE id=?"
    ).bind(hash,user.id).run();


    await db.prepare(
     "DELETE FROM reset_codes WHERE user_id=?"
    ).bind(user.id).run();


    return json({
     ok:true,
     message:"رمز عبور با موفقیت تغییر کرد."
    });
   }


   /* =====================================================
      AI
      ===================================================== */

   if(path==="/api/ai" && method==="POST"){

    const user=await getUserFromRequest(db,request);

    if(!user){
     return json({ok:false,error:"ورود لازم است."},401);
    }


    const body=await request.json();

    const message=String(body.message||"").trim();

    if(!message){

     return json({
      ok:false,
      error:"پیام خالی است."
     },400);
    }


    const ai=getAI(env);

    if(!ai){

     return json({
      ok:false,
      error:"Workers AI متصل نیست. Binding هوش مصنوعی باید با نام AI متصل باشد."
     },500);
    }


    const result=await ai.run(
     "@cf/meta/llama-3.1-8b-instruct",
     {
      messages:[
       {
        role:"system",
        content:
        "تو یک دستیار هوش مصنوعی فارسی، مفید و دقیق هستی. پاسخ‌ها را به زبان فارسی و واضح ارائه کن."
       },
       {
        role:"user",
        content:message
       }
      ]
     }
    );


    let answer="";

    if(typeof result==="string"){
     answer=result;
    }else if(result?.response){
     answer=result.response;
    }else if(result?.result?.response){
     answer=result.result.response;
    }else{
     answer=JSON.stringify(result);
    }


    return json({
     ok:true,
     answer
    });
   }


   /* =====================================================
      ADMIN LOGIN
      ===================================================== */

   if(path==="/api/admin/login" && method==="POST"){

    const body=await request.json();

    const password=String(body.password||"");

    const adminPassword=env.ADMIN_PASSWORD;

    if(!adminPassword){

     return json({
      ok:false,
      error:"Secret به نام ADMIN_PASSWORD در Worker تنظیم نشده است."
     },500);
    }


    if(password!==adminPassword){

     return json({
      ok:false,
      error:"رمز مدیریت اشتباه است."
     },401);
    }


    const token=randomToken();


    await db.prepare(
     "INSERT INTO admin_sessions(token) VALUES(?)"
    ).bind(token).run();


    return json({
     ok:true,
     token
    });
   }


   /* =====================================================
      ADMIN STATS
      ===================================================== */

   if(path==="/api/admin/stats" && method==="GET"){

    const denied=await requireAdmin(db,request);

    if(denied)return denied;


    const users=await db.prepare(
     "SELECT COUNT(*) AS n FROM users"
    ).first();


    const payments=await db.prepare(
     "SELECT COUNT(*) AS n FROM deposits"
    ).first();


    const withdrawals=await db.prepare(
     "SELECT COUNT(*) AS n FROM withdrawals"
    ).first();


    const balance=await db.prepare(
     "SELECT COALESCE(SUM(balance),0) AS n FROM users"
    ).first();


    return json({
     ok:true,
     stats:{
      users:Number(users?.n||0),
      payments:Number(payments?.n||0),
      withdrawals:Number(withdrawals?.n||0),
      balance:Number(balance?.n||0)
     }
    });
   }


   /* =====================================================
      ADMIN USERS
      ===================================================== */

   if(path==="/api/admin/users" && method==="GET"){

    const denied=await requireAdmin(db,request);

    if(denied)return denied;


    const r=await db.prepare(`
     SELECT id,name,email,balance,status,created_at
     FROM users
     ORDER BY id DESC
     LIMIT 500
    `).all();


    return json({
     ok:true,
     users:r.results||[]
    });
   }


   /* =====================================================
      ADMIN USER BALANCE
      ===================================================== */

   if(path==="/api/admin/user/balance" && method==="POST"){

    const denied=await requireAdmin(db,request);

    if(denied)return denied;


    const body=await request.json();

    const userId=Number(body.user_id);
    const amount=Number(body.amount);


    if(!Number.isFinite(userId)||!Number.isFinite(amount)){

     return json({
      ok:false,
      error:"اطلاعات نامعتبر است."
     },400);
    }


    const user=await getUserById(db,userId);

    if(!user){

     return json({
      ok:false,
      error:"کاربر پیدا نشد."
     },404);
    }


    await db.prepare(
     "UPDATE users SET balance=balance+? WHERE id=?"
    ).bind(amount,userId).run();


    await db.prepare(`
     INSERT INTO transactions
     (user_id,type,amount,description)
     VALUES(?,'تغییر موجودی',?, 'تغییر توسط مدیر')
    `).bind(userId,amount).run();


    return json({ok:true});
   }


   /* =====================================================
      ADMIN USER STATUS
      ===================================================== */

   if(path==="/api/admin/user/status" && method==="POST"){

    const denied=await requireAdmin(db,request);

    if(denied)return denied;


    const body=await request.json();

    const userId=Number(body.user_id);
    const status=String(body.status||"فعال");


    await db.prepare(
     "UPDATE users SET status=? WHERE id=?"
    ).bind(status,userId).run();


    return json({ok:true});
   }


   /* =====================================================
      ADMIN PAYMENTS
      ===================================================== */

   if(path==="/api/admin/payments" && method==="GET"){

    const denied=await requireAdmin(db,request);

    if(denied)return denied;


    const r=await db.prepare(`
     SELECT *
     FROM deposits
     ORDER BY id DESC
     LIMIT 500
    `).all();


    const payments=r.results||[];


    /*
      frontend amount_toman می‌خواهد.
    */

    return json({
     ok:true,
     payments
    });
   }


   /* =====================================================
      ADMIN PAYMENT STATUS
      ===================================================== */

   if(path==="/api/admin/payment/status" && method==="POST"){

    const denied=await requireAdmin(db,request);

    if(denied)return denied;


    const body=await request.json();

    const id=Number(body.id);
    const status=String(body.status||"");


    const payment=await db.prepare(`
     SELECT *
     FROM deposits
     WHERE id=?
     LIMIT 1
    `).bind(id).first();


    if(!payment){

     return json({
      ok:false,
      error:"پرداخت پیدا نشد."
     },404);
    }


    /*
      فقط وقتی پرداخت برای اولین بار تأیید می‌شود
      موجودی افزایش پیدا می‌کند.
    */

    if(status==="موفق" && payment.status!=="موفق"){

     await db.prepare(`
      UPDATE deposits
      SET status=?
      WHERE id=?
     `).bind(status,id).run();


     await db.prepare(`
      UPDATE users
      SET balance=balance+?
      WHERE id=?
     `).bind(
      Number(payment.amount_toman),
      payment.user_id
     ).run();


     await db.prepare(`
      INSERT INTO transactions
      (user_id,type,amount,description)
      VALUES(?,'واریز',?,'تأیید پرداخت توسط مدیر')
     `).bind(
      payment.user_id,
      Number(payment.amount_toman)
     ).run();

    }else{

     await db.prepare(`
      UPDATE deposits
      SET status=?
      WHERE id=?
     `).bind(status,id).run();
    }


    return json({ok:true});
   }


   /* =====================================================
      ADMIN WITHDRAWALS
      ===================================================== */

   if(path==="/api/admin/withdrawals" && method==="GET"){

    const denied=await requireAdmin(db,request);

    if(denied)return denied;


    const r=await db.prepare(`
     SELECT *
     FROM withdrawals
     ORDER BY id DESC
     LIMIT 500
    `).all();


    return json({
     ok:true,
     withdrawals:r.results||[]
    });
   }


   /* =====================================================
      ADMIN WITHDRAWAL STATUS
      ===================================================== */

   if(path==="/api/admin/withdrawal/status" && method==="POST"){

    const denied=await requireAdmin(db,request);

    if(denied)return denied;


    const body=await request.json();

    const id=Number(body.id);
    const status=String(body.status||"");


    const withdrawal=await db.prepare(`
     SELECT *
     FROM withdrawals
     WHERE id=?
     LIMIT 1
    `).bind(id).first();


    if(!withdrawal){

     return json({
      ok:false,
      error:"درخواست برداشت پیدا نشد."
     },404);
    }


    /*
      اگر برداشت رد شود و قبلاً در انتظار بوده،
      مبلغ به موجودی کاربر برمی‌گردد.
    */

    if(status==="رد شده" && withdrawal.status==="در انتظار"){

     await db.prepare(`
      UPDATE users
      SET balance=balance+?
      WHERE id=?
     `).bind(
      Number(withdrawal.amount),
      withdrawal.user_id
     ).run();


     await db.prepare(`
      INSERT INTO transactions
      (user_id,type,amount,description)
      VALUES(?,'بازگشت برداشت',?,'برگشت مبلغ برداشت رد شده')
     `).bind(
      withdrawal.user_id,
      Number(withdrawal.amount)
     ).run();
    }


    await db.prepare(`
     UPDATE withdrawals
     SET status=?
     WHERE id=?
    `).bind(status,id).run();


    return json({ok:true});
   }


   /* ---------- 404 ---------- */

   return json({
    ok:false,
    error:"مسیر پیدا نشد."
   },404);


  }catch(error){

   return json({
    ok:false,
    error:"خطای داخلی سرور",
    detail:String(error?.message||error)
   },500);
  }
 }
};
