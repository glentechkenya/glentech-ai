import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "GlenAI"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-preview-09-2025",
          max_tokens: 800,
          temperature: 0.8,
          messages: [
            {
              role: "system",
              content:
                "You are a smart, friendly futuristic AI assistant. Do NOT repeat your name. Do NOT mention GlenTech unless asked. Speak naturally like a human. Use emojis sometimes. Be concise but helpful. Format code inside triple backticks only."
            },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    res.status(500).json({ error: "Network error" });
  }
});

app.listen(PORT, () =>
  console.log("🚀 GlenAI running on port", PORT)
);
