// const { getDb } = require('../utils/mongodb');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const Temp13Resume = require("../models/template13model");

const mongoose = require("mongoose");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });


const loadResume = async (req, res) => {
  try {

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


















const GeminiFunctionField = async (category, fieldName, userInput, retries = 3) => {
  while (retries > 0) {
    try {
      const prompt = `
Enhance this ${category} field '${fieldName}' for a resume:
- Keep it ATS-optimized with industry keywords.
- Use clear, concise, professional language.
- Include strong action verbs and quantifiable results where applicable.
User Input: ${JSON.stringify(userInput)}
Return only JSON: {"${fieldName}": "Enhanced text"}
      `;
      const result = await model.generateContent([prompt]);
      const responseText = result.response.text().trim().replace(/```json|```/g, "");
      const parsedResponse = JSON.parse(responseText);
      if (parsedResponse[fieldName]) return parsedResponse[fieldName];
      return userInput;
    } catch (error) {
      console.error(`Error enhancing ${category} field '${fieldName}':`, error.message);
      retries--;
      await new Promise((resolve) => setTimeout(resolve, 7000));
    }
  }
  return userInput;
};

// Helper: Enhance array-based sections
const enhanceExperience = async (experienceArray) => {
  if (!Array.isArray(experienceArray)) return experienceArray;
  return Promise.all(
    experienceArray.map(async (exp) => ({
      ...exp,
      description: await GeminiFunctionField("experience", "description", exp.description),
    }))
  );
};

const enhanceAchievements = async (achievementsArray) => {
  if (!Array.isArray(achievementsArray)) return achievementsArray;
  return Promise.all(
    achievementsArray.map(async (ach) => ({
      ...ach,
      description: await GeminiFunctionField("achievements", "description", ach.description),
    }))
  );
};

const enhanceProjects = async (projectsArray) => {
  if (!Array.isArray(projectsArray)) return projectsArray;
  return Promise.all(
    projectsArray.map(async (proj) => ({
      ...proj,
      description: await GeminiFunctionField("projects", "description", proj.description),
    }))
  );
};




const enhanceField = async (req, res) => {
  try {
    const { resumeId, field } = req.body;
    if (!resumeId || !field) return res.status(400).json({ message: "Resume ID and field are required" });

    const resume = await Temp13Resume.findById(resumeId); // Update to Temp5Resume
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    if (field === "summary") {
      resume.resumeData.summary = await GeminiFunctionField("summary", "summary", resume.resumeData.summary || "");
       console.log("🧠 Enhanced Summary:", resume.resumeData.summary);
    } else if (field === "experience") {
      resume.resumeData.experience = await enhanceExperience(resume.resumeData.experience);
      console.log("🧠 Enhanced Experience:", resume.resumeData.experience);
    } else if (field === "achievements") {
      resume.resumeData.achievements = await enhanceAchievements(resume.resumeData.achievements);
      console.log("🧠 Enhanced Achievements:", resume.resumeData.achievements);
    } else if (field === "projects") {
      resume.resumeData.projects = await enhanceProjects(resume.resumeData.projects);
    } else {
      return res.status(400).json({ message: `Field '${field}' not supported` });
    }

    const updatedResume = await resume.save();
    res.json({ message: `Field ${field} enhanced successfully`, data: updatedResume });

  } catch (error) {
    console.error("Error enhancing field:", error);
    res.status(500).json({ message: "Error enhancing field", error: error.message });
  }
};







// const enhanceResume = async (req, res) => {
//   const { type, content } = req.body;

//   if (!type || !content) {
//     return res.status(400).json({ error: "Missing type or content." });
//   }

//   try {
//     const prompt = `
// You are an AI resume assistant. Please improve the following "${type}" section. Make it more impactful, professional, and impressive. Keep the tone suitable for job applications.

// Content:
// """
// ${content}
// """

// Respond with only the enhanced version.
// `;

//     const result = await model.generateContent([prompt]);
//     const enhancedText = result.response.text();


     

//     res.status(200).json({ enhanced: enhancedText });
//   } catch (err) {
//     console.error("❌ AI Enhancement Error:", err.message);
//     res.status(500).json({ error: "AI enhancement failed." });
//   }
// };





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





const saveResume = async (req, res) => {
  try {
    const { resumeData, sectionSettings, branding, sectionsOrder } = req.body;

    let saved;

    if (resumeData._id && mongoose.Types.ObjectId.isValid(resumeData._id)) {
      saved = await Temp13Resume.findByIdAndUpdate(
        resumeData._id,
        { resumeData, sectionSettings, branding, sectionsOrder },
        { new: true }
      );
    }

    if (!saved) {
      const newResume = new Temp13Resume({ resumeData, sectionSettings, branding, sectionsOrder });
      saved = await newResume.save();
    }

    res.status(200).json({ message: "Resume saved successfully", data: saved });
  } catch (error) {
    console.error("Error saving resume:", error);
    res.status(500).json({ message: "Error saving resume", error: error.message });
  }
};





const resumeCSS = () => `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, sans-serif;
    font-size: 12px;
    color: #111827;
    line-height: 1.6;
    background: #f9fafb;
  }

  .container {
    display: flex;
    flex-direction: row;
    max-width: 800px;
    margin: auto;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
  }

  .left-section {
    width: 70%;
    padding: 20px;
  }

  .right-section {
    width: 30%;
    background-color: #1e3a5f;
    color: white;
    padding: 20px;
  }

  h1 {
    font-size: 24px;
    font-weight: bold;
  }

  h2 {
    font-size: 16px;
    font-weight: bold;
    margin-top: 20px;
    border-bottom: 1px solid #d1d5db;
    padding-bottom: 4px;
  }

  .section {
    margin-bottom: 16px;
  }

  .experience-item, .education-item, .achievement-item, .strength-item {
    margin-bottom: 10px;
  }

  .tag {
    display: inline-block;
    background-color: #2563eb;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    margin-right: 5px;
    font-size: 11px;
  }

  .right-section h2 {
    border-color: #334155;
  }

  .right-section p, .right-section li {
    font-size: 12px;
    margin-bottom: 6px;
  }

  .reference-item {
    margin-bottom: 10px;
  }

  @page {
    size: A4;
    margin: 10mm;
  }

  @media print {
    body {
      margin: 0;
      padding: 0;
    }
  }
`;


const generateHTML = (resumeData) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Resume - ${resumeData.name}</title>
  <style>${resumeCSS()}</style>
</head>
<body>
  <div class="container">
    <div class="left-section">
      <h1>${resumeData.name}</h1>
      <p>${resumeData.role}</p>
      <p>☎ ${resumeData.phone} ✉ ${resumeData.email} ${resumeData.linkedin ? `<br>🔗 ${resumeData.linkedin}` : ""} 📍 ${resumeData.location}</p>

      ${resumeData.summary ? `
        <div class="section">
          <h2>Summary</h2>
          <p>${resumeData.summary}</p>
        </div>` : ""}

      ${resumeData.experience?.length ? `
        <div class="section">
          <h2>Experience</h2>
          ${resumeData.experience.map(exp => `
            <div class="experience-item">
              <strong>${exp.title}</strong> - ${exp.companyName}<br/>
              <em>${exp.date}</em> | ${exp.companyLocation}<br/>
              <p>${exp.accomplishment.replace(/\n/g, "<br/>")}</p>
            </div>`).join("")}
        </div>` : ""}

      ${resumeData.education?.length ? `
        <div class="section">
          <h2>Education</h2>
          ${resumeData.education.map(edu => `
            <div class="education-item">
              <strong>${edu.degree}</strong><br/>
              ${edu.institution}, ${edu.location}<br/>
              <em>${edu.duration}</em>
            </div>`).join("")}
        </div>` : ""}

      ${resumeData.philosophy?.quote ? `
        <div class="section">
          <h2>Philosophy</h2>
          <blockquote>"${resumeData.philosophy.quote}"<br/>${resumeData.philosophy.author}</blockquote>
        </div>` : ""}

      ${resumeData.expertise?.length ? `
        <div class="section">
          <h2>Expertise</h2>
          ${resumeData.expertise.map(exp => `
            <p>${exp.skill} — ${(exp.value * 100).toFixed(0)}%</p>`).join("")}
        </div>` : ""}
    </div>

    <div class="right-section">
      ${resumeData.skills?.length ? `
        <div class="section">
          <h2>Skills</h2>
          ${resumeData.skills.map(skill => `<p>${skill.category}</p>`).join("")}
        </div>` : ""}

      ${resumeData.strengths?.length ? `
        <div class="section">
          <h2>Strengths</h2>
          ${resumeData.strengths.map(str => `
            <div class="strength-item">
              <strong>${str.title}</strong>
              <p>${str.description}</p>
            </div>`).join("")}
        </div>` : ""}

      ${resumeData.achievements?.length ? `
        <div class="section">
          <h2>Achievements</h2>
          ${resumeData.achievements.map(ach => `
            <div class="achievement-item">
              <strong>${ach.title}</strong>
              <p>${ach.description}</p>
            </div>`).join("")}
        </div>` : ""}

      ${resumeData.languages?.length ? `
        <div class="section">
          <h2>Languages</h2>
          <ul>
            ${resumeData.languages.map(lang => `<li>${lang.name} (${lang.level})</li>`).join("")}
          </ul>
        </div>` : ""}

      ${resumeData.references?.length ? `
        <div class="section">
          <h2>References</h2>
          ${resumeData.references.map(ref => `
            <div class="reference-item">
              <strong>${ref.name}</strong><br/>
              ${ref.title}<br/>
              📞 ${ref.contact}
            </div>`).join("")}
        </div>` : ""}
    </div>
  </div>
</body>
</html>
`;


const generatePDF = async (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) return res.status(400).json({ message: "Resume data is required" });

    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
    const page = await browser.newPage();
    const htmlContent = generateHTML(resumeData);

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
      scale: 0.95, // Adjust scale for better fit
    });

    await browser.close();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
      "Content-Length": pdfBuffer.length,
    });
    res.end(pdfBuffer);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({ message: "PDF generation failed", error: error.message });
  }
};


module.exports = {
  saveResume,
  loadResume,
  generatePDF,  
  enhanceField,
  uploadResume
};


