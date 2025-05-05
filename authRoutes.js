const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // JWT secret key

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body; // Expecting username, email, password, and role (teacher/student)

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save(); // Save the user to the database

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' }); // Generate JWT token

    res.status(201).json({ token }); // Send token back to the client
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' }); // Generate JWT token

    res.status(200).json({ token }); // Send token back to the client
  } catch (err) {
    res.status(500).json({ error: 'Failed to log in' });
  }
});

module.exports = router;
