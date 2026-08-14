"use client";

import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "foodi:theme";

/**
 * Reads the theme class directly from <html> (set by the inline script in
 * layout.js before paint) so the hook and the DOM never disagree.
 */
function currentTheme() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * Lightweight theme hook. Defaults to light, persists to localStorage, and
 * toggles a `dark` class on <html>. This is the app's single theme implementation.
 */
export function useTheme() {
  const [theme, setTheme] = useState(currentTheme);

  const applyTheme = (next) => {
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // storage may be unavailable (private mode) — class still applies
    }
    setTheme(next);
  };

  const toggle = () => applyTheme(theme === "dark" ? "light" : "dark");

  // Apply the stored preference (or default to light) on mount. Runs after a
  // microtask so applyTheme is never called synchronously within the effect
  // body (React lint rules / compiler).
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      await null;
      if (cancelled) return;

      const stored = (() => {
        try {
          return localStorage.getItem(THEME_STORAGE_KEY);
        } catch {
          return null;
        }
      })();

      applyTheme(stored === "dark" ? "dark" : "light");
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  return { theme, toggle, isDark: theme === "dark" };
}
