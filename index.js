import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {
  try {
    const { topic, tone, styles } = req.body;

    if (!topic || !tone || !styles) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const prompt = `
Your job is to return ONLY valid JSON.
No hashtags outside the JSON.
No markdown.
No commentary.

Return an array of objects like this:

[
  {
    "variant": "Friendly",
    "short": "...",
    "medium": "...",
    "long": "...",
    "hashtags": ["#tag1", "#tag2"]
  }
]

Now generate captions for topic: "${topic}"
Base tone: "${tone}"
Styles: ${styles.join(", ")}
`;

    // --- CALL OPENAI ---
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        { role: "system", content: "You generate JSON only." },
        { role: "user", content: prompt }
      ]
    });

    const aiText = completion.choices[0].message.content.trim();

    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (e) {
      console.log("AI returned invalid JSON:", aiText);
      return res.status(500).json({ error: "AI returned invalid JSON", raw: aiText });
    }

    res.json({ success: true, captions: parsed });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
