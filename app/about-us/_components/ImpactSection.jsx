"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import CountUp from "./CountUp";

const easeOut = [0.22, 1, 0.36, 1];

export default function ImpactSection({ metrics }) {
  return (
    <section className="relative mx-auto max-w-[1400px] px-6 sm:px-10 md:px-14 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: easeOut }}
        className="relative overflow-hidden rounded-[36px] bg-[#0b1f15] text-white shadow-[0_50px_100px_-30px_rgba(6,40,22,0.5),0_20px_50px_-20px_rgba(249,115,22,0.2)]"
      >
        {/* Background layers */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(100%_120%_at_90%_-10%,rgba(249,115,22,0.3),transparent_52%),radial-gradient(90%_90%_at_0%_110%,rgba(16,185,129,0.25),transparent_55%),linear-gradient(150deg,#123722,#081710)]" />
          <div className="fd-grid-light absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
          <div className="fd-noise absolute inset-0 opacity-40 mix-blend-soft-light" />
          <div className="absolute -right-24 -top-28 h-96 w-96 rounded-full bg-gradient-to-br from-[#f97316]/40 to-transparent blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-[#22c55e]/25 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col gap-10 px-7 py-12 sm:px-12 lg:px-16 lg:py-16">
          <div className="flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#fdba74] backdrop-blur-xl">
                <Sparkles size={13} />
                Community Impact
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-4xl [font-family:var(--font-display)]">
                Made with love,{" "}
                <span className="bg-gradient-to-r from-[#fdba74] via-[#fb923c] to-[#f97316] bg-clip-text text-transparent">
                  shared worldwide
                </span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-emerald-100/70">
                Our community of home cooks, chefs, and food lovers is cooking
                more, wasting less, and connecting over the table every single day.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: easeOut }}
                whileHover={{ y: -6 }}
                className="relative overflow-hidden rounded-[24px] border border-white/15 bg-white/10 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl transition-colors duration-500 hover:border-[#fb923c]/50 hover:bg-white/15"
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-[#fb923c]/20 blur-xl"
                />
                <div className="relative text-3xl font-extrabold tracking-tight sm:text-4xl [font-family:var(--font-display)]">
                  <CountUp to={m.value} suffix={m.suffix} decimals={m.decimals || 0} />
                </div>
                <div className="relative mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-100/60">
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
