'use client';

interface FoodCardProps {
    type: 'recommend' | 'avoid';
    foods: Array<{
        name: string;
        category?: string;
        reason?: string;
        aiReason?: string;
    }>;
}

export default function FoodCard({ type, foods }: FoodCardProps) {
    const isRecommend = type === 'recommend';

    return (
        <div className="card">
            <h2 className="card-title">
                {isRecommend ? '✨ 오늘 추천 음식' : '⚠️ 오늘 피할 음식'}
            </h2>

            {foods.map((food, index) => (
                <div
                    key={index}
                    className="food-card"
                    style={{
                        borderLeft: `3px solid ${isRecommend ? '#4CAF50' : '#F44336'}`,
                    }}
                >
                    <div className="food-name">
                        {isRecommend ? '👍' : '👎'} {food.name}
                    </div>
                    {food.category && <div className="food-category">{food.category}</div>}
                    <div className="food-reason">
                        {food.aiReason || food.reason}
                    </div>
                </div>
            ))}
        </div>
    );
}
