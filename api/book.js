const jwt = require('jsonwebtoken');
const { Booking, connectDB } = require('./models.js');

const generateUniqueCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    await connectDB();
    jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = user;
      next();
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = async function (req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  authenticateToken(req, res, async () => {
    if (req.user.role !== 'user') return res.status(403).json({ message: 'Unauthorized' });

    try {
      await connectDB();
      const { place, cycle } = req.body;
      const uniqueCode = generateUniqueCode();
      const booking = new Booking({ userId: req.user.id, place, cycle, uniqueCode });
      await booking.save();

      res.status(200).json({ booking, message: 'Cycle booked successfully', uniqueCode });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
};