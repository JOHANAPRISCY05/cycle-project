const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cycle_booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => console.error(err));

const RideHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  duration: Number,
  cost: Number,
  dropLocation: String,
  timestamp: { type: Date, default: Date.now }
});
const RideHistory = mongoose.model('RideHistory', RideHistorySchema, 'ride_history');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  authenticateToken(req, res, async () => {
    if (req.user.role !== 'user') return res.status(403).json({ message: 'Unauthorized' });

    try {
      const history = await RideHistory.find({ userId: req.user.id });
      res.status(200).json(history);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
}