
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
 background:#f1f5f9;
 height:100vh;
 display:flex;
 flex-direction:column;
}

header{
 background:linear-gradient(135deg,#1677ff,#6c4cff);
 color:white;
 padding:20px 15px;
 text-align:center;
 box-shadow:0 3px 15px #0002;
}

header h2{
 margin:0 0 7px;
 font-size:23px;
}

header p{
 margin:0;
 opacity:.9;
 font-size:14px;
}

#chat{
 flex:1;
 overflow-y:auto;
 padding:18px 14px 120px;
}

.welcome{
 text-align:center;
 color:#777;
 margin-top:35px;
 font-size:15px;
}

.msg{
 max-width:88%;
 padding:13px 16px;
 margin:12px 0;
 border-radius:18px;
 line-height:1.9;
 white-space:pre-wrap;
 word-wrap:break-word;
}

.user{
 margin-right:auto;
 background:#dbeafe;
 border-bottom-right-radius:5px;
}

.ai{
 margin-left:auto;
 background:white;
 box-shadow:0 3px 12px #0001;
 border-bottom-left-radius:5px;
}

.bottom{
 position:fixed;
 bottom:0;
 right:0;
 left:0;
 background:white;
 padding:10px;
 box-shadow:0 -3px 15px #0002;
}

.row{
 display:flex;
 gap:8px;
 max-width:900px;
 margin:auto;
}

textarea{
 flex:1;
 border:1px solid #d5dbe3;
 border-radius:16px;
 padding:13px;
 resize:none;
 font-size:16px;
 outline:none;
 min-height:48px;
 background:#f8fafc;
}

textarea:focus{
 border-color:#1677ff;
 background:white;
}

button{
 border:0;
 border-radius:14px;
 padding:0 18px;
 font-size:15px;
 cursor:pointer;
}

.send{
 background:#1677ff;
 color:white;
 font-weight:bold;
}

.send:active{
 transform:scale(.97);
}

.clear{
 display:block;
 max-width:900px;
 margin:8px auto 0;
 width:100%;
 padding:10px;
 background:#f1f5f9;
 color:#555;
}

.clear:hover{
 background:#e5e7eb;
}

@media(max-width:600px){
 header h2{font-size:20px}
 .msg{max-width:92%}
 button.send{padding:0 14px}
}
</style>
</head>

<body>

<header>
<h2>🤖 دستیار هوش مصنوعی</h2>
<p>سلام! 👋 سوالت را بنویس.</p>
</header>

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
></textarea>

<button class="send" onclick="sendMessage()">
ارسال
</button>
</div>

<button class="clear" onclick="clearChat()">
🗑️ پاک کردن گفتگو
</button>

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

 const welcome=document.querySelector(".welcome");
 if(welcome) welcome.remove();

 addMessage(text,"user");

 prompt.value="";

 const loading=document.createElement("div");
 loading.className="msg ai";
 loading.textContent="⏳ در حال پاسخ...";
 chat.appendChild(loading);

 chat.scrollTop=chat.scrollHeight;

 try{

   const res=await fetch("/api/ai",{
     method:"POST",
     headers:{
       "Content-Type":"application/json"
     },
     body:JSON.stringify({
       prompt:text
     })
   });

   const data=await res.json();

   loading.textContent=
     data.answer ||
     data.response ||
     data.error ||
     "پاسخی دریافت نشد.";

 }catch(e){

   loading.textContent=
     "❌ خطا در ارتباط با هوش مصنوعی";

 }

 chat.scrollTop=chat.scrollHeight;
}

function clearChat(){

 chat.innerHTML=
 `<div class="welcome">
 ✨ من آماده‌ام؛ هر سؤالی داری بپرس.
 </div>`;

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
