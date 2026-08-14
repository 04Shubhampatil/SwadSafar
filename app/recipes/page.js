import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { mergeRecipes, normalizeDbRecipe } from "@/lib/recipe-data";
import AllRecipesPage from "./AllRecipesPage";
import sampleRecipes from "@/json/recipes.json";

export default async function RecipesPage() {
  const supabase = await createClient();

  let userRecipes = [];

  try {
    const { data: allData, error: recipesError } = await supabase
      .from("recipes")
      .select("id, user_id, title, description, image, cuisine, prep_time, difficulty, rating, servings, status, created_at")
      .eq("status", "published")
      .order("created_at", { ascending: true }); // asc to group by first

    if (!recipesError && allData && allData.length > 0) {
      const userIds = [...new Set(allData.map(r => r.user_id).filter(Boolean))];
      let profilesMap = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name, username, avatar_url")
          .in("user_id", userIds);
        if (profiles) {
          profiles.forEach(p => { profilesMap[p.user_id] = p; });
        }
      }

      userRecipes = allData.map((recipe) => normalizeDbRecipe(recipe, profilesMap[recipe.user_id]));
    }
  } catch (err) {
    console.error("[RecipesPage] Error fetching recipes:", err);
  }

  const mergedRecipes = mergeRecipes(sampleRecipes, userRecipes);

  const userRecipesByUser = userRecipes.reduce((acc, recipe) => {
    if (!recipe.userId) return acc;
    const existing = acc[recipe.userId];
    if (!existing) {
      acc[recipe.userId] = recipe;
      return acc;
    }
    if (recipe.createdAt && existing.createdAt) {
      if (new Date(recipe.createdAt) < new Date(existing.createdAt)) {
        acc[recipe.userId] = recipe;
      }
      return acc;
    }
    return acc;
  }, {});

  // Pick ONE featured recipe: the user's oldest published recipe, or the first JSON recipe as fallback
  const firstUserRecipe = Object.values(userRecipesByUser)[0] ?? null;
  const featuredRecipe = firstUserRecipe ?? sampleRecipes[0];

  return (
    <Suspense fallback={null}>
      <AllRecipesPage featuredRecipe={featuredRecipe} userRecipes={mergedRecipes} />
    </Suspense>
  );
}
