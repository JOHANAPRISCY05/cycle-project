// api/models.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'host'], required: true }
});

// ✅ Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users');

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
const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema, 'bookings');

const RideHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  duration: Number,
  cost: Number,
  dropLocation: String,
  timestamp: { type: Date, default: Date.now }
});
const RideHistory = mongoose.models.RideHistory || mongoose.model('RideHistory', RideHistorySchema, 'ride_history');

module.exports = { User, Booking, RideHistory };