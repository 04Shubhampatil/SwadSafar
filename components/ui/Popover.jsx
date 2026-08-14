"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  UserRound,
  ChevronRight,
  Heart,
  BookOpen,
  Bookmark,
  Bell,
  Moon,
  Sun,
  Loader2,
  Check,
} from "lucide-react";
import { useTheme } from "@/lib/useTheme";

const POPOVER_GAP = 12;
const SAFE_MARGIN = 12;
const DEFAULT_POPOVER_WIDTH = 320;

const QUICK_ACTIONS = [
  { label: "My Profile", href: "/profile", icon: UserRound, subtitle: "View and edit your profile" },
  { label: "Favorites", href: "/favorites", icon: Heart, subtitle: "Recipes you have loved" },
  { label: "My Recipes", href: "/my-recipes", icon: BookOpen, subtitle: "Recipes you have created" },
  { label: "Saved Recipes", href: "/saved-recipes", icon: Bookmark, subtitle: "Your personal cookbook" },
  { label: "Notifications", href: "/notifications", icon: Bell, subtitle: "Alerts and updates" },
];

const spring = { type: "spring", stiffness: 340, damping: 30, mass: 0.9 };

function getInitials(name, email) {
  const source = name || email || "";
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0]?.[0] || email?.[0] || "U").toUpperCase();
}

export default function ProfilePopover({
  anchorRef,
  open,
  onClose,
  user,
  profile,
  unreadCount = 0,
  profileLoading = false,
  onSignOut,
  signingOut: signingOutProp,
}) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [popoverWidth, setPopoverWidth] = useState(DEFAULT_POPOVER_WIDTH);
  const [localSigningOut, setLocalSigningOut] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const isSigningOut = signingOutProp ?? localSigningOut;

  const popoverRef = useRef(null);
  const menuRef = useRef(null);
  const lastFocusedElement = useRef(null);
  const headingId = useId();

  const displayName = useMemo(() => {
    return (
      profile?.full_name ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split("@")[0] ||
      "Foodie"
    );
  }, [profile?.full_name, user]);

  const email = user?.email ?? "";
  const username = profile?.username ? `@${profile.username}` : null;
  const avatarUrl =
    profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  const initials = useMemo(() => getInitials(displayName, email), [displayName, email]);

  useLayoutEffect(() => {
    if (!open || !anchorRef?.current || typeof window === "undefined") return;

    const updatePosition = () => {
      const rect = anchorRef.current.getBoundingClientRect();
      const measuredWidth = popoverRef.current?.offsetWidth || DEFAULT_POPOVER_WIDTH;
      const nextWidth = Math.min(measuredWidth, window.innerWidth - SAFE_MARGIN * 2);

      setPopoverWidth(nextWidth);
      setPosition({
        top: rect.bottom + POPOVER_GAP,
        left: Math.min(
          Math.max(SAFE_MARGIN, rect.right - nextWidth),
          window.innerWidth - nextWidth - SAFE_MARGIN,
        ),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorRef, open]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      const clickedInsidePopover = popoverRef.current?.contains(event.target);
      const clickedInsideTrigger = anchorRef?.current?.contains(event.target);

      if (!clickedInsidePopover && !clickedInsideTrigger) {
        onClose?.();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;

      const focusableItems = menuRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableItems.length) {
        event.preventDefault();
        return;
      }

      const first = focusableItems[0];
      const last = focusableItems[focusableItems.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        first.focus?.();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus?.();
      }
    };

    lastFocusedElement.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const firstItem = menuRef.current?.querySelector(
      "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])",
    );
    firstItem?.focus?.();

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      lastFocusedElement.current?.focus?.();
    };
  }, [anchorRef, onClose, open]);

  if (!open) return null;

  const handleSignOut = async () => {
    if (!confirmSignOut) {
      setConfirmSignOut(true);
      return;
    }
    if (onSignOut) {
      await onSignOut();
      return;
    }
    setLocalSigningOut(true);
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setLocalSigningOut(false);
    setConfirmSignOut(false);
    onClose?.();
  };

  const content = (
    <motion.div
      id="profile-popover"
      ref={popoverRef}
      role="menu"
      aria-labelledby={headingId}
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={spring}
      className="fixed z-50 rounded-[28px] bg-gradient-to-b from-white/90 via-white/70 to-orange-50/50 p-px shadow-[0_30px_60px_-12px_rgba(111,80,50,0.3),0_12px_32px_-12px_rgba(111,80,50,0.2)]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${popoverWidth}px`,
      }}
    >
      <div className="absolute -top-1.5 right-6 z-10 h-3.5 w-3.5 rotate-45 border-l border-t border-white/70 bg-white/80 backdrop-blur-xl" />
      <div className="relative max-h-[calc(100vh-96px)] overflow-y-auto rounded-[27px] border border-white/60 bg-[#fff]/85 p-3 backdrop-blur-2xl backdrop-saturate-150">
        {/* ── Profile Header Card ── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-amber-50/70 to-orange-100/40 p-4">
          <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-orange-200/50 to-amber-100/20 blur-2xl" />
          <div className="relative flex items-center gap-3.5">
            <motion.div whileHover={{ scale: 1.05, rotate: -3 }} className="relative shrink-0">
              {profileLoading && !avatarUrl ? (
                <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-full border-2 border-white bg-orange-100" />
              ) : avatarUrl ? (
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white shadow-lg shadow-orange-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-orange-500 to-amber-500 text-lg font-extrabold text-white shadow-lg shadow-orange-200">
                  {initials}
                </div>
              )}
              <motion.span
                className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-emerald-500"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            <div className="min-w-0 flex-1">
              <p id={headingId} className="truncate text-sm font-bold text-neutral-800">
                {profileLoading && !displayName ? "Loading…" : displayName}
              </p>
              <p className="truncate text-[11px] font-medium text-neutral-500">
                {username || email || "No email"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Actions List ── */}
        <div ref={menuRef} className="mt-2 flex flex-col gap-0.5">
          {QUICK_ACTIONS.map(({ label, href, icon: Icon, subtitle }) => {
            const badge =
              label === "Notifications" && unreadCount > 0
                ? unreadCount > 99
                  ? "99+"
                  : unreadCount
                : null;
            return (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                className="group flex items-center justify-between rounded-xl px-2.5 py-2 text-neutral-700 transition-all duration-150 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50/60 hover:text-orange-600 focus:bg-gradient-to-r focus:from-orange-50 focus:to-amber-50/60 focus:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50 text-neutral-500 transition-all duration-200 group-hover:border-orange-100 group-hover:bg-orange-100 group-hover:text-orange-600">
                    <Icon size={15} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[13px] font-semibold text-neutral-800 group-hover:text-orange-600">
                      {label}
                    </span>
                    <span className="text-[10px] font-normal text-neutral-400 group-hover:text-orange-400">
                      {subtitle}
                    </span>
                  </span>
                </div>
                {badge ? (
                  <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 px-1.5 text-[10px] font-bold text-white shadow-sm shadow-orange-200"
                  >
                    {badge}
                  </motion.span>
                ) : (
                  <ChevronRight
                    size={14}
                    className="text-neutral-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-orange-400"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Dark Mode Toggle ── */}
        <div className="mt-2 flex flex-col gap-0.5">
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            onClick={toggle}
            className="group flex items-center justify-between rounded-xl px-2.5 py-2 text-neutral-700 transition-all duration-150 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50 text-neutral-500 transition-all duration-200 group-hover:border-orange-100 group-hover:bg-orange-100 group-hover:text-orange-600">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isDark ? "sun" : "moon"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDark ? <Sun size={15} /> : <Moon size={15} />}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="flex flex-col text-left">
                <span className="text-[13px] font-semibold text-neutral-800 group-hover:text-orange-600">
                  Dark Mode
                </span>
                <span className="text-[10px] font-normal text-neutral-400">
                  {isDark ? "On" : "Off"} · Adaptive theme
                </span>
              </span>
            </div>
            <span
              className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${
                isDark ? "bg-gradient-to-r from-orange-500 to-amber-500" : "bg-neutral-200"
              }`}
            >
              <motion.span
                animate={{ x: isDark ? 16 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
              />
            </span>
          </button>
        </div>

        {/* Separator */}
        <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-neutral-200/80 to-transparent" />

        {/* ── Sign Out (Danger) ── */}
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            aria-label="Sign out"
            className="group flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-left transition-all duration-150 hover:bg-gradient-to-r hover:from-rose-50 hover:to-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition-all duration-200 group-hover:scale-105 group-hover:bg-rose-100">
                {isSigningOut ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <motion.span
                    animate={confirmSignOut ? { x: [0, 4, -4, 2, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <LogOut size={15} />
                  </motion.span>
                )}
              </span>
              <span className="flex flex-col">
                <span className="text-[13px] font-semibold text-rose-600">
                  {isSigningOut ? "Signing out…" : confirmSignOut ? "Confirm sign out" : "Sign Out"}
                </span>
                <span className="text-[10px] font-normal text-neutral-400 group-hover:text-rose-400">
                  {confirmSignOut
                    ? "Tap again to sign out securely"
                    : "End your current session"}
                </span>
              </span>
            </div>
            {confirmSignOut ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={spring}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-sm"
              >
                <Check size={11} strokeWidth={3} />
              </motion.span>
            ) : (
              <ChevronRight
                size={14}
                className="text-rose-200 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-rose-400"
              />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );

  return typeof document !== "undefined"
    ? createPortal(content, document.body)
    : null;
}
