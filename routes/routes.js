// import express
const express = require("express")

// create an instance
const route = new express.Router()
// import middleware
const jwtMiddleware = require("../middleware/jwtMiddleware")
// import multer config
const multerConfig = require("../middleware/multerMIddleware")
// import controllers
const userController = require("../controller/userController")
const questionController = require("../controller/questionController")
const noteController = require("../controller/noteController")
const reportController = require("../controller/reportController");
const quizController = require("../controller/quizController");
const courseController = require("../controller/courseController");
const paymentController = require("../controller/paymentController");
const certificateController = require("../controller/certificateController");
const contactController = require("../controller/contactController");


const jwtAdminMiddleware = require("../middleware/jwtAdminMiddleware")
const hasPurchasedCourse = require("../middleware/hasPurchasedCourse");


// paths for different purpose
// -------------COMMON-------------
// path for register
route.post("/register",userController.registerController)

// path for login
route.post("/login",userController.loginController)

// path for google login
route.post("/google-login",userController.googleLoginController)

// ----------------USERS---------------
// path to add questions
route.post("/add-question",jwtMiddleware,questionController.addQuestionController)
// get questions
route.get("/questions",questionController.getQuestionsByTopic);
// get user questions
route.get("/my-questions",jwtMiddleware,questionController.getUserQuestions);
// delete question
route.delete("/question/:id",jwtMiddleware,questionController.deleteQuestion);
// get a question
// get single question by id (USER)
route.get("/question/:id",jwtMiddleware,questionController.getQuestionById);

// ------users NOTES-------
// path to add notes
route.post("/add-notes",jwtMiddleware,multerConfig.single("uploadNotes"),noteController.addNotesController)
// path to get all notes
route.get("/all-notes", jwtMiddleware, noteController.getAllNotesController);
// path to report a note
route.post("/report-note",jwtMiddleware,reportController.addReportController);
// parh to get all notes by a user
route.get("/my-notes",jwtMiddleware,noteController.getMyNotesController);
// to get the count of notes in profile
route.get("/user/stats",jwtMiddleware,noteController.getUserStatsController);
// delete notes -user
route.delete("/user/delete-note/:id",jwtMiddleware,noteController.deleteOwnNoteController);

// PROFILE
// get the profile details
route.get("/user/profile", jwtMiddleware,userController.getUserProfile);

// ----------------ADMIN----------
// path for all admin notes
route.get("/admin/all-notes",jwtAdminMiddleware,noteController.getAllNotesForAdminController);
// admin – approve / reject note
route.put("/admin/update-note-status/:id",jwtAdminMiddleware,noteController.updateNoteStatusController);

// admin – users
route.get("/admin/all-users",jwtAdminMiddleware,userController.getAllUsersController);

route.delete("/admin/delete-user/:id",jwtAdminMiddleware,userController.deleteUserController);
// admin dashboard stats
route.get("/admin/dashboard-stats",jwtAdminMiddleware,userController.getAdminDashboardStats);


    // ---REPORTS ----
// get reports in admin
route.get("/admin/reports",jwtAdminMiddleware,reportController.getAllReportsController);
// resolve reports
route.put("/admin/resolve-report/:id",jwtAdminMiddleware,reportController.resolveReportController);
// delete reports
route.delete("/admin/delete-report/:id",jwtAdminMiddleware,reportController.deleteReportController);
    // ----NOTES-----
// delete notes
route.delete("/admin/delete-note/:id",jwtAdminMiddleware,noteController.deleteNoteController);
    // QUESTIONS
// get  questions admin
route.get("/admin/questions",jwtAdminMiddleware,questionController.getAllQuestionsAdmin);
// update question 
route.put("/admin/update-question-status/:id",jwtAdminMiddleware,questionController.updateQuestionStatus);
// edit question
route.put("/edit-question/:id",jwtMiddleware,questionController.updateQuestionController);
    // QUIZ
// save each quiz
route.post("/save-quiz",jwtMiddleware,quizController.saveQuizHistory);
// get the quiz history
route.get("/quiz-history",jwtMiddleware,quizController.getQuizHistory);

// --COURSES--
// ADMIN
route.post("/admin/add-course",jwtAdminMiddleware,courseController.addCourse);

route.get("/admin/courses",jwtAdminMiddleware,courseController.getAllCoursesAdmin);

route.put("/admin/course/:id",jwtAdminMiddleware,courseController.updateCourse);

route.delete("/admin/course/:id",jwtAdminMiddleware,courseController.deleteCourse);
// get the purchased courses
route.get("/payment/my-courses",jwtMiddleware,paymentController.getMyCourses);

// USER
route.get("/courses", courseController.getAllCoursesUser);

// create checkout session
route.post("/create-checkout-session",jwtMiddleware,paymentController.createCheckoutSession);

route.get("/course/:id",jwtMiddleware,hasPurchasedCourse,courseController.getSingleCourse);
// confirm payment
route.post("/payment/confirm",paymentController.confirmPayment);

// ==============CERTIFICATES===============
route.post("/issue-certificate",jwtMiddleware,certificateController.issueCertificate);

route.get("/my-certificates",jwtMiddleware,certificateController.getMyCertificates);

// ============CONTACTS===============

// user
route.post("/contact", contactController.sendMessage);

// admin
route.get("/admin/messages",jwtAdminMiddleware,contactController.getAllMessages);

route.delete("/admin/message/:id",jwtAdminMiddleware,contactController.deleteMessage);

module.exports=route