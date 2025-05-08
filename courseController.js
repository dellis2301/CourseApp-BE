const Course = require('../models/Course');

// Create a course (only by authenticated teacher)
const createCourse = async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      teacherId: req.user._id // Save teacher ID
    });
    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    res.status(500).json({ message: 'Error creating course' });
  }
};

// Get all courses (public)
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

// Get a single course by ID (public)
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching course' });
  }
};

// Update a course (only by authenticated teacher)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You can only update your own courses' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ message: 'Error updating course' });
  }
};

// Delete a course (only by the creator)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own courses' });
    }

    await course.deleteOne();
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting course' });
  }
};

// Get courses for the current user
const getMyCourses = async (req, res) => {
  try {
    const user = req.user;

    let courses;
    if (user.role === 'teacher') {
      courses = await Course.find({ teacherId: user._id });
    } else {
      courses = await Course.find({ enrolledStudents: user._id });
    }

    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error retrieving courses' });
  }
};

// Enroll student in courses from the cart
const checkoutCart = async (req, res) => {
  try {
    const studentId = req.user._id;
    const courseIds = req.body.courseIds;

    const courses = await Course.find({ _id: { $in: courseIds } });

    if (courses.length === 0) {
      return res.status(404).json({ message: 'Courses not found' });
    }

    for (const course of courses) {
      if (!course.enrolledStudents.includes(studentId)) {
        course.enrolledStudents.push(studentId);
        await course.save(); // ensure save is awaited
      }
    }

    res.json({ message: 'Successfully enrolled in selected courses', courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error enrolling in courses' });
  }
};

// Export all controller functions
module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getMyCourses,
  checkoutCart
};


