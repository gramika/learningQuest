const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },

    correctAnswer: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }

})

const questions = mongoose.model("questions", questionSchema)
module.exports = questions