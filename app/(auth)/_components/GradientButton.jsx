"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

function GradientButton({
  children,
  href,
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  className = "",
  ariaLabel,
}) {
  const ref = useRef(null);

  const spawnRipple = (event) => {
    if (disabled || loading || !ref.current) return;
    const element = ref.current;
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className = "auth-ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    element.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 850);
  };

  const Tag = href ? motion.a : motion.button;
  const isDisabled = disabled || loading;

  return (
    <Tag
      ref={ref}
      href={href}
      type={href ? undefined : type}
      onClick={onClick}
      onPointerDown={spawnRipple}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
      disabled={href ? undefined : isDisabled}
      whileHover={isDisabled ? undefined : { y: -2 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      className={`auth-ripple-host auth-sheen auth-gradient-btn group inline-flex h-[52px] items-center justify-center gap-2.5 rounded-2xl px-7 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(249,115,22,0.35),0_3px_8px_rgba(249,115,22,0.25)] transition-shadow duration-300 hover:shadow-[0_16px_34px_rgba(249,115,22,0.45),0_4px_10px_rgba(249,115,22,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading ? <span className="auth-spinner" /> : children}
    </Tag>
  );
}

export default GradientButton;
