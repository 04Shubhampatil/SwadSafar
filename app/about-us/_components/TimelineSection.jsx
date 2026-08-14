"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const easeOut = [0.22, 1, 0.36, 1];

export default function TimelineSection({ milestones }) {
  return (
    <section className="relative overflow-hidden bg-[#FFF9F3]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="fd-noise absolute inset-0 opacity-20 mix-blend-multiply" />
        <div className="fd-blob absolute -left-48 top-1/3 h-[460px] w-[460px] rounded-full bg-[#fdba74]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-14 sm:px-10 md:px-14 lg:px-16 lg:py-20">
        <SectionHeading
          eyebrow="Our Journey"
          title={
            <>
              Milestones on the <span className="fd-text-gradient">road so far</span>
            </>
          }
          subtitle="Every milestone is a meal shared, a recipe perfected, and a community that grew around the table."
        />

        <div className="relative mt-12">
          {/* Center line */}
          <div
            aria-hidden="true"
            className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-[#f97316]/60 via-[#fdba74]/40 to-transparent lg:left-1/2 lg:-translate-x-1/2"
          />

          <ol className="flex flex-col gap-10 lg:gap-14">
            {milestones.map((m, i) => {
              const Icon = m.icon;
              const leftSide = i % 2 === 0;
              return (
                <li key={m.year} className="relative">
                  {/* Dot on the line */}
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.3 }}
                    className="absolute left-4 top-2 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_0_0_4px_rgba(249,115,22,0.2)] lg:left-1/2"
                  >
                    <span className="h-2 w-2 rounded-full bg-gradient-to-br from-[#ea580c] to-[#fb923c]" />
                  </motion.span>

                  <motion.div
                    initial={{ opacity: 0, y: 32, x: 0 }}
                    whileInView={{ opacity: 1, y: 0, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, ease: easeOut }}
                    className={`ml-10 lg:ml-0 lg:w-[calc(50%-2.5rem)] ${
                      leftSide
                        ? "lg:mr-auto lg:text-right"
                        : "lg:ml-auto"
                    }`}
                  >
                    <div
                      className="group rounded-[24px] border border-white/80 bg-white/70 p-6 shadow-[0_16px_38px_rgba(111,80,50,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_28px_56px_-12px_rgba(249,115,22,0.22)]"
                    >
                      <div className={`flex items-center gap-3 ${leftSide ? "lg:flex-row-reverse" : ""}`}>
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f97316] to-[#fb923c] text-white shadow-[0_10px_22px_rgba(249,115,22,0.35)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                          <Icon size={19} />
                        </span>
                        <span className="rounded-full border border-[#fed7aa]/80 bg-[#fff7ed] px-3.5 py-1.5 text-[11px] font-extrabold tracking-wider text-[#ea580c]">
                          {m.year}
                        </span>
                      </div>
                      <h3 className="mt-4 text-lg font-extrabold tracking-tight text-[#111827]">
                        {m.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#7c7267]">
                        {m.description}
                      </p>
                    </div>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
