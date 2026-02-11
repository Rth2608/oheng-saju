'use client';

interface PizzaCardProps {
    topping: string;
    emoji: string;
    description: string;
    pizzaName: string;
    vibe: string;
}

export default function PizzaCard({ topping, emoji, description, pizzaName, vibe }: PizzaCardProps) {
    return (
        <div className="pizza-card">
            <div className="pizza-emoji">{emoji}🍕</div>
            <h3 className="pizza-name">{pizzaName}</h3>
            <div className="pizza-topping">토핑: {topping}</div>
            <p className="pizza-description">{description}</p>
            <p className="pizza-description" style={{ marginTop: '8px', fontSize: '0.85rem' }}>
                오늘의 바이브: {vibe}
            </p>
        </div>
    );
}
