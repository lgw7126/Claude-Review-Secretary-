import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  // 브라우저에서 직접 호출하기 위한 설정 (프로덕션에서는 백엔드 프록시 권장)
  dangerouslyAllowBrowser: true,
});

// 업종별 답변 톤 가이드
const businessToneGuide = {
  식당: '정중하고 따뜻한 음식점 사장 톤. 음식과 서비스에 대한 진심 어린 사과 또는 감사.',
  카페: '친근하고 캐주얼한 카페 주인 톤. 분위기와 음료 품질에 집중.',
  뷰티: '전문적이고 세심한 미용 전문가 톤. 기술적 설명과 고객 만족 강조.',
  숙박: '격식 있고 서비스 지향적인 숙박업 톤. 편안함과 안전을 강조.',
  기타: '정중하고 전문적인 사업자 톤. 고객 중심적 접근.',
};

// Claude에게 보낼 시스템 프롬프트
const SYSTEM_PROMPT = `당신은 자영업자의 온라인 리뷰 관리를 도와주는 전문 AI 비서입니다.
리뷰를 분석하고 사업주가 바로 사용할 수 있는 최적의 답변을 생성합니다.

분석 기준:
- 긍정: 만족, 칭찬, 재방문 의사가 담긴 리뷰
- 부정: 불만, 개선 요청이 담긴 진성 리뷰
- 악성: 허위 사실, 경쟁사 공격, 욕설, 반복 민원, 협박성 내용이 담긴 리뷰

출력은 반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요.

{
  "category": "긍정" | "부정" | "악성",
  "confidence": 0~100 사이 숫자 (분석 신뢰도),
  "reason": "카테고리 판단 이유를 2~3문장으로",
  "replies": [
    {
      "style": "공식적",
      "content": "답변 내용 (150자 내외)"
    },
    {
      "style": "친근한",
      "content": "답변 내용 (150자 내외)"
    },
    {
      "style": "간결한",
      "content": "답변 내용 (80자 내외)"
    }
  ],
  "report_guide": {
    "is_reportable": true | false,
    "reason": "신고 가능 여부 판단 근거",
    "steps": ["신고 단계 1", "신고 단계 2", "신고 단계 3"],
    "platforms": {
      "naver": "네이버 신고 방법",
      "google": "구글 신고 방법",
      "kakao": "카카오 신고 방법"
    }
  }
}`;

/**
 * 리뷰 텍스트를 Claude API로 분석
 * @param {string} reviewText - 분석할 리뷰 텍스트
 * @param {string} businessType - 업종 (식당/카페/뷰티/숙박/기타)
 * @returns {Promise<Object>} 분석 결과 JSON
 */
export async function analyzeReview(reviewText, businessType) {
  if (!reviewText || reviewText.trim().length < 5) {
    throw new Error('리뷰 내용을 입력해주세요 (최소 5자 이상)');
  }

  const toneGuide = businessToneGuide[businessType] || businessToneGuide['기타'];

  const userMessage = `업종: ${businessType}
답변 톤 가이드: ${toneGuide}

분석할 리뷰:
"${reviewText.trim()}"

위 리뷰를 분석하고 지정된 JSON 형식으로만 응답해주세요.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: userMessage,
      },
    ],
  });

  const rawText = response.content[0].text.trim();

  // JSON 파싱 (마크다운 코드블록 제거)
  const jsonText = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  let result;
  result = JSON.parse(jsonText);

  // 필수 필드 검증
  if (!result.category || !result.replies || !Array.isArray(result.replies)) {
    throw new Error('AI 응답 형식이 올바르지 않습니다. 다시 시도해주세요.');
  }

  return result;
}
