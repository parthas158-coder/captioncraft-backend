import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

// Create express app
const app = express();
app.use(cors());
app.use(express.json());

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper for calling OpenAI
async function askOpenAI(prompt) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
  });

  return completion.choices[0].message.content;
}

/* ------------------------------------------------
   1) Instagram Captions
------------------------------------------------ */
app.post("/generate", async (req, res) => {
  try {
    const { topic, tone } = req.body;

    const prompt = `
Create three Instagram captions with tone: ${tone}.
Topic: ${topic}.

Return JSON:
[
  { "variant": "Friendly", "short": "", "medium": "", "long": "", "hashtags": [] },
  { "variant": "Professional", "short": "", "medium": "", "long": "", "hashtags": [] },
  { "variant": "Funny", "short": "", "medium": "", "long": "", "hashtags": [] }
]
    `;

    const jsonText = await askOpenAI(prompt);
    res.json(JSON.parse(jsonText));
  } catch (err) {
    console.log("Caption Error:", err);
    res.status(500).json({ error: "Caption generation failed" });
  }
});

/* ------------------------------------------------
   2) Hashtag Generator
------------------------------------------------ */
app.post("/generate-hashtags", async (req, res) => {
  try {
    const { topic } = req.body;

    const prompt = `
Generate 20 trending Instagram hashtags for topic: "${topic}".
Return JSON array: ["#tag1", "#tag2", ...]
    `;

    const jsonText = await askOpenAI(prompt);
    res.json(JSON.parse(jsonText));
  } catch (err) {
    console.log("Hashtag Error:", err);
    res.status(500).json({ error: "Hashtag generation failed" });
  }
});

/* ------------------------------------------------
   3) Reels Script
------------------------------------------------ */
app.post("/generate-reels", async (req, res) => {
  try {
    const { topic } = req.body;

    const prompt = `
Create a viral Instagram Reel script for topic "${topic}".
Return JSON:
{
  "hook": "",
  "script": "",
  "cta": ""
}
    `;

    const jsonText = await askOpenAI(prompt);
    res.json(JSON.parse(jsonText));
  } catch (err) {
    console.log("Reels Error:", err);
    res.status(500).json({ error: "Reel script generation failed" });
  }
});

/* ------------------------------------------------
   4) Ideas Generator
------------------------------------------------ */
app.post("/generate-ideas", async (req, res) => {
  try {
    const { topic } = req.body;

    const prompt = `
Generate 10 content ideas for social media based on: "${topic}".
Return JSON array: [{"idea": ""}, ...]
    `;

    const jsonText = await askOpenAI(prompt);
    res.json(JSON.parse(jsonText));
  } catch (err) {
    console.log("Ideas Error:", err);
    res.status(500).json({ error: "Ideas generation failed" });
  }
});

/* ------------------------------------------------
   5) YouTube Description
------------------------------------------------ */
app.post("/generate-youtube", async (req, res) => {
  try {
    const { topic } = req.body;

    const prompt = `
Write a YouTube description for the topic "${topic}".
Return JSON:
{
  "title": "",
  "description": "",
  "tags": []
}
    `;

    const jsonText = await askOpenAI(prompt);
    res.json(JSON.parse(jsonText));
  } catch (err) {
    console.log("YouTube Error:", err);
    res.status(500).json({ error: "YouTube description failed" });
  }
});

/* ------------------------------------------------
   Start Server
------------------------------------------------ */
app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
