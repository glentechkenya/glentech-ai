const messages = document.getElementById("messages");
const typing = document.getElementById("typing");
const input = document.getElementById("text");

const userId = localStorage.getItem("glenai_id") || crypto.randomUUID();
localStorage.setItem("glenai_id", userId);

function add(text, cls) {
  const div = document.createElement("div");
  div.className = `msg ${cls}`;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

async function send() {
  if (!input.value) return;
  add(input.value, "user");
  typing.style.display = "block";

  const msg = input.value;
  input.value = "";

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg, userId })
  });

  const data = await res.json();
  typing.style.display = "none";
  add(data.reply, "ai");
}
