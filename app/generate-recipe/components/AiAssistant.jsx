"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles, Wand2 } from "lucide-react";
import { AI_MODES, AI_EXAMPLES } from "./constants";

const EASE = [0.22, 1, 0.36, 1];

function TypingIndicator() {
  return (
    <div className="mt-5 space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
              className="h-2 w-2 rounded-full bg-[#f97316]"
            />
          ))}
        </div>
        <span className="text-[12.5px] font-semibold text-[#c2410c]">AI is crafting your recipe…</span>
      </div>
      {[92, 100, 82, 96].map((w, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.12 }}
          className="h-3 rounded-full bg-[#FDE8D3]"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

export default function AiAssistant({ mode, onModeChange, prompt, onPromptChange, onGenerate, generating }) {
  const [focused, setFocused] = useState(false);
  const floated = focused || prompt.length > 0;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#F3F4F6] bg-white p-5 shadow-[0_18px_44px_-18px_rgba(111,80,50,0.16)] sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#fdba74]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#f97316]/10 blur-3xl"
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3">
          <motion.span
            animate={{ rotate: [0, 8, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f97316] to-[#fb923c] text-white shadow-[0_8px_18px_rgba(249,115,22,0.4)]"
          >
            <Bot size={20} />
          </motion.span>
          <div>
            <p className="flex items-center gap-1 text-[15px] font-extrabold tracking-tight text-[#111827]">
              AI Recipe Assistant
              <Sparkles size={13} className="text-[#f97316]" fill="currentColor" />
            </p>
            <p className="text-[11.5px] font-medium text-[#9ca3af]">
              Fills your form in seconds — no typing needed
            </p>
          </div>
        </div>

        {/* Modes */}
        <div className="mt-5 flex flex-wrap gap-2">
          {AI_MODES.map((m) => {
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onModeChange(m.id)}
                className={`rounded-full border px-3 py-1.5 text-[11.5px] font-bold transition-all duration-200 ${
                  active
                    ? "border-transparent bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white shadow-[0_6px_14px_rgba(249,115,22,0.3)]"
                    : "border-[#F3F4F6] bg-[#FFFCF8] text-[#6b7280] hover:-translate-y-0.5 hover:border-[#fdba74] hover:text-[#c2410c]"
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Prompt */}
        <div className="relative mt-5">
          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (prompt.trim()) onGenerate();
              }
            }}
            placeholder=" "
            className="w-full resize-none rounded-2xl border border-[#E5E7EB] bg-[#FFFCF8] px-4 pb-3 pt-6 text-[13.5px] font-medium leading-relaxed text-[#111827] outline-none transition-all duration-300 hover:border-[#fdba74] focus:border-[#f97316] focus:ring-4 focus:ring-[#f97316]/10"
          />
          <label
            className={`pointer-events-none absolute left-4 transition-all duration-300 ${
              floated
                ? "top-2.5 text-[11px] font-semibold tracking-wide text-[#6b7280]"
                : "top-[18px] text-[14px] text-[#9ca3af]"
            } ${focused ? "!text-[#ea580c]" : ""}`}
          >
            {AI_MODES.find((m) => m.id === mode)?.placeholder || "What ingredients do you have?"}
          </label>
        </div>

        {/* Example chips */}
        <AnimatePresence initial={false}>
          {mode === "ingredients" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex flex-wrap gap-2">
                {AI_EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => onPromptChange(ex.split(" ")[1] ?? ex)}
                    className="rounded-full border border-[#F3F4F6] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#6b7280] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#fdba74] hover:text-[#c2410c]"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate button */}
        <motion.button
          type="button"
          onClick={onGenerate}
          disabled={generating || (!prompt.trim() && !["improve", "nutrition"].includes(mode))}
          whileHover={generating || (!prompt.trim() && !["improve", "nutrition"].includes(mode)) ? undefined : { y: -2 }}
          whileTap={generating || (!prompt.trim() && !["improve", "nutrition"].includes(mode)) ? undefined : { scale: 0.98 }}
          className="group relative mt-4 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] text-[14px] font-bold text-white shadow-[0_12px_26px_rgba(249,115,22,0.35)] transition-shadow duration-300 hover:shadow-[0_16px_34px_rgba(249,115,22,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {generating ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="inline-flex"
              >
                <Wand2 size={16} />
              </motion.span>
              <span>Generating recipe…</span>
            </>
          ) : (
            <>
              <Sparkles size={16} className="transition-transform duration-300 group-hover:scale-125" />
              <span>✨ Generate Complete Recipe</span>
            </>
          )}
        </motion.button>

        <AnimatePresence initial={false}>
          {generating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-3 text-center text-[11px] text-[#b0a89a]">
          Generated drafts are AI-assisted — review before publishing.
        </p>
      </div>
    </div>
  );
}
