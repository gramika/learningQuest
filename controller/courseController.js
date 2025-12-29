const Course = require("../model/courseModel");

// add course (admin)
exports.addCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json(err);
  }
};

// get all courses (admin)
exports.getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json(err);
  }
};

// update course
exports.updateCourse = async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
};

// delete course
exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json("Course deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

// get active courses for users
exports.getAllCoursesUser = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json(err);
  }
};

// get single course
exports.getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json(err);
  }
};
