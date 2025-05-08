const jwt = require('jsonwebtoken');

// generateToken.js
const generateToken = (user) => {
  console.log('Generating token for user:', user);

  if (!user || !user._id) {
    console.error('Error: User or user._id is missing');
    throw new Error('User object is missing _id');
  }

  if (!process.env.JWT_SECRET) {
    console.error('Error: JWT_SECRET is missing from environment variables');
    throw new Error('JWT_SECRET is missing');
  }

  // Check if user has a role and include it in the token payload
  const role = user.role || 'user'; // Default to 'user' if no role is specified

  // Add user info (id, role) to the token payload
  const token = jwt.sign(
    { 
      id: user._id, 
      name: user.name,  // Include user name if needed
      role: role        // Add role (e.g., 'admin', 'teacher', 'user')
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  console.log('Generated token:', token); // Log generated token (optional)

  return token;
};

module.exports = generateToken;
