"use client";

import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, value, label }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/80 bg-white/70 p-6 text-center shadow-[0_16px_38px_rgba(111,80,50,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_28px_56px_-12px_rgba(249,115,22,0.24)]"
    >
      {/* Decorative corner glow */}
      <div
        aria-hidden="true"
        className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#fdba74]/25 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <div
        className={`relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${
          "from-[#f97316] to-[#fb923c]"
        } text-white shadow-[0_10px_22px_rgba(249,115,22,0.35)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}
      >
        <Icon size={20} />
      </div>
      <div className="relative mt-4 text-2xl font-extrabold tracking-[-0.03em] text-[#111827] sm:text-3xl [font-family:var(--font-display)]">
        {value}
      </div>
      <div className="relative mt-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#a09485]">
        {label}
      </div>
    </motion.div>
  );
}
