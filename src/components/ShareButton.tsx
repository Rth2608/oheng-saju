'use client';

interface ShareButtonProps {
    pizzaName: string;
    fortune: string;
}

export default function ShareButton({ pizzaName, fortune }: ShareButtonProps) {
    const handleShare = async () => {
        const shareText = `🔮 오늘의 음식 운세\n\n🍕 ${pizzaName}\n\n${fortune}\n\n#오행밥상 #오늘뭐먹지 #음식운세`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: '오행밥상 - 오늘의 음식 운세',
                    text: shareText,
                    url: window.location.href,
                });
            } catch (err) {
                // 사용자가 공유 취소한 경우
                console.log('공유 취소됨');
            }
        } else {
            // Web Share API 미지원 시 클립보드 복사
            try {
                await navigator.clipboard.writeText(shareText);
                alert('클립보드에 복사되었습니다! 친구에게 공유해보세요 🎉');
            } catch (err) {
                console.error('복사 실패:', err);
            }
        }
    };

    return (
        <button className="share-btn" onClick={handleShare}>
            📤 친구에게 공유하기
        </button>
    );
}
