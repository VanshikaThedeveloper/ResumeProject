
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// const {controller} = require('../controllers/template13controller')
const {
  saveResume,
  loadResume,
  enhanceResume,
  uploadResume
} = require('../controllers/template13controller.js');



// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = path.join("uploads");
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });
// const upload = multer({ storage });


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


router.post('/save', saveResume);
router.get('/load', loadResume);
router.post('/enhance', enhanceResume);
router.post('/upload-resume', upload.single("resumeFile"), uploadResume);

module.exports = router;