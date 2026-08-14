"use client";

import { motion } from "framer-motion";

function FloatingCard({
  icon,
  iconClass,
  title,
  subtitle,
  className,
  children,
  revealDelay = 0,
  floatDelay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.86 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: revealDelay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`absolute z-20 ${className}`}
    >
      <div className="auth-float" style={{ animationDelay: `${floatDelay}ms` }}>
        <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/75 p-3.5 shadow-[0_16px_36px_rgba(111,80,50,0.16),0_4px_12px_rgba(111,80,50,0.06)] backdrop-blur-xl">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
              iconClass ||
              "bg-gradient-to-br from-[#f97316] to-[#fb923c] text-white shadow-[0_6px_14px_rgba(249,115,22,0.3)]"
            }`}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <h4 className="text-[13px] font-extrabold leading-tight tracking-tight text-[#111827]">
              {title}
            </h4>
            {children ? (
              children
            ) : subtitle ? (
              <p className="mt-0.5 truncate text-[11.5px] font-semibold leading-none text-[#64748b]">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default FloatingCard;
