const express = require("express");
const router = express.Router();
const { generateFeedback, getFeedback } = require("../controllers/feedbackController");
const auth = require("../middleware/authMiddleware");

router.post("/generate", auth, generateFeedback);
router.get("/", auth, getFeedback);

module.exports = router;
