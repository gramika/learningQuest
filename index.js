// import dotenv
require("dotenv").config()

// import express
const express = require("express")

// import cors
const cors = require("cors")

// to make pdf download possible
const path = require("path");

// import routes
const route = require("./routes/routes")

// import connection file to db
require("./databaseConnection")
// create PORT
PORT= process.env.PORT || 5000

// create the server
const server = express()

// use them
server.use(cors())
server.use(express.json())
server.use("/uploads", express.static(path.join(__dirname, "uploads")));

server.use(route)

// start the server
server.listen(PORT,()=>{
    console.log("server started");
})


