
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const saveControl = require('../controllers/saveControl');
const loadControl = require('../controllers/loadControl');
const enhanceControl = require('../controllers/enhanceControl');
const uploadControl = require('../controllers/uploadControl');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join("uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/save', saveControl.saveResume);
router.get('/load', loadControl.loadResume);
router.post('/enhance', enhanceControl.enhanceResume);
router.post('/upload-resume', upload.single("resumeFile"), uploadControl.uploadResume);

module.exports = router;