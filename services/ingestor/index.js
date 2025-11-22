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

app.post('/log', async (req, res) => {
  const logData = req.body;
  logData.timestamp = new Date().toISOString();

  try {
    const message = JSON.stringify(logData);

    // 1. Broadcast it live (Keep this)
    await redisClient.publish('logs', message);

    // --- NEW CODE STARTS HERE ---
    // 2. Save it to a list called 'log_history'
    await redisClient.lPush('log_history', message);
    
    // 3. Keep only the last 50 logs (delete older ones) so Redis doesn't fill up
    await redisClient.lTrim('log_history', 0, 49); 
    // --- NEW CODE ENDS HERE ---

    res.status(200).send('Log received');
  } catch (err) {
    // ... error handling
  }
});

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
