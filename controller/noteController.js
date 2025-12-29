const notes = require("../model/notesModel")
const fs = require("fs");
const path = require("path");

// to add notes
exports.addNotesController = async (req, res) => {
  console.log("inside addNotesController");

  try {
    if (!req.file) {
      return res.status(400).json("No file uploaded");
    }

    const { title, description, topic } = req.body;

    const email = req.payload; // coming from jwtMiddleware
    const uploadedFileName = req.file.filename;

    const newNote = new notes({
      title,
      description,
      topic,
      noteURL: uploadedFileName,   //  SAVE FILE NAME
      createdBy: email,             //  FROM JWT
      status: "pending",             //  DEFAULT STATUS
    });

    await newNote.save();

    res.status(200).json(newNote);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

// to get all notes
exports.getAllNotesController = async (req, res) => {
  try {
    const allNotes = await notes.find().sort({ addedOn: -1 });  //{ status: "approved" }
    res.status(200).json(allNotes);
  } catch (err) {
    res.status(500).json(err);
  }
};
// to delete own notes
exports.deleteOwnNoteController = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.payload; // from jwtMiddleware

    const note = await notes.findById(id);

    if (!note) {
      return res.status(404).json("Note not found");
    }

    // 🔐 ownership validation
    if (note.createdBy !== userEmail) {
      return res.status(403).json("You are not allowed to delete this note");
    }

    const filePath = path.join(__dirname, "..", "uploads", note.noteURL);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await notes.findByIdAndDelete(id);
    res.status(200).json("Note deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
};


// to show the notes uploaded by each user
exports.getMyNotesController = async (req, res) => {
  try {
    const email = req.payload; // from jwtMiddleware

    const myNotes = await notes
      .find({ createdBy: email })
      .sort({ addedOn: -1 });

    res.status(200).json(myNotes);
  } catch (err) {
    res.status(500).json(err);
  }
};

// to get the count of notes added/pending/approved/rejected
exports.getUserStatsController = async (req, res) => {
  try {
    const email = req.payload;

    const total = await notes.countDocuments({ createdBy: email });
    const approved = await notes.countDocuments({ createdBy: email, status: "approved" });
    const pending = await notes.countDocuments({ createdBy: email, status: "pending" });
    const rejected = await notes.countDocuments({ createdBy: email, status: "rejected" });

    res.status(200).json({
      total,
      approved,
      pending,
      rejected
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ADMIN – get all notes
exports.getAllNotesForAdminController = async (req, res) => {
  try {
    const allNotes = await notes.find().sort({ addedOn: -1 });
    res.status(200).json(allNotes);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ADMIN – approve / reject note
exports.updateNoteStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json("Invalid status");
    }

    await notes.findByIdAndUpdate(id, { status });
    res.status(200).json("Note status updated");
  } catch (err) {
    res.status(500).json(err);
  }
};
// ADMIN-to delte notes from db and uploads file - fs module is used
exports.deleteNoteController = async (req, res) => {
  try {
    const { id } = req.params;

    //  Find note
    const note = await notes.findById(id);

    if (!note) {
      return res.status(404).json("Note not found");
    }

    //  Build file path
    const filePath = path.join(__dirname, "..", "uploads", note.noteURL);

    //  Delete file if exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    //  Delete note from DB
    await notes.findByIdAndDelete(id);

    res.status(200).json("Note deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
};
