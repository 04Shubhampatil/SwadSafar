"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import SectionHeading from "./SectionHeading";

const easeOut = [0.22, 1, 0.36, 1];

export default function FaqSection({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[#FFF9F3]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="fd-noise absolute inset-0 opacity-20 mix-blend-multiply" />
        <div className="fd-dots absolute left-[5%] top-[16%] h-40 w-40 opacity-35" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-14 sm:px-10 md:px-14 lg:px-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="FAQ"
            title={
              <>
                Questions, <span className="fd-text-gradient">answered</span>
              </>
            }
            subtitle="Everything you need to know about Foodi. Can't find what you're looking for? Reach out anytime — we love to talk food."
          />

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: easeOut }}
                  className={`overflow-hidden rounded-[20px] border backdrop-blur-xl transition-colors duration-300 ${
                    isOpen
                      ? "border-[#fdba74]/80 bg-white/80 shadow-[0_20px_44px_-12px_rgba(249,115,22,0.2)]"
                      : "border-white/80 bg-white/60 shadow-[0_10px_24px_rgba(111,80,50,0.07)] hover:border-[#fed7aa]"
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
                  >
                    <span className="text-[15px] font-extrabold tracking-tight text-[#111827]">
                      {faq.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                        isOpen
                          ? "bg-gradient-to-br from-[#f97316] to-[#fb923c] text-white"
                          : "bg-[#fff7ed] text-[#ea580c]"
                      }`}
                    >
                      <Plus size={15} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-button-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: easeOut }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm leading-relaxed text-[#7c7267]">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
