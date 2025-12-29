const Payment = require("../model/paymentModel");

const hasPurchasedCourse = async (req, res, next) => {
  try {
    const userEmail = req.payload;
    const courseId = req.params.id;

    const payment = await Payment.findOne({
      userEmail,
      courseId,
      status: "paid",
    });

    if (!payment) {
      return res.status(403).json("Course not purchased");
    }

    next();
  } catch (err) {
    res.status(500).json("Access check failed");
  }
};

module.exports = hasPurchasedCourse;
