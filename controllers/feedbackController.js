const Feedback = require("../models/Feedback");
const aiService = require("../services/aiService");

exports.generateFeedback = async (req, res) => {
  console.log("[feedbackController] generateFeedback - START");
  console.log("[feedbackController] generateFeedback - User ID:", req.user);
  console.log("[feedbackController] generateFeedback - Request body keys:", Object.keys(req.body));

  try {
    const { attemptData } = req.body;

    if (!attemptData) {
      console.log("[feedbackController] generateFeedback - Missing attemptData");
      return res.status(400).json({ message: "Missing required field: attemptData" });
    }

    console.log("[feedbackController] generateFeedback - Calling AI service...");

    const feedback = await aiService.generateFeedback({
      data: attemptData,
    });

    console.log("[feedbackController] generateFeedback - AI service responded");

    const saved = await Feedback.create({
      userId: req.user,
      assessmentId: attemptData.assessmentId,
      feedbackText: feedback.text,
    });

    console.log("[feedbackController] generateFeedback - Feedback saved with ID:", saved._id);
    res.status(201).json(saved);
  } catch (error) {
    console.error("[feedbackController] generateFeedback - ERROR:");
    console.error("[feedbackController] generateFeedback - Error message:", error.message);
    console.error("[feedbackController] generateFeedback - Error stack:", error.stack);
    res.status(500).json({ message: error.message || "Internal server error while generating feedback" });
  }
};

exports.getFeedback = async (req, res) => {
  console.log("[feedbackController] getFeedback - START");
  console.log("[feedbackController] getFeedback - User ID:", req.user);

  try {
    const feedback = await Feedback.find({ userId: req.user });
    console.log("[feedbackController] getFeedback - Found %d feedback entries", feedback.length);
    res.json(feedback);
  } catch (error) {
    console.error("[feedbackController] getFeedback - ERROR:");
    console.error("[feedbackController] getFeedback - Error message:", error.message);
    console.error("[feedbackController] getFeedback - Error stack:", error.stack);
    res.status(500).json({ message: error.message || "Internal server error while fetching feedback" });
  }
};
