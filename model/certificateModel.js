const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
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
    courseTitle: { 
        type: String, 
        required: true 
    },
    issuedOn: { 
        type: Date,
         default: Date.now 
        
    },
    certificateId: { 
        type: String, 
        unique: true 
        
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);
