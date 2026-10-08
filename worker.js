// =============================================================
// ABZARAK AI — PRODUCTION WORKER
// Homepage + User Registration/Login + D1 + Cloudflare AI
// + ZarinPal + Resend
// SEO Landing Pages + White Professional SVG Images + FAQ
// Breadcrumb/WebPage structured data + Sitemap + Robots
//
// AUTH MODE:
// - Public signup ENABLED
// - Existing users can still login
// - Password recovery preserved
// - Subscription / payment logic preserved
// - Admin login preserved
//
// FIXES:
// - Fixed SEO image path return bug
// - Removed hardcoded JWT fallback secret
// - Added password-reset attempt protection
// - Added password-recovery cooldown
// - Added atomic free-usage reservation
// - Added subscription payment_id idempotency
// - Duplicate ZarinPal callback no longer extends subscription twice
// - Reduced internal error leakage to clients
// =============================================================

const BASE_URL = "https://abzarakai.ir";
const FREE_DAILY_LIMIT = 10;

// =============================================================
// HOMEPAGE — visual layout preserved
// =============================================================
function renderHomepage() {
  return `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="enamad" content="17726638">

<title>ابزارک AI — دستیار هوشمند فارسی</title>

<style>
:root{
 --bg:#fff;
 --bg-soft:#f7f7f8;
 --surface:#fff;
 --surface-soft:#f7f7f8;
 --card:#fff;
 --border:#e5e7eb;
 --border-strong:#d1d5db;
 --text:#111827;
 --muted:#6b7280;
 --accent:#111827;
 --accent-2:#374151;
 --success:#16a34a;
 --danger:#dc2626;
 --radius:16px
}

*{box-sizing:border-box}

html{scroll-behavior:smooth}

body{
 margin:0;
 font-family:Tahoma,"Vazirmatn",Arial,sans-serif;
 background:#fff;
 color:var(--text);
 min-height:100vh;
 direction:rtl
}

button,input{
 font-family:inherit
}

a{
 color:inherit
}

.wrap{
 max-width:1180px;
 margin:0 auto;
 padding:0 24px
}

header{
 height:70px;
 display:flex;
 align-items:center;
 justify-content:space-between;
 gap:12px;
 border-bottom:1px solid #f0f0f0
}

.logo{
 display:flex;
 align-items:center;
 gap:10px;
 font-weight:800;
 font-size:18px
}

.logo .dot{
 width:34px;
 height:34px;
 border-radius:10px;
 background:#111827;
 color:#fff;
 display:flex;
 align-items:center;
 justify-content:center;
 font-size:17px
}

nav{
 display:flex;
 gap:6px;
 flex-wrap:wrap
}

.btn{
 border:1px solid #d1d5db;
 background:#fff;
 color:#111827;
 padding:10px 17px;
 border-radius:10px;
 font-size:14px;
 cursor:pointer;
 font-family:inherit;
 transition:.16s;
 box-shadow:0 1px 2px rgba(0,0,0,.03)
}

.btn:hover{
 background:#f7f7f8;
 border-color:#9ca3af
}

.btn.primary{
 background:#111827;
 border-color:#111827;
 color:#fff;
 font-weight:700
}

.btn.primary:hover{
 background:#1f2937
}

.btn.block{
 width:100%
}

.btn.ghost{
 background:transparent;
 border-color:transparent;
 box-shadow:none
}

.hero{
 text-align:center;
 padding:62px 0 30px
}

.hero h1{
 font-size:40px;
 margin:0 0 14px;
 line-height:1.5;
 font-weight:800;
 letter-spacing:-.5px
}

.hero h1 span{
 color:#111827
}

.hero p{
 color:#6b7280;
 font-size:15.5px;
 max-width:650px;
 margin:0 auto 25px;
 line-height:2
}

.hero-actions{
 display:flex;
 gap:10px;
 justify-content:center;
 flex-wrap:wrap
}

.card{
 background:#fff;
 border:1px solid #e5e7eb;
 border-radius:16px;
 padding:22px
}

.chat-section{
 margin:18px auto 70px;
 max-width:920px;
 padding:0;
 background:#fff;
 border:0
}

.chat-box{
 display:flex;
 flex-direction:column;
 height:690px;
 background:#fff;
 color:#111827;
 border:1px solid #e5e7eb;
 border-radius:18px;
 padding:0;
 overflow:hidden;
 box-shadow:0 10px 40px rgba(0,0,0,.06)
}

.chat-log{
 flex:1;
 overflow-y:auto;
 display:flex;
 flex-direction:column;
 gap:20px;
 padding:30px 26px 24px;
 background:#fff;
 color:#111827;
 scroll-behavior:smooth
}

.msg{
 max-width:82%;
 padding:13px 16px;
 border-radius:15px;
 line-height:1.95;
 font-size:15px;
 white-space:pre-wrap;
 word-break:break-word
}

.msg.user{
 align-self:flex-start;
 background:#f4f4f5;
 color:#111827;
 border:1px solid #ececef;
 border-bottom-left-radius:5px
}

.msg.ai{
 align-self:flex-end;
 background:#fff;
 color:#111827;
 border:0;
 padding-right:2px;
 padding-left:2px;
 max-width:88%
}

.msg.system{
 align-self:center;
 color:#6b7280;
 font-size:13px;
 background:#f9fafb;
 border:1px solid #f0f0f0;
 padding:9px 13px;
 max-width:92%;
 text-align:center
}

.chat-input-row{
 display:flex;
 gap:9px;
 align-items:center;
 margin:0 16px 10px;
 padding:7px 8px;
 border:1px solid #d1d5db;
 border-radius:14px;
 background:#fff;
 box-shadow:0 2px 10px rgba(0,0,0,.04)
}

.chat-input-row input{
 flex:1;
 background:transparent;
 border:0;
 color:#111827;
 border-radius:9px;
 padding:13px 10px;
 font-family:inherit;
 font-size:15px;
 min-height:48px;
 outline:none
}

.chat-input-row input::placeholder{
 color:#9ca3af
}

.chat-input-row input:focus{
 outline:none
}

.chat-input-row .btn{
 min-height:44px
}

.plans-section{
 margin:0 0 70px
}

.section-title{
 text-align:center;
 margin-bottom:28px
}

.section-title h2{
 font-size:26px;
 margin:0 0 8px
}

.section-title p{
 color:#6b7280;
 margin:0
}

.plans-grid{
 display:grid;
 grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
 gap:16px
}

.plan-card{
 display:flex;
 flex-direction:column;
 gap:14px
}

.plan-card h3{
 margin:0;
 font-size:18px
}

.plan-price{
 font-size:24px;
 font-weight:900
}

.plan-price small{
 font-size:13px;
 color:#6b7280;
 font-weight:400
}

.plan-card ul{
 list-style:none;
 padding:0;
 margin:0;
 display:flex;
 flex-direction:column;
 gap:8px
}

.plan-card li{
 color:#6b7280;
 font-size:13.5px;
 display:flex;
 gap:8px;
 align-items:flex-start
}

.plan-card li::before{
 content:"✓";
 color:#16a34a;
 font-weight:900
}

.plan-card.featured{
 border-color:#111827;
 box-shadow:0 0 0 1px #111827
}

.overlay{
 position:fixed;
 inset:0;
 background:rgba(17,24,39,.45);
 backdrop-filter:blur(5px);
 display:none;
 align-items:center;
 justify-content:center;
 padding:16px;
 z-index:50
}

.overlay.open{
 display:flex
}

.modal{
 width:100%;
 max-width:390px;
 background:#fff;
 border:1px solid #e5e7eb;
 border-radius:16px;
 padding:25px;
 position:relative;
 box-shadow:0 20px 60px rgba(0,0,0,.16);
 max-height:92vh;
 overflow-y:auto
}

.modal h3{
 margin:0 0 18px;
 font-size:19px
}

.field{
 margin-bottom:12px
}

.field label{
 display:block;
 font-size:13px;
 color:#6b7280;
 margin-bottom:6px
}

.field input{
 width:100%;
 background:#fff;
 border:1px solid #d1d5db;
 color:#111827;
 border-radius:10px;
 padding:12px 13px;
 font-family:inherit;
 font-size:14px
}

.field input:focus{
 outline:none;
 border-color:#111827;
 box-shadow:0 0 0 3px rgba(17,24,39,.08)
}

.modal-msg{
 font-size:13px;
 margin:10px 0;
 min-height:18px
}

.modal-msg.err{
 color:#dc2626
}

.modal-msg.ok{
 color:#16a34a
}

.switch-line{
 text-align:center;
 margin-top:14px;
 font-size:13px;
 color:#6b7280
}

.switch-line a{
 color:#111827;
 cursor:pointer;
 text-decoration:none;
 font-weight:700
}

.modal-close{
 position:absolute;
 left:16px;
 top:16px;
 background:none;
 border:0;
 color:#9ca3af;
 font-size:18px;
 cursor:pointer
}

#userBadge{
 display:none;
 align-items:center;
 gap:10px;
 font-size:13.5px;
 color:#6b7280
}

#userBadge b{
 color:#111827
}

footer{
 text-align:center;
 color:#9ca3af;
 font-size:12px;
 padding:30px 0 24px;
 border-top:1px solid #f3f4f6
}

@media(max-width:640px){

 .wrap{
   padding:0 14px
 }

 header{
   height:62px
 }

 .hero{
   padding:46px 0 22px
 }

 .hero h1{
   font-size:29px
 }

 .hero p{
   font-size:14px
 }

 .chat-section{
   margin-top:12px
 }

 .chat-box{
   height:calc(100vh - 150px);
   min-height:560px;
   border-radius:15px
 }

 .chat-log{
   padding:20px 13px 22px;
   gap:18px
 }

 .msg{
   max-width:91%;
   font-size:14px
 }

 .msg.ai{
   max-width:94%
 }

 .chat-input-row{
   margin:0 10px 10px;
   padding:6px
 }

 .chat-input-row input{
   font-size:14px;
   padding:12px 8px
 }

 nav .btn{
   padding-left:11px;
   padding-right:11px
 }

 .logo{
   font-size:16px
 }

 .userBadge{
   max-width:70%;
   flex-wrap:wrap
 }
}
</style>
</head>

<body>

<div class="wrap">

<header>

<div class="logo">
<span class="dot">🤖</span>
ابزارک AI
</div>

<nav id="navArea">

<button
 class="btn"
 onclick="openModal('signup')"
>
ثبت‌نام
</button>

<button
 class="btn primary"
 onclick="openModal('login')"
>
ورود
</button>

</nav>

<div id="userBadge">

<span>
خوش آمدی،
<b id="userNameLabel"></b>
</span>

<button
 class="btn"
 onclick="logout()"
>
خروج
</button>

</div>

</header>


<section class="hero">

<h1>
دستیار هوشمند
<span>فارسی</span>
شما
</h1>

<p>
ابزارک، یک دستیار هوش مصنوعی چندزبانه برای گفتگو،
تولید محتوا، ترجمه و ایده‌پردازی است.
همین حالا رایگان امتحان کن.
</p>

<div class="hero-actions">

<button
 class="btn primary"
 onclick="focusChat()"
>
شروع گفتگو
</button>

<button
 class="btn ghost"
 onclick="scrollToPlans()"
>
مشاهده پلن‌ها
</button>

</div>

</section>


<section class="chat-section card">

<div class="chat-box">

<div
 class="chat-log"
 id="chatLog"
>

<div class="msg system">
سلام! من ابزارک هستم. هر سوالی داری بپرس 👋
</div>

</div>


<div class="chat-input-row">

<input
 id="chatInput"
 type="text"
 placeholder="پیامت را بنویس..."
 onkeydown="if(event.key==='Enter') sendMessage()"
>

<button
 class="btn primary"
 onclick="sendMessage()"
>
ارسال
</button>

</div>

</div>

</section>


<section
 class="plans-section"
 id="plansSection"
>

<div class="section-title">

<h2>
پلن‌های اشتراک
</h2>

<p>
متناسب با نیازت یک پلن انتخاب کن
</p>

</div>

<div
 class="plans-grid"
 id="plansGrid"
>

<div
 class="msg system"
 style="align-self:center;"
>
در حال بارگذاری پلن‌ها...
</div>

</div>

</section>


<footer>
🤖 ابزارک AI — ساخته‌شده با هوش مصنوعی
</footer>

</div>


<!-- ========================================================= -->
<!-- LOGIN / SIGNUP / FORGOT PASSWORD MODAL                  -->
<!-- ========================================================= -->

<div
 class="overlay"
 id="authOverlay"
>

<div class="modal">

<button
 class="modal-close"
 onclick="closeModal()"
>
✕
</button>


<!-- LOGIN -->

<div id="loginForm">

<h3>
ورود به حساب
</h3>


<div class="field">

<label>
ایمیل
</label>

<input
 type="email"
 id="loginEmail"
 placeholder="you@example.com"
 autocomplete="email"
>

</div>


<div class="field">

<label>
رمز عبور
</label>

<input
 type="password"
 id="loginPassword"
 placeholder="••••••••"
 autocomplete="current-password"
 onkeydown="if(event.key==='Enter') doLogin()"
>

</div>


<div
 class="modal-msg"
 id="loginMsg"
></div>


<button
 class="btn primary block"
 onclick="doLogin()"
>
ورود
</button>


<div class="switch-line">

<a onclick="openModal('signup')">
حساب نداری؟ ثبت‌نام کن
</a>

</div>


<div class="switch-line">

<a onclick="openModal('forgot')">
رمز عبور را فراموش کرده‌ام
</a>

</div>

</div>


<!-- SIGNUP -->

<div
 id="signupForm"
 style="display:none;"
>

<h3>
ساخت حساب جدید
</h3>


<div class="field">

<label>
نام
</label>

<input
 type="text"
 id="signupName"
 placeholder="نام شما"
 autocomplete="name"
>

</div>


<div class="field">

<label>
ایمیل
</label>

<input
 type="email"
 id="signupEmail"
 placeholder="you@example.com"
 autocomplete="email"
>

</div>


<div class="field">

<label>
رمز عبور
</label>

<input
 type="password"
 id="signupPassword"
 placeholder="حداقل ۶ کاراکتر"
 autocomplete="new-password"
 onkeydown="if(event.key==='Enter') doSignup()"
>

</div>


<div
 class="modal-msg"
 id="signupMsg"
></div>


<button
 class="btn primary block"
 onclick="doSignup()"
>
ثبت‌نام و ورود
</button>


<div class="switch-line">

<a onclick="openModal('login')">
قبلاً حساب ساخته‌ام؛ ورود
</a>

</div>

</div>


<!-- FORGOT -->

<div
 id="forgotForm"
 style="display:none;"
>

<h3>
بازیابی رمز عبور
</h3>


<div class="field">

<label>
ایمیل
</label>

<input
 type="email"
 id="forgotEmail"
 placeholder="you@example.com"
 autocomplete="email"
>

</div>


<div
 class="modal-msg"
 id="forgotMsg"
></div>


<button
 class="btn primary block"
 onclick="doForgot()"
>
ارسال کد بازیابی
</button>


<div
 id="resetFields"
 style="display:none;margin-top:14px;"
>

<div class="field">

<label>
کد بازیابی
</label>

<input
 type="text"
 id="resetCode"
 placeholder="۶ رقمی"
 inputmode="numeric"
>

</div>


<div class="field">

<label>
رمز عبور جدید
</label>

<input
 type="password"
 id="resetNewPassword"
 placeholder="حداقل ۶ کاراکتر"
 autocomplete="new-password"
>

</div>

<button
 class="btn primary block"
 onclick="doReset()"
>
تغییر رمز عبور
</button>

</div>

<div class="switch-line">

<a onclick="openModal('login')">
بازگشت به ورود
</a>

</div>

</div>

</div>

</div>


<script>

const API="";

let token=
  localStorage.getItem("abzarak_token")||
  null;

let currentUser=null;

let chatHistory=[];


// =============================================================
// MODAL
// =============================================================

function openModal(which){

  const overlay=
    document.getElementById("authOverlay");

  overlay.classList.add("open");


  document.getElementById("loginForm").style.display=
    which==="login"
      ?"block"
      :"none";


  document.getElementById("signupForm").style.display=
    which==="signup"
      ?"block"
      :"none";


  document.getElementById("forgotForm").style.display=
    which==="forgot"
      ?"block"
      :"none";


  if(which==="login"){

    setTimeout(()=>{

      const el=
        document.getElementById("loginEmail");

      if(el)el.focus();

    },50);

  }


  if(which==="signup"){

    setTimeout(()=>{

      const el=
        document.getElementById("signupName");

      if(el)el.focus();

    },50);

  }


  if(which==="forgot"){

    setTimeout(()=>{

      const el=
        document.getElementById("forgotEmail");

      if(el)el.focus();

    },50);

  }

}


function closeModal(){

  document
    .getElementById("authOverlay")
    .classList
    .remove("open");

}


document
  .getElementById("authOverlay")
  .addEventListener(
    "click",
    function(e){

      if(e.target===this){
        closeModal();
      }

    }
  );


// =============================================================
// MESSAGE
// =============================================================

function setMsg(id,text,ok){

  const el=
    document.getElementById(id);

  if(!el)return;

  el.textContent=text||"";

  el.className=
    "modal-msg "+
    (ok?"ok":"err");
}


// =============================================================
// API
// =============================================================

async function api(path,options={}){

  const headers=
    Object.assign(
      {
        "Content-Type":
          "application/json"
      },
      options.headers||{}
    );


  if(token){

    headers.Authorization=
      "Bearer "+token;

  }


  const res=
    await fetch(
      API+path,
      Object.assign(
        {},
        options,
        {
          headers
        }
      )
    );


  let data={};

  try{
    data=await res.json();
  }catch{}


  if(!res.ok){

    const error=
      new Error(
        data.error||
        data.message||
        "خطایی رخ داد."
      );

    error.status=res.status;
    error.data=data;

    throw error;
  }


  return data;
}


// =============================================================
// LOGIN
// =============================================================

async function doLogin(){

  const email=
    document
      .getElementById("loginEmail")
      .value
      .trim();


  const password=
    document
      .getElementById("loginPassword")
      .value;


  setMsg(
    "loginMsg",
    ""
  );


  if(!email){

    setMsg(
      "loginMsg",
      "ایمیل را وارد کنید."
    );

    return;
  }


  if(!password){

    setMsg(
      "loginMsg",
      "رمز عبور را وارد کنید."
    );

    return;
  }


  try{

    const data=
      await api(
        "/api/login",
        {
          method:"POST",

          body:JSON.stringify({
            email,
            password
          })
        }
      );


    if(!data.token){

      throw new Error(
        "توکن ورود از سرور دریافت نشد."
      );

    }


    token=data.token;

    localStorage.setItem(
      "abzarak_token",
      token
    );


    const ok=
      await loadMe();


    closeModal();


    addMsg(
      ok
        ?"ورود با موفقیت انجام شد. حالا پیام خودت را بفرست. 👋"
        :"ورود انجام شد. اگر پیام ارسال نشد، صفحه را تازه‌سازی کن.",
      "system"
    );


  }catch(e){

    console.error(
      "ABZARAK LOGIN CLIENT ERROR:",
      e
    );


    setMsg(
      "loginMsg",
      e.message||
      "ورود انجام نشد."
    );

  }

}


// =============================================================
// PUBLIC SIGNUP
// =============================================================

async function doSignup(){

  const name=
    document
      .getElementById("signupName")
      .value
      .trim();


  const email=
    document
      .getElementById("signupEmail")
      .value
      .trim();


  const password=
    document
      .getElementById("signupPassword")
      .value;


  setMsg(
    "signupMsg",
    ""
  );


  if(!name){

    setMsg(
      "signupMsg",
      "نام را وارد کنید."
    );

    return;
  }


  if(name.length<2){

    setMsg(
      "signupMsg",
      "نام باید حداقل ۲ کاراکتر باشد."
    );

    return;
  }


  if(!email){

    setMsg(
      "signupMsg",
      "ایمیل را وارد کنید."
    );

    return;
  }


  if(!password){

    setMsg(
      "signupMsg",
      "رمز عبور را وارد کنید."
    );

    return;
  }


  if(password.length<6){

    setMsg(
      "signupMsg",
      "رمز عبور باید حداقل ۶ کاراکتر باشد."
    );

    return;
  }


  try{

    const data=
      await api(
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


    if(!data.token){

      throw new Error(
        "ثبت‌نام انجام شد اما ورود خودکار ممکن نشد."
      );

    }


    token=
      data.token;


    localStorage.setItem(
      "abzarak_token",
      token
    );


    const ok=
      await loadMe();


    closeModal();


    addMsg(
      ok
        ?"حساب شما با موفقیت ساخته شد. خوش آمدی 👋"
        :"ثبت‌نام انجام شد. صفحه را تازه‌سازی کن.",
      "system"
    );


  }catch(e){

    console.error(
      "ABZARAK SIGNUP CLIENT ERROR:",
      e
    );


    setMsg(
      "signupMsg",
      e.message||
      "ثبت‌نام انجام نشد."
    );

  }

}


// =============================================================
// FORGOT PASSWORD
// =============================================================

async function doForgot(){

  const email=
    document
      .getElementById("forgotEmail")
      .value
      .trim();


  setMsg(
    "forgotMsg",
    ""
  );


  if(!email){

    setMsg(
      "forgotMsg",
      "ایمیل را وارد کنید."
    );

    return;
  }


  try{

    const data=
      await api(
        "/api/forgot-password",
        {
          method:"POST",

          body:JSON.stringify({
            email
          })
        }
      );


    setMsg(
      "forgotMsg",
      data.message,
      true
    );


    document
      .getElementById("resetFields")
      .style
      .display="block";


  }catch(e){

    setMsg(
      "forgotMsg",
      e.message||
      "خطا در ارسال کد بازیابی."
    );

  }

}


// =============================================================
// RESET PASSWORD
// =============================================================

async function doReset(){

  const email=
    document
      .getElementById("forgotEmail")
      .value
      .trim();


  const code=
    document
      .getElementById("resetCode")
      .value
      .trim();


  const newPassword=
    document
      .getElementById("resetNewPassword")
      .value;


  setMsg(
    "forgotMsg",
    ""
  );


  if(!email||!code){

    setMsg(
      "forgotMsg",
      "ایمیل و کد بازیابی الزامی است."
    );

    return;
  }


  if(newPassword.length<6){

    setMsg(
      "forgotMsg",
      "رمز جدید باید حداقل ۶ کاراکتر باشد."
    );

    return;
  }


  try{

    const data=
      await api(
        "/api/reset-password",
        {
          method:"POST",

          body:JSON.stringify({
            email,
            code,
            newPassword
          })
        }
      );


    setMsg(
      "forgotMsg",
      data.message,
      true
    );


    setTimeout(()=>{

      openModal("login");

    },1200);


  }catch(e){

    setMsg(
      "forgotMsg",
      e.message||
      "خطا در تغییر رمز عبور."
    );

  }

}


// =============================================================
// LOGOUT
// =============================================================

function logout(){

  token=null;
  currentUser=null;
  chatHistory=[];


  localStorage.removeItem(
    "abzarak_token"
  );


  updateNav();


  addMsg(
    "از حساب خارج شدی.",
    "system"
  );

}


// =============================================================
// NAV
// =============================================================

function updateNav(){

  const nav=
    document.getElementById("navArea");

  const badge=
    document.getElementById("userBadge");


  if(currentUser){

    nav.style.display="none";

    badge.style.display="flex";


    document
      .getElementById("userNameLabel")
      .textContent=
        currentUser.name||
        "کاربر";

  }else{

    nav.style.display="flex";

    badge.style.display="flex";
    badge.style.display="none";

  }

}


// =============================================================
// LOAD ME
// =============================================================

async function loadMe(){

  if(!token){

    currentUser=null;

    updateNav();

    return false;
  }


  try{

    const data=
      await api(
        "/api/me"
      );


    if(!data||!data.user){

      throw new Error(
        "اطلاعات حساب از سرور دریافت نشد."
      );

    }


    currentUser=
      data.user;


    updateNav();


    return true;


  }catch(e){

    console.error(
      "ABZARAK LOAD ME ERROR:",
      e
    );


    if(
      Number(e.status)===401
    ){

      token=null;

      localStorage.removeItem(
        "abzarak_token"
      );

      currentUser=null;
      chatHistory=[];

    }


    updateNav();


    return false;
  }

}


// =============================================================
// CHAT MESSAGE
// =============================================================

function addMsg(text,cls){

  const log=
    document.getElementById("chatLog");


  const div=
    document.createElement("div");


  div.className=
    "msg "+cls;


  div.textContent=text;


  log.appendChild(div);


  log.scrollTop=
    log.scrollHeight;

}


// =============================================================
// FOCUS CHAT
// =============================================================

function focusChat(){

  const input=
    document.getElementById("chatInput");


  input.scrollIntoView({
    behavior:"smooth",
    block:"center"
  });


  input.focus();

}


// =============================================================
// SCROLL PLANS
// =============================================================

function scrollToPlans(){

  document
    .getElementById("plansSection")
    .scrollIntoView({
      behavior:"smooth"
    });

}


// =============================================================
// SEND MESSAGE
// =============================================================

async function sendMessage(){

  const input=
    document.getElementById("chatInput");


  const message=
    input.value.trim();


  if(!message)return;


  if(!token){

    addMsg(
      "برای گفتگو با ابزارک ابتدا وارد حساب شو یا ثبت‌نام کن.",
      "system"
    );


    openModal("login");


    return;
  }


  addMsg(
    message,
    "user"
  );


  input.value="";


  const thinking=
    document.createElement("div");


  thinking.className=
    "msg ai";


  thinking.textContent=
    "در حال فکر کردن...";


  const log=
    document.getElementById("chatLog");


  log.appendChild(
    thinking
  );


  log.scrollTop=
    log.scrollHeight;


  try{

    const data=
      await api(
        "/api/ai/chat",
        {
          method:"POST",

          body:JSON.stringify({
            message,
            history:chatHistory
          })
        }
      );


    const reply=
      String(
        data.reply||
        "متأسفم، نتوانستم پاسخ مناسبی تولید کنم."
      );


    thinking.textContent=
      reply;


    chatHistory.push(
      {
        role:"user",
        content:message
      },
      {
        role:"assistant",
        content:reply
      }
    );


    if(
      chatHistory.length>20
    ){

      chatHistory=
        chatHistory.slice(-20);

    }


    log.scrollTop=
      log.scrollHeight;


  }catch(e){

    console.error(
      "ABZARAK AI ERROR:",
      e
    );


    if(
      Number(e.status)===401
    ){

      token=null;
      currentUser=null;
      chatHistory=[];


      localStorage.removeItem(
        "abzarak_token"
      );


      updateNav();


      thinking.textContent=
        "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.";


      setTimeout(()=>{

        openModal("login");

      },300);


    }else{

      thinking.textContent=
        "خطا: "+
        (
          e.message||
          "خطا در ارتباط با هوش مصنوعی."
        );

    }

  }

}


// =============================================================
// LOAD PLANS
// =============================================================

async function loadPlans(){

  const grid=
    document.getElementById("plansGrid");


  try{

    const data=
      await api(
        "/api/plans"
      );


    if(
      !data||
      !Array.isArray(data.plans)
    ){

      throw new Error(
        "پاسخ نامعتبر از سرور برای پلن‌ها."
      );

    }


    grid.innerHTML="";


    if(!data.plans.length){

      grid.innerHTML=
        "<div class='msg system' style='align-self:center;'>در حال حاضر پلنی برای نمایش وجود ندارد.</div>";

      return;
    }


    data.plans.forEach(
      (plan,i)=>{

        const card=
          document.createElement("div");


        card.className=
          "card plan-card"+
          (i===2?" featured":"");


        const features=
          Array.isArray(plan.features)
            ?plan.features
            :[];


        card.innerHTML=
          "<h3>"+
          escapeHtml(plan.name)+
          "</h3>"+
          "<div class='plan-price'>"+
          Number(
            plan.price_toman||0
          ).toLocaleString("fa-IR")+
          " تومان <small>/ ماه</small></div>"+
          "<ul>"+
          features
            .map(f=>
              "<li>"+
              escapeHtml(
                String(f)
              )+
              "</li>"
            )
            .join("")+
          "</ul>"+
          "<button class='btn primary block' onclick='buyPlan("+
          JSON.stringify(plan.id)+
          ")'>خرید این پلن</button>";


        grid.appendChild(
          card
        );

      }
    );


  }catch(e){

    console.error(
      "LOAD PLANS ERROR:",
      e
    );


    grid.innerHTML=
      "<div class='msg system' style='align-self:center;'>بارگذاری پلن‌ها ناموفق بود.</div>";

  }

}


// =============================================================
// HTML ESCAPE
// =============================================================

function escapeHtml(value){

  return String(value)
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


// =============================================================
// BUY PLAN
// =============================================================

async function buyPlan(planId){

  if(!token){

    openModal("login");

    return;
  }


  try{

    const data=
      await api(
        "/api/payment/request",
        {
          method:"POST",

          body:JSON.stringify({
            planId
          })
        }
      );


    if(data.payment_url){

      window.location.href=
        data.payment_url;

    }else{

      alert(
        "لینک پرداخت از زرین‌پال دریافت نشد."
      );

    }


  }catch(e){

    console.error(
      "BUY PLAN ERROR:",
      e
    );


    alert(
      e.message||
      "خطا در ایجاد پرداخت."
    );

  }

}


// =============================================================
// INIT
// =============================================================

loadMe();
loadPlans();


const params=
  new URLSearchParams(
    window.location.search
  );


if(
  params.get("payment")==="success"
){

  setTimeout(()=>{

    alert(
      "پرداخت با موفقیت انجام شد! اشتراک شما فعال است."
    );

  },300);


}else if(

  params.get("payment")==="failed"||
  params.get("payment")==="error"

){

  setTimeout(()=>{

    alert(
      "پرداخت ناموفق بود. لطفاً دوباره تلاش کنید."
    );

  },300);


}else if(
  params.get("payment")==="cancel"
){

  setTimeout(()=>{

    alert(
      "پرداخت لغو شد."
    );

  },300);

}

</script>

</body>
</html>`;
}


// =============================================================
// SEO DATA
// =============================================================
const SEO_PAGES = {

  "/chat-ai": {
    title: "چت با هوش مصنوعی فارسی آنلاین | ابزارک AI",
    description: "چت با هوش مصنوعی فارسی ابزارک برای پرسش و پاسخ، آموزش، تولید متن، ایده‌پردازی، ترجمه، خلاصه‌سازی و کارهای روزمره.",
    h1: "چت با هوش مصنوعی فارسی آنلاین",
    intro: "در ابزارک AI می‌توانی به زبان فارسی با یک دستیار هوشمند گفتگو کنی؛ سؤال بپرسی، متن تولید کنی، مفاهیم را بهتر بفهمی و برای کارهای روزمره ایده و راه‌حل بگیری.",
    imageTitle: "چت با هوش مصنوعی فارسی",
    imageKind: "chat",
    updated: "2026-10-01",

    sections: [
      {
        title:"چت هوش مصنوعی فارسی چه کاربردی دارد؟",
        text:"چت با هوش مصنوعی زمانی مفید است که بخواهی از یک پاسخ ساده فراتر بروی و درباره یک موضوع توضیح، مثال، خلاصه، ایده یا متن آماده دریافت کنی. ابزارک برای مکالمه فارسی و چندزبانه ساخته شده و می‌توانی درخواستت را با زبان طبیعی بنویسی.",
        bullets:[
          "پرسش و پاسخ درباره موضوعات مختلف",
          "توضیح مفاهیم آموزشی با زبان ساده",
          "کمک به نوشتن و بازنویسی متن",
          "ایده‌پردازی برای پروژه و محتوا",
          "خلاصه‌کردن و مرتب‌سازی مطالب",
          "کمک در مسائل برنامه‌نویسی"
        ]
      },

      {
        title:"چطور از ابزارک نتیجه بهتری بگیری؟",
        text:"هرچه درخواستت دقیق‌تر باشد، پاسخ هم کاربردی‌تر می‌شود. موضوع، هدف، مخاطب، لحن و محدودیت‌های موردنیاز را داخل پیام بنویس. می‌توانی بعد از پاسخ بگویی متن را کوتاه‌تر، رسمی‌تر، ساده‌تر یا کامل‌تر کند.",
        bullets:[
          "هدف خودت را مشخص کن",
          "مخاطب یا سطح آشنایی را بگو",
          "فرمت خروجی را تعیین کن",
          "در صورت نیاز از ابزارک بخواه پاسخ را اصلاح کند"
        ]
      },

      {
        title:"چت فارسی برای چه کسانی مناسب است؟",
        text:"دانش‌آموزان، دانشجویان، تولیدکنندگان محتوا، صاحبان کسب‌وکار، برنامه‌نویسان و کاربرانی که می‌خواهند بخشی از کارهای نوشتاری و فکری روزانه را سریع‌تر انجام دهند، می‌توانند از ابزارک به عنوان یک دستیار متنی استفاده کنند."
      }
    ]
  },


  "/content": {
    title:"تولید محتوا با هوش مصنوعی فارسی | ابزارک AI",
    description:"تولید محتوا با هوش مصنوعی فارسی برای مقاله، کپشن، توضیحات محصول، متن تبلیغاتی، ایده محتوا و شبکه‌های اجتماعی.",
    h1:"تولید محتوا با هوش مصنوعی فارسی",
    intro:"برای شروع سریع یک محتوای تازه، ساختار مقاله، کپشن، توضیحات محصول یا متن تبلیغاتی می‌توانی از ابزارک AI کمک بگیری و خروجی را متناسب با مخاطب و لحن موردنظر اصلاح کنی.",
    imageTitle:"تولید محتوای هوشمند",
    imageKind:"content",
    updated:"2026-10-01",

    sections:[
      {
        title:"تولید محتوای متنی با AI",
        text:"تولید محتوا با هوش مصنوعی می‌تواند مرحله ایده‌پردازی، ساختاردهی و نوشتن پیش‌نویس را سریع‌تر کند. ابزارک به تو کمک می‌کند موضوع را به بخش‌های منطقی تقسیم کنی و یک متن اولیه قابل ویرایش داشته باشی.",
        bullets:[
          "مقاله و محتوای وب",
          "کپشن شبکه‌های اجتماعی",
          "توضیحات محصول و خدمات",
          "متن تبلیغاتی و معرفی",
          "عنوان و تیترهای پیشنهادی",
          "ایده برای تقویم محتوایی"
        ]
      },

      {
        title:"برای سئو محتوا را برای انسان بنویس",
        text:"محتوای مفید باید پاسخ روشن به نیاز جستجوکننده بدهد و از تکرار مصنوعی عبارت‌های کلیدی دور باشد. بهتر است موضوع را کامل توضیح بدهی، مثال واقعی اضافه کنی و متن را با تیترهای واضح و قابل اسکن تنظیم کنی."
      },

      {
        title:"ویرایش نهایی را فراموش نکن",
        text:"متن تولیدشده را قبل از انتشار بررسی کن؛ واقعیت‌ها، اعداد، نام‌ها، لینک‌ها و لحن برند باید با نیاز واقعی صفحه هماهنگ باشد. ابزارک می‌تواند برای بازنویسی، کوتاه‌کردن یا تغییر لحن نسخه دوم متن را هم تهیه کند."
      }
    ]
  },


  "/translate-ai": {
    title:"ترجمه با هوش مصنوعی آنلاین | مترجم فارسی ابزارک AI",
    description:"ترجمه و بازنویسی متن با هوش مصنوعی برای فارسی و زبان‌های مختلف؛ مناسب متن‌های روزمره، کاری، آموزشی و توضیحات محصول.",
    h1:"ترجمه با هوش مصنوعی آنلاین",
    intro:"متن خودت را وارد ابزارک کن و برای ترجمه، بازنویسی یا روان‌سازی از یک دستیار هوشمند کمک بگیر. می‌توانی لحن ترجمه را هم متناسب با کاربرد تغییر دهی.",
    imageTitle:"ترجمه هوشمند چندزبانه",
    imageKind:"translate",
    updated:"2026-10-01",

    sections:[
      {
        title:"ترجمه طبیعی‌تر برای متن‌های مختلف",
        text:"ترجمه خوب فقط جایگزین‌کردن واژه‌ها نیست؛ ساختار جمله، لحن و معنای متن نیز مهم است. برای همین می‌توانی همراه متن، هدف یا مخاطب ترجمه را توضیح بدهی تا خروجی قابل استفاده‌تری بگیری.",
        bullets:[
          "ترجمه فارسی و انگلیسی",
          "ترجمه متن‌های کاری و آموزشی",
          "ترجمه توضیحات محصول",
          "بازنویسی متن ترجمه‌شده",
          "اصلاح جمله‌های غیرطبیعی",
          "کمک به یادگیری زبان"
        ]
      },

      {
        title:"برای ترجمه حرفه‌ای چه چیزی بنویسیم؟",
        text:"زبان مبدأ و مقصد را مشخص کن و اگر متن برای ایمیل، سایت، رزومه، فروشگاه یا شبکه اجتماعی است، آن را هم بگو. این اطلاعات به تنظیم لحن و انتخاب واژه‌های مناسب کمک می‌کند."
      },

      {
        title:"ترجمه را قبل از انتشار بررسی کن",
        text:"در متن‌های تخصصی، حقوقی، پزشکی یا قراردادی، خروجی هوش مصنوعی را به عنوان پیش‌نویس بررسی کن و در صورت نیاز از فرد متخصص یا مترجم حرفه‌ای کمک بگیر."
      }
    ]
  },


  "/summarize-ai": {
    title:"خلاصه سازی متن با هوش مصنوعی | ابزارک AI",
    description:"خلاصه سازی متن با هوش مصنوعی برای استخراج نکات کلیدی، جمع‌بندی مقاله، گزارش، مطالب آموزشی و متن‌های طولانی.",
    h1:"خلاصه سازی متن با هوش مصنوعی",
    intro:"وقتی متن طولانی است و زمان کافی برای خواندن همه جزئیات نداری، ابزارک می‌تواند نکات اصلی را استخراج و یک نسخه کوتاه‌تر و منظم از محتوا آماده کند.",
    imageTitle:"خلاصه‌سازی هوشمند متن",
    imageKind:"summary",
    updated:"2026-10-01",

    sections:[
      {
        title:"خلاصه‌سازی سریع و خوانا",
        text:"می‌توانی از ابزارک بخواهی یک متن را کوتاه کند، نکات مهم را فهرست کند یا خلاصه را در چند پاراگراف منظم تحویل دهد. همچنین می‌توانی سطح جزئیات خلاصه را مشخص کنی.",
        bullets:[
          "خلاصه مقاله و گزارش",
          "خلاصه متن آموزشی",
          "استخراج نکات کلیدی",
          "جمع‌بندی جلسه یا یادداشت",
          "تهیه نسخه کوتاه‌تر از متن",
          "مرتب‌سازی مطالب طولانی"
        ]
      },

      {
        title:"خلاصه مناسب مطالعه",
        text:"برای مطالعه بهتر می‌توانی از ابزارک بخواهی تعریف‌ها، نکات مهم و نتیجه‌گیری متن را جدا کند. این روش برای مرور سریع مطالب کاربردی است."
      },

      {
        title:"خلاصه‌سازی جایگزین بررسی منبع نیست",
        text:"برای اطلاعات حساس یا تخصصی، متن خلاصه را با منبع اصلی مقایسه کن؛ خلاصه باید به فهم سریع‌تر کمک کند، نه اینکه جای منبع اصلی را در تصمیم‌های مهم بگیرد."
      }
    ]
  },


  "/ideas-ai": {
    title:"ایده پردازی با هوش مصنوعی | ایده‌های خلاقانه با ابزارک AI",
    description:"ایده پردازی با هوش مصنوعی برای کسب‌وکار، تولید محتوا، شبکه‌های اجتماعی، پروژه، نام‌گذاری و برنامه‌ریزی.",
    h1:"ایده پردازی با هوش مصنوعی",
    intro:"وقتی برای شروع یک پروژه، محتوای جدید یا یک تصمیم خلاقانه ایده کم داری، ابزارک می‌تواند چند مسیر متفاوت پیشنهاد دهد تا بتوانی گزینه‌ها را مقایسه و توسعه بدهی.",
    imageTitle:"ایده‌پردازی خلاقانه با AI",
    imageKind:"ideas",
    updated:"2026-10-01",

    sections:[
      {
        title:"ایده‌های بیشتر از یک زاویه",
        text:"به جای اینکه فقط بگویی «چند ایده بده»، زمینه را توضیح بده: هدف چیست، مخاطب چه کسی است، چه محدودیتی داری و چه نتیجه‌ای می‌خواهی. سپس از ابزارک بخواه ایده‌ها را دسته‌بندی کند.",
        bullets:[
          "ایده کسب‌وکار",
          "ایده تولید محتوا",
          "ایده پست شبکه اجتماعی",
          "ایده پروژه و محصول",
          "ایده کمپین و معرفی",
          "نام و عنوان پیشنهادی"
        ]
      },

      {
        title:"از ایده خام تا برنامه قابل اجرا",
        text:"بعد از انتخاب چند ایده می‌توانی از ابزارک بخواهی برای هرکدام مزایا، چالش‌ها، مراحل شروع و منابع لازم را بنویسد. این کار ایده را از یک پیشنهاد اولیه به یک برنامه قابل بررسی نزدیک می‌کند."
      },

      {
        title:"خلاقیت را با بررسی واقعی ترکیب کن",
        text:"ایده تولیدشده را با شرایط واقعی بازار، مخاطب، هزینه و محدودیت‌های خودت مقایسه کن. ابزارک برای طوفان فکری مناسب است، اما تصمیم نهایی به بررسی واقعی نیاز دارد."
      }
    ]
  },


  "/programming-ai": {
    title:"برنامه نویسی با هوش مصنوعی | دستیار کدنویسی ابزارک AI",
    description:"کمک به برنامه نویسی با هوش مصنوعی برای توضیح کد، رفع خطا، الگوریتم، نمونه کد، HTML، CSS و JavaScript.",
    h1:"برنامه نویسی با هوش مصنوعی",
    intro:"کد، خطا یا مسئله‌ات را برای ابزارک توضیح بده و برای فهم بهتر، پیدا کردن علت خطا، طراحی الگوریتم یا ساخت نمونه کد از آن کمک بگیر.",
    imageTitle:"دستیار برنامه‌نویسی با AI",
    imageKind:"code",
    updated:"2026-10-01",

    sections:[
      {
        title:"کمک به یادگیری و حل مسئله",
        text:"ابزارک می‌تواند کد را خط‌به‌خط توضیح دهد، مفهوم یک تابع را ساده کند و برای یک مسئله چند روش پیشنهادی ارائه دهد. برای یادگیری بهتر، از آن بخواه ابتدا مفهوم را توضیح دهد و بعد نمونه کد بدهد.",
        bullets:[
          "توضیح کد",
          "بررسی خطاهای رایج",
          "نوشتن نمونه کد",
          "طراحی الگوریتم",
          "HTML و CSS",
          "JavaScript و زبان‌های دیگر"
        ]
      },

      {
        title:"برای رفع خطا چه اطلاعاتی بدهیم؟",
        text:"متن کامل خطا، بخش مرتبط کد و توضیح کوتاهی از چیزی که انتظار داشتی رخ دهد را بفرست. این اطلاعات معمولاً برای پیدا کردن مسیر بررسی مفیدتر از یک جمله کوتاه مثل «کدم کار نمی‌کند» است."
      },

      {
        title:"کد تولیدشده را تست کن",
        text:"نمونه کد AI را همیشه در محیط خودت اجرا و بررسی کن. وابستگی‌ها، نسخه کتابخانه‌ها، امنیت و رفتار واقعی برنامه باید قبل از استفاده در محیط اصلی کنترل شوند."
      }
    ]
  },


  "/ai-writing": {
    title:"نویسندگی و بازنویسی با هوش مصنوعی | ابزارک AI",
    description:"بازنویسی و اصلاح متن با هوش مصنوعی فارسی برای تغییر لحن، روان‌تر کردن، رسمی‌نویسی، کوتاه‌سازی و توسعه متن.",
    h1:"نویسندگی و بازنویسی با هوش مصنوعی",
    intro:"اگر متنی نوشته‌ای و می‌خواهی روان‌تر، حرفه‌ای‌تر یا متناسب با مخاطب شود، ابزارک می‌تواند نسخه‌های مختلفی از همان متن را برایت آماده کند.",
    imageTitle:"نویسندگی و بازنویسی هوشمند",
    imageKind:"writing",
    updated:"2026-10-01",

    sections:[
      {
        title:"یک متن، چند لحن مختلف",
        text:"برای ایمیل، صفحه سایت، شبکه اجتماعی یا پیام کاری، لحن مناسب فرق می‌کند. متن خودت را بده و مشخص کن رسمی، دوستانه، کوتاه، حرفه‌ای یا فروشگاهی باشد.",
        bullets:[
          "بازنویسی متن",
          "اصلاح نگارشی",
          "تغییر لحن",
          "نوشتن متن رسمی",
          "نوشتن متن دوستانه",
          "کوتاه‌کردن یا گسترش متن"
        ]
      },

      {
        title:"اصلاح متن بدون از دست دادن منظور",
        text:"هنگام بازنویسی بهتر است بگویی کدام اطلاعات باید دقیقاً حفظ شوند. ابزارک می‌تواند ساختار جمله‌ها را بهتر کند و در عین حال به اصل پیام نزدیک بماند."
      },

      {
        title:"برای انتشار نهایی مرور انسانی داشته باش",
        text:"قبل از انتشار، نام‌ها، اعداد، ادعاها و اطلاعات حساس را بررسی کن. بازنویسی هوش مصنوعی باید ابزار کمکی باشد و نسخه نهایی با هدف واقعی متن هماهنگ شود."
      }
    ]
  },


  "/ai-tools": {
    title:"ابزارهای هوش مصنوعی فارسی | کاربردهای AI در ابزارک",
    description:"مجموعه‌ای از کاربردهای هوش مصنوعی فارسی برای چت، تولید محتوا، ترجمه، خلاصه‌سازی، ایده‌پردازی، نویسندگی و برنامه‌نویسی.",
    h1:"ابزارهای هوش مصنوعی فارسی",
    intro:"ابزارک AI یک نقطه شروع ساده برای استفاده از هوش مصنوعی در کارهای متنی و فکری است؛ از چت و تولید محتوا تا ترجمه، خلاصه‌سازی، ایده‌پردازی و کدنویسی.",
    imageTitle:"مجموعه ابزارهای هوش مصنوعی",
    imageKind:"tools",
    updated:"2026-10-01",

    sections:[
      {
        title:"یک دستیار برای چند کار",
        text:"هر کار لازم نیست ابزار جداگانه‌ای داشته باشد. می‌توانی از یک محیط گفتگو برای نوشتن، خلاصه‌کردن، ترجمه، ایده‌پردازی و توضیح کد استفاده کنی و بر اساس نیازت نوع درخواست را تغییر دهی.",
        bullets:[
          "چت با هوش مصنوعی",
          "تولید محتوا",
          "ترجمه",
          "خلاصه‌سازی",
          "ایده‌پردازی",
          "نویسندگی و بازنویسی",
          "برنامه‌نویسی"
        ]
      },

      {
        title:"صفحه مناسب خودت را انتخاب کن",
        text:"اگر هدف مشخصی داری، از صفحات تخصصی ابزارک شروع کن. هر صفحه درباره یک کاربرد اصلی توضیح می‌دهد و می‌تواند به صفحه اصلی برای شروع استفاده هدایتت کند."
      },

      {
        title:"هوش مصنوعی را به شکل کاربردی استفاده کن",
        text:"بهترین نتیجه معمولاً از درخواست‌های دقیق و قابل بررسی به دست می‌آید. هدف، زمینه، فرمت و محدودیت را بنویس و سپس خروجی را با نیاز واقعی خود مقایسه و اصلاح کن."
      }
    ]
  },


  "/ai-assistant": {
    title:"دستیار هوش مصنوعی فارسی | ابزارک AI",
    description:"ابزارک AI یک دستیار هوش مصنوعی فارسی برای گفتگو، تولید محتوا، ترجمه، خلاصه‌سازی، ایده‌پردازی، نویسندگی و برنامه‌نویسی است.",
    h1:"دستیار هوش مصنوعی فارسی",
    intro:"ابزارک AI را به عنوان یک دستیار هوشمند فارسی برای سؤال پرسیدن، نوشتن، ترجمه، خلاصه‌سازی، ایده‌پردازی و کمک به کارهای روزمره امتحان کن.",
    imageTitle:"دستیار هوشمند فارسی",
    imageKind:"assistant",
    updated:"2026-10-01",

    sections:[
      {
        title:"ابزارک چیست؟",
        text:"ابزارک یک سرویس هوش مصنوعی فارسی برای گفتگو و انجام کارهای متنی و فکری است. می‌توانی درخواستت را به زبان طبیعی بنویسی و نتیجه را مرحله‌به‌مرحله اصلاح کنی.",
        bullets:[
          "پرسش و پاسخ",
          "تولید محتوا",
          "ترجمه",
          "خلاصه‌سازی",
          "ایده‌پردازی",
          "نویسندگی",
          "برنامه‌نویسی"
        ]
      },

      {
        title:"چطور از یک دستیار AI بهتر استفاده کنیم؟",
        text:"به جای درخواست‌های مبهم، هدفت را مشخص کن و اگر فرمت خاصی می‌خواهی، همان ابتدا بنویس. بعد از اولین پاسخ نیز می‌توانی درباره همان گفتگو درخواست تغییر یا تکمیل بدهی."
      },

      {
        title:"برای شروع نیاز به تجربه فنی نداری",
        text:"کار با ابزارک از یک گفتگوی ساده شروع می‌شود. سؤال یا کار خودت را بنویس، پاسخ را بخوان و در صورت نیاز از دستیار بخواه نسخه دیگری با لحن، طول یا ساختار متفاوت آماده کند."
      }
    ]
  }
};


// =============================================================
// FAQ
// =============================================================
const FAQ_ITEMS=[

 {
   q:"ابزارک AI چیست؟",
   a:"ابزارک AI یک دستیار هوش مصنوعی فارسی برای گفتگو، تولید محتوا، ترجمه، خلاصه‌سازی، ایده‌پردازی، نویسندگی و کمک به برنامه‌نویسی است."
 },

 {
   q:"آیا می‌توانم رایگان از ابزارک استفاده کنم؟",
   a:"حساب‌های فعال امکان استفاده از سهمیه رایگان ابزارک را دارند و برای استفاده بیشتر می‌توان یکی از پلن‌های اشتراک را انتخاب کرد."
 },

 {
   q:"برای چت با ابزارک باید وارد حساب شوم؟",
   a:"بله. برای ارسال پیام در چت ابزارک باید وارد حساب کاربری فعال خود شوید."
 },

 {
   q:"آیا ثبت‌نام عمومی در ابزارک فعال است؟",
   a:"بله. ثبت‌نام عمومی فعال است و کاربران جدید می‌توانند با نام، ایمیل و رمز عبور حساب خود را ایجاد کنند."
 },

 {
   q:"ابزارک برای تولید محتوا مناسب است؟",
   a:"بله. می‌توانید برای ساخت پیش‌نویس، ایده، کپشن، توضیحات محصول، متن تبلیغاتی و بازنویسی از ابزارک کمک بگیرید."
 },

 {
   q:"آیا ابزارک ترجمه انجام می‌دهد؟",
   a:"بله. ابزارک برای ترجمه، روان‌سازی و بازنویسی متن به زبان‌های مختلف قابل استفاده است."
 },

 {
   q:"آیا ابزارک برای برنامه‌نویسی کاربرد دارد؟",
   a:"بله. می‌توانید برای توضیح کد، بررسی خطا، الگوریتم و نمونه کد از ابزارک کمک بگیرید و خروجی را در محیط خودتان آزمایش کنید."
 },

 {
   q:"پلن‌های اشتراک ابزارک چگونه هستند؟",
   a:"قیمت و امکانات پلن‌های فعال از طریق صفحه اصلی و بخش پلن‌های اشتراک نمایش داده می‌شود."
 },

 {
   q:"چطور رمز عبورم را بازیابی کنم؟",
   a:"از بخش ورود، گزینه فراموشی رمز عبور را انتخاب کنید تا کد بازیابی به ایمیل حساب ارسال شود."
 }

];


// =============================================================
// IMAGE THEMES
// =============================================================
const IMAGE_THEMES={
  chat:["#2563eb","#7c3aed","#eff6ff"],
  content:["#059669","#0ea5e9","#ecfdf5"],
  translate:["#0891b2","#2563eb","#ecfeff"],
  summary:["#f59e0b","#ea580c","#fff7ed"],
  ideas:["#d946ef","#7c3aed","#fdf4ff"],
  code:["#334155","#2563eb","#f8fafc"],
  writing:["#db2777","#9333ea","#fdf2f8"],
  tools:["#4f46e5","#0891b2","#eef2ff"],
  assistant:["#1d4ed8","#7c3aed","#eff6ff"]
};


function escapeSeoHtml(v){

  return String(v??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

}


function escapeXml(v){

  return String(v??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&apos;");

}


function jsonLd(obj){

  return JSON
    .stringify(obj)
    .replace(/</g,"\\u003c");

}


function imageResponse(svg){

  return new Response(
    svg,
    {
      headers:{
        "Content-Type":
          "image/svg+xml;charset=utf-8",

        "Cache-Control":
          "public,max-age=86400,immutable",

        "X-Content-Type-Options":
          "nosniff"
      }
    }
  );

}


// =============================================================
// SEO IMAGE
// =============================================================
function seoImageSvg(kind,title){

  const t=
    IMAGE_THEMES[kind]||
    IMAGE_THEMES.assistant;


  const [a,b,soft]=t;


  const safe=
    escapeXml(title);


  const id=
    "g"+
    String(kind)
      .replace(
        /[^a-z0-9]/gi,
        ""
      );


  const common=`

  <defs>

    <linearGradient
      id="${id}a"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >

      <stop
        offset="0"
        stop-color="${a}"
      />

      <stop
        offset="1"
        stop-color="${b}"
      />

    </linearGradient>


    <filter
      id="${id}s"
      x="-30%"
      y="-30%"
      width="160%"
      height="160%"
    >

      <feDropShadow
        dx="0"
        dy="14"
        stdDeviation="18"
        flood-color="#0f172a"
        flood-opacity=".12"
      />

    </filter>

  </defs>`;


  let art="";


  if(
    kind==="chat"||
    kind==="assistant"
  ){

    art=`

    <rect
      x="95"
      y="78"
      width="500"
      height="330"
      rx="38"
      fill="#fff"
      filter="url(#${id}s)"
    />

    <rect
      x="125"
      y="110"
      width="190"
      height="34"
      rx="17"
      fill="${soft}"
    />

    <circle
      cx="153"
      cy="127"
      r="8"
      fill="${a}"
    />

    <rect
      x="360"
      y="170"
      width="190"
      height="58"
      rx="20"
      fill="url(#${id}a)"
    />

    <rect
      x="145"
      y="252"
      width="255"
      height="54"
      rx="20"
      fill="#f1f5f9"
    />

    <rect
      x="145"
      y="330"
      width="175"
      height="38"
      rx="19"
      fill="${soft}"
    />

    <circle
      cx="535"
      cy="318"
      r="52"
      fill="url(#${id}a)"
    />

    <path
      d="M512 318l14 14 28-34"
      fill="none"
      stroke="#fff"
      stroke-width="9"
      stroke-linecap="round"
      stroke-linejoin="round"
    />`;

  }else if(
    kind==="content"||
    kind==="writing"
  ){

    art=`

    <rect
      x="130"
      y="70"
      width="430"
      height="390"
      rx="28"
      fill="#fff"
      filter="url(#${id}s)"
    />

    <rect
      x="170"
      y="120"
      width="230"
      height="18"
      rx="9"
      fill="${a}"
    />

    <rect
      x="170"
      y="165"
      width="320"
      height="11"
      rx="5"
      fill="#cbd5e1"
    />

    <rect
      x="170"
      y="190"
      width="280"
      height="11"
      rx="5"
      fill="#e2e8f0"
    />

    <rect
      x="170"
      y="235"
      width="340"
      height="11"
      rx="5"
      fill="#cbd5e1"
    />

    <rect
      x="170"
      y="260"
      width="300"
      height="11"
      rx="5"
      fill="#e2e8f0"
    />

    <rect
      x="170"
      y="330"
      width="180"
      height="70"
      rx="18"
      fill="${soft}"
    />

    <path
      d="M470 325l54 54-84 84-54-54z"
      fill="url(#${id}a)"
    />

    <path
      d="M456 339l54 54"
      stroke="#fff"
      stroke-width="10"
    />`;

  }else if(
    kind==="translate"
  ){

    art=`

    <rect
      x="85"
      y="90"
      width="235"
      height="310"
      rx="28"
      fill="#fff"
      filter="url(#${id}s)"
    />

    <rect
      x="470"
      y="90"
      width="235"
      height="310"
      rx="28"
      fill="#fff"
      filter="url(#${id}s)"
    />

    <rect
      x="125"
      y="140"
      width="150"
      height="18"
      rx="9"
      fill="${a}"
    />

    <rect
      x="510"
      y="140"
      width="150"
      height="18"
      rx="9"
      fill="${b}"
    />

    <rect
      x="125"
      y="190"
      width="150"
      height="12"
      rx="6"
      fill="#cbd5e1"
    />

    <rect
      x="125"
      y="220"
      width="125"
      height="12"
      rx="6"
      fill="#e2e8f0"
    />

    <rect
      x="510"
      y="190"
      width="150"
      height="12"
      rx="6"
      fill="#cbd5e1"
    />

    <rect
      x="510"
      y="220"
      width="125"
      height="12"
      rx="6"
      fill="#e2e8f0"
    />

    <path
      d="M352 230h96"
      stroke="url(#${id}a)"
      stroke-width="12"
      stroke-linecap="round"
    />

    <path
      d="M422 198l34 32-34 32"
      fill="none"
      stroke="${a}"
      stroke-width="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />`;

  }else if(
    kind==="summary"
  ){

    art=`

    <rect
      x="95"
      y="55"
      width="330"
      height="430"
      rx="28"
      fill="#fff"
      filter="url(#${id}s)"
    />

    <rect
      x="445"
      y="145"
      width="220"
      height="250"
      rx="32"
      fill="url(#${id}a)"
      filter="url(#${id}s)"
    />

    <rect
      x="135"
      y="110"
      width="190"
      height="16"
      rx="8"
      fill="${a}"
    />

    <rect
      x="135"
      y="150"
      width="230"
      height="10"
      rx="5"
      fill="#cbd5e1"
    />

    <rect
      x="135"
      y="180"
      width="200"
      height="10"
      rx="5"
      fill="#e2e8f0"
    />

    <rect
      x="135"
      y="230"
      width="220"
      height="10"
      rx="5"
      fill="#cbd5e1"
    />

    <rect
      x="135"
      y="260"
      width="160"
      height="10"
      rx="5"
      fill="#e2e8f0"
    />

    <path
      d="M500 245l34 34 72-84"
      fill="none"
      stroke="#fff"
      stroke-width="14"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <circle
      cx="555"
      cy="345"
      r="22"
      fill="#fff"
      fill-opacity=".28"
    />`;

  }else if(
    kind==="ideas"
  ){

    art=`

    <circle
      cx="340"
      cy="250"
      r="145"
      fill="${soft}"
    />

    <path
      d="M340 105c-74 0-134 60-134 134 0 49 27 92 67 115 17 10 28 29 28 49h78c0-20 11-39 28-49 40-23 67-66 67-115 0-74-60-134-134-134z"
      fill="#fff"
      filter="url(#${id}s)"
    />

    <path
      d="M294 338h92M304 372h72"
      stroke="${a}"
      stroke-width="10"
      stroke-linecap="round"
    />

    <path
      d="M340 157c-22 0-40 18-40 40 0 20 14 31 24 43 8 10 10 25 10 35h12c0-10 2-25 10-35 10-12 24-23 24-43 0-22-18-40-40-40z"
      fill="url(#${id}a)"
    />

    <circle
      cx="155"
      cy="155"
      r="24"
      fill="${a}"
      opacity=".14"
    />

    <circle
      cx="575"
      cy="355"
      r="30"
      fill="${b}"
      opacity=".16"
    />`;

  }else if(
    kind==="code"
  ){

    art=`

    <rect
      x="80"
      y="82"
      width="640"
      height="350"
      rx="30"
      fill="#0f172a"
      filter="url(#${id}s)"
    />

    <circle cx="118" cy="120" r="8" fill="#fca5a5"/>
    <circle cx="144" cy="120" r="8" fill="#fde68a"/>
    <circle cx="170" cy="120" r="8" fill="#86efac"/>

    <rect
      x="125"
      y="168"
      width="160"
      height="14"
      rx="7"
      fill="#60a5fa"
    />

    <rect
      x="125"
      y="198"
      width="260"
      height="12"
      rx="6"
      fill="#94a3b8"
    />

    <rect
      x="125"
      y="228"
      width="210"
      height="12"
      rx="6"
      fill="#64748b"
    />

    <rect
      x="150"
      y="258"
      width="290"
      height="12"
      rx="6"
      fill="#cbd5e1"
    />

    <rect
      x="125"
      y="310"
      width="350"
      height="12"
      rx="6"
      fill="#475569"
    />

    <rect
      x="510"
      y="185"
      width="135"
      height="135"
      rx="26"
      fill="url(#${id}a)"
    />

    <path
      d="M548 252l23 23 43-49"
      fill="none"
      stroke="#fff"
      stroke-width="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />`;

  }else{

    art=`

    <circle
      cx="400"
      cy="250"
      r="150"
      fill="${soft}"
    />

    <rect
      x="170"
      y="125"
      width="460"
      height="250"
      rx="42"
      fill="#fff"
      filter="url(#${id}s)"
    />

    <circle
      cx="255"
      cy="250"
      r="62"
      fill="url(#${id}a)"
    />

    <rect
      x="350"
      y="195"
      width="210"
      height="20"
      rx="10"
      fill="${a}"
    />

    <rect
      x="350"
      y="235"
      width="165"
      height="12"
      rx="6"
      fill="#cbd5e1"
    />

    <rect
      x="350"
      y="270"
      width="195"
      height="12"
      rx="6"
      fill="#e2e8f0"
    />

    <rect
      x="350"
      y="305"
      width="130"
      height="12"
      rx="6"
      fill="#cbd5e1"
    />`;
  }


  return `<?xml version="1.0" encoding="UTF-8"?>

<svg
 xmlns="http://www.w3.org/2000/svg"
 viewBox="0 0 800 540"
 role="img"
 aria-labelledby="title desc"
>

<title id="title">
${safe}
</title>

<desc id="desc">
تصویر حرفه‌ای و مینیمال با پس‌زمینه سفید برای ${safe}
</desc>

${common}

<rect
 width="800"
 height="540"
 rx="36"
 fill="#fff"
/>

${art}

<text
 x="400"
 y="505"
 text-anchor="middle"
 font-family="Tahoma,Arial,sans-serif"
 font-size="22"
 font-weight="700"
 fill="#334155"
>
${safe}
</text>

</svg>`;
}


// =============================================================
// FIXED SEO IMAGE PATH
// =============================================================
function seoImagePath(kind){

  return `/images/abzarak-${encodeURIComponent(kind)}.svg`;

}


function createSeoImage(data){

  const src=
    seoImagePath(
      data.imageKind
    );


  return `
  <figure class="seo-image-wrap">

    <img
      class="seo-image"
      src="${src}"
      alt="${escapeSeoHtml(data.imageTitle)}"
      width="800"
      height="540"
      loading="eager"
      decoding="async"
    >

    <figcaption>
      ${escapeSeoHtml(data.imageTitle)}
    </figcaption>

  </figure>`;

}


function breadcrumbSchema(path,h1){

  return {
    "@type":"BreadcrumbList",

    itemListElement:[
      {
        "@type":"ListItem",
        position:1,
        name:"ابزارک AI",
        item:BASE_URL+"/"
      },

      {
        "@type":"ListItem",
        position:2,
        name:h1,
        item:BASE_URL+path
      }
    ]
  };

}


function pageSchema(path,data){

  return {
    "@context":"https://schema.org",

    "@graph":[

      {
        "@type":"WebPage",

        "@id":
          BASE_URL+
          path+
          "#webpage",

        url:
          BASE_URL+
          path,

        name:
          data.title,

        description:
          data.description,

        inLanguage:
          "fa-IR",

        isPartOf:{
          "@id":
            BASE_URL+
            "/#website"
        },

        primaryImageOfPage:{
          "@type":"ImageObject",

          url:
            BASE_URL+
            seoImagePath(
              data.imageKind
            ),

          width:800,
          height:540
        },

        dateModified:
          data.updated
      },


      {
        "@type":"WebSite",

        "@id":
          BASE_URL+
          "/#website",

        url:
          BASE_URL+"/",

        name:"ابزارک AI",

        description:
          "دستیار هوش مصنوعی فارسی"
      },


      breadcrumbSchema(
        path,
        data.h1
      )

    ]
  };

}


function renderSeoPage(path,data){

  const canonical=
    BASE_URL+
    path;


  const sections=
    (data.sections||[])
      .map((s,i)=>{

        const bullets=
          Array.isArray(s.bullets)&&
          s.bullets.length

          ?`<ul>${
              s.bullets
                .map(
                  x=>
                    `<li>${escapeSeoHtml(x)}</li>`
                )
                .join("")
            }</ul>`

          :"";


        return `
        <section class="seo-card">

          <span class="section-number">
            ${String(i+1).padStart(2,"0")}
          </span>

          <h2>
            ${escapeSeoHtml(s.title)}
          </h2>

          <p>
            ${escapeSeoHtml(s.text||"")}
          </p>

          ${bullets}

        </section>`;

      })
      .join("");


  const related=
    Object.entries(SEO_PAGES)
      .filter(
        ([p])=>p!==path
      )
      .map(
        ([p,v])=>{

          const icon=
            v.imageKind==="code"
              ?"</>"

              :v.imageKind==="ideas"
              ?"✦"

              :v.imageKind==="translate"
              ?"文"

              :v.imageKind==="summary"
              ?"≡"

              :"AI";


          return `
          <a
            class="seo-link"
            href="${p}"
          >

            <span
              class="related-icon"
            >
              ${escapeSeoHtml(icon)}
            </span>

            <span>

              <b>
                ${escapeSeoHtml(v.h1)}
              </b>

              <small>
                ${escapeSeoHtml(
                  v.description.slice(0,90)
                )}
              </small>

            </span>

          </a>`;

        }
      )
      .join("");


  const schema=
    jsonLd(
      pageSchema(
        path,
        data
      )
    );


  const [
    accent,
    accent2,
    soft
  ]=
    IMAGE_THEMES[
      data.imageKind
    ]||
    IMAGE_THEMES.assistant;


  return `<!doctype html>

<html lang="fa" dir="rtl">

<head>

<meta charset="UTF-8">

<meta
 name="viewport"
 content="width=device-width,initial-scale=1"
>

<title>
${escapeSeoHtml(data.title)}
</title>

<meta
 name="description"
 content="${escapeSeoHtml(data.description)}"
>

<meta
 name="robots"
 content="index,follow,max-image-preview:large"
>

<link
 rel="canonical"
 href="${canonical}"
>

<meta
 property="og:type"
 content="website"
>

<meta
 property="og:locale"
 content="fa_IR"
>

<meta
 property="og:title"
 content="${escapeSeoHtml(data.title)}"
>

<meta
 property="og:description"
 content="${escapeSeoHtml(data.description)}"
>

<meta
 property="og:url"
 content="${canonical}"
>

<meta
 property="og:site_name"
 content="ابزارک AI"
>

<meta
 property="og:image"
 content="${
   BASE_URL+
   seoImagePath(
     data.imageKind
   )
 }"
>

<meta
 property="og:image:width"
 content="800"
>

<meta
 property="og:image:height"
 content="540"
>

<meta
 name="twitter:card"
 content="summary_large_image"
>

<meta
 name="twitter:title"
 content="${escapeSeoHtml(data.title)}"
>

<meta
 name="twitter:description"
 content="${escapeSeoHtml(data.description)}"
>

<meta
 name="twitter:image"
 content="${
   BASE_URL+
   seoImagePath(
     data.imageKind
   )
 }"
>

<script
 type="application/ld+json"
>
${schema}
</script>


<style>

:root{
 --accent:${accent};
 --accent2:${accent2};
 --soft:${soft};
 --ink:#0f172a;
 --muted:#64748b;
 --line:#e2e8f0;
 --card:#fff;
 --page:#fff
}

*{
 box-sizing:border-box
}

html{
 scroll-behavior:smooth
}

body{
 margin:0;
 font-family:Tahoma,"Vazirmatn",Arial,sans-serif;
 background:#fff;
 color:var(--ink);
 direction:rtl
}

.seo-wrap{
 max-width:1060px;
 margin:auto;
 padding:22px 20px
}

.seo-header{
 display:flex;
 align-items:center;
 justify-content:space-between;
 gap:14px;
 padding:8px 0 26px;
 border-bottom:1px solid var(--line)
}

.seo-logo{
 display:flex;
 align-items:center;
 gap:10px;
 text-decoration:none;
 font-size:20px;
 font-weight:900
}

.seo-logo-icon{
 width:38px;
 height:38px;
 border-radius:12px;
 display:flex;
 align-items:center;
 justify-content:center;
 background:linear-gradient(
   135deg,
   var(--accent),
   var(--accent2)
 );
 color:#fff;
 box-shadow:
   0 8px 20px rgba(15,23,42,.1)
}

.seo-nav{
 display:flex;
 gap:8px;
 flex-wrap:wrap
}

.seo-btn{
 display:inline-block;
 padding:11px 17px;
 border-radius:13px;
 text-decoration:none;
 font-weight:800;
 background:linear-gradient(
   135deg,
   var(--accent),
   var(--accent2)
 );
 color:#fff;
 box-shadow:
   0 8px 22px rgba(15,23,42,.08)
}

.seo-btn.secondary{
 background:#fff;
 color:var(--ink);
 border:1px solid var(--line);
 box-shadow:none
}

.seo-breadcrumb{
 font-size:12px;
 color:#94a3b8;
 margin-top:16px
}

.seo-breadcrumb a{
 color:#64748b;
 text-decoration:none
}

.seo-hero{
 text-align:center;
 padding:52px 0 24px
}

.seo-kicker{
 display:inline-flex;
 align-items:center;
 gap:8px;
 padding:8px 13px;
 background:var(--soft);
 border-radius:999px;
 color:var(--accent);
 font-weight:800;
 font-size:13px
}

.seo-hero h1{
 font-size:42px;
 line-height:1.5;
 margin:16px auto 12px;
 max-width:850px;
 letter-spacing:-.4px
}

.seo-hero p{
 max-width:820px;
 margin:0 auto 24px;
 color:#475569;
 line-height:2.05;
 font-size:17px
}

.hero-actions{
 display:flex;
 justify-content:center;
 gap:10px;
 flex-wrap:wrap
}

.seo-image-wrap{
 margin:30px auto 22px;
 max-width:800px
}

.seo-image{
 display:block;
 width:100%;
 height:auto;
 border:1px solid var(--line);
 border-radius:28px;
 box-shadow:
   0 18px 55px rgba(15,23,42,.08)
}

.seo-image-wrap figcaption{
 text-align:center;
 color:#94a3b8;
 font-size:12px;
 margin-top:10px
}

.seo-card{
 position:relative;
 background:#fff;
 border:1px solid var(--line);
 border-radius:22px;
 padding:30px 30px 28px;
 margin:16px 0;
 box-shadow:
   0 12px 34px rgba(15,23,42,.045)
}

.seo-card:before{
 content:"";
 position:absolute;
 right:0;
 top:0;
 width:5px;
 height:100%;
 border-radius:0 22px 22px 0;
 background:linear-gradient(
   180deg,
   var(--accent),
   var(--accent2)
 )
}

.section-number{
 display:inline-flex;
 align-items:center;
 justify-content:center;
 min-width:42px;
 height:28px;
 padding:0 8px;
 border-radius:999px;
 background:var(--soft);
 color:var(--accent);
 font-size:12px;
 font-weight:900
}

.seo-card h2{
 margin:12px 0 9px;
 font-size:23px;
 line-height:1.6
}

.seo-card p{
 margin:0;
 color:#475569;
 line-height:2.1;
 font-size:15.5px
}

.seo-card ul{
 margin:15px 0 0;
 padding-right:20px
}

.seo-card li{
 color:#334155;
 line-height:2;
 margin:5px 0
}

.seo-cta{
 margin:34px 0;
 padding:38px 24px;
 border-radius:26px;
 background:linear-gradient(
   135deg,
   var(--soft),
   #fff
 );
 border:1px solid var(--line);
 text-align:center
}

.seo-cta h2{
 margin:0 0 9px;
 font-size:27px
}

.seo-cta p{
 color:#64748b;
 line-height:2;
 margin:0 auto 18px;
 max-width:650px
}

.seo-links{
 display:grid;
 grid-template-columns:
   repeat(
     auto-fit,
     minmax(250px,1fr)
   );
 gap:12px
}

.seo-link{
 display:flex;
 align-items:flex-start;
 gap:12px;
 padding:15px;
 background:#fff;
 border:1px solid var(--line);
 border-radius:16px;
 text-decoration:none;
 transition:.15s
}

.seo-link:hover{
 transform:translateY(-2px);
 border-color:var(--accent)
}

.related-icon{
 flex:0 0 40px;
 width:40px;
 height:40px;
 border-radius:12px;
 display:flex;
 align-items:center;
 justify-content:center;
 background:var(--soft);
 color:var(--accent);
 font-weight:900
}

.seo-link b{
 display:block;
 font-size:14px;
 line-height:1.6
}

.seo-link small{
 display:block;
 color:#94a3b8;
 line-height:1.8;
 margin-top:3px
}

.seo-footer{
 border-top:1px solid var(--line);
 text-align:center;
 color:#94a3b8;
 font-size:13px;
 padding:28px 0 10px;
 margin-top:34px
}

.seo-footer a{
 color:#64748b;
 text-decoration:none
}

.seo-footer a:hover{
 color:var(--accent)
}

@media(max-width:640px){

 .seo-wrap{
   padding:16px
 }

 .seo-header{
   align-items:flex-start
 }

 .seo-hero{
   padding-top:34px
 }

 .seo-hero h1{
   font-size:29px
 }

 .seo-hero p{
   font-size:15px
 }

 .seo-card{
   padding:24px 22px
 }

 .seo-card h2{
   font-size:20px
 }

 .seo-nav .seo-btn.secondary{
   display:none
 }

 .seo-image{
   border-radius:20px
 }

}

</style>

</head>

<body>

<div class="seo-wrap">

<header class="seo-header">

<a
 href="/"
 class="seo-logo"
>

<span class="seo-logo-icon">
🤖
</span>

ابزارک AI

</a>


<nav class="seo-nav">

<a
 href="/"
 class="seo-btn secondary"
>
صفحه اصلی
</a>

<a
 href="/chat-ai"
 class="seo-btn"
>
شروع گفتگو
</a>

</nav>

</header>


<div class="seo-breadcrumb">

<a href="/">
ابزارک AI
</a>

←

${escapeSeoHtml(data.h1)}

</div>


<main>

<section class="seo-hero">

<div class="seo-kicker">
✦ هوش مصنوعی فارسی
</div>

<h1>
${escapeSeoHtml(data.h1)}
</h1>

<p>
${escapeSeoHtml(data.intro)}
</p>

${createSeoImage(data)}


<div class="hero-actions">

<a
 href="/"
 class="seo-btn"
>
همین حالا امتحان کن
</a>

<a
 href="/ai-tools"
 class="seo-btn secondary"
>
مشاهده کاربردها
</a>

</div>

</section>


${sections}


<section class="seo-cta">

<h2>
آماده‌ای خودت امتحانش کنی؟
</h2>

<p>
یک درخواست واقعی خودت را وارد کن و ببین ابزارک چطور می‌تواند در همان کار به تو کمک کند.
</p>

<a
 href="/"
 class="seo-btn"
>
شروع استفاده از ابزارک
</a>

</section>


<section class="seo-card">

<span class="section-number">
↗
</span>

<h2>
صفحات مرتبط ابزارک
</h2>

<div class="seo-links">

${related}

</div>

</section>

</main>


<footer class="seo-footer">

🤖 ابزارک AI — دستیار هوش مصنوعی فارسی

<br><br>

<a href="/faq">
سؤالات متداول
</a>

 ·

<a href="/">
صفحه اصلی
</a>

</footer>

</div>

</body>
</html>`;
}


// =============================================================
// FAQ PAGE
// =============================================================
function renderFaqPage(){

  const canonical=
    BASE_URL+
    "/faq";


  const faqHtml=
    FAQ_ITEMS
      .map(
        item=>`
          <section class="faq-item">

            <h2>
              ${escapeSeoHtml(item.q)}
            </h2>

            <p>
              ${escapeSeoHtml(item.a)}
            </p>

          </section>
        `
      )
      .join("");


  const schema=
    jsonLd({

      "@context":
        "https://schema.org",

      "@type":
        "WebPage",

      "name":
        "سؤالات متداول ابزارک AI | هوش مصنوعی فارسی",

      "url":
        canonical,

      "description":
        "پاسخ به سؤالات متداول درباره ابزارک AI، ورود، ثبت‌نام، استفاده رایگان، پلن‌ها و امکانات سرویس.",

      "inLanguage":
        "fa-IR"

    });


  return `<!doctype html>

<html
 lang="fa"
 dir="rtl"
>

<head>

<meta charset="UTF-8">

<meta
 name="viewport"
 content="width=device-width,initial-scale=1"
>

<title>
سؤالات متداول ابزارک AI | هوش مصنوعی فارسی
</title>

<meta
 name="description"
 content="پاسخ به سؤالات متداول درباره ابزارک AI، چت هوش مصنوعی فارسی، ثبت‌نام، ورود، استفاده رایگان، پلن‌ها و بازیابی رمز عبور."
>

<meta
 name="robots"
 content="index,follow"
>

<link
 rel="canonical"
 href="${canonical}"
>

<meta
 property="og:type"
 content="website"
>

<meta
 property="og:title"
 content="سؤالات متداول ابزارک AI"
>

<meta
 property="og:description"
 content="پاسخ به سؤالات متداول درباره ابزارک AI و امکانات آن."
>

<meta
 property="og:url"
 content="${canonical}"
>

<script
 type="application/ld+json"
>
${schema}
</script>


<style>

:root{
 --ink:#0f172a;
 --muted:#64748b;
 --line:#e2e8f0;
 --accent:#7c3aed;
 --soft:#f5f3ff
}

*{
 box-sizing:border-box
}

body{
 margin:0;
 font-family:Tahoma,"Vazirmatn",Arial,sans-serif;
 background:#fff;
 color:var(--ink);
 direction:rtl
}

.faq-wrap{
 max-width:980px;
 margin:auto;
 padding:22px 20px
}

.faq-header{
 display:flex;
 justify-content:space-between;
 align-items:center;
 gap:12px;
 padding-bottom:26px;
 border-bottom:1px solid var(--line)
}

.faq-logo{
 font-size:20px;
 font-weight:900;
 text-decoration:none
}

.faq-btn{
 display:inline-block;
 padding:11px 17px;
 border-radius:13px;
 text-decoration:none;
 background:linear-gradient(
   135deg,
   #7c3aed,
   #2563eb
 );
 color:#fff;
 font-weight:800
}

.faq-hero{
 text-align:center;
 padding:48px 0 24px
}

.faq-hero h1{
 font-size:38px;
 line-height:1.5;
 margin:0 0 12px
}

.faq-hero p{
 color:var(--muted);
 line-height:2;
 max-width:750px;
 margin:0 auto
}

.faq-image{
 margin:26px auto;
 max-width:800px;
 border:1px solid var(--line);
 border-radius:28px;
 background:#fff;
 box-shadow:
   0 18px 55px rgba(15,23,42,.07);
 padding:16px
}

.faq-image img{
 width:100%;
 display:block;
 border-radius:20px
}

.faq-item{
 background:#fff;
 border:1px solid var(--line);
 border-radius:20px;
 padding:23px;
 margin:14px 0;
 box-shadow:
   0 9px 28px rgba(15,23,42,.035)
}

.faq-item h2{
 font-size:19px;
 line-height:1.7;
 margin:0 0 8px
}

.faq-item p{
 color:#475569;
 line-height:2;
 margin:0
}

.faq-cta{
 text-align:center;
 margin:32px 0;
 padding:31px;
 border:1px solid #ddd6fe;
 border-radius:22px;
 background:linear-gradient(
   135deg,
   #faf5ff,
   #fff
 )
}

.faq-cta p{
 color:var(--muted);
 line-height:2
}

.faq-footer{
 text-align:center;
 color:#94a3b8;
 border-top:1px solid var(--line);
 padding:28px 0
}

@media(max-width:640px){

 .faq-wrap{
   padding:16px
 }

 .faq-hero h1{
   font-size:28px
 }

 .faq-header .faq-btn{
   font-size:13px;
   padding:9px 12px
 }

}

</style>

</head>

<body>

<div class="faq-wrap">

<header class="faq-header">

<a
 href="/"
 class="faq-logo"
>
🤖 ابزارک AI
</a>

<a
 href="/"
 class="faq-btn"
>
شروع استفاده
</a>

</header>


<main>

<section class="faq-hero">

<h1>
سؤالات متداول ابزارک AI
</h1>

<p>
پاسخ به پرسش‌های رایج درباره چت هوش مصنوعی فارسی،
ثبت‌نام، ورود، استفاده رایگان، پلن‌ها و امکانات ابزارک.
</p>


<div class="faq-image">

<img
 src="/images/abzarak-assistant.svg"
 alt="دستیار هوش مصنوعی فارسی ابزارک"
 width="800"
 height="540"
 loading="eager"
>

</div>

</section>


${faqHtml}


<section class="faq-cta">

<h2>
آماده‌ای امتحانش کنی؟
</h2>

<p>
برای استفاده از ابزارک یک حساب رایگان بساز یا وارد حساب فعال خود شو.
</p>

<a
 href="/"
 class="faq-btn"
>
ثبت‌نام یا ورود
</a>

</section>

</main>


<footer class="faq-footer">
🤖 ابزارک AI — دستیار هوش مصنوعی فارسی
</footer>

</div>

</body>
</html>`;
}


// =============================================================
// ROBOTS + SITEMAP
// =============================================================
function robotsTxt(){

  return `User-agent: *
Allow: /
Sitemap: ${BASE_URL}/sitemap.xml
`;

}


function sitemapXml(){

  const paths=[
    "/",
    ...Object.keys(SEO_PAGES),
    "/faq"
  ];


  return `<?xml version="1.0" encoding="UTF-8"?>

<urlset
 xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>

${paths.map(path=>{

  const d=
    SEO_PAGES[path];


  const last=
    d?.updated||
    "2026-10-01";


  return `
<url>

<loc>
${escapeXml(BASE_URL+path)}
</loc>

<lastmod>
${last}
</lastmod>

</url>`;

}).join("")}

</urlset>`;

}


// =============================================================
// RESPONSE HELPERS
// =============================================================
function json(data,status=200){

  return new Response(
    JSON.stringify(data),
    {
      status,

      headers:{
        "Content-Type":
          "application/json; charset=utf-8",

        "Cache-Control":
          "no-store"
      }
    }
  );

}


function html(data,status=200){

  return new Response(
    data,
    {
      status,

      headers:{
        "Content-Type":
          "text/html; charset=utf-8",

        "Cache-Control":
          "no-store"
      }
    }
  );

}


function plainText(data,status=200){

  return new Response(
    data,
    {
      status,

      headers:{
        "Content-Type":
          "text/plain; charset=utf-8"
      }
    }
  );

}


function xml(data,status=200){

  return new Response(
    data,
    {
      status,

      headers:{
        "Content-Type":
          "application/xml; charset=utf-8",

        "Cache-Control":
          "public,max-age=3600"
      }
    }
  );

}


function cors(response){

  const h=
    new Headers(
      response.headers
    );


  h.set(
    "Access-Control-Allow-Origin",
    "*"
  );


  h.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );


  h.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );


  h.set(
    "Access-Control-Max-Age",
    "86400"
  );


  return new Response(
    response.body,
    {
      status:
        response.status,

      statusText:
        response.statusText,

      headers:h
    }
  );

}


async function bodyJson(request){

  try{

    return await request.json();

  }catch{

    return {};

  }

}


function randomHex(bytes=32){

  const data=
    new Uint8Array(bytes);


  crypto.getRandomValues(
    data
  );


  return Array
    .from(data)
    .map(
      x=>
        x.toString(16)
         .padStart(2,"0")
    )
    .join("");

}


function randomCode(){

  const d=
    new Uint32Array(1);


  crypto.getRandomValues(
    d
  );


  return String(
    100000+
    (d[0]%900000)
  );

}


async function hashPassword(password){

  const data=
    new TextEncoder().encode(
      String(password)
    );


  const hash=
    await crypto.subtle.digest(
      "SHA-256",
      data
    );


  return Array
    .from(
      new Uint8Array(hash)
    )
    .map(
      x=>
        x.toString(16)
         .padStart(2,"0")
    )
    .join("");

}


function base64url(data){

  let binary;


  if(
    typeof data==="string"
  ){

    binary=
      btoa(data);

  }else{

    binary=
      btoa(
        String.fromCharCode(
          ...data
        )
      );

  }


  return binary
    .replaceAll("+","-")
    .replaceAll("/","_")
    .replaceAll("=","");

}


function decodeBase64url(v){

  v=
    v
      .replaceAll("-","+")
      .replaceAll("_","/");


  while(
    v.length%4
  ){

    v+="=";

  }


  return atob(v);

}


async function hmacSign(
  value,
  secret
){

  const key=
    await crypto.subtle.importKey(
      "raw",

      new TextEncoder().encode(
        secret
      ),

      {
        name:"HMAC",
        hash:"SHA-256"
      },

      false,

      ["sign"]
    );


  const sig=
    await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(
        value
      )
    );


  return base64url(
    new Uint8Array(sig)
  );

}


async function createToken(
  payload,
  secret
){

  const enc=
    base64url(
      JSON.stringify(payload)
    );


  return enc+
    "."+
    await hmacSign(
      enc,
      secret
    );

}


async function verifyToken(
  token,
  secret
){

  if(!token||!secret)return null;


  const parts=
    token.split(".");


  if(parts.length!==2){
    return null;
  }


  const expected=
    await hmacSign(
      parts[0],
      secret
    );


  if(
    parts[1]!==expected
  ){

    return null;

  }


  try{

    const payload=
      JSON.parse(
        decodeBase64url(
          parts[0]
        )
      );


    if(
      payload.exp&&
      Date.now()>Number(
        payload.exp
      )
    ){

      return null;

    }


    return payload;

  }catch{

    return null;

  }

}


function bearerToken(request){

  const auth=
    request.headers.get(
      "Authorization"
    );


  if(
    !auth||
    !auth
      .toLowerCase()
      .startsWith("bearer ")
  ){

    return "";

  }


  return auth
    .slice(7)
    .trim();

}


// =============================================================
// AUTH SECRET
// - Prefer JWT_SECRET
// - Legacy fallback to ADMIN_PASSWORD preserved
// - No hardcoded public default secret
// =============================================================
function getAuthSecret(env){

  const jwtSecret=
    String(
      env.JWT_SECRET||
      ""
    )
    .trim();


  if(jwtSecret){

    return jwtSecret;

  }


  return String(
    env.ADMIN_PASSWORD||
    ""
  )
  .trim();

}


function authSecretConfigured(env){

  return !!getAuthSecret(env);

}


function today(){

  return new Date()
    .toISOString()
    .slice(0,10);

}


function addDays(days){

  return new Date(
    Date.now()+
    days*86400000
  ).toISOString();

}


// =============================================================
// PLANS — UNCHANGED
// =============================================================
const PLAN_PRICES={

  basic:400000,
  standard:1000000,
  pro:2000000,
  special:3000000

};


const PLAN_USD={

  basic:5,
  standard:10,
  pro:15,
  special:20

};


const PLAN_NAMES={

  basic:"Basic",
  standard:"Standard",
  pro:"Pro",
  special:"Special"

};


const PLAN_FEATURES={

  basic:[
    "استفاده بیشتر از هوش مصنوعی",
    "گفتگو با دستیار هوشمند",
    "پشتیبانی چندزبانه"
  ],

  standard:[
    "استفاده گسترده‌تر از هوش مصنوعی",
    "گفتگو و تولید محتوا",
    "ترجمه و بازنویسی",
    "پشتیبانی چندزبانه"
  ],

  pro:[
    "استفاده حرفه‌ای از هوش مصنوعی",
    "تولید و بازنویسی متن",
    "ترجمه",
    "ایده‌پردازی و خلاصه‌سازی",
    "دسترسی گسترده"
  ],

  special:[
    "استفاده ویژه از هوش مصنوعی",
    "تمام امکانات حرفه‌ای",
    "استفاده گسترده",
    "پشتیبانی چندزبانه"
  ]

};


// =============================================================
// DATABASE
// =============================================================
let dbReady=false;
let dbInitPromise=null;


async function tableColumns(
  env,
  table
){

  const info=
    await env.DB
      .prepare(
        `PRAGMA table_info(${table})`
      )
      .all();


  return new Set(
    (info.results||[])
      .map(
        r=>
          String(
            r.name||""
          )
      )
  );

}


async function addColumnIfMissing(
  env,
  table,
  columns,
  name,
  definition
){

  if(
    columns.has(name)
  ){

    return;

  }


  await env.DB.prepare(
    `ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`
  ).run();


  columns.add(name);

}


async function migrateUsersTable(env){

  await env.DB.prepare(`

    CREATE TABLE IF NOT EXISTS users(

      id TEXT PRIMARY KEY,

      name TEXT NOT NULL,

      email TEXT NOT NULL UNIQUE,

      password_hash TEXT NOT NULL,

      balance INTEGER NOT NULL DEFAULT 0,

      created_at TEXT NOT NULL

    )

  `).run();


  const columns=
    await tableColumns(
      env,
      "users"
    );


  await addColumnIfMissing(
    env,
    "users",
    columns,
    "name",
    `TEXT NOT NULL DEFAULT 'کاربر'`
  );


  await addColumnIfMissing(
    env,
    "users",
    columns,
    "email",
    `TEXT NOT NULL DEFAULT ''`
  );


  await addColumnIfMissing(
    env,
    "users",
    columns,
    "password_hash",
    `TEXT NOT NULL DEFAULT ''`
  );


  await addColumnIfMissing(
    env,
    "users",
    columns,
    "balance",
    `INTEGER NOT NULL DEFAULT 0`
  );


  await addColumnIfMissing(
    env,
    "users",
    columns,
    "created_at",
    `TEXT NOT NULL DEFAULT ''`
  );

}


async function migratePaymentsTable(env){

  const info=
    await env.DB
      .prepare(
        `PRAGMA table_info(payments)`
      )
      .all();


  const cols=
    new Set(
      (info.results||[])
        .map(
          r=>
            String(
              r.name||""
            )
        )
    );


  const adds=[

    ["user_id","TEXT"],

    ["plan_id","TEXT"],

    ["amount_toman","INTEGER"],

    ["authority","TEXT"],

    ["status","TEXT DEFAULT 'pending'"],

    ["created_at","TEXT"],

    ["paid_at","TEXT"]

  ];


  for(
    const [c,type]
    of adds
  ){

    if(!cols.has(c)){

      try{

        await env.DB.prepare(
          `ALTER TABLE payments ADD COLUMN ${c} ${type}`
        ).run();

      }catch(e){

        console.error(
          "PAYMENTS COLUMN MIGRATION ERROR:",
          c,
          e?.message||String(e)
        );

      }

    }

  }


  try{

    await env.DB.prepare(
      `UPDATE payments
       SET status='pending'
       WHERE status IS NULL`
    ).run();

  }catch(e){

    console.error(
      "PAYMENTS STATUS MIGRATION ERROR:",
      e?.message||String(e)
    );

  }

}


// =============================================================
// PASSWORD RESET MIGRATION
// =============================================================
async function migratePasswordResetsTable(env){

  await env.DB.prepare(`

    CREATE TABLE IF NOT EXISTS password_resets(

      id TEXT PRIMARY KEY,

      user_id TEXT NOT NULL,

      code_hash TEXT NOT NULL,

      expires_at TEXT NOT NULL,

      used INTEGER NOT NULL DEFAULT 0,

      created_at TEXT NOT NULL,

      attempts INTEGER NOT NULL DEFAULT 0

    )

  `).run();


  const columns=
    await tableColumns(
      env,
      "password_resets"
    );


  await addColumnIfMissing(
    env,
    "password_resets",
    columns,
    "attempts",
    `INTEGER NOT NULL DEFAULT 0`
  );

}


// =============================================================
// SUBSCRIPTIONS MIGRATION
// =============================================================
async function migrateSubscriptionsTable(env){

  const columns=
    await tableColumns(
      env,
      "subscriptions"
    );


  await addColumnIfMissing(
    env,
    "subscriptions",
    columns,
    "payment_id",
    `TEXT`
  );


  try{

    await env.DB.prepare(`

      CREATE UNIQUE INDEX IF NOT EXISTS
      idx_subscriptions_payment_id

      ON subscriptions(payment_id)

      WHERE payment_id IS NOT NULL

    `).run();

  }catch(e){

    console.error(
      "SUBSCRIPTIONS INDEX MIGRATION ERROR:",
      e?.message||String(e)
    );

  }

}


async function initDatabase(env){

  if(!env.DB){

    throw new Error(
      "D1 binding DB تنظیم نشده است."
    );

  }


  if(dbReady){

    return;

  }


  if(dbInitPromise){

    return dbInitPromise;

  }


  dbInitPromise=
    (async()=>{

      await migrateUsersTable(env);


      await env.DB.prepare(`

        CREATE TABLE IF NOT EXISTS plans(

          id TEXT PRIMARY KEY,

          name TEXT NOT NULL,

          price_toman INTEGER NOT NULL,

          price_usd REAL NOT NULL,

          features TEXT NOT NULL

        )

      `).run();


      await env.DB.prepare(`

        CREATE TABLE IF NOT EXISTS subscriptions(

          id TEXT PRIMARY KEY,

          user_id TEXT NOT NULL,

          plan_id TEXT NOT NULL,

          starts_at TEXT NOT NULL,

          expires_at TEXT NOT NULL,

          status TEXT NOT NULL DEFAULT 'active',

          payment_id TEXT

        )

      `).run();


      await migrateSubscriptionsTable(
        env
      );


      await env.DB.prepare(`

        CREATE TABLE IF NOT EXISTS usage(

          id TEXT PRIMARY KEY,

          user_id TEXT NOT NULL,

          usage_date TEXT NOT NULL,

          used INTEGER NOT NULL DEFAULT 0,

          UNIQUE(user_id,usage_date)

        )

      `).run();


      await migratePasswordResetsTable(
        env
      );


      await env.DB.prepare(`

        CREATE TABLE IF NOT EXISTS payments(

          id TEXT PRIMARY KEY,

          user_id TEXT NOT NULL,

          plan_id TEXT NOT NULL,

          amount_toman INTEGER NOT NULL,

          authority TEXT,

          status TEXT NOT NULL DEFAULT 'pending',

          created_at TEXT,

          paid_at TEXT

        )

      `).run();


      await migratePaymentsTable(
        env
      );


      await env.DB.prepare(`

        CREATE TABLE IF NOT EXISTS payments_v2(

          id TEXT PRIMARY KEY,

          user_id TEXT NOT NULL,

          plan_id TEXT NOT NULL,

          amount_toman INTEGER NOT NULL,

          authority TEXT,

          status TEXT NOT NULL DEFAULT 'pending',

          created_at TEXT NOT NULL,

          paid_at TEXT

        )

      `).run();


      try{

        await env.DB.prepare(`

          CREATE UNIQUE INDEX IF NOT EXISTS
          idx_payments_v2_authority

          ON payments_v2(authority)

          WHERE authority IS NOT NULL

        `).run();

      }catch(e){

        console.error(
          "PAYMENTS V2 INDEX MIGRATION ERROR:",
          e?.message||String(e)
        );

      }


      await env.DB.prepare(`

        CREATE TABLE IF NOT EXISTS withdrawals(

          id TEXT PRIMARY KEY,

          user_id TEXT NOT NULL,

          amount INTEGER NOT NULL,

          method TEXT NOT NULL,

          destination TEXT NOT NULL,

          status TEXT NOT NULL DEFAULT 'pending',

          created_at TEXT NOT NULL,

          processed_at TEXT

        )

      `).run();


      await env.DB.prepare(`

        CREATE TABLE IF NOT EXISTS admin_sessions(

          id TEXT PRIMARY KEY,

          created_at TEXT NOT NULL

        )

      `).run();


      for(
        const id
        of Object.keys(PLAN_PRICES)
      ){

        await env.DB.prepare(`

          INSERT OR IGNORE INTO plans
          (id,name,price_toman,price_usd,features)
          VALUES(?,?,?,?,?)

        `)
        .bind(
          id,
          PLAN_NAMES[id],
          PLAN_PRICES[id],
          PLAN_USD[id],
          JSON.stringify(
            PLAN_FEATURES[id]
          )
        )
        .run();


        await env.DB.prepare(`

          UPDATE plans

          SET
            name=?,
            price_toman=?,
            price_usd=?,
            features=?

          WHERE id=?

        `)
        .bind(
          PLAN_NAMES[id],
          PLAN_PRICES[id],
          PLAN_USD[id],
          JSON.stringify(
            PLAN_FEATURES[id]
          ),
          id
        )
        .run();

      }


      dbReady=true;

    })()
    .catch(error=>{

      dbInitPromise=null;
      dbReady=false;

      throw error;

    });


  return dbInitPromise;

}


// =============================================================
// AUTH CORE
// =============================================================
async function requireUser(
  request,
  env
){

  const token=
    bearerToken(request);


  if(
    !token||
    !authSecretConfigured(env)
  ){

    return null;

  }


  const payload=
    await verifyToken(
      token,
      getAuthSecret(env)
    );


  if(!payload?.userId){

    return null;

  }


  const user=
    await env.DB
      .prepare(
        `SELECT *
         FROM users
         WHERE id=?
         LIMIT 1`
      )
      .bind(
        payload.userId
      )
      .first();


  return user||null;

}


async function requireAdmin(
  request,
  env
){

  const token=
    bearerToken(request);


  if(
    !token||
    !authSecretConfigured(env)
  ){

    return false;

  }


  const payload=
    await verifyToken(
      token,
      getAuthSecret(env)
    );


  return !!(
    payload&&
    payload.admin===true
  );

}


// =============================================================
// USAGE / SUBSCRIPTION
// =============================================================
async function getUsage(
  env,
  userId
){

  const date=
    today();


  let row=
    await env.DB
      .prepare(`
        SELECT *
        FROM usage
        WHERE user_id=?
        AND usage_date=?
        LIMIT 1
      `)
      .bind(
        userId,
        date
      )
      .first();


  if(!row){

    try{

      await env.DB.prepare(`

        INSERT INTO usage
        (id,user_id,usage_date,used)

        VALUES(?,?,?,0)

      `)
      .bind(
        randomHex(16),
        userId,
        date
      )
      .run();

    }catch(e){

      console.error(
        "USAGE INSERT ERROR:",
        e?.message||String(e)
      );

    }


    row=
      await env.DB
        .prepare(`
          SELECT *
          FROM usage
          WHERE user_id=?
          AND usage_date=?
          LIMIT 1
        `)
        .bind(
          userId,
          date
        )
        .first();

  }


  return row||{
    used:0
  };

}


// =============================================================
// ATOMIC FREE USAGE RESERVATION
// =============================================================
async function reserveFreeUsage(
  env,
  userId
){

  const date=
    today();


  await getUsage(
    env,
    userId
  );


  const result=
    await env.DB
      .prepare(`
        UPDATE usage

        SET used=used+1

        WHERE
          user_id=?

          AND usage_date=?

          AND used < ?

      `)
      .bind(
        userId,
        date,
        FREE_DAILY_LIMIT
      )
      .run();


  if(
    result.meta?.changes!==1
  ){

    return{
      ok:false,
      used:
        Number(
          (
            await getUsage(
              env,
              userId
            )
          )?.used||FREE_DAILY_LIMIT
        )
    };

  }


  const usage=
    await getUsage(
      env,
      userId
    );


  return{
    ok:true,
    used:
      Number(
        usage?.used||0
      )
  };

}


async function releaseFreeUsage(
  env,
  userId
){

  try{

    await env.DB
      .prepare(`
        UPDATE usage

        SET used=
          CASE
            WHEN used>0 THEN used-1
            ELSE 0
          END

        WHERE
          user_id=?
          AND usage_date=?
      `)
      .bind(
        userId,
        today()
      )
      .run();

  }catch(e){

    console.error(
      "USAGE RELEASE ERROR:",
      e?.message||String(e)
    );

  }

}


async function getSubscription(
  env,
  userId
){

  return await env.DB
    .prepare(`
      SELECT
        s.*,
        p.name plan_name,
        p.price_toman,
        p.price_usd,
        p.features

      FROM subscriptions s

      LEFT JOIN plans p
        ON p.id=s.plan_id

      WHERE
        s.user_id=?
        AND s.status='active'
        AND s.expires_at>?

      ORDER BY s.expires_at DESC

      LIMIT 1
    `)
    .bind(
      userId,
      new Date().toISOString()
    )
    .first();

}


// =============================================================
// RESEND / PASSWORD RESET
// =============================================================
async function sendRecoveryEmail(
  env,
  email,
  code
){

  if(!env.RESEND_API_KEY){

    return{
      ok:false,
      status:500,
      error:
        "سرویس ایمیل تنظیم نشده است."
    };

  }


  if(!env.RESEND_FROM_EMAIL){

    return{
      ok:false,
      status:500,
      error:
        "آدرس ارسال ایمیل تنظیم نشده است."
    };

  }


  try{

    const response=
      await fetch(
        "https://api.resend.com/emails",
        {
          method:"POST",

          headers:{
            Authorization:
              "Bearer "+
              env.RESEND_API_KEY,

            "Content-Type":
              "application/json"
          },

          body:JSON.stringify({

            from:
              env.RESEND_FROM_EMAIL,

            to:[
              email
            ],

            subject:
              "کد بازیابی رمز عبور ابزارک",

            html:`

<!doctype html>

<html
 lang="fa"
 dir="rtl"
>

<body
 style="
 margin:0;
 padding:30px;
 background:#f6f8ff;
 font-family:Tahoma,Arial,sans-serif;
 direction:rtl
 "
>

<div
 style="
 max-width:560px;
 margin:auto;
 background:#fff;
 border-radius:20px;
 padding:30px;
 box-shadow:0 10px 40px rgba(15,23,42,.08)
 "
>

<h2 style="color:#1e1b4b">
🔐 بازیابی رمز عبور ابزارک
</h2>

<p
 style="
 color:#475569;
 line-height:2
 "
>
کد بازیابی رمز عبور شما:
</p>

<div
 style="
 font-size:36px;
 font-weight:900;
 letter-spacing:8px;
 text-align:center;
 padding:20px;
 border-radius:16px;
 background:#eef2ff;
 color:#3730a3
 "
>
${code}
</div>

<p
 style="
 color:#64748b;
 line-height:2
 "
>
این کد تا ۱۵ دقیقه معتبر است.
</p>

<p
 style="
 color:#64748b;
 line-height:2
 "
>
اگر این درخواست توسط شما انجام نشده است،
این ایمیل را نادیده بگیرید.
</p>

<hr
 style="
 border:0;
 border-top:1px solid #e5e7eb;
 margin:25px 0
 "
>

<div
 style="
 text-align:center;
 color:#64748b
 "
>
🤖 Abzarak AI
</div>

</div>

</body>

</html>

`

          })

        }

      );


    if(!response.ok){

      const responseText=
        await response.text();

      console.error(
        "RESEND ERROR:",
        response.status,
        responseText
      );


      return{
        ok:false,
        status:
          response.status,

        error:
          "ارسال ایمیل ناموفق بود."
      };

    }


    return{
      ok:true
    };


  }catch(e){

    console.error(
      "RESEND REQUEST ERROR:",
      e?.message||
      String(e)
    );


    return{
      ok:false,
      status:502,
      error:
        "ارتباط با سرویس ایمیل ناموفق بود."
    };

  }

}


// =============================================================
// PUBLIC REGISTER API
// =============================================================
async function registerApi(
  request,
  env
){

  try{

    if(!env.DB){

      return json(
        {
          error:
            "اتصال پایگاه داده D1 تنظیم نشده است."
        },
        500
      );

    }


    if(!authSecretConfigured(env)){

      return json(
        {
          error:
            "امنیت ورود در Worker تنظیم نشده است."
        },
        503
      );

    }


    const b=
      await bodyJson(
        request
      );


    const name=
      String(
        b.name||""
      )
      .trim();


    const email=
      String(
        b.email||""
      )
      .trim()
      .toLowerCase();


    const password=
      String(
        b.password||""
      );


    if(!name){

      return json(
        {
          error:
            "نام را وارد کنید."
        },
        400
      );

    }


    if(
      name.length<2||
      name.length>80
    ){

      return json(
        {
          error:
            "نام باید بین ۲ تا ۸۰ کاراکتر باشد."
        },
        400
      );

    }


    if(!email){

      return json(
        {
          error:
            "ایمیل را وارد کنید."
        },
        400
      );

    }


    if(
      email.length>160||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ){

      return json(
        {
          error:
            "ایمیل واردشده معتبر نیست."
        },
        400
      );

    }


    if(!password){

      return json(
        {
          error:
            "رمز عبور را وارد کنید."
        },
        400
      );

    }


    if(password.length<6){

      return json(
        {
          error:
            "رمز عبور باید حداقل ۶ کاراکتر باشد."
        },
        400
      );

    }


    if(password.length>200){

      return json(
        {
          error:
            "رمز عبور بیش از حد طولانی است."
        },
        400
      );

    }


    const exists=
      await env.DB
        .prepare(`
          SELECT
            id

          FROM users

          WHERE email=?

          LIMIT 1
        `)
        .bind(
          email
        )
        .first();


    if(exists){

      return json(
        {
          error:
            "این ایمیل قبلاً ثبت شده است. لطفاً وارد شوید."
        },
        409
      );

    }


    const userId=
      randomHex(16);


    const passwordHash=
      await hashPassword(
        password
      );


    const createdAt=
      new Date().toISOString();


    try{

      await env.DB
        .prepare(`

          INSERT INTO users
          (
            id,
            name,
            email,
            password_hash,
            balance,
            created_at
          )

          VALUES(
            ?,
            ?,
            ?,
            ?,
            0,
            ?
          )

        `)
        .bind(
          userId,
          name,
          email,
          passwordHash,
          createdAt
        )
        .run();

    }catch(insertError){

      const message=
        String(
          insertError?.message||
          ""
        )
        .toLowerCase();


      if(
        message.includes("unique")||
        message.includes("constraint")
      ){

        return json(
          {
            error:
              "این ایمیل قبلاً ثبت شده است. لطفاً وارد شوید."
          },
          409
        );

      }


      throw insertError;

    }


    const token=
      await createToken(
        {
          userId,

          exp:
            Date.now()+
            30*86400000

        },
        getAuthSecret(env)
      );


    return json({

      ok:true,

      token,

      user:{

        id:
          userId,

        name,

        email,

        balance:0

      },

      message:
        "حساب شما با موفقیت ساخته شد."

    });

  }catch(error){

    console.error(
      "REGISTER ERROR:",
      error?.message||
      String(error)
    );


    return json(
      {
        error:
          "ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید."
      },
      500
    );

  }

}


// =============================================================
// LOGIN API
// =============================================================
async function loginApi(
  request,
  env
){

  try{

    if(!env.DB){

      return json(
        {
          error:
            "اتصال پایگاه داده D1 تنظیم نشده است."
        },
        500
      );

    }


    if(!authSecretConfigured(env)){

      return json(
        {
          error:
            "امنیت ورود در Worker تنظیم نشده است."
        },
        503
      );

    }


    const b=
      await bodyJson(
        request
      );


    const email=
      String(
        b.email||""
      )
      .trim()
      .toLowerCase();


    const password=
      String(
        b.password||""
      );


    if(!email){

      return json(
        {
          error:
            "ایمیل را وارد کنید."
        },
        400
      );

    }


    if(!password){

      return json(
        {
          error:
            "رمز عبور را وارد کنید."
        },
        400
      );

    }


    const user=
      await env.DB
        .prepare(`
          SELECT
            id,
            name,
            email,
            password_hash,
            balance

          FROM users

          WHERE email=?

          LIMIT 1
        `)
        .bind(
          email
        )
        .first();


    if(!user){

      return json(
        {
          error:
            "ایمیل یا رمز عبور اشتباه است."
        },
        401
      );

    }


    const passwordHash=
      await hashPassword(
        password
      );


    if(
      passwordHash!==
      String(
        user.password_hash||""
      )
    ){

      return json(
        {
          error:
            "ایمیل یا رمز عبور اشتباه است."
        },
        401
      );

    }


    const token=
      await createToken(
        {
          userId:
            user.id,

          exp:
            Date.now()+
            30*86400000

        },
        getAuthSecret(env)
      );


    return json({

      ok:true,

      token

    });


  }catch(error){

    console.error(
      "LOGIN ERROR:",
      error?.message||
      String(error)
    );


    return json(
      {
        error:
          "ورود انجام نشد."
      },
      500
    );

  }

}


// =============================================================
// ME API
// =============================================================
async function meApi(
  request,
  env
){

  try{

    if(!env.DB){

      return json(
        {
          error:
            "اتصال پایگاه داده D1 تنظیم نشده است."
        },
        500
      );

    }


    const user=
      await requireUser(
        request,
        env
      );


    if(!user){

      return json(
        {
          error:
            "نشست نامعتبر یا منقضی شده است."
        },
        401
      );

    }


    let subscription=null;


    let usage={
      used:0
    };


    try{

      subscription=
        await getSubscription(
          env,
          user.id
        );

    }catch(e){

      console.error(
        "SUBSCRIPTION ERROR:",
        e?.message||
        String(e)
      );

    }


    try{

      usage=
        await getUsage(
          env,
          user.id
        );

    }catch(e){

      console.error(
        "USAGE ERROR:",
        e?.message||
        String(e)
      );

    }


    let sub=null;


    if(subscription){

      let features=[];


      try{

        features=
          JSON.parse(
            subscription.features||
            "[]"
          );

      }catch{}


      sub={

        plan_id:
          subscription.plan_id,

        expires_at:
          subscription.expires_at,

        plan:{

          id:
            subscription.plan_id,

          name:
            subscription.plan_name,

          features

        }

      };

    }


    return json({

      ok:true,

      user:{

        id:
          user.id,

        name:
          user.name,

        email:
          user.email,

        balance:
          Number(
            user.balance||0
          )

      },


      subscription:
        sub,


      usage:{

        used:
          Number(
            usage?.used||0
          ),

        limit:
          subscription
            ?999999999
            :FREE_DAILY_LIMIT

      }

    });


  }catch(error){

    console.error(
      "ME ERROR:",
      error?.message||
      String(error)
    );


    return json(
      {
        error:
          "دریافت اطلاعات حساب انجام نشد."
      },
      500
    );

  }

}


// =============================================================
// FORGOT PASSWORD API
// =============================================================
async function forgotPasswordApi(
  request,
  env
){

  try{

    const b=
      await bodyJson(
        request
      );


    const email=
      String(
        b.email||""
      )
      .trim()
      .toLowerCase();


    if(!email){

      return json(
        {
          error:
            "ایمیل را وارد کنید."
        },
        400
      );

    }


    const user=
      await env.DB
        .prepare(`
          SELECT
            id,
            email

          FROM users

          WHERE email=?

          LIMIT 1
        `)
        .bind(
          email
        )
        .first();


    if(!user){

      return json({

        message:
          "اگر این ایمیل در ابزارک ثبت شده باشد، کد بازیابی ارسال خواهد شد."

      });

    }


    const recent=
      await env.DB
        .prepare(`

          SELECT
            created_at

          FROM password_resets

          WHERE user_id=?

          ORDER BY created_at DESC

          LIMIT 1

        `)
        .bind(
          user.id
        )
        .first();


    if(recent?.created_at){

      const recentTime=
        new Date(
          recent.created_at
        ).getTime();


      if(
        Number.isFinite(recentTime)&&
        Date.now()-recentTime<60000
      ){

        return json({

          message:
            "کد بازیابی اخیراً ارسال شده است. لطفاً یک دقیقه بعد دوباره تلاش کنید."

        });

      }

    }


    const code=
      randomCode();


    const codeHash=
      await hashPassword(
        code
      );


    const id=
      randomHex(16);


    await env.DB
      .prepare(`

        UPDATE password_resets

        SET used=1

        WHERE user_id=?

        AND used=0

      `)
      .bind(
        user.id
      )
      .run();


    await env.DB
      .prepare(`

        INSERT INTO password_resets
        (
          id,
          user_id,
          code_hash,
          expires_at,
          used,
          created_at,
          attempts
        )

        VALUES(?,?,?,?,0,?,0)

      `)
      .bind(
        id,
        user.id,
        codeHash,
        new Date(
          Date.now()+
          15*60*1000
        ).toISOString(),

        new Date().toISOString()
      )
      .run();


    const mail=
      await sendRecoveryEmail(
        env,
        email,
        code
      );


    if(!mail.ok){

      return json(
        {
          error:
            mail.error
        },
        mail.status||500
      );

    }


    return json({

      ok:true,

      message:
        "کد بازیابی به ایمیل شما ارسال شد."

    });


  }catch(error){

    console.error(
      "FORGOT PASSWORD ERROR:",
      error?.message||
      String(error)
    );


    return json(
      {
        error:
          "خطا در درخواست بازیابی رمز عبور."
      },
      500
    );

  }

}


// =============================================================
// RESET PASSWORD API
// =============================================================
async function resetPasswordApi(
  request,
  env
){

  try{

    const b=
      await bodyJson(
        request
      );


    const email=
      String(
        b.email||""
      )
      .trim()
      .toLowerCase();


    const code=
      String(
        b.code||""
      )
      .trim();


    const newPassword=
      String(
        b.newPassword||""
      );


    if(!email||!code){

      return json(
        {
          error:
            "ایمیل و کد بازیابی الزامی است."
        },
        400
      );

    }


    if(
      newPassword.length<6
    ){

      return json(
        {
          error:
            "رمز جدید باید حداقل ۶ کاراکتر باشد."
        },
        400
      );

    }


    if(
      newPassword.length>200
    ){

      return json(
        {
          error:
            "رمز عبور بیش از حد طولانی است."
        },
        400
      );

    }


    const user=
      await env.DB
        .prepare(`
          SELECT id

          FROM users

          WHERE email=?

          LIMIT 1
        `)
        .bind(
          email
        )
        .first();


    if(!user){

      return json(
        {
          error:
            "کد بازیابی معتبر نیست."
        },
        400
      );

    }


    const reset=
      await env.DB
        .prepare(`
          SELECT *

          FROM password_resets

          WHERE user_id=?

          AND used=0

          ORDER BY created_at DESC

          LIMIT 1
        `)
        .bind(
          user.id
        )
        .first();


    if(!reset){

      return json(
        {
          error:
            "کد بازیابی معتبر نیست یا منقضی شده است."
        },
        400
      );

    }


    const attempts=
      Number(
        reset.attempts||0
      );


    if(
      attempts>=5
    ){

      await env.DB
        .prepare(`
          UPDATE password_resets

          SET used=1

          WHERE id=?
        `)
        .bind(
          reset.id
        )
        .run();


      return json(
        {
          error:
            "تعداد تلاش‌های مجاز برای این کد تمام شده است. کد جدید درخواست کنید."
        },
        400
      );

    }


    if(
      Date.now()>
      new Date(
        reset.expires_at
      ).getTime()
    ){

      await env.DB
        .prepare(`
          UPDATE password_resets

          SET used=1

          WHERE id=?
        `)
        .bind(
          reset.id
        )
        .run();


      return json(
        {
          error:
            "کد بازیابی منقضی شده است."
        },
        400
      );

    }


    const codeHash=
      await hashPassword(
        code
      );


    if(
      codeHash!==
      String(
        reset.code_hash||""
      )
    ){

      const nextAttempts=
        attempts+
        1;


      await env.DB
        .prepare(`
          UPDATE password_resets

          SET
            attempts=?,
            used=
              CASE
                WHEN ?>=5 THEN 1
                ELSE used
              END

          WHERE id=?
        `)
        .bind(
          nextAttempts,
          nextAttempts,
          reset.id
        )
        .run();


      return json(
        {
          error:
            nextAttempts>=5
              ?"کد بازیابی اشتباه است و تعداد تلاش‌های مجاز تمام شد."
              :"کد بازیابی اشتباه است."
        },
        400
      );

    }


    const newHash=
      await hashPassword(
        newPassword
      );


    await env.DB
      .prepare(`
        UPDATE users

        SET password_hash=?

        WHERE id=?
      `)
      .bind(
        newHash,
        user.id
      )
      .run();


    await env.DB
      .prepare(`
        UPDATE password_resets

        SET used=1

        WHERE id=?
      `)
      .bind(
        reset.id
      )
      .run();


    return json({

      ok:true,

      message:
        "رمز عبور با موفقیت تغییر کرد."

    });


  }catch(error){

    console.error(
      "RESET PASSWORD ERROR:",
      error?.message||
      String(error)
    );


    return json(
      {
        error:
          "تغییر رمز عبور انجام نشد."
      },
      500
    );

  }

}


// =============================================================
// AI
// =============================================================
async function plansApi(){

  return json({

    ok:true,

    plans:
      Object.keys(
        PLAN_PRICES
      )
      .map(
        id=>({

          id,

          name:
            PLAN_NAMES[id],

          price_toman:
            Number(
              PLAN_PRICES[id]
            ),

          price_usd:
            Number(
              PLAN_USD[id]
            ),

          features:
            PLAN_FEATURES[id]

        })
      )

  });

}


async function aiChatApi(
  request,
  env
){

  const user=
    await requireUser(
      request,
      env
    );


  if(!user){

    return json(
      {
        error:
          "برای استفاده از هوش مصنوعی وارد حساب شوید."
      },
      401
    );

  }


  const b=
    await bodyJson(
      request
    );


  const message=
    String(
      b.message||""
    )
    .trim();


  if(!message){

    return json(
      {
        error:
          "پیام خالی است."
      },
      400
    );

  }


  if(message.length>12000){

    return json(
      {
        error:
          "پیام بیش از حد طولانی است."
      },
      400
    );

  }


  let history=
    Array.isArray(
      b.history
    )
      ?b.history
      :[];


  history=
    history
      .filter(
        x=>
          x&&
          ["user","assistant"].includes(
            x.role
          )&&
          typeof x.content==="string"&&
          x.content.trim()
      )
      .slice(-20);


  const subscription=
    await getSubscription(
      env,
      user.id
    )
    .catch(
      ()=>null
    );


  let reservedFree=false;
  let reservedUsage=0;


  if(subscription){

  }else{

    const reservation=
      await reserveFreeUsage(
        env,
        user.id
      );


    if(!reservation.ok){

      return json(
        {
          error:
            "سهمیه رایگان روزانه شما تمام شده است. برای ادامه یکی از پلن‌های اشتراک را انتخاب کنید.",

          upgrade_required:true
        },
        429
      );

    }


    reservedFree=true;
    reservedUsage=
      Number(
        reservation.used||0
      );

  }


  if(!env.AI){

    if(reservedFree){

      await releaseFreeUsage(
        env,
        user.id
      );

    }


    return json(
      {
        error:
          "اتصال هوش مصنوعی در Worker تنظیم نشده است."
      },
      500
    );

  }


  const systemPrompt=`

تو «ابزارک AI» هستی؛
یک دستیار هوش مصنوعی حرفه‌ای، فارسی‌زبان و چندزبانه.

اگر کاربر فارسی صحبت می‌کند فارسی روان پاسخ بده و اگر زبان دیگری استفاده کرد تا حد امکان همان زبان را به کار ببر.

پاسخ را متناسب با سؤال تولید کن، دقیق و کاربردی باش.

برای آموزش مرحله‌به‌مرحله توضیح بده؛

برای درخواست‌های نوشتاری متن آماده ارائه کن؛

برای ترجمه طبیعی و وفادار ترجمه کن؛

برای ایده‌پردازی چند پیشنهاد بده؛

برای برنامه‌نویسی راه‌حل عملی ارائه کن.

اطلاعات نامطمئن را قطعی بیان نکن و از تکرار بی‌دلیل خودداری کن.

اگر کاربر سلام کرد دوستانه پاسخ بده.

ارتباط پیام‌های قبلی را حفظ کن.

`;


  const messages=[

    {
      role:"system",
      content:
        systemPrompt
    },

    ...history.map(
      x=>({
        role:
          x.role,

        content:
          x.content
      })
    ),

    {
      role:"user",
      content:
        message
    }

  ];


  let result;


  try{

    result=
      await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct-fast",
        {
          messages,

          max_tokens:1200,

          temperature:.7
        }
      );


  }catch(e){

    if(reservedFree){

      await releaseFreeUsage(
        env,
        user.id
      );

    }


    console.error(
      "ABZARAK AI PROVIDER ERROR:",
      e?.message||
      String(e)
    );


    return json(
      {
        error:
          "ارتباط با سرویس هوش مصنوعی برقرار نشد."
      },
      500
    );

  }


  let reply=
    typeof result==="string"

      ?result

      :result?.response||
       result?.result?.response||
       result?.result||
       "";


  reply=
    String(
      reply||""
    )
    .trim();


  if(!reply){

    if(reservedFree){

      await releaseFreeUsage(
        env,
        user.id
      );

    }


    return json(
      {
        error:
          "هوش مصنوعی پاسخی تولید نکرد."
      },
      502
    );

  }


  return json({

    ok:true,

    reply,

    usage:{

      used:
        subscription
          ?Number(
              (
                await getUsage(
                  env,
                  user.id
                )
              )?.used||0
            )
          :reservedUsage,

      limit:
        subscription
          ?999999999
          :FREE_DAILY_LIMIT

    }

  });

}


// =============================================================
// ZARINPAL PRODUCTION — PRESERVED
// =============================================================
function zarinPalConfig(){

  return{

    requestUrl:
      "https://api.zarinpal.com/pg/v4/payment/request.json",

    verifyUrl:
      "https://api.zarinpal.com/pg/v4/payment/verify.json",

    startPayUrl:
      "https://www.zarinpal.com/pg/StartPay/"

  };

}


function extractZarinPalError(data){

  let code=null;

  let message="";


  const e=
    data?.errors;


  if(
    Array.isArray(e)&&
    e.length
  ){

    code=
      e[0]?.code??
      null;


    message=
      String(
        e[0]?.message||
        e[0]?.error||
        ""
      );

  }else if(e){

    code=
      e.code??null;


    message=
      String(
        e.message||
        e.error||
        ""
      );

  }


  if(
    !message&&
    data?.message
  ){

    message=
      String(
        data.message
      );

  }


  return{
    code,
    message
  };

}


async function markPaymentFailed(
  env,
  id,
  status="failed"
){

  try{

    await env.DB
      .prepare(`
        UPDATE payments_v2

        SET status=?

        WHERE id=?

        AND status='pending'
      `)
      .bind(
        status,
        id
      )
      .run();

  }catch(e){

    console.error(
      "PAYMENT STATUS UPDATE ERROR:",
      e?.message||
      String(e)
    );

  }

}


async function paymentRequestApi(
  request,
  env
){

  try{

    const user=
      await requireUser(
        request,
        env
      );


    if(!user){

      return json(
        {
          error:
            "برای خرید ابتدا وارد حساب شوید."
        },
        401
      );

    }


    const b=
      await bodyJson(
        request
      );


    const planId=
      String(
        b.planId||""
      )
      .trim();


    if(
      !Object.prototype.hasOwnProperty.call(
        PLAN_PRICES,
        planId
      )
    ){

      return json(
        {
          error:
            "پلن انتخاب‌شده معتبر نیست."
        },
        400
      );

    }


    const amountToman=
      Number(
        PLAN_PRICES[planId]
      );


    const merchantId=
      String(
        env.ZARINPAL_MERCHANT_ID||
        ""
      )
      .trim();


    if(!merchantId){

      return json(
        {
          error:
            "کد درگاه زرین‌پال در Worker تنظیم نشده است."
        },
        503
      );

    }


    const paymentId=
      randomHex(16);


    const createdAt=
      new Date().toISOString();


    await env.DB
      .prepare(`

        INSERT INTO payments_v2
        (
          id,
          user_id,
          plan_id,
          amount_toman,
          authority,
          status,
          created_at,
          paid_at
        )

        VALUES(
          ?,
          ?,
          ?,
          ?,
          NULL,
          'pending',
          ?,
          NULL
        )

      `)
      .bind(
        paymentId,
        user.id,
        planId,
        amountToman,
        createdAt
      )
      .run();


    const callback=
      BASE_URL+
      "/api/payment/verify?payment_id="+
      encodeURIComponent(
        paymentId
      );


    const amountRial=
      amountToman*10;


    const payload={

      merchant_id:
        merchantId,

      amount:
        amountRial,

      description:
        "Abzarak AI - "+
        PLAN_NAMES[planId],

      callback_url:
        callback,

      metadata:{

        email:
          String(
            user.email||""
          )

      }

    };


    const response=
      await fetch(
        zarinPalConfig().requestUrl,
        {

          method:"POST",

          headers:{

            "Content-Type":
              "application/json",

            Accept:
              "application/json",

            "User-Agent":
              "AbzarakAI-ZarinPal-v4"

          },

          body:
            JSON.stringify(
              payload
            )

        }
      );


    const raw=
      await response.text();


    let data={};


    try{

      data=
        raw
          ?JSON.parse(raw)
          :{};

    }catch{

      await markPaymentFailed(
        env,
        paymentId
      );


      return json(
        {
          error:
            "پاسخ زرین‌پال JSON معتبر نبود.",

          http_status:
            response.status
        },
        502
      );

    }


    const info=
      extractZarinPalError(
        data
      );


    const authority=
      data?.data?.authority;


    const code=
      Number(
        data?.data?.code
      );


    if(
      !response.ok||
      code!==100||
      !authority
    ){

      await markPaymentFailed(
        env,
        paymentId
      );


      return json(
        {
          error:
            info.message||
            "ایجاد درخواست پرداخت در زرین‌پال ناموفق بود.",

          gateway_code:
            info.code??code??null,

          http_status:
            response.status
        },
        502
      );

    }


    try{

      await env.DB
        .prepare(`
          UPDATE payments_v2

          SET authority=?

          WHERE id=?
          AND status='pending'
        `)
        .bind(
          String(authority),
          paymentId
        )
        .run();

    }catch(e){

      await markPaymentFailed(
        env,
        paymentId
      );


      console.error(
        "PAYMENT AUTHORITY SAVE ERROR:",
        e?.message||
        String(e)
      );


      return json(
        {
          error:
            "ثبت درخواست پرداخت انجام نشد."
        },
        500
      );

    }


    return json({

      ok:true,

      payment_url:
        zarinPalConfig()
          .startPayUrl+
        encodeURIComponent(
          String(authority)
        ),

      payment_id:
        paymentId,

      authority:
        String(authority)

    });


  }catch(e){

    console.error(
      "PAYMENT REQUEST ERROR:",
      e?.message||
      String(e)
    );


    return json(
      {
        error:
          "خطای داخلی در ایجاد درخواست پرداخت."
      },
      500
    );

  }

}


// =============================================================
// PAYMENT VERIFY — IDEMPOTENT
// =============================================================
async function paymentVerifyApi(
  request,
  env
){

  const url=
    new URL(
      request.url
    );


  const paymentId=
    url.searchParams.get(
      "payment_id"
    );


  const authority=
    url.searchParams.get(
      "Authority"
    );


  const status=
    String(
      url.searchParams.get(
        "Status"
      )||""
    )
    .toUpperCase();


  const redirect=
    p=>
      Response.redirect(
        new URL(
          p,
          request.url
        ).toString(),
        302
      );


  if(!paymentId){

    return redirect(
      "/?payment=error"
    );

  }


  const payment=
    await env.DB
      .prepare(`
        SELECT *

        FROM payments_v2

        WHERE id=?

        LIMIT 1
      `)
      .bind(
        paymentId
      )
      .first();


  if(!payment){

    return redirect(
      "/?payment=error&reason=payment-not-found"
    );

  }


  if(
    payment.status==="paid"
  ){

    return redirect(
      "/?payment=success"
    );

  }


  if(
    status!=="OK"||
    !authority
  ){

    await markPaymentFailed(
      env,
      paymentId,
      "cancelled"
    );


    return redirect(
      "/?payment=cancel"
    );

  }


  if(
    payment.authority&&
    String(
      payment.authority
    )!==String(
      authority
    )
  ){

    return redirect(
      "/?payment=error&reason=authority-mismatch"
    );

  }


  const merchantId=
    String(
      env.ZARINPAL_MERCHANT_ID||
      ""
    )
    .trim();


  if(!merchantId){

    return redirect(
      "/?payment=error&reason=merchant-not-configured"
    );

  }


  const amountRial=
    Number(
      payment.amount_toman
    )*10;


  try{

    const response=
      await fetch(
        zarinPalConfig().verifyUrl,
        {

          method:"POST",

          headers:{

            "Content-Type":
              "application/json",

            Accept:
              "application/json",

            "User-Agent":
              "AbzarakAI-ZarinPal-v4"

          },

          body:
            JSON.stringify({

              merchant_id:
                merchantId,

              amount:
                amountRial,

              authority:
                String(
                  authority
                )

            })

        }
      );


    const raw=
      await response.text();


    let data={};


    try{

      data=
        raw
          ?JSON.parse(raw)
          :{};

    }catch{

      return redirect(
        "/?payment=error&reason=invalid-gateway-response"
      );

    }


    const code=
      Number(
        data?.data?.code
      );


    const refId=
      data?.data?.ref_id;


    if(
      !response.ok||
      ![100,101].includes(code)
    ){

      await markPaymentFailed(
        env,
        paymentId
      );


      return redirect(
        "/?payment=failed"
      );

    }


    let paymentSubscription=
      await env.DB
        .prepare(`
          SELECT
            id,
            expires_at

          FROM subscriptions

          WHERE payment_id=?

          LIMIT 1
        `)
        .bind(
          paymentId
        )
        .first();


    if(!paymentSubscription){

      const existing=
        await env.DB
          .prepare(`
            SELECT
              id,
              expires_at

            FROM subscriptions

            WHERE
              user_id=?

              AND status='active'

              AND expires_at>?

            ORDER BY expires_at DESC

            LIMIT 1
          `)
          .bind(
            payment.user_id,
            new Date().toISOString()
          )
          .first();


      const base=
        existing?.expires_at
          ?Math.max(
              new Date(
                existing.expires_at
              ).getTime(),
              Date.now()
            )
          :Date.now();


      const startsAt=
        new Date(
          base
        ).toISOString();


      const expiresAt=
        new Date(
          base+
          30*86400000
        ).toISOString();


      try{

        await env.DB
          .prepare(`
            INSERT INTO subscriptions
            (
              id,
              user_id,
              plan_id,
              starts_at,
              expires_at,
              status,
              payment_id
            )

            VALUES(
              ?,
              ?,
              ?,
              ?,
              ?,
              'active',
              ?
            )
          `)
          .bind(
            randomHex(16),
            payment.user_id,
            payment.plan_id,
            startsAt,
            expiresAt,
            paymentId
          )
          .run();

      }catch(insertError){

        paymentSubscription=
          await env.DB
            .prepare(`
              SELECT
                id,
                expires_at

              FROM subscriptions

              WHERE payment_id=?

              LIMIT 1
            `)
            .bind(
              paymentId
            )
            .first();


        if(!paymentSubscription){

          console.error(
            "SUBSCRIPTION INSERT ERROR:",
            insertError?.message||
            String(insertError)
          );


          return redirect(
            "/?payment=error&reason=subscription-save-error"
          );

        }

      }

    }


    await env.DB
      .prepare(`
        UPDATE payments_v2

        SET
          status='paid',
          authority=?,
          paid_at=?

        WHERE id=?
        AND status!='paid'
      `)
      .bind(
        String(authority),
        new Date().toISOString(),
        paymentId
      )
      .run();


    console.log(
      "ZARINPAL VERIFY SUCCESS",
      JSON.stringify({
        paymentId,
        refId,
        planId:
          payment.plan_id
      })
    );


    return redirect(
      "/?payment=success"
    );


  }catch(e){

    console.error(
      "PAYMENT VERIFY ERROR:",
      e?.message||
      String(e)
    );


    return redirect(
      "/?payment=error&reason=verify-error"
    );

  }

}


// =============================================================
// WITHDRAWALS + ADMIN
// =============================================================
async function withdrawalApi(
  request,
  env
){

  const user=
    await requireUser(
      request,
      env
    );


  if(!user){

    return json(
      {
        error:
          "برای برداشت وارد حساب شوید."
      },
      401
    );

  }


  const b=
    await bodyJson(
      request
    );


  const amount=
    Number(
      b.amount||0
    );


  const method=
    String(
      b.method||"bank"
    );


  const destination=
    String(
      b.destination||""
    )
    .trim();


  if(
    !Number.isFinite(amount)||
    amount<=0
  ){

    return json(
      {
        error:
          "مبلغ برداشت معتبر نیست."
      },
      400
    );

  }


  if(!destination){

    return json(
      {
        error:
          "مقصد برداشت را وارد کنید."
      },
      400
    );

  }


  if(
    amount>
    Number(
      user.balance||0
    )
  ){

    return json(
      {
        error:
          "موجودی کافی نیست."
      },
      400
    );

  }


  const result=
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
    result.meta?.changes!==1
  ){

    return json(
      {
        error:
          "موجودی کافی نیست."
      },
      400
    );

  }


  try{

    await env.DB
      .prepare(`
        INSERT INTO withdrawals
        (
          id,
          user_id,
          amount,
          method,
          destination,
          status,
          created_at
        )

        VALUES(
          ?,
          ?,
          ?,
          ?,
          ?,
          'pending',
          ?
        )
      `)
      .bind(
        randomHex(16),
        user.id,
        amount,
        method,
        destination,
        new Date().toISOString()
      )
      .run();

  }catch(e){

    try{

      await env.DB
        .prepare(`
          UPDATE users

          SET balance=balance+?

          WHERE id=?
        `)
        .bind(
          amount,
          user.id
        )
        .run();

    }catch(refundError){

      console.error(
        "WITHDRAWAL REFUND ERROR:",
        refundError?.message||
        String(refundError)
      );

    }


    console.error(
      "WITHDRAWAL INSERT ERROR:",
      e?.message||
      String(e)
    );


    return json(
      {
        error:
          "ثبت درخواست برداشت انجام نشد."
      },
      500
    );

  }


  return json({

    message:
      "درخواست برداشت ثبت شد."

  });

}


async function myWithdrawalsApi(
  request,
  env
){

  const user=
    await requireUser(
      request,
      env
    );


  if(!user){

    return json(
      {
        error:
          "نشست نامعتبر است."
      },
      401
    );

  }


  const rows=
    await env.DB
      .prepare(`
        SELECT
          id,
          amount,
          method,
          destination,
          status,
          created_at

        FROM withdrawals

        WHERE user_id=?

        ORDER BY created_at DESC
      `)
      .bind(
        user.id
      )
      .all();


  return json({

    withdrawals:
      rows.results||[]

  });

}


async function adminLoginApi(
  request,
  env
){

  const b=
    await bodyJson(
      request
    );


  if(!env.ADMIN_PASSWORD){

    return json(
      {
        error:
          "ADMIN_PASSWORD در Worker تنظیم نشده است."
      },
      500
    );

  }


  if(!authSecretConfigured(env)){

    return json(
      {
        error:
          "امنیت مدیریت در Worker تنظیم نشده است."
      },
      503
    );

  }


  if(
    String(
      b.password||""
    )!==
    String(
      env.ADMIN_PASSWORD
    )
  ){

    return json(
      {
        error:
          "رمز مدیریت اشتباه است."
      },
      401
    );

  }


  return json({

    token:
      await createToken(
        {
          admin:true,

          exp:
            Date.now()+
            12*60*60*1000
        },

        getAuthSecret(env)
      )

  });

}


async function adminUsersApi(
  request,
  env
){

  if(
    !(await requireAdmin(
      request,
      env
    ))
  ){

    return json(
      {
        error:
          "دسترسی غیرمجاز."
      },
      403
    );

  }


  const rows=
    await env.DB
      .prepare(`
        SELECT
          id,
          name,
          email,
          balance,
          created_at

        FROM users

        ORDER BY created_at DESC
      `)
      .all();


  return json({

    users:
      rows.results||[]

  });

}


async function adminPaymentsApi(
  request,
  env
){

  if(
    !(await requireAdmin(
      request,
      env
    ))
  ){

    return json(
      {
        error:
          "دسترسی غیرمجاز."
      },
      403
    );

  }


  const rows=
    await env.DB
      .prepare(`
        SELECT
          p.*,
          u.email

        FROM payments_v2 p

        LEFT JOIN users u
          ON u.id=p.user_id

        ORDER BY p.created_at DESC
      `)
      .all();


  return json({

    payments:
      (rows.results||[])
      .map(
        x=>({

          id:
            x.id,

          email:
            x.email,

          plan_id:
            x.plan_id,

          amount_toman:
            x.amount_toman,

          status:
            x.status,

          authority:
            x.authority,

          created_at:
            x.created_at,

          paid_at:
            x.paid_at

        })
      )

  });

}


async function adminWithdrawalsApi(
  request,
  env
){

  if(
    !(await requireAdmin(
      request,
      env
    ))
  ){

    return json(
      {
        error:
          "دسترسی غیرمجاز."
      },
      403
    );

  }


  const rows=
    await env.DB
      .prepare(`
        SELECT
          w.*,
          u.email

        FROM withdrawals w

        LEFT JOIN users u
          ON u.id=w.user_id

        ORDER BY w.created_at DESC
      `)
      .all();


  return json({

    withdrawals:
      rows.results||[]

  });

}


async function adminProcessWithdrawalApi(
  request,
  env
){

  if(
    !(await requireAdmin(
      request,
      env
    ))
  ){

    return json(
      {
        error:
          "دسترسی غیرمجاز."
      },
      403
    );

  }


  const b=
    await bodyJson(
      request
    );


  const id=
    String(
      b.id||""
    );


  const action=
    String(
      b.action||""
    );


  if(
    !id||
    !["paid","rejected"].includes(
      action
    )
  ){

    return json(
      {
        error:
          "عملیات نامعتبر است."
      },
      400
    );

  }


  const w=
    await env.DB
      .prepare(`
        SELECT *

        FROM withdrawals

        WHERE id=?

        LIMIT 1
      `)
      .bind(
        id
      )
      .first();


  if(!w){

    return json(
      {
        error:
          "درخواست برداشت پیدا نشد."
      },
      404
    );

  }


  if(
    w.status!=="pending"
  ){

    return json(
      {
        error:
          "این درخواست قبلاً پردازش شده است."
      },
      400
    );

  }


  if(
    action==="rejected"
  ){

    await env.DB
      .prepare(`
        UPDATE users

        SET balance=balance+?

        WHERE id=?
      `)
      .bind(
        w.amount,
        w.user_id
      )
      .run();

  }


  await env.DB
    .prepare(`
      UPDATE withdrawals

      SET
        status=?,
        processed_at=?

      WHERE id=?
    `)
    .bind(
      action,

      new Date().toISOString(),

      id
    )
    .run();


  return json({

    message:
      action==="paid"

        ?"برداشت پرداخت شد."

        :"درخواست برداشت رد شد و مبلغ به موجودی برگشت."

  });

}


// =============================================================
// HEALTH
// =============================================================
async function healthApi(env){

  return json({

    ok:true,

    service:
      "Abzarak AI",

    time:
      new Date().toISOString(),

    database:
      !!env.DB,

    ai:
      !!env.AI,

    resend:
      !!env.RESEND_API_KEY,

    zarinpal:
      !!env.ZARINPAL_MERCHANT_ID,

    jwt_secret:
      !!env.JWT_SECRET,

    legacy_auth_fallback:
      !env.JWT_SECRET&&
      !!env.ADMIN_PASSWORD,

    zarinpal_mode:
      "production"

  });

}


// =============================================================
// FETCH
// =============================================================
export default {

  async fetch(
    request,
    env,
    ctx
  ){

    try{

      if(
        request.method==="OPTIONS"
      ){

        return cors(
          new Response(
            null,
            {
              status:204
            }
          )
        );

      }


      const url=
        new URL(
          request.url
        );


      const path=
        url.pathname;


      const m=
        request.method;


      if(
        path==="/17726638.txt"
      ){

        return cors(
          plainText(
            "17726638"
          )
        );

      }


      if(
        path==="/robots.txt"
      ){

        return cors(
          plainText(
            robotsTxt()
          )
        );

      }


      if(
        path==="/sitemap.xml"
      ){

        return cors(
          xml(
            sitemapXml()
          )
        );

      }


      if(
        path.startsWith(
          "/images/abzarak-"
        )&&
        path.endsWith(".svg")&&
        m==="GET"
      ){

        const kind=
          decodeURIComponent(
            path.slice(
              "/images/abzarak-".length,
              -4
            )
          );


        const known=
          Object.prototype.hasOwnProperty.call(
            IMAGE_THEMES,
            kind
          )
            ?kind
            :"assistant";


        const title=
          SEO_PAGES[
            Object.keys(
              SEO_PAGES
            ).find(
              p=>
                SEO_PAGES[p].imageKind===
                known
            )
          ]?.imageTitle||
          "دستیار هوش مصنوعی فارسی";


        return imageResponse(
          seoImageSvg(
            known,
            title
          )
        );

      }


      if(
        path==="/content-ai"&&
        m==="GET"
      ){

        return Response.redirect(
          new URL(
            "/content",
            request.url
          ).toString(),
          301
        );

      }


      if(
        path==="/faq"&&
        m==="GET"
      ){

        return cors(
          html(
            renderFaqPage()
          )
        );

      }


      if(
        SEO_PAGES[path]&&
        m==="GET"
      ){

        return cors(
          html(
            renderSeoPage(
              path,
              SEO_PAGES[path]
            )
          )
        );

      }


      const needsDatabase=
        path.startsWith("/api/")||
        path==="/health";


      if(needsDatabase){

        try{

          await initDatabase(
            env
          );

        }catch(e){

          console.error(
            "DB INIT ERROR:",
            e?.message||
            String(e)
          );


          return cors(
            json(
              {
                error:
                  "پایگاه داده ابزارک آماده نیست."
              },
              503
            )
          );

        }

      }


      let response;


      if(
        path==="/health"
      ){

        response=
          await healthApi(
            env
          );


      }else if(
        path==="/api/register"&&
        m==="POST"
      ){

        response=
          await registerApi(
            request,
            env
          );


      }else if(
        path==="/api/login"&&
        m==="POST"
      ){

        response=
          await loginApi(
            request,
            env
          );


      }else if(
        path==="/api/me"&&
        m==="GET"
      ){

        response=
          await meApi(
            request,
            env
          );


      }else if(
        path==="/api/forgot-password"&&
        m==="POST"
      ){

        response=
          await forgotPasswordApi(
            request,
            env
          );


      }else if(
        path==="/api/reset-password"&&
        m==="POST"
      ){

        response=
          await resetPasswordApi(
            request,
            env
          );


      }else if(
        path==="/api/ai/chat"&&
        m==="POST"
      ){

        response=
          await aiChatApi(
            request,
            env
          );


      }else if(
        path==="/api/plans"&&
        m==="GET"
      ){

        response=
          await plansApi();


      }else if(
        path==="/api/payment/request"&&
        m==="POST"
      ){

        response=
          await paymentRequestApi(
            request,
            env
          );


      }else if(
        path==="/api/payment/verify"&&
        m==="GET"
      ){

        response=
          await paymentVerifyApi(
            request,
            env
          );


      }else if(
        path==="/api/withdrawal"&&
        m==="POST"
      ){

        response=
          await withdrawalApi(
            request,
            env
          );


      }else if(
        path==="/api/my-withdrawals"&&
        m==="GET"
      ){

        response=
          await myWithdrawalsApi(
            request,
            env
          );


      }else if(
        path==="/api/admin/login"&&
        m==="POST"
      ){

        response=
          await adminLoginApi(
            request,
            env
          );


      }else if(
        path==="/api/admin/users"&&
        m==="GET"
      ){

        response=
          await adminUsersApi(
            request,
            env
          );


      }else if(
        path==="/api/admin/payments"&&
        m==="GET"
      ){

        response=
          await adminPaymentsApi(
            request,
            env
          );


      }else if(
        path==="/api/admin/withdrawals"&&
        m==="GET"
      ){

        response=
          await adminWithdrawalsApi(
            request,
            env
          );


      }else if(
        path==="/api/admin/withdrawals/process"&&
        m==="POST"
      ){

        response=
          await adminProcessWithdrawalApi(
            request,
            env
          );


      }else if(
        (
          path==="/"||
          path==="/index.html"
        )&&
        m==="GET"
      ){

        response=
          html(
            renderHomepage()
          );


      }else{

        response=
          json(
            {
              error:
                "Not Found"
            },
            404
          );

      }


      return cors(
        response
      );


    }catch(error){

      console.error(
        "WORKER ERROR:",
        error
      );


      return cors(
        json(
          {
            error:
              "خطای داخلی سرور."
          },
          500
        )
      );

    }

  }

};
