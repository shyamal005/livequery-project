const http = require('http');
const https = require('https'); 

const TARGET_URL = process.env.INGESTOR_URL || 'http://localhost:3001/log'; 


const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Bot is running...');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const sources = ['PaymentService', 'Auth', 'Database', 'AWS-S3'];
const levels = ['info', 'warning', 'error'];
const messages = [
    'User login successful', 
    'Payment gateway timeout', 
    'Database backup started', 
    'Image upload complete', 
    'API rate limit exceeded'
];

function sendLog() {
    const data = JSON.stringify({
        source: sources[Math.floor(Math.random() * sources.length)],
        level: levels[Math.floor(Math.random() * levels.length)],
        message: messages[Math.floor(Math.random() * messages.length)]
    });

    const url = new URL(TARGET_URL);
    const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    
    const requestLib = url.protocol === 'https:' ? https : http;
    
    const req = requestLib.request(options, (res) => {
        
    });

    req.on('error', (error) => {
        console.error('Error sending log:', error.message);
    });

    req.write(data);
    req.end();

    const randomDelay = Math.floor(Math.random() * 3000) + 1000;
    setTimeout(sendLog, randomDelay);
}

sendLog();

