const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  subject: String,
  credits: { type: Number, min: 0 },
  teacher: String,
});

module.exports = mongoose.model('Course', courseSchema);
