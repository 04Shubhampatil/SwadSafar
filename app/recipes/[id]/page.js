import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Star, Flame, ChefHat, CheckCircle2, ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCatalogRecipe, normalizeDbRecipe } from "@/lib/recipe-data";
import RecipeActions from "./RecipeActions";

export default async function SingleRecipePage({ params }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/sign-in?redirectTo=/recipes/${id}`);
  }

  // Try catalog (JSON) recipe first
  const catalogRecipe = getCatalogRecipe(id);
  let recipe = null;

  if (catalogRecipe) {
    recipe = {
      id: String(catalogRecipe.id),
      title: catalogRecipe.title,
      image: catalogRecipe.image,
      cuisine: catalogRecipe.cuisine,
      prepTime: catalogRecipe.prepTime,
      difficulty: catalogRecipe.difficulty ?? "Medium",
      rating: catalogRecipe.rating ?? 4.5,
      chef: catalogRecipe.chef ?? { name: "Community Chef", avatar: "/logo.webp" },
      description: catalogRecipe.description || "A delicious recipe from our curated collection.",
      ingredients: catalogRecipe.ingredients || [],
      instructions: catalogRecipe.instructions || [],
      calories: catalogRecipe.calories ?? 420,
      serves: catalogRecipe.serves ?? 4,
    };
  } else {
    // Try Supabase DB recipe
    const { data, error } = await supabase
      .from("recipes")
      .select("id, user_id, title, description, image, cuisine, prep_time, difficulty, rating, servings, calories, ingredients, instructions, status, created_at")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error("Could not load this recipe. Please try again.");
    }

    if (!data) {
      notFound();
    }

    // Fetch creator profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, username, avatar_url")
      .eq("user_id", data.user_id)
      .maybeSingle();

    recipe = normalizeDbRecipe(data, profile);
    recipe.ingredients = data.ingredients || [];
    recipe.instructions = data.instructions || [];
    recipe.calories = data.calories ?? 0;
    recipe.serves = data.servings ?? 4;
  }

  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];

  return (
    <main className="min-h-screen bg-[#FFF9F3] pb-20 pt-24 sm:pt-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">

        {/* Back link */}
        <Link
          href="/recipes"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#a09485] transition-colors hover:text-[#ea580c]"
        >
          <ChevronLeft size={16} />
          Back to Recipes
        </Link>

        {/* Header Section */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">

          {/* Image */}
          <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-[32px] bg-stone-100 shadow-[0_20px_40px_-12px_rgba(111,80,50,0.15)] md:w-[400px]">
            {recipe.image ? (
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#f0e8dc]">
                <ChefHat size={48} className="text-[#d0c4b4]" />
              </div>
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

            {/* Action Buttons (Client Component) */}
            <div className="absolute bottom-4 right-4 z-10 flex gap-3">
              <RecipeActions recipeId={recipe.id} />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col pt-2">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-gradient-to-r from-[#ea580c] to-[#fb923c] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_6px_16px_rgba(249,115,22,0.3)]">
                {recipe.cuisine || "Homemade"}
              </span>
              <span className="flex items-center gap-1 rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/15 px-3 py-1.5 text-xs font-bold text-[#b45309]">
                {recipe.difficulty || "Medium"}
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-[#111827] sm:text-5xl [font-family:var(--font-display)]">
              {recipe.title}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-[#61564a]">
              {recipe.description || "A delicious recipe to try at home."}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 rounded-2xl bg-white/60 p-5 shadow-[0_8px_20px_rgba(111,80,50,0.05)] backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#ea580c]">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#a09485]">Prep Time</p>
                  <p className="text-sm font-extrabold text-[#111827]">{recipe.prepTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-[#15803d]">
                  <Flame size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#a09485]">Calories</p>
                  <p className="text-sm font-extrabold text-[#111827]">{recipe.calories || "—"} kcal</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-[#b45309]">
                  <Star size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#a09485]">Rating</p>
                  <p className="text-sm font-extrabold text-[#111827]">{recipe.rating?.toFixed(1) || "4.5"}</p>
                </div>
              </div>
            </div>

            {/* Author Profile */}
            <div className="mt-8 flex items-center gap-4 border-t border-[#f0e8dc] pt-8">
              <div className="relative h-14 w-14 overflow-hidden rounded-full ring-4 ring-white shadow-md">
                <Image
                  src={recipe.chef?.avatar || "/logo.webp"}
                  alt={recipe.chef?.name || "Chef"}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#a09485]">Recipe By</p>
                <p className="text-lg font-extrabold text-[#111827]">{recipe.chef?.name || "Community Chef"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">

          {/* Ingredients */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#111827] [font-family:var(--font-display)]">
              Ingredients
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {ingredients.length > 0 ? (
                ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-xl bg-white/50 p-3 shadow-sm">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#22c55e]" />
                    <span className="text-sm font-medium text-[#3f3830]">
                      {typeof ing === "string" ? ing : ing?.name || ing?.text || JSON.stringify(ing)}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-sm italic text-[#a09485]">No ingredients listed.</li>
              )}
            </ul>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#111827] [font-family:var(--font-display)]">
              Instructions
            </h2>
            <div className="mt-6 flex flex-col gap-6">
              {instructions.length > 0 ? (
                instructions.map((step, i) => (
                  <div key={i} className="flex gap-5 rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-[#f0e8dc]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ea580c] text-sm font-bold text-white shadow-md">
                      {i + 1}
                    </div>
                    <p className="pt-1 text-base leading-relaxed text-[#3f3830]">
                      {typeof step === "string" ? step : step?.text || step?.instruction || JSON.stringify(step)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-sm italic text-[#a09485]">No instructions provided.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
