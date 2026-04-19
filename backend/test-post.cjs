const http = require('http');

const data = JSON.stringify({
  log: "Databaseerror on port no 50032",
  language: "en"
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/analyze',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(res.statusCode, body));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
