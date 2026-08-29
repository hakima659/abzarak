
<!DOCTYPE html>
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
 background:#f4f7fb;
 height:100vh;
 display:flex;
 flex-direction:column;
}
header{
 background:#fff;
 padding:18px;
 text-align:center;
 box-shadow:0 2px 10px #0001;
}
header h2{margin:0 0 6px}
header p{margin:0;color:#777}
#chat{
 flex:1;
 overflow-y:auto;
 padding:15px;
}
.msg{
 max-width:85%;
 padding:12px 15px;
 margin:10px 0;
 border-radius:16px;
 line-height:1.8;
 white-space:pre-wrap;
}
.user{
 margin-right:auto;
 background:#dcecff;
}
.ai{
 margin-left:auto;
 background:#fff;
 box-shadow:0 2px 8px #0001;
}
.bottom{
 background:#fff;
 padding:10px;
 box-shadow:0 -2px 10px #0001;
}
.row{
 display:flex;
 gap:8px;
}
textarea{
 flex:1;
 border:1px solid #ddd;
 border-radius:14px;
 padding:12px;
 resize:none;
 font-size:16px;
 outline:none;
}
button{
 border:0;
 border-radius:12px;
 padding:0 16px;
 font-size:15px;
 cursor:pointer;
}
.send{background:#1677ff;color:white}
.clear{background:#eee;margin-top:8px;width:100%;padding:10px}
</style>
</head>

<body>

<header>
<h2>🤖 دستیار هوش مصنوعی</h2>
<p>سلام! 👋 سوالت را بنویس.</p>
</header>

<div id="chat"></div>

<div class="bottom">
<div class="row">
<textarea id="prompt" rows="1" placeholder="پیامت را بنویس..."></textarea>
<button class="send" onclick="sendMessage()">ارسال</button>
</div>

<button class="clear" onclick="clearChat()">🗑️ پاک کردن گفتگو</button>
</div>

<script>
const chat=document.getElementById("chat");
const prompt=document.getElementById("prompt");

function addMessage(text,type){
 const div=document.createElement("div");
 div.className="msg "+type;
 div.textContent=text;
 chat.appendChild(div);
 chat.scrollTop=chat.scrollHeight;
}

async function sendMessage(){
 const text=prompt.value.trim();
 if(!text)return;

 addMessage(text,"user");
 prompt.value="";

 const loading=document.createElement("div");
 loading.className="msg ai";
 loading.textContent="⏳ در حال پاسخ...";
 chat.appendChild(loading);

 try{
   const res=await fetch("/api/ai",{
     method:"POST",
     headers:{"Content-Type":"application/json"},
     body:JSON.stringify({prompt:text})
   });

   const data=await res.json();
   loading.textContent=data.answer || data.response || data.error || "پاسخی دریافت نشد.";
 }catch(e){
   loading.textContent="❌ خطا در ارتباط با هوش مصنوعی";
 }

 chat.scrollTop=chat.scrollHeight;
}

function clearChat(){
 chat.innerHTML="";
}

prompt.addEventListener("keydown",e=>{
 if(e.key==="Enter" && !e.shiftKey){
   e.preventDefault();
   sendMessage();
 }
});
</script>

</body>
</html>
