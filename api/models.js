const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cycle_booking', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.error('MongoDB connection error:', err);
      throw new Error('Database connection failed');
    }
  }
};

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'host'], required: true },
});

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
  dropLocation: String,
});

const RideHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  duration: Number,
  cost: Number,
  dropLocation: String,
  timestamp: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users');
const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema, 'bookings');
const RideHistory = mongoose.models.RideHistory || mongoose.model('RideHistory', RideHistorySchema, 'ride_history');

module.exports = { User, Booking, RideHistory, connectDB };