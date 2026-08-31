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
background:linear-gradient(135deg,#eef2ff,#f8fafc 45%,#ecfdf5);
color:#172033
}
header{
background:linear-gradient(135deg,#111827,#312e81);
color:#fff;
padding:22px 15px;
text-align:center;
position:sticky;
top:0;
z-index:20;
box-shadow:0 4px 20px #0002
}
header h1{margin:0;font-size:23px}
header p{margin:8px 0 0;color:#dbeafe;font-size:13px}
.container{max-width:1050px;margin:auto;padding:15px}
.card{
background:#fff;
border-radius:20px;
padding:18px;
margin:14px 0;
box-shadow:0 8px 30px rgba(15,23,42,.08);
border:1px solid #e5e7eb
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
outline:none;
background:#fff
}
input:focus,textarea:focus,select:focus{
border-color:#4f46e5;
box-shadow:0 0 0 3px #4f46e515
}
textarea{min-height:120px;resize:vertical}
button{
border:0;
border-radius:12px;
padding:12px 16px;
cursor:pointer;
font-family:inherit;
font-size:14px;
margin:4px;
transition:.2s
}
button:hover{transform:translateY(-1px);filter:brightness(.97)}
button:disabled{opacity:.6;cursor:not-allowed}
.primary{background:#4f46e5;color:#fff}
.green{background:#16a34a;color:#fff}
.red{background:#dc2626;color:#fff}
.gray{background:#e5e7eb;color:#111827}
.dark{background:#111827;color:#fff}
.orange{background:#f59e0b;color:#fff}
.purple{background:#7c3aed;color:#fff}
.blue{background:#0284c7;color:#fff}
.hidden{display:none!important}
.small{font-size:12px;color:#64748b}
.ok{color:#15803d}
.err{color:#b91c1c}
.balance{
font-size:31px;
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
min-height:88px;
font-weight:bold
}
.panelBtn span{
display:block;
font-size:25px;
margin-bottom:6px
}
.profileBox{
background:linear-gradient(135deg,#eef2ff,#e0e7ff);
padding:17px;
border-radius:17px
}
.balanceBox{
background:linear-gradient(135deg,#ecfdf5,#dcfce7);
padding:18px;
border-radius:17px;
margin-top:12px
}
.incomeBox{
background:linear-gradient(135deg,#eff6ff,#dbeafe);
padding:18px;
border-radius:17px;
margin-top:12px
}
.depositBox{
background:linear-gradient(135deg,#fff7ed,#ffedd5);
padding:18px;
border-radius:17px;
margin-top:12px
}
.withdrawBox{
background:#fff7ed;
padding:17px;
border-radius:17px
}
.adminItem{
background:#f8fafc;
padding:14px;
border-radius:14px;
margin:10px 0;
overflow:hidden;
border:1px solid #e5e7eb
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
.user{background:#dbeafe;margin-right:10%}
.bot{background:#f1f5f9;margin-left:10%}
.badge{
display:inline-block;
padding:5px 10px;
border-radius:20px;
background:#dcfce7;
color:#166534;
font-size:12px
}
.badgeWait{background:#fef3c7;color:#92400e}
.badgeBad{background:#fee2e2;color:#991b1b}
.divider{height:1px;background:#e5e7eb;margin:15px 0}
.sectionTitle{font-size:18px;font-weight:bold;margin-bottom:10px}
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
.plans{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:12px;
margin-top:12px
}
.plan{
border:2px solid #e5e7eb;
border-radius:18px;
padding:18px;
text-align:center;
background:#fff
}
.plan:hover{border-color:#6366f1}
.plan h3{margin:5px 0}
.plan .price{
font-size:25px;
font-weight:bold;
margin:12px 0;
color:#312e81
}
.plan button{width:100%;margin:0}
.paymentInfo{
background:#fff;
border-radius:14px;
padding:14px;
margin-top:12px
}
@media(max-width:700px){
.grid{grid-template-columns:repeat(2,1fr)}
.panelMenu{grid-template-columns:repeat(2,1fr)}
.plans{grid-template-columns:1fr}
}
@media(max-width:420px){
.grid{grid-template-columns:1fr}
.panelMenu{grid-template-columns:1fr}
}
</style>
</head>
<body>

<header>
<h1>🤖 دستیار هوش مصنوعی</h1>
<p>حساب کاربری • افزایش موجودی • درآمد • تراکنش • برداشت</p>
</header>

<div class="container">

<div id="authBox" class="card">
<h2>👤 حساب کاربری</h2>

<div id="loginForm">
<label>📧 ایمیل</label>
<input id="loginEmail" type="email" placeholder="ایمیل">

<label>🔐 رمز عبور</label>
<input id="loginPassword" type="password" placeholder="رمز عبور">

<div class="topActions">
<button class="primary" onclick="login()">🔐 ورود</button>
<button class="gray" onclick="showRegister()">📝 ثبت‌نام</button>
</div>
</div>

<div id="registerForm" class="hidden">
<label>👤 نام کامل</label>
<input id="regName" placeholder="نام کامل">

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
<span>🏠</span>داشبورد
</button>

<button class="panelBtn purple" onclick="showAI()">
<span>🤖</span>دستیار هوش مصنوعی
</button>

<button class="panelBtn green" onclick="showDeposit()">
<span>💳</span>افزایش موجودی
</button>

<button class="panelBtn orange" onclick="loadTransactions()">
<span>📊</span>تراکنش‌ها
</button>

<button class="panelBtn dark" onclick="loadIncome()">
<span>📈</span>درآمد
</button>

<button class="panelBtn blue" onclick="showWithdraw()">
<span>💵</span>برداشت
</button>

<button class="panelBtn gray" onclick="refreshAccount()">
<span>🔄</span>به‌روزرسانی
</button>

<button class="panelBtn red" onclick="logout()">
<span>🚪</span>خروج
</button>

</div>
</div>


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
💡 برای افزایش موجودی ابتدا یکی از پلن‌ها را انتخاب کنید.
پس از پرداخت، درخواست شما توسط مدیریت بررسی و تأیید می‌شود.
</div>
</div>


<div id="depositBox" class="card hidden">
<h2>💳 افزایش موجودی</h2>

<div class="notice">
حداقل پلن <b>۴۰۰,۰۰۰ تومان</b> است.
بعد از پرداخت، اطلاعات پرداخت را ثبت کنید تا مدیریت آن را بررسی کند.
</div>

<div class="plans">

<div class="plan">
<div>🟢</div>
<h3>پلن پایه</h3>
<div class="price">۴۰۰,۰۰۰ تومان</div>
<p class="small">شروع استفاده</p>
<button class="green" onclick="selectPlan(400000,'پلن پایه')">
انتخاب پلن
</button>
</div>

<div class="plan">
<div>🔵</div>
<h3>پلن حرفه‌ای</h3>
<div class="price">۷۰۰,۰۰۰ تومان</div>
<p class="small">امکانات بیشتر</p>
<button class="primary" onclick="selectPlan(700000,'پلن حرفه‌ای')">
انتخاب پلن
</button>
</div>

<div class="plan">
<div>🟣</div>
<h3>پلن ویژه</h3>
<div class="price">۱,۲۰۰,۰۰۰ تومان</div>
<p class="small">پلن کامل</p>
<button class="purple" onclick="selectPlan(1200000,'پلن ویژه')">
انتخاب پلن
</button>
</div>

</div>

<div id="paymentForm" class="paymentInfo hidden">

<h3>🧾 ثبت پرداخت</h3>

<div id="selectedPlan"></div>

<label>مبلغ پرداختی (تومان)</label>
<input id="depositAmount" type="number" readonly>

<label>روش پرداخت</label>
<select id="depositMethod">
<option value="bank">💳 کارت بانکی</option>
<option value="usdt">₮ USDT</option>
</select>

<label>شماره پیگیری / شناسه تراکنش</label>
<input id="depositReference" placeholder="شماره پیگیری پرداخت">

<label>توضیحات</label>
<textarea id="depositNote" placeholder="در صورت نیاز توضیح بنویسید..."></textarea>

<button class="green" onclick="submitDeposit()">
✅ ثبت درخواست پرداخت
</button>

<button class="gray" onclick="document.getElementById('paymentForm').classList.add('hidden')">
بستن
</button>

<div id="depositMsg" class="small"></div>

</div>

<div id="myDeposits" style="margin-top:15px"></div>

</div>


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


<div id="withdrawBox" class="card hidden">
<h2>💵 درخواست برداشت</h2>

<div class="withdrawBox">

<div class="small">حداقل برداشت: $10</div>

<label>مبلغ</label>
<input id="withdrawAmount" type="number" min="10" step="0.01" placeholder="مثلاً 10">

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
<input id="withdrawAddress" placeholder="آدرس کیف پول USDT">

<button class="green" onclick="withdraw()">✅ ثبت درخواست</button>
<button class="gray" onclick="showDashboard()">بستن</button>

<div id="withdrawMsg" class="small"></div>
</div>
</div>


<div id="transactionsBox" class="card hidden">
<h2>📊 تراکنش‌ها</h2>
<div id="transactions">⏳ در حال دریافت...</div>
</div>


<div id="incomeBox" class="card hidden">
<h2>📈 درآمد</h2>

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


<div id="adminBox" class="card">

<h2>🛠️ مدیریت سیستم</h2>

<label>🔐 رمز مدیریت</label>
<input id="adminPassword" type="password" placeholder="رمز مدیریت">

<button class="dark" onclick="adminLogin()">🔐 ورود مدیریت</button>

<div id="adminMsg" class="small"></div>

<div id="adminPanel" class="hidden">

<div class="divider"></div>

<div class="panelMenu">

<button class="panelBtn gray" onclick="adminUsers()">
<span>👥</span>کاربران
</button>

<button class="panelBtn green" onclick="adminIncome()">
<span>💰</span>ثبت درآمد
</button>

<button class="panelBtn orange" onclick="adminDeposits()">
<span>💳</span>پرداخت‌ها
</button>

<button class="panelBtn blue" onclick="adminWithdrawals()">
<span>💵</span>برداشت‌ها
</button>

<button class="panelBtn purple" onclick="adminStats()">
<span>📊</span>آمار
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

if(token)headers.authorization="Bearer "+token;
if(adminToken)headers["x-admin-token"]=adminToken;

try{

const res=await fetch(path,{...options,headers});
const text=await res.text();

try{
return JSON.parse(text);
}catch(e){

return{
ok:false,
error:"پاسخ نامعتبر از سرور",
status:res.status,
detail:text.slice(0,500)
};

}

}catch(e){

return{
ok:false,
error:"خطا در اتصال به سرور",
detail:e.message
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
el.className=ok?"small ok":"small err";
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
body:JSON.stringify({name,email,password})
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
body:JSON.stringify({email,password})
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
document.getElementById("accountStatus").textContent=r.user.status||"فعال";

setMoney("balance",r.user.balance);
setMoney("dashboardBalance",r.user.balance);

document.getElementById("dashboardName").textContent=r.user.name;
document.getElementById("dashboardEmail").textContent=r.user.email;

setMoney("totalIncome",r.user.total_income);
setMoney("dashboardIncome",r.user.total_income);

showDashboard();
}


function setMoney(id,value){
const el=document.getElementById(id);
if(el)el.textContent="$"+Number(value||0).toFixed(2);
}

async function refreshAccount(){
await loadMe();
}


async function logout(){

if(token)await api("/api/logout",{method:"POST"});

localStorage.removeItem("ai_token");
token="";
location.reload();
}


function hideUserSections(){

[
"dashboardBox",
"aiBox",
"depositBox",
"withdrawBox",
"transactionsBox",
"incomeBox"
].forEach(id=>{
document.getElementById(id).classList.add("hidden");
});

}

function showDashboard(){
hideUserSections();
document.getElementById("dashboardBox").classList.remove("hidden");
}

function showAI(){
hideUserSections();
document.getElementById("aiBox").classList.remove("hidden");
}

function showWithdraw(){
hideUserSections();
document.getElementById("withdrawBox").classList.remove("hidden");
loadMyWithdrawals();
}

function showDeposit(){
hideUserSections();
document.getElementById("depositBox").classList.remove("hidden");
loadMyDeposits();
}


function selectPlan(amount,name){

document.getElementById("paymentForm").classList.remove("hidden");
document.getElementById("depositAmount").value=amount;

document.getElementById("selectedPlan").innerHTML=
"<b>پلن انتخاب‌شده:</b> "+
escapeHTML(name)+
" — <b>"+Number(amount).toLocaleString("fa-IR")+" تومان</b>";

document.getElementById("depositMsg").textContent="";

window.scrollTo({
top:document.getElementById("paymentForm").offsetTop-100,
behavior:"smooth"
});

}


async function submitDeposit(){

const amount=Number(document.getElementById("depositAmount").value);
const method=document.getElementById("depositMethod").value;
const reference=document.getElementById("depositReference").value.trim();
const note=document.getElementById("depositNote").value.trim();
const out=document.getElementById("depositMsg");

if(!amount||amount<400000){
out.textContent="مبلغ پلن نامعتبر است.";
out.className="small err";
return;
}

if(!reference){
out.textContent="شماره پیگیری یا شناسه تراکنش را وارد کنید.";
out.className="small err";
return;
}

out.textContent="⏳ در حال ثبت درخواست...";
out.className="small";

const r=await api("/api/deposit",{
method:"POST",
body:JSON.stringify({
amount,
method,
reference,
note
})
});

if(!r.ok){
out.textContent=r.error||"ثبت درخواست ناموفق بود.";
out.className="small err";
return;
}

out.textContent="✅ درخواست پرداخت ثبت شد و منتظر بررسی مدیریت است.";
out.className="small ok";

document.getElementById("depositReference").value="";
document.getElementById("depositNote").value="";

await loadMyDeposits();
}


async function loadMyDeposits(){

const out=document.getElementById("myDeposits");

out.innerHTML="⏳ در حال دریافت درخواست‌ها...";

const r=await api("/api/deposits");

if(!r.ok){
out.innerHTML='<div class="err">'+escapeHTML(r.error||"خطا")+"</div>";
return;
}

if(!r.deposits.length){
out.innerHTML='<div class="small">هنوز درخواست پرداختی ثبت نشده است.</div>';
return;
}

out.innerHTML=
"<h3>🧾 درخواست‌های پرداخت من</h3>"+
r.deposits.map(d=>
'<div class="adminItem">'+
"<b>"+escapeHTML(d.plan_name||"پلن")+"</b>"+
"<br>💰 "+Number(d.amount_toman).toLocaleString("fa-IR")+" تومان"+
"<br>روش: "+escapeHTML(d.method)+
"<br>پیگیری: "+escapeHTML(d.reference)+
"<br>وضعیت: <b>"+escapeHTML(d.status)+"</b>"+
'<br><span class="small">'+escapeHTML(d.created_at||"")+"</span>"+
"</div>"
).join("");
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
body:JSON.stringify({message:question})
});

if(r.ok){
addMessage(r.answer||"پاسخی دریافت نشد.","bot");
}else{
addMessage("❌ "+(r.error||"خطا در دریافت پاسخ"),"bot");
}

btn.disabled=false;
btn.textContent="📤 ارسال";
}


function clearChat(){
document.getElementById("chat").innerHTML=
'<div class="msg bot">گفتگو پاک شد. سوال جدیدت را بنویس.</div>';
}


async function withdraw(){

const amount=Number(document.getElementById("withdrawAmount").value);
const method=document.getElementById("withdrawMethod").value;
const network=document.getElementById("withdrawNetwork").value;
const address=document.getElementById("withdrawAddress").value.trim();
const out=document.getElementById("withdrawMsg");

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
body:JSON.stringify({amount,method,network,address})
});

if(!r.ok){
out.textContent=r.error||"خطا در ثبت برداشت";
out.className="small err";
return;
}

out.textContent="✅ درخواست برداشت ثبت شد.";
out.className="small ok";

document.getElementById("withdrawAmount").value="";
document.getElementById("withdrawAddress").value="";

await loadMe();
}


async function loadMyWithdrawals(){

const box=document.getElementById("withdrawBox");

const old=document.getElementById("myWithdrawals");

if(old)old.remove();

const div=document.createElement("div");
div.id="myWithdrawals";
div.innerHTML="⏳ در حال دریافت برداشت‌ها...";
box.appendChild(div);

const r=await api("/api/withdrawals");

if(!r.ok){
div.innerHTML='<div class="err">'+escapeHTML(r.error||"خطا")+"</div>";
return;
}

if(!r.withdrawals.length){
div.innerHTML='<div class="small">هنوز درخواست برداشتی ثبت نشده است.</div>';
return;
}

div.innerHTML=
"<div class='divider'></div><h3>📋 برداشت‌های من</h3>"+
r.withdrawals.map(w=>
'<div class="adminItem">'+
"<b>$"+Number(w.amount).toFixed(2)+"</b>"+
"<br>روش: "+escapeHTML(w.method)+
"<br>شبکه: "+escapeHTML(w.network)+
"<br>وضعیت: <b>"+escapeHTML(w.status)+"</b>"+
'<br><span class="small">'+escapeHTML(w.created_at||"")+"</span>"+
"</div>"
).join("");
}


async function loadTransactions(){

hideUserSections();
document.getElementById("transactionsBox").classList.remove("hidden");

const out=document.getElementById("transactions");
out.innerHTML="⏳ در حال دریافت...";

const r=await api("/api/transactions");

if(!r.ok){
out.innerHTML='<div class="err">'+escapeHTML(r.error||"خطا")+"</div>";
return;
}

if(!r.transactions.length){
out.innerHTML='<div class="small">هنوز تراکنشی ثبت نشده است.</div>';
return;
}

out.innerHTML=r.transactions.map(t=>
'<div class="adminItem">'+
"<b>"+escapeHTML(t.type_label)+"</b>"+
"<br>💵 مبلغ: $"+Number(t.amount).toFixed(2)+
"<br>"+escapeHTML(t.description||"")+
'<br><span class="small">'+escapeHTML(t.created_at||"")+"</span></div>"
).join("");
}


async function loadIncome(){

hideUserSections();
document.getElementById("incomeBox").classList.remove("hidden");

const list=document.getElementById("incomeList");
list.innerHTML="⏳ در حال دریافت...";

const r=await api("/api/income");

if(!r.ok){
list.innerHTML='<div class="err">'+escapeHTML(r.error||"خطا")+"</div>";
return;
}

setMoney("incomeTotal",r.total);
document.getElementById("incomeCount").textContent=r.incomes.length;

if(!r.incomes.length){
list.innerHTML='<div class="small">هنوز درآمدی ثبت نشده است.</div>';
return;
}

list.innerHTML=r.incomes.map(x=>
'<div class="adminItem">'+
"<b>💰 "+escapeHTML(x.description||"درآمد")+"</b>"+
"<br>مبلغ: <b>$"+Number(x.amount).toFixed(2)+"</b>"+
'<br><span class="small">'+escapeHTML(x.created_at||"")+"</span></div>"
).join("");
}


async function adminLogin(){

const password=document.getElementById("adminPassword").value;
const msg=document.getElementById("adminMsg");

if(!password){
msg.textContent="رمز مدیریت را وارد کنید.";
msg.className="small err";
return;
}

msg.textContent="⏳ در حال ورود...";
msg.className="small";

const r=await api("/api/admin/login",{
method:"POST",
body:JSON.stringify({password})
});

if(!r.ok){
msg.textContent=r.error||"رمز مدیریت اشتباه است.";
msg.className="small err";
return;
}

adminToken=r.token;
localStorage.setItem("admin_token",adminToken);

msg.textContent="✅ ورود مدیریت موفق بود.";
msg.className="small ok";

document.getElementById("adminPanel").classList.remove("hidden");

await adminUsers();
}


async function adminUsers(){

const out=document.getElementById("adminResult");
out.innerHTML="⏳ در حال دریافت کاربران...";

const r=await api("/api/admin/users");

if(!r.ok){
out.innerHTML='<div class="err">'+escapeHTML(r.error||"خطا")+
"<br><small>"+escapeHTML(r.detail||"")+"</small></div>";
return;
}

if(!r.users.length){
out.innerHTML='<div class="small">کاربری وجود ندارد.</div>';
return;
}

let html="<h3>👥 کاربران</h3>";

r.users.forEach(u=>{

html+=
'<div class="adminItem">'+
"<b>"+escapeHTML(u.name)+"</b>"+
"<br>📧 "+escapeHTML(u.email)+
"<br>💵 موجودی: <b>$"+Number(u.balance).toFixed(2)+"</b>"+
"<br>📈 درآمد: <b>$"+Number(u.total_income).toFixed(2)+"</b>"+
"<br>📌 وضعیت: "+escapeHTML(u.status)+
"<hr>"+
'<input id="income_'+u.id+'" type="number" min="0.01" step="0.01" placeholder="مبلغ درآمد دلاری">'+
'<input id="desc_'+u.id+'" placeholder="توضیح درآمد">'+
'<button class="green" onclick="addIncome('+u.id+')">➕ ثبت درآمد</button>'+
"</div>";
});

out.innerHTML=html;
}


async function addIncome(userId){

const amount=Number(document.getElementById("income_"+userId).value);
const description=document.getElementById("desc_"+userId).value.trim();

if(!Number.isFinite(amount)||amount<=0){
alert("مبلغ معتبر وارد کنید.");
return;
}

const r=await api("/api/admin/add-income",{
method:"POST",
body:JSON.stringify({user_id:userId,amount,description})
});

if(!r.ok){
alert(r.error||"خطا");
return;
}

alert("✅ درآمد ثبت شد و موجودی افزایش یافت.");
await adminUsers();
}


async function adminDeposits(){

const out=document.getElementById("adminResult");
out.innerHTML="⏳ در حال دریافت پرداخت‌ها...";

const r=await api("/api/admin/deposits");

if(!r.ok){
out.innerHTML='<div class="err">'+escapeHTML(r.error||"خطا")+
"<br><small>"+escapeHTML(r.detail||"")+"</small></div>";
return;
}

if(!r.deposits.length){
out.innerHTML='<div class="small">درخواستی وجود ندارد.</div>';
return;
}

let html="<h3>💳 درخواست‌های پرداخت</h3>";

r.deposits.forEach(d=>{

html+=
'<div class="adminItem">'+
"<b>"+escapeHTML(d.name)+"</b>"+
"<br>📧 "+escapeHTML(d.email)+
"<br>💰 مبلغ: <b>"+Number(d.amount_toman).toLocaleString("fa-IR")+" تومان</b>"+
"<br>📦 "+escapeHTML(d.plan_name)+
"<br>روش: "+escapeHTML(d.method)+
"<br>پیگیری: "+escapeHTML(d.reference)+
"<br>📝 "+escapeHTML(d.note||"")+
"<br>وضعیت: <b>"+escapeHTML(d.status)+"</b>"+
"<br><span class='small'>"+escapeHTML(d.created_at||"")+"</span>";

if(d.status==="در انتظار"){

html+=
"<br><br>"+
'<button class="green" onclick="depositAction('+d.id+',\\'approve\\')">✅ تأیید و اضافه‌کردن موجودی</button>'+
'<button class="red" onclick="depositAction('+d.id+',\\'reject\\')">❌ رد</button>';
}

html+="</div>";
});

out.innerHTML=html;
}


async function depositAction(id,action){

const r=await api("/api/admin/deposit-action",{
method:"POST",
body:JSON.stringify({
deposit_id:id,
action
})
});

if(!r.ok){
alert(r.error||"خطا");
return;
}

alert(r.message||"عملیات انجام شد.");
await adminDeposits();
}


async function adminIncome(){

const out=document.getElementById("adminResult");
out.innerHTML="⏳ در حال دریافت درآمدها...";

const r=await api("/api/admin/income");

if(!r.ok){
out.innerHTML='<div class="err">'+escapeHTML(r.error||"خطا")+"</div>";
return;
}

if(!r.incomes.length){
out.innerHTML='<div class="small">درآمدی ثبت نشده است.</div>';
return;
}

let html="<h3>💰 درآمدهای ثبت‌شده</h3>";

r.incomes.forEach(x=>{

html+=
'<div class="adminItem">'+
"<b>"+escapeHTML(x.name)+"</b>"+
"<br>📧 "+escapeHTML(x.email)+
"<br>💰 مبلغ: <b>$"+Number(x.amount).toFixed(2)+"</b>"+
"<br>📝 "+escapeHTML(x.description||"")+
'<br><span class="small">'+escapeHTML(x.created_at||"")+"</span>"+
"</div>";
});

out.innerHTML=html;
}


async function adminWithdrawals(){

const out=document.getElementById("adminResult");
out.innerHTML="⏳ در حال دریافت برداشت‌ها...";

const r=await api("/api/admin/withdrawals");

if(!r.ok){
out.innerHTML='<div class="err">'+escapeHTML(r.error||"خطا")+"</div>";
return;
}

if(!r.withdrawals.length){
out.innerHTML='<div class="small">درخواستی وجود ندارد.</div>';
return;
}

let html="<h3>💵 برداشت‌ها</h3>";

r.withdrawals.forEach(w=>{

html+=
'<div class="adminItem">'+
"<b>"+escapeHTML(w.name)+"</b>"+
"<br>📧 "+escapeHTML(w.email)+
"<br>💵 مبلغ: <b>$"+Number(w.amount).toFixed(2)+"</b>"+
"<br>روش: "+escapeHTML(w.method)+
"<br>شبکه: "+escapeHTML(w.network)+
"<br>آدرس:<div class='address'>"+escapeHTML(w.address)+"</div>"+
"<br>وضعیت: <b>"+escapeHTML(w.status)+"</b>";

if(w.status==="در انتظار"){
html+=
"<br><br>"+
'<button class="green" onclick="withdrawAction('+w.id+',\\'approve\\')">✅ تأیید</button>'+
'<button class="red" onclick="withdrawAction('+w.id+',\\'reject\\')">❌ رد</button>';
}

html+="</div>";
});

out.innerHTML=html;
}


async function withdrawAction(id,action){

const r=await api("/api/admin/withdrawal-action",{
method:"POST",
body:JSON.stringify({
withdrawal_id:id,
action
})
});

if(!r.ok){
alert(r.error||"خطا");
return;
}

alert(r.message||"عملیات انجام شد.");
await adminWithdrawals();
}


async function adminStats(){

const out=document.getElementById("adminResult");
out.innerHTML="⏳ در حال دریافت آمار...";

const r=await api("/api/admin/stats");

if(!r.ok){
out.innerHTML='<div class="err">'+escapeHTML(r.error||"خطا")+"</div>";
return;
}

out.innerHTML=
"<h3>📊 آمار سیستم</h3>"+
'<div class="grid">'+
'<div class="stat"><div class="small">کاربران</div><b>'+r.stats.users+"</b></div>"+
'<div class="stat"><div class="small">درآمد ثبت‌شده</div><b>$'+Number(r.stats.income).toFixed(2)+"</b></div>"+
'<div class="stat"><div class="small">موجودی کاربران</div><b>$'+Number(r.stats.balance).toFixed(2)+"</b></div>"+
'<div class="stat"><div class="small">پرداخت‌های در انتظار</div><b>'+r.stats.pending_deposits+"</b></div>"+
'<div class="stat"><div class="small">برداشت‌های در انتظار</div><b>'+r.stats.pending_withdrawals+"</b></div>"+
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


if(token)loadMe();

</script>
</body>
</html>`;


export default {

async fetch(request,env){

const url=new URL(request.url);

const json=(data,status=200)=>new Response(
JSON.stringify(data),
{
status,
headers:{
"content-type":"application/json;charset=UTF-8",
"cache-control":"no-store"
}
}
);

async function bodyJSON(req){
try{return await req.json()}catch(e){return {}}
}

function bytesToHex(bytes){
return Array.from(new Uint8Array(bytes))
.map(b=>b.toString(16).padStart(2,"0")).join("");
}

function hexToBytes(hex){
const arr=new Uint8Array(Math.floor(hex.length/2));
for(let i=0;i<arr.length;i++)arr[i]=parseInt(hex.substr(i*2,2),16);
return arr;
}

async function hashPassword(password,saltHex){

const salt=saltHex?
hexToBytes(saltHex):
crypto.getRandomValues(new Uint8Array(16));

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

const r=await hashPassword(password,parts[0]);

return r.hash===parts[1];
}

function newToken(){
return crypto.randomUUID()+"-"+crypto.randomUUID();
}


async function getUser(request){

const auth=request.headers.get("authorization")||"";

if(!auth.startsWith("Bearer "))return null;

const sessionToken=auth.slice(7).trim();

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

if(!env.ADMIN_PASSWORD)return null;

const timestamp=Date.now().toString();

const key=await crypto.subtle.importKey(
"raw",
new TextEncoder().encode(env.ADMIN_PASSWORD),
{name:"HMAC",hash:"SHA-256"},
false,
["sign"]
);

const signature=await crypto.subtle.sign(
"HMAC",
key,
new TextEncoder().encode(timestamp)
);

return timestamp+"."+bytesToHex(signature);
}


async function adminOK(request){

if(!env.ADMIN_PASSWORD)return false;

const token=request.headers.get("x-admin-token")||"";
const parts=token.split(".");

if(parts.length!==2)return false;

const timestamp=Number(parts[0]);

if(!Number.isFinite(timestamp))return false;

if(Date.now()-timestamp>86400000)return false;
if(timestamp-Date.now()>60000)return false;

try{

const key=await crypto.subtle.importKey(
"raw",
new TextEncoder().encode(env.ADMIN_PASSWORD),
{name:"HMAC",hash:"SHA-256"},
false,
["verify"]
);

return await crypto.subtle.verify(
"HMAC",
key,
hexToBytes(parts[1]),
new TextEncoder().encode(String(timestamp))
);

}catch(e){
return false;
}
}


async function initDB(){

await env.DB.prepare(`
CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
email TEXT NOT NULL UNIQUE,
password_hash TEXT NOT NULL,
balance REAL NOT NULL DEFAULT 0,
status TEXT NOT NULL DEFAULT 'فعال',
created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`).run();

await env.DB.prepare(`
CREATE TABLE IF NOT EXISTS sessions(
id INTEGER PRIMARY KEY AUTOINCREMENT,
token TEXT NOT NULL UNIQUE,
user_id INTEGER NOT NULL,
created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`).run();

await env.DB.prepare(`
CREATE TABLE IF NOT EXISTS transactions(
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
type TEXT NOT NULL,
amount REAL NOT NULL,
description TEXT,
created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`).run();

await env.DB.prepare(`
CREATE TABLE IF NOT EXISTS withdrawals(
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
amount REAL NOT NULL,
method TEXT NOT NULL,
network TEXT NOT NULL DEFAULT 'TRC20',
address TEXT NOT NULL,
status TEXT NOT NULL DEFAULT 'در انتظار',
created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`).run();

await env.DB.prepare(`
CREATE TABLE IF NOT EXISTS deposits(
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
plan_name TEXT NOT NULL,
amount_toman INTEGER NOT NULL,
method TEXT NOT NULL,
reference TEXT NOT NULL,
note TEXT,
status TEXT NOT NULL DEFAULT 'در انتظار',
created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`).run();

}


try{

if(!env.DB){
return json({
ok:false,
error:"D1 binding با نام DB متصل نیست."
},500);
}

await initDB();


/* REGISTER */

if(url.pathname==="/api/register"&&request.method==="POST"){

const body=await bodyJSON(request);

const name=String(body.name||"").trim();
const email=String(body.email||"").trim().toLowerCase();
const password=String(body.password||"");

if(!name||!email.includes("@")||password.length<6){

return json({
ok:false,
error:"نام کامل، ایمیل معتبر و رمز حداقل ۶ کاراکتری لازم است."
},400);
}

const exists=await env.DB.prepare(
"SELECT id FROM users WHERE email=? LIMIT 1"
).bind(email).first();

if(exists){
return json({
ok:false,
error:"این ایمیل قبلاً ثبت‌نام کرده است."
},409);
}

const passwordHash=await makePassword(password);

const result=await env.DB.prepare(`
INSERT INTO users(name,email,password_hash,balance,status)
VALUES(?,?,?,0,'فعال')
`).bind(name,email,passwordHash).run();

const userId=result.meta.last_row_id;
const sessionToken=newToken();

await env.DB.prepare(`
INSERT INTO sessions(token,user_id) VALUES(?,?)
`).bind(sessionToken,userId).run();

return json({
ok:true,
token:sessionToken,
message:"ثبت‌نام موفق بود."
});
}


/* LOGIN */

if(url.pathname==="/api/login"&&request.method==="POST"){

const body=await bodyJSON(request);

const email=String(body.email||"").trim().toLowerCase();
const password=String(body.password||"");

const user=await env.DB.prepare(
"SELECT * FROM users WHERE email=? LIMIT 1"
).bind(email).first();

if(!user||!(await verifyPassword(password,user.password_hash))){

return json({
ok:false,
error:"ایمیل یا رمز عبور اشتباه است."
},401);
}

const sessionToken=newToken();

await env.DB.prepare(`
INSERT INTO sessions(token,user_id) VALUES(?,?)
`).bind(sessionToken,user.id).run();

return json({
ok:true,
token:sessionToken,
message:"ورود موفق بود."
});
}


/* LOGOUT */

if(url.pathname==="/api/logout"&&request.method==="POST"){

const auth=request.headers.get("authorization")||"";

if(auth.startsWith("Bearer ")){

await env.DB.prepare(
"DELETE FROM sessions WHERE token=?"
).bind(auth.slice(7).trim()).run();

}

return json({ok:true});
}


/* ME */

if(url.pathname==="/api/me"&&request.method==="GET"){

const user=await getUser(request);

if(!user)return json({
ok:false,
error:"وارد حساب شوید."
},401);

return json({ok:true,user});
}


/* DEPOSIT CREATE */

if(url.pathname==="/api/deposit"&&request.method==="POST"){

const user=await getUser(request);

if(!user)return json({
ok:false,
error:"وارد حساب شوید."
},401);

const body=await bodyJSON(request);

const amount=Number(body.amount);
const method=String(body.method||"").trim();
const reference=String(body.reference||"").trim();
const note=String(body.note||"").trim();

let plan="";

if(amount===400000)plan="پلن پایه";
else if(amount===700000)plan="پلن حرفه‌ای";
else if(amount===1200000)plan="پلن ویژه";
else return json({
ok:false,
error:"پلن انتخاب‌شده معتبر نیست."
},400);

if(!reference)return json({
ok:false,
error:"شماره پیگیری را وارد کنید."
},400);

const r=await env.DB.prepare(`
INSERT INTO deposits
(user_id,plan_name,amount_toman,method,reference,note,status)
VALUES(?,?,?,?,?,?, 'در انتظار')
`).bind(
user.id,
plan,
amount,
method,
reference,
note
).run();

return json({
ok:true,
deposit_id:r.meta.last_row_id,
message:"درخواست پرداخت ثبت شد."
});
}


/* MY DEPOSITS */

if(url.pathname==="/api/deposits"&&request.method==="GET"){

const user=await getUser(request);

if(!user)return json({
ok:false,
error:"وارد حساب شوید."
},401);

const r=await env.DB.prepare(`
SELECT id,plan_name,amount_toman,method,reference,note,status,created_at
FROM deposits
WHERE user_id=?
ORDER BY id DESC
LIMIT 100
`).bind(user.id).all();

return json({
ok:true,
deposits:r.results||[]
});
}


/* TRANSACTIONS */

if(url.pathname==="/api/transactions"&&request.method==="GET"){

const user=await getUser(request);

if(!user)return json({
ok:false,
error:"وارد حساب شوید."
},401);

const r=await env.DB.prepare(`
SELECT id,type,amount,description,created_at
FROM transactions
WHERE user_id=?
ORDER BY id DESC
LIMIT 100
`).bind(user.id).all();

const labels={
income:"💰 درآمد",
withdrawal:"💵 درخواست برداشت",
withdrawal_approved:"✅ برداشت تأیید شد",
refund:"↩️ بازگشت مبلغ برداشت",
deposit_approved:"💳 افزایش موجودی"
};

return json({
ok:true,
transactions:(r.results||[]).map(x=>({
...x,
type_label:labels[x.type]||x.type
}))
});
}


/* INCOME */

if(url.pathname==="/api/income"&&request.method==="GET"){

const user=await getUser(request);

if(!user)return json({
ok:false,
error:"وارد حساب شوید."
},401);

const r=await env.DB.prepare(`
SELECT id,amount,description,created_at
FROM transactions
WHERE user_id=? AND type='income'
ORDER BY id DESC
LIMIT 100
`).bind(user.id).all();

const rows=r.results||[];

return json({
ok:true,
total:rows.reduce((s,x)=>s+Number(x.amount||0),0),
incomes:rows
});
}


/* WITHDRAW */

if(url.pathname==="/api/withdraw"&&request.method==="POST"){

const user=await getUser(request);

if(!user)return json({
ok:false,
error:"وارد حساب شوید."
},401);

const body=await bodyJSON(request);

const amount=Number(body.amount);
const method=String(body.method||"USDT");
const network=String(body.network||"TRC20");
const address=String(body.address||"").trim();

if(!Number.isFinite(amount)||amount<10){

return json({
ok:false,
error:"حداقل برداشت $10 است."
},400);
}

if(!["TRC20","BEP20","ERC20"].includes(network)){

return json({
ok:false,
error:"شبکه نامعتبر است."
},400);
}

if(!address||address.length<10){

return json({
ok:false,
error:"آدرس کیف پول صحیح وارد کنید."
},400);
}

const update=await env.DB.prepare(`
UPDATE users
SET balance=balance-?
WHERE id=? AND balance>=?
`).bind(amount,user.id,amount).run();

if(!update.meta.changes){

return json({
ok:false,
error:"موجودی کافی نیست."
},400);
}

try{

const w=await env.DB.prepare(`
INSERT INTO withdrawals
(user_id,amount,method,network,address,status)
VALUES(?,?,?,?,?,'در انتظار')
`).bind(
user.id,amount,method,network,address
).run();

await env.DB.prepare(`
INSERT INTO transactions
(user_id,type,amount,description)
VALUES(?,?,?,?)
`).bind(
user.id,
"withdrawal",
amount,
"درخواست برداشت "+method+" "+network
).run();

return json({
ok:true,
withdrawal_id:w.meta.last_row_id,
message:"درخواست برداشت ثبت شد."
});

}catch(e){

await env.DB.prepare(`
UPDATE users SET balance=balance+? WHERE id=?
`).bind(amount,user.id).run();

throw e;
}
}


/* MY WITHDRAWALS */

if(url.pathname==="/api/withdrawals"&&request.method==="GET"){

const user=await getUser(request);

if(!user)return json({
ok:false,
error:"وارد حساب شوید."
},401);

const r=await env.DB.prepare(`
SELECT id,amount,method,network,status,created_at
FROM withdrawals
WHERE user_id=?
ORDER BY id DESC
LIMIT 100
`).bind(user.id).all();

return json({
ok:true,
withdrawals:r.results||[]
});
}


/* AI */

if(url.pathname==="/api/ai"&&request.method==="POST"){

const user=await getUser(request);

if(!user)return json({
ok:false,
error:"ابتدا وارد حساب شوید."
},401);

if(!env.AI)return json({
ok:false,
error:"Binding هوش مصنوعی AI تنظیم نشده است."
},500);

const body=await bodyJSON(request);
const message=String(body.message||"").trim();

if(!message)return json({
ok:false,
error:"پیام خالی است."
},400);

const result=await env.AI.run(
"@cf/meta/llama-3.1-8b-instruct",
{
messages:[
{
role:"system",
content:"You are a helpful AI assistant. Answer clearly and accurately. If the user writes Persian, answer in Persian."
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
answer:result?.response||result?.result?.response||"پاسخی دریافت نشد."
});
}


/* ADMIN LOGIN */

if(url.pathname==="/api/admin/login"&&request.method==="POST"){

const body=await bodyJSON(request);
const password=String(body.password||"");

if(!env.ADMIN_PASSWORD)return json({
ok:false,
error:"ADMIN_PASSWORD در Secrets تنظیم نشده است."
},500);

if(password!==env.ADMIN_PASSWORD)return json({
ok:false,
error:"رمز مدیریت اشتباه است."
},401);

return json({
ok:true,
token:await makeAdminToken(),
message:"ورود مدیریت موفق بود."
});
}


/* ADMIN USERS */

if(url.pathname==="/api/admin/users"&&request.method==="GET"){

if(!await adminOK(request))return json({
ok:false,
error:"دسترسی مدیریت لازم است."
},403);

const r=await env.DB.prepare(`
SELECT
u.id,u.name,u.email,u.balance,u.status,u.created_at,
COALESCE(
(
SELECT SUM(t.amount)
FROM transactions t
WHERE t.user_id=u.id AND t.type='income'
),0
) AS total_income
FROM users u
ORDER BY u.id DESC
`).all();

return json({
ok:true,
users:r.results||[]
});
}


/* ADMIN ADD INCOME */

if(url.pathname==="/api/admin/add-income"&&request.method==="POST"){

if(!await adminOK(request))return json({
ok:false,
error:"دسترسی مدیریت لازم است."
},403);

const body=await bodyJSON(request);

const userId=Number(body.user_id);
const amount=Number(body.amount);
const description=String(body.description||"درآمد ثبت‌شده توسط مدیریت").trim();

if(!Number.isInteger(userId)||userId<=0||!Number.isFinite(amount)||amount<=0){

return json({
ok:false,
error:"اطلاعات درآمد نامعتبر است."
},400);
}

const user=await env.DB.prepare(
"SELECT id FROM users WHERE id=? LIMIT 1"
).bind(userId).first();

if(!user)return json({
ok:false,
error:"کاربر پیدا نشد."
},404);

await env.DB.prepare(`
UPDATE users SET balance=balance+? WHERE id=?
`).bind(amount,userId).run();

await env.DB.prepare(`
INSERT INTO transactions
(user_id,type,amount,description)
VALUES(?,?,?,?)
`).bind(
userId,"income",amount,description
).run();

return json({
ok:true,
message:"درآمد ثبت و موجودی افزایش یافت."
});
}


/* ADMIN DEPOSITS */

if(url.pathname==="/api/admin/deposits"&&request.method==="GET"){

if(!await adminOK(request))return json({
ok:false,
error:"دسترسی مدیریت لازم است."
},403);

const r=await env.DB.prepare(`
SELECT
d.id,
d.user_id,
u.name,
u.email,
d.plan_name,
d.amount_toman,
d.method,
d.reference,
d.note,
d.status,
d.created_at
FROM deposits d
JOIN users u ON u.id=d.user_id
ORDER BY d.id DESC
LIMIT 200
`).all();

return json({
ok:true,
deposits:r.results||[]
});
}


/* ADMIN DEPOSIT ACTION */

if(url.pathname==="/api/admin/deposit-action"&&request.method==="POST"){

if(!await adminOK(request))return json({
ok:false,
error:"دسترسی مدیریت لازم است."
},403);

const body=await bodyJSON(request);

const depositId=Number(body.deposit_id);
const action=String(body.action||"");

if(!Number.isInteger(depositId)||!["approve","reject"].includes(action)){

return json({
ok:false,
error:"عملیات نامعتبر است."
},400);
}

const deposit=await env.DB.prepare(`
SELECT * FROM deposits
WHERE id=?
LIMIT 1
`).bind(depositId).first();

if(!deposit)return json({
ok:false,
error:"درخواست پرداخت پیدا نشد."
},404);

if(deposit.status!=="در انتظار")return json({
ok:false,
error:"این درخواست قبلاً بررسی شده است."
},400);

if(action==="approve"){

const result=await env.DB.prepare(`
UPDATE deposits
SET status='تأیید شد'
WHERE id=? AND status='در انتظار'
`).bind(depositId).run();

if(!result.meta.changes)return json({
ok:false,
error:"درخواست قبلاً پردازش شده است."
},409);

/*
در این نسخه برای تبدیل تومان به اعتبار دلاری،
مبلغ پرداختی به صورت دستی توسط مدیر به حساب کاربر
اضافه نمی‌شود؛ زیرا نرخ تبدیل دلار/تومان باید مشخص باشد.
بنابراین فقط پرداخت تأیید می‌شود.
مدیر سپس از بخش کاربران مبلغ درآمد/اعتبار دلاری را ثبت می‌کند.
*/

await env.DB.prepare(`
INSERT INTO transactions
(user_id,type,amount,description)
VALUES(?,?,?,?)
`).bind(
deposit.user_id,
"deposit_approved",
0,
"پرداخت "+deposit.plan_name+" تأیید شد"
).run();

return json({
ok:true,
message:"پرداخت تأیید شد. برای افزایش اعتبار دلاری، مبلغ اعتبار را از بخش کاربران ثبت کنید."
});
}


const result=await env.DB.prepare(`
UPDATE deposits
SET status='رد شد'
WHERE id=? AND status='در انتظار'
`).bind(depositId).run();

if(!result.meta.changes)return json({
ok:false,
error:"درخواست قبلاً پردازش شده است."
},409);

return json({
ok:true,
message:"درخواست پرداخت رد شد."
});
}


/* ADMIN INCOME */

if(url.pathname==="/api/admin/income"&&request.method==="GET"){

if(!await adminOK(request))return json({
ok:false,
error:"دسترسی مدیریت لازم است."
},403);

const r=await env.DB.prepare(`
SELECT
t.id,t.amount,t.description,t.created_at,
u.name,u.email
FROM transactions t
JOIN users u ON u.id=t.user_id
WHERE t.type='income'
ORDER BY t.id DESC
LIMIT 200
`).all();

return json({
ok:true,
incomes:r.results||[]
});
}


/* ADMIN WITHDRAWALS */

if(url.pathname==="/api/admin/withdrawals"&&request.method==="GET"){

if(!await adminOK(request))return json({
ok:false,
error:"دسترسی مدیریت لازم است."
},403);

const r=await env.DB.prepare(`
SELECT
w.id,w.user_id,u.name,u.email,
w.amount,w.method,w.network,w.address,w.status,w.created_at
FROM withdrawals w
JOIN users u ON u.id=w.user_id
ORDER BY w.id DESC
`).all();

return json({
ok:true,
withdrawals:r.results||[]
});
}


/* ADMIN WITHDRAWAL ACTION */

if(url.pathname==="/api/admin/withdrawal-action"&&request.method==="POST"){

if(!await adminOK(request))return json({
ok:false,
error:"دسترسی مدیریت لازم است."
},403);

const body=await bodyJSON(request);

const id=Number(body.withdrawal_id);
const action=String(body.action||"");

if(!Number.isInteger(id)||!["approve","reject"].includes(action)){

return json({
ok:false,
error:"عملیات نامعتبر است."
},400);
}

const withdrawal=await env.DB.prepare(`
SELECT * FROM withdrawals
WHERE id=?
LIMIT 1
`).bind(id).first();

if(!withdrawal)return json({
ok:false,
error:"درخواست برداشت پیدا نشد."
},404);

if(withdrawal.status!=="در انتظار")return json({
ok:false,
error:"این درخواست قبلاً بررسی شده است."
},400);

if(action==="approve"){

const r=await env.DB.prepare(`
UPDATE withdrawals
SET status='تأیید شد'
WHERE id=? AND status='در انتظار'
`).bind(id).run();

if(!r.meta.changes)return json({
ok:false,
error:"درخواست قبلاً پردازش شده است."
},409);

await env.DB.prepare(`
INSERT INTO transactions
(user_id,type,amount,description)
VALUES(?,?,?,?)
`).bind(
withdrawal.user_id,
"withdrawal_approved",
withdrawal.amount,
"برداشت تأیید شد"
).run();

return json({
ok:true,
message:"برداشت تأیید شد."
});
}


const r=await env.DB.prepare(`
UPDATE withdrawals
SET status='رد شد'
WHERE id=? AND status='در انتظار'
`).bind(id).run();

if(!r.meta.changes)return json({
ok:false,
error:"درخواست قبلاً پردازش شده است."
},409);

await env.DB.prepare(`
UPDATE users
SET balance=balance+?
WHERE id=?
`).bind(
withdrawal.amount,
withdrawal.user_id
).run();

await env.DB.prepare(`
INSERT INTO transactions
(user_id,type,amount,description)
VALUES(?,?,?,?)
`).bind(
withdrawal.user_id,
"refund",
withdrawal.amount,
"بازگشت مبلغ برداشت رد شده"
).run();

return json({
ok:true,
message:"برداشت رد شد و مبلغ به موجودی برگشت."
});
}


/* ADMIN STATS */

if(url.pathname==="/api/admin/stats"&&request.method==="GET"){

if(!await adminOK(request))return json({
ok:false,
error:"دسترسی مدیریت لازم است."
},403);

const users=await env.DB.prepare(
"SELECT COUNT(*) AS total FROM users"
).first();

const income=await env.DB.prepare(`
SELECT COALESCE(SUM(amount),0) AS total
FROM transactions
WHERE type='income'
`).first();

const balance=await env.DB.prepare(`
SELECT COALESCE(SUM(balance),0) AS total
FROM users
`).first();

const pendingDeposits=await env.DB.prepare(`
SELECT COUNT(*) AS total
FROM deposits
WHERE status='در انتظار'
`).first();

const pendingWithdrawals=await env.DB.prepare(`
SELECT COUNT(*) AS total
FROM withdrawals
WHERE status='در انتظار'
`).first();

return json({
ok:true,
stats:{
users:Number(users?.total||0),
income:Number(income?.total||0),
balance:Number(balance?.total||0),
pending_deposits:Number(pendingDeposits?.total||0),
pending_withdrawals:Number(pendingWithdrawals?.total||0)
}
});
}


/* HOME */

if(request.method==="GET"&&url.pathname==="/"){

return new Response(HTML,{
headers:{
"content-type":"text/html;charset=UTF-8",
"cache-control":"no-store"
}
});
}

return json({
ok:false,
error:"مسیر پیدا نشد."
},404);


}catch(e){

console.error("WORKER_ERROR",e);

return json({
ok:false,
error:"خطای داخلی سرور",
detail:e?.message||String(e)
},500);

}

}

};
