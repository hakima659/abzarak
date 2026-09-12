// =============================================================
// HOMEPAGE — SEO OPTIMIZED
// =============================================================

function renderHomepage() {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width,initial-scale=1,viewport-fit=cover">

<meta name="theme-color"
content="#12163a">

<meta name="mobile-web-app-capable"
content="yes">

<meta name="apple-mobile-web-app-capable"
content="yes">

<meta name="apple-mobile-web-app-title"
content="ابزارک">

<meta name="application-name"
content="ابزارک">

<!-- =========================================================
     SEO
========================================================= -->

<title>
ابزارک | دستیار هوش مصنوعی فارسی و چندزبانه
</title>

<meta
name="description"
content="ابزارک یک دستیار هوش مصنوعی فارسی و چندزبانه برای گفتگو، پاسخ به سوالات، ترجمه، تولید محتوا و انجام کارهای روزمره است."
>

<meta
name="keywords"
content="ابزارک, هوش مصنوعی, دستیار هوش مصنوعی, هوش مصنوعی فارسی, چت بات فارسی, چت با هوش مصنوعی, AI فارسی, دستیار هوشمند, تولید محتوا با هوش مصنوعی, AI Assistant"
>

<meta
name="author"
content="ابزارک"
>

<meta
name="robots"
content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
>

<meta
name="googlebot"
content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
>

<!-- دامنه اصلی واقعی سایت -->

<link
rel="canonical"
href="https://abzarakai.ir/"
>

<!-- زبان‌ها -->

<link
rel="alternate"
hreflang="fa"
href="https://abzarakai.ir/"
>

<link
rel="alternate"
hreflang="en"
href="https://abzarakai.ir/"
>

<link
rel="alternate"
hreflang="x-default"
href="https://abzarakai.ir/"
>

<!-- =========================================================
     OPEN GRAPH
========================================================= -->

<meta
property="og:type"
content="website"
>

<meta
property="og:site_name"
content="ابزارک"
>

<meta
property="og:title"
content="ابزارک | دستیار هوش مصنوعی فارسی و چندزبانه"
>

<meta
property="og:description"
content="با ابزارک گفتگو کنید، سؤال بپرسید، ترجمه کنید، محتوا تولید کنید و برای کارهای روزمره از هوش مصنوعی کمک بگیرید."
>

<meta
property="og:url"
content="https://abzarakai.ir/"
>

<meta
property="og:locale"
content="fa_IR"
>

<meta
property="og:locale:alternate"
content="en_US"
>

<meta
property="og:image"
content="https://abzarakai.ir/icon.svg"
>

<!-- =========================================================
     TWITTER
========================================================= -->

<meta
name="twitter:card"
content="summary"
>

<meta
name="twitter:title"
content="ابزارک | دستیار هوش مصنوعی فارسی و چندزبانه"
>

<meta
name="twitter:description"
content="دستیار هوش مصنوعی ابزارک برای گفتگو، پاسخ به سوالات، ترجمه، تولید محتوا و کارهای روزمره."
>

<meta
name="twitter:image"
content="https://abzarakai.ir/icon.svg"
>

<!-- =========================================================
     PWA
========================================================= -->

<link
rel="manifest"
href="/manifest.json"
>

<link
rel="icon"
href="/icon.svg"
type="image/svg+xml"
>

<link
rel="apple-touch-icon"
href="/icon.svg"
>

<!-- =========================================================
     ENAMAD
========================================================= -->

<meta
name="enamad"
content="36032134"
>

<!-- =========================================================
     STRUCTURED DATA
========================================================= -->

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://abzarakai.ir/#application",
  "name": "ابزارک",
  "alternateName": "Abzarak AI",
  "url": "https://abzarakai.ir/",
  "description": "دستیار هوش مصنوعی فارسی و چندزبانه برای گفتگو، پاسخ به سوالات، ترجمه، تولید محتوا و انجام کارهای روزمره.",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "Android, iOS, Windows, macOS, Linux",
  "browserRequirements": "Requires JavaScript",
  "inLanguage": [
    "fa",
    "en"
  ],
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "IRR",
    "availability": "https://schema.org/InStock"
  }
}
</script>

<!-- =========================================================
     ORGANIZATION STRUCTURED DATA
========================================================= -->

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://abzarakai.ir/#organization",
  "name": "ابزارک",
  "url": "https://abzarakai.ir/",
  "logo": {
    "@type": "ImageObject",
    "url": "https://abzarakai.ir/icon.svg"
  }
}
</script>

<style>

*{
box-sizing:border-box;
}

html{
scroll-behavior:smooth;
}

body{
margin:0;
font-family:
Tahoma,
Arial,
sans-serif;

background:
linear-gradient(
180deg,
#f6f8ff,
#eef2ff
);

color:#17203a;
}

button,
input{
font:inherit;
}

button{
cursor:pointer;
}

.hidden{
display:none!important;
}

.container{
width:min(1180px,94%);
margin:auto;
}

header{
position:sticky;
top:0;
z-index:50;

background:
rgba(255,255,255,.94);

backdrop-filter:blur(15px);

border-bottom:
1px solid #e5e7eb;
}

.nav{
min-height:72px;

display:flex;
align-items:center;

gap:8px;

flex-wrap:wrap;

padding:10px 0;
}

.brand{
display:flex;
align-items:center;
gap:8px;

color:#12163a;

font-size:20px;
font-weight:900;

margin-left:auto;

text-decoration:none;
}

.brand img{
width:42px;
height:42px;

border-radius:13px;
}

.nav-links{
display:flex;
gap:4px;

flex-wrap:wrap;

justify-content:center;
}

.nav-links button{
border:0;

background:transparent;

padding:10px 11px;

border-radius:12px;

font-weight:800;

color:#475569;
}

.nav-links button:hover{
background:#eef2ff;
color:#3730a3;
}

.top-btn{
border:0;

border-radius:12px;

padding:10px 13px;

font-weight:900;
}

.install{
background:#111936;
color:#fff;
}

.lang{
background:#eef2ff;
color:#312e81;
}

.view{
display:none;

padding:
35px 0 60px;
}

.view.active{
display:block;
}

.hero{
margin-top:25px;

padding:70px 35px;

border-radius:32px;

color:#fff;

background:
radial-gradient(
circle at 85% 10%,
rgba(255,255,255,.3),
transparent 25%
),
linear-gradient(
135deg,
#111936,
#4338ca 55%,
#2563eb
);

box-shadow:
0 25px 80px
rgba(37,48,120,.22);
}

.hero h1{
font-size:
clamp(34px,6vw,62px);

line-height:1.15;

margin:20px 0;
}

.hero p{
font-size:18px;

line-height:2;

color:#e8ebff;

max-width:750px;
}

.badge{
display:inline-block;

padding:9px 14px;

border-radius:999px;

background:
rgba(255,255,255,.12);

font-weight:900;
}

.actions{
display:flex;

gap:10px;

flex-wrap:wrap;

margin-top:20px;
}

.btn{
border:0;

border-radius:14px;

padding:13px 18px;

font-weight:900;
}

.primary{
background:
linear-gradient(
135deg,
#4f46e5,
#2563eb
);

color:#fff;
}

.secondary{
background:#eef2ff;
color:#312e81;
}

.danger{
background:#fee2e2;
color:#991b1b;
}

.light{
background:#fff;
color:#202657;
}

.section{
padding:42px 0;
}

.features,
.plans,
.account-grid{
display:grid;

grid-template-columns:
repeat(3,1fr);

gap:18px;

margin-top:20px;
}

.card,
.plan{
background:#fff;

border:1px solid #e5e7eb;

border-radius:22px;

padding:23px;

box-shadow:
0 12px 35px
rgba(15,23,42,.06);
}

.form{
max-width:520px;
margin:auto;
}

.input{
width:100%;

border:1px solid #d7dce8;

border-radius:14px;

padding:14px;

margin:6px 0;

outline:none;

background:#fff;
}

.input:focus{
border-color:#6366f1;

box-shadow:
0 0 0 4px
rgba(99,102,241,.1);
}

.muted{
color:#64748b;

line-height:1.9;
}

.account-value{
font-size:23px;

font-weight:900;

margin-top:7px;
}

.chat{
height:420px;

overflow:auto;

background:#fff;

border:1px solid #e5e7eb;

border-radius:20px;

padding:15px;

margin:15px 0;
}

.message{
padding:13px 15px;

border-radius:16px;

margin:8px 0;

line-height:1.9;

white-space:pre-wrap;
}

.message.user{
background:#eef2ff;

margin-right:12%;
}

.message.ai{
background:#f8fafc;

border:1px solid #e2e8f0;

margin-left:12%;
}

.ai-row{
display:flex;

gap:8px;
}

.ai-row input{
margin:0;
}

.ai-row button{
white-space:nowrap;
}

.currency{
display:flex;

gap:8px;

margin:20px 0;
}

.plan.popular{
border:2px solid #6366f1;
}

.plan h3{
font-size:23px;

margin:0 0 10px;
}

.price{
font-size:30px;

font-weight:950;

color:#1e1b4b;
}

.plan ul{
min-height:130px;

line-height:2;

color:#475569;
}

.notice{
background:#eff6ff;

border:1px solid #bfdbfe;

color:#1e40af;

border-radius:15px;

padding:14px;

line-height:1.9;

margin:12px 0;
}

.table-wrap{
overflow:auto;

background:#fff;

border:1px solid #e5e7eb;

border-radius:16px;
}

table{
width:100%;

border-collapse:collapse;

min-width:700px;
}

th,
td{
padding:11px;

border-bottom:
1px solid #edf0f5;

text-align:right;
}

th{
background:#f8fafc;
}

#seo-content{
margin-top:25px;

background:#fff;

border:
1px solid #e5e7eb;

border-radius:24px;

padding:30px;

box-shadow:
0 10px 30px
rgba(15,23,42,.04);
}

#seo-content h2{
color:#1e1b4b;

margin-top:30px;
}

#seo-content p,
#seo-content li{
line-height:2;

color:#475569;
}

#seo-content ul{
padding-right:25px;
}

footer{
text-align:center;

padding:30px 0 50px;

color:#64748b;
}

@media(max-width:850px){

.features,
.plans,
.account-grid{
grid-template-columns:
repeat(2,1fr);
}

.brand{
width:100%;

justify-content:center;

margin:0;
}

}

@media(max-width:600px){

.container{
width:94%;
}

.hero{
padding:45px 22px;

border-radius:25px;
}

.features,
.plans,
.account-grid{
grid-template-columns:1fr;
}

.ai-row{
flex-direction:column;
}

.message.user,
.message.ai{
margin-left:0;
margin-right:0;
}

.nav{
justify-content:center;
}

.nav-links{
width:100%;
}

.nav-links button{
font-size:13px;

padding:8px;
}

#seo-content{
padding:22px;
}

}

</style>

</head>

<body>

<header>

<div class="container nav">

<a
class="brand"
href="/"
onclick="showView('home');return false;"
>

<img
src="/icon.svg"
alt="لوگوی ابزارک"
>

🤖 ابزارک

</a>

<nav
class="nav-links"
aria-label="منوی اصلی"
>

<button
onclick="showView('home')"
>
🏠 خانه
</button>

<button
onclick="showView('account')"
>
👤 حساب
</button>

<button
onclick="showView('ai')"
>
🤖 هوش مصنوعی
</button>

<button
onclick="showView('plans')"
>
💰 پلن‌ها
</button>

<button
onclick="showView('admin')"
>
🛠️ مدیریت
</button>

</nav>

<button
id="installBtn"
class="top-btn install hidden"
onclick="installPwa()"
>
📲 نصب اپ
</button>

<button
id="langBtn"
class="top-btn lang"
onclick="toggleLang()"
>
English
</button>

</div>

</header>

<main class="container">

<!-- =========================================================
     HOME
========================================================= -->

<section
id="view-home"
class="view active"
>

<div class="hero">

<div class="badge">
✨ دستیار هوش مصنوعی فارسی و چندزبانه
</div>

<h1>
ابزارک؛ دستیار هوش مصنوعی شما
</h1>

<p>
با ابزارک گفتگو کنید، سؤال بپرسید،
ترجمه کنید، متن تولید کنید و
برای کارهای روزمره از هوش مصنوعی کمک بگیرید.
</p>

<div class="actions">

<button
class="btn light"
onclick="showView('ai')"
>
🤖 شروع گفتگو
</button>

<button
class="btn"
style="background:rgba(255,255,255,.15);color:white"
onclick="showView('plans')"
>
💎 مشاهده پلن‌ها
</button>

</div>

</div>

<!-- =========================================================
     FEATURES
========================================================= -->

<div class="section">

<h2>
🌍 دستیار هوش مصنوعی برای کارهای روزمره
</h2>

<p class="muted">
ابزارک یک دستیار هوش مصنوعی آنلاین است که
برای کاربران فارسی‌زبان و کاربران سراسر جهان
طراحی شده است.
</p>

<div class="features">

<div class="card">

<h2>🤖</h2>

<h3>
گفتگو با هوش مصنوعی
</h3>

<p class="muted">
سؤال‌های خود را مطرح کنید و پاسخ‌های
هوشمند دریافت کنید.
</p>

</div>

<div class="card">

<h2>✍️</h2>

<h3>
تولید و بازنویسی متن
</h3>

<p class="muted">
برای نوشتن، بازنویسی و ایده‌پردازی
از هوش مصنوعی کمک بگیرید.
</p>

</div>

<div class="card">

<h2>🌍</h2>

<h3>
پشتیبانی چندزبانه
</h3>

<p class="muted">
پیام خود را به زبان موردنظر بنویسید؛
ابزارک زبان پیام را تشخیص می‌دهد.
</p>

</div>

<div class="card">

<h2>📱</h2>

<h3>
مناسب موبایل
</h3>

<p class="muted">
ابزارک برای استفاده راحت در
موبایل، تبلت و کامپیوتر طراحی شده است.
</p>

</div>

<div class="card">

<h2>🔐</h2>

<h3>
حساب کاربری
</h3>

<p class="muted">
حساب کاربری، اشتراک‌ها و سوابق
استفاده خود را مدیریت کنید.
</p>

</div>

<div class="card">

<h2>💎</h2>

<h3>
پلن‌های اشتراکی
</h3>

<p class="muted">
برای استفاده بیشتر از امکانات هوش مصنوعی،
پلن مناسب خود را انتخاب کنید.
</p>

</div>

</div>

</div>

<!-- =========================================================
     SEO CONTENT
========================================================= -->

<section
id="seo-content"
>

<h2>
ابزارک، دستیار هوش مصنوعی فارسی شما
</h2>

<p>
ابزارک یک دستیار هوش مصنوعی فارسی و چندزبانه
است که برای گفتگو، پاسخ به سوالات،
ترجمه، تولید محتوا و انجام کارهای روزمره
طراحی شده است.
</p>

<h2>
هوش مصنوعی فارسی چیست؟
</h2>

<p>
هوش مصنوعی فارسی به ابزارهایی گفته می‌شود
که می‌توانند زبان فارسی را درک کنند،
به پرسش‌های فارسی پاسخ دهند و در کارهایی
مانند نوشتن، تولید محتوا، خلاصه‌سازی،
ایده‌پردازی و ترجمه کمک کنند.
ابزارک تلاش می‌کند استفاده از چنین امکاناتی
را برای کاربران ساده و سریع کند.
</p>

<h2>
امکانات ابزارک
</h2>

<ul>

<li>
گفتگوی متنی با هوش مصنوعی
</li>

<li>
پاسخ به سوالات روزمره
</li>

<li>
تولید محتوا و متن
</li>

<li>
بازنویسی و بهبود متن
</li>

<li>
کمک در ایده‌پردازی
</li>

<li>
پشتیبانی از زبان فارسی و زبان‌های مختلف
</li>

<li>
حساب کاربری و مدیریت اشتراک
</li>

<li>
قابل استفاده در موبایل و کامپیوتر
</li>

</ul>

<h2>
دستیار هوش مصنوعی برای موبایل و کامپیوتر
</h2>

<p>
ابزارک به صورت آنلاین در مرورگر قابل استفاده است
و طراحی آن برای نمایش مناسب در موبایل،
تبلت و کامپیوتر انجام شده است.
همچنین امکان نصب نسخه وب‌اپلیکیشن
روی دستگاه‌های سازگار وجود دارد.
</p>

<h2>
پلن رایگان ابزارک
</h2>

<p>
کاربران می‌توانند با پلن رایگان ابزارک
از تعداد مشخصی پیام روزانه استفاده کنند
و در صورت نیاز به استفاده بیشتر،
یکی از پلن‌های اشتراکی را انتخاب کنند.
</p>

<h2>
پلن‌های اشتراکی ابزارک
</h2>

<p>
پلن‌های اشتراکی برای کاربرانی طراحی شده‌اند
که به استفاده بیشتر از هوش مصنوعی و
امکانات پیشرفته‌تر نیاز دارند.
</p>

<h2>
چرا ابزارک؟
</h2>

<p>
هدف ابزارک ارائه یک دستیار هوش مصنوعی
ساده، کاربردی و چندزبانه است تا کاربران
بتوانند برای کارهای روزمره خود به راحتی
از هوش مصنوعی استفاده کنند.
</p>

</section>

</section>

<!-- =========================================================
     LOGIN
========================================================= -->

<section
id="view-login"
class="view"
>

<div class="card form">

<h2>
🔑 ورود به حساب
</h2>

<input
id="loginEmail"
class="input"
type="email"
placeholder="ایمیل"
autocomplete="email"
>

<input
id="loginPassword"
class="input"
type="password"
placeholder="رمز عبور"
autocomplete="current-password"
>

<button
class="btn primary"
style="width:100%"
onclick="login()"
>
ورود
</button>

<button
class="btn secondary"
style="width:100%;margin-top:8px"
onclick="showView('signup')"
>
📝 ثبت‌نام
</button>

<button
class="btn"
style="width:100%;margin-top:8px;background:transparent;color:#4f46e5"
onclick="showView('forgot')"
>
فراموشی رمز عبور؟
</button>

</div>

</section>

<!-- =========================================================
     SIGNUP
========================================================= -->

<section
id="view-signup"
class="view"
>

<div class="card form">

<h2>
📝 ثبت‌نام
</h2>

<input
id="signupName"
class="input"
placeholder="نام"
autocomplete="name"
>

<input
id="signupEmail"
class="input"
type="email"
placeholder="ایمیل"
autocomplete="email"
>

<input
id="signupPassword"
class="input"
type="password"
placeholder="رمز عبور حداقل ۶ کاراکتر"
autocomplete="new-password"
>

<button
class="btn primary"
style="width:100%"
onclick="signup()"
>
ثبت‌نام
</button>

</div>

</section>

<!-- =========================================================
     FORGOT
========================================================= -->

<section
id="view-forgot"
class="view"
>

<div class="card form">

<h2>
🔐 بازیابی رمز عبور
</h2>

<p class="muted">
ایمیل خود را وارد کنید تا کد بازیابی برایتان ارسال شود.
</p>

<input
id="forgotEmail"
class="input"
type="email"
placeholder="ایمیل"
>

<button
class="btn primary"
style="width:100%"
onclick="forgotPassword()"
>
ارسال کد
</button>

<button
class="btn secondary"
style="width:100%;margin-top:8px"
onclick="showView('reset')"
>
کد را دارم
</button>

</div>

</section>

<!-- =========================================================
     RESET
========================================================= -->

<section
id="view-reset"
class="view"
>

<div class="card form">

<h2>
🔑 تغییر رمز عبور
</h2>

<input
id="resetEmail"
class="input"
type="email"
placeholder="ایمیل"
>

<input
id="resetCode"
class="input"
placeholder="کد ۶ رقمی"
inputmode="numeric"
maxlength="6"
>

<input
id="resetPassword"
class="input"
type="password"
placeholder="رمز جدید"
>

<button
class="btn primary"
style="width:100%"
onclick="resetPassword()"
>
تغییر رمز
</button>

</div>

</section>

<!-- =========================================================
     ACCOUNT
========================================================= -->

<section
id="view-account"
class="view"
>

<div class="card">

<h2>
🏠 حساب من
</h2>

<div id="accountBox">
در حال دریافت اطلاعات...
</div>

</div>

</section>

<!-- =========================================================
     AI
========================================================= -->

<section
id="view-ai"
class="view"
>

<div class="card">

<h2>
🤖 گفتگو با هوش مصنوعی
</h2>

<p class="muted">
هر زبانی که استفاده کنید، ابزارک تلاش می‌کند
به همان زبان پاسخ دهد.
</p>

<div
id="chat"
class="chat"
aria-live="polite"
>
</div>

<div class="ai-row">

<input
id="aiInput"
class="input"
placeholder="پیام خود را بنویسید..."
onkeydown="if(event.key==='Enter')sendAi()"
>

<button
class="btn primary"
onclick="sendAi()"
>
ارسال
</button>

</div>

</div>

</section>

<!-- =========================================================
     PLANS
========================================================= -->

<section
id="view-plans"
class="view"
>

<h2>
💰 پلن‌های اشتراک ابزارک
</h2>

<p class="muted">
پلن موردنظر خود را انتخاب کنید.
</p>

<div class="currency">

<button
class="btn secondary"
onclick="setCurrency('irt')"
>
تومان 🇮🇷
</button>

<button
class="btn secondary"
onclick="setCurrency('usd')"
>
USD 🌍
</button>

</div>

<div
id="plansBox"
class="plans"
>
در حال بارگذاری...
</div>

</section>

<!-- =========================================================
     ADMIN
========================================================= -->

<section
id="view-admin"
class="view"
>

<div
id="adminLogin"
class="card form"
>

<h2>
🛠️ مدیریت
</h2>

<input
id="adminPassword"
class="input"
type="password"
placeholder="رمز مدیریت"
>

<button
class="btn primary"
style="width:100%"
onclick="adminLogin()"
>
ورود
</button>

</div>

<div
id="adminPanel"
class="hidden"
>

<div class="card">

<h2>
🛠️ پنل مدیریت
</h2>

<div class="actions">

<button
class="btn secondary"
onclick="adminUsers()"
>
👥 کاربران
</button>

<button
class="btn secondary"
onclick="adminPayments()"
>
💳 تراکنش‌ها
</button>

<button
class="btn secondary"
onclick="adminWithdrawals()"
>
💸 برداشت‌ها
</button>

<button
class="btn danger"
onclick="adminLogout()"
>
خروج
</button>

</div>

<div id="adminContent"></div>

</div>

</div>

</section>

</main>

<footer>

<div class="container">

<strong>
🤖 ابزارک
</strong>

<br>

دستیار هوش مصنوعی فارسی و چندزبانه

<br><br>

© 2026 ابزارک — تمامی حقوق محفوظ است

</div>

</footer>

<script>

/* ============================================================
   AUTH STATE
============================================================ */

let token =
localStorage.getItem("abzarak_token") || "";

let adminToken =
localStorage.getItem("abzarak_admin_token") || "";

let currency = "irt";

let plansData = null;

let pwaPrompt = null;

/* ============================================================
   API
============================================================ */

function api(path, options = {}) {

const headers =
options.headers || {};

headers["Content-Type"] =
"application/json";

if(token){

headers["Authorization"] =
"Bearer " + token;

}

return fetch(path,{
...options,
headers
});

}

function adminApi(path,options={}){

const headers =
options.headers || {};

headers["Content-Type"] =
"application/json";

if(adminToken){

headers["Authorization"] =
"Bearer " + adminToken;

}

return fetch(path,{
...options,
headers
});

}

/* ============================================================
   VIEW
============================================================ */

function showView(name){

document
.querySelectorAll(".view")
.forEach(x =>
x.classList.remove("active")
);

const view =
document.getElementById(
"view-" + name
);

if(view){

view.classList.add("active");

}

window.scrollTo({
top:0,
behavior:"smooth"
});

if(name === "account"){
loadAccount();
}

if(name === "plans"){
loadPlans();
}

}

/* ============================================================
   ALERT
============================================================ */

function msg(text){

alert(text);

}

/* ============================================================
   SIGNUP
============================================================ */

async function signup(){

try{

const response =
await api("/api/signup",{

method:"POST",

body:JSON.stringify({

name:
document.getElementById(
"signupName"
).value.trim(),

email:
document.getElementById(
"signupEmail"
).value.trim(),

password:
document.getElementById(
"signupPassword"
).value

})

});

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
"خطا در ثبت‌نام"
);

token=data.token;

localStorage.setItem(
"abzarak_token",
token
);

msg(
"ثبت‌نام با موفقیت انجام شد."
);

showView("account");

}catch(e){

msg(e.message);

}

}

/* ============================================================
   LOGIN
============================================================ */

async function login(){

try{

const response =
await api("/api/login",{

method:"POST",

body:JSON.stringify({

email:
document.getElementById(
"loginEmail"
).value.trim(),

password:
document.getElementById(
"loginPassword"
).value

})

});

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
"خطا در ورود"
);

token=data.token;

localStorage.setItem(
"abzarak_token",
token
);

msg(
"ورود موفق بود."
);

showView("account");

}catch(e){

msg(e.message);

}

}

/* ============================================================
   ACCOUNT
============================================================ */

async function loadAccount(){

const box =
document.getElementById(
"accountBox"
);

if(!token){

box.innerHTML=`

<p class="muted">
برای مشاهده حساب وارد شوید.
</p>

<button
class="btn primary"
onclick="showView('login')"
>
🔑 ورود
</button>

<button
class="btn secondary"
onclick="showView('signup')"
>
📝 ثبت‌نام
</button>

`;

return;

}

box.innerHTML =
"در حال دریافت اطلاعات...";

try{

const response =
await api("/api/me");

const data =
await response.json();

if(!response.ok){

token="";

localStorage.removeItem(
"abzarak_token"
);

throw new Error(
data.error ||
"نشست نامعتبر است."
);

}

const user=data.user;

const sub=data.subscription;

const usage=data.usage;

let subscriptionHtml = "";

if(sub){

subscriptionHtml=`

<div class="notice">

💎 اشتراک فعال:

<strong>
${esc(sub.plan?.name || sub.plan_id)}
</strong>

<br>

📅 پایان اشتراک:

<strong>
${new Date(
sub.expires_at
).toLocaleDateString("fa-IR")}
</strong>

<br>

🚀 پیام‌های AI:

نامحدود

</div>

`;

}else{

subscriptionHtml=`

<div class="notice">

🆓 پلن رایگان

<br>

📊 مصرف امروز:

<strong>
${usage.used}
</strong>

از

<strong>
${usage.limit}
</strong>

پیام

</div>

`;

}

box.innerHTML=`

<div class="account-grid">

<div class="card">

<div class="muted">
نام
</div>

<div class="account-value">
${esc(user.name)}
</div>

</div>

<div class="card">

<div class="muted">
ایمیل
</div>

<div
class="account-value"
style="font-size:16px"
>
${esc(user.email)}
</div>

</div>

<div class="card">

<div class="muted">
موجودی
</div>

<div class="account-value">
${num(user.balance)}
تومان
</div>

</div>

</div>

${subscriptionHtml}

<div class="actions">

<button
class="btn primary"
onclick="showView('ai')"
>
🤖 هوش مصنوعی
</button>

<button
class="btn secondary"
onclick="showView('plans')"
>
💎 پلن‌ها
</button>

<button
class="btn secondary"
onclick="withdraw()"
>
💸 برداشت موجودی
</button>

<button
class="btn secondary"
onclick="myWithdrawals()"
>
📋 وضعیت برداشت‌ها
</button>

<button
class="btn danger"
onclick="logout()"
>
خروج
</button>

</div>

<div id="accountExtra"></div>

`;

}catch(e){

box.innerHTML=`

<div class="notice">
${esc(e.message)}
</div>

`;

}

}

/* ============================================================
   WITHDRAW
============================================================ */

async function withdraw(){

if(!token){

showView("login");

return;

}

const amount =
prompt(
"مبلغ برداشت به تومان را وارد کنید:"
);

if(!amount)
return;

const destination =
prompt(
"شماره شبا / حساب مقصد را وارد کنید:"
);

if(!destination)
return;

try{

const response =
await api(
"/api/withdrawal",
{

method:"POST",

body:JSON.stringify({

amount:Number(amount),

method:"bank",

destination

})

}
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
"خطا در برداشت"
);

msg(
"درخواست برداشت ثبت شد و پس از بررسی مدیریت پرداخت می‌شود."
);

loadAccount();

}catch(e){

msg(e.message);

}

}

/* ============================================================
   MY WITHDRAWALS
============================================================ */

async function myWithdrawals(){

try{

const response =
await api(
"/api/my-withdrawals"
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error || "خطا"
);

const rows =
data.withdrawals || [];

const box =
document.getElementById(
"accountExtra"
);

box.innerHTML=`

<div
class="card"
style="margin-top:15px"
>

<h3>
📋 درخواست‌های برداشت
</h3>

<div class="table-wrap">

<table>

<thead>

<tr>

<th>
مبلغ
</th>

<th>
روش
</th>

<th>
وضعیت
</th>

<th>
تاریخ
</th>

</tr>

</thead>

<tbody>

${rows.map(x=>`

<tr>

<td>
${num(x.amount)}
تومان
</td>

<td>
${esc(x.method)}
</td>

<td>
${esc(x.status)}
</td>

<td>
${esc(x.created_at)}
</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

}catch(e){

msg(e.message);

}

}

/* ============================================================
   LOGOUT
============================================================ */

function logout(){

token="";

localStorage.removeItem(
"abzarak_token"
);

showView("home");

}

/* ============================================================
   FORGOT PASSWORD
============================================================ */

async function forgotPassword(){

try{

const email =
document.getElementById(
"forgotEmail"
).value.trim();

const response =
await api(
"/api/forgot-password",
{

method:"POST",

body:JSON.stringify({
email
})

}
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error || "خطا"
);

document.getElementById(
"resetEmail"
).value=email;

msg(
data.message ||
"کد ارسال شد."
);

showView("reset");

}catch(e){

msg(e.message);

}

}

/* ============================================================
   RESET
============================================================ */

async function resetPassword(){

try{

const response =
await api(
"/api/reset-password",
{

method:"POST",

body:JSON.stringify({

email:
document.getElementById(
"resetEmail"
).value.trim(),

code:
document.getElementById(
"resetCode"
).value.trim(),

newPassword:
document.getElementById(
"resetPassword"
).value

})

}
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error || "خطا"
);

msg(
data.message ||
"رمز تغییر کرد."
);

showView("login");

}catch(e){

msg(e.message);

}

}

/* ============================================================
   AI
============================================================ */

async function sendAi(){

const input =
document.getElementById(
"aiInput"
);

const message =
input.value.trim();

if(!message)
return;

if(!token){

msg(
"برای استفاده از هوش مصنوعی ابتدا وارد حساب شوید."
);

showView("login");

return;

}

addMessage(
"user",
message
);

input.value="";

const loading =
"loading_" + Date.now();

addMessage(
"ai",
"در حال پاسخ...",
loading
);

try{

const response =
await api(
"/api/ai/chat",
{

method:"POST",

body:JSON.stringify({
message
})

}
);

const data =
await response.json();

const el =
document.getElementById(
loading
);

if(el)
el.remove();

if(!response.ok){

if(data.upgrade_required){

addMessage(
"ai",
"⚠️ سقف ۱۰ پیام روزانه پلن رایگان شما تمام شده است. برای ادامه استفاده، یکی از پلن‌های اشتراکی را انتخاب کنید."
);

}else{

addMessage(
"ai",
"❌ " +
(data.error || "خطا")
);

}

return;

}

addMessage(
"ai",
data.reply ||
"پاسخی دریافت نشد."
);

}catch(e){

const el =
document.getElementById(
loading
);

if(el)
el.remove();

addMessage(
"ai",
"❌ " + e.message
);

}

}

function addMessage(
type,
text,
id=""
){

const chat =
document.getElementById(
"chat"
);

const div =
document.createElement(
"div"
);

div.className =
"message " + type;

if(id)
div.id=id;

div.textContent=text;

chat.appendChild(div);

chat.scrollTop =
chat.scrollHeight;

}

/* ============================================================
   PLANS
============================================================ */

async function loadPlans(){

const box =
document.getElementById(
"plansBox"
);

if(!plansData){

try{

const response =
await api("/api/plans");

plansData =
await response.json();

}catch(e){

box.innerHTML =
"خطا در دریافت پلن‌ها.";

return;

}

}

renderPlans();

}

function setCurrency(x){

currency=x;

renderPlans();

}

function renderPlans(){

if(!plansData)
return;

const box =
document.getElementById(
"plansBox"
);

const plans =
currency === "usd"
?
plansData.plans_usd
:
plansData.plans;

box.innerHTML =
plans.map(plan=>{

const usd =
currency === "usd";

const price =
usd
?
"$" + plan.price_usd
:
num(plan.price_toman);

const isPopular =
plan.id === "pro" ||
plan.id === "special";

const button =
plan.price_toman === 0
?

`
<button
class="btn secondary"
style="width:100%"
onclick="showView('ai')"
>
شروع استفاده
</button>
`

:

usd
?

`
<button
class="btn secondary"
style="width:100%"
onclick="msg('پرداخت دلاری به‌زودی فعال می‌شود. درگاه زرین‌پال برای پرداخت تومانی است.')"
>
پرداخت بین‌المللی
</button>
`

:

`
<button
class="btn primary"
style="width:100%"
onclick="buyPlan('${plan.id}')"
>
💳 خرید پلن
</button>
`;

return `

<div
class="plan ${
isPopular ? "popular" : ""
}"
>

${
isPopular
?
`
<div class="badge">
محبوب
</div>
`
:
""
}

<h3>
${esc(plan.name)}
</h3>

<div class="price">

${price}

<small>

${
usd
?
" / month"
:
" تومان / ماه"
}

</small>

</div>

<ul>

${
(plan.features || [])
.map(f =>
`<li>${esc(f)}</li>`
)
.join("")
}

</ul>

${button}

</div>

`;

}).join("");

}

/* ============================================================
   BUY
============================================================ */

async function buyPlan(id){

if(!token){

msg(
"برای خرید ابتدا وارد حساب شوید."
);

showView("login");

return;

}

try{

const response =
await api(
"/api/payment/request",
{

method:"POST",

body:JSON.stringify({
planId:id
})

}
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
"خطا در پرداخت"
);

window.location.href =
data.payment_url;

}catch(e){

msg(e.message);

}

}

/* ============================================================
   ADMIN
============================================================ */

async function adminLogin(){

try{

const response =
await adminApi(
"/api/admin/login",
{

method:"POST",

body:JSON.stringify({

password:
document.getElementById(
"adminPassword"
).value

})

}
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
"خطا"
);

adminToken=data.token;

localStorage.setItem(
"abzarak_admin_token",
adminToken
);

showAdmin();

}catch(e){

msg(e.message);

}

}

function showAdmin(){

document
.getElementById("adminLogin")
.classList.add("hidden");

document
.getElementById("adminPanel")
.classList.remove("hidden");

adminUsers();

}

async function adminUsers(){

const box =
document.getElementById(
"adminContent"
);

box.innerHTML =
"در حال دریافت کاربران...";

try{

const response =
await adminApi(
"/api/admin/users"
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error || "خطا"
);

box.innerHTML=`

<h3>
👥 کاربران
</h3>

<div class="table-wrap">

<table>

<thead>

<tr>

<th>
نام
</th>

<th>
ایمیل
</th>

<th>
موجودی
</th>

<th>
تاریخ
</th>

</tr>

</thead>

<tbody>

${(data.users || [])
.map(x=>`

<tr>

<td>
${esc(x.name)}
</td>

<td>
${esc(x.email)}
</td>

<td>
${num(x.balance)}
تومان
</td>

<td>
${esc(x.created_at)}
</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

`;

}catch(e){

box.innerHTML =
`
<div class="notice">
${esc(e.message)}
</div>
`;

}

}

async function adminPayments(){

const box =
document.getElementById(
"adminContent"
);

box.innerHTML =
"در حال دریافت تراکنش‌ها...";

try{

const response =
await adminApi(
"/api/admin/payments"
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error || "خطا"
);

box.innerHTML=`

<h3>
💳 تراکنش‌ها
</h3>

<div class="table-wrap">

<table>

<thead>

<tr>

<th>
ایمیل
</th>

<th>
پلن
</th>

<th>
مبلغ
</th>

<th>
وضعیت
</th>

</tr>

</thead>

<tbody>

${(data.payments || [])
.map(x=>`

<tr>

<td>
${esc(x.email)}
</td>

<td>
${esc(x.plan_id || "-")}
</td>

<td>
${num(x.amount_toman)}
تومان
</td>

<td>
${esc(x.status)}
</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

`;

}catch(e){

box.innerHTML =
`
<div class="notice">
${esc(e.message)}
</div>
`;

}

}

async function adminWithdrawals(){

const box =
document.getElementById(
"adminContent"
);

box.innerHTML =
"در حال دریافت برداشت‌ها...";

try{

const response =
await adminApi(
"/api/admin/withdrawals"
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error || "خطا"
);

const rows =
data.withdrawals || [];

box.innerHTML=`

<h3>
💸 درخواست‌های برداشت
</h3>

<div class="table-wrap">

<table>

<thead>

<tr>

<th>
ایمیل
</th>

<th>
مبلغ
</th>

<th>
مقصد
</th>

<th>
وضعیت
</th>

<th>
عملیات
</th>

</tr>

</thead>

<tbody>

${rows.map(x=>`

<tr>

<td>
${esc(x.email)}
</td>

<td>
${num(x.amount)}
تومان
</td>

<td>
${esc(x.destination)}
</td>

<td>
${esc(x.status)}
</td>

<td>

${
x.status === "pending"
?

`
<button
class="btn primary"
onclick="processWithdrawal('${x.id}','paid')"
>
پرداخت شد
</button>

<button
class="btn danger"
onclick="processWithdrawal('${x.id}','rejected')"
>
رد
</button>
`

:

"-"
}

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

`;

}catch(e){

box.innerHTML =
`
<div class="notice">
${esc(e.message)}
</div>
`;

}

}

async function processWithdrawal(
id,
action
){

try{

const response =
await adminApi(
"/api/admin/withdrawals/process",
{

method:"POST",

body:JSON.stringify({
id,
action
})

}
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error || "خطا"
);

msg(
data.message ||
"انجام شد."
);

adminWithdrawals();

}catch(e){

msg(e.message);

}

}

function adminLogout(){

adminToken="";

localStorage.removeItem(
"abzarak_admin_token"
);

document
.getElementById("adminLogin")
.classList.remove("hidden");

document
.getElementById("adminPanel")
.classList.add("hidden");

}

/* ============================================================
   HELPERS
============================================================ */

function num(x){

return Number(
x || 0
).toLocaleString("fa-IR");

}

function esc(x){

return String(x ?? "")
.replaceAll("&","&amp;")
.replaceAll("<","&lt;")
.replaceAll(">","&gt;")
.replaceAll('"',"&quot;")
.replaceAll("'","&#039;");

}

/* ============================================================
   LANGUAGE
============================================================ */

function toggleLang(){

const html =
document.documentElement;

const btn =
document.getElementById(
"langBtn"
);

if(html.lang === "fa"){

html.lang="en";

html.dir="ltr";

btn.textContent="فارسی";

document.title =
"Abzarak | Multilingual AI Assistant";

}else{

html.lang="fa";

html.dir="rtl";

btn.textContent="English";

document.title =
"ابزارک | دستیار هوش مصنوعی فارسی و چندزبانه";

}

}

/* ============================================================
   PWA
============================================================ */

window.addEventListener(
"beforeinstallprompt",
event=>{

event.preventDefault();

pwaPrompt=event;

document
.getElementById("installBtn")
.classList.remove("hidden");

}
);

async function installPwa(){

if(!pwaPrompt){

msg(
"از منوی Chrome گزینه «افزودن به صفحه اصلی» را انتخاب کنید."
);

return;

}

pwaPrompt.prompt();

await pwaPrompt.userChoice;

pwaPrompt=null;

document
.getElementById("installBtn")
.classList.add("hidden");

}

/* ============================================================
   PAYMENT RESULT
============================================================ */

function paymentResult(){

const p =
new URLSearchParams(
location.search
).get("payment");

if(!p)
return;

if(p === "success"){

alert(
"✅ پرداخت موفق بود و اشتراک شما فعال شد."
);

}

if(p === "cancel"){

alert(
"پرداخت لغو شد."
);

}

if(p === "failed"){

alert(
"❌ پرداخت تأیید نشد."
);

}

if(p === "error"){

const reason =
new URLSearchParams(
location.search
).get("reason");

alert(
"❌ خطا در پرداخت." +
(reason
? "\\n\\n" + reason
: "")
);

}

history.replaceState(
{},
document.title,
"/"
);

}

/* ============================================================
   START
============================================================ */

document.addEventListener(
"DOMContentLoaded",
()=>{

paymentResult();

loadPlans();

if(token)
loadAccount();

if(adminToken){

document
.getElementById("adminLogin")
.classList.add("hidden");

document
.getElementById("adminPanel")
.classList.remove("hidden");

}

if("serviceWorker" in navigator){

navigator.serviceWorker
.register("/sw.js")
.catch(()=>{});

}

}
);

</script>

</body>
</html>`;
}
