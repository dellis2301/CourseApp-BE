const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
//const studentRoutes = require('./routes/studentRoutes'); 
const { authenticate, authorizeTeacher, authorizeStudent } = require('./middleware/authMiddleware');


const app = express();

// Allowed frontend origins
const allowedOrigins = ['https://dellis2301.github.io', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error('CORS not allowed from this origin: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json()); // Parse incoming JSON

// Home route
app.get('/', (req, res) => {
  res.send('Course API is running!');
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// PUBLIC routes (no auth)
app.use('/api/auth', authRoutes); // e.g., /api/auth/register, /api/auth/login


app.use('/api/courses', courseRoutes);


// PROTECTED student-only routes (optional, for Stage 2)
//app.use('/api/student', authenticate, authorizeStudent, studentRoutes);

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

