const express = require('express');
const OpenAI = require('openai');

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.MISTRAL_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

router.post('/field-tip', async (req, res) => {
  const { field, value } = req.body;
  if (!field) return res.status(400).json({ tip: 'Field is required.' });

  const prompt = `
You are an expert blog writing assistant. 
Given the field name and the user's current input, provide a concise, actionable tip (1-2 sentences) to help the user improve their input for this field.
Field: ${field}
User input: ${value || '[empty]'}
Tip:
  `.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-nemotron",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 60,
    });

    const tip = completion.choices?.[0]?.message?.content?.trim() || 'No tip generated.';
    res.json({ tip });
  } catch (err) {
    console.error('LLM error:', err);
    res.status(500).json({ tip: 'Could not generate tip at this time.' });
  }
});

module.exports = router; 