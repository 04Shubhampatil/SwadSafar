"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarClock, Gift, Users } from "lucide-react";
import { WEEKLY_CHALLENGE } from "./communityData";

export default function WeeklyChallenge() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[32px] bg-[#1c1917]"
    >
      <img
        src={WEEKLY_CHALLENGE.image}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1c1917] via-[#1c1917]/85 to-[#1c1917]/40" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_auto] lg:px-12">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-orange-300 ring-1 ring-orange-400/30">
              <CalendarClock size={12} /> {WEEKLY_CHALLENGE.endsIn}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white/90">
              <Users size={12} /> {WEEKLY_CHALLENGE.entries.toLocaleString("en-US")} entries
            </span>
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Weekly challenge:{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              {WEEKLY_CHALLENGE.title}
            </span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75">
            {WEEKLY_CHALLENGE.subtitle} Post your dish with{" "}
            <span className="font-bold text-orange-300">{WEEKLY_CHALLENGE.hashtag}</span> to join.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="fd-sheen fd-gradient-btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-8px_rgba(249,115,22,0.6)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              Join the challenge <ArrowRight size={16} />
            </button>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70">
              <Gift size={14} className="text-amber-300" /> Prize: {WEEKLY_CHALLENGE.prize}
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
