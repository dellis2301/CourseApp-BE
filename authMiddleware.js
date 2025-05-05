const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Secret for JWT

// Middleware to check if the user is authenticated
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract the token

  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token
    req.user = decoded; // Attach user data to the request object
    next(); // Move to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to check if the user is a teacher
const authorizeTeacher = async (req, res, next) => {
  const user = await User.findById(req.user.id); // Find the user in the database
  if (user && user.role === 'teacher') {
    next(); // Allow the user to proceed if they're a teacher
  } else {
    res.status(403).json({ error: 'Permission denied: Only teachers can access this route' });
  }
};

module.exports = { authenticate, authorizeTeacher };
