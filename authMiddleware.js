const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct

// Middleware to authenticate the user
const authenticate = async (req, res, next) => {
  try {
    const authorizationHeader = req.header('Authorization');

    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Authorization token is missing' });
    }

    const token = authorizationHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is invalid' });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database based on the decoded ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach the user data to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong with authentication' });
  }
};

// Middleware to authorize the user as a teacher
const authorizeTeacher = (req, res, next) => {
  if (!req.user || req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Forbidden: Only teachers are allowed to perform this action' });
  }

  // If the user is a teacher, proceed to the next middleware or route handler
  next();
};

module.exports = { authenticate, authorizeTeacher };
