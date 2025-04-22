const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { User, Booking } = require('./models.js');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

module.exports = async function (req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  authenticateToken(req, res, async () => {
    if (req.user.role !== 'host') return res.status(403).json({ message: 'Unauthorized' });

    try {
      const bookings = await Booking.find({ stopped: false }).populate('userId', 'email');
      res.status(200).json(bookings);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
};