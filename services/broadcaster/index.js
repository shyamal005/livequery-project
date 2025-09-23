// services/broadcaster/index.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('redis');

const app = express();
const server = http.createServer(app);

// Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity
    methods: ["GET", "POST"]
  }
});

// Create a separate Redis client for subscribing
const redisSubscriber = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

(async () => {
  await redisSubscriber.connect();

  // Subscribe to the 'logs' channel
  await redisSubscriber.subscribe('logs', (message) => {
    console.log('Received log from Redis:', message);
    // Broadcast the new log to all connected clients
    io.emit('new_log', JSON.parse(message));
  });
})();

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Broadcaster service listening on port ${PORT}`);
});