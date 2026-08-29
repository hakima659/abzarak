export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
    // هوش مصنوعی
    // =========================
    if (request.method === "POST" && url.pathname === "/api/ai") {
      try {
        const body = await request.json();
        const prompt = String(body.prompt || "").trim();

        if (!prompt) {
          return Response.json(
            { error: "لطفاً پیام خود را بنویسید." },
            { status: 400 }
          );
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct-fast",
          {
            messages: [
              {
                role: "system",
                content:
                  "تو یک دستیار هوش مصنوعی فارسی هستی. پاسخ‌ها را واضح، مفید و دوستانه به زبان فارسی بده."
              },
              {
                role: "user",
                content: prompt
              }
            ]
          }
        );

        return Response.json({
          response: result.response || "پاسخی دریافت نشد."
        });
      } catch (error) {
        return Response.json(
          {
            error:
              "خطا در دریافت پاسخ هوش مصنوعی: " +
              (error?.message || String(error))
          },
          { status: 500 }
        );
      }
    }

    // =========================
    // ایجاد جدول‌های D1
    // =========================
    if (request.method === "POST" && url.pathname === "/api/setup") {
      try {
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            balance REAL DEFAULT 0,
            created_at TEXT
          )
        `).run();

        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS withdrawals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account_id INTEGER,
            amount REAL,
            method TEXT,
            payment TEXT,
            status TEXT DEFAULT 'pending',
            created_at TEXT
          )
        `).run();

        return Response.json({
          success: true,
          message: "پایگاه داده آماده شد."
        });
      } catch (error) {
        return Response.json(
          {
            error: error?.message || String(error)
          },
          { status: 500 }
        );
      }
    }

    // =========================
    // دریافت حساب
    // =========================
    if (request.method === "GET" && url.pathname === "/api/account") {
      try {
        const account = await env.DB.prepare(
          "SELECT * FROM accounts ORDER BY id ASC LIMIT 1"
        ).first();

        return Response.json({
          account: account || null
        });
      } catch (error) {
        return Response.json(
          {
            error: error?.message || String(error)
          },
          { status: 500 }
        );
      }
    }

    // =========================
    // ذخیره حساب
    // =========================
    if (request.method === "POST" && url.pathname === "/api/account") {
      try {
        const body = await request.json();

        const name = String(body.name || "").trim();
        const email = String(body.email || "").trim();

        if (!name || !email) {
          return Response.json(
            { error: "نام و ایمیل را وارد کنید." },
            { status: 400 }
          );
        }

        const existing = await env.DB.prepare(
          "SELECT id FROM accounts ORDER BY id ASC LIMIT 1"
        ).first();

        if (existing) {
          await env.DB.prepare(
            "UPDATE accounts SET name = ?, email = ? WHERE id = ?"
          )
            .bind(name, email, existing.id)
            .run();
        } else {
          await env.DB.prepare(
            "INSERT INTO accounts (name, email, balance, created_at) VALUES (?, ?, ?, ?)"
          )
            .bind(
              name,
              email,
              0,
              new Date().toISOString()
            )
            .run();
        }

        return Response.json({
          success: true,
          message: "اطلاعات حساب ذخیره شد."
        });
      } catch (error) {
        return Response.json(
          {
            error: error?.message || String(error)
          },
          { status: 500 }
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
      try {
        const body = await request.json();

        const amount = Number(body.amount);
        const method = String(body.method || "").trim();
        const payment = String(body.payment || "").trim();

        if (!Number.isFinite(amount) || amount < 1) {
          return Response.json(
            { error: "حداقل مبلغ برداشت $1 است." },
            { status: 400 }
          );
        }

        if (!payment) {
          return Response.json(
            { error: "اطلاعات پرداخت را وارد کنید." },
            { status: 400 }
          );
        }

        const account = await env.DB.prepare(
          "SELECT * FROM accounts ORDER BY id ASC LIMIT 1"
        ).first();

        if (!account) {
          return Response.json(
            { error: "ابتدا اطلاعات حساب را ذخیره کنید." },
            { status: 400 }
          );
        }

        if (Number(account.balance) < amount) {
          return Response.json(
            { error: "موجودی کافی نیست." },
            { status: 400 }
          );
        }

        await env.DB.prepare(
          "UPDATE accounts SET balance = balance - ? WHERE id = ?"
        )
          .bind(amount, account.id)
          .run();

        await env.DB.prepare(
          `INSERT INTO withdrawals
           (account_id, amount, method, payment, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
          .bind(
            account.id,
            amount,
            method,
            payment,
            "pending",
            new Date().toISOString()
          )
          .run();

        return Response.json({
          success: true,
          message: "درخواست برداشت ثبت شد."
        });
      } catch (error) {
        return Response.json(
          {
            error: error?.message || String(error)
          },
          { status: 500 }
        );
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};


const HTML = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>دستیار هوش مصنوعی</title>

<style>

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 15px;
  background: #f4f6fb;
  font-family: Tahoma, Arial, sans-serif;
}

.container {
  max-width: 700px;
  margin: auto;
}

.card {
  background: white;
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,.08);
}

h1 {
  text-align: center;
  margin: 5px 0;
}

.subtitle {
  text-align: center;
  color: #777;
  margin-bottom: 20px;
}

.balance {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  margin: 10px;
}

.balance-label {
  text-align: center;
  color: #777;
}

button {
  border: none;
  border-radius: 10px;
  padding: 12px 18px;
  font-size: 15px;
  cursor: pointer;
  margin: 4px;
}

.primary {
  background: #2563eb;
  color: white;
}

.success {
  background: #16a34a;
  color: white;
}

.gray {
  background: #eeeeee;
}

.danger {
  background: #dc2626;
  color: white;
}

textarea,
input,
select {
  width: 100%;
  padding: 13px;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-top: 8px;
  font-size: 15px;
  font-family: Tahoma;
}

textarea {
  min-height: 110px;
  resize: vertical;
}

.answer {
  margin-top: 15px;
  background: #f8fafc;
  padding: 15px;
  border-radius: 12px;
  line-height: 2;
  white-space: pre-wrap;
}

.hidden {
  display: none;
}

.notice {
  background: #fff7ed;
  border-radius: 10px;
  padding: 12px;
  margin-top: 10px;
  line-height: 1.8;
}

.row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

</style>

</head>

<body>

<div class="container">

<div class="card">

<h1>🤖 دستیار هوش مصنوعی</h1>

<div class="subtitle">
سلام! 👋 سوالت را بنویس.
</div>

<textarea
id="prompt"
placeholder="پیامت را بنویس..."
></textarea>

<div class="row">

<button
class="primary"
onclick="sendMessage()">
ارسال
</button>

<button
class="gray"
onclick="clearChat()">
🗑️ پاک کردن گفتگو
</button>

</div>

<div id="answer"></div>

</div>


<div class="card">

<h2>💰 حساب من</h2>

<div class="balance-label">
موجودی شما
</div>

<div class="balance">
$<span id="balance">0.00</span>
</div>

<div class="row">

<button
class="success"
onclick="showWithdraw()">
💵 برداشت
</button>

<button
class="gray"
onclick="showAccount()">
👤 حساب کاربری
</button>

</div>

</div>


<div
class="card hidden"
id="account">

<h2>👤 حساب کاربری</h2>

<label>
نام
</label>

<input
id="name"
placeholder="نام شما">

<label>
ایمیل
</label>

<input
id="email"
type="email"
placeholder="ایمیل شما">

<button
class="primary"
onclick="saveAccount()">
ذخیره اطلاعات
</button>

<div id="accountMessage"></div>

</div>


<div
class="card hidden"
id="withdraw">

<h2>💵 درخواست برداشت</h2>

<div class="notice">

حداقل مبلغ برداشت:
<strong>$1</strong>

<br>

درخواست برداشت در پایگاه داده ثبت می‌شود.

</div>

<label>
مبلغ برداشت
</label>

<input
id="amount"
type="number"
step="0.01"
placeholder="مثلاً 5">

<label>
روش پرداخت
</label>

<select id="method">

<option value="USDT">
USDT
</option>

<option value="Bank">
حساب بانکی
</option>

</select>

<label>
آدرس کیف پول / اطلاعات پرداخت
</label>

<input
id="payment"
placeholder="اطلاعات پرداخت را وارد کنید">

<button
class="success"
onclick="requestWithdraw()">
ثبت درخواست برداشت
</button>

<button
class="gray"
onclick="hideWithdraw()">
بستن
</button>

<div id="withdrawMessage"></div>

</div>


<div class="card">

<h3>📋 وضعیت حساب</h3>

<div id="status">
حساب فعال است.
</div>

</div>

</div>


<script>

let balance = 0;


function updateBalance(value) {

  balance = Number(value || 0);

  document.getElementById("balance")
    .textContent = balance.toFixed(2);

}


async function loadAccount() {

  try {

    const response =
      await fetch("/api/account");

    const data =
      await response.json();

    if (data.account) {

      updateBalance(data.account.balance);

      document.getElementById("name").value =
        data.account.name || "";

      document.getElementById("email").value =
        data.account.email || "";

    }

  } catch (error) {

    console.log(error);

  }

}


async function sendMessage() {

  const prompt =
    document.getElementById("prompt")
      .value.trim();

  const answer =
    document.getElementById("answer");

  if (!prompt) {

    answer.innerHTML =
      '<div class="answer">لطفاً پیام خود را بنویسید.</div>';

    return;
  }

  answer.innerHTML =
    '<div class="answer">⏳ در حال دریافت پاسخ...</div>';

  try {

    const response =
      await fetch("/api/ai", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          prompt: prompt
        })

      });

    const data =
      await response.json();

    if (data.error) {

      answer.innerHTML =
        '<div class="answer">❌ ' +
        escapeHtml(data.error) +
        '</div>';

      return;
    }

    answer.innerHTML =
      '<div class="answer">' +
      escapeHtml(data.response) +
      '</div>';

  } catch (error) {

    answer.innerHTML =
      '<div class="answer">❌ خطا در اتصال به هوش مصنوعی</div>';

  }
}


function clearChat() {

  document.getElementById("prompt").value = "";

  document.getElementById("answer").innerHTML = "";

}


function showWithdraw() {

  document
    .getElementById("withdraw")
    .classList.remove("hidden");

}


function hideWithdraw() {

  document
    .getElementById("withdraw")
    .classList.add("hidden");

}


function showAccount() {

  document
    .getElementById("account")
    .classList.remove("hidden");

}


async function saveAccount() {

  const name =
    document.getElementById("name").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const message =
    document.getElementById("accountMessage");

  if (!name || !email) {

    message.innerHTML =
      '<div class="notice">❌ نام و ایمیل را وارد کنید.</div>';

    return;
  }

  try {

    const response =
      await fetch("/api/account", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name: name,
          email: email
        })

      });

    const data =
      await response.json();

    if (data.error) {

      message.innerHTML =
        '<div class="notice">❌ ' +
        escapeHtml(data.error) +
        '</div>';

      return;
    }

    message.innerHTML =
      '<div class="notice">✅ اطلاعات ذخیره شد.</div>';

  } catch (error) {

    message.innerHTML =
      '<div class="notice">❌ خطا در اتصال به سرور.</div>';

  }

}


async function requestWithdraw() {

  const amount =
    parseFloat(
      document.getElementById("amount").value
    );

  const method =
    document.getElementById("method").value;

  const payment =
    document.getElementById("payment").value.trim();

  const message =
    document.getElementById("withdrawMessage");


  if (!amount || amount < 1) {

    message.innerHTML =
      '<div class="notice">❌ حداقل برداشت $1 است.</div>';

    return;
  }


  if (amount > balance) {

    message.innerHTML =
      '<div class="notice">❌ موجودی کافی نیست.</div>';

    return;
  }


  if (!payment) {

    message.innerHTML =
      '<div class="notice">❌ اطلاعات پرداخت را وارد کنید.</div>';

    return;
  }


  try {

    const response =
      await fetch("/api/withdraw", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          amount: amount,
          method: method,
          payment: payment
        })

      });

    const data =
      await response.json();

    if (data.error) {

      message.innerHTML =
        '<div class="notice">❌ ' +
        escapeHtml(data.error) +
        '</div>';

      return;
    }

    message.innerHTML =
      '<div class="notice">✅ درخواست برداشت ثبت شد.</div>';

    document.getElementById("amount").value = "";

    document.getElementById("payment").value = "";

    await loadAccount();

  } catch (error) {

    message.innerHTML =
      '<div class="notice">❌ خطا در اتصال به سرور.</div>';

  }

}


function escapeHtml(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


document
  .getElementById("prompt")
  .addEventListener(
    "keydown",
    function(event) {

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        sendMessage();

      }

    }
  );


loadAccount();

</script>

</body>

</html>
`;
