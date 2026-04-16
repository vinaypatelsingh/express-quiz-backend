const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  subject: String,
  difficulty: String,
  timeLimit: {
    type: { type: String, enum: ["total", "perQuestion"], default: "total" },
    value: { type: Number, default: 0 } // duration in seconds
  },
  resultMode: { type: String, enum: ["instant", "end"], default: "end" },
  questions: Array, // AI generated questions with explanation field
}, { timestamps: true });

module.exports = mongoose.model("Assessment", assessmentSchema);
