import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/profile";
import { notificationIdSchema } from "@/lib/validations/profile";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** POST /api/notifications/read — mark a single notification as read. */
export async function POST(request) {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = notificationIdSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid notification" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) {
    console.error("[api/notifications/read] error:", error.message);
    return NextResponse.json({ error: "Could not update notification" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
