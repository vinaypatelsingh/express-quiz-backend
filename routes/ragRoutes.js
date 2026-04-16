const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadRAG } = require("../controllers/ragController");
const auth = require("../middleware/authMiddleware");
const path = require("path");

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/upload", auth, upload.single("file"), uploadRAG);

module.exports = router;
