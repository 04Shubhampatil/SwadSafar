"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Edit3,
  Flame,
  Loader2,
  Plus,
  Save,
  Send,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

const DIETARY_OPTIONS = ["Vegetarian", "Vegan", "Gluten Free", "Dairy Free", "Keto", "Low Carb"];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#1c1917] outline-none transition-colors focus:border-orange-300 focus:ring-2 focus:ring-orange-100";

const labelClass = "mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-[#8c827a]";

function MetaChip({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-[10.5px] font-bold text-[#c2410c]">
      <Icon size={11} /> {children}
    </span>
  );
}

/**
 * Compact review/edit card shown under the Community AI Assistant after a
 * recipe is generated. Nothing is published automatically — the user must
 * explicitly click "Share to Community".
 */
export default function CommunityRecipePreview({ recipe: initialRecipe, onReset }) {
  const router = useRouter();
  const [recipe, setRecipe] = useState(initialRecipe);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialRecipe);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [published, setPublished] = useState(false);

  const totalTime = (recipe?.prepTime || 0) + (recipe?.cookTime || 0);
  const ingredients = recipe?.ingredients || [];
  const instructions = recipe?.instructions || [];

  const patchDraft = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const updateIngredient = (index, patch) => {
    setDraft((d) => {
      const items = [...(d.ingredients || [])];
      items[index] = { ...items[index], ...patch };
      return { ...d, ingredients: items };
    });
  };

  const addIngredient = () => {
    setDraft((d) => ({
      ...d,
      ingredients: [...(d.ingredients || []), { id: `ing-${Date.now()}`, name: "", quantity: "" }],
    }));
  };

  const removeIngredient = (index) => {
    setDraft((d) => ({
      ...d,
      ingredients: (d.ingredients || []).filter((_, i) => i !== index),
    }));
  };

  const updateInstruction = (index, text) => {
    setDraft((d) => {
      const items = [...(d.instructions || [])];
      items[index] = { ...items[index], text };
      return { ...d, instructions: items };
    });
  };

  const addInstruction = () => {
    setDraft((d) => ({
      ...d,
      instructions: [...(d.instructions || []), { id: `step-${Date.now()}`, text: "" }],
    }));
  };

  const removeInstruction = (index) => {
    setDraft((d) => ({
      ...d,
      instructions: (d.instructions || []).filter((_, i) => i !== index),
    }));
  };

  const toggleDietary = (option) => {
    const list = draft.dietary || [];
    patchDraft({
      dietary: list.includes(option) ? list.filter((d) => d !== option) : [...list, option],
    });
  };

  const saveChanges = () => {
    const title = (draft.title || "").trim();
    if (!title) {
      toast.error("A recipe title is required");
      return;
    }
    setRecipe(draft);
    setEditing(false);
    setSaved(false);
    toast.success("Changes saved to preview");
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe: draft, recipeId: savedId || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        router.push("/sign-in?redirectTo=/community");
        return;
      }
      if (!res.ok) {
        toast.error(data.error || "Couldn't save your draft");
        return;
      }
      setSavedId(data.recipe?.id ?? savedId);
      setSaved(true);
      setRecipe(draft);
      setEditing(false);
      toast.success("Draft saved — you can keep editing");
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (publishing) return;
    if (!(draft.title || "").trim()) {
      toast.error("A recipe title is required before sharing");
      return;
    }
    setPublishing(true);
    try {
      const res = await fetch("/api/recipes/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe: draft, recipeId: savedId || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        router.push("/sign-in?redirectTo=/community");
        return;
      }
      if (!res.ok) {
        toast.error(data.error || "Couldn't publish your recipe");
        return;
      }
      setPublished(true);
      toast.success("Shared to the community!");
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setPublishing(false);
    }
  };

  if (published) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-5 text-center ring-1 ring-emerald-100"
      >
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_8px_18px_rgba(16,185,129,0.35)]">
          <CheckCircle2 size={20} />
        </span>
        <p className="mt-2.5 text-sm font-extrabold text-emerald-900">Shared to Community</p>
        <p className="mt-1 text-xs font-medium text-emerald-700">
          “{recipe.title}” is now live in the feed.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-3 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-[11px] font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
        >
          Generate another recipe
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-[#fffaf4] to-[#fff5ec] shadow-[0_14px_34px_-16px_rgba(249,115,22,0.28)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-orange-100/70 bg-white/60 px-4 py-3">
        <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#ea580c]">
          <Sparkles size={11} fill="currentColor" /> AI Generated Recipe
        </span>
        {!editing && (
          <button
            type="button"
            onClick={onReset}
            aria-label="Dismiss generated recipe"
            className="rounded-full p-1.5 text-[#b3a798] transition-colors hover:bg-orange-50 hover:text-[#ea580c]"
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div className="px-4 py-4">
        {editing ? (
          /* ── Edit mode ── */
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title</label>
              <input
                type="text"
                value={draft.title || ""}
                onChange={(e) => patchDraft({ title: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                rows={2}
                value={draft.description || ""}
                onChange={(e) => patchDraft({ description: e.target.value })}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Cuisine</label>
                <input
                  type="text"
                  value={draft.cuisine || ""}
                  onChange={(e) => patchDraft({ cuisine: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Difficulty</label>
                <select
                  value={draft.difficulty || "Medium"}
                  onChange={(e) => patchDraft({ difficulty: e.target.value })}
                  className={inputClass}
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Prep (min)</label>
                <input
                  type="number"
                  min={0}
                  value={draft.prepTime ?? 0}
                  onChange={(e) => patchDraft({ prepTime: Math.max(0, Number(e.target.value)) })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Cook (min)</label>
                <input
                  type="number"
                  min={0}
                  value={draft.cookTime ?? 0}
                  onChange={(e) => patchDraft({ cookTime: Math.max(0, Number(e.target.value)) })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Servings</label>
                <input
                  type="number"
                  min={1}
                  value={draft.servings ?? 4}
                  onChange={(e) => patchDraft({ servings: Math.max(1, Number(e.target.value)) })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Calories</label>
                <input
                  type="number"
                  min={0}
                  value={draft.calories ?? 0}
                  onChange={(e) => patchDraft({ calories: Math.max(0, Number(e.target.value)) })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Dietary</label>
              <div className="flex flex-wrap gap-1.5">
                {DIETARY_OPTIONS.map((option) => {
                  const active = (draft.dietary || []).includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleDietary(option)}
                      className={`rounded-full border px-2.5 py-1 text-[10.5px] font-bold transition-colors ${
                        active
                          ? "border-transparent bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                          : "border-orange-100 bg-white text-[#8c827a] hover:text-[#ea580c]"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <label className={labelClass}>Ingredients</label>
              <div className="space-y-2">
                {(draft.ingredients || []).map((ingredient, index) => (
                  <div key={ingredient.id ?? index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ingredient.quantity || ""}
                      onChange={(e) => updateIngredient(index, { quantity: e.target.value })}
                      placeholder="Qty"
                      className={`${inputClass} w-24 shrink-0`}
                    />
                    <input
                      type="text"
                      value={ingredient.name || ""}
                      onChange={(e) => updateIngredient(index, { name: e.target.value })}
                      placeholder="Ingredient"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      aria-label={`Remove ingredient ${index + 1}`}
                      className="shrink-0 rounded-full p-1.5 text-rose-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addIngredient}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#ea580c] hover:text-[#9a3412]"
              >
                <Plus size={12} /> Add ingredient
              </button>
            </div>

            {/* Instructions */}
            <div>
              <label className={labelClass}>Instructions</label>
              <div className="space-y-2">
                {(draft.instructions || []).map((step, index) => (
                  <div key={step.id ?? index} className="flex items-start gap-2">
                    <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] font-black text-orange-700">
                      {index + 1}
                    </span>
                    <textarea
                      rows={2}
                      value={step.text || ""}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      className={`${inputClass} resize-none`}
                    />
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      aria-label={`Remove step ${index + 1}`}
                      className="mt-1 shrink-0 rounded-full p-1.5 text-rose-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addInstruction}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#ea580c] hover:text-[#9a3412]"
              >
                <Plus size={12} /> Add step
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 rounded-full border border-neutral-200 bg-white px-3 py-2 text-[11px] font-bold text-[#6b6157] transition-colors hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveChanges}
                className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2 text-[11px] font-bold text-white shadow-[0_8px_18px_-6px_rgba(249,115,22,0.5)] transition-all hover:-translate-y-0.5"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          /* ── View mode ── */
          <div className="space-y-4">
            <div>
              <h3 className="text-[15px] font-extrabold leading-snug tracking-tight text-[#1c1917]">
                {recipe.title}
              </h3>
              {recipe.description && (
                <p className="mt-1 text-xs leading-relaxed text-[#6b6157]">{recipe.description}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              <MetaChip icon={Flame}>{recipe.difficulty || "Medium"}</MetaChip>
              <MetaChip icon={Clock}>{totalTime} min</MetaChip>
              <MetaChip icon={Users}>{recipe.servings || 4} servings</MetaChip>
              {recipe.cuisine && <MetaChip icon={Sparkles}>{recipe.cuisine}</MetaChip>}
            </div>

            {(recipe.dietary || []).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {(recipe.dietary || []).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {ingredients.length > 0 && (
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8c827a]">
                  Ingredients
                </p>
                <ul className="mt-1.5 space-y-1">
                  {ingredients.map((ingredient, index) => (
                    <li
                      key={ingredient.id ?? index}
                      className="flex items-baseline gap-1.5 text-xs text-[#44403c]"
                    >
                      <span className="h-1 w-1 shrink-0 translate-y-[-1px] rounded-full bg-[#f97316]" />
                      {ingredient.quantity && (
                        <span className="font-bold text-[#c2410c]">{ingredient.quantity}</span>
                      )}
                      <span>{ingredient.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {instructions.length > 0 && (
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8c827a]">
                  Instructions
                </p>
                <ol className="mt-1.5 space-y-1.5">
                  {instructions.map((step, index) => (
                    <li key={step.id ?? index} className="flex gap-2 text-xs leading-relaxed text-[#44403c]">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[9px] font-black text-orange-700">
                        {index + 1}
                      </span>
                      {step.text}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-orange-100 bg-white px-3 py-2 text-[11px] font-bold text-[#c2410c] transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-sm"
              >
                <Edit3 size={12} /> Edit Recipe
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || saved}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-orange-200 bg-white px-3 py-2 text-[11px] font-bold text-[#ea580c] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : saved ? <CheckCircle2 size={12} /> : <Save size={12} />}
                  {saving ? "Saving…" : saved ? "Draft Saved" : "Save Recipe"}
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={publishing}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2 text-[11px] font-bold text-white shadow-[0_8px_18px_-6px_rgba(249,115,22,0.5)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {publishing ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                  {publishing ? "Sharing…" : "Share to Community"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
