const mongoose = require("mongoose");

const quizHistorySchema = new mongoose.Schema(
  {
    userEmail: String,
    topic: String,
    score: Number,
    total: Number,
    date: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("quizHistories", quizHistorySchema);
