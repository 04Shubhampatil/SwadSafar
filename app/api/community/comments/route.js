import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/profile";
import { createCommentSchema, postIdSchema } from "@/lib/validations/community";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const AUTHOR_FIELDS = "full_name, username, avatar_url";

function toCommentShape(comment) {
  const author = comment.author;
  return {
    id: comment.id,
    postId: comment.post_id,
    text: comment.content,
    createdAt: comment.created_at,
    author: author
      ? {
          name: author.full_name || author.username || "Foodie",
          avatar: author.avatar_url ?? null,
        }
      : null,
  };
}
/** GET /api/community/comments?postId=... — the comments for one post. */
export async function GET(request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ comments: [] });

  const searchParams = request.nextUrl.searchParams;
  const parsed = postIdSchema.safeParse({ postId: searchParams.get("postId") });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid postId" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("community_post_comments")
    .select(`*, author:profiles(${AUTHOR_FIELDS})`)
    .eq("post_id", parsed.data.postId)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    console.error("[api/community/comments] GET error:", error.message);
    return NextResponse.json({ error: "Could not load comments" }, { status: 500 });
  }

  return NextResponse.json({ comments: (data ?? []).map(toCommentShape) });
}

/** POST /api/community/comments — add a comment to a post. */
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

  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid comment" },
      { status: 400 }
    );
  }

  const { data: created, error: insertError } = await supabase
    .from("community_post_comments")
    .insert({
      post_id: parsed.data.postId,
      user_id: user.id,
      content: parsed.data.content,
    })
    .select(`*, author:profiles(${AUTHOR_FIELDS})`)
    .single();

  if (insertError) {
    console.error("[api/community/comments] POST error:", insertError.message);
    return NextResponse.json({ error: "Could not add your comment" }, { status: 500 });
  }

  // Notify the post owner (unless they commented on their own post).
  const { data: post } = await supabase
    .from("community_posts")
    .select("user_id")
    .eq("id", parsed.data.postId)
    .maybeSingle();
  if (post && post.user_id !== user.id) {
    await supabase.rpc("create_notification", {
      p_user_id: post.user_id,
      p_type: "comment",
      p_title: "New comment on your post",
      p_message: parsed.data.content.slice(0, 100),
      p_metadata: { post_id: parsed.data.postId },
    });
  }

  return NextResponse.json({ comment: toCommentShape(created) });
}
