const mongoose = require('mongoose');

// Define the schema for the course model
const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },  
  description: { type: String }, 
  subjectArea: { type: String }, 
  credits: { type: Number, min: 0 }, 
  teacher: { type: String }, 
});

// Export the model to use it in other parts of the app
module.exports = mongoose.model('Course', courseSchema);
