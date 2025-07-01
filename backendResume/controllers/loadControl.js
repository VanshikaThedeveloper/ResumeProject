
const { getDb } = require('../utils/mongodb');

exports.loadResume = async (req, res) => {
  try {
    const db = getDb();
    const latestResume = await db.collection("resume").findOne({}, { sort: { _id: -1 } });

    if (!latestResume) {
      return res.status(404).json({ message: "No saved resume found." });
    }

    res.status(200).json(latestResume);
  } catch (error) {
    console.error("Error loading resume from MongoDB:", error.message);
    res.status(500).json({ message: "Failed to load resume." });
  }
};
