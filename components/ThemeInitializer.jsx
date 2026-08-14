"use client";

import { useLayoutEffect } from "react";

const THEME_STORAGE_KEY = "foodi:theme";

export default function ThemeInitializer() {
  useLayoutEffect(() => {
    try {
      let theme = localStorage.getItem(THEME_STORAGE_KEY) ?? "light";

      const root = document.documentElement;
      root.classList.toggle("dark", theme === "dark");
      root.style.colorScheme = theme === "dark" ? "dark" : "light";
    } catch {
      // Ignore storage and media query failures; the app will fall back to light mode.
    }
  }, []);

  return null;
}
