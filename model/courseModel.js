const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: {
        type: String,
        enum: ["video", "article", "pdf"],
        required: true,
    },
    content: {
        type: String,
        required: true
    },
});

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String
        },
        price: {
            type: Number,
            required: true
        },
        lessons: [lessonSchema],
        quizTopic: {
            type: String
        },
        isActive: {
            type: Boolean,
            default: true
        },
        createdBy: {
            type: String,
            default: "admin"
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
