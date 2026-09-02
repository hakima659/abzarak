
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
 color:#172033
}
.container{
 max-width:900px;
 margin:auto;
 padding:20px
}
.card{
 background:white;
 border-radius:18px;
 padding:22px;
 margin:15px 0;
 box-shadow:0 5px 25px #00000012
}
h1,h2{margin-top:0}
input,select,button{
 width:100%;
 padding:13px;
 margin:7px 0;
 border-radius:10px;
 border:1px solid #d8dee8;
 font-size:15px
}
button{
 background:#2563eb;
 color:white;
 border:0;
 cursor:pointer
}
button:hover{opacity:.9}
.secondary{background:#64748b}
.danger{background:#dc2626}
.success{background:#16a34a}
.hidden{display:none}
.nav{
 display:grid;
 grid-template-columns:repeat(2,1fr);
 gap:10px
}
.nav button{background:#0f172a}
.msg{
 padding:12px;
 border-radius:10px;
 background:#eef2ff;
 margin-top:10px
}
.error{
 background:#fee2e2;
 color:#991b1b
}
.ok{
 background:#dcfce7;
 color:#166534
}
.balance{
 font-size:28px;
 font-weight:bold;
 text-align:center;
 padding:20px;
 background:#eff6ff;
 border-radius:15px
}
.small{
 color:#64748b;
 font-size:13px
}
.plan{
 border:1px solid #dbe3ef;
 border-radius:15px;
 padding:15px;
 margin:10px 0;
 background:#fafcff
}
.plan h3{
 margin:0 0 8px
}
.plan button{
 margin-top:8px
}
table{
 width:100%;
 border-collapse:collapse;
 margin-top:10px
}
td,th{
 border-bottom:1px solid #e5e7eb;
 padding:10px;
 text-align:right
}
</style>
</head>

<body>

<div class="container">

<div class="card" id="auth">

<h1>🤖 دستیار هوش مصنوعی</h1>

<p>
دستیار هوشمند، حساب کاربری، درآمد، پرداخت و برداشت
</p>

<div class="nav">
<button onclick="show('loginBox')">ورود</button>
<button onclick="show('registerBox')">ثبت‌نام</button>
<button onclick="show('forgotBox')">بازیابی رمز</button>
<button onclick="show('adminBox')">🛠️ پنل مدیریت</button>
</div>

<div id="loginBox">

<h2>ورود به حساب</h2>

<input id="loginEmail" placeholder="ایمیل">

<input
 id="loginPassword"
 type="password"
 placeholder="رمز عبور">

<button onclick="login()">ورود</button>

</div>

<div id="registerBox" class="hidden">

<h2>ثبت‌نام</h2>

<input
 id="regName"
 placeholder="نام و نام خانوادگی">

<input
 id="regEmail"
 placeholder="ایمیل">

<input
 id="regPassword"
 type="password"
 placeholder="رمز عبور">

<button onclick="register()">ثبت‌نام</button>

</div>

<div id="forgotBox" class="hidden">

<h2>بازیابی رمز</h2>

<input
 id="forgotEmail"
 placeholder="ایمیل">

<button onclick="forgot()">بازیابی</button>

<p class="small">
برای امنیت، بازیابی واقعی رمز باید به ایمیل کاربر متصل شود.
</p>

</div>

<div id="adminBox" class="hidden">

<h2>🔐 ورود مدیر</h2>

<input
 id="adminPassword"
 type="password"
 placeholder="رمز مدیریت">

<button onclick="adminLogin()">ورود مدیریت</button>

</div>

<div id="message"></div>

</div>


<!-- پنل کاربر -->

<div id="userPanel" class="hidden">

<div class="card">

<h2>👤 حساب کاربری</h2>

<div id="userInfo"></div>

<button class="secondary" onclick="logout()">
خروج
</button>

</div>


<div class="card">

<h2>💰 موجودی حساب</h2>

<div class="balance" id="balance">
0 تومان
</div>

<p class="small">
حداقل برداشت: ۱۰٬۰۰۰ تومان
</p>

</div>


<div class="card">

<h2>💳 پرداخت و اشتراک</h2>

<div id="plans"></div>

</div>


<div class="card">

<h2>💸 درخواست برداشت</h2>

<input
 id="withdrawAmount"
 type="number"
 placeholder="مبلغ برداشت">

<input
 id="withdrawCard"
 placeholder="شماره کارت ۱۶ رقمی">

<button onclick="withdraw()">
درخواست برداشت
</button>

</div>


<div class="card">

<h2>📊 تراکنش‌ها</h2>

<div id="transactions">
در حال بارگذاری...
</div>

</div>

</div>


<!-- پنل مدیریت -->

<div id="adminPanel" class="hidden">

<div class="card">

<h2>🛠️ پنل مدیریت</h2>

<p>
مدیریت کاربران، پرداخت‌ها، برداشت‌ها، موجودی و پلن‌ها
</p>

<button class="danger" onclick="adminLogout()">
خروج مدیر
</button>

</div>


<div class="card">

<h2>💳 پلن‌های اشتراک</h2>

<div id="adminPlans"></div>

</div>


<div class="card">

<h2>👥 کاربران</h2>

<div id="users">
در حال بارگذاری...
</div>

</div>


<div class="card">

<h2>💸 برداشت‌ها</h2>

<div id="withdrawals">
در حال بارگذاری...
</div>

</div>

</div>

</div>


<script>

const PLANS = [
 {amount:400000,title:'پلن پایه'},
 {amount:700000,title:'پلن استاندارد'},
 {amount:1000000,title:'پلن حرفه‌ای'},
 {amount:1500000,title:'پلن ویژه'},
 {amount:2000000,title:'پلن VIP'}
];


function show(id){

 document.querySelectorAll(
  '#auth > div'
 ).forEach(x=>{

  if([
   'loginBox',
   'registerBox',
   'forgotBox',
   'adminBox'
  ].includes(x.id)){

   x.classList.add('hidden');

  }

 });

 document.getElementById(id).classList.remove('hidden');

}


function msg(text,type=''){

 const box=document.getElementById('message');

 box.innerHTML=
 '<div class="msg '+type+'">'+
 escapeHtml(text)+
 '</div>';

}


function setLoading(id,text){

 const el=document.getElementById(id);

 if(el)
  el.innerHTML=
   '<div class="msg">'+
   escapeHtml(text)+
   '</div>';

}


async function api(url,data={}){

 try{

  const r=await fetch(url,{
   method:'POST',
   headers:{
    'Content-Type':'application/json'
   },
   body:JSON.stringify(data)
  });

  const text=await r.text();

  let j={};

  try{
   j=JSON.parse(text);
  }catch{
   throw new Error(
    'پاسخ نامعتبر از سرور دریافت شد.'
   );
  }

  if(!r.ok)
   throw new Error(
    j.error || 'خطای سرور'
   );

  return j;

 }catch(e){

  msg(e.message,'error');

  throw e;

 }

}


/* ثبت نام */

async function register(){

 const j=await api('/api/register',{
  name:document.getElementById('regName').value,
  email:document.getElementById('regEmail').value,
  password:document.getElementById('regPassword').value
 });

 msg(
  j.message || 'ثبت‌نام انجام شد.',
  'ok'
 );

 show('loginBox');

}


/* ورود */

async function login(){

 const j=await api('/api/login',{
  email:document.getElementById('loginEmail').value,
  password:document.getElementById('loginPassword').value
 });

 localStorage.setItem(
  'token',
  j.token
 );

 document.getElementById(
  'auth'
 ).classList.add('hidden');

 document.getElementById(
  'userPanel'
 ).classList.remove('hidden');

 loadMe();

}


/* اطلاعات کاربر */

async function loadMe(){

 try{

  const r=await fetch('/api/me',{
   headers:{
    Authorization:
    'Bearer '+
    localStorage.getItem('token')
   }
  });

  const j=await r.json();

  if(!r.ok){
   logout();
   return;
  }

  document.getElementById(
   'userInfo'
  ).innerHTML=
   'نام: '+
   escapeHtml(j.user.name)+
   '<br>ایمیل: '+
   escapeHtml(j.user.email);

  document.getElementById(
   'balance'
  ).innerText=
   Number(j.user.balance)
   .toLocaleString('fa-IR')+
   ' تومان';

  loadPlans();
  loadTransactions();

 }catch(e){

  document.getElementById(
   'transactions'
  ).innerHTML=
   '<div class="msg error">'+
   'خطا در دریافت اطلاعات کاربر: '+
   escapeHtml(e.message)+
   '</div>';

 }

}


/* نمایش پلن‌ها */

function loadPlans(){

 const box=document.getElementById('plans');

 box.innerHTML=PLANS.map(p=>`

  <div class="plan">

   <h3>
   💳 ${escapeHtml(p.title)}
   </h3>

   <div>
   مبلغ:
   <b>
   ${Number(p.amount).toLocaleString('fa-IR')}
   تومان
   </b>
   </div>

   <button
    onclick="pay(${p.amount})">
    خرید ${Number(p.amount).toLocaleString('fa-IR')} تومان
   </button>

  </div>

 `).join('');

}


/* تراکنش‌ها */

async function loadTransactions(){

 const box=
  document.getElementById('transactions');

 setLoading(
  'transactions',
  'در حال دریافت تراکنش‌ها...'
 );

 try{

  const r=await fetch(
   '/api/transactions',
   {
    headers:{
     Authorization:
     'Bearer '+
     localStorage.getItem('token')
    }
   }
  );

  const j=await r.json();

  if(!r.ok)
   throw new Error(
    j.error || 'خطا در تراکنش‌ها'
   );

  if(!j.items || !j.items.length){

   box.innerHTML=
    '<div class="msg">تراکنشی وجود ندارد.</div>';

   return;
  }

  box.innerHTML=
   j.items.map(x=>

    '<div class="msg">'+
    escapeHtml(x.type)+
    ' — '+
    Number(x.amount)
    .toLocaleString('fa-IR')+
    ' تومان — '+
    escapeHtml(x.status || '')+
    '</div>'

   ).join('');

 }catch(e){

  box.innerHTML=
   '<div class="msg error">'+
   'خطا: '+
   escapeHtml(e.message)+
   '</div>';

 }

}


/* پرداخت */

async function pay(amount){

 try{

  const j=await api(
   '/api/payment',
   {
    token:
    localStorage.getItem('token'),
    amount
   }
  );

  msg(
   j.message ||
   'درخواست پرداخت ثبت شد.',
   'ok'
  );

  loadTransactions();

 }catch(e){}

}


/* برداشت */

async function withdraw(){

 const amount=
  Number(
   document.getElementById(
    'withdrawAmount'
   ).value
  );

 const card=
  document.getElementById(
   'withdrawCard'
  ).value;

 try{

  const j=await api(
   '/api/withdraw',
   {
    token:
    localStorage.getItem('token'),
    amount,
    card
   }
  );

  msg(
   j.message ||
   'درخواست برداشت ثبت شد.',
   'ok'
  );

  loadMe();

 }catch(e){}

}


/* فراموشی رمز */

async function forgot(){

 try{

  const j=await api(
   '/api/forgot',
   {
    email:
    document.getElementById(
     'forgotEmail'
    ).value
   }
  );

  msg(j.message || 'درخواست ثبت شد.');

 }catch(e){}

}


/* ورود مدیر */

async function adminLogin(){

 try{

  const password=
   document.getElementById(
    'adminPassword'
   ).value;

  const j=await api(
   '/api/admin/login',
   {password}
  );

  localStorage.setItem(
   'adminToken',
   j.token
  );

  document.getElementById(
   'auth'
  ).classList.add('hidden');

  document.getElementById(
   'adminPanel'
  ).classList.remove('hidden');

  loadAdmin();

 }catch(e){}

}


/* پنل مدیریت */

async function loadAdmin(){

 loadAdminPlans();

 const token=
  localStorage.getItem(
   'adminToken'
  );

 const usersBox=
  document.getElementById('users');

 const withdrawalsBox=
  document.getElementById(
   'withdrawals'
  );

 setLoading(
  'users',
  'در حال دریافت کاربران...'
 );

 setLoading(
  'withdrawals',
  'در حال دریافت برداشت‌ها...'
 );

 try{

  const r=await fetch(
   '/api/admin/users',
   {
    headers:{
     Authorization:
     'Bearer '+token
    }
   }
  );

  const j=await r.json();

  if(!r.ok)
   throw new Error(
    j.error ||
    'دسترسی غیرمجاز'
   );

  if(!j.users || !j.users.length){

   usersBox.innerHTML=
    '<div class="msg">کاربری وجود ندارد.</div>';

  }else{

   usersBox.innerHTML=
    '<table>'+
    '<tr>'+
    '<th>نام</th>'+
    '<th>ایمیل</th>'+
    '<th>موجودی</th>'+
    '</tr>'+
    j.users.map(u=>
     '<tr>'+
     '<td>'+
     escapeHtml(u.name)+
     '</td>'+
     '<td>'+
     escapeHtml(u.email)+
     '</td>'+
     '<td>'+
     Number(u.balance)
     .toLocaleString('fa-IR')+
     ' تومان</td>'+
     '</tr>'
    ).join('')+
    '</table>';

  }

 }catch(e){

  usersBox.innerHTML=
   '<div class="msg error">'+
   'خطا در کاربران: '+
   escapeHtml(e.message)+
   '</div>';

 }


 try{

  const w=await fetch(
   '/api/admin/withdrawals',
   {
    headers:{
     Authorization:
     'Bearer '+token
    }
   }
  );

  const wj=await w.json();

  if(!w.ok)
   throw new Error(
    wj.error ||
    'خطا در برداشت‌ها'
   );

  if(!wj.items || !wj.items.length){

   withdrawalsBox.innerHTML=
    '<div class="msg">درخواستی وجود ندارد.</div>';

  }else{

   withdrawalsBox.innerHTML=
    wj.items.map(x=>
     '<div class="msg">'+
     escapeHtml(x.email)+
     ' — '+
     Number(x.amount)
     .toLocaleString('fa-IR')+
     ' تومان — '+
     escapeHtml(x.status)+
     '</div>'
    ).join('');

  }

 }catch(e){

  withdrawalsBox.innerHTML=
   '<div class="msg error">'+
   'خطا در برداشت‌ها: '+
   escapeHtml(e.message)+
   '</div>';

 }

}


/* پلن‌های مدیر */

function loadAdminPlans(){

 const box=
  document.getElementById(
   'adminPlans'
  );

 box.innerHTML=
  PLANS.map(p=>

   '<div class="plan">'+
   '<h3>'+
   escapeHtml(p.title)+
   '</h3>'+
   '<b>'+
   Number(p.amount)
   .toLocaleString('fa-IR')+
   ' تومان</b>'+
   '</div>'

  ).join('');

}


/* خروج کاربر */

function logout(){

 localStorage.removeItem(
  'token'
 );

 location.reload();

}


/* خروج مدیر */

function adminLogout(){

 localStorage.removeItem(
  'adminToken'
 );

 location.reload();

}


/* جلوگیری از HTML خطرناک */

function escapeHtml(s){

 return String(s ?? '')
  .replaceAll('&','&amp;')
  .replaceAll('<','&lt;')
  .replaceAll('>','&gt;')
  .replaceAll('"','&quot;')
  .replaceAll(
   "'",
   '&#039;'
  );

}

</script>

</body>
</html>`;


/* پاسخ JSON */

function json(data,status=200){

 return new Response(
  JSON.stringify(data),
  {
   status,
   headers:{
    'Content-Type':
    'application/json;charset=UTF-8'
   }
  }
 );

}


/* ساخت توکن */

function token(){

 return crypto.randomUUID();

}


/* هش رمز عبور */

async function hashPassword(password){

 const data=
  new TextEncoder().encode(password);

 const hash=
  await crypto.subtle.digest(
   'SHA-256',
   data
  );

 return [
  ...new Uint8Array(hash)
 ]
 .map(
  x=>x.toString(16).padStart(2,'0')
 )
 .join('');

}


/* پیدا کردن کاربر */

async function getUserByToken(env,t){

 if(!t)
  return null;

 const row=
  await env.DB.prepare(
   `SELECT u.*
    FROM sessions s
    JOIN users u
    ON u.id=s.user_id
    WHERE s.token=?
    AND s.expires_at>?`
  )
  .bind(
   t,
   Date.now()
  )
  .first();

 return row;

}


/* دریافت Bearer */

function getBearer(request){

 const h=
  request.headers.get(
   'Authorization'
  ) || '';

 return h.startsWith('Bearer ')
  ? h.slice(7)
  : '';

}


/* بررسی مدیر */

async function isAdmin(env,request){

 const t=getBearer(request);

 if(!t)
  return false;

 const a=
  await env.DB.prepare(
   `SELECT token
    FROM admin_sessions
    WHERE token=?
    AND expires_at>?`
  )
  .bind(
   t,
   Date.now()
  )
  .first();

 return !!a;

}


export default {

 async fetch(request,env){

  try{

   /* بررسی D1 */

   if(!env.DB){

    return json(
     {
      ok:false,
      error:
      'اتصال D1 با نام DB وجود ندارد.'
     },
     500
    );

   }


   const url=
    new URL(request.url);


   /* صفحه اصلی */

   if(
    request.method==='GET' &&
    url.pathname==='/'
   ){

    return new Response(
     HTML,
     {
      headers:{
       'Content-Type':
       'text/html;charset=UTF-8'
      }
     }
    );

   }


   /* API فقط POST */

   if(request.method!=='POST'){

    if(
     url.pathname.startsWith('/api/')
    ){

     return json(
      {
       ok:false,
       error:
       'Method Not Allowed'
      },
      405
     );

    }

    return new Response(
     'Not Found',
     {status:404}
    );

   }


   const body=
    await request.json()
    .catch(()=>({}));


   /* =========================
      ثبت نام
   ========================= */

   if(
    url.pathname==='/api/register'
   ){

    const name=
     String(body.name||'').trim();

    const email=
     String(body.email||'')
     .trim()
     .toLowerCase();

    const password=
     String(body.password||'');


    if(
     !name ||
     !email ||
     !password
    ){

     return json(
      {
       error:
       'همه فیلدها را کامل کنید.'
      },
      400
     );

    }


    if(password.length<6){

     return json(
      {
       error:
       'رمز عبور باید حداقل ۶ کاراکتر باشد.'
      },
      400
     );

    }


    const old=
     await env.DB.prepare(
      `SELECT id
       FROM users
       WHERE email=?`
     )
     .bind(email)
     .first();


    if(old){

     return json(
      {
       error:
       'این ایمیل قبلاً ثبت شده است.'
      },
      409
     );

    }


    const id=
     crypto.randomUUID();

    const hash=
     await hashPassword(password);


    await env.DB.prepare(
     `INSERT INTO users
      (id,name,email,password,balance,created_at)
      VALUES(?,?,?,?,?,?)`
    )
    .bind(
     id,
     name,
     email,
     hash,
     0,
     Date.now()
    )
    .run();


    return json(
     {
      ok:true,
      message:
      'ثبت‌نام با موفقیت انجام شد.'
     }
    );

   }


   /* =========================
      ورود
   ========================= */

   if(
    url.pathname==='/api/login'
   ){

    const email=
     String(body.email||'')
     .trim()
     .toLowerCase();

    const password=
     String(body.password||'');


    const user=
     await env.DB.prepare(
      `SELECT *
       FROM users
       WHERE email=?`
     )
     .bind(email)
     .first();


    if(!user){

     return json(
      {
       error:
       'ایمیل یا رمز عبور اشتباه است.'
      },
      401
     );

    }


    const hash=
     await hashPassword(password);


    if(hash!==user.password){

     return json(
      {
       error:
       'ایمیل یا رمز عبور اشتباه است.'
      },
      401
     );

    }


    const t=token();


    await env.DB.prepare(
     `INSERT INTO sessions
      (token,user_id,expires_at)
      VALUES(?,?,?)`
    )
    .bind(
     t,
     user.id,
     Date.now()+2592000000
    )
    .run();


    return json(
     {
      ok:true,
      token:t
     }
    );

   }


   /* =========================
      اطلاعات کاربر
   ========================= */

   if(
    url.pathname==='/api/me'
   ){

    const u=
     await getUserByToken(
      env,
      getBearer(request)
     );


    if(!u){

     return json(
      {
       error:
       'نشست شما منقضی شده است.'
      },
      401
     );

    }


    return json(
     {
      ok:true,
      user:{
       id:u.id,
       name:u.name,
       email:u.email,
       balance:
       Number(u.balance||0)
      }
     }
    );

   }


   /* =========================
      تراکنش‌ها
   ========================= */

   if(
    url.pathname==='/api/transactions'
   ){

    const u=
     await getUserByToken(
      env,
      getBearer(request)
     );


    if(!u){

     return json(
      {
       error:
       'دسترسی غیرمجاز'
      },
      401
     );

    }


    const rows=
     await env.DB.prepare(
      `SELECT *
       FROM transactions
       WHERE user_id=?
       ORDER BY created_at DESC`
     )
     .bind(u.id)
     .all();


    return json(
     {
      ok:true,
      items:
      rows.results || []
     }
    );

   }


   /* =========================
      پرداخت
   ========================= */

   if(
    url.pathname==='/api/payment'
   ){

    const u=
     await getUserByToken(
      env,
      String(body.token||'')
     );


    if(!u){

     return json(
      {
       error:
       'لطفاً دوباره وارد شوید.'
      },
      401
     );

    }


    const amount=
     Number(body.amount);


    const validPlans=[
     400000,
     700000,
     1000000,
     1500000,
     2000000
    ];


    if(
     !validPlans.includes(amount)
    ){

     return json(
      {
       error:
       'پلن نامعتبر است.'
      },
      400
     );

    }


    await env.DB.prepare(
     `INSERT INTO transactions
      (id,user_id,type,amount,status,created_at)
      VALUES(?,?,?,?,?,?)`
    )
    .bind(
     crypto.randomUUID(),
     u.id,
     'payment',
     amount,
     'pending',
     Date.now()
    )
    .run();


    return json(
     {
      ok:true,
      message:
      'درخواست پرداخت ثبت شد. اتصال درگاه واقعی در مرحله بعد انجام می‌شود.'
     }
    );

   }


   /* =========================
      برداشت
   ========================= */

   if(
    url.pathname==='/api/withdraw'
   ){

    const u=
     await getUserByToken(
      env,
      String(body.token||'')
     );


    if(!u){

     return json(
      {
       error:
       'لطفاً دوباره وارد شوید.'
      },
      401
     );

    }


    const amount=
     Number(body.amount);

    const card=
     String(body.card||'')
     .trim()
     .replace(/\s/g,'');


    if(
     !Number.isFinite(amount) ||
     amount<10000
    ){

     return json(
      {
       error:
       'حداقل مبلغ برداشت ۱۰٬۰۰۰ تومان است.'
      },
      400
     );

    }


    if(
     amount>Number(u.balance||0)
    ){

     return json(
      {
       error:
       'موجودی کافی نیست.'
      },
      400
     );

    }


    if(
     !/^[0-9]{16}$/.test(card)
    ){

     return json(
      {
       error:
       'شماره کارت باید ۱۶ رقم باشد.'
      },
      400
     );

    }


    const requestId=
     crypto.randomUUID();


    await env.DB.prepare(
     `INSERT INTO withdrawals
      (id,user_id,amount,card,status,created_at)
      VALUES(?,?,?,?,?,?)`
    )
    .bind(
     requestId,
     u.id,
     amount,
     card,
     'pending',
     Date.now()
    )
    .run();


    await env.DB.prepare(
     `UPDATE users
      SET balance=balance-?
      WHERE id=?`
    )
    .bind(
     amount,
     u.id
    )
    .run();


    return json(
     {
      ok:true,
      message:
      'درخواست برداشت ثبت شد و در انتظار بررسی مدیر است.'
     }
    );

   }


   /* =========================
      بازیابی رمز
   ========================= */

   if(
    url.pathname==='/api/forgot'
   ){

    const email=
     String(body.email||'')
     .trim()
     .toLowerCase();


    const u=
     await env.DB.prepare(
      `SELECT id
       FROM users
       WHERE email=?`
     )
     .bind(email)
     .first();


    return json(
     {
      ok:true,
      message:
       u
       ? 'درخواست بازیابی ثبت شد.'
       : 'اگر این ایمیل وجود داشته باشد، درخواست بازیابی ثبت می‌شود.'
     }
    );

   }


   /* =========================
      ورود مدیر
   ========================= */

   if(
    url.pathname==='/api/admin/login'
   ){

    const password=
     String(body.password||'');


    const ADMIN_PASSWORD=
     env.ADMIN_PASSWORD ||
     'Admin@123456';


    if(
     password!==ADMIN_PASSWORD
    ){

     return json(
      {
       error:
       'رمز مدیریت اشتباه است.'
      },
      401
     );

    }


    const t=
     'ADMIN-'+
     crypto.randomUUID();


    await env.DB.prepare(
     `INSERT INTO admin_sessions
      (token,expires_at)
      VALUES(?,?)`
    )
    .bind(
     t,
     Date.now()+86400000
    )
    .run();


    return json(
     {
      ok:true,
      token:t
     }
    );

   }


   /* =========================
      کاربران مدیر
   ========================= */

   if(
    url.pathname==='/api/admin/users'
   ){

    if(
     !(await isAdmin(env,request))
    ){

     return json(
      {
       error:
       'دسترسی مدیر لازم است.'
      },
      401
     );

    }


    const rows=
     await env.DB.prepare(
      `SELECT
       id,
       name,
       email,
       balance,
       created_at
       FROM users
       ORDER BY created_at DESC`
     )
     .all();


    return json(
     {
      ok:true,
      users:
      rows.results || []
     }
    );

   }


   /* =========================
      برداشت‌های مدیر
   ========================= */

   if(
    url.pathname==='/api/admin/withdrawals'
   ){

    if(
     !(await isAdmin(env,request))
    ){

     return json(
      {
       error:
       'دسترسی مدیر لازم است.'
      },
      401
     );

    }


    const rows=
     await env.DB.prepare(
      `SELECT
       w.*,
       u.email
       FROM withdrawals w
       JOIN users u
       ON u.id=w.user_id
       ORDER BY w.created_at DESC`
    )
    .all();


    return json(
     {
      ok:true,
      items:
      rows.results || []
     }
    );

   }


   return json(
    {
     error:
     'مسیر پیدا نشد.'
    },
    404
   );


  }catch(e){

   return json(
    {
     ok:false,
     error:
     'خطای داخلی سرور',
     detail:
     e.message
    },
    500
   );

  }

 }

};
