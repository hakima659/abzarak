
const MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Content-Type, X-User-ID, X-Admin-Password",
      "Access-Control-Allow-Methods":
        "GET, POST, OPTIONS"
    };

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: {
          ...cors,
          "Content-Type":
            "application/json; charset=UTF-8"
        }
      });

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: cors
      });
    }

    // =========================
    // بررسی Binding ها
    // =========================

    if (!env.DB) {
      return json({
        ok: false,
        error: "Binding دیتابیس DB پیدا نشد."
      }, 500);
    }

    if (!env.AI) {
      return json({
        ok: false,
        error:
          "Binding هوش مصنوعی AI پیدا نشد. نام Binding باید دقیقاً AI باشد."
      }, 500);
    }

    // =========================
    // ساخت جدول‌ها
    // =========================

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
      return json({
        ok: false,
        error: "خطا در آماده‌سازی D1",
        detail: e.message
      }, 500);
    }

    // =========================
    // صفحه اصلی
    // =========================

    if (
      request.method === "GET" &&
      url.pathname === "/"
    ) {
      return new Response(HTML, {
        headers: {
          "Content-Type":
            "text/html; charset=UTF-8"
        }
      });
    }

    // =========================
    // حساب کاربر
    // =========================

    if (
      request.method === "GET" &&
      url.pathname === "/api/account"
    ) {
      const userId =
        request.headers.get("X-User-ID");

      if (!userId) {
        return json({
          ok: false,
          error: "شناسه کاربر وجود ندارد"
        }, 400);
      }

      try {
        await env.DB.prepare(`
          INSERT OR IGNORE INTO users
          (id,name,balance)
          VALUES (?, ?, 0)
        `)
          .bind(userId, "کاربر جدید")
          .run();

        const user =
          await env.DB.prepare(`
            SELECT id,name,balance,created_at
            FROM users
            WHERE id = ?
          `)
            .bind(userId)
            .first();

        return json({
          ok: true,
          user: {
            id: user.id,
            name: user.name,
            balance:
              Number(user.balance || 0),
            created_at: user.created_at
          }
        });
      } catch (e) {
        return json({
          ok: false,
          error: "خطا در دریافت حساب",
          detail: e.message
        }, 500);
      }
    }

    // =========================
    // هوش مصنوعی
    // =========================

    if (
      request.method === "POST" &&
      url.pathname === "/api/chat"
    ) {
      const userId =
        request.headers.get("X-User-ID");

      if (!userId) {
        return json({
          ok: false,
          error: "شناسه کاربر وجود ندارد"
        }, 400);
      }

      let body;

      try {
        body = await request.json();
      } catch {
        return json({
          ok: false,
          error: "اطلاعات پیام نامعتبر است"
        }, 400);
      }

      const message =
        String(body.message || "").trim();

      if (!message) {
        return json({
          ok: false,
          error: "پیامت را بنویس"
        }, 400);
      }

      if (message.length > 10000) {
        return json({
          ok: false,
          error: "پیام خیلی طولانی است"
        }, 400);
      }

      try {
        // ساخت کاربر
        await env.DB.prepare(`
          INSERT OR IGNORE INTO users
          (id,name,balance)
          VALUES (?, ?, 0)
        `)
          .bind(userId, "کاربر جدید")
          .run();

        // ذخیره پیام
        await env.DB.prepare(`
          INSERT INTO messages
          (user_id,role,content)
          VALUES (?, 'user', ?)
        `)
          .bind(userId, message)
          .run();

        // تاریخچه
        const history =
          await env.DB.prepare(`
            SELECT role,content
            FROM messages
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT 10
          `)
            .bind(userId)
            .all();

        const messages = [
          {
            role: "system",
            content:
              "تو یک دستیار هوش مصنوعی فارسی دقیق، مفید و مودب هستی. پاسخ‌ها را فارسی بده مگر کاربر زبان دیگری بخواهد."
          }
        ];

        for (
          const item of
          (history.results || []).reverse()
        ) {
          messages.push({
            role:
              item.role === "assistant"
                ? "assistant"
                : "user",
            content:
              String(item.content)
          });
        }

        // اجرای AI
        let result;

        try {
          result = await env.AI.run(
            MODEL,
            {
              messages,
              max_tokens: 700,
              temperature: 0.6
            }
          );
        } catch (aiError) {
          return json({
            ok: false,
            error:
              "خطا در اجرای Workers AI",
            detail:
              aiError.message ||
              String(aiError)
          }, 502);
        }

        const answer =
          result?.response ??
          result?.result?.response ??
          "";

        if (!answer) {
          return json({
            ok: false,
            error:
              "هوش مصنوعی پاسخ خالی برگرداند.",
            detail:
              JSON.stringify(result)
          }, 502);
        }

        // ذخیره پاسخ AI
        await env.DB.prepare(`
          INSERT INTO messages
          (user_id,role,content)
          VALUES (?, 'assistant', ?)
        `)
          .bind(userId, answer)
          .run();

        return json({
          ok: true,
          answer: String(answer)
        });

      } catch (e) {
        return json({
          ok: false,
          error: "خطای سرور در بخش AI",
          detail: e.message ||
            String(e)
        }, 500);
      }
    }

    // =========================
    // پاک کردن گفتگو
    // =========================

    if (
      request.method === "POST" &&
      url.pathname === "/api/clear"
    ) {
      const userId =
        request.headers.get("X-User-ID");

      if (!userId) {
        return json({
          ok: false,
          error: "شناسه کاربر وجود ندارد"
        }, 400);
      }

      try {
        await env.DB.prepare(`
          DELETE FROM messages
          WHERE user_id = ?
        `)
          .bind(userId)
          .run();

        return json({
          ok: true,
          message: "گفتگو پاک شد"
        });
      } catch (e) {
        return json({
          ok: false,
          error: "خطا در پاک کردن گفتگو",
          detail: e.message
        }, 500);
      }
    }

    // =========================
    // برداشت
    // =========================

    if (
      request.method === "POST" &&
      url.pathname === "/api/withdraw"
    ) {
      const userId =
        request.headers.get("X-User-ID");

      if (!userId) {
        return json({
          ok: false,
          error: "شناسه کاربر وجود ندارد"
        }, 400);
      }

      let body;

      try {
        body = await request.json();
      } catch {
        return json({
          ok: false,
          error: "اطلاعات نامعتبر است"
        }, 400);
      }

      const amount =
        Number(body.amount);

      const wallet =
        String(body.wallet || "").trim();

      if (
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        return json({
          ok: false,
          error: "مبلغ نامعتبر است"
        }, 400);
      }

      if (amount < 10) {
        return json({
          ok: false,
          error:
            "حداقل مبلغ برداشت 10 دلار است"
        }, 400);
      }

      if (
        !wallet ||
        wallet.length < 10
      ) {
        return json({
          ok: false,
          error:
            "آدرس کیف پول USDT را وارد کن"
        }, 400);
      }

      try {
        const user =
          await env.DB.prepare(`
            SELECT balance
            FROM users
            WHERE id = ?
          `)
            .bind(userId)
            .first();

        if (!user) {
          return json({
            ok: false,
            error: "حساب پیدا نشد"
          }, 404);
        }

        const balance =
          Number(user.balance || 0);

        if (amount > balance) {
          return json({
            ok: false,
            error: "موجودی کافی نیست",
            balance
          }, 400);
        }

        await env.DB.batch([
          env.DB.prepare(`
            UPDATE users
            SET balance = balance - ?
            WHERE id = ?
          `)
            .bind(amount, userId),

          env.DB.prepare(`
            INSERT INTO withdrawals
            (user_id,amount,wallet,status)
            VALUES (?, ?, ?, 'pending')
          `)
            .bind(
              userId,
              amount,
              wallet
            )
        ]);

        return json({
          ok: true,
          message:
            "درخواست برداشت ثبت شد"
        });

      } catch (e) {
        return json({
          ok: false,
          error:
            "خطا در ثبت برداشت",
          detail: e.message
        }, 500);
      }
    }

    // =========================
    // مدیریت کاربران
    // =========================

    if (
      request.method === "GET" &&
      url.pathname === "/api/admin/users"
    ) {
      const password =
        request.headers.get(
          "X-Admin-Password"
        );

      if (
        !env.ADMIN_PASSWORD ||
        password !== env.ADMIN_PASSWORD
      ) {
        return json({
          ok: false,
          error: "رمز مدیریت اشتباه است"
        }, 401);
      }

      try {
        const users =
          await env.DB.prepare(`
            SELECT id,name,balance,created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT 500
          `)
            .all();

        return json({
          ok: true,
          users:
            users.results || []
        });

      } catch (e) {
        return json({
          ok: false,
          error:
            "خطا در دریافت کاربران",
          detail: e.message
        }, 500);
      }
    }

    // =========================
    // افزایش موجودی مدیریت
    // =========================

    if (
      request.method === "POST" &&
      url.pathname === "/api/admin/credit"
    ) {
      const password =
        request.headers.get(
          "X-Admin-Password"
        );

      if (
        !env.ADMIN_PASSWORD ||
        password !== env.ADMIN_PASSWORD
      ) {
        return json({
          ok: false,
          error: "رمز مدیریت اشتباه است"
        }, 401);
      }

      let body;

      try {
        body = await request.json();
      } catch {
        return json({
          ok: false,
          error: "اطلاعات نامعتبر است"
        }, 400);
      }

      const userId =
        String(body.userId || "").trim();

      const amount =
        Number(body.amount);

      if (
        !userId ||
        !Number.isFinite(amount) ||
        amount === 0
      ) {
        return json({
          ok: false,
          error:
            "شناسه کاربر و مبلغ لازم است"
        }, 400);
      }

      try {
        const user =
          await env.DB.prepare(`
            SELECT id
            FROM users
            WHERE id = ?
          `)
            .bind(userId)
            .first();

        if (!user) {
          return json({
            ok: false,
            error: "کاربر پیدا نشد"
          }, 404);
        }

        await env.DB.prepare(`
          UPDATE users
          SET balance = balance + ?
          WHERE id = ?
        `)
          .bind(amount, userId)
          .run();

        const updated =
          await env.DB.prepare(`
            SELECT balance
            FROM users
            WHERE id = ?
          `)
            .bind(userId)
            .first();

        return json({
          ok: true,
          balance:
            Number(updated.balance || 0)
        });

      } catch (e) {
        return json({
          ok: false,
          error:
            "خطا در تغییر موجودی",
          detail: e.message
        }, 500);
      }
    }

    // =========================
    // درخواست‌های برداشت مدیریت
    // =========================

    if (
      request.method === "GET" &&
      url.pathname ===
        "/api/admin/withdrawals"
    ) {
      const password =
        request.headers.get(
          "X-Admin-Password"
        );

      if (
        !env.ADMIN_PASSWORD ||
        password !== env.ADMIN_PASSWORD
      ) {
        return json({
          ok: false,
          error: "رمز مدیریت اشتباه است"
        }, 401);
      }

      try {
        const withdrawals =
          await env.DB.prepare(`
            SELECT *
            FROM withdrawals
            ORDER BY id DESC
            LIMIT 500
          `)
            .all();

        return json({
          ok: true,
          withdrawals:
            withdrawals.results || []
        });

      } catch (e) {
        return json({
          ok: false,
          error:
            "خطا در دریافت برداشت‌ها",
          detail: e.message
        }, 500);
      }
    }

    return json({
      ok: false,
      error: "مسیر پیدا نشد"
    }, 404);
  }
};


// ======================================================
// APP
// ======================================================

const HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>

<meta charset="UTF-8">
<meta name="viewport"
content="width=device-width,initial-scale=1">

<title>ابزارک AI</title>

<style>

*{
box-sizing:border-box;
}

body{
margin:0;
font-family:
Tahoma,Arial,sans-serif;
background:
linear-gradient(
135deg,
#f5f7ff,
#eef2ff
);
color:#182230;
}

.container{
width:min(950px,94%);
margin:20px auto;
}

.card{
background:#fff;
border-radius:22px;
padding:20px;
margin-bottom:18px;
box-shadow:
0 8px 30px
rgba(0,0,0,.08);
}

.header{
text-align:center;
}

.logo{
font-size:42px;
}

h1{
margin:5px 0;
}

h2{
margin-top:0;
}

.balanceBox{
text-align:center;
margin-top:20px;
padding:20px;
border-radius:18px;
background:#f5f7ff;
}

.balance{
font-size:34px;
font-weight:bold;
margin-top:8px;
}

.chat{
height:430px;
overflow-y:auto;
padding:8px;
border-radius:15px;
background:#fafafa;
}

.msg{
padding:13px 15px;
margin:10px 0;
border-radius:16px;
line-height:2;
white-space:pre-wrap;
word-break:break-word;
}

.user{
background:#e8efff;
margin-right:15%;
}

.ai{
background:#eeeeF3;
margin-left:15%;
}

.composer{
display:flex;
gap:8px;
margin-top:12px;
}

textarea{
flex:1;
resize:none;
min-height:55px;
border:1px solid #d9dce5;
border-radius:14px;
padding:13px;
font-size:16px;
font-family:inherit;
}

input{
width:100%;
border:1px solid #d9dce5;
border-radius:14px;
padding:14px;
margin:7px 0;
font-size:16px;
font-family:inherit;
}

button{
border:0;
border-radius:13px;
padding:12px 18px;
font-size:16px;
font-family:inherit;
cursor:pointer;
background:#111827;
color:#fff;
}

button:disabled{
opacity:.5;
}

.green{
background:#087443;
}

.red{
background:#b42318;
}

.small{
font-size:13px;
color:#667085;
}

.status{
margin:10px 0;
min-height:22px;
}

@media(max-width:600px){

.container{
width:96%;
}

.chat{
height:52vh;
}

.user{
margin-right:4%;
}

.ai{
margin-left:4%;
}

.composer{
flex-direction:column;
}

.composer button{
width:100%;
}

}

</style>

</head>

<body>

<div class="container">

<div class="card header">

<div class="logo">🤖</div>

<h1>ابزارک AI</h1>

<div class="small">
دستیار هوش مصنوعی فارسی + حساب کاربری
</div>

<div class="balanceBox">

💰 موجودی حساب

<div
class="balance"
id="balance">
$0.00
</div>

</div>

</div>


<div class="card">

<h2>💬 دستیار هوش مصنوعی</h2>

<div
id="chat"
class="chat">

<div class="msg ai">
سلام! 👋
من آماده‌ام.
چه کمکی از من می‌خواهی؟
</div>

</div>

<div
id="status"
class="status">
</div>

<div class="composer">

<textarea
id="message"
placeholder="پیامت را بنویس...">
</textarea>

<button
id="send">
ارسال
</button>

</div>

<button
class="red"
id="clear">
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
min="10"
step="0.01"
placeholder="مبلغ برداشت به دلار">

<input
id="wallet"
type="text"
placeholder="آدرس کیف پول USDT">

<button
class="green"
id="withdraw">
درخواست برداشت
</button>

<div
id="withdrawStatus"
class="status">
</div>

</div>

</div>


<script>

const userId =
localStorage.getItem("ai_user_id")
||
crypto.randomUUID();

localStorage.setItem(
"ai_user_id",
userId
);

const $ =
id =>
document.getElementById(id);


async function api(
path,
options={}
){

const response =
await fetch(
path,
{
...options,
headers:{
...(options.headers || {}),
"X-User-ID":userId,
"Content-Type":
"application/json"
}
}
);

const text =
await response.text();

let data;

try{

data =
JSON.parse(text);

}catch{

throw new Error(
"سرور پاسخ JSON معتبر نداد. HTTP "
+
response.status
+
" - "
+
text.slice(0,300)
);

}

if(!response.ok){

throw new Error(
data.error ||
"خطای سرور"
);

}

return data;

}


async function loadAccount(){

try{

const data =
await api(
"/api/account"
);

if(data.ok){

$("balance")
.textContent =
"$"
+
Number(
data.user.balance || 0
).toFixed(2);

}

}catch(e){

console.log(e);

}

}


function addMessage(
text,
type
){

const div =
document.createElement(
"div"
);

div.className =
"msg "
+
(
type === "user"
? "user"
: "ai"
);

div.textContent =
text;

$("chat")
.appendChild(div);

$("chat").scrollTop =
$("chat").scrollHeight;

}


async function sendMessage(){

const text =
$("message")
.value
.trim();

if(!text)
return;

$("send").disabled =
true;

$("message").disabled =
true;

addMessage(
text,
"user"
);

$("message").value =
"";

$("status")
.textContent =
"⏳ در حال دریافت پاسخ...";

try{

const data =
await api(
"/api/chat",
{
method:"POST",
body:
JSON.stringify({
message:text
})
}
);

addMessage(
data.answer,
"ai"
);

$("status")
.textContent =
"";

}catch(e){

addMessage(
"❌ "
+
e.message,
"ai"
);

$("status")
.textContent =
"";

}

$("send").disabled =
false;

$("message").disabled =
false;

$("message").focus();

}


$("send")
.addEventListener(
"click",
sendMessage
);


$("message")
.addEventListener(
"keydown",
e=>{

if(
e.key === "Enter"
&&
!e.shiftKey
){

e.preventDefault();

sendMessage();

}

}
);


$("clear")
.addEventListener(
"click",
async()=>{

try{

await api(
"/api/clear",
{
method:"POST"
}
);

$("chat").innerHTML =
`
<div class="msg ai">
گفتگو پاک شد. 👋
</div>
`;

}catch(e){

$("status")
.textContent =
"❌ "
+
e.message;

}

}
);


$("withdraw")
.addEventListener(
"click",
async()=>{

const amount =
Number(
$("amount").value
);

const wallet =
$("wallet").value.trim();

$("withdrawStatus")
.textContent =
"⏳ در حال ثبت درخواست...";

try{

const data =
await api(
"/api/withdraw",
{
method:"POST",
body:
JSON.stringify({
amount,
wallet
})
}
);

$("withdrawStatus")
.textContent =
"✅ "
+
data.message;

$("amount").value =
"";

$("wallet").value =
"";

await loadAccount();

}catch(e){

$("withdrawStatus")
.textContent =
"❌ "
+
e.message;

}

}
);


loadAccount();

</script>

</body>
</html>`;
