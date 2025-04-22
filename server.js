const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cycle_booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => console.error(err));

// Register your route handlers
app.use('/api/login', require('./api/login.js'));
app.use('/api/register', require('./api/register.js'));
app.use('/api/book', require('./api/book.js'));
app.use('/api/bookings', require('./api/bookings.js'));
app.use('/api/start-ride', require('./api/start-ride.js'));
app.use('/api/stop-ride', require('./api/stop-ride.js'));
app.use('/api/ride-history', require('./api/ride-history.js'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});