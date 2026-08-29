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
  background:#f3f4f6;
  color:#111827;
}
.app{
  max-width:700px;
  margin:auto;
  min-height:100vh;
  display:flex;
  flex-direction:column;
  background:white;
}
header{
  background:#111827;
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
  padding:12px 15px;
  margin:10px 0;
  border-radius:15px;
  max-width:90%;
  line-height:1.8;
  white-space:pre-wrap;
}
.user{
  background:#e5e7eb;
  margin-right:auto;
}
.ai{
  background:#eef2ff;
  margin-left:auto;
}
.bottom{
  display:flex;
  gap:8px;
  padding:10px;
  border-top:1px solid #ddd;
  background:white;
}
input{
  flex:1;
  padding:14px;
  border:1px solid #ccc;
  border-radius:12px;
  font-size:16px;
  outline:none;
}
button{
  border:0;
  border-radius:12px;
  padding:0 18px;
  background:#111827;
  color:white;
  font-size:16px;
}
button:disabled{
  opacity:.5;
}
.clear{
  background:#dc2626;
  margin:10px;
  padding:12px;
}
</style>
</head>

<body>

<div class="app">

<header>🤖 دستیار هوش مصنوعی</header>

<div id="chat">
  <div class="msg ai">
    سلام! 👋 من آماده‌ام. چه کمکی از من می‌خواهی؟
  </div>
</div>

<button class="clear" onclick="clearChat()">
🗑️ پاک کردن گفتگو
</button>

<div class="bottom">
  <input
    id="input"
    type="text"
    placeholder="پیامت را بنویس..."
    onkeydown="if(event.key==='Enter') sendMessage()"
  >
  <button id="send" onclick="sendMessage()">ارسال</button>
</div>

</div>

<script>

const input = document.getElementById("input");
const chat = document.getElementById("chat");
const send = document.getElementById("send");

function addMessage(text,type){
  const div=document.createElement("div");
  div.className="msg "+type;
  div.textContent=text;
  chat.appendChild(div);
  chat.scrollTop=chat.scrollHeight;
  return div;
}

async function sendMessage(){

  const prompt=input.value.trim();

  if(!prompt) return;

  addMessage(prompt,"user");

  input.value="";
  send.disabled=true;

  const loading=addMessage("در حال فکر کردن...","ai");

  try{

    const response=await fetch("/api/ai",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        prompt:prompt
      })
    });

    const data=await response.json();

    loading.remove();

    if(!response.ok){
      addMessage(
        data.error || "خطایی در اجرای هوش مصنوعی رخ داد.",
        "ai"
      );
      return;
    }

    addMessage(
      data.response || "پاسخی دریافت نشد.",
      "ai"
    );

  }catch(error){

    loading.remove();

    addMessage(
      "خطا در اتصال به هوش مصنوعی. دوباره امتحان کن.",
      "ai"
    );

  }finally{

    send.disabled=false;
    input.focus();

  }
}

function clearChat(){
  chat.innerHTML=`
    <div class="msg ai">
      گفتگو پاک شد. 👋 دوباره سوالت را بنویس.
    </div>
  `;
}

</script>

</body>
</html>`;

export default {

  async fetch(request, env) {

    const url = new URL(request.url);

    // صفحه اصلی
    if (request.method === "GET" && url.pathname === "/") {

      return new Response(HTML, {
        headers:{
          "content-type":"text/html; charset=UTF-8"
        }
      });

    }

    // API هوش مصنوعی
    if (request.method === "POST" && url.pathname === "/api/ai") {

      try {

        const body = await request.json();

        const prompt = body.prompt;

        if(!prompt || !prompt.trim()){

          return Response.json(
            {
              error:"لطفاً متن خود را وارد کنید."
            },
            {
              status:400
            }
          );

        }

        const result = await env.AI.run(
          "@cf/google/gemma-4-26b-a4b-it",
          {
            messages:[
              {
                role:"system",
                content:
                "تو یک دستیار هوش مصنوعی فارسی‌زبان مفید، دقیق و دوستانه هستی. پاسخ‌ها را به زبان فارسی بده."
              },
              {
                role:"user",
                content:prompt
              }
            ],
            chat_template_kwargs:{
              enable_thinking:false
            }
          }
        );

        let answer =
          result?.response ||
          result?.text ||
          result?.content ||
          "";

        if(!answer){

          answer =
            typeof result === "string"
              ? result
              : JSON.stringify(result);

        }

        return Response.json({
          response:answer
        });

      } catch(error){

        console.error("AI ERROR:",error);

        return Response.json(
          {
            error:
            "هوش مصنوعی در حال حاضر پاسخ نداد. لطفاً دوباره امتحان کنید."
          },
          {
            status:500
          }
        );

      }

    }

    return new Response("Not Found",{
      status:404
    });

  }

};
