import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServerUser, ensureProfile } from "@/lib/profile";
import { normalizeDbRecipe } from "@/lib/recipe-data";
import MyRecipesClient from "./MyRecipesClient";

export const metadata = {
  title: "My Recipes — Foodi",
  description: "View all the recipes you've created.",
};

export default async function MyRecipesPage() {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) {
    redirect("/sign-in?redirectTo=/my-recipes");
  }

  const profile = await ensureProfile(supabase, user);
  const currentUser = {
    id: user.id,
    name: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || "",
    avatar: profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
  };

  const { data, error } = await supabase
    .from("recipes")
    .select("id, user_id, title, description, image, cuisine, prep_time, difficulty, rating, servings, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[MyRecipesPage] Error:", error.message);
    throw new Error("Could not load your recipes. Please try again.");
  }

  const recipes = (data ?? []).map((recipe) => normalizeDbRecipe(recipe, profile));

  return (
    <main className="min-h-screen bg-[#FFF9F3] px-4 py-10 md:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <MyRecipesClient recipes={recipes} currentUser={currentUser} />
      </div>
    </main>
  );
}
