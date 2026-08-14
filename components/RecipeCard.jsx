"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import { Clock, Star, Heart, Bookmark, BadgeCheck, ArrowRight, Loader2 } from "lucide-react";

const easeOut = [0.22, 1, 0.36, 1];

const DIFFICULTY_STYLES = {
  Easy: "bg-[#22c55e]/15 text-[#15803d] border-[#22c55e]/30",
  Medium: "bg-[#f59e0b]/15 text-[#b45309] border-[#f59e0b]/30",
  Hard: "bg-[#ef4444]/15 text-[#b91c1c] border-[#ef4444]/30",
};

const DIFFICULTY_DOTS = {
  Easy: "bg-[#22c55e]",
  Medium: "bg-[#f59e0b]",
  Hard: "bg-[#ef4444]",
};

export default function RecipeCard({ recipe }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [busy, setBusy] = useState({ saved: false, bookmarked: false });

  const toggleSave = async (kind, active, setActive) => {
    const next = !active;
    setActive(next);
    setBusy((p) => ({ ...p, [kind]: true }));
    try {
      const res = await fetch(`/api/${kind}`, {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId: recipe.id }),
      });
      if (res.status === 401) {
        toast.error("Sign in to save recipes");
        router.push(`/sign-in?redirectTo=/`);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Could not update your list");
        setActive(active);
        return;
      }
      if (kind === "saved-recipes") {
        toast.success(next ? "Recipe saved for later" : "Removed from saved recipes");
      } else {
        toast.success(next ? "Added to favorites" : "Removed from favorites");
      }
    } catch {
      toast.error("Network error — please try again");
      setActive(active);
    } finally {
      setBusy((p) => ({ ...p, [kind]: false }));
    }
  };

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 32 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
      }}
      whileHover={{ y: -8 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_14px_36px_rgba(111,80,50,0.08)] transition-shadow duration-500 hover:shadow-[0_36px_72px_-20px_rgba(111,80,50,0.22),0_12px_28px_-8px_rgba(249,115,22,0.16)]"
    >
      {/* ── Image ── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 via-black/15 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Cooking time badge */}
        <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full border border-white/60 bg-white/80 px-3 py-1.5 text-[11px] font-bold text-[#111827] shadow-[0_6px_16px_rgba(0,0,0,0.12)] backdrop-blur-md">
          <Clock size={11} className="text-[#f97316]" />
          {recipe.prepTime}
        </div>

        {/* Action buttons */}
        <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
          <motion.button
            type="button"
            aria-label="Bookmark recipe"
            aria-pressed={bookmarked}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.82 }}
            disabled={busy.bookmarked}
            onClick={() => toggleSave("saved-recipes", bookmarked, setBookmarked)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/80 shadow-[0_6px_16px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors disabled:cursor-wait disabled:opacity-70"
          >
            <motion.span
              animate={busy.bookmarked ? { rotate: 360 } : bookmarked ? { rotate: [0, -18, 14, 0] } : { rotate: 0 }}
              transition={busy.bookmarked ? { duration: 0.8, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
              className={bookmarked ? "text-[#f97316]" : "text-[#8a7d6d]"}
            >
              {busy.bookmarked ? <Loader2 size={13} /> : <Bookmark size={13} fill={bookmarked ? "currentColor" : "none"} />}
            </motion.span>
          </motion.button>

          <motion.button
            type="button"
            aria-label="Save to favorites"
            aria-pressed={saved}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.82 }}
            disabled={busy.saved}
            onClick={() => toggleSave("favorites", saved, setSaved)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/80 shadow-[0_6px_16px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors disabled:cursor-wait disabled:opacity-70"
          >
            <motion.span
              animate={busy.saved ? { rotate: 360 } : saved ? { scale: [1, 1.45, 1] } : { scale: 1 }}
              transition={busy.saved ? { duration: 0.8, repeat: Infinity, ease: "linear" } : { duration: 0.45, ease: easeOut }}
              className={saved ? "text-[#ef4444]" : "text-[#8a7d6d]"}
            >
              {busy.saved ? <Loader2 size={13} /> : <Heart size={13} fill={saved ? "currentColor" : "none"} />}
            </motion.span>
          </motion.button>
        </div>

        {/* Cuisine chip */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2">
          <span className="rounded-full bg-gradient-to-r from-[#ea580c] to-[#fb923c] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-[0_6px_16px_rgba(249,115,22,0.4)]">
            {recipe.cuisine}
          </span>
          <span
            className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold backdrop-blur-md ${DIFFICULTY_STYLES[recipe.difficulty] || DIFFICULTY_STYLES.Medium}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${DIFFICULTY_DOTS[recipe.difficulty] || DIFFICULTY_DOTS.Medium}`}
            />
            {recipe.difficulty}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-1 text-[17px] font-extrabold tracking-tight text-[#111827] transition-colors duration-300 group-hover:text-[#ea580c]">
          {recipe.title}
        </h3>

        {/* Rating row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#111827]">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-[#f97316] to-[#fb923c] shadow-[0_4px_10px_rgba(249,115,22,0.35)]">
              <Star size={12} fill="white" className="text-white" />
            </span>
            {recipe.rating.toFixed(1)}
            <span className="font-medium text-[#a09485]">
              ({recipe.reviewsCount})
            </span>
          </div>
        </div>

        <hr className="border-[#f0e8dc]/70" />

        {/* Author + CTA */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-[#fed7aa]/70">
              <Image
                src={recipe.chef.avatar}
                alt={recipe.chef.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="truncate text-[11.5px] font-bold text-[#111827]">
                  {recipe.chef.name}
                </span>
                <BadgeCheck size={13} className="shrink-0 text-[#22c55e]" />
              </div>
              <p className="text-[10px] font-semibold text-[#a09485]">Verified Chef</p>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={() => router.push(`/recipes/${recipe.id}`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="group/cta flex shrink-0 items-center gap-1 rounded-full border border-[#fed7aa]/80 bg-[#fff7ed] px-3.5 py-2 text-[11px] font-bold text-[#ea580c] shadow-[0_4px_12px_rgba(249,115,22,0.12)] transition-all duration-300 hover:bg-gradient-to-r hover:from-[#ea580c] hover:to-[#fb923c] hover:text-white hover:shadow-[0_10px_22px_rgba(249,115,22,0.35)]"
          >
            View Recipe
            <ArrowRight
              size={12}
              className="transition-transform duration-300 group-hover/cta:translate-x-0.5"
            />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
