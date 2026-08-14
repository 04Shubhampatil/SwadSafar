"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChefHat, Clock, Loader2, Star, Trash2, User } from "lucide-react";
import { toast } from "sonner";

const FALLBACK_IMAGE = "/cardImage/1.webp";

const DIFFICULTY = {
  Easy: "border-[#22c55e]/30 bg-[#22c55e]/15 text-[#15803d]",
  Medium: "border-[#f59e0b]/30 bg-[#f59e0b]/15 text-[#b45309]",
  Hard: "border-[#ef4444]/30 bg-[#ef4444]/15 text-[#b91c1c]",
};

/**
 * Polished card for the "My Recipes" page.
 * Image left, recipe details right, actions pinned to the bottom.
 * `currentUser` is the signed-in user's profile (all cards belong to them).
 */
export default function MyRecipeCard({ recipe, currentUser, onRemoved }) {
  const [removing, setRemoving] = useState(false);
  const [imgStage, setImgStage] = useState(0);
  const [avatarError, setAvatarError] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      const res = await fetch("/api/recipes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId: recipe.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Could not remove this recipe");
        return;
      }
      toast.success("Recipe removed");
      onRemoved?.(recipe.id);
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setRemoving(false);
    }
  };

  const diff = DIFFICULTY[recipe.difficulty] || DIFFICULTY.Medium;
  const creatorName = currentUser?.name || "You";
  const creatorAvatar = currentUser?.avatar;

  const showPlaceholder = !recipe.image || imgStage >= 2;
  const imgSrc = imgStage === 1 ? FALLBACK_IMAGE : recipe.image;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="group flex flex-col gap-4 overflow-hidden rounded-[24px] border border-white/70 bg-white/70 p-4 shadow-[0_14px_34px_rgba(111,80,50,0.09)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_26px_52px_-18px_rgba(249,115,22,0.22)] sm:flex-row sm:items-stretch sm:gap-5 sm:p-4"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl bg-stone-100 sm:aspect-auto sm:h-64 sm:w-72">
        {showPlaceholder ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/70 text-orange-400 shadow-sm">
              <ChefHat size={24} />
            </span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={`${recipe.title} photo`}
            loading="lazy"
            decoding="async"
            onError={() => setImgStage((stage) => stage + 1)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="min-w-0 flex-1 text-[17px] font-extrabold leading-snug tracking-tight text-[#111827] transition-colors duration-300 group-hover:text-[#ea580c]">
            {recipe.title}
          </h3>
          <span className="shrink-0 rounded-full bg-gradient-to-r from-[#ea580c] to-[#fb923c] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-[0_4px_10px_rgba(249,115,22,0.28)]">
            {recipe.cuisine || "Homemade"}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 rounded-full border border-white/70 bg-white/80 px-2.5 py-1 text-[10px] font-bold text-[#61564a] shadow-sm">
            <Clock size={11} className="text-[#f97316]" />
            {recipe.prepTime || "20 min"}
          </span>
          <span className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${diff}`}>
            {recipe.difficulty || "Medium"}
          </span>
          <span className="flex items-center gap-1 rounded-full border border-white/70 bg-white/80 px-2.5 py-1 text-[10px] font-bold text-[#61564a] shadow-sm">
            <Star size={11} fill="#f97316" className="text-[#f97316]" />
            {(recipe.rating ?? 4.5).toFixed(1)}
          </span>
        </div>

        {recipe.description ? (
          <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-[#61564a]">
            {recipe.description}
          </p>
        ) : null}

        <div className="mt-3 flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-100 to-amber-100 ring-2 ring-[#fed7aa]/70">
            {creatorAvatar && !avatarError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={creatorAvatar}
                alt=""
                loading="lazy"
                decoding="async"
                onError={() => setAvatarError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={14} className="text-[#ea580c]" />
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-bold text-[#111827]">{creatorName}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c]">
              Your recipe
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col-reverse items-stretch gap-2.5 border-t border-[#f0e8dc] pt-4 sm:mt-auto sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleRemove}
            disabled={removing}
            aria-label={`Remove ${recipe.title}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 transition-all duration-200 hover:bg-rose-100 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {removing ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
            {removing ? "Removing…" : "Remove"}
          </button>

          <Link
            href={`/recipes/${recipe.id}`}
            className="group/view inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-[#fdba74] bg-[#fff7ed] px-5 py-2.5 text-xs font-bold text-[#ea580c] shadow-[0_4px_14px_rgba(249,115,22,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f97316] hover:bg-gradient-to-r hover:from-[#ea580c] hover:to-[#fb923c] hover:text-white hover:shadow-[0_10px_22px_rgba(249,115,22,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316] sm:w-auto sm:px-6"
          >
            View Recipe
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover/view:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
