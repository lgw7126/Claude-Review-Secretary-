import { useState, useEffect } from 'react';
import { supabase, hasSupabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(hasSupabase);

  useEffect(() => {
    if (!hasSupabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signInWithKakao() {
    if (!hasSupabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: window.location.origin },
    });
  }

  async function signOut() {
    if (!hasSupabase) return;
    await supabase.auth.signOut();
  }

  return { user, authLoading, signInWithKakao, signOut, hasSupabase };
}
