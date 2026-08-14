"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChefHat, Heart, Play, Sparkles, Users } from "lucide-react";
import FeatureItem from "./FeatureItem";
import GradientButton from "./GradientButton";

const EASE = [0.22, 1, 0.36, 1];

function Hero({ title = "Cook.", subtitle = "Share.", highlight = "Inspire." }) {
  return (
    <div className="relative z-20 flex w-full flex-col justify-center">
      {/* Trust badge */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
        className="inline-flex w-max max-w-full items-center gap-2.5 rounded-full border border-[#fec9a3]/70 bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#ea580c] shadow-[0_6px_20px_rgba(249,115,22,0.12)] backdrop-blur-md"
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f97316] to-[#fb923c] text-white shadow-[0_3px_8px_rgba(249,115,22,0.4)]">
          <Sparkles size={11} strokeWidth={2.6} />
        </span>
        Trusted by 50,000+ food lovers
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.14, ease: EASE }}
        className="mt-7 text-[56px] font-extrabold leading-[1.03] tracking-tight text-[#111827] sm:text-[64px] lg:text-[66px] xl:text-[72px]"
      >
        {title}
        <br />
        {subtitle}
        <br />
        <span className="auth-gradient-text">{highlight}</span>
      </motion.h1>

      {/* Copy */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.23, ease: EASE }}
        className="mt-6 max-w-[430px] text-[15px] font-medium leading-relaxed text-[#64748b]"
      >
        Join thousands of food lovers discovering and sharing amazing recipes every
        day. From quick weeknight dinners to weekend feasts.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.32, ease: EASE }}
        className="mt-9 flex flex-wrap items-center gap-4"
      >
        <GradientButton href="/recipes" className="px-7">
          Explore Recipes
          <ArrowRight
            className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5"
            strokeWidth={2.4}
          />
        </GradientButton>

        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center gap-3 rounded-2xl border border-white/70 bg-white/60 py-2.5 pl-3 pr-5 shadow-[0_8px_24px_rgba(111,80,50,0.1)] backdrop-blur-md transition-all duration-300 hover:bg-white hover:shadow-[0_14px_30px_rgba(111,80,50,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
        >
          <span className="auth-play flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f97316] to-[#fb923c] text-white shadow-[0_6px_14px_rgba(249,115,22,0.35)] transition-transform duration-300 group-hover:scale-110">
            <Play size={15} fill="currentColor" strokeWidth={0} className="ml-0.5" />
          </span>
          <span className="text-sm font-bold text-[#111827]">Watch Story</span>
        </motion.button>
      </motion.div>

      {/* Feature list */}
      <div className="mt-10 space-y-3">
        <FeatureItem
          icon={<ChefHat size={18} />}
          title="Curated Recipes"
          subtitle="From expert chefs worldwide"
          delay={420}
        />
        <FeatureItem
          icon={<Heart size={18} />}
          title="Save & Favorite"
          subtitle="Build your personal cookbook"
          delay={500}
        />
        <FeatureItem
          icon={<Users size={18} />}
          title="Join Community"
          subtitle="Share, connect & grow"
          delay={580}
        />
      </div>
    </div>
  );
}

export default Hero;
