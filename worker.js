const HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>دستیار هوش مصنوعی</title>
  <style>
    *{box-sizing:border-box}
    body{
      margin:0;
      font-family:Arial,sans-serif;
      background:#f4f7fb;
      color:#222;
    }
    .app{
      max-width:700px;
      margin:auto;
      min-height:100vh;
      display:flex;
      flex-direction:column;
    }
    header{
      background:#2563eb;
      color:white;
      padding:18px;
      text-align:center;
      font-size:22px;
      font-weight:bold;
    }
    #chat{
      flex:1;
      padding:15px;
      overflow-y:auto;
    }
    .msg{
      margin:10px 0;
      padding:12px 15px;
      border-radius:14px;
      line-height:1.8;
      white-space:pre-wrap;
      word-wrap:break-word;
    }
    .user{
      background:#dbeafe;
      margin-right:30px;
    }
    .ai{
      background:white;
      margin-left:30px;
      box-shadow:0 1px 5px #ddd;
    }
    .copy{
      border:0;
      background:#eee;
      padding:5px 9px;
      border-radius:7px;
      margin-top:7px;
      cursor:pointer;
    }
    .bottom{
      background:white;
      padding:10px;
      border-top:1px solid #ddd;
    }
    textarea{
      width:100%;
      min-height:55px;
      resize:none;
      border:1px solid #ccc;
      border-radius:12px;
      padding:12px;
      font-size:16px;
      outline:none;
    }
    .buttons{
      display:flex;
      gap:8px;
      margin-top:8px;
    }
    button{
      border:0;
      border-radius:10px;
      padding:11px 18px;
      cursor:pointer;
      font-size:15px;
    }
    #send{
      background:#2563eb;
      color:white;
      flex:1;
    }
    #clear{
      background:#eee;
    }
    button:disabled{
      opacity:.6;
      cursor:not-allowed;
    }
  </style>
</head>

<body>
<div class="app">

  <header>🤖 دستیار هوش مصنوعی</header>

  <div id="chat">
    <div class="msg ai">
      سلام! 👋 سوالت را بنویس.
    </div>
  </div>

  <div class="bottom">
    <textarea id="input" placeholder="پیامت را بنویس..."></textarea>

    <div class="buttons">
      <button id="send">ارسال</button>
      <button id="clear">🗑️ پاک کردن گفتگو</button>
    </div>
  </div>

</div>

<script>
const chat = document.getElementById("chat");
const input = document.getElementById("input");
const send = document.getElementById("send");
const clear = document.getElementById("clear");

function addMessage(text, type) {
  const box = document.createElement("div");
  box.className = "msg " + type;

  const content = document.createElement("div");
  content.textContent = text;

  box.appendChild(content);

  if (type === "ai") {
    const copy = document.createElement("button");
    copy.className = "copy";
    copy.textContent = "📋 کپی";

    copy.onclick = async () => {
      try {
        await navigator.clipboard.writeText(text);
        copy.textContent = "✅ کپی شد";
        setTimeout(() => copy.textContent = "📋 کپی", 1500);
      } catch {
        alert("کپی انجام نشد.");
      }
    };

    box.appendChild(copy);
  }

  chat.appendChild(box);
  chat.scrollTop = chat.scrollHeight;

  return box;
}

async function askAI() {
  const prompt = input.value.trim();

  if (!prompt) return;

  addMessage(prompt, "user");
  input.value = "";
  send.disabled = true;
  send.textContent = "در حال پاسخ...";

  const loading = addMessage("⏳ در حال فکر کردن...", "ai");

  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt
      })
    });

    const data = await response.json();

    loading.remove();

    if (!response.ok) {
      addMessage(
        data.error || "خطایی در اجرای هوش مصنوعی رخ داد.",
        "ai"
      );
      return;
    }

    addMessage(
      data.response || data.text || "پاسخی دریافت نشد.",
      "ai"
    );

  } catch (error) {
    loading.remove();
    addMessage(
      "خطا در ارتباط با سرور. دوباره تلاش کنید.",
      "ai"
    );
  } finally {
    send.disabled = false;
    send.textContent = "ارسال";
    input.focus();
  }
}

send.addEventListener("click", askAI);

input.addEventListener("keydown", function(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    askAI();
  }
});

clear.addEventListener("click", function() {
  chat.innerHTML = `
    <div class="msg ai">
      گفتگو پاک شد. 👋 سوال جدیدت را بنویس.
    </div>
  `;
});

input.focus();
</script>

</body>
</html>`;

export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    // صفحه اصلی
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(HTML, {
        headers: {
          "content-type": "text/html; charset=UTF-8"
        }
      });
    }

    // API هوش مصنوعی
    if (request.method === "POST" && url.pathname === "/api/ai") {

      try {

        const body = await request.json();
        const prompt = body.prompt;

        if (!prompt || !prompt.trim()) {
          return Response.json(
            { error: "لطفاً متن خود را وارد کنید." },
            { status: 400 }
          );
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",
          {
            messages: [
              {
                role: "system",
                content:
                  "تو یک دستیار هوش مصنوعی عمومی، مفید، دقیق و دوستانه هستی. به زبان کاربر پاسخ بده. اگر کاربر فارسی نوشت، فارسی پاسخ بده."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 1024
          }
        );

        let answer = "";

        if (result && result.response) {
          answer = result.response;
        } else if (result && result.result && result.result.response) {
          answer = result.result.response;
        }

        if (!answer) {
          answer = "متأسفانه پاسخی دریافت نشد.";
        }

        return Response.json({
          response: answer
        });

      } catch (error) {

        return Response.json(
          {
            error: "خطایی در اجرای هوش مصنوعی رخ داد."
          },
          {
            status: 500
          }
        );
      }
    }

    return new Response("Not Found", {
      status: 404
    });
  }
};
