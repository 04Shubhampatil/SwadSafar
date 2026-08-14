"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, Flame, Sparkles, Trophy, Users } from "lucide-react";
import {
  HERO_STATS,
  TRENDING_HASHTAGS,
  ACTIVE_MEMBERS,
  ACHIEVEMENTS,
} from "./communityData";
import CommunityStats from "./CommunityStats";
import CountUp from "./CountUp";

const ACHIEVEMENT_ICONS = {
  Flame: Flame,
  Croissant: Sparkles,
  Sparkles: Sparkles,
  Star: Sparkles,
  Trophy: Trophy,
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function CommunityHero({ onScrollToComposer }) {
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#fff4ea] via-[#fff9f3] to-[#ffeddc] px-6 py-12 sm:px-10 sm:py-16">
      {/* Decorative layers */}
      <div className="pointer-events-none absolute inset-0 fd-grid opacity-60" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-gradient-to-br from-orange-200/60 to-transparent blur-3xl fd-glow-pulse" />
      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-gradient-to-br from-amber-200/70 to-transparent blur-3xl fd-glow-pulse" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-gradient-to-br from-orange-100/70 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute inset-0 fd-noise opacity-[0.04]" />

      {/* Floating food illustrations (desktop) */}
      <div className="pointer-events-none absolute right-10 top-12 hidden xl:block">
        <img
          src="/biryani.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="w-40 opacity-90 drop-shadow-[0_24px_40px_rgba(249,115,22,0.35)] fd-float"
        />
      </div>
      <div className="pointer-events-none absolute right-64 bottom-16 hidden xl:block">
        <img
          src="/tomato_pasta.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="w-28 opacity-90 drop-shadow-[0_18px_32px_rgba(200,80,40,0.3)] fd-ingredient"
          style={{ animationDelay: "1.2s" }}
        />
      </div>
      <div className="pointer-events-none absolute right-52 top-6 hidden xl:block">
        <img
          src="/lemon.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="w-20 opacity-90 drop-shadow-[0_16px_28px_rgba(180,140,40,0.3)] fd-float-slow"
        />
      </div>
      <div className="pointer-events-none absolute right-6 bottom-6 hidden xl:block">
        <img
          src="/leaf_png.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="w-16 opacity-80"
          style={{ animation: "sway 7s ease-in-out infinite" }}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-6xl"
      >
        {/* Top row: badge + hero copy + active members */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <motion.div variants={item} className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3.5 py-1.5 text-xs font-bold text-orange-700 shadow-sm backdrop-blur-md fd-sheen">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                </span>
                2,431 cooks online right now
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-[#1c1917] sm:text-5xl lg:text-6xl"
            >
              Where food lovers
              <br />
              <span className="fd-text-gradient">meet &amp; cook together</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-5 max-w-xl text-sm leading-relaxed text-[#6b6157] sm:text-base"
            >
              Share recipes, join live cook-alongs, and swap kitchen secrets with
              thousands of home cooks. Your next signature dish is one post away.
            </motion.p>

            <motion.div variants={item} className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onScrollToComposer}
                className="fd-ripple-host fd-sheen fd-gradient-btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(249,115,22,0.4)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#f97316]"
              >
                <Users size={17} />
                Join the conversation
              </button>
              <Link
                href="/recipes"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-6 py-3 text-sm font-bold text-[#1c1917] shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-700 active:scale-95"
              >
                <Flame size={17} className="text-orange-600" />
                Browse trending recipes
              </Link>
            </motion.div>
          </div>

          {/* Active members card */}
          <motion.div variants={item} className="shrink-0">
            <div className="fd-glass rounded-3xl p-5 sm:p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8c827a]">
                Cooking right now
              </p>
              <div className="mt-3 flex items-center">
                <div className="flex -space-x-3">
                  {ACTIVE_MEMBERS.slice(0, 5).map((member) => (
                    <img
                      key={member.name}
                      src={member.avatar}
                      alt={member.name}
                      className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm"
                    />
                  ))}
                </div>
                <span className="ml-3 text-sm font-bold text-[#1c1917]">
                  <CountUp to={2431} duration={2} /> online
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["#biryaninational", "#sundaybrunch", "#mealprep"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-orange-100/80 px-2.5 py-1 text-[11px] font-semibold text-orange-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 px-3.5 py-2.5 ring-1 ring-orange-100">
                <BadgeCheck size={16} className="shrink-0 text-orange-600" />
                <p className="text-xs font-semibold text-[#1c1917]">
                  Verified Chef Badge — unlocked at 1,000 followers
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div variants={item} className="mt-12">
          <CommunityStats stats={HERO_STATS} />
        </motion.div>

        {/* Trending hashtags */}
        <motion.div variants={item} className="mt-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#b3a798]">
              <Sparkles size={13} className="text-orange-600" />
              Trending today
            </span>
            {TRENDING_HASHTAGS.map((hashtag) => (
              <span
                key={hashtag.tag}
                className="group inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/70 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-[#6b6157] shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-700"
              >
                <span className="font-bold">{hashtag.tag}</span>
                <span className="text-[10px] font-medium text-[#b3a798] group-hover:text-orange-400">
                  {hashtag.posts}
                </span>
              </span>
            ))}
          </div>
        </motion.div>

        {/* Achievements strip */}
        <motion.div variants={item} className="mt-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {ACHIEVEMENTS.map((achievement) => {
              const Icon = ACHIEVEMENT_ICONS[achievement.icon] || Trophy;
              return (
                <div
                  key={achievement.label}
                  className="group rounded-2xl border border-white/70 bg-white/60 p-3.5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_36px_-12px_rgba(249,115,22,0.25)]"
                >
                  <div className="flex items-center gap-2">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${achievement.color}`}>
                      <Icon size={15} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-[#1c1917]">{achievement.label}</p>
                      <p className="text-[10px] font-semibold text-orange-600">
                        {achievement.progress}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-neutral-200/70">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700 group-hover:from-orange-400 group-hover:to-amber-300"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
