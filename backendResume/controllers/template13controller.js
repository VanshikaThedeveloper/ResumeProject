// const { getDb } = require('../utils/mongodb');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const Temp13Resume = require("../models/template13model");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });

const loadResume = async (req, res) => {
  try {
    // const db = getDb();
    // const latestResume = await db.collection("resume").findOne({}, { sort: { _id: -1 } });

    const latestResume = await Temp13Resume.findOne().sort({ _id: -1 });


    if (!latestResume) {
      return res.status(404).json({ message: "No saved resume found." });
    }

    res.status(200).json(latestResume);
  } catch (error) {
    console.error("Error loading resume from MongoDB:", error.message);
    res.status(500).json({ message: "Failed to load resume." });
  }
};





const enhanceResume = async (req, res) => {
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

const uploadResume = async (req, res) => {
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




// const saveResume = async (req, res) => {
//   const resumeData = req.body;
//   // const db = getDb();

//   try {
//     // const result = await db.collection("resume").updateOne(
//     //   {},
//     //   { $set: resumeData },
//     //   { upsert: true }
//     // );


//     const newResume = new Temp13Resume(resumeData);
// await newResume.save();

//     console.log("✅ Resume saved successfully!", result);
//     res.status(200).json({ message: "Resume saved successfully!" });
//   } catch (err) {
//     console.error("❌ Error saving resume:", err.message);
//     res.status(500).json({ message: "Failed to save resume." });
//   }
// };
   


const saveResume = async (req, res) => {
  const { resumeData, sectionSettings, branding, sectionsOrder } = req.body;

  try {
    const newResume = new Temp13Resume({
      resumeData,
      sectionSettings,
      branding,
      sectionsOrder,
    });

    await newResume.save();

    console.log("✅ Resume saved successfully!");
    res.status(200).json({ message: "Resume saved successfully!" });
  } catch (err) {
    console.error("❌ Error saving resume:", err);
    res.status(500).json({ message: "Failed to save resume." });
  }
};



module.exports = {
  saveResume,
  loadResume,
  enhanceResume,
  uploadResume
};


