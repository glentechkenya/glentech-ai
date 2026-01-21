// public/script.js
const chat = document.getElementById("chat");
const input = document.getElementById("input");
const panel = document.getElementById("panel");

/* ===== PARTICLES ===== */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let w, h;

function resize() {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
}
resize();
onresize = resize;

const pts = Array.from({ length: 80 }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  r: Math.random() * 2 + 0.5,
  v: 0.2 + Math.random() * 0.5
}));

(function animate() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#00f7ff22";
  pts.forEach(p => {
    p.y -= p.v;
    if (p.y < 0) p.y = h;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animate);
})();

/* ===== MENU ===== */
function toggleMenu() {
  panel.style.display = panel.style.display === "flex" ? "none" : "flex";
}

function openLink(i) {
  const links = [
    "https://chat.whatsapp.com/L6wlVwXs4cqEdvDdXs8pWO",
    "https://whatsapp.com/channel/0029Vb5hEyp0gcfMx7GQfe0m"
  ];
  window.open(links[i - 1], "_blank");
}

/* ===== CHAT ===== */
function typing(div, text) {
  let i = 0;
  const speed = () => Math.max(12, 28 + Math.sin(i / 6) * 10);

  (function loop() {
    div.textContent += text[i++] || "";
    chat.scrollTop = chat.scrollHeight;
    if (i < text.length) setTimeout(loop, speed());
  })();
}

function add(text, who) {
  const d = document.createElement("div");
  d.className = "msg " + who;
  chat.appendChild(d);

  const clean = text.replace(/\*\*/g, "");
  typing(d, clean);

  if (who === "bot") {
    const copy = document.createElement("button");
    copy.className = "copy";
    copy.textContent = "Copy";
    copy.onclick = () => navigator.clipboard.writeText(clean);
    d.appendChild(copy);
  }
}

async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;

  add(msg, "user");
  input.value = "";

  const dots = document.createElement("div");
  dots.className = "msg bot";
  dots.textContent = "…";
  chat.appendChild(dots);

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  });

  chat.removeChild(dots);

  const data = await res.json();
  let reply = data.reply;

  if (Math.random() < 0.3) reply = "I am GlenAI. " + reply;

  add(reply, "bot");
}
