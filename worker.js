
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

header{
background:#111827;
color:#fff;
padding:18px;
text-align:center;
position:sticky;
top:0;
z-index:20
}

header h1{margin:0;font-size:22px}
header p{margin:7px 0 0;color:#cbd5e1;font-size:13px}

.container{
max-width:1000px;
margin:auto;
padding:15px
}

.card{
background:#fff;
border-radius:18px;
padding:16px;
margin:12px 0;
box-shadow:0 5px 20px rgba(0,0,0,.06)
}

h2,h3{margin-top:0}

input,textarea,select{
width:100%;
padding:13px;
border:1px solid #d7deea;
border-radius:12px;
margin:6px 0 10px;
font-family:inherit;
font-size:15px;
outline:none
}

input:focus,textarea:focus,select:focus{
border-color:#2563eb
}

textarea{
min-height:110px;
resize:vertical
}

button{
border:0;
border-radius:12px;
padding:12px 16px;
cursor:pointer;
font-family:inherit;
font-size:14px;
margin:4px
}

button:disabled{
opacity:.6;
cursor:not-allowed
}

.primary{background:#2563eb;color:#fff}
.green{background:#16a34a;color:#fff}
.red{background:#dc2626;color:#fff}
.gray{background:#e5e7eb;color:#111827}
.dark{background:#111827;color:#fff}
.orange{background:#f59e0b;color:#fff}
.purple{background:#7c3aed;color:#fff}

.hidden{display:none!important}

.small{
font-size:12px;
color:#64748b
}

.ok{color:#15803d}
.err{color:#b91c1c}

.balance{
font-size:32px;
font-weight:bold;
margin:8px 0
}

.grid{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:10px
}

.stat{
background:#f8fafc;
padding:15px;
border-radius:14px;
text-align:center;
overflow:hidden
}

.panelMenu{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:10px;
margin:15px 0
}

.panelBtn{
margin:0;
min-height:90px;
font-weight:bold
}

.panelBtn span{
display:block;
font-size:25px;
margin-bottom:6px
}

.profileBox{
background:#eef2ff;
padding:15px;
border-radius:15px
}

.balanceBox{
background:#f0fdf4;
padding:18px;
border-radius:15px;
margin-top:12px
}

.incomeBox{
background:#eff6ff;
padding:18px;
border-radius:15px;
margin-top:12px
}

.withdrawBox{
background:#fff7ed;
padding:15px;
border-radius:15px
}

.adminItem{
background:#f8fafc;
padding:14px;
border-radius:14px;
margin:10px 0;
overflow:hidden
}

.msg{
padding:12px;
border-radius:14px;
margin:8px 0;
line-height:1.8;
white-space:pre-wrap;
word-break:break-word
}

.chat{
min-height:280px;
max-height:500px;
overflow:auto;
padding:8px
}

.user{
background:#dbeafe;
margin-right:10%
}

.bot{
background:#f1f5f9;
margin-left:10%
}

.badge{
display:inline-block;
padding:5px 10px;
border-radius:20px;
background:#dcfce7;
color:#166534;
font-size:12px
}

.divider{
height:1px;
background:#e5e7eb;
margin:15px 0
}

.sectionTitle{
font-size:18px;
font-weight:bold;
margin-bottom:10px
}

.notice{
padding:12px;
border-radius:12px;
background:#fff7ed;
color:#9a3412;
margin:10px 0;
line-height:1.8
}

.address{
word-break:break-all;
direction:ltr;
text-align:left;
background:#fff;
padding:8px;
border-radius:8px
}

.topActions{
display:flex;
gap:6px;
flex-wrap:wrap;
margin-top:10px
}

.menuTitle{
font-size:15px;
font-weight:bold;
margin-top:18px;
margin-bottom:8px
}

.dangerBox{
background:#fef2f2;
padding:14px;
border-radius:14px;
margin-top:12px
}

.infoRow{
display:flex;
justify-content:space-between;
gap:10px;
padding:10px 0;
border-bottom:1px solid #e5e7eb
}

.infoRow:last-child{
border-bottom:0
}

@media(max-width:700px){

.grid{
grid-template-columns:repeat(2,1fr)
}

.panelMenu{
grid-template-columns:repeat(2,1fr)
}

}

@media(max-width:420px){

.grid{
grid-template-columns:1fr
}

.panelMenu{
grid-template-columns:1fr
}

}
</style>
</head>

<body>

<header>
<h1>🤖 دستیار هوش مصنوعی</h1>
<p>حساب کاربری • درآمد • موجودی • تراکنش • برداشت</p>
</header>

<div class="container">

<!-- AUTH -->

<div id="authBox" class="card">

<h2>👤 حساب کاربری</h2>

<div id="loginForm">

<label>ایمیل</label>
<input id="loginEmail" type="email" placeholder="ایمیل">

<label>رمز عبور</label>
<input id="loginPassword" type="password" placeholder="رمز عبور">

<div class="topActions">
<button class="primary" onclick="login()">🔐 ورود</button>
<button class="gray" onclick="showRegister()">📝 ثبت‌نام</button>
</div>

</div>

<div id="registerForm" class="hidden">

<label>نام کامل</label>
<input id="regName" placeholder="نام کامل">

<label>ایمیل</label>
<input id="regEmail" type="email" placeholder="ایمیل">

<label>رمز عبور</label>
<input id="regPassword" type="password" placeholder="حداقل ۶ کاراکتر">

<div class="topActions">
<button class="green" onclick="register()">📝 ایجاد حساب</button>
<button class="gray" onclick="showLogin()">↩️ بازگشت</button>
</div>

</div>

<div id="authMsg" class="small"></div>

</div>


<!-- USER APP -->

<div id="appBox" class="hidden">

<div class="card">

<div class="profileBox">

<div class="small">👤 حساب کاربری</div>

<h3 id="userName">-</h3>

<span id="accountStatus" class="badge">فعال</span>

</div>

<div class="balanceBox">

<div class="small">💵 موجودی فعلی</div>

<div id="balance" class="balance">$0.00</div>

</div>

<div class="incomeBox">

<div class="small">📈 درآمد کل</div>

<div id="totalIncome" class="balance">$0.00</div>

</div>


<div class="sectionTitle" style="margin-top:18px">
📱 پنل کاربری
</div>


<div class="panelMenu">

<button class="panelBtn primary" onclick="showDashboard()">
<span>🏠</span>
داشبورد
</button>

<button class="panelBtn purple" onclick="showAI()">
<span>🤖</span>
دستیار هوش مصنوعی
</button>

<button class="panelBtn green" onclick="showWithdraw()">
<span>💵</span>
برداشت
</button>

<button class="panelBtn orange" onclick="loadTransactions()">
<span>📊</span>
تراکنش‌ها
</button>

<button class="panelBtn dark" onclick="loadIncome()">
<span>📈</span>
درآمد من
</button>

<button class="panelBtn primary" onclick="showProfile()">
<span>👤</span>
پروفایل من
</button>

<button class="panelBtn orange" onclick="showBalance()">
<span>💰</span>
موجودی حساب
</button>

<button class="panelBtn purple" onclick="showChangePassword()">
<span>🔐</span>
تغییر رمز
</button>

<button class="panelBtn gray" onclick="refreshAccount()">
<span>🔄</span>
به‌روزرسانی
</button>

<button class="panelBtn red" onclick="logout()">
<span>🚪</span>
خروج
</button>

</div>

</div>


<!-- DASHBOARD -->

<div id="dashboardBox" class="card">

<h2>🏠 داشبورد</h2>

<div class="grid">

<div class="stat">
<div class="small">👤 نام</div>
<b id="dashboardName">-</b>
</div>

<div class="stat">
<div class="small">📧 ایمیل</div>
<b id="dashboardEmail">-</b>
</div>

<div class="stat">
<div class="small">💵 موجودی</div>
<b id="dashboardBalance">$0.00</b>
</div>

<div class="stat">
<div class="small">📈 درآمد</div>
<b id="dashboardIncome">$0.00</b>
</div>

</div>

<div class="notice">
موجودی و درآمد این حساب از D1 خوانده می‌شود.
ثبت‌نام به‌تنهایی موجودی ایجاد نمی‌کند.
درآمد باید توسط مدیریت ثبت شود.
</div>

</div>


<!-- AI -->

<div id="aiBox" class="card hidden">

<h2>🤖 دستیار هوش مصنوعی</h2>

<div id="chat" class="chat">

<div class="msg bot">
سلام! 👋
من دستیار هوش مصنوعی هستم.
سؤالت را بنویس.
</div>

</div>

<textarea id="question" placeholder="سؤال خود را بنویسید..."></textarea>

<button id="sendBtn" class="primary" onclick="askAI()">
📤 ارسال
</button>

<button class="gray" onclick="clearChat()">
🗑️ پاک کردن گفتگو
</button>

</div>


<!-- PROFILE -->

<div id="profileBox" class="card hidden">

<h2>👤 پروفایل من</h2>

<div class="infoRow">
<span>نام کامل</span>
<b id="profileName">-</b>
</div>

<div class="infoRow">
<span>ایمیل</span>
<b id="profileEmail">-</b>
</div>

<div class="infoRow">
<span>وضعیت حساب</span>
<b id="profileStatus">-</b>
</div>

<div class="infoRow">
<span>موجودی</span>
<b id="profileBalance">$0.00</b>
</div>

<div class="infoRow">
<span>درآمد کل</span>
<b id="profileIncome">$0.00</b>
</div>

</div>


<!-- BALANCE -->

<div id="balanceBox" class="card hidden">

<h2>💰 موجودی حساب</h2>

<div class="balanceBox">

<div class="small">
موجودی قابل برداشت
</div>

<div id="balanceBig" class="balance">
$0.00
</div>

</div>

<div class="incomeBox">

<div class="small">
درآمد کل ثبت‌شده
</div>

<div id="incomeBig" class="balance">
$0.00
</div>

</div>

<div class="notice">
حداقل برداشت: $10
</div>

<button class="green" onclick="showWithdraw()">
💵 درخواست برداشت
</button>

</div>


<!-- CHANGE PASSWORD -->

<div id="passwordBox" class="card hidden">

<h2>🔐 تغییر رمز عبور</h2>

<label>رمز فعلی</label>
<input id="oldPassword" type="password">

<label>رمز جدید</label>
<input id="newPassword" type="password" placeholder="حداقل ۶ کاراکتر">

<label>تکرار رمز جدید</label>
<input id="newPassword2" type="password">

<button class="purple" onclick="changePassword()">
🔐 تغییر رمز
</button>

<div id="passwordMsg" class="small"></div>

</div>


<!-- WITHDRAW -->

<div id="withdrawBox" class="card hidden">

<h2>💵 درخواست برداشت</h2>

<div class="withdrawBox">

<div class="small">
حداقل برداشت: $10
</div>

<label>مبلغ</label>

<input
id="withdrawAmount"
type="number"
min="10"
step="0.01"
placeholder="مثلاً 10"
>

<label>روش برداشت</label>

<select id="withdrawMethod">
<option value="USDT">USDT</option>
</select>

<label>شبکه</label>

<select id="withdrawNetwork">
<option value="TRC20">TRC20</option>
<option value="BEP20">BEP20</option>
<option value="ERC20">ERC20</option>
</select>

<label>آدرس کیف پول</label>

<input
id="withdrawAddress"
placeholder="آدرس کیف پول USDT"
>

<button class="green" onclick="withdraw()">
✅ ثبت درخواست
</button>

<button class="gray" onclick="showDashboard()">
بستن
</button>

<div id="withdrawMsg" class="small"></div>

</div>

</div>


<!-- TRANSACTIONS -->

<div id="transactionsBox" class="card hidden">

<h2>📊 تراکنش‌ها</h2>

<div id="transactions">
⏳ در حال دریافت...
</div>

</div>


<!-- INCOME -->

<div id="incomeBox" class="card hidden">

<h2>📈 درآمد من</h2>

<div class="grid">

<div class="stat">
<div class="small">درآمد کل</div>
<b id="incomeTotal">$0.00</b>
</div>

<div class="stat">
<div class="small">تعداد درآمدها</div>
<b id="incomeCount">0</b>
</div>

</div>

<div id="incomeList"></div>

</div>


<!-- ADMIN -->

<div id="adminBox" class="card">

<h2>🛠️ مدیریت</h2>

<label>
رمز مدیریت
</label>

<input
id="adminPassword"
type="password"
placeholder="رمز مدیریت"
>

<button class="dark" onclick="adminLogin()">
🔐 ورود مدیریت
</button>

<div id="adminMsg" class="small"></div>

<div id="adminPanel" class="hidden">

<div class="divider"></div>

<h3>🛠️ پنل مدیریت</h3>

<div class="panelMenu">

<button class="panelBtn gray" onclick="adminUsers()">
<span>👥</span>
کاربران
</button>

<button class="panelBtn green" onclick="adminIncome()">
<span>💰</span>
درآمدها
</button>

<button class="panelBtn orange" onclick="adminWithdrawals()">
<span>💵</span>
برداشت‌ها
</button>

<button class="panelBtn purple" onclick="adminStats()">
<span>📊</span>
آمار
</button>

<button class="panelBtn dark" onclick="adminDashboard()">
<span>🏠</span>
داشبورد مدیریت
</button>

<button class="panelBtn red" onclick="adminLogout()">
<span>🚪</span>
خروج مدیریت
</button>

</div>

<div id="adminResult"></div>

</div>

</div>

</div>


<script>

let token=localStorage.getItem("ai_token")||"";
let adminToken=localStorage.getItem("admin_token")||"";


async function api(path,options={}){

const headers={
"content-type":"application/json",
...(options.headers||{})
};

if(token){
headers.authorization="Bearer "+token;
}

if(adminToken){
headers["x-admin-token"]=adminToken;
}

try{

const res=await fetch(path,{
...options,
headers
});

let data;

try{
data=await res.json();
}catch(e){
data={
ok:false,
error:"پاسخ نامعتبر از سرور"
};
}

return data;

}catch(e){

return{
ok:false,
error:"خطا در اتصال به سرور"
};

}

}


function showRegister(){

document.getElementById("loginForm").classList.add("hidden");

document.getElementById("registerForm")
.classList.remove("hidden");

document.getElementById("authMsg").textContent="";

}


function showLogin(){

document.getElementById("registerForm")
.classList.add("hidden");

document.getElementById("loginForm")
.classList.remove("hidden");

document.getElementById("authMsg").textContent="";

}


function authMessage(text,ok=false){

const el=document.getElementById("authMsg");

el.textContent=text;

el.className=ok
?"small ok"
:"small err";

}


async function register(){

const name=document.getElementById("regName").value.trim();

const email=document.getElementById("regEmail")
.value.trim()
.toLowerCase();

const password=document.getElementById("regPassword").value;

if(!name){
authMessage("نام کامل را وارد کنید.");
return;
}

if(!email||!email.includes("@")){
authMessage("ایمیل معتبر وارد کنید.");
return;
}

if(password.length<6){
authMessage("رمز عبور باید حداقل ۶ کاراکتر باشد.");
return;
}

authMessage("⏳ در حال ایجاد حساب...",true);

const r=await api("/api/register",{
method:"POST",
body:JSON.stringify({
name,
email,
password
})
});

if(!r.ok){

authMessage(
r.error||"ثبت‌نام ناموفق بود."
);

return;
}

token=r.token;

localStorage.setItem(
"ai_token",
token
);

await loadMe();

}


async function login(){

const email=document.getElementById("loginEmail")
.value.trim()
.toLowerCase();

const password=document.getElementById("loginPassword").value;

if(!email||!password){

authMessage(
"ایمیل و رمز عبور را وارد کنید."
);

return;
}

authMessage("⏳ در حال ورود...",true);

const r=await api("/api/login",{
method:"POST",
body:JSON.stringify({
email,
password
})
});

if(!r.ok){

authMessage(
r.error||"ورود ناموفق بود."
);

return;
}

token=r.token;

localStorage.setItem(
"ai_token",
token
);

await loadMe();

}


async function loadMe(){

if(!token)return;

const r=await api("/api/me");

if(!r.ok){

localStorage.removeItem("ai_token");

token="";

document.getElementById("authBox")
.classList.remove("hidden");

document.getElementById("appBox")
.classList.add("hidden");

return;
}

document.getElementById("authBox")
.classList.add("hidden");

document.getElementById("appBox")
.classList.remove("hidden");


document.getElementById("userName")
.textContent=r.user.name;

document.getElementById("accountStatus")
.textContent=r.user.status||"فعال";


setMoney(
"balance",
r.user.balance
);

setMoney(
"dashboardBalance",
r.user.balance
);

setMoney(
"profileBalance",
r.user.balance
);

setMoney(
"balanceBig",
r.user.balance
);


document.getElementById("dashboardName")
.textContent=r.user.name;

document.getElementById("dashboardEmail")
.textContent=r.user.email;

document.getElementById("profileName")
.textContent=r.user.name;

document.getElementById("profileEmail")
.textContent=r.user.email;

document.getElementById("profileStatus")
.textContent=r.user.status||"فعال";


setMoney(
"totalIncome",
r.user.total_income
);

setMoney(
"dashboardIncome",
r.user.total_income
);

setMoney(
"profileIncome",
r.user.total_income
);

setMoney(
"incomeBig",
r.user.total_income
);

showDashboard();

}


function setMoney(id,value){

const el=document.getElementById(id);

if(!el)return;

el.textContent=
"$"+Number(value||0).toFixed(2);

}


async function refreshAccount(){

await loadMe();

}


function hideUserSections(){

[
"dashboardBox",
"aiBox",
"profileBox",
"balanceBox",
"passwordBox",
"withdrawBox",
"transactionsBox",
"incomeBox"
].forEach(id=>{

const el=document.getElementById(id);

if(el){
el.classList.add("hidden");
}

});

}


function showDashboard(){

hideUserSections();

document.getElementById("dashboardBox")
.classList.remove("hidden");

}


function showAI(){

hideUserSections();

document.getElementById("aiBox")
.classList.remove("hidden");

}


function showProfile(){

hideUserSections();

document.getElementById("profileBox")
.classList.remove("hidden");

}


function showBalance(){

hideUserSections();

document.getElementById("balanceBox")
.classList.remove("hidden");

}


function showChangePassword(){

hideUserSections();

document.getElementById("passwordBox")
.classList.remove("hidden");

}


function showWithdraw(){

hideUserSections();

document.getElementById("withdrawBox")
.classList.remove("hidden");

}


function addMessage(text,type){

const chat=document.getElementById("chat");

const div=document.createElement("div");

div.className="msg "+type;

div.textContent=text;

chat.appendChild(div);

chat.scrollTop=chat.scrollHeight;

}


async function askAI(){

const input=
document.getElementById("question");

const question=input.value.trim();

if(!question)return;

addMessage(question,"user");

input.value="";

const btn=
document.getElementById("sendBtn");

btn.disabled=true;

btn.textContent=
"⏳ در حال پاسخ...";

const r=await api("/api/ai",{
method:"POST",
body:JSON.stringify({
message:question
})
});

if(r.ok){

addMessage(
r.answer||"پاسخی دریافت نشد.",
"bot"
);

}else{

addMessage(
"❌ "+(r.error||"خطا در دریافت پاسخ"),
"bot"
);

}

btn.disabled=false;

btn.textContent="📤 ارسال";

}


function clearChat(){

document.getElementById("chat").innerHTML=
'<div class="msg bot">گفتگو پاک شد. سؤال جدیدت را بنویس.</div>';

}


async function withdraw(){

const amount=Number(
document.getElementById("withdrawAmount").value
);

const method=
document.getElementById("withdrawMethod").value;

const network=
document.getElementById("withdrawNetwork").value;

const address=
document.getElementById("withdrawAddress")
.value.trim();

const out=
document.getElementById("withdrawMsg");


if(!Number.isFinite(amount)||amount<10){

out.textContent=
"
