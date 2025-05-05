const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate, authorizeTeacher } = require('../middleware/authMiddleware');

// Public: Get all courses or a single course
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);

// Protected: Only teachers can create, update, or delete courses
router.post('/', authenticate, authorizeTeacher, courseController.createCourse);
router.put('/:id', authenticate, authorizeTeacher, courseController.updateCourse);
router.delete('/:id', authenticate, authorizeTeacher, courseController.deleteCourse);

module.exports = router;

