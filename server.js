const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const authRoutes = require('./routes/authRoutes'); // Import auth routes for login & registration
const courseRoutes = require('./routes/courseRoutes'); // Import course routes for CRUD operations
const { authenticate, authorizeTeacher } = require('./middleware/authMiddleware'); // Import middleware for auth

const app = express();


const allowedOrigins = ['https://dellis2301.github.io', 'http://localhost:3000'];


app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or localhost testing)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the origin
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error('CORS not allowed from this origin: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // You can specify allowed HTTP methods here
  allowedHeaders: ['Content-Type', 'Authorization'], // You can specify allowed headers
  credentials: true  // Allow cookies or credentials (useful for JWT authentication)
}));


app.use(express.json()); // Parse incoming JSON requests

// Home route
app.get('/', (req, res) => {
  res.send('Course API is running!');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Use authentication routes for login/register
app.use('/api/auth', authRoutes);  // Authentication routes

// Use course routes, with authentication and authorization middleware
app.use('/api/courses', authenticate, authorizeTeacher, courseRoutes);  // Only teachers can create/edit/delete courses

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
