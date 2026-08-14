"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import {
  Clock,
  Star,
  Heart,
  Bookmark,
  BadgeCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";

const easeOut = [0.22, 1, 0.36, 1];

const DIFFICULTY = {
  Easy: { chip: "border-[#22c55e]/30 bg-[#22c55e]/15 text-[#15803d]", dot: "bg-[#22c55e]" },
  Medium: { chip: "border-[#f59e0b]/30 bg-[#f59e0b]/15 text-[#b45309]", dot: "bg-[#f59e0b]" },
  Hard: { chip: "border-[#ef4444]/30 bg-[#ef4444]/15 text-[#b91c1c]", dot: "bg-[#ef4444]" },
};

export default function RecipeCard({ recipe }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [busy, setBusy] = useState({ saved: false, bookmarked: false });

  const diff = DIFFICULTY[recipe.difficulty] || DIFFICULTY.Medium;

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
        router.push(`/sign-in?redirectTo=/recipes`);
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
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
      }}
      whileHover={{ y: -8 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_14px_36px_rgba(111,80,50,0.08)] transition-shadow duration-500 hover:shadow-[0_40px_80px_-24px_rgba(111,80,50,0.24),0_16px_32px_-12px_rgba(249,115,22,0.18)]"
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
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Cooking time badge */}
        <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full border border-white/60 bg-white/80 px-3 py-1.5 text-[11px] font-bold text-[#111827] shadow-[0_6px_16px_rgba(0,0,0,0.12)] backdrop-blur-md">
          <Clock size={11} className="text-[#f97316]" />
          {recipe.prepTime}
        </div>

        {/* Favorite + bookmark */}
        <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
          <motion.button
            type="button"
            aria-label="Bookmark recipe"
            aria-pressed={bookmarked}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.8 }}
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
            whileTap={{ scale: 0.8 }}
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

        {/* Difficulty + rating badges */}
        <div className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-between">
          <span
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold backdrop-blur-md ${diff.chip}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${diff.dot}`} />
            {recipe.difficulty}
          </span>
          <span className="flex items-center gap-1 rounded-full border border-white/60 bg-black/25 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
            <Star size={10} fill="#f97316" className="text-[#f97316]" />
            {recipe.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col gap-3.5 p-5">
        <h3 className="line-clamp-1 text-[16px] font-extrabold tracking-tight text-[#111827] transition-colors duration-300 group-hover:text-[#ea580c]">
          {recipe.title}
        </h3>

        {/* Chef row */}
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-[#fed7aa]/70">
            <Image
              src={recipe.chef.avatar}
              alt={recipe.chef.name}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="truncate text-[11.5px] font-bold text-[#111827]">
                {recipe.chef.name}
              </span>
              <BadgeCheck size={13} className="shrink-0 text-[#22c55e]" />
            </div>
            <p className="text-[10px] font-semibold text-[#a09485]">
              Verified Chef ·{" "}
              <span className="text-[#f97316]">
                ★ {recipe.chefRating}
              </span>
            </p>
          </div>
        </div>



        {/* CTA */}
        <motion.button
          type="button"
          onClick={() => router.push(`/recipes/${recipe.id}`)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="group/cta mt-auto flex items-center justify-center gap-2 rounded-full border border-[#fed7aa]/80 bg-[#fff7ed] px-4 py-2.5 text-xs font-bold text-[#ea580c] transition-all duration-300 hover:bg-gradient-to-r hover:from-[#ea580c] hover:to-[#fb923c] hover:text-white hover:shadow-[0_12px_26px_rgba(249,115,22,0.35)]"
        >
          View Recipe
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover/cta:translate-x-1"
          />
        </motion.button>
      </div>
    </motion.article>
  );
}
