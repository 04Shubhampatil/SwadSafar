"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Fetches the authenticated user's profile + unread notification count from
 * GET /api/profile (which also creates the profile row on first login).
 * Re-fetches when the auth state (user id) changes or when refresh() is called.
 *
 * All state updates happen after an `await` (never synchronously in the effect
 * body) so React's compiler/lint rules stay happy while state always resets to
 * logged-out defaults when the user signs out.
 */
export function useProfileData(user) {
  const [profile, setProfile] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(Boolean(user));
  const [error, setError] = useState(null);

  const load = useCallback(async (isAuthed) => {
    if (!isAuthed) {
      setProfile(null);
      setUnreadCount(0);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profile", { cache: "no-store" });
      if (!res.ok) {
        setError("Could not load your profile");
        setProfile(null);
        setUnreadCount(0);
        return;
      }
      const data = await res.json();
      setProfile(data.profile ?? null);
      setUnreadCount(data.unreadCount ?? 0);
      setError(null);
    } catch {
      setError("Could not load your profile");
    } finally {
      setLoading(false);
    }
  }, []);

  const prevUserId = useRef(null);

  useEffect(() => {
    let cancelled = false;
    // Wait one microtask so setState never runs synchronously inside the effect.
    const run = async () => {
      await null;
      if (cancelled) return;
      // Guard against refetch loops when a new user object with the same id
      // is passed in on every render.
      if (prevUserId.current === (user?.id ?? null)) return;
      prevUserId.current = user?.id ?? null;
      await load(Boolean(user));
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [user, load]);

  const refresh = useCallback(() => load(Boolean(user)), [load, user]);

  return { profile, unreadCount, loading, error, refresh };
}
