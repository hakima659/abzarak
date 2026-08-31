
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: {
          "content-type": "application/json; charset=UTF-8",
          "cache-control": "no-store"
        }
      });

    const html = `<!doctype html>
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
color:#172033
}
header{
background:#111827;
color:white;
padding:18px;
text-align:center;
position:sticky;
top:0;
z-index:5
}
header h1{margin:0;font-size:21px}
header p{margin:7px 0 0;color:#cbd5e1;font-size:13px}
.container{max-width:900px;margin:auto;padding:15px}
.card{
background:white;
border-radius:18px;
padding:16px;
margin:12px 0;
box-shadow:0 5px 20px rgba(0,0,0,.06)
}
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
textarea{min-height:100px;resize:vertical}
button{
border:0;
border-radius:12px;
padding:12px 16px;
cursor:pointer;
font-family:inherit;
font-size:14px;
margin:4px
}
.primary{background:#2563eb;color:white}
.green{background:#16a34a;color:white}
.red{background:#dc2626;color:white}
.gray{background:#e5e7eb;color:#111827}
.dark{background:#111827;color:white}
button:disabled{opacity:.5}
.hidden{display:none!important}
.balance{font-size:30px;font-weight:bold;margin:8px 0}
.grid{
display:grid;
grid-template-columns:repeat(2,1fr);
gap:10px
}
.stat{
background:#f8fafc;
padding:14px;
border-radius:14px;
text-align:center
}
.chat{
min-height:300px;
max-height:500px;
overflow:auto;
padding:8px
}
.msg{
padding:12px;
border-radius:14px;
margin:8px 0;
line-height:1.8;
white-space:pre-wrap
}
.user{background:#dbeafe;margin-right:15%}
.bot{background:#f1f5f9;margin-left:15%}
.small{font-size:12px;color:#64748b}
.item{
padding:12px;
border-bottom:1px solid #e5e7eb
}
.ok{color:#15803d}
.err{color:#b91c1c}
table{
width:100%;
border-collapse:collapse;
margin-top:10px
}
th,td{
padding:9px;
border-bottom:1px solid #e5e7eb;
text-align:right;
font-size:13px
}
@media(max-width:600px){
.grid{grid-template-columns:1fr}
.user{margin-right:5%}
.bot{margin-left:5%}
}
</style>
</head>

<body>

<header>
<h1>🤖 دستیار هوش مصنوعی</h1>
<p>دستیار هوشمند + حساب کاربری + موجودی + برداشت</p>
</header>

<div class="container">

<div id="authBox" class="card">
<h2>👤 حساب کاربری</h2>

<div id="loginForm">
<input id="loginEmail" type="email" placeholder="ایمیل">
<input id="loginPassword" type="password" placeholder="رمز عبور">
<button class="primary" onclick="login()">ورود</button>
<button class="gray" onclick="showRegister()">ثبت‌نام</button>
</div>

<div id="registerForm" class="hidden">
<input id="regName" placeholder="نام">
<input id="regEmail" type="email" placeholder="ایمیل">
<input id="regPassword" type="password" placeholder="رمز عبور حداقل ۶ کاراکتر">
<button class="green" onclick="register()">ایجاد حساب</button>
<button class="gray" onclick="showLogin()">بازگشت</button>
</div>

<div id="authMsg" class="small"></div>
</div>

<div id="appBox" class="hidden">

<div class="card">
<div class="small">کاربر</div>
<h3 id="userName">-</h3>

<div class="grid">
<div class="stat">
<div class="small">موجودی</div>
<div id="balance" class="balance">$0.00</div>
</div>

<div class="stat">
<div class="small">وضعیت حساب</div>
<div id="accountStatus">فعال</div>
</div>
</div>

<button class="red" onclick="logout()">خروج</button>
<button class="green" onclick="showWithdraw()">💵 برداشت</button>
<button class="gray" onclick="loadTransactions()">📊 تراکنش‌ها</button>
</div>

<div class="card">
<h2>💬 دستیار هوش مصنوعی</h2>

<div id="chat" class="chat">
<div class="msg bot">سلام! 👋 سوالت را بنویس.</div>
</div>

<textarea id="question" placeholder="سوال خود را بنویسید..."></textarea>

<button id="sendBtn" class="primary" onclick="askAI()">ارسال</button>
<button class="gray" onclick="clearChat()">🗑️ پاک کردن گفتگو</button>
</div>

<div id="withdrawBox" class="card hidden">
<h2>💵 درخواست برداشت</h2>
<div class="small">حداقل برداشت: $10</div>

<input id="withdrawAmount" type="number" min="10" step="0.01" placeholder="مبلغ به دلار">

<select id="withdrawMethod">
<option value="USDT">USDT</option>
</select>

<input id="withdrawAddress" placeholder="آدرس کیف پول USDT">

<button class="green" onclick="withdraw()">ثبت درخواست برداشت</button>
<button class="gray" onclick="hideWithdraw()">بستن</button>

<div id="withdrawMsg" class="small"></div>
</div>

<div id="transactionsBox" class="card hidden">
<h2>📊 تراکنش‌ها</h2>
<div id="transactions"></div>
</div>

</div>

<div class="card">
<h3>🛠️ مدیریت</h3>
<button class="dark" onclick="showAdmin()">ورود مدیریت</button>

<div id="adminLoginBox" class="hidden">
<input id="adminPassword" type="password" placeholder="رمز مدیریت">
<button class="dark" onclick="adminLogin()">ورود</button>
<div id="adminMsg" class="small"></div>
</div>

<div id="adminPanel" class="hidden">
<button class="gray" onclick="adminUsers()">👥 کاربران</button>
<button class="gray" onclick="adminWithdrawals()">💵 برداشت‌ها</button>
<div id="adminResult"></div>
</div>
</div>

</div>

<script>
let token = localStorage.getItem("ai_token") || "";
let adminToken = localStorage.getItem("admin_token") || "";

async function api(path, options={}){
const headers={
"content-type":"application/json",
...(options.headers||{})
};

if(token) headers.authorization="Bearer "+token;
if(adminToken) headers["x-admin-token"]=adminToken;

const res=await fetch(path,{...options,headers});

let data;
try{
data=await res.json();
}catch{
data={ok:false,error:"پاسخ نامعتبر از سرور"};
}

if(!res.ok && !data.error){
data.error="خطای سرور";
}

return data;
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

function msg(text,ok=false){
const el=document.getElementById("authMsg");
el.textContent=text;
el.className=ok?"small ok":"small err";
}

async function register(){
const name=document.getElementById("regName").value.trim();
const email=document.getElementById("regEmail").value.trim().toLowerCase();
const password=document.getElementById("regPassword").value;

if(!name || !email || password.length<6){
msg("نام، ایمیل و رمز حداقل ۶ کاراکتری لازم است.");
return;
}

const r=await api("/api/register",{
method:"POST",
body:JSON.stringify({name,email,password})
});

if(!r.ok){
msg(r.error||"ثبت‌نام ناموفق بود");
return;
}

token=r.token;
localStorage.setItem("ai_token",token);
await loadMe();
}

async function login(){
const email=document.getElementById("loginEmail").value.trim().toLowerCase();
const password=document.getElementById("loginPassword").value;

const r=await api("/api/login",{
method:"POST",
body:JSON.stringify({email,password})
});

if(!r.ok){
msg(r.error||"ورود ناموفق بود");
return;
}

token=r.token;
localStorage.setItem("ai_token",token);
await loadMe();
}

async function loadMe(){
const r=await api("/api/me");

if(!r.ok){
localStorage.removeItem("ai_token");
token="";
return;
}

document.getElementById("authBox").classList.add("hidden");
document.getElementById("appBox").classList.remove("hidden");

document.getElementById("userName").textContent=r.user.name;
document.getElementById("balance").textContent="$"+Number(r.user.balance).toFixed(2);
document.getElementById("accountStatus").textContent=r.user.status||"فعال";
}

function logout(){
localStorage.removeItem("ai_token");
token="";
location.reload();
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
btn.textContent="در حال پاسخ...";

const r=await api("/api/ai",{
method:"POST",
body:JSON.stringify({message:question})
});

if(r.ok){
addMessage(r.answer||"پاسخی دریافت نشد.","bot");
await loadMe();
}else{
addMessage("خطا: "+(r.error||"خطا در دریافت پاسخ"),"bot");
}

btn.disabled=false;
btn.textContent="ارسال";
}

function clearChat(){
document.getElementById("chat").innerHTML=
'<div class="msg bot">گفتگو پاک شد. سوال جدیدت را بنویس.</div>';
}

function showWithdraw(){
document.getElementById("withdrawBox").classList.remove("hidden");
}

function hideWithdraw(){
document.getElementById("withdrawBox").classList.add("hidden");
}

async function withdraw(){
const amount=Number(document.getElementById("withdrawAmount").value);
const method=document.getElementById("withdrawMethod").value;
const address=document.getElementById("withdrawAddress").value.trim();
const out=document.getElementById("withdrawMsg");

if(!Number.isFinite(amount)||amount<10){
out.textContent="حداقل مبلغ برداشت $10 است.";
out.className="small err";
return;
}

if(!address){
out.textContent="آدرس کیف پول USDT را وارد کنید.";
out.className="small err";
return;
}

const r=await api("/api/withdraw",{
method:"POST",
body:JSON.stringify({amount,method,address})
});

if(!r.ok){
out.textContent=r.error||"ثبت برداشت ناموفق بود.";
out.className="small err";
return;
}

out.textContent="درخواست برداشت با موفقیت ثبت شد.";
out.className="small ok";

document.getElementById("withdrawAmount").value="";
document.getElementById("withdrawAddress").value="";

await loadMe();
}

async function loadTransactions(){
document.getElementById("transactionsBox").classList.remove("hidden");

const r=await api("/api/transactions");
const box=document.getElementById("transactions");

if(!r.ok){
box.textContent=r.error||"خطا";
return;
}

if(!r.items.length){
box.innerHTML='<div class="small">تراکنشی وجود ندارد.</div>';
return;
}

box.innerHTML=r.items.map(x=>
'<div class="item">💵 $'+Number(x.amount).toFixed(2)+
' — '+x.status+
' — '+(x.method||"USDT")+
'<br><span class="small">'+x.created_at+'</span></div>'
).join("");
}

function showAdmin(){
document.getElementById("adminLoginBox").classList.remove("hidden");
}

async function adminLogin(){
const password=document.getElementById("adminPassword").value;

const r=await api("/api/admin/login",{
method:"POST",
body:JSON.stringify({password})
});

const m=document.getElementById("adminMsg");

if(!r.ok){
m.textContent=r.error||"رمز مدیریت اشتباه است.";
m.className="small err";
return;
}

adminToken=r.token;
localStorage.setItem("admin_token",adminToken);

m.textContent="ورود مدیریت موفق بود.";
m.className="small ok";

document.getElementById("adminPanel").classList.remove("hidden");
}

async function adminUsers(){
const r=await api("/api/admin/users");
const box=document.getElementById("adminResult");

if(!r.ok){
box.textContent=r.error||"خطا";
return;
}

box.innerHTML=
'<h3>کاربران</h3>'+
r.users.map(u=>
'<div class="item">'+
'<b>'+escapeHtml(u.username)+'</b>'+
'<br>ایمیل: '+escapeHtml(u.email||"-")+
'<br>موجودی: $'+Number(u.balance).toFixed(2)+
'<br>'+
'<input id="credit_'+u.id+'" type="number" step="0.01" min="0" placeholder="افزایش موجودی">'+
'<button class="green" onclick="creditUser('+u.id+')">افزایش موجودی</button>'+
'</div>'
).join("");
}

async function creditUser(id){
const input=document.getElementById("credit_"+id);
const amount=Number(input.value);

if(!amount || amount<=0){
alert("مبلغ معتبر وارد کنید.");
return;
}

const r=await api("/api/admin/credit",{
method:"POST",
body:JSON.stringify({userId:id,amount})
});

alert(r.ok?"موجودی اضافه شد.":(r.error||"خطا"));

if(r.ok) adminUsers();
}

async function adminWithdrawals(){
const r=await api("/api/admin/withdrawals");
const box=document.getElementById("adminResult");

if(!r.ok){
box.textContent=r.error||"خطا";
return;
}

if(!r.items.length){
box.innerHTML="<p>درخواستی وجود ندارد.</p>";
return;
}

box.innerHTML=
'<h3>درخواست‌های برداشت</h3>'+
'<table><tr><th>کاربر</th><th>مبلغ</th><th>روش</th><th>وضعیت</th><th>آدرس</th></tr>'+
r.items.map(x=>
'<tr>'+
'<td>'+escapeHtml(x.username)+'</td>'+
'<td>$'+Number(x.amount).toFixed(2)+'</td>'+
'<td>'+escapeHtml(x.method||"USDT")+'</td>'+
'<td>'+escapeHtml(x.status)+'</td>'+
'<td style="word-break:break-all">'+escapeHtml(x.address||"")+'</td>'+
'</tr>'
).join("")+
'</table>';
}

function escapeHtml(s){
return String(s??"")
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")
.replace(/"/g,"&quot;");
}

if(token){
loadMe();
}
</script>

</body>
</html>`;

    async function sha256(text) {
      const data = new TextEncoder().encode(text);
      const hash = await crypto.subtle.digest("SHA-256", data);
      return [...new Uint8Array(hash)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
    }

    function randomToken() {
      return crypto.randomUUID() + "-" +
        crypto.randomUUID() + "-" +
        crypto.randomUUID();
    }

    function getToken(request) {
      const h = request.headers.get("authorization") || "";
      if (h.startsWith("Bearer ")) return h.slice(7);
      return "";
    }

    async function getUser(request) {
      const t = getToken(request);
      if (!t) return null;

      const row = await env.DB
        .prepare(`
          SELECT u.*
          FROM users u
          JOIN sessions s ON s.user_id=u.id
          WHERE s.token=?
          LIMIT 1
        `)
        .bind(t)
        .first();

      return row || null;
    }

    async function requireUser(request) {
      const user = await getUser(request);
      if (!user) return null;
      if (user.status && user.status !== "فعال") return null;
      return user;
    }

    function adminOK(request) {
      const t = request.headers.get("x-admin-token") || "";
      return t === env.ADMIN_PASSWORD;
    }

    if (request.method === "GET" && url.pathname === "/") {
      return new Response(html, {
        headers: {
          "content-type": "text/html; charset=UTF-8",
          "cache-control": "no-store"
        }
      });
    }

    if (request.method === "POST" && url.pathname === "/api/register") {
      try {
        const body = await request.json();

        const name = String(body.name || "").trim();
        const email = String(body.email || "").trim().toLowerCase();
        const password = String(body.password || "");

        if (!name || !email || password.length < 6) {
          return json({
            ok: false,
            error: "نام، ایمیل و رمز حداقل ۶ کاراکتری لازم است."
          }, 400);
        }

        const exists = await env.DB
          .prepare("SELECT id FROM users WHERE email=? OR username=? LIMIT 1")
          .bind(email, name)
          .first();

        if (exists) {
          return json({
            ok: false,
            error: "این ایمیل یا نام کاربری قبلاً ثبت شده است."
          }, 409);
        }

        const passwordHash = await sha256(password);

        const result = await env.DB
          .prepare(`
            INSERT INTO users
            (username,email,password_hash,balance,plan,status)
            VALUES (?,?,?,0,'free','فعال')
          `)
          .bind(name, email, passwordHash)
          .run();

        const userId = result.meta.last_row_id;
        const sessionToken = randomToken();

        await env.DB
          .prepare(`
            INSERT INTO sessions (user_id,token)
            VALUES (?,?)
          `)
          .bind(userId, sessionToken)
          .run();

        return json({
          ok: true,
          token: sessionToken
        });

      } catch (e) {
        return json({
          ok: false,
          error: "خطا در ثبت‌نام",
          detail: String(e)
        }, 500);
      }
    }

    if (request.method === "POST" && url.pathname === "/api/login") {
      try {
        const body = await request.json();

        const email = String(body.email || "").trim().toLowerCase();
        const password = String(body.password || "");

        if (!email || !password) {
          return json({
            ok: false,
            error: "ایمیل و رمز عبور را وارد کنید."
          }, 400);
        }

        const passwordHash = await sha256(password);

        const user = await env.DB
          .prepare(`
            SELECT *
            FROM users
            WHERE email=? AND password_hash=?
            LIMIT 1
          `)
          .bind(email, passwordHash)
          .first();

        if (!user) {
          return json({
            ok: false,
            error: "ایمیل یا رمز عبور اشتباه است."
          }, 401);
        }

        if (user.status && user.status !== "فعال") {
          return json({
            ok: false,
            error: "حساب شما غیرفعال است."
          }, 403);
        }

        const sessionToken = randomToken();

        await env.DB
          .prepare(`
            INSERT INTO sessions (user_id,token)
            VALUES (?,?)
          `)
          .bind(user.id, sessionToken)
          .run();

        return json({
          ok: true,
          token: sessionToken
        });

      } catch (e) {
        return json({
          ok: false,
          error: "خطا در ورود",
          detail: String(e)
        }, 500);
      }
    }

    if (request.method === "GET" && url.pathname === "/api/me") {
      const user = await requireUser(request);

      if (!user) {
        return json({
          ok: false,
          error: "نیاز به ورود است."
        }, 401);
      }

      return json({
        ok: true,
        user: {
          id: user.id,
          name: user.username,
          email: user.email,
          balance: Number(user.balance || 0),
          plan: user.plan,
          status: user.status || "فعال"
        }
      });
    }

    if (request.method === "POST" && url.pathname === "/api/logout") {
      const t = getToken(request);

      if (t) {
        await env.DB
          .prepare("DELETE FROM sessions WHERE token=?")
          .bind(t)
          .run();
      }

      return json({ ok: true });
    }

    if (request.method === "POST" && url.pathname === "/api/ai") {
      try {
        const user = await requireUser(request);

        if (!user) {
          return json({
            ok: false,
            error: "ابتدا وارد حساب شوید."
          }, 401);
        }

        const body = await request.json();
        const message = String(body.message || "").trim();

        if (!message) {
          return json({
            ok: false,
            error: "پیام خالی است."
          }, 400);
        }

        if (!env.AI) {
          return json({
            ok: false,
            error: "اتصال Workers AI برقرار نیست."
          }, 500);
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
          {
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful AI assistant. Answer clearly and accurately. If the user writes Persian, answer in Persian."
              },
              {
                role: "user",
                content: message
              }
            ],
            max_tokens: 700,
            temperature: 0.6
          }
        );

        const answer =
          result?.response ||
          result?.result?.response ||
          "پاسخی دریافت نشد.";

        return json({
          ok: true,
          answer
        });

      } catch (e) {
        return json({
          ok: false,
          error: "خطا در دریافت پاسخ هوش مصنوعی",
          detail: String(e)
        }, 500);
      }
    }

    if (request.method === "POST" && url.pathname === "/api/withdraw") {
      try {
        const user = await requireUser(request);

        if (!user) {
          return json({
            ok: false,
            error: "ابتدا وارد حساب شوید."
          }, 401);
        }

        const body = await request.json();

        const amount = Number(body.amount);
        const method = String(body.method || "USDT").trim();
        const address = String(body.address || "").trim();

        if (!Number.isFinite(amount) || amount < 10) {
          return json({
            ok: false,
            error: "حداقل برداشت $10 است."
          }, 400);
        }

        if (!address) {
          return json({
            ok: false,
            error: "آدرس کیف پول را وارد کنید."
          }, 400);
        }

        const current = await env.DB
          .prepare("SELECT balance FROM users WHERE id=?")
          .bind(user.id)
          .first();

        const balance = Number(current?.balance || 0);

        if (balance < amount) {
          return json({
            ok: false,
            error: "موجودی کافی نیست."
          }, 400);
        }

        await env.DB
          .prepare(`
            UPDATE users
            SET balance=balance-?
            WHERE id=? AND balance>=?
          `)
          .bind(amount, user.id, amount)
          .run();

        await env.DB
          .prepare(`
            INSERT INTO withdrawals
            (username,amount,status,method,address)
            VALUES (?,?,?,?,?)
          `)
          .bind(
            user.username,
            amount,
            "pending",
            method,
            address
          )
          .run();

        return json({
          ok: true,
          message: "درخواست برداشت ثبت شد."
        });

      } catch (e) {
        return json({
          ok: false,
          error: "خطا در ثبت برداشت",
          detail: String(e)
        }, 500);
      }
    }

    if (request.method === "GET" && url.pathname === "/api/transactions") {
      try {
        const user = await requireUser(request);

        if (!user) {
          return json({
            ok: false,
            error: "ابتدا وارد حساب شوید."
          }, 401);
        }

        const result = await env.DB
          .prepare(`
            SELECT id,amount,status,method,address,created_at
            FROM withdrawals
            WHERE username=?
            ORDER BY id DESC
          `)
          .bind(user.username)
          .all();

        return json({
          ok: true,
          items: result.results || []
        });

      } catch (e) {
        return json({
          ok: false,
          error: "خطا در دریافت تراکنش‌ها",
          detail: String(e)
        }, 500);
      }
    }

    if (request.method === "POST" && url.pathname === "/api/admin/login") {
      try {
        const body = await request.json();
        const password = String(body.password || "");

        if (!env.ADMIN_PASSWORD) {
          return json({
            ok: false,
            error: "ADMIN_PASSWORD در Worker تنظیم نشده است."
          }, 500);
        }

        if (password !== env.ADMIN_PASSWORD) {
          return json({
            ok: false,
            error: "رمز مدیریت اشتباه است."
          }, 401);
        }

        return json({
          ok: true,
          token: env.ADMIN_PASSWORD
        });

      } catch (e) {
        return json({
          ok: false,
          error: "خطای ورود مدیریت"
        }, 500);
      }
    }

    if (request.method === "GET" && url.pathname === "/api/admin/users") {
      if (!adminOK(request)) {
        return json({
          ok: false,
          error: "دسترسی مدیریت مجاز نیست."
        }, 403);
      }

      const result = await env.DB
        .prepare(`
          SELECT id,username,email,balance,plan,status,created_at
          FROM users
          ORDER BY id DESC
        `)
        .all();

      return json({
        ok: true,
        users: result.results || []
      });
    }

    if (request.method === "POST" && url.pathname === "/api/admin/credit") {
      if (!adminOK(request)) {
        return json({
          ok: false,
          error: "دسترسی مدیریت مجاز نیست."
        }, 403);
      }

      try {
        const body = await request.json();

        const userId = Number(body.userId);
        const amount = Number(body.amount);

        if (!Number.isInteger(userId) || amount <= 0) {
          return json({
            ok: false,
            error: "اطلاعات نامعتبر است."
          }, 400);
        }

        await env.DB
          .prepare(`
            UPDATE users
            SET balance=balance+?
            WHERE id=?
          `)
          .bind(amount, userId)
          .run();

        return json({
          ok: true,
          message: "موجودی افزایش یافت."
        });

      } catch (e) {
        return json({
          ok: false,
          error: "خطا در افزایش موجودی",
          detail: String(e)
        }, 500);
      }
    }

    if (request.method === "GET" && url.pathname === "/api/admin/withdrawals") {
      if (!adminOK(request)) {
        return json({
          ok: false,
          error: "دسترسی مدیریت مجاز نیست."
        }, 403);
      }

      const result = await env.DB
        .prepare(`
          SELECT id,username,amount,status,method,address,created_at
          FROM withdrawals
          ORDER BY id DESC
        `)
        .all();

      return json({
        ok: true,
        items: result.results || []
      });
    }

    return json({
      ok: false,
      error: "مسیر پیدا نشد."
    }, 404);
  }
};
