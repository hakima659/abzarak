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

    // هوش مصنوعی
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
                content: "شما یک دستیار هوش مصنوعی فارسی و مفید هستید. پاسخ‌ها را واضح و کاربردی به زبان فارسی ارائه کنید."
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
            error: "خطا در دریافت پاسخ هوش مصنوعی: " + error.message
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
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>دستیار هوش مصنوعی</title>

<style>
body {
  font-family: Tahoma, Arial, sans-serif;
  background: #f5f7fb;
  margin: 0;
  padding: 20px;
}

.container {
  max-width: 700px;
  margin: auto;
  background: white;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 5px 25px rgba(0,0,0,.08);
}

h1 {
  text-align: center;
  margin-bottom: 5px;
}

.subtitle {
  text-align: center;
  color: #777;
  margin-bottom: 20px;
}

textarea {
  width: 100%;
  min-height: 100px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 14px;
  font-size: 16px;
  resize: vertical;
}

button {
  border: 0;
  border-radius: 10px;
  padding: 12px 18px;
  margin-top: 10px;
  cursor: pointer;
  font-size: 15px;
}

.send {
  background: #2563eb;
  color: white;
}

.clear {
  background: #eee;
}

.answer {
  margin-top: 20px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 15px;
  white-space: pre-wrap;
  line-height: 1.9;
}

.loading {
  color: #666;
}
</style>
</head>

<body>

<div class="container">

<h1>🤖 دستیار هوش مصنوعی</h1>

<div class="subtitle">
سلام! 👋 سوالت را بنویس.
</div>

<textarea id="prompt" placeholder="پیامت را بنویس..."></textarea>

<br>

<button class="send" onclick="sendMessage()">ارسال</button>
<button class="clear" onclick="clearChat()">🗑️ پاک کردن گفتگو</button>

<div id="answer"></div>

</div>

<script>

async function sendMessage() {

  const prompt = document.getElementById("prompt").value.trim();
  const answer = document.getElementById("answer");

  if (!prompt) {
    answer.innerHTML = "لطفاً پیام خود را بنویسید.";
    return;
  }

  answer.innerHTML = '<div class="loading">⏳ در حال دریافت پاسخ...</div>';

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

    if (data.error) {
      answer.innerHTML = "❌ " + data.error;
      return;
    }

    answer.innerHTML =
      '<div class="answer">' +
      escapeHtml(data.response) +
      '</div>';

  } catch (error) {

    answer.innerHTML =
      "❌ خطا در اتصال به هوش مصنوعی: " + error.message;

  }
}

function clearChat() {
  document.getElementById("prompt").value = "";
  document.getElementById("answer").innerHTML = "";
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

</script>

</body>
</html>
`;
