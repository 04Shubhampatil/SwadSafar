"use client";

import { motion } from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1];

export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: easeOut }}
      className="max-w-3xl"
    >
      <span className="inline-flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#ea580c]">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#f97316]" />
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-[#111827] sm:text-4xl [font-family:var(--font-display)]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#7c7267]">
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  );
}
