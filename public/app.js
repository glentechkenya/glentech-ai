const messages = document.getElementById("messages");
const typing = document.getElementById("typing");
const input = document.getElementById("text");
const menu = document.getElementById("menu");

const userId =
  localStorage.getItem("glenai_id") || crypto.randomUUID();
localStorage.setItem("glenai_id", userId);

function toggleMenu() {
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  messages.appendChild(div);

  if (type === "ai") {
    let i = 0;
    const interval = setInterval(() => {
      div.textContent += text[i];
      i++;
      messages.scrollTop = messages.scrollHeight;
      if (i >= text.length) clearInterval(interval);
    }, 20);
  } else {
    div.textContent = text;
  }
}

async function send() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
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
    addMessage(data.reply, "ai");

  } catch {
    typing.style.display = "none";
    addMessage("signal lost", "ai");
  }
}

/* PARTICLES */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

let particles = Array.from({ length: 50 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 2,
  dx: Math.random() * 0.3,
  dy: Math.random() * 0.3
}));

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "#00ffcc55";
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x > canvas.width) p.x = 0;
    if (p.y > canvas.height) p.y = 0;
  });
  requestAnimationFrame(animate);
}
animate();
