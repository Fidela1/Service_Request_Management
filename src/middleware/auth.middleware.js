// This middleware checks for a valid JWT token in the Authorization header.

const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecret');
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { protect };
