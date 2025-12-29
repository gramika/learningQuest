// import mongoose
const mongoose = require("mongoose")

connectionString = process.env.DATABASE

// connect to db
mongoose.connect(connectionString)
    .then(() => {
        console.log("mongoDb connected successfully");
    })
    .catch((err) => {
        console.log(`mongoDb connection failed due to :${err}`);

    })