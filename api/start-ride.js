const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Booking } = require('./models.js');

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
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  authenticateToken(req, res, async () => {
    if (req.user.role !== 'host') return res.status(403).json({ message: 'Unauthorized' });

    const { bookingId, uniqueCode } = req.body;
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking || booking.uniqueCode !== uniqueCode) return res.status(400).json({ message: 'Invalid booking or code' });
      if (booking.started) return res.status(400).json({ message: 'Ride already started' });

      booking.started = true;
      booking.startTime = new Date();
      await booking.save();

      res.status(200).json({ message: 'Ride started' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
};