
<h1 align="center">🚀 LiveQuery</h1>

<p align="center">
  <b>A Distributed, Real-Time Log Monitoring System</b><br/>
  <b>Microservices • Redis Pub/Sub • WebSockets • Node.js • React</b>
</p>

---

## 🧰 Tech Stack

### **Frontend**
- ⚛️ **React.js**
- 🎨 **CSS3**
- 🔌 **Socket.io Client**

### **Backend**
- 🟩 **Node.js**
- 🚏 **Express.js**
- 🔌 **Socket.io**
- 📡 **Redis Pub/Sub**

### **Infrastructure**
- ☁️ **Render Cloud**
- 🗄️ **Upstash / Render Redis**
- 🐙 **GitHub**

---

## 📖 Overview

**LiveQuery** is a fully distributed real-time log monitoring platform.  
It ingests logs at high speed, processes them asynchronously through Redis Pub/Sub,  
and streams them instantly to a live dashboard via WebSockets.

Unlike traditional monolithic log viewers, LiveQuery **decouples ingestion from broadcasting**, ensuring high throughput even during heavy log traffic.

---

## 🏗 Architecture

### **System Components**
- **Ingestor Service** → Receives logs via HTTP POST and publishes to Redis.
- **Redis Pub/Sub** → Message broker that decouples write and read workloads.
- **Broadcaster Service** → Subscribes to Redis and streams logs to WebSocket clients.
- **Frontend Dashboard** → Displays real-time logs with filtering support.

---

## 🔁 Data Flow Diagram

```

[Log Source / Traffic Bot]
↓ (HTTP POST)
[Ingestor Service]
↓ (Redis Publish)
[Redis Pub/Sub]
↓ (Redis Subscribe)
[Broadcaster Service]
↓ (WebSockets)
[React Dashboard]

````

---

## ✨ Key Features

### ⚡ Real-Time Streaming  
Logs appear on the dashboard within milliseconds.

### 🧩 Distributed Microservices Architecture  
Each service runs independently—failure in one does not affect others.

### 🔌 Redis-Based Decoupling  
Ensures smooth traffic even under heavy log load.

### 🤖 Traffic Simulation Bot  
Generates payment logs, DB logs, auth events, etc.

### 🔍 Instant Log Filtering  
Frontend can filter logs by level, source, or text instantly.

---

## 🛠 Getting Started (Local Setup)

### **1. Clone the Repository**

```bash
git clone https://github.com/shyamal005/livequery-project.git
cd livequery-project
````

---

## **2. Start Redis (local)**

```bash
redis-server
```

---

## **3. Run Ingestor Service (Port 3001)**

```bash
cd services/ingestor
npm install
```

Create `.env`:

```
REDIS_URL=redis://localhost:6379
```

Start the service:

```bash
npm start
```

---

## **4. Run Broadcaster Service (Port 3002)**

```bash
cd services/broadcaster
npm install
```

Create `.env`:

```
REDIS_URL=redis://localhost:6379
```

Start the service:

```bash
npm start
```

---

## **5. Run Frontend (Port 3000)**

```bash
cd frontend
npm install
```

Create `.env`:

```
REACT_APP_WEBSOCKET_URL=http://localhost:3002
```

Start React:

```bash
npm start
```

---

## **6. Start the Traffic Simulator**

```bash
node bot.js
```

You will now see logs flowing on the dashboard.

---

## 📡 API Endpoint

### **POST /log** — Send log entry

```json
{
  "source": "PaymentService",
  "level": "error",
  "message": "Transaction failed: Insufficient funds"
}
```

---

## ☁️ Deployment (Render Cloud)

* 🔹 Redis — Managed Redis
* 🔹 Ingestor — Web Service
* 🔹 Broadcaster — Web Service
* 🔹 Frontend — Static Site
* 🔹 Traffic Bot — Background Worker

This mirrors real-world production microservice deployments.

---

## 📸 Demo (Optional)

Add your screenshots or GIFs here:

```markdown
![Live Dashboard](/assets/demo.png)
```

---

## 🤝 Contributing

Pull requests and feature suggestions are welcome!

---

## 📜 License

MIT License © 2025

---

<p align="center"><b>Made with ❤️ & WebSockets</b></p>
```

