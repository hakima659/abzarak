
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
  background:#f3f6fb;
  color:#172033
}
.container{
  width:min(1100px,94%);
  margin:25px auto
}
.card{
  background:#fff;
  border-radius:18px;
  padding:20px;
  margin:15px 0;
  box-shadow:0 5px 25px rgba(0,0,0,.07)
}
h1,h2,h3{margin-top:0}
input,select,textarea,button{
  width:100%;
  padding:12px;
  margin:7px 0;
  border-radius:10px;
  border:1px solid #d9dfeb;
  font-family:inherit;
  font-size:15px
}
textarea{min-height:120px;resize:vertical}
button{
  cursor:pointer;
  border:0;
  background:#2563eb;
  color:white;
  font-weight:bold
}
button:hover{opacity:.9}
button.danger{background:#dc2626}
button.success{background:#16a34a}
button.dark{background:#111827}
.hidden{display:none!important}
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(230px,1fr));
  gap:15px
}
.stat{
  background:#f8fafc;
  padding:18px;
  border-radius:14px
}
.stat strong{
  display:block;
  font-size:24px;
  margin-top:8px
}
.nav{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  margin-bottom:15px
}
.nav button{
  width:auto;
  padding:10px 15px
}
.badge{
  display:inline-block;
  padding:5px 10px;
  border-radius:20px;
  background:#e0ecff;
  color:#1755b8;
  font-size:12px
}
table{
  width:100%;
  border-collapse:collapse;
  margin-top:10px
}
th,td{
  border-bottom:1px solid #eee;
  padding:10px;
  text-align:right;
  font-size:13px
}
.ai-answer{
  white-space:pre-wrap;
  line-height:2;
  background:#f8fafc;
  padding:15px;
  border-radius:12px;
  margin-top:10px
}
header{
  background:#111827;
  color:#fff;
  padding:25px;
  border-radius:20px
}
.small{
  color:#64748b;
  font-size:12px
}
.row{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px
}
@media(max-width:650px){
  .row{grid-template-columns:1fr}
  table{font-size:11px}
  th,td{padding:7px}
}
</style>
</head>

<body>
<div class="container">

<header>
<h1>🤖 دستیار هوش مصنوعی</h1>
<p>دستیار هوشمند + حساب کاربری + موجودی + برداشت</p>
</header>

<div id="message" class="card hidden"></div>

<!-- AUTH -->
<div id="authBox" class="card">
<div class="nav">
<button onclick="showAuth('login')">ورود</button>
<button onclick="showAuth('register')">ثبت‌نام</button>
<button onclick="showAuth('forgot')">فراموشی رمز</button>
</div>

<div id="loginBox">
<h2>🔐 ورود</h2>
<input id="loginEmail" type="email" placeholder="ایمیل">
<input id="loginPassword" type="password" placeholder="رمز عبور">
<button onclick="login()">ورود به حساب</button>
</div>

<div id="registerBox" class="hidden">
<h2>📝 ثبت‌نام</h2>
<input id="regName" placeholder="نام کامل">
<input id="regEmail" type="email" placeholder="ایمیل">
<input id="regPassword" type="password" placeholder="رمز عبور">
<input id="regPassword2" type="password" placeholder="تکرار رمز عبور">
<button class="success" onclick="register()">ایجاد حساب</button>
</div>

<div id="forgotBox" class="hidden">
<h2>🔑 بازیابی رمز</h2>
<input id="forgotEmail" type="email" placeholder="ایمیل حساب">
<button onclick="forgotPassword()">دریافت کد بازیابی</button>
<div id="resetArea" class="hidden">
<input id="resetCode" placeholder="کد بازیابی">
<input id="newPassword" type="password" placeholder="رمز عبور جدید">
<button onclick="resetPassword()">تغییر رمز</button>
</div>
</div>
</div>

<!-- USER -->
<div id="userPanel" class="hidden">

<div class="card">
<div class="nav">
<button onclick="showTab('home')">🏠 خانه</button>
<button onclick="showTab('profile')">👤 حساب کاربری</button>
<button onclick="showTab('plans')">💳 اشتراک</button>
<button onclick="showTab('deposit')">💰 افزایش موجودی</button>
<button onclick="showTab('withdraw')">💸 برداشت</button>
<button onclick="showTab('transactions')">📊 تراکنش‌ها</button>
<button onclick="logout()" class="danger">خروج</button>
</div>
</div>

<div id="homeTab">
<div class="grid">
<div class="stat">
موجودی
<strong id="balance">0 تومان</strong>
</div>
<div class="stat">
پلن
<strong id="plan">رایگان</strong>
</div>
<div class="stat">
ایمیل
<strong id="emailShow">-</strong>
</div>
</div>

<div class="card">
<h2>🤖 دستیار هوش مصنوعی</h2>
<textarea id="aiPrompt" placeholder="سؤال خود را بنویسید..."></textarea>
<button onclick="sendAI()">ارسال به هوش مصنوعی</button>
<div id="aiResult" class="ai-answer hidden"></div>
</div>
</div>

<div id="profileTab" class="hidden">
<div class="card">
<h2>👤 حساب کاربری</h2>
<input id="profileName" placeholder="نام کامل">
<input id="profileEmail" type="email" placeholder="ایمیل">
<button onclick="saveProfile()">ذخیره اطلاعات</button>
</div>
</div>

<div id="plansTab" class="hidden">
<div class="card">
<h2>💳 انتخاب اشتراک</h2>
<div class="grid">

<div class="stat">
<h3>رایگان</h3>
<p>0 تومان</p>
<button onclick="pay('free',0)">انتخاب</button>
</div>

<div class="stat">
<h3>⭐ حرفه‌ای</h3>
<p>400,000 تومان</p>
<button onclick="pay('professional',400000)">خرید</button>
</div>

<div class="stat">
<h3>🔥 ویژه</h3>
<p>700,000 تومان</p>
<button onclick="pay('special',700000)">خرید</button>
</div>

<div class="stat">
<h3>💎 طلایی</h3>
<p>1,000,000 تومان</p>
<button onclick="pay('gold',1000000)">خرید</button>
</div>

<div class="stat">
<h3>👑 VIP</h3>
<p>2,000,000 تومان</p>
<button onclick="pay('vip',2000000)">خرید</button>
</div>

</div>
</div>
</div>

<div id="depositTab" class="hidden">
<div class="card">
<h2>💰 افزایش موجودی</h2>
<p>مبلغ موردنظر را وارد کنید.</p>
<input id="depositAmount" type="number" min="10000" placeholder="مثلاً 400000">
<button onclick="startDeposit()">ادامه پرداخت</button>
<p class="small">اتصال درگاه واقعی زرین‌پال پس از قرار دادن Merchant ID انجام می‌شود.</p>
</div>
</div>

<div id="withdrawTab" class="hidden">
<div class="card">
<h2>💸 درخواست برداشت</h2>
<p>حداقل برداشت: 10,000 تومان</p>
<input id="withdrawAmount" type="number" min="10000" placeholder="مبلغ برداشت">
<select id="withdrawMethod">
<option value="USDT">USDT</option>
<option value="BANK">حساب بانکی</option>
</select>
<input id="withdrawAddress" placeholder="آدرس کیف پول یا شماره حساب">
<button onclick="withdraw()">ثبت درخواست برداشت</button>
</div>
</div>

<div id="transactionsTab" class="hidden">
<div class="card">
<h2>📊 تراکنش‌ها</h2>
<button onclick="loadTransactions()">بروزرسانی</button>
<div id="transactionsList"></div>
</div>
</div>

</div>

<!-- ADMIN -->
<div class="card">
<h2>🛠️ مدیریت</h2>

<div id="adminLogin">
<input id="adminPassword" type="password" placeholder="رمز مدیریت">
<button id="adminLoginButton" onclick="adminLogin()">ورود مدیریت</button>
</div>

<div id="adminPanel" class="hidden">

<div class="nav">
<button onclick="adminTab('stats')">📊 آمار</button>
<button onclick="adminTab('users')">👥 کاربران</button>
<button onclick="adminTab('payments')">💰 پرداخت‌ها</button>
<button onclick="adminTab('withdrawals')">💸 برداشت‌ها</button>
<button class="danger" onclick="adminLogout()">خروج مدیریت</button>
</div>

<div id="adminStats">
<div class="grid">
<div class="stat">کاربران<strong id="statUsers">0</strong></div>
<div class="stat">موجودی<strong id="statBalance">0</strong></div>
<div class="stat">برداشت‌های در انتظار<strong id="statWithdrawals">0</strong></div>
<div class="stat">پرداخت‌های در انتظار<strong id="statPayments">0</strong></div>
</div>
</div>

<div id="adminUsers" class="hidden">
<h3>👥 کاربران</h3>
<button onclick="loadUsers()">بروزرسانی</button>
<div id="usersTable"></div>
</div>

<div id="adminPayments" class="hidden">
<h3>💰 پرداخت‌ها</h3>
<button onclick="loadPayments()">بروزرسانی</button>
<div id="paymentsTable"></div>
</div>

<div id="adminWithdrawals" class="hidden">
<h3>💸 برداشت‌ها</h3>
<button onclick="loadWithdrawals()">بروزرسانی</button>
<div id="withdrawalsTable"></div>
</div>

</div>
</div>

</div>

<script>
let token=localStorage.getItem("user_token")||"";
let adminToken=localStorage.getItem("admin_token")||"";

function $(id){
  return document.getElementById(id);
}

function showMessage(text,error=false){
  const el=$("message");
  el.textContent=text;
  el.className="card";
  el.style.background=error?"#fee2e2":"#dcfce7";
  setTimeout(()=>{
    el.classList.add("hidden");
  },5000);
}

function showAuth(type){
  $("loginBox").classList.toggle("hidden",type!=="login");
  $("registerBox").classList.toggle("hidden",type!=="register");
  $("forgotBox").classList.toggle("hidden",type!=="forgot");
}

async function api(url,options={}){
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
    throw new Error("پاسخ نامعتبر از سرور");
  }

  if(!r.ok){
    throw new Error(data.error||"خطای سرور");
  }

  return data;
}

async function register(){
  const name=$("regName").value.trim();
  const email=$("regEmail").value.trim();
  const password=$("regPassword").value;
  const password2=$("regPassword2").value;

  if(!name||!email||!password){
    showMessage("همه فیلدها را کامل کنید",true);
    return;
  }

  if(password!==password2){
    showMessage("تکرار رمز عبور صحیح نیست",true);
    return;
  }

  try{
    const data=await api("/api/register",{
      method:"POST",
      body:JSON.stringify({name,email,password})
    });

    if(data.token){
      token=data.token;
      localStorage.setItem("user_token",token);
    }

    showMessage("ثبت‌نام با موفقیت انجام شد");
    await loadMe();
  }catch(e){
    showMessage(e.message,true);
  }
}

async function login(){
  const email=$("loginEmail").value.trim();
  const password=$("loginPassword").value;

  if(!email||!password){
    showMessage("ایمیل و رمز عبور را وارد کنید",true);
    return;
  }

  try{
    const data=await api("/api/login",{
      method:"POST",
      body:JSON.stringify({email,password})
    });

    token=data.token;
    localStorage.setItem("user_token",token);

    showMessage("ورود موفق بود");
    await loadMe();
  }catch(e){
    showMessage(e.message,true);
  }
}

async function loadMe(){
  try{
    const data=await api("/api/me");

    if(!data.ok){
      throw new Error("جلسه کاربری معتبر نیست");
    }

    const u=data.user;

    $("authBox").classList.add("hidden");
    $("userPanel").classList.remove("hidden");

    $("balance").textContent=formatMoney(u.balance);
    $("plan").textContent=planName(u.plan);
    $("emailShow").textContent=u.email||"-";
    $("profileName").value=u.name||"";
    $("profileEmail").value=u.email||"";

  }catch(e){
    token="";
    localStorage.removeItem("user_token");
    $("authBox").classList.remove("hidden");
    $("userPanel").classList.add("hidden");
  }
}

function formatMoney(n){
  return Number(n||0).toLocaleString("fa-IR")+" تومان";
}

function planName(p){
  const x={
    free:"رایگان",
    professional:"حرفه‌ای",
    special:"ویژه",
    gold:"طلایی",
    vip:"VIP"
  };
  return x[p]||p||"رایگان";
}

function logout(){
  token="";
  localStorage.removeItem("user_token");
  $("userPanel").classList.add("hidden");
  $("authBox").classList.remove("hidden");
  showAuth("login");
}

function showTab(name){
  const tabs=[
    "home",
    "profile",
    "plans",
    "deposit",
    "withdraw",
    "transactions"
  ];

  tabs.forEach(x=>{
    const el=$(x+"Tab");
    if(el)el.classList.toggle("hidden",x!==name);
  });

  if(name==="transactions"){
    loadTransactions();
  }
}

async function saveProfile(){
  try{
    const data=await api("/api/profile",{
      method:"POST",
      body:JSON.stringify({
        name:$("profileName").value.trim(),
        email:$("profileEmail").value.trim()
      })
    });

    showMessage(data.message||"اطلاعات ذخیره شد");
    await loadMe();
  }catch(e){
    showMessage(e.message,true);
  }
}

async function sendAI(){
  const prompt=$("aiPrompt").value.trim();

  if(!prompt){
    showMessage("سؤال را وارد کنید",true);
    return;
  }

  const result=$("aiResult");
  result.classList.remove("hidden");
  result.textContent="⏳ در حال دریافت پاسخ...";

  try{
    const data=await api("/api/ai",{
      method:"POST",
      body:JSON.stringify({prompt})
    });

    result.textContent=data.answer||data.response||"پاسخی دریافت نشد";

    await loadMe();
  }catch(e){
    result.textContent="خطا: "+e.message;
  }
}

async function pay(plan,amount){
  if(plan==="free"){
    showMessage("پلن رایگان انتخاب شد");
    return;
  }

  try{
    const data=await api("/api/payment/start",{
      method:"POST",
      body:JSON.stringify({plan,amount})
    });

    if(data.url){
      location.href=data.url;
    }else{
      showMessage(data.message||"درخواست پرداخت ثبت شد");
    }
  }catch(e){
    showMessage(e.message,true);
  }
}

async function startDeposit(){
  const amount=Number($("depositAmount").value);

  if(!amount||amount<10000){
    showMessage("حداقل مبلغ افزایش موجودی 10,000 تومان است",true);
    return;
  }

  try{
    const data=await api("/api/payment/start",{
      method:"POST",
      body:JSON.stringify({
        plan:"deposit",
        amount
      })
    });

    if(data.url){
      location.href=data.url;
    }else{
      showMessage(data.message||"درخواست ثبت شد");
    }
  }catch(e){
    showMessage(e.message,true);
  }
}

async function withdraw(){
  const amount=Number($("withdrawAmount").value);
  const method=$("withdrawMethod").value;
  const address=$("withdrawAddress").value.trim();

  if(!amount||amount<10000){
    showMessage("حداقل برداشت 10,000 تومان است",true);
    return;
  }

  if(!address){
    showMessage("آدرس کیف پول یا اطلاعات حساب را وارد کنید",true);
    return;
  }

  try{
    const data=await api("/api/withdraw",{
      method:"POST",
      body:JSON.stringify({
        amount,
        method,
        address
      })
    });

    showMessage(data.message||"درخواست برداشت ثبت شد");
    $("withdrawAmount").value="";
    $("withdrawAddress").value="";
    await loadMe();
  }catch(e){
    showMessage(e.message,true);
  }
}

async function loadTransactions(){
  try{
    const data=await api("/api/transactions");
    const list=data.transactions||[];

    if(!list.length){
      $("transactionsList").innerHTML="<p>تراکنشی وجود ندارد.</p>";
      return;
    }

    $("transactionsList").innerHTML=
      "<table><tr><th>نوع</th><th>مبلغ</th><th>توضیح</th><th>تاریخ</th></tr>"+
      list.map(t=>
        "<tr>"+
        "<td>"+escapeHtml(t.type)+"</td>"+
        "<td>"+formatMoney(t.amount)+"</td>"+
        "<td>"+escapeHtml(t.description||"")+"</td>"+
        "<td>"+escapeHtml(t.created_at||"")+"</td>"+
        "</tr>"
      ).join("")+
      "</table>";
  }catch(e){
    showMessage(e.message,true);
  }
}

async function forgotPassword(){
  const email=$("forgotEmail").value.trim();

  if(!email){
    showMessage("ایمیل را وارد کنید",true);
    return;
  }

  try{
    const data=await api("/api/forgot-password",{
      method:"POST",
      body:JSON.stringify({email})
    });

    $("resetArea").classList.remove("hidden");

    if(data.development_code){
      showMessage("کد بازیابی: "+data.development_code);
    }else{
      showMessage(data.message||"کد بازیابی ارسال شد");
    }
  }catch(e){
    showMessage(e.message,true);
  }
}

async function resetPassword(){
  const email=$("forgotEmail").value.trim();
  const code=$("resetCode").value.trim();
  const password=$("newPassword").value;

  if(!email||!code||!password){
    showMessage("اطلاعات را کامل کنید",true);
    return;
  }

  try{
    const data=await api("/api/reset-password",{
      method:"POST",
      body:JSON.stringify({
        email,
        code,
        password
      })
    });

    showMessage(data.message||"رمز تغییر کرد");
    showAuth("login");
  }catch(e){
    showMessage(e.message,true);
  }
}

/* ADMIN */

async function adminLogin(){
  const input=$("adminPassword");
  const button=$("adminLoginButton");
  const password=input.value.trim();

  if(!password){
    showMessage("رمز مدیریت را وارد کنید",true);
    input.focus();
    return;
  }

  button.disabled=true;
  button.textContent="در حال ورود...";

  try{
    const response=await fetch("/api/admin/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({password})
    });

    const text=await response.text();

    let data;

    try{
      data=JSON.parse(text);
    }catch(e){
      throw new Error(
        "پاسخ سرور JSON نیست. کد پاسخ: "+response.status
      );
    }

    if(!response.ok||!data.ok){
      throw new Error(data.error||"رمز مدیریت صحیح نیست");
    }

    if(!data.token){
      throw new Error("توکن مدیریت از سرور دریافت نشد");
    }

    adminToken=data.token;

    localStorage.setItem(
      "admin_token",
      adminToken
    );

    $("adminLogin").classList.add("hidden");
    $("adminPanel").classList.remove("hidden");

    showMessage("ورود مدیریت با موفقیت انجام شد");

    await loadStats();

  }catch(e){
    console.error("ADMIN LOGIN ERROR:",e);
    showMessage("خطا در ورود مدیریت: "+e.message,true);
  }finally{
    button.disabled=false;
    button.textContent="ورود مدیریت";
  }
}

async function adminFetch(url,options={}){
  options.headers=options.headers||{};
  options.headers["Content-Type"]="application/json";
  options.headers["Authorization"]="Admin "+adminToken;

  const r=await fetch(url,options);
  const text=await r.text();

  let data;

  try{
    data=JSON.parse(text);
  }catch(e){
    throw new Error("پاسخ نامعتبر پنل مدیریت");
  }

  if(!r.ok){
    if(r.status===401){
      adminLogout();
    }
    throw new Error(data.error||"خطای مدیریت");
  }

  return data;
}

function adminTab(name){
  const tabs=[
    "stats",
    "users",
    "payments",
    "withdrawals"
  ];

  tabs.forEach(x=>{
    const el=$("admin"+x.charAt(0).toUpperCase()+x.slice(1));
    if(el){
      el.classList.toggle("hidden",x!==name);
    }
  });

  if(name==="stats")loadStats();
  if(name==="users")loadUsers();
  if(name==="payments")loadPayments();
  if(name==="withdrawals")loadWithdrawals();
}

async function loadStats(){
  try{
    const data=await adminFetch("/api/admin/stats");

    $("statUsers").textContent=
      Number(data.users||0).toLocaleString("fa-IR");

    $("statBalance").textContent=
      formatMoney(data.balance||0);

    $("statWithdrawals").textContent=
      Number(data.pendingWithdrawals||0).toLocaleString("fa-IR");

    $("statPayments").textContent=
      Number(data.pendingPayments||0).toLocaleString("fa-IR");

  }catch(e){
    showMessage(e.message,true);
  }
}

async function loadUsers(){
  try{
    const data=await adminFetch("/api/admin/users");
    const users=data.users||[];

    $("usersTable").innerHTML=
      "<table>"+
      "<tr><th>ID</th><th>نام</th><th>ایمیل</th><th>موجودی</th><th>پلن</th><th>وضعیت</th><th>عملیات</th></tr>"+
      users.map(u=>
        "<tr>"+
        "<td>"+u.id+"</td>"+
        "<td>"+escapeHtml(u.name||"")+"</td>"+
        "<td>"+escapeHtml(u.email||"")+"</td>"+
        "<td>"+formatMoney(u.balance)+"</td>"+
        "<td>"+escapeHtml(planName(u.plan))+"</td>"+
        "<td>"+escapeHtml(u.status||"فعال")+"</td>"+
        "<td>"+
        "<button onclick='changeStatus("+u.id+",\"فعال\")'>فعال</button>"+
        "<button class='danger' onclick='changeStatus("+u.id+",\"مسدود\")'>مسدود</button>"+
        "</td>"+
        "</tr>"
      ).join("")+
      "</table>";

  }catch(e){
    showMessage(e.message,true);
  }
}

async function changeStatus(id,status){
  try{
    const data=await adminFetch("/api/admin/user-status",{
      method:"POST",
      body:JSON.stringify({id,status})
    });

    showMessage(data.message||"وضعیت تغییر کرد");
    loadUsers();
  }catch(e){
    showMessage(e.message,true);
  }
}

async function loadPayments(){
  try{
    const data=await adminFetch("/api/admin/payments");
    const rows=data.payments||[];

    $("paymentsTable").innerHTML=
      "<table>"+
      "<tr><th>ID</th><th>کاربر</th><th>مبلغ</th><th>وضعیت</th><th>تاریخ</th></tr>"+
      rows.map(x=>
        "<tr>"+
        "<td>"+x.id+"</td>"+
        "<td>"+escapeHtml(x.username||"")+"</td>"+
        "<td>"+formatMoney(x.amount)+"</td>"+
        "<td>"+escapeHtml(x.status||"")+"</td>"+
        "<td>"+escapeHtml(x.created_at||"")+"</td>"+
        "</tr>"
      ).join("")+
      "</table>";

  }catch(e){
    showMessage(e.message,true);
  }
}

async function loadWithdrawals(){
  try{
    const data=await adminFetch("/api/admin/withdrawals");
    const rows=data.withdrawals||[];

    $("withdrawalsTable").innerHTML=
      "<table>"+
      "<tr><th>ID</th><th>کاربر</th><th>مبلغ</th><th>روش</th><th>آدرس</th><th>وضعیت</th><th>عملیات</th></tr>"+
      rows.map(x=>
        "<tr>"+
        "<td>"+x.id+"</td>"+
        "<td>"+escapeHtml(x.username||"")+"</td>"+
        "<td>"+formatMoney(x.amount)+"</td>"+
        "<td>"+escapeHtml(x.method||"")+"</td>"+
        "<td>"+escapeHtml(x.address||"")+"</td>"+
        "<td>"+escapeHtml(x.status||"")+"</td>"+
        "<td>"+
        "<button class='success' onclick='withdrawalStatus("+x.id+",\"approved\")'>تأیید</button>"+
        "<button class='danger' onclick='withdrawalStatus("+x.id+",\"rejected\")'>رد</button>"+
        "</td>"+
        "</tr>"
      ).join("")+
      "</table>";

  }catch(e){
    showMessage(e.message,true);
  }
}

async function withdrawalStatus(id,status){
  try{
    const data=await adminFetch("/api/admin/withdrawal-status",{
      method:"POST",
      body:JSON.stringify({id,status})
    });

    showMessage(data.message||"وضعیت برداشت تغییر کرد");
    loadWithdrawals();
    loadStats();
  }catch(e){
    showMessage(e.message,true);
  }
}

function adminLogout(){
  adminToken="";
  localStorage.removeItem("admin_token");
  $("adminPanel").classList.add("hidden");
  $("adminLogin").classList.remove("hidden");
  $("adminPassword").value="";
}

function escapeHtml(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

window.addEventListener("load",async()=>{
  await loadMe();

  if(adminToken){
    try{
      await loadStats();
      $("adminLogin").classList.add("hidden");
      $("adminPanel").classList.remove("hidden");
    }catch(e){
      adminLogout();
    }
  }
});
</script>
</body>
</html>`;

export default {
  async fetch(request, env) {
    try {
      if (!env.DB) {
        return json({
          ok:false,
          error:"D1 binding با نام DB متصل نیست."
        },500);
      }

      await initDB(env.DB);

      const url = new URL(request.url);
      const path = url.pathname;
      const method = request.method;

      if (
        path === "/" ||
        path === "/index.html"
      ) {
        return new Response(HTML,{
          headers:{
            "Content-Type":"text/html;charset=UTF-8"
          }
        });
      }

      if(path === "/api/register" && method==="POST"){
        return register(request,env);
      }

      if(path === "/api/login" && method==="POST"){
        return login(request,env);
      }

      if(path === "/api/logout" && method==="POST"){
        return logout(request,env);
      }

      if(path === "/api/me" && method==="GET"){
        return me(request,env);
      }

      if(path === "/api/profile" && method==="POST"){
        return profile(request,env);
      }

      if(path === "/api/transactions" && method==="GET"){
        return transactions(request,env);
      }

      if(path === "/api/withdraw" && method==="POST"){
        return withdrawAPI(request,env);
      }

      if(path === "/api/forgot-password" && method==="POST"){
        return forgotPasswordAPI(request,env);
      }

      if(path === "/api/reset-password" && method==="POST"){
        return resetPasswordAPI(request,env);
      }

      if(path === "/api/ai" && method==="POST"){
        return ai(request,env);
      }

      if(path === "/api/payment/start" && method==="POST"){
        return paymentStart(request,env);
      }

      if(path === "/api/admin/login" && method==="POST"){
        return adminLoginAPI(request,env);
      }

      if(path === "/api/admin/users" && method==="GET"){
        return adminUsers(request,env);
      }

      if(path === "/api/admin/user-status" && method==="POST"){
        return adminUserStatus(request,env);
      }

      if(path === "/api/admin/balance" && method==="POST"){
        return adminBalance(request,env);
      }

      if(path === "/api/admin/payments" && method==="GET"){
        return adminPayments(request,env);
      }

      if(path === "/api/admin/withdrawals" && method==="GET"){
        return adminWithdrawals(request,env);
      }

      if(path === "/api/admin/withdrawal-status" && method==="POST"){
        return adminWithdrawalStatus(request,env);
      }

      if(path === "/api/admin/stats" && method==="GET"){
        return adminStats(request,env);
      }

      return json({
        ok:false,
        error:"مسیر پیدا نشد"
      },404);

    } catch(error) {
      return json({
        ok:false,
        error:"خطای داخلی سرور",
        detail:error.message
      },500);
    }
  }
};

function json(data,status=200){
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers:{
        "Content-Type":"application/json;charset=UTF-8",
        "Access-Control-Allow-Origin":"*",
        "Access-Control-Allow-Headers":"Content-Type, Authorization"
      }
    }
  );
}

async function body(request){
  try{
    return await request.json();
  }catch(e){
    return {};
  }
}

function clean(value){
  return String(value??"").trim();
}

async function hash(value){
  const data=new TextEncoder().encode(value);
  const digest=await crypto.subtle.digest("SHA-256",data);
  return [...new Uint8Array(digest)]
    .map(b=>b.toString(16).padStart(2,"0"))
    .join("");
}

function randomToken(){
  const bytes=new Uint8Array(32);
  crypto.getRandomValues(bytes);

  return [...bytes]
    .map(b=>b.toString(16).padStart(2,"0"))
    .join("");
}

async function initDB(db){

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      balance REAL DEFAULT 0,
      plan TEXT DEFAULT 'free',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      email TEXT,
      password_hash TEXT,
      status TEXT DEFAULT 'فعال',
      name TEXT DEFAULT ''
    )
  `).run();

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
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
    CREATE TABLE IF NOT EXISTS deposits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS withdrawals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      method TEXT DEFAULT 'USDT',
      address TEXT DEFAULT ''
    )
  `).run();

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      plan TEXT NOT NULL,
      price REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS reset_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

async function getToken(request){
  const auth=request.headers.get("Authorization")||"";

  if(auth.startsWith("Bearer ")){
    return auth.slice(7).trim();
  }

  return "";
}

async function getUser(request,env){
  const token=await getToken(request);

  if(!token)return null;

  const row=await env.DB
    .prepare(`
      SELECT
        u.*
      FROM sessions s
      JOIN users u
        ON u.id=s.user_id
      WHERE s.token=?
      LIMIT 1
    `)
    .bind(token)
    .first();

  return row||null;
}

function publicUser(user){
  return {
    id:user.id,
    name:user.name||"",
    username:user.username,
    email:user.email||"",
    balance:Number(user.balance||0),
    plan:user.plan||"free",
    status:user.status||"فعال",
    created_at:user.created_at
  };
}

async function register(request,env){
  const b=await body(request);

  const name=clean(b.name);
  const email=clean(b.email).toLowerCase();
  const password=String(b.password||"");

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

  const exists=await env.DB
    .prepare(`
      SELECT id
      FROM users
      WHERE lower(email)=?
      LIMIT 1
    `)
    .bind(email)
    .first();

  if(exists){
    return json({
      ok:false,
      error:"این ایمیل قبلاً ثبت شده است."
    },409);
  }

  const passwordHash=await hash(password);

  const result=await env.DB
    .prepare(`
      INSERT INTO users
      (username,name,email,password_hash,balance,plan,status)
      VALUES(?,?,?, ?,0,'free','فعال')
    `)
    .bind(
      email,
      name,
      email,
      passwordHash
    )
    .run();

  const userId=result.meta.last_row_id;

  const token=randomToken();

  await env.DB
    .prepare(`
      INSERT INTO sessions
      (user_id,token)
      VALUES(?,?)
    `)
    .bind(userId,token)
    .run();

  return json({
    ok:true,
    token,
    message:"ثبت‌نام با موفقیت انجام شد."
  });
}

async function login(request,env){
  const b=await body(request);

  const email=clean(b.email).toLowerCase();
  const password=String(b.password||"");

  if(!email||!password){
    return json({
      ok:false,
      error:"ایمیل و رمز عبور را وارد کنید."
    },400);
  }

  const passwordHash=await hash(password);

  const user=await env.DB
    .prepare(`
      SELECT *
      FROM users
      WHERE lower(email)=?
      AND password_hash=?
      LIMIT 1
    `)
    .bind(email,passwordHash)
    .first();

  if(!user){
    return json({
      ok:false,
      error:"ایمیل یا رمز عبور اشتباه است."
    },401);
  }

  if(user.status==="مسدود"){
    return json({
      ok:false,
      error:"حساب شما مسدود است."
    },403);
  }

  const token=randomToken();

  await env.DB
    .prepare(`
      INSERT INTO sessions
      (user_id,token)
      VALUES(?,?)
    `)
    .bind(user.id,token)
    .run();

  return json({
    ok:true,
    token,
    user:publicUser(user)
  });
}

async function logout(request,env){
  const token=await getToken(request);

  if(token){
    await env.DB
      .prepare(`
        DELETE FROM sessions
        WHERE token=?
      `)
      .bind(token)
      .run();
  }

  return json({
    ok:true
  });
}

async function me(request,env){
  const user=await getUser(request,env);

  if(!user){
    return json({
      ok:false,
      error:"وارد حساب نشده‌اید."
    },401);
  }

  return json({
    ok:true,
    user:publicUser(user)
  });
}

async function profile(request,env){
  const user=await getUser(request,env);

  if(!user){
    return json({
      ok:false,
      error:"وارد حساب نشده‌اید."
    },401);
  }

  const b=await body(request);

  const name=clean(b.name);
  const email=clean(b.email).toLowerCase();

  if(!name||!email){
    return json({
      ok:false,
      error:"نام و ایمیل الزامی است."
    },400);
  }

  const exists=await env.DB
    .prepare(`
      SELECT id
      FROM users
      WHERE lower(email)=?
      AND id<>?
      LIMIT 1
    `)
    .bind(email,user.id)
    .first();

  if(exists){
    return json({
      ok:false,
      error:"این ایمیل قبلاً استفاده شده است."
    },409);
  }

  await env.DB
    .prepare(`
      UPDATE users
      SET name=?,email=?,username=?
      WHERE id=?
    `)
    .bind(
      name,
      email,
      email,
      user.id
    )
    .run();

  return json({
    ok:true,
    message:"اطلاعات با موفقیت ذخیره شد."
  });
}

async function transactions(request,env){
  const user=await getUser(request,env);

  if(!user){
    return json({
      ok:false,
      error:"وارد حساب نشده‌اید."
    },401);
  }

  const result=await env.DB
    .prepare(`
      SELECT *
      FROM transactions
      WHERE user_id=?
      ORDER BY id DESC
      LIMIT 100
    `)
    .bind(user.id)
    .all();

  return json({
    ok:true,
    transactions:result.results||[]
  });
}

async function withdrawAPI(request,env){
  const user=await getUser(request,env);

  if(!user){
    return json({
      ok:false,
      error:"وارد حساب نشده‌اید."
    },401);
  }

  const b=await body(request);

  const amount=Number(b.amount);
  const method=clean(b.method)||"USDT";
  const address=clean(b.address);

  if(!Number.isFinite(amount)||amount<10000){
    return json({
      ok:false,
      error:"حداقل برداشت 10,000 تومان است."
    },400);
  }

  if(amount>Number(user.balance||0)){
    return json({
      ok:false,
      error:"موجودی کافی نیست."
    },400);
  }

  if(!address){
    return json({
      ok:false,
      error:"اطلاعات دریافت وجه را وارد کنید."
    },400);
  }

  await env.DB.batch([

    env.DB.prepare(`
      UPDATE users
      SET balance=balance-?
      WHERE id=?
    `).bind(amount,user.id),

    env.DB.prepare(`
      INSERT INTO withdrawals
      (username,amount,status,method,address)
      VALUES(?,?,'pending',?,?)
    `).bind(
      user.username,
      amount,
      method,
      address
    ),

    env.DB.prepare(`
      INSERT INTO transactions
      (user_id,type,amount,description)
      VALUES(?,'withdraw',?,?)
    `).bind(
      user.id,
      amount,
      "درخواست برداشت"
    )

  ]);

  return json({
    ok:true,
    message:"درخواست برداشت ثبت شد و در انتظار بررسی مدیریت است."
  });
}

async function forgotPasswordAPI(request,env){
  const b=await body(request);
  const email=clean(b.email).toLowerCase();

  if(!email){
    return json({
      ok:false,
      error:"ایمیل را وارد کنید."
    },400);
  }

  const user=await env.DB
    .prepare(`
      SELECT id
      FROM users
      WHERE lower(email)=?
      LIMIT 1
    `)
    .bind(email)
    .first();

  if(!user){
    return json({
      ok:false,
      error:"حسابی با این ایمیل پیدا نشد."
    },404);
  }

  const code=String(
    Math.floor(100000+Math.random()*900000)
  );

  await env.DB
    .prepare(`
      DELETE FROM reset_codes
      WHERE email=?
    `)
    .bind(email)
    .run();

  await env.DB
    .prepare(`
      INSERT INTO reset_codes
      (email,code)
      VALUES(?,?)
    `)
    .bind(email,code)
    .run();

  return json({
    ok:true,
    message:"کد بازیابی ایجاد شد.",
    development_code:code
  });
}

async function resetPasswordAPI(request,env){
  const b=await body(request);

  const email=clean(b.email).toLowerCase();
  const code=clean(b.code);
  const password=String(b.password||"");

  if(!email||!code||!password){
    return json({
      ok:false,
      error:"اطلاعات را کامل وارد کنید."
    },400);
  }

  if(password.length<6){
    return json({
      ok:false,
      error:"رمز جدید باید حداقل ۶ کاراکتر باشد."
    },400);
  }

  const row=await env.DB
    .prepare(`
      SELECT *
      FROM reset_codes
      WHERE email=?
      AND code=?
      ORDER BY id DESC
      LIMIT 1
    `)
    .bind(email,code)
    .first();

  if(!row){
    return json({
      ok:false,
      error:"کد بازیابی اشتباه است."
    },400);
  }

  const passwordHash=await hash(password);

  await env.DB
    .prepare(`
      UPDATE users
      SET password_hash=?
      WHERE lower(email)=?
    `)
    .bind(passwordHash,email)
    .run();

  await env.DB
    .prepare(`
      DELETE FROM reset_codes
      WHERE email=?
    `)
    .bind(email)
    .run();

  return json({
    ok:true,
    message:"رمز عبور با موفقیت تغییر کرد."
  });
}

async function ai(request,env){
  const user=await getUser(request,env);

  if(!user){
    return json({
      ok:false,
      error:"برای استفاده از هوش مصنوعی ابتدا وارد شوید."
    },401);
  }

  if(!env.AI){
    return json({
      ok:false,
      error:"Workers AI binding با نام AI متصل نیست."
    },500);
  }

  const b=await body(request);
  const prompt=clean(b.prompt);

  if(!prompt){
    return json({
      ok:false,
      error:"متن سؤال خالی است."
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
              "تو یک دستیار هوش مصنوعی فارسی، دقیق، مفید و محترم هستی. پاسخ‌ها را به زبان فارسی ارائه کن."
          },
          {
            role:"user",
            content:prompt
          }
        ]
      }
    );

    const answer=
      result?.response||
      result?.result?.response||
      JSON.stringify(result);

    return json({
      ok:true,
      answer
    });

  }catch(error){
    return json({
      ok:false,
      error:"خطا در اجرای هوش مصنوعی",
      detail:error.message
    },500);
  }
}

async function paymentStart(request,env){
  const user=await getUser(request,env);

  if(!user){
    return json({
      ok:false,
      error:"ابتدا وارد حساب شوید."
    },401);
  }

  const b=await body(request);

  const amount=Number(b.amount);
  const plan=clean(b.plan)||"deposit";

  if(!Number.isFinite(amount)||amount<=0){
    return json({
      ok:false,
      error:"مبلغ پرداخت نامعتبر است."
    },400);
  }

  await env.DB.batch([

    env.DB.prepare(`
      INSERT INTO deposits
      (username,amount,status)
      VALUES(? ,?,'pending')
    `).bind(
      user.username,
      amount
    ),

    env.DB.prepare(`
      INSERT INTO subscriptions
      (username,plan,price,status)
      VALUES(?,?,?,'pending')
    `).bind(
      user.username,
      plan,
      amount
    )

  ]);

  return json({
    ok:true,
    message:
      "درخواست پرداخت ثبت شد. درگاه زرین‌پال هنوز به Worker متصل نشده است."
  });
}

async function adminOK(request,env){
  const auth=request.headers.get("Authorization")||"";

  if(!auth.startsWith("Admin ")){
    return false;
  }

  const supplied=auth.slice(6).trim();

  if(!supplied){
    return false;
  }

  if(
    env.ADMIN_PASSWORD &&
    supplied===env.ADMIN_PASSWORD
  ){
    return true;
  }

  const sessions=globalThis.__ADMIN_SESSIONS||
    (globalThis.__ADMIN_SESSIONS=new Map());

  const item=sessions.get(supplied);

  if(!item){
    return false;
  }

  if(Date.now()-item.createdAt>12*60*60*1000){
    sessions.delete(supplied);
    return false;
  }

  return true;
}

async function adminLoginAPI(request,env){
  const b=await body(request);
  const password=String(b.password||"");

  if(
    !env.ADMIN_PASSWORD ||
    password!==env.ADMIN_PASSWORD
  ){
    return json({
      ok:false,
      error:"رمز مدیریت صحیح نیست."
    },401);
  }

  const token=randomToken();

  const sessions=globalThis.__ADMIN_SESSIONS||
    (globalThis.__ADMIN_SESSIONS=new Map());

  sessions.set(token,{
    createdAt:Date.now()
  });

  return json({
    ok:true,
    token
  });
}

async function adminUsers(request,env){
  if(!(await adminOK(request,env))){
    return json({
      ok:false,
      error:"دسترسی مدیریت غیرمجاز است."
    },401);
  }

  const result=await env.DB
    .prepare(`
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
    `)
    .all();

  return json({
    ok:true,
    users:result.results||[]
  });
}

async function adminUserStatus(request,env){
  if(!(await adminOK(request,env))){
    return json({
      ok:false,
      error:"دسترسی غیرمجاز"
    },401);
  }

  const b=await body(request);

  const id=Number(b.id);
  const status=clean(b.status);

  if(!id||!status){
    return json({
      ok:false,
      error:"اطلاعات ناقص است."
    },400);
  }

  await env.DB
    .prepare(`
      UPDATE users
      SET status=?
      WHERE id=?
    `)
    .bind(status,id)
    .run();

  return json({
    ok:true,
    message:"وضعیت کاربر تغییر کرد."
  });
}

async function adminBalance(request,env){
  if(!(await adminOK(request,env))){
    return json({
      ok:false,
      error:"دسترسی غیرمجاز"
    },401);
  }

  const b=await body(request);

  const id=Number(b.id);
  const amount=Number(b.amount);

  if(!id||!Number.isFinite(amount)){
    return json({
      ok:false,
      error:"اطلاعات موجودی نامعتبر است."
    },400);
  }

  await env.DB
    .prepare(`
      UPDATE users
      SET balance=balance+?
      WHERE id=?
    `)
    .bind(amount,id)
    .run();

  if(amount!==0){
    await env.DB
      .prepare(`
        INSERT INTO transactions
        (user_id,type,amount,description)
        VALUES(?,'admin_balance',?,?)
      `)
      .bind(
        id,
        Math.abs(amount),
        amount>0
          ?"افزایش موجودی توسط مدیریت"
          :"کاهش موجودی توسط مدیریت"
      )
      .run();
  }

  return json({
    ok:true,
    message:"موجودی تغییر کرد."
  });
}

async function adminPayments(request,env){
  if(!(await adminOK(request,env))){
    return json({
      ok:false,
      error:"دسترسی غیرمجاز"
    },401);
  }

  const result=await env.DB
    .prepare(`
      SELECT *
      FROM deposits
      ORDER BY id DESC
      LIMIT 200
    `)
    .all();

  return json({
    ok:true,
    payments:result.results||[]
  });
}

async function adminWithdrawals(request,env){
  if(!(await adminOK(request,env))){
    return json({
      ok:false,
      error:"دسترسی غیرمجاز"
    },401);
  }

  const result=await env.DB
    .prepare(`
      SELECT *
      FROM withdrawals
      ORDER BY id DESC
      LIMIT 200
    `)
    .all();

  return json({
    ok:true,
    withdrawals:result.results||[]
  });
}

async function adminWithdrawalStatus(request,env){
  if(!(await adminOK(request,env))){
    return json({
      ok:false,
      error:"دسترسی غیرمجاز"
    },401);
  }

  const b=await body(request);

  const id=Number(b.id);
  const status=clean(b.status);

  if(!id||!["approved","rejected"].includes(status)){
    return json({
      ok:false,
      error:"وضعیت نامعتبر است."
    },400);
  }

  const withdrawal=await env.DB
    .prepare(`
      SELECT *
      FROM withdrawals
      WHERE id=?
      LIMIT 1
    `)
    .bind(id)
    .first();

  if(!withdrawal){
    return json({
      ok:false,
      error:"درخواست برداشت پیدا نشد."
    },404);
  }

  if(
    withdrawal.status==="approved"||
    withdrawal.status==="rejected"
  ){
    return json({
      ok:false,
      error:"این درخواست قبلاً تعیین تکلیف شده است."
    },400);
  }

  if(status==="approved"){

    await env.DB
      .prepare(`
        UPDATE withdrawals
        SET status='approved'
        WHERE id=?
      `)
      .bind(id)
      .run();

    return json({
      ok:true,
      message:"برداشت تأیید شد."
    });
  }

  const user=await env.DB
    .prepare(`
      SELECT *
      FROM users
      WHERE username=?
      LIMIT 1
    `)
    .bind(withdrawal.username)
    .first();

  if(user){

    await env.DB.batch([

      env.DB.prepare(`
        UPDATE withdrawals
        SET status='rejected'
        WHERE id=?
      `).bind(id),

      env.DB.prepare(`
        UPDATE users
        SET balance=balance+?
        WHERE id=?
      `).bind(
        Number(withdrawal.amount),
        user.id
      ),

      env.DB.prepare(`
        INSERT INTO transactions
        (user_id,type,amount,description)
        VALUES(?,'withdraw_refund',?,?)
      `).bind(
        user.id,
        Number(withdrawal.amount),
        "برگشت مبلغ برداشت ردشده"
      )

    ]);

  }else{

    await env.DB
      .prepare(`
        UPDATE withdrawals
        SET status='rejected'
        WHERE id=?
      `)
      .bind(id)
      .run();
  }

  return json({
    ok:true,
    message:"برداشت رد شد و مبلغ به موجودی کاربر برگشت."
  });
}

async function adminStats(request,env){
  if(!(await adminOK(request,env))){
    return json({
      ok:false,
      error:"دسترسی غیرمجاز"
    },401);
  }

  const users=await env.DB
    .prepare(`
      SELECT COUNT(*) AS count
      FROM users
    `)
    .first();

  const balance=await env.DB
    .prepare(`
      SELECT COALESCE(SUM(balance),0) AS total
      FROM users
    `)
    .first();

  const withdrawals=await env.DB
    .prepare(`
      SELECT COUNT(*) AS count
      FROM withdrawals
      WHERE status='pending'
    `)
    .first();

  const payments=await env.DB
    .prepare(`
      SELECT COUNT(*) AS count
      FROM deposits
      WHERE status='pending'
    `)
    .first();

  return json({
    ok:true,
    users:Number(users?.count||0),
    balance:Number(balance?.total||0),
    pendingWithdrawals:Number(withdrawals?.count||0),
    pendingPayments:Number(payments?.count||0)
  });
}
      
