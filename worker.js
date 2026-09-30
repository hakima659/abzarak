// =============================================================
// ABZARAK AI — HOMEPAGE + BACKEND API + SEO PAGES
// Production ZarinPal
// /content SEO route fixed
// Enamad logo removed from footer
// SEO landing pages + FAQ + Sitemap + Robots
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
// SEO DATA
// =============================================================

const SEO_PAGES = {
  "/chat-ai": {
    title: "چت با هوش مصنوعی فارسی | ابزارک AI",
    description: "چت آنلاین با هوش مصنوعی فارسی ابزارک برای پاسخ به سؤال‌ها، آموزش، گفتگو، ایده‌پردازی و کارهای روزمره.",
    h1: "چت با هوش مصنوعی فارسی",
    intro: "با ابزارک AI به زبان فارسی با یک دستیار هوشمند گفتگو کن. سؤال بپرس، جواب بگیر، ایده پیدا کن و کارهای نوشتاری خودت را سریع‌تر انجام بده.",
    imageTitle: "چت هوشمند فارسی",
    imageEmoji: "🤖",
    sections: [
      {
        title: "چت هوشمند فارسی",
        text: "ابزارک برای گفتگو به زبان فارسی طراحی شده و می‌تواند در پاسخ به پرسش‌ها، توضیح مفاهیم، آموزش و کارهای روزمره به شما کمک کند."
      },
      {
        title: "با ابزارک چه کارهایی می‌توانی انجام دهی؟",
        text: "از دستیار هوشمند برای کارهای مختلف استفاده کن.",
        bullets: [
          "پاسخ به سؤال‌های عمومی",
          "کمک در یادگیری و آموزش",
          "ایده‌پردازی",
          "تولید و بازنویسی متن",
          "ترجمه و خلاصه‌سازی",
          "کمک در برنامه‌نویسی"
        ]
      }
    ]
  },

  "/content": {
    title: "تولید محتوا با هوش مصنوعی | ابزارک AI",
    description: "تولید محتوا با هوش مصنوعی فارسی برای مقاله، کپشن، توضیحات محصول، متن تبلیغاتی و محتوای شبکه‌های اجتماعی.",
    h1: "تولید محتوا با هوش مصنوعی",
    intro: "با ابزارک AI برای مقاله، شبکه‌های اجتماعی، توضیحات محصول و متن‌های تبلیغاتی ایده و محتوای قابل استفاده تولید کن.",
    imageTitle: "تولید محتوای هوشمند",
    imageEmoji: "✍️",
    sections: [
      {
        title: "تولید سریع محتوای متنی",
        text: "ابزارک می‌تواند به شما در نوشتن متن‌های مختلف کمک کند و برای شروع یک محتوای جدید ایده و ساختار پیشنهاد دهد."
      },
      {
        title: "کاربردهای تولید محتوا",
        text: "برای انواع محتوای دیجیتال می‌توانی از ابزارک کمک بگیری.",
        bullets: [
          "مقاله و محتوای وب",
          "کپشن شبکه‌های اجتماعی",
          "توضیحات محصول",
          "متن تبلیغاتی",
          "عنوان و تیتر",
          "ایده برای محتوای جدید"
        ]
      }
    ]
  },

  "/translate-ai": {
    title: "ترجمه با هوش مصنوعی | ابزارک AI",
    description: "ترجمه و بازنویسی متن با هوش مصنوعی فارسی ابزارک برای زبان‌های مختلف.",
    h1: "ترجمه با هوش مصنوعی",
    intro: "متن خودت را برای ترجمه یا بازنویسی به ابزارک بده و یک پاسخ روان و قابل استفاده دریافت کن.",
    imageTitle: "ترجمه هوشمند چندزبانه",
    imageEmoji: "🌐",
    sections: [
      {
        title: "ترجمه و بازنویسی",
        text: "ابزارک برای ترجمه متن و همچنین بازنویسی طبیعی آن به زبان موردنظر قابل استفاده است."
      },
      {
        title: "ترجمه برای چه کارهایی مفید است؟",
        text: "می‌توانی از ابزارک برای متن‌های روزمره و کاری استفاده کنی.",
        bullets: [
          "ترجمه فارسی و انگلیسی",
          "ترجمه متن‌های کاری",
          "بازنویسی متن",
          "ترجمه توضیحات محصول",
          "کمک به یادگیری زبان",
          "اصلاح متن ترجمه‌شده"
        ]
      }
    ]
  },

  "/summarize-ai": {
    title: "خلاصه سازی متن با هوش مصنوعی | ابزارک AI",
    description: "خلاصه سازی متن با هوش مصنوعی برای استخراج نکات مهم و تبدیل متن طولانی به خلاصه کاربردی.",
    h1: "خلاصه سازی متن با هوش مصنوعی",
    intro: "متن‌های طولانی را سریع‌تر بررسی کن و با کمک ابزارک نکات مهم و بخش‌های اصلی آن‌ها را استخراج کن.",
    imageTitle: "خلاصه‌سازی هوشمند",
    imageEmoji: "📝",
    sections: [
      {
        title: "خلاصه‌سازی سریع",
        text: "وقتی متن طولانی است، ابزارک می‌تواند به شما در تهیه یک خلاصه منظم و قابل فهم کمک کند."
      },
      {
        title: "کاربردهای خلاصه‌سازی",
        text: "خلاصه‌سازی برای مطالعه و کارهای روزمره کاربردهای زیادی دارد.",
        bullets: [
          "خلاصه مقاله",
          "خلاصه متن آموزشی",
          "استخراج نکات کلیدی",
          "خلاصه گزارش",
          "مرتب‌سازی مطالب طولانی",
          "تهیه نسخه کوتاه‌تر از متن"
        ]
      }
    ]
  },

  "/ideas-ai": {
    title: "ایده پردازی با هوش مصنوعی | ابزارک AI",
    description: "ایده پردازی با هوش مصنوعی برای کسب‌وکار، محتوا، شبکه‌های اجتماعی، پروژه و برنامه‌ریزی.",
    h1: "ایده پردازی با هوش مصنوعی",
    intro: "اگر برای شروع یک پروژه، تولید محتوا یا یک کار جدید دنبال ایده هستی، ابزارک می‌تواند در پیدا کردن و توسعه ایده‌ها کمکت کند.",
    imageTitle: "ایده‌پردازی خلاقانه",
    imageEmoji: "💡",
    sections: [
      {
        title: "ایده‌های تازه برای شروع",
        text: "موضوع یا هدف خودت را برای ابزارک توضیح بده و از آن برای ساختن فهرستی از ایده‌های قابل بررسی کمک بگیر."
      },
      {
        title: "ایده‌پردازی برای",
        text: "ابزارک می‌تواند در موضوعات مختلف برای تولید ایده استفاده شود.",
        bullets: [
          "ایده کسب‌وکار",
          "ایده تولید محتوا",
          "ایده پست شبکه اجتماعی",
          "ایده پروژه",
          "برنامه‌ریزی کارها",
          "نام و عنوان پیشنهادی"
        ]
      }
    ]
  },

  "/programming-ai": {
    title: "برنامه نویسی با هوش مصنوعی | ابزارک AI",
    description: "کمک به برنامه نویسی با هوش مصنوعی برای توضیح کد، رفع خطا، الگوریتم و تولید نمونه کد.",
    h1: "برنامه نویسی با هوش مصنوعی",
    intro: "برای یادگیری برنامه‌نویسی، فهمیدن کد، پیدا کردن خطا یا ساخت نمونه کد از ابزارک کمک بگیر.",
    imageTitle: "برنامه‌نویسی با AI",
    imageEmoji: "💻",
    sections: [
      {
        title: "دستیار برنامه‌نویسی",
        text: "ابزارک می‌تواند کد را توضیح دهد، درباره ساختار یک برنامه راهنمایی کند و برای مسائل برنامه‌نویسی نمونه و راهکار ارائه دهد."
      },
      {
        title: "کمک در برنامه‌نویسی",
        text: "برای موضوعات مختلف برنامه‌نویسی می‌توانی از ابزارک استفاده کنی.",
        bullets: [
          "توضیح کد",
          "پیدا کردن خطاهای رایج",
          "نوشتن نمونه کد",
          "الگوریتم و منطق برنامه",
          "HTML و CSS",
          "JavaScript و زبان‌های دیگر"
        ]
      }
    ]
  },

  "/ai-writing": {
    title: "نویسندگی و بازنویسی با هوش مصنوعی | ابزارک AI",
    description: "بازنویسی، اصلاح و بهبود متن با هوش مصنوعی فارسی ابزارک.",
    h1: "نویسندگی و بازنویسی با هوش مصنوعی",
    intro: "متن خودت را بهتر، روان‌تر و متناسب با هدف موردنظر بازنویسی کن و برای نوشتن متن‌های جدید ایده بگیر.",
    imageTitle: "نویسندگی هوشمند",
    imageEmoji: "🖊️",
    sections: [
      {
        title: "متن بهتر و روان‌تر",
        text: "اگر متنی نوشته‌ای و می‌خواهی آن را رسمی‌تر، دوستانه‌تر، کوتاه‌تر یا روان‌تر کنی، ابزارک می‌تواند در بازنویسی کمک کند."
      },
      {
        title: "امکانات نوشتاری",
        text: "از ابزارک برای انواع کارهای نوشتاری استفاده کن.",
        bullets: [
          "بازنویسی متن",
          "اصلاح نگارشی",
          "تغییر لحن",
          "نوشتن متن رسمی",
          "نوشتن متن دوستانه",
          "کوتاه کردن یا گسترش متن"
        ]
      }
    ]
  },

  "/ai-tools": {
    title: "ابزارهای هوش مصنوعی فارسی | ابزارک AI",
    description: "مجموعه‌ای از کاربردهای هوش مصنوعی فارسی برای چت، تولید محتوا، ترجمه، خلاصه‌سازی، ایده‌پردازی و برنامه‌نویسی.",
    h1: "ابزارهای هوش مصنوعی فارسی",
    intro: "ابزارک AI یک نقطه شروع ساده برای استفاده از هوش مصنوعی در گفتگو، تولید محتوا، ترجمه، خلاصه‌سازی، ایده‌پردازی و برنامه‌نویسی است.",
    imageTitle: "مجموعه ابزارهای هوش مصنوعی",
    imageEmoji: "🧰",
    sections: [
      {
        title: "یک دستیار برای چند کاربرد",
        text: "به جای استفاده از ابزارهای جداگانه برای هر کار، می‌توانی بسیاری از کارهای متنی و فکری خودت را با یک دستیار هوشمند امتحان کنی."
      },
      {
        title: "کاربردهای ابزارک",
        text: "صفحات زیر برای آشنایی بیشتر با کاربردهای مختلف ابزارک ایجاد شده‌اند.",
        bullets: [
          "چت با هوش مصنوعی",
          "تولید محتوا",
          "ترجمه",
          "خلاصه‌سازی",
          "ایده‌پردازی",
          "برنامه‌نویسی",
          "نویسندگی و بازنویسی"
        ]
      }
    ]
  },

  "/ai-assistant": {
    title: "دستیار هوش مصنوعی فارسی | ابزارک AI",
    description: "ابزارک AI یک دستیار هوش مصنوعی فارسی برای گفتگو، تولید محتوا، ترجمه، ایده‌پردازی و کارهای روزمره است.",
    h1: "دستیار هوش مصنوعی فارسی",
    intro: "ابزارک AI را به عنوان یک دستیار هوشمند فارسی برای سؤال پرسیدن، نوشتن، ترجمه، ایده‌پردازی و کارهای مختلف روزمره امتحان کن.",
    imageTitle: "دستیار هوشمند فارسی",
    imageEmoji: "🤖",
    sections: [
      {
        title: "ابزارک چیست؟",
        text: "ابزارک یک سرویس هوش مصنوعی فارسی است که برای گفتگو و کمک به کارهای متنی و فکری طراحی شده است."
      },
      {
        title: "دستیار هوشمند برای کارهای مختلف",
        text: "از ابزارک می‌توانی برای موضوعات مختلف استفاده کنی.",
        bullets: [
          "پرسش و پاسخ",
          "تولید محتوا",
          "ترجمه",
          "خلاصه‌سازی",
          "ایده‌پردازی",
          "نویسندگی",
          "برنامه‌نویسی"
        ]
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

function createSeoImage(
  title,
  emoji
) {
  const safeTitle =
    escapeSeoHtml(title);

  const safeEmoji =
    escapeSeoHtml(emoji);

  return `
  <div class="seo-ad-image" role="img" aria-label="${safeTitle}">
    <div class="seo-ad-glow seo-ad-glow-one"></div>
    <div class="seo-ad-glow seo-ad-glow-two"></div>
    <div class="seo-ad-content">
      <div class="seo-ad-icon">${safeEmoji}</div>
      <div class="seo-ad-brand">🤖 ابزارک AI</div>
      <div class="seo-ad-title">${safeTitle}</div>
      <div class="seo-ad-subtitle">هوش مصنوعی فارسی برای کارهای روزمره</div>
      <div class="seo-ad-button">رایگان امتحان کن ←</div>
    </div>
  </div>`;
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
      .map(section => {
        const bullets =
          Array.isArray(section.bullets) &&
          section.bullets.length
            ? `<ul>${section.bullets
                .map(
                  x =>
                    `<li>${escapeSeoHtml(x)}</li>`
                )
                .join("")}</ul>`
            : "";

        return `
<section class="seo-card">
  <h2>${escapeSeoHtml(section.title)}</h2>
  <p>${escapeSeoHtml(section.text || "")}</p>
  ${bullets}
</section>
`;
      })
      .join("");

  const related =
    Object.entries(SEO_PAGES)
      .filter(
        ([p]) =>
          p !== path
      )
      .map(
        ([p, v]) =>
          `<a class="seo-link" href="${p}">
            <span>${escapeSeoHtml(v.imageEmoji)}</span>
            ${escapeSeoHtml(v.h1)}
          </a>`
      )
      .join("");

  return `<!doctype html>
<html lang="fa" dir="rtl">
<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1"
>

<title>${escapeSeoHtml(data.title)}</title>

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

<meta property="og:type" content="website">
<meta property="og:locale" content="fa_IR">
<meta
  property="og:title"
  content="${escapeSeoHtml(data.title)}"
>
<meta
  property="og:description"
  content="${escapeSeoHtml(data.description)}"
>
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="ابزارک AI">

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
  --bg:#0f0f1a;
  --bg-soft:#16162a;
  --card:#1b1b33;
  --border:#2a2a45;
  --text:#eef0ff;
  --muted:#9797b8;
  --accent:#6d6dff;
  --accent-2:#8f5cff;
  --success:#22c55e;
  --radius:16px;
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
  background:
    radial-gradient(circle at 20% 0%,#2a2a55 0%,transparent 45%),
    radial-gradient(circle at 100% 20%,#3a1e5e 0%,transparent 40%),
    var(--bg);
  color:var(--text);
  min-height:100vh;
  direction:rtl;
}

a{
  color:inherit
}

.seo-wrap{
  max-width:1000px;
  margin:0 auto;
  padding:24px;
}

.seo-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  padding:8px 0 24px;
}

.seo-logo{
  display:flex;
  align-items:center;
  gap:9px;
  font-size:20px;
  font-weight:900;
}

.seo-logo-icon{
  width:36px;
  height:36px;
  border-radius:11px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:linear-gradient(
    135deg,
    var(--accent),
    var(--accent-2)
  );
}

.seo-nav{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
}

.seo-btn{
  display:inline-block;
  padding:10px 16px;
  border-radius:12px;
  background:linear-gradient(
    135deg,
    var(--accent),
    var(--accent-2)
  );
  text-decoration:none;
  font-weight:700;
}

.seo-btn.secondary{
  background:var(--card);
  border:1px solid var(--border);
}

.seo-hero{
  text-align:center;
  padding:30px 0 20px;
}

.seo-hero h1{
  font-size:38px;
  line-height:1.5;
  margin:0 0 14px;
}

.seo-hero p{
  color:var(--muted);
  line-height:2;
  max-width:780px;
  margin:0 auto 24px;
  font-size:16px;
}

.seo-ad-image{
  position:relative;
  overflow:hidden;
  max-width:820px;
  min-height:300px;
  margin:28px auto;
  border-radius:24px;
  border:1px solid var(--border);
  background:
    linear-gradient(
      135deg,
      #17173b 0%,
      #242052 45%,
      #361d57 100%
    );
  box-shadow:
    0 18px 60px rgba(0,0,0,.30);
}

.seo-ad-glow{
  position:absolute;
  width:220px;
  height:220px;
  border-radius:50%;
  filter:blur(35px);
  opacity:.45;
}

.seo-ad-glow-one{
  background:#6d6dff;
  top:-90px;
  right:-50px;
}

.seo-ad-glow-two{
  background:#a855f7;
  bottom:-100px;
  left:-50px;
}

.seo-ad-content{
  position:relative;
  z-index:2;
  min-height:300px;
  padding:36px 20px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
}

.seo-ad-icon{
  width:82px;
  height:82px;
  border-radius:24px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:rgba(255,255,255,.10);
  border:1px solid rgba(255,255,255,.16);
  font-size:44px;
}

.seo-ad-brand{
  margin-top:14px;
  font-size:14px;
  color:#c9c9ff;
  font-weight:800;
}

.seo-ad-title{
  font-size:28px;
  font-weight:900;
  margin-top:8px;
}

.seo-ad-subtitle{
  color:#c6c7e2;
  margin-top:8px;
  line-height:1.8;
}

.seo-ad-button{
  margin-top:18px;
  padding:10px 18px;
  border-radius:999px;
  background:linear-gradient(
    135deg,
    var(--accent),
    var(--accent-2)
  );
  font-weight:800;
}

.seo-card{
  background:var(--card);
  border:1px solid var(--border);
  border-radius:var(--radius);
  padding:24px;
  margin:16px 0;
}

.seo-card h2{
  margin-top:0;
  font-size:21px;
}

.seo-card p,
.seo-card li{
  line-height:2;
  color:#d9daf0;
}

.seo-card ul{
  margin:10px 0 0;
}

.seo-links{
  display:grid;
  grid-template-columns:repeat(
    auto-fit,
    minmax(220px,1fr)
  );
  gap:10px;
}

.seo-link{
  display:flex;
  align-items:center;
  gap:9px;
  padding:14px;
  background:var(--bg-soft);
  border:1px solid var(--border);
  border-radius:12px;
  text-decoration:none;
  transition:.15s;
}

.seo-link:hover{
  border-color:var(--accent);
  transform:translateY(-2px);
}

.seo-cta{
  margin:28px 0;
  padding:30px 20px;
  border:1px solid var(--accent);
  border-radius:20px;
  background:
    radial-gradient(
      circle at 20% 20%,
      rgba(109,109,255,.18),
      transparent 45%
    ),
    var(--card);
  text-align:center;
}

.seo-cta h2{
  margin-top:0;
}

.seo-cta p{
  color:var(--muted);
  line-height:2;
}

.seo-footer{
  text-align:center;
  color:var(--muted);
  font-size:13px;
  padding:35px 0 20px;
}

@media(max-width:640px){

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
    font-size:28px;
  }

  .seo-ad-image,
  .seo-ad-content{
    min-height:270px;
  }

  .seo-ad-title{
    font-size:23px;
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
    style="text-decoration:none;"
  >
    <span class="seo-logo-icon">🤖</span>
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

  ${createSeoImage(
    data.imageTitle,
    data.imageEmoji
  )}

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
    برای گفتگو، تولید محتوا، ترجمه، خلاصه‌سازی و ایده‌پردازی
    می‌توانی همین حالا وارد ابزارک شوی.
  </p>

  <a
    href="/"
    class="seo-btn"
  >
    شروع استفاده از ابزارک
  </a>

</section>

<section class="seo-card">

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


function renderFaqPage() {
  const canonical =
    "https://abzarakai.ir/faq";

  const faqHtml =
    FAQ_ITEMS
      .map(
        item =>
`
<section class="faq-item">
  <h2>${escapeSeoHtml(item.q)}</h2>
  <p>${escapeSeoHtml(item.a)}</p>
</section>
`
      )
      .join("");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_ITEMS.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
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
  --bg:#0f0f1a;
  --bg-soft:#16162a;
  --card:#1b1b33;
  --border:#2a2a45;
  --text:#eef0ff;
  --muted:#9797b8;
  --accent:#6d6dff;
  --accent-2:#8f5cff;
}

*{
  box-sizing:border-box
}

body{
  margin:0;
  font-family:Tahoma,"Vazirmatn",Arial,sans-serif;
  background:
    radial-gradient(
      circle at 20% 0%,
      #2a2a55 0%,
      transparent 45%
    ),
    radial-gradient(
      circle at 100% 20%,
      #3a1e5e 0%,
      transparent 40%
    ),
    var(--bg);
  color:var(--text);
  min-height:100vh;
}

.faq-wrap{
  max-width:950px;
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
  font-size:20px;
  font-weight:900;
  text-decoration:none;
}

.faq-btn{
  display:inline-block;
  padding:10px 16px;
  border-radius:12px;
  text-decoration:none;
  background:
    linear-gradient(
      135deg,
      var(--accent),
      var(--accent-2)
    );
  font-weight:700;
}

.faq-hero{
  text-align:center;
  padding:30px 0;
}

.faq-hero h1{
  font-size:36px;
  line-height:1.5;
}

.faq-hero p{
  color:var(--muted);
  line-height:2;
}

.faq-image{
  margin:25px auto;
  max-width:800px;
  min-height:260px;
  border:1px solid var(--border);
  border-radius:24px;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction:column;
  background:
    radial-gradient(
      circle at 20% 20%,
      rgba(109,109,255,.3),
      transparent 40%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(143,92,255,.3),
      transparent 40%
    ),
    var(--card);
}

.faq-image-icon{
  font-size:58px;
}

.faq-image-title{
  font-size:25px;
  font-weight:900;
  margin-top:10px;
}

.faq-item{
  background:var(--card);
  border:1px solid var(--border);
  border-radius:16px;
  padding:22px;
  margin:14px 0;
}

.faq-item h2{
  font-size:19px;
  margin-top:0;
}

.faq-item p{
  color:#d9daf0;
  line-height:2;
}

.faq-cta{
  text-align:center;
  margin:30px 0;
  padding:28px;
  border:1px solid var(--accent);
  border-radius:18px;
  background:var(--card);
}

.faq-footer{
  text-align:center;
  color:var(--muted);
  padding:30px 0;
}

@media(max-width:640px){

  .faq-wrap{
    padding:16px;
  }

  .faq-hero h1{
    font-size:28px;
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

    <div style="color:#9797b8;margin-top:8px;">
      دستیار هوش مصنوعی فارسی
    </div>

  </div>

</section>

${faqHtml}

<section class="faq-cta">

  <h2>
    آماده‌ای امتحانش کنی؟
  </h2>

  <p style="color:#9797b8;line-height:2;">
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
