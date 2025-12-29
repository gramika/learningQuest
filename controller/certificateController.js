const Certificate = require("../model/certificateModel");
const Payment = require("../model/paymentModel");
const Course = require("../model/courseModel");
const crypto = require("crypto");

exports.issueCertificate = async (req, res) => {
  try {
    const userEmail = req.payload;
    const { courseId } = req.body;

    // Ensure user paid for the course
    const paid = await Payment.findOne({
      userEmail,
      courseId,
      status: "paid",
    });

    if (!paid) {
      return res.status(403).json("Course not purchased");
    }

    // Prevent duplicate certificates
    const existing = await Certificate.findOne({ userEmail, courseId });
    if (existing) return res.status(200).json(existing);

    const course = await Course.findById(courseId);

    const certificate = await Certificate.create({
      userEmail,
      courseId,
      courseTitle: course.title,
      certificateId: crypto.randomBytes(8).toString("hex"),
    });

    res.status(200).json(certificate);
  } catch (err) {
    console.error(err);
    res.status(500).json("Certificate generation failed");
  }
};

exports.getMyCertificates = async (req, res) => {
  try {
    const userEmail = req.payload;
    const certificates = await Certificate.find({ userEmail });
    res.status(200).json(certificates);
  } catch (err) {
    res.status(500).json("Failed to fetch certificates");
  }
};
