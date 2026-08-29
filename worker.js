export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // صفحه اصلی
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>دستیار هوش مصنوعی</title>

<style>
body{
  margin:0;
  padding:20px;
  background:#f3f4f6;
  font-family:Arial,sans-serif;
}

.box{
  max-width:600px;
  margin:30px auto;
  background:white;
  padding:20px;
  border-radius:18px;
  box-shadow:0 4px 20px rgba(0,0,0,.08);
}

h2{
  text-align:center;
}

textarea{
  width:100%;
  height:130px;
  box-sizing:border-box;
  padding:14px;
  border:1px solid #ddd;
  border-radius:12px;
  font-size:16px;
  resize:vertical;
}

button{
  width:100%;
  margin-top:10px;
  padding:14px;
  border:0;
  border-radius:12px;
  background:#2563eb;
  color:white;
  font-size:16px;
}

button:active{
  transform:scale(.98);
}

#answer{
  margin-top:15px;
  padding:15px;
  background:#f1f5f9;
  border-radius:12px;
  min-height:30px;
  white-space:pre-wrap;
  line-height:1.8;
}
</style>
</head>

<body>

<div class="box">

<h2>🤖 دستیار هوش مصنوعی</h2>

<p>سلام! 👋 سوالت را بنویس.</p>

<textarea
id="prompt"
placeholder="پیامت را بنویس..."
></textarea>

<button onclick="sendMessage()">
ارسال
</button>

<button onclick="clearChat()">
🗑️ پاک کردن گفتگو
</button>

<div id="answer"></div>

</div>

<script>

async function sendMessage(){

  const input =
    document.getElementById("prompt");

  const answer =
    document.getElementById("answer");

  const prompt =
    input.value.trim();

  if(!prompt){
    answer.innerText =
      "لطفاً متن خود را وارد کنید.";
    return;
  }

  answer.innerText =
    "⏳ در حال دریافت پاسخ...";

  try{

    const response =
      await fetch("/api/ai",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          prompt:prompt
        })
      });

    const data =
      await response.json();

    if(!response.ok){

      answer.innerText =
        data.error ||
        "خطایی رخ داد.";

      return;
    }

    answer.innerText =
      data.answer ||
      "پاسخی دریافت نشد.";

  }catch(error){

    answer.innerText =
      "❌ اتصال به هوش مصنوعی برقرار نشد.";
  }
}


function clearChat(){

  document.getElementById("prompt").value = "";

  document.getElementById("answer").innerText = "";
}

</script>

</body>
</html>`, {
        headers: {
          "content-type": "text/html; charset=UTF-8"
        }
      });
    }


    // API هوش مصنوعی
    if (
      request.method === "POST" &&
      url.pathname === "/api/ai"
    ) {

      try {

        const body =
          await request.json();

        const prompt =
          body.prompt;

        if(
          !prompt ||
          !prompt.trim()
        ){

          return Response.json(
            {
              error:
                "لطفاً متن خود را وارد کنید."
            },
            {
              status:400
            }
          );
        }


        const result =
          await env.AI.run(
            "@cf/meta/llama-3.1-8b-instruct-fast",
            {
              messages:[
                {
                  role:"system",
                  content:
                    "شما یک دستیار هوش مصنوعی فارسی‌زبان هستید. پاسخ‌ها را واضح، مفید و به زبان فارسی ارائه کنید."
                },
                {
                  role:"user",
                  content:prompt
                }
              ]
            }
          );


        return Response.json({
          answer:
            result.response ||
            "پاسخی دریافت نشد."
        });


      } catch(error) {

        return Response.json(
          {
            error:
              "خطا در اتصال به هوش مصنوعی: " +
              error.message
          },
          {
            status:500
          }
        );
      }
    }


    return new Response(
      "Not Found",
      {
        status:404
      }
    );
  }
};
