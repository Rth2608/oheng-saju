'use client';

import { useState } from 'react';
import SajuForm, { SajuFormData } from '@/components/SajuForm';
import OhengChart from '@/components/OhengChart';
import FoodCard from '@/components/FoodCard';
import PizzaCard from '@/components/PizzaCard';
import ShareButton from '@/components/ShareButton';

interface SajuResult {
    saju: {
        year: { cheongan: string; jiji: string };
        month: { cheongan: string; jiji: string };
        day: { cheongan: string; jiji: string };
        hour?: { cheongan: string; jiji: string };
    };
    oheng: {
        balance: Record<string, number>;
        dominant: { name: string; hanja: string; color: string; type: string };
        weak: { name: string; hanja: string; color: string; type: string };
        balanceDescription: string;
    };
    interpretation: string;
    food: {
        recommended: Array<{ name: string; category: string; reason: string; aiReason: string }>;
        avoid: Array<{ name: string; reason: string; aiReason: string }>;
        fortuneMessage: string;
    };
    pizzaCard: {
        topping: string;
        emoji: string;
        description: string;
        pizzaName: string;
        vibe: string;
    };
}

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<SajuResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: SajuFormData) => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`/api/saju?t=${Date.now()}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                },
                body: JSON.stringify(formData),
                cache: 'no-store'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '분석 중 오류가 발생했습니다.');
            }

            setResult(data.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setError(null);
    };

    return (
        <main className="container">
            {/* 헤더 */}
            <header className="header">
                <h1 className="header-title">🔮 오행밥상</h1>
                <p className="header-subtitle">사주로 보는 오늘의 음식 운세</p>
            </header>

            {/* 면책 조항 */}
            <div className="disclaimer">
                ⚠️ 본 서비스는 재미 목적입니다. 의학적/영양학적 조언이 아닙니다.
            </div>

            {/* 로딩 상태 */}
            {isLoading && (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">사주를 분석하고 있습니다...</p>
                </div>
            )}

            {/* 에러 표시 */}
            {error && (
                <div className="card form-container" style={{ borderColor: '#f44336' }}>
                    <p style={{ color: '#f44336' }}>❌ {error}</p>
                    <button className="btn btn-secondary" onClick={handleReset}>
                        다시 시도하기
                    </button>
                </div>
            )}

            {/* 입력 폼 */}
            {!isLoading && !result && !error && (
                <div className="form-container">
                    <SajuForm onSubmit={handleSubmit} isLoading={isLoading} />
                </div>
            )}

            {/* 결과 표시 - 그리드 레이아웃 */}
            {result && (
                <div className="result-section">
                    {/* 상단 영역: 사주/오행/운세 - 3열 그리드 */}
                    <div className="result-grid">
                        {/* 사주 요약 */}
                        <div className="card">
                            <h2 className="card-title">🎴 당신의 사주</h2>
                            <div className="saju-pillars">
                                <div className="saju-pillar">
                                    <div className="saju-pillar-value">
                                        {result.saju.year.cheongan}{result.saju.year.jiji}
                                    </div>
                                    <div className="saju-pillar-label">년주</div>
                                </div>
                                <div className="saju-pillar">
                                    <div className="saju-pillar-value">
                                        {result.saju.month.cheongan}{result.saju.month.jiji}
                                    </div>
                                    <div className="saju-pillar-label">월주</div>
                                </div>
                                <div className="saju-pillar">
                                    <div className="saju-pillar-value">
                                        {result.saju.day.cheongan}{result.saju.day.jiji}
                                    </div>
                                    <div className="saju-pillar-label">일주</div>
                                </div>
                                {result.saju.hour && (
                                    <div className="saju-pillar">
                                        <div className="saju-pillar-value">
                                            {result.saju.hour.cheongan}{result.saju.hour.jiji}
                                        </div>
                                        <div className="saju-pillar-label">시주</div>
                                    </div>
                                )}
                            </div>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                                {result.interpretation}
                            </p>
                        </div>

                        {/* 오행 차트 */}
                        <div className="card">
                            <h2 className="card-title">⚖️ 오행 밸런스</h2>
                            <OhengChart balance={result.oheng.balance} />
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', marginTop: '12px' }}>
                                {result.oheng.balanceDescription}
                            </p>
                        </div>

                        {/* 피자 카드 */}
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <PizzaCard {...result.pizzaCard} />
                        </div>
                    </div>

                    {/* 오늘의 음식 운세 - 전체 너비 */}
                    <div className="result-full">
                        <div className="card">
                            <h2 className="card-title">🍀 오늘의 음식 운세 (UPDATED)</h2>
                            <p style={{
                                color: 'var(--text-primary)',
                                fontSize: '1.2rem',
                                textAlign: 'center',
                                padding: '16px',
                                background: 'rgba(102, 126, 234, 0.1)',
                                borderRadius: '12px',
                                fontWeight: 600
                            }}>
                                {result.food.fortuneMessage}
                            </p>
                        </div>
                    </div>

                    {/* 음식 추천 - 2열 그리드 */}
                    <div className="result-grid-2">
                        {/* 추천 음식 */}
                        <FoodCard type="recommend" foods={result.food.recommended} />

                        {/* 피할 음식 */}
                        <FoodCard type="avoid" foods={result.food.avoid} />
                    </div>

                    {/* 액션 버튼들 */}
                    <div className="result-actions">
                        <ShareButton
                            pizzaName={result.pizzaCard.pizzaName}
                            fortune={result.food.fortuneMessage}
                        />
                        <button className="btn btn-secondary" onClick={handleReset}>
                            🔄 다시 보기
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
