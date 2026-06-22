import { useState } from 'react';

// 카테고리별 스타일 설정
const CATEGORY_STYLES = {
  긍정: {
    badge: 'bg-green-100 text-green-700 border border-green-200',
    icon: '😊',
    bar: 'bg-green-500',
    headerBg: 'bg-green-50 border-green-100',
  },
  부정: {
    badge: 'bg-orange-100 text-orange-700 border border-orange-200',
    icon: '😟',
    bar: 'bg-orange-500',
    headerBg: 'bg-orange-50 border-orange-100',
  },
  악성: {
    badge: 'bg-red-100 text-red-700 border border-red-200',
    icon: '🚨',
    bar: 'bg-red-500',
    headerBg: 'bg-red-50 border-red-100',
  },
};

// 답변 스타일별 아이콘
const REPLY_ICONS = {
  공식적: '🤝',
  친근한: '😊',
  간결한: '⚡',
};

// 클립보드 복사 버튼 컴포넌트
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API 미지원 시 fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
        copied
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          복사됨!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          복사
        </>
      )}
    </button>
  );
}

export default function ReviewResult({ result }) {
  const [activeReply, setActiveReply] = useState(0);

  if (!result) return null;

  const styles = CATEGORY_STYLES[result.category] || CATEGORY_STYLES['부정'];

  return (
    <div className="space-y-4">
      {/* 감정 분석 결과 카드 */}
      <div className={`bg-white rounded-2xl shadow-sm border p-6 ${styles.headerBg}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-700 mb-2">감정 분석 결과</h3>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${styles.badge}`}>
                {styles.icon} {result.category}
              </span>
              <span className="text-sm text-gray-500">신뢰도 {result.confidence}%</span>
            </div>
          </div>
        </div>

        {/* 신뢰도 바 */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${styles.bar}`}
              style={{ width: `${result.confidence}%` }}
            />
          </div>
        </div>

        {/* 분석 이유 */}
        <div className="bg-white bg-opacity-70 rounded-xl p-4">
          <p className="text-sm text-gray-600 leading-relaxed">{result.reason}</p>
        </div>
      </div>

      {/* 추천 답변 카드 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          💬 추천 답변 <span className="text-sm font-normal text-gray-400">(3가지 스타일)</span>
        </h3>

        {/* 스타일 탭 */}
        <div className="flex gap-2 mb-4">
          {result.replies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => setActiveReply(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeReply === idx
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {REPLY_ICONS[reply.style] || '📝'} {reply.style}
            </button>
          ))}
        </div>

        {/* 답변 내용 */}
        {result.replies.map((reply, idx) => (
          <div
            key={idx}
            className={`transition-all duration-200 ${activeReply === idx ? 'block' : 'hidden'}`}
          >
            <div className="relative bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed pr-2">{reply.content}</p>
              <div className="mt-3 flex justify-end">
                <CopyButton text={reply.content} />
              </div>
            </div>
          </div>
        ))}

        {/* 모든 답변 보기 (접기/펼치기) */}
        <div className="mt-4 space-y-3">
          {result.replies.map((reply, idx) => (
            idx !== activeReply && (
              <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100 opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">
                    {REPLY_ICONS[reply.style]} {reply.style}
                  </span>
                  <CopyButton text={reply.content} />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{reply.content}</p>
              </div>
            )
          ))}
        </div>
      </div>

      {/* 악성 리뷰 신고 가이드 (악성인 경우에만 표시) */}
      {result.category === '악성' && result.report_guide && (
        <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🚨</span>
            <h3 className="text-base font-semibold text-red-800">악성 리뷰 신고 가이드</h3>
            {result.report_guide.is_reportable && (
              <span className="ml-auto bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full border border-red-200">
                신고 가능
              </span>
            )}
          </div>

          {/* 신고 가능 여부 */}
          <div className="bg-white bg-opacity-70 rounded-xl p-4 mb-4">
            <p className="text-sm text-red-700 leading-relaxed">{result.report_guide.reason}</p>
          </div>

          {/* 신고 단계 */}
          {result.report_guide.steps && result.report_guide.steps.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-red-800 mb-3">📋 신고 절차</h4>
              <ol className="space-y-2">
                {result.report_guide.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-red-700">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-200 text-red-800 rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* 플랫폼별 신고 방법 */}
          {result.report_guide.platforms && (
            <div>
              <h4 className="text-sm font-semibold text-red-800 mb-3">🗺️ 플랫폼별 신고 방법</h4>
              <div className="space-y-2">
                {Object.entries(result.report_guide.platforms).map(([platform, guide]) => {
                  const platformNames = { naver: '네이버 플레이스', google: '구글맵', kakao: '카카오맵' };
                  const platformIcons = { naver: '🟢', google: '🔵', kakao: '🟡' };
                  return (
                    <div key={platform} className="bg-white bg-opacity-70 rounded-lg p-3 border border-red-100">
                      <span className="text-xs font-semibold text-red-800">
                        {platformIcons[platform]} {platformNames[platform] || platform}
                      </span>
                      <p className="text-xs text-red-600 mt-1 leading-relaxed">{guide}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
