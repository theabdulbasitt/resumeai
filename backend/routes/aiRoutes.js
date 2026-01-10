const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Groq = require('groq-sdk');

// Initialize Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

router.post('/enhance', auth, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert resume writer specializing in FAANG companies (Google, Meta, Amazon, Apple, Netflix) and top tech companies. Your role is to enhance resume bullets to be more professional, impactful, and results-oriented while maintaining the original contextt.  Guidelines: - Use strong action verbs (Built, Led, Optimized, Designed, Engineered, Delivered) - Add one relevant metric if missing (numbers, %, time saved, users reached) - Keep original meaning and context - Keep to 1-2 lines maximum- Do not overcrowd with unnecessary technologies- Make it concise and scannable Return ONLY the enhanced bullet point, nothing else."

                },
                {
                    role: "user",
                    content: text
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
        });

        const enhanced = completion.choices[0]?.message?.content?.trim() || text;

        res.json({ enhanced });
    } catch (error) {
        console.error('Groq API Error:', error);
        res.status(500).json({ error: 'Failed to enhance text' });
    }
});

module.exports = router;
