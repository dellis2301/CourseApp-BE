const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Make sure this path is correct

// Middleware to authenticate the user
const authenticate = async (req, res, next) => {
  try {
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is missing or malformed' });
    }

    const token = authorizationHeader.replace('Bearer ', '');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to authorize teacher role
const authorizeTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Access denied: Teachers only' });
  }
  next();
};

module.exports = { authenticate, authorizeTeacher };

