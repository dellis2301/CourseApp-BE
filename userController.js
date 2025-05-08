

const User = require('../models/User');
const Course = require('../models/Course');  // Ensure you import the Course model

// Get the courses a student is enrolled in
exports.getStudentCourses = async (req, res) => {
  try {
    const studentId = req.user.id;  // Get student ID from the authenticated user (from token)
    const student = await User.findById(studentId).populate('enrolledCourses');  // Populate the enrolledCourses field
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student.enrolledCourses);  // Send back the list of courses the student is enrolled in
  } catch (err) {
    res.status(500).json({ message: 'Error fetching student courses' });
  }
};
