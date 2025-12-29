const reports = require("../model/reportModel");

// to add reports to mongoDb
exports.addReportController = async (req, res) => {
  try {
    const { noteId, noteTitle, reason } = req.body;

    if (!noteId || !noteTitle || !reason) {
      return res.status(400).json("Missing report details");
    }

    const reportedBy = req.payload; // from jwtMiddleware

    const newReport = new reports({
      noteId,
      noteTitle,
      reportedBy,
      reason
    });

    await newReport.save();

    res.status(200).json("Report submitted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
};

// to get the reports for admin
exports.getAllReportsController = async (req, res) => {
  try {
    const allReports = await reports.find().sort({ reportedOn: -1 });
    res.status(200).json(allReports);
  } catch (err) {
    res.status(500).json(err);
  }
};

// to resolve the reports by admin
exports.resolveReportController = async (req, res) => {
  try {
    const { id } = req.params;

    await reports.findByIdAndUpdate(id, { status: "resolved" });

    res.status(200).json("Report resolved");
  } catch (err) {
    res.status(500).json(err);
  }
};
// to delete the reports
exports.deleteReportController = async (req, res) => {
  try {
    const { id } = req.params;

    await reports.findByIdAndDelete(id);

    res.status(200).json("Report deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

