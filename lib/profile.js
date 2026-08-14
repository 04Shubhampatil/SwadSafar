import { createClient } from "@/lib/supabase/server";

/**
 * Returns the authenticated Supabase user for the current request, or null.
 */
export async function getServerUser(supabase) {
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

export function metadataName(user) {
  const meta = user?.user_metadata ?? {};
  return meta.full_name || meta.name || "";
}

export function metadataUsername(user) {
  const meta = user?.user_metadata ?? {};
  return meta.username || meta.user_name || "";
}

export function metadataAvatar(user) {
  const meta = user?.user_metadata ?? {};
  return meta.avatar_url || meta.picture || "";
}

function fallbackUsername(user) {
  const emailName = (user?.email ?? "user").split("@")[0];
  const cleaned = emailName.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 20);
  return cleaned || "user";
}

/**
 * Ensures a row exists in `profiles` for the given auth user, creating it
 * from Google / sign-up metadata when missing. Idempotent — safe to call on
 * every request. Google avatars are only stored as the DEFAULT; a custom
 * avatar uploaded later is never overwritten because we never update
 * avatar_url when a row already exists.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {import('@supabase/supabase-js').User} user
 */
export async function ensureProfile(supabase, user) {
  if (!supabase || !user) return null;

  const { data: existing } = await supabase
    .from("profiles")
    .select("id, user_id, full_name, username, avatar_url, bio")
    .or(`user_id.eq.${user.id},id.eq.${user.id}`)
    .maybeSingle();

  if (existing) return existing;

  const fullName = metadataName(user) || null;
  const avatarUrl = metadataAvatar(user) || null;
  const username = metadataUsername(user) || fallbackUsername(user);

  const { data: created, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      user_id: user.id,
      full_name: fullName,
      username,
      avatar_url: avatarUrl,
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error("[profile] ensureProfile insert error:", error.message);
    return null;
  }

  return created;
}

/**
 * Fetches the authenticated user's profile (creating it if missing) together
 * with their unread notification count. Returns { user, profile, unreadCount }.
 */
export async function getProfilePayload() {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) return { user: null, profile: null, unreadCount: 0 };

  const [profile, unread] = await Promise.all([
    ensureProfile(supabase, user),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false),
  ]);

  return { user, profile, unreadCount: unread.count ?? 0 };
}
