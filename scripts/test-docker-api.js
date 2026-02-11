const fetch = require('node-fetch');

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
        console.log("Fortune Message:", data.data?.food?.fortuneMessage);
        console.log("Full Response:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

testApi();
