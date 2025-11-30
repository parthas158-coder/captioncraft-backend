app.post("/generate", async (req, res) => {
  try {
    const { topic, tone, styles } = req.body;

    if (!topic || !tone || !styles) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const prompt = `
You are CaptionCraft AI. ALWAYS return VALID JSON and NOTHING ELSE.

Create captions for:
Topic: "${topic}"
Tone: "${tone}"
Styles: ${styles.join(", ")}

Return ONLY this JSON format:

[
  {
    "variant": "Friendly",
    "short": "text",
    "medium": "text",
    "long": "text",
    "hashtags": ["#tag1", "#tag2"]
  }
]
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const raw = completion.choices[0].message.content;

    const parsed = JSON.parse(raw);

    res.json({ success: true, captions: parsed });
  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "AI returned invalid JSON" });
  }
});
