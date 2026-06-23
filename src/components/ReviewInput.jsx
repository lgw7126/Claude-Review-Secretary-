import { useState } from 'react';

// 지원 업종 목록
const BUSINESS_TYPES = ['식당', '카페', '뷰티', '숙박', '기타'];

// 탭 유형
const TAB_URL = 'url';
const TAB_TEXT = 'text';

export default function ReviewInput({ onAnalyze, isLoading }) {
  const [activeTab, setActiveTab] = useState(TAB_TEXT);
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [businessType, setBusinessType] = useState('식당');

  function handleSubmit(e) {
    e.preventDefault();

    const reviewText = activeTab === TAB_URL ? urlInput.trim() : textInput.trim();

    if (!reviewText) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    onAnalyze(reviewText, businessType);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* 헤더 */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">리뷰 입력</h2>
        <p className="text-sm text-gray-500">분석할 리뷰를 붙여넣거나 직접 입력하세요</p>
      </div>

      {/* 탭 */}
      <div className="flex border border-gray-200 rounded-xl p-1 mb-5 bg-gray-50">
        <button
          type="button"
          onClick={() => setActiveTab(TAB_URL)}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === TAB_URL
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🔗 URL 붙여넣기
        </button>
        <button
          type="button"
          onClick={() => setActiveTab(TAB_TEXT)}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === TAB_TEXT
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          ✏️ 텍스트 직접 입력
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 입력 영역 */}
        {activeTab === TAB_URL ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">리뷰 URL</label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="네이버 플레이스 / 구글맵 / 카카오맵 리뷰 URL 또는 텍스트를 붙여넣으세요"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <p className="mt-2 text-xs text-gray-400">
              💡 URL을 붙여넣거나, 리뷰 텍스트를 직접 이 칸에 입력해도 됩니다
            </p>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">리뷰 텍스트</label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="리뷰 내용을 여기에 붙여넣거나 직접 입력하세요..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-400 text-right">
              {textInput.length}자
            </p>
          </div>
        )}

        {/* 업종 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">업종 선택</label>
          <div className="flex flex-wrap gap-2">
            {BUSINESS_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setBusinessType(type)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  businessType === type
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 분석 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 ${
            isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-md hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              AI 분석 중...
            </span>
          ) : (
            '🔍 분석하기'
          )}
        </button>
      </form>
    </div>
  );
}
