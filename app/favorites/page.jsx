import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/profile";
import { resolveRecipeCards } from "@/lib/recipe-data";
import FavoritesClient from "./FavoritesClient";

export const metadata = {
  title: "Favorites — Foodi",
  description: "Recipes you have loved.",
};

export default async function FavoritesPage() {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) {
    redirect("/sign-in?redirectTo=/favorites");
  }

  const { data: rows } = await supabase
    .from("favorites")
    .select("recipe_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const recipeIds = (rows ?? []).map((row) => row.recipe_id);
  const recipes = await resolveRecipeCards(supabase, recipeIds);

  return (
    <main className="min-h-screen bg-[#FFF9F3] px-4 py-10 md:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <FavoritesClient recipes={recipes} />
      </div>
    </main>
  );
}
