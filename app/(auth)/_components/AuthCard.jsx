"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import GradientButton from "./GradientButton";

const EASE = [0.22, 1, 0.36, 1];

const GoogleIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.5 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h12.94c-.58 3.06-2.3 5.66-4.9 7.41l7.57 5.88c4.4-4.06 6.89-10.04 6.89-17.3z"
    />
    <path
      fill="#FBBC05"
      d="M10.54 28.41A14.5 14.5 0 0 1 10.54 19.6l-7.98-6.19A23.99 23.99 0 0 0 2.56 24.5c0 3.9.94 7.59 2.58 10.8l7.98-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 47.5c6.48 0 11.92-2.14 15.89-5.81l-7.57-5.88c-2.1 1.41-4.79 2.25-8.32 2.25-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 47.5 24 47.5z"
    />
  </svg>
);

function AuthCard({
  badge,
  title,
  subtitle,
  children,
  register,
  onSubmit,
  isSubmitting,
  submitLabel = "Continue",
  submittingLabel = "Please wait…",
  isGoogleLoading,
  handleGoogleSignIn,
  showRemember = true,
  footerText,
  footerLinkText,
  footerHref,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
      className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/60 p-7 shadow-[0_30px_80px_rgba(111,80,50,0.16),0_10px_30px_rgba(111,80,50,0.08)] backdrop-blur-2xl sm:p-9"
    >
      {/* Decorative layers */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#fdba74]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[#f97316]/20 blur-3xl" />
      <div className="pointer-events-none absolute right-7 top-7 grid grid-cols-6 gap-1.5 opacity-60">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} className="h-1 w-1 rounded-full bg-[#fdba74]" />
        ))}
      </div>

      <div className="relative">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
            className="mx-auto w-max"
          >
            <div className="auth-badge-pulse flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f97316] to-[#fb923c] text-white shadow-[0_10px_24px_rgba(249,115,22,0.4)]">
              {badge}
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38, ease: EASE }}
            className="mt-5 text-[28px] font-extrabold tracking-tight text-[#111827] sm:text-[32px]"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.46, ease: EASE }}
            className="mt-2 text-sm font-medium text-[#64748b]"
          >
            {subtitle}
          </motion.p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
          {children}

          {showRemember && (
            <div className="flex items-center justify-between gap-4 pt-0.5">
              <label className="auth-check group flex cursor-pointer select-none items-center gap-2.5">
                <input type="checkbox" {...register("rememberMe")} />
                <span className="auth-checkbox">
                  <svg
                    className="auth-checkmark"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="text-[13.5px] font-semibold text-[#475569] transition-colors duration-200 group-hover:text-[#111827]">
                  Remember me
                </span>
              </label>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="cursor-pointer text-[13px] font-bold text-[#ea580c] underline-offset-4 transition-all duration-200 hover:text-[#c2410c] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
              >
                Forgot Password?
              </a>
            </div>
          )}

          <GradientButton
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting || isGoogleLoading}
            className="w-full"
          >
            <span>{isSubmitting ? submittingLabel : submitLabel}</span>
            {!isSubmitting && (
              <ArrowRight
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5"
                strokeWidth={2.4}
              />
            )}
          </GradientButton>
        </form>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#e7e0d4]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
            or continue with
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#e7e0d4]" />
        </div>

        {/* Google */}
        <motion.button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isSubmitting}
          whileHover={isGoogleLoading || isSubmitting ? undefined : { y: -2 }}
          whileTap={isGoogleLoading || isSubmitting ? undefined : { scale: 0.98 }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
          className="group relative flex h-[52px] w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-[#e7e0d4] bg-white/80 px-6 text-[14px] font-bold text-[#111827] shadow-[0_4px_14px_rgba(111,80,50,0.07)] backdrop-blur-sm transition-all duration-300 hover:border-[#f97316]/40 hover:bg-white hover:shadow-[0_12px_26px_rgba(111,80,50,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-[0_2px_8px_rgba(111,80,50,0.1)] ring-1 ring-[#e7e0d4] transition-transform duration-300 group-hover:scale-110">
            {isGoogleLoading ? <span className="auth-spinner auth-spinner-dark" /> : <GoogleIcon />}
          </span>
          {isGoogleLoading ? "Redirecting…" : "Continue with Google"}
        </motion.button>

        {/* Footer */}
        <p className="mt-7 text-center text-sm font-medium text-[#64748b]">
          {footerText}{" "}
          <Link
            href={footerHref}
            className="font-extrabold text-[#ea580c] underline-offset-4 transition-all duration-200 hover:text-[#c2410c] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
          >
            {footerLinkText}
          </Link>
        </p>
      </div>
    </motion.section>
  );
}

export default AuthCard;
