import { supabase } from './supabase';

export async function saveReview({ userId, text, businessType, category, confidence, reason, replies }) {
  const { error } = await supabase.from('reviews').insert({
    user_id: userId,
    text,
    business_type: businessType,
    category,
    confidence,
    reason,
    replies,
  });

  if (error) throw error;
}

export async function fetchReviews(userId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) throw error;
  return data;
}

export async function deleteReview(reviewId) {
  const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
  if (error) throw error;
}
