 // services/ingestor/index.js

require('dotenv').config();

const express = require('express');

const cors = require('cors');

const { createClient } = require('redis');



const app = express();

app.use(cors());

app.use(express.json());





const redisClient = createClient({

  url: process.env.REDIS_URL || 'redis://localhost:6379'

});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.connect();





app.post('/log', async (req, res) => {

  const logData = req.body;

  

  logData.timestamp = new Date().toISOString();



  try {

    

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
