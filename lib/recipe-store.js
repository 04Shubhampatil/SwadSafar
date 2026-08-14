/**
 * Maps between the API's camelCase recipe payload and the snake_case columns
 * of the `recipes` table. Shared by the save-draft and publish endpoints so
 * both always write the same shape.
 */

export function recipePayloadToRow(payload) {
  return {
    title: payload.title ?? "",
    description: payload.description ?? "",
    image: payload.image ?? null,
    cuisine: payload.cuisine ?? "",
    prep_time: payload.prepTime ?? 10,
    cook_time: payload.cookTime ?? 20,
    difficulty: payload.difficulty ?? "Medium",
    servings: payload.servings ?? 4,
    calories: payload.calories ?? 0,
    dietary: payload.dietary ?? [],
    ingredients: payload.ingredients ?? [],
    instructions: payload.instructions ?? [],
  };
}

export function recipeRowToPayload(row) {
  return {
    id: row.id,
    title: row.title ?? "",
    description: row.description ?? "",
    image: row.image ?? null,
    cuisine: row.cuisine ?? "",
    prepTime: row.prep_time ?? 10,
    cookTime: row.cook_time ?? 20,
    difficulty: row.difficulty ?? "Medium",
    servings: row.servings ?? 4,
    calories: row.calories ?? 0,
    dietary: row.dietary ?? [],
    ingredients: row.ingredients ?? [],
    instructions: row.instructions ?? [],
    status: row.status ?? "draft",
    createdAt: row.created_at ?? null,
  };
}
