import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/profile";
import { notificationIdSchema } from "@/lib/validations/profile";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** GET /api/notifications — the authenticated user's notifications. */
export async function GET() {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) return unauthorized();

  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, message, read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[api/notifications] GET error:", error.message);
    return NextResponse.json({ error: "Could not load notifications" }, { status: 500 });
  }

  const unreadCount = (data ?? []).filter((n) => !n.read).length;
  return NextResponse.json({ notifications: data ?? [], unreadCount });
}
