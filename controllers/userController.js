const User = require("../models/User");
const Attempt = require("../models/Attempt");

exports.getUserProfile = async (req, res) => {
  console.log("[userController] getUserProfile - START");
  console.log("[userController] getUserProfile - User ID:", req.user);

  try {
    const user = await User.findById(req.user).select("-password");
    if (user) {
      console.log("[userController] getUserProfile - User found:", user.email);
      res.json(user);
    } else {
      console.log("[userController] getUserProfile - User not found");
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("[userController] getUserProfile - ERROR:");
    console.error("[userController] getUserProfile - Error message:", error.message);
    console.error("[userController] getUserProfile - Error stack:", error.stack);
    res.status(500).json({ message: error.message || "Internal server error while fetching profile" });
  }
};


exports.getUserProgress = async (req, res) => {
  console.log("[userController] getUserProgress - START");
  console.log("[userController] getUserProgress - User ID:", req.user);

  try {
    const attempts = await Attempt.find({ userId: req.user }).sort({ createdAt: 1 });

    if (!attempts || attempts.length === 0) {
      console.log("[userController] getUserProgress - No attempts found");
      return res.json({
        totalQuizzes: 0,
        averageScore: 0,
        highestScore: 0,
        totalScore: 0,
        recentScores: [],
        message: "No quiz attempts found",
      });
    }

    const totalQuizzes = attempts.length;
    const totalScore = attempts.reduce((acc, attempt) => acc + attempt.score, 0);
    const averageScore = (totalScore / totalQuizzes).toFixed(2);
    const highestScore = Math.max(...attempts.map((a) => a.score));

    // Last 5 scores for progress chart
    const recentScores = attempts.slice(-5).map((a) => ({
      date: a.createdAt,
      score: a.score,
    }));

    console.log("[userController] getUserProgress - Total quizzes:", totalQuizzes, "Avg score:", averageScore);

    res.json({
      totalQuizzes,
      averageScore,
      highestScore,
      totalScore,
      recentScores,
    });
  } catch (error) {
    console.error("[userController] getUserProgress - ERROR:");
    console.error("[userController] getUserProgress - Error message:", error.message);
    console.error("[userController] getUserProgress - Error stack:", error.stack);
    res.status(500).json({ message: error.message || "Internal server error while fetching progress" });
  }
};
