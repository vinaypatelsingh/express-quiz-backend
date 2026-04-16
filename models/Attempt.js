const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assessment" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  answers: [
    {
      question: String,
      selected: String,
      correct: String,
      explanationViewed: { type: Boolean, default: false }
    }
  ],
  score: Number,
  explanationsUsedCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Attempt", attemptSchema);
