-- =============================================
-- 사장님 리뷰 비서 - Supabase 테이블 스키마
-- Supabase 대시보드 → SQL Editor에서 실행
-- =============================================

-- reviews 테이블 생성
CREATE TABLE IF NOT EXISTS public.reviews (
  id            UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID         REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text          TEXT         NOT NULL,
  business_type TEXT         NOT NULL DEFAULT '기타',
  category      TEXT         NOT NULL CHECK (category IN ('긍정', '개선요청', '부정', '악성')),
  confidence    INTEGER      NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  reason        TEXT         NOT NULL,
  replies       JSONB        NOT NULL DEFAULT '[]',
  created_at    TIMESTAMPTZ  DEFAULT NOW() NOT NULL
);

-- Row Level Security 활성화
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 자신의 리뷰만 조회 가능
CREATE POLICY "Users can view own reviews"
  ON public.reviews FOR SELECT
  USING (auth.uid() = user_id);

-- 자신의 리뷰만 저장 가능
CREATE POLICY "Users can insert own reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 자신의 리뷰만 삭제 가능
CREATE POLICY "Users can delete own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- 인덱스 (쿼리 성능)
CREATE INDEX IF NOT EXISTS reviews_user_id_idx   ON public.reviews (user_id);
CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON public.reviews (created_at DESC);
