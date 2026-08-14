import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServerUser, ensureProfile } from "@/lib/profile";
import { profileUpdateSchema } from "@/lib/validations/profile";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

async function findProfileRow(supabase, userId) {
  const { data } = await supabase
    .from("profiles")
    .select("id, user_id, full_name, username, avatar_url, bio")
    .or(`user_id.eq.${userId},id.eq.${userId}`)
    .maybeSingle();
  return data ?? null;
}

/**
 * GET /api/profile
 * Returns the authenticated user's profile (creating it on first login) plus
 * their real unread notification count.
 */
export async function GET() {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) return unauthorized();

  const profile = await ensureProfile(supabase, user);

  let unreadCount = 0;
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);
  unreadCount = count ?? 0;

  return NextResponse.json({ profile, unreadCount });
}

/**
 * PATCH /api/profile
 * Updates the authenticated user's own profile. The user_id is always derived
 * from the session — never accepted from the request body.
 */
export async function PATCH(request) {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid profile data";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const updates = Object.fromEntries(
    Object.entries(parsed.data).filter(([, value]) => value !== undefined)
  );

  // If username is provided but empty, remove it so we don't fail or overwrite with empty
  if (updates.username === "") {
    delete updates.username;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  // Use ensureProfile instead of naive findProfileRow to guarantee the row exists with all defaults
  const existing = await ensureProfile(supabase, user);
  if (!existing) {
    return NextResponse.json({ error: "Could not ensure profile" }, { status: 500 });
  }

  const query = supabase.from("profiles").update(updates).eq("id", existing.id);

  const { data, error } = await query.select().maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "That username is already taken" },
        { status: 409 }
      );
    }
    console.error("[api/profile] update error:", {
      operation: "profile_update",
      status: 500,
      code: error.code,
      message: error.message,
    });
    return NextResponse.json(
      { error: "Could not update your profile. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ profile: data });
}
