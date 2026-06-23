import { useState, useEffect, useCallback } from 'react';
import { fetchReviews, deleteReview } from '../lib/saveReview';

const CATEGORY_STYLES = {
  긍정: { badge: 'bg-green-100 text-green-700', icon: '😊' },
  개선요청: { badge: 'bg-yellow-100 text-yellow-700', icon: '💡' },
  부정: { badge: 'bg-orange-100 text-orange-700', icon: '😟' },
  악성: { badge: 'bg-red-100 text-red-700', icon: '🚨' },
};

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function ReviewHistory({ user, refreshKey }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReviews(user.id);
      setReviews(data);
    } catch {
      setError('히스토리를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert('삭제 실패. 다시 시도해주세요.');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-sm text-red-500">
        {error}
        <button onClick={load} className="ml-2 underline">재시도</button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-sm text-gray-400">저장된 리뷰 분석이 없습니다</p>
        <p className="text-xs text-gray-300 mt-1">리뷰를 분석하면 자동으로 저장됩니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400 text-right">총 {reviews.length}개</p>
      {reviews.map((r) => {
        const style = CATEGORY_STYLES[r.category] || CATEGORY_STYLES['부정'];
        return (
          <div
            key={r.id}
            className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
                    {style.icon} {r.category}
                  </span>
                  <span className="text-xs text-gray-400">{r.confidence}%</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{r.business_type}</span>
                  <span className="text-xs text-gray-300 ml-auto">{formatDate(r.created_at)}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {r.text}
                </p>
              </div>
              <button
                onClick={() => handleDelete(r.id)}
                disabled={deletingId === r.id}
                className="flex-shrink-0 text-gray-300 hover:text-red-400 transition-colors p-1"
                title="삭제"
              >
                {deletingId === r.id ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
