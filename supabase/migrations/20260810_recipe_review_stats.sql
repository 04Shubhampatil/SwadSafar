-- ────────────────────────────────────────────────────────────────────────
-- Add demo review statistics to user-created recipes.
--
-- New recipes receive random demo values (rating 4.2–5.0, reviews_count
-- 500–5000) at creation time from the API. This migration adds the
-- `reviews_count` column and backfills existing rows ONCE with the demo
-- defaults so no recipe is left without stable metadata. It is safe to run
-- against any existing database and never re-rolls values.
--
-- NOTE: These are display-only demo statistics — no fake users or review
-- records are created, and this stays separate from any real review system.
-- ────────────────────────────────────────────────────────────────────────

alter table public.recipes
  add column if not exists reviews_count int not null default 0;

-- Backfill existing rows once (0 = unset) with the demo default.
update public.recipes
  set reviews_count = 3100
  where reviews_count is null or reviews_count <= 0;

-- Existing rows with a missing/zero rating also get the demo default once.
update public.recipes
  set rating = 4.9
  where rating is null or rating = 0;
