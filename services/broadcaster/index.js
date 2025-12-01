require('dotenv').config();

const express = require('express');

const http = require('http');

const { Server } = require('socket.io');

const { createClient } = require('redis');



const app = express();

const server = http.createServer(app);





const io = new Server(server, {
  cors: {
    origin: ["https://livequery-frontend.onrender.com", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

});





const redisSubscriber = createClient({

  url: process.env.REDIS_URL || 'redis://localhost:6379'

});



redisSubscriber.on('error', (err) => console.log('Redis Subscriber Error', err));



(async () => {

  try {

    await redisSubscriber.connect();

    console.log('Redis subscriber connected');



    await redisSubscriber.subscribe('logs', (message) => {

      console.log('Received log from Redis:', message);

      io.emit('new_log', JSON.parse(message));

    });

  } catch (err) {

      console.error('Failed to connect to Redis or subscribe:', err);

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
