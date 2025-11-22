const http = require('http');


const TARGET_URL = 'http://localhost:3001/log'; 

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
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        
    });

    req.on('error', (error) => {
        console.error('Error sending log:', error.message);
    });

    req.write(data);
    req.end();
    
    
    const randomDelay = Math.floor(Math.random() * 2000) + 1000;
    setTimeout(sendLog, randomDelay);
}

console.log(`🤖 Bot active! Firing logs at ${TARGET_URL}...`);
sendLog();