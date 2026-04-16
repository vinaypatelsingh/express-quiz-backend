const Assessment = require("../models/Assessment");
const aiService = require("../services/aiService");

exports.createAssessment = async (req, res) => {
  console.log("[assessmentController] createAssessment - START");
  console.log("[assessmentController] createAssessment - User ID:", req.user);
  console.log("[assessmentController] createAssessment - Request body:", JSON.stringify(req.body, null, 2));

  try {
    const { subject, difficulty, num_questions, timeLimit, resultMode } = req.body;

    // Validate required fields
    if (!subject || !difficulty || !num_questions) {
      console.log("[assessmentController] createAssessment - Missing required fields");
      return res.status(400).json({
        message: "Missing required fields: subject, difficulty, and num_questions are required",
      });
    }

    console.log("[assessmentController] createAssessment - Calling AI service to generate quiz...");
    console.log("[assessmentController] createAssessment - Params: subject=%s, difficulty=%s, num_questions=%s", subject, difficulty, num_questions);

    // Call Python API
    const quizData = await aiService.generateQuiz({
      subject,
      difficulty,
      num_questions,
    });

    console.log("[assessmentController] createAssessment - AI service responded successfully");
    console.log("[assessmentController] createAssessment - Questions received:", quizData?.questions?.length || 0);

    if (!quizData || !quizData.questions) {
      console.error("[assessmentController] createAssessment - quizData is invalid:", JSON.stringify(quizData, null, 2));
      return res.status(500).json({
        message: "Python API returned invalid data - no questions field found",
      });
    }

    console.log("[assessmentController] createAssessment - Saving assessment to database...");

    const assessment = await Assessment.create({
      user: req.user,
      subject,
      difficulty,
      timeLimit,
      resultMode,
      questions: quizData.questions,
    });

    console.log("[assessmentController] createAssessment - Assessment saved with ID:", assessment._id);
    res.status(201).json(assessment);
  } catch (error) {
    console.error("[assessmentController] createAssessment - ERROR:");
    console.error("[assessmentController] createAssessment - Error name:", error.name);
    console.error("[assessmentController] createAssessment - Error message:", error.message);
    console.error("[assessmentController] createAssessment - Error stack:", error.stack);

    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message: error.message || "Internal server error while creating assessment",
    });
  }
};

exports.getAssessments = async (req, res) => {
  console.log("[assessmentController] getAssessments - START");
  console.log("[assessmentController] getAssessments - User ID:", req.user);

  try {
    const assessments = await Assessment.find({ user: req.user }).sort({ createdAt: -1 });
    console.log("[assessmentController] getAssessments - Found %d assessments", assessments.length);
    res.json(assessments);
  } catch (error) {
    console.error("[assessmentController] getAssessments - ERROR:");
    console.error("[assessmentController] getAssessments - Error message:", error.message);
    console.error("[assessmentController] getAssessments - Error stack:", error.stack);
    res.status(500).json({ message: error.message || "Internal server error while fetching assessments" });
  }
};
