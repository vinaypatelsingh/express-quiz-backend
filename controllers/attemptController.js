const Attempt = require("../models/Attempt");

exports.submitAttempt = async (req, res) => {
  console.log("[attemptController] submitAttempt - START");
  console.log("[attemptController] submitAttempt - User ID:", req.user);
  console.log("[attemptController] submitAttempt - Request body keys:", Object.keys(req.body));

  try {
    const { assessmentId, answers } = req.body;

    if (!assessmentId || !answers) {
      console.log("[attemptController] submitAttempt - Missing required fields");
      return res.status(400).json({
        message: "Missing required fields: assessmentId and answers are required",
      });
    }

    console.log("[attemptController] submitAttempt - Assessment ID:", assessmentId);
    console.log("[attemptController] submitAttempt - Answers count:", answers.length);

    let score = 0;
    let explanationsUsedCount = 0;

    answers.forEach((ans) => {
      if (ans.selected === ans.correct) score++;
      if (ans.explanationViewed) explanationsUsedCount++;
    });

    console.log("[attemptController] submitAttempt - Calculated score:", score);
    console.log("[attemptController] submitAttempt - Explanations used:", explanationsUsedCount);

    const attempt = await Attempt.create({
      assessmentId,
      userId: req.user,
      answers,
      score,
      explanationsUsedCount,
    });

    console.log("[attemptController] submitAttempt - Attempt saved with ID:", attempt._id);
    res.status(201).json({ score, explanationsUsedCount, attempt });
  } catch (error) {
    console.error("[attemptController] submitAttempt - ERROR:");
    console.error("[attemptController] submitAttempt - Error message:", error.message);
    console.error("[attemptController] submitAttempt - Error stack:", error.stack);
    res.status(500).json({ message: error.message || "Internal server error while submitting attempt" });
  }
};

exports.getAttempts = async (req, res) => {
  console.log("[attemptController] getAttempts - START");
  console.log("[attemptController] getAttempts - User ID:", req.user);

  try {
    const attempts = await Attempt.find({ userId: req.user }).populate("assessmentId");
    console.log("[attemptController] getAttempts - Found %d attempts", attempts.length);
    res.json(attempts);
  } catch (error) {
    console.error("[attemptController] getAttempts - ERROR:");
    console.error("[attemptController] getAttempts - Error message:", error.message);
    console.error("[attemptController] getAttempts - Error stack:", error.stack);
    res.status(500).json({ message: error.message || "Internal server error while fetching attempts" });
  }
};
