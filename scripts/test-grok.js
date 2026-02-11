const OpenAI = require('openai');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

console.log('--- Starting Grok API Test ---');

async function testGrok() {
    try {
        const apiKey = process.env.GROK_API_KEY;
        const baseURL = process.env.GROK_API_BASE_URL || 'https://api.x.ai/v1';

        console.log(`API Key present: ${!!apiKey}`);
        console.log(`Base URL: ${baseURL}`);

        if (!apiKey) {
            console.error('Error: GROK_API_KEY is not defined in .env.local');
            return;
        }

        console.log('Initializing OpenAI client...');
        const client = new OpenAI({
            apiKey: apiKey,
            baseURL: baseURL,
        });

        console.log('Sending request to Grok...');
        const completion = await client.chat.completions.create({
            model: "grok-2-latest",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Say 'Hello, Grok!'" },
            ],
        });

        console.log("Success! Response:");
        console.log(completion.choices[0].message.content);
    } catch (error) {
        console.error("Error connecting to Grok API:");
        console.error(error);
    } finally {
        console.log('--- Test Completed ---');
    }
}

testGrok().catch(console.error);
