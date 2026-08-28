const HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>دستیار هوش مصنوعی</title>
<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f5f7fb;
}
.container {
  max-width: 700px;
  margin: auto;
  padding: 20px;
}
h1 {
  text-align: center;
}
#chat {
  background: white;
  min-height: 400px;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 2px 10px #ddd;
  overflow-y: auto;
}
.message {
  padding: 12px;
  margin: 10px 0;
  border-radius: 10px;
  white-space: pre-wrap;
}
.user {
  background: #e8f0ff;
}
.ai {
  background: #eeeeee;
}
form {
  display: flex;
  gap: 8px;
  margin-top: 15px;
}
input {
  flex: 1;
  padding: 14px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
}
button {
  padding: 14px 20px;
  border: 0;
  border-radius: 10px;
  background: #2563eb;
  color: white;
  font-size: 16px;
}
</style>
</head>
<body>
<div class="container">
<h1>🤖 دستیار هوش مصنوعی</h1>

<div id="chat">
  <div class="message ai">سلام! 👋 سوالت را بنویس.</div>
</div>

<form id="form">
  <input id="prompt" placeholder="پیام خود را بنویسید..." autocomplete="off">
  <button type="submit">ارسال</button>
</form>
</div>

<script>
const form = document.getElementById("form");
const input = document.getElementById("prompt");
const chat = document.getElementById("chat");

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "message " + type;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const prompt = input.value.trim();
  if (!prompt) return;

  addMessage(prompt, "user");
  input.value = "";

  addMessage("در حال پاسخ دادن...", "ai");

  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    chat.lastElementChild.remove();

    if (data.response) {
      addMessage(data.response, "ai");
    } else {
      addMessage(data.error || "خطایی رخ داد.", "ai");
    }

  } catch (error) {
    chat.lastElementChild.remove();
    addMessage("اتصال به هوش مصنوعی برقرار نشد.", "ai");
  }
});
</script>
</body>
</html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/" && request.method === "GET") {
      return new Response(HTML, {
        headers: {
          "content-type": "text/html; charset=UTF-8"
        }
      });
    }

    if (url.pathname === "/api/ai" && request.method === "POST") {
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
                content: "شما یک دستیار هوش مصنوعی فارسی‌زبان و مفید هستید."
              },
              {
                role: "user",
                content: prompt
              }
            ]
          }
        );

        return Response.json({
          success: true,
          response: result.response
        });

      } catch (error) {
        return Response.json(
          { error: "خطایی در اجرای هوش مصنوعی رخ داد." },
          { status: 500 }
        );
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};
