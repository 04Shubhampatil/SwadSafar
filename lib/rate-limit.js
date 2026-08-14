/**
 * Lightweight server-side rate limiter for paid AI generation.
 *
 * Uses a fixed window keyed by an identifier (e.g. the authenticated user id)
 * held in memory. This is per-instance: it resets when the server restarts and
 * is not shared across multiple instances. It is intentionally simple — swap
 * the storage behind `consumeRateLimit` for a shared store (e.g. Redis or a
 * Supabase table) if the app is deployed across many replicas.
 *
 * Limits are configurable via environment:
 *   MISTRAL_RATE_LIMIT        (default 30 requests per window)
 *   MISTRAL_RATE_WINDOW_MS    (default 60 minutes)
 *
 * The image endpoint passes its own options:
 *   IMAGE_RATE_LIMIT          (default 10 requests per window)
 *   IMAGE_RATE_WINDOW_MS      (default 60 minutes)
 */

const MAX_REQUESTS = Number(process.env.MISTRAL_RATE_LIMIT) || 30;
const WINDOW_MS = Number(process.env.MISTRAL_RATE_WINDOW_MS) || 60 * 60 * 1000;

const buckets = new Map();

function sweep(now) {
  if (buckets.size < 10_000) return;
  for (const [key, bucket] of buckets) {
    if (now - bucket.startedAt >= WINDOW_MS) buckets.delete(key);
  }
}

/**
 * Records one attempt for `key` and reports whether it is allowed.
 *
 * @param {string} key
 * @param {{ limit?: number, windowMs?: number }} [options]
 * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
 */
export function consumeRateLimit(key, { limit = MAX_REQUESTS, windowMs = WINDOW_MS } = {}) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.startedAt >= windowMs) {
    sweep(now);
    buckets.set(key, { startedAt: now, count: 1 });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.startedAt + windowMs };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.startedAt + windowMs };
}
