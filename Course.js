const mongoose = require('mongoose');

// Define the schema for the course model
const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },   // Matches `course.name` in frontend
  description: { type: String }, // Matches `course.description` in frontend
  subjectArea: { type: String },  // Matches `course.subjectArea` in frontend
  credits: { type: Number, min: 0 },  // Matches `course.credits` in frontend
  teacher: { type: String },  // Matches `course.teacher` in frontend
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // This will store the enrolled students
});

// Export the model to use it in other parts of the app
module.exports = mongoose.model('Course', courseSchema);

