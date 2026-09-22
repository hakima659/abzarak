// =============================================================
// HOMEPAGE — GLOBAL MULTILINGUAL VERSION
// Persian + English
// Existing Auth / AI / Plans / Admin / PWA preserved
// =============================================================

function renderHomepage() {

  const page = (strings, ...values) => {
    return String.raw(strings, ...values)
      .replaceAll("\\`", "`")
      .replaceAll("\\${", "${");
  };

  return page`<!DOCTYPE html>
<html lang="fa" dir="rtl">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width,initial-scale=1,viewport-fit=cover">

<meta name="theme-color" content="#12163a">

<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="ابزارک">
<meta name="application-name" content="Abzarak AI">

<title>ابزارک | دستیار هوش مصنوعی فارسی و چندزبانه</title>

<meta
name="description"
content="ابزارک یک دستیار هوش مصنوعی فارسی و چندزبانه برای گفتگو، پاسخ به سوالات، ترجمه، تولید محتوا و کارهای روزمره است."
>

<meta
name="keywords"
content="دستیار هوش مصنوعی فارسی, هوش مصنوعی فارسی, چت با هوش مصنوعی فارسی, چت بات فارسی, هوش مصنوعی آنلاین, multilingual AI assistant, AI assistant, AI chatbot, Abzarak AI, ابزارک"
>

<meta name="author" content="ابزارک">

<meta
name="robots"
content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
>

<meta
name="googlebot"
content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
>

<link rel="canonical" href="https://abzarakai.ir/">

<link rel="alternate" hreflang="fa" href="https://abzarakai.ir/">
<link rel="alternate" hreflang="en" href="https://abzarakai.ir/">
<link rel="alternate" hreflang="x-default" href="https://abzarakai.ir/">

<meta property="og:type" content="website">
<meta property="og:site_name" content="ابزارک">

<meta
property="og:title"
content="Abzarak AI | Multilingual AI Assistant"
>

<meta
property="og:description"
content="A multilingual AI assistant for conversation, questions, translation, content creation and everyday tasks."
>

<meta property="og:url" content="https://abzarakai.ir/">
<meta property="og:locale" content="fa_IR">
<meta property="og:locale:alternate" content="en_US">

<meta
property="og:image"
content="https://abzarakai.ir/icon.svg"
>

<meta name="twitter:card" content="summary_large_image">

<meta
name="twitter:title"
content="Abzarak AI | Multilingual AI Assistant"
>

<meta
name="twitter:description"
content="Chat with AI, ask questions, translate, create content and get help with everyday tasks."
>

<meta
name="twitter:image"
content="https://abzarakai.ir/icon.svg"
>

<link rel="manifest" href="/manifest.json">

<link rel="icon" href="/icon.svg" type="image/svg+xml">

<link rel="apple-touch-icon" href="/icon.svg">

<meta name="enamad" content="36032134">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://abzarakai.ir/#website",
      "url": "https://abzarakai.ir/",
      "name": "Abzarak AI",
      "alternateName": "ابزارک",
      "description": "A multilingual AI assistant for conversation, questions, translation, content creation and everyday tasks.",
      "inLanguage": ["fa-IR","en"]
    },
    {
      "@type": "Organization",
      "@id": "https://abzarakai.ir/#organization",
      "name": "Abzarak AI",
      "alternateName": "ابزارک",
      "url": "https://abzarakai.ir/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://abzarakai.ir/icon.svg"
      }
    },
    {
      "@type": "WebApplication",
      "@id": "https://abzarakai.ir/#application",
      "name": "Abzarak AI",
      "alternateName": "ابزارک",
      "url": "https://abzarakai.ir/",
      "description": "A multilingual AI assistant for chat, translation, content creation and everyday tasks.",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Android, iOS, Windows, macOS, Linux",
      "browserRequirements": "Requires a modern web browser",
      "inLanguage": ["fa-IR","en"],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "description": "Limited free plan"
      }
    }
  ]
}
</script>

<style>

*{box-sizing:border-box}

html{scroll-behavior:smooth}

body{
margin:0;
font-family:Tahoma,Arial,sans-serif;
background:linear-gradient(180deg,#f6f8ff,#eef2ff);
color:#17203a;
}

button,input{font:inherit}

button{cursor:pointer}

.hidden{display:none!important}

.container{
width:min(1180px,94%);
margin:auto;
}

header{
position:sticky;
top:0;
z-index:50;
background:rgba(255,255,255,.94);
backdrop-filter:blur(15px);
border-bottom:1px solid #e5e7eb;
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
padding:35px 0 60px;
}

.view.active{display:block}

.hero{
margin-top:25px;
padding:70px 35px;
border-radius:32px;
color:#fff;
background:
radial-gradient(circle at 85% 10%,rgba(255,255,255,.3),transparent 25%),
linear-gradient(135deg,#111936,#4338ca 55%,#2563eb);
box-shadow:0 25px 80px rgba(37,48,120,.22);
}

.hero h1{
font-size:clamp(34px,6vw,62px);
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
background:rgba(255,255,255,.12);
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
background:linear-gradient(135deg,#4f46e5,#2563eb);
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

.free-limit{
margin-top:22px;
display:flex;
align-items:center;
gap:12px;
flex-wrap:wrap;
padding:15px 18px;
border-radius:18px;
background:linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,.08));
border:1px solid rgba(255,255,255,.25);
color:#fff;
font-weight:800;
}

.free-limit-icon{font-size:25px}

.free-limit strong{color:#fff}

.free-limit small{
color:#dfe5ff;
font-size:13px;
}

.ad-slot{
position:relative;
margin:25px 0;
border-radius:24px;
overflow:hidden;
box-shadow:0 15px 45px rgba(30,41,90,.12);
}

.ad-label{
position:absolute;
top:10px;
right:12px;
z-index:5;
font-size:11px;
font-weight:900;
padding:5px 9px;
border-radius:999px;
background:rgba(255,255,255,.88);
color:#475569;
backdrop-filter:blur(8px);
}

.ad-image{
width:100%;
display:block;
line-height:0;
background:#312e81;
}

.ad-image svg{
display:block;
width:100%;
height:auto;
}

.ad-content{
padding:18px 20px 22px;
text-align:center;
background:#fff;
}

.ad-content h3{
margin:0 0 8px;
font-size:21px;
color:#1e1b4b;
}

.ad-content p{
margin:0 auto 14px;
max-width:700px;
line-height:1.9;
font-size:14px;
color:#64748b;
}

.ad-free{
display:inline-block;
padding:9px 15px;
margin-bottom:14px;
border-radius:14px;
background:#ecfeff;
border:1px solid #a5f3fc;
color:#155e75;
font-size:14px;
font-weight:800;
}

.ad-cta{
border:0;
border-radius:13px;
padding:12px 22px;
font-weight:900;
background:linear-gradient(135deg,#4f46e5,#2563eb);
color:#fff;
box-shadow:0 8px 20px rgba(79,70,229,.22);
}

.ad-blue .ad-content{
background:linear-gradient(180deg,#fff,#f5f3ff);
}

.ad-green .ad-content{
background:linear-gradient(180deg,#fff,#ecfdf5);
}

.ad-orange .ad-content{
background:linear-gradient(180deg,#fff,#fff7ed);
}

.section{padding:42px 0}

.features,
.plans,
.account-grid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:18px;
margin-top:20px;
}

.card,
.plan{
background:#fff;
border:1px solid #e5e7eb;
border-radius:22px;
padding:23px;
box-shadow:0 12px 35px rgba(15,23,42,.06);
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
box-shadow:0 0 0 4px rgba(99,102,241,.1);
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

.ai-row input{margin:0}

.ai-row button{white-space:nowrap}

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

th,td{
padding:11px;
border-bottom:1px solid #edf0f5;
text-align:right;
}

th{background:#f8fafc}

#seo-content{
margin-top:25px;
background:#fff;
border:1px solid #e5e7eb;
border-radius:24px;
padding:30px;
box-shadow:0 10px 30px rgba(15,23,42,.04);
}

#seo-content h2{
color:#1e1b4b;
margin-top:30px;
line-height:1.6;
}

#seo-content p,
#seo-content li{
line-height:2;
color:#475569;
}

#seo-content ul{
padding-right:25px;
}

body[dir="ltr"] #seo-content ul{
padding-right:0;
padding-left:25px;
}

body[dir="ltr"] th,
body[dir="ltr"] td{
text-align:left;
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
grid-template-columns:repeat(2,1fr);
}

.brand{
width:100%;
justify-content:center;
margin:0;
}

}

@media(max-width:600px){

.container{width:94%}

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

.nav{justify-content:center}

.nav-links{
width:100%;
}

.nav-links button{
font-size:13px;
padding:8px;
}

#seo-content{padding:22px}

.ad-content{
padding:16px 14px 20px;
}

.ad-content h3{font-size:18px}

.ad-content p{font-size:13px}

.ad-cta{width:100%}

.free-limit{font-size:14px}

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
alt="Abzarak AI logo"
>

🤖 <span data-i18n="brand">ابزارک</span>

</a>

<nav class="nav-links" aria-label="Main navigation">

<button onclick="showView('home')" data-i18n="navHome">
🏠 خانه
</button>

<button onclick="showView('account')" data-i18n="navAccount">
👤 حساب
</button>

<button onclick="showView('ai')" data-i18n="navAI">
🤖 هوش مصنوعی
</button>

<button onclick="showView('plans')" data-i18n="navPlans">
💰 پلن‌ها
</button>

<button onclick="showView('admin')" data-i18n="navAdmin">
🛠️ مدیریت
</button>

</nav>

<button
id="installBtn"
class="top-btn install hidden"
onclick="installPwa()"
data-i18n="install"
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

<section id="view-home" class="view active">

<div class="hero">

<div class="badge" data-i18n="heroBadge">
✨ دستیار هوش مصنوعی فارسی و چندزبانه
</div>

<h1 data-i18n="heroTitle">
ابزارک؛ دستیار هوش مصنوعی فارسی
</h1>

<p data-i18n="heroText">
با ابزارک با هوش مصنوعی فارسی گفتگو کنید،
سؤال بپرسید، پاسخ دریافت کنید، متن تولید کنید،
ترجمه کنید و برای انجام کارهای روزمره از یک
دستیار هوشمند آنلاین کمک بگیرید.
</p>

<div class="actions">

<button
class="btn light"
onclick="showView('ai')"
data-i18n="startChat"
>
🤖 شروع گفتگو
</button>

<button
class="btn"
style="background:rgba(255,255,255,.15);color:white"
onclick="showView('plans')"
data-i18n="viewPlans"
>
💎 مشاهده پلن‌ها
</button>

</div>

<div class="free-limit">

<div class="free-limit-icon">🆓</div>

<div>

<strong data-i18n="freeTitle">
شروع با سهمیه رایگان محدود
</strong>

<br>

<small data-i18n="freeText">
۱۰ پیام رایگان در روز؛ برای استفاده بیشتر، پلن خود را ارتقا دهید.
</small>

</div>

</div>

</div>

<div class="ad-slot ad-blue">

<div class="ad-label" data-i18n="adLabel">
تبلیغات
</div>

<div class="ad-image">

<svg
viewBox="0 0 1000 430"
xmlns="http://www.w3.org/2000/svg"
role="img"
aria-label="Abzarak AI"
>

<defs>

<linearGradient
id="adGradient1"
x1="0%"
y1="0%"
x2="100%"
y2="100%"
>

<stop offset="0%" stop-color="#111936"/>
<stop offset="48%" stop-color="#4338ca"/>
<stop offset="100%" stop-color="#7c3aed"/>

</linearGradient>

<linearGradient
id="adGlow1"
x1="0%"
y1="0%"
x2="100%"
y2="0%"
>

<stop offset="0%" stop-color="#22d3ee"/>
<stop offset="100%" stop-color="#a78bfa"/>

</linearGradient>

</defs>

<rect
width="1000"
height="430"
rx="32"
fill="url(#adGradient1)"
/>

<circle
cx="850"
cy="70"
r="180"
fill="#ffffff"
opacity=".07"
/>

<circle
cx="80"
cy="390"
r="180"
fill="#22d3ee"
opacity=".07"
/>

<rect
x="700"
y="105"
width="190"
height="175"
rx="38"
fill="#ffffff"
opacity=".12"
stroke="#ffffff"
stroke-opacity=".25"
/>

<circle cx="760" cy="165" r="16" fill="#ffffff"/>
<circle cx="830" cy="165" r="16" fill="#ffffff"/>

<path
d="M750 215 Q795 250 840 215"
fill="none"
stroke="#ffffff"
stroke-width="11"
stroke-linecap="round"
/>

<text
x="650"
y="100"
text-anchor="end"
fill="#ffffff"
font-size="48"
font-weight="700"
font-family="Tahoma, Arial, sans-serif"
>
Abzarak AI
</text>

<text
x="650"
y="158"
text-anchor="end"
fill="#eef2ff"
font-size="27"
font-family="Tahoma, Arial, sans-serif"
>
Multilingual AI Assistant
</text>

<text
x="650"
y="200"
text-anchor="end"
fill="#ddd6fe"
font-size="22"
font-family="Tahoma, Arial, sans-serif"
>
Chat • Translation • Content
</text>

<rect
x="305"
y="245"
width="345"
height="72"
rx="36"
fill="#ffffff"
opacity=".14"
/>

<text
x="477"
y="291"
text-anchor="middle"
fill="#ffffff"
font-size="27"
font-weight="700"
font-family="Tahoma, Arial, sans-serif"
>
🆓 10 Free Messages / Day
</text>

<path
d="M90 105 L230 105"
stroke="url(#adGlow1)"
stroke-width="8"
stroke-linecap="round"
/>

<path
d="M90 130 L190 130"
stroke="#ffffff"
stroke-opacity=".35"
stroke-width="6"
stroke-linecap="round"
/>

</svg>

</div>

<div class="ad-content">

<h3 data-i18n="ad1Title">
✨ ابزارک؛ دستیار هوشمند شما
</h3>

<p data-i18n="ad1Text">
برای گفتگو، پرسش و پاسخ، ترجمه و تولید محتوا
از هوش مصنوعی استفاده کنید.
</p>

<div class="ad-free">
🆓 <span data-i18n="dailyQuota">سهمیه رایگان</span>:
<strong data-i18n="tenMessages">
۱۰ پیام در روز
</strong>
</div>

<br>

<button
class="ad-cta"
onclick="showView('ai')"
data-i18n="startChat"
>
🤖 شروع گفتگو
</button>

</div>

</div>

<div class="section">

<h2 data-i18n="sectionTitle">
🌍 دستیار هوش مصنوعی برای کارهای روزمره
</h2>

<p class="muted" data-i18n="sectionText">
ابزارک یک دستیار هوش مصنوعی آنلاین و فارسی است
که برای کاربران فارسی‌زبان و کاربران سراسر جهان
طراحی شده است.
</p>

<div class="features">

<div class="card">
<h2>🤖</h2>
<h3 data-i18n="feature1Title">
گفتگو با هوش مصنوعی فارسی
</h3>
<p class="muted" data-i18n="feature1Text">
سؤال‌های خود را به فارسی مطرح کنید و
پاسخ‌های هوشمند دریافت کنید.
</p>
</div>

<div class="card">
<h2>✍️</h2>
<h3 data-i18n="feature2Title">
تولید و بازنویسی متن
</h3>
<p class="muted" data-i18n="feature2Text">
برای نوشتن، بازنویسی، خلاصه‌سازی و
ایده‌پردازی از هوش مصنوعی کمک بگیرید.
</p>
</div>

<div class="card">
<h2>🌍</h2>
<h3 data-i18n="feature3Title">
دستیار هوش مصنوعی چندزبانه
</h3>
<p class="muted" data-i18n="feature3Text">
پیام خود را به زبان موردنظر بنویسید و
برای کارهای مختلف از ابزارک کمک بگیرید.
</p>
</div>

<div class="card">
<h2>📱</h2>
<h3 data-i18n="feature4Title">
هوش مصنوعی برای موبایل و کامپیوتر
</h3>
<p class="muted" data-i18n="feature4Text">
ابزارک برای استفاده راحت در موبایل،
تبلت و کامپیوتر طراحی شده است.
</p>
</div>

<div class="card">
<h2>🔐</h2>
<h3 data-i18n="feature5Title">
حساب کاربری و اشتراک
</h3>
<p class="muted" data-i18n="feature5Text">
حساب کاربری، اشتراک‌ها و سوابق استفاده
خود را مدیریت کنید.
</p>
</div>

<div class="card">
<h2>💎</h2>
<h3 data-i18n="feature6Title">
پلن‌های اشتراکی هوش مصنوعی
</h3>
<p class="muted" data-i18n="feature6Text">
برای استفاده بیشتر از امکانات هوش مصنوعی،
پلن مناسب خود را انتخاب کنید.
</p>
</div>

</div>

</div>

<div class="ad-slot ad-green">

<div class="ad-label" data-i18n="adLabel">
تبلیغات
</div>

<div class="ad-image">

<svg
viewBox="0 0 1000 350"
xmlns="http://www.w3.org/2000/svg"
role="img"
aria-label="Abzarak AI free plan"
>

<defs>

<linearGradient
id="adGradient2"
x1="0%"
y1="0%"
x2="100%"
y2="100%"
>

<stop offset="0%" stop-color="#047857"/>
<stop offset="50%" stop-color="#059669"/>
<stop offset="100%" stop-color="#0284c7"/>

</linearGradient>

</defs>

<rect
width="1000"
height="350"
rx="30"
fill="url(#adGradient2)"
/>

<circle
cx="100"
cy="70"
r="150"
fill="#ffffff"
opacity=".07"
/>

<circle
cx="900"
cy="300"
r="190"
fill="#ffffff"
opacity=".06"
/>

<text
x="500"
y="100"
text-anchor="middle"
fill="#ffffff"
font-size="43"
font-weight="700"
font-family="Tahoma, Arial, sans-serif"
>
🚀 More with Abzarak AI
</text>

<text
x="500"
y="155"
text-anchor="middle"
fill="#ecfdf5"
font-size="25"
font-family="Tahoma, Arial, sans-serif"
>
Start with a daily free allowance
</text>

<rect
x="300"
y="205"
width="400"
height="75"
rx="37"
fill="#ffffff"
opacity=".15"
/>

<text
x="500"
y="254"
text-anchor="middle"
fill="#ffffff"
font-size="29"
font-weight="700"
font-family="Tahoma, Arial, sans-serif"
>
🆓 10 Free Messages / Day
</text>

</svg>

</div>

<div class="ad-content">

<h3 data-i18n="ad2Title">
🚀 استفاده بیشتر با پلن‌های اشتراکی
</h3>

<p data-i18n="ad2Text">
اگر سهمیه روزانه شما تمام شد،
می‌توانید پلن مناسب خود را انتخاب کنید.
</p>

<button
class="ad-cta"
onclick="showView('plans')"
data-i18n="viewPlans"
>
💎 مشاهده پلن‌ها
</button>

</div>

</div>

<section id="seo-content">

<h2 data-i18n="seoTitle1">
ابزارک؛ دستیار هوش مصنوعی فارسی
</h2>

<p data-i18n="seoText1">
ابزارک یک دستیار هوش مصنوعی فارسی و چندزبانه
است که برای گفتگو، پاسخ به سوالات، تولید محتوا،
ترجمه، بازنویسی متن و انجام کارهای روزمره طراحی شده است.
</p>

<h2 data-i18n="seoTitle2">
چت با هوش مصنوعی فارسی
</h2>

<p data-i18n="seoText2">
با ابزارک می‌توانید با هوش مصنوعی فارسی گفتگو کنید،
سؤال بپرسید، ایده دریافت کنید، متن بنویسید،
متن‌های خود را بازنویسی کنید و برای کارهای روزمره
از یک دستیار هوشمند آنلاین کمک بگیرید.
</p>

<h2 data-i18n="seoTitle3">
هوش مصنوعی فارسی چیست؟
</h2>

<p data-i18n="seoText3">
هوش مصنوعی فارسی به ابزارهایی گفته می‌شود که
می‌توانند متن فارسی را درک کنند و به درخواست‌های
کاربر به زبان فارسی پاسخ دهند.
</p>

<h2 data-i18n="seoTitle4">
امکانات دستیار هوشمند ابزارک
</h2>

<ul>

<li data-i18n="seoLi1">گفتگو با هوش مصنوعی فارسی</li>
<li data-i18n="seoLi2">پاسخ به سوالات و درخواست‌های روزمره</li>
<li data-i18n="seoLi3">تولید محتوای متنی</li>
<li data-i18n="seoLi4">بازنویسی و بهبود متن</li>
<li data-i18n="seoLi5">خلاصه‌سازی و ایده‌پردازی</li>
<li data-i18n="seoLi6">کمک در ترجمه و کار با زبان‌های مختلف</li>
<li data-i18n="seoLi7">حساب کاربری و مدیریت اشتراک</li>
<li data-i18n="seoLi8">استفاده در موبایل، تبلت و کامپیوتر</li>

</ul>

<h2 data-i18n="seoTitle5">
دستیار هوش مصنوعی آنلاین برای موبایل و کامپیوتر
</h2>

<p data-i18n="seoText5">
ابزارک به صورت آنلاین در مرورگر قابل استفاده است
و طراحی آن برای موبایل، تبلت و کامپیوتر انجام شده است.
</p>

<h2 data-i18n="seoTitle6">
تولید محتوا با هوش مصنوعی
</h2>

<p data-i18n="seoText6">
دستیار هوش مصنوعی ابزارک می‌تواند برای ایده‌پردازی،
نوشتن و بازنویسی متن و آماده‌سازی محتوای متنی
به کاربران کمک کند.
</p>

<h2 data-i18n="seoTitle7">
پلن رایگان محدود ابزارک
</h2>

<p data-i18n="seoText7">
کاربران بدون اشتراک می‌توانند هر روز تا ۱۰ پیام
از هوش مصنوعی استفاده کنند. پس از رسیدن به سقف روزانه،
کاربر می‌تواند برای ادامه استفاده یکی از پلن‌های
اشتراکی را انتخاب کند.
</p>

<h2 data-i18n="seoTitle8">
پلن‌های اشتراکی ابزارک
</h2>

<p data-i18n="seoText8">
پلن‌های اشتراکی برای کاربرانی طراحی شده‌اند که
به استفاده بیشتر از هوش مصنوعی نیاز دارند.
</p>

<h2 data-i18n="seoTitle9">
چرا ابزارک؟
</h2>

<p data-i18n="seoText9">
ابزارک تلاش می‌کند یک دستیار هوش مصنوعی ساده،
کاربردی و چندزبانه برای کاربران فارسی‌زبان و
کاربران سراسر جهان ارائه کند.
</p>

</section>

<div class="ad-slot ad-orange">

<div class="ad-label" data-i18n="adLabel">
تبلیغات
</div>

<div class="ad-image">

<svg
viewBox="0 0 1000 350"
xmlns="http://www.w3.org/2000/svg"
role="img"
aria-label="Abzarak AI"
>

<defs>

<linearGradient
id="adGradient3"
x1="0%"
y1="0%"
x2="100%"
y2="100%"
>

<stop offset="0%" stop-color="#c2410c"/>
<stop offset="50%" stop-color="#ea580c"/>
<stop offset="100%" stop-color="#ca8a04"/>

</linearGradient>

</defs>

<rect
width="1000"
height="350"
rx="30"
fill="url(#adGradient3)"
/>

<circle
cx="880"
cy="80"
r="150"
fill="#ffffff"
opacity=".08"
/>

<circle
cx="100"
cy="300"
r="140"
fill="#ffffff"
opacity=".06"
/>

<text
x="500"
y="105"
text-anchor="middle"
fill="#ffffff"
font-size="43"
font-weight="700"
font-family="Tahoma, Arial, sans-serif"
>
💡 Discover Abzarak AI
</text>

<text
x="500"
y="165"
text-anchor="middle"
fill="#fff7ed"
font-size="25"
font-family="Tahoma, Arial, sans-serif"
>
Multilingual AI assistant
</text>

<rect
x="350"
y="215"
width="300"
height="65"
rx="32"
fill="#ffffff"
opacity=".16"
/>

<text
x="500"
y="258"
text-anchor="middle"
fill="#ffffff"
font-size="26"
font-weight="700"
font-family="Tahoma, Arial, sans-serif"
>
🤖 Start Chatting
</text>

</svg>

</div>

<div class="ad-content">

<h3 data-i18n="ad3Title">
💡 یک ابزار جدید را کشف کنید
</h3>

<p data-i18n="ad3Text">
با ابزارک گفتگو کنید، سؤال بپرسید و از هوش مصنوعی
برای کارهای روزمره کمک بگیرید.
</p>

<button
class="ad-cta"
onclick="showView('ai')"
data-i18n="continue"
>
🤖 ادامه
</button>

</div>

</div>

</section>


<!-- LOGIN -->

<section id="view-login" class="view">

<div class="card form">

<h2 data-i18n="loginTitle">
🔑 ورود به حساب
</h2>

<input
id="loginEmail"
class="input"
type="email"
placeholder="ایمیل"
autocomplete="email"
data-i18n-placeholder="email"
>

<input
id="loginPassword"
class="input"
type="password"
placeholder="رمز عبور"
autocomplete="current-password"
data-i18n-placeholder="password"
>

<button
class="btn primary"
style="width:100%"
onclick="login()"
data-i18n="login"
>
ورود
</button>

<button
class="btn secondary"
style="width:100%;margin-top:8px"
onclick="showView('signup')"
data-i18n="signup"
>
📝 ثبت‌نام
</button>

<button
class="btn"
style="width:100%;margin-top:8px;background:transparent;color:#4f46e5"
onclick="showView('forgot')"
data-i18n="forgot"
>
فراموشی رمز عبور؟
</button>

</div>

</section>


<!-- SIGNUP -->

<section id="view-signup" class="view">

<div class="card form">

<h2 data-i18n="signupTitle">
📝 ثبت‌نام
</h2>

<input
id="signupName"
class="input"
placeholder="نام"
autocomplete="name"
data-i18n-placeholder="name"
>

<input
id="signupEmail"
class="input"
type="email"
placeholder="ایمیل"
autocomplete="email"
data-i18n-placeholder="email"
>

<input
id="signupPassword"
class="input"
type="password"
placeholder="رمز عبور حداقل ۶ کاراکتر"
autocomplete="new-password"
data-i18n-placeholder="passwordMin"
>

<button
class="btn primary"
style="width:100%"
onclick="signup()"
data-i18n="signup"
>
ثبت‌نام
</button>

</div>

</section>


<!-- FORGOT -->

<section id="view-forgot" class="view">

<div class="card form">

<h2 data-i18n="forgotTitle">
🔐 بازیابی رمز عبور
</h2>

<p class="muted" data-i18n="forgotText">
ایمیل خود را وارد کنید تا کد بازیابی برایتان ارسال شود.
</p>

<input
id="forgotEmail"
class="input"
type="email"
placeholder="ایمیل"
data-i18n-placeholder="email"
>

<button
class="btn primary"
style="width:100%"
onclick="forgotPassword()"
data-i18n="sendCode"
>
ارسال کد
</button>

<button
class="btn secondary"
style="width:100%;margin-top:8px"
onclick="showView('reset')"
data-i18n="haveCode"
>
کد را دارم
</button>

</div>

</section>


<!-- RESET -->

<section id="view-reset" class="view">

<div class="card form">

<h2 data-i18n="resetTitle">
🔑 تغییر رمز عبور
</h2>

<input
id="resetEmail"
class="input"
type="email"
placeholder="ایمیل"
data-i18n-placeholder="email"
>

<input
id="resetCode"
class="input"
placeholder="کد ۶ رقمی"
inputmode="numeric"
maxlength="6"
data-i18n-placeholder="resetCode"
>

<input
id="resetPassword"
class="input"
type="password"
placeholder="رمز جدید"
data-i18n-placeholder="newPassword"
>

<button
class="btn primary"
style="width:100%"
onclick="resetPassword()"
data-i18n="changePassword"
>
تغییر رمز
</button>

</div>

</section>


<!-- ACCOUNT -->

<section id="view-account" class="view">

<div class="card">

<h2 data-i18n="accountTitle">
🏠 حساب من
</h2>

<div id="accountBox">
در حال دریافت اطلاعات...
</div>

</div>

</section>


<!-- AI -->

<section id="view-ai" class="view">

<div class="card">

<h2 data-i18n="aiTitle">
🤖 گفتگو با هوش مصنوعی
</h2>

<div class="ad-slot ad-blue">

<div class="ad-label" data-i18n="adLabel">
تبلیغات
</div>

<div class="ad-image">

<svg
viewBox="0 0 1000 300"
xmlns="http://www.w3.org/2000/svg"
role="img"
aria-label="Abzarak AI"
>

<defs>

<linearGradient
id="aiAdGradient"
x1="0%"
y1="0%"
x2="100%"
y2="100%"
>

<stop offset="0%" stop-color="#1e1b4b"/>
<stop offset="50%" stop-color="#4338ca"/>
<stop offset="100%" stop-color="#2563eb"/>

</linearGradient>

</defs>

<rect
width="1000"
height="300"
rx="28"
fill="url(#aiAdGradient)"
/>

<circle
cx="880"
cy="50"
r="150"
fill="#ffffff"
opacity=".07"
/>

<circle
cx="100"
cy="280"
r="130"
fill="#22d3ee"
opacity=".06"
/>

<text
x="500"
y="85"
text-anchor="middle"
fill="#ffffff"
font-size="38"
font-weight="700"
font-family="Tahoma, Arial, sans-serif"
>
🤖 Abzarak AI
</text>

<text
x="500"
y="135"
text-anchor="middle"
fill="#e0e7ff"
font-size="23"
font-family="Tahoma, Arial, sans-serif"
>
Multilingual AI Assistant
</text>

<rect
x="300"
y="175"
width="400"
height="65"
rx="32"
fill="#ffffff"
opacity=".14"
/>

<text
x="500"
y="217"
text-anchor="middle"
fill="#ffffff"
font-size="25"
font-weight="700"
font-family="Tahoma, Arial, sans-serif"
>
🆓 10 Free Messages / Day
</text>

</svg>

</div>

<div class="ad-content">

<h3 data-i18n="freeStart">
✨ شروع رایگان با ابزارک
</h3>

<p data-i18n="dailyFree">
روزانه تا ۱۰ پیام رایگان برای گفتگو با هوش مصنوعی.
</p>

<div class="ad-free">
🆓 <span data-i18n="todayQuota">سهمیه امروز</span>:
<strong data-i18n="tenFree">
۱۰ پیام رایگان
</strong>
</div>

</div>

</div>

<div class="notice">

🆓
<strong data-i18n="limitedFree">
پلن رایگان محدود: ۱۰ پیام در روز
</strong>

<br>

💎
<span data-i18n="upgradeText">
برای استفاده بیشتر می‌توانید پلن اشتراکی انتخاب کنید.
</span>

</div>

<p class="muted" data-i18n="languageAI">
هر زبانی که استفاده کنید، ابزارک تلاش می‌کند به همان زبان پاسخ دهد.
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
data-i18n-placeholder="messagePlaceholder"
onkeydown="if(event.key==='Enter')sendAi()"
>

<button
class="btn primary"
onclick="sendAi()"
data-i18n="send"
>
ارسال
</button>

</div>

</div>

</section>


<!-- PLANS -->

<section id="view-plans" class="view">

<h2 data-i18n="plansTitle">
💰 پلن‌های اشتراک ابزارک
</h2>

<div class="notice">

🆓
<strong data-i18n="limitedFree">
پلن رایگان محدود: ۱۰ پیام در روز
</strong>

<br>

<span data-i18n="choosePlan">
برای استفاده بیشتر، یکی از پلن‌های اشتراکی را انتخاب کنید.
</span>

</div>

<p class="muted" data-i18n="choosePlan2">
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


<!-- ADMIN -->

<section id="view-admin" class="view">

<div id="adminLogin" class="card form">

<h2 data-i18n="adminTitle">
🛠️ مدیریت
</h2>

<input
id="adminPassword"
class="input"
type="password"
placeholder="رمز مدیریت"
data-i18n-placeholder="adminPassword"
>

<button
class="btn primary"
style="width:100%"
onclick="adminLogin()"
data-i18n="adminLogin"
>
ورود
</button>

</div>

<div id="adminPanel" class="hidden">

<div class="card">

<h2 data-i18n="adminPanelTitle">
🛠️ پنل مدیریت
</h2>

<div class="actions">

<button
class="btn secondary"
onclick="adminUsers()"
data-i18n="users"
>
👥 کاربران
</button>

<button
class="btn secondary"
onclick="adminPayments()"
data-i18n="transactions"
>
💳 تراکنش‌ها
</button>

<button
class="btn secondary"
onclick="adminWithdrawals()"
data-i18n="withdrawals"
>
💸 برداشت‌ها
</button>

<button
class="btn danger"
onclick="adminLogout()"
data-i18n="logout"
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

<strong>🤖 Abzarak AI</strong>

<br>

<span data-i18n="footerText">
دستیار هوش مصنوعی فارسی و چندزبانه
</span>

<br><br>

<span>
🆓 <span data-i18n="footerFree">
سهمیه رایگان محدود: ۱۰ پیام در روز
</span>
</span>

<br><br>

© 2026 Abzarak AI — <span data-i18n="rights">تمامی حقوق محفوظ است</span>

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

let currentLang =
localStorage.getItem("abzarak_lang") || "fa";


/* ============================================================
   TRANSLATIONS
============================================================ */

const translations = {

fa: {

brand:"ابزارک",

navHome:"🏠 خانه",
navAccount:"👤 حساب",
navAI:"🤖 هوش مصنوعی",
navPlans:"💰 پلن‌ها",
navAdmin:"🛠️ مدیریت",

install:"📲 نصب اپ",

heroBadge:"✨ دستیار هوش مصنوعی فارسی و چندزبانه",
heroTitle:"ابزارک؛ دستیار هوش مصنوعی فارسی",

heroText:
"با ابزارک با هوش مصنوعی فارسی گفتگو کنید، سؤال بپرسید، پاسخ دریافت کنید، متن تولید کنید، ترجمه کنید و برای انجام کارهای روزمره از یک دستیار هوشمند آنلاین کمک بگیرید.",

startChat:"🤖 شروع گفتگو",
viewPlans:"💎 مشاهده پلن‌ها",

freeTitle:"شروع با سهمیه رایگان محدود",
freeText:"۱۰ پیام رایگان در روز؛ برای استفاده بیشتر، پلن خود را ارتقا دهید.",

adLabel:"تبلیغات",

ad1Title:"✨ ابزارک؛ دستیار هوشمند شما",
ad1Text:"برای گفتگو، پرسش و پاسخ، ترجمه و تولید محتوا از هوش مصنوعی استفاده کنید.",

dailyQuota:"سهمیه رایگان",
tenMessages:"۱۰ پیام در روز",

sectionTitle:"🌍 دستیار هوش مصنوعی برای کارهای روزمره",
sectionText:"ابزارک یک دستیار هوش مصنوعی آنلاین و فارسی است که برای کاربران فارسی‌زبان و کاربران سراسر جهان طراحی شده است.",

feature1Title:"گفتگو با هوش مصنوعی فارسی",
feature1Text:"سؤال‌های خود را به فارسی مطرح کنید و پاسخ‌های هوشمند دریافت کنید.",

feature2Title:"تولید و بازنویسی متن",
feature2Text:"برای نوشتن، بازنویسی، خلاصه‌سازی و ایده‌پردازی از هوش مصنوعی کمک بگیرید.",

feature3Title:"دستیار هوش مصنوعی چندزبانه",
feature3Text:"پیام خود را به زبان موردنظر بنویسید و برای کارهای مختلف از ابزارک کمک بگیرید.",

feature4Title:"هوش مصنوعی برای موبایل و کامپیوتر",
feature4Text:"ابزارک برای استفاده راحت در موبایل، تبلت و کامپیوتر طراحی شده است.",

feature5Title:"حساب کاربری و اشتراک",
feature5Text:"حساب کاربری، اشتراک‌ها و سوابق استفاده خود را مدیریت کنید.",

feature6Title:"پلن‌های اشتراکی هوش مصنوعی",
feature6Text:"برای استفاده بیشتر از امکانات هوش مصنوعی، پلن مناسب خود را انتخاب کنید.",

ad2Title:"🚀 استفاده بیشتر با پلن‌های اشتراکی",
ad2Text:"اگر سهمیه روزانه شما تمام شد، می‌توانید پلن مناسب خود را انتخاب کنید.",

seoTitle1:"ابزارک؛ دستیار هوش مصنوعی فارسی",
seoText1:"ابزارک یک دستیار هوش مصنوعی فارسی و چندزبانه است که برای گفتگو، پاسخ به سوالات، تولید محتوا، ترجمه، بازنویسی متن و انجام کارهای روزمره طراحی شده است.",

seoTitle2:"چت با هوش مصنوعی فارسی",
seoText2:"با ابزارک می‌توانید با هوش مصنوعی فارسی گفتگو کنید، سؤال بپرسید، ایده دریافت کنید، متن بنویسید، متن‌های خود را بازنویسی کنید و برای کارهای روزمره از یک دستیار هوشمند آنلاین کمک بگیرید.",

seoTitle3:"هوش مصنوعی فارسی چیست؟",
seoText3:"هوش مصنوعی فارسی به ابزارهایی گفته می‌شود که می‌توانند متن فارسی را درک کنند و به درخواست‌های کاربر به زبان فارسی پاسخ دهند.",

seoTitle4:"امکانات دستیار هوشمند ابزارک",

seoLi1:"گفتگو با هوش مصنوعی فارسی",
seoLi2:"پاسخ به سوالات و درخواست‌های روزمره",
seoLi3:"تولید محتوای متنی",
seoLi4:"بازنویسی و بهبود متن",
seoLi5:"خلاصه‌سازی و ایده‌پردازی",
seoLi6:"کمک در ترجمه و کار با زبان‌های مختلف",
seoLi7:"حساب کاربری و مدیریت اشتراک",
seoLi8:"استفاده در موبایل، تبلت و کامپیوتر",

seoTitle5:"دستیار هوش مصنوعی آنلاین برای موبایل و کامپیوتر",
seoText5:"ابزارک به صورت آنلاین در مرورگر قابل استفاده است و طراحی آن برای موبایل، تبلت و کامپیوتر انجام شده است.",

seoTitle6:"تولید محتوا با هوش مصنوعی",
seoText6:"دستیار هوش مصنوعی ابزارک می‌تواند برای ایده‌پردازی، نوشتن و بازنویسی متن و آماده‌سازی محتوای متنی به کاربران کمک کند.",

seoTitle7:"پلن رایگان محدود ابزارک",
seoText7:"کاربران بدون اشتراک می‌توانند هر روز تا ۱۰ پیام از هوش مصنوعی استفاده کنند. پس از رسیدن به سقف روزانه، کاربر می‌تواند برای ادامه استفاده یکی از پلن‌های اشتراکی را انتخاب کند.",

seoTitle8:"پلن‌های اشتراکی ابزارک",
seoText8:"پلن‌های اشتراکی برای کاربرانی طراحی شده‌اند که به استفاده بیشتر از هوش مصنوعی نیاز دارند.",

seoTitle9:"چرا ابزارک؟",
seoText9:"ابزارک تلاش می‌کند یک دستیار هوش مصنوعی ساده، کاربردی و چندزبانه برای کاربران فارسی‌زبان و کاربران سراسر جهان ارائه کند.",

ad3Title:"💡 یک ابزار جدید را کشف کنید",
ad3Text:"با ابزارک گفتگو کنید، سؤال بپرسید و از هوش مصنوعی برای کارهای روزمره کمک بگیرید.",

continue:"🤖 ادامه",

loginTitle:"🔑 ورود به حساب",
login:"ورود",
signup:"📝 ثبت‌نام",
forgot:"فراموشی رمز عبور؟",

signupTitle:"📝 ثبت‌نام",

forgotTitle:"🔐 بازیابی رمز عبور",
forgotText:"ایمیل خود را وارد کنید تا کد بازیابی برایتان ارسال شود.",
sendCode:"ارسال کد",
haveCode:"کد را دارم",

resetTitle:"🔑 تغییر رمز عبور",
changePassword:"تغییر رمز",

accountTitle:"🏠 حساب من",

aiTitle:"🤖 گفتگو با هوش مصنوعی",
freeStart:"✨ شروع رایگان با ابزارک",
dailyFree:"روزانه تا ۱۰ پیام رایگان برای گفتگو با هوش مصنوعی.",
todayQuota:"سهمیه امروز",
tenFree:"۱۰ پیام رایگان",
limitedFree:"پلن رایگان محدود: ۱۰ پیام در روز",
upgradeText:"برای استفاده بیشتر می‌توانید پلن اشتراکی انتخاب کنید.",
languageAI:"هر زبانی که استفاده کنید، ابزارک تلاش می‌کند به همان زبان پاسخ دهد.",

send:"ارسال",
messagePlaceholder:"پیام خود را بنویسید...",

plansTitle:"💰 پلن‌های اشتراک ابزارک",
choosePlan:"برای استفاده بیشتر، یکی از پلن‌های اشتراکی را انتخاب کنید.",
choosePlan2:"پلن موردنظر خود را انتخاب کنید.",

adminTitle:"🛠️ مدیریت",
adminPassword:"رمز مدیریت",
adminLogin:"ورود",
adminPanelTitle:"🛠️ پنل مدیریت",

users:"👥 کاربران",
transactions:"💳 تراکنش‌ها",
withdrawals:"💸 برداشت‌ها",
logout:"خروج",

footerText:"دستیار هوش مصنوعی فارسی و چندزبانه",
footerFree:"سهمیه رایگان محدود: ۱۰ پیام در روز",
rights:"تمامی حقوق محفوظ است",

email:"ایمیل",
password:"رمز عبور",
name:"نام",
passwordMin:"رمز عبور حداقل ۶ کاراکتر",
resetCode:"کد ۶ رقمی",
newPassword:"رمز جدید"

},

en: {

brand:"Abzarak AI",

navHome:"🏠 Home",
navAccount:"👤 Account",
navAI:"🤖 AI",
navPlans:"💰 Plans",
navAdmin:"🛠️ Admin",

install:"📲 Install App",

heroBadge:"✨ Multilingual AI Assistant",
heroTitle:"Abzarak AI — Your Multilingual AI Assistant",

heroText:
"Chat with AI, ask questions, create content, translate text and get help with everyday tasks through a simple online AI assistant.",

startChat:"🤖 Start Chat",
viewPlans:"💎 View Plans",

freeTitle:"Start with a limited free allowance",
freeText:"10 free messages per day. Upgrade your plan when you need more.",

adLabel:"Advertisement",

ad1Title:"✨ Abzarak AI — Your Smart Assistant",
ad1Text:"Use AI for conversations, questions, translation and content creation.",

dailyQuota:"Free allowance",
tenMessages:"10 messages per day",

sectionTitle:"🌍 AI Assistant for Everyday Tasks",
sectionText:"Abzarak AI is an online multilingual AI assistant designed for users around the world.",

feature1Title:"AI Conversation",
feature1Text:"Ask questions and chat with an AI assistant in your preferred language.",

feature2Title:"Content Creation & Rewriting",
feature2Text:"Get help with writing, rewriting, summarizing and brainstorming.",

feature3Title:"Multilingual AI Assistant",
feature3Text:"Write your message in your preferred language and get help with different tasks.",

feature4Title:"AI for Mobile & Desktop",
feature4Text:"Abzarak AI is designed to work comfortably on phones, tablets and computers.",

feature5Title:"Account & Subscription",
feature5Text:"Manage your account, subscriptions and usage.",

feature6Title:"AI Subscription Plans",
feature6Text:"Choose a plan when you need more AI usage.",

ad2Title:"🚀 Get More with Subscription Plans",
ad2Text:"When your daily free allowance is used, you can choose a subscription plan.",

seoTitle1:"Abzarak AI — Multilingual AI Assistant",
seoText1:"Abzarak AI is a multilingual AI assistant designed for conversation, questions, content creation, translation, rewriting and everyday tasks.",

seoTitle2:"Chat with AI Online",
seoText2:"Use Abzarak AI to chat with an AI assistant, ask questions, generate ideas, write text, rewrite content and get help with everyday tasks.",

seoTitle3:"What is an AI Assistant?",
seoText3:"An AI assistant is a software service that can understand user requests and generate useful responses in different languages.",

seoTitle4:"Abzarak AI Features",

seoLi1:"AI conversations",
seoLi2:"Answers to everyday questions",
seoLi3:"Text content generation",
seoLi4:"Text rewriting and improvement",
seoLi5:"Summarization and brainstorming",
seoLi6:"Translation and multilingual assistance",
seoLi7:"User account and subscription management",
seoLi8:"Use on mobile, tablet and desktop",

seoTitle5:"Online AI Assistant for Mobile and Desktop",
seoText5:"Abzarak AI works online in modern web browsers and is designed for phones, tablets and computers.",

seoTitle6:"Content Creation with AI",
seoText6:"Abzarak AI can help with brainstorming, writing, rewriting and preparing text content.",

seoTitle7:"Limited Free Plan",
seoText7:"Users without a subscription can use up to 10 AI messages per day. After reaching the daily limit, users can choose a subscription plan for additional usage.",

seoTitle8:"AI Subscription Plans",
seoText8:"Subscription plans are designed for users who need more AI usage.",

seoTitle9:"About Abzarak AI",
seoText9:"Abzarak AI aims to provide a simple, practical and multilingual AI assistant for users around the world.",

ad3Title:"💡 Discover Abzarak AI",
ad3Text:"Chat with Abzarak AI, ask questions and get help with everyday tasks.",

continue:"🤖 Continue",

loginTitle:"🔑 Sign In",
login:"Sign In",
signup:"📝 Create Account",
forgot:"Forgot password?",

signupTitle:"📝 Create Account",

forgotTitle:"🔐 Password Recovery",
forgotText:"Enter your email to receive a recovery code.",
sendCode:"Send Code",
haveCode:"I Have a Code",

resetTitle:"🔑 Change Password",
changePassword:"Change Password",

accountTitle:"🏠 My Account",

aiTitle:"🤖 Chat with AI",
freeStart:"✨ Start Free with Abzarak AI",
dailyFree:"Up to 10 free AI messages per day.",
todayQuota:"Today's allowance",
tenFree:"10 free messages",
limitedFree:"Limited free plan: 10 messages per day",
upgradeText:"Choose a subscription plan when you need more usage.",
languageAI:"Abzarak AI tries to respond in the language you use.",

send:"Send",
messagePlaceholder:"Write your message...",

plansTitle:"💰 Abzarak AI Plans",
choosePlan:"Choose a subscription plan when you need more usage.",
choosePlan2:"Select the plan that works for you.",

adminTitle:"🛠️ Administration",
adminPassword:"Admin password",
adminLogin:"Sign In",
adminPanelTitle:"🛠️ Admin Panel",

users:"👥 Users",
transactions:"💳 Transactions",
withdrawals:"💸 Withdrawals",
logout:"Log Out",

footerText:"Multilingual AI Assistant",
footerFree:"Limited free allowance: 10 messages per day",
rights:"All rights reserved",

email:"Email",
password:"Password",
name:"Name",
passwordMin:"Password — at least 6 characters",
resetCode:"6-digit code",
newPassword:"New password"

}

};


/* ============================================================
   LANGUAGE APPLY
============================================================ */

function applyLanguage(){

const lang =
translations[currentLang] ||
translations.fa;

const html =
document.documentElement;

html.lang=currentLang;

html.dir =
currentLang === "fa"
? "rtl"
: "ltr";

document.body.dir=html.dir;

document
.querySelectorAll("[data-i18n]")
.forEach(el=>{

const key =
el.getAttribute("data-i18n");

if(lang[key] !== undefined){

el.textContent =
lang[key];

}

});

document
.querySelectorAll("[data-i18n-placeholder]")
.forEach(el=>{

const key =
el.getAttribute("data-i18n-placeholder");

if(lang[key] !== undefined){

el.placeholder =
lang[key];

}

});

const btn =
document.getElementById("langBtn");

if(btn){

btn.textContent =
currentLang === "fa"
? "English"
: "فارسی";

}

document.title =
currentLang === "fa"
? "ابزارک | دستیار هوش مصنوعی فارسی و چندزبانه"
: "Abzarak AI | Multilingual AI Assistant";

document
.querySelector('meta[name="description"]')
?.setAttribute(
"content",
currentLang === "fa"
?
"ابزارک یک دستیار هوش مصنوعی فارسی و چندزبانه برای گفتگو، پاسخ به سوالات، ترجمه، تولید محتوا و کارهای روزمره است."
:
"Abzarak AI is a multilingual AI assistant for conversations, questions, translation, content creation and everyday tasks."
);

}


/* ============================================================
   LANGUAGE TOGGLE
============================================================ */

function toggleLang(){

currentLang =
currentLang === "fa"
? "en"
: "fa";

localStorage.setItem(
"abzarak_lang",
currentLang
);

applyLanguage();

}


/* ============================================================
   API
============================================================ */

function api(path, options = {}){

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
document.getElementById("signupName").value.trim(),

email:
document.getElementById("signupEmail").value.trim(),

password:
document.getElementById("signupPassword").value

})

});

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
(currentLang==="fa"
? "خطا در ثبت‌نام"
: "Signup failed")
);

token=data.token;

localStorage.setItem(
"abzarak_token",
token
);

msg(
currentLang==="fa"
? "ثبت‌نام با موفقیت انجام شد."
: "Account created successfully."
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
document.getElementById("loginEmail").value.trim(),

password:
document.getElementById("loginPassword").value

})

});

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
(currentLang==="fa"
? "خطا در ورود"
: "Login failed")
);

token=data.token;

localStorage.setItem(
"abzarak_token",
token
);

msg(
currentLang==="fa"
? "ورود موفق بود."
: "Login successful."
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
document.getElementById("accountBox");

if(!token){

box.innerHTML=

currentLang==="fa"

?

\`
<p class="muted">
برای مشاهده حساب وارد شوید.
</p>

<button class="btn primary" onclick="showView('login')">
🔑 ورود
</button>

<button class="btn secondary" onclick="showView('signup')">
📝 ثبت‌نام
</button>
\`

:

\`
<p class="muted">
Please sign in to view your account.
</p>

<button class="btn primary" onclick="showView('login')">
🔑 Sign In
</button>

<button class="btn secondary" onclick="showView('signup')">
📝 Create Account
</button>
\`;

return;

}

box.innerHTML =
currentLang==="fa"
? "در حال دریافت اطلاعات..."
: "Loading account information...";

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
(currentLang==="fa"
? "نشست نامعتبر است."
: "Invalid session.")
);

}

const user=data.user;
const sub=data.subscription;
const usage=data.usage;

let subscriptionHtml="";

if(sub){

subscriptionHtml=

currentLang==="fa"

?

\`
<div class="notice">

💎 اشتراک فعال:
<strong>
\${esc(sub.plan?.name || sub.plan_id)}
</strong>

<br>

📅 پایان اشتراک:
<strong>
\${new Date(
sub.expires_at
).toLocaleDateString("fa-IR")}
</strong>

<br>

🚀 پیام‌های AI:
نامحدود

</div>
\`

:

\`
<div class="notice">

💎 Active subscription:
<strong>
\${esc(sub.plan?.name || sub.plan_id)}
</strong>

<br>

📅 Subscription ends:
<strong>
\${new Date(
sub.expires_at
).toLocaleDateString("en-US")
}
</strong>

<br>

🚀 AI messages:
Unlimited

</div>
\`;

}else{

subscriptionHtml=

currentLang==="fa"

?

\`
<div class="notice">

🆓 پلن رایگان محدود

<br>

📊 مصرف امروز:
<strong>
\${usage.used}
</strong>
از
<strong>
\${usage.limit}
</strong>
پیام

<br>

💎 برای استفاده بیشتر، پلن اشتراکی انتخاب کنید.

</div>
\`

:

\`
<div class="notice">

🆓 Limited free plan

<br>

📊 Today's usage:
<strong>
\${usage.used}
</strong>
of
<strong>
\${usage.limit}
</strong>
messages

<br>

💎 Choose a subscription plan for more usage.

</div>
\`;

}

box.innerHTML=

\`
<div class="account-grid">

<div class="card">

<div class="muted">
\${currentLang==="fa" ? "نام" : "Name"}
</div>

<div class="account-value">
\${esc(user.name)}
</div>

</div>

<div class="card">

<div class="muted">
\${currentLang==="fa" ? "ایمیل" : "Email"}
</div>

<div
class="account-value"
style="font-size:16px"
>
\${esc(user.email)}
</div>

</div>

<div class="card">

<div class="muted">
\${currentLang==="fa" ? "موجودی" : "Balance"}
</div>

<div class="account-value">

\${num(user.balance)}

\${currentLang==="fa"
? "تومان"
: "IRR"}

</div>

</div>

</div>

\${subscriptionHtml}

<div class="actions">

<button
class="btn primary"
onclick="showView('ai')"
>
🤖 \${currentLang==="fa" ? "هوش مصنوعی" : "AI"}
</button>

<button
class="btn secondary"
onclick="showView('plans')"
>
💎 \${currentLang==="fa" ? "پلن‌ها" : "Plans"}
</button>

<button
class="btn secondary"
onclick="withdraw()"
>
💸 \${currentLang==="fa" ? "برداشت موجودی" : "Withdraw"}
</button>

<button
class="btn secondary"
onclick="myWithdrawals()"
>
📋 \${currentLang==="fa" ? "وضعیت برداشت‌ها" : "Withdrawals"}
</button>

<button
class="btn danger"
onclick="logout()"
>
\${currentLang==="fa" ? "خروج" : "Log Out"}
</button>

</div>

<div id="accountExtra"></div>
\`;

}catch(e){

box.innerHTML=

\`
<div class="notice">
\${esc(e.message)}
</div>
\`;

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
currentLang==="fa"
? "مبلغ برداشت به تومان را وارد کنید:"
: "Enter withdrawal amount:"
);

if(!amount)
return;

const destination =
prompt(
currentLang==="fa"
? "شماره شبا / حساب مقصد را وارد کنید:"
: "Enter bank account / destination:"
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
(currentLang==="fa"
? "خطا در برداشت"
: "Withdrawal failed")
);

msg(
currentLang==="fa"
?
"درخواست برداشت ثبت شد و پس از بررسی مدیریت پرداخت می‌شود."
:
"Withdrawal request submitted for review."
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
await api("/api/my-withdrawals");

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
(currentLang==="fa" ? "خطا" : "Error")
);

const rows =
data.withdrawals || [];

const box =
document.getElementById("accountExtra");

box.innerHTML=

\`
<div
class="card"
style="margin-top:15px"
>

<h3>
📋
\${currentLang==="fa"
? "درخواست‌های برداشت"
: "Withdrawal Requests"}
</h3>

<div class="table-wrap">

<table>

<thead>

<tr>

<th>
\${currentLang==="fa" ? "مبلغ" : "Amount"}
</th>

<th>
\${currentLang==="fa" ? "روش" : "Method"}
</th>

<th>
\${currentLang==="fa" ? "وضعیت" : "Status"}
</th>

<th>
\${currentLang==="fa" ? "تاریخ" : "Date"}
</th>

</tr>

</thead>

<tbody>

\${rows.map(x=>\`

<tr>

<td>
\${num(x.amount)}
\${currentLang==="fa" ? " تومان" : " IRR"}
</td>

<td>
\${esc(x.method)}
</td>

<td>
\${esc(x.status)}
</td>

<td>
\${esc(x.created_at)}
</td>

</tr>

\`).join("")}

</tbody>

</table>

</div>

</div>
\`;

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
document.getElementById("forgotEmail").value.trim();

const response =
await api(
"/api/forgot-password",
{

method:"POST",

body:JSON.stringify({email})

}
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
(currentLang==="fa" ? "خطا" : "Error")
);

document.getElementById("resetEmail").value=email;

msg(
data.message ||
(currentLang==="fa"
? "کد ارسال شد."
: "Recovery code sent.")
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
document.getElementById("resetEmail").value.trim(),

code:
document.getElementById("resetCode").value.trim(),

newPassword:
document.getElementById("resetPassword").value

})

}
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
(currentLang==="fa"
? "خطا"
: "Error")
);

msg(
data.message ||
(currentLang==="fa"
? "رمز تغییر کرد."
: "Password changed.")
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
document.getElementById("aiInput");

const message =
input.value.trim();

if(!message)
return;

if(!token){

msg(
currentLang==="fa"
?
"برای استفاده از هوش مصنوعی ابتدا وارد حساب شوید."
:
"Please sign in before using AI."
);

showView("login");

return;

}

addMessage("user",message);

input.value="";

const loading =
"loading_" + Date.now();

addMessage(
"ai",
currentLang==="fa"
? "در حال پاسخ..."
: "Thinking...",
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
document.getElementById(loading);

if(el)
el.remove();

if(!response.ok){

if(data.upgrade_required){

addMessage(
"ai",
currentLang==="fa"
?
"⚠️ سهمیه ۱۰ پیام روزانه پلن رایگان شما تمام شده است. برای ادامه استفاده، یکی از پلن‌های اشتراکی را انتخاب کنید."
:
"⚠️ Your 10 free messages for today have been used. Choose a subscription plan to continue."
);

addMessage(
"ai",
currentLang==="fa"
?
"💎 برای مشاهده پلن‌ها، از منوی «پلن‌ها» استفاده کنید."
:
"💎 Open the Plans section to view available subscription plans."
);

}else{

addMessage(
"ai",
"❌ " +
(data.error ||
(currentLang==="fa"
? "خطا"
: "Error"))
);

}

return;

}

addMessage(
"ai",
data.reply ||
(currentLang==="fa"
? "پاسخی دریافت نشد."
: "No response received.")
);

}catch(e){

const el =
document.getElementById(loading);

if(el)
el.remove();

addMessage(
"ai",
"❌ " + e.message
);

}

}


function addMessage(type,text,id=""){

const chat =
document.getElementById("chat");

const div =
document.createElement("div");

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
document.getElementById("plansBox");

if(!plansData){

try{

const response =
await api("/api/plans");

plansData =
await response.json();

}catch(e){

box.innerHTML =
currentLang==="fa"
? "خطا در دریافت پلن‌ها."
: "Unable to load plans.";

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
document.getElementById("plansBox");

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

\`
<button
class="btn secondary"
style="width:100%"
onclick="showView('ai')"
>
\${currentLang==="fa"
? "شروع استفاده"
: "Start Using"}
</button>
\`

:

usd

?

\`
<button
class="btn secondary"
style="width:100%"
onclick="msg(
currentLang==="fa"
?
"پرداخت دلاری به‌زودی فعال می‌شود. درگاه زرین‌پال برای پرداخت تومانی است."
:
"USD payments will be available soon. ZarinPal currently supports local Toman payments."
)"
>
\${currentLang==="fa"
? "پرداخت بین‌المللی"
: "International Payment"}
</button>
\`

:

\`
<button
class="btn primary"
style="width:100%"
onclick="buyPlan('\${plan.id}')"
>
💳 \${currentLang==="fa"
? "خرید پلن"
: "Buy Plan"}
</button>
\`;

return \`

<div
class="plan \${isPopular ? "popular" : ""}"
>

\${isPopular ? \`
<div class="badge">
\${currentLang==="fa"
? "محبوب"
: "Popular"}
</div>
\` : ""}

<h3>
\${esc(plan.name)}
</h3>

<div class="price">

\${price}

<small>

\${usd
? " / month"
: currentLang==="fa"
? " تومان / ماه"
: " IRR / month"}

</small>

</div>

<ul>

\${(plan.features || [])
.map(f =>
\`<li>\${esc(f)}</li>\`
)
.join("")}

</ul>

\${button}

</div>

\`;

}).join("");

}


/* ============================================================
   BUY
============================================================ */

async function buyPlan(id){

if(!token){

msg(
currentLang==="fa"
?
"برای خرید ابتدا وارد حساب شوید."
:
"Please sign in before purchasing."
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
(currentLang==="fa"
? "خطا در پرداخت"
: "Payment error")
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
document.getElementById("adminPassword").value

})

}
);

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
(currentLang==="fa"
? "خطا"
: "Error")
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
document.getElementById("adminContent");

box.innerHTML =
currentLang==="fa"
? "در حال دریافت کاربران..."
: "Loading users...";

try{

const response =
await adminApi("/api/admin/users");

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
(currentLang==="fa"
? "خطا"
: "Error")
);

box.innerHTML=\`

<h3>
👥
\${currentLang==="fa"
? "کاربران"
: "Users"}
</h3>

<div class="table-wrap">

<table>

<thead>

<tr>

<th>
\${currentLang==="fa" ? "نام" : "Name"}
</th>

<th>
\${currentLang==="fa" ? "ایمیل" : "Email"}
</th>

<th>
\${currentLang==="fa" ? "موجودی" : "Balance"}
</th>

<th>
\${currentLang==="fa" ? "تاریخ" : "Date"}
</th>

</tr>

</thead>

<tbody>

\${(data.users || [])
.map(x=>\`

<tr>

<td>
\${esc(x.name)}
</td>

<td>
\${esc(x.email)}
</td>

<td>
\${num(x.balance)}
\${currentLang==="fa"
? " تومان"
: " IRR"}
</td>

<td>
\${esc(x.created_at)}
</td>

</tr>

\`).join("")}

</tbody>

</table>

</div>

\`;

}catch(e){

box.innerHTML=\`
<div class="notice">
\${esc(e.message)}
</div>
\`;

}

}


async function adminPayments(){

const box =
document.getElementById("adminContent");

box.innerHTML =
currentLang==="fa"
? "در حال دریافت تراکنش‌ها..."
: "Loading transactions...";

try{

const response =
await adminApi("/api/admin/payments");

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
(currentLang==="fa"
? "خطا"
: "Error")
);

box.innerHTML=\`

<h3>
💳
\${currentLang==="fa"
? "تراکنش‌ها"
: "Transactions"}
</h3>

<div class="table-wrap">

<table>

<thead>

<tr>

<th>
\${currentLang==="fa" ? "ایمیل" : "Email"}
</th>

<th>
\${currentLang==="fa" ? "پلن" : "Plan"}
</th>

<th>
\${currentLang==="fa" ? "مبلغ" : "Amount"}
</th>

<th>
\${currentLang==="fa" ? "وضعیت" : "Status"}
</th>

</tr>

</thead>

<tbody>

\${(data.payments || [])
.map(x=>\`

<tr>

<td>
\${esc(x.email)}
</td>

<td>
\${esc(x.plan_id || "-")}
</td>

<td>
\${num(x.amount_toman)}
\${currentLang==="fa"
? " تومان"
: " IRR"}
</td>

<td>
\${esc(x.status)}
</td>

</tr>

\`).join("")}

</tbody>

</table>

</div>

\`;

}catch(e){

box.innerHTML=\`
<div class="notice">
\${esc(e.message)}
</div>
\`;

}

}


async function adminWithdrawals(){

const box =
document.getElementById("adminContent");

box.innerHTML =
currentLang==="fa"
? "در حال دریافت برداشت‌ها..."
: "Loading withdrawals...";

try{

const response =
await adminApi("/api/admin/withdrawals");

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
(currentLang==="fa"
? "خطا"
: "Error")
);

const rows =
data.withdrawals || [];

box.innerHTML=\`

<h3>
💸
\${currentLang==="fa"
? "درخواست‌های برداشت"
: "Withdrawal Requests"}
</h3>

<div class="table-wrap">

<table>

<thead>

<tr>

<th>
\${currentLang==="fa" ? "ایمیل" : "Email"}
</th>

<th>
\${currentLang==="fa" ? "مبلغ" : "Amount"}
</th>

<th>
\${currentLang==="fa" ? "مقصد" : "Destination"}
</th>

<th>
\${currentLang==="fa" ? "وضعیت" : "Status"}
</th>

<th>
\${currentLang==="fa" ? "عملیات" : "Action"}
</th>

</tr>

</thead>

<tbody>

\${rows.map(x=>\`

<tr>

<td>
\${esc(x.email)}
</td>

<td>
\${num(x.amount)}
\${currentLang==="fa"
? " تومان"
: " IRR"}
</td>

<td>
\${esc(x.destination)}
</td>

<td>
\${esc(x.status)}
</td>

<td>

\${x.status === "pending" ? \`

<button
class="btn primary"
onclick="processWithdrawal('\${x.id}','paid')"
>
\${currentLang==="fa"
? "پرداخت شد"
: "Paid"}
</button>

<button
class="btn danger"
onclick="processWithdrawal('\${x.id}','rejected')"
>
\${currentLang==="fa"
? "رد"
: "Reject"}
</button>

\` : "-"}

</td>

</tr>

\`).join("")}

</tbody>

</table>

</div>

\`;

}catch(e){

box.innerHTML=\`
<div class="notice">
\${esc(e.message)}
</div>
\`;

}

}


async function processWithdrawal(id,action){

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
data.error ||
(currentLang==="fa"
? "خطا"
: "Error")
);

msg(
data.message ||
(currentLang==="fa"
? "انجام شد."
: "Done.")
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
).toLocaleString(
currentLang==="fa"
? "fa-IR"
: "en-US"
);

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
currentLang==="fa"
?
"از منوی Chrome گزینه «افزودن به صفحه اصلی» را انتخاب کنید."
:
"Open the Chrome menu and choose Add to Home screen."
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
currentLang==="fa"
?
"✅ پرداخت موفق بود و اشتراک شما فعال شد."
:
"✅ Payment successful and your subscription is active."
);

}

if(p === "cancel"){

alert(
currentLang==="fa"
?
"پرداخت لغو شد."
:
"Payment was cancelled."
);

}

if(p === "failed"){

alert(
currentLang==="fa"
?
"❌ پرداخت تأیید نشد."
:
"❌ Payment was not confirmed."
);

}

if(p === "error"){

const reason =
new URLSearchParams(
location.search
).get("reason");

alert(
(currentLang==="fa"
? "❌ خطا در پرداخت."
: "❌ Payment error.") +
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

applyLanguage();

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
