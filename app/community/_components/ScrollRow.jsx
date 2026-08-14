"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ScrollRow({ label, icon, children }) {
  const trackRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  const scrollBy = (direction) => {
    trackRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  };

  return (
    <section aria-label={label}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight text-[#1c1917] sm:text-xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_10px_22px_-8px_rgba(249,115,22,0.6)]">
            {icon}
          </span>
          {label}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={`Scroll ${label} left`}
            disabled={!canLeft}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#8c827a] shadow-sm transition-all hover:border-orange-300 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={`Scroll ${label} right`}
            disabled={!canRight}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#8c827a] shadow-sm transition-all hover:border-orange-300 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
      <div
        ref={trackRef}
        onScroll={updateArrows}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2"
      >
        {children}
      </div>
    </section>
  );
}
