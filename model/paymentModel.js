const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userEmail: {
         type: String, 
         required: true 
        },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    amount: { 
        type: Number, 
        required: true 
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    stripeSessionId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
