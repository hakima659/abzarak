
const PLANS = [
  { id: "p400",  title: "پلن ۴۰۰ هزار تومان",  irr: 400000,  usd: 6 },
  { id: "p700",  title: "پلن ۷۰۰ هزار تومان",  irr: 700000,  usd: 10 },
  { id: "p1000", title: "پلن ۱ میلیون تومان",  irr: 1000000, usd: 15 },
  { id: "p1500", title: "پلن ۱.۵ میلیون تومان", irr: 1500000, usd: 22 },
  { id: "p2000", title: "پلن ۲ میلیون تومان",   irr: 2000000, usd: 30 }
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
 color:white;
 padding:18px;
 text-align:center
}
.container{
 max-width:1000px;
 margin:auto;
 padding:18px
}
.card{
 background:white;
 border-radius:18px;
 padding:20px;
 margin:15px 0;
 box-shadow:0 5px 20px #00000012
}
h1,h2,h3{margin-top:0}
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
 color:white;
 border:0;
 cursor:pointer
}
button:hover{opacity:.9}
.danger{background:#dc2626}
.success{background:#16a34a}
.dark{background:#111827}
.grid{
 display:grid;
 grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
 gap:15px
}
.plan{
 border:2px solid #e5e7eb;
 border-radius:16px;
 padding:18px
}
.plan strong{
 font-size:22px;
 display:block;
 margin:8px 0
}
.hidden{display:none}
.msg{
 padding:10px;
 border-radius:10px;
 margin:8px 0;
 background:#eef2ff
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
small{color:#64748b}
.balance{
 font-size:28px;
 font-weight:bold
}
.nav{
 display:flex;
 gap:8px;
 flex-wrap:wrap;
 margin-bottom:15px
}
.nav button{width:auto}
.badge{
 display:inline-block;
 padding:5px 9px;
 border-radius:20px;
 background:#eef2ff
}
</style>
</head>

<body>

<header>
<h1>🤖 دستیار هوش مصنوعی</h1>
<div>دستیار هوشمند • حساب کاربری • درآمد • پرداخت • برداشت</div>
</header>

<div class="container">

<div id="auth">

<div class="card">
<h2>ورود به حساب</h2>

<input id="loginEmail" type="email" placeholder="ایمیل">
<input id="loginPassword" type="password" placeholder="رمز عبور">

<button onclick="login()">ورود</button>
<button class="dark" onclick="showRegister()">ثبت‌نام</button>
<button onclick="showForgot()">بازیابی رمز</button>

<div id="loginMsg"></div>
</div>

<div id="registerBox" class="card hidden">
<h2>ثبت‌نام</h2>

<input id="regName" placeholder="نام">
<input id="regEmail" type="email" placeholder="ایمیل">
<input id="regPassword" type="password" placeholder="رمز عبور">

<button onclick="register()">ایجاد حساب</button>
<button class="dark" onclick="hideBoxes()">بازگشت</button>

<div id="regMsg"></div>
</div>

<div id="forgotBox" class="card hidden">
<h2>بازیابی رمز</h2>

<input id="forgotEmail" type="email" placeholder="ایمیل">

<button onclick="forgot()">بازیابی</button>
<button class="dark" onclick="hideBoxes()">بازگشت</button>

<div id="forgotMsg"></div>
</div>

<div class="card">
<h3>🛠️ پنل مدیریت</h3>
<input id="adminPassword" type="password" placeholder="رمز مدیریت">
<button onclick="adminLogin()">ورود مدیریت</button>
<div id="adminLoginMsg"></div>
</div>

</div>


<div id="app" class="hidden">

<div class="nav">
<button onclick="showPanel('home')">🏠 حساب</button>
<button onclick="showPanel('plans')">💰 پلن‌ها</button>
<button onclick="showPanel('payments')">💳 پرداخت‌ها</button>
<button onclick="showPanel('withdraw')">💸 برداشت</button>
<button class="danger" onclick="logout()">خروج</button>
</div>

<div id="home" class="panel">

<div class="card">
<h2>👤 حساب کاربری</h2>
<div id="profile">در حال بارگذاری...</div>
</div>

<div class="card">
<h2>💰 موجودی</h2>
<div class="balance" id="balance">در حال بارگذاری...</div>
</div>

<div class="card">
<h2>📊 تراکنش‌ها</h2>
<div id="transactions">در حال بارگذاری...</div>
</div>

</div>


<div id="plans" class="panel hidden">

<div class="card">
<h2>💰 پلن‌های اشتراک</h2>
<p>برای کاربران ایران قیمت تومان و برای کاربران خارج از ایران قیمت دلار نمایش داده می‌شود.</p>

<div class="grid" id="plansBox"></div>
</div>

</div>


<div id="payments" class="panel hidden">

<div class="card">
<h2>💳 پرداخت</h2>

<select id="currency">
<option value="IRR">🇮🇷 تومان - ایران</option>
<option value="USD">🌎 دلار - خارج از ایران</option>
</select>

<select id="paymentPlan"></select>

<button onclick="createPayment()">ایجاد سفارش پرداخت</button>

<div id="paymentMsg"></div>
</div>

</div>


<div id="withdraw" class="panel hidden">

<div class="card">
<h2>💸 درخواست برداشت</h2>

<input id="withdrawAmount" type="number" placeholder="مبلغ برداشت">

<select id="withdrawMethod">
<option value="USDT">USDT</option>
<option value="BANK">حساب بانکی</option>
</select>

<input id="withdrawAddress" placeholder="آدرس کیف پول یا اطلاعات حساب">

<button onclick="withdraw()">ثبت درخواست برداشت</button>

<div id="withdrawMsg"></div>
</div>

</div>

</div>


<div id="admin" class="hidden">

<div class="nav">
<button onclick="adminUsers()">👥 کاربران</button>
<button onclick="adminWithdrawals()">💸 برداشت‌ها</button>
<button onclick="adminPayments()">💳 پرداخت‌ها</button>
<button onclick="adminPlans()">💰 پلن‌ها</button>
<button class="danger" onclick="adminLogout()">خروج مدیریت</button>
</div>

<div id="adminContent"></div>

</div>

</div>


<script>

let token = localStorage.getItem("user_token") || "";
let adminToken = localStorage.getItem("admin_token") || "";

function $(id){
 return document.getElementById(id);
}

function msg(id,text){
 $(id).innerHTML='<div class="msg">'+text+'</div>';
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
 document.querySelectorAll(".panel").forEach(x=>x.classList.add("hidden"));
 $(id).classList.remove("hidden");
}

async function api(url,options={}){
 try{
  const headers=options.headers||{};
  headers["Content-Type"]="application/json";

  if(token) headers["Authorization"]="Bearer "+token;
  if(adminToken) headers["X-Admin-Token"]=adminToken;

  const r=await fetch(url,{...options,headers});
  const text=await r.text();

  let data;
  try{
   data=JSON.parse(text);
  }catch(e){
   throw new Error("پاسخ نامعتبر از سرور");
  }

  if(!r.ok || data.ok===false){
   throw new Error(data.error || "خطای سرور");
  }

  return data;

 }catch(e){
  throw e;
 }
}

async function register(){

 try{

  const data=await api("/api/register",{
   method:"POST",
   body:JSON.stringify({
    name:$("regName").value.trim(),
    email:$("regEmail").value.trim(),
    password:$("regPassword").value
   })
  });

  msg("regMsg","✅ ثبت‌نام با موفقیت انجام شد. حالا وارد شوید.");

  $("registerBox").classList.add("hidden");

 }catch(e){
  msg("regMsg","❌ "+e.message);
 }
}

async function login(){

 try{

  const data=await api("/api/login",{
   method:"POST",
   body:JSON.stringify({
    email:$("loginEmail").value.trim(),
    password:$("loginPassword").value
   })
  });

  token=data.token;
  localStorage.setItem("user_token",token);

  $("auth").classList.add("hidden");
  $("app").classList.remove("hidden");

  loadUser();
  loadPlans();

 }catch(e){
  msg("loginMsg","❌ "+e.message);
 }
}

async function forgot(){

 try{

  const data=await api("/api/forgot",{
   method:"POST",
   body:JSON.stringify({
    email:$("forgotEmail").value.trim()
   })
  });

  msg("forgotMsg",data.message || "درخواست ثبت شد.");

 }catch(e){
  msg("forgotMsg","❌ "+e.message);
 }
}

async function loadUser(){

 try{

  const data=await api("/api/me");

  const u=data.user;

  $("profile").innerHTML=
   "<b>"+(u.name||u.username||"کاربر")+"</b><br>"+
   "📧 "+(u.email||"-")+"<br>"+
   "📌 وضعیت: "+(u.status||"فعال")+"<br>"+
   "📦 پلن: "+(u.plan||"free");

  $("balance").textContent=
   Number(u.balance||0).toLocaleString("fa-IR")+" تومان";

  loadTransactions();

 }catch(e){

  $("profile").innerHTML="❌ خطا در دریافت اطلاعات: "+e.message;
  $("balance").textContent="خطا";

 }
}

async function loadTransactions(){

 try{

  const data=await api("/api/transactions");

  if(!data.transactions || !data.transactions.length){
   $("transactions").innerHTML="تراکنشی ثبت نشده است.";
   return;
  }

  $("transactions").innerHTML=
  "<table><tr><th>مبلغ</th><th>نوع</th><th>وضعیت</th><th>تاریخ</th></tr>"+
  data.transactions.map(x=>
   "<tr>"+
   "<td>"+Number(x.amount||0).toLocaleString("fa-IR")+"</td>"+
   "<td>"+(x.type||"-")+"</td>"+
   "<td>"+(x.status||"-")+"</td>"+
   "<td>"+(x.created_at||"-")+"</td>"+
   "</tr>"
  ).join("")+
  "</table>";

 }catch(e){

  $("transactions").innerHTML="❌ خطا: "+e.message;

 }
}

function loadPlans(){

 const box=$("plansBox");
 const select=$("paymentPlan");

 box.innerHTML="";
 select.innerHTML="";

 PLANS.forEach(p=>{

  box.innerHTML+=
   '<div class="plan">'+
   '<h3>'+p.title+'</h3>'+
   '<strong>'+p.irr.toLocaleString("fa-IR")+' تومان</strong>'+
   '<div>🌎 '+p.usd+' USD</div>'+
   '<small>اشتراک دستیار هوش مصنوعی</small>'+
   '</div>';

  select.innerHTML+=
   '<option value="'+p.id+'">'+
   p.title+" | "+p.irr.toLocaleString("fa-IR")+
   " تومان / "+p.usd+" USD</option>";

 });
}

async function createPayment(){

 try{

  const planId=$("paymentPlan").value;
  const currency=$("currency").value;

  const data=await api("/api/payment",{
   method:"POST",
   body:JSON.stringify({
    plan_id:planId,
    currency:currency
   })
  });

  msg(
   "paymentMsg",
   "✅ سفارش ثبت شد.<br>"+
   "شماره سفارش: "+data.payment_id+"<br>"+
   "مبلغ: "+data.amount+" "+currency+
   "<br><small>درگاه واقعی پس از اتصال درگاه پرداخت فعال می‌شود.</small>"
  );

 }catch(e){
  msg("paymentMsg","❌ "+e.message);
 }
}

async function withdraw(){

 try{

  const data=await api("/api/withdraw",{
   method:"POST",
   body:JSON.stringify({
    amount:Number($("withdrawAmount").value),
    method:$("withdrawMethod").value,
    address:$("withdrawAddress").value.trim()
   })
  });

  msg("withdrawMsg","✅ درخواست برداشت ثبت شد.");

  loadUser();

 }catch(e){
  msg("withdrawMsg","❌ "+e.message);
 }
}

function logout(){

 token="";
 localStorage.removeItem("user_token");

 $("app").classList.add("hidden");
 $("auth").classList.remove("hidden");
}

async function adminLogin(){

 try{

  const data=await api("/api/admin/login",{
   method:"POST",
   body:JSON.stringify({
    password:$("adminPassword").value
   })
  });

  adminToken=data.token;
  localStorage.setItem("admin_token",adminToken);

  $("auth").classList.add("hidden");
  $("admin").classList.remove("hidden");

  adminUsers();

 }catch(e){

  msg("adminLoginMsg","❌ "+e.message);

 }
}

async function adminUsers(){

 $("adminContent").innerHTML='<div class="card">در حال بارگذاری کاربران...</div>';

 try{

  const data=await api("/api/admin/users");

  if(!data.users || !data.users.length){
   $("adminContent").innerHTML='<div class="card">کاربری وجود ندارد.</div>';
   return;
  }

  $("adminContent").innerHTML=
  '<div class="card">'+
  '<h2>👥 کاربران</h2>'+
  '<table>'+
  '<tr><th>ID</th><th>نام</th><th>ایمیل</th><th>موجودی</th><th>پلن</th><th>وضعیت</th></tr>'+
  data.users.map(u=>
   '<tr>'+
   '<td>'+u.id+'</td>'+
   '<td>'+(u.name||u.username||"-")+'</td>'+
   '<td>'+(u.email||"-")+'</td>'+
   '<td>'+Number(u.balance||0).toLocaleString("fa-IR")+'</td>'+
   '<td>'+(u.plan||"free")+'</td>'+
   '<td>'+(u.status||"-")+'</td>'+
   '</tr>'
  ).join("")+
  '</table>'+
  '</div>';

 }catch(e){

  $("adminContent").innerHTML=
   '<div class="card">❌ خطا در بارگذاری کاربران:<br>'+e.message+'</div>';

 }
}

async function adminWithdrawals(){

 $("adminContent").innerHTML='<div class="card">در حال بارگذاری برداشت‌ها...</div>';

 try{

  const data=await api("/api/admin/withdrawals");

  if(!data.withdrawals || !data.withdrawals.length){
   $("adminContent").innerHTML='<div class="card">درخواستی وجود ندارد.</div>';
   return;
  }

  $("adminContent").innerHTML=
  '<div class="card">'+
  '<h2>💸 برداشت‌ها</h2>'+
  '<table>'+
  '<tr><th>ID</th><th>کاربر</th><th>مبلغ</th><th>روش</th><th>آدرس</th><th>وضعیت</th></tr>'+
  data.withdrawals.map(w=>
   '<tr>'+
   '<td>'+w.id+'</td>'+
   '<td>'+w.username+'</td>'+
   '<td>'+Number(w.amount||0).toLocaleString("fa-IR")+'</td>'+
   '<td>'+w.method+'</td>'+
   '<td>'+w.address+'</td>'+
   '<td>'+w.status+'</td>'+
   '</tr>'
  ).join("")+
  '</table>'+
  '</div>';

 }catch(e){

  $("adminContent").innerHTML=
   '<div class="card">❌ خطا در برداشت‌ها:<br>'+e.message+'</div>';

 }
}

async function adminPayments(){

 $("adminContent").innerHTML='<div class="card">در حال بارگذاری پرداخت‌ها...</div>';

 try{

  const data=await api("/api/admin/payments");

  $("adminContent").innerHTML=
  '<div class="card">'+
  '<h2>💳 پرداخت‌ها</h2>'+
  '<pre>'+JSON.stringify(data.payments||[],null,2)+'</pre>'+
  '</div>';

 }catch(e){

  $("adminContent").innerHTML=
   '<div class="card">❌ خطا در پرداخت‌ها:<br>'+e.message+'</div>';

 }
}

function adminPlans(){

 $("adminContent").innerHTML=
 '<div class="card">'+
 '<h2>💰 پلن‌ها</h2>'+
 '<div class="grid">'+
 PLANS.map(p=>
  '<div class="plan">'+
  '<h3>'+p.title+'</h3>'+
  '<strong>'+p.irr.toLocaleString("fa-IR")+' تومان</strong>'+
  '<div>🌎 '+p.usd+' USD</div>'+
  '</div>'
 ).join("")+
 '</div>'+
 '</div>';

}

function adminLogout(){

 adminToken="";
 localStorage.removeItem("admin_token");

 $("admin").classList.add("hidden");
 $("auth").classList.remove("hidden");

}

if(token){

 $("auth").classList.add("hidden");
 $("app").classList.remove("hidden");

 loadUser();
 loadPlans();

}

</script>

</body>
</html>`;


function json(data,status=200){
 return new Response(JSON.stringify(data),{
  status,
  headers:{
   "content-type":"application/json;charset=UTF-8",
   "access-control-allow-origin":"*",
   "access-control-allow-headers":"Content-Type, Authorization, X-Admin-Token",
   "access-control-allow-methods":"GET,POST,OPTIONS"
  }
 });
}

function token(){
 return crypto.randomUUID()+"-"+crypto.randomUUID();
}

async function hashPassword(password){
 const data=new TextEncoder().encode(password);
 const hash=await crypto.subtle.digest("SHA-256",data);

 return [...new Uint8Array(hash)]
  .map(b=>b.toString(16).padStart(2,"0"))
  .join("");
}

function getBearer(request){
 const h=request.headers.get("Authorization")||"";
 return h.startsWith("Bearer ") ? h.slice(7) : "";
}

async function getUser(request,env){

 const t=getBearer(request);

 if(!t) return null;

 const row=await env.DB.prepare(
  "SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? LIMIT 1"
 ).bind(t).first();

 return row||null;
}

async function requireAdmin(request,env){

 const t=request.headers.get("X-Admin-Token")||"";

 if(!t) return false;

 const row=await env.DB.prepare(
  "SELECT token FROM admin_sessions WHERE token=? LIMIT 1"
 ).bind(t).first();

 return !!row;
}


async function handle(request,env){

 const url=new URL(request.url);
 const path=url.pathname;

 if(request.method==="OPTIONS"){
  return new Response(null,{
   headers:{
    "access-control-allow-origin":"*",
    "access-control-allow-headers":"Content-Type, Authorization, X-Admin-Token",
    "access-control-allow-methods":"GET,POST,OPTIONS"
   }
  });
 }

 if(path==="/"){
  return new Response(HTML,{
   headers:{"content-type":"text/html;charset=UTF-8"}
  });
 }


 if(path==="/api/register" && request.method==="POST"){

  const body=await request.json();

  const name=String(body.name||"").trim();
  const email=String(body.email||"").trim().toLowerCase();
  const password=String(body.password||"");

  if(!email || !password){
   return json({ok:false,error:"ایمیل و رمز عبور الزامی است"},400);
  }

  if(password.length<6){
   return json({ok:false,error:"رمز عبور حداقل ۶ کاراکتر باشد"},400);
  }

  const exists=await env.DB.prepare(
   "SELECT id FROM users WHERE email=? LIMIT 1"
  ).bind(email).first();

  if(exists){
   return json({ok:false,error:"این ایمیل قبلاً ثبت شده است"},400);
  }

  const hash=await hashPassword(password);

  const username=email.split("@")[0];

  const result=await env.DB.prepare(
   "INSERT INTO users(username,balance,plan,email,password_hash,status,name) VALUES(?,?,?,?,?,?,?)"
  ).bind(
   username,
   0,
   "free",
   email,
   hash,
   "فعال",
   name
  ).run();

  return json({
   ok:true,
   id:result.meta?.last_row_id||null
  });
 }


 if(path==="/api/login" && request.method==="POST"){

  const body=await request.json();

  const email=String(body.email||"").trim().toLowerCase();
  const password=String(body.password||"");

  const hash=await hashPassword(password);

  const user=await env.DB.prepare(
   "SELECT * FROM users WHERE email=? AND password_hash=? LIMIT 1"
  ).bind(email,hash).first();

  if(!user){
   return json({ok:false,error:"ایمیل یا رمز عبور اشتباه است"},401);
  }

  const t=token();

  await env.DB.prepare(
   "INSERT INTO sessions(user_id,token) VALUES(?,?)"
  ).bind(user.id,t).run();

  return json({
   ok:true,
   token:t,
   user:user
  });
 }


 if(path==="/api/me" && request.method==="GET"){

  const user=await getUser(request,env);

  if(!user){
   return json({ok:false,error:"نشست کاربر معتبر نیست"},401);
  }

  return json({ok:true,user});
 }


 if(path==="/api/transactions" && request.method==="GET"){

  const user=await getUser(request,env);

  if(!user){
   return json({ok:false,error:"وارد حساب شوید"},401);
  }

  const result=await env.DB.prepare(
   "SELECT * FROM transactions WHERE username=? ORDER BY id DESC LIMIT 100"
  ).bind(user.username).all();

  return json({
   ok:true,
   transactions:result.results||[]
  });
 }


 if(path==="/api/forgot" && request.method==="POST"){

  const body=await request.json();

  const email=String(body.email||"").trim().toLowerCase();

  const user=await env.DB.prepare(
   "SELECT id FROM users WHERE email=? LIMIT 1"
  ).bind(email).first();

  if(!user){
   return json({
    ok:true,
    message:"اگر این ایمیل وجود داشته باشد، درخواست بازیابی ثبت شد."
   });
  }

  const code=String(Math.floor(100000+Math.random()*900000));

  await env.DB.prepare(
   "INSERT INTO reset_codes(user_id,code,created_at) VALUES(?,?,CURRENT_TIMESTAMP)"
  ).bind(user.id,code).run();

  return json({
   ok:true,
   message:"کد بازیابی ایجاد شد. اتصال ارسال ایمیل باید تنظیم شود."
  });
 }


 if(path==="/api/payment" && request.method==="POST"){

  const user=await getUser(request,env);

  if(!user){
   return json({ok:false,error:"ابتدا وارد حساب شوید"},401);
  }

  const body=await request.json();

  const plan=PLANS.find(x=>x.id===body.plan_id);

  if(!plan){
   return json({ok:false,error:"پلن نامعتبر است"},400);
  }

  const currency=body.currency==="USD" ? "USD" : "IRR";

  const amount=currency==="USD" ? plan.usd : plan.irr;

  const paymentId=crypto.randomUUID();

  /*
    اینجا سفارش ثبت می‌شود.
    برای پرداخت واقعی باید درگاه ایران یا درگاه ارزی
    به این بخش متصل شود.
  */

  try{

   await env.DB.prepare(
    "INSERT INTO payments(username,amount,status,created_at) VALUES(?,?,?,CURRENT_TIMESTAMP)"
   ).bind(
    user.username,
    amount,
    "pending"
   ).run();

  }catch(e){

   return json({
    ok:false,
    error:"ثبت سفارش پرداخت انجام نشد: "+e.message
   },500);

  }

  return json({
   ok:true,
   payment_id:paymentId,
   amount:amount,
   currency:currency,
   plan:plan.title,
   status:"pending"
  });
 }


 if(path==="/api/withdraw" && request.method==="POST"){

  const user=await getUser(request,env);

  if(!user){
   return json({ok:false,error:"ابتدا وارد حساب شوید"},401);
  }

  const body=await request.json();

  const amount=Number(body.amount||0);
  const method=String(body.method||"USDT");
  const address=String(body.address||"").trim();

  if(!Number.isFinite(amount) || amount<=0){
   return json({ok:false,error:"مبلغ برداشت نامعتبر است"},400);
  }

  if(amount>Number(user.balance||0)){
   return json({ok:false,error:"موجودی کافی نیست"},400);
  }

  if(!address){
   return json({ok:false,error:"آدرس برداشت را وارد کنید"},400);
  }

  await env.DB.prepare(
   "INSERT INTO withdrawals(username,amount,status,method,address) VALUES(?,?,?, ?,?)"
  ).bind(
   user.username,
   amount,
   "pending",
   method,
   address
  ).run();

  return json({
   ok:true,
   message:"درخواست برداشت ثبت شد."
  });
 }


 if(path==="/api/admin/login" && request.method==="POST"){

  const body=await request.json();

  const password=String(body.password||"");

  const adminPassword=env.ADMIN_PASSWORD || "Admin@123456";

  if(password!==adminPassword){
   return json({
    ok:false,
    error:"رمز مدیریت اشتباه است"
   },401);
  }

  const t=token();

  await env.DB.prepare(
   "INSERT INTO admin_sessions(token) VALUES(?)"
  ).bind(t).run();

  return json({
   ok:true,
   token:t
  });
 }


 if(path==="/api/admin/users" && request.method==="GET"){

  if(!(await requireAdmin(request,env))){
   return json({ok:false,error:"دسترسی مدیریت لازم است"},401);
  }

  const result=await env.DB.prepare(
   "SELECT id,username,balance,plan,created_at,email,status,name FROM users ORDER BY id DESC"
  ).all();

  return json({
   ok:true,
   users:result.results||[]
  });
 }


 if(path==="/api/admin/withdrawals" && request.method==="GET"){

  if(!(await requireAdmin(request,env))){
   return json({ok:false,error:"دسترسی مدیریت لازم است"},401);
  }

  const result=await env.DB.prepare(
   "SELECT * FROM withdrawals ORDER BY id DESC LIMIT 500"
  ).all();

  return json({
   ok:true,
   withdrawals:result.results||[]
  });
 }


 if(path==="/api/admin/payments" && request.method==="GET"){

  if(!(await requireAdmin(request,env))){
   return json({ok:false,error:"دسترسی مدیریت لازم است"},401);
  }

  const result=await env.DB.prepare(
   "SELECT * FROM payments ORDER BY id DESC LIMIT 500"
  ).all();

  return json({
   ok:true,
   payments:result.results||[]
  });
 }


 return json({
  ok:false,
  error:"مسیر پیدا نشد"
 },404);
}


export default {
 async fetch(request,env){
  try{
   return await handle(request,env);
  }catch(e){

   return json({
    ok:false,
    error:"خطای داخلی سرور",
    detail:e.message
   },500);

  }
 }
};
