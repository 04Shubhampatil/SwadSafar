"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Search,
  ArrowRight,
  Play,
  Star,
  Clock,
  Heart,
  ChefHat,
  Zap,
  Users,
  Flame,
} from "lucide-react";

/* ── Decorative ingredients ─────────────────────────── */

const BasilLeaf = () => (
  <svg viewBox="0 0 44 44" width="44" height="44" fill="none" aria-hidden="true">
    <path
      d="M22 42C11 33 6 19 13 8C22 3 33 10 35 19C36.5 29 31 39 22 42Z"
      fill="url(#basil-g)"
    />
    <path d="M22 42L22 14" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M22 30C18 25 17 19 20 15M22 22C25 18 27 14 26 10" stroke="#15803d" strokeWidth="1.6" strokeLinecap="round" />
    <defs>
      <linearGradient id="basil-g" x1="10" y1="8" x2="30" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4ade80" />
        <stop offset="1" stopColor="#16a34a" />
      </linearGradient>
    </defs>
  </svg>
);

const Tomato = () => (
  <svg viewBox="0 0 44 46" width="42" height="44" fill="none" aria-hidden="true">
    <path d="M22 16C18 6 7 7 5 13C3.6 17.8 12 21 22 16Z" fill="#22c55e" />
    <path d="M22 16C24 8 31 5 34 9C36.5 12 31 17 22 16Z" fill="#16a34a" />
    <rect x="21" y="2" width="2.4" height="9" rx="1.2" fill="#15803d" />
    <circle cx="22" cy="29" r="15" fill="url(#tomato-g)" />
    <circle cx="17" cy="23" r="4" fill="#fecaca" opacity="0.6" />
    <defs>
      <radialGradient id="tomato-g" cx="0.35" cy="0.3" r="1">
        <stop stopColor="#f87171" />
        <stop offset="0.6" stopColor="#ef4444" />
        <stop offset="1" stopColor="#b91c1c" />
      </radialGradient>
    </defs>
  </svg>
);

const Garlic = () => (
  <svg viewBox="0 0 40 50" width="40" height="50" fill="none" aria-hidden="true">
    <path
      d="M20 48C10 48 6 40 6 30C6 20 11 15 13 9C14.2 5.6 16 3.5 20 3.5C24 3.5 25.8 5.6 27 9C29 15 34 20 34 30C34 40 30 48 20 48Z"
      fill="url(#garlic-g)"
    />
    <path d="M20 10C20 16 20 30 20 44" stroke="#d6d3d1" strokeWidth="2" />
    <path d="M20 16C15 14 13 10 14 6M20 24C25 22 27 18 26 14" stroke="#e7e5e4" strokeWidth="1.6" strokeLinecap="round" />
    <defs>
      <linearGradient id="garlic-g" x1="10" y1="4" x2="30" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fffdf7" />
        <stop offset="0.5" stopColor="#f5efe4" />
        <stop offset="1" stopColor="#e4dcc8" />
      </linearGradient>
    </defs>
  </svg>
);

const Cheese = () => (
  <svg viewBox="0 0 48 42" width="46" height="40" fill="none" aria-hidden="true">
    <path d="M5 38L18 6L43 14L43 38H5Z" fill="url(#cheese-g)" />
    <circle cx="30" cy="24" r="3.2" fill="#f59e0b" />
    <circle cx="17" cy="28" r="2.4" fill="#d97706" />
    <circle cx="36" cy="20" r="2" fill="#d97706" />
    <circle cx="24" cy="34" r="2" fill="#f59e0b" />
    <path d="M18 6L23 14H8.5L18 6Z" fill="#fef08a" />
    <defs>
      <linearGradient id="cheese-g" x1="8" y1="6" x2="40" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="0.55" stopColor="#fde047" />
        <stop offset="1" stopColor="#facc15" />
      </linearGradient>
    </defs>
  </svg>
);

/* ── Small helpers ──────────────────────────────────── */

const easeOut = [0.22, 1, 0.36, 1];

function spawnRipple(ref, event) {
  const el = ref.current;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement("span");
  ripple.className = "fd-ripple";
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  el.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 850);
}

const FloatingStat = ({
  icon,
  iconClass,
  title,
  subtitle,
  className,
  floatDelay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7, delay: floatDelay, ease: easeOut }}
    whileHover={{ scale: 1.08, y: -6, transition: { type: "spring", stiffness: 380, damping: 18 } }}
    className={`absolute z-20 ${className}`}
  >
    <div className="fd-float cursor-default" style={{ animationDelay: `${floatDelay}s` }}>
      <div className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/75 p-3 pr-4 shadow-[0_16px_36px_rgba(111,80,50,0.16),0_4px_12px_rgba(111,80,50,0.06)] backdrop-blur-xl">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_6px_14px_rgba(249,115,22,0.32)] ${iconClass}`}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-extrabold leading-tight tracking-tight text-[#111827]">
            {title}
          </p>
          <p className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-[#8a7d6d]">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function HeroSection() {
  const router = useRouter();
  const searchBtnRef = useRef(null);
  const exploreBtnRef = useRef(null);
  const [saved, setSaved] = useState(false);
  const [heroQuery, setHeroQuery] = useState("");

  const handleHeroSearch = () => {
    const q = heroQuery.trim();
    if (q) router.push(`/recipes?q=${encodeURIComponent(q)}`);
    else router.push("/recipes");
  };

  return (
    <section
      aria-label="Hero section"
      className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden bg-transparent py-12 lg:py-20"
    >
      {/* ── Ambient background layers ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="fd-noise absolute inset-0 opacity-[0.35] mix-blend-multiply" />
        <div className="fd-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_72%)]" />
        <div className="fd-blob absolute -left-48 -top-40 h-[560px] w-[560px] rounded-full bg-[#fdba74]/35 blur-3xl" />
        <div
          className="fd-blob absolute -right-40 top-[18%] h-[500px] w-[500px] rounded-full bg-[#f97316]/15 blur-3xl"
          style={{ animationDelay: "5s" }}
        />
        <div
          className="fd-blob absolute -bottom-48 left-[30%] h-[480px] w-[480px] rounded-full bg-[#fde68a]/40 blur-3xl"
          style={{ animationDelay: "10s" }}
        />
        <div className="fd-dots absolute bottom-[16%] left-[4%] h-48 w-48 opacity-50" />
        <div className="fd-drift absolute left-[6%] top-[22%] h-14 w-14 rounded-full border border-[#fec9a3]/70 bg-white/50 shadow-[0_8px_24px_rgba(249,115,22,0.08)] backdrop-blur-sm" />
        <div
          className="fd-drift absolute right-[8%] top-[12%] h-9 w-9 rounded-full bg-[#f97316]/15"
          style={{ animationDelay: "2.4s" }}
        />
        <div
          className="fd-drift absolute bottom-[22%] right-[6%] h-12 w-12 rounded-full border-2 border-dashed border-[#fec9a3]/60 bg-white/40"
          style={{ animationDelay: "4.8s" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl flex-1 grid grid-cols-1 items-center gap-14 px-6 sm:px-12 lg:grid-cols-2 lg:gap-8 lg:px-16">
        {/* ══════════════ LEFT COLUMN ══════════════ */}
        <div className="flex max-w-xl flex-col justify-center gap-9">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="flex w-fit items-center gap-2.5 rounded-full border border-[#fed7aa]/80 bg-white/60 px-4 py-2 shadow-[0_8px_24px_rgba(249,115,22,0.1)] backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="fd-pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#22c55e]" />
            </span>
            <Users size={14} className="shrink-0 text-[#f97316]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#9a3412]">
              10K+ Happy Cooks
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: easeOut }}
            className="text-5xl font-extrabold leading-[1.04] tracking-[-0.03em] text-[#111827] sm:text-6xl xl:text-7xl [font-family:var(--font-display)]"
          >
            Discover
            <br />
            Delicious
            <br />
            <span className="fd-text-gradient">Recipes</span>
          </motion.h1>

          {/* Sub-text */}
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.16, ease: easeOut }}
            className="max-w-md text-[15px] leading-relaxed text-[#7c7267]"
          >
            Explore a variety of recipes crafted with love and flavor.
            From quick bites to gourmet meals, bring your cooking journey to life.
          </motion.p>

          {/* Premium Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24, ease: easeOut }}
          >
            <div
              role="search"
              className="group relative flex max-w-md items-center gap-2 rounded-full border border-white/70 bg-white/65 p-1.5 pl-5 shadow-[0_16px_36px_rgba(111,80,50,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl transition-all duration-300 focus-within:border-[#fdba74] focus-within:shadow-[0_20px_48px_rgba(249,115,22,0.22),0_0_0_4px_rgba(249,115,22,0.1)]"
            >
              <motion.span
                whileHover={{ scale: 1.12, rotate: -8 }}
                className="shrink-0 text-[#b0a89a] transition-colors duration-300 group-focus-within:text-[#f97316]"
              >
                <Search size={18} />
              </motion.span>
              <label htmlFor="recipe-search" className="sr-only">
                Search for recipes or ingredients
              </label>
              <input
                id="recipe-search"
                type="search"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleHeroSearch()}
                placeholder="Search for recipes, ingredients…"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-[#111827] placeholder:text-[#b0a89a] outline-none"
              />
              <motion.button
                ref={searchBtnRef}
                type="button"
                onClick={handleHeroSearch}
                onPointerDown={(e) => spawnRipple(searchBtnRef, e)}
                whileTap={{ scale: 0.94 }}
                className="fd-ripple-host fd-sheen fd-gradient-btn group/btn flex shrink-0 items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(249,115,22,0.35)]"
              >
                Search
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover/btn:translate-x-1"
                />
              </motion.button>
            </div>
          </motion.div>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.32, ease: easeOut }}
            className="flex flex-wrap items-center gap-6"
          >
            <motion.button
              ref={exploreBtnRef}
              type="button"
              onPointerDown={(e) => spawnRipple(exploreBtnRef, e)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              className="fd-ripple-host fd-sheen fd-gradient-btn group/btn flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-white shadow-[0_14px_30px_rgba(249,115,22,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
            >
              Explore Recipes
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover/btn:translate-x-1.5"
              />
            </motion.button>

            <button
              type="button"
              aria-label="Watch how it works"
              className="group flex items-center gap-3 rounded-full px-2 py-1"
            >
              <span className="fd-pulse-ring relative flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/70 text-[#f97316] shadow-[0_10px_24px_rgba(249,115,22,0.18)] backdrop-blur-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Play size={13} fill="currentColor" className="ml-0.5" />
              </span>
              <span className="text-sm font-bold text-[#111827] transition-colors duration-300 group-hover:text-[#ea580c]">
                How It Works
              </span>
            </button>
          </motion.div>
        </div>

        {/* ══════════════ RIGHT COLUMN ══════════════ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: easeOut }}
          className="relative flex items-center justify-center pr-0 lg:justify-end lg:pr-14"
        >
          {/* Radial glow behind the dish */}
          <div
            aria-hidden="true"
            className="fd-glow-pulse absolute h-[430px] w-[430px] rounded-full bg-[radial-gradient(closest-side,rgba(249,115,22,0.32),rgba(251,146,60,0.14),transparent)] blur-xl"
          />
          <div
            aria-hidden="true"
            className="fd-spin-slow absolute h-[400px] w-[400px] rounded-full border border-dashed border-[#fec9a3]/70"
          />

          {/* Floating ingredients */}
          <div aria-hidden="true" className="pointer-events-none">
            <div className="fd-ingredient absolute -top-8 left-2 drop-shadow-[0_10px_16px_rgba(22,163,74,0.3)]">
              <BasilLeaf />
            </div>
            <div
              className="fd-ingredient absolute -left-10 top-14 hidden sm:block"
              style={{ animationDelay: "1.2s" }}
            >
              <Tomato />
            </div>
            <div
              className="fd-ingredient absolute -left-8 bottom-24 hidden md:block"
              style={{ animationDelay: "2.4s" }}
            >
              <Garlic />
            </div>
            <div
              className="fd-ingredient absolute -right-4 top-24"
              style={{ animationDelay: "3.1s" }}
            >
              <Cheese />
            </div>
          </div>

          {/* ── Main Recipe Card ── */}
          <div className="fd-float-slow relative z-10 w-full max-w-[370px] aspect-[4/5] rounded-[40px] shadow-[0_40px_80px_-20px_rgba(111,80,50,0.32),0_18px_40px_-16px_rgba(249,115,22,0.18)]">
            <div className="absolute inset-0 overflow-hidden rounded-[40px]">
              <Image
                src="/tomato_pasta.webp"
                alt="Creamy Tomato Pasta"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 370px, 370px"
              />
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            </div>

            {/* Floating Inner Overlay Card */}
            <div className="fd-float absolute inset-x-4 bottom-4 z-20 flex items-center justify-between rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-[0_18px_44px_rgba(111,80,50,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl" style={{ animationDelay: "1.6s" }}>
              <div className="flex flex-col gap-1.5">
                <p className="text-[15px] font-extrabold tracking-tight text-[#111827]">
                  Creamy Tomato Pasta
                </p>
                <div className="flex items-center gap-3 text-[11px] font-semibold text-[#7c7267]">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-[#f97316]" />
                    20 min
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={12} fill="#f97316" className="text-[#f97316]" />
                    4.9 <span className="font-medium text-[#a09485]">(2.3K Reviews)</span>
                  </span>
                </div>
              </div>
              <motion.button
                aria-label="Save to favourites"
                aria-pressed={saved}
                onClick={() => setSaved((p) => !p)}
                whileTap={{ scale: 0.8 }}
                whileHover={{ scale: 1.15 }}
                className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#fff1e6] to-[#ffe4cf] text-[#ea580c] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
              >
                <motion.span
                  animate={saved ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Heart size={16} fill={saved ? "#f97316" : "none"} />
                </motion.span>
              </motion.button>
            </div>
          </div>

          {/* ── Floating stat cards ── */}
          <FloatingStat
            floatDelay={0.5}
            className="-right-2 top-5 sm:-right-6"
            icon={<Star size={17} fill="currentColor" />}
            iconClass="bg-gradient-to-br from-[#f97316] to-[#fb923c]"
            title="4.9 Rating"
            subtitle="Top Rated"
          />
          <FloatingStat
            floatDelay={0.9}
            className="left-1/2 top-[26%] hidden -translate-x-[130%] md:block"
            icon={<ChefHat size={17} />}
            iconClass="bg-gradient-to-br from-[#0f172a] to-[#334155]"
            title="50K Recipes"
            subtitle="Curated"
          />
          <FloatingStat
            floatDelay={1.3}
            className="-right-4 bottom-[30%] hidden sm:block"
            icon={<Heart size={17} fill="currentColor" />}
            iconClass="bg-gradient-to-br from-[#ef4444] to-[#f97316]"
            title="120K Happy Users"
            subtitle="Community"
          />
          <FloatingStat
            floatDelay={1.7}
            className="-left-6 bottom-[12%] hidden sm:block"
            icon={<Zap size={17} fill="currentColor" />}
            iconClass="bg-gradient-to-br from-[#22c55e] to-[#16a34a]"
            title="20 Minutes"
            subtitle="Avg Cook Time"
          />
        </motion.div>
      </div>

      {/* ══════════════ BOTTOM FEATURE PILLS ══════════════ */}
      <div className="relative mx-auto mt-12 flex w-full max-w-7xl flex-wrap items-center gap-6 px-6 sm:px-12 lg:mt-4 lg:px-16">
        {[
          {
            icon: ChefHat,
            title: "Expert Recipes",
            sub: "Curated by professional chefs",
            grad: "from-[#f97316] to-[#fb923c]",
          },
          {
            icon: Zap,
            title: "Quick & Easy",
            sub: "30-minute meals available",
            grad: "from-[#f59e0b] to-[#fbbf24]",
          },
          {
            icon: Flame,
            title: "AI Chef Powered",
            sub: "Generate recipes in seconds",
            grad: "from-[#ef4444] to-[#f97316]",
          },
        ].map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 + i * 0.1, ease: easeOut }}
              whileHover={{ y: -4 }}
              className="group flex items-center gap-3.5 rounded-2xl border border-white/70 bg-white/55 p-3 pr-5 shadow-[0_10px_28px_rgba(111,80,50,0.08)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(249,115,22,0.16)]"
            >
              <motion.span
                whileHover={{ scale: 1.12, rotate: -6 }}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${f.grad} text-white shadow-[0_8px_18px_rgba(249,115,22,0.32)]`}
              >
                <Icon size={19} />
              </motion.span>
              <div>
                <p className="text-[13.5px] font-extrabold tracking-tight text-[#111827]">
                  {f.title}
                </p>
                <p className="text-[11px] font-semibold text-[#a09485]">{f.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
