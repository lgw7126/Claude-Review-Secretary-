---
title: 사장님 리뷰 비서 — 세션 요약
pdf_options:
  format: A4
  margin:
    top: 20mm
    bottom: 20mm
    left: 18mm
    right: 18mm
---

# 사장님 리뷰 비서
## 개발 세션 요약 (2026-06-22)

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 앱 이름 | 사장님 리뷰 비서 |
| 목적 | 자영업자가 네이버/구글/카카오 리뷰를 AI로 분석, 최적 답변 자동 생성 |
| 기술 스택 | React (Vite) + TailwindCSS + Claude API (claude-sonnet-4-6) |
| 향후 추가 | Supabase (인증 + DB) + Vercel (배포) |
| 개발 브랜치 | `claude/boss-review-secretary-app-w2mkwc` |
| 저장소 | `lgw7126/Claude-Review-Secretary-` |

---

## 2. 완성된 파일 구조

```
Claude-Review-Secretary-/
├── src/
│   ├── components/
│   │   ├── ReviewInput.jsx      ← 리뷰 입력 UI
│   │   └── ReviewResult.jsx     ← 분석 결과 표시
│   ├── lib/
│   │   └── analyzeReview.js     ← Claude API 연동
│   ├── hooks/
│   │   └── useAnalyze.js        ← 상태 관리 훅
│   ├── App.jsx                  ← 전체 연결
│   ├── main.jsx
│   └── index.css
├── .env.example                 ← API 키 템플릿
├── .gitignore
├── package.json
└── vite.config.js
```

---

## 3. 구현된 기능 (F-01 ~ F-04)

### F-01 리뷰 입력
- 탭 2개: URL 붙여넣기 / 텍스트 직접 입력
- 업종 선택: 식당 / 카페 / 뷰티 / 숙박 / 기타

### F-02 AI 감정 분석 (4단계)
| 카테고리 | 기준 | 색상 |
|---------|------|------|
| 긍정 | ★4~5, 칭찬·재방문 의사 | 초록 😊 |
| 개선요청 | ★3, 부분적 아쉬움 | 노랑 💡 |
| 부정 | ★1~2, 명확한 불만 | 주황 😟 |
| 악성 | 허위·욕설·협박·비방 | 빨강 🚨 |

- 신뢰도 표시: **"악성 가능성 87%"** 형식

### F-03 답변 자동 생성 (카테고리별 전략)
| 카테고리 | 답변 전략 |
|---------|---------|
| 긍정 | 진심 어린 감사 + 재방문 유도 |
| 개선요청 | 경청 인정 + 구체적 개선 약속 |
| 부정 | 진심 사과 + 개선 약속 + 직접 연락 유도 |
| 악성 | 사실 기반 차분한 해명 + 신고 병행 권고 |

- 스타일 3가지: 정중한 / 친근한 / 간결한
- 1클릭 복사 버튼

### F-04 악성 리뷰 신고 가이드
- 신고 사유 자동 판단
- 신고 단계별 절차 안내
- 플랫폼별 신고 방법 (네이버 / 구글 / 카카오)

---

## 4. Claude API 응답 JSON 구조

```json
{
  "category": "긍정 | 개선요청 | 부정 | 악성",
  "confidence": 87,
  "reason": "판단 근거 2~3문장",
  "replies": [
    { "style": "정중한", "content": "답변 내용 (150자)" },
    { "style": "친근한", "content": "답변 내용 (150자)" },
    { "style": "간결한", "content": "답변 내용 (80자)" }
  ],
  "report_guide": {
    "is_reportable": true,
    "reason": "신고 가능 근거",
    "steps": ["단계1", "단계2", "단계3"],
    "platforms": {
      "naver": "네이버 신고 방법",
      "google": "구글 신고 방법",
      "kakao": "카카오 신고 방법"
    }
  }
}
```

---

## 5. 로컬 실행 방법

```bash
# 1. 환경변수 설정
cp .env.example .env
# .env 파일에 입력:
# VITE_ANTHROPIC_API_KEY=sk-ant-...

# 2. 설치 및 실행
npm install
npm run dev
```

> **주의:** 현재는 브라우저에서 Claude API를 직접 호출합니다.  
> 프로덕션 배포 시 Supabase Edge Functions 또는 Vercel API Route로 프록시 처리 권장.

---

## 6. 커밋 이력

| 커밋 | 내용 |
|------|------|
| `6d5dfd5` | feat: 사장님 리뷰 비서 앱 초기 구현 |
| `5eb8bad` | docs: README 프로젝트 설명으로 업데이트 |
| `9863983` | fix: PRD 기준으로 감정 분류 및 답변 전략 보정 |

---

## 7. 다음 세션에서 할 일 (우선순위 순)

### 🔴 Must Have (다음 세션)
1. **Supabase 프로젝트 연동**
   - `npm install @supabase/supabase-js`
   - `.env`에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 추가

2. **카카오 로그인 (Supabase Auth)**
   - Supabase 대시보드 → Auth → Providers → Kakao 활성화

3. **리뷰 히스토리 저장 (F-05)**
   - Supabase DB 테이블: `reviews (id, user_id, text, category, confidence, replies, created_at)`
   - 처리 완료 후 자동 저장

### 🟡 Should Have (이후 세션)
4. **주간 리뷰 리포트 (F-06)** — 반복 불만 키워드 추출
5. **업종 프리셋 설정 (F-07)** — 업종별 톤앤매너 커스텀
6. **Vercel 배포** — GitHub 연동 자동 배포

### 🟢 Nice to Have
7. **다중 매장 관리 (F-08)**
8. **팀원 공유 (F-09)**

---

## 8. 다음 세션 시작 프롬프트 (복사용)

```
나는 '사장님 리뷰 비서' 웹앱을 개발 중이야.
저장소: lgw7126/Claude-Review-Secretary-
브랜치: claude/boss-review-secretary-app-w2mkwc
기술 스택: React(Vite) + TailwindCSS + Claude API + Supabase

현재까지 완성된 것:
- F-01~F-04 (리뷰 입력, 감정분석 4단계, 답변 3가지, 신고가이드)

이번 세션에서 할 것:
1. Supabase 연동 세팅
2. 카카오 로그인 구현
3. 리뷰 히스토리 저장 (F-05)

Supabase URL과 ANON KEY는 내가 .env에 직접 입력할게.
순서대로 진행해줘.
```

---

*Generated: 2026-06-22*
