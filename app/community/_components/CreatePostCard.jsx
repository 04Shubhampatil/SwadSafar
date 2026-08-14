"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AtSign,
  ChefHat,
  Film,
  Hash,
  ImagePlus,
  ListPlus,
  Loader2,
  Plus,
  Send,
  Smile,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, EMOJIS, GIF_OPTIONS, POPULAR_TAGS, RECIPE_ATTACHMENTS, SAMPLE_USERNAMES } from "./communityData";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

const CATEGORY_ICONS = {
  Sunrise: "🍳",
  Sun: "☀️",
  MoonStar: "🌙",
  CakeSlice: "🍰",
  Popcorn: "🍿",
  Leaf: "🌿",
  Zap: "⚡",
};

const AI_SUGGESTION =
  "Tonight's 20-minute hero: charred chicken tikka skewers 🍢 Marinate 15 min, grill hot, serve with mint chutney & warm flatbread. Who wants the full recipe? #quickdinner #tikka";

const EMPTY_DRAFT = {
  content: "",
  category: "Dinner",
  images: [],
  poll: null,
  recipe: null,
};

function insertAtCursor(textarea, toInsert) {
  if (!textarea) return;
  const start = textarea.selectionStart ?? textarea.value.length;
  const end = textarea.selectionEnd ?? textarea.value.length;
  textarea.setRangeText(toInsert, start, end, "end");
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

export default function CreatePostCard({ draft, onDraftChange, onSubmit, composerRef, user }) {
  const [openPanel, setOpenPanel] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState(null);
  const [imgFailed, setImgFailed] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Read-only lookup of the user's profile photo (priority 3 below). We query
  // the profiles table directly — never creating a user record from here.
  const uid = user?.id;
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      await null; // keep setState out of the synchronous effect body
      if (cancelled) return;
      if (!uid) {
        setProfileAvatar(null);
        setImgFailed(false);
        return;
      }
      const supabase = createClient();
      if (!supabase) return;
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("user_id", uid)
        .maybeSingle();
      if (cancelled) return;
      setProfileAvatar(data?.avatar_url ?? null);
      setImgFailed(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const avatarUrl = uid
    ? user?.user_metadata?.avatar_url ||
      user?.user_metadata?.picture ||
      profileAvatar ||
      null
    : null;
  const avatarSrc = avatarUrl && !imgFailed ? avatarUrl : DEFAULT_AVATAR;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [draft.content]);

  const update = (patch) =>
    onDraftChange((current) => ({ ...current, ...patch }));

  const insertEmoji = (emoji) => {
    insertAtCursor(textareaRef.current, emoji);
    setOpenPanel(null);
  };

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () =>
        update({ images: [...draft.images, { src: reader.result, type: "image" }] });
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) =>
    update({ images: draft.images.filter((_, i) => i !== index) });

  const addPollOption = () => {
    const options = [...(draft.poll?.options || []), ""];
    update({ poll: { options } });
  };

  const setPollOption = (index, value) => {
    const options = [...(draft.poll?.options || [])];
    options[index] = value;
    update({ poll: { options } });
  };

  const removePollOption = (index) => {
    const options = (draft.poll?.options || []).filter((_, i) => i !== index);
    if (options.length < 2) return update({ poll: null });
    update({ poll: { options } });
  };

  const generateSuggestion = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setOpenPanel(null);
    const el = textareaRef.current;
    window.setTimeout(() => {
      let index = 0;
      const interval = window.setInterval(() => {
        index += 2;
        const next = AI_SUGGESTION.slice(0, index);
        update({ content: next });
        if (index >= AI_SUGGESTION.length) {
          window.clearInterval(interval);
          setIsGenerating(false);
          el?.focus();
        }
      }, 16);
    }, 900);
  };

  const togglePanel = (panel) => setOpenPanel((prev) => (prev === panel ? null : panel));

  const canPost = draft.content.trim().length > 0 || draft.images.length > 0 || draft.poll || draft.recipe;

  return (
    <form
      onSubmit={onSubmit}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className="fd-glass relative overflow-visible rounded-3xl p-5 transition-all duration-300 focus-within:border-orange-200 focus-within:shadow-[0_28px_56px_-16px_rgba(249,115,22,0.28)] sm:p-6"
    >
      {/* Drag & drop overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-3xl border-2 border-dashed border-orange-400 bg-orange-50/90 backdrop-blur-sm"
          >
            <p className="flex items-center gap-2 text-sm font-bold text-orange-700">
              <ImagePlus size={20} /> Drop images to attach
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Composer row */}
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="relative shrink-0">
          <img
            key={avatarUrl || "default"}
            src={avatarSrc}
            alt="Your avatar"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="h-11 w-11 rounded-full object-cover ring-2 ring-orange-100 sm:h-12 sm:w-12"
          />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-orange-500 to-amber-400 text-[9px] font-black text-white">
            +
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <textarea
            ref={(node) => {
              textareaRef.current = node;
              if (typeof composerRef === "object") composerRef.current = node;
              else if (typeof composerRef === "function") composerRef(node);
            }}
            value={draft.content}
            onChange={(e) => update({ content: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
            rows={2}
            placeholder="What's cooking today? Share a recipe, tip, or question…"
            className="w-full resize-none bg-transparent text-sm leading-relaxed text-[#1c1917] outline-none placeholder:text-[#a39a90] sm:text-[15px]"
          />

          {/* Attached recipe chip */}
          <AnimatePresence>
            {draft.recipe && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-orange-100 bg-white px-2.5 py-2 pr-1.5 shadow-sm"
              >
                <img
                  src={draft.recipe.image}
                  alt={draft.recipe.title}
                  className="h-9 w-9 rounded-xl object-cover"
                />
                <div className="leading-tight">
                  <p className="text-xs font-bold text-[#1c1917]">{draft.recipe.title}</p>
                  <p className="text-[10px] font-medium text-[#8c827a]">Recipe · {draft.recipe.time}</p>
                </div>
                <button
                  type="button"
                  onClick={() => update({ recipe: null })}
                  aria-label="Remove recipe attachment"
                  className="ml-1 rounded-full p-1 text-[#b3a798] transition-colors hover:bg-neutral-100 hover:text-[#1c1917]"
                >
                  <X size={13} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Image attachments */}
          <AnimatePresence>
            {draft.images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex flex-wrap gap-2 overflow-hidden"
              >
                {draft.images.map((image, index) => (
                  <div
                    key={`${image.src.slice(0, 24)}-${index}`}
                    className="group relative h-16 w-16 overflow-hidden rounded-xl shadow-sm sm:h-20 sm:w-20"
                  >
                    <img src={image.src} alt={`Attachment ${index + 1}`} className="h-full w-full object-cover" />
                    {image.type === "gif" && (
                      <span className="absolute left-1 top-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        GIF
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      aria-label={`Remove attachment ${index + 1}`}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Poll editor */}
          <AnimatePresence>
            {draft.poll && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mt-3 rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#1c1917]">Create a poll</p>
                  <button
                    type="button"
                    onClick={() => update({ poll: null })}
                    aria-label="Remove poll"
                    className="rounded-full p-1 text-[#b3a798] hover:bg-neutral-100 hover:text-[#1c1917]"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {(draft.poll.options || []).map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-700">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => setPollOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-xs text-[#1c1917] outline-none transition-colors focus:border-orange-300"
                      />
                      {(draft.poll.options.length > 2) && (
                        <button
                          type="button"
                          onClick={() => removePollOption(index)}
                          aria-label={`Remove option ${index + 1}`}
                          className="shrink-0 rounded-full p-1 text-[#b3a798] hover:text-red-500"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {(draft.poll.options.length < 4) && (
                  <button
                    type="button"
                    onClick={addPollOption}
                    className="mt-2 inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 text-[11px] font-bold text-orange-700 transition-colors hover:bg-orange-100"
                  >
                    <Plus size={12} /> Add option
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toolbar */}
          <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-neutral-100 pt-3">
            <ToolButton label="Add emoji" icon={<Smile size={16} />} active={openPanel === "emoji"} onClick={() => togglePanel("emoji")} />
            <ToolButton label="Add GIF" icon={<Film size={16} />} active={openPanel === "gif"} onClick={() => togglePanel("gif")} />
            <ToolButton label="Mention someone" icon={<AtSign size={16} />} active={openPanel === "mention"} onClick={() => togglePanel("mention")} />
            <ToolButton label="Add hashtag" icon={<Hash size={16} />} active={openPanel === "hashtag"} onClick={() => togglePanel("hashtag")} />
            <ToolButton label="Attach photo" icon={<ImagePlus size={16} />} onClick={() => fileInputRef.current?.click()} />
            <ToolButton label="Attach recipe" icon={<ChefHat size={16} />} active={openPanel === "recipe"} onClick={() => togglePanel("recipe")} />
            <ToolButton label="Create poll" icon={<ListPlus size={16} />} active={Boolean(draft.poll)} onClick={() => (draft.poll ? update({ poll: null }) : update({ poll: { options: ["", ""] } }))} />
            <ToolButton label="AI recipe suggestion" icon={<Sparkles size={16} />} onClick={generateSuggestion} />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      </div>

      {/* Panels */}
      <AnimatePresence>
        {openPanel && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="relative z-30 mt-3 rounded-2xl border border-neutral-100 bg-white p-3 shadow-xl"
          >
            {openPanel === "emoji" && (
              <div className="grid grid-cols-8 gap-1">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className="rounded-lg p-1.5 text-xl transition-all hover:scale-110 hover:bg-orange-50"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {openPanel === "gif" && (
              <div className="grid grid-cols-4 gap-2">
                {GIF_OPTIONS.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => {
                      update({ images: [...draft.images, { src, type: "gif" }] });
                      setOpenPanel(null);
                    }}
                    className="group relative overflow-hidden rounded-lg"
                  >
                    <img src={src} alt="GIF option" className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    <span className="absolute left-1 top-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-bold text-white">GIF</span>
                  </button>
                ))}
              </div>
            )}

            {openPanel === "mention" && (
              <div className="space-y-1">
                <p className="px-1 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#b3a798]">Suggestions</p>
                {SAMPLE_USERNAMES.map((username) => (
                  <button
                    key={username}
                    type="button"
                    onClick={() => {
                      insertAtCursor(textareaRef.current, `${username} `);
                      setOpenPanel(null);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#1c1917] transition-colors hover:bg-orange-50"
                  >
                    <AtSign size={14} className="text-orange-600" />
                    {username}
                  </button>
                ))}
              </div>
            )}

            {openPanel === "hashtag" && (
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      insertAtCursor(textareaRef.current, `${tag} `);
                      setOpenPanel(null);
                    }}
                    className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-[#6b6157] transition-all hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {openPanel === "recipe" && (
              <div className="space-y-1.5">
                <p className="px-1 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#b3a798]">Attach a recipe</p>
                {RECIPE_ATTACHMENTS.map((recipe) => (
                  <button
                    key={recipe.title}
                    type="button"
                    onClick={() => {
                      update({ recipe });
                      setOpenPanel(null);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-orange-50"
                  >
                    <img src={recipe.image} alt={recipe.title} className="h-10 w-10 rounded-xl object-cover" />
                    <span className="flex-1">
                      <span className="block text-sm font-bold text-[#1c1917]">{recipe.title}</span>
                      <span className="block text-[11px] font-medium text-[#8c827a]">{recipe.time}</span>
                    </span>
                    <ChefHat size={16} className="text-orange-600" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom row: categories + post */}
      <div className="mt-4 flex flex-col gap-4 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Post category">
          {CATEGORIES.map((category) => {
            const active = draft.category === category.label;
            return (
              <button
                key={category.label}
                type="button"
                onClick={() => update({ category: category.label })}
                aria-pressed={active}
                className={[
                  "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                  active
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_8px_18px_-6px_rgba(249,115,22,0.5)]"
                    : "border border-neutral-200 bg-white text-[#8c827a] hover:border-orange-200 hover:text-orange-700",
                ].join(" ")}
              >
                <span aria-hidden="true">{CATEGORY_ICONS[category.icon]}</span>
                {category.label}
              </button>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={!canPost}
          className={[
            "fd-ripple-host fd-sheen fd-gradient-btn inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-[0_12px_26px_-8px_rgba(249,115,22,0.55)] transition-all duration-200 active:scale-95",
            canPost ? "hover:-translate-y-0.5" : "cursor-not-allowed opacity-60 saturate-0 shadow-none",
          ].join(" ")}
        >
          {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          Post
        </button>
      </div>
    </form>
  );
}

function ToolButton({ label, icon, onClick, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#f97316]",
        active
          ? "bg-orange-100 text-orange-600 shadow-sm"
          : "text-[#8c827a] hover:bg-orange-50 hover:text-orange-600 active:scale-90",
      ].join(" ")}
    >
      {icon}
    </button>
  );
}
