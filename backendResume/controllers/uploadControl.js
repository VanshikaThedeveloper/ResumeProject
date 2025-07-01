const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const extractTextFromPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text.trim();
};

const extractTextFromDOCX = async (filePath) => {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value.trim();
};

const parseResumeWithAI = async (text) => {
  const prompt = `Extract the following resume into structured JSON: {text: "${text}"}`;
  const result = await model.generateContent([prompt]);
  const responseText = result.response.text().trim();
  return JSON.parse(responseText.replace(/json|```/g, '').trim());
};

exports.uploadResume = async (req, res) => {
  try {
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    const extractedText = ext === ".pdf"
      ? await extractTextFromPDF(filePath)
      : await extractTextFromDOCX(filePath);

    const parsedData = await parseResumeWithAI(extractedText);
    fs.unlinkSync(filePath);

    res.status(200).json({ success: true, data: parsedData });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
