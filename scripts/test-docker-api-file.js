const fs = require('fs');

async function testApi() {
    try {
        const response = await fetch('http://localhost:8080/api/saju', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                year: 1990,
                month: 5,
                day: 15,
                hour: 6,
                gender: 'male'
            })
        });
        const data = await response.json();
        fs.writeFileSync('api-response.json', JSON.stringify(data, null, 2));
    } catch (e) {
        fs.writeFileSync('api-response.json', JSON.stringify({ error: e.toString() }));
    }
}

testApi();
