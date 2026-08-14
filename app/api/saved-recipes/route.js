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

/** GET /api/saved-recipes — the authenticated user's saved recipe ids. */
export async function GET() {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) return unauthorized();

  const { data, error } = await supabase
    .from("saved_recipes")
    .select("recipe_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[api/saved-recipes] GET error:", error.message);
    return NextResponse.json({ error: "Could not load saved recipes" }, { status: 500 });
  }

  return NextResponse.json({ ids: data.map((row) => row.recipe_id) });
}

/** POST /api/saved-recipes — save a recipe (idempotent via unique constraint). */
export async function POST(request) {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) return unauthorized();

  const { recipeId, error } = await parseRecipeId(request);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const { error: insertError } = await supabase.from("saved_recipes").insert({
    user_id: user.id,
    recipe_id: recipeId,
  });

  if (insertError && insertError.code !== "23505") {
    console.error("[api/saved-recipes] POST error:", insertError.message);
    return NextResponse.json({ error: "Could not save recipe" }, { status: 500 });
  }

  // Only notify when the save is new (23505 = already saved).
  if (!insertError) {
    await supabase.from("notifications").insert({
      user_id: user.id,
      type: "save",
      title: "Recipe saved for later",
      message: "A recipe was added to your saved recipes.",
      metadata: { recipe_id: recipeId },
    });
  }

  return NextResponse.json({ ok: true });
}

/** DELETE /api/saved-recipes — remove a saved recipe (own rows only). */
export async function DELETE(request) {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) return unauthorized();

  const { recipeId, error } = await parseRecipeId(request);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const { error: deleteError } = await supabase
    .from("saved_recipes")
    .delete()
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId);

  if (deleteError) {
    console.error("[api/saved-recipes] DELETE error:", deleteError.message);
    return NextResponse.json({ error: "Could not remove recipe" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
