"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Check,
  Crop,
  ImagePlus,
  Loader2,
  RefreshCw,
  Scissors,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { qualityOf, QUALITY_DOT, QUALITY_LABEL } from "./constants";

const EASE = [0.22, 1, 0.36, 1];

/* ── Crop modal ────────────────────────────────────────── */

function CropModal({ src, onClose, onApply }) {
  const imgRef = useRef(null);
  const frameRef = useRef(null);
  const dragRef = useRef(null);
  const [frameSize, setFrameSize] = useState(null);
  const [box, setBox] = useState(null);

  const onImgLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    const maxW = 540;
    const maxH = 400;
    const ratio = img.naturalWidth / img.naturalHeight;
    let w = maxW;
    let h = w / ratio;
    if (h > maxH) {
      h = maxH;
      w = h * ratio;
    }
    setFrameSize({ w, h });
    const boxW = Math.round(w * 0.62);
    const boxH = Math.round(h * 0.62);
    setBox({ x: Math.round((w - boxW) / 2), y: Math.round((h - boxH) / 2), w: boxW, h: boxH });
  };

  const startDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { type, startX: e.clientX, startY: e.clientY, startBox: { ...box } };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const onMove = (e) => {
    const d = dragRef.current;
    const frame = frameRef.current;
    if (!d || !frame) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    const maxW = frame.clientWidth;
    const maxH = frame.clientHeight;
    setBox((b) => {
      if (!b) return b;
      if (d.type === "move") {
        return {
          ...b,
          x: Math.max(0, Math.min(maxW - b.w, d.startBox.x + dx)),
          y: Math.max(0, Math.min(maxH - b.h, d.startBox.y + dy)),
        };
      }
      const w = Math.max(72, Math.min(maxW - b.x, d.startBox.w + dx));
      const h = Math.max(72, Math.min(maxH - b.y, d.startBox.h + dy));
      return { ...b, w, h };
    });
  };

  const onUp = () => {
    dragRef.current = null;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  const apply = () => {
    const img = imgRef.current;
    const frame = frameRef.current;
    if (!img || !box || !frame) return;
    const scaleX = img.naturalWidth / frame.clientWidth;
    const scaleY = img.naturalHeight / frame.clientHeight;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(box.w * scaleX);
    canvas.height = Math.round(box.h * scaleY);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      img,
      box.x * scaleX,
      box.y * scaleY,
      box.w * scaleX,
      box.h * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );
    onApply(canvas.toDataURL("image/jpeg", 0.92));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0f172a]/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.3, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/60 bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center justify-between border-b border-[#F3F4F6] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0E3] text-[#f97316]">
              <Crop size={17} />
            </span>
            <div>
              <p className="text-[14.5px] font-bold text-[#111827]">Crop image</p>
              <p className="text-[11.5px] text-[#9ca3af]">Drag to move · corner to resize</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close crop"
            className="rounded-xl p-2 text-[#9ca3af] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827]"
          >
            <X size={17} />
          </button>
        </div>

        <div className="flex items-center justify-center bg-[#FFF9F3] p-5">
          {frameSize && box ? (
            <div
              ref={frameRef}
              className="relative overflow-hidden rounded-2xl"
              style={{ width: frameSize.w, height: frameSize.h }}
            >
              <Image
                ref={imgRef}
                src={src}
                alt="Crop preview"
                fill
                unoptimized
                sizes="540px"
                onLoad={onImgLoad}
                className="object-cover"
              />
              <div
                onPointerDown={(e) => startDrag(e, "move")}
                className="absolute z-10 cursor-move touch-none border-2 border-dashed border-white"
                style={{ left: box.x, top: box.y, width: box.w, height: box.h, boxShadow: "0 0 0 9999px rgba(15,23,42,0.55)" }}
              >
                <span
                  onPointerDown={(e) => startDrag(e, "resize")}
                  aria-hidden="true"
                  className="absolute -bottom-3 -right-3 flex h-7 w-7 cursor-se-resize touch-none items-center justify-center rounded-full border border-[#F3F4F6] bg-white text-[#f97316] shadow-md"
                >
                  <Scissors size={13} />
                </span>
              </div>
            </div>
          ) : (
            <div className="flex h-64 w-full items-center justify-center">
              <Image
                ref={imgRef}
                src={src}
                alt="Crop preview"
                fill
                unoptimized
                sizes="540px"
                onLoad={onImgLoad}
                className="object-contain"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-[#F3F4F6] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-2xl border border-[#F3F4F6] bg-white px-5 text-[13.5px] font-bold text-[#6b7280] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E5E7EB] hover:text-[#111827]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={apply}
            className="flex h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-6 text-[13.5px] font-bold text-white shadow-[0_10px_22px_rgba(249,115,22,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(249,115,22,0.45)] active:scale-[0.98]"
          >
            Apply crop
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Upload area ───────────────────────────────────────── */

export default function ImageUploader({ image, onChange, recipe }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [cropOpen, setCropOpen] = useState(false);

  const processFile = useCallback(
    (file) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        toast.error("Photo must be under 8MB");
        return;
      }
      setUploading(true);
      window.setTimeout(() => {
        const preview = URL.createObjectURL(file);
        if (image?.preview?.startsWith("blob:")) URL.revokeObjectURL(image.preview);
        onChange({ preview, source: "upload", quality: qualityOf(file.size) });
        setUploading(false);
      }, 900);
    },
    [image, onChange]
  );

  const generateAi = useCallback(async () => {
    if (generatingAi) return;
    setGeneratingAi(true);
    try {
      const res = await fetch("/api/recipes/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipe: {
            title: recipe?.title ?? "",
            description: recipe?.description ?? "",
            cuisine: recipe?.cuisine ?? "",
            ingredients: Array.isArray(recipe?.ingredients)
              ? recipe.ingredients.map((i) => ({ name: i?.name, quantity: i?.quantity }))
              : [],
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        router.push("/sign-in?redirectTo=/generate-recipe");
        return;
      }
      if (!res.ok) {
        toast.error(
          data.code === "SAVE_FAILED"
            ? "Image generated, but couldn't save it. Please try again."
            : data.error || "Couldn't generate a food image — please try again"
        );
        return;
      }
      if (data.imageUrl) {
        setGenerated({ preview: data.imageUrl, source: "ai", quality: "High" });
        toast.success("AI photo generated ✨");
      }
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setGeneratingAi(false);
    }
  }, [generatingAi, recipe, router]);

  const useGenerated = () => {
    if (!generated) return;
    if (image?.preview?.startsWith("blob:")) URL.revokeObjectURL(image.preview);
    onChange(generated);
    setGenerated(null);
  };

  const remove = () => {
    if (image?.preview?.startsWith("blob:")) URL.revokeObjectURL(image.preview);
    onChange(null);
  };

  const busy = uploading || generatingAi;
  const display = generated ?? image;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          processFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a recipe photo"
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !busy) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          processFile(e.dataTransfer?.files?.[0]);
        }}
        className={`group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-[#FFFCF8] px-6 py-10 text-center outline-none transition-all duration-300 focus-visible:ring-4 focus-visible:ring-[#f97316]/10 ${
          dragActive
            ? "scale-[1.01] border-[#f97316] bg-[#FFF4EA] shadow-[0_0_0_4px_rgba(249,115,22,0.08)]"
            : "border-[#E5E7EB] hover:border-[#fdba74] hover:bg-[#FFF9F2]"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {display?.preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="w-full"
            >
              <div className="relative mx-auto h-48 w-full max-w-[340px] overflow-hidden rounded-2xl shadow-[0_12px_28px_rgba(111,80,50,0.14)]">
                <Image
                  src={display.preview}
                  alt="Recipe photo preview"
                  fill
                  unoptimized
                  sizes="340px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#16a34a] shadow-sm">
                  <Check size={12} strokeWidth={3} />
                  Ready
                </span>

                {display.source === "ai" && (
                  <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#c2410c] shadow-sm">
                    <Sparkles size={12} />
                    AI Generated
                  </span>
                )}

                <span
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#111827] shadow-sm"
                  title={QUALITY_LABEL[display.quality]}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: QUALITY_DOT[display.quality] }}
                  />
                  {QUALITY_LABEL[display.quality]}
                </span>

                {generatingAi && (
                  <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#c2410c] shadow-sm">
                    <Loader2 size={12} className="animate-spin" />
                    Generating…
                  </span>
                )}

                {!generatingAi && !generated && (
                  <button
                    type="button"
                    aria-label="Remove photo"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove();
                    }}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#6b7280] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#fee2e2] hover:text-[#ef4444]"
                  >
                    <X size={15} strokeWidth={2.4} />
                  </button>
                )}
              </div>

              {generated ? (
                <p className="mt-3 text-center text-[12.5px] font-medium text-[#6b7280]">
                  New AI photo ready — use it or keep the current one.
                </p>
              ) : (
                <p className="mt-3 text-[12.5px] font-medium text-[#6b7280]">
                  Click or drag to replace ·{" "}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      remove();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        remove();
                      }
                    }}
                    className="cursor-pointer font-semibold text-[#ef4444]"
                  >
                    Remove
                  </span>
                </p>
              )}
            </motion.div>
          ) : busy ? (
            <motion.div
              key="busy"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex flex-col items-center gap-4"
            >
              <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0E3] text-[#f97316]">
                <Loader2 size={28} className="animate-spin" />
              </span>
              <p className="text-sm font-semibold text-[#6b7280]">
                {generatingAi ? "Generating your food image…" : "Uploading your photo…"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex flex-col items-center gap-4"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0E3] text-[#f97316] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105">
                <ImagePlus size={30} strokeWidth={1.8} />
              </span>
              <div>
                <p className="text-[15px] font-semibold text-[#111827]">
                  Drag &amp; drop your photo
                </p>
                <p className="mt-1 text-[13px] text-[#9ca3af]">
                  or <span className="font-semibold text-[#f97316]">browse files</span> · PNG, JPG
                  up to 8MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {generated ? (
          <>
            <button
              type="button"
              onClick={useGenerated}
              disabled={busy}
              className="flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-4 text-[12.5px] font-bold text-white shadow-[0_10px_22px_rgba(249,115,22,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(249,115,22,0.45)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={14} />
              Use This Image
            </button>
            <button
              type="button"
              onClick={generateAi}
              disabled={busy}
              className="flex h-10 items-center gap-2 rounded-2xl border border-[#F5E0CE] bg-[#FFF7EF] px-4 text-[12.5px] font-bold text-[#c2410c] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#f97316]/40 hover:bg-[#FFF0E2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generatingAi ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              Regenerate
            </button>
            <button
              type="button"
              onClick={() => {
                setGenerated(null);
                inputRef.current?.click();
              }}
              disabled={busy}
              className="flex h-10 items-center gap-2 rounded-2xl border border-[#F3F4F6] bg-white px-4 text-[12.5px] font-bold text-[#6b7280] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E5E7EB] hover:text-[#111827] disabled:opacity-50"
            >
              <ImagePlus size={14} />
              Upload Different Image
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={generateAi}
              disabled={busy}
              className="flex h-10 items-center gap-2 rounded-2xl border border-[#F5E0CE] bg-[#FFF7EF] px-4 text-[12.5px] font-bold text-[#c2410c] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#f97316]/40 hover:bg-[#FFF0E2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generatingAi ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Wand2 size={14} />
              )}
              AI Generate Food Image
            </button>
            {image?.preview && (
              <button
                type="button"
                onClick={() => setCropOpen(true)}
                disabled={busy}
                className="flex h-10 items-center gap-2 rounded-2xl border border-[#F3F4F6] bg-white px-4 text-[12.5px] font-bold text-[#6b7280] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E5E7EB] hover:text-[#111827] disabled:opacity-50"
              >
                <Crop size={14} />
                Crop Image
              </button>
            )}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="flex h-10 items-center gap-2 rounded-2xl border border-[#F3F4F6] bg-white px-4 text-[12.5px] font-bold text-[#6b7280] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E5E7EB] hover:text-[#111827] disabled:opacity-50"
            >
              <ImagePlus size={14} />
              {image?.preview ? "Replace" : "Upload"}
            </button>
          </>
        )}
      </div>

      <AnimatePresence>
        {cropOpen && (
          <CropModal
            src={image?.preview}
            onClose={() => setCropOpen(false)}
            onApply={(dataUrl) => {
              onChange({ preview: dataUrl, source: "upload", quality: qualityOf(dataUrl.length) });
              setCropOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
