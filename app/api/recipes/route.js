import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/profile";
import { recipeIdSchema } from "@/lib/validations/profile";
import { saveRecipeSchema } from "@/lib/validations/recipe";
import { recipePayloadToRow, recipeRowToPayload } from "@/lib/recipe-store";
import { generateRecipeStats } from "@/lib/recipe-stats";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** POST /api/recipes — save a recipe draft (status = "draft"). */
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

  // If a recipeId was supplied, it must belong to this user — we never trust
  // an id from the browser for ownership. user_id always comes from the session.
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
      .update({ ...row, status: "draft" })
      .eq("id", recipeId)
      .eq("user_id", user.id)
      .select()
      .maybeSingle();

    if (updateError) {
      console.error("[api/recipes] POST update error:", updateError.message);
      return NextResponse.json({ error: "Could not save draft" }, { status: 500 });
    }

    return NextResponse.json({ recipe: recipeRowToPayload(updated) });
  }

  const { rating } = generateRecipeStats();
  const { data: created, error: insertError } = await supabase
    .from("recipes")
    .insert({ ...row, user_id: user.id, status: "draft", rating })
    .select()
    .maybeSingle();

  if (insertError) {
    console.error("[api/recipes] POST insert error:", insertError.message);
    return NextResponse.json({ error: "Could not save draft" }, { status: 500 });
  }

  return NextResponse.json({ recipe: recipeRowToPayload(created) });
}

/** DELETE /api/recipes — remove one of the authenticated user's own recipes. */
export async function DELETE(request) {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = recipeIdSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid recipeId" },
      { status: 400 },
    );
  }

  // Filter on user_id too so a user can never delete another user's recipe
  // even if the recipes table ends up with permissive RLS.
  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", parsed.data.recipeId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[api/recipes] DELETE error:", error.message);
    return NextResponse.json({ error: "Could not delete recipe" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
