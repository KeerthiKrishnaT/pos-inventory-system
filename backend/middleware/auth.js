const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if user is employee (or admin)
const isEmployee = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || (user.role !== 'employee' && user.role !== 'admin')) {
      return res.status(403).json({ message: 'Access denied. Employee or Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authenticate, isAdmin, isEmployee };

