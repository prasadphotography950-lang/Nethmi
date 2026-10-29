import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "12mb" }));
app.use(express.static("public"));

app.get("/api/status", (_req, res) => {
  res.json({
    chatConfigured: Boolean(process.env.GEMINI_API_KEY),
    message: process.env.GEMINI_API_KEY
      ? "Gemini API සම්බන්ධයි"
      : "GEMINI_API_KEY එක සකස් කරන්න"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        error: "Gemini API key එක server එකේ සකස් කර නැහැ."
      });
    }

    const { messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "පණිවිඩයක් ඇතුළත් කරන්න."
      });
    }

    const contents = messages.slice(-12).map((m) => {
      const parts = [];

      if (typeof m.text === "string" && m.text.trim()) {
        parts.push({ text: m.text.slice(0, 6000) });
      }

      if (
        m.role === "user" &&
        typeof m.imageData === "string" &&
        m.imageData.length < 8000000
      ) {
        const match = m.imageData.match(
          /^data:(image\/(?:png|jpeg|webp));base64,([\s\S]+)$/i
        );

        if (match) {
          parts.push({
            inlineData: {
              mimeType: match[1],
              data: match[2]
            }
          });
        }
      }

      if (!parts.length) parts.push({ text: "(පණිවිඩයක්)" });

      return {
        role: m.role === "assistant" ? "model" : "user",
        parts
      };
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: "ඔබ නෙත්මි නම් වූ කල්පිත AI සහායක චරිතයකි. වයස 19ක ශ්‍රී ලාංකික චරිතයක් ලෙස ස්වභාවික, ආචාරශීලී සිංහලෙන් කතා කරන්න. ඔබ AI බව අවංකව කියන්න. ඡායාරූප ලැබුණොත් ඒවා ගැන සුදුසු විස්තර දෙන්න. කෙටි, උණුසුම් පිළිතුරු දෙන්න."
            }]
          },
          contents,
          generationConfig: {
            maxOutputTokens: 600,
            temperature: 0.8
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data?.error?.message || response.status);
      return res.status(502).json({
        error: "Gemini API ගැටලුවක්. API key, quota සහ model access පරීක්ෂා කරන්න."
      });
    }

    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || "")
      .join("")
      .trim();

    res.json({
      reply: reply || "සමාවෙන්න, දැන් පිළිතුරක් ලබාදෙන්න බැරි වුණා."
    });
  } catch (err) {
    console.error("Gemini request failed:", err?.message || err);
    res.status(500).json({
      error: "AI පිළිතුර ලබාගැනීමේදී server ගැටලුවක් ඇති වුණා."
    });
  }
});

app.listen(port, () => {
  console.log(`Nethmi AI server listening on port ${port}`);
});
