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
app.use('/api/login', require('./login.js'));
app.use('/api/register', require('./register.js'));
app.use('/api/book', require('./book.js'));
app.use('/api/bookings', require('./bookings.js'));
app.use('/api/start-ride', require('./start-ride.js'));
app.use('/api/stop-ride', require('./stop-ride.js'));
app.use('/api/ride-history', require('./ride-history.js'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});