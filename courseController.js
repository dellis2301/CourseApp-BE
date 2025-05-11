const Course = require('../models/Course');
const User = require('../models/User'); 
const mongoose = require('mongoose');

exports.getMyCourses = async (req, res) => {
    try {
        // Assuming you are storing the user ID in req.user (after authentication middleware)
        const userId = req.user.id;

        // Fetch courses where the user is enrolled (adjust the query as needed)
        const courses = await Course.find({ enrolledStudents: userId });

        if (!courses) {
            return res.status(404).json({ message: "No courses found for this user." });
        }

        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



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

const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    console.log('Fetching course by ID:', courseId);

    const course = await Course.findById(courseId);

    if (!course) {
      console.log('Course not found with ID:', courseId);
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (err) {
    console.error('Error fetching course by ID:', err.message);
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
    const user = req.user; // User from the decoded token
    console.log("Authenticated User:", user); // Log user data to verify token is being decoded

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    let courses;
    if (user.role === 'teacher') {
      console.log('Fetching courses for teacher:', user._id);
      courses = await Course.find({ teacherId: user._id });
    } else if (user.role === 'student') {
      console.log('Fetching courses for student:', user._id);
      courses = await Course.find({ enrolledStudents: user._id });
    } else {
      return res.status(403).json({ message: 'Unauthorized role' });
    }

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'No courses found' });
    }

    console.log("Courses fetched:", courses);
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error.message, error.stack);
    res.status(500).json({ message: 'Server error retrieving courses' });
  }
};

// Enroll student in courses from the cart
// Enroll student in courses from the cart
const checkoutCart = async (req, res) => {
  try {
    const studentId = req.user._id; // The student's ID from the authenticated user
    const courseIds = req.body.courseIds; // Get course IDs from the request body

    // Ensure courseIds is an array and contains data
    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ message: 'No course IDs provided' });
    }

    // Query the database for courses by their IDs
    const courses = await Course.find({ _id: { $in: courseIds } });
    console.log("Courses found:", courses);

    // Check if any courses were found
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Courses not found' });
    }

    // Log the found courses for debugging
    console.log('Found Courses:', courses);

    // Find the student (User) who is trying to enroll in the courses
    const student = await User.findById(studentId);
    console.log('Student found:', student);// Assuming "User" is the model for both students and teachers

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if the user is a student
    if (student.role !== 'student') {
      return res.status(403).json({ message: 'Only students can enroll in courses' });
    }

    // Enroll the student in each course if they are not already enrolled
    for (const course of courses) {
      if (!course.enrolledStudents.includes(studentId)) {
        console.log(`Enrolling student ${studentId} in course ${course._id}`);

        // Add the student to the enrolledStudents field of each course
        course.enrolledStudents.push(studentId);
        await course.save(); // Save the updated course

        // Add the course to the student's enrolledCourses field (assuming 'enrolledCourses' is the field name in the User model)
        student.enrolledCourses.push(course._id); // Ensure 'enrolledCourses' is an array field in the User model
      } else {
        console.log(`Student ${studentId} is already enrolled in course ${course._id}`);
      }
    }

    // Save the updated student's record
    await student.save();

    res.status(200).json({
      message: 'Successfully enrolled in selected courses',
      courses: courses.map(course => course.title), // Optionally return the course titles
    });
  } catch (err) {
    console.error('Error enrolling in courses:', err);
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
