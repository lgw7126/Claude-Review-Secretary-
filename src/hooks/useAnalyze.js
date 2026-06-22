import { useState } from 'react';
import { analyzeReview } from '../lib/analyzeReview';

export function useAnalyze() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function analyze(reviewText, businessType) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeReview(reviewText, businessType);
      setResult(data);
    } catch (err) {
      if (err.message?.includes('API key')) {
        setError('API 키가 설정되지 않았습니다. .env 파일에 VITE_ANTHROPIC_API_KEY를 설정해주세요.');
      } else if (err.message?.includes('rate_limit')) {
        setError('요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError(err.message || '분석 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
  }

  return { result, isLoading, error, analyze, reset };
}
