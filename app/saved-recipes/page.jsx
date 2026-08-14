import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/profile";
import { resolveRecipeCards } from "@/lib/recipe-data";
import SavedRecipesClient from "./SavedRecipesClient";

export const metadata = {
  title: "Saved Recipes — Foodi",
  description: "Recipes you have bookmarked for later.",
};

export default async function SavedRecipesPage() {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) {
    redirect("/sign-in?redirectTo=/saved-recipes");
  }

  const { data: rows } = await supabase
    .from("saved_recipes")
    .select("recipe_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const recipeIds = (rows ?? []).map((row) => row.recipe_id);
  const recipes = await resolveRecipeCards(supabase, recipeIds);

  return (
    <main className="min-h-screen bg-[#FFF9F3] px-4 py-10 md:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <SavedRecipesClient recipes={recipes} />
      </div>
    </main>
  );
}
