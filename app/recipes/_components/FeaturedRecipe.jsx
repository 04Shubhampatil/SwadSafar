"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Star,
  Clock,
  Flame,
  ArrowRight,
  Bookmark,
  BadgeCheck,
  Sparkles,
  Users,
  ChefHat,
} from "lucide-react";

const easeOut = [0.22, 1, 0.36, 1];

export default function FeaturedRecipe({ recipe }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  return (
    <motion.section
      aria-label="Featured recipe"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: easeOut }}
      className="group relative overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_30px_70px_-24px_rgba(111,80,50,0.24),0_14px_32px_-12px_rgba(249,115,22,0.14)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* ── Image side ── */}
        <div className="relative min-h-[300px] overflow-hidden lg:min-h-full">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
          />
          {/* Soft glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/20 via-transparent to-transparent" />

          {/* Featured badge */}
          <motion.span
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#fb923c] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_rgba(249,115,22,0.5)]"
          >
            <Sparkles size={13} fill="currentColor" />
            Chef&apos;s Pick
          </motion.span>

          {/* Floating chips */}
          {[
            { Icon: Star, label: `${recipe.rating.toFixed(1)} Rating`, cls: "text-[#f97316]", delay: "0.4s", pos: "bottom-24 left-5" },
            { Icon: Clock, label: recipe.prepTime, cls: "text-[#f97316]", delay: "1.2s", pos: "bottom-5 left-5" },
            { Icon: Flame, label: `${recipe.caloriesNum} kcal`, cls: "text-[#f97316]", delay: "2s", pos: "bottom-5 left-[8.4rem] hidden sm:flex" },
          ].map(({ Icon, label, cls, delay, pos }) => (
            <div key={label} className={`absolute ${pos}`}>
              <div className="fd-float" style={{ animationDelay: delay }}>
                <span className="flex items-center gap-1.5 rounded-full border border-white/50 bg-white/75 px-3.5 py-2 text-[11px] font-bold text-[#111827] shadow-[0_10px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                  <Icon size={12} className={cls} />
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Content side ── */}
        <div className="relative flex flex-col justify-center gap-5 overflow-hidden p-8 sm:p-10 lg:p-12">
          {/* Ambient decor */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#fdba74]/25 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#fde68a]/30 blur-3xl" />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#ea580c]"
          >
            <span className="h-px w-9 bg-gradient-to-r from-transparent to-[#f97316]" />
            Featured this week
          </motion.p>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="text-3xl font-extrabold leading-[1.1] tracking-[-0.03em] text-[#111827] sm:text-4xl [font-family:var(--font-display)]"
          >
            {recipe.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="fd-text-gradient">{recipe.title.split(" ").slice(-1)}</span>
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-md text-sm leading-relaxed text-[#7c7267]"
          >
            {recipe.description}
          </motion.p>

          {/* Chef row */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.36 }}
            className="flex items-center gap-3"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[#fed7aa]/80">
              <Image
                src={recipe.chef.avatar}
                alt={recipe.chef.name}
                fill
                sizes="48px"
                className="object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow">
                <BadgeCheck size={13} className="text-[#22c55e]" />
              </span>
            </div>
            <div>
              <p className="text-[13px] font-extrabold text-[#111827]">{recipe.chef.name}</p>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#a09485]">
                <Star size={11} fill="#f97316" className="text-[#f97316]" />
                {recipe.chefRating} chef rating · Verified
              </p>
            </div>
          </motion.div>

          {/* Meta chips */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.42 }}
            className="flex flex-wrap items-center gap-2.5"
          >
            {[
              { Icon: Clock, label: recipe.prepTime },
              { Icon: ChefHat, label: recipe.difficulty },
              { Icon: Flame, label: `${recipe.caloriesNum} kcal` },
              { Icon: Users, label: `${recipe.serves} servings` },
            ].map(({ Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 rounded-full border border-[#f0e8dc] bg-white/70 px-3.5 py-2 text-[11px] font-bold text-[#61564a] backdrop-blur-md transition-colors hover:border-[#fed7aa]"
              >
                <Icon size={13} className="text-[#f97316]" />
                {label}
              </span>
            ))}
          </motion.div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-1 flex flex-wrap items-center gap-3"
          >
            <motion.button
              type="button"
              onClick={() => router.push(`/recipes/${recipe.id}`)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              className="fd-ripple-host fd-sheen fd-gradient-btn group/cta flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-[0_16px_34px_rgba(249,115,22,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
            >
              View Recipe
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover/cta:translate-x-1.5"
              />
            </motion.button>

            <motion.button
              type="button"
              aria-pressed={saved}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setSaved((p) => !p)}
              className="flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-6 py-3.5 text-sm font-bold text-[#111827] shadow-[0_10px_24px_rgba(111,80,50,0.1)] backdrop-blur-xl transition-colors hover:text-[#ea580c]"
            >
              <motion.span
                animate={saved ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.45 }}
                className={saved ? "text-[#f97316]" : "text-[#a09485]"}
              >
                <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
              </motion.span>
              {saved ? "Saved" : "Save for Later"}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
