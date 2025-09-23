// services/ingestor/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('redis');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Redis
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

// The endpoint to receive logs
app.post('/log', async (req, res) => {
  const logData = req.body;
  // Add a timestamp to each log
  logData.timestamp = new Date().toISOString();

  try {
    // Publish the log to a Redis channel named 'logs'
    await redisClient.publish('logs', JSON.stringify(logData));
    res.status(200).send('Log received');
  } catch (err) {
    console.error('Failed to publish log:', err);
    res.status(500).send('Error processing log');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Ingestor service listening on port ${PORT}`);
});