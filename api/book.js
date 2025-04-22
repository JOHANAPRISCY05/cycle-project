const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { User, Booking } = require('./models.js');

const generateUniqueCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

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
    if (req.user.role !== 'user') return res.status(403).json({ message: 'Unauthorized' });

    const { place, cycle } = req.body;
    try {
      const uniqueCode = generateUniqueCode();
      const booking = new Booking({ userId: req.user.id, place, cycle, uniqueCode });
      await booking.save();

      res.status(200).json({ booking, message: 'Cycle booked successfully', uniqueCode });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
};