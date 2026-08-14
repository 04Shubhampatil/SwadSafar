"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Flame,
  Clock,
  Leaf,
  ThumbsUp,
  Star,
  Sparkles,
  ChefHat,
  BookOpen,
  TrendingUp,
  Grid2x2,
} from "lucide-react";

import sampleRecipes from "@/json/recipes.json";
import RecipeCard from "./_components/RecipeCard";
import FeaturedRecipe from "./_components/FeaturedRecipe";
import SearchBar from "./_components/SearchBar";
import FilterPills from "./_components/FilterPills";
import AnimatedNumber from "./_components/AnimatedNumber";

const easeOut = [0.22, 1, 0.36, 1];

const FILTER_PILLS = [
  { id: "trending", label: "Trending", icon: Flame },
  { id: "quick", label: "Quick (< 30 min)", icon: Clock },
  { id: "vegetarian", label: "Vegetarian", icon: Leaf },
  { id: "most-liked", label: "Most Liked", icon: ThumbsUp },
  { id: "highest-rated", label: "Highest Rated", icon: Star },
  { id: "new", label: "New Recipes", icon: Sparkles },
];

const DESCRIPTIONS = [
  "Silky pasta tossed in a velvety tomato-cream sauce, finished with fresh basil and parmesan.",
  "Succulent chicken simmered in a rich, creamy tomato-cashew gravy with aromatic North Indian spices.",
  "Crisp sourdough topped with smashed avocado, heirloom tomatoes and a soft poached egg.",
  "A molten dark chocolate centre wrapped in a soft, decadent sponge — best served warm.",
];

const EXTRA = [
  { calories: 420, cooks: "12.4K", likes: "3.1K", saves: "8.2K", serves: 4 },
  { calories: 560, cooks: "9.8K", likes: "2.4K", saves: "6.9K", serves: 4 },
  { calories: 310, cooks: "7.2K", likes: "1.8K", saves: "4.5K", serves: 2 },
  { calories: 480, cooks: "15.1K", likes: "4.6K", saves: "9.7K", serves: 4 },
];

const CHEF_RATINGS = [4.9, 4.8, 4.7, 4.9];
const VEGETARIAN = [true, false, true, true];

const parseCount = (s) => {
  const n = parseFloat(s);
  return s.includes("K") ? n * 1000 : n;
};

const enrich = (recipe, i) => {
  const idx = i % 4;
  const extra = EXTRA[idx];
  return {
    ...recipe,
    caloriesNum: extra.calories,
    calories: `${extra.calories} kcal`,
    cooks: extra.cooks,
    cooksNum: parseCount(extra.cooks),
    likes: extra.likes,
    likesNum: parseCount(extra.likes),
    saves: extra.saves,
    savesNum: parseCount(extra.saves),
    serves: extra.serves,
    chefRating: CHEF_RATINGS[idx],
    vegetarian: VEGETARIAN[idx],
    description: recipe.description || DESCRIPTIONS[idx],
  };
};

export default function AllRecipesPage({ featuredRecipe = null, userRecipes = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState("trending");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("trending");

  // Pre-fill search from URL ?q= param
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery) setQuery(urlQuery);
  }, [searchParams]);

  const extendedRecipes = useMemo(() => {
    const list = [];
    const seen = new Set();
    const source = [...userRecipes]; // Data is already merged and deduplicated by RecipesPage

    source.forEach((recipe, i) => {
      const item = enrich(recipe, i);
      if (seen.has(item.id)) return;
      seen.add(item.id);
      list.push(item);
    });

    return list;
  }, [userRecipes]);

  const suggestions = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return extendedRecipes
      .filter(
        (r) =>
          r.title.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [query, extendedRecipes]);

  const filtered = useMemo(() => {
    let list = extendedRecipes;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          (r.difficulty || "").toLowerCase().includes(q)
      );
    }
    if (activeFilter === "quick") {
      list = list.filter((r) => parseInt(r.prepTime, 10) <= 30);
    }
    if (activeFilter === "vegetarian") {
      list = list.filter((r) => r.vegetarian);
    }

    if (activeFilter === "most-liked") {
      list = [...list].sort((a, b) => b.likesNum - a.likesNum);
    } else if (activeFilter === "highest-rated") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (activeFilter === "new") {
      list = [...list].reverse();
    } else {
      list = [...list];
      if (sortBy === "popular") list.sort((a, b) => b.cooksNum - a.cooksNum);
      if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
      if (sortBy === "newest") list.reverse();
    }
    return list;
  }, [extendedRecipes, query, activeFilter, sortBy]);

  const displayFeatured = featuredRecipe ?? extendedRecipes[0] ?? null;

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#FFF9F3]">
        {/* ── Ambient background ── */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="fd-noise absolute inset-0 opacity-30 mix-blend-multiply" />
          <div className="fd-blob absolute -top-44 -left-52 h-[600px] w-[600px] rounded-full bg-[#fdba74]/30 blur-3xl" />
          <div
            className="fd-blob absolute -right-56 top-[24%] h-[540px] w-[540px] rounded-full bg-[#f97316]/12 blur-3xl"
            style={{ animationDelay: "5s" }}
          />
          <div
            className="fd-blob absolute -bottom-52 left-[18%] h-[520px] w-[520px] rounded-full bg-[#fde68a]/35 blur-3xl"
            style={{ animationDelay: "10s" }}
          />
          <div className="fd-dots absolute right-[5%] top-[16%] h-44 w-44 opacity-40" />
          <div className="fd-dots absolute left-[3%] top-[46%] h-40 w-40 opacity-35" />
          <div className="fd-drift absolute left-[7%] top-[26%] h-12 w-12 rounded-full border border-[#fec9a3]/70 bg-white/50 shadow-[0_8px_24px_rgba(249,115,22,0.08)] backdrop-blur-sm" />
          <div
            className="fd-drift absolute right-[9%] top-[58%] h-9 w-9 rounded-full bg-[#f97316]/12"
            style={{ animationDelay: "3s" }}
          />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 sm:px-12 lg:px-16 lg:py-14">
          {/* ══════════ PAGE HEADER ══════════ */}
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="flex flex-col gap-6"
          >
            {/* Back + breadcrumb */}
            <div className="flex flex-wrap items-center gap-4">
              <motion.button
                type="button"
                aria-label="Go back"
                onClick={() => router.back()}
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.92 }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/60 text-[#ea580c] shadow-[0_10px_24px_rgba(111,80,50,0.1)] backdrop-blur-xl transition-colors hover:bg-white hover:text-[#9a3412]"
              >
                <ChevronLeft size={19} strokeWidth={2.5} />
              </motion.button>

              <nav aria-label="Breadcrumb" className="flex items-center gap-2">
                <Link
                  href="/"
                  className="text-xs font-bold text-[#a09485] transition-colors hover:text-[#ea580c]"
                >
                  Home
                </Link>
                <ChevronRight size={13} className="text-[#d0c4b4]" />
                <Link
                  href="/recipes"
                  aria-current="page"
                  className="text-xs font-bold text-[#a09485] transition-colors hover:text-[#ea580c]"
                >
                  Recipes
                </Link>
                <ChevronRight size={13} className="text-[#d0c4b4]" />
                <span className="text-xs font-extrabold text-[#111827]">All Recipes</span>
              </nav>
            </div>

            {/* Title block */}
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] text-[#111827] sm:text-5xl [font-family:var(--font-display)]">
                All <span className="fd-text-gradient">Recipes</span>
              </h1>
              <p className="max-w-md text-sm font-medium leading-relaxed text-[#7c7267]">
                Browse our hand-crafted collection of
                <span className="font-bold text-[#111827]"> 5,200+ recipes</span> — from
                15-minute weeknight dinners to show-stopping feasts.
              </p>
            </div>

            {/* Animated statistics */}
            <div className="flex flex-wrap items-center gap-4">
              {[
                {
                  Icon: BookOpen,
                  tint: "from-[#f97316] to-[#fb923c]",
                  value: <AnimatedNumber value={5200} suffix="+" />,
                  label: "Total recipes",
                },
                {
                  Icon: TrendingUp,
                  tint: "from-[#22c55e] to-[#4ade80]",
                  value: <AnimatedNumber value={128} />,
                  label: "Trending today",
                },
                {
                  Icon: ChefHat,
                  tint: "from-[#0f172a] to-[#334155]",
                  value: <AnimatedNumber value={340} suffix="+" />,
                  label: "Popular chefs",
                },
              ].map(({ Icon, tint, value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: easeOut }}
                  whileHover={{ y: -3 }}
                  className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/60 px-4 py-3 shadow-[0_10px_26px_rgba(111,80,50,0.09)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_16px_36px_rgba(249,115,22,0.16)]"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tint} text-white shadow-[0_8px_18px_rgba(249,115,22,0.32)]`}
                  >
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-lg font-extrabold leading-none tracking-tight text-[#111827] [font-family:var(--font-display)]">
                      {value}
                    </p>
                    <p className="mt-1 text-[10.5px] font-bold uppercase tracking-wider text-[#a09485]">
                      {label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.header>

          {/* ══════════ SEARCH + ADVANCED FILTERS ══════════ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: easeOut }}
            className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <SearchBar
              query={query}
              setQuery={setQuery}
              suggestions={suggestions}
              onSelect={(title) => setQuery(title)}
            />
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex shrink-0 items-center justify-center gap-2 rounded-[24px] border border-white/80 bg-white/60 px-6 py-4 text-sm font-bold text-[#61564a] shadow-[0_12px_28px_rgba(111,80,50,0.09)] backdrop-blur-xl transition-colors hover:border-[#fdba74] hover:text-[#ea580c] hover:shadow-[0_16px_36px_rgba(249,115,22,0.16)]"
            >
              <SlidersHorizontal size={15} />
              Advanced Filters
            </motion.button>
          </motion.div>

          {/* ══════════ FILTER PILLS ══════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: easeOut }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#a09485]">
                Filter
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-[#f0e8dc] to-transparent" />
            </div>
            <FilterPills
              pills={FILTER_PILLS}
              active={activeFilter}
              onChange={setActiveFilter}
            />
          </motion.div>

          {/* ══════════ META ROW ══════════ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <p className="flex items-center gap-2 text-xs font-semibold text-[#61564a] sm:text-sm">
              <span className="relative flex h-2 w-2">
                <span className="fd-pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#22c55e]" />
              </span>
              Showing{" "}
              <motion.span
                key={filtered.length}
                initial={{ scale: 1.4 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 16 }}
                className="font-extrabold text-[#111827]"
              >
                {filtered.length}
              </motion.span>{" "}
              recipes
            </p>

            <div className="flex items-center gap-2.5">
              <label
                htmlFor="sort-dropdown"
                className="text-[11px] font-extrabold uppercase tracking-wider text-[#a09485]"
              >
                Sort by
              </label>
              <div className="relative">
                <select
                  id="sort-dropdown"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="cursor-pointer appearance-none rounded-full border border-white/80 bg-white/70 py-2 pl-4 pr-9 text-xs font-bold text-[#111827] shadow-[0_8px_20px_rgba(111,80,50,0.08)] outline-none backdrop-blur-xl transition-all focus:border-[#fdba74] focus:shadow-[0_12px_28px_rgba(249,115,22,0.18)]"
                >
                  <option value="trending">Trending</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rating</option>
                  <option value="newest">Newest</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a09485]"
                />
              </div>
            </div>
          </motion.div>

          {/* ══════════ FEATURED RECIPES ══════════ */}
          {displayFeatured && (
            <FeaturedRecipe key={displayFeatured.id} recipe={displayFeatured} />
          )}

          {/* ══════════ GRID SECTION ══════════ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="flex flex-col gap-7"
          >
            {/* Section header */}
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#ea580c]">
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#f97316]" />
                  The Collection
                </p>
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#111827] sm:text-3xl [font-family:var(--font-display)]">
                Explore More{" "}
                <span className="fd-text-gradient">Delights</span>
              </h2>
            </div>
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="flex shrink-0 items-center gap-2 rounded-full border border-[#fed7aa]/80 bg-white/60 px-5 py-2.5 text-xs font-bold text-[#ea580c] shadow-[0_8px_20px_rgba(249,115,22,0.1)] backdrop-blur-xl transition-colors hover:border-[#fdba74] hover:shadow-[0_12px_28px_rgba(249,115,22,0.2)]"
              >
                <Grid2x2 size={14} />
                All {extendedRecipes.length} recipes
              </motion.button>
            </div>

            {/* Grid */}
            <motion.div
              key={`${activeFilter}-${sortBy}`}
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
              }}
              className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4"
            >
              {filtered.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
