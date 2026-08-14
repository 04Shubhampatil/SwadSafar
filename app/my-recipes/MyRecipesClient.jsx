"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Plus, UtensilsCrossed } from "lucide-react";
import MyRecipeCard from "@/components/MyRecipeCard";

export default function MyRecipesClient({ recipes, currentUser }) {
  const [items, setItems] = useState(recipes);

  const handleRemoved = (id) => {
    setItems((current) => current.filter((recipe) => recipe.id !== id));
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5">
        <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#ea580c]">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#f97316]" />
          Your kitchen
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_10px_24px_rgba(249,115,22,0.3)]">
              <ChefHat size={20} />
            </span>
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-[#111827] sm:text-4xl">
                My Recipes
              </h1>
              <p className="mt-0.5 text-sm font-medium text-[#7c7267]">
                {`${items.length} ${items.length === 1 ? "recipe" : "recipes"} you've created`}
              </p>
            </div>
          </div>

          <Link
            href="/generate-recipe"
            className="fd-gradient-btn fd-sheen inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold text-white shadow-[0_12px_26px_rgba(249,115,22,0.35)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <Plus size={14} />
            Create New Recipe
          </Link>
        </div>
      </header>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-[#e8d7c2] bg-white/50 px-6 py-16 text-center backdrop-blur-sm"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-400">
            <UtensilsCrossed size={26} />
          </span>
          <p className="text-lg font-extrabold text-[#111827]">No recipes yet</p>
          <p className="max-w-sm text-sm font-medium text-[#8c827a]">
            Create your first recipe and build your personal cookbook.
          </p>
          <Link
            href="/generate-recipe"
            className="fd-gradient-btn fd-sheen mt-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold text-white shadow-[0_12px_26px_rgba(249,115,22,0.35)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <Plus size={14} />
            Create New Recipe
          </Link>
        </motion.div>
      ) : (
        <AnimatePresence initial={false}>
          <div className="space-y-4">
            {items.map((recipe) => (
              <MyRecipeCard
                key={recipe.id}
                recipe={recipe}
                currentUser={currentUser}
                onRemoved={handleRemoved}
              />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
