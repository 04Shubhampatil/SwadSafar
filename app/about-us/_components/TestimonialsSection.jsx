"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import SectionHeading from "./SectionHeading";

const easeOut = [0.22, 1, 0.36, 1];

export default function TestimonialsSection({ testimonials }) {
  return (
    <section className="relative overflow-hidden border-y border-[#f0e8dc]/70 bg-white/50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="fd-noise absolute inset-0 opacity-20 mix-blend-multiply" />
        <div className="fd-blob absolute -left-44 top-1/4 h-[420px] w-[420px] rounded-full bg-[#fde68a]/30 blur-3xl" />
        <div className="fd-blob absolute -right-44 bottom-0 h-[400px] w-[400px] rounded-full bg-[#fdba74]/25 blur-3xl" style={{ animationDelay: "7s" }} />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-14 sm:px-10 md:px-14 lg:px-16 lg:py-20">
        <SectionHeading
          eyebrow="Loved Worldwide"
          title={
            <>
              Stories from our{" "}
              <span className="fd-text-gradient">community</span>
            </>
          }
          subtitle="Real words from the home cooks, bloggers, and food lovers who cook with Foodi every day."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: easeOut }}
              whileHover={{ y: -8 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-white/80 bg-white/70 p-7 shadow-[0_16px_38px_rgba(111,80,50,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_30px_60px_-16px_rgba(249,115,22,0.22)]"
            >
              <Quote
                size={34}
                fill="#fdba74"
                stroke="none"
                className="absolute right-6 top-6 text-[#fdba74]/50 transition-transform duration-500 group-hover:scale-110"
              />

              {/* Stars */}
              <div className="flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.12 + idx * 0.06, type: "spring", stiffness: 320, damping: 16 }}
                  >
                    <Star size={16} fill="#f97316" className="text-[#f97316]" />
                  </motion.span>
                ))}
              </div>

              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-[#61564a]">
                “{t.quote}”
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-[#f0e8dc]/70 pt-5">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-[#fed7aa]/80">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[13px] font-extrabold text-[#111827]">{t.name}</p>
                  <p className="text-[11px] font-semibold text-[#a09485]">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
