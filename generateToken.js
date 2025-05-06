const jwt = require('jsonwebtoken');

function generateToken(user) {
  try {
    // Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    // Validate the user object
    if (!user || typeof user !== 'object' || !user._id || !user.username || !user.role) {
      console.error('Invalid user object:', user); // Log the invalid user object
      throw new TypeError('Invalid user object passed to generateToken');
    }

    // Create the payload for the token
    const payload = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    // Generate the token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expiration time
    });

    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

module.exports = generateToken;