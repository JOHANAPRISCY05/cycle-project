const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cycle_booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => console.error(err));

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'host'], required: true }
});
const User = mongoose.model('User', UserSchema, 'users');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  place: String,
  cycle: String,
  uniqueCode: String,
  started: { type: Boolean, default: false },
  stopped: { type: Boolean, default: false },
  startTime: Date,
  endTime: Date,
  duration: Number,
  cost: Number,
  dropLocation: String
});
const Booking = mongoose.model('Booking', BookingSchema, 'bookings');

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
    if (req.user.role !== 'host') return res.status(403).json({ message: 'Unauthorized' });

    try {
      const bookings = await Booking.find({ stopped: false }).populate('userId', 'email');
      res.status(200).json(bookings);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
}