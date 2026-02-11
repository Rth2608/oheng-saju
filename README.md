# 오행밥상 (OhengBapsang)

> 🔮 사주(음양오행) + 오늘 운세를 기반으로 오늘의 음식을 추천해드리는 AI 에이전트 플랫폼

## 🚀 빠른 시작

### 사전 요구사항
- Docker & Docker Compose
- Grok API 키 ([발급 링크](https://console.x.ai/))

### 1. 환경 변수 설정

`.env.local` 파일에서 Grok API 키만 수정하세요:

```bash
GROK_API_KEY=your_actual_grok_api_key_here
```

### 2. Docker로 실행

```bash
# 프로덕션 모드
docker-compose up --build

# 개발 모드 (핫 리로드)
docker-compose --profile dev up oheng-bapsang-dev --build
```

### 3. 접속
- 프로덕션: http://localhost:3000
- 개발: http://localhost:3001

---

## 📁 프로젝트 구조

```
├── docker-compose.yml     # Docker Compose 설정
├── Dockerfile             # 프로덕션 Docker 이미지
├── Dockerfile.dev         # 개발용 Docker 이미지
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React 컴포넌트
│   ├── lib/              # 유틸리티 및 API 클라이언트
│   └── data/             # 정적 데이터 (오행-음식 매핑)
```

## 🛠️ 기술 스택

- **Frontend/Backend**: Next.js 14 (TypeScript)
- **LLM**: Grok API
- **음식 데이터**: TheMealDB API (무료)
- **컨테이너**: Docker

## ⚠️ 주의사항

본 서비스는 **재미 목적**입니다. 의학적/영양학적 조언이 아닙니다.
