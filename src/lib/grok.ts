import OpenAI from 'openai';

// Grok API 클라이언트 (OpenAI 호환)
const grokClient = new OpenAI({
    apiKey: process.env.GROK_API_KEY || '',
    baseURL: process.env.GROK_API_BASE_URL || 'https://api.x.ai/v1',
});

export interface SajuInterpretationRequest {
    year: { cheongan: string; jiji: string };
    month: { cheongan: string; jiji: string };
    day: { cheongan: string; jiji: string };
    hour?: { cheongan: string; jiji: string };
    gender: 'male' | 'female';
    dominantOheng: string;
    weakOheng: string;
    ohengBalance: Record<string, number>;
}

export interface FoodRecommendationRequest {
    dominantOheng: string;
    weakOheng: string;
    recommendedFoods: { name: string; category?: string }[];
    avoidFoods: { name: string }[];
    todayDate: string;
}

// 사주 해석 생성
export async function generateSajuInterpretation(request: SajuInterpretationRequest): Promise<string> {
    const genderText = request.gender === 'male' ? '남성' : '여성';

    const prompt = `당신은 한국 전통 명리학 전문가입니다. 다음 사주 정보를 바탕으로 재미있고 긍정적인 해석을 제공해주세요.

사주 정보:
- 년주: ${request.year.cheongan}${request.year.jiji}
- 월주: ${request.month.cheongan}${request.month.jiji}
- 일주: ${request.day.cheongan}${request.day.jiji}
${request.hour ? `- 시주: ${request.hour.cheongan}${request.hour.jiji}` : '- 시주: 미상'}
- 성별: ${genderText}
- 가장 강한 오행: ${request.dominantOheng}
- 보충 필요 오행: ${request.weakOheng}

다음 형식으로 2-3문장의 짧고 재미있는 해석을 제공해주세요:
1. 성격적 특성 (긍정적으로)
2. 오늘의 컨디션 한마디

주의: 너무 딱딱하거나 점술적이지 않게, 친근하고 재미있는 톤으로 작성해주세요.`;

    try {
        const response = await grokClient.chat.completions.create({
            model: 'grok-2-latest',
            messages: [
                { role: 'system', content: '당신은 친근하고 재미있는 한국 전통 명리학 전문가입니다. 모든 해석은 긍정적이고 재미있게 전달합니다.' },
                { role: 'user', content: prompt },
            ],
            max_tokens: 300,
            temperature: 0.8,
        });

        return response.choices[0]?.message?.content || '오늘의 기운이 좋습니다!';
    } catch (error) {
        console.error('Grok API 오류 상세:', error);
        if (error instanceof Error) {
            console.error('Message:', error.message);
            console.error('Stack:', error.stack);
        }
        return '오늘도 좋은 기운이 함께합니다! 🌟 (AI 연결 문제로 기본 메시지가 제공되었습니다)';
    }
}

// 음식 추천 이유 생성
export async function generateFoodReasons(request: FoodRecommendationRequest): Promise<{
    recommendReasons: string[];
    avoidReasons: string[];
    fortuneMessage: string;
}> {
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

    try {
        const response = await grokClient.chat.completions.create({
            model: 'grok-2-latest',
            messages: [
                { role: 'system', content: '당신은 음식과 운세를 재미있게 연결하는 전문가입니다. 항상 JSON 형식으로 응답합니다.' },
                { role: 'user', content: prompt },
            ],
            max_tokens: 400,
            temperature: 0.7,
        });

        const content = response.choices[0]?.message?.content || '';

        try {
            return parseJsonSafe(content);
        } catch (parseError) {
            console.error('JSON 파싱 오류:', parseError);
            console.error('Raw Content:', content);
            return {
                recommendReasons: ['Standard Recommendation 1', 'Standard Recommendation 2', 'Standard Recommendation 3'],
                avoidReasons: ['Standard Avoid 1', 'Standard Avoid 2', 'Standard Avoid 3'],
                fortuneMessage: `Parsing Error: ${content.substring(0, 50)}...`, // 디버깅용
            };
        }
    } catch (error) {
        console.error('Grok API 음식 추천 오류 상세:', error);
        return {
            recommendReasons: ['Fallback Recommend 1', 'Fallback Recommend 2', 'Fallback Recommend 3'],
            avoidReasons: ['Fallback Avoid 1', 'Fallback Avoid 2', 'Fallback Avoid 3'],
            fortuneMessage: `Grok API connection failed. Error: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
}

function parseJsonSafe(content: string): any {
    try {
        // 1. 순수 JSON 파싱 시도
        return JSON.parse(content);
    } catch {
        // 2. Markdown 코드 블록 제거 후 파싱 시도
        const cleanContent = content.replace(/```json\s*|\s*```/g, '').trim();
        try {
            return JSON.parse(cleanContent);
        } catch {
            // 3. 중괄호로 감싸진 부분만 추출하여 파싱 시도
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('JSON Parsing Failed');
        }
    }
}

// 피자 토핑 카드 메시지 생성
export async function generatePizzaCardMessage(
    oheng: string,
    toppingName: string,
    pizzaName: string
): Promise<string> {
    const prompt = `오행 "${oheng}"의 기운을 담은 "${pizzaName}"을 설명하는 재미있는 한 줄 메시지를 만들어주세요.
토핑: ${toppingName}
20-30자 이내로 SNS에 공유하기 좋은 메시지로 작성해주세요.`;

    try {
        const response = await grokClient.chat.completions.create({
            model: 'grok-2-latest',
            messages: [
                { role: 'system', content: '짧고 재미있는 메시지를 만드는 전문가입니다.' },
                { role: 'user', content: prompt },
            ],
            max_tokens: 100,
            temperature: 0.9,
        });

        return response.choices[0]?.message?.content || `오늘의 ${pizzaName}으로 기운 충전! 🍕`;
    } catch (error) {
        console.error('Grok API 오류:', error);
        return `오늘의 ${pizzaName}으로 기운 충전! 🍕`;
    }
}
