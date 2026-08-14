"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

export default function RippleButton({ children, className = "", ...rest }) {
  const ref = useRef(null);

  const spawnRipple = (event) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className = "fd-ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    el.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 850);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onPointerDown={spawnRipple}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.96 }}
      className={`fd-ripple-host fd-sheen fd-gradient-btn inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-[0_16px_34px_rgba(249,115,22,0.4)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#f97316] ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
