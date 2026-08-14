"use client";

import { ChefHat, Heart, Soup, Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import FloatingCard from "./FloatingCard";

/* ---- Floating ingredient illustrations ---- */

const BasilLeaf = () => (
  <svg width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <ellipse cx="20" cy="26" rx="6.5" ry="11" fill="#4ade80" transform="rotate(-18 20 26)" />
    <ellipse cx="20" cy="26" rx="6.5" ry="11" fill="#22c55e" transform="rotate(18 20 26)" />
    <ellipse cx="20" cy="22" rx="5.5" ry="9" fill="#16a34a" />
    <path d="M20 12V26" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Tomato = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path d="M20 16C13 6 7 10 10 16C13 18 17 19 20 16Z" fill="#22c55e" />
    <path d="M20 16C27 6 33 10 30 16C27 18 23 19 20 16Z" fill="#16a34a" />
    <circle cx="20" cy="25" r="12" fill="#ef4444" />
    <circle cx="20" cy="25" r="12" stroke="#dc2626" strokeWidth="1.5" fill="none" />
    <ellipse cx="15" cy="21" rx="3" ry="1.8" fill="#fff" opacity="0.35" />
  </svg>
);

const Garlic = () => (
  <svg width="26" height="26" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path
      d="M20 7C27 7 30 13 30 20C30 27 25 33 20 35C15 33 10 27 10 20C10 13 13 7 20 7Z"
      fill="#fef3c7"
    />
    <path
      d="M20 7C27 7 30 13 30 20C30 27 25 33 20 35C15 33 10 27 10 20C10 13 13 7 20 7Z"
      stroke="#fde68a"
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M20 8C24 15 24 23 20 34" stroke="#fde68a" strokeWidth="1.2" />
    <path d="M17 13C20 17 20 21 18 26" stroke="#fde68a" strokeWidth="1.2" />
  </svg>
);

const Cheese = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path d="M7 29L33 29L20 7L7 29Z" fill="#fbbf24" />
    <path
      d="M7 29L33 29L20 7L7 29Z"
      stroke="#f59e0b"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="17" cy="23" r="2.6" fill="#f59e0b" opacity="0.5" />
    <circle cx="26" cy="26" r="1.7" fill="#f59e0b" opacity="0.5" />
    <circle cx="13" cy="27" r="1.5" fill="#f59e0b" opacity="0.5" />
  </svg>
);

function Ingredient({ children, className, delay = 0 }) {
  return (
    <div
      className={`auth-ingredient absolute z-10 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="drop-shadow-[0_10px_18px_rgba(111,80,50,0.22)]">{children}</div>
    </div>
  );
}

/* ---- The bowl scene (shared by mobile + desktop) ---- */

function BowlScene({ image, recipeName }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative flex h-[360px] w-[340px] items-center justify-center sm:h-[400px] sm:w-[400px] lg:h-[360px] lg:w-[300px] xl:h-[430px] xl:w-[440px]"
    >
      {/* Soft radial glow behind the bowl */}
      <div className="auth-glow-pulse auth-bowl-glow absolute inset-[6%] rounded-full" />

      {/* Warm base circle */}
      <div className="absolute inset-[10%] rounded-full border border-white/80 bg-gradient-to-br from-white/95 to-[#fff1e4]/80 shadow-[0_24px_60px_rgba(249,115,22,0.14),inset_0_2px_14px_rgba(255,255,255,0.9),inset_0_-6px_20px_rgba(249,115,22,0.08)]" />

      {/* Decorative rings */}
      <div className="auth-spin-slow absolute inset-[3%] rounded-full border border-dashed border-[#fec9a3]/60" />
      <div className="absolute inset-[16%] rounded-full border border-[#fde8d0]/80" />

      {/* Food bowl image */}
      <div className="auth-float-slow relative z-10">
        <Image
          src={image}
          width={320}
          height={320}
          alt="Featured recipe"
          loading="eager"
          className="h-[210px] w-[210px] object-contain drop-shadow-[0_30px_38px_rgba(111,80,50,0.3)] sm:h-[250px] sm:w-[250px] lg:h-[220px] lg:w-[220px] xl:h-[280px] xl:w-[280px]"
        />
      </div>

      {/* Floating glass cards */}
      <FloatingCard
        className="left-[-4px] top-[6%] sm:left-[-10px]"
        icon={<Star size={17} fill="currentColor" />}
        title="4.9 Rating"
        revealDelay={150}
        floatDelay={0}
      >
        <div className="mt-1 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} viewBox="0 0 24 24" fill="#f97316" className="h-2.5 w-2.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
      </FloatingCard>

      <FloatingCard
        className="right-[-6px] top-[16%] sm:right-[-18px]"
        icon={<ChefHat size={17} />}
        title="50K+ Recipes"
        subtitle="Crafted by chefs"
        iconClass="bg-white text-[#ea580c] ring-1 ring-[#ffe1c6] shadow-[0_6px_14px_rgba(249,115,22,0.16)]"
        revealDelay={260}
        floatDelay={900}
      />

      <FloatingCard
        className="bottom-[20%] left-[-6px] sm:left-[-18px]"
        icon={<Heart size={17} fill="currentColor" />}
        title="120K Happy Food Lovers"
        iconClass="bg-gradient-to-br from-[#f97316] to-[#fb923c] text-white"
        revealDelay={370}
        floatDelay={1800}
      />

      <FloatingCard
        className="bottom-[5%] right-[4px] sm:right-[-6px]"
        icon={<Soup size={17} />}
        title="Recipe of the Day"
        subtitle={recipeName}
        iconClass="bg-white text-[#ea580c] ring-1 ring-[#ffe1c6] shadow-[0_6px_14px_rgba(249,115,22,0.16)]"
        revealDelay={480}
        floatDelay={2700}
      />

      {/* Floating ingredients */}
      <Ingredient className="right-[8%] top-[2%]" delay={600}>
        <BasilLeaf />
      </Ingredient>
      <Ingredient className="left-[2%] top-[38%]" delay={900}>
        <Tomato />
      </Ingredient>
      <Ingredient className="right-[0%] top-[48%]" delay={1200}>
        <Garlic />
      </Ingredient>
      <Ingredient className="bottom-[2%] left-[10%]" delay={1500}>
        <Cheese />
      </Ingredient>
    </motion.div>
  );
}

function FoodIllustration({ image, recipeName = "Tomato Penne" }) {
  return (
    <>
      {/* Mobile / tablet: in-flow, centered */}
      <div className="relative z-10 flex flex-col items-center justify-center py-2 lg:hidden">
        <BowlScene image={image} recipeName={recipeName} />
      </div>

      {/* Desktop: absolutely centered between the two columns */}
      <div className="absolute inset-y-0 left-[46%] z-20 hidden -translate-x-1/2 items-center justify-center lg:flex xl:left-1/2">
        <BowlScene image={image} recipeName={recipeName} />
      </div>
    </>
  );
}

export default FoodIllustration;
