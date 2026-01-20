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

/* ===== CHAT ===== */
const chat=document.getElementById("chat");
const input=document.getElementById("input");
const sendBtn=document.getElementById("send");

const API_KEY = import.meta?.env?.VITE_GEMINI_KEY || "YOUR_API_KEY_HERE";
const MODEL = "gemini-2.0-flash";

/* Conversation memory */
let memory=[];

function add(role,html){
  const d=document.createElement("div");
  d.className="msg "+role;
  d.innerHTML=html;
  chat.appendChild(d);
  chat.scrollTop=chat.scrollHeight;
}

function typingDots(){
  return `<span class="typing">
    <span>●</span><span>●</span><span>●</span>
  </span>`;
}

/* Commands */
function handleCommand(text){
  if(text==="/clear"){
    chat.innerHTML="";
    memory=[];
    add("ai","<strong>AI:</strong> Chat cleared.");
    return true;
  }
  if(text==="/help"){
    add("ai",`
      <strong>AI:</strong><br>
      <code>/help</code> – show commands<br>
      <code>/clear</code> – clear chat
    `);
    return true;
  }
  return false;
}

async function send(){
  const text=input.value.trim();
  if(!text) return;
  input.value="";

  add("user",`<strong>You:</strong> ${text}`);
  if(handleCommand(text)) return;

  const typingEl=document.createElement("div");
  typingEl.className="msg ai";
  typingEl.innerHTML=`<strong>AI:</strong> ${typingDots()}`;
  chat.appendChild(typingEl);
  chat.scrollTop=chat.scrollHeight;

  memory.push({role:"user",parts:[{text}]});

  try{
    const res=await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({contents:memory})
      }
    );
    const data=await res.json();
    typingEl.remove();

    const reply=data.candidates?.[0]?.content?.parts?.[0]?.text
      || "No response.";

    memory.push({role:"model",parts:[{text:reply}]});
    add("ai",`<strong>AI:</strong> ${reply}`);

  }catch{
    typingEl.remove();
    add("ai","<strong>AI:</strong> ⚠️ System error. Check API key.");
  }
}

/* EVENTS */
sendBtn.onclick=send;
input.addEventListener("keydown",e=>{
  if(e.key==="Enter") send();
});
