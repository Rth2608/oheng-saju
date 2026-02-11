'use client';

interface OhengChartProps {
    balance: Record<string, number>;
}

const OHENG_INFO: Record<string, { name: string; hanja: string; color: string }> = {
    wood: { name: '목', hanja: '木', color: '#4CAF50' },
    fire: { name: '화', hanja: '火', color: '#F44336' },
    earth: { name: '토', hanja: '土', color: '#FFC107' },
    metal: { name: '금', hanja: '金', color: '#9E9E9E' },
    water: { name: '수', hanja: '水', color: '#2196F3' },
};

export default function OhengChart({ balance }: OhengChartProps) {
    const maxValue = Math.max(...Object.values(balance), 1);
    const total = Object.values(balance).reduce((a, b) => a + b, 0) || 1;

    return (
        <div className="oheng-chart">
            {Object.entries(OHENG_INFO).map(([key, info]) => {
                const value = balance[key] || 0;
                const percentage = Math.round((value / total) * 100);
                const height = Math.max((value / maxValue) * 100, 20);

                return (
                    <div key={key} className="oheng-bar">
                        <div
                            className="oheng-bar-fill"
                            style={{
                                height: `${height}px`,
                                background: `linear-gradient(to top, ${info.color}80, ${info.color})`,
                            }}
                        />
                        <span className="oheng-bar-label" style={{ color: info.color }}>
                            {info.hanja}
                        </span>
                        <span className="oheng-bar-value">{percentage}%</span>
                    </div>
                );
            })}
        </div>
    );
}
