// frontend/src/App.js
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
    // Listen for live logs (Keep this)
    socket.on('new_log', (newLog) => {
      setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 199)]);
    });

    // --- NEW CODE STARTS HERE ---
    // Listen for history when we first load
    socket.on('log_history', (historyLogs) => {
      // Replace current logs with history
      setLogs(historyLogs); 
    });
    // --- NEW CODE ENDS HERE ---

    return () => {
      socket.off('new_log');
      socket.off('log_history'); // Cleanup
    };
  }, []);

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
