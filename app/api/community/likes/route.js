import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/profile";
import { postIdSchema } from "@/lib/validations/community";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

async function parsePostId(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return { error: "Invalid request body" };
  }
  const parsed = postIdSchema.safeParse(body);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid postId" };
  }
  return { postId: parsed.data.postId };
}

/** Notifies the post owner (if it isn't the actor) after a successful like. */
async function notifyOwner(supabase, postId, actorId) {
  const { data: post } = await supabase
    .from("community_posts")
    .select("user_id")
    .eq("id", postId)
    .maybeSingle();
  if (!post || post.user_id === actorId) return;
  await supabase.rpc("create_notification", {
    p_user_id: post.user_id,
    p_type: "like",
    p_title: "Someone liked your post",
    p_message: null,
    p_metadata: { post_id: postId },
  });
}

/** POST /api/community/likes — like a post (idempotent via unique index). */
export async function POST(request) {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) return unauthorized();

  const { postId, error } = await parsePostId(request);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const { error: insertError } = await supabase.from("likes").insert({
    user_id: user.id,
    post_id: postId,
  });

  if (insertError && insertError.code !== "23505") {
    console.error("[api/community/likes] POST error:", insertError.message);
    return NextResponse.json({ error: "Could not like the post" }, { status: 500 });
  }

  await notifyOwner(supabase, postId, user.id);
  return NextResponse.json({ ok: true });
}

/** DELETE /api/community/likes — unlike a post (own rows only via RLS + filter). */
export async function DELETE(request) {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) return unauthorized();

  const { postId, error } = await parsePostId(request);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const { error: deleteError } = await supabase
    .from("likes")
    .delete()
    .eq("user_id", user.id)
    .eq("post_id", postId);

  if (deleteError) {
    console.error("[api/community/likes] DELETE error:", deleteError.message);
    return NextResponse.json({ error: "Could not remove the like" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
