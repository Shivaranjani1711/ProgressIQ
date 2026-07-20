const jwt = require('jsonwebtoken');

/**
 * Signs a JWT containing the user's id.
 * Kept as a separate util so any controller can issue tokens the same way.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
