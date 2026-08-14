"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, HeartCrack, Loader2 } from "lucide-react";
import ProfileRecipeCard from "@/components/ProfileRecipeCard";

export default function FavoritesClient({ recipes }) {
  const [items, setItems] = useState(recipes);

  const handleRemoved = (id) => {
    setItems((current) => current.filter((recipe) => recipe.id !== id));
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#ea580c]">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#f97316]" />
          Your collection
        </p>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-[0_10px_24px_rgba(249,115,22,0.3)]">
            <Heart size={20} fill="currentColor" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-[#111827] sm:text-4xl">
              Favorites
            </h1>
            <p className="text-sm font-medium text-[#7c7267]">
              {items.length} {items.length === 1 ? "recipe" : "recipes"} you&apos;ve loved
            </p>
          </div>
        </div>
      </header>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-[#e8d7c2] bg-white/50 px-6 py-16 text-center backdrop-blur-sm"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-400">
            <HeartCrack size={26} />
          </span>
          <p className="text-lg font-extrabold text-[#111827]">No favorites yet</p>
          <p className="max-w-sm text-sm font-medium text-[#8c827a]">
            Tap the heart on any recipe to save it here.
          </p>
        </motion.div>
      ) : (
        <AnimatePresence initial={false}>
          <div className="space-y-4">
            {items.map((recipe) => (
              <ProfileRecipeCard
                key={recipe.id}
                recipe={recipe}
                kind="favorites"
                onRemoved={handleRemoved}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {recipes.length > 0 && items.length === 0 && (
        <p className="flex items-center gap-2 text-xs font-semibold text-[#b3a798]">
          <Loader2 size={13} className="animate-spin" /> Removing…
        </p>
      )}
    </div>
  );
}
