"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Search, Mic, X, Star, Clock, Flame } from "lucide-react";

const PLACEHOLDERS = [
  "Search recipes by name or ingredient…",
  "Try “creamy tomato pasta”…",
  "Try “chicken tikka”…",
  "Search by cuisine or vibe…",
];

const POPULAR_SEARCHES = ["Pasta", "Chicken", "Vegan", "Quick", "Dessert"];

export default function SearchBar({ query, setQuery, suggestions = [], onSelect }) {
  const [focused, setFocused] = useState(false);
  const [listening, setListening] = useState(false);
  const [phIndex, setPhIndex] = useState(0);
  const blurTimer = useRef(null);

  useEffect(() => {
    if (query) return;
    const id = setInterval(
      () => setPhIndex((i) => (i + 1) % PLACEHOLDERS.length),
      3200
    );
    return () => clearInterval(id);
  }, [query]);

  const showSuggestions = focused && !listening;

  return (
    <div className="relative w-full max-w-2xl">
      {/* ── Floating glass container ── */}
      <motion.div
        animate={{ scale: focused ? 1.01 : 1, y: focused ? -2 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="flex items-center gap-2.5 rounded-[24px] border border-white/70 bg-white/65 px-5 py-3.5 shadow-[0_20px_44px_rgba(111,80,50,0.12),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-xl transition-shadow duration-300 focus-within:border-[#fdba74] focus-within:shadow-[0_24px_56px_rgba(249,115,22,0.22),0_0_0_5px_rgba(249,115,22,0.08)]"
      >
        <motion.span
          animate={
            focused
              ? { scale: 1.12, rotate: -8, color: "#f97316" }
              : { scale: 1, rotate: 0, color: "#b0a89a" }
          }
          transition={{ type: "spring", stiffness: 380, damping: 20 }}
          className="shrink-0"
        >
          <Search size={19} />
        </motion.span>

        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              clearTimeout(blurTimer.current);
              setFocused(true);
            }}
            onBlur={() => {
              blurTimer.current = setTimeout(() => setFocused(false), 160);
            }}
            aria-label="Search recipes"
            aria-expanded={showSuggestions}
            aria-controls="recipe-search-suggestions"
            role="combobox"
            className="w-full bg-transparent py-1 text-sm font-medium text-[#111827] outline-none placeholder:text-transparent"
          />
          {!query && (
            <AnimatePresence mode="wait">
              <motion.span
                key={phIndex}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-sm text-[#b0a89a]"
              >
                {PLACEHOLDERS[phIndex]}
              </motion.span>
            </AnimatePresence>
          )}
        </div>

        {query && (
          <motion.button
            type="button"
            aria-label="Clear search"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => setQuery("")}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#a09485] transition-colors hover:bg-orange-50 hover:text-[#ea580c]"
          >
            <X size={14} />
          </motion.button>
        )}

        <motion.button
          type="button"
          aria-label={listening ? "Stop voice search" : "Voice search"}
          aria-pressed={listening}
          whileTap={{ scale: 0.85 }}
          onClick={() => setListening((p) => !p)}
          className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
            listening
              ? "bg-gradient-to-br from-[#f97316] to-[#fb923c] text-white"
              : "bg-[#fff7ed] text-[#ea580c] hover:bg-orange-50"
          }`}
        >
          {listening && (
            <span aria-hidden="true" className="fd-pulse-ring absolute inset-0 rounded-full" />
          )}
          <Mic size={16} />
        </motion.button>
      </motion.div>

      {/* ── Suggestions dropdown ── */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            id="recipe-search-suggestions"
            role="listbox"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full z-40 mt-3 overflow-hidden rounded-[24px] border border-white/70 bg-white/85 p-2.5 shadow-[0_36px_72px_rgba(111,80,50,0.18),0_12px_28px_rgba(111,80,50,0.1)] backdrop-blur-2xl"
          >
            {!query ? (
              <div className="p-3">
                <p className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#a09485]">
                  <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#f97316]" />
                  Popular searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((label) => (
                    <motion.button
                      key={label}
                      type="button"
                      whileHover={{ y: -2, scale: 1.04 }}
                      whileTap={{ scale: 0.92 }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setQuery(label);
                      }}
                      className="rounded-full border border-[#fde8cf]/80 bg-[#fff8f0] px-4 py-2 text-xs font-bold text-[#61564a] transition-colors hover:border-[#fdba74] hover:text-[#ea580c]"
                    >
                      {label}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : suggestions.length ? (
              <ul className="flex flex-col">
                {suggestions.map((r) => (
                  <motion.li
                    key={r.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      type="button"
                      role="option"
                      aria-selected={false}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSelect(r.title);
                        setFocused(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-[#fff7ed]"
                    >
                      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl">
                        <Image
                          src={r.image}
                          alt=""
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-bold text-[#111827]">
                          {r.title}
                        </span>
                        <span className="mt-0.5 flex items-center gap-2 text-[11px] font-semibold text-[#a09485]">
                          <span className="flex items-center gap-1">
                            <Star size={10} fill="#f97316" className="text-[#f97316]" />
                            {r.rating.toFixed(1)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} className="text-[#f97316]" />
                            {r.prepTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame size={10} className="text-[#f97316]" />
                            {r.calories}
                          </span>
                        </span>
                      </span>
                      <span className="rounded-full border border-[#fde8cf] bg-white px-3 py-1.5 text-[10px] font-bold text-[#ea580c]">
                        {r.cuisine}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="p-4 text-sm font-medium text-[#a09485]">
                No recipes found for{" "}
                <span className="font-bold text-[#111827]">“{query}”</span>. Try
                “pasta” or “chicken”.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
