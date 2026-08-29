export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // صفحه اصلی
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(`
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>دستیار هوش مصنوعی</title>
<style>
body{font-family:Arial;background:#f3f4f6;margin:0;padding:20px}
.box{max-width:600px;margin:auto;background:white;padding:20px;border-radius:18px}
h2{text-align:center}
textarea{width:100%;height:120px;padding:12px;box-sizing:border-box;border:1px solid #ddd;border-radius:10px}
button{width:100%;padding:14px;margin-top:10px;border:0;border-radius:10px;background:#2563eb;color:white;font-size:16px}
#answer{margin-top:15px;padding:15px;background:#f1f5f9;border-radius:10px;white-space:pre-wrap}
</style>
</head>
<body>
<div class="box">
<h2>🤖 دستیار هوش مصنوعی</h2>
<p>سلام! 👋 سوالت را بنویس.</p>
<textarea id="prompt" placeholder="پیامت را بنویس..."></textarea>
<button onclick="send()">ارسال</button>
<button onclick="document.getElementById('prompt').value='';document.getElementById('answer').innerText=''">
🗑️ پاک کردن گفتگو
</button>
<div id="answer"></div>
</div>

<script>
async function send(){
  const prompt=document.getElementById("prompt").value.trim();
  const answer=document.getElementById("answer");

  if(!prompt){
    answer.innerText="لطفاً متن خود را وارد کنید.";
    return;
  }

  answer.innerText="⏳ در حال دریافت پاسخ...";

  try{
    const res=await fetch("/api/ai",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({prompt})
    });

    const data=await res.json();

    if(!res.ok){
      answer.innerText=data.error || "خطایی رخ داد.";
      return;
    }

    answer.innerText=data.answer || "پاسخی دریافت نشد.";
  }catch(e){
    answer.innerText="❌ اتصال به هوش مصنوعی برقرار نشد.";
  }
}
</script>
</body>
</html>
      `, {
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

        const response = await env.AI.run(
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
          answer: response.response
        });

      } catch (error) {
        return Response.json(
          {
            error: "خطا در اتصال به هوش مصنوعی: " + error.message
          },
          { status: 500 }
        );
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};
