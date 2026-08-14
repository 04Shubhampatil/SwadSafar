"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { Sparkles, Wand2, ArrowRight, Star, Clock, Leaf, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/useAuth";

const easeOut = [0.22, 1, 0.36, 1];

const PARTICLES = [
  { left: "6%", top: "22%", size: 5, color: "#fb923c", delay: 0 },
  { left: "14%", top: "68%", size: 4, color: "#fde68a", delay: 1.2 },
  { left: "24%", top: "12%", size: 3, color: "#ffffff", delay: 2.1 },
  { left: "78%", top: "18%", size: 5, color: "#fb923c", delay: 0.6 },
  { left: "88%", top: "58%", size: 4, color: "#fde68a", delay: 1.8 },
  { left: "70%", top: "82%", size: 3, color: "#ffffff", delay: 2.6 },
  { left: "42%", top: "86%", size: 4, color: "#fb923c", delay: 0.9 },
  { left: "56%", top: "8%", size: 3, color: "#22c55e", delay: 1.5 },
];

export default function AiChefBanner() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleTryAiChef = () => {
    if (loading) return;
    if (!user) {
      // Not logged in — redirect to sign-in with return path
      router.push("/sign-in?redirectTo=/generate-recipe");
      return;
    }
    setLoading(true);
    router.push("/generate-recipe");
    window.setTimeout(() => setLoading(false), 1600);
  };

  return (
    <section className="relative overflow-hidden bg-[#FFF9F3] py-14 lg:py-20">
      {/* Soft glow behind the banner */}
      <div
        aria-hidden="true"
        className="fd-glow-pulse absolute left-1/2 top-1/2 h-[560px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(249,115,22,0.16),transparent)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
        {/* ══════════════ MAIN BANNER ══════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: easeOut }}
          className="relative overflow-hidden rounded-[36px] bg-[#0b1f15] text-white shadow-[0_50px_100px_-30px_rgba(6,40,22,0.5),0_20px_50px_-20px_rgba(249,115,22,0.2)]"
        >
          {/* ── Background layers ── */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_85%_-10%,rgba(249,115,22,0.32),transparent_52%),radial-gradient(90%_90%_at_0%_110%,rgba(16,185,129,0.28),transparent_55%),linear-gradient(150deg,#123722,#081710)]" />
            <div className="fd-grid-light absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_78%)]" />
            <div className="fd-noise absolute inset-0 opacity-40 mix-blend-soft-light" />

            {/* Gradient circles */}
            <div className="absolute -right-24 -top-28 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-[#f97316]/40 to-[#fde68a]/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-24 h-[380px] w-[380px] rounded-full bg-gradient-to-br from-[#22c55e]/25 to-transparent blur-3xl" />
            <div className="absolute right-[16%] top-1/2 h-40 w-40 -translate-y-1/2 rounded-full border border-dashed border-white/10" />

            {/* Floating AI particles */}
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

          {/* ── Content ── */}
          <div className="relative z-10 flex flex-col items-center gap-10 px-6 py-12 sm:px-10 sm:py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-14">
            {/* Left: copy */}
            <div className="flex max-w-xl flex-col items-center gap-6 text-center lg:items-start lg:text-left">
              {/* Badge */}
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fdba74] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-xl"
              >
                <motion.span
                  animate={{ rotate: [0, 15, -10, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-[#fb923c]"
                >
                  <Sparkles size={14} fill="currentColor" />
                </motion.span>
                Powered by AI
              </motion.span>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.18, ease: easeOut }}
                className="text-3xl font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-4xl lg:text-5xl [font-family:var(--font-display)]"
              >
                Your personal{" "}
                <span className="bg-gradient-to-r from-[#fdba74] via-[#fb923c] to-[#f97316] bg-clip-text text-transparent">
                  AI Chef
                </span>
              </motion.h2>

              {/* Sub copy */}
              <motion.p
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.26, ease: easeOut }}
                className="max-w-md text-sm leading-relaxed text-emerald-100/75"
              >
                Tell us what&apos;s in your fridge — we&apos;ll craft a perfect,
                restaurant-quality recipe for you in seconds.
              </motion.p>

              {/* CTA row */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.34, ease: easeOut }}
                className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
              >
                <motion.button
                  type="button"
                  onClick={handleTryAiChef}
                  whileHover={loading ? {} : { y: -3 }}
                  whileTap={loading ? {} : { scale: 0.96 }}
                  aria-disabled={loading}
                  className="fd-ripple-host fd-sheen fd-gradient-btn group/ai relative flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-bold text-white shadow-[0_16px_36px_rgba(249,115,22,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
                >
                  <span
                    aria-hidden="true"
                    className="fd-pulse-ring absolute inset-0 rounded-full"
                  />
                  {loading ? (
                    <span className="fd-spinner" />
                  ) : (
                    <Sparkles size={16} fill="currentColor" className="relative z-10" />
                  )}

                  <span className="relative z-10">
                    {loading ? "Cooking up…" : "Try AI Chef"}
                  </span>

                  {!loading && (
                    <ArrowRight
                      size={16}
                      className="relative z-10 transition-transform duration-300 group-hover/ai:translate-x-1.5"
                    />
                  )}
                </motion.button>
                
              </motion.div>
            </div>

            {/* Right: modern illustration */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.92 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3, ease: easeOut }}
              className="relative w-full max-w-[340px] shrink-0"
            >
              {/* Glow orb */}
              <div
                aria-hidden="true"
                className="fd-glow-pulse absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(249,115,22,0.5),rgba(251,146,60,0.18),transparent)]"
              />
              <div
                aria-hidden="true"
                className="fd-spin-slow absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15"
              />

              {/* Mini recipe preview card */}
              <div className="fd-float-slow relative z-10 overflow-hidden rounded-[28px] border border-white/15 bg-white/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-2xl">
                <div className="relative h-40 w-full">
                  <Image
                    src="/tomato_pasta.webp"
                    alt="AI generated recipe preview"
                    fill
                    sizes="340px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/40 bg-black/30 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                    <motion.span
                      animate={{ opacity: [1, 0.35, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="h-1.5 w-1.5 rounded-full bg-[#22c55e]"
                    />
                    AI Generating
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-[15px] font-extrabold tracking-tight text-white">
                    Roasted Tomato Pasta
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold text-[#fdba74]">
                      <Star size={10} fill="currentColor" />
                      4.9
                    </span>
                    <span className="flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold text-emerald-100/80">
                      <Clock size={10} />
                      20 min
                    </span>
                    <span className="flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold text-emerald-100/80">
                      <Leaf size={10} />
                      Vegan
                    </span>
                  </div>

                  {/* Shimmering progress bar */}
                  <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ x: "-100%" }}
                      whileInView={{ x: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#f97316] to-[#fde68a]"
                    />
                  </div>
                </div>
              </div>

              {/* Floating sparkle chip */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7, ease: easeOut }}
                className="absolute -right-3 top-10 z-20 hidden sm:block"
              >
                <div className="fd-float flex items-center gap-2 rounded-2xl border border-white/20 bg-white/15 px-3 py-2.5 shadow-[0_16px_36px_rgba(0,0,0,0.35)] backdrop-blur-xl" style={{ animationDelay: "1.2s" }}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#f97316] to-[#fb923c] text-white shadow-[0_6px_14px_rgba(249,115,22,0.5)]">
                    <Wand2 size={14} />
                  </span>
                  <div>
                    <p className="text-[11px] font-extrabold text-white">Instant Recipe</p>
                    <p className="text-[9px] font-semibold text-emerald-100/60">In seconds</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating sparkles */}
              {[
                { top: "-6%", left: "-8%", delay: "0s", size: 18 },
                { top: "46%", left: "-10%", delay: "1.4s", size: 12 },
                { top: "88%", right: "6%", delay: "0.8s", size: 14 },
              ].map((s, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  animate={{ rotate: [0, 20, -12, 0], scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: parseFloat(s.delay),
                    ease: "easeInOut",
                  }}
                  className="absolute z-20 text-[#fdba74] drop-shadow-[0_0_8px_rgba(251,146,60,0.9)]"
                  style={{ top: s.top, left: s.left, right: s.right }}
                >
                  <Sparkles size={s.size} fill="currentColor" />
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
