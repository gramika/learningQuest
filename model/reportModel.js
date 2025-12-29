const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "notes"
  },
  noteTitle: {
    type: String,
    required: true
  },
  reportedBy: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "pending"
  },
  reportedOn: {
    type: Date,
    default: Date.now
  }
});

const reports = mongoose.model("reports", reportSchema);
module.exports = reports;
