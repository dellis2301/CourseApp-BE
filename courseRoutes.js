const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate, authorizeTeacher } = require('../middleware/authMiddleware');

// Public routes
router.get('/', courseController.getCourses); // no auth here
router.get('/:id', courseController.getCourseById);

// Protected routes
router.post('/', authenticate, authorizeTeacher, courseController.createCourse);
router.put('/:id', authenticate, authorizeTeacher, courseController.updateCourse);
router.delete('/:id', authenticate, authorizeTeacher, courseController.deleteCourse);
router.get('/my-courses', authenticate, courseController.getMyCourses);
router.post('/checkout', authenticate, courseController.checkoutCart);



module.exports = router;

