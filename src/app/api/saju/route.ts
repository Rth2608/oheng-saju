import { NextRequest, NextResponse } from 'next/server';
import { calculateSaju } from '@/lib/saju/calculator';
import { analyzeOhengForFood, getBalanceDescription } from '@/lib/saju/oheng';
import { generateSajuInterpretation, generateFoodReasons } from '@/lib/grok';

export async function POST(request: NextRequest) {
    console.log(`[API] Saju Request Received at ${new Date().toISOString()}`);
    try {
        const body = await request.json();
        const { year, month, day, hour, isLunar, gender } = body;

        // 입력 검증
        if (!year || !month || !day || !gender) {
            return NextResponse.json(
                { error: '필수 입력값이 누락되었습니다.' },
                { status: 400 }
            );
        }

        // 시간을 숫자로 변환 (시진 인덱스 -> 시간)
        let hourValue: number | undefined;
        if (hour !== undefined && hour !== -1) {
            // 시진 인덱스를 시간으로 변환 (0=자시=0시, 1=축시=2시, ...)
            const sijiToHour = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
            hourValue = sijiToHour[hour] || undefined;
        }

        // 사주 계산
        const sajuResult = calculateSaju(
            parseInt(year),
            parseInt(month),
            parseInt(day),
            hourValue,
            isLunar === true
        );

        // 오행 분석
        const ohengAnalysis = analyzeOhengForFood(sajuResult);
        const balanceDescription = getBalanceDescription(sajuResult.ohengBalance);

        // Grok API로 해석 생성
        const interpretation = await generateSajuInterpretation({
            year: sajuResult.year,
            month: sajuResult.month,
            day: sajuResult.day,
            hour: sajuResult.hour,
            gender: gender as 'male' | 'female',
            dominantOheng: ohengAnalysis.dominant.name,
            weakOheng: ohengAnalysis.weak.name,
            ohengBalance: sajuResult.ohengBalance,
        });

        // 음식 추천 이유 생성
        const today = new Date();
        const todayStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

        const foodReasons = await generateFoodReasons({
            dominantOheng: ohengAnalysis.dominant.name,
            weakOheng: ohengAnalysis.weak.name,
            recommendedFoods: ohengAnalysis.recommendedFoods,
            avoidFoods: ohengAnalysis.avoidFoods,
            todayDate: todayStr,
        });

        return NextResponse.json({
            success: true,
            data: {
                saju: {
                    year: sajuResult.year,
                    month: sajuResult.month,
                    day: sajuResult.day,
                    hour: sajuResult.hour,
                },
                oheng: {
                    balance: sajuResult.ohengBalance,
                    dominant: ohengAnalysis.dominant,
                    weak: ohengAnalysis.weak,
                    balanceDescription,
                },
                interpretation,
                food: {
                    recommended: ohengAnalysis.recommendedFoods.map((f, i) => ({
                        ...f,
                        aiReason: foodReasons.recommendReasons[i] || f.reason,
                    })),
                    avoid: ohengAnalysis.avoidFoods.map((f, i) => ({
                        ...f,
                        aiReason: foodReasons.avoidReasons[i] || f.reason,
                    })),
                    fortuneMessage: foodReasons.fortuneMessage,
                },
                pizzaCard: ohengAnalysis.todayTopping,
            },
        });
    } catch (error) {
        console.error('사주 분석 오류:', error);
        return NextResponse.json(
            { error: '사주 분석 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
