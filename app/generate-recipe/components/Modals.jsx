"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Check,
  ChefHat,
  Clock,
  Flame,
  Globe,
  ListChecks,
  Users,
  X,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

function useScrollLock(open) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
}

const CONFETTI = Array.from({ length: 16 }).map((_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  return {
    x: Math.cos(angle) * (90 + Math.random() * 60),
    y: Math.sin(angle) * (90 + Math.random() * 60),
    color: ["#F97316", "#FB923C", "#fdba74", "#22c55e", "#fde68a", "#f97316"][i % 6],
    size: 5 + Math.random() * 5,
    delay: Math.random() * 0.15,
    rotate: Math.random() * 360,
  };
});

/* ── Recipe preview modal ──────────────────────────────── */

export function PreviewModal({ open, onClose, recipe, nutrition }) {
  useScrollLock(open);
  const hasImage = Boolean(recipe.image?.preview);
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[#0f172a]/55 p-4 backdrop-blur-sm sm:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-white/60 bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]"
          >
            <div className="relative h-44 w-full">
              {hasImage ? (
                <Image
                  src={recipe.image.preview}
                  alt={recipe.title}
                  fill
                  unoptimized
                  sizes="512px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFF0E3] to-[#FFE7D3] text-[#f97316]">
                  <ChefHat size={42} strokeWidth={1.6} />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close preview"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#6b7280] shadow-sm transition-all duration-200 hover:scale-105 hover:text-[#111827]"
              >
                <X size={17} />
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <p className="truncate text-[20px] font-extrabold tracking-tight text-white drop-shadow">
                  {recipe.title.trim() || "Your Recipe Title"}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] font-bold text-white/95">
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {totalTime} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame size={11} /> {nutrition ? nutrition.calories : recipe.calories} kcal
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={11} /> {recipe.servings} servings
                  </span>
                  {recipe.cuisine && (
                    <span className="flex items-center gap-1">
                      <Globe size={11} /> {recipe.cuisine}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="max-h-[46vh] overflow-y-auto px-5 py-4">
              {recipe.dietary.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {recipe.dietary.map((d) => (
                    <span
                      key={d}
                      className="rounded-full bg-gradient-to-r from-[#FFF0E2] to-[#FFE7D3] px-2.5 py-1 text-[11px] font-bold text-[#c2410c]"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              )}

              <div className="mb-5">
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#9ca3af]">
                  <ListChecks size={13} className="text-[#f97316]" />
                  Ingredients
                </p>
                {recipe.ingredients.length ? (
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {recipe.ingredients.map((ing) => (
                      <li key={ing.id} className="flex items-baseline gap-1.5 text-[13px] font-medium text-[#374151]">
                        {ing.quantity && (
                          <span className="shrink-0 text-[12px] font-bold text-[#f97316]">{ing.quantity}</span>
                        )}
                        <span className="truncate">{ing.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[12.5px] text-[#9ca3af]">No ingredients yet.</p>
                )}
              </div>

              <div>
                <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#9ca3af]">
                  Instructions
                </p>
                {recipe.instructions.length ? (
                  <ol className="space-y-2.5">
                    {recipe.instructions.map((step, i) => (
                      <li key={step.id} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#F97316] to-[#FB923C] text-[11px] font-extrabold text-white">
                          {i + 1}
                        </span>
                        <span className="text-[13px] leading-relaxed text-[#374151]">{step.text}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-[12.5px] text-[#9ca3af]">No instructions yet.</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-[#F3F4F6] px-5 py-4">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-2xl border border-[#F3F4F6] bg-white px-5 text-[13.5px] font-bold text-[#6b7280] transition-all duration-200 hover:-translate-y-0.5 hover:text-[#111827]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-6 text-[13.5px] font-bold text-white shadow-[0_10px_22px_rgba(249,115,22,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(249,115,22,0.45)]"
              >
                Looks delicious ✨
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Publish success modal ─────────────────────────────── */

export function SuccessModal({ open, onClose, title }) {
  useScrollLock(open);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0f172a]/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/60 bg-white px-8 py-10 text-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]"
          >
            {CONFETTI.map((c, i) => (
              <motion.span
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                animate={{ x: c.x, y: c.y, opacity: 0, scale: 0.4, rotate: c.rotate }}
                transition={{ duration: 0.9, delay: 0.35 + c.delay, ease: EASE }}
                className="pointer-events-none absolute left-1/2 top-10 rounded-[2px]"
                style={{ width: c.size, height: c.size, background: c.color }}
              />
            ))}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] shadow-[0_16px_40px_rgba(34,197,94,0.45)]"
            >
              <svg viewBox="0 0 52 52" className="h-11 w-11">
                <motion.path
                  fill="none"
                  d="M14 27l8 8 16-18"
                  stroke="#fff"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
                />
              </svg>
            </motion.div>

            <h3 className="mt-6 text-[22px] font-extrabold tracking-tight text-[#111827]">
              Recipe published!
            </h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[#6b7280]">
              <span className="font-bold text-[#111827]">{title || "Your recipe"}</span> is now
              live for thousands of food lovers. You can always edit it later.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] text-[14px] font-bold text-white shadow-[0_12px_26px_rgba(249,115,22,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(249,115,22,0.45)] active:scale-[0.98]"
            >
              <Check size={16} strokeWidth={3} />
              Done
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
