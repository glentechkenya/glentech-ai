import express from "express";
import axios from "axios";

const app = express();
app.use(express.static("public"));
app.use(express.json());

// Gemini chat endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        contents: [{ parts: [{ text: message }]}]
      },
      {
        headers: { "Content-Type": "application/json" },
        params: { key: process.env.GEMINI_API_KEY }
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";
    res.json({ reply });
  } catch (err) {
    console.error("Gemini API error:", err.message);
    res.status(500).json({ reply: "❌ Error contacting Gemini API." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Glentech AI running on port ${PORT}`));
