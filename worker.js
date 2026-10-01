// =============================================================
// ABZARAK AI — HOMEPAGE + BACKEND API + SEO PAGES
// Production ZarinPal
// /content SEO route fixed
// Enamad logo removed from footer
// SEO landing pages + FAQ + Sitemap + Robots
// SEO pages redesigned: white background + unique visuals
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
  :root {
    --bg: #0f0f1a;
    --bg-soft: #16162a;
    --card: #1b1b33;
    --border: #2a2a45;
    --text: #eef0ff;
    --muted: #9797b8;
    --accent: #6d6dff;
    --accent-2: #8f5cff;
    --success: #22c55e;
    --danger: #ef4444;
    --radius: 16px;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: Tahoma, "Vazirmatn", Arial, sans-serif;
    background:
      radial-gradient(circle at 20% 0%, #2a2a55 0%, transparent 45%),
      radial-gradient(circle at 100% 20%, #3a1e5e 0%, transparent 40%),
      var(--bg);
    color: var(--text);
    min-height: 100vh;
    direction: rtl;
  }

  a {
    color: inherit;
  }

  .wrap {
    max-width: 1080px;
    margin: 0 auto;
    padding: 24px;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 0 32px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 900;
    font-size: 20px;
  }

  .logo .dot {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  nav {
    display: flex;
    gap: 8px;
  }

  .btn {
    border: 1px solid var(--border);
    background: var(--card);
    color: var(--text);
    padding: 10px 18px;
    border-radius: 12px;
    font-size: 14px;
    cursor: pointer;
    font-family: inherit;
    transition: .15s;
  }

  .btn:hover {
    border-color: var(--accent);
  }

  .btn.primary {
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    border: none;
    font-weight: 700;
  }

  .btn.primary:hover {
    filter: brightness(1.08);
  }

  .btn.block {
    width: 100%;
  }

  .btn.ghost {
    background: transparent;
  }

  .hero {
    text-align: center;
    padding: 40px 0 56px;
  }

  .hero h1 {
    font-size: 38px;
    margin: 0 0 14px;
    line-height: 1.5;
  }

  .hero h1 span {
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .hero p {
    color: var(--muted);
    font-size: 16px;
    max-width: 560px;
    margin: 0 auto 26px;
    line-height: 1.9;
  }

  .hero-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 22px;
  }

  .chat-section {
    margin: 40px 0;
  }

  .chat-box {
    display: flex;
    flex-direction: column;
    height: 420px;
  }

  .chat-log {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 6px 4px 16px;
  }

  .msg {
    max-width: 80%;
    padding: 12px 16px;
    border-radius: 14px;
    line-height: 1.8;
    font-size: 14.5px;
    white-space: pre-wrap;
  }

  .msg.user {
    align-self: flex-start;
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    border-bottom-left-radius: 4px;
  }

  .msg.ai {
    align-self: flex-end;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-bottom-right-radius: 4px;
  }

  .msg.system {
    align-self: center;
    color: var(--muted);
    font-size: 13px;
    background: transparent;
  }

  .chat-input-row {
    display: flex;
    gap: 8px;
    border-top: 1px solid var(--border);
    padding-top: 14px;
  }

  .chat-input-row input {
    flex: 1;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 12px;
    padding: 12px 14px;
    font-family: inherit;
    font-size: 14.5px;
  }

  .chat-input-row input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .plans-section {
    margin: 56px 0;
  }

  .section-title {
    text-align: center;
    margin-bottom: 28px;
  }

  .section-title h2 {
    font-size: 26px;
    margin-bottom: 8px;
  }

  .section-title p {
    color: var(--muted);
  }

  .plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }

  .plan-card {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .plan-card h3 {
    margin: 0;
    font-size: 18px;
  }

  .plan-price {
    font-size: 24px;
    font-weight: 900;
  }

  .plan-price small {
    font-size: 13px;
    color: var(--muted);
    font-weight: 400;
  }

  .plan-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .plan-card li {
    color: var(--muted);
    font-size: 13.5px;
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  .plan-card li::before {
    content: "✓";
    color: var(--success);
    font-weight: 900;
  }

  .plan-card.featured {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent);
  }

  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(5,5,15,.7);
    backdrop-filter: blur(4px);
    display: none;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 50;
  }

  .overlay.open {
    display: flex;
  }

  .modal {
    width: 100%;
    max-width: 380px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    position: relative;
  }

  .modal h3 {
    margin: 0 0 18px;
    font-size: 18px;
  }

  .field {
    margin-bottom: 12px;
  }

  .field label {
    display: block;
    font-size: 13px;
    color: var(--muted);
    margin-bottom: 6px;
  }

  .field input {
    width: 100%;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 10px;
    padding: 11px 13px;
    font-family: inherit;
    font-size: 14px;
  }

  .field input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .modal-msg {
    font-size: 13px;
    margin: 10px 0;
    min-height: 18px;
  }

  .modal-msg.err {
    color: var(--danger);
  }

  .modal-msg.ok {
    color: var(--success);
  }

  .switch-line {
    text-align: center;
    margin-top: 14px;
    font-size: 13px;
    color: var(--muted);
  }

  .switch-line a {
    color: var(--accent);
    cursor: pointer;
    text-decoration: none;
  }

  .modal-close {
    position: absolute;
    left: 18px;
    top: 18px;
    background: none;
    border: none;
    color: var(--muted);
    font-size: 18px;
    cursor: pointer;
  }

  #userBadge {
    display: none;
    align-items: center;
    gap: 10px;
    font-size: 13.5px;
    color: var(--muted);
  }

  #userBadge b {
    color: var(--text);
  }

  footer {
    text-align: center;
    color: var(--muted);
    font-size: 13px;
    padding: 40px 0 20px;
  }

  @media (max-width: 640px) {
    .hero h1 {
      font-size: 28px;
    }

    nav .btn span.long {
      display: none;
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
    <button class="btn ghost" onclick="openModal('login')">ورود</button>
    <button class="btn primary" onclick="openModal('signup')">ثبت‌نام رایگان</button>
  </nav>

  <div id="userBadge">
    <span>خوش آمدی، <b id="userNameLabel"></b></span>
    <button class="btn" onclick="logout()">خروج</button>
  </div>
</header>

<section class="hero">
  <h1>دستیار هوشمند <span>فارسی</span> شما</h1>
  <p>
    ابزارک، یک دستیار هوش مصنوعی چندزبانه برای گفتگو،
    تولید محتوا، ترجمه و ایده‌پردازی است.
    همین حالا رایگان امتحان کن.
  </p>

  <div class="hero-actions">
    <button class="btn primary" onclick="focusChat()">شروع گفتگو</button>
    <button class="btn ghost" onclick="scrollToPlans()">مشاهده پلن‌ها</button>
  </div>
</section>

<section class="chat-section card">
  <div class="chat-box">
    <div class="chat-log" id="chatLog">
      <div class="msg system">سلام! من ابزارک هستم. هر سوالی داری بپرس 👋</div>
    </div>

    <div class="chat-input-row">
      <input
        id="chatInput"
        type="text"
        placeholder="پیامت را بنویس..."
        onkeydown="if(event.key==='Enter') sendMessage()"
      >

      <button class="btn primary" onclick="sendMessage()">
        ارسال
      </button>
    </div>
  </div>
</section>

<section class="plans-section" id="plansSection">
  <div class="section-title">
    <h2>پلن‌های اشتراک</h2>
    <p>متناسب با نیازت یک پلن انتخاب کن</p>
  </div>

  <div class="plans-grid" id="plansGrid">
    <div class="msg system" style="align-self:center;">
      در حال بارگذاری پلن‌ها...
    </div>
  </div>
</section>

<footer>
  🤖 ابزارک AI — ساخته‌شده با هوش مصنوعی
</footer>

</div>

<div class="overlay" id="authOverlay">

  <div class="modal">

    <button class="modal-close" onclick="closeModal()">✕</button>

    <div id="loginForm">
      <h3>ورود به حساب</h3>

      <div class="field">
        <label>ایمیل</label>
        <input
          type="email"
          id="loginEmail"
          placeholder="you@example.com"
        >
      </div>

      <div class="field">
        <label>رمز عبور</label>
        <input
          type="password"
          id="loginPassword"
          placeholder="••••••••"
        >
      </div>

      <div class="modal-msg" id="loginMsg"></div>

      <button class="btn primary block" onclick="doLogin()">
        ورود
      </button>

      <div class="switch-line">
        حساب نداری؟
        <a onclick="openModal('signup')">
          ثبت‌نام کن
        </a>
        <br>
        <a onclick="openModal('forgot')">
          رمز عبور را فراموش کرده‌ام
        </a>
      </div>
    </div>

    <div id="signupForm" style="display:none;">

      <h3>ساخت حساب جدید</h3>

      <div class="field">
        <label>نام</label>
        <input
          type="text"
          id="signupName"
          placeholder="نام شما"
        >
      </div>

      <div class="field">
        <label>ایمیل</label>
        <input
          type="email"
          id="signupEmail"
          placeholder="you@example.com"
        >
      </div>

      <div class="field">
        <label>رمز عبور</label>
        <input
          type="password"
          id="signupPassword"
          placeholder="حداقل ۶ کاراکتر"
        >
      </div>

      <div class="modal-msg" id="signupMsg"></div>

      <button class="btn primary block" onclick="doSignup()">
        ثبت‌نام
      </button>

      <div class="switch-line">
        قبلاً ثبت‌نام کرده‌ای؟
        <a onclick="openModal('login')">
          وارد شو
        </a>
      </div>
    </div>

    <div id="forgotForm" style="display:none;">

      <h3>بازیابی رمز عبور</h3>

      <div class="field">
        <label>ایمیل</label>
        <input
          type="email"
          id="forgotEmail"
          placeholder="you@example.com"
        >
      </div>

      <div class="modal-msg" id="forgotMsg"></div>

      <button class="btn primary block" onclick="doForgot()">
        ارسال کد بازیابی
      </button>

      <div id="resetFields" style="display:none; margin-top:14px;">

        <div class="field">
          <label>کد بازیابی</label>
          <input
            type="text"
            id="resetCode"
            placeholder="۶ رقمی"
          >
        </div>

        <div class="field">
          <label>رمز عبور جدید</label>
          <input
            type="password"
            id="resetNewPassword"
            placeholder="حداقل ۶ کاراکتر"
          >
        </div>

        <button class="btn primary block" onclick="doReset()">
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
const API = "";
let token = localStorage.getItem("abzarak_token") || null;
let currentUser = null;
let chatHistory = [];

function openModal(which) {
  document.getElementById("authOverlay").classList.add("open");
  document.getElementById("loginForm").style.display =
    which === "login" ? "block" : "none";

  document.getElementById("signupForm").style.display =
    which === "signup" ? "block" : "none";

  document.getElementById("forgotForm").style.display =
    which === "forgot" ? "block" : "none";
}

function closeModal() {
  document.getElementById("authOverlay").classList.remove("open");
}

function setMsg(id, text, ok) {
  const el = document.getElementById(id);

  if (!el) return;

  el.textContent = text || "";
  el.className = "modal-msg " + (ok ? "ok" : "err");
}

async function api(path, options = {}) {
  const headers = Object.assign(
    {
      "Content-Type": "application/json"
    },
    options.headers || {}
  );

  if (token) {
    headers["Authorization"] =
      "Bearer " + token;
  }

  const res = await fetch(
    API + path,
    Object.assign({}, options, {
      headers
    })
  );

  let data = {};

  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const error = new Error(
      data.error || "خطایی رخ داد."
    );

    error.status = res.status;
    error.data = data;

    throw error;
  }

  return data;
}

async function doSignup() {
  const name =
    document.getElementById("signupName").value.trim();

  const email =
    document.getElementById("signupEmail").value.trim();

  const password =
    document.getElementById("signupPassword").value;

  setMsg("signupMsg", "");

  try {
    const data = await api(
      "/api/signup",
      {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password
        })
      }
    );

    if (!data.token) {
      throw new Error(
        "توکن ورود از سرور دریافت نشد."
      );
    }

    token = data.token;

    localStorage.setItem(
      "abzarak_token",
      token
    );

    const ok = await loadMe();

    closeModal();

    if (ok) {
      addMsg(
        "ثبت‌نام با موفقیت انجام شد. حالا می‌توانی پیام بفرستی. 👋",
        "system"
      );
    } else {
      addMsg(
        "حساب ساخته شد. اگر پیام ارسال نشد، یک‌بار صفحه را تازه‌سازی کن.",
        "system"
      );
    }

  } catch (e) {
    setMsg(
      "signupMsg",
      e.message
    );
  }
}

async function doLogin() {
  const email =
    document.getElementById("loginEmail").value.trim();

  const password =
    document.getElementById("loginPassword").value;

  setMsg("loginMsg", "");

  try {
    const data = await api(
      "/api/login",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    if (!data.token) {
      throw new Error(
        "توکن ورود از سرور دریافت نشد."
      );
    }

    token = data.token;

    localStorage.setItem(
      "abzarak_token",
      token
    );

    const ok = await loadMe();

    closeModal();

    if (ok) {
      addMsg(
        "ورود با موفقیت انجام شد. حالا پیام خودت را بفرست. 👋",
        "system"
      );
    } else {
      addMsg(
        "ورود انجام شد. اگر پیام ارسال نشد، صفحه را تازه‌سازی کن.",
        "system"
      );
    }

  } catch (e) {
    setMsg(
      "loginMsg",
      e.message
    );
  }
}

async function doForgot() {
  const email =
    document
      .getElementById("forgotEmail")
      .value
      .trim();

  setMsg("forgotMsg", "");

  try {
    const data = await api(
      "/api/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({
          email
        })
      }
    );

    setMsg(
      "forgotMsg",
      data.message,
      true
    );

    document.getElementById(
      "resetFields"
    ).style.display = "block";

  } catch (e) {
    setMsg(
      "forgotMsg",
      e.message
    );
  }
}

async function doReset() {
  const email =
    document
      .getElementById("forgotEmail")
      .value
      .trim();

  const code =
    document
      .getElementById("resetCode")
      .value
      .trim();

  const newPassword =
    document
      .getElementById("resetNewPassword")
      .value;

  setMsg("forgotMsg", "");

  try {
    const data = await api(
      "/api/reset-password",
      {
        method: "POST",
        body: JSON.stringify({
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

    setTimeout(
      () => openModal("login"),
      1200
    );

  } catch (e) {
    setMsg(
      "forgotMsg",
      e.message
    );
  }
}

function logout() {
  token = null;
  currentUser = null;
  chatHistory = [];

  localStorage.removeItem(
    "abzarak_token"
  );

  updateNav();

  addMsg(
    "از حساب خارج شدی.",
    "system"
  );
}

function updateNav() {
  const navArea =
    document.getElementById("navArea");

  const badge =
    document.getElementById("userBadge");

  if (currentUser) {
    navArea.style.display = "none";
    badge.style.display = "flex";

    document.getElementById(
      "userNameLabel"
    ).textContent =
      currentUser.name || "کاربر";

  } else {
    navArea.style.display = "flex";
    badge.style.display = "none";
  }
}

async function loadMe() {
  if (!token) {
    currentUser = null;
    updateNav();
    return false;
  }

  try {
    const data =
      await api("/api/me");

    if (
      !data ||
      !data.user
    ) {
      throw new Error(
        "اطلاعات حساب از سرور دریافت نشد."
      );
    }

    currentUser =
      data.user;

    updateNav();

    return true;

  } catch (e) {
    console.error(
      "ABZARAK LOAD ME ERROR:",
      e
    );

    if (
      Number(e.status) === 401
    ) {
      token = null;

      localStorage.removeItem(
        "abzarak_token"
      );

      currentUser = null;
      chatHistory = [];
    }

    updateNav();

    return false;
  }
}

function addMsg(text, cls) {
  const log =
    document.getElementById("chatLog");

  const div =
    document.createElement("div");

  div.className =
    "msg " + cls;

  div.textContent =
    text;

  log.appendChild(div);

  log.scrollTop =
    log.scrollHeight;
}

function focusChat() {
  const input =
    document.getElementById("chatInput");

  input.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  input.focus();
}

function scrollToPlans() {
  document
    .getElementById("plansSection")
    .scrollIntoView({
      behavior: "smooth"
    });
}

async function sendMessage() {
  const input =
    document.getElementById("chatInput");

  const message =
    input.value.trim();

  if (!message) {
    return;
  }

  if (!token) {
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

  input.value = "";

  const thinking =
    document.createElement("div");

  thinking.className =
    "msg ai";

  thinking.textContent =
    "در حال فکر کردن...";

  const log =
    document.getElementById("chatLog");

  log.appendChild(
    thinking
  );

  log.scrollTop =
    log.scrollHeight;

  try {
    const data =
      await api(
        "/api/ai/chat",
        {
          method: "POST",
          body: JSON.stringify({
            message,
            history:
              chatHistory
          })
        }
      );

    const reply =
      String(
        data.reply ||
        "متأسفم، نتوانستم پاسخ مناسبی تولید کنم."
      );

    thinking.textContent =
      reply;

    chatHistory.push({
      role: "user",
      content: message
    });

    chatHistory.push({
      role: "assistant",
      content: reply
    });

    if (
      chatHistory.length > 20
    ) {
      chatHistory =
        chatHistory.slice(-20);
    }

    log.scrollTop =
      log.scrollHeight;

  } catch (e) {
    console.error(
      "ABZARAK AI ERROR:",
      e
    );

    if (
      Number(e.status) === 401
    ) {
      token = null;
      currentUser = null;
      chatHistory = [];

      localStorage.removeItem(
        "abzarak_token"
      );

      updateNav();

      thinking.textContent =
        "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.";

      setTimeout(
        () => openModal("login"),
        300
      );

    } else {
      thinking.textContent =
        "خطا: " +
        (
          e.message ||
          "خطا در ارتباط با هوش مصنوعی."
        );
    }
  }
}

async function loadPlans() {
  const grid =
    document.getElementById("plansGrid");

  try {
    const data =
      await api("/api/plans");

    if (
      !data ||
      !Array.isArray(data.plans)
    ) {
      throw new Error(
        "پاسخ نامعتبر از سرور برای پلن‌ها."
      );
    }

    grid.innerHTML = "";

    if (
      data.plans.length === 0
    ) {
      grid.innerHTML =
        "<div class='msg system' style='align-self:center;'>در حال حاضر پلنی برای نمایش وجود ندارد.</div>";

      return;
    }

    data.plans.forEach(
      (plan, i) => {

        const card =
          document.createElement("div");

        card.className =
          "card plan-card" +
          (
            i === 2
              ? " featured"
              : ""
          );

        const features =
          Array.isArray(plan.features)
            ? plan.features
            : [];

        card.innerHTML =
          "<h3>" +
          escapeHtml(plan.name) +
          "</h3>" +

          "<div class='plan-price'>" +
          Number(
            plan.price_toman || 0
          ).toLocaleString("fa-IR") +
          " تومان <small>/ ماه</small></div>" +

          "<ul>" +
          features
            .map(
              f =>
                "<li>" +
                escapeHtml(String(f)) +
                "</li>"
            )
            .join("") +
          "</ul>" +

          "<button class='btn primary block' onclick='buyPlan(" +
          JSON.stringify(plan.id) +
          ")'>خرید این پلن</button>";

        grid.appendChild(card);
      }
    );

  } catch (e) {

    console.error(
      "LOAD PLANS ERROR:",
      e
    );

    grid.innerHTML =
      "<div class='msg system' style='align-self:center;'>بارگذاری پلن‌ها ناموفق بود.</div>";
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function buyPlan(planId) {
  if (!token) {
    openModal("login");
    return;
  }

  try {
    const data =
      await api(
        "/api/payment/request",
        {
          method: "POST",
          body: JSON.stringify({
            planId
          })
        }
      );

    if (
      data.payment_url
    ) {
      window.location.href =
        data.payment_url;
    } else {
      alert(
        "لینک پرداخت از زرین‌پال دریافت نشد."
      );
    }

  } catch (e) {

    console.error(
      "BUY PLAN ERROR:",
      e
    );

    alert(
      e.message ||
      "خطا در ایجاد پرداخت."
    );
  }
}

loadMe();
loadPlans();

const params =
  new URLSearchParams(
    window.location.search
  );

if (
  params.get("payment") ===
  "success"
) {

  setTimeout(
    () =>
      alert(
        "پرداخت با موفقیت انجام شد! اشتراک شما فعال است."
      ),
    300
  );

} else if (
  params.get("payment") === "failed" ||
  params.get("payment") === "error"
) {

  setTimeout(
    () =>
      alert(
        "پرداخت ناموفق بود. لطفاً دوباره تلاش کنید."
      ),
    300
  );

} else if (
  params.get("payment") === "cancel"
) {

  setTimeout(
    () =>
      alert(
        "پرداخت لغو شد."
      ),
    300
  );
}
</script>

</body>
</html>`;
}


// =============================================================
// SEO DATA — UNIQUE CONTENT + UNIQUE VISUALS
// =============================================================

const SEO_PAGES = {

  "/chat-ai": {
    title: "چت با هوش مصنوعی فارسی | ابزارک AI",
    description:
      "چت آنلاین با هوش مصنوعی فارسی ابزارک برای پرسش و پاسخ، آموزش، گفتگو، حل مسئله و کمک در کارهای روزمره.",

    h1: "چت با هوش مصنوعی فارسی",

    intro:
      "در ابزارک AI می‌توانی به زبان فارسی با یک دستیار هوشمند گفتگو کنی، سؤال بپرسی، موضوعات مختلف را بررسی کنی و برای کارهای روزمره پاسخ و ایده بگیری.",

    visualType: "chat",

    sections: [

      {
        title: "گفتگو طبیعی به زبان فارسی",
        text:
          "چت با ابزارک برای زمانی مناسب است که می‌خواهی سؤال خودت را به شکل طبیعی مطرح کنی و پاسخ متناسب با همان موضوع بگیری. می‌توانی درباره موضوعات آموزشی، عمومی، نوشتاری و فکری گفتگو کنی و سؤال بعدی را بر اساس پاسخ قبلی ادامه بدهی."
      },

      {
        title: "برای چه کارهایی می‌توانی از چت استفاده کنی؟",
        text:
          "چت هوشمند فقط برای پرسیدن سؤال‌های ساده نیست. می‌توانی از آن به عنوان یک همراه متنی برای بررسی ایده‌ها، یادگیری، نوشتن و حل مسئله استفاده کنی.",

        bullets: [
          "پرسش و پاسخ عمومی",
          "یادگیری و توضیح مفاهیم",
          "حل مسئله و پیدا کردن راهکار",
          "ایده‌پردازی",
          "تولید و اصلاح متن",
          "ترجمه و خلاصه‌سازی",
          "کمک در برنامه‌نویسی"
        ]
      },

      {
        title: "چطور یک سؤال بهتر بپرسی؟",
        text:
          "هرچه موضوع و هدف خودت را واضح‌تر توضیح بدهی، امکان دریافت پاسخ متناسب بیشتر می‌شود. برای مثال به جای «یک متن بنویس»، می‌توانی مشخص کنی متن برای چه مخاطبی است، چه لحنی دارد و چه اندازه‌ای می‌خواهی."
      },

      {
        title: "نمونه درخواست برای شروع",
        text:
          "برای شروع می‌توانی درخواست‌هایی مانند «این موضوع را ساده توضیح بده»، «برای این محصول یک معرفی کوتاه بنویس» یا «برای یادگیری این مبحث یک برنامه تمرینی بده» را امتحان کنی."
      }

    ]
  },


  "/content": {
    title: "تولید محتوا با هوش مصنوعی | ابزارک AI",
    description:
      "تولید محتوای متنی با هوش مصنوعی فارسی برای مقاله، وبلاگ، توضیحات محصول، شبکه‌های اجتماعی و ایده‌های محتوایی.",

    h1: "تولید محتوا با هوش مصنوعی",

    intro:
      "با ابزارک AI می‌توانی برای تولید محتوای وب، مقاله، توضیحات محصول و شبکه‌های اجتماعی ایده بگیری و متن اولیه قابل ویرایش تولید کنی.",

    visualType: "content",

    sections: [

      {
        title: "تولید محتوای هدفمند",
        text:
          "تولید محتوا زمانی ساده‌تر می‌شود که ابتدا موضوع، مخاطب و هدف مشخص باشند. ابزارک می‌تواند در مرحله ایده‌پردازی، ساختاردهی و نوشتن پیش‌نویس اولیه به تو کمک کند."
      },

      {
        title: "مناسب برای چه نوع محتوایی است؟",
        text:
          "می‌توانی ابزارک را برای انواع مختلف محتوای دیجیتال به کار ببری.",

        bullets: [
          "مقاله و محتوای وبلاگ",
          "محتوای معرفی خدمات",
          "توضیحات محصول",
          "کپشن شبکه‌های اجتماعی",
          "عنوان و زیرعنوان",
          "متن تبلیغاتی",
          "ایده تقویم محتوایی"
        ]
      },

      {
        title: "از ایده تا پیش‌نویس",
        text:
          "می‌توانی ابتدا موضوع را مشخص کنی، سپس ساختار مقاله یا متن را بگیری و در مرحله بعد هر بخش را جداگانه کامل کنی. این روش باعث می‌شود متن نهایی منظم‌تر و قابل ویرایش‌تر باشد."
      },

      {
        title: "ویرایش نهایی را فراموش نکن",
        text:
          "متن تولیدشده بهتر است قبل از انتشار از نظر دقت، لحن، اطلاعات، نام‌ها و هماهنگی با برند بررسی شود. ابزارک برای سرعت دادن به فرایند نوشتن است و بازبینی انسانی همچنان اهمیت دارد."
      }

    ]
  },


  "/translate-ai": {
    title: "ترجمه با هوش مصنوعی | ابزارک AI",
    description:
      "ترجمه و بازنویسی متن با هوش مصنوعی فارسی ابزارک برای متن‌های روزمره، کاری، آموزشی و محتوای دیجیتال.",

    h1: "ترجمه با هوش مصنوعی",

    intro:
      "متن خودت را برای ترجمه یا بازنویسی در اختیار ابزارک قرار بده و پاسخ روان و متناسب با زبان مقصد دریافت کن.",

    visualType: "translate",

    sections: [

      {
        title: "ترجمه سریع و قابل ویرایش",
        text:
          "ابزارک می‌تواند برای ترجمه اولیه متن‌های مختلف استفاده شود. بعد از دریافت نتیجه، می‌توانی درخواست کنی متن رسمی‌تر، ساده‌تر، محاوره‌ای‌تر یا متناسب با یک مخاطب مشخص بازنویسی شود."
      },

      {
        title: "کاربردهای ترجمه",
        text:
          "ترجمه هوشمند می‌تواند در بسیاری از کارهای روزمره و دیجیتال کاربرد داشته باشد.",

        bullets: [
          "ترجمه فارسی و انگلیسی",
          "ترجمه متن‌های کاری",
          "ترجمه توضیحات محصول",
          "ترجمه ایمیل و پیام",
          "کمک در یادگیری زبان",
          "بازنویسی متن ترجمه‌شده",
          "تغییر لحن متن مقصد"
        ]
      },

      {
        title: "ترجمه همراه با بازنویسی",
        text:
          "گاهی ترجمه لفظ‌به‌لفظ برای انتشار یا ارتباط کاری مناسب نیست. می‌توانی بعد از ترجمه از ابزارک بخواهی متن را طبیعی‌تر، رسمی‌تر یا متناسب با فرهنگ مخاطب مقصد بازنویسی کند."
      },

      {
        title: "برای متن‌های حساس بررسی انسانی انجام بده",
        text:
          "برای قراردادها، اطلاعات تخصصی، حقوقی، پزشکی یا اسناد مهم، نتیجه ترجمه باید توسط فرد آگاه بررسی شود؛ چون ظرافت‌های معنایی می‌توانند روی مفهوم نهایی اثر بگذارند."
      }

    ]
  },


  "/summarize-ai": {
    title: "خلاصه سازی متن با هوش مصنوعی | ابزارک AI",
    description:
      "خلاصه‌سازی متن با هوش مصنوعی برای تبدیل مطالب طولانی به نکات مهم، خلاصه آموزشی، گزارش و محتوای کوتاه‌تر.",

    h1: "خلاصه سازی متن با هوش مصنوعی",

    intro:
      "اگر یک متن طولانی داری و می‌خواهی سریع‌تر به نکات اصلی آن برسی، ابزارک می‌تواند در تهیه خلاصه و استخراج نکات مهم کمک کند.",

    visualType: "summary",

    sections: [

      {
        title: "تمرکز روی نکات اصلی",
        text:
          "در خلاصه‌سازی هدف این است که اطلاعات مهم متن حفظ شود و بخش‌های کم‌اهمیت یا تکراری کاهش پیدا کنند. ابزارک می‌تواند برای تهیه یک نسخه کوتاه‌تر و منظم‌تر از متن به کار برود."
      },

      {
        title: "چه چیزهایی را می‌توانی خلاصه کنی؟",
        text:
          "بسته به نوع محتوایی که در اختیار داری، خلاصه‌سازی می‌تواند کاربردهای مختلفی داشته باشد.",

        bullets: [
          "مقاله",
          "گزارش",
          "متن آموزشی",
          "یادداشت‌های طولانی",
          "محتوای وب",
          "جلسه و یادداشت کاری",
          "فهرست نکات مهم"
        ]
      },

      {
        title: "خلاصه را متناسب با نیازت تنظیم کن",
        text:
          "می‌توانی بخواهی متن در چند جمله، به شکل فهرست‌وار، با تیترهای جداگانه یا با تمرکز روی نکات کلیدی خلاصه شود. این کار خروجی را برای مطالعه سریع‌تر مناسب‌تر می‌کند."
      },

      {
        title: "برای مطالعه سریع",
        text:
          "اگر وقت خواندن کامل یک مطلب را نداری، ابتدا خلاصه را بررسی کن و سپس در صورت نیاز سراغ بخش‌های مهم متن اصلی برو. این روش می‌تواند روند بررسی مطالب طولانی را سریع‌تر کند."
      }

    ]
  },


  "/ideas-ai": {
    title: "ایده پردازی با هوش مصنوعی | ابزارک AI",
    description:
      "ایده‌پردازی با هوش مصنوعی برای کسب‌وکار، تولید محتوا، پروژه، شبکه‌های اجتماعی، نام‌گذاری و برنامه‌ریزی.",

    h1: "ایده پردازی با هوش مصنوعی",

    intro:
      "وقتی برای شروع یک پروژه، محتوا یا کسب‌وکار ایده کم داری، ابزارک می‌تواند برای ساخت، توسعه و دسته‌بندی ایده‌ها به تو کمک کند.",

    visualType: "ideas",

    sections: [

      {
        title: "ایده‌پردازی از یک موضوع ساده",
        text:
          "لازم نیست همیشه یک ایده کامل داشته باشی. حتی یک موضوع کوتاه، یک مشکل یا یک هدف می‌تواند نقطه شروع باشد. ابزارک می‌تواند چند مسیر مختلف برای توسعه آن پیشنهاد کند."
      },

      {
        title: "ایده برای چه کارهایی؟",
        text:
          "می‌توانی از ایده‌پردازی برای حوزه‌های مختلف استفاده کنی.",

        bullets: [
          "ایده کسب‌وکار",
          "ایده تولید محتوا",
          "ایده پست و ویدیو",
          "ایده پروژه شخصی",
          "نام برند یا محصول",
          "کمپین و تبلیغات",
          "برنامه‌ریزی و توسعه یک ایده"
        ]
      },

      {
        title: "ایده خام را به برنامه تبدیل کن",
        text:
          "بعد از پیدا کردن یک ایده، می‌توانی از ابزارک بخواهی مخاطب هدف، مراحل اجرا، ابزارهای موردنیاز، مزایا و چالش‌های آن را هم بررسی کند."
      },

      {
        title: "چند زاویه مختلف را بررسی کن",
        text:
          "برای جلوگیری از محدود شدن به یک راه‌حل، می‌توانی یک موضوع را از چند زاویه بررسی کنی و سپس ایده‌هایی را که برای شرایط خودت مناسب‌تر هستند جدا کنی."
      }

    ]
  },


  "/programming-ai": {
    title: "برنامه نویسی با هوش مصنوعی | ابزارک AI",
    description:
      "کمک به برنامه‌نویسی با هوش مصنوعی برای توضیح کد، رفع خطا، الگوریتم، HTML، CSS، JavaScript و نمونه کد.",

    h1: "برنامه نویسی با هوش مصنوعی",

    intro:
      "برای یادگیری برنامه‌نویسی، فهمیدن کد، بررسی خطا و پیدا کردن راهکار می‌توانی از ابزارک AI به عنوان دستیار متنی استفاده کنی.",

    visualType: "code",

    sections: [

      {
        title: "دستیار برای فهمیدن کد",
        text:
          "اگر بخشی از کد را متوجه نمی‌شوی، می‌توانی آن را در گفتگو قرار بدهی و درباره عملکرد، ساختار و منطق آن توضیح بخواهی. این روش برای یادگیری و بررسی سریع کد مفید است."
      },

      {
        title: "کاربردهای برنامه‌نویسی",
        text:
          "ابزارک می‌تواند در مراحل مختلف کار برنامه‌نویسی کمک‌کننده باشد.",

        bullets: [
          "توضیح کد",
          "بررسی خطاهای رایج",
          "نوشتن نمونه کد",
          "طراحی الگوریتم",
          "HTML و CSS",
          "JavaScript",
          "بررسی ساختار پروژه"
        ]
      },

      {
        title: "رفع خطا با توضیح دقیق",
        text:
          "برای بررسی یک خطا بهتر است پیام خطا، بخش مربوط به کد و نتیجه‌ای که انتظار داشتی را هم توضیح بدهی. در این حالت پاسخ می‌تواند مشخص‌تر و قابل استفاده‌تر باشد."
      },

      {
        title: "یادگیری مرحله‌به‌مرحله",
        text:
          "می‌توانی از ابزارک بخواهی یک موضوع برنامه‌نویسی را از سطح پایه توضیح دهد، برای آن مثال بزند و سپس تمرین یا پروژه کوچک پیشنهاد کند."
      }

    ]
  },


  "/ai-writing": {
    title: "نویسندگی و بازنویسی با هوش مصنوعی | ابزارک AI",
    description:
      "بازنویسی، اصلاح نگارشی، تغییر لحن و بهبود متن با هوش مصنوعی فارسی ابزارک.",

    h1: "نویسندگی و بازنویسی با هوش مصنوعی",

    intro:
      "اگر متنی نوشته‌ای و می‌خواهی آن را روان‌تر، حرفه‌ای‌تر، کوتاه‌تر یا متناسب با مخاطب خاصی کنی، ابزارک می‌تواند در ویرایش و بازنویسی کمک کند.",

    visualType: "writing",

    sections: [

      {
        title: "ویرایش متن بدون شروع از صفر",
        text:
          "گاهی ایده و متن اولیه را داری اما نمی‌خواهی همه‌چیز را دوباره بنویسی. در این شرایط می‌توانی متن موجود را در اختیار ابزارک قرار بدهی و نوع تغییر موردنظر را مشخص کنی."
      },

      {
        title: "چه تغییراتی می‌توانی درخواست کنی؟",
        text:
          "امکانات نوشتاری برای انواع مختلف متن قابل استفاده هستند.",

        bullets: [
          "بازنویسی متن",
          "اصلاح نگارشی",
          "روان‌تر کردن جمله‌ها",
          "رسمی کردن لحن",
          "دوستانه کردن لحن",
          "کوتاه کردن متن",
          "گسترش و تکمیل متن"
        ]
      },

      {
        title: "تغییر لحن برای مخاطب",
        text:
          "یک متن واحد ممکن است برای مشتری، همکار، دوست یا صفحه اجتماعی به لحن‌های متفاوتی نیاز داشته باشد. می‌توانی مخاطب و هدف را مشخص کنی تا نسخه‌ای متناسب با همان موقعیت تهیه شود."
      },

      {
        title: "متن نهایی را خودت بررسی کن",
        text:
          "بعد از بازنویسی، نام‌ها، اعداد، اطلاعات تخصصی و جزئیات مهم را بررسی کن تا متن نهایی کاملاً مطابق منظور اصلی تو باشد."
      }

    ]
  },


  "/ai-tools": {
    title: "ابزارهای هوش مصنوعی فارسی | ابزارک AI",
    description:
      "آشنایی با کاربردهای هوش مصنوعی فارسی ابزارک برای چت، تولید محتوا، ترجمه، خلاصه‌سازی، ایده‌پردازی، نویسندگی و برنامه‌نویسی.",

    h1: "ابزارهای هوش مصنوعی فارسی",

    intro:
      "ابزارک AI مجموعه‌ای از کاربردهای متنی و فکری هوش مصنوعی را در یک محیط ساده در اختیار تو قرار می‌دهد.",

    visualType: "tools",

    sections: [

      {
        title: "یک نقطه شروع برای کارهای مختلف",
        text:
          "به جای جابه‌جایی بین چند محیط مختلف، می‌توانی از یک چت هوشمند برای بسیاری از کارهای متنی و فکری خود استفاده کنی."
      },

      {
        title: "کاربردهای اصلی ابزارک",
        text:
          "هر صفحه برای یک نوع استفاده طراحی شده و می‌تواند نقطه شروع مناسب همان کار باشد.",

        bullets: [
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
        title: "از یک سؤال تا یک پروژه",
        text:
          "می‌توانی از یک درخواست ساده شروع کنی و در ادامه همان موضوع را مرحله‌به‌مرحله توسعه بدهی؛ از ایده اولیه گرفته تا متن، ساختار، بررسی و اصلاح."
      },

      {
        title: "انتخاب کاربرد مناسب",
        text:
          "برای نتیجه بهتر، موضوع و هدفت را مشخص کن و سپس از صفحه مرتبط استفاده کن. هر صفحه توضیح می‌دهد ابزارک در آن زمینه چگونه می‌تواند مفید باشد."
      }

    ]
  },


  "/ai-assistant": {
    title: "دستیار هوش مصنوعی فارسی | ابزارک AI",
    description:
      "دستیار هوش مصنوعی فارسی برای برنامه‌ریزی، نوشتن، یادگیری، ایده‌پردازی، پرسش و پاسخ و مدیریت کارهای روزمره.",

    h1: "دستیار هوش مصنوعی فارسی",

    intro:
      "ابزارک AI می‌تواند برای بسیاری از کارهای روزمره مثل برنامه‌ریزی، نوشتن، یادگیری، بررسی ایده‌ها و حل مسئله به عنوان یک دستیار متنی در کنار تو باشد.",

    visualType: "assistant",

    sections: [

      {
        title: "فراتر از یک پاسخ کوتاه",
        text:
          "دستیار هوشمند زمانی کاربردی‌تر می‌شود که بتوانی یک موضوع را در چند مرحله ادامه بدهی. می‌توانی درخواست اولیه را مطرح کنی و سپس نتیجه را اصلاح، کوتاه یا کامل‌تر کنی."
      },

      {
        title: "دستیار برای کارهای روزمره",
        text:
          "برای کارهای مختلف می‌توانی از یک گفتگوی پیوسته استفاده کنی.",

        bullets: [
          "تنظیم برنامه روزانه",
          "تهیه فهرست کارها",
          "نوشتن پیام و متن",
          "یادگیری یک موضوع",
          "بررسی و مقایسه ایده‌ها",
          "خلاصه‌سازی مطالب",
          "کمک در برنامه‌ریزی پروژه"
        ]
      },

      {
        title: "موضوعت را مرحله‌به‌مرحله جلو ببر",
        text:
          "می‌توانی ابتدا مسئله را توضیح بدهی، سپس از ابزارک بخواهی راهکارها را بررسی کند و در نهایت یکی از مسیرها را با جزئیات بیشتر توسعه دهد."
      },

      {
        title: "یک گفتگوی کاربردی بساز",
        text:
          "به جای درخواست‌های پراکنده، می‌توانی موضوع اصلی را در همان گفتگو ادامه بدهی و از ابزارک بخواهی پاسخ قبلی را با توجه به درخواست جدید اصلاح یا تکمیل کند."
      }

    ]
  }

};


// =============================================================
// FAQ
// =============================================================

const FAQ_ITEMS = [
  {
    q: "ابزارک AI چیست؟",
    a: "ابزارک AI یک دستیار هوش مصنوعی فارسی برای گفتگو، تولید محتوا، ترجمه، خلاصه‌سازی و ایده‌پردازی است."
  },
  {
    q: "آیا می‌توانم رایگان از ابزارک استفاده کنم؟",
    a: "بله، حساب‌های رایگان امکان استفاده روزانه از سهمیه رایگان ابزارک را دارند."
  },
  {
    q: "برای استفاده از چت هوش مصنوعی باید ثبت‌نام کنم؟",
    a: "برای ارسال پیام در چت ابزارک باید وارد حساب کاربری شوید یا ثبت‌نام کنید."
  },
  {
    q: "آیا ابزارک برای تولید محتوا مناسب است؟",
    a: "بله، می‌توانید برای تولید و بازنویسی متن، ایده‌پردازی، توضیحات محصول و محتوای مختلف از ابزارک استفاده کنید."
  },
  {
    q: "آیا ابزارک ترجمه هم انجام می‌دهد؟",
    a: "بله، ابزارک برای ترجمه و بازنویسی متن به زبان‌های مختلف قابل استفاده است."
  },
  {
    q: "آیا ابزارک برای برنامه‌نویسی هم کاربرد دارد؟",
    a: "بله، می‌توانید برای توضیح کد، بررسی خطا، الگوریتم و نمونه کد از ابزارک کمک بگیرید."
  },
  {
    q: "پلن‌های اشتراک ابزارک چگونه هستند؟",
    a: "ابزارک چند پلن اشتراک ارائه می‌کند و قیمت و امکانات هر پلن در صفحه اصلی نمایش داده می‌شود."
  },
  {
    q: "چطور رمز عبورم را بازیابی کنم؟",
    a: "از بخش ورود، گزینه فراموشی رمز عبور را انتخاب کنید تا فرایند بازیابی رمز عبور انجام شود."
  }
];


// =============================================================
// SEO HELPERS
// =============================================================

function escapeSeoHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function xml(data, status = 200) {
  return new Response(
    data,
    {
      status,
      headers: {
        "Content-Type":
          "application/xml; charset=utf-8",
        "Cache-Control":
          "public, max-age=3600"
      }
    }
  );
}

function robotsTxt() {
  return plainText(
`User-agent: *
Allow: /
Sitemap: https://abzarakai.ir/sitemap.xml
`
  );
}


// =============================================================
// UNIQUE SEO VISUALS
// =============================================================

function createSeoImage(
  type,
  title
) {

  const safeTitle =
    escapeSeoHtml(title);

  const visuals = {

    chat: `
      <div class="visual-art art-chat">
        <div class="art-window">
          <div class="art-top">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div class="chat-bubble bubble-one">
            سلام، امروز چه کمکی از من می‌خواهی؟
          </div>

          <div class="chat-bubble bubble-two">
            برای این موضوع یک توضیح ساده می‌خواهم.
          </div>

          <div class="chat-bubble bubble-three">
            حتماً، از پایه شروع می‌کنیم.
          </div>
        </div>

        <div class="art-orb orb-one"></div>
        <div class="art-orb orb-two"></div>

        <div class="art-caption">
          <strong>🤖 ابزارک AI</strong>
          <span>${safeTitle}</span>
        </div>
      </div>
    `,


    content: `
      <div class="visual-art art-content">

        <div class="content-sheet">

          <div class="sheet-line wide"></div>
          <div class="sheet-line"></div>
          <div class="sheet-line medium"></div>

          <div class="sheet-title">
            تولید محتوا
          </div>

          <div class="sheet-box"></div>

          <div class="sheet-line"></div>
          <div class="sheet-line medium"></div>

        </div>

        <div class="floating-card card-a">
          ✍️
          <b>مقاله</b>
        </div>

        <div class="floating-card card-b">
          📱
          <b>شبکه اجتماعی</b>
        </div>

        <div class="floating-card card-c">
          🛍️
          <b>محصول</b>
        </div>

        <div class="art-caption">
          <strong>✨ ابزارک AI</strong>
          <span>${safeTitle}</span>
        </div>

      </div>
    `,


    translate: `
      <div class="visual-art art-translate">

        <div class="translate-panel panel-right">
          <div class="panel-label">
            فارسی
          </div>

          <div class="panel-text">
            متن خودت را اینجا وارد کن
          </div>
        </div>

        <div class="translate-arrow">
          ⇄
        </div>

        <div class="translate-panel panel-left">
          <div class="panel-label">
            English
          </div>

          <div class="panel-text">
            Your translated text
          </div>
        </div>

        <div class="lang-chip chip-one">
          FA
        </div>

        <div class="lang-chip chip-two">
          EN
        </div>

        <div class="lang-chip chip-three">
          🌐
        </div>

        <div class="art-caption">
          <strong>🌍 ابزارک AI</strong>
          <span>${safeTitle}</span>
        </div>

      </div>
    `,


    summary: `
      <div class="visual-art art-summary">

        <div class="summary-paper">

          <div class="summary-heading"></div>

          <div class="summary-line"></div>
          <div class="summary-line short"></div>

          <div class="summary-highlight"></div>

          <div class="summary-line"></div>
          <div class="summary-line medium"></div>

        </div>

        <div class="summary-result">

          <div class="result-icon">
            ✓
          </div>

          <b>
            نکات کلیدی
          </b>

          <span>
            خلاصه و منظم
          </span>

        </div>

        <div class="summary-badge badge-a">
          AI
        </div>

        <div class="summary-badge badge-b">
          📝
        </div>

        <div class="art-caption">
          <strong>🧠 ابزارک AI</strong>
          <span>${safeTitle}</span>
        </div>

      </div>
    `,


    ideas: `
      <div class="visual-art art-ideas">

        <div class="idea-center">
          💡
        </div>

        <div class="idea-node node-one">
          کسب‌وکار
        </div>

        <div class="idea-node node-two">
          محتوا
        </div>

        <div class="idea-node node-three">
          پروژه
        </div>

        <div class="idea-node node-four">
          برند
        </div>

        <div class="idea-line line-one"></div>
        <div class="idea-line line-two"></div>
        <div class="idea-line line-three"></div>
        <div class="idea-line line-four"></div>

        <div class="art-caption">
          <strong>💡 ابزارک AI</strong>
          <span>${safeTitle}</span>
        </div>

      </div>
    `,


    code: `
      <div class="visual-art art-code">

        <div class="code-editor">

          <div class="code-top">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div class="code-body">

            <div>
              <i>const</i>
              assistant = <b>"AI"</b>;
            </div>

            <div>
              <i>function</i>
              solve(problem) {
            </div>

            <div class="indent">
              return solution;
            </div>

            <div>
              }
            </div>

          </div>

        </div>

        <div class="code-floating">
          &lt;/&gt;
        </div>

        <div class="code-check">
          ✓
        </div>

        <div class="art-caption">
          <strong>💻 ابزارک AI</strong>
          <span>${safeTitle}</span>
        </div>

      </div>
    `,


    writing: `
      <div class="visual-art art-writing">

        <div class="writing-paper">

          <div class="pen-mark"></div>

          <div class="writing-line"></div>
          <div class="writing-line"></div>
          <div class="writing-line short"></div>

          <div class="rewrite-arrow">
            ↻
          </div>

          <div class="writing-line"></div>
          <div class="writing-line short"></div>

        </div>

        <div class="writing-bubble">

          <span>رسمی</span>
          <span>روان</span>
          <span>کوتاه</span>

        </div>

        <div class="art-caption">
          <strong>🖊️ ابزارک AI</strong>
          <span>${safeTitle}</span>
        </div>

      </div>
    `,


    tools: `
      <div class="visual-art art-tools">

        <div class="tool-center">
          🤖
        </div>

        <div class="tool-item tool-one">
          💬
          <span>چت</span>
        </div>

        <div class="tool-item tool-two">
          ✍️
          <span>محتوا</span>
        </div>

        <div class="tool-item tool-three">
          🌍
          <span>ترجمه</span>
        </div>

        <div class="tool-item tool-four">
          💡
          <span>ایده</span>
        </div>

        <div class="tool-item tool-five">
          💻
          <span>کدنویسی</span>
        </div>

        <div class="art-caption">
          <strong>🧰 ابزارک AI</strong>
          <span>${safeTitle}</span>
        </div>

      </div>
    `,


    assistant: `
      <div class="visual-art art-assistant">

        <div class="assistant-avatar">
          🤖
        </div>

        <div class="assistant-ring ring-one"></div>
        <div class="assistant-ring ring-two"></div>

        <div class="assistant-task task-one">
          ✓ برنامه‌ریزی
        </div>

        <div class="assistant-task task-two">
          ✓ نوشتن
        </div>

        <div class="assistant-task task-three">
          ✓ یادگیری
        </div>

        <div class="assistant-task task-four">
          ✓ ایده‌پردازی
        </div>

        <div class="art-caption">
          <strong>🤖 ابزارک AI</strong>
          <span>${safeTitle}</span>
        </div>

      </div>
    `
  };

  return visuals[type] || visuals.chat;
}


function getSeoLinkIcon(type) {

  const icons = {
    chat: "💬",
    content: "✍️",
    translate: "🌍",
    summary: "📝",
    ideas: "💡",
    code: "💻",
    writing: "🖊️",
    tools: "🧰",
    assistant: "🤖"
  };

  return icons[type] || "✨";
}


function renderSeoPage(
  path,
  data
) {

  const canonical =
    "https://abzarakai.ir" +
    path;

  const sections =
    (data.sections || [])
      .map(
        (section, index) => {

          const bullets =
            Array.isArray(section.bullets) &&
            section.bullets.length
              ? `
                <ul class="seo-bullets">

                  ${section.bullets
                    .map(
                      x =>
                        `<li>${escapeSeoHtml(x)}</li>`
                    )
                    .join("")}

                </ul>
                `
              : "";

          return `
<section class="seo-card">

  <div class="seo-section-number">
    ${String(index + 1).padStart(2, "0")}
  </div>

  <h2>
    ${escapeSeoHtml(section.title)}
  </h2>

  <p>
    ${escapeSeoHtml(section.text || "")}
  </p>

  ${bullets}

</section>
`;
        }
      )
      .join("");

  const related =
    Object.entries(SEO_PAGES)
      .filter(
        ([p]) =>
          p !== path
      )
      .map(
        ([p, v]) =>
          `
          <a
            class="seo-link"
            href="${p}"
          >

            <span class="seo-link-icon">
              ${getSeoLinkIcon(v.visualType)}
            </span>

            <span>
              ${escapeSeoHtml(v.h1)}
            </span>

            <small>
              مشاهده صفحه
            </small>

          </a>
          `
      )
      .join("");

  const visual =
    createSeoImage(
      data.visualType,
      data.h1
    );

  return `<!doctype html>
<html lang="fa" dir="rtl">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1"
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
  content="index, follow"
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
  name="twitter:card"
  content="summary"
>

<meta
  name="twitter:title"
  content="${escapeSeoHtml(data.title)}"
>

<meta
  name="twitter:description"
  content="${escapeSeoHtml(data.description)}"
>

<style>

:root{

  --seo-bg:#ffffff;
  --seo-card:#ffffff;
  --seo-soft:#f8f9ff;

  --seo-border:#e7e9f3;

  --seo-text:#161a2b;
  --seo-muted:#62697e;

  --seo-accent:#665cff;
  --seo-accent-2:#9b5cff;

  --seo-shadow:
    0 14px 45px rgba(35,41,80,.08);

  --seo-radius:22px;
}

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
    "Vazirmatn",
    Arial,
    sans-serif;

  background:#ffffff;

  color:var(--seo-text);

  min-height:100vh;

  direction:rtl;
}

a{
  color:inherit;
}

.seo-wrap{

  max-width:1040px;

  margin:0 auto;

  padding:24px;
}

.seo-header{

  display:flex;

  align-items:center;

  justify-content:space-between;

  gap:15px;

  padding:
    6px
    0
    24px;
}

.seo-logo{

  display:flex;

  align-items:center;

  gap:9px;

  font-size:20px;

  font-weight:900;

  text-decoration:none;
}

.seo-logo-icon{

  width:40px;
  height:40px;

  border-radius:13px;

  display:flex;

  align-items:center;
  justify-content:center;

  background:
    linear-gradient(
      135deg,
      var(--seo-accent),
      var(--seo-accent-2)
    );

  color:#fff;

  box-shadow:
    0
    10px
    25px
    rgba(102,92,255,.20);
}

.seo-nav{

  display:flex;

  gap:8px;

  flex-wrap:wrap;
}

.seo-btn{

  display:inline-block;

  padding:
    11px
    17px;

  border-radius:13px;

  text-decoration:none;

  background:
    linear-gradient(
      135deg,
      var(--seo-accent),
      var(--seo-accent-2)
    );

  color:#fff;

  font-weight:800;

  box-shadow:
    0
    10px
    24px
    rgba(102,92,255,.16);

  transition:
    transform .18s,
    box-shadow .18s,
    filter .18s;
}

.seo-btn:hover{

  transform:
    translateY(-2px);

  box-shadow:
    0
    14px
    30px
    rgba(102,92,255,.22);

  filter:
    brightness(1.03);
}

.seo-btn.secondary{

  color:var(--seo-text);

  background:#fff;

  border:
    1px
    solid
    var(--seo-border);

  box-shadow:none;
}

.seo-hero{

  text-align:center;

  padding:
    34px
    0
    26px;
}

.seo-hero h1{

  font-size:40px;

  line-height:1.55;

  margin:
    0
    0
    14px;

  color:#12162b;
}

.seo-hero p{

  color:var(--seo-muted);

  line-height:2.05;

  max-width:800px;

  margin:
    0
    auto
    24px;

  font-size:16px;
}

.seo-hero h1::after{

  content:"";

  display:block;

  width:72px;
  height:4px;

  border-radius:999px;

  margin:
    16px
    auto
    0;

  background:
    linear-gradient(
      90deg,
      var(--seo-accent),
      var(--seo-accent-2)
    );
}


/* =========================================================
   UNIQUE VISUAL ART
   ========================================================= */

.visual-art{

  position:relative;

  overflow:hidden;

  max-width:900px;

  min-height:340px;

  margin:
    34px
    auto;

  border-radius:28px;

  background:
    linear-gradient(
      145deg,
      #f8f7ff 0%,
      #ffffff 48%,
      #f6f3ff 100%
    );

  border:
    1px
    solid
    #e7e5f5;

  box-shadow:
    0
    20px
    60px
    rgba(56,49,117,.10);
}

.visual-art::before,
.visual-art::after{

  content:"";

  position:absolute;

  border-radius:50%;

  pointer-events:none;
}

.visual-art::before{

  width:240px;
  height:240px;

  top:-90px;
  right:-80px;

  background:
    radial-gradient(
      circle,
      rgba(108,92,255,.18),
      rgba(108,92,255,0)
    );
}

.visual-art::after{

  width:250px;
  height:250px;

  bottom:-110px;
  left:-80px;

  background:
    radial-gradient(
      circle,
      rgba(173,92,255,.14),
      rgba(173,92,255,0)
    );
}

.art-caption{

  position:absolute;

  right:26px;
  left:26px;

  bottom:22px;

  display:flex;

  align-items:center;
  justify-content:center;

  gap:10px;

  flex-wrap:wrap;

  font-size:14px;
}

.art-caption strong{
  color:#211b54;
}

.art-caption span{
  color:#6a6d81;
}


/* CHAT */

.art-window{

  position:absolute;

  width:min(74%,620px);

  top:42px;

  right:50%;

  transform:
    translateX(50%);

  padding:18px;

  background:#fff;

  border:
    1px
    solid
    #e7e7f2;

  border-radius:22px;

  box-shadow:
    0
    18px
    40px
    rgba(42,35,91,.10);
}

.art-top{

  display:flex;

  gap:6px;

  margin-bottom:16px;
}

.art-top span{

  width:9px;
  height:9px;

  border-radius:50%;

  background:#d9dcec;
}

.chat-bubble{

  width:fit-content;

  max-width:80%;

  padding:
    12px
    15px;

  border-radius:15px;

  font-size:13px;

  line-height:1.8;

  margin:
    9px
    0;
}

.bubble-one{

  background:#f0efff;

  color:#40369a;

  margin-left:auto;
}

.bubble-two{

  background:#f7f7fa;

  color:#5d6274;

  margin-right:auto;
}

.bubble-three{

  background:
    linear-gradient(
      135deg,
      #6d60ff,
      #995cf4
    );

  color:#fff;

  margin-left:auto;
}

.art-orb{

  position:absolute;

  width:70px;
  height:70px;

  border-radius:50%;

  background:
    linear-gradient(
      135deg,
      #7b6eff,
      #b06cff
    );

  opacity:.15;
}

.orb-one{

  top:65px;
  left:70px;
}

.orb-two{

  bottom:90px;
  right:60px;
}


/* CONTENT */

.content-sheet{

  position:absolute;

  width:330px;

  min-height:230px;

  top:35px;

  right:50%;

  transform:
    translateX(50%);

  background:#fff;

  padding:24px;

  border-radius:20px;

  border:
    1px
    solid
    #e4e4ee;

  box-shadow:
    0
    18px
    45px
    rgba(48,42,98,.10);
}

.sheet-title{

  font-weight:900;

  color:#342c8f;

  margin:
    12px
    0;
}

.sheet-line{

  height:9px;

  border-radius:999px;

  background:#ececf5;

  margin:
    9px
    0;
}

.sheet-line.wide{
  width:100%;
}

.sheet-line.medium{
  width:68%;
}

.sheet-box{

  height:54px;

  border-radius:12px;

  background:#f3f1ff;

  margin:
    15px
    0;
}

.floating-card{

  position:absolute;

  display:flex;

  align-items:center;

  gap:9px;

  padding:
    11px
    14px;

  background:#fff;

  border:
    1px
    solid
    #e5e5ee;

  border-radius:15px;

  box-shadow:
    0
    14px
    30px
    rgba(45,38,85,.10);

  font-size:13px;
}

.floating-card b{

  font-size:12px;

  color:#35394d;
}

.card-a{

  top:65px;
  left:65px;
}

.card-b{

  right:54px;
  top:140px;
}

.card-c{

  left:90px;
  bottom:78px;
}


/* TRANSLATE */

.translate-panel{

  position:absolute;

  width:34%;

  min-height:155px;

  top:72px;

  padding:22px;

  background:#fff;

  border:
    1px
    solid
    #e5e6ef;

  border-radius:20px;

  box-shadow:
    0
    18px
    40px
    rgba(45,38,89,.08);
}

.panel-right{
  right:8%;
}

.panel-left{
  left:8%;
}

.panel-label{

  font-size:12px;

  color:#6b63da;

  font-weight:900;
}

.panel-text{

  margin-top:15px;

  color:#404559;

  line-height:2;

  font-size:13px;
}

.translate-arrow{

  position:absolute;

  top:118px;

  right:50%;

  transform:
    translateX(50%);

  width:54px;
  height:54px;

  border-radius:50%;

  display:flex;

  align-items:center;
  justify-content:center;

  background:
    linear-gradient(
      135deg,
      #6d60ff,
      #9a5df3
    );

  color:#fff;

  font-size:22px;

  font-weight:900;

  box-shadow:
    0
    12px
    25px
    rgba(107,94,255,.20);
}

.lang-chip{

  position:absolute;

  padding:
    8px
    13px;

  border-radius:999px;

  background:#fff;

  border:
    1px
    solid
    #e4e4ee;

  box-shadow:
    0
    8px
    20px
    rgba(44,38,84,.08);

  font-size:12px;

  font-weight:900;
}

.chip-one{

  right:13%;
  top:45px;
}

.chip-two{

  left:13%;
  bottom:92px;
}

.chip-three{

  right:48%;
  bottom:64px;
}


/* SUMMARY */

.summary-paper{

  position:absolute;

  width:300px;

  min-height:230px;

  top:38px;

  right:50%;

  transform:
    translateX(50%);

  padding:24px;

  background:#fff;

  border:
    1px
    solid
    #e5e5ef;

  border-radius:20px;

  box-shadow:
    0
    20px
    40px
    rgba(43,37,92,.09);
}

.summary-heading{

  height:12px;

  width:60%;

  background:#dedcff;

  border-radius:999px;

  margin-bottom:20px;
}

.summary-line{

  height:8px;

  width:100%;

  background:#ededf4;

  border-radius:999px;

  margin:
    9px
    0;
}

.summary-line.short{
  width:65%;
}

.summary-line.medium{
  width:75%;
}

.summary-highlight{

  height:48px;

  background:#f2f0ff;

  border-radius:12px;

  margin:
    15px
    0;
}

.summary-result{

  position:absolute;

  right:7%;
  top:112px;

  width:185px;

  padding:15px;

  background:#fff;

  border:
    1px
    solid
    #e5e4ef;

  border-radius:17px;

  box-shadow:
    0
    14px
    35px
    rgba(46,39,91,.10);
}

.result-icon{

  width:32px;
  height:32px;

  border-radius:10px;

  background:#e7f8ef;

  color:#159453;

  display:flex;

  align-items:center;
  justify-content:center;

  margin-bottom:8px;
}

.summary-result b{

  display:block;

  font-size:13px;
}

.summary-result span{

  display:block;

  color:#74788a;

  font-size:11px;

  margin-top:5px;
}

.summary-badge{

  position:absolute;

  width:44px;
  height:44px;

  border-radius:14px;

  display:flex;

  align-items:center;
  justify-content:center;

  background:#fff;

  border:
    1px
    solid
    #e6e5ee;

  box-shadow:
    0
    10px
    25px
    rgba(39,34,80,.08);
}

.badge-a{

  left:9%;
  top:70px;

  color:#725aff;

  font-weight:900;
}

.badge-b{

  left:15%;
  bottom:80px;
}


/* IDEAS */

.idea-center{

  position:absolute;

  right:50%;

  top:122px;

  transform:
    translateX(50%);

  width:90px;
  height:90px;

  border-radius:28px;

  display:flex;

  align-items:center;
  justify-content:center;

  font-size:46px;

  background:#fff;

  border:
    1px
    solid
    #e7e4ef;

  box-shadow:
    0
    18px
    45px
    rgba(43,37,93,.10);

  z-index:3;
}

.idea-node{

  position:absolute;

  padding:
    12px
    17px;

  border-radius:14px;

  background:#fff;

  border:
    1px
    solid
    #e5e5ef;

  box-shadow:
    0
    12px
    28px
    rgba(45,38,90,.08);

  font-size:13px;

  font-weight:800;
}

.node-one{

  top:55px;
  right:21%;
}

.node-two{

  top:115px;
  left:12%;
}

.node-three{

  bottom:92px;
  right:17%;
}

.node-four{

  bottom:55px;
  left:22%;
}

.idea-line{

  position:absolute;

  height:2px;

  background:
    linear-gradient(
      90deg,
      rgba(105,91,255,.10),
      rgba(105,91,255,.55),
      rgba(105,91,255,.10)
    );

  transform-origin:center;
}

.line-one{

  width:160px;

  right:31%;

  top:102px;

  transform:
    rotate(18deg);
}

.line-two{

  width:190px;

  left:26%;

  top:137px;

  transform:
    rotate(-4deg);
}

.line-three{

  width:150px;

  right:31%;

  bottom:120px;

  transform:
    rotate(-18deg);
}

.line-four{

  width:170px;

  left:27%;

  bottom:93px;

  transform:
    rotate(17deg);
}


/* CODE */

.code-editor{

  position:absolute;

  width:min(70%,620px);

  top:48px;

  right:50%;

  transform:
    translateX(50%);

  border-radius:20px;

  overflow:hidden;

  background:#181c2e;

  box-shadow:
    0
    22px
    45px
    rgba(20,23,42,.18);
}

.code-top{

  display:flex;

  gap:6px;

  padding:
    13px
    16px;

  background:#20253a;
}

.code-top span{

  width:9px;
  height:9px;

  border-radius:50%;

  background:#7f8498;
}

.code-body{

  padding:25px;

  color:#e7e9f6;

  font-family:monospace;

  font-size:13px;

  line-height:2.1;

  direction:ltr;

  text-align:left;
}

.code-body i{

  color:#9e8cff;

  font-style:normal;
}

.code-body b{

  color:#72d3a4;

  font-weight:500;
}

.indent{

  padding-left:26px;
}

.code-floating{

  position:absolute;

  left:9%;
  top:80px;

  width:64px;
  height:64px;

  border-radius:18px;

  display:flex;

  align-items:center;
  justify-content:center;

  background:#fff;

  color:#6255e9;

  border:
    1px
    solid
    #e3e3ed;

  font-family:monospace;

  font-weight:900;

  box-shadow:
    0
    12px
    28px
    rgba(44,38,85,.10);
}

.code-check{

  position:absolute;

  right:10%;
  bottom:80px;

  width:52px;
  height:52px;

  border-radius:16px;

  display:flex;

  align-items:center;
  justify-content:center;

  background:#eafaf1;

  color:#159455;

  font-size:24px;

  font-weight:900;
}


/* WRITING */

.writing-paper{

  position:absolute;

  right:50%;

  transform:
    translateX(50%);

  top:45px;

  width:310px;

  min-height:225px;

  padding:28px;

  background:#fff;

  border:
    1px
    solid
    #e6e5ed;

  border-radius:20px;

  box-shadow:
    0
    18px
    40px
    rgba(42,36,86,.09);
}

.pen-mark{

  width:62px;
  height:10px;

  border-radius:999px;

  background:#d9d5ff;

  margin-bottom:20px;
}

.writing-line{

  width:100%;

  height:8px;

  border-radius:999px;

  background:#ececf3;

  margin:
    11px
    0;
}

.writing-line.short{
  width:64%;
}

.rewrite-arrow{

  position:absolute;

  right:calc(50% - 24px);

  top:96px;

  width:48px;
  height:48px;

  border-radius:15px;

  display:flex;

  align-items:center;
  justify-content:center;

  background:
    linear-gradient(
      135deg,
      #6c5dff,
      #9a5af4
    );

  color:#fff;

  font-size:22px;

  box-shadow:
    0
    12px
    25px
    rgba(103,91,255,.20);
}

.writing-bubble{

  position:absolute;

  left:9%;
  top:88px;

  display:flex;

  flex-direction:column;

  gap:8px;
}

.writing-bubble span{

  padding:
    7px
    11px;

  border-radius:999px;

  background:#fff;

  border:
    1px
    solid
    #e6e5ee;

  box-shadow:
    0
    8px
    20px
    rgba(42,36,82,.07);

  font-size:11px;
}


/* TOOLS */

.tool-center{

  position:absolute;

  right:50%;

  top:112px;

  transform:
    translateX(50%);

  width:92px;
  height:92px;

  border-radius:28px;

  display:flex;

  align-items:center;
  justify-content:center;

  background:
    linear-gradient(
      135deg,
      #6b5cff,
      #9a5af1
    );

  color:#fff;

  font-size:42px;

  box-shadow:
    0
    18px
    38px
    rgba(100,86,245,.25);

  z-index:3;
}

.tool-item{

  position:absolute;

  width:82px;

  min-height:64px;

  display:flex;

  flex-direction:column;

  align-items:center;
  justify-content:center;

  gap:4px;

  background:#fff;

  border:
    1px
    solid
    #e5e5ee;

  border-radius:18px;

  box-shadow:
    0
    10px
    25px
    rgba(42,36,84,.08);

  font-size:20px;
}

.tool-item span{

  font-size:10px;

  color:#4f5366;
}

.tool-one{

  right:24%;
  top:52px;
}

.tool-two{

  left:24%;
  top:52px;
}

.tool-three{

  right:11%;
  bottom:74px;
}

.tool-four{

  left:11%;
  bottom:74px;
}

.tool-five{

  right:50%;
  bottom:47px;

  transform:
    translateX(50%);
}


/* ASSISTANT */

.assistant-avatar{

  position:absolute;

  right:50%;

  top:105px;

  transform:
    translateX(50%);

  width:95px;
  height:95px;

  border-radius:30px;

  display:flex;

  align-items:center;
  justify-content:center;

  background:
    linear-gradient(
      135deg,
      #685bff,
      #9c5cf2
    );

  color:#fff;

  font-size:45px;

  box-shadow:
    0
    18px
    40px
    rgba(98,84,240,.25);

  z-index:4;
}

.assistant-ring{

  position:absolute;

  right:50%;

  top:101px;

  transform:
    translateX(50%);

  border-radius:50%;

  border:
    1px dashed
    rgba(103,91,255,.35);
}

.ring-one{

  width:150px;
  height:150px;
}

.ring-two{

  width:215px;
  height:215px;

  opacity:.55;
}

.assistant-task{

  position:absolute;

  padding:
    10px
    14px;

  background:#fff;

  border:
    1px
    solid
    #e7e6ef;

  border-radius:13px;

  box-shadow:
    0
    10px
    24px
    rgba(45,38,88,.08);

  font-size:12px;

  font-weight:800;
}

.task-one{

  top:56px;
  right:15%;
}

.task-two{

  top:140px;
  left:10%;
}

.task-three{

  bottom:76px;
  right:15%;
}

.task-four{

  bottom:55px;
  left:18%;
}


/* =========================================================
   CONTENT CARDS
   ========================================================= */

.seo-card{

  position:relative;

  background:#fff;

  border:
    1px
    solid
    var(--seo-border);

  border-radius:var(--seo-radius);

  padding:
    30px
    28px
    28px
    78px;

  margin:
    18px
    0;

  box-shadow:
    var(--seo-shadow);

  transition:
    transform .18s,
    box-shadow .18s;
}

.seo-card:hover{

  transform:
    translateY(-2px);

  box-shadow:
    0
    18px
    55px
    rgba(35,41,80,.11);
}

.seo-section-number{

  position:absolute;

  left:25px;
  top:28px;

  width:40px;
  height:40px;

  border-radius:13px;

  display:flex;

  align-items:center;
  justify-content:center;

  background:#f1efff;

  color:#6659e8;

  font-size:11px;

  font-weight:900;
}

.seo-card h2{

  margin:
    0
    0
    12px;

  font-size:22px;

  color:#171a2d;
}

.seo-card p{

  margin:0;

  color:#5f6579;

  line-height:2.1;

  font-size:15px;
}

.seo-bullets{

  list-style:none;

  padding:0;

  margin:
    18px
    0
    0;

  display:grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(210px,1fr)
    );

  gap:10px;
}

.seo-bullets li{

  position:relative;

  padding:
    12px
    14px
    12px
    12px;

  background:#fafaff;

  border:
    1px
    solid
    #ececf5;

  border-radius:13px;

  color:#4f5569;

  font-size:13.5px;

  line-height:1.8;
}

.seo-bullets li::before{

  content:"✓";

  color:#665cff;

  font-weight:900;

  margin-left:7px;
}

.seo-cta{

  margin:
    32px
    0;

  padding:
    38px
    25px;

  border:
    1px
    solid
    #dedbff;

  border-radius:24px;

  text-align:center;

  background:
    linear-gradient(
      135deg,
      #fbfaff,
      #f7f5ff
    );

  box-shadow:
    0
    16px
    45px
    rgba(67,56,157,.07);
}

.seo-cta h2{

  margin:
    0
    0
    10px;

  color:#201b57;

  font-size:26px;
}

.seo-cta p{

  max-width:700px;

  margin:
    0
    auto
    22px;

  color:#676d82;

  line-height:2;
}

.seo-links{

  display:grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(240px,1fr)
    );

  gap:12px;
}

.seo-link{

  display:flex;

  align-items:center;

  gap:11px;

  padding:15px;

  background:#fff;

  border:
    1px
    solid
    #e7e8f0;

  border-radius:15px;

  text-decoration:none;

  transition:
    transform .15s,
    border-color .15s,
    box-shadow .15s;
}

.seo-link:hover{

  transform:
    translateY(-2px);

  border-color:#bdb7ff;

  box-shadow:
    0
    10px
    25px
    rgba(47,41,92,.07);
}

.seo-link-icon{

  width:40px;
  height:40px;

  border-radius:12px;

  display:flex;

  align-items:center;
  justify-content:center;

  background:#f2efff;

  font-size:18px;

  flex:none;
}

.seo-link > span:nth-child(2){

  font-size:13px;

  font-weight:800;

  color:#2b3043;

  line-height:1.7;
}

.seo-link small{

  margin-right:auto;

  color:#8a8ea0;

  font-size:10px;

  white-space:nowrap;
}

.seo-footer{

  text-align:center;

  color:#80869a;

  font-size:13px;

  padding:
    38px
    0
    20px;

  line-height:2.1;
}

.seo-footer a{

  color:#6258db;

  text-decoration:none;

  font-weight:700;
}


/* =========================================================
   RESPONSIVE SEO
   ========================================================= */

@media(max-width:760px){

  .seo-wrap{
    padding:16px;
  }

  .seo-header{
    align-items:flex-start;
  }

  .seo-nav{
    justify-content:flex-end;
  }

  .seo-hero h1{
    font-size:30px;
  }

  .seo-hero p{
    font-size:14px;
  }

  .visual-art{

    min-height:300px;

    border-radius:23px;
  }

  .art-window,
  .code-editor{

    width:84%;
  }

  .translate-panel{
    width:37%;
  }

  .content-sheet,
  .summary-paper,
  .writing-paper{

    width:250px;
  }

  .seo-card{

    padding:
      25px
      20px
      22px
      62px;
  }

  .seo-card h2{

    font-size:19px;
  }

  .seo-bullets{

    grid-template-columns:1fr;
  }

  .seo-link{

    min-height:70px;
  }
}

@media(max-width:520px){

  .seo-header{

    flex-direction:column;
  }

  .seo-nav{

    width:100%;
  }

  .seo-nav .seo-btn{

    flex:1;

    text-align:center;
  }

  .seo-hero{

    padding-top:20px;
  }

  .seo-hero h1{

    font-size:26px;
  }

  .visual-art{

    min-height:280px;
  }

  .art-window{

    top:35px;

    width:88%;
  }

  .content-sheet,
  .summary-paper,
  .writing-paper{

    width:220px;

    min-height:195px;

    padding:20px;
  }

  .floating-card{

    transform:
      scale(.82);
  }

  .card-a{
    left:5px;
  }

  .card-b{
    right:5px;
  }

  .card-c{
    left:25px;
  }

  .translate-panel{

    width:39%;

    padding:14px;

    top:65px;
  }

  .translate-arrow{

    width:46px;
    height:46px;
  }

  .tool-item{

    transform:
      scale(.78);
  }

  .tool-five{

    transform:
      translateX(50%)
      scale(.78);
  }

  .seo-card{

    padding:
      24px
      18px
      22px
      18px;
  }

  .seo-section-number{

    position:static;

    margin-bottom:12px;
  }

  .seo-links{

    grid-template-columns:1fr;
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

<main>

<section class="seo-hero">

  <h1>
    ${escapeSeoHtml(data.h1)}
  </h1>

  <p>
    ${escapeSeoHtml(data.intro)}
  </p>

  ${visual}

  <a
    href="/"
    class="seo-btn"
  >
    رایگان امتحان کن
  </a>

</section>

${sections}

<section class="seo-cta">

  <h2>
    ابزارک AI را امتحان کن
  </h2>

  <p>
    برای گفتگو، نوشتن، ترجمه، خلاصه‌سازی،
    ایده‌پردازی و یادگیری می‌توانی همین حالا
    وارد ابزارک شوی.
  </p>

  <a
    href="/"
    class="seo-btn"
  >
    شروع استفاده از ابزارک
  </a>

</section>

<section class="seo-card">

  <div class="seo-section-number">
    🔗
  </div>

  <h2>
    صفحات مرتبط ابزارک
  </h2>

  <p style="margin-bottom:18px;">
    برای آشنایی بیشتر با کاربردهای مختلف
    هوش مصنوعی می‌توانی صفحات زیر را نیز ببینی.
  </p>

  <div class="seo-links">
    ${related}
  </div>

</section>

</main>

<footer class="seo-footer">

  🤖 ابزارک AI — دستیار هوش مصنوعی فارسی

  <br>

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

function renderFaqPage() {

  const canonical =
    "https://abzarakai.ir/faq";

  const faqHtml =
    FAQ_ITEMS
      .map(
        item =>
`
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

  const faqSchema = {

    "@context":
      "https://schema.org",

    "@type":
      "FAQPage",

    "mainEntity":
      FAQ_ITEMS.map(
        item => ({

          "@type":
            "Question",

          "name":
            item.q,

          "acceptedAnswer": {

            "@type":
              "Answer",

            "text":
              item.a

          }

        })
      )
  };

  const schemaJson =
    JSON.stringify(
      faqSchema
    ).replace(
      /</g,
      "\\u003c"
    );

  return `<!doctype html>
<html lang="fa" dir="rtl">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1"
>

<title>
  سؤالات متداول ابزارک AI | هوش مصنوعی فارسی
</title>

<meta
  name="description"
  content="پاسخ به سؤالات متداول درباره ابزارک AI، چت هوش مصنوعی فارسی، ثبت‌نام، استفاده رایگان، پلن‌ها و بازیابی رمز عبور."
>

<meta
  name="robots"
  content="index, follow"
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

<meta
  property="og:site_name"
  content="ابزارک AI"
>

<script type="application/ld+json">${schemaJson}</script>

<style>

:root{

  --faq-text:#171a2c;

  --faq-muted:#646a7d;

  --faq-border:#e7e8f0;

  --faq-accent:#665cff;

  --faq-accent-2:#9a5bf2;
}

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
    "Vazirmatn",
    Arial,
    sans-serif;

  background:#ffffff;

  color:var(--faq-text);

  min-height:100vh;

  direction:rtl;
}

.faq-wrap{

  max-width:980px;

  margin:auto;

  padding:24px;
}

.faq-header{

  display:flex;

  justify-content:space-between;

  align-items:center;

  gap:12px;

  padding-bottom:30px;
}

.faq-logo{

  display:flex;

  align-items:center;

  gap:9px;

  font-size:20px;

  font-weight:900;

  text-decoration:none;
}

.faq-logo::before{

  content:"🤖";

  width:40px;
  height:40px;

  border-radius:13px;

  display:flex;

  align-items:center;
  justify-content:center;

  background:
    linear-gradient(
      135deg,
      var(--faq-accent),
      var(--faq-accent-2)
    );

  color:#fff;

  box-shadow:
    0
    10px
    25px
    rgba(102,92,255,.20);
}

.faq-btn{

  display:inline-block;

  padding:
    11px
    17px;

  border-radius:13px;

  text-decoration:none;

  background:
    linear-gradient(
      135deg,
      var(--faq-accent),
      var(--faq-accent-2)
    );

  color:#fff;

  font-weight:800;

  box-shadow:
    0
    10px
    24px
    rgba(102,92,255,.16);
}

.faq-hero{

  text-align:center;

  padding:
    28px
    0
    30px;
}

.faq-hero h1{

  font-size:38px;

  line-height:1.5;

  margin:
    0
    0
    14px;
}

.faq-hero p{

  color:var(--faq-muted);

  line-height:2;

  max-width:740px;

  margin:
    0
    auto
    24px;
}

.faq-image{

  position:relative;

  overflow:hidden;

  max-width:850px;

  min-height:300px;

  margin:
    30px
    auto;

  border:
    1px
    solid
    #e7e5f2;

  border-radius:26px;

  display:flex;

  align-items:center;
  justify-content:center;

  flex-direction:column;

  background:
    linear-gradient(
      145deg,
      #f9f8ff,
      #ffffff,
      #f6f3ff
    );

  box-shadow:
    0
    20px
    60px
    rgba(45,38,90,.09);
}

.faq-image::before{

  content:"";

  position:absolute;

  width:260px;
  height:260px;

  border-radius:50%;

  top:-110px;

  right:-80px;

  background:
    radial-gradient(
      circle,
      rgba(102,92,255,.18),
      transparent 70%
    );
}

.faq-image::after{

  content:"";

  position:absolute;

  width:220px;
  height:220px;

  border-radius:50%;

  bottom:-100px;

  left:-80px;

  background:
    radial-gradient(
      circle,
      rgba(154,91,242,.14),
      transparent 70%
    );
}

.faq-image-icon{

  position:relative;

  z-index:2;

  width:90px;
  height:90px;

  border-radius:28px;

  display:flex;

  align-items:center;
  justify-content:center;

  background:
    linear-gradient(
      135deg,
      var(--faq-accent),
      var(--faq-accent-2)
    );

  color:#fff;

  font-size:47px;

  box-shadow:
    0
    18px
    38px
    rgba(100,85,240,.24);
}

.faq-image-title{

  position:relative;

  z-index:2;

  font-size:28px;

  font-weight:900;

  margin-top:15px;

  color:#211c57;
}

.faq-image-subtitle{

  position:relative;

  z-index:2;

  color:#71768a;

  margin-top:8px;

  line-height:1.8;

  padding:
    0
    15px;
}

.faq-item{

  position:relative;

  background:#fff;

  border:
    1px
    solid
    var(--faq-border);

  border-radius:20px;

  padding:
    24px
    24px
    24px
    70px;

  margin:
    15px
    0;

  box-shadow:
    0
    12px
    38px
    rgba(39,43,75,.06);
}

.faq-item::before{

  content:"?";

  position:absolute;

  left:22px;

  top:23px;

  width:36px;
  height:36px;

  border-radius:12px;

  display:flex;

  align-items:center;
  justify-content:center;

  background:#f0eeff;

  color:#6357e7;

  font-weight:900;
}

.faq-item h2{

  font-size:19px;

  margin:
    0
    0
    10px;

  line-height:1.8;
}

.faq-item p{

  color:#62687b;

  line-height:2;

  margin:0;
}

.faq-cta{

  text-align:center;

  margin:
    32px
    0;

  padding:
    32px
    20px;

  border:
    1px
    solid
    #dedbff;

  border-radius:22px;

  background:
    linear-gradient(
      135deg,
      #fbfaff,
      #f6f4ff
    );
}

.faq-cta h2{

  margin:
    0
    0
    8px;

  color:#241d5e;
}

.faq-cta p{

  color:#707589;

  line-height:2;
}

.faq-footer{

  text-align:center;

  color:#84899a;

  padding:
    32px
    0
    20px;

  font-size:13px;
}

@media(max-width:640px){

  .faq-wrap{
    padding:16px;
  }

  .faq-header{
    align-items:flex-start;
  }

  .faq-hero h1{
    font-size:28px;
  }

  .faq-image{
    min-height:270px;
  }

  .faq-image-title{
    font-size:24px;
  }

  .faq-item{

    padding:
      22px
      20px
      22px
      58px;
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
    ابزارک AI
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
    پاسخ به پرسش‌های رایج درباره هوش مصنوعی فارسی ابزارک،
    ثبت‌نام، استفاده رایگان، پلن‌ها و امکانات سرویس.
  </p>

  <div class="faq-image">

    <div class="faq-image-icon">
      🤖
    </div>

    <div class="faq-image-title">
      ابزارک AI
    </div>

    <div class="faq-image-subtitle">
      پاسخ به پرسش‌های رایج درباره دستیار هوش مصنوعی فارسی
    </div>

  </div>

</section>

${faqHtml}

<section class="faq-cta">

  <h2>
    آماده‌ای امتحانش کنی؟
  </h2>

  <p>
    همین حالا وارد ابزارک شو و گفتگو با هوش مصنوعی فارسی را شروع کن.
  </p>

  <a
    href="/"
    class="faq-btn"
  >
    شروع گفتگو
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


function sitemapXml() {

  const todayDate =
    new Date()
      .toISOString()
      .slice(0, 10);

  const paths = [
    "/",
    ...Object.keys(SEO_PAGES),
    "/faq"
  ];

  const uniquePaths =
    [
      ...new Set(paths)
    ];

  const urls =
    uniquePaths
      .map(
        path =>
`
<url>
  <loc>${escapeXml(
    "https://abzarakai.ir" + path
  )}</loc>

  <lastmod>${todayDate}</lastmod>
</url>
`
      )
      .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}


// =============================================================
// ABZARAK AI — BACKEND
// =============================================================

const FREE_DAILY_LIMIT = 10;

const PLAN_PRICES = {
  basic: 400000,
  standard: 1000000,
  pro: 2000000,
  special: 3000000
};

const PLAN_USD = {
  basic: 5,
  standard: 10,
  pro: 15,
  special: 20
};

const PLAN_NAMES = {
  basic: "Basic",
  standard: "Standard",
  pro: "Pro",
  special: "Special"
};

const PLAN_FEATURES = {
  basic: [
    "استفاده بیشتر از هوش مصنوعی",
    "گفتگو با دستیار هوشمند",
    "پشتیبانی چندزبانه"
  ],

  standard: [
    "استفاده گسترده‌تر از هوش مصنوعی",
    "گفتگو و تولید محتوا",
    "ترجمه و بازنویسی",
    "پشتیبانی چندزبانه"
  ],

  pro: [
    "استفاده حرفه‌ای از هوش مصنوعی",
    "تولید و بازنویسی متن",
    "ترجمه",
    "ایده‌پردازی و خلاصه‌سازی",
    "دسترسی گسترده"
  ],

  special: [
    "استفاده ویژه از هوش مصنوعی",
    "تمام امکانات حرفه‌ای",
    "استفاده گسترده",
    "پشتیبانی چندزبانه"
  ]
};

function getAuthSecret(env) {
  return String(
    env.JWT_SECRET ||
    env.ADMIN_PASSWORD ||
    "abzarak-default-secret"
  ).trim();
}

function json(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type":
          "application/json; charset=utf-8",
        "Cache-Control":
          "no-store"
      }
    }
  );
}

function html(data, status = 200) {
  return new Response(
    data,
    {
      status,
      headers: {
        "Content-Type":
          "text/html; charset=utf-8",
        "Cache-Control":
          "no-store"
      }
    }
  );
}

function plainText(data, status = 200) {
  return new Response(
    data,
    {
      status,
      headers: {
        "Content-Type":
          "text/plain; charset=utf-8"
      }
    }
  );
}

function cors(response) {
  const headers =
    new Headers(response.headers);

  headers.set(
    "Access-Control-Allow-Origin",
    "*"
  );

  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );

  return new Response(
    response.body,
    {
      status: response.status,
      statusText: response.statusText,
      headers
    }
  );
}

async function bodyJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function randomHex(bytes = 32) {
  const data =
    new Uint8Array(bytes);

  crypto.getRandomValues(data);

  return Array.from(data)
    .map(
      x =>
        x
          .toString(16)
          .padStart(2, "0")
    )
    .join("");
}

function randomCode() {
  const data =
    new Uint32Array(1);

  crypto.getRandomValues(data);

  return String(
    100000 +
    (data[0] % 900000)
  );
}

async function hashPassword(password) {
  const data =
    new TextEncoder().encode(password);

  const hash =
    await crypto.subtle.digest(
      "SHA-256",
      data
    );

  return Array.from(
    new Uint8Array(hash)
  )
    .map(
      x =>
        x
          .toString(16)
          .padStart(2, "0")
    )
    .join("");
}

function base64url(data) {
  let binary = "";

  if (
    typeof data === "string"
  ) {
    binary = btoa(data);
  } else {
    binary =
      btoa(
        String.fromCharCode(...data)
      );
  }

  return binary
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function decodeBase64url(value) {
  value =
    value
      .replaceAll("-", "+")
      .replaceAll("_", "/");

  while (
    value.length % 4
  ) {
    value += "=";
  }

  return atob(value);
}

async function hmacSign(
  value,
  secret
) {
  const key =
    await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      {
        name: "HMAC",
        hash: "SHA-256"
      },
      false,
      ["sign"]
    );

  const signature =
    await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(value)
    );

  return base64url(
    new Uint8Array(signature)
  );
}

async function createToken(
  payload,
  secret
) {
  const encoded =
    base64url(
      JSON.stringify(payload)
    );

  const signature =
    await hmacSign(
      encoded,
      secret
    );

  return encoded + "." + signature;
}

async function verifyToken(
  token,
  secret
) {
  if (!token) {
    return null;
  }

  const parts =
    token.split(".");

  if (
    parts.length !== 2
  ) {
    return null;
  }

  const payloadPart =
    parts[0];

  const signature =
    parts[1];

  const expected =
    await hmacSign(
      payloadPart,
      secret
    );

  if (
    signature !== expected
  ) {
    return null;
  }

  try {
    const payload =
      JSON.parse(
        decodeBase64url(
          payloadPart
        )
      );

    if (
      payload.exp &&
      Date.now() >
        Number(payload.exp)
    ) {
      return null;
    }

    return payload;

  } catch {
    return null;
  }
}

function bearerToken(request) {
  const auth =
    request.headers.get(
      "Authorization"
    );

  if (!auth) {
    return "";
  }

  if (
    !auth
      .toLowerCase()
      .startsWith("bearer ")
  ) {
    return "";
  }

  return auth.slice(7).trim();
}


// =============================================================
// ZARINPAL CONFIG — PRODUCTION ONLY
// =============================================================

function zarinPalConfig() {
  return {
    sandbox: false,

    requestUrl:
      "https://api.zarinpal.com/pg/v4/payment/request.json",

    verifyUrl:
      "https://api.zarinpal.com/pg/v4/payment/verify.json",

    startPayUrl:
      "https://www.zarinpal.com/pg/StartPay/"
  };
}


// =============================================================
// DATABASE
// =============================================================

let dbReady = false;

async function migratePaymentsTable(env) {

  const tableInfo =
    await env.DB
      .prepare(
        `PRAGMA table_info(payments)`
      )
      .all();

  const columns =
    new Set(
      (
        tableInfo.results ||
        []
      ).map(
        row =>
          String(
            row.name ||
            ""
          )
      )
    );

  if (!columns.has("user_id")) {
    await env.DB
      .prepare(
        `ALTER TABLE payments ADD COLUMN user_id TEXT`
      )
      .run();
  }

  if (!columns.has("plan_id")) {
    await env.DB
      .prepare(
        `ALTER TABLE payments ADD COLUMN plan_id TEXT`
      )
      .run();
  }

  if (!columns.has("amount_toman")) {
    await env.DB
      .prepare(
        `ALTER TABLE payments ADD COLUMN amount_toman INTEGER`
      )
      .run();
  }

  if (!columns.has("authority")) {
    await env.DB
      .prepare(
        `ALTER TABLE payments ADD COLUMN authority TEXT`
      )
      .run();
  }

  if (!columns.has("status")) {
    await env.DB
      .prepare(
        `ALTER TABLE payments ADD COLUMN status TEXT DEFAULT 'pending'`
      )
      .run();
  }

  if (!columns.has("created_at")) {
    await env.DB
      .prepare(
        `ALTER TABLE payments ADD COLUMN created_at TEXT`
      )
      .run();
  }

  if (!columns.has("paid_at")) {
    await env.DB
      .prepare(
        `ALTER TABLE payments ADD COLUMN paid_at TEXT`
      )
      .run();
  }

  try {

    await env.DB
      .prepare(
        `UPDATE payments SET status = 'pending' WHERE status IS NULL`
      )
      .run();

  } catch (error) {

    console.error(
      "PAYMENTS STATUS MIGRATION ERROR:",
      error
    );
  }
}

async function initDatabase(env) {

  if (!env.DB) {
    throw new Error(
      "D1 binding DB تنظیم نشده است."
    );
  }

  if (dbReady) {
    return;
  }

  await env.DB
    .prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      balance INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `)
    .run();

  await env.DB
    .prepare(`
    CREATE TABLE IF NOT EXISTS plans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price_toman INTEGER NOT NULL,
      price_usd REAL NOT NULL,
      features TEXT NOT NULL
    )
  `)
    .run();

  await env.DB
    .prepare(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      starts_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active'
    )
  `)
    .run();

  await env.DB
    .prepare(`
    CREATE TABLE IF NOT EXISTS usage (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      usage_date TEXT NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      UNIQUE(user_id, usage_date)
    )
  `)
    .run();

  await env.DB
    .prepare(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `)
    .run();

  await env.DB
    .prepare(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      amount_toman INTEGER NOT NULL,
      authority TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      paid_at TEXT
    )
  `)
    .run();

  await migratePaymentsTable(env);

  await env.DB
    .prepare(`
    CREATE TABLE IF NOT EXISTS payments_v2 (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      amount_toman INTEGER NOT NULL,
      authority TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      paid_at TEXT
    )
  `)
    .run();

  await env.DB
    .prepare(`
    CREATE TABLE IF NOT EXISTS withdrawals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      method TEXT NOT NULL,
      destination TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      processed_at TEXT
    )
  `)
    .run();

  await env.DB
    .prepare(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL
    )
  `)
    .run();

  for (
    const id of Object.keys(PLAN_PRICES)
  ) {

    const exists =
      await env.DB
        .prepare(
          "SELECT id FROM plans WHERE id = ?"
        )
        .bind(id)
        .first();

    if (!exists) {

      await env.DB
        .prepare(`
        INSERT INTO plans
        (id,name,price_toman,price_usd,features)
        VALUES (?,?,?,?,?)
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

    } else {

      await env.DB
        .prepare(`
        UPDATE plans
        SET
          name = ?,
          price_toman = ?,
          price_usd = ?,
          features = ?
        WHERE id = ?
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
  }

  dbReady = true;
}

async function requireUser(
  request,
  env
) {
  const token =
    bearerToken(request);

  if (!token) {
    return null;
  }

  const payload =
    await verifyToken(
      token,
      getAuthSecret(env)
    );

  if (
    !payload ||
    !payload.userId
  ) {
    return null;
  }

  const user =
    await env.DB
      .prepare(
        `SELECT * FROM users WHERE id = ?`
      )
      .bind(payload.userId)
      .first();

  return user || null;
}

async function requireAdmin(
  request,
  env
) {
  const token =
    bearerToken(request);

  if (!token) {
    return false;
  }

  const payload =
    await verifyToken(
      token,
      getAuthSecret(env)
    );

  return !!(
    payload &&
    payload.admin === true
  );
}

function today() {
  return new Date()
    .toISOString()
    .slice(0, 10);
}

function addDays(days) {
  return new Date(
    Date.now() +
    days * 86400000
  ).toISOString();
}

async function getUsage(
  env,
  userId
) {
  const date =
    today();

  let row =
    await env.DB
      .prepare(`
      SELECT * FROM usage
      WHERE user_id = ? AND usage_date = ?
    `)
      .bind(
        userId,
        date
      )
      .first();

  if (!row) {

    try {

      await env.DB
        .prepare(`
        INSERT INTO usage
        (id,user_id,usage_date,used)
        VALUES (?,?,?,0)
      `)
        .bind(
          randomHex(16),
          userId,
          date
        )
        .run();

    } catch (error) {

      console.error(
        "USAGE INSERT:",
        error
      );
    }

    row =
      await env.DB
        .prepare(`
        SELECT * FROM usage
        WHERE user_id = ? AND usage_date = ?
      `)
        .bind(
          userId,
          date
        )
        .first();

    if (!row) {
      row = {
        used: 0
      };
    }
  }

  return row;
}

async function getSubscription(
  env,
  userId
) {
  return await env.DB
    .prepare(`
    SELECT
      s.*,
      p.id AS plan_id_real,
      p.name AS plan_name,
      p.price_toman,
      p.price_usd,
      p.features
    FROM subscriptions s
    LEFT JOIN plans p ON p.id = s.plan_id
    WHERE s.user_id = ?
      AND s.status = 'active'
      AND s.expires_at > ?
    ORDER BY s.expires_at DESC
    LIMIT 1
  `)
    .bind(
      userId,
      new Date().toISOString()
    )
    .first();
}

async function sendRecoveryEmail(
  env,
  email,
  code
) {
  if (!env.RESEND_API_KEY) {
    return {
      ok: false,
      status: 500,
      error:
        "سرویس ایمیل تنظیم نشده است (RESEND_API_KEY وجود ندارد)"
    };
  }

  const from =
    env.RESEND_FROM_EMAIL;

  if (!from) {
    return {
      ok: false,
      status: 500,
      error:
        "آدرس ارسال ایمیل تنظیم نشده است (RESEND_FROM_EMAIL وجود ندارد)"
    };
  }

  try {

    const response =
      await fetch(
        "https://api.resend.com/emails",
        {
          method: "POST",

          headers: {
            "Authorization":
              "Bearer " +
              env.RESEND_API_KEY,

            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({
              from,
              to: [email],

              subject:
                "کد بازیابی رمز عبور ابزارک",

              html: `
<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
</head>

<body
  style="
    margin:0;
    padding:30px;
    background:#f6f8ff;
    font-family:Tahoma,Arial,sans-serif;
    direction:rtl;
  "
>

<div
  style="
    max-width:560px;
    margin:auto;
    background:#ffffff;
    border-radius:20px;
    padding:30px;
    box-shadow:0 10px 40px rgba(15,23,42,.08);
  "
>

<h2 style="color:#1e1b4b;margin-top:0;">
  🔐 بازیابی رمز عبور ابزارک
</h2>

<p style="color:#475569;line-height:2;">
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
    color:#3730a3;
  "
>
  ${code}
</div>

<p style="color:#64748b;line-height:2;">
  این کد تا ۱۵ دقیقه معتبر است.
</p>

<p style="color:#64748b;line-height:2;">
  اگر این درخواست توسط شما انجام نشده است،
  این ایمیل را نادیده بگیرید.
</p>

<hr
  style="
    border:0;
    border-top:1px solid #e5e7eb;
    margin:25px 0;
  "
>

<div
  style="
    text-align:center;
    color:#64748b;
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

    if (!response.ok) {

      let details = "";

      try {
        details =
          await response.text();
      } catch {}

      return {
        ok: false,
        status:
          response.status,
        error:
          "ارسال ایمیل ناموفق بود",
        details
      };
    }

    return {
      ok: true
    };

  } catch (error) {

    return {
      ok: false,
      status: 502,
      error:
        "ارتباط با سرویس Resend ناموفق بود.",
      details:
        error?.message ||
        String(error)
    };
  }
}


async function signupApi(
  request,
  env
) {
  const body =
    await bodyJson(request);

  const name =
    String(
      body.name || ""
    ).trim();

  const email =
    String(
      body.email || ""
    )
      .trim()
      .toLowerCase();

  const password =
    String(
      body.password || ""
    );

  if (!name) {
    return json(
      {
        error:
          "نام را وارد کنید."
      },
      400
    );
  }

  if (!email) {
    return json(
      {
        error:
          "ایمیل را وارد کنید."
      },
      400
    );
  }

  if (
    !email.includes("@") ||
    !email.includes(".")
  ) {
    return json(
      {
        error:
          "ایمیل معتبر نیست."
      },
      400
    );
  }

  if (
    password.length < 6
  ) {
    return json(
      {
        error:
          "رمز عبور باید حداقل ۶ کاراکتر باشد."
      },
      400
    );
  }

  const existing =
    await env.DB
      .prepare(
        `SELECT id FROM users WHERE email = ?`
      )
      .bind(email)
      .first();

  if (existing) {
    return json(
      {
        error:
          "این ایمیل قبلاً ثبت شده است."
      },
      409
    );
  }

  const id =
    randomHex(16);

  const passwordHash =
    await hashPassword(password);

  await env.DB
    .prepare(`
    INSERT INTO users
    (id,name,email,password_hash,balance,created_at)
    VALUES (?,?,?,?,0,?)
  `)
    .bind(
      id,
      name,
      email,
      passwordHash,
      new Date().toISOString()
    )
    .run();

  const token =
    await createToken(
      {
        userId: id,
        exp:
          Date.now() +
          30 * 86400000
      },
      getAuthSecret(env)
    );

  return json({
    token
  });
}


async function loginApi(
  request,
  env
) {
  const body =
    await bodyJson(request);

  const email =
    String(
      body.email || ""
    )
      .trim()
      .toLowerCase();

  const password =
    String(
      body.password || ""
    );

  const user =
    await env.DB
      .prepare(
        `SELECT * FROM users WHERE email = ?`
      )
      .bind(email)
      .first();

  if (!user) {
    return json(
      {
        error:
          "ایمیل یا رمز عبور اشتباه است."
      },
      401
    );
  }

  const hash =
    await hashPassword(password);

  if (
    hash !==
    user.password_hash
  ) {
    return json(
      {
        error:
          "ایمیل یا رمز عبور اشتباه است."
      },
      401
    );
  }

  const token =
    await createToken(
      {
        userId: user.id,
        exp:
          Date.now() +
          30 * 86400000
      },
      getAuthSecret(env)
    );

  return json({
    token
  });
}


async function meApi(
  request,
  env
) {
  const user =
    await requireUser(
      request,
      env
    );

  if (!user) {
    return json(
      {
        error:
          "نشست نامعتبر است."
      },
      401
    );
  }

  let subscription = null;

  let usage = {
    used: 0
  };

  try {
    subscription =
      await getSubscription(
        env,
        user.id
      );
  } catch (error) {
    console.error(
      "ME SUBSCRIPTION ERROR:",
      error
    );
  }

  try {
    usage =
      await getUsage(
        env,
        user.id
      );
  } catch (error) {
    console.error(
      "ME USAGE ERROR:",
      error
    );
  }

  let subscriptionData = null;

  if (subscription) {

    let features = [];

    try {
      features =
        JSON.parse(
          subscription.features ||
          "[]"
        );
    } catch {
      features = [];
    }

    subscriptionData = {
      plan_id:
        subscription.plan_id,

      expires_at:
        subscription.expires_at,

      plan: {
        id:
          subscription.plan_id,

        name:
          subscription.plan_name,

        features
      }
    };
  }

  return json({
    user: {
      id:
        user.id,

      name:
        user.name,

      email:
        user.email,

      balance:
        Number(
          user.balance || 0
        )
    },

    subscription:
      subscriptionData,

    usage: {
      used:
        Number(
          usage?.used || 0
        ),

      limit:
        subscription
          ? 999999999
          : FREE_DAILY_LIMIT
    }
  });
}


async function forgotPasswordApi(
  request,
  env
) {
  const body =
    await bodyJson(request);

  const email =
    String(
      body.email || ""
    )
      .trim()
      .toLowerCase();

  if (!email) {
    return json(
      {
        error:
          "ایمیل را وارد کنید."
      },
      400
    );
  }

  const user =
    await env.DB
      .prepare(`
      SELECT id,email,name
      FROM users
      WHERE email = ?
    `)
      .bind(email)
      .first();

  if (!user) {
    return json({
      message:
        "اگر این ایمیل در ابزارک ثبت شده باشد، کد بازیابی ارسال خواهد شد."
    });
  }

  const code =
    randomCode();

  const codeHash =
    await hashPassword(code);

  const id =
    randomHex(16);

  await env.DB
    .prepare(`
    UPDATE password_resets
    SET used = 1
    WHERE user_id = ? AND used = 0
  `)
    .bind(user.id)
    .run();

  await env.DB
    .prepare(`
    INSERT INTO password_resets
    (id,user_id,code_hash,expires_at,used,created_at)
    VALUES (?,?,?,?,0,?)
  `)
    .bind(
      id,
      user.id,
      codeHash,
      new Date(
        Date.now() +
        15 * 60 * 1000
      ).toISOString(),
      new Date().toISOString()
    )
    .run();

  const mail =
    await sendRecoveryEmail(
      env,
      email,
      code
    );

  if (!mail.ok) {
    return json(
      {
        error:
          mail.error ||
          "ارسال ایمیل ناموفق بود.",

        details:
          mail.details ||
          undefined
      },
      mail.status || 500
    );
  }

  return json({
    message:
      "کد بازیابی به ایمیل شما ارسال شد."
  });
}


async function resetPasswordApi(
  request,
  env
) {
  const body =
    await bodyJson(request);

  const email =
    String(
      body.email || ""
    )
      .trim()
      .toLowerCase();

  const code =
    String(
      body.code || ""
    ).trim();

  const newPassword =
    String(
      body.newPassword || ""
    );

  if (
    !email ||
    !code
  ) {
    return json(
      {
        error:
          "ایمیل و کد بازیابی الزامی است."
      },
      400
    );
  }

  if (
    newPassword.length < 6
  ) {
    return json(
      {
        error:
          "رمز جدید باید حداقل ۶ کاراکتر باشد."
      },
      400
    );
  }

  const user =
    await env.DB
      .prepare(`
      SELECT id
      FROM users
      WHERE email = ?
    `)
      .bind(email)
      .first();

  if (!user) {
    return json(
      {
        error:
          "کد بازیابی معتبر نیست."
      },
      400
    );
  }

  const reset =
    await env.DB
      .prepare(`
      SELECT *
      FROM password_resets
      WHERE user_id = ? AND used = 0
      ORDER BY created_at DESC
      LIMIT 1
    `)
      .bind(user.id)
      .first();

  if (!reset) {
    return json(
      {
        error:
          "کد بازیابی معتبر نیست یا منقضی شده است."
      },
      400
    );
  }

  if (
    Date.now() >
    new Date(
      reset.expires_at
    ).getTime()
  ) {

    await env.DB
      .prepare(`
      UPDATE password_resets
      SET used = 1
      WHERE id = ?
    `)
      .bind(reset.id)
      .run();

    return json(
      {
        error:
          "کد بازیابی منقضی شده است."
      },
      400
    );
  }

  const codeHash =
    await hashPassword(code);

  if (
    codeHash !==
    reset.code_hash
  ) {
    return json(
      {
        error:
          "کد بازیابی اشتباه است."
      },
      400
    );
  }

  const passwordHash =
    await hashPassword(
      newPassword
    );

  await env.DB
    .prepare(`
    UPDATE users
    SET password_hash = ?
    WHERE id = ?
  `)
    .bind(
      passwordHash,
      user.id
    )
    .run();

  await env.DB
    .prepare(`
    UPDATE password_resets
    SET used = 1
    WHERE id = ?
  `)
    .bind(reset.id)
    .run();

  return json({
    message:
      "رمز عبور با موفقیت تغییر کرد."
  });
}


async function plansApi(env) {
  const plans =
    Object.keys(
      PLAN_PRICES
    )
      .map(
        id => ({
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
            Array.isArray(
              PLAN_FEATURES[id]
            )
              ? PLAN_FEATURES[id]
              : []
        })
      );

  return json({
    ok: true,
    plans,
    plans_usd: plans
  });
}


async function aiChatApi(
  request,
  env
) {
  const user =
    await requireUser(
      request,
      env
    );

  if (!user) {
    return json(
      {
        error:
          "برای استفاده از هوش مصنوعی وارد حساب شوید."
      },
      401
    );
  }

  const body =
    await bodyJson(request);

  const message =
    String(
      body.message || ""
    ).trim();

  if (!message) {
    return json(
      {
        error:
          "پیام خالی است."
      },
      400
    );
  }

  if (
    message.length > 12000
  ) {
    return json(
      {
        error:
          "پیام بیش از حد طولانی است."
      },
      400
    );
  }

  let history =
    Array.isArray(
      body.history
    )
      ? body.history
      : [];

  history =
    history
      .filter(
        item =>
          item &&
          (
            item.role === "user" ||
            item.role === "assistant"
          ) &&
          typeof item.content === "string" &&
          item.content.trim()
      )
      .slice(-20);

  let subscription = null;

  try {

    subscription =
      await env.DB
        .prepare(`
        SELECT
          id,
          plan_id,
          starts_at,
          expires_at,
          status
        FROM subscriptions
        WHERE user_id = ?
          AND status = 'active'
          AND expires_at > ?
        ORDER BY expires_at DESC
        LIMIT 1
      `)
        .bind(
          user.id,
          new Date().toISOString()
        )
        .first();

  } catch (error) {

    console.error(
      "AI SUBSCRIPTION CHECK ERROR:",
      error
    );

    subscription = null;
  }

  let usage = {
    used: 0
  };

  try {

    usage =
      await getUsage(
        env,
        user.id
      );

  } catch (error) {

    console.error(
      "AI USAGE ERROR:",
      error
    );

    try {

      await env.DB
        .prepare(`
        CREATE TABLE IF NOT EXISTS usage (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          usage_date TEXT NOT NULL,
          used INTEGER NOT NULL DEFAULT 0,
          UNIQUE(user_id, usage_date)
        )
      `)
        .run();

      usage =
        await getUsage(
          env,
          user.id
        );

    } catch (secondError) {

      console.error(
        "AI USAGE SECOND ERROR:",
        secondError
      );

      return json(
        {
          error:
            "خطا در بررسی سهمیه حساب.",
          details:
            secondError?.message ||
            String(secondError)
        },
        500
      );
    }
  }

  if (
    !subscription &&
    Number(
      usage?.used || 0
    ) >= FREE_DAILY_LIMIT
  ) {

    return json(
      {
        error:
          "سهمیه رایگان روزانه شما تمام شده است. برای ادامه یکی از پلن‌های اشتراک را انتخاب کنید.",
        upgrade_required:
          true
      },
      429
    );
  }

  if (!env.AI) {

    console.error(
      "ABZARAK AI BINDING IS MISSING"
    );

    return json(
      {
        error:
          "اتصال هوش مصنوعی در Worker تنظیم نشده است."
      },
      500
    );
  }

  const systemPrompt = `
تو «ابزارک AI» هستی؛ یک دستیار هوش مصنوعی حرفه‌ای، فارسی‌زبان و چندزبانه.

وظیفه تو این است که به کاربر پاسخ دقیق، طبیعی، مفید و کامل بدهی.

قوانین پاسخ‌دهی:

1. اگر کاربر فارسی صحبت می‌کند، پاسخ را فارسی و روان بده.

2. اگر کاربر انگلیسی یا زبان دیگری استفاده کرد، تا حد امکان به همان زبان پاسخ بده.

3. پاسخ‌ها را فقط در یک جمله کوتاه خلاصه نکن. اگر سؤال نیاز به توضیح دارد، توضیح کامل بده.

4. برای سؤال‌های آموزشی، مرحله‌به‌مرحله توضیح بده.

5. برای درخواست‌های نوشتاری، متن آماده و قابل استفاده تولید کن.

6. برای ترجمه، ترجمه طبیعی و دقیق ارائه کن و معنی را بی‌دلیل تغییر نده.

7. برای ایده‌پردازی، چند ایده کاربردی ارائه کن.

8. اگر کاربر سؤال چندبخشی پرسید، به همه بخش‌ها پاسخ بده.

9. اگر اطلاعات کافی برای پاسخ وجود ندارد، سؤال کوتاه و مشخصی برای روشن شدن موضوع بپرس.

10. از تکرار بی‌دلیل حرف‌های کاربر خودداری کن.

11. پاسخ‌ها را مرتب و خوانا بنویس.

12. در پاسخ‌های طولانی از عنوان، شماره‌گذاری و فهرست استفاده کن.

13. لحن دوستانه، حرفه‌ای و کمک‌کننده داشته باش.

14. ادعاهای ساختگی یا اطلاعاتی که از آن مطمئن نیستی را به‌عنوان حقیقت قطعی بیان نکن.

15. اگر کاربر فقط سلام کرد، دوستانه پاسخ بده و آماده کمک باش.

16. مکالمه را بر اساس پیام‌های قبلی ادامه بده و ارتباط بین سؤال‌های کاربر را حفظ کن.

17. اگر کاربر گفت «ادامه بده»، «کوتاه‌ترش کن»، «بیشتر توضیح بده»، «اصلاحش کن»، «بهترش کن»، «همین را تغییر بده» یا عبارت مشابه، منظور را با توجه به مکالمه قبلی درک کن.

18. اگر کاربر درخواست متن، تبلیغ، ایمیل، کپشن، توضیح محصول یا متن قابل انتشار کرد، متن کامل و آماده استفاده تولید کن.

19. اگر کاربر سؤال فنی یا برنامه‌نویسی پرسید، تا حد امکان راه‌حل عملی و قابل اجرا ارائه بده.

20. اگر کاربر درخواست محاسبه یا مقایسه کرد، اطلاعات را منظم و واضح ارائه کن.

21. هدف تو کمک واقعی به کاربر است، نه صرفاً تولید یک پاسخ کوتاه.

22. پاسخ را متناسب با سؤال کاربر تولید کن و از پاسخ‌های کلی و تکراری خودداری کن.
`;

  const messages = [
    {
      role: "system",
      content: systemPrompt
    }
  ];

  for (
    const item of history
  ) {
    messages.push({
      role: item.role,
      content: item.content
    });
  }

  messages.push({
    role: "user",
    content: message
  });

  let result;

  try {

    result =
      await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct-fast",
        {
          messages,
          max_tokens: 1200,
          temperature: 0.7
        }
      );

  } catch (error) {

    console.error(
      "ABZARAK AI PROVIDER ERROR:",
      error
    );

    return json(
      {
        error:
          "ارتباط با سرویس هوش مصنوعی برقرار نشد.",
        details:
          error?.message ||
          String(error)
      },
      500
    );
  }

  let reply = "";

  if (
    typeof result === "string"
  ) {
    reply = result;

  } else if (
    result &&
    typeof result.response === "string"
  ) {
    reply =
      result.response;

  } else if (
    result &&
    typeof result.result === "string"
  ) {
    reply =
      result.result;

  } else if (
    result &&
    result.result &&
    typeof result.result.response === "string"
  ) {
    reply =
      result.result.response;

  } else {

    console.error(
      "ABZARAK AI UNKNOWN RESPONSE:",
      JSON.stringify(result)
    );
  }

  reply =
    String(
      reply || ""
    ).trim();

  if (!reply) {
    return json(
      {
        error:
          "هوش مصنوعی پاسخی تولید نکرد."
      },
      502
    );
  }

  if (!subscription) {

    try {

      await env.DB
        .prepare(`
        UPDATE usage
        SET used = used + 1
        WHERE user_id = ?
          AND usage_date = ?
      `)
        .bind(
          user.id,
          today()
        )
        .run();

    } catch (error) {

      console.error(
        "USAGE UPDATE ERROR:",
        error
      );
    }
  }

  return json({
    ok: true,
    reply,

    usage: {
      used:
        Number(
          usage?.used || 0
        ) +
        (
          subscription
            ? 0
            : 1
        ),

      limit:
        subscription
          ? 999999999
          : FREE_DAILY_LIMIT
    }
  });
}


// =============================================================
// PAYMENT HELPERS
// =============================================================

async function markPaymentFailed(
  env,
  paymentId,
  label
) {
  try {

    await env.DB
      .prepare(`
      UPDATE payments_v2
      SET status = 'failed'
      WHERE id = ?
        AND status = 'pending'
    `)
      .bind(paymentId)
      .run();

  } catch (updateError) {

    console.error(
      label,
      updateError
    );
  }
}

function extractZarinPalError(data) {
  let code = null;
  let message = "";

  const errors =
    data?.errors;

  if (
    errors &&
    !Array.isArray(errors)
  ) {

    if (
      errors.code !== undefined
    ) {
      code =
        errors.code;
    }

    if (
      errors.message
    ) {
      message =
        String(
          errors.message
        );
    }
  }

  if (
    Array.isArray(errors) &&
    errors.length
  ) {

    const first =
      errors[0];

    if (
      first &&
      first.code !== undefined
    ) {
      code =
        first.code;
    }

    if (
      first &&
      first.message
    ) {
      message =
        String(
          first.message
        );
    }
  }

  if (
    !message &&
    data?.message
  ) {
    message =
      String(
        data.message
      );
  }

  const validationMessage =
    Array.isArray(
      errors?.validations
    )
      ? errors.validations
          .map(
            x =>
              typeof x === "string"
                ? x
                : x?.message ||
                  x?.error ||
                  ""
          )
          .filter(Boolean)
          .join(" | ")
      : "";

  if (validationMessage) {
    message =
      message
        ? message +
          " | " +
          validationMessage
        : validationMessage;
  }

  return {
    code,
    message
  };
}


// =============================================================
// ZARINPAL PAYMENT REQUEST — PRODUCTION
// =============================================================

async function paymentRequestApi(
  request,
  env
) {
  try {

    const user =
      await requireUser(
        request,
        env
      );

    if (!user) {
      return json(
        {
          error:
            "برای خرید ابتدا وارد حساب شوید."
        },
        401
      );
    }

    const body =
      await bodyJson(request);

    const planId =
      String(
        body.planId || ""
      ).trim();

    if (
      !Object.prototype.hasOwnProperty.call(
        PLAN_PRICES,
        planId
      )
    ) {
      return json(
        {
          error:
            "پلن انتخاب‌شده معتبر نیست."
        },
        400
      );
    }

    const amountToman =
      Number(
        PLAN_PRICES[planId]
      );

    if (
      !Number.isSafeInteger(
        amountToman
      ) ||
      amountToman <= 0
    ) {
      return json(
        {
          error:
            "مبلغ پلن معتبر نیست."
        },
        400
      );
    }

    const merchantId =
      String(
        env.ZARINPAL_MERCHANT_ID ||
        ""
      ).trim();

    if (!merchantId) {
      return json(
        {
          error:
            "کد درگاه زرین‌پال در Worker تنظیم نشده است."
        },
        503
      );
    }

    const zp =
      zarinPalConfig();

    const paymentId =
      randomHex(16);

    const createdAt =
      new Date().toISOString();

    try {

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
        VALUES
        (
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

    } catch (dbError) {

      console.error(
        "PAYMENT V2 DB INSERT ERROR:",
        dbError
      );

      return json(
        {
          error:
            "ثبت درخواست پرداخت در پایگاه داده انجام نشد.",
          details:
            dbError?.message ||
            String(dbError)
        },
        500
      );
    }

    const baseUrl =
      String(
        env.PUBLIC_BASE_URL ||
        "https://abzarakai.ir"
      ).replace(
        /\/+$/,
        ""
      );

    const callback =
      baseUrl +
      "/api/payment/verify?payment_id=" +
      encodeURIComponent(
        paymentId
      );

    const amountRial =
      amountToman * 10;

    if (
      !Number.isSafeInteger(
        amountRial
      ) ||
      amountRial <= 0
    ) {

      await markPaymentFailed(
        env,
        paymentId,
        "PAYMENT INVALID RIAL AMOUNT UPDATE ERROR:"
      );

      return json(
        {
          error:
            "مبلغ ریالی پرداخت معتبر نیست."
        },
        400
      );
    }

    const payload = {
      merchant_id:
        merchantId,

      amount:
        amountRial,

      description:
        "Abzarak AI - " +
        PLAN_NAMES[planId],

      callback_url:
        callback,

      metadata: {
        email:
          String(
            user.email || ""
          )
      }
    };

    console.log(
      "ZARINPAL PAYMENT REQUEST:",
      JSON.stringify({
        mode:
          "production",

        endpoint:
          zp.requestUrl,

        merchant_id:
          merchantId,

        amount_rial:
          amountRial,

        plan_id:
          planId,

        payment_id:
          paymentId,

        callback_url:
          callback
      })
    );

    let response;

    try {

      response =
        await fetch(
          zp.requestUrl,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              "Accept":
                "application/json",

              "User-Agent":
                "AbzarakAI-ZarinPal-v4"
            },

            body:
              JSON.stringify(payload)
          }
        );

    } catch (networkError) {

      console.error(
        "ZARINPAL NETWORK ERROR:",
        networkError
      );

      await markPaymentFailed(
        env,
        paymentId,
        "PAYMENT V2 NETWORK FAILURE UPDATE ERROR:"
      );

      return json(
        {
          error:
            "ارتباط با درگاه زرین‌پال برقرار نشد.",

          details:
            networkError?.message ||
            String(networkError)
        },
        502
      );
    }

    const rawResponse =
      await response.text();

    console.log(
      "ZARINPAL PAYMENT RAW RESPONSE:",
      rawResponse
    );

    let data = {};

    try {

      data =
        rawResponse
          ? JSON.parse(rawResponse)
          : {};

    } catch (parseError) {

      console.error(
        "ZARINPAL INVALID JSON:",
        parseError
      );

      await markPaymentFailed(
        env,
        paymentId,
        "PAYMENT V2 INVALID JSON UPDATE ERROR:"
      );

      const preview =
        String(
          rawResponse || ""
        )
          .replace(
            /\s+/g,
            " "
          )
          .slice(
            0,
            500
          );

      return json(
        {
          error:
            "پاسخ زرین‌پال JSON معتبر نبود.",

          http_status:
            response.status,

          details:
            preview ||
            "بدنه پاسخ خالی بود."
        },
        502
      );
    }

    const gatewayCode =
      data?.data?.code;

    const authority =
      data?.data?.authority;

    const errorInfo =
      extractZarinPalError(data);

    const isSuccess =
      Number(gatewayCode) === 100 &&
      !!authority;

    if (
      !response.ok ||
      !isSuccess
    ) {

      await markPaymentFailed(
        env,
        paymentId,
        "PAYMENT V2 GATEWAY FAILURE UPDATE ERROR:"
      );

      const fallbackMessage =
        response.status >= 400
          ? (
              "خطای زرین‌پال (HTTP " +
              response.status +
              ")"
            )
          : "ایجاد درخواست پرداخت در زرین‌پال ناموفق بود.";

      const finalMessage =
        errorInfo.message ||
        fallbackMessage;

      console.error(
        "ZARINPAL PAYMENT FAILURE:",
        JSON.stringify({
          http_status:
            response.status,

          gateway_code:
            errorInfo.code ??
            gatewayCode ??
            null,

          message:
            finalMessage,

          raw:
            rawResponse
        })
      );

      return json(
        {
          error:
            finalMessage,

          gateway_code:
            errorInfo.code ??
            gatewayCode ??
            null,

          http_status:
            response.status,

          details:
            rawResponse
              ? String(
                  rawResponse
                ).slice(
                  0,
                  1000
                )
              : ""
        },
        502
      );
    }

    try {

      await env.DB
        .prepare(`
        UPDATE payments_v2
        SET authority = ?
        WHERE id = ?
      `)
        .bind(
          String(authority),
          paymentId
        )
        .run();

    } catch (dbError) {

      console.error(
        "PAYMENT V2 AUTHORITY SAVE ERROR:",
        dbError
      );

      await markPaymentFailed(
        env,
        paymentId,
        "PAYMENT V2 AUTHORITY SAVE FAILURE:"
      );

      return json(
        {
          error:
            "شناسه پرداخت دریافت شد اما ذخیره آن ناموفق بود.",

          details:
            dbError?.message ||
            String(dbError)
        },
        500
      );
    }

    const paymentUrl =
      zp.startPayUrl +
      encodeURIComponent(
        String(authority)
      );

    console.log(
      "ZARINPAL PAYMENT SUCCESS:",
      JSON.stringify({
        payment_id:
          paymentId,

        authority:
          String(authority),

        plan_id:
          planId,

        amount_toman:
          amountToman,

        amount_rial:
          amountRial,

        mode:
          "production"
      })
    );

    return json({
      ok: true,

      payment_url:
        paymentUrl,

      payment_id:
        paymentId,

      authority:
        String(authority)
    });

  } catch (error) {

    console.error(
      "PAYMENT REQUEST UNHANDLED ERROR:",
      error
    );

    return json(
      {
        error:
          "خطای داخلی در ایجاد درخواست پرداخت.",

        details:
          error?.message ||
          String(error)
      },
      500
    );
  }
}


// =============================================================
// ZARINPAL VERIFY — PRODUCTION
// =============================================================

async function paymentVerifyApi(
  request,
  env
) {
  const url =
    new URL(request.url);

  const paymentId =
    url.searchParams.get(
      "payment_id"
    );

  const authority =
    url.searchParams.get(
      "Authority"
    );

  const status =
    String(
      url.searchParams.get(
        "Status"
      ) ||
      ""
    )
      .trim()
      .toUpperCase();

  const redirect =
    p =>
      Response.redirect(
        new URL(
          p,
          request.url
        ).toString(),
        302
      );

  if (!paymentId) {
    return redirect(
      "/?payment=error"
    );
  }

  const payment =
    await env.DB
      .prepare(`
        SELECT *
        FROM payments_v2
        WHERE id = ?
      `)
      .bind(paymentId)
      .first();

  if (!payment) {
    return redirect(
      "/?payment=error&reason=payment-not-found"
    );
  }

  if (
    payment.status ===
    "paid"
  ) {
    return redirect(
      "/?payment=success"
    );
  }

  if (
    status !== "OK" ||
    !authority
  ) {

    try {

      await env.DB
        .prepare(`
        UPDATE payments_v2
        SET status = 'cancelled'
        WHERE id = ?
          AND status = 'pending'
      `)
        .bind(paymentId)
        .run();

    } catch (error) {

      console.error(
        "PAYMENT V2 CANCEL UPDATE ERROR:",
        error
      );
    }

    return redirect(
      "/?payment=cancel"
    );
  }

  const merchantId =
    String(
      env.ZARINPAL_MERCHANT_ID ||
      ""
    ).trim();

  if (!merchantId) {
    return redirect(
      "/?payment=error&reason=merchant-not-configured"
    );
  }

  if (
    payment.authority &&
    String(
      payment.authority
    ) !==
    String(authority)
  ) {

    console.error(
      "ZARINPAL AUTHORITY MISMATCH:",
      JSON.stringify({
        payment_id:
          paymentId,

        stored:
          payment.authority,

        received:
          authority
      })
    );

    return redirect(
      "/?payment=error&reason=authority-mismatch"
    );
  }

  const amountToman =
    Number(
      payment.amount_toman
    );

  if (
    !Number.isSafeInteger(
      amountToman
    ) ||
    amountToman <= 0
  ) {
    return redirect(
      "/?payment=error&reason=invalid-amount"
    );
  }

  const amountRial =
    amountToman * 10;

  if (
    !Number.isSafeInteger(
      amountRial
    ) ||
    amountRial <= 0
  ) {
    return redirect(
      "/?payment=error&reason=invalid-rial-amount"
    );
  }

  const zp =
    zarinPalConfig();

  console.log(
    "ZARINPAL VERIFY REQUEST:",
    JSON.stringify({
      mode:
        "production",

      endpoint:
        zp.verifyUrl,

      payment_id:
        paymentId,

      authority:
        String(authority),

      amount_rial:
        amountRial,

      merchant_id:
        merchantId
    })
  );

  try {

    const response =
      await fetch(
        zp.verifyUrl,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            "Accept":
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
                String(authority)
            })
        }
      );

    const rawResponse =
      await response.text();

    console.log(
      "ZARINPAL VERIFY RAW RESPONSE:",
      rawResponse
    );

    let data = {};

    try {

      data =
        rawResponse
          ? JSON.parse(
              rawResponse
            )
          : {};

    } catch (parseError) {

      console.error(
        "ZARINPAL VERIFY INVALID JSON:",
        parseError
      );

      return redirect(
        "/?payment=error&reason=invalid-gateway-response"
      );
    }

    const code =
      Number(
        data?.data?.code
      );

    const refId =
      data?.data?.ref_id;

    const verifyError =
      extractZarinPalError(
        data
      );

    if (
      !response.ok ||
      (
        code !== 100 &&
        code !== 101
      )
    ) {

      await markPaymentFailed(
        env,
        paymentId,
        "PAYMENT V2 VERIFY FAILED UPDATE ERROR:"
      );

      console.error(
        "ZARINPAL VERIFY FAILURE:",
        JSON.stringify({
          http_status:
            response.status,

          code,

          error_code:
            verifyError.code,

          error_message:
            verifyError.message,

          ref_id:
            refId,

          raw:
            rawResponse
        })
      );

      return redirect(
        "/?payment=failed"
      );
    }

    const existingSubscription =
      await env.DB
        .prepare(`
        SELECT
          id,
          expires_at
        FROM subscriptions
        WHERE user_id = ?
          AND plan_id = ?
          AND status = 'active'
          AND expires_at > ?
        ORDER BY expires_at DESC
        LIMIT 1
      `)
        .bind(
          payment.user_id,
          payment.plan_id,
          new Date().toISOString()
        )
        .first();

    if (
      existingSubscription
    ) {

      const currentExpiry =
        new Date(
          existingSubscription.expires_at
        );

      const baseTime =
        Math.max(
          currentExpiry.getTime(),
          Date.now()
        );

      const newExpiry =
        new Date(
          baseTime +
          30 * 86400000
        ).toISOString();

      await env.DB
        .prepare(`
        UPDATE subscriptions
        SET expires_at = ?
        WHERE id = ?
      `)
        .bind(
          newExpiry,
          existingSubscription.id
        )
        .run();

    } else {

      await env.DB
        .prepare(`
        INSERT INTO subscriptions
        (
          id,
          user_id,
          plan_id,
          starts_at,
          expires_at,
          status
        )
        VALUES
        (
          ?,
          ?,
          ?,
          ?,
          ?,
          'active'
        )
      `)
        .bind(
          randomHex(16),
          payment.user_id,
          payment.plan_id,
          new Date().toISOString(),
          addDays(30)
        )
        .run();
    }

    await env.DB
      .prepare(`
      UPDATE payments_v2
      SET
        status = 'paid',
        authority = ?,
        paid_at = ?
      WHERE id = ?
        AND status != 'paid'
    `)
      .bind(
        String(authority),
        new Date().toISOString(),
        paymentId
      )
      .run();

    console.log(
      "ZARINPAL VERIFY SUCCESS:",
      JSON.stringify({
        payment_id:
          paymentId,

        authority:
          String(authority),

        ref_id:
          refId ?? null,

        plan_id:
          payment.plan_id
      })
    );

    return redirect(
      "/?payment=success"
    );

  } catch (error) {

    console.error(
      "PAYMENT VERIFY ERROR:",
      error
    );

    return redirect(
      "/?payment=error&reason=verify-error"
    );
  }
}


// =============================================================
// WITHDRAWALS
// =============================================================

async function withdrawalApi(
  request,
  env
) {
  const user =
    await requireUser(
      request,
      env
    );

  if (!user) {
    return json(
      {
        error:
          "برای برداشت وارد حساب شوید."
      },
      401
    );
  }

  const body =
    await bodyJson(request);

  const amount =
    Number(
      body.amount || 0
    );

  const method =
    String(
      body.method || "bank"
    );

  const destination =
    String(
      body.destination || ""
    ).trim();

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return json(
      {
        error:
          "مبلغ برداشت معتبر نیست."
      },
      400
    );
  }

  if (!destination) {
    return json(
      {
        error:
          "مقصد برداشت را وارد کنید."
      },
      400
    );
  }

  if (
    amount >
    Number(
      user.balance || 0
    )
  ) {
    return json(
      {
        error:
          "موجودی کافی نیست."
      },
      400
    );
  }

  const withdrawalId =
    randomHex(16);

  const result =
    await env.DB
      .prepare(`
      UPDATE users
      SET balance = balance - ?
      WHERE id = ?
        AND balance >= ?
    `)
      .bind(
        amount,
        user.id,
        amount
      )
      .run();

  if (
    !result.meta ||
    result.meta.changes !== 1
  ) {
    return json(
      {
        error:
          "موجودی کافی نیست."
      },
      400
    );
  }

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
    VALUES
    (
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
      withdrawalId,
      user.id,
      amount,
      method,
      destination,
      new Date().toISOString()
    )
    .run();

  return json({
    message:
      "درخواست برداشت ثبت شد."
  });
}


async function myWithdrawalsApi(
  request,
  env
) {
  const user =
    await requireUser(
      request,
      env
    );

  if (!user) {
    return json(
      {
        error:
          "نشست نامعتبر است."
      },
      401
    );
  }

  const rows =
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
      WHERE user_id = ?
      ORDER BY created_at DESC
    `)
      .bind(user.id)
      .all();

  return json({
    withdrawals:
      rows.results || []
  });
}


// =============================================================
// ADMIN
// =============================================================

async function adminLoginApi(
  request,
  env
) {
  const body =
    await bodyJson(request);

  const password =
    String(
      body.password || ""
    );

  if (!env.ADMIN_PASSWORD) {
    return json(
      {
        error:
          "ADMIN_PASSWORD در Worker تنظیم نشده است."
      },
      500
    );
  }

  if (
    password !==
    env.ADMIN_PASSWORD
  ) {
    return json(
      {
        error:
          "رمز مدیریت اشتباه است."
      },
      401
    );
  }

  const token =
    await createToken(
      {
        admin: true,
        exp:
          Date.now() +
          12 * 60 * 60 * 1000
      },
      getAuthSecret(env)
    );

  return json({
    token
  });
}


async function adminUsersApi(
  request,
  env
) {
  if (
    !(await requireAdmin(
      request,
      env
    ))
  ) {
    return json(
      {
        error:
          "دسترسی غیرمجاز."
      },
      403
    );
  }

  const rows =
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
      rows.results || []
  });
}


async function adminPaymentsApi(
  request,
  env
) {
  if (
    !(await requireAdmin(
      request,
      env
    ))
  ) {
    return json(
      {
        error:
          "دسترسی غیرمجاز."
      },
      403
    );
  }

  const rows =
    await env.DB
      .prepare(`
      SELECT
        p.*,
        u.email
      FROM payments_v2 p
      LEFT JOIN users u
        ON u.id = p.user_id
      ORDER BY p.created_at DESC
    `)
      .all();

  return json({
    payments:
      (
        rows.results || []
      ).map(
        x => ({
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
) {
  if (
    !(await requireAdmin(
      request,
      env
    ))
  ) {
    return json(
      {
        error:
          "دسترسی غیرمجاز."
      },
      403
    );
  }

  const rows =
    await env.DB
      .prepare(`
      SELECT
        w.*,
        u.email
      FROM withdrawals w
      LEFT JOIN users u
        ON u.id = w.user_id
      ORDER BY w.created_at DESC
    `)
      .all();

  return json({
    withdrawals:
      rows.results || []
  });
}


async function adminProcessWithdrawalApi(
  request,
  env
) {
  if (
    !(await requireAdmin(
      request,
      env
    ))
  ) {
    return json(
      {
        error:
          "دسترسی غیرمجاز."
      },
      403
    );
  }

  const body =
    await bodyJson(request);

  const id =
    String(
      body.id || ""
    );

  const action =
    String(
      body.action || ""
    );

  if (
    !id ||
    ![
      "paid",
      "rejected"
    ].includes(action)
  ) {
    return json(
      {
        error:
          "عملیات نامعتبر است."
      },
      400
    );
  }

  const withdrawal =
    await env.DB
      .prepare(`
      SELECT *
      FROM withdrawals
      WHERE id = ?
    `)
      .bind(id)
      .first();

  if (!withdrawal) {
    return json(
      {
        error:
          "درخواست برداشت پیدا نشد."
      },
      404
    );
  }

  if (
    withdrawal.status !==
    "pending"
  ) {
    return json(
      {
        error:
          "این درخواست قبلاً پردازش شده است."
      },
      400
    );
  }

  if (
    action === "rejected"
  ) {

    await env.DB
      .prepare(`
      UPDATE users
      SET balance = balance + ?
      WHERE id = ?
    `)
      .bind(
        withdrawal.amount,
        withdrawal.user_id
      )
      .run();
  }

  await env.DB
    .prepare(`
    UPDATE withdrawals
    SET
      status = ?,
      processed_at = ?
    WHERE id = ?
  `)
    .bind(
      action,
      new Date().toISOString(),
      id
    )
    .run();

  return json({
    message:
      action === "paid"
        ? "برداشت پرداخت شد."
        : "درخواست برداشت رد شد و مبلغ به موجودی برگشت."
  });
}


// =============================================================
// HEALTH
// =============================================================

async function healthApi(env) {
  return json({
    ok: true,

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
  ) {

    try {

      if (
        request.method ===
        "OPTIONS"
      ) {

        return cors(
          new Response(
            null,
            {
              status: 204
            }
          )
        );
      }

      const url =
        new URL(
          request.url
        );

      const path =
        url.pathname;

      const m =
        request.method;


      // =======================================================
      // ENAMAD FILE VERIFICATION
      // =======================================================

      if (
        path ===
        "/17726638.txt"
      ) {

        return cors(
          plainText(
            "17726638"
          )
        );
      }


      // =======================================================
      // ROBOTS
      // =======================================================

      if (
        path ===
        "/robots.txt"
      ) {

        return cors(
          robotsTxt()
        );
      }


      // =======================================================
      // SITEMAP
      // =======================================================

      if (
        path ===
        "/sitemap.xml"
      ) {

        return cors(
          xml(
            sitemapXml()
          )
        );
      }


      // =======================================================
      // OLD SEO URL -> NEW /content URL
      // =======================================================

      if (
        path ===
          "/content-ai" &&
        m ===
          "GET"
      ) {

        return Response.redirect(
          new URL(
            "/content",
            request.url
          ).toString(),
          301
        );
      }


      // =======================================================
      // FAQ PAGE
      // =======================================================

      if (
        path ===
          "/faq" &&
        m ===
          "GET"
      ) {

        return cors(
          html(
            renderFaqPage()
          )
        );
      }


      // =======================================================
      // SEO LANDING PAGES
      // =======================================================

      if (
        SEO_PAGES[path] &&
        m ===
          "GET"
      ) {

        return cors(
          html(
            renderSeoPage(
              path,
              SEO_PAGES[path]
            )
          )
        );
      }


      // =======================================================
      // DATABASE INIT
      // =======================================================

      try {

        await initDatabase(
          env
        );

      } catch (dbInitError) {

        console.error(
          "DB INIT ERROR:",
          dbInitError
        );
      }

      let response;


      // =======================================================
      // API ROUTES
      // =======================================================

      if (
        path ===
        "/health"
      ) {

        response =
          await healthApi(
            env
          );

      } else if (
        path ===
          "/api/signup" &&
        m ===
          "POST"
      ) {

        response =
          await signupApi(
            request,
            env
          );

      } else if (
        path ===
          "/api/login" &&
        m ===
          "POST"
      ) {

        response =
          await loginApi(
            request,
            env
          );

      } else if (
        path ===
          "/api/me" &&
        m ===
          "GET"
      ) {

        response =
          await meApi(
            request,
            env
          );

      } else if (
        path ===
          "/api/forgot-password" &&
        m ===
          "POST"
      ) {

        response =
          await forgotPasswordApi(
            request,
            env
          );

      } else if (
        path ===
          "/api/reset-password" &&
        m ===
          "POST"
      ) {

        response =
          await resetPasswordApi(
            request,
            env
          );

      } else if (
        path ===
          "/api/ai/chat" &&
        m ===
          "POST"
      ) {

        response =
          await aiChatApi(
            request,
            env
          );

      } else if (
        path ===
          "/api/plans" &&
        m ===
          "GET"
      ) {

        response =
          await plansApi(
            env
          );

      } else if (
        path ===
          "/api/payment/request" &&
        m ===
          "POST"
      ) {

        response =
          await paymentRequestApi(
            request,
            env
          );

      } else if (
        path ===
          "/api/payment/verify" &&
        m ===
          "GET"
      ) {

        response =
          await paymentVerifyApi(
            request,
            env
          );

      } else if (
        path ===
          "/api/withdrawal" &&
        m ===
          "POST"
      ) {

        response =
          await withdrawalApi(
            request,
            env
          );

      } else if (
        path ===
          "/api/my-withdrawals" &&
        m ===
          "GET"
      ) {

        response =
          await myWithdrawalsApi(
            request,
            env
          );

      } else if (
        path ===
          "/api/admin/login" &&
        m ===
          "POST"
      ) {

        response =
          await adminLoginApi(
            request,
            env
          );

      } else if (
        path ===
          "/api/admin/users" &&
        m ===
          "GET"
      ) {

        response =
          await adminUsersApi(
            request,
            env
          );

      } else if (
        path ===
          "/api/admin/payments" &&
        m ===
          "GET"
      ) {

        response =
          await adminPaymentsApi(
            request,
            env
          );

      } else if (
        path ===
          "/api/admin/withdrawals" &&
        m ===
          "GET"
      ) {

        response =
          await adminWithdrawalsApi(
            request,
            env
          );

      } else if (
        path ===
          "/api/admin/withdrawals/process" &&
        m ===
          "POST"
      ) {

        response =
          await adminProcessWithdrawalApi(
            request,
            env
          );

      } else if (
        (
          path ===
          "/" ||
          path ===
          "/index.html"
        ) &&
        m ===
          "GET"
      ) {

        response =
          html(
            renderHomepage()
          );

      } else {

        response =
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

    } catch (error) {

      console.error(
        "WORKER ERROR:",
        error
      );

      return cors(
        json(
          {
            error:
              "خطای داخلی سرور.",

            details:
              error?.message ||
              String(error)
          },
          500
        )
      );
    }
  }
};
