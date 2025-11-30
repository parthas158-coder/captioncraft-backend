app.post("/generate", async (req, res) => {
  try {
    const { topic, tone, styles } = req.body;

    if (!topic || !tone || !styles) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = `
    You are an AI caption generator.
    Create Instagram captions in JSON ONLY. NO text outside JSON.

    Topic: "${topic}"
    Base tone: "${tone}"
    Styles: ${styles.join(", ")}

    For each style return an object:
    {
      "variant": "Friendly",
      "short": "...",
      "medium": "...",
      "long": "...",
      "hashtags": ["#...", "#...", ...]
    }

    Respond ONLY with valid JSON array.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiText = completion.choices[0].message.content;

    // Try to parse JSON
    let jsonOutput;
    try {
      jsonOutput = JSON.parse(aiText);
    } catch (err) {
      console.error("AI JSON parse error:", err, "Raw output:", aiText);
      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw: aiText,
      });
    }

    res.json({ success: true, captions: jsonOutput });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
