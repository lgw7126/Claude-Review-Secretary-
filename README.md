# 사장님 리뷰 비서

자영업자가 네이버 플레이스 / 구글맵 / 카카오맵 리뷰를 붙여넣으면
Claude AI가 **감정 분석 + 최적 답변 3가지 + 신고 가이드**를 자동 생성해주는 웹앱.

## 기술 스택

- **프론트엔드**: React (Vite) + TailwindCSS
- **AI**: Claude API (claude-sonnet-4-6)
- **배포**: Vercel

## 로컬 실행

```bash
cp .env.example .env
# .env 파일에 VITE_ANTHROPIC_API_KEY 입력
npm install
npm run dev
```

## 폴더 구조

```
src/
├── components/
│   ├── ReviewInput.jsx     # 리뷰 입력 UI (탭 + 업종 선택)
│   └── ReviewResult.jsx    # 분석 결과 표시
├── lib/
│   └── analyzeReview.js    # Claude API 연동
├── hooks/
│   └── useAnalyze.js       # 분석 상태 관리 훅
└── App.jsx
```

## 주요 기능

- 리뷰 텍스트 입력 (URL 붙여넣기 / 텍스트 직접 입력)
- 업종 선택 (식당 / 카페 / 뷰티 / 숙박 / 기타)
- 감정 분석: 긍정 / 부정 / 악성 분류 + 신뢰도
- 맞춤 답변 3가지 (공식적 / 친근한 / 간결한) + 1클릭 복사
- 악성 리뷰 신고 가이드 (플랫폼별 신고 방법)
