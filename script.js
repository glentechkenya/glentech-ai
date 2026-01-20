/* ===== PARTICLES ===== */
const c=document.getElementById("particles"),x=c.getContext("2d");
let w,h,p;
function rs(){w=c.width=innerWidth;h=c.height=innerHeight}
addEventListener("resize",rs);rs();
p=Array.from({length:80},()=>({
  x:Math.random()*w,y:Math.random()*h,
  vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,r:Math.random()*2+1
}));
(function anim(){
  x.clearRect(0,0,w,h);
  x.fillStyle="#00ffe1";
  p.forEach(a=>{
    a.x+=a.vx;a.y+=a.vy;
    if(a.x<0||a.x>w)a.vx*=-1;
    if(a.y<0||a.y>h)a.vy*=-1;
    x.globalAlpha=.6;
    x.beginPath();
    x.arc(a.x,a.y,a.r,0,Math.PI*2);
    x.fill();
  });
  requestAnimationFrame(anim);
})();

/* ===== CHAT LOGIC ===== */
const chat=document.getElementById("chat");
const input=document.getElementById("input");

/*
IMPORTANT:
You will set your API key as an ENV variable:
VITE_GEMINI_KEY or GEMINI_API_KEY
*/
const API_KEY = import.meta?.env?.VITE_GEMINI_KEY || "YOUR_API_KEY_HERE";
const MODEL = "gemini-2.0-flash";

function add(role,text){
  const d=document.createElement("div");
  d.className="msg "+role;
  d.innerHTML=`<strong>${role==="ai"?"AI":"You"}:</strong> ${text}`;
  chat.appendChild(d);
  chat.scrollTop=chat.scrollHeight;
}

async function send(){
  const text=input.value.trim();
  if(!text) return;
  input.value="";
  add("user",text);
  add("ai","Processing...");

  try{
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          contents:[{parts:[{text}]}]
        })
      }
    );

    const data = await res.json();
    chat.lastChild.remove();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from model.";

    add("ai",reply);

  }catch(err){
    chat.lastChild.remove();
    add("ai","⚠️ System error. Check API key or network.");
  }
}
