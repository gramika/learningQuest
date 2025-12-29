const mongoose = require("mongoose")

// define schema
const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: "Aspiring MEARN Developer"
    },
    profile: {
        type: String
    },
    joinedDate: {
        type: String,
        default: new Date().toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        }),
    },
    purchasedCourses: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
],

})

// model created
const users = mongoose.model("users", userSchema)

// exporting
module.exports = users