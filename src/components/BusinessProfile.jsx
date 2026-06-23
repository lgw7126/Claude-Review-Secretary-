import { useState } from 'react';

export default function BusinessProfile({ businessName, onSave }) {
  const [input, setInput] = useState(businessName);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    onSave(input);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSave();
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🏪</span>
        <h3 className="text-sm font-semibold text-gray-700">내 가게 설정</h3>
        {businessName && (
          <span className="ml-auto text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
            ✓ 설정됨
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="상호명 입력 (예: 맛있는 김밥집)"
          className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={30}
        />
        <button
          onClick={handleSave}
          className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {saved ? '✓ 저장!' : '저장'}
        </button>
      </div>

      <p className="mt-2 text-xs text-gray-400">
        {businessName
          ? `답변 마지막에 "— ${businessName} 드림" 이 자동으로 추가됩니다`
          : '저장하면 생성된 답변 끝에 상호명이 자동으로 붙습니다'}
      </p>
    </div>
  );
}
