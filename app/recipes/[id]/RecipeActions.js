"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Bookmark, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RecipeActions({ recipeId }) {
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
        body: JSON.stringify({ recipeId }),
      });
      if (res.status === 401) {
        toast.error("Sign in to save recipes");
        router.push(`/sign-in?redirectTo=/recipes/${recipeId}`);
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
    <>
      <motion.button
        type="button"
        aria-label="Bookmark recipe"
        aria-pressed={bookmarked}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.85 }}
            disabled={busy.bookmarked}
            onClick={() => toggleSave("saved-recipes", bookmarked, setBookmarked)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/80 shadow-lg backdrop-blur-md transition-colors disabled:cursor-wait disabled:opacity-70"
      >
        {busy.bookmarked ? (
          <Loader2 size={18} className="animate-spin text-[#8a7d6d]" />
        ) : (
          <Bookmark
            size={18}
            fill={bookmarked ? "currentColor" : "none"}
            className={bookmarked ? "text-[#f97316]" : "text-[#8a7d6d]"}
          />
        )}
      </motion.button>

      <motion.button
        type="button"
        aria-label="Save to favorites"
        aria-pressed={saved}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.85 }}
        disabled={busy.saved}
        onClick={() => toggleSave("favorites", saved, setSaved)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/80 shadow-lg backdrop-blur-md transition-colors disabled:cursor-wait disabled:opacity-70"
      >
        {busy.saved ? (
          <Loader2 size={18} className="animate-spin text-[#8a7d6d]" />
        ) : (
          <Heart
            size={18}
            fill={saved ? "currentColor" : "none"}
            className={saved ? "text-[#ef4444]" : "text-[#8a7d6d]"}
          />
        )}
      </motion.button>
    </>
  );
}
