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



APP.js:// frontend/src/App.js

import React, { useState, useEffect, useMemo } from 'react';

import { io } from 'socket.io-client';

import './App.css';



// Connect to the broadcaster service

// Use environment variable for deployed URL, fallback to localhost for development

const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:3002';

const socket = io(WEBSOCKET_URL);



function App() {

  const [logs, setLogs] = useState([]);

  const [filter, setFilter] = useState('');



  useEffect(() => {

    // Listen for new logs from the server

    socket.on('new_log', (newLog) => {

      // Add new log to the top of the list, keeping only the latest 200

      setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 199)]);

    });



    // Cleanup on component unmount

    return () => {

      socket.off('new_log');

    };

  }, []);



  const filteredLogs = useMemo(() => {

    if (!filter) return logs;

    return logs.filter(log =>

      JSON.stringify(log).toLowerCase().includes(filter.toLowerCase())

    );

  }, [logs, filter]);



  return (

    <div className="app">

      <header className="app-header">

        <h1>🚀 LiveQuery</h1>

        <input

          type="text"

          placeholder="Filter logs..."

          className="filter-input"

          value={filter}

          onChange={(e) => setFilter(e.target.value)}

        />

      </header>

      <main className="log-container">

        {filteredLogs.map((log, index) => (

          <div key={index} className={`log-entry log-${log.level || 'info'}`}>

            <span className="log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>

            <span className="log-source">{log.source || 'unknown'}</span>

            <span className="log-message">{log.message}</span>

          </div>

        ))}

      </main>

    </div>

  );

}



export default App;
