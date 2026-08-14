"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  ChefHat,
  Croissant,
  Egg,
  Heart,
  Pizza,
  Send,
  Sparkles,
} from "lucide-react";

const RECIPES = [
  "Trending Recipes",
  "Quick Meals",
  "Healthy Recipes",
  "Desserts",
  "Indian Cuisine",
  "Italian Cuisine",
];

const COMMUNITY = [
  "Community Feed",
  "Share Recipe",
  "Top Chefs",
  "Challenges",
  "Leaderboard",
  "Events",
];

const AI_TOOLS = [
  "AI Recipe Generator",
  "Ingredient Finder",
  "Meal Planner",
  "Nutrition Calculator",
  "Recipe Assistant",
];

const SUPPORT = [
  "About Us",
  "Contact",
  "FAQ",
  "Privacy Policy",
  "Terms of Service",
  "Help Center",
];

const SOCIALS = [
  {
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "Facebook",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "Pinterest",
    path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z",
  },
  {
    label: "YouTube",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    label: "Twitter",
    path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  },
];

const ease = [0.22, 1, 0.36, 1];

function FadeUp({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

const FloatingFood = ({ src, alt, className, anim = "fd-float-slow", delay = 0 }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute ${anim} ${className}`}
    style={delay ? { animationDelay: delay } : undefined}
  >
    <Image
      src={src}
      alt={alt}
      fill
      sizes="180px"
      className="object-contain drop-shadow-[0_18px_28px_rgba(234,88,12,0.22)]"
    />
  </div>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setShowTop(v > 520));

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <footer
      className="relative overflow-hidden bg-[#fff9f3] text-[#171717]"
      aria-label="Site footer"
    >
      <style>{`
        .ff-display { font-family: var(--font-display); }

        .ff-glass {
          background: rgba(255, 255, 255, 0.62);
          border: 1px solid rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          box-shadow:
            0 18px 42px rgba(111, 80, 50, 0.12),
            0 4px 14px rgba(111, 80, 50, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .ff-link { position: relative; }
        .ff-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -3px;
          height: 1.5px;
          width: 100%;
          background: linear-gradient(90deg, #f97316, #fbbf24);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ff-link:hover::after { transform: scaleX(1); }

        .ff-link:focus-visible,
        .ff-social:focus-visible,
        .ff-top-btn:focus-visible {
          outline: 2px solid #f97316;
          outline-offset: 3px;
        }

        .ff-social {
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
            color 0.25s ease, background-color 0.25s ease,
            border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .ff-social:hover {
          transform: scale(1.15) translateY(-2px);
          color: #ea580c;
          background-color: #fff1e6;
          border-color: #fed7aa;
          box-shadow: 0 8px 18px -8px rgba(249, 115, 22, 0.4);
        }

        .ff-field {
          border: 1px solid #f2e2d2;
          background: rgba(255, 255, 255, 0.85);
          transition: border-color 0.25s ease, box-shadow 0.25s ease,
            background-color 0.25s ease;
        }
        .ff-field:focus-within {
          border-color: #fb923c;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.14),
            0 0 24px -6px rgba(249, 115, 22, 0.4);
        }

        .ff-card-lift {
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.3s ease;
        }
        .ff-card-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 26px 50px -14px rgba(249, 115, 22, 0.22);
        }

        .ff-heart { animation: ff-beat 2s ease-in-out infinite; }
        @keyframes ff-beat {
          0%, 100% { transform: scale(1); }
          12% { transform: scale(1.22); }
          24% { transform: scale(1); }
          36% { transform: scale(1.14); }
          48% { transform: scale(1); }
        }

        .ff-top-btn {
          border: 1px solid rgba(254, 215, 170, 0.6);
          background: linear-gradient(135deg, #fb923c, #f97316 55%, #ea580c);
          box-shadow: 0 14px 30px -10px rgba(249, 115, 22, 0.55);
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.3s ease;
        }
        .ff-top-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 38px -10px rgba(234, 88, 12, 0.65);
        }
      `}</style>

      {/* ══════════════════════════════════════════════
          Main Footer — 5 columns
      ══════════════════════════════════════════════ */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-16 sm:px-8 lg:pt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          {/* Column 1 — Brand */}
          <FadeUp>
            <div className="max-w-[240px]">
              <a href="#" aria-label="SwadSafar home" className="group inline-block">
                <span className="block transition-transform duration-300 group-hover:scale-[1.03]">
                  <Image
                    src="/logo.webp"
                    alt="SwadSafar logo"
                    width={140}
                    height={140}
                    style={{ width: "auto", height: "auto" }}
                  />
                </span>
              </a>
              <p className="mt-4 text-sm leading-relaxed text-[#8a7a6b]">
                Discover, create, and share delicious recipes with food lovers
                around the world.
              </p>

              <div className="mt-6 flex items-center gap-2.5">
                {SOCIALS.map(({ label, path }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="ff-social flex h-9 w-9 items-center justify-center rounded-full border border-[#f0dcc6] bg-white text-[#a09385] shadow-[0_4px_10px_-4px_rgba(111,80,50,0.15)]"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]">
                      <path d={path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Column 2 — Recipes */}
          <FadeUp delay={0.06}>
            <FooterCol title="Recipes" links={RECIPES} />
          </FadeUp>

          {/* Column 3 — Community */}
          <FadeUp delay={0.12}>
            <FooterCol title="Community" links={COMMUNITY} />
          </FadeUp>

          {/* Column 4 — AI Tools */}
          <FadeUp delay={0.18}>
            <FooterCol title="AI Tools" links={AI_TOOLS} />
          </FadeUp>

          {/* Column 5 — Support */}
          <FadeUp delay={0.24}>
            <FooterCol title="Support" links={SUPPORT} />
          </FadeUp>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          Newsletter Card
      ══════════════════════════════════════════════ */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-14 sm:px-8">
        <FadeUp>
          <div className="ff-glass ff-card-lift grid items-center gap-8 overflow-hidden rounded-[24px] px-7 py-9 sm:px-10 md:grid-cols-[1.1fr_1.2fr]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl leading-none">🍽️</span>
                <h3 className="ff-display text-2xl font-extrabold tracking-tight text-[#1c130d]">
                  Weekly Recipe Inspiration
                </h3>
              </div>
              <p className="mt-2.5 max-w-md text-sm leading-relaxed text-[#8a7a6b]">
                Get new recipes, cooking tips, and AI-powered meal ideas every week.
              </p>
            </div>

            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease }}
                className="flex items-center gap-3 rounded-full border border-emerald-200 bg-emerald-50/90 px-5 py-3.5"
                role="status"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <p className="text-sm font-semibold text-emerald-700">
                  You&apos;re in! Fresh inspiration lands in your inbox every week.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
                <div className="ff-field flex flex-1 items-center rounded-full pl-4 pr-2">
                  <Send className="mr-2.5 h-4 w-4 shrink-0 text-orange-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-label="Email address"
                    className="w-full min-w-0 bg-transparent py-3 text-sm text-[#1c130d] outline-none placeholder:text-[#c0ac98]"
                  />
                </div>
                <button
                  type="submit"
                  className="fd-gradient-btn fd-sheen group inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-300 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-300"
                >
                  Subscribe
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </button>
              </form>
            )}

            <p className="text-[11px] text-[#b3a294] md:col-span-2">
              By subscribing you agree to our Privacy Policy. No spam — unsubscribe
              anytime.
            </p>
          </div>
        </FadeUp>
      </div>

      {/* ══════════════════════════════════════════════
          Bottom Bar
      ══════════════════════════════════════════════ */}
      <div className="relative z-10 mt-16 border-t border-[#f0dfcc] bg-white/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-7 text-center sm:px-8 md:flex-row md:text-left">
          <p className="text-xs font-medium text-[#a09385]">
            © 2026 SwadSafar. All rights reserved.
          </p>

          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#a09385]"
          >
            {["Privacy Policy", "Terms", "Cookies", "Accessibility"].map((label) => (
              <a
                key={label}
                href="#"
                className="ff-link transition-colors duration-250 hover:text-[#ea580c]"
              >
                {label}
              </a>
            ))}
          </nav>

          <p className="flex items-center gap-1.5 text-xs font-semibold text-[#8a7a6b]">
            Made with
            <Heart className="ff-heart h-3.5 w-3.5 fill-orange-500 text-orange-500" />
            for Food Lovers
          </p>
        </div>
      </div>

      {/* ── Floating Back-to-Top ── */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            onClick={scrollTop}
            initial={{ opacity: 0, y: 16, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.8 }}
            transition={{ duration: 0.35, ease }}
            aria-label="Back to top"
            className="ff-top-btn fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full text-white"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="ff-display text-[15px] font-extrabold tracking-tight text-[#1c130d]">
        {title}
      </h4>
      <span className="mt-3 block h-[3px] w-7 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" />
      <ul className="mt-5 space-y-3">
        {links.map((label) => (
          <li key={label}>
            <a
              href="#"
              className="ff-link inline-block text-[13.5px] font-medium text-[#8a7a6b] transition-colors duration-250 hover:text-[#ea580c]"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
