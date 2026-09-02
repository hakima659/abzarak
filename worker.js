
const HTML = `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#0f172a">
<title>دستیار هوش مصنوعی</title>

<style>
*{box-sizing:border-box}
html,body{margin:0;padding:0;font-family:Tahoma,Arial,sans-serif;background:#f1f5f9;color:#172033}
body{min-height:100vh}
button,input,select,textarea{font-family:inherit}
button{cursor:pointer}
.hidden{display:none!important}

.top{
  background:linear-gradient(135deg,#0f172a,#1e293b,#312e81);
  color:#fff;
  padding:24px 16px 55px;
}
.top-inner{max-width:1100px;margin:auto}
.brand{
  display:flex;align-items:center;justify-content:space-between;
  gap:15px
}
.brand h1{margin:0;font-size:25px}
.brand p{margin:7px 0 0;color:#cbd5e1;font-size:13px}
.robot{
  width:55px;height:55px;border-radius:18px;
  background:rgba(255,255,255,.13);
  display:flex;align-items:center;justify-content:center;
  font-size:30px
}

.container{
  max-width:1100px;
  margin:-30px auto 30px;
  padding:0 14px;
  position:relative
}

.card{
  background:#fff;
  border-radius:20px;
  padding:20px;
  margin-bottom:16px;
  box-shadow:0 10px 35px rgba(15,23,42,.08);
  border:1px solid #e2e8f0
}

.auth{
  max-width:470px;
  margin:auto
}
.auth h2{text-align:center;margin-top:0}
.subtitle{text-align:center;color:#64748b;font-size:13px}

.input{
  width:100%;
  padding:14px;
  border:1px solid #cbd5e1;
  border-radius:13px;
  outline:none;
  margin:7px 0 12px;
  font-size:14px;
  background:#fff
}
.input:focus{
  border-color:#6366f1;
  box-shadow:0 0 0 3px rgba(99,102,241,.12)
}

.btn{
  width:100%;
  border:0;
  border-radius:13px;
  padding:14px;
  font-weight:bold;
  font-size:14px;
  margin-top:7px
}
.btn-primary{
  color:#fff;
  background:linear-gradient(135deg,#4f46e5,#7c3aed)
}
.btn-success{
  color:#fff;
  background:linear-gradient(135deg,#059669,#10b981)
}
.btn-danger{
  color:#fff;
  background:linear-gradient(135deg,#dc2626,#ef4444)
}
.btn-dark{
  color:#fff;
  background:#0f172a
}
.btn-light{
  background:#eef2ff;
  color:#4338ca
}
.btn:disabled{opacity:.55;cursor:not-allowed}

.message{
  padding:12px 14px;
  border-radius:12px;
  margin:10px 0;
  font-size:13px;
  display:none
}
.message.ok{display:block;background:#dcfce7;color:#166534}
.message.err{display:block;background:#fee2e2;color:#991b1b}

.tabs{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:8px;
  margin-bottom:16px
}
.tab{
  border:0;
  padding:12px 6px;
  border-radius:12px;
  background:#e2e8f0;
  color:#334155;
  font-weight:bold
}
.tab.active{
  background:#4f46e5;
  color:#fff
}

.nav{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:9px;
  margin-bottom:16px
}
.nav button{
  border:0;
  padding:13px 6px;
  border-radius:13px;
  background:#fff;
  border:1px solid #e2e8f0;
  font-weight:bold;
  color:#334155
}
.nav button.active{
  background:#eef2ff;
  border-color:#818cf8;
  color:#4338ca
}

.grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:14px
}
@media(max-width:650px){
  .grid{grid-template-columns:1fr}
  .nav{grid-template-columns:repeat(2,1fr)}
}

.balance{
  background:linear-gradient(135deg,#4f46e5,#7c3aed);
  color:#fff;
  border-radius:20px;
  padding:24px;
  margin-bottom:16px
}
.balance .label{color:#ddd6fe;font-size:13px}
.balance .amount{font-size:32px;font-weight:bold;margin:9px 0}
.balance small{color:#ddd6fe}

.stat{
  padding:18px;
  border-radius:16px;
  background:#f8fafc;
  border:1px solid #e2e8f0
}
.stat .num{font-size:25px;font-weight:bold;margin-top:8px}

.plan{
  border:1px solid #e2e8f0;
  border-radius:18px;
  padding:18px;
  background:#fff;
  position:relative
}
.plan.popular{border:2px solid #6366f1}
.badge{
  position:absolute;
  top:12px;
  left:12px;
  background:#4f46e5;
  color:#fff;
  padding:5px 9px;
  border-radius:20px;
  font-size:10px
}
.plan h3{margin:0 0 10px}
.price{font-size:25px;font-weight:bold;color:#4338ca}
.plan ul{padding-right:18px;color:#64748b;font-size:13px;line-height:2}

.tx{
  display:flex;
  justify-content:space-between;
  gap:10px;
  padding:13px 0;
  border-bottom:1px solid #e2e8f0;
  font-size:13px
}
.tx:last-child{border-bottom:0}
.plus{color:#059669;font-weight:bold}
.minus{color:#dc2626;font-weight:bold}

.ai-box{
  background:#0f172a;
  color:#fff;
  border-radius:20px;
  padding:18px
}
.ai-messages{
  min-height:230px;
  max-height:450px;
  overflow:auto;
  margin-bottom:12px
}
.ai-msg{
  padding:12px;
  border-radius:14px;
  margin:8px 0;
  line-height:1.8;
  font-size:13px
}
.ai-user{background:#3730a3;margin-right:30px}
.ai-bot{background:#1e293b;margin-left:30px}
.ai-input{
  display:flex;
  gap:8px
}
.ai-input textarea{
  flex:1;
  min-height:52px;
  resize:none;
  border:1px solid #475569;
  border-radius:13px;
  padding:12px;
  background:#1e293b;
  color:#fff;
  outline:none
}
.ai-input button{
  width:80px;
  border:0;
  border-radius:13px;
  background:#6366f1;
  color:#fff;
  font-weight:bold
}

.admin-head{
  background:linear-gradient(135deg,#111827,#312e81);
  color:#fff;
  border-radius:20px;
  padding:20px;
  margin-bottom:15px
}
.admin-nav{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  margin:12px 0
}
.admin-nav button{
  border:0;
  padding:10px 13px;
  border-radius:10px;
  background:#e2e8f0
}
.admin-section{margin-top:15px}

.table-wrap{overflow:auto}
table{
  width:100%;
  border-collapse:collapse;
  min-width:650px
}
th,td{
  padding:11px;
  border-bottom:1px solid #e2e8f0;
  text-align:right;
  font-size:12px
}
th{background:#f8fafc}

.status{
  display:inline-block;
  padding:5px 9px;
  border-radius:20px;
  background:#f1f5f9;
  font-size:11px
}

.footer{
  text-align:center;
  color:#94a3b8;
  font-size:11px;
  padding:20px
}

.modal{
  position:fixed;
  inset:0;
  background:rgba(15,23,42,.6);
  display:flex;
  align-items:center;
  justify-content:center;
  padding:15px;
  z-index:100
}
.modal-box{
  background:#fff;
  width:100%;
  max-width:450px;
  border-radius:20px;
  padding:20px
}

.loading{
  text-align:center;
  padding:20px;
  color:#64748b
}
</style>
</head>

<body>

<header class="top">
  <div class="top-inner">
    <div class="brand">
      <div>
        <h1>🤖 دستیار هوش مصنوعی</h1>
        <p>دستیار هوشمند، حساب کاربری، درآمد و مدیریت</p>
      </div>
      <div class="robot">🤖</div>
    </div>
  </div>
</header>

<main class="container">

<!-- AUTH -->
<section id="authSection" class="card auth">

  <div class="tabs">
    <button id="loginTab" class="tab active" onclick="showAuth('login')">ورود</button>
    <button id="registerTab" class="tab" onclick="showAuth('register')">ثبت‌نام</button>
    <button id="forgotTab" class="tab" onclick="showAuth('forgot')">بازیابی</button>
  </div>

  <div id="loginBox">
    <h2>🔐 ورود به حساب</h2>
    <div class="subtitle">برای ورود اطلاعات خود را وارد کنید</div>

    <input id="loginEmail" class="input" type="email" placeholder="ایمیل">
    <input id="loginPassword" class="input" type="password" placeholder="رمز عبور">

    <div id="loginMsg" class="message"></div>

    <button class="btn btn-primary" onclick="login()">ورود به حساب</button>
    <button class="btn btn-light" onclick="showAuth('register')">ساخت حساب جدید</button>
  </div>

  <div id="registerBox" class="hidden">
    <h2>📝 ثبت‌نام</h2>
    <div class="subtitle">حساب کاربری خود را بسازید</div>

    <input id="regName" class="input" placeholder="نام و نام خانوادگی">
    <input id="regEmail" class="input" type="email" placeholder="ایمیل">
    <input id="regPassword" class="input" type="password" placeholder="رمز عبور">
    <input id="regPassword2" class="input" type="password" placeholder="تکرار رمز عبور">

    <div id="registerMsg" class="message"></div>

    <button class="btn btn-primary" onclick="register()">ثبت‌نام</button>
  </div>

  <div id="forgotBox" class="hidden">
    <h2>🔑 بازیابی رمز</h2>
    <div class="subtitle">ایمیل حساب خود را وارد کنید</div>

    <input id="forgotEmail" class="input" type="email" placeholder="ایمیل">

    <div id="forgotMsg" class="message"></div>

    <button class="btn btn-primary" onclick="forgotPassword()">دریافت کد بازیابی</button>

    <div id="resetBox" class="hidden">
      <input id="resetCode" class="input" placeholder="کد بازیابی">
      <input id="newPassword" class="input" type="password" placeholder="رمز عبور جدید">
      <button class="btn btn-success" onclick="resetPassword()">تغییر رمز</button>
    </div>
  </div>

  <hr style="border:0;border-top:1px solid #e2e8f0;margin:22px 0">

  <button class="btn btn-dark" onclick="showAdminLogin()">🛠️ ورود مدیریت</button>

</section>


<!-- USER -->
<section id="userSection" class="hidden">

  <div class="balance">
    <div class="label">💰 موجودی حساب</div>
    <div class="amount" id="balance">۰ تومان</div>
    <small>حداقل برداشت: ۱۰,۰۰۰ تومان</small>
  </div>

  <div class="nav">
    <button id="navHome" onclick="showPage('home')">🏠 خانه</button>
    <button id="navProfile" onclick="showPage('profile')">👤 حساب کاربری</button>
    <button id="navPlans" onclick="showPage('plans')">⭐ پلن‌ها</button>
    <button id="navDeposit" onclick="showPage('deposit')">💳 افزایش موجودی</button>
    <button id="navWithdraw" onclick="showPage('withdraw')">💸 برداشت</button>
    <button id="navTransactions" onclick="showPage('transactions')">📊 تراکنش‌ها</button>
    <button onclick="logout()">🚪 خروج</button>
  </div>

  <!-- HOME -->
  <div id="pageHome" class="page">

    <div class="card">
      <h2>👋 خوش آمدید <span id="welcomeName"></span></h2>
      <p style="color:#64748b;font-size:13px">
        به پنل دستیار هوش مصنوعی خوش آمدید.
      </p>
    </div>

    <div class="grid">
      <div class="stat">
        <div>💰 موجودی</div>
        <div class="num" id="homeBalance">۰</div>
      </div>
      <div class="stat">
        <div>⭐ پلن</div>
        <div class="num" id="userPlan">رایگان</div>
      </div>
    </div>

    <div class="card">
      <h3>🤖 گفت‌وگو با هوش مصنوعی</h3>

      <div class="ai-box">
        <div id="aiMessages" class="ai-messages">
          <div class="ai-msg ai-bot">
            سلام 👋 من دستیار هوش مصنوعی هستم. چطور می‌توانم کمکتان کنم؟
          </div>
        </div>

        <div class="ai-input">
          <textarea id="aiInput" placeholder="پیام خود را بنویسید..."></textarea>
          <button onclick="sendAI()">ارسال</button>
        </div>
      </div>
    </div>

  </div>


  <!-- PROFILE -->
  <div id="pageProfile" class="page hidden">

    <div class="card">
      <h2>👤 حساب کاربری</h2>

      <label>نام</label>
      <input id="profileName" class="input">

      <label>ایمیل</label>
      <input id="profileEmail" class="input" type="email">

      <div id="profileMsg" class="message"></div>

      <button class="btn btn-primary" onclick="saveProfile()">ذخیره اطلاعات</button>
    </div>

  </div>


  <!-- PLANS -->
  <div id="pagePlans" class="page hidden">

    <div class="card">
      <h2>⭐ پلن‌های اشتراک</h2>
      <p style="color:#64748b;font-size:13px">
        برای استفاده بیشتر می‌توانید یکی از پلن‌ها را انتخاب کنید.
      </p>

      <div class="grid">

        <div class="plan">
          <h3>🆓 رایگان</h3>
          <div class="price">۰ تومان</div>
          <ul>
            <li>دسترسی پایه</li>
            <li>امکانات عمومی</li>
            <li>بدون هزینه</li>
          </ul>
          <button class="btn btn-light" disabled>پلن فعلی</button>
        </div>

        <div class="plan popular">
          <span class="badge">محبوب</span>
          <h3>🚀 حرفه‌ای</h3>
          <div class="price">۴۹۹,۰۰۰ تومان</div>
          <ul>
            <li>استفاده بیشتر از هوش مصنوعی</li>
            <li>امکانات حرفه‌ای</li>
            <li>پشتیبانی بهتر</li>
          </ul>
          <button class="btn btn-primary" onclick="startPayment('حرفه‌ای',499000)">
            انتخاب پلن
          </button>
        </div>

        <div class="plan">
          <h3>👑 ویژه</h3>
          <div class="price">۹۹۹,۰۰۰ تومان</div>
          <ul>
            <li>امکانات کامل</li>
            <li>سقف استفاده بالاتر</li>
            <li>اولویت خدمات</li>
          </ul>
          <button class="btn btn-success" onclick="startPayment('ویژه',999000)">
            انتخاب پلن
          </button>
        </div>

      </div>
    </div>

  </div>


  <!-- DEPOSIT -->
  <div id="pageDeposit" class="page hidden">

    <div class="card">
      <h2>💳 افزایش موجودی</h2>

      <label>مبلغ</label>
      <select id="depositAmount" class="input">
        <option value="100000">۱۰۰,۰۰۰ تومان</option>
        <option value="300000">۳۰۰,۰۰۰ تومان</option>
        <option value="500000">۵۰۰,۰۰۰ تومان</option>
        <option value="1000000">۱,۰۰۰,۰۰۰ تومان</option>
        <option value="3000000">۳,۰۰۰,۰۰۰ تومان</option>
        <option value="5000000">۵,۰۰۰,۰۰۰ تومان</option>
        <option value="10000000">۱۰,۰۰۰,۰۰۰ تومان</option>
      </select>

      <div id="depositMsg" class="message"></div>

      <button class="btn btn-primary" onclick="deposit()">
        💳 ادامه پرداخت
      </button>

      <p style="font-size:11px;color:#94a3b8">
        اتصال مستقیم درگاه پرداخت پس از قرار دادن اطلاعات درگاه فعال می‌شود.
      </p>
    </div>

  </div>


  <!-- WITHDRAW -->
  <div id="pageWithdraw" class="page hidden">

    <div class="card">
      <h2>💸 درخواست برداشت</h2>

      <label>مبلغ برداشت</label>
      <input id="withdrawAmount" class="input" type="number" placeholder="مثلاً ۱۰۰۰۰۰">

      <label>روش برداشت</label>
      <select id="withdrawMethod" class="input">
        <option value="بانکی">حساب بانکی</option>
        <option value="USDT">USDT</option>
      </select>

      <label>شبکه</label>
      <select id="withdrawNetwork" class="input">
        <option value="TRC20">TRC20</option>
        <option value="BEP20">BEP20</option>
        <option value="ERC20">ERC20</option>
      </select>

      <label>شماره کارت / شبا / آدرس کیف پول</label>
      <input id="withdrawAddress" class="input" placeholder="اطلاعات دریافت">

      <div id="withdrawMsg" class="message"></div>

      <button class="btn btn-success" onclick="withdrawMoney()">
        ثبت درخواست برداشت
      </button>
    </div>

  </div>


  <!-- TRANSACTIONS -->
  <div id="pageTransactions" class="page hidden">

    <div class="card">
      <h2>📊 تراکنش‌ها</h2>
      <div id="transactions">
        <div class="loading">در حال دریافت...</div>
      </div>
    </div>

  </div>

</section>


<!-- ADMIN LOGIN -->
<div id="adminLoginModal" class="modal hidden">

  <div class="modal-box">

    <h2>🛠️ ورود مدیریت</h2>
    <p class="subtitle">ورود به پنل مدیریت سایت</p>

    <input id="adminPassword" class="input" type="password" placeholder="رمز مدیریت">

    <div id="adminLoginMsg" class="message"></div>

    <button class="btn btn-primary" onclick="adminLogin()">
      🔐 ورود مدیر
    </button>

    <button class="btn btn-light" onclick="closeAdminLogin()">
      بستن
    </button>

  </div>
</div>


<!-- ADMIN -->
<section id="adminSection" class="hidden">

  <div class="admin-head">
    <h2 style="margin:0">🛠️ پنل مدیریت</h2>
    <p style="color:#cbd5e1;font-size:13px">
      مدیریت کاربران، پرداخت‌ها، برداشت‌ها و موجودی
    </p>

    <div class="admin-nav">
      <button onclick="adminPage('stats')">📊 آمار</button>
      <button onclick="adminPage('users')">👥 کاربران</button>
      <button onclick="adminPage('payments')">💳 پرداخت‌ها</button>
      <button onclick="adminPage('withdrawals')">💸 برداشت‌ها</button>
      <button onclick="adminLogout()">🚪 خروج مدیر</button>
    </div>
  </div>

  <div id="adminContent" class="card">
    <div class="loading">در حال دریافت اطلاعات...</div>
  </div>

</section>


<div class="footer">
  🤖 دستیار هوش مصنوعی • نسخه حرفه‌ای
</div>


<script>
const $ = id => document.getElementById(id);

let token = localStorage.getItem("token") || "";
let adminToken = localStorage.getItem("admin_token") || "";

function msg(id,text,ok=false){
  const el=$(id);
  if(!el)return;
  el.textContent=text;
  el.className="message " + (ok ? "ok":"err");
}

function clearMsg(id){
  const el=$(id);
  if(el){
    el.textContent="";
    el.className="message";
  }
}

function showAuth(type){

  ["loginBox","registerBox","forgotBox"].forEach(x=>$(x).classList.add("hidden"));

  ["loginTab","registerTab","forgotTab"].forEach(x=>$(x).classList.remove("active"));

  if(type==="login"){
    $("loginBox").classList.remove("hidden");
    $("loginTab").classList.add("active");
  }

  if(type==="register"){
    $("registerBox").classList.remove("hidden");
    $("registerTab").classList.add("active");
  }

  if(type==="forgot"){
    $("forgotBox").classList.remove("hidden");
    $("forgotTab").classList.add("active");
  }
}

async function request(url,options={}){
  options.headers=options.headers||{};
  options.headers["Content-Type"]="application/json";

  if(token){
    options.headers["Authorization"]="Bearer "+token;
  }

  const r=await fetch(url,options);
  const text=await r.text();

  let data;
  try{
    data=JSON.parse(text);
  }catch(e){
    throw new Error("پاسخ نامعتبر از سرور: "+text.slice(0,150));
  }

  if(!r.ok || data.ok===false){
    throw new Error(data.error || data.message || "خطای سرور");
  }

  return data;
}

async function register(){

  clearMsg("registerMsg");

  const name=$("regName").value.trim();
  const email=$("regEmail").value.trim();
  const password=$("regPassword").value;
  const password2=$("regPassword2").value;

  if(!name || !email || !password){
    msg("registerMsg","لطفاً همه اطلاعات را وارد کنید.");
    return;
  }

  if(password.length<6){
    msg("registerMsg","رمز عبور باید حداقل ۶ کاراکتر باشد.");
    return;
  }

  if(password!==password2){
    msg("registerMsg","تکرار رمز عبور صحیح نیست.");
    return;
  }

  try{

    const data=await request("/api/register",{
      method:"POST",
      body:JSON.stringify({name,email,password})
    });

    token=data.token||"";
    if(token)localStorage.setItem("token",token);

    msg("registerMsg","ثبت‌نام با موفقیت انجام شد.",true);

    setTimeout(loadMe,500);

  }catch(e){
    msg("registerMsg",e.message);
  }
}

async function login(){

  clearMsg("loginMsg");

  const email=$("loginEmail").value.trim();
  const password=$("loginPassword").value;

  if(!email || !password){
    msg("loginMsg","ایمیل و رمز عبور را وارد کنید.");
    return;
  }

  try{

    const data=await request("/api/login",{
      method:"POST",
      body:JSON.stringify({email,password})
    });

    token=data.token||"";

    localStorage.setItem("token",token);

    loadMe();

  }catch(e){
    msg("loginMsg",e.message);
  }
}

async function loadMe(){

  if(!token){
    $("authSection").classList.remove("hidden");
    $("userSection").classList.add("hidden");
    return;
  }

  try{

    const data=await request("/api/me");

    $("authSection").classList.add("hidden");
    $("userSection").classList.remove("hidden");

    fillUser(data.user || data);

    showPage("home");

  }catch(e){

    localStorage.removeItem("token");
    token="";

    $("authSection").classList.remove("hidden");
    $("userSection").classList.add("hidden");
  }
}

function fillUser(u){

  $("welcomeName").textContent=u.name ? "، "+u.name : "";

  const balance=Number(u.balance||0);

  $("balance").textContent=formatMoney(balance)+" تومان";
  $("homeBalance").textContent=formatMoney(balance)+" تومان";

  $("profileName").value=u.name||"";
  $("profileEmail").value=u.email||"";

  $("userPlan").textContent=u.plan||"رایگان";
}

function formatMoney(n){
  return Number(n||0).toLocaleString("fa-IR");
}

function showPage(page){

  document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));

  const target=$("page"+page.charAt(0).toUpperCase()+page.slice(1));

  if(target)target.classList.remove("hidden");

  document.querySelectorAll(".nav button").forEach(x=>x.classList.remove("active"));

  const map={
    home:"navHome",
    profile:"navProfile",
    plans:"navPlans",
    deposit:"navDeposit",
    withdraw:"navWithdraw",
    transactions:"navTransactions"
  };

  if(map[page] && $(map[page]))$(map[page]).classList.add("active");

  if(page==="transactions")loadTransactions();
}

async function saveProfile(){

  clearMsg("profileMsg");

  try{

    const data=await request("/api/profile",{
      method:"POST",
      body:JSON.stringify({
        name:$("profileName").value.trim(),
        email:$("profileEmail").value.trim()
      })
    });

    msg("profileMsg","اطلاعات با موفقیت ذخیره شد.",true);

    if(data.user)fillUser(data.user);

  }catch(e){
    msg("profileMsg",e.message);
  }
}

async function deposit(){

  clearMsg("depositMsg");

  const amount=Number($("depositAmount").value);

  try{

    const data=await request("/api/payment/start",{
      method:"POST",
      body:JSON.stringify({
        amount,
        plan:"افزایش موجودی"
      })
    });

    msg("depositMsg",data.message||"درخواست پرداخت ثبت شد.",true);

    if(data.payment_url){
      setTimeout(()=>location.href=data.payment_url,700);
    }

  }catch(e){
    msg("depositMsg",e.message);
  }
}

async function startPayment(plan,amount){

  try{

    const data=await request("/api/payment/start",{
      method:"POST",
      body:JSON.stringify({plan,amount})
    });

    if(data.payment_url){
      location.href=data.payment_url;
      return;
    }

    alert(data.message||"درخواست ثبت شد.");

  }catch(e){
    alert(e.message);
  }
}

async function withdrawMoney(){

  clearMsg("withdrawMsg");

  const amount=Number($("withdrawAmount").value);
  const method=$("withdrawMethod").value;
  const network=$("withdrawNetwork").value;
  const address=$("withdrawAddress").value.trim();

  if(!amount || amount<10000){
    msg("withdrawMsg","حداقل مبلغ برداشت ۱۰,۰۰۰ تومان است.");
    return;
  }

  if(!address){
    msg("withdrawMsg","اطلاعات دریافت را وارد کنید.");
    return;
  }

  try{

    const data=await request("/api/withdraw",{
      method:"POST",
      body:JSON.stringify({amount,method,network,address})
    });

    msg("withdrawMsg",data.message||"درخواست برداشت ثبت شد.",true);

    $("withdrawAmount").value="";
    $("withdrawAddress").value="";

    await loadMe();

  }catch(e){
    msg("withdrawMsg",e.message);
  }
}

async function loadTransactions(){

  $("transactions").innerHTML='<div class="loading">در حال دریافت...</div>';

  try{

    const data=await request("/api/transactions");

    const rows=data.transactions||[];

    if(!rows.length){
      $("transactions").innerHTML='<div class="loading">هنوز تراکنشی ثبت نشده است.</div>';
      return;
    }

    $("transactions").innerHTML=rows.map(t=>{

      const amount=Number(t.amount||0);
      const positive=amount>=0;

      return \`
        <div class="tx">
          <div>
            <b>\${escapeHtml(t.description||t.type||"تراکنش")}</b>
            <div style="color:#94a3b8;margin-top:5px">
              \${escapeHtml(t.created_at||"")}
            </div>
          </div>
          <div class="\${positive?'plus':'minus'}">
            \${positive?"+":""}\${formatMoney(amount)} تومان
          </div>
        </div>
      \`;

    }).join("");

  }catch(e){

    $("transactions").innerHTML=
      '<div class="message err" style="display:block">'+escapeHtml(e.message)+'</div>';
  }
}

async function sendAI(){

  const input=$("aiInput");
  const text=input.value.trim();

  if(!text)return;

  const box=$("aiMessages");

  box.innerHTML+=\`
    <div class="ai-msg ai-user">\${escapeHtml(text)}</div>
  \`;

  input.value="";

  box.innerHTML+=\`
    <div id="aiLoading" class="ai-msg ai-bot">⏳ در حال فکر کردن...</div>
  \`;

  box.scrollTop=box.scrollHeight;

  try{

    const data=await request("/api/ai",{
      method:"POST",
      body:JSON.stringify({message:text})
    });

    const loading=$("aiLoading");
    if(loading)loading.remove();

    box.innerHTML+=\`
      <div class="ai-msg ai-bot">\${escapeHtml(data.answer||"پاسخی دریافت نشد.")}</div>
    \`;

  }catch(e){

    const loading=$("aiLoading");
    if(loading)loading.remove();

    box.innerHTML+=\`
      <div class="ai-msg ai-bot">❌ \${escapeHtml(e.message)}</div>
    \`;
  }

  box.scrollTop=box.scrollHeight;
}

$("aiInput").addEventListener("keydown",function(e){
  if(e.key==="Enter" && !e.shiftKey){
    e.preventDefault();
    sendAI();
  }
});

async function forgotPassword(){

  clearMsg("forgotMsg");

  const email=$("forgotEmail").value.trim();

  if(!email){
    msg("forgotMsg","ایمیل را وارد کنید.");
    return;
  }

  try{

    const data=await request("/api/forgot-password",{
      method:"POST",
      body:JSON.stringify({email})
    });

    msg("forgotMsg",data.message||"کد ارسال شد.",true);

    if(data.development_code){
      msg("forgotMsg","کد بازیابی: "+data.development_code,true);
    }

    $("resetBox").classList.remove("hidden");

  }catch(e){
    msg("forgotMsg",e.message);
  }
}

async function resetPassword(){

  const email=$("forgotEmail").value.trim();
  const code=$("resetCode").value.trim();
  const password=$("newPassword").value;

  try{

    const data=await request("/api/reset-password",{
      method:"POST",
      body:JSON.stringify({email,code,password})
    });

    msg("forgotMsg",data.message||"رمز تغییر کرد.",true);

  }catch(e){
    msg("forgotMsg",e.message);
  }
}

function logout(){

  fetch("/api/logout",{
    method:"POST",
    headers:{Authorization:"Bearer "+token}
  }).catch(()=>{});

  localStorage.removeItem("token");
  token="";

  $("userSection").classList.add("hidden");
  $("adminSection").classList.add("hidden");
  $("authSection").classList.remove("hidden");

  showAuth("login");
}

function showAdminLogin(){
  $("adminLoginModal").classList.remove("hidden");
  $("adminPassword").focus();
}

function closeAdminLogin(){
  $("adminLoginModal").classList.add("hidden");
}

async function adminLogin(){

  clearMsg("adminLoginMsg");

  const password=$("adminPassword").value;

  if(!password){
    msg("adminLoginMsg","رمز مدیریت را وارد کنید.");
    return;
  }

  try{

    const r=await fetch("/api/admin/login",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({password})
    });

    const text=await r.text();

    let data;

    try{
      data=JSON.parse(text);
    }catch(e){
      throw new Error("پاسخ سرور نامعتبر است.");
    }

    if(!r.ok || data.ok===false){
      throw new Error(data.error||"ورود مدیر انجام نشد.");
    }

    adminToken=data.token;

    localStorage.setItem("admin_token",adminToken);

    closeAdminLogin();

    $("authSection").classList.add("hidden");
    $("userSection").classList.add("hidden");
    $("adminSection").classList.remove("hidden");

    await adminPage("stats");

  }catch(e){

    msg("adminLoginMsg",e.message);
  }
}

async function adminRequest(url,options={}){

  options.headers=options.headers||{};
  options.headers["Content-Type"]="application/json";
  options.headers["Authorization"]="Admin "+adminToken;

  const r=await fetch(url,options);
  const text=await r.text();

  let data;

  try{
    data=JSON.parse(text);
  }catch(e){
    throw new Error("پاسخ نامعتبر مدیر");
  }

  if(!r.ok || data.ok===false){
    throw new Error(data.error||"دسترسی رد شد");
  }

  return data;
}

async function adminPage(page){

  if(!adminToken)return;

  $("adminContent").innerHTML='<div class="loading">⏳ در حال دریافت اطلاعات...</div>';

  try{

    if(page==="stats")await adminStats();
    if(page==="users")await adminUsers();
    if(page==="payments")await adminPayments();
    if(page==="withdrawals")await adminWithdrawals();

  }catch(e){

    $("adminContent").innerHTML=
      '<div class="message err" style="display:block">'+escapeHtml(e.message)+'</div>';
  }
}

async function adminStats(){

  const data=await adminRequest("/api/admin/stats");
  const s=data.stats||data;

  $("adminContent").innerHTML=\`
    <h2>📊 آمار سایت</h2>

    <div class="grid">

      <div class="stat">
        <div>👥 تعداد کاربران</div>
        <div class="num">\${formatMoney(s.users||0)}</div>
      </div>

      <div class="stat">
        <div>💰 مجموع موجودی</div>
        <div class="num">\${formatMoney(s.balance||0)}</div>
      </div>

      <div class="stat">
        <div>💸 برداشت‌های در انتظار</div>
        <div class="num">\${formatMoney(s.pending_withdrawals||0)}</div>
      </div>

      <div class="stat">
        <div>💳 پرداخت‌های در انتظار</div>
        <div class="num">\${formatMoney(s.pending_deposits||0)}</div>
      </div>

    </div>
  \`;
}

async function adminUsers(){

  const data=await adminRequest("/api/admin/users");
  const users=data.users||[];

  let html=\`
    <h2>👥 کاربران</h2>
    <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>نام</th>
          <th>ایمیل</th>
          <th>موجودی</th>
          <th>پلن</th>
          <th>وضعیت</th>
          <th>مدیریت</th>
        </tr>
      </thead>
      <tbody>
  \`;

  users.forEach(u=>{

    html+=\`
      <tr>
        <td>\${u.id}</td>
        <td>\${escapeHtml(u.name||"")}</td>
        <td>\${escapeHtml(u.email||"")}</td>
        <td>\${formatMoney(u.balance||0)}</td>
        <td>\${escapeHtml(u.plan||"رایگان")}</td>
        <td><span class="status">\${escapeHtml(u.status||"")}</span></td>
        <td>
          <button class="btn btn-light" style="width:auto;padding:8px" onclick="toggleUser(\${u.id},'\${u.status}')">
            تغییر وضعیت
          </button>
          <button class="btn btn-success" style="width:auto;padding:8px" onclick="changeBalance(\${u.id})">
            موجودی
          </button>
        </td>
      </tr>
    \`;
  });

  html+=\`
      </tbody>
    </table>
    </div>
  \`;

  $("adminContent").innerHTML=html;
}

async function toggleUser(id,status){

  const newStatus=(status==="مسدود" || status==="blocked") ? "فعال" : "مسدود";

  if(!confirm("وضعیت کاربر تغییر کند؟"))return;

  try{

    await adminRequest("/api/admin/user-status",{
      method:"POST",
      body:JSON.stringify({id,status:newStatus})
    });

    adminUsers();

  }catch(e){
    alert(e.message);
  }
}

async function changeBalance(id){

  const amount=prompt("مبلغ تغییر موجودی را وارد کنید. برای کسر عدد منفی بنویسید:");

  if(amount===null)return;

  const n=Number(amount);

  if(!Number.isFinite(n)){
    alert("مبلغ نامعتبر است.");
    return;
  }

  try{

    await adminRequest("/api/admin/balance",{
      method:"POST",
      body:JSON.stringify({id,amount:n})
    });

    alert("موجودی تغییر کرد.");
    adminUsers();

  }catch(e){
    alert(e.message);
  }
}

async function adminPayments(){

  const data=await adminRequest("/api/admin/payments");
  const rows=data.payments||[];

  let html=\`
    <h2>💳 پرداخت‌ها</h2>
    <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>کاربر</th>
          <th>پلن</th>
          <th>مبلغ</th>
          <th>روش</th>
          <th>وضعیت</th>
          <th>تاریخ</th>
        </tr>
      </thead>
      <tbody>
  \`;

  rows.forEach(x=>{

    const amount=x.amount_toman ?? x.amount ?? 0;

    html+=\`
      <tr>
        <td>\${x.id}</td>
        <td>\${escapeHtml(x.username||x.email||String(x.user_id||""))}</td>
        <td>\${escapeHtml(x.plan_name||x.plan||"")}</td>
        <td>\${formatMoney(amount)} تومان</td>
        <td>\${escapeHtml(x.method||"")}</td>
        <td><span class="status">\${escapeHtml(x.status||"")}</span></td>
        <td>\${escapeHtml(x.created_at||"")}</td>
      </tr>
    \`;
  });

  html+=\`</tbody></table></div>\`;

  $("adminContent").innerHTML=html;
}

async function adminWithdrawals(){

  const data=await adminRequest("/api/admin/withdrawals");
  const rows=data.withdrawals||[];

  let html=\`
    <h2>💸 درخواست‌های برداشت</h2>
    <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>کاربر</th>
          <th>مبلغ</th>
          <th>روش</th>
          <th>شبکه</th>
          <th>آدرس</th>
          <th>وضعیت</th>
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
  \`;

  rows.forEach(x=>{

    html+=\`
      <tr>
        <td>\${x.id}</td>
        <td>\${escapeHtml(x.username||String(x.user_id||""))}</td>
        <td>\${formatMoney(x.amount||0)} تومان</td>
        <td>\${escapeHtml(x.method||"")}</td>
        <td>\${escapeHtml(x.network||"")}</td>
        <td style="direction:ltr">\${escapeHtml(x.address||"")}</td>
        <td><span class="status">\${escapeHtml(x.status||"")}</span></td>
        <td>
          <button class="btn btn-success" style="width:auto;padding:7px" onclick="withdrawStatus(\${x.id},'approved')">
            تأیید
          </button>
          <button class="btn btn-danger" style="width:auto;padding:7px" onclick="withdrawStatus(\${x.id},'rejected')">
            رد
          </button>
        </td>
      </tr>
    \`;
  });

  html+=\`</tbody></table></div>\`;

  $("adminContent").innerHTML=html;
}

async function withdrawStatus(id,status){

  if(!confirm(status==="approved" ? "برداشت تأیید شود؟" : "برداشت رد شود؟"))return;

  try{

    await adminRequest("/api/admin/withdrawal-status",{
      method:"POST",
      body:JSON.stringify({id,status})
    });

    adminWithdrawals();

  }catch(e){
    alert(e.message);
  }
}

function adminLogout(){

  localStorage.removeItem("admin_token");
  adminToken="";

  $("adminSection").classList.add("hidden");
  $("authSection").classList.remove("hidden");

  showAuth("login");
}

function escapeHtml(v){

  return String(v??"")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

window.addEventListener("load",async()=>{

  await loadMe();

  if(adminToken){

    try{

      $("authSection").classList.add("hidden");
      $("userSection").classList.add("hidden");
      $("adminSection").classList.remove("hidden");

      await adminPage("stats");

    }catch(e){

      localStorage.removeItem("admin_token");
      adminToken="";
      $("adminSection").classList.add("hidden");

      if(!token){
        $("authSection").classList.remove("hidden");
      }
    }
  }
});

window.addEventListener("error",function(e){
  console.error(e.error||e.message);
});

</script>
</main>
</body>
</html>`;


/* =========================
   HELPERS
========================= */

const json = (data,status=200) => new Response(
  JSON.stringify(data),
  {
    status,
    headers:{
      "Content-Type":"application/json; charset=UTF-8",
      "Cache-Control":"no-store",
      "Access-Control-Allow-Origin":"*"
    }
  }
);

const htmlResponse = () => new Response(HTML,{
  headers:{
    "Content-Type":"text/html; charset=UTF-8",
    "Cache-Control":"no-store, no-cache, must-revalidate"
  }
});

function hashPassword(password){
  // سازگار و ساده برای Worker
  let h=2166136261;
  const s=String(password);
  for(let i=0;i<s.length;i++){
    h^=s.charCodeAt(i);
    h=Math.imul(h,16777619);
  }
  return (h>>>0).toString(16);
}

function randomToken(){
  const a=new Uint8Array(32);
  crypto.getRandomValues(a);
  return Array.from(a,x=>x.toString(16).padStart(2,"0")).join("");
}

function randomCode(){
  return String(Math.floor(100000+Math.random()*900000));
}

async function tableExists(db,name){
  const r=await db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name=?"
  ).bind(name).first();
  return !!r;
}

async function columns(db,table){

  const r=await db.prepare(
    "PRAGMA table_info("+table+")"
  ).all();

  return new Set((r.results||[]).map(x=>x.name));
}

async function initDB(db){

  /*
   * مهم:
   * این قسمت جدول‌های موجود را حذف یا تغییر نمی‌دهد.
   */

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT,
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
      token TEXT NOT NULL UNIQUE,
      expires_at INTEGER NOT NULL,
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
      user_id INTEGER,
      username TEXT,
      plan TEXT,
      plan_name TEXT,
      price REAL DEFAULT 0,
      status TEXT DEFAULT 'در انتظار',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}


/* =========================
   USER
========================= */

async function getUserById(db,id){

  return await db.prepare(
    "SELECT * FROM users WHERE id=?"
  ).bind(id).first();
}

async function getUserByEmail(db,email){

  return await db.prepare(
    "SELECT * FROM users WHERE email=?"
  ).bind(email).first();
}

async function createSession(db,userId){

  const token=randomToken();

  await db.prepare(
    "INSERT INTO sessions(token,user_id) VALUES(?,?)"
  ).bind(token,userId).run();

  return token;
}

async function getUserFromRequest(request,db){

  const auth=request.headers.get("Authorization")||"";

  if(!auth.startsWith("Bearer "))return null;

  const token=auth.slice(7).trim();

  if(!token)return null;

  const s=await db.prepare(
    "SELECT user_id FROM sessions WHERE token=?"
  ).bind(token).first();

  if(!s)return null;

  return await getUserById(db,s.user_id);
}

async function getPlan(db,user){

  if(!user)return "رایگان";

  if(await tableExists(db,"subscriptions")){

    const c=await columns(db,"subscriptions");

    let row=null;

    if(c.has("user_id")){

      row=await db.prepare(`
        SELECT * FROM subscriptions
        WHERE user_id=?
        ORDER BY id DESC LIMIT 1
      `).bind(user.id).first();

    }else if(c.has("username") && user.username){

      row=await db.prepare(`
        SELECT * FROM subscriptions
        WHERE username=?
        ORDER BY id DESC LIMIT 1
      `).bind(user.username).first();
    }

    if(row){

      const status=String(row.status||"").toLowerCase();

      if(
        status==="فعال" ||
        status==="active" ||
        status==="تأیید شده" ||
        status==="approved"
      ){

        return row.plan_name||row.plan||"رایگان";
      }
    }
  }

  return user.plan||"رایگان";
}


/* =========================
   REGISTER
========================= */

async function register(request,env){

  const db=env.DB;
  const body=await request.json();

  const name=String(body.name||"").trim();
  const email=String(body.email||"").trim().toLowerCase();
  const password=String(body.password||"");

  if(!name || !email || !password){
    return json({ok:false,error:"همه اطلاعات را وارد کنید."},400);
  }

  if(password.length<6){
    return json({ok:false,error:"رمز عبور باید حداقل ۶ کاراکتر باشد."},400);
  }

  const old=await getUserByEmail(db,email);

  if(old){
    return json({ok:false,error:"این ایمیل قبلاً ثبت شده است."},400);
  }

  const c=await columns(db,"users");

  let username=null;

  if(c.has("username")){
    username="user_"+Date.now().toString(36);
  }

  let sql;
  let values;

  if(c.has("username")){

    sql=`
      INSERT INTO users
      (username,name,email,password_hash,balance,status)
      VALUES(?,?,?,?,?,?)
    `;

    values=[
      username,
      name,
      email,
      hashPassword(password),
      0,
      "فعال"
    ];

  }else{

    sql=`
      INSERT INTO users
      (name,email,password_hash,balance,status)
      VALUES(?,?,?,?,?)
    `;

    values=[
      name,
      email,
      hashPassword(password),
      0,
      "فعال"
    ];
  }

  const result=await db.prepare(sql).bind(...values).run();

  const user=await getUserById(db,result.meta.last_row_id);

  const token=await createSession(db,user.id);

  return json({
    ok:true,
    token,
    user:{
      ...user,
      plan:"رایگان"
    }
  });
}


/* =========================
   LOGIN
========================= */

async function login(request,env){

  const db=env.DB;
  const body=await request.json();

  const email=String(body.email||"").trim().toLowerCase();
  const password=String(body.password||"");

  const user=await getUserByEmail(db,email);

  if(!user || user.password_hash!==hashPassword(password)){
    return json({ok:false,error:"ایمیل یا رمز عبور اشتباه است."},401);
  }

  if(
    user.status==="مسدود" ||
    user.status==="blocked"
  ){
    return json({ok:false,error:"حساب شما مسدود شده است."},403);
  }

  const token=await createSession(db,user.id);
  const plan=await getPlan(db,user);

  return json({
    ok:true,
    token,
    user:{
      ...user,
      plan
    }
  });
}


/* =========================
   ME
========================= */

async function me(request,env){

  const user=await getUserFromRequest(request,env.DB);

  if(!user){
    return json({ok:false,error:"وارد حساب نشده‌اید."},401);
  }

  const plan=await getPlan(env.DB,user);

  return json({
    ok:true,
    user:{
      ...user,
      plan
    }
  });
}


/* =========================
   PROFILE
========================= */

async function profile(request,env){

  const db=env.DB;
  const user=await getUserFromRequest(request,db);

  if(!user){
    return json({ok:false,error:"دسترسی ندارید."},401);
  }

  const body=await request.json();

  const name=String(body.name||"").trim();
  const email=String(body.email||"").trim().toLowerCase();

  if(!name || !email){
    return json({ok:false,error:"نام و ایمیل الزامی است."},400);
  }

  const c=await columns(db,"users");

  if(c.has("username")){

    await db.prepare(`
      UPDATE users
      SET name=?,email=?
      WHERE id=?
    `).bind(name,email,user.id).run();

  }else{

    await db.prepare(`
      UPDATE users
      SET name=?,email=?
      WHERE id=?
    `).bind(name,email,user.id).run();
  }

  const updated=await getUserById(db,user.id);

  return json({
    ok:true,
    user:{
      ...updated,
      plan:await getPlan(db,updated)
    }
  });
}


/* =========================
   LOGOUT
========================= */

async function logout(request,env){

  const auth=request.headers.get("Authorization")||"";

  if(auth.startsWith("Bearer ")){

    const token=auth.slice(7).trim();

    await env.DB.prepare(
      "DELETE FROM sessions WHERE token=?"
    ).bind(token).run();
  }

  return json({ok:true});
}


/* =========================
   TRANSACTIONS
========================= */

async function transactions(request,env){

  const db=env.DB;
  const user=await getUserFromRequest(request,db);

  if(!user){
    return json({ok:false,error:"دسترسی ندارید."},401);
  }

  const r=await db.prepare(`
    SELECT *
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


/* =========================
   WITHDRAW
========================= */

async function withdrawAPI(request,env){

  const db=env.DB;
  const user=await getUserFromRequest(request,db);

  if(!user){
    return json({ok:false,error:"ابتدا وارد حساب شوید."},401);
  }

  const body=await request.json();

  const amount=Number(body.amount||0);
  const method=String(body.method||"بانکی");
  const network=String(body.network||"TRC20");
  const address=String(body.address||"").trim();

  if(!Number.isFinite(amount) || amount<10000){
    return json({ok:false,error:"حداقل برداشت ۱۰,۰۰۰ تومان است."},400);
  }

  if(amount>Number(user.balance||0)){
    return json({ok:false,error:"موجودی کافی نیست."},400);
  }

  if(!address){
    return json({ok:false,error:"اطلاعات دریافت الزامی است."},400);
  }

  /*
   * ابتدا موجودی کم می‌شود.
   * در صورت رد درخواست، در پنل مدیر برگشت داده می‌شود.
   */

  await db.prepare(`
    UPDATE users
    SET balance=balance-?
    WHERE id=? AND balance>=?
  `).bind(amount,user.id,amount).run();

  const check=await getUserById(db,user.id);

  if(Number(check.balance) >
     Number(user.balance)-amount+0.01){
    return json({ok:false,error:"خطا در کسر موجودی."},500);
  }

  const c=await columns(db,"withdrawals");

  let result;

  if(c.has("user_id") && c.has("network")){

    result=await db.prepare(`
      INSERT INTO withdrawals
      (user_id,amount,method,network,address,status)
      VALUES(?,?,?,?,?,?)
    `).bind(
      user.id,
      amount,
      method,
      network,
      address,
      "در انتظار"
    ).run();

  }else{

    return json({
      ok:false,
      error:"ساختار جدول برداشت با سیستم سازگار نیست."
    },500);
  }

  await db.prepare(`
    INSERT INTO transactions
    (user_id,type,amount,description)
    VALUES(?,?,?,?)
  `).bind(
    user.id,
    "withdraw",
    -amount,
    "درخواست برداشت"
  ).run();

  return json({
    ok:true,
    message:"درخواست برداشت با موفقیت ثبت شد.",
    id:result.meta.last_row_id
  });
}


/* =========================
   PAYMENT START
========================= */

async function paymentStart(request,env){

  const db=env.DB;
  const user=await getUserFromRequest(request,db);

  if(!user){
    return json({ok:false,error:"ابتدا وارد حساب شوید."},401);
  }

  const body=await request.json();

  const amount=Math.floor(Number(body.amount||0));
  const plan=String(body.plan||"افزایش موجودی");

  if(!Number.isFinite(amount) || amount<10000){
    return json({ok:false,error:"مبلغ پرداخت نامعتبر است."},400);
  }

  const reference=
    "DEP-"+Date.now()+"-"+Math.random().toString(36).slice(2,8).toUpperCase();

  const c=await columns(db,"deposits");

  if(
    c.has("user_id") &&
    c.has("plan_name") &&
    c.has("amount_toman") &&
    c.has("method") &&
    c.has("reference")
  ){

    await db.prepare(`
      INSERT INTO deposits
      (user_id,plan_name,amount_toman,method,reference,note,status)
      VALUES(?,?,?,?,?,?,?)
    `).bind(
      user.id,
      plan,
      amount,
      "زرین‌پال",
      reference,
      "",
      "در انتظار"
    ).run();

  }else{

    return json({
      ok:false,
      error:"ساختار جدول پرداخت با سیستم فعلی سازگار نیست."
    },500);
  }

  /*
   * اگر متغیر PAYMENT_URL در Worker تنظیم شده باشد،
   * کاربر به آن هدایت می‌شود.
   *
   * در غیر این صورت فقط درخواست پرداخت در D1 ثبت می‌شود.
   */

  let payment_url="";

  if(env.PAYMENT_URL){
    payment_url=env.PAYMENT_URL;
  }

  return json({
    ok:true,
    message:payment_url
      ?"در حال انتقال به درگاه..."
      :"درخواست پرداخت ثبت شد؛ اتصال نهایی درگاه هنوز تنظیم نشده است.",
    reference,
    payment_url
  });
}


/* =========================
   AI
========================= */

async function ai(request,env){

  const user=await getUserFromRequest(request,env.DB);

  if(!user){
    return json({ok:false,error:"ابتدا وارد حساب شوید."},401);
  }

  if(!env.AI){
    return json({
      ok:false,
      error:"Workers AI به Worker متصل نیست."
    },500);
  }

  const body=await request.json();
  const message=String(body.message||"").trim();

  if(!message){
    return json({
      ok:false,
      error:"پیام خالی است."
    },400);
  }

  try{

    const result=await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages:[
          {
            role:"system",
            content:
              "تو یک دستیار هوش مصنوعی فارسی هستی. پاسخ‌ها را واضح، مفید، محترمانه و تا حد امکان کوتاه بده."
          },
          {
            role:"user",
            content:message
          }
        ]
      }
    );

    const answer=
      result?.response ||
      result?.result?.response ||
      result?.text ||
      "پاسخی دریافت نشد.";

    return json({
      ok:true,
      answer
    });

  }catch(e){

    return json({
      ok:false,
      error:"خطا در اجرای هوش مصنوعی",
      detail:String(e.message||e)
    },500);
  }
}


/* =========================
   FORGOT PASSWORD
========================= */

async function forgotPassword(request,env){

  const db=env.DB;
  const body=await request.json();

  const email=String(body.email||"").trim().toLowerCase();

  if(!email){
    return json({ok:false,error:"ایمیل را وارد کنید."},400);
  }

  const user=await getUserByEmail(db,email);

  /*
   * برای امنیت، در حالت واقعی بهتر است کد به ایمیل ارسال شود.
   * فعلاً برای تست سیستم کد در پاسخ development_code قرار می‌گیرد.
   */

  if(!user){

    return json({
      ok:true,
      message:"اگر این ایمیل ثبت شده باشد، کد بازیابی ایجاد شده است."
    });
  }

  const code=randomCode();
  const expiresAt=Date.now()+10*60*1000;

  const c=await columns(db,"reset_codes");

  if(c.has("user_id") && c.has("expires_at")){

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
      expiresAt
    ).run();

  }else{

    return json({
      ok:false,
      error:"ساختار reset_codes سازگار نیست."
    },500);
  }

  return json({
    ok:true,
    message:"کد بازیابی ایجاد شد.",
    development_code:code
  });
}


/* =========================
   RESET PASSWORD
========================= */

async function resetPassword(request,env){

  const db=env.DB;
  const body=await request.json();

  const email=String(body.email||"").trim().toLowerCase();
  const code=String(body.code||"").trim();
  const password=String(body.password||"");

  if(!email || !code || !password){
    return json({
      ok:false,
      error:"همه اطلاعات لازم است."
    },400);
  }

  if(password.length<6){
    return json({
      ok:false,
      error:"رمز عبور جدید باید حداقل ۶ کاراکتر باشد."
    },400);
  }

  const user=await getUserByEmail(db,email);

  if(!user){
    return json({
      ok:false,
      error:"کد بازیابی صحیح نیست."
    },400);
  }

  const reset=await db.prepare(`
    SELECT *
    FROM reset_codes
    WHERE user_id=? AND code=?
    ORDER BY id DESC
    LIMIT 1
  `).bind(user.id,code).first();

  if(!reset){
    return json({
      ok:false,
      error:"کد بازیابی صحیح نیست."
    },400);
  }

  if(Number(reset.expires_at)<Date.now()){
    return json({
      ok:false,
      error:"کد بازیابی منقضی شده است."
    },400);
  }

  await db.prepare(`
    UPDATE users
    SET password_hash=?
    WHERE id=?
  `).bind(
    hashPassword(password),
    user.id
  ).run();

  await db.prepare(`
    DELETE FROM reset_codes
    WHERE user_id=?
  `).bind(user.id).run();

  return json({
    ok:true,
    message:"رمز عبور با موفقیت تغییر کرد."
  });
}


/* =========================
   ADMIN AUTH
========================= */

async function adminLogin(request,env){

  const body=await request.json();
  const password=String(body.password||"");

  if(!env.ADMIN_PASSWORD){
    return json({
      ok:false,
      error:"ADMIN_PASSWORD در Secrets تنظیم نشده است."
    },500);
  }

  if(password!==env.ADMIN_PASSWORD){
    return json({
      ok:false,
      error:"رمز مدیریت اشتباه است."
    },401);
  }

  const token=randomToken();
  const expiresAt=Date.now()+12*60*60*1000;

  await env.DB.prepare(`
    INSERT INTO admin_sessions(token,expires_at)
    VALUES(?,?)
  `).bind(token,expiresAt).run();

  return json({
    ok:true,
    token
  });
}

async function adminOK(request,env){

  const auth=request.headers.get("Authorization")||"";

  if(!auth.startsWith("Admin ")){
    return false;
  }

  const token=auth.slice(6).trim();

  if(!token)return false;

  const row=await env.DB.prepare(`
    SELECT *
    FROM admin_sessions
    WHERE token=?
    LIMIT 1
  `).bind(token).first();

  if(!row)return false;

  if(Number(row.expires_at)<Date.now()){

    await env.DB.prepare(
      "DELETE FROM admin_sessions WHERE token=?"
    ).bind(token).run();

    return false;
  }

  return true;
}


/* =========================
   ADMIN USERS
========================= */

async function adminUsers(request,env){

  if(!await adminOK(request,env)){
    return json({ok:false,error:"دسترسی مدیر لازم است."},403);
  }

  const db=env.DB;

  const r=await db.prepare(`
    SELECT *
    FROM users
    ORDER BY id DESC
    LIMIT 500
  `).all();

  const users=[];

  for(const u of (r.results||[])){

    users.push({
      id:u.id,
      name:u.name||"",
      email:u.email||"",
      username:u.username||"",
      balance:Number(u.balance||0),
      status:u.status||"فعال",
      plan:await getPlan(db,u)
    });
  }

  return json({
    ok:true,
    users
  });
}


/* =========================
   ADMIN USER STATUS
========================= */

async function adminUserStatus(request,env){

  if(!await adminOK(request,env)){
    return json({ok:false,error:"دسترسی مدیر لازم است."},403);
  }

  const body=await request.json();

  const id=Number(body.id);
  const status=String(body.status||"فعال");

  if(!id){
    return json({ok:false,error:"شناسه کاربر نامعتبر است."},400);
  }

  await env.DB.prepare(`
    UPDATE users
    SET status=?
    WHERE id=?
  `).bind(status,id).run();

  return json({
    ok:true,
    message:"وضعیت کاربر تغییر کرد."
  });
}


/* =========================
   ADMIN BALANCE
========================= */

async function adminBalance(request,env){

  if(!await adminOK(request,env)){
    return json({ok:false,error:"دسترسی مدیر لازم است."},403);
  }

  const body=await request.json();

  const id=Number(body.id);
  const amount=Number(body.amount);

  if(!id || !Number.isFinite(amount)){
    return json({
      ok:false,
      error:"اطلاعات نامعتبر است."
    },400);
  }

  const user=await getUserById(env.DB,id);

  if(!user){
    return json({
      ok:false,
      error:"کاربر پیدا نشد."
    },404);
  }

  if(Number(user.balance||0)+amount<0){
    return json({
      ok:false,
      error:"موجودی نمی‌تواند منفی شود."
    },400);
  }

  await env.DB.prepare(`
    UPDATE users
    SET balance=balance+?
    WHERE id=?
  `).bind(amount,id).run();

  await env.DB.prepare(`
    INSERT INTO transactions
    (user_id,type,amount,description)
    VALUES(?,?,?,?)
  `).bind(
    id,
    "admin_balance",
    amount,
    "تغییر موجودی توسط مدیر"
  ).run();

  return json({
    ok:true,
    message:"موجودی تغییر کرد."
  });
}


/* =========================
   ADMIN PAYMENTS
========================= */

async function adminPayments(request,env){

  if(!await adminOK(request,env)){
    return json({ok:false,error:"دسترسی مدیر لازم است."},403);
  }

  const db=env.DB;

  const r=await db.prepare(`
    SELECT
      d.*,
      u.name AS user_name,
      u.email AS user_email
    FROM deposits d
    LEFT JOIN users u ON u.id=d.user_id
    ORDER BY d.id DESC
    LIMIT 500
  `).all();

  const rows=(r.results||[]).map(x=>({
    ...x,
    username:x.user_name||x.user_email||String(x.user_id||"")
  }));

  return json({
    ok:true,
    payments:rows
  });
}


/* =========================
   ADMIN WITHDRAWALS
========================= */

async function adminWithdrawals(request,env){

  if(!await adminOK(request,env)){
    return json({ok:false,error:"دسترسی مدیر لازم است."},403);
  }

  const r=await env.DB.prepare(`
    SELECT
      w.*,
      u.name AS user_name,
      u.email AS user_email,
      u.username AS username
    FROM withdrawals w
    LEFT JOIN users u ON u.id=w.user_id
    ORDER BY w.id DESC
    LIMIT 500
  `).all();

  const rows=(r.results||[]).map(x=>({
    ...x,
    username:x.username||x.user_name||x.user_email||String(x.user_id||"")
  }));

  return json({
    ok:true,
    withdrawals:rows
  });
}


/* =========================
   ADMIN WITHDRAWAL STATUS
========================= */

async function adminWithdrawalStatus(request,env){

  if(!await adminOK(request,env)){
    return json({ok:false,error:"دسترسی مدیر لازم است."},403);
  }

  const db=env.DB;
  const body=await request.json();

  const id=Number(body.id);
  const action=String(body.status||"");

  const withdrawal=await db.prepare(`
    SELECT *
    FROM withdrawals
    WHERE id=?
  `).bind(id).first();

  if(!withdrawal){
    return json({
      ok:false,
      error:"درخواست برداشت پیدا نشد."
    },404);
  }

  const current=String(withdrawal.status||"");

  const isPending=
    current==="در انتظار" ||
    current==="pending" ||
    current==="در انتظار بررسی";

  if(!isPending){
    return json({
      ok:false,
      error:"این درخواست قبلاً بررسی شده است."
    },400);
  }

  if(action==="approved"){

    await db.prepare(`
      UPDATE withdrawals
      SET status=?
      WHERE id=?
    `).bind(
      "تأیید شده",
      id
    ).run();

    await db.prepare(`
      INSERT INTO transactions
      (user_id,type,amount,description)
      VALUES(?,?,?,?)
    `).bind(
      withdrawal.user_id,
      "withdraw_approved",
      0,
      "برداشت تأیید شد"
    ).run();

    return json({
      ok:true,
      message:"برداشت تأیید شد."
    });
  }

  if(action==="rejected"){

    const user=await getUserById(db,withdrawal.user_id);

    if(!user){
      return json({
        ok:false,
        error:"کاربر پیدا نشد."
      },404);
    }

    await db.prepare(`
      UPDATE users
      SET balance=balance+?
      WHERE id=?
    `).bind(
      Number(withdrawal.amount||0),
      withdrawal.user_id
    ).run();

    await db.prepare(`
      UPDATE withdrawals
      SET status=?
      WHERE id=?
    `).bind(
      "رد شده",
      id
    ).run();

    await db.prepare(`
      INSERT INTO transactions
      (user_id,type,amount,description)
      VALUES(?,?,?,?)
    `).bind(
      withdrawal.user_id,
      "withdraw_refund",
      Number(withdrawal.amount||0),
      "برگشت مبلغ برداشت رد شده"
    ).run();

    return json({
      ok:true,
      message:"برداشت رد شد و مبلغ به موجودی برگشت."
    });
  }

  return json({
    ok:false,
    error:"عملیات نامعتبر است."
  },400);
}


/* =========================
   ADMIN STATS
========================= */

async function adminStats(request,env){

  if(!await adminOK(request,env)){
    return json({
      ok:false,
      error:"دسترسی مدیر لازم است."
    },403);
  }

  const db=env.DB;

  const users=await db.prepare(`
    SELECT COUNT(*) AS count
    FROM users
  `).first();

  const balance=await db.prepare(`
    SELECT COALESCE(SUM(balance),0) AS total
    FROM users
  `).first();

  let pendingWithdrawals=0;
  let pendingDeposits=0;

  if(await tableExists(db,"withdrawals")){

    const r=await db.prepare(`
      SELECT COUNT(*) AS count
      FROM withdrawals
      WHERE status IN ('در انتظار','pending','در انتظار بررسی')
    `).first();

    pendingWithdrawals=Number(r?.count||0);
  }

  if(await tableExists(db,"deposits")){

    const r=await db.prepare(`
      SELECT COUNT(*) AS count
      FROM deposits
      WHERE status IN ('در انتظار','pending','در انتظار بررسی')
    `).first();

    pendingDeposits=Number(r?.count||0);
  }

  return json({
    ok:true,
    stats:{
      users:Number(users?.count||0),
      balance:Number(balance?.total||0),
      pending_withdrawals:pendingWithdrawals,
      pending_deposits:pendingDeposits
    }
  });
}


/* =========================
   MAIN FETCH
========================= */

export default {

  async fetch(request,env){

    const url=new URL(request.url);
    const path=url.pathname;
    const method=request.method;

    try{

      if(!env.DB){

        return json({
          ok:false,
          error:"D1 binding با نام DB متصل نیست."
        },500);
      }

      await initDB(env.DB);

      if(
        method==="OPTIONS"
      ){

        return new Response(null,{
          status:204,
          headers:{
            "Access-Control-Allow-Origin":"*",
            "Access-Control-Allow-Headers":"Content-Type, Authorization",
            "Access-Control-Allow-Methods":"GET,POST,OPTIONS"
          }
        });
      }


      /* HTML */

      if(path==="/" || path==="/index.html"){
        return htmlResponse();
      }


      /* USER */

      if(path==="/api/register" && method==="POST"){
        return await register(request,env);
      }

      if(path==="/api/login" && method==="POST"){
        return await login(request,env);
      }

      if(path==="/api/logout" && method==="POST"){
        return await logout(request,env);
      }

      if(path==="/api/me" && method==="GET"){
        return await me(request,env);
      }

      if(path==="/api/profile" && method==="POST"){
        return await profile(request,env);
      }

      if(path==="/api/transactions" && method==="GET"){
        return await transactions(request,env);
      }

      if(path==="/api/withdraw" && method==="POST"){
        return await withdrawAPI(request,env);
      }

      if(path==="/api/payment/start" && method==="POST"){
        return await paymentStart(request,env);
      }

      if(path==="/api/forgot-password" && method==="POST"){
        return await forgotPassword(request,env);
      }

      if(path==="/api/reset-password" && method==="POST"){
        return await resetPassword(request,env);
      }

      if(path==="/api/ai" && method==="POST"){
        return await ai(request,env);
      }


      /* ADMIN */

      if(path==="/api/admin/login" && method==="POST"){
        return await adminLogin(request,env);
      }

      if(path==="/api/admin/users" && method==="GET"){
        return await adminUsers(request,env);
      }

      if(path==="/api/admin/user-status" && method==="POST"){
        return await adminUserStatus(request,env);
      }

      if(path==="/api/admin/balance" && method==="POST"){
        return await adminBalance(request,env);
      }

      if(path==="/api/admin/payments" && method==="GET"){
        return await adminPayments(request,env);
      }

      if(path==="/api/admin/withdrawals" && method==="GET"){
        return await adminWithdrawals(request,env);
      }

      if(path==="/api/admin/withdrawal-status" && method==="POST"){
        return await adminWithdrawalStatus(request,env);
      }

      if(path==="/api/admin/stats" && method==="GET"){
        return await adminStats(request,env);
      }


      return json({
        ok:false,
        error:"مسیر پیدا نشد.",
        path
      },404);

    }catch(e){

      console.error(e);

      return json({
        ok:false,
        error:"خطای داخلی سرور",
        detail:String(e?.message||e)
      },500);
    }
  }
};
