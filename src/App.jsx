import { useState } from 'react';
import ReviewInput from './components/ReviewInput';
import ReviewResult from './components/ReviewResult';
import Auth from './components/Auth';
import ReviewHistory from './components/ReviewHistory';
import BusinessProfile from './components/BusinessProfile';
import { useAnalyze } from './hooks/useAnalyze';
import { useAuth } from './hooks/useAuth';
import { useBusinessProfile } from './hooks/useBusinessProfile';
import './App.css';

export default function App() {
  const { user, authLoading, signInWithKakao, signOut, hasSupabase } = useAuth();
  const { businessName, saveBusinessName } = useBusinessProfile();
  const [historyKey, setHistoryKey] = useState(0);
  const [activeTab, setActiveTab] = useState('analyze');

  const { result, isLoading, error, analyze, reset } = useAnalyze(user, () => {
    setHistoryKey((k) => k + 1);
  });

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
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-700 font-medium">Claude AI</span>
            </div>
            {hasSupabase && !authLoading && (
              <Auth user={user} onSignIn={signInWithKakao} onSignOut={signOut} />
            )}
          </div>
        </div>

        {/* 탭 네비게이션 (Supabase + 로그인 시) */}
        {hasSupabase && user && (
          <div className="max-w-2xl mx-auto px-4 pb-0 flex border-t border-gray-100">
            <button
              onClick={() => setActiveTab('analyze')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'analyze'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              🔍 분석하기
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              📋 히스토리
            </button>
          </div>
        )}
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* 히스토리 탭 */}
        {hasSupabase && user && activeTab === 'history' && (
          <ReviewHistory user={user} refreshKey={historyKey} />
        )}

        {/* 분석 탭 */}
        {activeTab === 'analyze' && (
          <>
            {/* 인트로 배너 (결과 없을 때만) */}
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

            {/* 가게 설정 */}
            <BusinessProfile businessName={businessName} onSave={saveBusinessName} />

            {/* 리뷰 입력 */}
            <ReviewInput onAnalyze={analyze} isLoading={isLoading} />

            {/* 에러 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">⚠️</span>
                  <div>
                    <h3 className="text-sm font-semibold text-red-800 mb-1">분석 실패</h3>
                    <p className="text-sm text-red-600">{error}</p>
                    <button onClick={reset} className="mt-3 text-xs text-red-700 underline hover:no-underline">
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
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-gray-800">분석 결과</h2>
                    {user && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                        ✓ 저장됨
                      </span>
                    )}
                  </div>
                  <button
                    onClick={reset}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    ← 새 리뷰 분석
                  </button>
                </div>
                <ReviewResult result={result} businessName={businessName} />
              </div>
            )}

            {/* 비로그인 사용자에게 로그인 안내 (Supabase 설정된 경우만) */}
            {hasSupabase && !user && !authLoading && !isLoading && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💾</span>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-yellow-800 mb-1">히스토리 저장 기능</h3>
                    <p className="text-sm text-yellow-700 mb-3">
                      카카오로 로그인하면 분석한 리뷰가 자동으로 저장되어 언제든지 다시 확인할 수 있어요.
                    </p>
                    <button
                      onClick={signInWithKakao}
                      className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.75 1.742 5.16 4.368 6.6L5.4 21l4.752-2.88C10.7 18.37 11.345 18.4 12 18.4c5.523 0 10-3.477 10-7.6S17.523 3 12 3z" />
                      </svg>
                      카카오로 로그인
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
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
