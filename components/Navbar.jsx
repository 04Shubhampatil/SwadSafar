"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Search,
  Menu,
  X,
  Heart,
  Mic,
  ArrowRight,
  Clock,
  Flame,
  TrendingUp,
  Sparkles,
  ChefHat,
  LogOut,
  User,
  LogIn,
  Home,
  BookOpen,
  Info,
  Users,
  Bookmark,
  Bell,
} from "lucide-react";
import Popover from "./ui/Popover";
import Image from "next/image";
import { useAuth } from "@/lib/useAuth";
import { useProfileData } from "@/lib/useProfileData";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const getInitials = (name, email) => {
  const source = name || email || "";
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0]?.[0] || email?.[0] || "U").toUpperCase();
};

// Public navigation links — always visible regardless of auth state
const PUBLIC_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Recipes", href: "/recipes" },
  { label: "About Us", href: "/about-us" },
  { label: "Community", href: "/community" },
];

const RECENT_SEARCHES = ["Paneer Tikka", "Masala Dosa"];
const TRENDING = [
  { label: "Butter Chicken", emoji: "🍛", queries: "12k" },
  { label: "Biryani", emoji: "🍚", queries: "9.4k" },
  { label: "Chole Bhature", emoji: "🥘", queries: "7.1k" },
];

// Mobile menu — public pages (shown to everyone)
const MOBILE_PUBLIC_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Recipes", href: "/recipes", icon: BookOpen },
  { label: "About Us", href: "/about-us", icon: Info },
  { label: "Community", href: "/community", icon: Users },
];

// Mobile menu — authenticated account links
const MOBILE_ACCOUNT_LINKS = [
  { label: "Create Recipe", href: "/generate-recipe", icon: Sparkles },
  { label: "My Profile", href: "/profile", icon: User },
  { label: "Favorites", href: "/favorites", icon: Heart },
  { label: "Saved Recipes", href: "/saved-recipes", icon: Bookmark },
  { label: "Notifications", href: "/notifications", icon: Bell },
];

const spring = { type: "spring", stiffness: 340, damping: 28, mass: 0.8 };
const softSpring = { type: "spring", stiffness: 300, damping: 24 };
const EASE = [0.22, 1, 0.36, 1];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { profile, unreadCount, loading: profileLoading } = useProfileData(user);

  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const buttonRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [open, setOpen] = useState(false);

  const { scrollY } = useScroll();
  const [navHidden, setNavHidden] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    const shouldHide = latest > prev && latest > 140;
    if (shouldHide !== navHidden) setNavHidden(shouldHide);
    if (shouldHide) setMenuOpen(false);
  });

  // Close on Escape + outside click for the mobile menu
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [menuOpen]);

  const isActiveLink = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const suggestions = useMemo(() => {
    if (query.trim()) {
      return [query, ...TRENDING.map((t) => t.label)].filter(
        (s) => s && s.toLowerCase().includes(query.toLowerCase()),
      );
    }
    return [];
  }, [query]);

  const handleSearchChange = (value) => {
    setQuery(value);
    if (value) {
      setSearchLoading(true);
      const t = setTimeout(() => setSearchLoading(false), 700);
      return () => clearTimeout(t);
    }
  };

  const handleSearchSubmit = () => {
    const q = query.trim();
    setSearchFocused(false);
    if (q) router.push(`/recipes?q=${encodeURIComponent(q)}`);
    else router.push("/recipes");
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSigningOut(false);
    setOpen(false);
    setMenuOpen(false);
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  };

  const rippleHostClass =
    "relative overflow-hidden active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2";

  return (
    <motion.header
      animate={{ y: navHidden ? -130 : 0 }}
      transition={spring}
      className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-5 sm:pt-4  "
    >
      {/* ── Floating Glass Navbar ── */}
      <div className="mx-auto max-w-6xl rounded-[28px] bg-transparent p-px shadow-[0_20px_50px_-12px_rgba(111,80,50,0.25),0_10px_24px_-10px_rgba(111,80,50,0.12)]">
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={softSpring}
          className="flex items-center justify-between gap-3 rounded-[27px] border border-white/50 bg-[#faf7f2]/80 px-4 py-2.5 backdrop-blur-2xl backdrop-saturate-150 sm:gap-6 sm:px-5"
        >
          {/* ── Logo ── */}
          <Link
            href="/"
            aria-label="SwadSafar home"
            className="group flex shrink-0 select-none items-center"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center text-[22px] leading-none"
            >
              <Image
                src="/logo.webp"
                alt="SwadSafar logo"
                width={155}
                height={155}
                style={{ width: "auto", height: "auto" }}
              />
            </motion.span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {PUBLIC_NAV_LINKS.map(({ label, href }) => {
              const active = isActiveLink(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  className="group relative rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition-colors duration-200 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-1"
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={spring}
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-orange-100 to-amber-50"
                    />
                  )}
                  <motion.span
                    whileHover={{ y: -2 }}
                    className="relative flex items-center gap-1.5"
                  >
                    {label}
                  </motion.span>
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      transition={spring}
                      className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400"
                    />
                  )}
                </Link>
              );
            })}

            {/* Create Recipe — only for logged-in users */}
            {!loading && user && (
              <Link
                href="/generate-recipe"
                aria-label="Create Recipe"
                className="group relative rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition-colors duration-200 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-1"
              >
                {isActiveLink("/generate-recipe") && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={spring}
                    className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-orange-100 to-amber-50"
                  />
                )}
                <motion.span
                  whileHover={{ y: -2 }}
                  className="relative flex items-center gap-1.5"
                >
                  <ChefHat size={15} className="text-orange-500" />
                  Create Recipe
                </motion.span>
                {isActiveLink("/generate-recipe") && (
                  <motion.span
                    layoutId="nav-underline"
                    transition={spring}
                    className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400"
                  />
                )}
              </Link>
            )}
          </nav>

          {/* ── Search + Actions ── */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Premium Search */}
            <div className="relative">
              <motion.div
                animate={{ width: searchFocused ? 320 : 200 }}
                transition={spring}
                className="group relative flex items-center rounded-full border border-white/60 bg-white/60 px-3.5 py-2 shadow-[0_8px_20px_-8px_rgba(111,80,50,0.18)] backdrop-blur-xl transition-shadow duration-300 focus-within:ring-4 focus-within:ring-orange-200/70 focus-within:shadow-[0_8px_30px_-6px_rgba(249,115,22,0.4)]"
              >
                <motion.span
                  animate={searchFocused ? { rotate: 0 } : { rotate: 0 }}
                  className="mr-2 shrink-0 text-neutral-400 transition-colors group-focus-within:text-orange-500"
                >
                  <Search size={16} />
                </motion.span>
                <input
                  id="nav-search"
                  type="search"
                  value={query}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                  placeholder="Search recipes..."
                  autoComplete="off"
                  aria-label="Search recipes"
                  role="combobox"
                  aria-expanded={searchFocused}
                  aria-controls="nav-search-dropdown"
                  className="w-full min-w-0 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
                />
                {searchLoading ? (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-2 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-orange-200 border-t-orange-500"
                    style={{ animation: "fd-spin 0.7s linear infinite" }}
                  />
                ) : query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="group/clear ml-1 shrink-0 rounded-full p-0.5 text-neutral-400 transition-colors hover:bg-orange-50 hover:text-orange-500"
                  >
                    <X size={13} />
                  </button>
                ) : (
                  <Mic
                    size={14}
                    className="ml-1 shrink-0 cursor-pointer text-neutral-400 transition-colors hover:text-orange-500"
                  />
                )}
              </motion.div>

              {/* Search Suggestions Dropdown */}
              <AnimatePresence>
                {searchFocused && (
                  <motion.div
                    id="nav-search-dropdown"
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={softSpring}
                    role="region"
                    aria-label="Search suggestions"
                    className="absolute right-0 top-full z-40 mt-2 w-80 overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-1.5 shadow-[0_24px_50px_-12px_rgba(111,80,50,0.3)] backdrop-blur-2xl"
                  >
                    {searchLoading ? (
                      <div className="flex flex-col gap-2 p-3">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="h-8 animate-pulse rounded-lg bg-orange-100/50"
                          />
                        ))}
                      </div>
                    ) : suggestions.length > 0 ? (
                      <div className="flex flex-col gap-0.5">
                        <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                          Suggestions
                        </p>
                        {suggestions.slice(0, 5).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setQuery(s);
                              handleSearchSubmit();
                            }}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-orange-50 hover:text-orange-600"
                          >
                            <Search size={14} className="text-neutral-400" />
                            {s}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <>
                        {/* Recent searches */}
                        <div className="px-2 pb-1 pt-1">
                          <p className="flex items-center gap-1.5 px-1 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                            <Clock size={11} /> Recent
                          </p>
                          <div className="flex flex-col gap-0.5">
                            {RECENT_SEARCHES.map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => {
                                setQuery(s);
                                setTimeout(() => router.push(`/recipes?q=${encodeURIComponent(s)}`), 50);
                              }}
                                className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-left text-sm text-neutral-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
                              >
                                <Clock size={13} className="text-neutral-400" />
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="my-1 h-px bg-neutral-100" />
                        {/* Trending */}
                        <div className="px-2 pb-1">
                          <p className="flex items-center gap-1.5 px-1 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                            <Flame size={11} className="text-orange-500" /> Trending
                          </p>
                          <div className="flex flex-col gap-0.5">
                            {TRENDING.map((t) => (
                              <button
                                key={t.label}
                                type="button"
                                onClick={() => {
                                  setQuery(t.label);
                                  setTimeout(() => router.push(`/recipes?q=${encodeURIComponent(t.label)}`), 50);
                                }}
                                className="flex items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm text-neutral-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
                              >
                                <span className="flex items-center gap-2.5">
                                  <span>{t.emoji}</span>
                                  {t.label}
                                </span>
                                <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-400">
                                  <TrendingUp size={11} className="text-orange-400" />
                                  {t.queries}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth-aware action buttons */}
            {!loading && (
              <>
                {user ? (
                  /* Logged in — Profile avatar + Popover */
                  <div className="relative">
                    <button
                      ref={buttonRef}
                      type="button"
                      onClick={() => setOpen((prev) => !prev)}
                      id="nav-avatar"
                      aria-label="Open user menu"
                      aria-haspopup="menu"
                      aria-expanded={open}
                      aria-controls="profile-popover"
                      className={`${rippleHostClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2`}
                    >
                      <motion.span
                        whileHover={{ scale: 1.08, rotate: -4 }}
                        whileTap={{ scale: 0.92 }}
                        className="relative block h-9 w-9 overflow-hidden rounded-full border-2 border-white/90 p-0 shadow-[0_4px_14px_-2px_rgba(111,80,50,0.4),0_0_0_1px_rgba(249,115,22,0.15)] transition-shadow duration-300 hover:shadow-[0_6px_20px_-2px_rgba(249,115,22,0.45)]"
                      >
                        {(() => {
                          const avatarUrl =
                            profile?.avatar_url ||
                            user?.user_metadata?.avatar_url ||
                            user?.user_metadata?.picture ||
                            null;
                          const name =
                            profile?.full_name ||
                            user?.user_metadata?.full_name ||
                            user?.user_metadata?.name ||
                            "";
                          if (avatarUrl) {
                            return (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={avatarUrl}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover"
                              />
                            );
                          }
                          return (
                            <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-500 to-amber-500 text-xs font-extrabold text-white">
                              {getInitials(name, user?.email)}
                            </span>
                          );
                        })()}
                        <motion.span
                          className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"
                          animate={{ scale: [1, 1.12, 1] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </motion.span>
                    </button>

                    <Popover
                      anchorRef={buttonRef}
                      open={open}
                      onClose={() => setOpen(false)}
                      user={user}
                      profile={profile}
                      unreadCount={unreadCount}
                      profileLoading={profileLoading}
                      onSignOut={handleSignOut}
                      signingOut={signingOut}
                    />
                  </div>
                ) : (
                  /* Logged out — Login button */
                  <Link
                    href="/sign-in"
                    id="nav-login"
                    className={`${rippleHostClass} group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-semibold text-orange-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md`}
                  >
                    <LogIn size={13} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
                    Login
                  </Link>
                )}
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            id="nav-hamburger"
            aria-label="Open menu"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            onClick={() => setMenuOpen((p) => !p)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition-all duration-200 hover:bg-orange-50 hover:text-orange-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 md:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.div>
      </div>

      {/* ── Mobile Menu Popover ── */}
      <div
        ref={mobileMenuRef}
        className="pointer-events-none fixed inset-0 z-[60] md:hidden"
        aria-hidden="true"
      >
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Very subtle transparent backdrop — page stays visible */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMenuOpen(false)}
                className="pointer-events-auto absolute inset-0 bg-neutral-900/10 backdrop-blur-[2px]"
              />
              {/* Floating popover */}
              <motion.div
                id="mobile-nav-menu"
                role="menu"
                aria-label="Mobile navigation"
                initial={{ opacity: 0, scale: 0.96, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -8 }}
                transition={{ duration: 0.2, ease: EASE }}
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto absolute right-3 top-16 z-[60] w-[calc(100vw-24px)] max-w-[360px] origin-top-right rounded-[20px] border border-white/70 bg-white/90 p-2.5 shadow-[0_30px_60px_-15px_rgba(111,80,50,0.35),0_12px_28px_-12px_rgba(111,80,50,0.22)] backdrop-blur-2xl backdrop-saturate-150 sm:right-5 sm:top-[72px] sm:w-[340px]"
              >
                {/* ── Profile Header (logged in) ── */}
                {!loading && user && (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-orange-50 via-amber-50/70 to-orange-100/40 p-3 transition-colors duration-150 hover:bg-orange-50"
                    >
                      <span className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md shadow-orange-200">
                        {(() => {
                          const avatarUrl =
                            profile?.avatar_url ||
                            user?.user_metadata?.avatar_url ||
                            user?.user_metadata?.picture ||
                            null;
                          const name =
                            profile?.full_name ||
                            user?.user_metadata?.full_name ||
                            user?.user_metadata?.name ||
                            "";
                          if (avatarUrl) {
                            return (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={avatarUrl}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover"
                              />
                            );
                          }
                          return (
                            <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-500 to-amber-500 text-sm font-extrabold text-white">
                              {getInitials(name, user?.email)}
                            </span>
                          );
                        })()}
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-bold text-neutral-800">
                          {profile?.full_name ||
                            user?.user_metadata?.full_name ||
                            user?.user_metadata?.name ||
                            "Foodie"}
                        </span>
                        <span className="block truncate text-[11px] font-medium text-neutral-500">
                          {profile?.username
                            ? `@${profile.username}`
                            : user?.email?.split("@")[0] || "foodie"}
                        </span>
                      </span>
                    </Link>
                    <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-neutral-200/70 to-transparent" />
                  </>
                )}

                {/* ── Public Links ── */}
                <div className="flex flex-col gap-0.5">
                  {MOBILE_PUBLIC_LINKS.map(({ label, href, icon: Icon }) => {
                    const active = isActiveLink(href);
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        aria-label={label}
                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-150 ${
                          active
                            ? "bg-gradient-to-r from-orange-50 to-amber-50/50 font-semibold text-orange-600"
                            : "text-neutral-600 hover:bg-orange-50/70 hover:text-neutral-900"
                        }`}
                      >
                        <Icon size={15} className={active ? "text-orange-500" : "text-neutral-400"} />
                        {label}
                      </Link>
                    );
                  })}
                </div>

                {/* ── Account Links (logged in) ── */}
                {!loading && user && (
                  <>
                    <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-neutral-200/70 to-transparent" />
                    <div className="flex flex-col gap-0.5">
                      {MOBILE_ACCOUNT_LINKS.map(({ label, href, icon: Icon }) => {
                        const active = isActiveLink(href);
                        const badge =
                          label === "Notifications" && unreadCount > 0
                            ? unreadCount > 99
                              ? "99+"
                              : unreadCount
                            : null;
                        return (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            aria-label={label}
                            className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-150 ${
                              active
                                ? "bg-gradient-to-r from-orange-50 to-amber-50/50 font-semibold text-orange-600"
                                : "text-neutral-600 hover:bg-orange-50/70 hover:text-neutral-900"
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              <Icon
                                size={15}
                                className={active ? "text-orange-500" : "text-neutral-400"}
                              />
                              {label}
                            </span>
                            {badge && (
                              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 px-1.5 text-[10px] font-bold text-white shadow-sm shadow-orange-200">
                                {badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                    <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-neutral-200/70 to-transparent" />
                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={signingOut}
                      aria-label="Sign out"
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-rose-600 transition-colors duration-150 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <LogOut size={15} className="text-rose-500" />
                      {signingOut ? "Signing out…" : "Sign Out"}
                    </button>
                  </>
                )}

                {/* ── Logged out: Login ── */}
                {!loading && !user && (
                  <div className="mt-2">
                    <Link
                      href="/sign-in"
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-all duration-200 active:scale-[0.98]"
                    >
                      <LogIn size={14} />
                      Login
                    </Link>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
