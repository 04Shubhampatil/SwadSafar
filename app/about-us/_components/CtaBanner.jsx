"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import vegies from "../../../public/vegies.webp";
import RippleButton from "./RippleButton";

const easeOut = [0.22, 1, 0.36, 1];

const PARTICLES = [
  { left: "8%", top: "20%", size: 5, color: "#fb923c", delay: 0 },
  { left: "16%", top: "70%", size: 4, color: "#fde68a", delay: 1.2 },
  { left: "26%", top: "12%", size: 3, color: "#ffffff", delay: 2.1 },
  { left: "82%", top: "22%", size: 5, color: "#fb923c", delay: 0.6 },
  { left: "88%", top: "62%", size: 4, color: "#fde68a", delay: 1.8 },
  { left: "72%", top: "86%", size: 3, color: "#ffffff", delay: 2.6 },
];

export default function CtaBanner() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 pb-16 pt-6 sm:px-10 md:px-14 lg:px-16 lg:pb-20">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: easeOut }}
        className="relative overflow-hidden rounded-[36px] bg-[#0b1f15] text-white shadow-[0_50px_100px_-30px_rgba(6,40,22,0.5),0_20px_50px_-20px_rgba(249,115,22,0.2)]"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(110%_130%_at_15%_-10%,rgba(249,115,22,0.32),transparent_52%),radial-gradient(90%_90%_at_100%_120%,rgba(16,185,129,0.28),transparent_55%),linear-gradient(150deg,#123722,#081710)]" />
          <div className="fd-grid-light absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
          <div className="fd-noise absolute inset-0 opacity-40 mix-blend-soft-light" />
          <div className="absolute -right-24 -top-28 h-96 w-96 rounded-full bg-gradient-to-br from-[#f97316]/40 to-transparent blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-[#22c55e]/25 to-transparent blur-3xl" />
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="fd-particle absolute rounded-full"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                background: p.color,
                boxShadow: `0 0 12px ${p.color}`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center gap-10 px-7 py-14 text-center sm:px-12 lg:flex-row lg:justify-between lg:text-left">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#fdba74] backdrop-blur-xl">
              <Sparkles size={13} />
              Start cooking today
            </span>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] tracking-[-0.03em] sm:text-4xl lg:text-5xl [font-family:var(--font-display)]">
              Ready to cook something{" "}
              <span className="bg-gradient-to-r from-[#fdba74] via-[#fb923c] to-[#f97316] bg-clip-text text-transparent">
                amazing?
              </span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-emerald-100/75">
              Join 10,000+ home cooks who turn everyday ingredients into
              unforgettable meals — with Foodi by their side.
            </p>
            <div className="mt-7 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
              <RippleButton className="group/cta">
                Get Started Free
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover/cta:translate-x-1.5"
                />
              </RippleButton>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-xl transition-all duration-300 hover:border-[#fb923c]/60 hover:bg-white/15"
              >
                <Heart size={15} className="text-[#fb923c]" />
                Support Us
              </a>
            </div>
          </div>

          {/* Floating image */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.92 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: easeOut }}
            className="relative w-full max-w-[260px] shrink-0"
          >
            <div className="fd-glow-pulse absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(249,115,22,0.5),rgba(251,146,60,0.18),transparent)]" />
            <div className="fd-float-slow relative overflow-hidden rounded-[28px] border border-white/15 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
              <Image
                src={vegies}
                alt="Fresh ingredients for cooking"
                width={260}
                height={260}
                loading="eager"
                sizes="260px"
                className="h-56 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="absolute bottom-3 left-4 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fdba74]">
                Taste the Foodi way
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
