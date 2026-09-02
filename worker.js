const HTML = `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>دستیار هوش مصنوعی</title>
<style>
*{box-sizing:border-box}
body{
 margin:0;font-family:Tahoma,Arial,sans-serif;
 background:#f4f7fb;color:#172033
}
.container{max-width:900px;margin:auto;padding:20px}
.card{
 background:white;border-radius:18px;padding:22px;margin:15px 0;
 box-shadow:0 5px 25px #00000012
}
h1,h2{margin-top:0}
input,select,button{
 width:100%;padding:13px;margin:7px 0;
 border-radius:10px;border:1px solid #d8dee8;
 font-size:15px
}
button{
 background:#2563eb;color:white;border:0;cursor:pointer
}
button:hover{opacity:.9}
.secondary{background:#64748b}
.danger{background:#dc2626}
.success{background:#16a34a}
.hidden{display:none}
.nav{
 display:grid;grid-template-columns:repeat(2,1fr);gap:10px
}
.nav button{background:#0f172a}
.msg{
 padding:12px;border-radius:10px;background:#eef2ff;
 margin-top:10px
}
.balance{
 font-size:28px;font-weight:bold;text-align:center;
 padding:20px;background:#eff6ff;border-radius:15px
}
.small{color:#64748b;font-size:13px}
</style>
</head>
<body>

<div class="container">

<div class="card" id="auth">
<h1>🤖 دستیار هوش مصنوعی</h1>
<p>دستیار هوشمند، حساب کاربری، درآمد، پرداخت و برداشت</p>

<div class="nav">
<button onclick="show('loginBox')">ورود</button>
<button onclick="show('registerBox')">ثبت‌نام</button>
<button onclick="show('forgotBox')">بازیابی رمز</button>
<button onclick="show('adminBox')">🛠️ پنل مدیریت</button>
</div>

<div id="loginBox">
<h2>ورود به حساب</h2>
<input id="loginEmail" placeholder="ایمیل">
<input id="loginPassword" type="password" placeholder="رمز عبور">
<button onclick="login()">ورود</button>
</div>

<div id="registerBox" class="hidden">
<h2>ثبت‌نام</h2>
<input id="regName" placeholder="نام و نام خانوادگی">
<input id="regEmail" placeholder="ایمیل">
<input id="regPassword" type="password" placeholder="رمز عبور">
<button onclick="register()">ثبت‌نام</button>
</div>

<div id="forgotBox" class="hidden">
<h2>بازیابی رمز</h2>
<input id="forgotEmail" placeholder="ایمیل">
<button onclick="forgot()">بازیابی</button>
<p class="small">برای امنیت، بازیابی واقعی رمز باید به ایمیل کاربر متصل شود.</p>
</div>

<div id="adminBox" class="hidden">
<h2>🔐 ورود مدیر</h2>
<input id="adminPassword" type="password" placeholder="رمز مدیریت">
<button onclick="adminLogin()">ورود مدیریت</button>
</div>

<div id="message"></div>
</div>

<div id="userPanel" class="hidden">

<div class="card">
<h2>👤 حساب کاربری</h2>
<div id="userInfo"></div>
<button class="secondary" onclick="logout()">خروج</button>
</div>

<div class="card">
<h2>💰 موجودی حساب</h2>
<div class="balance" id="balance">0 تومان</div>
<p class="small">حداقل برداشت: ۱۰٬۰۰۰ تومان</p>
</div>

<div class="card">
<h2>💳 پرداخت و اشتراک</h2>

<button onclick="pay(399000)">پلن حرفه‌ای — ۳۹۹٬۰۰۰ تومان</button>
<button onclick="pay(799000)">پلن ویژه — ۷۹۹٬۰۰۰ تومان</button>
</div>

<div class="card">
<h2>💸 درخواست برداشت</h2>
<input id="withdrawAmount" type="number" placeholder="مبلغ برداشت">
<input id="withdrawCard" placeholder="شماره کارت">
<button onclick="withdraw()">درخواست برداشت</button>
</div>

<div class="card">
<h2>📊 تراکنش‌ها</h2>
<div id="transactions">در حال بارگذاری...</div>
</div>

</div>

<div id="adminPanel" class="hidden">

<div class="card">
<h2>🛠️ پنل مدیریت</h2>
<p>مدیریت کاربران، پرداخت‌ها، برداشت‌ها و موجودی</p>
<button class="danger" onclick="adminLogout()">خروج مدیر</button>
</div>

<div class="card">
<h2>👥 کاربران</h2>
<div id="users">در حال بارگذاری...</div>
</div>

<div class="card">
<h2>💸 برداشت‌ها</h2>
<div id="withdrawals">در حال بارگذاری...</div>
</div>

</div>

</div>

<script>
function show(id){
 document.querySelectorAll('#auth > div').forEach(x=>{
   if(['loginBox','registerBox','forgotBox','adminBox'].includes(x.id))
      x.classList.add('hidden');
 });
 document.getElementById(id).classList.remove('hidden');
}

function msg(t){
 document.getElementById('message').innerHTML=
 '<div class="msg">'+t+'</div>';
}

async function api(url,data={}){
 try{
   const r=await fetch(url,{
     method:'POST',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify(data)
   });
   const j=await r.json();
   if(!r.ok) throw new Error(j.error||'خطای سرور');
   return j;
 }catch(e){
   msg(e.message);
   throw e;
 }
}

async function register(){
 const j=await api('/api/register',{
  name:document.getElementById('regName').value,
  email:document.getElementById('regEmail').value,
  password:document.getElementById('regPassword').value
 });
 msg(j.message||'ثبت‌نام انجام شد');
 show('loginBox');
}

async function login(){
 const j=await api('/api/login',{
  email:document.getElementById('loginEmail').value,
  password:document.getElementById('loginPassword').value
 });

 localStorage.setItem('token',j.token);
 document.getElementById('auth').classList.add('hidden');
 document.getElementById('userPanel').classList.remove('hidden');
 loadMe();
}

async function loadMe(){
 const r=await fetch('/api/me',{
  headers:{Authorization:'Bearer '+localStorage.getItem('token')}
 });
 const j=await r.json();

 if(!r.ok){
   logout();
   return;
 }

 document.getElementById('userInfo').innerHTML=
 'نام: '+escapeHtml(j.user.name)+
 '<br>ایمیل: '+escapeHtml(j.user.email);

 document.getElementById('balance').innerText=
 Number(j.user.balance).toLocaleString('fa-IR')+' تومان';

 loadTransactions();
}

async function loadTransactions(){
 const r=await fetch('/api/transactions',{
  headers:{Authorization:'Bearer '+localStorage.getItem('token')}
 });
 const j=await r.json();

 document.getElementById('transactions').innerHTML=
 j.items.length
 ? j.items.map(x=>
   '<div class="msg">'+
   escapeHtml(x.type)+' — '+
   Number(x.amount).toLocaleString('fa-IR')+
   ' تومان</div>'
 ).join('')
 : 'تراکنشی وجود ندارد.';
}

async function pay(amount){
 const j=await api('/api/payment',{
  token:localStorage.getItem('token'),
  amount
 });
 msg(j.message||'درخواست پرداخت ثبت شد');
}

async function withdraw(){
 const amount=Number(document.getElementById('withdrawAmount').value);
 const card=document.getElementById('withdrawCard').value;

 const j=await api('/api/withdraw',{
  token:localStorage.getItem('token'),
  amount,
  card
 });

 msg(j.message||'درخواست برداشت ثبت شد');
 loadMe();
}

async function forgot(){
 const j=await api('/api/forgot',{
  email:document.getElementById('forgotEmail').value
 });
 msg(j.message);
}

async function adminLogin(){
 const password=document.getElementById('adminPassword').value;

 const j=await api('/api/admin/login',{password});

 localStorage.setItem('adminToken',j.token);

 document.getElementById('auth').classList.add('hidden');
 document.getElementById('adminPanel').classList.remove('hidden');

 loadAdmin();
}

async function loadAdmin(){
 const token=localStorage.getItem('adminToken');

 const r=await fetch('/api/admin/users',{
  headers:{Authorization:'Bearer '+token}
 });

 const j=await r.json();

 if(!r.ok){
   msg(j.error||'دسترسی غیرمجاز');
   return;
 }

 document.getElementById('users').innerHTML=
 j.users.map(u=>
 '<div class="msg">'+
 escapeHtml(u.name)+' — '+
 escapeHtml(u.email)+' — '+
 Number(u.balance).toLocaleString('fa-IR')+
 ' تومان</div>'
 ).join('');

 const w=await fetch('/api/admin/withdrawals',{
  headers:{Authorization:'Bearer '+token}
 });

 const wj=await w.json();

 document.getElementById('withdrawals').innerHTML=
 wj.items.length
 ? wj.items.map(x=>
   '<div class="msg">'+
   escapeHtml(x.email)+' — '+
   Number(x.amount).toLocaleString('fa-IR')+
   ' تومان — '+escapeHtml(x.status)+
   '</div>'
 ).join('')
 : 'درخواستی وجود ندارد.';
}

function logout(){
 localStorage.removeItem('token');
 location.reload();
}

function adminLogout(){
 localStorage.removeItem('adminToken');
 location.reload();
}

function escapeHtml(s){
 return String(s??'')
 .replaceAll('&','&amp;')
 .replaceAll('<','&lt;')
 .replaceAll('>','&gt;')
 .replaceAll('"','&quot;')
 .replaceAll("'","&#039;");
}
</script>

</body>
</html>`;

function json(data,status=200){
 return new Response(JSON.stringify(data),{
  status,
  headers:{'Content-Type':'application/json;charset=UTF-8'}
 });
}

function token(){
 return crypto.randomUUID();
}

async function hashPassword(password){
 const data=new TextEncoder().encode(password);
 const hash=await crypto.subtle.digest('SHA-256',data);
 return [...new Uint8Array(hash)]
  .map(x=>x.toString(16).padStart(2,'0')).join('');
}

async function getUserByToken(env,t){
 const row=await env.DB.prepare(
  `SELECT u.* FROM sessions s
   JOIN users u ON u.id=s.user_id
   WHERE s.token=? AND s.expires_at>?`
 ).bind(t,Date.now()).first();

 return row;
}

function getBearer(request){
 const h=request.headers.get('Authorization')||'';
 return h.startsWith('Bearer ')?h.slice(7):'';
}

export default {
 async fetch(request,env){

  try{

   if(!env.DB){
    return json({
     ok:false,
     error:'Binding دیتابیس D1 با نام DB تنظیم نشده است.'
    },500);
   }

   const url=new URL(request.url);

   if(request.method==='GET' && url.pathname==='/'){
    return new Response(HTML,{
     headers:{'Content-Type':'text/html;charset=UTF-8'}
    });
   }

   if(request.method!=='POST'){
    if(url.pathname.startsWith('/api/'))
      return json({error:'Method Not Allowed'},405);

    return new Response('Not Found',{status:404});
   }

   const body=await request.json().catch(()=>({}));

   /*
    * ثبت‌نام
    */
   if(url.pathname==='/api/register'){

    const name=String(body.name||'').trim();
    const email=String(body.email||'').trim().toLowerCase();
    const password=String(body.password||'');

    if(!name || !email || !password)
      return json({error:'همه فیلدها را کامل کنید.'},400);

    if(password.length<6)
      return json({error:'رمز عبور باید حداقل ۶ کاراکتر باشد.'},400);

    const old=await env.DB.prepare(
      `SELECT id FROM users WHERE email=?`
    ).bind(email).first();

    if(old)
      return json({error:'این ایمیل قبلاً ثبت شده است.'},409);

    const id=crypto.randomUUID();
    const hash=await hashPassword(password);

    await env.DB.prepare(
      `INSERT INTO users
       (id,name,email,password,balance,created_at)
       VALUES(?,?,?,?,?,?)`
    ).bind(
      id,name,email,hash,0,Date.now()
    ).run();

    return json({
      ok:true,
      message:'ثبت‌نام با موفقیت انجام شد.'
    });
   }

   /*
    * ورود
    */
   if(url.pathname==='/api/login'){

    const email=String(body.email||'').trim().toLowerCase();
    const password=String(body.password||'');

    const user=await env.DB.prepare(
      `SELECT * FROM users WHERE email=?`
    ).bind(email).first();

    if(!user)
      return json({error:'ایمیل یا رمز عبور اشتباه است.'},401);

    const hash=await hashPassword(password);

    if(hash!==user.password)
      return json({error:'ایمیل یا رمز عبور اشتباه است.'},401);

    const t=token();

    await env.DB.prepare(
      `INSERT INTO sessions
       (token,user_id,expires_at)
       VALUES(?,?,?)`
    ).bind(
      t,user.id,Date.now()+2592000000
    ).run();

    return json({
      ok:true,
      token:t
    });
   }

   /*
    * اطلاعات کاربر
    */
   if(url.pathname==='/api/me'){

    const u=await getUserByToken(env,getBearer(request));

    if(!u)
      return json({error:'نشست شما منقضی شده است.'},401);

    return json({
      ok:true,
      user:{
       id:u.id,
       name:u.name,
       email:u.email,
       balance:u.balance
      }
    });
   }

   /*
    * تراکنش‌ها
    */
   if(url.pathname==='/api/transactions'){

    const u=await getUserByToken(env,getBearer(request));

    if(!u)
      return json({error:'دسترسی غیرمجاز'},401);

    const rows=await env.DB.prepare(
      `SELECT * FROM transactions
       WHERE user_id=?
       ORDER BY created_at DESC`
    ).bind(u.id).all();

    return json({
      ok:true,
      items:rows.results||[]
    });
   }

   /*
    * پرداخت
    * فعلاً ثبت درخواست است.
    * برای پرداخت واقعی باید Merchant ID درگاه اضافه شود.
    */
   if(url.pathname==='/api/payment'){

    const u=await getUserByToken(
      env,
      String(body.token||'')
    );

    if(!u)
      return json({error:'لطفاً دوباره وارد شوید.'},401);

    const amount=Number(body.amount);

    if(![399000,799000].includes(amount))
      return json({error:'پلن نامعتبر است.'},400);

    await env.DB.prepare(
      `INSERT INTO transactions
       (id,user_id,type,amount,status,created_at)
       VALUES(?,?,?,?,?,?)`
    ).bind(
      crypto.randomUUID(),
      u.id,
      'payment',
      amount,
      'pending',
      Date.now()
    ).run();

    return json({
      ok:true,
      message:'درخواست پرداخت ثبت شد. اتصال درگاه واقعی باید در مرحله بعد انجام شود.'
    });
   }

   /*
    * برداشت
    */
   if(url.pathname==='/api/withdraw'){

    const u=await getUserByToken(
      env,
      String(body.token||'')
    );

    if(!u)
      return json({error:'لطفاً دوباره وارد شوید.'},401);

    const amount=Number(body.amount);
    const card=String(body.card||'').trim();

    if(!Number.isFinite(amount) || amount<10000)
      return json({
       error:'حداقل مبلغ برداشت ۱۰٬۰۰۰ تومان است.'
      },400);

    if(amount>Number(u.balance))
      return json({error:'موجودی کافی نیست.'},400);

    if(!/^[0-9]{16}$/.test(card.replace(/\\s/g,'')))
      return json({
       error:'شماره کارت باید ۱۶ رقم باشد.'
      },400);

    const requestId=crypto.randomUUID();

    await env.DB.prepare(
      `INSERT INTO withdrawals
       (id,user_id,amount,card,status,created_at)
       VALUES(?,?,?,?,?,?)`
    ).bind(
      requestId,
      u.id,
      amount,
      card.replace(/\\s/g,''),
      'pending',
      Date.now()
    ).run();

    await env.DB.prepare(
      `UPDATE users
       SET balance=balance-?
       WHERE id=?`
    ).bind(amount,u.id).run();

    return json({
      ok:true,
      message:'درخواست برداشت ثبت شد و در انتظار بررسی مدیر است.'
    });
   }

   /*
    * بازیابی رمز
    */
   if(url.pathname==='/api/forgot'){

    const email=String(body.email||'').trim().toLowerCase();

    const u=await env.DB.prepare(
      `SELECT id FROM users WHERE email=?`
    ).bind(email).first();

    return json({
      ok:true,
      message:u
       ? 'درخواست بازیابی ثبت شد.'
       : 'اگر این ایمیل وجود داشته باشد، درخواست بازیابی ثبت می‌شود.'
    });
   }

   /*
    * ورود مدیر
    *
    * رمز پیش‌فرض:
    * Admin@123456
    *
    * بعداً حتماً تغییر داده شود.
    */
   if(url.pathname==='/api/admin/login'){

    const password=String(body.password||'');

    const ADMIN_PASSWORD=env.ADMIN_PASSWORD||'Admin@123456';

    if(password!==ADMIN_PASSWORD)
      return json({
       error:'رمز مدیریت اشتباه است.'
      },401);

    const t='ADMIN-'+crypto.randomUUID();

    await env.DB.prepare(
      `INSERT INTO admin_sessions
       (token,expires_at)
       VALUES(?,?)`
    ).bind(
      t,
      Date.now()+86400000
    ).run();

    return json({
      ok:true,
      token:t
    });
   }

   /*
    * کاربران مدیر
    */
   if(url.pathname==='/api/admin/users'){

    const a=await env.DB.prepare(
      `SELECT token FROM admin_sessions
       WHERE token=? AND expires_at>?`
    ).bind(
      getBearer(request),
      Date.now()
    ).first();

    if(!a)
      return json({error:'دسترسی مدیر لازم است.'},401);

    const rows=await env.DB.prepare(
      `SELECT id,name,email,balance,created_at
       FROM users
       ORDER BY created_at DESC`
    ).all();

    return json({
      ok:true,
      users:rows.results||[]
    });
   }

   /*
    * برداشت‌های مدیر
    */
   if(url.pathname==='/api/admin/withdrawals'){

    const a=await env.DB.prepare(
      `SELECT token FROM admin_sessions
       WHERE token=? AND expires_at>?`
    ).bind(
      getBearer(request),
      Date.now()
    ).first();

    if(!a)
      return json({error:'دسترسی مدیر لازم است.'},401);

    const rows=await env.DB.prepare(
      `SELECT w.*,u.email
       FROM withdrawals w
       JOIN users u ON u.id=w.user_id
       ORDER BY w.created_at DESC`
    ).all();

    return json({
      ok:true,
      items:rows.results||[]
    });
   }

   return json({error:'مسیر پیدا نشد.'},404);

  }catch(e){

   return json({
    ok:false,
    error:'خطای داخلی سرور',
    detail:e.message
   },500);
  }
 }
};
