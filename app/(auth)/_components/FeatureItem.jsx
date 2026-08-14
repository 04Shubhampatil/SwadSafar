"use client";

import { motion } from "framer-motion";

function FeatureItem({ icon, title, subtitle, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4 }}
      className="group flex items-center gap-4 rounded-2xl border border-white/70 bg-white/55 p-3.5 shadow-[0_8px_24px_rgba(111,80,50,0.07)] backdrop-blur-md transition-all duration-300 hover:bg-white/80 hover:shadow-[0_14px_30px_rgba(249,115,22,0.12)]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f97316] to-[#fb923c] text-white shadow-[0_6px_14px_rgba(249,115,22,0.32)] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
        {icon}
      </div>
      <div className="min-w-0">
        <h4 className="text-[14px] font-extrabold leading-tight tracking-tight text-[#111827]">
          {title}
        </h4>
        <p className="mt-0.5 text-[12.5px] font-medium text-[#64748b]">{subtitle}</p>
      </div>
    </motion.div>
  );
}

export default FeatureItem;
