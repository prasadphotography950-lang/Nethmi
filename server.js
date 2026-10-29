import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json({ limit: "12mb" }));
app.use(express.static("public"));

function getClient() {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

app.get("/api/status", (_req, res) => {
  res.json({
    chatConfigured: Boolean(process.env.OPENAI_API_KEY),
    message: process.env.OPENAI_API_KEY
      ? "AI සේවාව සම්බන්ධයි"
      : "OPENAI_API_KEY එක .env ගොනුවට එක් කරන්න"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const client = getClient();
    if (!client) return res.status(503).json({
      error: "AI සේවාව තවම සකස් කර නැහැ. .env ගොනුවේ OPENAI_API_KEY එක එක් කරන්න."
    });
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "පණිවිඩයක් ඇතුළත් කරන්න." });
    }

    const recent = messages.slice(-12).map((m) => {
      const role = m.role === "assistant" ? "assistant" : "user";
      const content = [];
      if (typeof m.text === "string" && m.text.trim()) {
        content.push({ type: "input_text", text: m.text.slice(0, 6000) });
      }
      if (role === "user" && typeof m.imageData === "string" &&
          /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(m.imageData) &&
          m.imageData.length < 8_000_000) {
        content.push({ type: "input_image", image_url: m.imageData });
      }
      return { role, content: content.length ? content : [{type:"input_text",text:"(පණිවිඩයක්)"}] };
    });

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions: `ඔබ නෙත්මි නම් වූ AI සහායක චරිතයකි. ඔබට වයස 19ක් ඇති ශ්‍රී ලාංකික තරුණියකගේ කල්පිත චරිතයක් ලෙස හඳුන්වා දෙන්න. පරිශීලකයා සමඟ ස්වභාවික, ආචාරශීලී සිංහලෙන් කතා කරන්න. අවශ්‍ය විට ඉංග්‍රීසි වචන භාවිතා කළ හැක. ඔබ AI එකක් බව අසන විට අවංකව කියන්න; සැබෑ මනුෂ්‍යයෙක් ලෙස පෙනී නොසිටින්න. පරිශීලකයා ඡායාරූපයක් යවා ඇත්නම් එය පිළිබඳව පමණක් සුදුසු, ආරක්ෂිත විස්තරයක් දෙන්න. කෙටි හා උණුසුම් පිළිතුරු දෙන්න.`,
      input: recent,
      max_output_tokens: 500
    });
    res.json({ reply: response.output_text || "සමාවෙන්න, දැන් පිළිතුරක් ලබාදෙන්න බැරි වුණා." });
  } catch (err) {
    console.error("AI request failed:", err?.message || err);
    res.status(500).json({ error: "AI සේවාවෙන් පිළිතුරක් ලබාගන්න බැරි වුණා. API key එක සහ account usage එක පරීක්ෂා කරන්න." });
  }
});

app.listen(port, () => {
  console.log(`Nethmi AI web app: http://localhost:${port}`);
});
