
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
                content: prompt.trim()
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
              (error.message || String(error))
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
      padding: 20px;
      background: #f5f7fb;
      font-family: Tahoma, Arial, sans-serif;
    }

    .container {
      width: 100%;
      max-width: 700px;
      margin: 20px auto;
      background: white;
      border-radius: 18px;
      padding: 20px;
      box-shadow: 0 5px 25px rgba(0,0,0,.08);
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

    textarea {
      width: 100%;
      min-height: 110px;
      padding: 14px;
      border: 1px solid #ddd;
      border-radius: 12px;
      font-size: 16px;
      font-family: Tahoma, Arial, sans-serif;
      resize: vertical;
      outline: none;
    }

    textarea:focus {
      border-color: #2563eb;
    }

    .buttons {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }

    button {
      border: none;
      border-radius: 10px;
      padding: 12px 20px;
      font-size: 15px;
      cursor: pointer;
    }

    .send {
      background: #2563eb;
      color: white;
    }

    .clear {
      background: #eeeeee;
      color: #333;
    }

    .answer {
      margin-top: 20px;
      background: #f8fafc;
      border-radius: 12px;
      padding: 15px;
      line-height: 2;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .loading {
      margin-top: 20px;
      padding: 15px;
      background: #f8fafc;
      border-radius: 12px;
      color: #666;
    }

    .error {
      margin-top: 20px;
      padding: 15px;
      background: #fff1f2;
      color: #b91c1c;
      border-radius: 12px;
      line-height: 1.8;
    }

  </style>
</head>

<body>

  <div class="container">

    <h1>🤖 دستیار هوش مصنوعی</h1>

    <div class="subtitle">
      سلام! 👋 سوالت را بنویس.
    </div>

    <textarea
      id="prompt"
      placeholder="پیامت را بنویس..."
    ></textarea>

    <div class="buttons">

      <button
        class="send"
        onclick="sendMessage()">
        ارسال
      </button>

      <button
        class="clear"
        onclick="clearChat()">
        🗑️ پاک کردن گفتگو
      </button>

    </div>

    <div id="answer"></div>

  </div>


<script>

async function sendMessage() {

  const prompt =
    document.getElementById("prompt").value.trim();

  const answer =
    document.getElementById("answer");

  if (!prompt) {

    answer.innerHTML =
      '<div class="error">لطفاً پیام خود را بنویسید.</div>';

    return;
  }

  answer.innerHTML =
    '<div class="loading">⏳ در حال دریافت پاسخ...</div>';

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

    if (!response.ok || data.error) {

      answer.innerHTML =
        '<div class="error">❌ ' +
        escapeHtml(
          data.error || "خطای نامشخص"
        ) +
        '</div>';

      return;
    }

    answer.innerHTML =
      '<div class="answer">' +
      escapeHtml(data.response) +
      '</div>';

  } catch (error) {

    answer.innerHTML =
      '<div class="error">❌ خطا در اتصال به هوش مصنوعی: ' +
      escapeHtml(error.message) +
      '</div>';

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


document
  .getElementById("prompt")
  .addEventListener("keydown", function(event) {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();

    }

  });

</script>

</body>
</html>
`;
