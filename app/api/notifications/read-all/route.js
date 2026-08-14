import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/profile";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** POST /api/notifications/read-all — mark all of the user's notifications read. */
export async function POST() {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) return unauthorized();

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  if (error) {
    console.error("[api/notifications/read-all] error:", error.message);
    return NextResponse.json({ error: "Could not update notifications" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
