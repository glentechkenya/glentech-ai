const chat = document.getElementById("chat");
const input = document.getElementById("input");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = "msg " + sender;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  const thinking = document.createElement("div");
  thinking.className = "msg bot";
  thinking.innerText = "Thinking...";
  chat.appendChild(thinking);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    chat.removeChild(thinking);

    if (data.error) {
      addMessage("Error: " + data.error, "bot");
      return;
    }

    addMessage(data.reply, "bot");

  } catch (err) {
    chat.removeChild(thinking);
    addMessage("Network error", "bot");
  }
}
