// =============================================================
// ABZARAK AI — HOMEPAGE + BACKEND API
// Auth / D1 / AI / Plans / Resend / Payment / Admin / Withdrawals
// Fixed authentication/session handling
// Fixed ZarinPal v4 payment request + verify
// Safe payments-table migration
// Payment V2 table for legacy D1 compatibility
// Enamad verification meta tag added
// =============================================================


// =============================================================
// HOMEPAGE
// =============================================================

function renderHomepage() {

  return `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="enamad" content="36032134" />

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

      <button
        class="btn ghost"
        onclick="openModal('login')">
        ورود
      </button>

      <button
        class="btn primary"
        onclick="openModal('signup')">
        ثبت‌نام رایگان
      </button>

    </nav>

    <div id="userBadge">

      <span>
        خوش آمدی،
        <b id="userNameLabel"></b>
      </span>

      <button
        class="btn"
        onclick="logout()">
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
        onclick="focusChat()">
        شروع گفتگو
      </button>

      <button
        class="btn ghost"
        onclick="scrollToPlans()">
        مشاهده پلن‌ها
      </button>

    </div>

  </section>


  <section class="chat-section card">

    <div class="chat-box">

      <div
        class="chat-log"
        id="chatLog">

        <div class="msg system">
          سلام! من ابزارک هستم.
          هر سوالی داری بپرس 👋
        </div>

      </div>

      <div class="chat-input-row">

        <input
          id="chatInput"
          type="text"
          placeholder="پیامت را بنویس..."
          onkeydown="if(event.key==='Enter') sendMessage()">

        <button
          class="btn primary"
          onclick="sendMessage()">
          ارسال
        </button>

      </div>

    </div>

  </section>


  <section
    class="plans-section"
    id="plansSection">

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
      id="plansGrid">

      <div
        class="msg system"
        style="align-self:center;">
        در حال بارگذاری پلن‌ها...
      </div>

    </div>

  </section>


  <footer>
    🤖 ابزارک AI — ساخته‌شده با هوش مصنوعی
  </footer>

</div>


<!-- =========================================================
     AUTH MODAL
========================================================= -->

<div
  class="overlay"
  id="authOverlay">

  <div class="modal">

    <button
      class="modal-close"
      onclick="closeModal()">
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
          placeholder="you@example.com">

      </div>


      <div class="field">

        <label>
          رمز عبور
        </label>

        <input
          type="password"
          id="loginPassword"
          placeholder="••••••••">

      </div>


      <div
        class="modal-msg"
        id="loginMsg">
      </div>


      <button
        class="btn primary block"
        onclick="doLogin()">
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


    <!-- SIGNUP -->

    <div
      id="signupForm"
      style="display:none;">

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
          placeholder="نام شما">

      </div>


      <div class="field">

        <label>
          ایمیل
        </label>

        <input
          type="email"
          id="signupEmail"
          placeholder="you@example.com">

      </div>


      <div class="field">

        <label>
          رمز عبور
        </label>

        <input
          type="password"
          id="signupPassword"
          placeholder="حداقل ۶ کاراکتر">

      </div>


      <div
        class="modal-msg"
        id="signupMsg">
      </div>


      <button
        class="btn primary block"
        onclick="doSignup()">
        ثبت‌نام
      </button>


      <div class="switch-line">

        قبلاً ثبت‌نام کرده‌ای؟

        <a onclick="openModal('login')">
          وارد شو
        </a>

      </div>

    </div>


    <!-- FORGOT -->

    <div
      id="forgotForm"
      style="display:none;">

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
          placeholder="you@example.com">

      </div>


      <div
        class="modal-msg"
        id="forgotMsg">
      </div>


      <button
        class="btn primary block"
        onclick="doForgot()">
        ارسال کد بازیابی
      </button>


      <div
        id="resetFields"
        style="display:none; margin-top:14px;">

        <div class="field">

          <label>
            کد بازیابی
          </label>

          <input
            type="text"
            id="resetCode"
            placeholder="۶ رقمی">

        </div>


        <div class="field">

          <label>
            رمز عبور جدید
          </label>

          <input
            type="password"
            id="resetNewPassword"
            placeholder="حداقل ۶ کاراکتر">

        </div>


        <button
          class="btn primary block"
          onclick="doReset()">
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

  let token =
    localStorage.getItem("abzarak_token") || null;

  let currentUser = null;


  function openModal(which) {

    document
      .getElementById("authOverlay")
      .classList
      .add("open");

    document
      .getElementById("loginForm")
      .style.display =
        which === "login"
          ? "block"
          : "none";

    document
      .getElementById("signupForm")
      .style.display =
        which === "signup"
          ? "block"
          : "none";

    document
      .getElementById("forgotForm")
      .style.display =
        which === "forgot"
          ? "block"
          : "none";

  }


  function closeModal() {

    document
      .getElementById("authOverlay")
      .classList
      .remove("open");

  }


  function setMsg(
    id,
    text,
    ok
  ) {

    const el =
      document.getElementById(id);

    if (!el)
      return;

    el.textContent =
      text || "";

    el.className =
      "modal-msg " +
      (ok ? "ok" : "err");

  }


  async function api(
    path,
    options = {}
  ) {

    const headers =
      Object.assign(
        {
          "Content-Type":
            "application/json"
        },
        options.headers || {}
      );


    if (token) {

      headers["Authorization"] =
        "Bearer " + token;

    }


    const res =
      await fetch(
        API + path,
        Object.assign(
          {},
          options,
          {
            headers
          }
        )
      );


    let data = {};

    try {

      data =
        await res.json();

    } catch {}


    if (!res.ok) {

      const error =
        new Error(
          data.error ||
          "خطایی رخ داد."
        );

      error.status =
        res.status;

      error.data =
        data;

      throw error;

    }


    return data;

  }


  async function doSignup() {

    const name =
      document
        .getElementById("signupName")
        .value
        .trim();

    const email =
      document
        .getElementById("signupEmail")
        .value
        .trim();

    const password =
      document
        .getElementById("signupPassword")
        .value;


    setMsg(
      "signupMsg",
      ""
    );


    try {

      const data =
        await api(
          "/api/signup",
          {
            method: "POST",

            body:
              JSON.stringify({
                name,
                email,
                password
              })
          }
        );


      if (!data.token)
        throw new Error(
          "توکن ورود از سرور دریافت نشد."
        );


      token =
        data.token;


      localStorage.setItem(
        "abzarak_token",
        token
      );


      const ok =
        await loadMe();


      if (ok) {

        closeModal();

        addMsg(
          "ثبت‌نام با موفقیت انجام شد. حالا می‌توانی پیام بفرستی. 👋",
          "system"
        );

      } else {

        closeModal();

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
      document
        .getElementById("loginEmail")
        .value
        .trim();

    const password =
      document
        .getElementById("loginPassword")
        .value;


    setMsg(
      "loginMsg",
      ""
    );


    try {

      const data =
        await api(
          "/api/login",
          {
            method: "POST",

            body:
              JSON.stringify({
                email,
                password
              })
          }
        );


      if (!data.token)
        throw new Error(
          "توکن ورود از سرور دریافت نشد."
        );


      token =
        data.token;


      localStorage.setItem(
        "abzarak_token",
        token
      );


      const ok =
        await loadMe();


      if (ok) {

        closeModal();

        addMsg(
          "ورود با موفقیت انجام شد. حالا پیام خودت را بفرست. 👋",
          "system"
        );

      } else {

        closeModal();

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


    setMsg(
      "forgotMsg",
      ""
    );


    try {

      const data =
        await api(
          "/api/forgot-password",
          {
            method: "POST",

            body:
              JSON.stringify({
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
        .style.display =
          "block";


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


    setMsg(
      "forgotMsg",
      ""
    );


    try {

      const data =
        await api(
          "/api/reset-password",
          {
            method: "POST",

            body:
              JSON.stringify({
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
      document.getElementById(
        "navArea"
      );

    const badge =
      document.getElementById(
        "userBadge"
      );


    if (currentUser) {

      navArea.style.display =
        "none";

      badge.style.display =
        "flex";


      document
        .getElementById(
          "userNameLabel"
        )
        .textContent =
          currentUser.name || "کاربر";


    } else {

      navArea.style.display =
        "flex";

      badge.style.display =
        "none";

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
        await api(
          "/api/me"
        );


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

      }


      updateNav();


      return false;

    }

  }


  function addMsg(
    text,
    cls
  ) {

    const log =
      document.getElementById(
        "chatLog"
      );


    const div =
      document.createElement(
        "div"
      );


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
      document.getElementById(
        "chatInput"
      );


    input.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });


    input.focus();

  }


  function scrollToPlans() {

    document
      .getElementById(
        "plansSection"
      )
      .scrollIntoView({
        behavior: "smooth"
      });

  }


  async function sendMessage() {

    const input =
      document.getElementById(
        "chatInput"
      );


    const message =
      input.value.trim();


    if (!message)
      return;


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
      document.createElement(
        "div"
      );


    thinking.className =
      "msg ai";


    thinking.textContent =
      "در حال تایپ...";


    document
      .getElementById("chatLog")
      .appendChild(
        thinking
      );


    document
      .getElementById("chatLog")
      .scrollTop =
        document
          .getElementById("chatLog")
          .scrollHeight;


    try {

      const data =
        await api(
          "/api/ai/chat",
          {
            method: "POST",

            body:
              JSON.stringify({
                message
              })
          }
        );


      thinking.textContent =
        data.reply ||
        "پاسخی دریافت نشد.";


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
          e.message;

      }

    }

  }


  async function loadPlans() {

    const grid =
      document.getElementById(
        "plansGrid"
      );


    try {

      const data =
        await api(
          "/api/plans"
        );


      grid.innerHTML = "";


      (data.plans || [])
        .forEach(
          (plan, i) => {

            const card =
              document.createElement(
                "div"
              );


            card.className =
              "card plan-card" +
              (
                i === 2
                  ? " featured"
                  : ""
              );


            const features =
              Array.isArray(
                plan.features
              )
                ? plan.features
                : [];


            card.innerHTML =
              "<h3>" +
              escapeHtml(
                plan.name
              ) +
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
                    escapeHtml(
                      String(f)
                    ) +
                    "</li>"
                )
                .join("") +
              "</ul>" +

              "<button class='btn primary block' " +
              "onclick='buyPlan(" +
              JSON.stringify(
                plan.id
              ) +
              ")'>" +
              "خرید این پلن" +
              "</button>";


            grid.appendChild(
              card
            );

          }
        );


    } catch (e) {

      console.error(
        "LOAD PLANS ERROR:",
        e
      );


      grid.innerHTML =
        "<div class='msg system' style='align-self:center;'>" +
        "بارگذاری پلن‌ها ناموفق بود." +
        "</div>";

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


  async function buyPlan(
    planId
  ) {

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

            body:
              JSON.stringify({
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
    params.get("payment") ===
      "failed" ||
    params.get("payment") ===
      "error"
  ) {

    setTimeout(
      () =>
        alert(
          "پرداخت ناموفق بود. لطفاً دوباره تلاش کنید."
        ),
      300
    );

  } else if (
    params.get("payment") ===
    "cancel"
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
  const secret =
    String(
      env.JWT_SECRET ||
      env.ADMIN_PASSWORD ||
      "abzarak-default-secret"
    ).trim();

  return secret;
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

function cors(response) {
  const headers =
    new Headers(
      response.headers
    );

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
      status:
        response.status,
      statusText:
        response.statusText,
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

  return Array
    .from(data)
    .map(
      x =>
        x.toString(16)
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
    new TextEncoder().encode(
      password
    );

  const hash =
    await crypto.subtle.digest(
      "SHA-256",
      data
    );

  return Array
    .from(
      new Uint8Array(hash)
    )
    .map(
      x =>
        x.toString(16)
          .padStart(2, "0")
    )
    .join("");
}

function base64url(data) {
  let binary = "";

  if (
    typeof data ===
    "string"
  ) {
    binary =
      btoa(data);
  } else {
    binary =
      btoa(
        String.fromCharCode(
          ...data
        )
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

async function hmacSign(value, secret) {
  const key =
    await crypto.subtle.importKey(
      "raw",
      new TextEncoder()
        .encode(secret),
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
      new TextEncoder()
        .encode(value)
    );

  return base64url(
    new Uint8Array(
      signature
    )
  );
}

async function createToken(payload, secret) {
  const encoded =
    base64url(
      JSON.stringify(
        payload
      )
    );

  const signature =
    await hmacSign(
      encoded,
      secret
    );

  return (
    encoded +
    "." +
    signature
  );
}

async function verifyToken(token, secret) {
  if (!token)
    return null;

  const parts =
    token.split(".");

  if (
    parts.length !== 2
  )
    return null;

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
    signature !==
    expected
  )
    return null;

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

  if (!auth)
    return "";

  if (
    !auth
      .toLowerCase()
      .startsWith("bearer ")
  )
    return "";

  return auth
    .slice(7)
    .trim();
}

let dbReady = false;

async function migratePaymentsTable(env) {
  const tableInfo =
    await env.DB.prepare(`
      PRAGMA table_info(payments)
    `).all();

  const columns =
    new Set(
      (tableInfo.results || [])
        .map(
          row =>
            String(
              row.name || ""
            )
        )
    );

  if (!columns.has("user_id")) {
    await env.DB.prepare(`
      ALTER TABLE payments
      ADD COLUMN user_id TEXT
    `).run();
  }

  if (!columns.has("plan_id")) {
    await env.DB.prepare(`
      ALTER TABLE payments
      ADD COLUMN plan_id TEXT
    `).run();
  }

  if (!columns.has("amount_toman")) {
    await env.DB.prepare(`
      ALTER TABLE payments
      ADD COLUMN amount_toman INTEGER
    `).run();
  }

  if (!columns.has("authority")) {
    await env.DB.prepare(`
      ALTER TABLE payments
      ADD COLUMN authority TEXT
    `).run();
  }

  if (!columns.has("status")) {
    await env.DB.prepare(`
      ALTER TABLE payments
      ADD COLUMN status TEXT DEFAULT 'pending'
    `).run();
  }

  if (!columns.has("created_at")) {
    await env.DB.prepare(`
      ALTER TABLE payments
      ADD COLUMN created_at TEXT
    `).run();
  }

  if (!columns.has("paid_at")) {
    await env.DB.prepare(`
      ALTER TABLE payments
      ADD COLUMN paid_at TEXT
    `).run();
  }

  try {
    await env.DB.prepare(`
      UPDATE payments
      SET status = 'pending'
      WHERE status IS NULL
    `).run();
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

  if (dbReady)
    return;

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      balance INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS plans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price_toman INTEGER NOT NULL,
      price_usd REAL NOT NULL,
      features TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      starts_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active'
    )
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS usage (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      usage_date TEXT NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      UNIQUE(user_id, usage_date)
    )
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare(`
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
  `).run();

  await migratePaymentsTable(env);

  await env.DB.prepare(`
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
  `).run();

  await env.DB.prepare(`
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
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL
    )
  `).run();

  for (
    const id of
    Object.keys(PLAN_PRICES)
  ) {
    const exists =
      await env.DB.prepare(
        "SELECT id FROM plans WHERE id = ?"
      )
        .bind(id)
        .first();

    if (!exists) {
      await env.DB.prepare(`
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
      await env.DB.prepare(`
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

async function requireUser(request, env) {
  const token =
    bearerToken(request);

  if (!token)
    return null;

  const secret =
    getAuthSecret(env);

  const payload =
    await verifyToken(
      token,
      secret
    );

  if (
    !payload ||
    !payload.userId
  )
    return null;

  const user =
    await env.DB.prepare(`
      SELECT *
      FROM users
      WHERE id = ?
    `)
      .bind(
        payload.userId
      )
      .first();

  return user || null;
}

async function requireAdmin(request, env) {
  const token =
    bearerToken(request);

  if (!token)
    return false;

  const secret =
    getAuthSecret(env);

  const payload =
    await verifyToken(
      token,
      secret
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

async function getUsage(env, userId) {
  const date =
    today();

  let row =
    await env.DB.prepare(`
      SELECT *
      FROM usage
      WHERE user_id = ?
      AND usage_date = ?
    `)
      .bind(
        userId,
        date
      )
      .first();

  if (!row) {
    try {
      await env.DB.prepare(`
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
      await env.DB.prepare(`
        SELECT *
        FROM usage
        WHERE user_id = ?
        AND usage_date = ?
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

async function getSubscription(env, userId) {
  return await env.DB.prepare(`
    SELECT
      s.*,
      p.id AS plan_id_real,
      p.name AS plan_name,
      p.price_toman,
      p.price_usd,
      p.features
    FROM subscriptions s
    LEFT JOIN plans p
      ON p.id = s.plan_id
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

async function sendRecoveryEmail(env, email, code) {
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
<body style="
margin:0;
padding:30px;
background:#f6f8ff;
font-family:Tahoma,Arial,sans-serif;
direction:rtl;
">
<div style="
max-width:560px;
margin:auto;
background:#ffffff;
border-radius:20px;
padding:30px;
box-shadow:0 10px 40px rgba(15,23,42,.08);
">
<h2 style="
color:#1e1b4b;
margin-top:0;
">
🔐 بازیابی رمز عبور ابزارک
</h2>
<p style="
color:#475569;
line-height:2;
">
کد بازیابی رمز عبور شما:
</p>
<div style="
font-size:36px;
font-weight:900;
letter-spacing:8px;
text-align:center;
padding:20px;
border-radius:16px;
background:#eef2ff;
color:#3730a3;
">
${code}
</div>
<p style="
color:#64748b;
line-height:2;
">
این کد تا ۱۵ دقیقه معتبر است.
</p>
<p style="
color:#64748b;
line-height:2;
">
اگر این درخواست توسط شما انجام نشده است،
این ایمیل را نادیده بگیرید.
</p>
<hr style="
border:0;
border-top:1px solid #e5e7eb;
margin:25px 0;
">
<div style="
text-align:center;
color:#64748b;
">
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

async function signupApi(request, env) {
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

  if (!name)
    return json(
      {
        error:
          "نام را وارد کنید."
      },
      400
    );

  if (!email)
    return json(
      {
        error:
          "ایمیل را وارد کنید."
      },
      400
    );

  if (
    !email.includes("@") ||
    !email.includes(".")
  )
    return json(
      {
        error:
          "ایمیل معتبر نیست."
      },
      400
    );

  if (
    password.length < 6
  )
    return json(
      {
        error:
          "رمز عبور باید حداقل ۶ کاراکتر باشد."
      },
      400
    );

  const existing =
    await env.DB.prepare(`
      SELECT id
      FROM users
      WHERE email = ?
    `)
      .bind(email)
      .first();

  if (existing)
    return json(
      {
        error:
          "این ایمیل قبلاً ثبت شده است."
      },
      409
    );

  const id =
    randomHex(16);

  const passwordHash =
    await hashPassword(
      password
    );

  await env.DB.prepare(`
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

  const secret =
    getAuthSecret(env);

  const token =
    await createToken(
      {
        userId: id,
        exp:
          Date.now() +
          30 * 86400000
      },
      secret
    );

  return json({
    token
  });
}

async function loginApi(request, env) {
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
    await env.DB.prepare(`
      SELECT *
      FROM users
      WHERE email = ?
    `)
      .bind(email)
      .first();

  if (!user)
    return json(
      {
        error:
          "ایمیل یا رمز عبور اشتباه است."
      },
      401
    );

  const hash =
    await hashPassword(
      password
    );

  if (
    hash !==
    user.password_hash
  )
    return json(
      {
        error:
          "ایمیل یا رمز عبور اشتباه است."
      },
      401
    );

  const secret =
    getAuthSecret(env);

  const token =
    await createToken(
      {
        userId:
          user.id,
        exp:
          Date.now() +
          30 * 86400000
      },
      secret
    );

  return json({
    token
  });
}

async function meApi(request, env) {
  const user =
    await requireUser(
      request,
      env
    );

  if (!user)
    return json(
      {
        error:
          "نشست نامعتبر است."
      },
      401
    );

  let subscription =
    null;

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

  let subscriptionData =
    null;

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

async function forgotPasswordApi(request, env) {
  const body =
    await bodyJson(request);

  const email =
    String(
      body.email || ""
    )
      .trim()
      .toLowerCase();

  if (!email)
    return json(
      {
        error:
          "ایمیل را وارد کنید."
      },
      400
    );

  const user =
    await env.DB.prepare(`
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
    await hashPassword(
      code
    );

  const id =
    randomHex(16);

  await env.DB.prepare(`
    UPDATE password_resets
    SET used = 1
    WHERE user_id = ?
      AND used = 0
  `)
    .bind(
      user.id
    )
    .run();

  await env.DB.prepare(`
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
      mail.status ||
      500
    );
  }

  return json({
    message:
      "کد بازیابی به ایمیل شما ارسال شد."
  });
}

async function resetPasswordApi(request, env) {
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
  )
    return json(
      {
        error:
          "ایمیل و کد بازیابی الزامی است."
      },
      400
    );

  if (
    newPassword.length < 6
  )
    return json(
      {
        error:
          "رمز جدید باید حداقل ۶ کاراکتر باشد."
      },
      400
    );

  const user =
    await env.DB.prepare(`
      SELECT id
      FROM users
      WHERE email = ?
    `)
      .bind(email)
      .first();

  if (!user)
    return json(
      {
        error:
          "کد بازیابی معتبر نیست."
      },
      400
    );

  const reset =
    await env.DB.prepare(`
      SELECT *
      FROM password_resets
      WHERE user_id = ?
        AND used = 0
      ORDER BY created_at DESC
      LIMIT 1
    `)
      .bind(user.id)
      .first();

  if (!reset)
    return json(
      {
        error:
          "کد بازیابی معتبر نیست یا منقضی شده است."
      },
      400
    );

  if (
    Date.now() >
    new Date(
      reset.expires_at
    ).getTime()
  ) {
    await env.DB.prepare(`
      UPDATE password_resets
      SET used = 1
      WHERE id = ?
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

  const codeHash =
    await hashPassword(
      code
    );

  if (
    codeHash !==
    reset.code_hash
  )
    return json(
      {
        error:
          "کد بازیابی اشتباه است."
      },
      400
    );

  const passwordHash =
    await hashPassword(
      newPassword
    );

  await env.DB.prepare(`
    UPDATE users
    SET password_hash = ?
    WHERE id = ?
  `)
    .bind(
      passwordHash,
      user.id
    )
    .run();

  await env.DB.prepare(`
    UPDATE password_resets
    SET used = 1
    WHERE id = ?
  `)
    .bind(
      reset.id
    )
    .run();

  return json({
    message:
      "رمز عبور با موفقیت تغییر کرد."
  });
}

async function plansApi(env) {
  const rows =
    await env.DB.prepare(`
      SELECT *
      FROM plans
      ORDER BY
        CASE id
          WHEN 'basic' THEN 1
          WHEN 'standard' THEN 2
          WHEN 'pro' THEN 3
          WHEN 'special' THEN 4
          ELSE 99
        END
    `)
      .all();

  const plans =
    (rows.results || [])
      .map(
        x => {
          let features = [];

          try {
            features =
              JSON.parse(
                x.features ||
                "[]"
              );
          } catch {
            features = [];
          }

          return {
            id:
              x.id,
            name:
              x.name,
            price_toman:
              Number(
                x.price_toman
              ),
            price_usd:
              Number(
                x.price_usd
              ),
            features
          };
        }
      );

  return json({
    plans,
    plans_usd:
      plans
  });
}

async function aiChatApi(request, env) {
  const user =
    await requireUser(
      request,
      env
    );

  if (!user)
    return json(
      {
        error:
          "برای استفاده از هوش مصنوعی وارد حساب شوید."
      },
      401
    );

  const body =
    await bodyJson(request);

  const message =
    String(
      body.message || ""
    ).trim();

  if (!message)
    return json(
      {
        error:
          "پیام خالی است."
      },
      400
    );

  if (
    message.length >
    12000
  )
    return json(
      {
        error:
          "پیام بیش از حد طولانی است."
      },
      400
    );

  let subscription =
    null;

  try {
    subscription =
      await getSubscription(
        env,
        user.id
      );
  } catch (error) {
    console.error(
      "AI SUBSCRIPTION ERROR:",
      error
    );
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

    return json(
      {
        error:
          "خطا در بررسی سهمیه حساب."
      },
      500
    );
  }

  if (
    !subscription &&
    Number(
      usage.used || 0
    ) >=
      FREE_DAILY_LIMIT
  ) {
    return json(
      {
        error:
          "سهمیه روزانه شما تمام شده است.",
        upgrade_required:
          true
      },
      429
    );
  }

  if (!env.AI) {
    return json(
      {
        error:
          "سرویس هوش مصنوعی تنظیم نشده است."
      },
      500
    );
  }

  let result;

  try {
    result =
      await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct-fast",
        {
          messages: [
            {
              role:
                "system",
              content:
                "You are Abzarak AI, a helpful multilingual AI assistant. Answer in the same language as the user whenever possible. Be clear, useful and concise."
            },
            {
              role:
                "user",
              content:
                message
            }
          ]
        }
      );
  } catch (error) {
    console.error(
      "AI PROVIDER ERROR:",
      error
    );

    return json(
      {
        error:
          "خطا در سرویس هوش مصنوعی.",
        details:
          error?.message ||
          String(error)
      },
      500
    );
  }

  let reply = "";

  if (
    typeof result ===
    "string"
  ) {
    reply =
      result;
  } else if (
    result &&
    typeof result.response ===
      "string"
  ) {
    reply =
      result.response;
  } else if (
    result &&
    typeof result.result ===
      "string"
  ) {
    reply =
      result.result;
  } else {
    try {
      reply =
        JSON.stringify(
          result
        );
    } catch {
      reply =
        "پاسخی دریافت نشد.";
    }
  }

  if (!subscription) {
    try {
      await env.DB.prepare(`
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
    reply
  });
}

async function paymentRequestApi(request, env) {
  try {
    const user =
      await requireUser(
        request,
        env
      );

    if (!user)
      return json(
        {
          error:
            "برای خرید ابتدا وارد حساب شوید."
        },
        401
      );

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
            "درگاه زرین‌پال هنوز در Worker تنظیم نشده است."
        },
        503
      );
    }

    const paymentId =
      randomHex(16);

    const createdAt =
      new Date().toISOString();

    try {
      await env.DB.prepare(`
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
        (?, ?, ?, ?, NULL, 'pending', ?, NULL)
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
        new URL(
          request.url
        ).origin
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
          user.email,
        mobile:
          ""
      }
    };

    let response;

    try {
      response =
        await fetch(
          "https://api.zarinpal.com/pg/v4/payment/request.json",
          {
            method:
              "POST",
            headers: {
              "Content-Type":
                "application/json",
              "Accept":
                "application/json"
            },
            body:
              JSON.stringify(
                payload
              )
          }
        );
    } catch (networkError) {
      console.error(
        "ZARINPAL NETWORK ERROR:",
        networkError
      );

      try {
        await env.DB.prepare(`
          UPDATE payments_v2
          SET status = 'failed'
          WHERE id = ?
            AND status = 'pending'
        `)
          .bind(
            paymentId
          )
          .run();
      } catch (updateError) {
        console.error(
          "PAYMENT V2 NETWORK FAILURE UPDATE ERROR:",
          updateError
        );
      }

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
        "ZARINPAL INVALID JSON:",
        rawResponse
      );

      try {
        await env.DB.prepare(`
          UPDATE payments_v2
          SET status = 'failed'
          WHERE id = ?
            AND status = 'pending'
        `)
          .bind(
            paymentId
          )
          .run();
      } catch (updateError) {
        console.error(
          "PAYMENT V2 INVALID JSON UPDATE ERROR:",
          updateError
        );
      }

      return json(
        {
          error:
            "پاسخ نامعتبر از زرین‌پال دریافت شد.",
          http_status:
            response.status
        },
        502
      );
    }

    const gatewayCode =
      data?.data?.code;

    const authority =
      data?.data?.authority;

    const errorCode =
      data?.errors?.code;

    const errorMessage =
      data?.errors?.message;

    if (
      !response.ok ||
      !authority ||
      (
        gatewayCode !== undefined &&
        Number(
          gatewayCode
        ) !== 100
      )
    ) {
      try {
        await env.DB.prepare(`
          UPDATE payments_v2
          SET status = 'failed'
          WHERE id = ?
            AND status = 'pending'
        `)
          .bind(
            paymentId
          )
          .run();
      } catch (updateError) {
        console.error(
          "PAYMENT V2 GATEWAY FAILURE UPDATE ERROR:",
          updateError
        );
      }

      return json(
        {
          error:
            errorMessage ||
            "ایجاد درخواست پرداخت ناموفق بود.",
          gateway_code:
            errorCode ??
            gatewayCode ??
            null,
          http_status:
            response.status
        },
        502
      );
    }

    try {
      await env.DB.prepare(`
        UPDATE payments_v2
        SET authority = ?
        WHERE id = ?
      `)
        .bind(
          String(
            authority
          ),
          paymentId
        )
        .run();
    } catch (dbError) {
      console.error(
        "PAYMENT V2 AUTHORITY SAVE ERROR:",
        dbError
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
      "https://www.zarinpal.com/pg/StartPay/" +
      authority;

    return json({
      ok:
        true,
      payment_url:
        paymentUrl,
      payment_id:
        paymentId,
      authority:
        String(
          authority
        )
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

async function paymentVerifyApi(request, env) {
  const url =
    new URL(
      request.url
    );

  const paymentId =
    url.searchParams.get(
      "payment_id"
    );

  const authority =
    url.searchParams.get(
      "Authority"
    );

  const status =
    url.searchParams.get(
      "Status"
    );

  if (!paymentId) {
    return Response.redirect(
      new URL(
        "/?payment=error",
        request.url
      ).toString(),
      302
    );
  }

  const payment =
    await env.DB.prepare(`
      SELECT *
      FROM payments_v2
      WHERE id = ?
    `)
      .bind(
        paymentId
      )
      .first();

  if (!payment) {
    return Response.redirect(
      new URL(
        "/?payment=error&reason=payment-not-found",
        request.url
      ).toString(),
      302
    );
  }

  if (
    payment.status ===
    "paid"
  ) {
    return Response.redirect(
      new URL(
        "/?payment=success",
        request.url
      ).toString(),
      302
    );
  }

  if (
    status !== "OK" ||
    !authority
  ) {
    try {
      await env.DB.prepare(`
        UPDATE payments_v2
        SET status = 'cancelled'
        WHERE id = ?
          AND status = 'pending'
      `)
        .bind(
          paymentId
        )
        .run();
    } catch (error) {
      console.error(
        "PAYMENT V2 CANCEL UPDATE ERROR:",
        error
      );
    }

    return Response.redirect(
      new URL(
        "/?payment=cancel",
        request.url
      ).toString(),
      302
    );
  }

  const merchantId =
    String(
      env.ZARINPAL_MERCHANT_ID ||
      ""
    ).trim();

  if (!merchantId) {
    return Response.redirect(
      new URL(
        "/?payment=error&reason=merchant-not-configured",
        request.url
      ).toString(),
      302
    );
  }

  if (
    payment.authority &&
    String(
      payment.authority
    ) !== String(
      authority
    )
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

    return Response.redirect(
      new URL(
        "/?payment=error&reason=authority-mismatch",
        request.url
      ).toString(),
      302
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
    return Response.redirect(
      new URL(
        "/?payment=error&reason=invalid-amount",
        request.url
      ).toString(),
      302
    );
  }

  const amountRial =
    amountToman * 10;

  try {
    const response =
      await fetch(
        "https://api.zarinpal.com/pg/v4/payment/verify.json",
        {
          method:
            "POST",
          headers: {
            "Content-Type":
              "application/json",
            "Accept":
              "application/json"
          },
          body:
            JSON.stringify({
              merchant_id:
                merchantId,
              amount:
                amountRial,
              authority:
                authority
            })
        }
      );

    const rawResponse =
      await response.text();

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
        rawResponse
      );

      return Response.redirect(
        new URL(
          "/?payment=error&reason=invalid-gateway-response",
          request.url
        ).toString(),
        302
      );
    }

    if (
      !response.ok ||
      !data.data
    ) {
      try {
        await env.DB.prepare(`
          UPDATE payments_v2
          SET status = 'failed'
          WHERE id = ?
            AND status = 'pending'
        `)
          .bind(
            paymentId
          )
          .run();
      } catch (error) {
        console.error(
          "PAYMENT V2 FAILED UPDATE ERROR:",
          error
        );
      }

      return Response.redirect(
        new URL(
          "/?payment=failed",
          request.url
        ).toString(),
        302
      );
    }

    const code =
      Number(
        data.data.code
      );

    if (
      code !== 100 &&
      code !== 101
    ) {
      try {
        await env.DB.prepare(`
          UPDATE payments_v2
          SET status = 'failed'
          WHERE id = ?
            AND status = 'pending'
        `)
          .bind(
            paymentId
          )
          .run();
      } catch (error) {
        console.error(
          "PAYMENT V2 FAILED STATUS UPDATE ERROR:",
          error
        );
      }

      return Response.redirect(
        new URL(
          "/?payment=failed",
          request.url
        ).toString(),
        302
      );
    }

    const existingSubscription =
      await env.DB.prepare(`
        SELECT id, expires_at
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

      await env.DB.prepare(`
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
      await env.DB.prepare(`
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
        (?, ?, ?, ?, ?, 'active')
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

    await env.DB.prepare(`
      UPDATE payments_v2
      SET
        status = 'paid',
        authority = ?,
        paid_at = ?
      WHERE id = ?
        AND status != 'paid'
    `)
      .bind(
        authority,
        new Date().toISOString(),
        paymentId
      )
      .run();

    return Response.redirect(
      new URL(
        "/?payment=success",
        request.url
      ).toString(),
      302
    );

  } catch (error) {
    console.error(
      "PAYMENT VERIFY ERROR:",
      error
    );

    return Response.redirect(
      new URL(
        "/?payment=error&reason=verify-error",
        request.url
      ).toString(),
      302
    );
  }
}

async function withdrawalApi(request, env) {
  const user =
    await requireUser(
      request,
      env
    );

  if (!user)
    return json(
      {
        error:
          "برای برداشت وارد حساب شوید."
      },
      401
    );

  const body =
    await bodyJson(request);

  const amount =
    Number(
      body.amount || 0
    );

  const method =
    String(
      body.method ||
      "bank"
    );

  const destination =
    String(
      body.destination ||
      ""
    ).trim();

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  )
    return json(
      {
        error:
          "مبلغ برداشت معتبر نیست."
      },
      400
    );

  if (!destination)
    return json(
      {
        error:
          "مقصد برداشت را وارد کنید."
      },
      400
    );

  if (
    amount >
    Number(
      user.balance || 0
    )
  )
    return json(
      {
        error:
          "موجودی کافی نیست."
      },
      400
    );

  const withdrawalId =
    randomHex(16);

  const result =
    await env.DB.prepare(`
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
  )
    return json(
      {
        error:
          "موجودی کافی نیست."
      },
      400
    );

  await env.DB.prepare(`
    INSERT INTO withdrawals
    (id,user_id,amount,method,destination,status,created_at)
    VALUES (?,?,?,?,?,'pending',?)
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

async function myWithdrawalsApi(request, env) {
  const user =
    await requireUser(
      request,
      env
    );

  if (!user)
    return json(
      {
        error:
          "نشست نامعتبر است."
      },
      401
    );

  const rows =
    await env.DB.prepare(`
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
      .bind(
        user.id
      )
      .all();

  return json({
    withdrawals:
      rows.results || []
  });
}

async function adminLoginApi(request, env) {
  const body =
    await bodyJson(request);

  const password =
    String(
      body.password || ""
    );

  if (!env.ADMIN_PASSWORD)
    return json(
      {
        error:
          "ADMIN_PASSWORD در Worker تنظیم نشده است."
      },
      500
    );

  if (
    password !==
    env.ADMIN_PASSWORD
  )
    return json(
      {
        error:
          "رمز مدیریت اشتباه است."
      },
      401
    );

  const secret =
    getAuthSecret(env);

  const token =
    await createToken(
      {
        admin: true,
        exp:
          Date.now() +
          12 * 60 * 60 * 1000
      },
      secret
    );

  return json({
    token
  });
}

async function adminUsersApi(request, env) {
  if (
    !(await requireAdmin(
      request,
      env
    ))
  )
    return json(
      {
        error:
          "دسترسی غیرمجاز."
      },
      403
    );

  const rows =
    await env.DB.prepare(`
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

async function adminPaymentsApi(request, env) {
  if (
    !(await requireAdmin(
      request,
      env
    ))
  )
    return json(
      {
        error:
          "دسترسی غیرمجاز."
      },
      403
    );

  const rows =
    await env.DB.prepare(`
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
      (rows.results || [])
        .map(
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

async function adminWithdrawalsApi(request, env) {
  if (
    !(await requireAdmin(
      request,
      env
    ))
  )
    return json(
      {
        error:
          "دسترسی غیرمجاز."
      },
      403
    );

  const rows =
    await env.DB.prepare(`
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

async function adminProcessWithdrawalApi(request, env) {
  if (
    !(await requireAdmin(
      request,
      env
    ))
  )
    return json(
      {
        error:
          "دسترسی غیرمجاز."
      },
      403
    );

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
  )
    return json(
      {
        error:
          "عملیات نامعتبر است."
      },
      400
    );

  const withdrawal =
    await env.DB.prepare(`
      SELECT *
      FROM withdrawals
      WHERE id = ?
    `)
      .bind(id)
      .first();

  if (!withdrawal)
    return json(
      {
        error:
          "درخواست برداشت پیدا نشد."
      },
      404
    );

  if (
    withdrawal.status !==
    "pending"
  )
    return json(
      {
        error:
          "این درخواست قبلاً پردازش شده است."
      },
      400
    );

  if (
    action ===
    "rejected"
  ) {
    await env.DB.prepare(`
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

  await env.DB.prepare(`
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
      !!env.ZARINPAL_MERCHANT_ID
  });
}

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

      await initDatabase(
        env
      );

      const url =
        new URL(
          request.url
        );

      const path =
        url.pathname;

      let response;

      if (
        path ===
        "/health"
      ) {
        response =
          await healthApi(
            env
          );
      }

      else if (
        path ===
          "/api/signup" &&
        request.method ===
          "POST"
      ) {
        response =
          await signupApi(
            request,
            env
          );
      }

      else if (
        path ===
          "/api/login" &&
        request.method ===
          "POST"
      ) {
        response =
          await loginApi(
            request,
            env
          );
      }

      else if (
        path ===
          "/api/me" &&
        request.method ===
          "GET"
      ) {
        response =
          await meApi(
            request,
            env
          );
      }

      else if (
        path ===
          "/api/forgot-password" &&
        request.method ===
          "POST"
      ) {
        response =
          await forgotPasswordApi(
            request,
            env
          );
      }

      else if (
        path ===
          "/api/reset-password" &&
        request.method ===
          "POST"
      ) {
        response =
          await resetPasswordApi(
            request,
            env
          );
      }

      else if (
        path ===
          "/api/ai/chat" &&
        request.method ===
          "POST"
      ) {
        response =
          await aiChatApi(
            request,
            env
          );
      }

      else if (
        path ===
          "/api/plans" &&
        request.method ===
          "GET"
      ) {
        response =
          await plansApi(
            env
          );
      }

      else if (
        path ===
          "/api/payment/request" &&
        request.method ===
          "POST"
      ) {
        response =
          await paymentRequestApi(
            request,
            env
          );
      }

      else if (
        path ===
          "/api/payment/verify" &&
        request.method ===
          "GET"
      ) {
        response =
          await paymentVerifyApi(
            request,
            env
          );
      }

      else if (
        path ===
          "/api/withdrawal" &&
        request.method ===
          "POST"
      ) {
        response =
          await withdrawalApi(
            request,
            env
          );
      }

      else if (
        path ===
          "/api/my-withdrawals" &&
        request.method ===
          "GET"
      ) {
        response =
          await myWithdrawalsApi(
            request,
            env
          );
      }

      else if (
        path ===
          "/api/admin/login" &&
        request.method ===
          "POST"
      ) {
        response =
          await adminLoginApi(
            request,
            env
          );
      }

      else if (
        path ===
          "/api/admin/users" &&
        request.method ===
          "GET"
      ) {
        response =
          await adminUsersApi(
            request,
            env
          );
      }

      else if (
        path ===
          "/api/admin/payments" &&
        request.method ===
          "GET"
      ) {
        response =
          await adminPaymentsApi(
            request,
            env
          );
      }

      else if (
        path ===
          "/api/admin/withdrawals" &&
        request.method ===
          "GET"
      ) {
        response =
          await adminWithdrawalsApi(
            request,
            env
          );
      }

      else if (
        path ===
          "/api/admin/withdrawals/process" &&
        request.method ===
          "POST"
      ) {
        response =
          await adminProcessWithdrawalApi(
            request,
            env
          );
      }

      else if (
        path === "/" ||
        path === "/index.html"
      ) {
        response =
          html(
            renderHomepage()
          );
      }

      else {
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
