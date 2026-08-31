
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
color:#172033;
}

header{
background:#111827;
color:white;
padding:18px;
text-align:center;
position:sticky;
top:0;
z-index:20;
}

header h1{
margin:0;
font-size:22px;
}

header p{
margin:7px 0 0;
color:#cbd5e1;
font-size:13px;
}

.container{
max-width:1000px;
margin:auto;
padding:15px;
}

.card{
background:#fff;
border-radius:18px;
padding:16px;
margin:12px 0;
box-shadow:0 5px 20px rgba(0,0,0,.06);
}

h2,h3{
margin-top:0;
}

input,
textarea,
select{
width:100%;
padding:13px;
border:1px solid #d7deea;
border-radius:12px;
margin:6px 0 10px;
font-family:inherit;
font-size:15px;
outline:none;
}

input:focus,
textarea:focus,
select:focus{
border-color:#2563eb;
}

textarea{
min-height:110px;
resize:vertical;
}

button{
border:0;
border-radius:12px;
padding:12px 16px;
cursor:pointer;
font-family:inherit;
font-size:14px;
margin:4px;
}

button:disabled{
opacity:.6;
cursor:not-allowed;
}

.primary{
background:#2563eb;
color:#fff;
}

.green{
background:#16a34a;
color:#fff;
}

.red{
background:#dc2626;
color:#fff;
}

.gray{
background:#e5e7eb;
color:#111827;
}

.dark{
background:#111827;
color:#fff;
}

.orange{
background:#f59e0b;
color:#fff;
}

.purple{
background:#7c3aed;
color:#fff;
}

.hidden{
display:none!important;
}

.small{
font-size:12px;
color:#64748b;
}

.ok{
color:#15803d;
}

.err{
color:#b91c1c;
}

.balance{
font-size:32px;
font-weight:bold;
margin:8px 0;
}

.grid{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:10px;
}

.stat{
background:#f8fafc;
padding:15px;
border-radius:14px;
text-align:center;
overflow:hidden;
}

.panelMenu{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:10px;
margin:15px 0;
}

.panelBtn{
margin:0;
min-height:85px;
font-weight:bold;
}

.panelBtn span{
display:block;
font-size:25px;
margin-bottom:6px;
}

.profileBox{
background:#eef2ff;
padding:15px;
border-radius:15px;
}

.balanceBox{
background:#f0fdf4;
padding:18px;
border-radius:15px;
margin-top:12px;
}

.incomeBox{
background:#eff6ff;
padding:18px;
border-radius:15px;
margin-top:12px;
}

.withdrawBox{
background:#fff7ed;
padding:15px;
border-radius:15px;
}

.adminItem{
background:#f8fafc;
padding:14px;
border-radius:14px;
margin:10px 0;
overflow:hidden;
}

.msg{
padding:12px;
border-radius:14px;
margin:8px 0;
line-height:1.8;
white-space:pre-wrap;
word-break:break-word;
}

.chat{
min-height:280px;
max-height:500px;
overflow:auto;
padding:8px;
}

.user{
background:#dbeafe;
margin-right:10%;
}

.bot{
background:#f1f5f9;
margin-left:10%;
}

.badge{
display:inline-block;
padding:5px 10px;
border-radius:20px;
background:#dcfce7;
color:#166534;
font-size:12px;
}

.divider{
height:1px;
background:#e5e7eb;
margin:15px 0;
}

.sectionTitle{
font-size:18px;
font-weight:bold;
margin-bottom:10px;
}

.notice{
padding:12px;
border-radius:12px;
background:#fff7ed;
color:#9a3412;
margin:10px 0;
line-height:1.8;
}

.address{
word-break:break-all;
direction:ltr;
text-align:left;
background:#fff;
padding:8px;
border-radius:8px;
}

.topActions{
display:flex;
gap:6px;
flex-wrap:wrap;
margin-top:10px;
}

.statusPending{
color:#b45309;
font-weight:bold;
}

.statusApproved{
color:#15803d;
font-weight:bold;
}

.statusRejected{
color:#b91c1c;
font-weight:bold;
}

@media(max-width:700px){

.grid{
grid-template-columns:repeat(2,1fr);
}

.panelMenu{
grid-template-columns:repeat(2,1fr);
}

}

@media(max-width:420px){

.grid{
grid-template-columns:1fr;
}

.panelMenu{
grid-template-columns:1fr;
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

<input
id="loginEmail"
type="email"
placeholder="ایمیل"
autocomplete="email"
>

<label>رمز عبور</label>

<input
id="loginPassword"
type="password"
placeholder="رمز عبور"
autocomplete="current-password"
>

<div class="topActions">

<button
class="primary"
onclick="login()"
>
🔐 ورود
</button>

<button
class="gray"
onclick="showRegister()"
>
📝 ثبت‌نام
</button>

</div>

</div>


<div id="registerForm" class="hidden">

<label>نام کامل</label>

<input
id="regName"
placeholder="نام کامل"
autocomplete="name"
>

<label>ایمیل</label>

<input
id="regEmail"
type="email"
placeholder="ایمیل"
autocomplete="email"
>

<label>رمز عبور</label>

<input
id="regPassword"
type="password"
placeholder="حداقل ۶ کاراکتر"
autocomplete="new-password"
>

<div class="topActions">

<button
class="green"
onclick="register()"
>
📝 ایجاد حساب
</button>

<button
class="gray"
onclick="showLogin()"
>
↩️ بازگشت
</button>

</div>

</div>

<div id="authMsg" class="small"></div>

</div>


<!-- USER APP -->

<div id="appBox" class="hidden">

<div class="card">

<div class="profileBox">

<div class="small">
👤 حساب کاربری
</div>

<h3 id="userName">-</h3>

<span id="accountStatus" class="badge">
فعال
</span>

</div>


<div class="balanceBox">

<div class="small">
💵 موجودی فعلی
</div>

<div id="balance" class="balance">
$0.00
</div>

</div>


<div class="incomeBox">

<div class="small">
📈 درآمد کل
</div>

<div id="totalIncome" class="balance">
$0.00
</div>

</div>


<div class="sectionTitle" style="margin-top:18px">
📱 پنل کاربری
</div>


<div class="panelMenu">

<button
class="panelBtn primary"
onclick="showDashboard()"
>
<span>🏠</span>
داشبورد
</button>


<button
class="panelBtn purple"
onclick="showAI()"
>
<span>🤖</span>
دستیار هوش مصنوعی
</button>


<button
class="panelBtn green"
onclick="showWithdraw()"
>
<span>💵</span>
برداشت
</button>


<button
class="panelBtn orange"
onclick="loadTransactions()"
>
<span>📊</span>
تراکنش‌ها
</button>


<button
class="panelBtn dark"
onclick="loadIncome()"
>
<span>📈</span>
درآمد
</button>


<button
class="panelBtn gray"
onclick="refreshAccount()"
>
<span>🔄</span>
به‌روزرسانی
</button>


<button
class="panelBtn red"
onclick="logout()"
>
<span>🚪</span>
خروج
</button>

</div>

</div>


<!-- DASHBOARD -->

<div
id="dashboardBox"
class="card"
>

<h2>
🏠 داشبورد
</h2>

<div class="grid">

<div class="stat">

<div class="small">
👤 نام
</div>

<b id="dashboardName">
-
</b>

</div>


<div class="stat">

<div class="small">
📧 ایمیل
</div>

<b id="dashboardEmail">
-
</b>

</div>


<div class="stat">

<div class="small">
💵 موجودی
</div>

<b id="dashboardBalance">
$0.00
</b>

</div>


<div class="stat">

<div class="small">
📈 درآمد
</div>

<b id="dashboardIncome">
$0.00
</b>

</div>

</div>


<div class="notice">

⚠️ موجودی واقعی از D1 خوانده می‌شود.

<br>

ثبت‌نام به‌تنهایی پول ایجاد نمی‌کند.

<br>

درآمد باید از پنل مدیریت ثبت شود.

</div>

</div>


<!-- AI -->

<div
id="aiBox"
class="card hidden"
>

<h2>
🤖 دستیار هوش مصنوعی
</h2>

<div
id="chat"
class="chat"
>

<div class="msg bot">

سلام! 👋

من دستیار هوش مصنوعی هستم.

سوالت را بنویس.

</div>

</div>


<textarea
id="question"
placeholder="سوال خود را بنویسید..."
></textarea>


<button
id="sendBtn"
class="primary"
onclick="askAI()"
>
📤 ارسال
</button>


<button
class="gray"
onclick="clearChat()"
>
🗑️ پاک کردن گفتگو
</button>

</div>


<!-- WITHDRAW -->

<div
id="withdrawBox"
class="card hidden"
>

<h2>
💵 درخواست برداشت
</h2>

<div class="withdrawBox">

<div class="small">
حداقل برداشت: $10
</div>


<label>
مبلغ
</label>

<input
id="withdrawAmount"
type="number"
min="10"
step="0.01"
placeholder="مثلاً 10"
>


<label>
روش برداشت
</label>

<select id="withdrawMethod">

<option value="USDT">
USDT
</option>

</select>


<label>
شبکه
</label>

<select id="withdrawNetwork">

<option value="TRC20">
TRC20
</option>

<option value="BEP20">
BEP20
</option>

<option value="ERC20">
ERC20
</option>

</select>


<label>
آدرس کیف پول
</label>

<input
id="withdrawAddress"
placeholder="آدرس کیف پول USDT"
>


<button
class="green"
onclick="withdraw()"
>
✅ ثبت درخواست
</button>


<button
class="gray"
onclick="showDashboard()"
>
بستن
</button>


<div
id="withdrawMsg"
class="small"
></div>

</div>

</div>


<!-- TRANSACTIONS -->

<div
id="transactionsBox"
class="card hidden"
>

<h2>
📊 تراکنش‌ها
</h2>

<div id="transactions">
⏳ در حال دریافت...
</div>

</div>


<!-- INCOME -->

<div
id="incomeBox"
class="card hidden"
>

<h2>
📈 درآمد
</h2>


<div class="grid">

<div class="stat">

<div class="small">
درآمد کل
</div>

<b id="incomeTotal">
$0.00
</b>

</div>


<div class="stat">

<div class="small">
تعداد درآمدها
</div>

<b id="incomeCount">
0
</b>

</div>

</div>


<div id="incomeList"></div>

</div>

</div>


<!-- ADMIN -->

<div
id="adminBox"
class="card"
>

<h2>
🛠️ مدیریت
</h2>


<label>
رمز مدیریت
</label>

<input
id="adminPassword"
type="password"
placeholder="رمز مدیریت"
>


<button
class="dark"
onclick="adminLogin()"
>
🔐 ورود مدیریت
</button>


<div
id="adminMsg"
class="small"
></div>


<div
id="adminPanel"
class="hidden"
>

<div class="divider"></div>

<h3>
🛠️ پنل مدیریت
</h3>


<div class="panelMenu">

<button
class="panelBtn gray"
onclick="adminUsers()"
>
<span>👥</span>
کاربران
</button>


<button
class="panelBtn green"
onclick="adminIncome()"
>
<span>💰</span>
ثبت درآمد
</button>


<button
class="panelBtn orange"
onclick="adminWithdrawals()"
>
<span>💵</span>
برداشت‌ها
</button>


<button
class="panelBtn purple"
onclick="adminStats()"
>
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

headers.authorization=
"Bearer "+token;

}

if(adminToken){

headers["x-admin-token"]=
adminToken;

}

try{

const res=await fetch(
path,
{
...options,
headers
}
);

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


/* AUTH */

function showRegister(){

document
.getElementById("loginForm")
.classList
.add("hidden");

document
.getElementById("registerForm")
.classList
.remove("hidden");

document
.getElementById("authMsg")
.textContent="";

}


function showLogin(){

document
.getElementById("registerForm")
.classList
.add("hidden");

document
.getElementById("loginForm")
.classList
.remove("hidden");

document
.getElementById("authMsg")
.textContent="";

}


function authMessage(text,ok=false){

const el=
document.getElementById("authMsg");

el.textContent=text;

el.className=
ok
?"small ok"
:"small err";

}


/* REGISTER */

async function register(){

const name=
document
.getElementById("regName")
.value
.trim();

const email=
document
.getElementById("regEmail")
.value
.trim()
.toLowerCase();

const password=
document
.getElementById("regPassword")
.value;


if(!name){

authMessage(
"نام کامل را وارد کنید."
);

return;

}


if(
!email||
!email.includes("@")
){

authMessage(
"ایمیل معتبر وارد کنید."
);

return;

}


if(password.length<6){

authMessage(
"رمز عبور باید حداقل ۶ کاراکتر باشد."
);

return;

}


authMessage(
"⏳ در حال ایجاد حساب...",
true
);


const r=await api(
"/api/register",
{
method:"POST",
body:JSON.stringify({
name,
email,
password
})
}
);


if(!r.ok){

authMessage(
r.error||
"ثبت‌نام ناموفق بود."
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


/* LOGIN */

async function login(){

const email=
document
.getElementById("loginEmail")
.value
.trim()
.toLowerCase();

const password=
document
.getElementById("loginPassword")
.value;


if(!email||!password){

authMessage(
"ایمیل و رمز عبور را وارد کنید."
);

return;

}


authMessage(
"⏳ در حال ورود...",
true
);


const r=await api(
"/api/login",
{
method:"POST",
body:JSON.stringify({
email,
password
})
}
);


if(!r.ok){

authMessage(
r.error||
"ورود ناموفق بود."
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


/* LOAD USER */

async function loadMe(){

if(!token){

document
.getElementById("authBox")
.classList
.remove("hidden");

document
.getElementById("appBox")
.classList
.add("hidden");

return;

}


const r=
await api("/api/me");


if(!r.ok){

localStorage.removeItem(
"ai_token"
);

token="";


document
.getElementById("authBox")
.classList
.remove("hidden");

document
.getElementById("appBox")
.classList
.add("hidden");

authMessage(
r.error||
"لطفاً دوباره وارد حساب شوید."
);

return;

}


/* ورود موفق */

document
.getElementById("authBox")
.classList
.add("hidden");

document
.getElementById("appBox")
.classList
.remove("hidden");


/* اطلاعات کاربر */

document
.getElementById("userName")
.textContent=
r.user.name||"-";


document
.getElementById("accountStatus")
.textContent=
r.user.status||"فعال";


document
.getElementById("dashboardName")
.textContent=
r.user.name||"-";


document
.getElementById("dashboardEmail")
.textContent=
r.user.email||"-";


/* موجودی */

setMoney(
"balance",
r.user.balance
);


setMoney(
"dashboardBalance",
r.user.balance
);


/* درآمد */

setMoney(
"totalIncome",
r.user.total_income
);


setMoney(
"dashboardIncome",
r.user.total_income
);


/* نمایش داشبورد */

hideUserSections();

document
.getElementById("dashboardBox")
.classList
.remove("hidden");

}


/* MONEY */

function setMoney(id,value){

const el=
document.getElementById(id);

if(!el)return;

el.textContent=
"$"+
Number(value||0).toFixed(2);

}


/* REFRESH */

async function refreshAccount(){

await loadMe();

}


/* LOGOUT */

async function logout(){

try{

if(token){

await api(
"/api/logout",
{
method:"POST"
}
);

}

}catch(e){}


localStorage.removeItem(
"ai_token"
);

token="";

location.reload();

}


/* SECTIONS */

function hideUserSections(){

[
"dashboardBox",
"aiBox",
"withdrawBox",
"transactionsBox",
"incomeBox"
].forEach(
id=>{

const el=
document.getElementById(id);

if(el){

el.classList.add(
"hidden"
);

}

});

}


function showDashboard(){

hideUserSections();

document
.getElementById("dashboardBox")
.classList
.remove("hidden");

}


function showAI(){

hideUserSections();

document
.getElementById("aiBox")
.classList
.remove("hidden");

}


function showWithdraw(){

hideUserSections();

document
.getElementById("withdrawBox")
.classList
.remove("hidden");

}


/* CHAT */

function addMessage(text,type){

const chat=
document.getElementById("chat");

const div=
document.createElement("div");

div.className=
"msg "+type;

div.textContent=text;

chat.appendChild(div);

chat.scrollTop=
chat.scrollHeight;

}


/* AI */

async function askAI(){

const input=
document.getElementById("question");

const question=
input.value.trim();

if(!question)return;


addMessage(
question,
"user"
);

input.value="";


const btn=
document.getElementById("sendBtn");

btn.disabled=true;

btn.textContent=
"⏳ در حال پاسخ...";


const r=
await api(
"/api/ai",
{
method:"POST",
body:JSON.stringify({
message:question
})
}
);


if(r.ok){

addMessage(
r.answer||
"پاسخی دریافت نشد.",
"bot"
);

}else{

addMessage(
"❌ "+
(r.error||
"خطا در دریافت پاسخ"),
"bot"
);

}


btn.disabled=false;

btn.textContent=
"📤 ارسال";

}


function clearChat(){

document
.getElementById("chat")
.innerHTML=
'<div class="msg bot">گفتگو پاک شد. سوال جدیدت را بنویس.</div>';

}


/* WITHDRAW */

async function withdraw(){

const amount=
Number(
document
.getElementById("withdrawAmount")
.value
);

const method=
document
.getElementById("withdrawMethod")
.value;

const network=
document
.getElementById("withdrawNetwork")
.value;

const address=
document
.getElementById("withdrawAddress")
.value
.trim();

const out=
document
.getElementById("withdrawMsg");


if(
!Number.isFinite(amount)||
amount<10
){

out.textContent=
"حداقل برداشت $10 است.";

out.className=
"small err";

return;

}


if(
!address||
address.length<10
){

out.textContent=
"آدرس کیف پول صحیح وارد کنید.";

out.className=
"small err";

return;

}


out.textContent=
"⏳ در حال ثبت درخواست...";

out.className=
"small";


const r=
await api(
"/api/withdraw",
{
method:"POST",
body:JSON.stringify({
amount,
method,
network,
address
})
}
);


if(!r.ok){

out.textContent=
r.error||
"خطا در ثبت برداشت";

out.className=
"small err";

return;

}


out.textContent=
"✅ درخواست برداشت ثبت شد.";

out.className=
"small ok";


document
.getElementById("withdrawAmount")
.value="";


document
.getElementById("withdrawAddress")
.value="";


await loadMe();

}


/* TRANSACTIONS */

async function loadTransactions(){

hideUserSections();

document
.getElementById("transactionsBox")
.classList
.remove("hidden");


const out=
document
.getElementById("transactions");

out.innerHTML=
"⏳ در حال دریافت...";


const r=
await api(
"/api/transactions"
);


if(!r.ok){

out.innerHTML=
'<div class="err">'+
escapeHTML(
r.error||"خطا"
)+
"</div>";

return;

}


if(
!r.transactions||
!r.transactions.length
){

out.innerHTML=
'<div class="small">هنوز تراکنشی ثبت نشده است.</div>';

return;

}


out.innerHTML=
r.transactions
.map(t=>{

return `
<div class="adminItem">

<b>
${escapeHTML(t.type_label)}
</b>

<br>

💵 مبلغ:
$${Number(t.amount||0).toFixed(2)}

<br>

${escapeHTML(
t.description||""
)}

<br>

<span class="small">
${escapeHTML(
t.created_at||""
)}
</span>

</div>
`;

})
.join("");

}


/* INCOME */

async function loadIncome(){

hideUserSections();

document
.getElementById("incomeBox")
.classList
.remove("hidden");


const list=
document
.getElementById("incomeList");

list.innerHTML=
"⏳ در حال دریافت...";


const r=
await api(
"/api/income"
);


if(!r.ok){

list.innerHTML=
'<div class="err">'+
escapeHTML(
r.error||"خطا"
)+
"</div>";

return;

}


setMoney(
"incomeTotal",
r.total
);


document
.getElementById("incomeCount")
.textContent=
r.incomes.length;


if(!r.incomes.length){

list.innerHTML=
'<div class="small">هنوز درآمدی ثبت نشده است.</div>';

return;

}


list.innerHTML=
r.incomes
.map(x=>{

return `
<div class="adminItem">

<b>
💰 ${escapeHTML(
x.description||"درآمد"
)}
</b>

<br>

مبلغ:
<b>
$${Number(x.amount||0).toFixed(2)}
</b>

<br>

<span class="small">
${escapeHTML(
x.created_at||""
)}
</span>

</div>
`;

})
.join("");

}


/* ADMIN LOGIN */

async function adminLogin(){

const password=
document
.getElementById("adminPassword")
.value;

const msg=
document
.getElementById("adminMsg");


if(!password){

msg.textContent=
"رمز مدیریت را وارد کنید.";

msg.className=
"small err";

return;

}


msg.textContent=
"⏳ در حال ورود...";

msg.className=
"small";


const r=
await api(
"/api/admin/login",
{
method:"POST",
body:JSON.stringify({
password
})
}
);


if(!r.ok){

msg.textContent=
r.error||
"رمز مدیریت اشتباه است.";

msg.className=
"small err";

return;

}


adminToken=r.token;

localStorage.setItem(
"admin_token",
adminToken
);


msg.textContent=
"✅ ورود مدیریت موفق بود.";

msg.className=
"small ok";


document
.getElementById("adminPanel")
.classList
.remove("hidden");


await adminUsers();

}


/* ADMIN USERS */

async function adminUsers(){

const out=
document
.getElementById("adminResult");

out.innerHTML=
"⏳ در حال دریافت کاربران...";


const r=
await api(
"/api/admin/users"
);


if(!r.ok){

out.innerHTML=
'<div class="err">'+
escapeHTML(
r.error||"خطا"
)+
"</div>";

return;

}


if(!r.users.length){

out.innerHTML=
'<div class="small">کاربری وجود ندارد.</div>';

return;

}


let html=
"<h3>👥 کاربران</h3>";


r.users.forEach(u=>{

html+=`

<div class="adminItem">

<b>
${escapeHTML(u.name)}
</b>

<br>

📧
${escapeHTML(u.email)}

<br>

💵 موجودی:
<b>
$${Number(u.balance||0).toFixed(2)}
</b>

<br>

📈 درآمد:
<b>
$${Number(u.total_income||0).toFixed(2)}
</b>

<br>

📌 وضعیت:
${escapeHTML(u.status)}

<hr>

<input
id="income_${u.id}"
type="number"
min="0.01"
step="0.01"
placeholder="مبلغ درآمد"
>

<input
id="desc_${u.id}"
placeholder="توضیح درآمد"
>

<button
class="green"
onclick="addIncome(${u.id})"
>
➕ ثبت درآمد
</button>

</div>
`;

});


out.innerHTML=html;

}


/* ADD INCOME */

async function addIncome(userId){

const amount=
Number(
document
.getElementById(
"income_"+userId
)
.value
);


const description=
document
.getElementById(
"desc_"+userId
)
.value
.trim();


if(
!Number.isFinite(amount)||
amount<=0
){

alert(
"مبلغ معتبر وارد کنید."
);

return;

}


const r=
await api(
"/api/admin/add-income",
{
method:"POST",
body:JSON.stringify({
user_id:userId,
amount,
description
})
}
);


if(!r.ok){

alert(
r.error||"خطا"
);

return;

}


alert(
"✅ درآمد ثبت شد و موجودی افزایش یافت."
);


await adminUsers();

}


/* ADMIN INCOME */

async function adminIncome(){

const out=
document
.getElementById("adminResult");

out.innerHTML=
"⏳ در حال دریافت درآمدها...";


const r=
await api(
"/api/admin/income"
);


if(!r.ok){

out.innerHTML=
'<div class="err">'+
escapeHTML(
r.error||"خطا"
)+
"</div>";

return;

}


if(!r.incomes.length){

out.innerHTML=
'<div class="small">درآمدی ثبت نشده است.</div>';

return;

}


let html=
"<h3>💰 درآمدهای ثبت‌شده</h3>";


r.incomes.forEach(x=>{

html+=`

<div class="adminItem">

<b>
${escapeHTML(x.name)}
</b>

<br>

📧
${escapeHTML(x.email)}

<br>

💰 مبلغ:
<b>
$${Number(x.amount||0).toFixed(2)}
</b>

<br>

📝
${escapeHTML(
x.description||""
)}

<br>

<span class="small">
${escapeHTML(
x.created_at||""
)}
</span>

</div>

`;

});


out.innerHTML=html;

}


/* ADMIN WITHDRAWALS */

async function adminWithdrawals(){

const out=
document
.getElementById("adminResult");

out.innerHTML=
"⏳ در حال دریافت برداشت‌ها...";


const r=
await api(
"/api/admin/withdrawals"
);


if(!r.ok){

out.innerHTML=
'<div class="err">'+
escapeHTML(
r.error||"خطا"
)+
"</div>";

return;

}


if(!r.withdrawals.length){

out.innerHTML=
'<div class="small">درخواستی وجود ندارد.</div>';

return;

}


let html=
"<h3>💵 برداشت‌ها</h3>";


r.withdrawals.forEach(w=>{

let statusClass="";

if(w.status==="در انتظار"){
statusClass="statusPending";
}

if(w.status==="تأیید شد"){
statusClass="statusApproved";
}

if(w.status==="رد شد"){
statusClass="statusRejected";
}


html+=`

<div class="adminItem">

<b>
${escapeHTML(w.name)}
</b>

<br>

📧
${escapeHTML(w.email)}

<br>

💵 مبلغ:
<b>
$${Number(w.amount||0).toFixed(2)}
</b>

<br>

روش:
${escapeHTML(w.method)}

<br>

شبکه:
${escapeHTML(w.network)}

<br>

آدرس:

<div class="address">
${escapeHTML(w.address)}
</div>

<br>

وضعیت:

<b class="${statusClass}">
${escapeHTML(w.status)}
</b>

<br><br>
`;


if(w.status==="در انتظار"){

html+=`

<button
class="green"
onclick="withdrawAction(${w.id},'approve')"
>
✅ تأیید
</button>

<button
class="red"
onclick="withdrawAction(${w.id},'reject')"
>
❌ رد
</button>

`;

}


html+=`

</div>
`;

});


out.innerHTML=html;

}


/* WITHDRAW ACTION */

async function withdrawAction(
id,
action
){

const r=
await api(
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

alert(
r.error||"خطا"
);

return;

}


alert(
r.message||
"عملیات انجام شد."
);


await adminWithdrawals();

}


/* ADMIN STATS */

async function adminStats(){

const out=
document
.getElementById("adminResult");

out.innerHTML=
"⏳ در حال دریافت آمار...";


const r=
await api(
"/api/admin/stats"
);


if(!r.ok){

out.innerHTML=
'<div class="err">'+
escapeHTML(
r.error||"خطا"
)+
"</div>";

return;

}


out.innerHTML=`

<h3>
📊 آمار سیستم
</h3>

<div class="grid">

<div class="stat">

<div class="small">
کاربران
</div>

<b>
${Number(
r.stats.users||0
)}
</b>

</div>


<div class="stat">

<div class="small">
درآمد ثبت‌شده
</div>

<b>
$${Number(
r.stats.income||0
).toFixed(2)}
</b>

</div>


<div class="stat">

<div class="small">
موجودی کاربران
</div>

<b>
$${Number(
r.stats.balance||0
).toFixed(2)}
</b>

</div>


<div class="stat">

<div class="small">
برداشت‌های در انتظار
</div>

<b>
${Number(
r.stats.pending_withdrawals||0
)}
</b>

</div>

</div>
`;

}


/* ESCAPE */

function escapeHTML(value){

return String(value??"")
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


/* START */

document.addEventListener(
"DOMContentLoaded",
function(){

if(token){

loadMe();

}else{

document
.getElementById("authBox")
.classList
.remove("hidden");

document
.getElementById("appBox")
.classList
.add("hidden");

}

if(adminToken){

document
.getElementById("adminPanel")
.classList
.remove("hidden");

}

}
);

</script>

</body>
</html>`;


/* =========================================================
   WORKER
========================================================= */

export default {

async fetch(request,env){

const url=
new URL(request.url);


/* JSON RESPONSE */

const json=(data,status=200)=>{

return new Response(
JSON.stringify(data),
{
status,
headers:{
"content-type":
"application/json;charset=UTF-8",
"cache-control":
"no-store"
}
}
);

};


/* BODY JSON */

async function bodyJSON(req){

try{

return await req.json();

}catch(e){

return {};

}

}


/* HEX */

function bytesToHex(bytes){

return Array
.from(new Uint8Array(bytes))
.map(
b=>
b.toString(16)
.padStart(2,"0")
)
.join("");

}


function hexToBytes(hex){

const arr=
new Uint8Array(
Math.floor(
hex.length/2
)
);

for(
let i=0;
i<arr.length;
i++
){

arr[i]=parseInt(
hex.substr(i*2,2),
16
);

}

return arr;

}


/* D1 CHECK */

if(!env.DB){

return json(
{
ok:false,
error:
"Binding با نام DB به Worker متصل نیست."
},
500
);

}


/* PASSWORD HASH */

async function hashPassword(
password,
saltHex
){

const salt=
saltHex
?
hexToBytes(saltHex)
:
crypto.getRandomValues(
new Uint8Array(16)
);


const key=
await crypto.subtle.importKey(
"raw",
new TextEncoder().encode(
password
),
"PBKDF2",
false,
["deriveBits"]
);


const bits=
await crypto.subtle.deriveBits(
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

salt:
bytesToHex(salt),

hash:
bytesToHex(bits)

};

}


async function makePassword(
password
){

const r=
await hashPassword(
password
);

return r.salt+
":"+
r.hash;

}


async function verifyPassword(
password,
stored
){

const parts=
String(stored||"")
.split(":");


if(parts.length!==2){

return false;

}


const r=
await hashPassword(
password,
parts[0]
);


return r.hash===
parts[1];

}


/* TOKEN */

function newToken(){

return crypto.randomUUID()+
"-"+
crypto.randomUUID();

}


/* USER */

async function getUser(request){

const auth=
request.headers
.get("authorization")||"";


if(!auth.startsWith(
"Bearer "
)){

return null;

}


const sessionToken=
auth
.slice(7)
.trim();


if(!sessionToken){

return null;

}


return await env.DB
.prepare(`
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
),
0
) AS total_income

FROM sessions s

JOIN users u
ON u.id=s.user_id

WHERE s.token=?

LIMIT 1
`)
.bind(
sessionToken
)
.first();

}


/* ADMIN TOKEN */

async function makeAdminToken(){

if(!env.ADMIN_PASSWORD){

return null;

}


const timestamp=
Date.now()
.toString();


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
new TextEncoder().encode(
timestamp
)
);


return timestamp+
"."+
bytesToHex(signature);

}


/* ADMIN CHECK */

async function adminOK(request){

if(!env.ADMIN_PASSWORD){

return false;

}


const token=
request.headers
.get("x-admin-token")||"";


const parts=
token.split(".");


if(parts.length!==2){

return false;

}


const timestamp=
Number(parts[0]);

const signatureHex=
parts[1];


if(
!Number.isFinite(timestamp)||
!signatureHex
){

return false;

}


/* اعتبار 24 ساعت */

if(
Date.now()-timestamp>
86400000||
timestamp-Date.now()>60000
){

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


/* =========================================================
   DATABASE
========================================================= */

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


try{

await initDB();

}catch(e){

return json(
{
ok:false,
error:
"خطا در اتصال یا ساخت D1",
detail:
e.message
},
500
);

}


/* =========================================================
   REGISTER
========================================================= */

if(
url.pathname===
"/api/register"&&
request.method===
"POST"
){

const body=
await bodyJSON(request);


const name=
String(
body.name||""
)
.trim();


const email=
String(
body.email||""
)
.trim()
.toLowerCase();


const password=
String(
body.password||""
);


if(
!name||
!email||
!email.includes("@")||
password.length<6
){

return json(
{
ok:false,
error:
"نام کامل، ایمیل معتبر و رمز حداقل ۶ کاراکتری لازم است."
},
400
);

}


const exists=
await env.DB
.prepare(`
SELECT id
FROM users
WHERE email=?
LIMIT 1
`)
.bind(email)
.first();


if(exists){

return json(
{
ok:false,
error:
"این ایمیل قبلاً ثبت‌نام کرده است."
},
409
);

}


const passwordHash=
await makePassword(
password
);


let result;


try{

result=
await env.DB
.prepare(`
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

return json(
{
ok:false,
error:
"ثبت حساب ناموفق بود.",
detail:
e.message
},
500
);

}


const userId=
result.meta.last_row_id;


const sessionToken=
newToken();


await env.DB
.prepare(`
INSERT INTO sessions
(token,user_id)
VALUES(?,?)
`)
.bind(
sessionToken,
userId
)
.run();


return json(
{
ok:true,
token:
sessionToken,
message:
"ثبت‌نام موفق بود."
}
);

}


/* =========================================================
   LOGIN
========================================================= */

if(
url.pathname===
"/api/login"&&
request.method===
"POST"
){

const body=
await bodyJSON(request);


const email=
String(
body.email||""
)
.trim()
.toLowerCase();


const password=
String(
body.password||""
);


const user=
await env.DB
.prepare(`
SELECT *
FROM users
WHERE email=?
LIMIT 1
`)
.bind(email)
.first();


if(!user){

return json(
{
ok:false,
error:
"ایمیل یا رمز عبور اشتباه است."
},
401
);

}


const valid=
await verifyPassword(
password,
user.password_hash
);


if(!valid){

return json(
{
ok:false,
error:
"ایمیل یا رمز عبور اشتباه است."
},
401
);

}


const sessionToken=
newToken();


await env.DB
.prepare(`
INSERT INTO sessions
(token,user_id)
VALUES(?,?)
`)
.bind(
sessionToken,
user.id
)
.run();


return json(
{
ok:true,
token:
sessionToken,
message:
"ورود موفق بود."
}
);

}


/* =========================================================
   LOGOUT
========================================================= */

if(
url.pathname===
"/api/logout"&&
request.method===
"POST"
){

const auth=
request.headers
.get("authorization")||"";


if(auth.startsWith(
"Bearer "
)){

await env.DB
.prepare(`
DELETE FROM sessions
WHERE token=?
`)
.bind(
auth
.slice(7)
.trim()
)
.run();

}


return json({
ok:true
});

}


/* =========================================================
   ME
========================================================= */

if(
url.pathname===
"/api/me"&&
request.method===
"GET"
){

const user=
await getUser(
request
);


if(!user){

return json(
{
ok:false,
error:
"وارد حساب شوید."
},
401
);

}


return json(
{
ok:true,
user
}
);

}


/* =========================================================
   TRANSACTIONS
========================================================= */

if(
url.pathname===
"/api/transactions"&&
request.method===
"GET"
){

const user=
await getUser(
request
);


if(!user){

return json(
{
ok:false,
error:
"وارد حساب شوید."
},
401
);

}


const result=
await env.DB
.prepare(`
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
.bind(
user.id
)
.all();


const labels={

income:
"💰 درآمد",

withdrawal:
"💵 درخواست برداشت",

withdrawal_approved:
"✅ برداشت تأیید شد",

refund:
"↩️ بازگشت مبلغ برداشت"

};


const transactions=
(result.results||[])
.map(x=>({

...x,

type_label:
labels[x.type]||
x.type

}));


return json(
{
ok:true,
transactions
}
);

}


/* =========================================================
   INCOME
========================================================= */

if(
url.pathname===
"/api/income"&&
request.method===
"GET"
){

const user=
await getUser(
request
);


if(!user){

return json(
{
ok:false,
error:
"وارد حساب شوید."
},
401
);

}


const result=
await env.DB
.prepare(`
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
.bind(
user.id
)
.all();


const rows=
result.results||[];


const total=
rows.reduce(
(sum,x)=>
sum+
Number(x.amount||0),
0
);


return json(
{
ok:true,
total,
incomes:
rows
}
);

}


/* =========================================================
   WITHDRAW
========================================================= */

if(
url.pathname===
"/api/withdraw"&&
request.method===
"POST"
){

const user=
await getUser(
request
);


if(!user){

return json(
{
ok:false,
error:
"وارد حساب شوید."
},
401
);

}


const body=
await bodyJSON(request);


const amount=
Number(body.amount);


const method=
String(
body.method||"USDT"
)
.trim();


const network=
String(
body.network||"TRC20"
)
.trim();


const address=
String(
body.address||""
)
.trim();


if(
!Number.isFinite(amount)||
amount<10
){

return json(
{
ok:false,
error:
"حداقل مبلغ برداشت $10 است."
},
400
);

}


if(method!=="USDT"){

return json(
{
ok:false,
error:
"روش برداشت نامعتبر است."
},
400
);

}


if(
![
"TRC20",
"BEP20",
"ERC20"
].includes(network)
){

return json(
{
ok:false,
error:
"شبکه نامعتبر است."
},
400
);

}


if(
!address||
address.length<10
){

return json(
{
ok:false,
error:
"آدرس کیف پول صحیح وارد کنید."
},
400
);

}


/* کم کردن موجودی */

const update=
await env.DB
.prepare(`
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


if(
!update.meta.changes
){

return json(
{
ok:false,
error:
"موجودی کافی نیست."
},
400
);

}


try{

const withdrawal=
await env.DB
.prepare(`
INSERT INTO withdrawals
(
