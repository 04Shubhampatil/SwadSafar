"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";

export default function PostCarousel({ images, title }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const hasMany = images.length > 1;

  const go = (direction) => {
    setActive((prev) => (prev + direction + images.length) % images.length);
  };

  return (
    <>
      <div className="group relative overflow-hidden rounded-3xl bg-neutral-100">
        <div className="relative aspect-[4/3] overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.img
              key={active}
              src={images[active]}
              alt={`${title} — image ${active + 1} of ${images.length}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
          </AnimatePresence>

          {/* Gradient overlays */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/15 to-transparent" />

          {/* Index badge */}
          {hasMany && (
            <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
              {active + 1} / {images.length}
            </span>
          )}

          {/* Fullscreen */}
          <button
            type="button"
            onClick={() => setLightbox(true)}
            aria-label="Open image in fullscreen"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-black/60 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <Maximize2 size={15} />
          </button>

          {/* Arrows */}
          {hasMany && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#1c1917] opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#1c1917] opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100"
              >
                <ChevronRight size={17} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {hasMany && (
          <div className="flex gap-2 bg-[#faf7f2] px-3 pb-3 pt-2.5">
            {images.map((src, index) => (
              <button
                key={src + index}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Go to image ${index + 1}`}
                aria-current={active === index}
                className={[
                  "h-12 w-14 shrink-0 overflow-hidden rounded-xl ring-2 ring-offset-1 transition-all duration-200",
                  active === index
                    ? "ring-orange-500 opacity-100"
                    : "ring-transparent opacity-55 hover:opacity-90",
                ].join(" ")}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        open={lightbox}
        onClose={() => setLightbox(false)}
        images={images}
        startIndex={active}
        title={title}
        onNavigate={setActive}
      />
    </>
  );
}

export function Lightbox({ open, onClose, images, startIndex = 0, title }) {
  const [index, setIndex] = useState(startIndex);
  const [prevStart, setPrevStart] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);

  if (prevStart !== startIndex) {
    setPrevStart(startIndex);
    setIndex(startIndex);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, images.length, onClose]);

  const go = (direction) => setIndex((i) => (i + direction + images.length) % images.length);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image viewer`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoomed((z) => !z)}
              aria-label={zoomed ? "Zoom out" : "Zoom in"}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              {zoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close viewer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </div>

          <motion.img
            key={index}
            src={images[index]}
            alt={`${title} — image ${index + 1}`}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: zoomed ? 1.6 : 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`max-h-[85vh] max-w-[92vw] cursor-zoom-in rounded-2xl object-contain shadow-2xl ${zoomed ? "cursor-zoom-out" : ""}`}
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Next image"
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <ChevronRight size={20} />
              </button>
              <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                {index + 1} / {images.length}
              </p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
