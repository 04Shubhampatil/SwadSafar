import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/profile";
import { createCommunityPostSchema } from "@/lib/validations/community";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const AUTHOR_FIELDS = "full_name, username, avatar_url";
const RECIPE_FIELDS =
  "id, title, image, prep_time, cook_time, difficulty, servings, calories, ingredients";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

const FALLBACK_AUTHOR = {
  name: "Foodie",
  handle: "@foodie",
  avatar: DEFAULT_AVATAR,
  verified: false,
  level: 3,
  levelName: "Community Chef",
  followers: "—",
  timeAgo: null,
};

/** Compact, human-readable relative time for a post timestamp. */
function timeAgo(dateString) {
  if (!dateString) return null;
  const seconds = Math.round((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

/** Normalizes a raw community_posts row (with embeds) for the client. */
function toPostShape(post, likedSet) {
  const author = post.author;
  const recipe = post.recipe;
  const liked = likedSet.has(post.id);
  return {
    id: post.id,
    userId: post.user_id,
    content: post.content ?? "",
    category: post.category ?? "Dinner",
    tags: post.tags ?? [],
    poll: post.poll ?? null,
    images: post.images ?? [],
    createdAt: post.created_at,
    liked,
    likesCount: post.likes?.[0]?.count ?? 0,
    commentsCount: post.comments?.[0]?.count ?? 0,
    author: author
      ? {
          ...FALLBACK_AUTHOR,
          name: author.full_name || author.username || FALLBACK_AUTHOR.name,
          handle: author.username ? `@${author.username}` : FALLBACK_AUTHOR.handle,
          avatar: author.avatar_url ?? FALLBACK_AUTHOR.avatar,
          timeAgo: timeAgo(post.created_at),
        }
      : FALLBACK_AUTHOR,
    recipe: recipe
      ? {
          title: recipe.title,
          image: recipe.image,
          time: `${(recipe.prep_time ?? 0) + (recipe.cook_time ?? 0)} min`,
          difficulty: recipe.difficulty,
          servings: recipe.servings,
          calories: recipe.calories,
          ingredients: (recipe.ingredients ?? []).map((ing) =>
            typeof ing === "string" ? ing : ing?.name ?? ""
          ),
        }
      : null,
    recipeId: post.recipe_id,
  };
}

/**
 * GET /api/community/posts — the community feed.
 * Returns posts (newest first) with author, linked recipe, comment/like counts
 * and whether the current user liked each post. The feed is public; the auth
 * session (when present) only adds the per-user `liked` state.
 */
export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ posts: [] });
  const user = await getServerUser(supabase);

  const postSelect = `*, author:profiles(${AUTHOR_FIELDS}), recipe:recipes(${RECIPE_FIELDS}),
     comments:community_post_comments(count), likes:likes(count)`;

  const { data: posts, error } = await supabase
    .from("community_posts")
    .select(postSelect)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[api/community/posts] GET error:", error.message);
    return NextResponse.json({ error: "Could not load community posts" }, { status: 500 });
  }

  let likedSet = new Set();
  if (user) {
    const { data: myLikes } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", user.id)
      .not("post_id", "is", null);
    likedSet = new Set((myLikes ?? []).map((l) => l.post_id));
  }

  return NextResponse.json({ posts: (posts ?? []).map((p) => toPostShape(p, likedSet)) });
}

/**
 * POST /api/community/posts — create a post as the authenticated user.
 */
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

  const parsed = createCommunityPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid post" },
      { status: 400 }
    );
  }

  const hasContent = parsed.data.content.length > 0;
  const hasMedia = parsed.data.images.length > 0;
  const hasRecipe = Boolean(parsed.data.recipeId);
  const hasPoll = Boolean(parsed.data.poll);
  if (!hasContent && !hasMedia && !hasRecipe && !hasPoll) {
    return NextResponse.json({ error: "Add some content to your post" }, { status: 400 });
  }

  const { data: created, error: insertError } = await supabase
    .from("community_posts")
    .insert({
      user_id: user.id,
      content: parsed.data.content,
      category: parsed.data.category,
      tags: parsed.data.tags,
      images: parsed.data.images,
      poll: parsed.data.poll,
      recipe_id: parsed.data.recipeId ?? null,
    })
    .select(`*, author:profiles(${AUTHOR_FIELDS})`)
    .single();

  if (insertError) {
    console.error("[api/community/posts] POST error:", insertError.message);
    return NextResponse.json({ error: "Could not create your post" }, { status: 500 });
  }

  return NextResponse.json({
    post: toPostShape(created, new Set()),
  });
}
