import { OhengType, SajuResult } from './calculator';
import ohengFoodMapping from '@/data/oheng-food-mapping.json';
import toppingMetaphors from '@/data/topping-metaphors.json';

export interface OhengInfo {
    name: string;
    hanja: string;
    color: string;
    taste: string;
    organ: string;
    season: string;
    direction: string;
    characteristics: string[];
}

export interface FoodRecommendation {
    name: string;
    category?: string;
    reason: string;
}

export interface OhengAnalysis {
    dominant: OhengInfo & { type: OhengType };
    weak: OhengInfo & { type: OhengType };
    balance: Record<OhengType, number>;
    recommendedFoods: FoodRecommendation[];
    avoidFoods: FoodRecommendation[];
    todayTopping: {
        topping: string;
        emoji: string;
        description: string;
        pizzaName: string;
        vibe: string;
    };
}

// 오행 정보 가져오기
export function getOhengInfo(oheng: OhengType): OhengInfo {
    const mapping = ohengFoodMapping[oheng];
    return {
        name: mapping.name,
        hanja: mapping.hanja,
        color: mapping.color,
        taste: mapping.taste,
        organ: mapping.organ,
        season: mapping.season,
        direction: mapping.direction,
        characteristics: mapping.characteristics,
    };
}

// 오늘의 보충 오행 결정 (약한 오행 + 날짜 기반)
export function getTodayBoostOheng(sajuResult: SajuResult): OhengType {
    const today = new Date();
    const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );

    // 약한 오행을 기본으로 하되, 날짜에 따라 약간의 변화
    const ohengList: OhengType[] = ['wood', 'fire', 'earth', 'metal', 'water'];
    const sortedByBalance = Object.entries(sajuResult.ohengBalance)
        .sort((a, b) => a[1] - b[1])
        .map(([oheng]) => oheng as OhengType);

    // 가장 약한 2개 중에서 날짜 기반 선택
    const weakTwo = sortedByBalance.slice(0, 2);
    return weakTwo[dayOfYear % 2];
}

// 음식 추천 분석
export function analyzeOhengForFood(sajuResult: SajuResult): OhengAnalysis {
    const boostOheng = getTodayBoostOheng(sajuResult);
    const boostMapping = ohengFoodMapping[boostOheng];
    const dominantMapping = ohengFoodMapping[sajuResult.dominantOheng];

    // 추천 음식: 보충해야 할 오행의 음식
    const recommendedFoods = boostMapping.foods.slice(0, 3);

    // 피해야 할 음식: 가장 강한 오행을 더 강화시키는 음식
    const avoidFoods = dominantMapping.avoidFoods.slice(0, 3);

    // 오늘의 토핑
    const todayTopping = toppingMetaphors.metaphors[boostOheng];

    return {
        dominant: {
            ...getOhengInfo(sajuResult.dominantOheng),
            type: sajuResult.dominantOheng,
        },
        weak: {
            ...getOhengInfo(sajuResult.weakOheng),
            type: sajuResult.weakOheng,
        },
        balance: sajuResult.ohengBalance,
        recommendedFoods,
        avoidFoods,
        todayTopping,
    };
}

// 오행 균형 설명 생성
export function getBalanceDescription(balance: Record<OhengType, number>): string {
    const total = Object.values(balance).reduce((a, b) => a + b, 0);
    const percentages = Object.entries(balance).map(([oheng, count]) => ({
        oheng: oheng as OhengType,
        percentage: Math.round((count / total) * 100),
        info: getOhengInfo(oheng as OhengType),
    }));

    percentages.sort((a, b) => b.percentage - a.percentage);

    const strongest = percentages[0];
    const weakest = percentages[percentages.length - 1];

    return `당신의 사주는 ${strongest.info.hanja}(${strongest.info.name}) 기운이 ${strongest.percentage}%로 가장 강하고, ` +
        `${weakest.info.hanja}(${weakest.info.name}) 기운이 ${weakest.percentage}%로 보충이 필요합니다.`;
}
