// =============================================================
// worker.js — دستیار هوشمند: صفحه اصلی + احراز هویت + حساب + پلن‌ها + هوش مصنوعی
//
// Bindings required in Cloudflare dashboard:
//   DB -> D1 database
//   AI -> Workers AI binding
// =============================================================

// ---------------- Utilities ----------------

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

function html(content) {
  return new Response(content, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function uuid() {
  return crypto.randomUUID();
}

async function hashPassword(password) {
  const iterations = 100000;
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = [...saltBytes]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const hashHex = [...new Uint8Array(derivedBits)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `pbkdf2:${iterations}:${saltHex}:${hashHex}`;
}

async function verifyPassword(password, stored) {
  const parts = stored.split(":");

  if (parts.length !== 4 || parts[0] !== "pbkdf2") {
    return false;
  }

  const iterations = parseInt(parts[1], 10);

  const saltBytes = new Uint8Array(
    parts[2].match(/.{1,2}/g).map((b) => parseInt(b, 16))
  );

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const hashHex = [...new Uint8Array(derivedBits)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (hashHex.length !== parts[3].length) {
    return false;
  }

  let diff = 0;

  for (let i = 0; i < hashHex.length; i++) {
    diff |= hashHex.charCodeAt(i) ^ parts[3].charCodeAt(i);
  }

  return diff === 0;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function getUserFromToken(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");

  if (!token) return null;

  const session = await env.DB
    .prepare("SELECT user_id FROM sessions WHERE token = ?")
    .bind(token)
    .first();

  if (!session) return null;

  const user = await env.DB
    .prepare(
      "SELECT id, name, email, balance FROM users WHERE id = ?"
    )
    .bind(session.user_id)
    .first();

  return user || null;
}

// ---------------- Auth routes ----------------

async function handleSignup(request, env) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json({ error: "بدنه درخواست نامعتبر است" }, 400);
  }

  const { name, email, password } = body;

  if (!email || !password) {
    return json(
      { error: "ایمیل و رمز عبور الزامی است" },
      400
    );
  }

  if (!isValidEmail(email)) {
    return json(
      { error: "فرمت ایمیل نامعتبر است" },
      400
    );
  }

  if (password.length < 6) {
    return json(
      { error: "رمز عبور باید حداقل ۶ کاراکتر باشد" },
      400
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await env.DB
    .prepare("SELECT id FROM users WHERE email = ?")
    .bind(normalizedEmail)
    .first();

  if (existing) {
    return json(
      { error: "این ایمیل قبلاً ثبت‌نام کرده است" },
      409
    );
  }

  const passwordHash = await hashPassword(password);
  const userId = uuid();
  const createdAt = new Date().toISOString();

  await env.DB
    .prepare(
      "INSERT INTO users (id, name, email, password_hash, balance, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(
      userId,
      name || "",
      normalizedEmail,
      passwordHash,
      0,
      createdAt
    )
    .run();

  const token = uuid() + uuid();

  await env.DB
    .prepare(
      "INSERT INTO sessions (id, user_id, token, created_at) VALUES (?, ?, ?, ?)"
    )
    .bind(uuid(), userId, token, createdAt)
    .run();

  return json({
    success: true,
    user: {
      id: userId,
      name: name || "",
      email: normalizedEmail,
      balance: 0,
    },
    token,
  });
}

async function handleLogin(request, env) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json(
      { error: "بدنه درخواست نامعتبر است" },
      400
    );
  }

  const { email, password } = body;

  if (!email || !password) {
    return json(
      { error: "ایمیل و رمز عبور الزامی است" },
      400
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await env.DB
    .prepare(
      "SELECT id, name, email, password_hash, balance FROM users WHERE email = ?"
    )
    .bind(normalizedEmail)
    .first();

  const genericError = {
    error: "ایمیل یا رمز عبور اشتباه است",
  };

  if (!user) {
    return json(genericError, 401);
  }

  const isValid = await verifyPassword(
    password,
    user.password_hash
  );

  if (!isValid) {
    if (!user.password_hash.startsWith("pbkdf2:")) {
      return json(
        {
          error:
            "رمز عبور این حساب نیاز به بازیابی دارد (فرمت قدیمی)",
        },
        401
      );
    }

    return json(genericError, 401);
  }

  const token = uuid() + uuid();

  await env.DB
    .prepare(
      "INSERT INTO sessions (id, user_id, token, created_at) VALUES (?, ?, ?, ?)"
    )
    .bind(
      uuid(),
      user.id,
      token,
      new Date().toISOString()
    )
    .run();

  return json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      balance: user.balance,
    },
    token,
  });
}

async function handleMe(request, env) {
  const user = await getUserFromToken(request, env);

  if (!user) {
    return json(
      { error: "نشست نامعتبر یا منقضی شده است" },
      401
    );
  }

  return json({ user });
}

// =============================================================
// AI CHAT
// =============================================================

async function handleAiChat(request, env) {
  const user = await getUserFromToken(request, env);

  if (!user) {
    return json(
      {
        error:
          "برای استفاده از هوش مصنوعی ابتدا وارد حساب شوید",
      },
      401
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json(
      { error: "بدنه درخواست نامعتبر است" },
      400
    );
  }

  const { message } = body;

  if (!message || typeof message !== "string") {
    return json(
      { error: "پیام الزامی است" },
      400
    );
  }

  if (!env.AI) {
    return json(
      {
        error:
          "سرویس هوش مصنوعی تنظیم نشده است. Binding با نام AI را به Worker اضافه کنید.",
      },
      503
    );
  }

  try {
    const aiResponse = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct-fast",
      {
        messages: [
          {
            role: "system",
            content:
              "تو یک دستیار هوشمند فارسی‌زبان هستی. مفید، دقیق، کوتاه و مودب پاسخ بده.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 512,
        temperature: 0.6,
      }
    );

    const reply =
      aiResponse?.response ||
      aiResponse?.result?.response ||
      "پاسخی از هوش مصنوعی دریافت نشد.";

    return json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error("Workers AI Error:", err);

    return json(
      {
        error:
          "خطا در ارتباط با هوش مصنوعی: " +
          (err?.message || String(err)),
      },
      500
    );
  }
}

// ---------------- Plans route ----------------

async function handlePlans(request, env) {
  return json({
    plans: [
      {
        id: "free",
        name: "رایگان",
        price: 0,
        currency: "toman",
        period: "monthly",
        messages_per_day: 10,
        features: ["۱۰ پیام در روز"],
      },
      {
        id: "basic",
        name: "پایه",
        price: 400000,
        currency: "toman",
        period: "monthly",
        messages_per_day: null,
        features: ["پیام نامحدود", "امکانات پایه"],
      },
      {
        id: "plus",
        name: "پیشرفته",
        price: 900000,
        currency: "toman",
        period: "monthly",
        messages_per_day: null,
        features: ["پیام نامحدود", "پاسخ سریع‌تر"],
      },
      {
        id: "pro",
        name: "ویژه",
        price: 2000000,
        currency: "toman",
        period: "monthly",
        messages_per_day: null,
        features: [
          "پیام نامحدود",
          "اولویت صف پاسخ‌دهی",
          "پشتیبانی اختصاصی",
        ],
      },
    ],
  });
}

// ---------------- Homepage HTML ----------------

function renderHomepage() {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>دستیار هوشمند 🤖</title>

<style>

* {
  box-sizing: border-box;
}

body {
  font-family: Tahoma, sans-serif;
  margin: 0;
  background: #f4f6fb;
  color: #1a1a2e;
}

header {
  background: #12163a;
  color: white;
  padding: 20px;
}

header h1 {
  margin: 0;
  font-size: 1.4rem;
}

header p {
  margin: 6px 0 0;
  opacity: 0.8;
  font-size: 0.85rem;
}

nav {
  display: flex;
  gap: 10px;
  padding: 16px;
  flex-wrap: wrap;
  background: white;
}

nav button {
  background: #2952e3;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 18px;
  font-size: 0.95rem;
  cursor: pointer;
}

main {
  padding: 20px;
  max-width: 480px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.card h2 {
  margin-top: 0;
  text-align: right;
}

input {
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border-radius: 10px;
  border: 1px solid #dcdfe8;
  background: #f0f2fa;
  font-size: 1rem;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;
}

.actions button {
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
}

.btn-primary {
  background: #2952e3;
  color: white;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.msg {
  padding: 12px;
  border-radius: 10px;
  margin-top: 10px;
}

.msg.error {
  background: #fdeaea;
  color: #b91c1c;
}

.msg.success {
  background: #eafaf0;
  color: #15803d;
}

.hidden {
  display: none;
}

.chat-box {
  max-height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.bubble {
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 85%;
  white-space: pre-wrap;
  word-break: break-word;
}

.bubble.user {
  background: #2952e3;
  color: white;
  align-self: flex-start;
}

.bubble.ai {
  background: #eef0f7;
  align-self: flex-end;
}

</style>
</head>

<body>

<header>
  <h1>🤖 دستیار هوش مصنوعی</h1>
  <p>دستیار هوشمند • حساب کاربری</p>
</header>

<nav>

  <button onclick="showView('account')">
    🏠 حساب
  </button>

  <button onclick="showView('ai')">
    🤖 هوش مصنوعی
  </button>

  <button onclick="showView('plans')">
    💰 پلن‌ها
  </button>

</nav>

<main>

  <div id="view-login" class="card">

    <h2>🔑 ورود به حساب</h2>

    <input
      id="login-email"
      type="email"
      placeholder="ایمیل"
    >

    <input
      id="login-password"
      type="password"
      placeholder="رمز عبور"
    >

    <div class="actions">

      <button
        class="btn-secondary"
        onclick="showView('signup')"
      >
        ثبت‌نام
      </button>

      <button
        class="btn-primary"
        onclick="doLogin()"
      >
        ورود
      </button>

    </div>

    <div id="login-msg"></div>

  </div>


  <div id="view-signup" class="card hidden">

    <h2>📝 ثبت‌نام</h2>

    <input
      id="signup-name"
      type="text"
      placeholder="نام"
    >

    <input
      id="signup-email"
      type="email"
      placeholder="ایمیل"
    >

    <input
      id="signup-password"
      type="password"
      placeholder="رمز عبور (حداقل ۶ کاراکتر)"
    >

    <div class="actions">

      <button
        class="btn-secondary"
        onclick="showView('login')"
      >
        بازگشت
      </button>

      <button
        class="btn-primary"
        onclick="doSignup()"
      >
        ثبت‌نام
      </button>

    </div>

    <div id="signup-msg"></div>

  </div>


  <div id="view-account" class="card hidden">

    <h2>🏠 حساب من</h2>

    <div id="account-info">
      در حال بارگذاری...
    </div>

    <div class="actions">

      <button
        class="btn-secondary"
        onclick="logout()"
      >
        خروج
      </button>

    </div>

  </div>


  <div id="view-ai" class="card hidden">

    <h2>🤖 گفتگو با هوش مصنوعی</h2>

    <div
      class="chat-box"
      id="chat-box"
    ></div>

    <input
      id="ai-input"
      type="text"
      placeholder="پیام خود را بنویسید..."
      onkeydown="if(event.key === 'Enter') sendAiMessage()"
    >

    <div class="actions">

      <button
        class="btn-primary"
        onclick="sendAiMessage()"
      >
        ارسال
      </button>

    </div>

    <div id="ai-msg"></div>

  </div>


  <div id="view-plans" class="card hidden">

    <h2>💰 پلن‌ها</h2>

    <div id="plans-list">
      در حال بارگذاری...
    </div>

  </div>

</main>


<script>

let token =
  localStorage.getItem('token') || null;


function showMsg(elId, text, type) {

  const el =
    document.getElementById(elId);

  el.innerHTML =
    '<div class="msg ' +
    type +
    '">' +
    escapeHtml(text) +
    '</div>';
}


function escapeHtml(text) {

  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}


function showView(name) {

  const views = [
    'login',
    'signup',
    'account',
    'ai',
    'plans'
  ];

  views.forEach(v => {

    document
      .getElementById('view-' + v)
      .classList
      .add('hidden');

  });

  if (
    (name === 'account' ||
     name === 'ai') &&
    !token
  ) {
    name = 'login';
  }

  document
    .getElementById('view-' + name)
    .classList
    .remove('hidden');

  if (name === 'account') {
    loadAccount();
  }

  if (name === 'plans') {
    loadPlans();
  }

}


async function doSignup() {

  const name =
    document.getElementById(
      'signup-name'
    ).value;

  const email =
    document.getElementById(
      'signup-email'
    ).value;

  const password =
    document.getElementById(
      'signup-password'
    ).value;

  try {

    const res =
      await fetch('/api/signup', {

        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body:
          JSON.stringify({
            name,
            email,
            password
          })

      });

    const data =
      await res.json();

    if (!res.ok) {

      showMsg(
        'signup-msg',
        data.error ||
        ('خطای ناشناخته (کد ' +
          res.status +
          ')'),
        'error'
      );

      return;
    }

    token = data.token;

    localStorage.setItem(
      'token',
      token
    );

    showView('account');

  } catch (err) {

    showMsg(
      'signup-msg',
      'خطای فنی: ' +
      err.message,
      'error'
    );

  }

}


async function doLogin() {

  const email =
    document.getElementById(
      'login-email'
    ).value;

  const password =
    document.getElementById(
      'login-password'
    ).value;

  try {

    const res =
      await fetch('/api/login', {

        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body:
          JSON.stringify({
            email,
            password
          })

      });

    const data =
      await res.json();

    if (!res.ok) {

      showMsg(
        'login-msg',
        data.error ||
        ('خطای ناشناخته (کد ' +
          res.status +
          ')'),
        'error'
      );

      return;
    }

    token = data.token;

    localStorage.setItem(
      'token',
      token
    );

    showView('account');

  } catch (err) {

    showMsg(
      'login-msg',
      'خطای فنی: ' +
      err.message,
      'error'
    );

  }

}


function logout() {

  token = null;

  localStorage.removeItem(
    'token'
  );

  showView('login');

}


async function loadAccount() {

  try {

    const res =
      await fetch('/api/me', {

        headers: {
          'Authorization':
            'Bearer ' + token
        }

      });

    const data =
      await res.json();

    if (!res.ok) {

      logout();
      return;

    }

    document
      .getElementById('account-info')
      .innerHTML =
        '<p><b>نام:</b> ' +
        escapeHtml(
          data.user.name || '-'
        ) +
        '</p>' +

        '<p><b>ایمیل:</b> ' +
        escapeHtml(
          data.user.email
        ) +
        '</p>' +

        '<p><b>موجودی:</b> ' +
        escapeHtml(
          data.user.balance
        ) +
        '</p>';

  } catch (err) {

    document
      .getElementById('account-info')
      .innerHTML =
      '<div class="msg error">' +
      'خطا در دریافت حساب: ' +
      escapeHtml(err.message) +
      '</div>';

  }

}


async function loadPlans() {

  try {

    const res =
      await fetch('/api/plans');

    const data =
      await res.json();

    document
      .getElementById('plans-list')
      .innerHTML =
      data.plans.map(p =>

        '<div style="border:1px solid #e5e7eb;border-radius:12px;padding:14px;margin-bottom:10px;">' +

        '<b>' +
        escapeHtml(p.name) +
        '</b><br>' +

        '<span style="color:#2952e3;font-size:1.1rem;">' +

        (
          p.price > 0
            ? p.price.toLocaleString('fa-IR') +
              ' تومان / ماهانه'
            : 'رایگان'
        ) +

        '</span><br>' +

        '<ul style="margin:6px 0 0;padding-right:18px;">' +

        p.features
          .map(f =>
            '<li>' +
            escapeHtml(f) +
            '</li>'
          )
          .join('') +

        '</ul>' +

        '</div>'

      ).join('');

  } catch (err) {

    document
      .getElementById('plans-list')
      .innerHTML =
      '<div class="msg error">' +
      'خطا در دریافت پلن‌ها: ' +
      escapeHtml(err.message) +
      '</div>';

  }

}


async function sendAiMessage() {

  if (!token) {

    showView('login');
    return;

  }

  const input =
    document.getElementById(
      'ai-input'
    );

  const message =
    input.value.trim();

  if (!message) return;

  const chatBox =
    document.getElementById(
      'chat-box'
    );

  chatBox.innerHTML +=
    '<div class="bubble user">' +
    escapeHtml(message) +
    '</div>';

  input.value = '';

  document
    .getElementById('ai-msg')
    .innerHTML = '';

  const sendButton =
    document.querySelector(
      '#view-ai .btn-primary'
    );

  if (sendButton) {
    sendButton.disabled = true;
    sendButton.textContent =
      'در حال پاسخ...';
  }

  try {

    const res =
      await fetch('/api/ai/chat', {

        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          'Authorization':
            'Bearer ' + token
        },

        body:
          JSON.stringify({
            message
          })

      });

    const data =
      await res.json();

    if (!res.ok) {

      showMsg(
        'ai-msg',
        data.error ||
        ('خطای ناشناخته (کد ' +
          res.status +
          ')'),
        'error'
      );

      return;
    }

    chatBox.innerHTML +=
      '<div class="bubble ai">' +
      escapeHtml(
        data.reply ||
        'پاسخی دریافت نشد.'
      ) +
      '</div>';

    chatBox.scrollTop =
      chatBox.scrollHeight;

  } catch (err) {

    showMsg(
      'ai-msg',
      'خطای فنی: ' +
      err.message,
      'error'
    );

  } finally {

    if (sendButton) {

      sendButton.disabled = false;
      sendButton.textContent =
        'ارسال';

    }

  }

}


// Initial view

showView(
  token
    ? 'account'
    : 'login'
);

</script>

</body>
</html>`;
}

// ---------------- Router ----------------

export default {

  async fetch(request, env) {

    const url =
      new URL(request.url);

    if (request.method === "OPTIONS") {
      return json({}, 204);
    }

    if (
      url.pathname === "/" &&
      request.method === "GET"
    ) {
      return html(
        renderHomepage()
      );
    }

    if (
      url.pathname === "/api/signup" &&
      request.method === "POST"
    ) {
      return handleSignup(
        request,
        env
      );
    }

    if (
      url.pathname === "/api/login" &&
      request.method === "POST"
    ) {
      return handleLogin(
        request,
        env
      );
    }

    if (
      url.pathname === "/api/me" &&
      request.method === "GET"
    ) {
      return handleMe(
        request,
        env
      );
    }

    if (
      url.pathname === "/api/plans" &&
      request.method === "GET"
    ) {
      return handlePlans(
        request,
        env
      );
    }

    if (
      url.pathname === "/api/ai/chat" &&
      request.method === "POST"
    ) {
      return handleAiChat(
        request,
        env
      );
    }

    return json(
      { error: "مسیر یافت نشد" },
      404
    );

  },

};
