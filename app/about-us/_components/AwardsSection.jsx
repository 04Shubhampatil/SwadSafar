"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import SectionHeading from "./SectionHeading";

const easeOut = [0.22, 1, 0.36, 1];

export default function AwardsSection({ awards }) {
  return (
    <section className="relative overflow-hidden bg-[#FFF9F3]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="fd-noise absolute inset-0 opacity-20 mix-blend-multiply" />
        <div className="fd-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />
        <div className="fd-blob absolute -right-40 top-1/4 h-[420px] w-[420px] rounded-full bg-[#fdba74]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-14 sm:px-10 md:px-14 lg:px-16 lg:py-20">
        <SectionHeading
          eyebrow="Recognition"
          title={
            <>
              Awards &amp; <span className="fd-text-gradient">accolades</span>
            </>
          }
          subtitle="A few moments of recognition from the food and tech community we're proud to share."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {awards.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.article
                key={a.name}
                initial={{ opacity: 0, y: 26, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: easeOut }}
                whileHover={{ y: -8 }}
                className="group relative flex h-full flex-col items-center overflow-hidden rounded-[24px] border border-white/80 bg-white/70 p-7 text-center shadow-[0_14px_34px_rgba(111,80,50,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_28px_56px_-12px_rgba(249,115,22,0.22)]"
              >
                {/* Spotlight */}
                <div
                  aria-hidden="true"
                  className="absolute -top-14 left-1/2 h-28 w-40 -translate-x-1/2 rounded-full bg-[#fdba74]/40 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                <motion.div
                  whileHover={{ rotate: -8, scale: 1.12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 16 }}
                  className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] text-white shadow-[0_12px_26px_rgba(245,158,11,0.4)]"
                >
                  <Icon size={24} />
                </motion.div>

                <h3 className="relative mt-5 text-[15px] font-extrabold leading-snug tracking-tight text-[#111827]">
                  {a.name}
                </h3>
                <p className="relative mt-1 text-xs font-semibold text-[#7c7267]">{a.org}</p>

                <span className="relative mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#fed7aa]/80 bg-[#fff7ed] px-3.5 py-1.5 text-[11px] font-extrabold text-[#ea580c]">
                  <Trophy size={12} />
                  {a.year}
                </span>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
