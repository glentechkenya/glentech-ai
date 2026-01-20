/* ================= PARTICLES ================= */
const c = document.getElementById("particles");
const x = c.getContext("2d");

function resize(){
  c.width = innerWidth;
  c.height = innerHeight;
}
window.addEventListener("resize", resize);
resize();

const particles = Array.from({length:80}, () => ({
  x: Math.random()*c.width,
  y: Math.random()*c.height,
  vx:(Math.random()-.5)*0.4,
  vy:(Math.random()-.5)*0.4,
  r: Math.random()*2+1
}));

(function animate(){
  x.clearRect(0,0,c.width,c.height);
  x.fillStyle="#00ffe1";
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>c.width) p.vx*=-1;
    if(p.y<0||p.y>c.height) p.vy*=-1;
    x.globalAlpha=0.6;
    x.beginPath();
    x.arc(p.x,p.y,p.r,0,Math.PI*2);
    x.fill();
  });
  requestAnimationFrame(animate);
})();

/* ================= CHAT ================= */
const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

/* 🔑 PUT YOUR REAL GEMINI KEY HERE (TEMPORARY) */
const API_KEY = "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";
const MODEL = "gemini-2.0-flash";

let memory = [];

function add(role, html){
  const d = document.createElement("div");
  d.className = "msg " + role;
  d.innerHTML = html;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
}

function typingDots(){
  return `
    <span class="typing">
      <span>●</span><span>●</span><span>●</span>
    </span>`;
}

/* Commands */
function handleCommand(text){
  if(text === "/clear"){
    chat.innerHTML = "";
    memory = [];
    add("ai","<strong>AI:</strong> Chat cleared.");
    return true;
  }
  if(text === "/help"){
    add("ai",`
      <strong>AI:</strong><br>
      /help – show commands<br>
      /clear – clear chat
    `);
    return true;
  }
  return false;
}

async function send(){
  const text = input.value.trim();
  if(!text) return;

  input.value = "";
  add("user", `<strong>You:</strong> ${text}`);

  if(handleCommand(text)) return;

  const typing = document.createElement("div");
  typing.className = "msg ai";
  typing.innerHTML = `<strong>AI:</strong> ${typingDots()}`;
  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;

  memory.push({ role:"user", parts:[{text}] });

  try{
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ contents: memory })
      }
    );

    const data = await res.json();
    typing.remove();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from model.";

    memory.push({ role:"model", parts:[{text: reply}] });
    add("ai", `<strong>AI:</strong> ${reply}`);

  }catch(err){
    typing.remove();
    add("ai","<strong>AI:</strong> ⚠️ API error or invalid key.");
  }
}

/* EVENTS */
sendBtn.addEventListener("click", send);
input.addEventListener("keydown", e=>{
  if(e.key === "Enter") send();
});
