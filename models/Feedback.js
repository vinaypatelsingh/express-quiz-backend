const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assessment" },
  feedbackText: String,
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
