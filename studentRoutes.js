const express = require('express');
const router = express.Router();

// Example student route: Get all enrolled courses for a student
router.get('/my-courses', (req, res) => {
  // Logic to fetch enrolled courses for a student
  res.json({ message: 'Fetching enrolled courses for student...' });
});

module.exports = router;
