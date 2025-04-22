const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cycle_booking')
  .catch(err => console.error(err));

app.use('/api/login', require('../api/login.js'));
app.use('/api/register', require('../api/register.js'));
app.use('/api/book', require('../api/book.js'));
app.use('/api/bookings', require('../api/bookings.js'));
app.use('/api/start-ride', require('../api/start-ride.js'));
app.use('/api/stop-ride', require('../api/stop-ride.js'));
app.use('/api/ride-history', require('../api/ride-history.js'));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRide', (bookingId) => {
    socket.join(bookingId);
    console.log(`User joined room: ${bookingId}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});