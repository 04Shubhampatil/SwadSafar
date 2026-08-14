"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Lightweight client-side hook that subscribes to Supabase auth state.
 * Returns { user, loading } — use this instead of calling getUser() in every component.
 *
 * Usage:
 *   const { user, loading } = useAuth();
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [supabase] = useState(() => createClient());
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;

    // Get the initial session synchronously from the cache, then verify server-side
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      setLoading(false);
    });

    // Subscribe to future auth changes (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [supabase]);

  return { user, loading };
}
