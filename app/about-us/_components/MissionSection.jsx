"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Globe2, Star, Users } from "lucide-react";
import StatCard from "./StatCard";
import CountUp from "./CountUp";
import RippleButton from "./RippleButton";

const easeOut = [0.22, 1, 0.36, 1];

const stats = [
  { value: <CountUp to={10} suffix="K+" />, label: "Active Members", icon: Users },
  { value: <CountUp to={5200} suffix="+" />, label: "Recipes Shared", icon: BookOpen },
  { value: <CountUp to={98} suffix="%" />, label: "Satisfaction Rate", icon: Star },
  { value: <CountUp to={45} suffix="+" />, label: "Countries", icon: Globe2 },
];

const JOURNEY = [
  { year: "2022", text: "Founded" },
  { year: "2024", text: "AI Chef live" },
  { year: "2026", text: "Going global" },
];

const PanIllustration = () => (
  <svg viewBox="0 0 140 120" width="150" height="128" fill="none" aria-hidden="true">
    <g opacity="0.85">
      <ellipse cx="60" cy="78" rx="52" ry="12" fill="url(#pan-rim)" />
      <path d="M8 78C8 58 31 44 60 44C89 44 112 58 112 78H8Z" fill="url(#pan-body)" />
      <path d="M112 70L136 62" stroke="#a16207" strokeWidth="7" strokeLinecap="round" />
      <circle cx="74" cy="34" r="5" fill="#22c55e" />
      <circle cx="52" cy="30" r="5" fill="#ef4444" />
      <circle cx="63" cy="26" r="4" fill="#f59e0b" />
      <path d="M84 22C86 18 90 18 92 22" stroke="#fca5a5" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M96 14C99 9 104 10 106 15" stroke="#fda4af" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M88 30C91 26 95 27 96 31" stroke="#fda4af" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="60" cy="78" rx="52" ry="12" fill="url(#pan-glow)" opacity="0.5" />
    </g>
    <defs>
      <linearGradient id="pan-body" x1="20" y1="44" x2="100" y2="78" gradientUnits="userSpaceOnUse">
        <stop stopColor="#292524" />
        <stop offset="1" stopColor="#1c1917" />
      </linearGradient>
      <linearGradient id="pan-rim" x1="8" y1="78" x2="112" y2="78" gradientUnits="userSpaceOnUse">
        <stop stopColor="#57534e" />
        <stop offset="1" stopColor="#292524" />
      </linearGradient>
      <radialGradient id="pan-glow" cx="0.5" cy="0.5" r="0.5">
        <stop stopColor="#fdba74" />
        <stop offset="1" stopColor="#fdba74" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

export default function MissionSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-14 sm:px-10 md:px-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-16 lg:py-20">
        {/* ══════ COPY ══════ */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <span className="inline-flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#ea580c]">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#f97316]" />
              Why we exist
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-[#111827] sm:text-4xl [font-family:var(--font-display)]">
              Our <span className="fd-text-gradient">Mission</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
            className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[#7c7267]"
          >
            We&apos;re on a mission to make cooking accessible, enjoyable, and
            inspiring for everyone. Whether you&apos;re a seasoned chef or just
            starting out, Foodi provides the tools and community to elevate your
            culinary journey.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.16, ease: easeOut }}
            className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#7c7267]"
          >
            Our AI-powered recipe generator, curated collections, and vibrant
            community forums are just the beginning. We continuously innovate to
            bring you the best cooking experience possible.
          </motion.p>

          {/* Timeline accent */}
          <motion.ol
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.22, ease: easeOut }}
            className="mt-8 flex items-center gap-0"
            aria-label="Foodi journey"
          >
            {JOURNEY.map((j, i) => (
              <li key={j.year} className="flex items-center">
                <div className="flex flex-col items-center">
                  <span className="fd-pulse-dot h-3 w-3 rounded-full bg-gradient-to-br from-[#f97316] to-[#fb923c] shadow-[0_0_0_4px_rgba(249,115,22,0.15)]" style={{ animationDelay: `${i * 0.8}s` }} />
                  <span className="mt-2 text-[11px] font-extrabold text-[#ea580c]">{j.year}</span>
                  <span className="text-[10px] font-semibold text-[#a09485]">{j.text}</span>
                </div>
                {i < JOURNEY.length - 1 && (
                  <span aria-hidden="true" className="mx-3 mb-7 h-px w-10 bg-gradient-to-r from-[#f97316]/60 to-[#fdba74]/30 sm:w-16" />
                )}
              </li>
            ))}
          </motion.ol>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.3, ease: easeOut }}
            className="mt-8"
          >
            <RippleButton className="group/cta">
              <Users size={16} />
              Join Our Community
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover/cta:translate-x-1.5"
              />
            </RippleButton>
          </motion.div>
        </div>

        {/* ══════ STATS ══════ */}
        <div className="relative">
          {/* Custom cooking illustration */}
          <div aria-hidden="true" className="pointer-events-none absolute -right-4 -top-8 hidden lg:block">
            <div className="fd-float-slow">
              <PanIllustration />
            </div>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-[#fde68a]/30 blur-3xl"
          />

          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {stats.map((stat) => (
              <StatCard key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
