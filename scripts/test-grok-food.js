const OpenAI = require('openai');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const logFile = path.resolve(__dirname, 'debug.log');

function log(msg) {
    try {
        const text = (typeof msg === 'object') ? JSON.stringify(msg, null, 2) : String(msg);
        fs.appendFileSync(logFile, new Date().toISOString() + ': ' + text + '\n');
        console.error(text);
    } catch (e) {
        // ignore
    }
}

// Mock request data
const request = {
    todayDate: '2024년 2월 21일',
    dominantOheng: '목(Wood)',
    weakOheng: '금(Metal)',
    recommendedFoods: [
        { name: '닭고기', category: '육류' },
        { name: '밀가루', category: '곡류' }
    ],
    avoidFoods: [
        { name: '매운 음식' }
    ]
};

async function testFoodGen() {
    log("--- Starting Test ---");
    
    const apiKey = process.env.GROK_API_KEY;
    const baseURL = process.env.GROK_API_BASE_URL || 'https://api.x.ai/v1';

    if (!apiKey) {
        log('Error: GROK_API_KEY is not defined');
        return;
    }

    const client = new OpenAI({ apiKey, baseURL });

    const prompt = `당신은 명리학과 음식을 연결하는 재미있는 전문가입니다.

오늘 날짜: ${request.todayDate}
강한 오행: ${request.dominantOheng}
보충 필요 오행: ${request.weakOheng}

추천 음식: ${request.recommendedFoods.map(f => f.name).join(', ')}
피할 음식: ${request.avoidFoods.map(f => f.name).join(', ')}

다음을 JSON 형식으로 제공해주세요:
{
  "recommendReasons": ["음식1 추천 이유 (20자 이내)", "음식2 추천 이유", "음식3 추천 이유"],
  "avoidReasons": ["음식1 피하는 이유 (20자 이내)", "음식2 피하는 이유", "음식3 피하는 이유"],
  "fortuneMessage": "오늘의 음식 운세 한마디 (30자 이내)"
}

재미있고 가볍게, 명리학적 근거를 살짝 넣어서 작성해주세요.`;

    log("Sending prompt to Grok...");

    try {
        const response = await client.chat.completions.create({
            model: 'grok-2-latest',
            messages: [
                { role: 'system', content: '당신은 음식과 운세를 재미있게 연결하는 전문가입니다. 항상 JSON 형식으로 응답합니다.' },
                { role: 'user', content: prompt },
            ],
            max_tokens: 400,
            temperature: 0.7,
        });

        log("Response received:");
        log(response.choices[0]?.message?.content);
    } catch (error) {
        log("API Error detailed:");
        if (error.response) {
             log(`Status: ${error.response.status}`);
             log(error.response.data);
        } else {
             log(error.message);
        }
    }
}

testFoodGen();
