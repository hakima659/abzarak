const HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>دستیار هوش مصنوعی</title>

<style>
*{
  box-sizing:border-box;
}

html,body{
  margin:0;
  padding:0;
  width:100%;
  min-height:100%;
}

body{
  font-family:Arial,sans-serif;
  background:#f1f5f9;
  color:#111;
  padding-bottom:125px;
}

header{
  background:linear-gradient(135deg,#1677ff,#6c4cff);
  color:white;
  text-align:center;
  padding:18px 10px;
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
  display:block;
  width:100%;
  margin-top:10px;
  padding:11px;
  border:0;
  border-radius:12px;
  background:#16a34a;
  color:white;
  font-size:15px;
  font-weight:bold;
}

#chat{
  padding:10px 12px 20px;
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
  z-index:99999;
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
  gap:7px;
}

#prompt{
  display:block;
  flex:1;
  width:1px;
  min-width:0;
  height:52px;
  border:2px solid #1677ff;
  border-radius:14px;
  padding:0 13px;
  font-family:Arial,sans-serif;
  font-size:17px;
  color:#111;
  background:white;
  outline:none;
  -webkit-appearance:none;
  appearance:none;
}

#prompt::placeholder{
  color:#777;
  opacity:1;
}

#prompt:focus{
  border-color:#6c4cff;
  box-shadow:0 0 0 2px #6c4c222;
}

.send{
  flex:none;
  width:72px;
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
  height:40px;
  margin-top:7px;
  border:0;
  border-radius:12px;
  background:#f1f5f9;
  color:#555;
  font-size:14px;
}

@media(max-width:600px){

  body{
    padding-bottom:120px;
  }

  #prompt{
    height:52px;
    font-size:17px;
  }

  .send{
    width:70px;
    height:52px;
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

    <input
      id="prompt"
      type="text"
      placeholder="پیامت را بنویس..."
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
    >

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
    "سیستم برداشت هنوز فعال نشده است."
  );

}

promptBox.addEventListener("keydown",function(e){

  if(e.key === "Enter"){

    e.preventDefault();

    sendMessage();

  }

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
                content:"تو یک دستیار هوش مصنوعی مفید و مودب هستی. همیشه به زبان کاربر پاسخ بده."
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
