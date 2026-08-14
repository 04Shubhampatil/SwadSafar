"use client";

import { motion } from "framer-motion";

export default function ValueCard({ icon: Icon, title, description, gradient }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-white/80 bg-white/65 p-6 shadow-[0_14px_34px_rgba(111,80,50,0.09),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_30px_60px_-16px_rgba(249,115,22,0.22)]"
    >
      {/* Decorative gradient wash */}
      <div
        aria-hidden="true"
        className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-15 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-30`}
      />
      {/* Tiny illustration accent */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="absolute right-4 top-4 h-4 w-4 text-[#f97316]/20 transition-transform duration-500 group-hover:rotate-45 group-hover:text-[#f97316]/50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M12 2v20M2 12h20M4.5 4.5l15 15M19.5 4.5l-15 15" />
      </svg>

      <motion.div
        whileHover={{ rotate: -6, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300, damping: 16 }}
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-[0_12px_26px_rgba(249,115,22,0.35)]`}
      >
        <Icon size={24} />
      </motion.div>

      <h3 className="relative mt-5 text-[17px] font-extrabold tracking-tight text-[#111827]">
        {title}
      </h3>

      <p className="relative mt-2 text-sm leading-relaxed text-[#7c7267]">
        {description}
      </p>

      <div
        aria-hidden="true"
        className="relative mt-auto pt-5 h-px bg-gradient-to-r from-[#f97316]/40 via-[#fdba74]/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </motion.article>
  );
}
