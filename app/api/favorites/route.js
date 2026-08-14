import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/profile";
import { recipeIdSchema } from "@/lib/validations/profile";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

async function parseRecipeId(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return { error: "Invalid request body" };
  }
  const parsed = recipeIdSchema.safeParse(body);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid recipeId" };
  }
  return { recipeId: parsed.data.recipeId };
}

/** GET /api/favorites — the authenticated user's favorite recipe ids. */
export async function GET() {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) return unauthorized();

  const { data, error } = await supabase
    .from("favorites")
    .select("recipe_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[api/favorites] GET error:", error.message);
    return NextResponse.json({ error: "Could not load favorites" }, { status: 500 });
  }

  return NextResponse.json({ ids: data.map((row) => row.recipe_id) });
}

/** POST /api/favorites — favorite a recipe (idempotent via unique constraint). */
export async function POST(request) {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) return unauthorized();

  const { recipeId, error } = await parseRecipeId(request);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const { error: insertError } = await supabase.from("favorites").insert({
    user_id: user.id,
    recipe_id: recipeId,
  });

  if (insertError && insertError.code !== "23505") {
    console.error("[api/favorites] POST error:", insertError.message);
    return NextResponse.json({ error: "Could not save favorite" }, { status: 500 });
  }

  // Only notify when the favorite is new (23505 = already favorited).
  if (!insertError) {
    await supabase.from("notifications").insert({
      user_id: user.id,
      type: "favorite",
      title: "Added to favorites",
      message: "A recipe was added to your favorites.",
      metadata: { recipe_id: recipeId },
    });
  }

  return NextResponse.json({ ok: true });
}

/** DELETE /api/favorites — remove a favorite (own rows only via RLS + filter). */
export async function DELETE(request) {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) return unauthorized();

  const { recipeId, error } = await parseRecipeId(request);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const { error: deleteError } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId);

  if (deleteError) {
    console.error("[api/favorites] DELETE error:", deleteError.message);
    return NextResponse.json({ error: "Could not remove favorite" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
