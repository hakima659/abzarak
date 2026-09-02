const PLANS = [
  { id: "p400",  title: "پلن ۴۰۰ هزار تومان",  irr: 400000,  usd: 6  },
  { id: "p700",  title: "پلن ۷۰۰ هزار تومان",  irr: 700000,  usd: 10 },
  { id: "p1000", title: "پلن ۱ میلیون تومان",   irr: 1000000, usd: 15 },
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
  font-family:Tahoma,Arial,sans-serif;
  background:#f4f7fb;
  color:#172033;
}
button,input,select,textarea{font-family:inherit}
header{
  background:linear-gradient(135deg,#2563eb,#7c3aed);
  color:white;
  padding:20px;
}
header h1{margin:0 0 8px;font-size:23px}
header p{margin:0;opacity:.9}
nav{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  padding:12px;
  background:white;
  border-bottom:1px solid #ddd;
}
nav button{
  border:0;
  padding:10px 14px;
  border-radius:10px;
  background:#eef2ff;
  cursor:pointer;
}
.container{
  max-width:1000px;
  margin:auto;
  padding:16px;
}
.card{
  background:white;
  border-radius:16px;
  padding:18px;
  margin-bottom:15px;
  box-shadow:0 3px 15px rgba(0,0,0,.06);
}
input,select,textarea{
  width:100%;
  padding:12px;
  border:1px solid #d6dbe5;
  border-radius:10px;
  margin:6px 0 12px;
  background:white;
}
textarea{min-height:120px;resize:vertical}
button.primary{
  width:100%;
  border:0;
  padding:13px;
  border-radius:11px;
  background:#2563eb;
  color:white;
  font-size:15px;
  cursor:pointer;
}
button.danger{
  background:#dc2626!important;
  color:white;
}
.hidden{display:none!important}
.center{text-align:center}
.msg{
  padding:12px;
  border-radius:10px;
  margin:10px 0;
  background:#f1f5f9;
}
.success{background:#dcfce7;color:#166534}
.error{background:#fee2e2;color:#991b1b}
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:12px;
}
.plan{
  border:2px solid #e5e7eb;
  border-radius:15px;
  padding:16px;
  background:white;
}
.plan h3{margin-top:0}
.plan button{margin-top:10px}
.balance{
  font-size:28px;
  font-weight:bold;
  color:#16a34a;
}
.chat{
  min-height:300px;
  max-height:500px;
  overflow:auto;
  padding:10px;
  background:#f8fafc;
  border-radius:12px;
}
.bubble{
  padding:12px;
  border-radius:13px;
  margin:8px 0;
  line-height:1.9;
  white-space:pre-wrap;
}
.user{
  background:#dbeafe;
  margin-right:20%;
}
.ai{
  background:#ede9fe;
  margin-left:10%;
}
table{
  width:100%;
  border-collapse:collapse;
  font-size:13px;
}
th,td{
  border-bottom:1px solid #eee;
  padding:9px;
  text-align:right;
}
.small{font-size:12px;color:#64748b}
</style>
</head>

<body>

<header>
<h1>🤖 دستیار هوش مصنوعی</h1>
<p>دستیار هوشمند • حساب کاربری • درآمد • پرداخت • برداشت</p>
</header>

<nav>
<button onclick="showPage('home')">🏠 حساب</button>
<button onclick="showPage('ai')">🤖 هوش مصنوعی</button>
<button onclick="showPage('plans')">💰 پلن‌ها</button>
<button onclick="showPage('payment')">💳 پرداخت</button>
<button onclick="showPage('withdraw')">💸 برداشت</button>
<button onclick="showPage('adminLogin')">🛠️ مدیریت</button>
<button onclick="logout()">خروج</button>
</nav>

<div class="container">

<section id="login" class="card">
<h2>🔐 ورود به حساب</h2>
<input id="loginEmail" placeholder="ایمیل">
<input id="loginPassword" type="password" placeholder="رمز عبور">
<button class="primary" onclick="login()">ورود</button>
<div id="loginMsg"></div>
<p class="center">
<button onclick="showPage('register')">ثبت‌نام</button>
<button onclick="showPage('forgot')">بازیابی رمز</button>
</p>
</section>

<section id="register" class="card hidden">
<h2>📝 ثبت‌نام</h2>
<input id="regName" placeholder="نام">
<input id="regEmail" placeholder="ایمیل">
<input id="regPassword" type="password" placeholder="رمز عبور">
<button class="primary" onclick="register()">ثبت‌نام</button>
<div id="regMsg"></div>
</section>

<section id="forgot" class="card hidden">
<h2>🔑 بازیابی رمز</h2>
<input id="forgotEmail" placeholder="ایمیل">
<button class="primary" onclick="forgot()">دریافت کد بازیابی</button>
<div id="forgotMsg"></div>
<hr>
<input id="resetEmail" placeholder="ایمیل">
<input id="resetCode" placeholder="کد بازیابی">
<input id="resetPassword" type="password" placeholder="رمز عبور جدید">
<button class="primary" onclick="resetPassword()">تغییر رمز</button>
<div id="resetMsg"></div>
</section>

<section id="home" class="hidden">
<div class="card">
<h2>👤 حساب کاربری</h2>
<div id="profile">در حال بارگذاری...</div>
</div>

<div class="card">
<h2>💰 موجودی</h2>
<div id="balance" class="balance">۰ تومان</div>
</div>

<div class="card">
<h2>📊 تراکنش‌ها</h2>
<div id="transactions">در حال بارگذاری...</div>
</div>
</section>

<section id="ai" class="card hidden">
<h2>🤖 دستیار هوش مصنوعی</h2>
<p class="small">سؤال خودت را بنویس؛ پاسخ توسط Workers AI تولید می‌شود.</p>

<div id="chat" class="chat"></div>

<textarea id="question" placeholder="مثلاً: برای کسب درآمد اینترنتی چه راه‌هایی پیشنهاد می‌کنی؟"></textarea>
<button class="primary" onclick="askAI()">ارسال سؤال 🤖</button>
<div id="aiMsg"></div>
</section>

<section id="plans" class="card hidden">
<h2>💰 پلن‌های اشتراک</h2>
<div id="plansBox" class="grid"></div>
</section>

<section id="payment" class="card hidden">
<h2>💳 پرداخت</h2>

<select id="paymentPlan"></select>

<select id="currency">
<option value="IRR">🇮🇷 تومان - ایران</option>
<option value="USD">🇺🇸 دلار - خارج</option>
</select>

<button class="primary" onclick="createPayment()">ایجاد سفارش پرداخت</button>
<div id="paymentMsg"></div>
</section>

<section id="withdraw" class="card hidden">
<h2>💸 درخواست برداشت</h2>

<input id="withdrawAmount" type="number" placeholder="مبلغ برداشت">

<select id="withdrawMethod">
<option value="USDT">USDT</option>
<option value="BANK">حساب بانکی</option>
</select>

<input id="withdrawAddress" placeholder="آدرس USDT یا اطلاعات حساب بانکی">

<button class="primary" onclick="withdraw()">ثبت درخواست برداشت</button>
<div id="withdrawMsg"></div>
</section>

<section id="adminLogin" class="card hidden">
<h2>🛠️ ورود مدیریت</h2>
<input id="adminPassword" type="password" placeholder="رمز مدیریت">
<button class="primary" onclick="adminLogin()">ورود مدیریت</button>
<div id="adminLoginMsg"></div>
</section>

<section id="admin" class="hidden">

<div class="card">
<h2>🛠️ پنل مدیریت</h2>
<button onclick="adminUsers()">👥 کاربران</button>
<button onclick="adminWithdrawals()">💸 برداشت‌ها</button>
<button onclick="adminPayments()">💳 پرداخت‌ها</button>
<button onclick="adminLogout()">خروج مدیریت</button>
</div>

<div class="card">
<div id="adminContent">یک گزینه را انتخاب کنید.</div>
</div>

</section>

</div>

<script>
const $=id=>document.getElementById(id);

function escapeHTML(v){
  return String(v??"")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

function showPage(id){
  document.querySelectorAll(".container>section").forEach(x=>x.classList.add("hidden"));
  $(id)?.classList.remove("hidden");

  if(id==="home") loadUser();
  if(id==="plans") loadPlans();
  if(id==="payment") loadPlansSelect();
  if(id==="admin") adminUsers();
}

async function api(url,options={}){
  const headers=options.headers||{};
  headers["Content-Type"]="application/json";

  const token=localStorage.getItem("user_token");
  if(token) headers["Authorization"]="Bearer "+token;

  const admin=localStorage.getItem("admin_token");
  if(admin) headers["X-Admin-Token"]=admin;

  const r=await fetch(url,{...options,headers});
  const text=await r.text();

  let data;
  try{
    data=JSON.parse(text);
  }catch(e){
    throw new Error(text||"پاسخ نامعتبر سرور");
  }

  if(!r.ok || data.ok===false){
    throw new Error(data.error||"خطای داخلی سرور");
  }

  return data;
}

async function register(){
  try{
    const d=await api("/api/register",{
      method:"POST",
      body:JSON.stringify({
        name:$("regName").value.trim(),
        email:$("regEmail").value.trim(),
        password:$("regPassword").value
      })
    });

    localStorage.setItem("user_token",d.token);
    $("regMsg").innerHTML='<div class="msg success">ثبت‌نام با موفقیت انجام شد.</div>';
    showPage("home");
  }catch(e){
    $("regMsg").innerHTML='<div class="msg error">'+escapeHTML(e.message)+'</div>';
  }
}

async function login(){
  try{
    const d=await api("/api/login",{
      method:"POST",
      body:JSON.stringify({
        email:$("loginEmail").value.trim(),
        password:$("loginPassword").value
      })
    });

    localStorage.setItem("user_token",d.token);
    $("loginMsg").innerHTML='<div class="msg success">ورود موفق بود.</div>';
    showPage("home");
  }catch(e){
    $("loginMsg").innerHTML='<div class="msg error">'+escapeHTML(e.message)+'</div>';
  }
}

async function loadUser(){
  try{
    const d=await api("/api/me");

    $("profile").innerHTML=
      "<b>"+escapeHTML(d.user.name||d.user.email)+"</b><br>"+
      "📧 "+escapeHTML(d.user.email)+"<br>"+
      "📌 وضعیت: "+escapeHTML(d.user.status||"فعال")+"<br>"+
      "📦 پلن: "+escapeHTML(d.user.plan||"free");

    $("balance").textContent=
      Number(d.user.balance||0).toLocaleString("fa-IR")+" تومان";

    loadTransactions();
  }catch(e){
    $("profile").innerHTML='<div class="msg error">'+escapeHTML(e.message)+'</div>';
  }
}

async function loadTransactions(){
  try{
    const d=await api("/api/transactions");
    const rows=d.transactions||[];

    if(!rows.length){
      $("transactions").innerHTML="هنوز تراکنشی ثبت نشده است.";
      return;
    }

    $("transactions").innerHTML=
      "<table><tr><th>نوع</th><th>مبلغ</th><th>توضیح</th><th>تاریخ</th></tr>"+
      rows.map(x=>
        "<tr>"+
        "<td>"+escapeHTML(x.type)+"</td>"+
        "<td>"+Number(x.amount||0).toLocaleString("fa-IR")+"</td>"+
        "<td>"+escapeHTML(x.description||"")+"</td>"+
        "<td>"+escapeHTML(x.created_at||"")+"</td>"+
        "</tr>"
      ).join("")+
      "</table>";
  }catch(e){
    $("transactions").innerHTML=
      '<div class="msg error">❌ '+escapeHTML(e.message)+'</div>';
  }
}

async function askAI(){
  const q=$("question").value.trim();

  if(!q){
    $("aiMsg").innerHTML='<div class="msg error">سؤال را وارد کن.</div>';
    return;
  }

  $("chat").innerHTML+=
    '<div class="bubble user">👤 '+escapeHTML(q)+'</div>';

  $("question").value="";
  $("aiMsg").innerHTML='<div class="msg">🤖 در حال فکر کردن...</div>';

  try{
    const d=await api("/api/ai",{
      method:"POST",
      body:JSON.stringify({question:q})
    });

    $("chat").innerHTML+=
      '<div class="bubble ai">🤖 '+escapeHTML(d.answer)+'</div>';

    $("aiMsg").innerHTML="";
    $("chat").scrollTop=$("chat").scrollHeight;
  }catch(e){
    $("aiMsg").innerHTML=
      '<div class="msg error">❌ '+escapeHTML(e.message)+'</div>';
  }
}

async function loadPlans(){
  try{
    const d=await api("/api/plans");

    $("plansBox").innerHTML=(d.plans||[]).map(p=>`
      <div class="plan">
        <h3>${escapeHTML(p.title)}</h3>
        <p>🇮🇷 ${Number(p.irr).toLocaleString("fa-IR")} تومان</p>
        <p>🇺🇸 ${p.usd} دلار</p>
        <button class="primary" onclick="selectPlan('${escapeHTML(p.id)}')">
          انتخاب پلن
        </button>
      </div>
    `).join("");
  }catch(e){
    $("plansBox").innerHTML=
      '<div class="msg error">'+escapeHTML(e.message)+'</div>';
  }
}

async function loadPlansSelect(){
  try{
    const d=await api("/api/plans");

    $("paymentPlan").innerHTML=(d.plans||[]).map(p=>
      `<option value="${escapeHTML(p.id)}">
        ${escapeHTML(p.title)} - ${Number(p.irr).toLocaleString("fa-IR")} تومان
      </option>`
    ).join("");
  }catch(e){
    $("paymentMsg").innerHTML=
      '<div class="msg error">'+escapeHTML(e.message)+'</div>';
  }
}

function selectPlan(id){
  loadPlansSelect().then(()=>{
    $("paymentPlan").value=id;
    showPage("payment");
  });
}

async function createPayment(){
  const planId=$("paymentPlan").value;
  const currency=$("currency").value;

  try{
    const d=await api("/api/payment",{
      method:"POST",
      body:JSON.stringify({
        plan_id:planId,
        currency:currency
      })
    });

    $("paymentMsg").innerHTML=
      '<div class="msg success">'+
      "✅ سفارش ایجاد شد<br>"+
      "شماره سفارش: "+escapeHTML(d.payment_id)+
      "<br>پلن: "+escapeHTML(d.plan.title)+
      "<br>مبلغ: "+Number(d.amount).toLocaleString("fa-IR")+
      " "+escapeHTML(d.currency_label)+
      "<br>وضعیت: در انتظار پرداخت"+
      "</div>";
  }catch(e){
    $("paymentMsg").innerHTML=
      '<div class="msg error">❌ '+escapeHTML(e.message)+'</div>';
  }
}

async function withdraw(){
  const amount=Number($("withdrawAmount").value);
  const method=$("withdrawMethod").value;
  const address=$("withdrawAddress").value.trim();

  if(!amount || amount<=0){
    $("withdrawMsg").innerHTML=
      '<div class="msg error">مبلغ برداشت را وارد کن.</div>';
    return;
  }

  try{
    const d=await api("/api/withdraw",{
      method:"POST",
      body:JSON.stringify({
        amount,
        method,
        address
      })
    });

    $("withdrawMsg").innerHTML=
      '<div class="msg success">✅ درخواست برداشت ثبت شد.<br>'+
      "شماره درخواست: "+escapeHTML(d.withdrawal_id)+
      "</div>";

    loadUser();
  }catch(e){
    $("withdrawMsg").innerHTML=
      '<div class="msg error">❌ '+escapeHTML(e.message)+'</div>';
  }
}

async function forgot(){
  try{
    const d=await api("/api/forgot",{
      method:"POST",
      body:JSON.stringify({
        email:$("forgotEmail").value.trim()
      })
    });

    $("forgotMsg").innerHTML=
      '<div class="msg success">'+escapeHTML(d.message)+
      (d.code ? "<br>کد موقت: <b>"+escapeHTML(d.code)+"</b>":"")+
      "</div>";
  }catch(e){
    $("forgotMsg").innerHTML=
      '<div class="msg error">'+escapeHTML(e.message)+'</div>';
  }
}

async function resetPassword(){
  try{
    const d=await api("/api/reset-password",{
      method:"POST",
      body:JSON.stringify({
        email:$("resetEmail").value.trim(),
        code:$("resetCode").value.trim(),
        password:$("resetPassword").value
      })
    });

    $("resetMsg").innerHTML=
      '<div class="msg success">'+escapeHTML(d.message)+'</div>';
  }catch(e){
    $("resetMsg").innerHTML=
      '<div class="msg error">'+escapeHTML(e.message)+'</div>';
  }
}

function logout(){
  localStorage.removeItem("user_token");
  showPage("login");
}

async function adminLogin(){
  try{
    const d=await api("/api/admin/login",{
      method:"POST",
      body:JSON.stringify({
        password:$("adminPassword").value
      })
    });

    localStorage.setItem("admin_token",d.token);
    showPage("admin");
  }catch(e){
    $("adminLoginMsg").innerHTML=
      '<div class="msg error">'+escapeHTML(e.message)+'</div>';
  }
}

async function adminUsers(){
  try{
    const d=await api("/api/admin/users");

    $("adminContent").innerHTML=
      "<h3>👥 کاربران</h3>"+
      "<table><tr><th>ID</th><th>نام</th><th>ایمیل</th><th>موجودی</th><th>پلن</th><th>وضعیت</th></tr>"+
      (d.users||[]).map(u=>
        "<tr>"+
        "<td>"+u.id+"</td>"+
        "<td>"+escapeHTML(u.name||"")+"</td>"+
        "<td>"+escapeHTML(u.email||"")+"</td>"+
        "<td>"+Number(u.balance||0).toLocaleString("fa-IR")+"</td>"+
        "<td>"+escapeHTML(u.plan||"free")+"</td>"+
        "<td>"+escapeHTML(u.status||"")+"</td>"+
        "</tr>"
      ).join("")+
      "</table>";
  }catch(e){
    $("adminContent").innerHTML=
      '<div class="msg error">'+escapeHTML(e.message)+'</div>';
  }
}

async function adminWithdrawals(){
  try{
    const d=await api("/api/admin/withdrawals");

    $("adminContent").innerHTML=
      "<h3>💸 درخواست‌های برداشت</h3>"+
      "<table><tr><th>ID</th><th>کاربر</th><th>مبلغ</th><th>روش</th><th>آدرس</th><th>وضعیت</th></tr>"+
      (d.withdrawals||[]).map(w=>
        "<tr>"+
        "<td>"+w.id+"</td>"+
        "<td>"+escapeHTML(w.username)+"</td>"+
        "<td>"+Number(w.amount||0).toLocaleString("fa-IR")+"</td>"+
        "<td>"+escapeHTML(w.method||"")+"</td>"+
        "<td>"+escapeHTML(w.address||"")+"</td>"+
        "<td>"+escapeHTML(w.status||"")+"</td>"+
        "</tr>"
      ).join("")+
      "</table>";
  }catch(e){
    $("adminContent").innerHTML=
      '<div class="msg error">'+escapeHTML(e.message)+'</div>';
  }
}

async function adminPayments(){
  try{
    const d=await api("/api/admin/payments");

    $("adminContent").innerHTML=
      "<h3>💳 پرداخت‌ها</h3>"+
      "<table><tr><th>ID</th><th>User ID</th><th>مبلغ</th><th>پلن</th><th>Authority</th><th>وضعیت</th></tr>"+
      (d.payments||[]).map(p=>
        "<tr>"+
        "<td>"+p.id+"</td>"+
        "<td>"+p.user_id+"</td>"+
        "<td>"+Number(p.amount||0).toLocaleString("fa-IR")+"</td>"+
        "<td>"+escapeHTML(p.plan||"")+"</td>"+
        "<td>"+escapeHTML(p.authority||"")+"</td>"+
        "<td>"+escapeHTML(p.status||"")+"</td>"+
        "</tr>"
      ).join("")+
      "</table>";
  }catch(e){
    $("adminContent").innerHTML=
      '<div class="msg error">'+escapeHTML(e.message)+'</div>';
  }
}

function adminLogout(){
  localStorage.removeItem("admin_token");
  showPage("adminLogin");
}

showPage(localStorage.getItem("user_token") ? "home" : "login");
</script>

</body>
</html>`;

function json(data,status=200){
  return new Response(JSON.stringify(data),{
    status,
    headers:{
      "Content-Type":"application/json;charset=UTF-8",
      "Cache-Control":"no-store"
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
    .map(x=>x.toString(16).padStart(2,"0"))
    .join("");
}

function getBearer(request){
  const h=request.headers.get("Authorization")||"";
  if(h.startsWith("Bearer ")) return h.slice(7).trim();
  return "";
}

async function getUser(request,env){
  const t=getBearer(request);
  if(!t) return null;

  const row=await env.DB.prepare(`
    SELECT u.*
    FROM users u
    INNER JOIN sessions s ON s.user_id=u.id
    WHERE s.token=?
    LIMIT 1
  `).bind(t).first();

  return row||null;
}

async function requireAdmin(request,env){
  const t=request.headers.get("X-Admin-Token")||"";
  if(!t) return false;

  const row=await env.DB.prepare(`
    SELECT token,expires_at
    FROM admin_sessions
    WHERE token=?
    LIMIT 1
  `).bind(t).first();

  if(!row) return false;

  if(Number(row.expires_at)<=Math.floor(Date.now()/1000)){
    await env.DB.prepare(
      "DELETE FROM admin_sessions WHERE token=?"
    ).bind(t).run();
    return false;
  }

  return true;
}

async function handle(request,env){
  const url=new URL(request.url);
  const path=url.pathname;
  const method=request.method;

  if(path==="/" && method==="GET"){
    return new Response(HTML,{
      headers:{
        "Content-Type":"text/html;charset=UTF-8"
      }
    });
  }

  if(path==="/api/register" && method==="POST"){
    const body=await request.json();

    const name=String(body.name||"").trim();
    const email=String(body.email||"").trim().toLowerCase();
    const password=String(body.password||"");

    if(!email || !password){
      return json({
        ok:false,
        error:"ایمیل و رمز عبور الزامی است"
      },400);
    }

    if(password.length<6){
      return json({
        ok:false,
        error:"رمز عبور باید حداقل ۶ کاراکتر باشد"
      },400);
    }

    const exists=await env.DB.prepare(
      "SELECT id FROM users WHERE email=? LIMIT 1"
    ).bind(email).first();

    if(exists){
      return json({
        ok:false,
        error:"این ایمیل قبلاً ثبت شده است"
      },400);
    }

    const passwordHash=await hashPassword(password);

    const result=await env.DB.prepare(`
      INSERT INTO users
      (username,balance,plan,email,password_hash,status,name)
      VALUES(?,0,'free',? ,?,'فعال',?)
    `).bind(
      email,
      email,
      passwordHash,
      name
    ).run();

    const userId=result.meta.last_row_id;
    const t=token();

    await env.DB.prepare(`
      INSERT INTO sessions
      (user_id,token)
      VALUES(?,?)
    `).bind(userId,t).run();

    return json({
      ok:true,
      token:t
    });
  }

  if(path==="/api/login" && method==="POST"){
    const body=await request.json();

    const email=String(body.email||"").trim().toLowerCase();
    const password=String(body.password||"");

    const passwordHash=await hashPassword(password);

    const user=await env.DB.prepare(`
      SELECT *
      FROM users
      WHERE email=? AND password_hash=?
      LIMIT 1
    `).bind(email,passwordHash).first();

    if(!user){
      return json({
        ok:false,
        error:"ایمیل یا رمز عبور اشتباه است"
      },401);
    }

    const t=token();

    await env.DB.prepare(`
      INSERT INTO sessions
      (user_id,token)
      VALUES(?,?)
    `).bind(user.id,t).run();

    return json({
      ok:true,
      token:t
    });
  }

  if(path==="/api/me" && method==="GET"){
    const user=await getUser(request,env);

    if(!user){
      return json({
        ok:false,
        error:"لطفاً وارد حساب شوید"
      },401);
    }

    return json({
      ok:true,
      user
    });
  }

  if(path==="/api/transactions" && method==="GET"){
    const user=await getUser(request,env);

    if(!user){
      return json({
        ok:false,
        error:"لطفاً وارد حساب شوید"
      },401);
    }

    const result=await env.DB.prepare(`
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
    `).bind(user.id).all();

    return json({
      ok:true,
      transactions:result.results||[]
    });
  }

  if(path==="/api/ai" && method==="POST"){
    const user=await getUser(request,env);

    if(!user){
      return json({
        ok:false,
        error:"برای استفاده از هوش مصنوعی ابتدا وارد حساب شوید"
      },401);
    }

    const body=await request.json();
    const question=String(body.question||"").trim();

    if(!question){
      return json({
        ok:false,
        error:"سؤال خالی است"
      },400);
    }

    if(question.length>4000){
      return json({
        ok:false,
        error:"سؤال بیش از حد طولانی است"
      },400);
    }

    if(!env.AI){
      return json({
        ok:false,
        error:"اتصال Workers AI با نام AI پیدا نشد"
      },500);
    }

    const result=await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages:[
          {
            role:"system",
            content:
              "تو یک دستیار هوش مصنوعی فارسی‌زبان مفید، دقیق و محترمانه هستی. پاسخ‌ها را واضح و کاربردی به فارسی بده."
          },
          {
            role:"user",
            content:question
          }
        ],
        max_tokens:700
      }
    );

    const answer=
      result?.response ||
      result?.result?.response ||
      "پاسخی از هوش مصنوعی دریافت نشد.";

    return json({
      ok:true,
      answer
    });
  }

  if(path==="/api/plans" && method==="GET"){
    return json({
      ok:true,
      plans:PLANS
    });
  }

  if(path==="/api/payment" && method==="POST"){
    const user=await getUser(request,env);

    if(!user){
      return json({
        ok:false,
        error:"لطفاً وارد حساب شوید"
      },401);
    }

    const body=await request.json();

    const planId=String(
      body.plan_id ||
      body.planId ||
      body.id ||
      ""
    ).trim();

    const currency=String(
      body.currency||"IRR"
    ).toUpperCase();

    const plan=PLANS.find(
      x=>String(x.id)===planId
    );

    if(!plan){
      return json({
        ok:false,
        error:"پلن نامعتبر است",
        received_plan_id:planId,
        available_plans:PLANS.map(x=>x.id)
      },400);
    }

    const amount=
      currency==="USD"
      ? plan.usd
      : plan.irr;

    const result=await env.DB.prepare(`
      INSERT INTO payments
      (user_id,amount,plan,authority,status)
      VALUES(?,?,?,'','pending')
    `).bind(
      user.id,
      amount,
      plan.id
    ).run();

    const paymentId=result.meta.last_row_id;

    return json({
      ok:true,
      payment_id:paymentId,
      plan,
      amount,
      currency,
      currency_label:
        currency==="USD" ? "دلار" : "تومان",
      status:"pending"
    });
  }

  if(path==="/api/withdraw" && method==="POST"){
    const user=await getUser(request,env);

    if(!user){
      return json({
        ok:false,
        error:"لطفاً وارد حساب شوید"
      },401);
    }

    const body=await request.json();

    const amount=Number(body.amount||0);
    const methodName=String(
      body.method||"USDT"
    ).trim();
    const address=String(
      body.address||""
    ).trim();

    if(!Number.isFinite(amount) || amount<=0){
      return json({
        ok:false,
        error:"مبلغ برداشت نامعتبر است"
      },400);
    }

    if(amount>Number(user.balance||0)){
      return json({
        ok:false,
        error:"موجودی کافی نیست"
      },400);
    }

    if(amount<10000){
      return json({
        ok:false,
        error:"حداقل برداشت ۱۰٬۰۰۰ تومان است"
      },400);
    }

    if(!address){
      return json({
        ok:false,
        error:"آدرس یا اطلاعات حساب را وارد کنید"
      },400);
    }

    const result=await env.DB.prepare(`
      INSERT INTO withdrawals
      (username,amount,status,method,address)
      VALUES(? ,? ,'pending',?,?)
    `).bind(
      user.username,
      amount,
      methodName,
      address
    ).run();

    return json({
      ok:true,
      withdrawal_id:result.meta.last_row_id,
      status:"pending"
    });
  }

  if(path==="/api/forgot" && method==="POST"){
    const body=await request.json();
    const email=String(body.email||"").trim().toLowerCase();

    const user=await env.DB.prepare(`
      SELECT id
      FROM users
      WHERE email=?
      LIMIT 1
    `).bind(email).first();

    if(!user){
      return json({
        ok:false,
        error:"کاربری با این ایمیل پیدا نشد"
      },404);
    }

    const code=String(
      Math.floor(100000+Math.random()*900000)
    );

    const expiresAt=
      Math.floor(Date.now()/1000)+600;

    await env.DB.prepare(`
      INSERT INTO reset_codes
      (user_id,code,expires_at)
      VALUES(?,?,?)
    `).bind(
      user.id,
      code,
      expiresAt
    ).run();

    return json({
      ok:true,
      message:
        "کد بازیابی ایجاد شد. برای ارسال واقعی کد باید سرویس ایمیل متصل شود.",
      code
    });
  }

  if(path==="/api/reset-password" && method==="POST"){
    const body=await request.json();

    const email=String(body.email||"").trim().toLowerCase();
    const code=String(body.code||"").trim();
    const password=String(body.password||"");

    if(password.length<6){
      return json({
        ok:false,
        error:"رمز عبور جدید باید حداقل ۶ کاراکتر باشد"
      },400);
    }

    const user=await env.DB.prepare(`
      SELECT id
      FROM users
      WHERE email=?
      LIMIT 1
    `).bind(email).first();

    if(!user){
      return json({
        ok:false,
        error:"کاربر پیدا نشد"
      },404);
    }

    const now=Math.floor(Date.now()/1000);

    const reset=await env.DB.prepare(`
      SELECT id
      FROM reset_codes
      WHERE user_id=?
      AND code=?
      AND expires_at>?
      ORDER BY id DESC
      LIMIT 1
    `).bind(
      user.id,
      code,
      now
    ).first();

    if(!reset){
      return json({
        ok:false,
        error:"کد بازیابی نامعتبر یا منقضی شده است"
      },400);
    }

    const passwordHash=await hashPassword(password);

    await env.DB.prepare(`
      UPDATE users
      SET password_hash=?
      WHERE id=?
    `).bind(
      passwordHash,
      user.id
    ).run();

    await env.DB.prepare(`
      DELETE FROM reset_codes
      WHERE id=?
    `).bind(reset.id).run();

    return json({
      ok:true,
      message:"رمز عبور با موفقیت تغییر کرد"
    });
  }

  if(path==="/api/admin/login" && method==="POST"){
    const body=await request.json();
    const password=String(body.password||"");

    const configured=
      env.ADMIN_PASSWORD ||
      "Admin@123456";

    if(password!==configured){
      return json({
        ok:false,
        error:"رمز مدیریت اشتباه است"
      },401);
    }

    const t=token();

    const expiresAt=
      Math.floor(Date.now()/1000)+(24*60*60);

    await env.DB.prepare(`
      INSERT INTO admin_sessions
      (token,expires_at)
      VALUES(?,?)
    `).bind(
      t,
      expiresAt
    ).run();

    return json({
      ok:true,
      token:t
    });
  }

  if(path==="/api/admin/users" && method==="GET"){
    if(!(await requireAdmin(request,env))){
      return json({
        ok:false,
        error:"دسترسی مدیریت لازم است"
      },403);
    }

    const result=await env.DB.prepare(`
      SELECT
        id,
        username,
        email,
        name,
        balance,
        plan,
        status,
        created_at
      FROM users
      ORDER BY id DESC
    `).all();

    return json({
      ok:true,
      users:result.results||[]
    });
  }

  if(path==="/api/admin/withdrawals" && method==="GET"){
    if(!(await requireAdmin(request,env))){
      return json({
        ok:false,
        error:"دسترسی مدیریت لازم است"
      },403);
    }

    const result=await env.DB.prepare(`
      SELECT *
      FROM withdrawals
      ORDER BY id DESC
      LIMIT 200
    `).all();

    return json({
      ok:true,
      withdrawals:result.results||[]
    });
  }

  if(path==="/api/admin/payments" && method==="GET"){
    if(!(await requireAdmin(request,env))){
      return json({
        ok:false,
        error:"دسترسی مدیریت لازم است"
      },403);
    }

    const result=await env.DB.prepare(`
      SELECT *
      FROM payments
      ORDER BY id DESC
      LIMIT 200
    `).all();

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

      if(!env.DB){
        return json({
          ok:false,
          error:"اتصال D1 با نام DB پیدا نشد"
        },500);
      }

      return await handle(request,env);

    }catch(error){

      console.error(error);

      return json({
        ok:false,
        error:"خطای داخلی سرور",
        detail:error?.message||String(error)
      },500);
    }
  }
};
