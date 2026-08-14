import sampleRecipes from "@/json/recipes.json";
import { DEFAULT_RATING, DEFAULT_REVIEWS_COUNT, formatReviewsCount } from "@/lib/recipe-stats";

const DEFAULT_RECIPE_IMAGE = "/default.webp";

const EXTRA = [
  { calories: 420, cooks: "12.4K", serves: 4 },
  { calories: 560, cooks: "9.8K", serves: 4 },
  { calories: 310, cooks: "7.2K", serves: 2 },
  { calories: 480, cooks: "15.1K", serves: 4 },
];

const CHEF_RATINGS = [4.9, 4.8, 4.7, 4.9];

export function getCatalogRecipe(id) {
  return sampleRecipes.find((r) => String(r.id) === String(id)) ?? null;
}

export function normalizeCatalogRecipe(recipe, index = 0) {
  const idx = index % EXTRA.length;
  const extra = EXTRA[idx];
  return {
    id: String(recipe.id),
    title: recipe.title,
    image: recipe.image || "/default.webp",
    cuisine: recipe.cuisine || "Homemade",
    category: recipe.category ?? recipe.cuisine ?? "Other",
    prepTime: recipe.prepTime || "20 min",
    cookingTime: recipe.cookingTime || recipe.prepTime || "20 min",
    difficulty: recipe.difficulty ?? "Medium",
    rating: recipe.rating ?? 4.5,
    chef: recipe.chef ?? { name: "Community Chef", avatar: "/logo.webp" },
    calories: extra.calories,
    caloriesNum: extra.calories,
    cooks: extra.cooks,
    serves: extra.serves,
    chefRating: CHEF_RATINGS[idx],
    reviewsCount: recipe.reviewsCount ?? "—",
    description: recipe.description ?? "",
    userId: null,
    userName: null,
    userImage: null,
    isUserRecipe: false,
    createdAt: recipe.createdAt ?? null,
  };
}

export function mergeRecipes(catalogRecipes, dbRecipes = []) {
  const normalizedCatalog = catalogRecipes.map((recipe, index) => normalizeCatalogRecipe(recipe, index));
  return Array.from(
    new Map(
      [...normalizedCatalog, ...dbRecipes].map((recipe) => [String(recipe.id), recipe])
    ).values()
  );
}

export function normalizeDbRecipe(recipe, profile = null) {
  const chefName = profile?.full_name || profile?.username || "Community Chef";
  const chefAvatar = profile?.avatar_url || "/default.webp";

  const image = String(recipe.image || recipe.image_url || "").trim() || DEFAULT_RECIPE_IMAGE;
  const prepTime = recipe.prepTime ?? (recipe.prep_time != null ? `${recipe.prep_time} min` : "20 min");
  const cookingTime = recipe.cookingTime ?? (recipe.cook_time != null ? `${recipe.cook_time} min` : prepTime);

  return {
    id: String(recipe.id),
    title: recipe.title ?? "Untitled recipe",
    image,
    cuisine: recipe.cuisine ?? "Homemade",
    category: recipe.category ?? recipe.cuisine ?? "Other",
    prepTime,
    cookingTime,
    difficulty: recipe.difficulty ?? "Medium",
    rating: Number(recipe.rating ?? DEFAULT_RATING),
    chef: recipe.chef ?? { name: chefName, avatar: chefAvatar },
    calories: recipe.calories ?? 0,
    caloriesNum: recipe.calories ?? 0,
    cooks: recipe.cooks ?? "—",
    serves: recipe.servings ?? recipe.serves ?? 4,
    chefRating: recipe.chefRating ?? 5,
    reviewsCount: formatReviewsCount(recipe.reviews_count ?? DEFAULT_REVIEWS_COUNT),
    description: recipe.description ?? "",
    userId: recipe.user_id,
    userName: chefName,
    userImage: chefAvatar,
    isUserRecipe: true,
    createdAt: recipe.created_at,
  };
}

/**
 * Resolves a list of recipe ids into display-ready card objects, preserving
 * the order of `recipeIds`. Catalog recipes come from the static recipe JSON;
 * anything else is looked up in the `recipes` table (user-created recipes).
 * Ids ending in "-dup" (duplicate variants shown in the recipes grid) fall
 * back to their base catalog recipe.
 */
export async function resolveRecipeCards(supabase, recipeIds) {
  const cards = new Map();
  const dbIds = new Set();

  recipeIds.forEach((id, i) => {
    const key = String(id ?? "");
    if (!key) return;

    const catalog = getCatalogRecipe(key);
    if (catalog) {
      cards.set(key, normalizeCatalogRecipe(catalog, i));
      return;
    }

    const baseId = key.replace(/-dup$/, "");
    const base = getCatalogRecipe(baseId);
    if (base) {
      cards.set(key, normalizeCatalogRecipe(base, i));
      return;
    }

    dbIds.add(key);
  });

  if (dbIds.size && supabase) {
    const { data } = await supabase
      .from("recipes")
      .select("id, user_id, title, description, image, cuisine, prep_time, difficulty, rating, calories, servings, status, created_at")
      .in("id", [...dbIds]);
    if (data) {
      const userIds = [...new Set(data.map(r => r.user_id).filter(Boolean))];
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

      data.forEach((row) => {
        cards.set(String(row.id), normalizeDbRecipe(row, profilesMap[row.user_id]));
      });
    }
  }

  return recipeIds.map((id) => cards.get(String(id ?? ""))).filter(Boolean);
}
