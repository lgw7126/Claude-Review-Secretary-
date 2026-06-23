export async function analyzeReview(reviewText, businessType) {
  if (!reviewText || reviewText.trim().length < 5) {
    throw new Error('리뷰 내용을 입력해주세요 (최소 5자 이상)');
  }

  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviewText, businessType }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || '분석 중 오류가 발생했습니다.');
  }

  return data;
}
