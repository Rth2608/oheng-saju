import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: '오행밥상 - 사주로 보는 오늘의 음식',
    description: '사주(음양오행)와 오늘 운세를 기반으로 오늘의 음식을 추천해드립니다. 재미로 보는 음식 운세!',
    keywords: ['사주', '음식 추천', '오행', '운세', '오늘의 음식'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
