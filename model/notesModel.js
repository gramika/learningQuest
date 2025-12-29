const mongoose = require("mongoose")

const noteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    noteURL: {
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
    },
    addedOn: {
        type: Date,
        default: Date.now
    }

})

const notes = mongoose.model('notes', noteSchema)
module.exports = notes