import ReviewInput from './components/ReviewInput';
import ReviewResult from './components/ReviewResult';
import { useAnalyze } from './hooks/useAnalyze';
import './App.css';

export default function App() {
  const { result, isLoading, error, analyze, reset } = useAnalyze();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-xl shadow-sm">
              🏪
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">사장님 리뷰 비서</h1>
              <p className="text-xs text-gray-400">AI 리뷰 분석 & 답변 생성</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-700 font-medium">Claude AI</span>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* 인트로 배너 (결과가 없을 때만 표시) */}
        {!result && !isLoading && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-2">네이버 / 구글 / 카카오 리뷰</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              리뷰를 붙여넣으면 AI가 감정을 분석하고<br />
              최적의 답변 3가지를 즉시 생성해드립니다
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['감정 분석', '답변 3가지 생성', '악성 리뷰 신고 가이드'].map((feature) => (
                <span key={feature} className="bg-white bg-opacity-20 text-white text-xs px-3 py-1 rounded-full">
                  ✓ {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 리뷰 입력 컴포넌트 */}
        <ReviewInput onAnalyze={analyze} isLoading={isLoading} />

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <div>
                <h3 className="text-sm font-semibold text-red-800 mb-1">분석 실패</h3>
                <p className="text-sm text-red-600">{error}</p>
                <button
                  onClick={reset}
                  className="mt-3 text-xs text-red-700 underline hover:no-underline"
                >
                  다시 시도
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 로딩 스켈레톤 */}
        {isLoading && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-8 bg-gray-200 rounded-full w-24 mb-3" />
              <div className="h-2 bg-gray-200 rounded w-full mb-4" />
              <div className="h-16 bg-gray-100 rounded-xl" />
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="h-24 bg-gray-100 rounded-xl" />
            </div>
          </div>
        )}

        {/* 분석 결과 */}
        {result && !isLoading && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-800">분석 결과</h2>
              <button
                onClick={reset}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                ← 새 리뷰 분석
              </button>
            </div>
            <ReviewResult result={result} />
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-xs text-gray-400">
          사장님 리뷰 비서 · Powered by Claude AI · 분석 결과는 참고용입니다
        </p>
      </footer>
    </div>
  );
}
