const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });

exports.enhanceResume = async (req, res) => {
  const { type, content } = req.body;

  if (!type || !content) {
    return res.status(400).json({ error: "Missing type or content." });
  }

  try {
    const prompt = `
You are an AI resume assistant. Please improve the following "${type}" section. Make it more impactful, professional, and impressive. Keep the tone suitable for job applications.

Content:
"""
${content}
"""

Respond with only the enhanced version.
`;

    const result = await model.generateContent([prompt]);
    const enhancedText = result.response.text();


     

    res.status(200).json({ enhanced: enhancedText });
  } catch (err) {
    console.error("❌ AI Enhancement Error:", err.message);
    res.status(500).json({ error: "AI enhancement failed." });
  }
};
