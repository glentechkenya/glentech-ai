import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// simple memory (safe)
const memory = {};

app.post("/chat", async (req, res) => {
  const { message, userId } = req.body;
  if (!message) return res.json({ reply: "…" });

  memory[userId] = memory[userId] || [];
  memory[userId].push({ role: "user", content: message });

  // keep memory short
  memory[userId] = memory[userId].slice(-10);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp",
        messages: memory[userId]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Try again.";

    memory[userId].push({ role: "assistant", content: reply });
    res.json({ reply });

  } catch {
    res.json({ reply: "Network error. Retry." });
  }
});

app.listen(3000, () => {
  console.log("GlenAI running");
});
