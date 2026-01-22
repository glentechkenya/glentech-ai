const messages = document.getElementById("messages");
const typing = document.getElementById("typing");
const input = document.getElementById("text");
const menu = document.getElementById("menu");
const boot = document.getElementById("boot");
const app = document.getElementById("app");
const voiceState = document.getElementById("voiceState");

let voiceEnabled = true;

/* BOOT SEQUENCE */
setTimeout(() => {
  boot.style.display = "none";
  app.classList.remove("hidden");
}, 2200);

/* USER ID */
const userId =
  localStorage.getItem("glenai_id") || crypto.randomUUID();
localStorage.setItem("glenai_id", userId);

/* MENU */
function toggleMenu() {
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

/* VOICE */
function toggleVoice() {
  voiceEnabled = !voiceEnabled;
  voiceState.textContent = voiceEnabled ? "on" : "off";
}

function speak(text) {
  if (!voiceEnabled) return;
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.85;
  u.pitch = 0.7;
  speechSynthesis.speak(u);
}

/* HIDDEN LINKS */
function decode(s) {
  return atob(s.split("").reverse().join(""));
}

function openGroup() {
  window.open(
    decode("PV0p1RXZ4c0R2ZEVxYzRzWFd2bHdMNXAvL21vYy5wcGFzdGFod3A6c3B0dGg=")
  );
}

function openChannel() {
  window.open(
    decode("cFBTRFdVQUZoWGwwRzBlaDd6QmI5MDAyL2xlbm5haGMvbW9jLnBwcGFzdGFod3A6c3B0dGg=")
  );
}

/* MESSAGES */
function addUser(text) {
  const d = document.createElement("div");
  d.className = "msg user";
  d.textContent = text;
  messages.appendChild(d);
  messages.scrollTop = messages.scrollHeight;
}

function typeAI(text) {
  const d = document.createElement("div");
  d.className = "msg ai";
  messages.appendChild(d);
  let i = 0;
  const t = setInterval(() => {
    d.textContent += text[i];
    i++;
    messages.scrollTop = messages.scrollHeight;
    if (i >= text.length) {
      clearInterval(t);
      speak(text);
    }
  }, 18);
}

/* SEND */
async function send() {
  const text = input.value.trim();
  if (!text) return;
  addUser(text);
  input.value = "";
  typing.style.display = "block";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, userId })
    });
    const data = await res.json();
    typing.style.display = "none";
    typeAI(data.reply);
  } catch {
    typing.style.display = "none";
    typeAI("signal lost.");
  }
}

input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});

/* PARTICLES */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const particles = Array.from({ length: 70 }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  r: Math.random() * 1.5 + .5,
  dx: (Math.random() - .5) * .3,
  dy: (Math.random() - .5) * .3
}));

function animate() {
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = "#00ffcc";
  particles.forEach(p => {
    p.x += p.dx; p.y += p.dy;
    if (p.x<0||p.x>w) p.dx*=-1;
    if (p.y<0||p.y>h) p.dy*=-1;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
  });
  requestAnimationFrame(animate);
}
animate();
