// 천간 (10개)
export const CHEONGAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;
export const CHEONGAN_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;

// 지지 (12개)
export const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;
export const JIJI_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

// 12시진 매핑
export const SIJI = [
    { name: '자시', hanja: '子時', start: 23, end: 1 },
    { name: '축시', hanja: '丑時', start: 1, end: 3 },
    { name: '인시', hanja: '寅時', start: 3, end: 5 },
    { name: '묘시', hanja: '卯時', start: 5, end: 7 },
    { name: '진시', hanja: '辰時', start: 7, end: 9 },
    { name: '사시', hanja: '巳時', start: 9, end: 11 },
    { name: '오시', hanja: '午時', start: 11, end: 13 },
    { name: '미시', hanja: '未時', start: 13, end: 15 },
    { name: '신시', hanja: '申時', start: 15, end: 17 },
    { name: '유시', hanja: '酉時', start: 17, end: 19 },
    { name: '술시', hanja: '戌時', start: 19, end: 21 },
    { name: '해시', hanja: '亥時', start: 21, end: 23 },
] as const;

// 천간 -> 오행 매핑
export const CHEONGAN_OHENG: Record<string, 'wood' | 'fire' | 'earth' | 'metal' | 'water'> = {
    '갑': 'wood', '을': 'wood',
    '병': 'fire', '정': 'fire',
    '무': 'earth', '기': 'earth',
    '경': 'metal', '신': 'metal',
    '임': 'water', '계': 'water',
};

// 지지 -> 오행 매핑
export const JIJI_OHENG: Record<string, 'wood' | 'fire' | 'earth' | 'metal' | 'water'> = {
    '자': 'water', '축': 'earth',
    '인': 'wood', '묘': 'wood',
    '진': 'earth', '사': 'fire',
    '오': 'fire', '미': 'earth',
    '신': 'metal', '유': 'metal',
    '술': 'earth', '해': 'water',
};

// 오행 타입
export type OhengType = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

// 사주 결과 타입
export interface SajuResult {
    year: { cheongan: string; jiji: string; oheng: OhengType[] };
    month: { cheongan: string; jiji: string; oheng: OhengType[] };
    day: { cheongan: string; jiji: string; oheng: OhengType[] };
    hour?: { cheongan: string; jiji: string; oheng: OhengType[] };
    ohengBalance: Record<OhengType, number>;
    dominantOheng: OhengType;
    weakOheng: OhengType;
}

// 양력 -> 음력 변환을 위한 간단한 계산 (실제로는 더 복잡한 알고리즘 필요)
// 여기서는 기본 간지 계산만 수행
export function calculateGanji(year: number, month: number, day: number): { cheongan: string; jiji: string } {
    // 년간지 계산 (1984년 갑자년 기준)
    const baseYear = 1984;
    const yearDiff = year - baseYear;
    const yearCheonganIndex = ((yearDiff % 10) + 10) % 10;
    const yearJijiIndex = ((yearDiff % 12) + 12) % 12;

    return {
        cheongan: CHEONGAN[yearCheonganIndex],
        jiji: JIJI[yearJijiIndex],
    };
}

// 월간지 계산
export function calculateMonthGanji(yearCheongan: string, month: number): { cheongan: string; jiji: string } {
    // 년간에 따른 월간 시작점
    const yearCheonganIndex = CHEONGAN.indexOf(yearCheongan as typeof CHEONGAN[number]);
    const monthCheonganStart = (yearCheonganIndex % 5) * 2;
    const monthCheonganIndex = (monthCheonganStart + month - 1) % 10;

    // 월지는 인월(1월)부터 시작
    const monthJijiIndex = (month + 1) % 12;

    return {
        cheongan: CHEONGAN[monthCheonganIndex],
        jiji: JIJI[monthJijiIndex],
    };
}

// 일간지 계산 (간소화 버전)
export function calculateDayGanji(year: number, month: number, day: number): { cheongan: string; jiji: string } {
    // 기준일: 1900년 1월 1일 = 갑진일
    const baseDate = new Date(1900, 0, 1);
    const targetDate = new Date(year, month - 1, day);
    const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));

    // 1900년 1월 1일은 갑자일이 아니라 갑진일 (진=4)
    const baseDayCheongan = 0; // 갑
    const baseDayJiji = 4; // 진

    const dayCheonganIndex = ((baseDayCheongan + diffDays) % 10 + 10) % 10;
    const dayJijiIndex = ((baseDayJiji + diffDays) % 12 + 12) % 12;

    return {
        cheongan: CHEONGAN[dayCheonganIndex],
        jiji: JIJI[dayJijiIndex],
    };
}

// 시간 간지 계산
export function calculateHourGanji(dayCheongan: string, hour: number): { cheongan: string; jiji: string } {
    // 시지 결정
    let hourJijiIndex: number;
    if (hour >= 23 || hour < 1) hourJijiIndex = 0; // 자시
    else hourJijiIndex = Math.floor((hour + 1) / 2);

    // 일간에 따른 시간 시작점
    const dayCheonganIndex = CHEONGAN.indexOf(dayCheongan as typeof CHEONGAN[number]);
    const hourCheonganStart = (dayCheonganIndex % 5) * 2;
    const hourCheonganIndex = (hourCheonganStart + hourJijiIndex) % 10;

    return {
        cheongan: CHEONGAN[hourCheonganIndex],
        jiji: JIJI[hourJijiIndex],
    };
}

// 오행 균형 계산
export function calculateOhengBalance(pillars: { cheongan: string; jiji: string }[]): Record<OhengType, number> {
    const balance: Record<OhengType, number> = {
        wood: 0,
        fire: 0,
        earth: 0,
        metal: 0,
        water: 0,
    };

    for (const pillar of pillars) {
        const cheonganOheng = CHEONGAN_OHENG[pillar.cheongan];
        const jijiOheng = JIJI_OHENG[pillar.jiji];

        if (cheonganOheng) balance[cheonganOheng]++;
        if (jijiOheng) balance[jijiOheng]++;
    }

    return balance;
}

// 메인 사주 계산 함수
export function calculateSaju(
    year: number,
    month: number,
    day: number,
    hour?: number,
    isLunar: boolean = false
): SajuResult {
    // TODO: 음력 변환이 필요한 경우 처리
    // 현재는 양력 기준으로만 계산

    const yearGanji = calculateGanji(year, month, day);
    const monthGanji = calculateMonthGanji(yearGanji.cheongan, month);
    const dayGanji = calculateDayGanji(year, month, day);

    const pillars = [
        { ...yearGanji, oheng: [CHEONGAN_OHENG[yearGanji.cheongan], JIJI_OHENG[yearGanji.jiji]] as OhengType[] },
        { ...monthGanji, oheng: [CHEONGAN_OHENG[monthGanji.cheongan], JIJI_OHENG[monthGanji.jiji]] as OhengType[] },
        { ...dayGanji, oheng: [CHEONGAN_OHENG[dayGanji.cheongan], JIJI_OHENG[dayGanji.jiji]] as OhengType[] },
    ];

    let hourPillar: SajuResult['hour'] = undefined;
    if (hour !== undefined) {
        const hourGanji = calculateHourGanji(dayGanji.cheongan, hour);
        hourPillar = {
            ...hourGanji,
            oheng: [CHEONGAN_OHENG[hourGanji.cheongan], JIJI_OHENG[hourGanji.jiji]] as OhengType[],
        };
        pillars.push(hourPillar);
    }

    const ohengBalance = calculateOhengBalance(pillars);

    // 가장 강한/약한 오행 찾기
    const sortedOheng = Object.entries(ohengBalance).sort((a, b) => b[1] - a[1]);
    const dominantOheng = sortedOheng[0][0] as OhengType;
    const weakOheng = sortedOheng[sortedOheng.length - 1][0] as OhengType;

    return {
        year: pillars[0],
        month: pillars[1],
        day: pillars[2],
        hour: hourPillar,
        ohengBalance,
        dominantOheng,
        weakOheng,
    };
}
