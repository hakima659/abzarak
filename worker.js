const HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<title>دستیار هوش مصنوعی</title>

<style>
*{
  box-sizing:border-box;
}

html,body{
  margin:0;
  padding:0;
  width:100%;
  height:100%;
  font-family:Arial,sans-serif;
  background:#f1f5f9;
}

body{
  min-height:100vh;
  display:flex;
  flex-direction:column;
}

header{
  background:linear-gradient(135deg,#1677ff,#6c4cff);
  color:white;
  padding:18px 12px;
  text-align:center;
  flex-shrink:0;
}

header h2{
  margin:0 0 6px;
  font-size:22px;
}

header p{
  margin:0;
  font-size:14px;
}

.account{
  background:white;
  margin:10px;
  padding:14px;
  border-radius:17px;
  box-shadow:0 3px 12px #0001;
  flex-shrink:0;
}

.account-top{
  display:flex;
  align-items:center;
  gap:10px;
}

.account-icon{
  font-size:29px;
}

.account-title{
  font-weight:bold;
  font-size:16px;
}

.balance{
  margin-right:auto;
  text-align:left;
}

.balance small{
  display:block;
  color:#777;
  font-size:12px;
}

.balance strong{
  color:#1677ff;
  font-size:19px;
}

.withdraw{
  display:block;
  width:100%;
  margin-top:11px;
  padding:11px;
  border:0;
  border-radius:12px;
  background:#16a34a;
  color:white;
  font-size:15px;
  font-weight:bold;
  cursor:pointer;
  touch-action:manipulation;
}

#chat{
  flex:1;
  min-height:0;
  overflow-y:auto;
  padding:10px 14px 150px;
  -webkit-overflow-scrolling:touch;
}

.welcome{
  text-align:center;
  color:#777;
  margin-top:20px;
}

.msg{
  max-width:90%;
  padding:12px 15px;
  margin:10px 0;
  border-radius:17px;
  line-height:1.8;
  white-space:pre-wrap;
  word-break:break-word;
}

.user{
  margin-right:auto;
  background:#dbeafe;
}

.ai{
  margin-left:auto;
  background:white;
  box-shadow:0 3px 10px #0001;
}

.bottom{
  position:fixed;
  z-index:1000;
  bottom:0;
  left:0;
  right:0;
  width:100%;
  background:white;
  padding:9px;
  box-shadow:0 -3px 15px #0002;
}

.row{
  display:flex;
  width:100%;
  max-width:900px;
  margin:auto;
  gap:7px;
}

#prompt{
  display:block;
  flex:1;
  width:100%;
  min-width:0;
  min-height:48px;
  max-height:120px;
  border:1px solid #cbd5e1;
  border-radius:15px;
  padding:12px;
  background:#fff;
  color:#111;
  font-family:Arial,sans-serif;
  font-size:16px;
  outline:none;
  resize:none;
  pointer-events:auto;
  user-select:text;
  -webkit-user-select:text;
  touch-action:manipulation;
}

#prompt:focus{
  border-color:#1677ff;
}

.send{
  flex-shrink:0;
  min-width:70px;
  border:0;
  border-radius:14px;
  padding:0 15px;
  background:#1677ff;
  color:white;
  font-size:15px;
  font-weight:bold;
  cursor:pointer;
  touch-action:manipulation;
}

.clear{
  display:block;
  width:100%;
  max-width:900px;
  margin:7px auto 0;
  padding:9px;
  border:0;
  border-radius:12px;
  background:#f1f5f9;
  color:#555;
  cursor:pointer;
  touch-action:manipulation;
}

@media(max-width:600px){

  header h2{
    font-size:20px;
  }

  .msg{
    max-width:94%;
  }

  .send{
    min-width:65px;
    padding:0 12px;
  }
}
</style>
</head>

<body>

<header>
  <h2>🤖 دستیار هوش مصنوعی</h2>
  <p>سلام! 👋 سوالت را بنویس.</p>
</header>

<div class="account">

  <div class="account-top">

    <div class="account-icon">💰</div>

    <div class="account-title">
      حساب من
    </div>

    <div class="balance">
      <small>موجودی</small>
      <strong>$0.00</strong>
    </div>

  </div>

  <button class="withdraw" type="button" onclick="withdraw()">
    💵 برداشت
  </button>

</div>

<div id="chat">

  <div class="welcome">
    ✨ من آماده‌ام؛ هر سؤالی داری بپرس.
  </div>

</div>

<div class="bottom">

  <div class="row">

    <textarea
      id="prompt"
      rows="1"
      autocomplete="off"
      autocorrect="on"
      placeholder="پیامت را بنویس..."
    ></textarea>

    <button
      class="send"
      type="button"
      onclick="sendMessage()"
    >
      ارسال
    </button>

  </div>

  <button
    class="clear"
    type="button"
    onclick="clearChat()"
  >
    🗑️ پاک کردن گفتگو
  </button>

</div>

<script>

const chat = document.getElementById("chat");
const promptBox = document.getElementById("prompt");

function addMessage(text,type){

  const div = document.createElement("div");

  div.className = "msg " + type;

  div.textContent = text;

  chat.appendChild(div);

  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage(){

  const text = promptBox.value.trim();

  if(!text){
    promptBox.focus();
    return;
  }

  const welcome = document.querySelector(".welcome");

  if(welcome){
    welcome.remove();
  }

  addMessage(text,"user");

  promptBox.value = "";

  const loading = document.createElement("div");

  loading.className = "msg ai";

  loading.textContent = "⏳ در حال پاسخ...";

  chat.appendChild(loading);

  chat.scrollTop = chat.scrollHeight;

  try{

    const res = await fetch("/api/ai",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        prompt:text
      })
    });

    const data = await res.json();

    loading.textContent =
      data.answer ||
      data.response ||
      data.error ||
      "پاسخی دریافت نشد.";

  }catch(error){

    loading.textContent =
      "❌ خطا در ارتباط با هوش مصنوعی";

  }

  chat.scrollTop = chat.scrollHeight;
}

function clearChat(){

  chat.innerHTML =
    '<div class="welcome">' +
    '✨ من آماده‌ام؛ هر سؤالی داری بپرس.' +
    '</div>';

}

function withdraw(){

  alert(
    "💰 موجودی فعلی شما: $0.00\\n\\n" +
    "سیستم برداشت هنوز فعال نشده است."
  );

}

promptBox.addEventListener("keydown",function(e){

  if(e.key === "Enter" && !e.shiftKey){

    e.preventDefault();

    sendMessage();

  }

});

</script>

</body>
</html>`;

export default {

  async fetch(request, env){

    const url = new URL(request.url);

    if(request.method === "GET" && url.pathname === "/"){

      return new Response(HTML,{
        headers:{
          "content-type":"text/html; charset=UTF-8"
        }
      });

    }

    if(request.method === "POST" && url.pathname === "/api/ai"){

      try{

        const body = await request.json();

        const userPrompt = body.prompt;

        if(!userPrompt || !userPrompt.trim()){

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
          "@cf/meta/llama-3.1-8b-instruct",
          {
            messages:[
              {
                role:"system",
                content:
                  "تو یک دستیار هوش مصنوعی فارسی‌زبان، دوستانه، دقیق و مفید هستی."
              },
              {
                role:"user",
                content:userPrompt
              }
            ]
          }
        );

        return Response.json({
          answer:
            result.response ||
            "پاسخی دریافت نشد."
        });

      }catch(error){

        return Response.json(
          {
            error:
              "خطا در ارتباط با هوش مصنوعی: " +
              error.message
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
