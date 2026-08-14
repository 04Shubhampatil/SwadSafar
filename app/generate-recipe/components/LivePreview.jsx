"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ChefHat,
  Clock,
  Flame,
  Globe,
  Lightbulb,
  ListChecks,
  Users,
} from "lucide-react";
import { TIPS } from "./constants";

const EASE = [0.22, 1, 0.36, 1];

function LiveValue({ value, className = "" }) {
  return (
    <motion.span
      key={String(value)}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className={className}
    >
      {value}
    </motion.span>
  );
}

function SkeletonLines() {
  return (
    <div className="space-y-2.5 p-4">
      {[70, 100, 88].map((w, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.35, 0.75, 0.35] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
          className="h-3 rounded-full bg-[#FDE8D3]"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

/* ── Live recipe preview ───────────────────────────────── */

export function PreviewCard({ recipe, generating, nutrition }) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const title = recipe.title.trim() || "Your Recipe Title";
  const hasImage = Boolean(recipe.image?.preview);

  return (
    <div className="overflow-hidden rounded-3xl border border-[#F3F4F6] bg-white shadow-[0_18px_44px_-18px_rgba(111,80,50,0.16)]">
      <div className="flex items-center justify-between border-b border-[#F3F4F6] bg-[#FFFCF8] px-5 py-3.5">
        <p className="flex items-center gap-2 text-[13px] font-extrabold tracking-tight text-[#111827]">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF0E3] text-[#f97316]">
            <ChefHat size={15} />
          </span>
          Live preview
        </p>
        <span className="flex items-center gap-1.5 rounded-full bg-[#22c55e]/10 px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wide text-[#16a34a]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22c55e]" />
          Updating
        </span>
      </div>

      {generating ? (
        <SkeletonLines />
      ) : (
        <>
          <div className="relative h-36 w-full">
            {hasImage ? (
              <Image
                src={recipe.image.preview}
                alt="Recipe preview"
                fill
                unoptimized
                sizes="400px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#FFF0E3] to-[#FFE7D3] text-[#f97316]/70">
                <ChefHat size={30} strokeWidth={1.6} />
                <p className="text-[11.5px] font-semibold text-[#c2410c]/70">
                  Add a photo to preview
                </p>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/25 to-transparent" />
          </div>

          <div className="p-4">
            <h3 className="truncate text-[15.5px] font-extrabold tracking-tight text-[#111827]">
              <LiveValue value={title} />
            </h3>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { label: "Total time", value: `${totalTime} min`, Icon: Clock },
                {
                  label: "Calories",
                  value: nutrition ? `${nutrition.calories} kcal` : `${recipe.calories} kcal`,
                  Icon: Flame,
                },
                { label: "Ingredients", value: recipe.ingredients.length, Icon: ListChecks },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#F3F4F6] bg-[#FFFCF8] px-2.5 py-2 text-center"
                >
                  <stat.Icon size={13} className="mx-auto text-[#f97316]" />
                  <p className="mt-1 truncate text-[12.5px] font-extrabold text-[#111827]">
                    <LiveValue value={stat.value} />
                  </p>
                  <p className="text-[9.5px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {recipe.difficulty && (
                <span className="rounded-full border border-[#F3F4F6] bg-[#FFFCF8] px-2.5 py-1 text-[11px] font-bold text-[#6b7280]">
                  {recipe.difficulty}
                </span>
              )}
              {recipe.cuisine && (
                <span className="flex items-center gap-1 rounded-full border border-[#F3F4F6] bg-[#FFFCF8] px-2.5 py-1 text-[11px] font-bold text-[#6b7280]">
                  <Globe size={11} className="text-[#f97316]" />
                  {recipe.cuisine}
                </span>
              )}
              <span className="flex items-center gap-1 rounded-full border border-[#F3F4F6] bg-[#FFFCF8] px-2.5 py-1 text-[11px] font-bold text-[#6b7280]">
                <Users size={11} className="text-[#f97316]" />
                Serves {recipe.servings}
              </span>
              {recipe.dietary.slice(0, 2).map((d) => (
                <span
                  key={d}
                  className="rounded-full bg-gradient-to-r from-[#FFF0E2] to-[#FFE7D3] px-2.5 py-1 text-[11px] font-bold text-[#c2410c]"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Readiness / validation ────────────────────────────── */

export function ReadinessCard({ checks }) {
  const done = checks.filter((c) => c.state === "ok").length;
  const pct = Math.round((done / Math.max(checks.length, 1)) * 100);

  const styleFor = (state) => {
    if (state === "ok") return "text-[#16a34a] bg-[#16a34a]/8 border-[#16a34a]/20";
    if (state === "warn") return "text-[#b45309] bg-[#f59e0b]/8 border-[#f59e0b]/20";
    return "text-[#ef4444] bg-[#ef4444]/8 border-[#ef4444]/20";
  };
  const markFor = (state) => (state === "ok" ? "✔" : state === "warn" ? "⚠" : "❌");

  return (
    <div className="rounded-3xl border border-[#F3F4F6] bg-white p-5 shadow-[0_18px_44px_-18px_rgba(111,80,50,0.16)]">
      <div className="flex items-center justify-between">
        <p className="text-[13.5px] font-extrabold tracking-tight text-[#111827]">Readiness</p>
        <motion.span
          key={pct}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-[13px] font-extrabold ${pct === 100 ? "text-[#16a34a]" : "text-[#f97316]"}`}
        >
          {pct}%
        </motion.span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: EASE }}
          className={`h-full rounded-full ${
            pct === 100
              ? "bg-gradient-to-r from-[#22c55e] to-[#4ade80]"
              : "bg-gradient-to-r from-[#F97316] to-[#FB923C]"
          }`}
        />
      </div>

      <div className="mt-4 space-y-2">
        {checks.map((check) => (
          <div
            key={check.id}
            className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 transition-all duration-300 ${styleFor(check.state)}`}
          >
            <span className="text-[12.5px] font-bold">{check.label}</span>
            <span className="text-[12px] font-semibold">{markFor(check.state)} {check.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Pro tips ──────────────────────────────────────────── */

export function ProTips() {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/40 p-5 backdrop-blur-xl">
      <p className="flex items-center gap-2 text-[13.5px] font-extrabold tracking-tight text-[#111827]">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f59e0b]/15 text-[#b45309]">
          <Lightbulb size={15} />
        </span>
        Pro tips
      </p>
      <div className="mt-3 space-y-3">
        {TIPS.map((tip) => (
          <div key={tip.title} className="flex gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#fb923c]" />
            <div>
              <p className="text-[12.5px] font-bold text-[#111827]">{tip.title}</p>
              <p className="text-[11.5px] leading-relaxed text-[#6b7280]">{tip.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

