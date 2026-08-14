import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/profile";
import { saveRecipeSchema } from "@/lib/validations/recipe";
import { recipePayloadToRow, recipeRowToPayload } from "@/lib/recipe-store";
import { generateRecipeStats } from "@/lib/recipe-stats";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/**
 * POST /api/recipes/publish
 *
 * Publishes a recipe the authenticated user owns:
 *   1. Authenticate (user_id is always derived from the session).
 *   2. Validate the recipe payload.
 *   3. Verify ownership when a recipeId is supplied.
 *   4. Save the recipe with status = "published".
 *   5. Create a linked community post.
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

  const parsed = saveRecipeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid recipe" },
      { status: 400 }
    );
  }

  const { recipe, recipeId } = parsed.data;
  const row = recipePayloadToRow(recipe);

  let recipeRow;
  if (recipeId) {
    const { data: existing } = await supabase
      .from("recipes")
      .select("id")
      .eq("id", recipeId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const { data: updated, error: updateError } = await supabase
      .from("recipes")
      .update({ ...row, status: "published" })
      .eq("id", recipeId)
      .eq("user_id", user.id)
      .select()
      .maybeSingle();

    if (updateError) {
      console.error("[api/recipes/publish] update error:", updateError.message);
      return NextResponse.json({ error: "Could not publish recipe" }, { status: 500 });
    }
    recipeRow = updated;
  } else {
    const { rating } = generateRecipeStats();
    const { data: created, error: insertError } = await supabase
      .from("recipes")
      .insert({ ...row, user_id: user.id, status: "published", rating })
      .select()
      .maybeSingle();

    if (insertError) {
      console.error("[api/recipes/publish] insert error:", insertError.message);
      return NextResponse.json({ error: "Could not publish recipe" }, { status: 500 });
    }
    recipeRow = created;
  }

  // Create/link the community post for the feed.
  const { data: post, error: postError } = await supabase
    .from("community_posts")
    .insert({
      user_id: user.id,
      recipe_id: recipeRow.id,
      content: recipeRow.title,
      image: recipeRow.image ?? null,
      images: recipeRow.image ? [recipeRow.image] : [],
    })
    .select()
    .single();

  if (postError) {
    console.error("[api/recipes/publish] post error:", postError.message);
    return NextResponse.json(
      { error: "Recipe published but the community post could not be created" },
      { status: 500 }
    );
  }

  // Notify the author that the recipe is live (after all writes succeeded).
  await supabase.from("notifications").insert({
    user_id: user.id,
    type: "recipe",
    title: "Recipe published",
    message: `"${recipeRow.title}" is now live in the community feed.`,
    metadata: { recipe_id: recipeRow.id },
  });

  return NextResponse.json({ recipe: recipeRowToPayload(recipeRow), post });
}
