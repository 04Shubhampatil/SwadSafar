"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles, Star, Users, BookOpen, BadgeCheck, Heart } from "lucide-react";
import vegies from "../../../public/vegies.webp";
import RippleButton from "./RippleButton";

const easeOut = [0.22, 1, 0.36, 1];

const TRUST = [
  { icon: Users, label: "10K+ Members" },
  { icon: BookOpen, label: "5K+ Recipes" },
  { icon: Star, label: "98% Satisfaction" },
];

const Tomato = () => (
  <svg viewBox="0 0 44 46" width="42" height="44" fill="none" aria-hidden="true">
    <path d="M22 16C18 6 7 7 5 13C3.6 17.8 12 21 22 16Z" fill="#22c55e" />
    <path d="M22 16C24 8 31 5 34 9C36.5 12 31 17 22 16Z" fill="#16a34a" />
    <rect x="21" y="2" width="2.4" height="9" rx="1.2" fill="#15803d" />
    <circle cx="22" cy="29" r="15" fill="url(#ab-tomato-g)" />
    <circle cx="17" cy="23" r="4" fill="#fecaca" opacity="0.6" />
    <defs>
      <radialGradient id="ab-tomato-g" cx="0.35" cy="0.3" r="1">
        <stop stopColor="#f87171" />
        <stop offset="0.6" stopColor="#ef4444" />
        <stop offset="1" stopColor="#b91c1c" />
      </radialGradient>
    </defs>
  </svg>
);

const Basil = () => (
  <svg viewBox="0 0 44 44" width="46" height="46" fill="none" aria-hidden="true">
    <path
      d="M22 42C11 33 6 19 13 8C22 3 33 10 35 19C36.5 29 31 39 22 42Z"
      fill="url(#ab-basil-g)"
    />
    <path d="M22 42L22 14" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M22 30C18 25 17 19 20 15M22 22C25 18 27 14 26 10" stroke="#15803d" strokeWidth="1.6" strokeLinecap="round" />
    <defs>
      <linearGradient id="ab-basil-g" x1="10" y1="8" x2="30" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4ade80" />
        <stop offset="1" stopColor="#16a34a" />
      </linearGradient>
    </defs>
  </svg>
);

const Garlic = () => (
  <svg viewBox="0 0 40 50" width="36" height="46" fill="none" aria-hidden="true">
    <path
      d="M20 48C10 48 6 40 6 30C6 20 11 15 13 9C14.2 5.6 16 3.5 20 3.5C24 3.5 25.8 5.6 27 9C29 15 34 20 34 30C34 40 30 48 20 48Z"
      fill="url(#ab-garlic-g)"
    />
    <path d="M20 10C20 16 20 30 20 44" stroke="#d6d3d1" strokeWidth="2" />
    <defs>
      <linearGradient id="ab-garlic-g" x1="10" y1="4" x2="30" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fffdf7" />
        <stop offset="0.5" stopColor="#f5efe4" />
        <stop offset="1" stopColor="#e4dcc8" />
      </linearGradient>
    </defs>
  </svg>
);

const Lemon = () => (
  <svg viewBox="0 0 48 48" width="44" height="44" fill="none" aria-hidden="true">
    <circle cx="24" cy="24" r="20" fill="url(#ab-lemon-g)" />
    <g stroke="#facc15" strokeWidth="2">
      <line x1="24" y1="4" x2="24" y2="44" />
      <line x1="4" y1="24" x2="44" y2="24" />
    </g>
    <defs>
      <radialGradient id="ab-lemon-g" cx="0.35" cy="0.3" r="1">
        <stop stopColor="#fef9c3" />
        <stop offset="0.7" stopColor="#fde047" />
        <stop offset="1" stopColor="#f59e0b" />
      </radialGradient>
    </defs>
  </svg>
);

export default function AboutHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const yBack = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const yCard = useTransform(scrollYProgress, [0, 1], [0, 140]);

  return (
    <section ref={ref} className="relative mx-auto w-full max-w-[1400px] overflow-hidden">
      {/* ── Ambient background ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="fd-noise absolute inset-0 opacity-30 mix-blend-multiply" />
        <div className="fd-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_72%)]" />
        <div className="fd-blob absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#fdba74]/35 blur-3xl" />
        <div
          className="fd-blob absolute -right-40 top-[30%] h-[460px] w-[460px] rounded-full bg-[#f97316]/12 blur-3xl"
          style={{ animationDelay: "5s" }}
        />
      </div>

      <div className="relative grid lg:grid-cols-2">
        {/* ══════ TEXT SIDE ══════ */}
        <div className="flex flex-col justify-center px-6 py-14 sm:px-10 md:px-14 lg:px-16 lg:py-24">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#fed7aa]/80 bg-white/60 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#ea580c] shadow-[0_8px_24px_rgba(249,115,22,0.1)] backdrop-blur-xl"
          >
            <Sparkles size={13} className="text-[#f97316]" />
            Our Story
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: easeOut }}
            className="mt-6 max-w-xl text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-[#111827] sm:text-5xl lg:text-[3.4rem] [font-family:var(--font-display)]"
          >
            Cooking Made
            <br />
            <span className="fd-text-gradient">Simple &amp; Joyful</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
            className="mt-6 max-w-lg text-[15px] leading-relaxed text-[#7c7267]"
          >
            Foodi was born from a simple idea: everyone deserves access to
            delicious, easy-to-follow recipes. Founded in 2022, we&apos;ve
            grown into a community of over 10,000 passionate food lovers
            worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeOut }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <RippleButton className="group/cta">
              Discover Our Story
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover/cta:translate-x-1.5"
              />
            </RippleButton>
            <span className="text-[11px] font-semibold text-[#a09485]">
              Free forever · Join the family
            </span>
          </motion.div>

          {/* Trust badges */}
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: easeOut }}
            className="mt-9 flex flex-wrap gap-3"
          >
            {TRUST.map(({ icon: Icon, label }) => (
              <motion.li
                key={label}
                whileHover={{ y: -3 }}
                className="flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-4 py-2 text-xs font-bold text-[#111827] shadow-[0_8px_20px_rgba(111,80,50,0.08)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_12px_28px_rgba(249,115,22,0.16)]"
              >
                <Icon size={14} className="text-[#f97316]" />
                {label}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* ══════ COLLAGE SIDE ══════ */}
        <div className="relative min-h-[320px] sm:min-h-[400px] lg:min-h-[540px]">
          {/* Parallax backdrop layers */}
          <motion.div
            aria-hidden="true"
            style={{ y: yBack }}
            className="fd-glow-pulse absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(249,115,22,0.3),rgba(251,146,60,0.12),transparent)]"
          />
          <motion.div
            aria-hidden="true"
            style={{ y: yBack }}
            className="fd-spin-slow absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#fec9a3]/70"
          />

          {/* Main parallax image in rounded frame */}
          <motion.div
            style={{ y: yImg }}
            className="absolute inset-x-6 top-8 bottom-8 sm:inset-x-10 lg:inset-x-14 lg:top-12 lg:bottom-12"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[36px] shadow-[0_40px_90px_-24px_rgba(111,80,50,0.4),0_18px_44px_-16px_rgba(249,115,22,0.2)]">
              <Image
                src={vegies}
                alt="Fresh vegetables and fruits on a rustic table"
                fill
                priority
                loading="eager"
                className="object-cover saturate-[0.85] transition-transform duration-[2000ms] hover:scale-105"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-[#f97316]/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.3),transparent_30%),radial-gradient(circle_at_80%_75%,rgba(251,146,60,0.18),transparent_32%)]" />
            </div>
          </motion.div>

          {/* Floating ingredients */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="fd-ingredient absolute left-[8%] top-[10%] drop-shadow-[0_12px_18px_rgba(239,68,68,0.35)]">
              <Tomato />
            </div>
            <div
              className="fd-ingredient absolute right-[8%] top-[14%] drop-shadow-[0_12px_18px_rgba(22,163,74,0.35)]"
              style={{ animationDelay: "1.4s" }}
            >
              <Basil />
            </div>
            <div
              className="fd-ingredient absolute bottom-[16%] left-[6%] drop-shadow-[0_12px_18px_rgba(111,80,50,0.3)]"
              style={{ animationDelay: "2.6s" }}
            >
              <Garlic />
            </div>
            <div
              className="fd-ingredient absolute bottom-[10%] right-[9%] drop-shadow-[0_12px_18px_rgba(245,158,11,0.4)]"
              style={{ animationDelay: "3.4s" }}
            >
              <Lemon />
            </div>
          </div>

          {/* Floating stat cards */}
          <motion.div
            style={{ y: yCard }}
            className="pointer-events-none absolute inset-0 hidden sm:block"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.6, ease: easeOut }}
              className="absolute left-0 top-[22%]"
            >
              <div className="fd-float flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/80 p-3.5 pr-4 shadow-[0_18px_40px_rgba(111,80,50,0.18)] backdrop-blur-xl">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f97316] to-[#fb923c] text-white shadow-[0_8px_18px_rgba(249,115,22,0.35)]">
                  <Heart size={17} fill="currentColor" />
                </span>
                <div>
                  <p className="text-[13px] font-extrabold leading-tight text-[#111827]">
                    4.9 rating
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8a7d6d]">
                    Loved by cooks
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.8, ease: easeOut }}
              className="absolute bottom-[16%] right-0"
            >
              <div className="fd-float flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/80 p-3.5 pr-4 shadow-[0_18px_40px_rgba(111,80,50,0.18)] backdrop-blur-xl" style={{ animationDelay: "1.6s" }}>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#22c55e] to-[#4ade80] text-white shadow-[0_8px_18px_rgba(34,197,94,0.35)]">
                  <BadgeCheck size={17} />
                </span>
                <div>
                  <p className="text-[13px] font-extrabold leading-tight text-[#111827]">
                    Verified chefs
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8a7d6d]">
                    Hand-crafted
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
