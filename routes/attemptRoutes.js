const express = require("express");
const router = express.Router();
const { submitAttempt, getAttempts } = require("../controllers/attemptController");
const auth = require("../middleware/authMiddleware");

router.post("/submit", auth, submitAttempt);
router.get("/", auth, getAttempts);

module.exports = router;
