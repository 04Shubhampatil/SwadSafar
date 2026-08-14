"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import CategoryTabs from "./CategoryTabs";
import RecipeCard from "./RecipeCard";
import sampleRecipes from "@/json/recipes.json";

const easeOut = [0.22, 1, 0.36, 1];

export default function TrendingRecipes({ recipes = [] }) {
  const displayRecipes = recipes;

  return (
    <section className="relative overflow-hidden bg-[#FFF9F3] py-16 lg:py-24">
      {/* ── Ambient background layers ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="fd-noise absolute inset-0 opacity-25 mix-blend-multiply" />
        <div className="fd-blob absolute -right-56 top-0 h-[520px] w-[520px] rounded-full bg-[#fdba74]/30 blur-3xl" />
        <div
          className="fd-blob absolute -left-64 bottom-0 h-[460px] w-[460px] rounded-full bg-[#fde68a]/35 blur-3xl"
          style={{ animationDelay: "8s" }}
        />
        <div className="fd-dots absolute left-[3%] top-[14%] h-40 w-40 opacity-40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
        <div className="flex flex-col gap-10">
          {/* Category Row */}
          <CategoryTabs />

          {/* Section Header Title & View All */}
          <div className="flex items-end justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: easeOut }}
            >
              <p className="mb-2 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#ea580c]">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#f97316]" />
                Community Favorites
              </p>
              <h2 className="text-3xl font-extrabold tracking-[-0.025em] text-[#111827] sm:text-4xl [font-family:var(--font-display)]">
                Trending{" "}
                <span className="fd-text-gradient">Recipes</span>
              </h2>
              <p className="mt-2 text-sm font-medium text-[#a09485]">
                Most loved by our community this week
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.12, ease: easeOut }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="group flex shrink-0 items-center gap-1.5 rounded-full border border-[#fed7aa]/80 bg-white/60 px-5 py-2.5 text-xs font-bold text-[#ea580c] shadow-[0_8px_20px_rgba(249,115,22,0.1)] backdrop-blur-xl transition-all duration-300 hover:border-[#fdba74] hover:shadow-[0_12px_28px_rgba(249,115,22,0.2)]"
            >
              View all
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.button>
          </div>

          {/* Recipe Grid */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12 } },
            }}
            className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4"
          >
            {displayRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
