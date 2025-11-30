import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate", async (req, res) => {
  try {
    const { topic, tone, styles } = req.body;

    const prompt = `
      Generate Instagram-style captions.
      Topic: ${topic}
      Base tone: ${tone}
      Styles: ${styles.join(", ")}
      For each style produce:
      - variant
      - short caption
      - medium caption
      - long caption
      - 8 hashtags
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const text = completion.choices[0].message.content;

    res.json(JSON.parse(text));
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "AI error" });
  }
});

app.listen(3000, () => console.log("Backend running on port 3000"));
