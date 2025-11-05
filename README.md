LiveQuery: A Real-Time, Distributed Log Monitoring System



1. The Problem

In a modern microservices architecture, applications are distributed across multiple servers and services. To check for errors or monitor system health, a developer's traditional workflow is to:

SSH into a specific server.

Manually find the correct log file.

Use commands like tail -f to watch for new logs.

Repeat this process for every single service.

This approach is slow, inefficient, and provides no centralized, high-level view of system health. By the time an error is found, it could be too late.

2. The Solution: LiveQuery

LiveQuery solves this by providing a single, centralized web dashboard that streams logs from all services in real-time.

It's an event-driven system built on a decoupled, scalable architecture. It's designed to be lightweight, fast, and reliable. Instead of inefficient HTTP polling, it uses a WebSocket connection for instant data pushes, and a Redis Pub/Sub message queue to ensure that a high volume of log traffic can be handled without data loss.

This project was built to explore and demonstrate a complete, end-to-end understanding of modern, real-time system design—from initial concept to a fully deployed cloud application.

3. Key Features

⚡ Real-Time Streaming: Logs appear on the dashboard instantly. No refreshing required.

🏗️ Decoupled Architecture: A high-speed Redis message queue decouples the "ingestor" from the "broadcaster," making the system resilient and scalable.

🔍 Live Filtering: A client-side filter allows you to search and filter logs on-the-fly.

📚 Log Grouping & Collapsing: Repetitive, identical logs are automatically grouped into a single, expandable row, keeping the UI clean.

🎨 Color-Coded Levels: Logs are color-coded by level (INFO, WARN, ERROR) for easy visual scanning.

🐳 Fully Containerized: The entire application stack (frontend, backend services, Redis) is containerized with Docker for easy and consistent local development.

☁️ Cloud Deployed: The project is live and fully functional on Render, demonstrating a complete CI/CD pipeline and cloud infrastructure knowledge.

4. System Architecture

This project is composed of four independent services that communicate asynchronously.

graph TD
    subgraph "External Applications"
        App1["<div style='padding:5px;'><i class='fas fa-server'></i><br><b>Payment API</b></div>"]
        App2["<div style='padding:5px;'><i class='fas fa-server'></i><br><b>User Service</b></div>"]
    end

    subgraph "LiveQuery Platform (Hosted on Render)"
        direction TB
        B["<div style='padding:10px;'><i class='fas fa-inbox fa-2x'></i><br><b>Ingestor Service</b><br>(Node.js API)</div>"]
        C(("<div style='padding:10px;'><i class='fas fa-database fa-2x'></i><br><b>Redis</b><br>(Pub/Sub Queue)</div>"))
        D["<div style='padding:10px;'><i class='fas fa-broadcast-tower fa-2x'></i><br><b>Broadcaster Service</b><br>(Node.js & WebSockets)</div>"]
    end

    subgraph "User Interface"
        E["<div style='padding:10px;'><i class='fab fa-react fa-2x'></i><br><b>React Frontend</b><br>(Live Dashboard)</div>"]
    end
    
    %% Data Flow
    App1 -- "HTTP POST /log" --> B
    App2 -- "HTTP POST /log" --> B
    B -- "PUBLISH logs" --> C
    C -- "SUBSCRIBE logs" --> D
    D -- "Real-time WebSocket Push" --> E

    %% Styling
    linkStyle default interpolate basis
    
    style App1 fill:#2c3e50,stroke:#3498db,stroke-width:2px,color:#fff,border-radius:10px
    style App2 fill:#2c3e50,stroke:#3498db,stroke-width:2px,color:#fff,border-radius:10px
    style B fill:#16a085,stroke:#1abc9c,stroke-width:2px,color:#fff,border-radius:10px
    style C fill:#c0392b,stroke:#e74c3c,stroke-width:2px,color:#fff,border-radius:10px
    style D fill:#16a085,stroke:#1abc9c,stroke-width:2px,color:#fff,border-radius:10px
    style E fill:#2980b9,stroke:#3498db,stroke-width:2px,color:#fff,border-radius:10px


Ingestor Service: A lightweight Node.js/Express API that receives log data via a POST request. Its only job is to validate and immediately publish the log to the Redis queue.

Redis (Pub/Sub): Acts as the central message broker. This decouples the system, so if the broadcaster is down, logs are not lost.

Broadcaster Service: A Node.js/Socket.IO server that subscribes to the Redis queue. As soon as a log appears, it pushes it to all connected frontend clients via WebSockets.

Frontend: A React application that listens for WebSocket events and renders the log stream in real-time.

5. Tech Stack

Category

Technology

Frontend

React, Socket.IO Client

Backend

Node.js, Express, Socket.IO (Server)

Database / Messaging

Redis (for Pub/Sub)

DevOps

Docker, Docker Compose

Cloud

Render (for deployment of all services)

6. Local Development Setup

You can run the entire platform on your local machine using Docker in just two steps.

Prerequisites

Git

Docker Desktop

Installation

1. Clone the repository:

git clone [https://github.com/your-username/livequery-project.git](https://github.com/your-username/livequery-project.git)
cd livequery-project


2. Build and Run the Containers:
Make sure Docker Desktop is running, then execute the following command from the root directory:

docker compose up --build


This command will:

Build the Docker images for the ingestor, broadcaster, and frontend.

Start a container for all three services plus a redis container.

Orchestrate the network so they can all communicate.

Accessing the Local Services

Frontend Dashboard: http://localhost (or http://localhost:8080 if you used 8080)

Ingestor Endpoint: http://localhost:3001/log

7. How to Use (Send Logs)

Once the application is running (locally or live), you can send logs by making a simple HTTP POST request.

Using curl (from any terminal):

# Send an ERROR log
curl -X POST -H "Content-Type: application/json" \
     -d '{"level": "error", "source": "payment-api", "message": "User credit card expired"}' \
     http://localhost:3001/log

# Send an INFO log
curl -X POST -H "Content-Type: application/json" \
     -d '{"level": "info", "source": "user-service", "message": "User 123 logged in"}' \
     http://localhost:3001/log


Integrating with any Application (Node.js Example):

You can use a library like axios to send logs from any of your other projects.

const axios = require('axios');
const LIVEQUERY_URL = 'http://localhost:3001/log'; // Or your live Render URL

async function sendLog(level, source, message) {
  try {
    await axios.post(LIVEQUERY_URL, { level, source, message });
  } catch (error) {
    console.error('Failed to send log to LiveQuery:', error.message);
  }
}

// Usage:
sendLog('error', 'my-new-app', 'Something terrible happened!');


8. Future Roadmap

This project provides a strong foundation for a full-scale log analytics platform. Future development plans include:

[ ] User Authentication: Secure the dashboard and provide user-specific API keys for ingesting logs.

[ ] Persistent Storage: Add a new "worker" service to pull logs from Redis and store them permanently in a search-optimized database like Elasticsearch or PostgreSQL (with jsonb).

[ ] Historical Search: Build a UI to search and filter logs from the persistent database using date ranges and advanced queries.

[ ] Automated Alerting: Create a system to define rules (e.L., "10 error logs in 1 minute") that trigger email or webhook alerts.

9. License

This project is licensed under the MIT License.
