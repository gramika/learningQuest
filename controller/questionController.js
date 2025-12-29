const Question = require("../model/questionModel");

// add question
exports.addQuestionController = async (req, res) => {
  try {
    const { topic, question, options, correctAnswer } = req.body;
    const email = req.payload; // from JWT middleware

    if (!topic || !question || !options || !correctAnswer) {
      return res.status(400).json("All fields are required");
    }

    if (options.length < 4) {
      return res.status(400).json("Minimum 4 options required");
    }

    const exists = await Question.findOne({ question });
    if (exists) {
      return res.status(409).json("Question already exists");
    }

    const newQuestion = new Question({
      topic,
      question,
      options,
      correctAnswer,
      createdBy: email,
      status:"pending"
    });

    await newQuestion.save();
    res.status(200).json(newQuestion);
  } catch (err) {
    res.status(500).json(err);
  }
};

// get questions by topic
exports.getQuestionsByTopic = async (req, res) => {
  try {
    const topic = req.query.topic?.toLowerCase();

    let questions;

    if (topic === "mixed") {
      questions = await Question.find({ status: "approved" });
    } else {
      questions = await Question.find({
        topic,
        status: "approved",
      });
    }

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json(err);
  }
};


// get user questions
exports.getUserQuestions = async (req, res) => {
  try {
    const email = req.payload;

    const questions = await Question.find({ createdBy: email });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json(err);
  }
};

// delete question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    res.status(200).json("Question deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

// ADMIN – get all questions
exports.getAllQuestionsAdmin = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ADMIN – update question status
exports.updateQuestionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await Question.findByIdAndUpdate(id, { status });
    res.status(200).json("Status updated");
  } catch (err) {
    res.status(500).json(err);
  }
};

// USER – edit question
exports.updateQuestionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, correctAnswer, topic } = req.body;
    const email = req.payload;

    const existing = await Question.findById(id);

    if (!existing) {
      return res.status(404).json("Question not found");
    }

    // allow only owner to edit
    if (existing.createdBy !== email) {
      return res.status(403).json("Unauthorized");
    }

    await Question.findByIdAndUpdate(id, {
      question,
      options,
      correctAnswer,
      topic,
      status: "pending", // re-approval required
    });

    res.status(200).json("Question updated");
  } catch (err) {
    res.status(500).json(err);
  }
};

// get single question by id
exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.payload;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json("Question not found");
    }

    if (question.createdBy !== email) {
      return res.status(403).json("Unauthorized");
    }

    res.status(200).json(question);
  } catch (err) {
    res.status(500).json(err);
  }
};


