const HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
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
}

body{
  font-family:Arial,sans-serif;
  background:#f1f5f9;
  display:flex;
  flex-direction:column;
  overflow:hidden;
}

header{
  flex:none;
  background:linear-gradient(135deg,#1677ff,#6c4cff);
  color:white;
  text-align:center;
  padding:18px 12px;
}

header h2{
  margin:0 0 6px;
  font-size:21px;
}

header p{
  margin:0;
  font-size:14px;
}

.account{
  flex:none;
  background:white;
  margin:10px;
  padding:12px;
  border-radius:16px;
  box-shadow:0 2px 10px #0001;
}

.account-top{
  display:flex;
  align-items:center;
  gap:10px;
}

.account-icon{
  font-size:28px;
}

.account-title{
  font-weight:bold;
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
  width:100%;
  margin-top:10px;
  padding:10px;
  border:0;
  border-radius:12px;
  background:#16a34a;
  color:white;
  font-size:15px;
  font-weight:bold;
}

#chat{
  flex:1;
  overflow-y:auto;
  padding:5px 12px 170px;
}

.welcome{
  text-align:center;
  color:#777;
  margin-top:20px;
}

.msg{
  max-width:90%;
  padding:12px 14px;
  margin:10px 0;
  border-radius:16px;
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
  box-shadow:0 2px 8px #0001;
}

.bottom{
  position:fixed;
  z-index:1000;
  bottom:0;
  left:0;
  right:0;
  width:100%;
  background:white;
  padding:10px;
  box-shadow:0 -3px 15px #0002;
}

.row{
  width:100%;
  display:flex;
  align-items:stretch;
  gap:8px;
}

#prompt{
  display:block !important;
  visibility:visible !important;
  opacity:1 !important;
  flex:1 1 auto;
  width:100%;
  min-width:0;
  height:52px;
  border:2px solid #d5dbe3;
  border-radius:14px;
  padding:12px;
  font-family:Arial,sans-serif;
  font-size:16px;
  color:#111;
  background:#f8fafc;
  outline:none;
  resize:none;
}

#prompt:focus{
  border-color:#1677ff;
  background:white;
}

.send{
  flex:none;
  width:75px;
  height:52px;
  border:0;
  border-radius:14px;
  background:#1677ff;
  color:white;
  font-size:15px;
  font-weight:bold;
}

.clear{
  display:block;
  width:100%;
  height:42px;
  margin-top:8px;
  border:0;
  border-radius:12px;
  background:#f1f5f9;
  color:#555;
  font-size:14px;
}

@media(max-width:600px){
  .bottom{
    padding:8px;
  }

  #prompt{
    font-size:16px;
    height:50px;
  }

  .send{
    width:70px;
    height:50px;
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

  <button class="withdraw" onclick="withdraw()">
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
      placeholder="پیامت را بنویس..."
      autocomplete="off"
      spellcheck="false"
    ></textarea>

    <button
      type="button"
      class="send"
      onclick="sendMessage()"
    >
      ارسال
    </button>

  </div>

  <button
    type="button"
    class="clear"
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
    '<div class="welcome">✨ من آماده‌ام؛ هر سؤالی داری بپرس.</div>';

}

function withdraw(){

  alert(
    "💰 موجودی فعلی شما: $0.00\\n\\n" +
    "سیستم برداشت پس از راه‌اندازی درآمد واقعی فعال خواهد شد."
  );

}

promptBox.addEventListener("keydown",function(e){

  if(e.key === "Enter" && !e.shiftKey){

    e.preventDefault();

    sendMessage();

  }

});

promptBox.addEventListener("click",function(){

  promptBox.focus();

});

</script>

</body>
</html>`;

export default {
  async fetch(request, env) {

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

        const prompt = body.prompt;

        if(!prompt || !prompt.trim()){

          return Response.json(
            {error:"لطفاً متن خود را وارد کنید."},
            {status:400}
          );

        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",
          {
            messages:[
              {
                role:"system",
                content:"تو یک دستیار هوش مصنوعی مفید و مودب هستی. به زبان کاربر پاسخ بده."
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
            result.result?.response ||
            "پاسخی دریافت نشد."
        });

      }catch(error){

        return Response.json(
          {
            error:"خطا در دریافت پاسخ هوش مصنوعی: " + error.message
          },
          {status:500}
        );

      }

    }

    return new Response("Not Found",{
      status:404
    });

  }
};
  
