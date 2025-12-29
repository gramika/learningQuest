const QuizHistory = require("../model/quizHistoryModel");

exports.saveQuizHistory = async (req, res) => {
  try {
    const email = req.payload;
    const { topic, score, total } = req.body;

    const newAttempt = new QuizHistory({
      userEmail: email,
      topic,
      score,
      total,
      date: new Date().toLocaleString(),
    });

    await newAttempt.save();
    res.status(200).json("Quiz saved");
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getQuizHistory = async (req, res) => {
  try {
    const email = req.payload;
    const history = await QuizHistory.find({ userEmail: email });
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json(err);
  }
};
