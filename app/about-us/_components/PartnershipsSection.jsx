"use client";

import { motion } from "framer-motion";
import { BadgeCheck, ArrowRight } from "lucide-react";
import BrandChip from "./BrandChip";
import RippleButton from "./RippleButton";

const easeOut = [0.22, 1, 0.36, 1];

export default function PartnershipsSection({ brands }) {
  const marquee = [...brands, ...brands];

  return (
    <section className="relative overflow-hidden border-y border-[#f0e8dc]/70 bg-white/60">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="fd-noise absolute inset-0 opacity-20 mix-blend-multiply" />
        <div className="fd-blob absolute -left-44 -top-24 h-[400px] w-[400px] rounded-full bg-[#fde68a]/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-14 sm:px-10 md:px-14 lg:px-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#fed7aa]/80 bg-white/60 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#ea580c] shadow-[0_8px_20px_rgba(249,115,22,0.1)] backdrop-blur-xl">
              <BadgeCheck size={13} />
              Brand Collaborations
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-[#111827] sm:text-4xl [font-family:var(--font-display)]">
              Working with brands food lovers{" "}
              <span className="fd-text-gradient">already know</span>
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#7c7267]">
              From delivery leaders to restaurant chains, Foodi creates campaign
              opportunities, recipe partnerships, and community activations with
              modern food brands.
            </p>
          </div>

          <RippleButton className="group/cta shrink-0">
            Work With Foodi
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover/cta:translate-x-1.5"
            />
          </RippleButton>
        </motion.div>

        {/* Infinite marquee */}
        <div
          className="relative mt-12 overflow-hidden"
          aria-label="Brand partners"
          role="group"
        >
          {/* Edge fade masks */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#FFF9F3] to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#FFF9F3] to-transparent"
          />

          <motion.div
            className="flex w-max items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          >
            {marquee.map((brand, i) => (
              <BrandChip key={`${brand.name}-${i}`} brand={brand} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
