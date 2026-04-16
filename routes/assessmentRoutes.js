const express = require("express");
const router = express.Router();
const { createAssessment, getAssessments } = require("../controllers/assessmentController");
const auth = require("../middleware/authMiddleware");

router.post("/create", auth, createAssessment);
router.get("/", auth, getAssessments);

module.exports = router;
