const express = require("express");
const router = express.Router();
const { getUserProfile, getUserProgress } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.get("/profile", auth, getUserProfile);
router.get("/progress", auth, getUserProgress);

module.exports = router;
