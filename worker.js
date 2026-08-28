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
  margin: 20px auto;
  padding: 15px;
}

h1 {
  text-align: center;
  margin-bottom: 5px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 15px;
}

#chat {
  background: white;
  border-radius: 15px;
  padding: 15px;
  min-height: 350px;
  max-height: 60vh;
  overflow-y: auto;
  box-shadow: 0 2px 12px rgba(0,0,0,.1);
}

.message {
  padding: 12px;
  margin: 10px 0;
  border-radius: 10px;
  white-space: pre-wrap;
  line-height: 1.7;
}

.user {
  background: #e8f0fe;
}

.ai {
  background: #f0f0f0;
}

.buttons {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.small-button {
  padding: 8px 12px;
  border: 0;
  border-radius: 8px;
  background: #ddd;
  cursor: pointer;
}

.row {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

input {
  flex: 1;
  padding: 14px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  outline: none;
}

button {
  padding: 14px 22px;
  border: 0;
  border-radius: 10px;
  background: #2563eb;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  opacity: .6;
}

.clear {
  width: 100%;
  margin-top: 10px;
  background: #dc2626;
}
</style>
</head>

<body>

<div class="container">

<h1>🤖 دستیار هوش مصنوعی</h1>

<div class="subtitle">
سلام! 👋 سوالت را بنویس.
</div>

<div id="chat">
  <div class="message ai">سلام! 👋 من آماده‌ام. چه کمکی از من می‌خواهی؟</div>
</div>

<div class="row">
  <input id="prompt" placeholder="پیامت را بنویس..." />
  <button id="send">ارسال</button>
</div>

<button class="clear" id="clear">🗑️ پاک کردن گفتگو</button>

</div>

<script>
const input = document.getElementById("prompt");
const button = document.getElementById("send");
const chat = document.getElementById("chat");
const clearButton = document.getElementById("clear");

function addMessage(text, type) {
  const wrapper = document.createElement("div");

  const message = document.createElement("div");
  message.className = "message " + type;
  message.textContent = text;

  wrapper.appendChild(message);

  if (type === "ai") {
    const copyButton = document.createElement("button");
    copyButton.className = "small-button";
    copyButton.textContent = "📋 کپی";

    copyButton.onclick = async function() {
      try {
        await navigator.clipboard.writeText(text);
        copyButton.textContent = "✅ کپی شد";
        setTimeout(() => {
          copyButton.textContent = "📋 کپی";
        }, 1500);
      } catch (e) {
        copyButton.textContent = "کپی نشد";
      }
    };

    wrapper.appendChild(copyButton);
  }

  chat.appendChild(wrapper);
  chat.scrollTop = chat.scrollHeight;

  return wrapper;
}

async function sendMessage() {
  const prompt = input.value.trim();

  if (!prompt) return;

  addMessage(prompt, "user");

  input.value = "";
  button.disabled = true;
  input.disabled = true;

  const loading = addMessage("⏳ در حال پاسخ‌گویی...", "ai");

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

    if (data.success) {
      addMessage(data.response, "ai");
    } else {
      addMessage(
        data.error || "خطایی رخ داد.",
        "ai"
      );
    }

  } catch (error) {

    loading.remove();

    addMessage(
      "ارتباط با هوش مصنوعی برقرار نشد.",
      "ai"
    );
  }

  button.disabled = false;
  input.disabled = false;
  input.focus();
}

button.addEventListener("click", sendMessage);

input.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

clearButton.addEventListener("click", function() {
  chat.innerHTML =
    '<div class="message ai">گفتگو پاک شد. 👋 دوباره شروع کنیم؟</div>';
});
</script>

</body>
</html>`;

export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    if (
      request.method === "GET" &&
      url.pathname === "/"
    ) {
      return new Response(HTML, {
        headers: {
          "content-type": "text/html; charset=UTF-8"
        }
      });
    }

    if (
      request.method === "POST" &&
      url.pathname === "/api/ai"
    ) {

      try {

        const body = await request.json();
        const prompt = body.prompt;

        if (!prompt || !prompt.trim()) {
          return Response.json(
            {
              error: "لطفاً متن خود را وارد کنید."
            },
            {
              status: 400
            }
          );
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct-fast",
          {
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful Persian-speaking AI assistant. Always answer in Persian."
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
          {
            error:
              "خطایی در اجرای هوش مصنوعی رخ داد."
          },
          {
            status: 500
          }
        );
      }
    }

    return new Response(
      "Not Found",
      {
        status: 404
      }
    );
  }
};
