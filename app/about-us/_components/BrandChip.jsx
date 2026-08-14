"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";

export default function BrandChip({ brand }) {
  if (!brand.logo) return null;
  return (
    <motion.div
      whileHover={{ scale: 1.12, y: -4 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 20 }}
      className="flex shrink-0 items-center justify-center px-6 sm:px-8"
      role="img"
      aria-label={`${brand.name} logo`}
    >
      <Image
        src={brand.logo}
        alt=""
        width={140}
        height={140}
        className="h-20 w-20 object-contain opacity-50 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 hover:drop-shadow-[0_10px_24px_rgba(249,115,22,0.35)] sm:h-24 sm:w-24"
      />
    </motion.div>
  );
}
