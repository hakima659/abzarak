export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: {
          "content-type": "application/json; charset=UTF-8",
          "access-control-allow-origin": "*",
          "access-control-allow-headers": "Content-Type, X-User-ID, X-Admin-Password",
          "access-control-allow-methods": "GET,POST,OPTIONS"
        }
      });

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-headers": "Content-Type, X-User-ID, X-Admin-Password",
          "access-control-allow-methods": "GET,POST,OPTIONS"
        }
      });
    }

    // =========================
    // آماده‌سازی دیتابیس
    // =========================
    if (env.DB) {
      try {
        await env.DB.exec(`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT DEFAULT 'کاربر',
            balance REAL DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS withdrawals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            amount REAL NOT NULL,
            wallet TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          );
        `);
      } catch (e) {
        console.log("DB init:", e.message);
      }
    }

    // =========================
    // صفحه اصلی
    // =========================
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(HTML, {
        headers: {
          "content-type": "text/html; charset=UTF-8"
        }
      });
    }

    // =========================
    // وضعیت حساب
    // =========================
    if (request.method === "GET" && url.pathname === "/api/account") {
      const userId = request.headers.get("X-User-ID");

      if (!userId) {
        return json({ ok: false, error: "شناسه کاربر وجود ندارد" }, 400);
      }

      let user = await env.DB
        .prepare("SELECT * FROM users WHERE id = ?")
        .bind(userId)
        .first();

      if (!user) {
        await env.DB
          .prepare(
            "INSERT INTO users (id, name, balance) VALUES (?, ?, ?)"
          )
          .bind(userId, "کاربر جدید", 0)
          .run();

        user = await env.DB
          .prepare("SELECT * FROM users WHERE id = ?")
          .bind(userId)
          .first();
      }

      return json({
        ok: true,
        user: {
          id: user.id,
          name: user.name,
          balance: Number(user.balance || 0),
          created_at: user.created_at
        }
      });
    }

    // =========================
    // ارسال پیام به AI
    // =========================
    if (request.method === "POST" && url.pathname === "/api/chat") {
      const userId = request.headers.get("X-User-ID");

      if (!userId) {
        return json({ ok: false, error: "شناسه کاربر وجود ندارد" }, 400);
      }

      let body;

      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "اطلاعات نامعتبر است" }, 400);
      }

      const message = String(body.message || "").trim();

      if (!message) {
        return json({ ok: false, error: "پیامت را بنویس" }, 400);
      }

      if (message.length > 6000) {
        return json(
          { ok: false, error: "پیام خیلی طولانی است" },
          400
        );
      }

      // ایجاد کاربر در صورت نبودن
      const existing = await env.DB
        .prepare("SELECT id FROM users WHERE id = ?")
        .bind(userId)
        .first();

      if (!existing) {
        await env.DB
          .prepare(
            "INSERT INTO users (id, name, balance) VALUES (?, ?, ?)"
          )
          .bind(userId, "کاربر جدید", 0)
          .run();
      }

      // ذخیره پیام کاربر
      await env.DB
        .prepare(
          "INSERT INTO messages (user_id, role, content) VALUES (?, ?, ?)"
        )
        .bind(userId, "user", message)
        .run();

      // دریافت چند پیام آخر برای حفظ گفتگو
      const history = await env.DB
        .prepare(`
          SELECT role, content
          FROM messages
          WHERE user_id = ?
          ORDER BY id DESC
          LIMIT 12
        `)
        .bind(userId)
        .all();

      const messages = [
        {
          role: "system",
          content:
            "تو یک دستیار هوش مصنوعی فارسی‌زبان، دقیق، مودب و کاربردی هستی. پاسخ‌ها را به فارسی بده مگر کاربر زبان دیگری بخواهد."
        },
        ...(history.results || [])
          .reverse()
          .map((x) => ({
            role: x.role,
            content: x.content
          }))
      ];

      try {
        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct-fast",
          {
            messages,
            max_tokens: 700,
            temperature: 0.7
          }
        );

        const answer =
          result?.response ||
          result?.result?.response ||
          "متأسفانه پاسخ دریافت نشد.";

        // ذخیره پاسخ AI
        await env.DB
          .prepare(
            "INSERT INTO messages (user_id, role, content) VALUES (?, ?, ?)"
          )
          .bind(userId, "assistant", answer)
          .run();

        return json({
          ok: true,
          answer
        });
      } catch (e) {
        console.log("AI ERROR:", e);

        return json(
          {
            ok: false,
            error: "خطا در دریافت پاسخ هوش مصنوعی",
            detail: e.message
          },
          502
        );
      }
    }

    // =========================
    // ثبت درخواست برداشت
    // =========================
    if (
      request.method === "POST" &&
      url.pathname === "/api/withdraw"
    ) {
      const userId = request.headers.get("X-User-ID");

      if (!userId) {
        return json({ ok: false, error: "شناسه کاربر وجود ندارد" }, 400);
      }

      let body;

      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "اطلاعات نامعتبر است" }, 400);
      }

      const amount = Number(body.amount);
      const wallet = String(body.wallet || "").trim();

      if (!Number.isFinite(amount) || amount <= 0) {
        return json({ ok: false, error: "مبلغ برداشت نامعتبر است" }, 400);
      }

      if (amount < 10) {
        return json(
          { ok: false, error: "حداقل مبلغ برداشت 10 دلار است" },
          400
        );
      }

      if (!wallet || wallet.length < 10) {
        return json(
          { ok: false, error: "آدرس کیف پول را وارد کن" },
          400
        );
      }

      const user = await env.DB
        .prepare("SELECT * FROM users WHERE id = ?")
        .bind(userId)
        .first();

      if (!user) {
        return json({ ok: false, error: "حساب پیدا نشد" }, 404);
      }

      const balance = Number(user.balance || 0);

      if (amount > balance) {
        return json(
          {
            ok: false,
            error: "موجودی کافی نیست",
            balance
          },
          400
        );
      }

      // کم کردن موجودی و ثبت برداشت
      await env.DB.batch([
        env.DB
          .prepare(
            "UPDATE users SET balance = balance - ? WHERE id = ?"
          )
          .bind(amount, userId),

        env.DB
          .prepare(
            "INSERT INTO withdrawals (user_id, amount, wallet) VALUES (?, ?, ?)"
          )
          .bind(userId, amount, wallet)
      ]);

      return json({
        ok: true,
        message: "درخواست برداشت ثبت شد",
        amount,
        wallet
      });
    }

    // =========================
    // پنل مدیریت
    // =========================
    if (
      request.method === "POST" &&
      url.pathname === "/api/admin/credit"
    ) {
      const password = request.headers.get("X-Admin-Password");

      if (!env.ADMIN_PASSWORD) {
        return json(
          { ok: false, error: "ADMIN_PASSWORD تنظیم نشده است" },
          500
        );
      }

      if (password !== env.ADMIN_PASSWORD) {
        return json(
          { ok: false, error: "رمز مدیریت اشتباه است" },
          401
        );
      }

      let body;

      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "اطلاعات نامعتبر است" }, 400);
      }

      const userId = String(body.userId || "").trim();
      const amount = Number(body.amount);

      if (!userId || !Number.isFinite(amount) || amount === 0) {
        return json(
          { ok: false, error: "شناسه کاربر و مبلغ را درست وارد کن" },
          400
        );
      }

      const user = await env.DB
        .prepare("SELECT id FROM users WHERE id = ?")
        .bind(userId)
        .first();

      if (!user) {
        return json({ ok: false, error: "کاربر پیدا نشد" }, 404);
      }

      await env.DB
        .prepare(
          "UPDATE users SET balance = balance + ? WHERE id = ?"
        )
        .bind(amount, userId)
        .run();

      const updated = await env.DB
        .prepare("SELECT balance FROM users WHERE id = ?")
        .bind(userId)
        .first();

      return json({
        ok: true,
        message: "موجودی تغییر کرد",
        balance: Number(updated.balance || 0)
      });
    }

    // =========================
    // لیست کاربران مدیریت
    // =========================
    if (
      request.method === "GET" &&
      url.pathname === "/api/admin/users"
    ) {
      const password = request.headers.get("X-Admin-Password");

      if (!env.ADMIN_PASSWORD || password !== env.ADMIN_PASSWORD) {
        return json(
          { ok: false, error: "دسترسی غیرمجاز" },
          401
        );
      }

      const users = await env.DB
        .prepare(`
          SELECT id, name, balance, created_at
          FROM users
          ORDER BY created_at DESC
          LIMIT 200
        `)
        .all();

      return json({
        ok: true,
        users: users.results || []
      });
    }

    // =========================
    // برداشت‌های مدیریت
    // =========================
    if (
      request.method === "GET" &&
      url.pathname === "/api/admin/withdrawals"
    ) {
      const password = request.headers.get("X-Admin-Password");

      if (!env.ADMIN_PASSWORD || password !== env.ADMIN_PASSWORD) {
        return json(
          { ok: false, error: "دسترسی غیرمجاز" },
          401
        );
      }

      const withdrawals = await env.DB
        .prepare(`
          SELECT *
          FROM withdrawals
          ORDER BY id DESC
          LIMIT 200
        `)
        .all();

      return json({
        ok: true,
        withdrawals: withdrawals.results || []
      });
    }

    return json(
      {
        ok: false,
        error: "صفحه یا مسیر پیدا نشد"
      },
      404
    );
  }
};

// ======================================================
// HTML
// ======================================================

const HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ابزارک AI</title>

<style>
*{
  box-sizing:border-box;
}

body{
  margin:0;
  font-family:Tahoma,Arial,sans-serif;
  background:#f5f7fb;
  color:#172033;
}

.container{
  width:min(900px,94%);
  margin:25px auto;
}

.card{
  background:white;
  border-radius:20px;
  padding:20px;
  margin-bottom:18px;
  box-shadow:0 5px 25px rgba(0,0,0,.07);
}

h1{
  margin-top:0;
}

.balance{
  font-size:28px;
  font-weight:bold;
  margin:8px 0;
}

.chat{
  min-height:360px;
  max-height:55vh;
  overflow:auto;
  padding:5px;
}

.msg{
  padding:13px;
  border-radius:15px;
  margin:10px 0;
  line-height:1.9;
  white-space:pre-wrap;
}

.user{
  background:#e8f0ff;
}

.ai{
  background:#f0f1f5;
}

textarea,
input{
  width:100%;
  padding:13px;
  border:1px solid #ddd;
  border-radius:12px;
  font-size:16px;
  outline:none;
  margin:7px 0;
}

button{
  border:0;
  border-radius:12px;
  padding:13px 18px;
  font-size:16px;
  cursor:pointer;
  margin:4px;
  background:#111827;
  color:white;
}

button:disabled{
  opacity:.5;
}

.row{
  display:flex;
  gap:8px;
  align-items:center;
}

.row textarea{
  flex:1;
}

.small{
  color:#667085;
  font-size:13px;
}

.danger{
  background:#b42318;
}

.green{
  background:#067647;
}

.hidden{
  display:none;
}

#status{
  margin:8px 0;
  color:#667085;
}
</style>
</head>

<body>

<div class="container">

  <div class="card">
    <h1>🤖 ابزارک AI</h1>
    <div class="small">
      دستیار هوش مصنوعی فارسی + حساب کاربری
    </div>

    <div style="margin-top:15px">
      💰 موجودی حساب
      <div class="balance" id="balance">$0.00</div>
    </div>
  </div>

  <div class="card">
    <h2>💬 دستیار هوش مصنوعی</h2>

    <div id="chat" class="chat">
      <div class="msg ai">
        سلام! 👋 من آماده‌ام. چه کمکی از من می‌خواهی؟
      </div>
    </div>

    <div id="status"></div>

    <div class="row">
      <textarea
        id="message"
        rows="2"
        placeholder="پیامت را بنویس..."
      ></textarea>

      <button id="send">
        ارسال
      </button>
    </div>

    <button class="danger" onclick="clearChat()">
      🗑️ پاک کردن گفتگو
    </button>
  </div>

  <div class="card">
    <h2>💵 برداشت</h2>

    <div class="small">
      حداقل برداشت: 10 دلار
    </div>

    <input
      id="amount"
      type="number"
      step="0.01"
      min="10"
      placeholder="مبلغ برداشت به دلار"
    >

    <input
      id="wallet"
      type="text"
      placeholder="آدرس کیف پول USDT"
    >

    <button class="green" onclick="withdraw()">
      درخواست برداشت
    </button>

    <div id="withdrawStatus"></div>
  </div>

</div>

<script>
const userId =
  localStorage.getItem("ai_user_id") ||
  crypto.randomUUID();

localStorage.setItem("ai_user_id", userId);

const chat = document.getElementById("chat");
const message = document.getElementById("message");
const send = document.getElementById("send");
const statusBox = document.getElementById("status");

async function api(path, options = {}) {
  options.headers = {
    ...(options.headers || {}),
    "X-User-ID": userId,
    "Content-Type": "application/json"
  };

  const response = await fetch(path, options);

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("پاسخ نامعتبر از سرور");
  }

  if (!response.ok) {
    throw new Error(data.error || "خطا");
  }

  return data;
}

async function loadAccount() {
  try {
    const data = await api("/api/account");

    if (data.ok) {
      document.getElementById("balance").textContent =
        "$" + Number(data.user.balance || 0).toFixed(2);
    }
  } catch(e) {
    console.log(e);
  }
}

function addMessage(text, type) {
  const div = document.createElement("div");

  div.className =
    "msg " + (type === "user" ? "user" : "ai");

  div.textContent = text;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  return div;
}

async function sendMessage() {
  const text = message.value.trim();

  if (!text) return;

  send.disabled = true;
  message.disabled = true;

  addMessage(text, "user");

  message.value = "";

  statusBox.textContent = "⏳ در حال دریافت پاسخ...";

  try {
    const data = await api("/api/chat", {
      method:"POST",
      body:JSON.stringify({
        message:text
      })
    });

    if (!data.ok) {
      throw new Error(data.error || "خطا");
    }

    addMessage(data.answer, "ai");

    statusBox.textContent = "";
  } catch(e) {
    addMessage(
      "❌ " + e.message,
      "ai"
    );

    statusBox.textContent = "";
  }

  send.disabled = false;
  message.disabled = false;
  message.focus();
}

send.addEventListener("click", sendMessage);

message.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function clearChat() {
  chat.innerHTML =
    '<div class="msg ai">گفتگو پاک شد. 👋</div>';
}

async function withdraw() {
  const amount =
    Number(document.getElementById("amount").value);

  const wallet =
    document.getElementById("wallet").value.trim();

  const box =
    document.getElementById("withdrawStatus");

  box.textContent = "⏳ در حال ثبت درخواست...";

  try {
    const data = await api("/api/withdraw", {
      method:"POST",
      body:JSON.stringify({
        amount,
        wallet
      })
    });

    box.textContent =
      "✅ " + data.message;

    document.getElementById("amount").value = "";
    document.getElementById("wallet").value = "";

    await loadAccount();
  } catch(e) {
    box.textContent =
      "❌ " + e.message;
  }
}

loadAccount();
</script>

</body>
</html>`;
