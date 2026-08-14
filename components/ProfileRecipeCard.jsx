"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Loader2, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

const DIFFICULTY = {
  Easy: "border-[#22c55e]/30 bg-[#22c55e]/15 text-[#15803d]",
  Medium: "border-[#f59e0b]/30 bg-[#f59e0b]/15 text-[#b45309]",
  Hard: "border-[#ef4444]/30 bg-[#ef4444]/15 text-[#b91c1c]",
};

/**
 * Compact card for list pages (favorites / saved recipes / my recipes).
 * `kind` is the API slug used for removal, e.g. "favorites" or "saved-recipes".
 */
export default function ProfileRecipeCard({ recipe, kind, onRemoved }) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      const res = await fetch(`/api/${kind}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId: recipe.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Could not remove this item");
        return;
      }
      toast.success(
        kind === "favorites" ? "Removed from favorites" : "Removed from saved recipes",
      );
      onRemoved?.(recipe.id);
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setRemoving(false);
    }
  };

  const diff = DIFFICULTY[recipe.difficulty] || DIFFICULTY.Medium;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="group flex gap-4 overflow-hidden rounded-[22px] border border-white/70 bg-white/70 p-3.5 shadow-[0_14px_34px_rgba(111,80,50,0.09)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_24px_50px_-16px_rgba(249,115,22,0.22)]"
    >
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-stone-100 sm:h-32 sm:w-32">
        {recipe.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.image}
            alt={recipe.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50 text-2xl font-extrabold text-orange-400">
            {recipe.title?.[0] ?? "🍽"}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <h3 className="line-clamp-1 text-[15px] font-extrabold tracking-tight text-[#111827] group-hover:text-[#ea580c]">
            {recipe.title}
          </h3>
          <p className="mt-0.5 text-[11px] font-semibold text-[#8c827a]">{recipe.cuisine}</p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 rounded-full border border-white/60 bg-white/80 px-2.5 py-1 text-[10px] font-bold text-[#61564a]">
              <Clock size={10} className="text-[#f97316]" />
              {recipe.prepTime || "20 min"}
            </span>
            <span className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${diff}`}>
              {recipe.difficulty || "Medium"}
            </span>
            <span className="flex items-center gap-1 rounded-full border border-white/60 bg-white/80 px-2.5 py-1 text-[10px] font-bold text-[#61564a]">
              <Star size={10} fill="#f97316" className="text-[#f97316]" />
              {(recipe.rating ?? 4.5).toFixed(1)}
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={handleRemove}
            disabled={removing}
            aria-label={`Remove ${recipe.title}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-600 transition-all duration-200 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {removing ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Trash2 size={12} />
            )}
            {removing ? "Removing…" : "Remove"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
