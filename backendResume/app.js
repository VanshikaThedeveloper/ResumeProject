// core modules
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
require("dotenv").config();

const { mongoConnect } = require('./utils/mongodb');
const resumeRoutes = require('./routes/resumeRoutes');




console.log("Gemini Key Loaded:", process.env.GEMINI_API_KEY ? "✅" : "❌");





const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/', resumeRoutes);



 



app.get("/load", async (req, res) => {
  try {
    const db = getDb();
    const latestResume = await db.collection("resume").findOne({}, { sort: { _id: -1 } }); // get latest

    if (!latestResume) {
      return res.status(404).json({ message: "No saved resume found." });
    }

    res.status(200).json(latestResume);
  } catch (error) {
    console.error("Error loading resume from MongoDB:", error.message);
    res.status(500).json({ message: "Failed to load resume." });
  }
});




// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = path.join("uploads");
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });
// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
//     allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error("Only PDF and DOCX"));
//   },
//   limits: { fileSize: 5 * 1024 * 1024 }
// });

// const extractTextFromPDF = async (filePath) => {
//   const buffer = fs.readFileSync(filePath);
//   const data = await pdfParse(buffer);
//   return data.text.trim();
// };

// const extractTextFromDOCX = async (filePath) => {
//   const result = await mammoth.extractRawText({ path: filePath });
//   return result.value.trim();
// };

// const parseResumeWithAI = async (text) => {
//   try {
//     const prompt = `Extract the following resume into structured JSON:
// {text: "${text}"}`;
//     const result = await model.generateContent([prompt]);
//     const responseText = result.response.text().trim();
//     return JSON.parse(responseText.replace(/json|```/g, '').trim());
//   } catch (error) {
//     console.error("Gemini parsing failed:", error.message);
//     throw new Error("Gemini parsing failed.");
//   }
// };





// app.post("/upload-resume", upload.single("resumeFile"), async (req, res) => {
//   try {
//     const filePath = req.file.path;
//     const ext = path.extname(req.file.originalname).toLowerCase();
//     const extractedText = ext === ".pdf"
//       ? await extractTextFromPDF(filePath)
//       : await extractTextFromDOCX(filePath);
//     const parsedData = await parseResumeWithAI(extractedText);
//     fs.unlinkSync(filePath);
//     res.status(200).json({ success: true, data: parsedData });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });





const PORT = process.env.PORT || 4000;
mongoConnect(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});