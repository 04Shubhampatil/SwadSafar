/**
 * Demo review statistics for user-created recipes.
 *
 * Values are generated ONCE at recipe creation time and persisted to the
 * `recipes` table (`rating`, `reviews_count`). They are intentionally
 * display-only demo metadata — no fake review records or users are created,
 * and this is kept separate from any real review system.
 *
 * Consumers must never re-roll these per render; existing rows are only
 * backfilled once (see supabase/migrations/20260810_recipe_review_stats.sql).
 */

export const DEFAULT_RATING = 4.9;
export const DEFAULT_REVIEWS_COUNT = 3100;
export const DEFAULT_REVIEWS_LABEL = "3.1K";

/**
 * Random demo stats for a newly created recipe.
 * rating: one decimal place, between 4.2 and 5.0 (inclusive).
 * reviews_count: whole number between 500 and 5000 (inclusive).
 */
export function generateRecipeStats() {
  const rating = Math.round((4.2 + Math.random() * 0.8) * 10) / 10;
  const reviews_count = Math.floor(500 + Math.random() * 4501);
  return { rating, reviews_count };
}

/**
 * Formats a numeric review count for the UI:
 *   1000 -> "1K", 2300 -> "2.3K", 3100 -> "3.1K", 4500 -> "4.5K"
 * Values below 1000 are shown as plain numbers. Missing/zero values fall
 * back to the stable demo label (never re-randomized).
 */
export function formatReviewsCount(count) {
  const n = typeof count === "number" && Number.isFinite(count) ? count : 0;
  if (n <= 0) return DEFAULT_REVIEWS_LABEL;
  if (n < 1000) return String(Math.round(n));
  const k = n / 1000;
  return `${(Math.round(k * 10) / 10).toFixed(1).replace(/\.0$/, "")}K`;
}
