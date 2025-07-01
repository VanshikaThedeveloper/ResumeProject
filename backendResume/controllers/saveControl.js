const { getDb } = require('../utils/mongodb');

exports.saveResume = async (req, res) => {
  const resumeData = req.body;
  const db = getDb();

  try {
    const result = await db.collection("resume").updateOne(
      {},
      { $set: resumeData },
      { upsert: true }
    );
    console.log("✅ Resume saved successfully!", result);
    res.status(200).json({ message: "Resume saved successfully!" });
  } catch (err) {
    console.error("❌ Error saving resume:", err.message);
    res.status(500).json({ message: "Failed to save resume." });
  }
};



