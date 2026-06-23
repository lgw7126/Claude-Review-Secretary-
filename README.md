# 🏪 사장님 리뷰 비서

> **AI가 리뷰를 분석하고 최적의 답변을 대신 써드립니다**

### 🚀 [앱 바로 실행하기 → claude-review-secretary-ipv7.vercel.app](https://claude-review-secretary-ipv7.vercel.app)

---

## 기획 의도

자영업자에게 온라인 리뷰 관리는 선택이 아닌 필수입니다. 하지만 리뷰 하나하나에 적절한 답변을 다는 일은 시간이 많이 걸리고, 특히 부정적인 리뷰나 악성 리뷰에는 어떻게 대응해야 할지 막막한 경우가 많습니다.

**사장님 리뷰 비서**는 이 문제를 해결합니다.

- 리뷰를 붙여넣기만 하면 Claude AI가 즉시 감정을 분석합니다
- 긍정/개선요청/부정/악성 4단계로 분류하고 각 상황에 맞는 답변 전략을 적용합니다
- 정중한 / 친근한 / 간결한 3가지 스타일의 답변을 동시에 제안합니다
- 악성 리뷰는 신고 가이드까지 제공합니다
- 상호명을 한 번 설정해두면 모든 답변 끝에 자동으로 삽입됩니다

바쁜 사장님들이 리뷰 답변에 쏟는 시간과 스트레스를 줄이는 것이 이 앱의 목표입니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **감정 분석 4단계** | 긍정 😊 / 개선요청 💡 / 부정 😟 / 악성 🚨 |
| **AI 답변 자동 생성** | 카테고리별 전략 + 3가지 스타일 |
| **1클릭 복사** | 답변 복사 후 바로 리뷰 플랫폼에 붙여넣기 |
| **상호명 자동 입력** | 설정 1회 → 모든 답변에 "— 상호명 드림" 자동 추가 |
| **악성 리뷰 신고 가이드** | 네이버 / 구글 / 카카오 플랫폼별 신고 방법 안내 |
| **업종별 맞춤 톤** | 식당 / 카페 / 뷰티 / 숙박 / 기타 |

---

## 사용 방법

### 1단계 — 상호명 설정 (최초 1회)

앱 상단 **내 가게 설정** 칸에 가게 이름을 입력하고 저장합니다.
이후 모든 답변 끝에 `— 가게이름 드림`이 자동으로 붙습니다.

### 2단계 — 리뷰 입력

리뷰 플랫폼(네이버 플레이스 / 구글맵 / 카카오맵)에서 **리뷰 텍스트를 복사**한 뒤 앱에 붙여넣습니다.

> ⚠️ URL이 아닌 **리뷰 텍스트**를 복사해서 붙여넣어야 합니다

### 3단계 — 업종 선택

식당 / 카페 / 뷰티 / 숙박 / 기타 중 해당 업종을 선택합니다.
업종에 맞는 톤으로 답변이 생성됩니다.

### 4단계 — 분석하기

**🔍 분석하기** 버튼을 누르면 AI가 즉시 분석합니다.

### 5단계 — 답변 복사

마음에 드는 스타일의 답변 옆 **복사 버튼**을 누르면 상호명이 포함된 전체 답변이 클립보드에 복사됩니다. 리뷰 플랫폼에 바로 붙여넣기 하세요.

---

## 감정 분류 기준

| 카테고리 | 기준 | 답변 전략 |
|----------|------|-----------|
| 😊 긍정 | ★4~5, 칭찬·재방문 의사 | 진심 어린 감사 + 재방문 유도 |
| 💡 개선요청 | ★3, 부분적 아쉬움 | 경청 인정 + 구체적 개선 약속 |
| 😟 부정 | ★1~2, 명확한 불만 | 진심 사과 + 개선 약속 + 직접 연락 유도 |
| 🚨 악성 | 허위·욕설·협박·비방 | 사실 기반 해명 + 신고 병행 권고 |

---

## 기술 스택

- **프론트엔드**: React 19 (Vite) + TailwindCSS 4
- **AI**: Claude API (`claude-sonnet-4-6`) — Vercel 서버리스 함수로 안전하게 호출
- **배포**: Vercel (GitHub 연동 자동 배포)
- **인증/저장** *(선택)*: Supabase Auth (카카오 로그인) + Supabase DB (히스토리)

---

## 로컬 개발 환경 설정

```bash
# 1. 저장소 클론
git clone https://github.com/lgw7126/Claude-Review-Secretary-.git
cd Claude-Review-Secretary-

# 2. 패키지 설치
npm install

# 3. 환경변수 설정
cp .env.example .env
# .env 파일에 ANTHROPIC_API_KEY 입력

# 4. 개발 서버 실행 (Vercel CLI 필요)
npx vercel dev
```

---

## 폴더 구조

```
Claude-Review-Secretary-/
├── api/
│   └── analyze.js              # Vercel 서버리스 함수 (Claude API 호출)
├── src/
│   ├── components/
│   │   ├── Auth.jsx            # 카카오 로그인 버튼
│   │   ├── BusinessProfile.jsx # 상호명 설정 UI
│   │   ├── ReviewInput.jsx     # 리뷰 입력 (탭 + 업종 선택)
│   │   ├── ReviewResult.jsx    # 분석 결과 + 답변 카드
│   │   └── ReviewHistory.jsx   # 히스토리 목록
│   ├── hooks/
│   │   ├── useAnalyze.js       # 분석 상태 관리
│   │   ├── useAuth.js          # 인증 상태 관리
│   │   └── useBusinessProfile.js # 상호명 로컬스토리지 관리
│   ├── lib/
│   │   ├── analyzeReview.js    # /api/analyze 호출
│   │   ├── supabase.js         # Supabase 클라이언트
│   │   └── saveReview.js       # 리뷰 히스토리 DB 저장
│   └── App.jsx
├── supabase/
│   └── schema.sql              # DB 테이블 스키마
├── vercel.json
└── .env.example
```

---

## Vercel 배포 방법

1. [vercel.com](https://vercel.com) → GitHub 저장소 Import
2. Environment Variables에 `ANTHROPIC_API_KEY` 추가
3. Deploy — 이후 `main` 브랜치 push 시 자동 재배포
