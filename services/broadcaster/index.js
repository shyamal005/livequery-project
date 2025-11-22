// ... existing imports

// 1. Setup the Subscriber (Keep your existing code)
const redisSubscriber = createClient({ url: process.env.REDIS_URL });
// ... existing subscriber connection logic ...

// --- NEW CODE STARTS HERE ---
// 2. Setup a Regular Client (We need this to FETCH data, subscribers can't fetch)
const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);

io.on('connection', async (socket) => {
  console.log('A user connected');

  // When a user connects, immediately fetch the last 50 logs
  try {
    const history = await redisClient.lRange('log_history', 0, -1);
    
    // Parse them back to JSON and send them to the FRONTEND
    const parsedHistory = history.map(item => JSON.parse(item));
    socket.emit('log_history', parsedHistory); 
  } catch (e) {
    console.error("Could not fetch history", e);
  }

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
// --- NEW CODE ENDS HERE ---
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('redis');

const app = express();
const server = http.createServer(app);

// --- FIX IS HERE ---
// Setup Socket.IO with CORS to allow all origins
const io = new Server(server, {
  cors: {
    origin: "*", // This allows connections from any domain
    methods: ["GET", "POST"]
  }
});
// --------------------

const redisSubscriber = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisSubscriber.on('error', (err) => console.log('❌ Redis Subscriber Error', err));

(async () => {
  try {
    await redisSubscriber.connect();
    console.log('✅ Redis subscriber connected');

    await redisSubscriber.subscribe('logs', (message) => {
      console.log('Received log from Redis:', message);
      io.emit('new_log', JSON.parse(message));
    });
  } catch (err) {
      console.error('🔴 Failed to connect to Redis or subscribe:', err);
  }
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

