"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, Reorder, useDragControls } from "framer-motion";
import {
  Check,
  ChevronDown,
  Clock,
  GripVertical,
  Minus,
  Plus,
  Search,
  Sparkles,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  CUISINES,
  DIETARY_OPTIONS,
  DIFFICULTY_OPTIONS,
  INGREDIENT_SUGGESTIONS,
} from "./constants";

const EASE = [0.22, 1, 0.36, 1];

/* ── Shared bits ───────────────────────────────────────── */

function FieldLabel({ children, optional }) {
  return (
    <div className="mb-2.5 flex items-center justify-between">
      <label className="block text-[13px] font-semibold text-[#111827]">
        {children}
        {optional && <span className="ml-1 text-[11px] font-medium text-[#9ca3af]">(optional)</span>}
      </label>
    </div>
  );
}

function FieldHint({ text, tone = "muted" }) {
  const color =
    tone === "error"
      ? "text-[#ef4444]"
      : tone === "warn"
        ? "text-[#b45309]"
        : tone === "ok"
          ? "text-[#16a34a]"
          : "text-[#9ca3af]";
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: EASE }}
      className={`mt-2 flex items-center gap-1.5 text-[12.5px] font-medium ${color}`}
    >
      {text}
    </motion.p>
  );
}

function autosize(el) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight, 300)}px`;
}

/* ── Recipe title ──────────────────────────────────────── */

export function TitleField({ title, onChange, suggestions, duplicate, onPickSuggestion }) {
  const [focused, setFocused] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const floated = focused || title.length > 0;
  const counterColor =
    title.length > 52 ? "text-[#f59e0b]" : title.length >= 60 ? "text-[#ef4444]" : "text-[#9ca3af]";
  const empty = title.trim().length === 0;

  const suggestionsToShow = showSuggest && !dismissed && suggestions.length > 0 && title.trim().length > 0;

  return (
    <div>
      <div className="relative">
        <input
          id="recipe-title"
          value={title}
          onChange={(e) => {
            onChange(e.target.value);
            setDismissed(false);
            setShowSuggest(true);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setTimeout(() => setShowSuggest(false), 160);
          }}
          aria-invalid={empty ? "true" : undefined}
          className={`h-14 w-full rounded-2xl border bg-[#FFFCF8] px-4 pb-2 pt-5 pr-14 text-[15px] font-medium text-[#111827] outline-none transition-all duration-300 ${
            empty
              ? "border-[#fca5a5] focus:border-[#ef4444] focus:ring-4 focus:ring-[#ef4444]/10"
              : "border-[#E5E7EB] hover:border-[#fdba74] focus:border-[#f97316] focus:ring-4 focus:ring-[#f97316]/10"
          }`}
        />
        <label
          htmlFor="recipe-title"
          className={`pointer-events-none absolute left-4 transition-all duration-300 ${
            floated
              ? "top-[9px] text-[11px] font-semibold tracking-wide text-[#6b7280]"
              : "top-1/2 -translate-y-1/2 text-[15px] text-[#9ca3af]"
          } ${focused ? "!text-[#ea580c]" : ""}`}
        >
          Recipe title
        </label>
        <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-semibold ${counterColor}`}>
          {title.length}/60
        </span>
      </div>

      {empty && <FieldHint text="❌ Title required" tone="error" />}
      {!empty && duplicate && <FieldHint text="⚠ This recipe already exists — consider a unique name" tone="warn" />}
      {!empty && !duplicate && <FieldHint text="✔ Looks good" tone="ok" />}

      <AnimatePresence>
        {suggestionsToShow && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="mt-2.5 flex flex-wrap items-center gap-2"
          >
            <span className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Suggestions</span>
            {suggestions.slice(0, 3).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onPickSuggestion(s)}
                className="rounded-full border border-[#F5E0CE] bg-[#FFF7EF] px-3 py-1.5 text-[12.5px] font-semibold text-[#c2410c] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#fdba74] hover:bg-[#FFF0E2]"
              >
                {s}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss suggestions"
              className="text-[#c0b7ac] transition-colors hover:text-[#6b7280]"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Ingredients (chips / tags) ────────────────────────── */

export function IngredientsEditor({ ingredients, onAdd, onUpdate, onRemove, onReorder }) {
  const [draft, setDraft] = useState("");
  const [showMatches, setShowMatches] = useState(false);
  const controls = useDragControls();

  const matches = INGREDIENT_SUGGESTIONS.filter(
    (s) =>
      s.toLowerCase().startsWith(draft.trim().toLowerCase()) &&
      !ingredients.some((i) => i.name.toLowerCase() === s.toLowerCase())
  ).slice(0, 6);

  const handleAdd = (raw) => {
    if (!raw.trim()) return;
    onAdd(raw);
    setDraft("");
    setShowMatches(false);
  };

  const warn = ingredients.length === 0;
  const low = !warn && ingredients.length < 2;

  return (
    <div>
      <FieldLabel>Ingredients</FieldLabel>

      <div className="relative">
        <div className="flex h-14 items-center rounded-2xl border border-[#E5E7EB] bg-[#FFFCF8] pl-4 pr-2 transition-all duration-300 focus-within:border-[#f97316] focus-within:ring-4 focus-within:ring-[#f97316]/10 hover:border-[#fdba74]">
          <span className="mr-2 text-[#c0b7ac]">
            <Plus size={17} strokeWidth={2.4} />
          </span>
          <input
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setShowMatches(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd(draft);
              }
            }}
            onFocus={() => setShowMatches(true)}
            onBlur={() => setTimeout(() => setShowMatches(false), 160)}
            placeholder="Add an ingredient, press Enter…"
            className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-[#111827] outline-none placeholder:text-[#b6b0a6]"
          />
          {draft.trim() && (
            <button
              type="button"
              onClick={() => handleAdd(draft)}
              className="shrink-0 rounded-xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-3.5 py-2 text-[12.5px] font-bold text-white shadow-[0_6px_14px_rgba(249,115,22,0.3)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              Add
            </button>
          )}
        </div>

        <AnimatePresence>
          {showMatches && matches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="absolute left-0 right-0 top-[60px] z-20 overflow-hidden rounded-2xl border border-[#F3F4F6] bg-white p-1.5 shadow-[0_20px_48px_rgba(111,80,50,0.16)]"
            >
              {matches.map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleAdd(s);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13.5px] font-medium text-[#111827] transition-colors hover:bg-[#FFF7EF]"
                >
                  {s}
                  <Plus size={14} className="text-[#f97316]" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-2 text-[12px] text-[#9ca3af]">
        Pro tip: add quantities like <span className="font-semibold text-[#6b7280]">“2 tbsp olive oil”</span> and they&apos;re
        picked up automatically.
      </p>

      <div className="mt-3">
        {ingredients.length > 0 ? (
          <Reorder.Group axis="y" values={ingredients} onReorder={onReorder} className="space-y-2">
            {ingredients.map((item) => (
              <Reorder.Item
                key={item.id}
                value={item}
                dragListener={false}
                dragControls={controls}
                whileDrag={{ scale: 1.02, zIndex: 30 }}
                className="relative flex items-center gap-2 rounded-2xl border border-[#F3F4F6] bg-[#FFFCF8] py-2 pl-1.5 pr-2 transition-colors duration-200 hover:border-[#fdba74]/70"
              >
                <button
                  type="button"
                  onPointerDown={(e) => controls.start(e)}
                  aria-label="Drag to reorder"
                  className="cursor-grab touch-none px-1 text-[#c0b7ac] transition-colors hover:text-[#f97316] active:cursor-grabbing"
                >
                  <GripVertical size={16} />
                </button>
                <input
                  value={item.quantity}
                  onChange={(e) => onUpdate(item.id, { quantity: e.target.value })}
                  placeholder="qty"
                  aria-label={`Quantity for ${item.name}`}
                  className="h-8 w-14 rounded-lg border border-transparent bg-white px-2 text-center text-[12.5px] font-semibold text-[#6b7280] outline-none transition-all duration-200 hover:border-[#F3F4F6] focus:border-[#fdba74] focus:ring-2 focus:ring-[#f97316]/10"
                />
                <input
                  value={item.name}
                  onChange={(e) => onUpdate(item.id, { name: e.target.value })}
                  aria-label="Ingredient name"
                  className="min-w-0 flex-1 bg-transparent text-[13.5px] font-medium text-[#111827] outline-none"
                />
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="rounded-lg p-1.5 text-[#c0b7ac] transition-colors hover:bg-[#fee2e2] hover:text-[#ef4444]"
                >
                  <X size={15} />
                </button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          <div className="flex items-center gap-2.5 rounded-2xl border border-dashed border-[#F5E0CE] bg-[#FFFBF6] px-4 py-3.5 text-[13px] font-medium text-[#b45309]">
            <TriangleAlert size={15} />
            Start adding ingredients — a couple is enough to begin.
          </div>
        )}
      </div>

      {warn && <FieldHint text="❌ Add at least one ingredient" tone="error" />}
      {low && <FieldHint text="⚠ Missing ingredients — add one or two more" tone="warn" />}
    </div>
  );
}

/* ── Instructions (step cards) ─────────────────────────── */

export function InstructionsEditor({
  steps,
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
  onImprove,
  improvingId,
}) {
  const controls = useDragControls();
  const [pendingFocus, setPendingFocus] = useState(null);

  const handleAdd = () => {
    const id = onAdd();
    setPendingFocus(id);
  };

  const anyEmpty = steps.some((s) => s.text.trim().length === 0);
  const none = steps.length === 0;

  return (
    <div>
      <FieldLabel>Instructions</FieldLabel>

      {steps.length > 0 ? (
        <Reorder.Group axis="y" values={steps} onReorder={onReorder} className="space-y-2.5">
          {steps.map((step, idx) => (
            <Reorder.Item
              key={step.id}
              value={step}
              dragListener={false}
              dragControls={controls}
              whileDrag={{ scale: 1.01, zIndex: 30 }}
              className="group/step relative flex gap-3 rounded-2xl border border-[#F3F4F6] bg-[#FFFCF8] p-3.5 transition-colors duration-200 hover:border-[#fdba74]/70"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F97316] to-[#FB923C] text-[12px] font-extrabold text-white shadow-[0_4px_10px_rgba(249,115,22,0.35)]">
                  {idx + 1}
                </span>
                <button
                  type="button"
                  onPointerDown={(e) => controls.start(e)}
                  aria-label="Drag to reorder step"
                  className="cursor-grab touch-none text-[#d0c8bc] opacity-60 transition-colors group-hover/step:opacity-100 hover:text-[#f97316] active:cursor-grabbing"
                >
                  <GripVertical size={14} />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <textarea
                  ref={(el) => {
                    if (el && pendingFocus === step.id) {
                      el.focus();
                      setPendingFocus(null);
                    }
                  }}
                  value={step.text}
                  onChange={(e) => onUpdate(step.id, e.target.value)}
                  onInput={(e) => autosize(e.target)}
                  placeholder="Describe this step…"
                  className="w-full resize-none overflow-hidden bg-transparent text-[13.5px] font-medium leading-[1.6] text-[#111827] outline-none placeholder:text-[#b6b0a6]"
                />
                <div className="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onImprove(step.id)}
                    disabled={improvingId === step.id}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11.5px] font-bold text-[#c2410c] transition-colors hover:bg-[#FFF0E2] disabled:cursor-wait disabled:opacity-60"
                  >
                    {improvingId === step.id ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="inline-block"
                        >
                          <Sparkles size={12} />
                        </motion.span>
                        Improving…
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} />
                        AI Improve
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(step.id)}
                    aria-label="Remove step"
                    className="rounded-lg p-1 text-[#c0b7ac] transition-colors hover:bg-[#fee2e2] hover:text-[#ef4444]"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#F5E0CE] bg-[#FFFBF6] px-4 py-4 text-[13px] font-medium text-[#b45309]">
          ⚠ No steps yet — break your recipe into short, numbered steps.
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#E5E7EB] bg-[#FFFCF8] text-[13.5px] font-bold text-[#6b7280] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#f97316]/50 hover:bg-[#FFF7EF] hover:text-[#c2410c]"
      >
        <Plus size={15} />
        Add step
      </button>

      {none && <FieldHint text="❌ Instructions required" tone="error" />}
      {!none && anyEmpty && <FieldHint text="⚠ Missing instructions — some steps are empty" tone="warn" />}
      {!none && !anyEmpty && <FieldHint text="✔ Looks good" tone="ok" />}
    </div>
  );
}

/* ── Cooking time ──────────────────────────────────────── */

function Slider({ label, value, onChange, min, max }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[12.5px] font-semibold text-[#6b7280]">{label}</span>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))}
            className="h-8 w-14 rounded-lg border border-[#F3F4F6] bg-white text-center text-[13px] font-bold text-[#111827] outline-none transition-all duration-200 focus:border-[#fdba74] focus:ring-2 focus:ring-[#f97316]/10 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-[12px] text-[#9ca3af]">min</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, #F97316 0%, #FB923C ${pct}%, #F3F4F6 ${pct}%)`,
        }}
        className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#F97316] [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(249,115,22,0.45)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-200 [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[#F97316]"
      />
    </div>
  );
}

export function TimeControls({ prepTime, cookTime, onPrep, onCook }) {
  const total = prepTime + cookTime;
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[13px] font-semibold text-[#111827]">Cooking time</p>
          <p className="text-[12px] text-[#9ca3af]">Sliders update automatically</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FFF0E2] to-[#FFE7D3] px-3.5 py-1.5 text-[12.5px] font-extrabold text-[#c2410c]">
          <Clock size={13} />
          {total} min total
        </span>
      </div>
      <div className="space-y-6">
        <Slider label="Prep time" value={prepTime} onChange={onPrep} min={5} max={120} />
        <Slider label="Cook time" value={cookTime} onChange={onCook} min={5} max={180} />
      </div>
    </div>
  );
}

/* ── Servings stepper ──────────────────────────────────── */

export function ServingsStepper({ servings, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#F3F4F6] bg-[#FFFCF8] p-4 transition-colors duration-200 hover:border-[#fdba74]/70">
      <div className="space-y-0.5">
        <p className="text-[13px] font-semibold text-[#111827]">Servings</p>
        <p className="text-[12px] text-[#9ca3af]">How many people?</p>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, servings - 1))}
          disabled={servings <= 1}
          aria-label="Decrease servings"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#F3F4F6] bg-white text-[#6b7280] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#fdba74] hover:text-[#f97316] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus size={15} />
        </button>
        <motion.span
          key={servings}
          initial={{ scale: 0.7, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-10 text-center text-[17px] font-extrabold text-[#111827]"
        >
          {servings}
        </motion.span>
        <button
          type="button"
          onClick={() => onChange(Math.min(24, servings + 1))}
          disabled={servings >= 24}
          aria-label="Increase servings"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#F3F4F6] bg-white text-[#6b7280] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#fdba74] hover:text-[#f97316] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}

/* ── Difficulty segmented control ──────────────────────── */

export function DifficultyToggle({ difficulty, onChange }) {
  return (
    <div>
      <FieldLabel>Difficulty</FieldLabel>
      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-[#F3F4F6] bg-[#FFFCF8] p-1.5">
        {DIFFICULTY_OPTIONS.map((option) => {
          const active = difficulty === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`relative rounded-xl py-2.5 text-[13px] font-bold transition-all duration-200 ${
                active ? "text-white" : "text-[#6b7280] hover:text-[#c2410c]"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="difficulty-pill"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#F97316] to-[#FB923C] shadow-[0_6px_14px_rgba(249,115,22,0.35)]"
                  transition={{ duration: 0.3, ease: EASE }}
                />
              )}
              <span className="relative z-10">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Searchable cuisine select ─────────────────────────── */

export function SearchableSelect({ value, onChange, options, placeholder = "Select…" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const boxRef = useRef(null);

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="relative" ref={boxRef}>
      <FieldLabel>Cuisine</FieldLabel>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        className={`flex h-12 w-full items-center justify-between gap-2 rounded-2xl border bg-[#FFFCF8] px-4 text-left text-[13.5px] font-medium transition-all duration-200 ${
          value
            ? "text-[#111827] hover:border-[#fdba74]"
            : "text-[#9ca3af] hover:border-[#fdba74]"
        } ${open ? "border-[#f97316] ring-4 ring-[#f97316]/10" : "border-[#E5E7EB]"}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={16} className={value ? "text-[#f97316]" : "text-[#9ca3af]"} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-[#F3F4F6] bg-white p-1.5 shadow-[0_20px_48px_rgba(111,80,50,0.16)]"
          >
            <div className="flex items-center gap-2 rounded-xl bg-[#FBF7F2] px-3 py-2">
              <Search size={14} className="text-[#9ca3af]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cuisines…"
                className="w-full bg-transparent text-[13px] font-medium text-[#111827] outline-none placeholder:text-[#b6b0a6]"
              />
            </div>
            <div className="mt-1 max-h-48 overflow-auto">
              {filtered.map((option) => (
                <button
                  key={option}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(option);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] font-medium transition-colors hover:bg-[#FFF7EF] ${
                    value === option ? "text-[#c2410c]" : "text-[#111827]"
                  }`}
                >
                  {option}
                  {value === option && <Check size={14} className="text-[#f97316]" />}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-3 py-2 text-[12.5px] text-[#9ca3af]">No matching cuisines.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Dietary preference chips ──────────────────────────── */

export function DietaryChips({ selected, onToggle }) {
  return (
    <div>
      <FieldLabel>Dietary preference</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {DIETARY_OPTIONS.map((option) => {
          const active = selected.includes(option);
          return (
            <motion.button
              key={option}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggle(option)}
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12.5px] font-bold transition-all duration-200 ${
                active
                  ? "border-transparent bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white shadow-[0_6px_14px_rgba(249,115,22,0.3)]"
                  : "border-[#F3F4F6] bg-[#FFFCF8] text-[#6b7280] hover:-translate-y-0.5 hover:border-[#fdba74] hover:text-[#c2410c]"
              }`}
            >
              {active && <Check size={13} strokeWidth={3} />}
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

