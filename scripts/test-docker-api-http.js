const http = require('http');
const fs = require('fs');

const postData = JSON.stringify({
    year: 1990,
    month: 5,
    day: 15,
    hour: 6,
    gender: 'male'
});

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/saju',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        fs.writeFileSync('api-response-http.json', data);
        console.log('Response written to api-response-http.json');
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    fs.writeFileSync('api-response-http.json', JSON.stringify({ error: e.message }));
});

req.write(postData);
req.end();
