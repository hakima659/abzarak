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
background:#eef2f7;
color:#172033;
line-height:1.8
}

header{
background:#111827;
color:white;
padding:22px 15px;
text-align:center;
box-shadow:0 3px 15px #0002
}

header h1{
margin:0;
font-size:24px
}

header p{
margin:6px 0 0;
font-size:14px;
color:#d1d5db
}

.container{
width:100%;
max-width:1050px;
margin:auto;
padding:15px
}

.card{
background:#fff;
border-radius:20px;
padding:20px;
margin:15px 0;
box-shadow:0 5px 25px #0000000d
}

h2{
font-size:21px;
margin:0 0 18px
}

h3{
margin-top:0
}

label{
display:block;
font-weight:bold;
margin-top:10px
}

input,textarea,select{
display:block;
width:100%;
padding:14px;
border:1px solid #cbd5e1;
border-radius:13px;
margin:7px 0 12px;
font-family:inherit;
font-size:16px;
background:#fff;
color:#111827
}

input:focus,textarea:focus,select:focus{
outline:none;
border-color:#2563eb;
box-shadow:0 0 0 3px #2563eb18
}

textarea{
min-height:120px;
resize:vertical
}

button{
border:0;
border-radius:13px;
padding:13px 17px;
font-family:inherit;
font-size:15px;
font-weight:bold;
cursor:pointer;
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

.hidden{
display:none!important
}

.small{
font-size:13px;
color:#64748b
}

.ok{
color:#15803d!important
}

.err{
color:#b91c1c!important
}

.balance{
font-size:34px;
font-weight:900;
direction:ltr;
text-align:right;
margin:5px 0
}

.profileBox{
background:#eef2ff;
border:1px solid #c7d2fe;
padding:18px;
border-radius:16px
}

.balanceBox{
background:#f0fdf4;
border:1px solid #bbf7d0;
padding:18px;
border-radius:16px;
margin-top:12px
}

.incomeBox{
background:#eff6ff;
border:1px solid #bfdbfe;
padding:18px;
border-radius:16px;
margin-top:12px
}

.withdrawBox{
background:#fff7ed;
border:1px solid #fed7aa;
padding:18px;
border-radius:16px
}

.sectionTitle{
font-size:20px;
font-weight:900;
margin:22px 0 12px
}

.panelMenu{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:12px
}

.panelBtn{
margin:0;
min-height:105px;
display:flex;
align-items:center;
justify-content:center;
flex-direction:column;
font-size:15px
}

.panelBtn span{
font-size:30px;
line-height:1.2;
margin-bottom:7px
}

.grid{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:12px
}

.stat{
background:#f8fafc;
border:1px solid #e2e8f0;
padding:16px;
border-radius:15px;
text-align:center;
overflow:hidden
}

.stat b{
font-size:16px;
word-break:break-word
}

.notice{
background:#fff7ed;
border:1px solid #fed7aa;
color:#9a3412;
padding:14px;
border-radius:14px;
margin-top:16px
}

.adminItem{
background:#f8fafc;
border:1px solid #e2e8f0;
padding:16px;
border-radius:15px;
margin:12px 0;
overflow:hidden
}

.msg{
padding:13px;
border-radius:15px;
margin:9px 0;
line-height:1.9;
white-space:pre-wrap;
word-break:break-word
}

.chat{
min-height:280px;
max-height:500px;
overflow:auto;
padding:8px;
background:#f8fafc;
border-radius:15px
}

.user{
background:#dbeafe;
margin-right:8%
}

.bot{
background:#e2e8f0;
margin-left:8%
}

.badge{
display:inline-block;
padding:5px 11px;
border-radius:20px;
background:#dcfce7;
color:#166534;
font-size:12px
}

.divider{
height:1px;
background:#e5e7eb;
margin:20px 0
}

.topActions{
display:flex;
gap:6px;
flex-wrap:wrap
}

.address{
word-break:break-all;
direction:ltr;
text-align:left;
background:#fff;
padding:10px;
border-radius:8px;
margin-top:5px
}

.authTitle{
text-align:center;
font-size:24px;
margin-bottom:20px
}

@media(max-width:750px){
.panelMenu{
grid-template-columns:repeat(2,1fr)
}
.grid{
grid-template-columns:repeat(2,1fr)
}
}

@media(max-width:430px){
.container{
padding:8px
}

.card{
padding:15px;
border-radius:16px
}

.panelMenu{
grid-template-columns:1fr 1fr;
gap:8px
}

.panelBtn{
min-height:95px;
font-size:14px
}

.panelBtn span{
font-size:27px
}

.grid{
grid-template-columns:1fr
}

.balance{
font-size:29px
}

button{
font-size:14px
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

<div class="authTitle">👤 حساب کاربری</div>

<div id="loginForm">

<label>📧 ایمیل</label>
<input id="loginEmail" type="email" placeholder="ایمیل خود را وارد کنید">

<label>🔐 رمز عبور</label>
<input id="loginPassword" type="password" placeholder="رمز عبور">

<div class="topActions">
<button class="primary" onclick="login()">🔐 ورود</button>
<button class="gray" onclick="showRegister()">📝 ثبت‌نام</button>
</div>

</div>

<div id="registerForm" class="hidden">

<label>👤 نام کامل</label>
<input id="regName" placeholder="نام و نام خانوادگی">

<label>📧 ایمیل</label>
<input id="regEmail" type="email" placeholder="ایمیل">

<label>🔐 رمز عبور</label>
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
<div>وضعیت: <span id="accountStatus" class="badge">فعال</span></div>

</div>

<div class="balanceBox">

<div class="small">💵 موجودی فعلی</div>
<div id="balance" class="balance">$0.00</div>

</div>

<div class="incomeBox">

<div class="small">📈 درآمد کل</div>
<div id="totalIncome" class="balance">$0.00</div>

</div>


<div class="sectionTitle">📱 پنل کاربری</div>

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
درآمد
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
ℹ️ موجودی و درآمد از پایگاه داده D1 خوانده می‌شود.
ثبت‌نام به‌تنهایی پول ایجاد نمی‌کند.
درآمد واقعی باید از منبع واقعی یا توسط مدیریت ثبت شود.
</div>

</div>


<!-- AI -->

<div id="aiBox" class="card hidden">

<h2>🤖 دستیار هوش مصنوعی</h2>

<div id="chat" class="chat">

<div class="msg bot">
سلام! 👋
من دستیار هوش مصنوعی هستم.
سوالت را بنویس.
</div>

</div>

<textarea id="question" placeholder="سوال خود را بنویسید..."></textarea>

<button id="sendBtn" class="primary" onclick="askAI()">📤 ارسال</button>

<button class="gray" onclick="clearChat()">🗑️ پاک کردن گفتگو</button>

</div>


<!-- WITHDRAW -->

<div id="withdrawBox" class="card hidden">

<h2>💵 درخواست برداشت</h2>

<div class="withdrawBox">

<div class="small">حداقل برداشت: $10</div>

<label>💵 مبلغ</label>
<input id="withdrawAmount" type="number" min="10" step="0.01" placeholder="مثلاً 10">

<label>💳 روش برداشت</label>

<select id="withdrawMethod">
<option value="USDT">USDT</option>
</select>

<label>🌐 شبکه</label>

<select id="withdrawNetwork">
<option value="TRC20">TRC20</option>
<option value="BEP20">BEP20</option>
<option value="ERC20">ERC20</option>
</select>

<label>📍 آدرس کیف پول</label>

<input id="withdrawAddress" placeholder="آدرس کیف پول USDT">

<button class="green" onclick="withdraw()">✅ ثبت درخواست برداشت</button>

<button class="gray" onclick="showDashboard()">بستن</button>

<div id="withdrawMsg" class="small"></div>

</div>

</div>


<!-- TRANSACTIONS -->

<div id="transactionsBox" class="card hidden">

<h2>📊 تراکنش‌های من</h2>

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

</div>


<!-- ADMIN -->

<div id="adminBox" class="card">

<h2>🛠️ مدیریت سیستم</h2>

<label>🔐 رمز مدیریت</label>

<input id="adminPassword"
type="password"
placeholder="رمز ADMIN_PASSWORD">

<button class="dark" onclick="adminLogin()">
🔐 ورود مدیریت
</button>

<div id="adminMsg" class="small"></div>

<div id="adminPanel" class="hidden">

<div class="divider"></div>

<h3>📱 پنل مدیریت</h3>

<div class="panelMenu">

<button class="panelBtn gray" onclick="adminUsers()">
<span>👥</span>
کاربران
</button>

<button class="panelBtn green" onclick="adminIncome()">
<span>💰</span>
ثبت درآمد
</button>

<button class="panelBtn orange" onclick="adminWithdrawals()">
<span>💵</span>
برداشت‌ها
</button>

<button class="panelBtn purple" onclick="adminStats()">
<span>📊</span>
آمار
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
document.getElementById("registerForm").classList.remove("hidden");
document.getElementById("authMsg").textContent="";

}


function showLogin(){

document.getElementById("registerForm").classList.add("hidden");
document.getElementById("loginForm").classList.remove("hidden");
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
const email=document.getElementById("regEmail").value.trim().toLowerCase();
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
authMessage(r.error||"ثبت‌نام ناموفق بود.");
return;
}

token=r.token;

localStorage.setItem("ai_token",token);

await loadMe();

}


async function login(){

const email=document.getElementById("loginEmail").value.trim().toLowerCase();
const password=document.getElementById("loginPassword").value;

if(!email||!password){
authMessage("ایمیل و رمز عبور را وارد کنید.");
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
authMessage(r.error||"ورود ناموفق بود.");
return;
}

token=r.token;

localStorage.setItem("ai_token",token);

await loadMe();

}


async function loadMe(){

if(!token)return;

const r=await api("/api/me");

if(!r.ok){

localStorage.removeItem("ai_token");
token="";

document.getElementById("authBox").classList.remove("hidden");
document.getElementById("appBox").classList.add("hidden");

return;
}

document.getElementById("authBox").classList.add("hidden");
document.getElementById("appBox").classList.remove("hidden");

document.getElementById("userName").textContent=r.user.name;

document.getElementById("accountStatus").textContent=
r.user.status||"فعال";

setMoney("balance",r.user.balance);
setMoney("dashboardBalance",r.user.balance);

document.getElementById("dashboardName").textContent=
r.user.name;

document.getElementById("dashboardEmail").textContent=
r.user.email;

setMoney("totalIncome",r.user.total_income);
setMoney("dashboardIncome",r.user.total_income);

showDashboard();

}


function setMoney(id,value){

const el=document.getElementById(id);

if(!el)return;

el.textContent="$"+Number(value||0).toFixed(2);

}


async function refreshAccount(){

await loadMe();

}


async function logout(){

if(token){

await api("/api/logout",{
method:"POST"
});

}

localStorage.removeItem("ai_token");
token="";

location.reload();

}


function hideUserSections(){

[
"dashboardBox",
"aiBox",
"withdrawBox",
"transactionsBox",
"incomeBox"
].forEach(id=>{

document.getElementById(id).classList.add("hidden");

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

const input=document.getElementById("question");

const question=input.value.trim();

if(!question)return;

addMessage(question,"user");

input.value="";

const btn=document.getElementById("sendBtn");

btn.disabled=true;

btn.textContent="⏳ در حال پاسخ...";

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
'<div class="msg bot">گفتگو پاک شد. سوال جدیدت را بنویس.</div>';

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
document.getElementById("withdrawAddress").value.trim();

const out=
document.getElementById("withdrawMsg");

if(!Number.isFinite(amount)||amount<10){

out.textContent="حداقل برداشت $10 است.";

out.className="small err";

return;

}

if(!address||address.length<10){

out.textContent="آدرس کیف پول صحیح وارد کنید.";

out.className="small err";

return;

}

out.textContent="⏳ در حال ثبت درخواست...";

out.className="small";

const r=await api("/api/withdraw",{
method:"POST",
body:JSON.stringify({
amount,
method,
network,
address
})
});

if(!r.ok){

out.textContent=
r.error||"خطا در ثبت برداشت";

out.className="small err";

return;

}

out.textContent=
"✅ درخواست برداشت ثبت شد.";

out.className="small ok";

document.getElementById("withdrawAmount").value="";
document.getElementById("withdrawAddress").value="";

await loadMe();

}


async function loadTransactions(){

hideUserSections();

document.getElementById("transactionsBox")
.classList.remove("hidden");

const out=document.getElementById("transactions");

out.innerHTML="⏳ در حال دریافت...";

const r=await api("/api/transactions");

if(!r.ok){

out.innerHTML=
'<div class="err">'+
escapeHTML(r.error||"خطا")+
"</div>";

return;

}

if(!r.transactions.length){

out.innerHTML=
'<div class="small">هنوز تراکنشی ثبت نشده است.</div>';

return;

}

out.innerHTML=r.transactions.map(t=>{

return '<div class="adminItem">'+
"<b>"+escapeHTML(t.type_label)+"</b>"+
"<br>💵 مبلغ: $"+
Number(t.amount).toFixed(2)+
"<br>"+
escapeHTML(t.description||"")+
'<br><span class="small">'+
escapeHTML(t.created_at||"")+
"</span>"+
"</div>";

}).join("");

}


async function loadIncome(){

hideUserSections();

document.getElementById("incomeBox")
.classList.remove("hidden");

const list=document.getElementById("incomeList");

list.innerHTML="⏳ در حال دریافت...";

const r=await api("/api/income");

if(!r.ok){

list.innerHTML=
'<div class="err">'+
escapeHTML(r.error||"خطا")+
"</div>";

return;

}

setMoney("incomeTotal",r.total);

document.getElementById("incomeCount")
.textContent=r.incomes.length;

if(!r.incomes.length){

list.innerHTML=
'<div class="small">هنوز درآمدی ثبت نشده است.</div>';

return;

}

list.innerHTML=r.incomes.map(x=>{

return '<div class="adminItem">'+
"<b>💰 "+
escapeHTML(x.description||"درآمد")+
"</b>"+
"<br>مبلغ: <b>$"+
Number(x.amount).toFixed(2)+
"</b>"+
'<br><span class="small">'+
escapeHTML(x.created_at||"")+
"</span>"+
"</div>";

}).join("");

}


async function adminLogin(){

const password=
document.getElementById("adminPassword").value;

const msg=
document.getElementById("adminMsg");

if(!password){

msg.textContent="رمز مدیریت را وارد کنید.";

msg.className="small err";

return;

}

msg.textContent="⏳ در حال ورود...";

msg.className="small";

const r=await api("/api/admin/login",{
method:"POST",
body:JSON.stringify({
password
})
});

if(!r.ok){

msg.textContent=
r.error||"رمز مدیریت اشتباه است.";

msg.className="small err";

return;

}

adminToken=r.token;

localStorage.setItem(
"admin_token",
adminToken
);

msg.textContent=
"✅ ورود مدیریت موفق بود.";

msg.className="small ok";

document.getElementById("adminPanel")
.classList.remove("hidden");

await adminUsers();

}


async function adminUsers(){

const out=
document.getElementById("adminResult");

out.innerHTML=
"⏳ در حال دریافت کاربران...";

const r=await api("/api/admin/users");

if(!r.ok){

out.innerHTML=
'<div class="err">'+
escapeHTML(r.error||"خطا")+
"</div>";

return;

}

if(!r.users.length){

out.innerHTML=
'<div class="small">کاربری وجود ندارد.</div>';

return;

}

let html="<h3>👥 کاربران</h3>";

r.users.forEach(u=>{

html+=
'<div class="adminItem">'+

"<b>👤 "+
escapeHTML(u.name)+
"</b>"+

"<br>📧 "+
escapeHTML(u.email)+

"<br>💵 موجودی: <b>$"+
Number(u.balance).toFixed(2)+
"</b>"+

"<br>📈 درآمد: <b>$"+
Number(u.total_income).toFixed(2)+
"</b>"+

"<br>📌 وضعیت: "+
escapeHTML(u.status)+

"<hr>"+

"<label>💰 مبلغ درآمد</label>"+

'<input id="income_'+u.id+
'" type="number" min="0.01" step="0.01" placeholder="مثلاً 10">'+

"<label>📝 توضیح</label>"+

'<input id="desc_'+u.id+
'" placeholder="توضیح درآمد">'+

'<button class="green" onclick="addIncome('+
u.id+
')">➕ ثبت درآمد</button>'+

"</div>";

});

out.innerHTML=html;

}


async function addIncome(userId){

const amount=Number(
document.getElementById("income_"+userId).value
);

const description=
document.getElementById("desc_"+userId)
.value.trim();

if(!Number.isFinite(amount)||amount<=0){

alert("مبلغ معتبر وارد کنید.");

return;

}

const r=await api("/api/admin/add-income",{
method:"POST",
body:JSON.stringify({
user_id:userId,
amount,
description
})
});

if(!r.ok){

alert(r.error||"خطا");

return;

}

alert(
"✅ درآمد ثبت شد و موجودی افزایش یافت."
);

await adminUsers();

}


async function adminIncome(){

const out=
document.getElementById("adminResult");

out.innerHTML=
"⏳ در حال دریافت درآمدها...";

const r=await api("/api/admin/income");

if(!r.ok){

out.innerHTML=
'<div class="err">'+
escapeHTML(r.error||"خطا")+
"</div>";

return;

}

if(!r.incomes.length){

out.innerHTML=
'<div class="small">درآمدی ثبت نشده است.</div>';

return;

}

let html="<h3>💰 درآمدهای ثبت‌شده</h3>";

r.incomes.forEach(x=>{

html+=
'<div class="adminItem">'+
"<b>👤 "+
escapeHTML(x.name)+
"</b>"+
"<br>📧 "+
escapeHTML(x.email)+
"<br>💰 مبلغ: <b>$"+
Number(x.amount).toFixed(2)+
"</b>"+
"<br>📝 "+
escapeHTML(x.description||"")+
'<br><span class="small">'+
escapeHTML(x.created_at||"")+
"</span>"+
"</div>";

});

out.innerHTML=html;

}


async function adminWithdrawals(){

const out=
document.getElementById("adminResult");

out.innerHTML=
"⏳ در حال دریافت برداشت‌ها...";

const r=await api("/api/admin/withdrawals");

if(!r.ok){

out.innerHTML=
'<div class="err">'+
escapeHTML(r.error||"خطا")+
"</div>";

return;

}

if(!r.withdrawals.length){

out.innerHTML=
'<div class="small">درخواستی وجود ندارد.</div>';

return;

}

let html="<h3>💵 درخواست‌های برداشت</h3>";

r.withdrawals.forEach(w=>{

html+=
'<div class="adminItem">'+

"<b>👤 "+
escapeHTML(w.name)+
"</b>"+

"<br>📧 "+
escapeHTML(w.email)+

"<br>💵 مبلغ: <b>$"+
Number(w.amount).toFixed(2)+
"</b>"+

"<br>روش: "+
escapeHTML(w.method)+

"<br>شبکه: "+
escapeHTML(w.network)+

"<br>آدرس کیف پول:"+

'<div class="address">'+
escapeHTML(w.address)+
"</div>"+

"<br>وضعیت: <b>"+
escapeHTML(w.status)+
"</b><br><br>";

if(w.status==="در انتظار"){

html+=
'<button class="green" onclick="withdrawAction('+
w.id+
',\\'approve\\')">✅ تأیید برداشت</button>'+

'<button class="red" onclick="withdrawAction('+
w.id+
',\\'reject\\')">❌ رد برداشت</button>';

}

html+="</div>";

});

out.innerHTML=html;

}


async function withdrawAction(id,action){

const r=await api(
"/api/admin/withdrawal-action",
{
method:"POST",
body:JSON.stringify({
withdrawal_id:id,
action
})
}
);

if(!r.ok){

alert(r.error||"خطا");

return;

}

alert(r.message||"عملیات انجام شد.");

await adminWithdrawals();

}


async function adminStats(){

const out=
document.getElementById("adminResult");

out.innerHTML=
"⏳ در حال دریافت آمار...";

const r=await api("/api/admin/stats");

if(!r.ok){

out.innerHTML=
'<div class="err">'+
escapeHTML(r.error||"خطا")+
"</div>";

return;

}

out.innerHTML=
"<h3>📊 آمار سیستم</h3>"+

'<div class="grid">'+

'<div class="stat">'+
'<div class="small">👥 کاربران</div>'+
"<b>"+r.stats.users+"</b>"+
"</div>"+

'<div class="stat">'+
'<div class="small">💰 درآمد ثبت‌شده</div>'+
"<b>$"+
Number(r.stats.income).toFixed(2)+
"</b>"+
"</div>"+

'<div class="stat">'+
'<div class="small">💵 موجودی کاربران</div>'+
"<b>$"+
Number(r.stats.balance).toFixed(2)+
"</b>"+
"</div>"+

'<div class="stat">'+
'<div class="small">⏳ برداشت‌های در انتظار</div>'+
"<b>"+
r.stats.pending_withdrawals+
"</b>"+
"</div>"+

"</div>";

}


function escapeHTML(value){

return String(value??"")
.replaceAll("&","&amp;")
.replaceAll("<","&lt;")
.replaceAll(">","&gt;")
.replaceAll('"',"&quot;")
.replaceAll("'","&#039;");

}


if(token){
loadMe();
}

</script>

</body>
</html>`;


export default {

async fetch(request,env){

const url=new URL(request.url);

const json=(data,status=200)=>{

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

};


async function bodyJSON(req){

try{
return await req.json();
}catch(e){
return {};
}

}


/* بررسی Binding ها */

if(!env.DB){

if(url.pathname.startsWith("/api/")){

return json({
ok:false,
error:"D1 binding با نام DB متصل نیست."
},500);

}

return new Response(HTML,{
headers:{
"content-type":"text/html;charset=UTF-8",
"cache-control":"no-store"
}
});

}


function bytesToHex(bytes){

return Array.from(new Uint8Array(bytes))
.map(b=>b.toString(16).padStart(2,"0"))
.join("");

}


function hexToBytes(hex){

const arr=new Uint8Array(
Math.floor(hex.length/2)
);

for(let i=0;i<arr.length;i++){

arr[i]=parseInt(
hex.substr(i*2,2),
16
);

}

return arr;

}


async function hashPassword(password,saltHex){

const salt=saltHex
?hexToBytes(saltHex)
:crypto.getRandomValues(
new Uint8Array(16)
);

const key=await crypto.subtle.importKey(
"raw",
new TextEncoder().encode(password),
"PBKDF2",
false,
["deriveBits"]
);

const bits=await crypto.subtle.deriveBits(
{
name:"PBKDF2",
salt,
iterations:100000,
hash:"SHA-256"
},
key,
256
);

return{
salt:bytesToHex(salt),
hash:bytesToHex(bits)
};

}


async function makePassword(password){

const r=await hashPassword(password);

return r.salt+":"+r.hash;

}


async function verifyPassword(password,stored){

const parts=String(stored||"").split(":");

if(parts.length!==2)return false;

const r=await hashPassword(
password,
parts[0]
);

return r.hash===parts[1];

}


function newToken(){

return crypto.randomUUID()+
"-"+
crypto.randomUUID();

}


async function getUser(request){

const auth=
request.headers.get("authorization")||"";

if(!auth.startsWith("Bearer ")){
return null;
}

const sessionToken=
auth.slice(7).trim();

if(!sessionToken)return null;

return await env.DB.prepare(`
SELECT
u.id,
u.name,
u.email,
u.balance,
u.status,
COALESCE(
(
SELECT SUM(t.amount)
FROM transactions t
WHERE t.user_id=u.id
AND t.type='income'
),0
) AS total_income
FROM sessions s
JOIN users u ON u.id=s.user_id
WHERE s.token=?
LIMIT 1
`)
.bind(sessionToken)
.first();

}


async function makeAdminToken(){

if(!env.ADMIN_PASSWORD){
return null;
}

const timestamp=
Date.now().toString();

const key=
await crypto.subtle.importKey(
"raw",
new TextEncoder().encode(
env.ADMIN_PASSWORD
),
{
name:"HMAC",
hash:"SHA-256"
},
false,
["sign"]
);

const signature=
await crypto.subtle.sign(
"HMAC",
key,
new TextEncoder().encode(timestamp)
);

return timestamp+
"."+
bytesToHex(signature);

}


async function adminOK(request){

if(!env.ADMIN_PASSWORD){
return false;
}

const token=
request.headers.get("x-admin-token")||"";

const parts=token.split(".");

if(parts.length!==2){
return false;
}

const timestamp=Number(parts[0]);

const signatureHex=parts[1];

if(
!Number.isFinite(timestamp)||
!signatureHex
){
return false;
}

const age=Date.now()-timestamp;

if(age>86400000||age<-60000){
return false;
}

try{

const key=
await crypto.subtle.importKey(
"raw",
new TextEncoder().encode(
env.ADMIN_PASSWORD
),
{
name:"HMAC",
hash:"SHA-256"
},
false,
["verify"]
);

return await crypto.subtle.verify(
"HMAC",
key,
hexToBytes(signatureHex),
new TextEncoder().encode(
String(timestamp)
)
);

}catch(e){

return false;

}

}


/* ساخت جداول */

async function initDB(){

await env.DB.prepare(`
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
email TEXT NOT NULL UNIQUE,
password_hash TEXT NOT NULL,
balance REAL NOT NULL DEFAULT 0,
status TEXT NOT NULL DEFAULT 'فعال',
created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)
`).run();

await env.DB.prepare(`
CREATE TABLE IF NOT EXISTS sessions (
id INTEGER PRIMARY KEY AUTOINCREMENT,
token TEXT NOT NULL UNIQUE,
user_id INTEGER NOT NULL,
created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)
`).run();

await env.DB.prepare(`
CREATE TABLE IF NOT EXISTS transactions (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
type TEXT NOT NULL,
amount REAL NOT NULL,
description TEXT,
created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)
`).run();

await env.DB.prepare(`
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

}


/* صفحه اصلی را قبل از D1 نشان بده */

if(
request.method==="GET"&&
url.pathname==="/"
){

return new Response(
HTML,
{
headers:{
"content-type":
"text/html;charset=UTF-8",
"cache-control":"no-store"
}
}
);

}


/* برای API اتصال D1 لازم است */

try{

await initDB();

}catch(e){

return json({
ok:false,
error:"خطا در اتصال یا ساخت D1",
detail:e.message
},500);

}


/* REGISTER */

if(
url.pathname==="/api/register"&&
request.method==="POST"
){

const body=await bodyJSON(request);

const name=
String(body.name||"").trim();

const email=
String(body.email||"")
.trim()
.toLowerCase();

const password=
String(body.password||"");

if(
!name||
!email||
!email.includes("@")||
password.length<6
){

return json({
ok:false,
error:
"نام کامل، ایمیل معتبر و رمز حداقل ۶ کاراکتری لازم است."
},400);

}

const exists=
await env.DB.prepare(`
SELECT id FROM users
WHERE email=?
LIMIT 1
`)
.bind(email)
.first();

if(exists){

return json({
ok:false,
error:
"این ایمیل قبلاً ثبت‌نام کرده است."
},409);

}

const passwordHash=
await makePassword(password);

let result;

try{

result=
await env.DB.prepare(`
INSERT INTO users
(name,email,password_hash,balance,status)
VALUES(?,?,?,0,'فعال')
`)
.bind(
name,
email,
passwordHash
)
.run();

}catch(e){

return json({
ok:false,
error:"ثبت حساب ناموفق بود.",
detail:e.message
},500);

}

const userId=
result.meta.last_row_id;

const sessionToken=
newToken();

await env.DB.prepare(`
INSERT INTO sessions(token,user_id)
VALUES(?,?)
`)
.bind(
sessionToken,
userId
)
.run();

return json({
ok:true,
token:sessionToken,
message:"ثبت‌نام موفق بود."
});

}


/* LOGIN */

if(
url.pathname==="/api/login"&&
request.method==="POST"
){

const body=await bodyJSON(request);

const email=
String(body.email||"")
.trim()
.toLowerCase();

const password=
String(body.password||"");

const user=
await env.DB.prepare(`
SELECT * FROM users
WHERE email=?
LIMIT 1
`)
.bind(email)
.first();

if(!user){

return json({
ok:false,
error:"ایمیل یا رمز عبور اشتباه است."
},401);

}

const valid=
await verifyPassword(
password,
user.password_hash
);

if(!valid){

return json({
ok:false,
error:"ایمیل یا رمز عبور اشتباه است."
},401);

}

const sessionToken=
newToken();

await env.DB.prepare(`
INSERT INTO sessions(token,user_id)
VALUES(?,?)
`)
.bind(
sessionToken,
user.id
)
.run();

return json({
ok:true,
token:sessionToken,
message:"ورود موفق بود."
});

}


/* LOGOUT */

if(
url.pathname==="/api/logout"&&
request.method==="POST"
){

const auth=
request.headers.get("authorization")||"";

if(auth.startsWith("Bearer ")){

await env.DB.prepare(`
DELETE FROM sessions
WHERE token=?
`)
.bind(
auth.slice(7).trim()
)
.run();

}

return json({ok:true});

}


/* ME */

if(
url.pathname==="/api/me"&&
request.method==="GET"
){

const user=
await getUser(request);

if(!user){

return json({
ok:false,
error:"وارد حساب شوید."
},401);

}

return json({
ok:true,
user
});

}


/* TRANSACTIONS */

if(
url.pathname==="/api/transactions"&&
request.method==="GET"
){

const user=
await getUser(request);

if(!user){

return json({
ok:false,
error:"وارد حساب شوید."
},401);

}

const result=
await env.DB.prepare(`
SELECT
id,
type,
amount,
description,
created_at
FROM transactions
WHERE user_id=?
ORDER BY id DESC
LIMIT 100
`)
.bind(user.id)
.all();

const labels={
income:"💰 درآمد",
withdrawal:"💵 درخواست برداشت",
withdrawal_approved:"✅ برداشت تأیید شد",
refund:"↩️ بازگشت مبلغ برداشت"
};

const transactions=
(result.results||[]).map(x=>({
...x,
type_label:
labels[x.type]||x.type
}));

return json({
ok:true,
transactions
});

}


/* INCOME */

if(
url.pathname==="/api/income"&&
request.method==="GET"
){

const user=
await getUser(request);

if(!user){

return json({
ok:false,
error:"وارد حساب شوید."
},401);

}

const result=
await env.DB.prepare(`
SELECT
id,
amount,
description,
created_at
FROM transactions
WHERE user_id=?
AND type='income'
ORDER BY id DESC
LIMIT 100
`)
.bind(user.id)
.all();

const rows=
result.results||[];

const total=
rows.reduce(
(sum,x)=>sum+Number(x.amount||0),
0
);

return json({
ok:true,
total,
incomes:rows
});

}


/* WITHDRAW */

if(
url.pathname==="/api/withdraw"&&
request.method==="POST"
){

const user=
await getUser(request);

if(!user){

return json({
ok:false,
error:"وارد حساب شوید."
},401);

}

const body=
await bodyJSON(request);

const amount=
Number(body.amount);

const method=
String(body.method||"USDT").trim();

const network=
String(body.network||"TRC20").trim();

const address=
String(body.address||"").trim();

if(
!Number.isFinite(amount)||
amount<10
){

return json({
ok:false,
error:"حداقل مبلغ برداشت $10 است."
},400);

}

if(method!=="USDT"){

return json({
ok:false,
error:"روش برداشت نامعتبر است."
},400);

}

if(
!["TRC20","BEP20","ERC20"]
.includes(network)
){

return json({
ok:false,
error:"شبکه نامعتبر است."
},400);

}

if(
!address||
address.length<10
){

return json({
ok:false,
error:"آدرس کیف پول صحیح وارد کنید."
},400);

}


/* کم کردن موجودی */

const update=
await env.DB.prepare(`
UPDATE users
SET balance=balance-?
WHERE id=?
AND balance>=?
`)
.bind(
amount,
user.id,
amount
)
.run();

if(!update.meta.changes){

return json({
ok:false,
error:"موجودی کافی نیست."
},400);

}

try{

const withdrawal=
await env.DB.prepare(`
INSERT INTO withdrawals
(user_id,amount,method,network,address,status)
VALUES(?,?,?,?,?,'در انتظار')
`)
.bind(
user.id,
amount,
method,
network,
address
)
.run();

await env.DB.prepare(`
INSERT INTO transactions
(user_id,type,amount,description)
VALUES(?,?,?,?)
`)
.bind(
user.id,
"withdrawal",
amount,
"درخواست برداشت "+
method+
" "+
network
)
.run();

return json({
ok:true,
message:"درخواست برداشت ثبت شد.",
withdrawal_id:
withdrawal.meta.last_row_id
});

}catch(e){

await env.DB.prepare(`
UPDATE users
SET balance=balance+?
WHERE id=?
`)
.bind(
amount,
user.id
)
.run();

return json({
ok:false,
error:"ثبت درخواست برداشت انجام نشد.",
detail:e.message
},500);

}

}


/* AI */

if(
url.pathname==="/api/ai"&&
request.method==="POST"
){

const user=
await getUser(request);

if(!user){

return json({
ok:false,
error:"ابتدا وارد حساب شوید."
},401);

}

if(!env.AI){

return json({
ok:false,
error:
"Binding هوش مصنوعی AI تنظیم نشده است."
},500);

}

const body=
await bodyJSON(request);

const message=
String(body.message||"").trim();

if(!message){

return json({
ok:false,
error:"پیام خالی است."
},400);

}

try{

const result=
await env.AI.run(
"@cf/meta/llama-3.1-8b-instruct",
{
messages:[
{
role:"system",
content:
"You are a helpful AI assistant. Answer clearly and accurately. If the user writes Persian, answer in Persian."
},
{
role:"user",
content:message
}
]
}
);

return json({
ok:true,
answer:
result?.response||
result?.result?.response||
"پاسخی دریافت نشد."
});

}catch(e){

return json({
ok:false,
error:"خطا در سرویس هوش مصنوعی",
detail:e.message
},500);

}

}


/* ADMIN LOGIN */

if(
url.pathname==="/api/admin/login"&&
request.method==="POST"
){

const body=
await bodyJSON(request);

const password=
String(body.password||"");

if(!env.ADMIN_PASSWORD){

return json({
ok:false,
error:
"ADMIN_PASSWORD در Secrets تنظیم نشده است."
},500);

}

if(
password!==env.ADMIN_PASSWORD
){

return json({
ok:false,
error:"رمز مدیریت اشتباه است."
},401);

}

const adminToken=
await makeAdminToken();

return json({
ok:true,
token:adminToken,
message:"ورود مدیریت موفق بود."
});

}


/* ADMIN USERS */

if(
url.pathname==="/api/admin/users"&&
request.method==="GET"
){

if(!await adminOK(request)){

return json({
ok:false,
error:"دسترسی مدیریت لازم است."
},403);

}

const result=
await env.DB.prepare(`
SELECT
u.id,
u.name,
u.email,
u.balance,
u.status,
u.created_at,
COALESCE(
(
SELECT SUM(t.amount)
FROM transactions t
WHERE t.user_id=u.id
AND t.type='income'
),0
) AS total_income
FROM users u
ORDER BY u.id DESC
`)
.all();

return json({
ok:true,
users:result.results||[]
});

}


/* ADMIN ADD INCOME */

if(
url.pathname==="/api/admin/add-income"&&
request.method==="POST"
){

if(!await adminOK(request)){

return json({
ok:false,
error:"دسترسی مدیریت لازم است."
},403);

}

const body=
await bodyJSON(request);

const userId=
Number(body.user_id);

const amount=
Number(body.amount);

const description=
String(
body.description||
"درآمد ثبت‌شده توسط مدیریت"
).trim();

if(
!Number.isInteger(userId)||
userId<=0
){

return json({
ok:false,
error:"شناسه کاربر نامعتبر است."
},400);

}

if(
!Number.isFinite(amount)||
amount<=0
){

return json({
ok:false,
error:"مبلغ نامعتبر است."
},400);

}

const user=
await env.DB.prepare(`
SELECT id FROM users
WHERE id=?
LIMIT 1
`)
.bind(userId)
.first();

if(!user){

return json({
ok:false,
error:"کاربر پیدا نشد."
},404);

}

try{

await env.DB.prepare(`
UPDATE users
SET balance=balance+?
WHERE id=?
`)
.bind(
amount,
userId
)
.run();

await env.DB.prepare(`
INSERT INTO transactions
(user_id,type,amount,description)
VALUES(?,?,?,?)
`)
.bind(
userId,
"income",
amount,
description
)
.run();

}catch(e){

return json({
ok:false,
error:"ثبت درآمد انجام نشد.",
detail:e.message
},500);

}

return json({
ok:true,
message:
"درآمد ثبت و موجودی افزایش یافت."
});

}


/* ADMIN INCOME */

if(
url.pathname==="/api/admin/income"&&
request.method==="GET"
){

if(!await adminOK(request)){

return json({
ok:false,
error:"دسترسی مدیریت لازم است."
},403);

}

const result=
await env.DB.prepare(`
SELECT
t.id,
t.amount,
t.description,
t.created_at,
u.name,
u.email
FROM transactions t
JOIN users u
ON u.id=t.user_id
WHERE t.type='income'
ORDER BY t.id DESC
LIMIT 200
`)
.all();

return json({
ok:true,
incomes:result.results||[]
});

}


/* ADMIN WITHDRAWALS */

if(
url.pathname==="/api/admin/withdrawals"&&
request.method==="GET"
){

if(!await adminOK(request)){

return json({
ok:false,
error:"دسترسی مدیریت لازم است."
},403);

}

const result=
await env.DB.prepare(`
SELECT
w.id,
w.user_id,
u.name,
u.email,
w.amount,
w.method,
w.network,
w.address,
w.status,
w.created_at
FROM withdrawals w
JOIN users u
ON u.id=w.user_id
ORDER BY w.id DESC
`)
.all();

return json({
ok:true,
withdrawals:
result.results||[]
});

}


/* ADMIN WITHDRAWAL ACTION */

if(
url.pathname===
"/api/admin/withdrawal-action"&&
request.method==="POST"
){

if(!await adminOK(request)){

return json({
ok:false,
error:"دسترسی مدیریت لازم است."
},403);

}

const body=
await bodyJSON(request);

const withdrawalId=
Number(body.withdrawal_id);

const action=
String(body.action||"");

if(
!Number.isInteger(withdrawalId)||
!["approve","reject"].includes(action)
){

return json({
ok:false,
error:"عملیات نامعتبر است."
},400);

}

const withdrawal=
await env.DB.prepare(`
SELECT *
FROM withdrawals
WHERE id=?
LIMIT 1
`)
.bind(withdrawalId)
.first();

if(!withdrawal){

return json({
ok:false,
error:"درخواست برداشت پیدا نشد."
},404);

}

if(
withdrawal.status!=="در انتظار"
){

return json({
ok:false,
error:
"این درخواست قبلاً بررسی شده است."
},400);

}


/* APPROVE */

if(action==="approve"){

const result=
await env.DB.prepare(`
UPDATE withdrawals
SET status='تأیید شد'
WHERE id=?
AND status='در انتظار'
`)
.bind(withdrawalId)
.run();

if(!result.meta.changes){

return json({
ok:false,
error:
"درخواست قبلاً پردازش شده است."
},409);

}

await env.DB.prepare(`
INSERT INTO transactions
(user_id,type,amount,description)
VALUES(?,?,?,?)
`)
.bind(
withdrawal.user_id,
"withdrawal_approved",
withdrawal.amount,
"برداشت تأیید شد"
)
.run();

return json({
ok:true,
message:"برداشت تأیید شد."
});

}


/* REJECT */

const rejectResult=
await env.DB.prepare(`
UPDATE withdrawals
SET status='رد شد'
WHERE id=?
AND status='در انتظار'
`)
.bind(withdrawalId)
.run();

if(!rejectResult.meta.changes){

return json({
ok:false,
error:
"درخواست قبلاً پردازش شده است."
},409);

}

await env.DB.prepare(`
UPDATE users
SET balance=balance+?
WHERE id=?
`)
.bind(
withdrawal.amount,
withdrawal.user_id
)
.run();

await env.DB.prepare(`
INSERT INTO transactions
(user_id,type,amount,description)
VALUES(?,?,?,?)
`)
.bind(
withdrawal.user_id,
"refund",
withdrawal.amount,
"بازگشت مبلغ برداشت رد شده"
)
.run();

return json({
ok:true,
message:
"برداشت رد شد و مبلغ به موجودی برگشت."
});

}


/* ADMIN STATS */

if(
url.pathname==="/api/admin/stats"&&
request.method==="GET"
){

if(!await adminOK(request)){

return json({
ok:false,
error:"دسترسی مدیریت لازم است."
},403);

}

const users=
await env.DB.prepare(`
SELECT COUNT(*) AS total
FROM users
`)
.first();

const income=
await env.DB.prepare(`
SELECT COALESCE(SUM(amount),0) AS total
FROM transactions
WHERE type='income'
`)
.first();

const balance=
await env.DB.prepare(`
SELECT COALESCE(SUM(balance),0) AS total
FROM users
`)
.first();

const pending=
await env.DB.prepare(`
SELECT COUNT(*) AS total
FROM withdrawals
WHERE status='در انتظار'
`)
.first();

return json({
ok:true,
stats:{
users:Number(users?.total||0),
income:Number(income?.total||0),
balance:Number(balance?.total||0),
pending_withdrawals:
Number(pending?.total||0)
}
});

}


/* NOT FOUND */

return json({
ok:false,
error:"مسیر پیدا نشد."
},404);

}

};
