"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Eye,
  Globe,
  ImagePlus,
  ListChecks,
  Loader2,
  Salad,
  Save,
  Sparkles,
  Timer,
} from "lucide-react";
import {
  TitleField,
  IngredientsEditor,
  InstructionsEditor,
  TimeControls,
  ServingsStepper,
  DifficultyToggle,
  SearchableSelect,
  DietaryChips,
} from "./components/SmartFields";
import ImageUploader from "./components/ImageUploader";
import AiAssistant from "./components/AiAssistant";
import { PreviewCard, ReadinessCard, ProTips } from "./components/LivePreview";
import {
  CUISINES,
  FOOD_FLOATERS,
  KNOWN_RECIPES,
  parseQuantity,
  uid,
} from "./components/constants";

const PreviewModal = dynamic(() =>
  import("./components/Modals").then((m) => m.PreviewModal)
);
const SuccessModal = dynamic(() =>
  import("./components/Modals").then((m) => m.SuccessModal)
);

const EASE = [0.22, 1, 0.36, 1];

/* ── Section card ──────────────────────────────────────── */

function SectionCard({ icon: Icon, title, subtitle, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: EASE }}
      className="rounded-3xl border border-[#F3F4F6] bg-white p-6 shadow-[0_18px_44px_-22px_rgba(111,80,50,0.18)] sm:p-7"
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E3] text-[#f97316]">
          <Icon size={17} />
        </span>
        <div>
          <h2 className="text-[14.5px] font-extrabold tracking-tight text-[#111827]">{title}</h2>
          {subtitle && <p className="text-[11.5px] text-[#9ca3af]">{subtitle}</p>}
        </div>
      </div>
      {children}
    </motion.section>
  );
}

/* ── Main builder ──────────────────────────────────────── */

export default function RecipeForm() {
  const router = useRouter();
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: [],
    instructions: [],
    prepTime: 10,
    cookTime: 25,
    difficulty: "Easy",
    servings: 4,
    cuisine: "",
    dietary: [],
    image: null,
    calories: 340,
  });
  const [nutrition, setNutrition] = useState(null);
  const [aiMode, setAiMode] = useState("ingredients");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [improvingId, setImprovingId] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const update = (patch) => setRecipe((r) => ({ ...r, ...patch }));

  /* ── Derived data ─────────────────────────────────────── */

  const totalTime = recipe.prepTime + recipe.cookTime;
  const baseTitle = recipe.title.trim();
  const suggestions =
    baseTitle.length >= 3
      ? [
          `${baseTitle} — One-Pan Wonder`,
          `The Ultimate ${baseTitle}`,
          `Creamy ${baseTitle}`,
        ]
      : [];
  const duplicate =
    baseTitle.length > 2 &&
    KNOWN_RECIPES.some(
      (k) => k.toLowerCase().includes(baseTitle.toLowerCase()) || baseTitle.toLowerCase().includes(k.toLowerCase())
    );

  const checks = [
    {
      id: "title",
      label: "Recipe title",
      state: baseTitle ? "ok" : "error",
      text: baseTitle ? "Looks good" : "Title required",
    },
    {
      id: "ingredients",
      label: "Ingredients",
      state: recipe.ingredients.length === 0 ? "error" : recipe.ingredients.length < 2 ? "warn" : "ok",
      text:
        recipe.ingredients.length === 0
          ? "Add ingredients"
          : recipe.ingredients.length < 2
            ? "Missing ingredients"
            : "Looks good",
    },
    {
      id: "instructions",
      label: "Instructions",
      state:
        recipe.instructions.length === 0 || recipe.instructions.some((s) => !s.text.trim())
          ? "warn"
          : "ok",
      text:
        recipe.instructions.length === 0 || recipe.instructions.some((s) => !s.text.trim())
          ? "Missing instructions"
          : "Looks good",
    },
    { id: "time", label: "Cooking time", state: "ok", text: `${totalTime} min total` },
    {
      id: "photo",
      label: "Recipe photo",
      state: recipe.image ? "ok" : "warn",
      text: recipe.image ? "Looks good" : "Optional",
    },
  ];

  /* ── Ingredients ──────────────────────────────────────── */

  const addIngredient = (raw) => {
    const { quantity, name } = parseQuantity(raw);
    if (!name) return;
    setRecipe((r) => ({
      ...r,
      ingredients: [...r.ingredients, { id: uid(), name: name.charAt(0).toUpperCase() + name.slice(1), quantity }],
    }));
  };

  const updateIngredient = (id, patch) =>
    setRecipe((r) => ({
      ...r,
      ingredients: r.ingredients.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    }));

  const removeIngredient = (id) =>
    setRecipe((r) => ({
      ...r,
      ingredients: r.ingredients.filter((i) => i.id !== id),
    }));

  /* ── Instructions ─────────────────────────────────────── */

  const addStep = () => {
    const id = uid();
    setRecipe((r) => ({ ...r, instructions: [...r.instructions, { id, text: "" }] }));
    return id;
  };

  const updateStep = (id, text) =>
    setRecipe((r) => ({
      ...r,
      instructions: r.instructions.map((s) => (s.id === id ? { ...s, text } : s)),
    }));

  const removeStep = (id) =>
    setRecipe((r) => ({ ...r, instructions: r.instructions.filter((s) => s.id !== id) }));

  const improveStep = async (id) => {
    const step = recipe.instructions.find((s) => s.id === id);
    if (!step || improvingId) return;
    setImprovingId(id);
    try {
      const res = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "improve-step",
          recipe,
          stepIndex: recipe.instructions.findIndex((s) => s.id === id),
          stepText: step.text,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Couldn't improve that step — please try again");
        return;
      }
      const improved = data.result?.step || step.text;
      if (improved && improved.trim() !== step.text.trim()) updateStep(id, improved);
      else toast.info("That step already looks great");
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setImprovingId(null);
    }
  };

  /* ── AI assistant ─────────────────────────────────────── */

  const handleAiGenerate = async () => {
    const needsPrompt = !["improve", "nutrition"].includes(aiMode);
    if (aiGenerating || (needsPrompt && !aiPrompt.trim())) return;
    setAiGenerating(true);
    try {
      const res = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: aiMode, prompt: aiPrompt, recipe }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Couldn't generate a recipe — please try again");
        return;
      }
      const result = data.result || {};

      if (result.fill) {
        setRecipe((r) => ({ ...r, ...result.fill }));
      }
      if (result.appendIngredients) {
        setRecipe((r) => ({
          ...r,
          ingredients: [...r.ingredients, ...result.appendIngredients],
        }));
      }
      if (result.nutrition) setNutrition(result.nutrition);
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setAiGenerating(false);
      if (needsPrompt) setAiPrompt("");
    }
  };

  /* ── Bottom actions ───────────────────────────────────── */

  const saveDraft = async () => {
    if (savingDraft) return;
    setSavingDraft(true);
    try {
      localStorage.setItem("foodi:recipe-draft", JSON.stringify(recipe));
      
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipe: {
            title: baseTitle || "Untitled Draft",
            description: "",
            image: typeof recipe.image === 'string' ? recipe.image : (recipe.image?.preview || null),
            cuisine: recipe.cuisine || "",
            prepTime: recipe.prepTime || 10,
            cookTime: recipe.cookTime || 20,
            difficulty: recipe.difficulty || "Medium",
            servings: recipe.servings || 4,
            dietary: recipe.dietary || [],
            calories: recipe.calories ?? 0,
            ingredients: recipe.ingredients.map((i) => ({
              name: i.name,
              quantity: i.quantity || "",
            })),
            instructions: recipe.instructions.map((s) => ({ text: s.text })),
          },
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          toast.success("Draft saved to your browser (sign in to sync)");
        } else {
          toast.error("Couldn't sync draft to cloud");
        }
        return;
      }
      toast.success("Draft saved successfully");
    } catch {
      toast.error("Couldn't save draft");
    } finally {
      setSavingDraft(false);
    }
  };

  const publish = async () => {
    if (publishing) return;
    if (!baseTitle) {
      toast.error("A recipe title is required");
      return;
    }
    setPublishing(true);
    try {
      // User-uploaded photos are blob/data URLs that only exist in the browser,
      // so they must be pushed to storage before the recipe can reference them.
      let imageUrl = null;
      const img = recipe.image;
      if (img?.preview) {
        if (/^https?:\/\//.test(img.preview)) {
          imageUrl = img.preview;
        } else {
          const blob = await (await fetch(img.preview)).blob();
          const ext = (blob.type?.split("/")[1] || "jpg").replace(/^jpeg$/, "jpg");
          const file = new File([blob], `recipe-${Date.now()}.${ext}`, {
            type: blob.type || "image/jpeg",
          });
          const form = new FormData();
          form.append("file", file);
          const uploadRes = await fetch("/api/recipes/upload-image", {
            method: "POST",
            body: form,
          });
          if (uploadRes.status === 401) {
            router.push("/sign-in?redirectTo=/generate-recipe");
            return;
          }
          const uploadData = await uploadRes.json().catch(() => ({}));
          if (!uploadRes.ok) {
            toast.error(uploadData.error || "Couldn't upload your photo — please try again");
            return;
          }
          imageUrl = uploadData.url;
        }
      }

      const res = await fetch("/api/recipes/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipe: {
            title: baseTitle,
            description: "",
            image: imageUrl,
            cuisine: recipe.cuisine || "",
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            difficulty: recipe.difficulty,
            servings: recipe.servings,
            dietary: recipe.dietary || [],
            calories: recipe.calories ?? 0,
            ingredients: recipe.ingredients.map((i) => ({
              name: i.name,
              quantity: i.quantity || "",
            })),
            instructions: recipe.instructions.map((s) => ({ text: s.text })),
          },
        }),
      });
      if (res.status === 401) {
        router.push("/sign-in?redirectTo=/generate-recipe");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Could not publish recipe — please try again");
        return;
      }
      setShowSuccess(true);
      toast.success("Recipe published!");
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setPublishing(false);
    }
  };

  /* ── Render ───────────────────────────────────────────── */

  return (
    <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* ═══════════════ HERO ═══════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-[#FFF3E6] via-[#FFF9F3] to-[#FFEFDE] px-6 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_24px_60px_-30px_rgba(249,115,22,0.35)] sm:py-16"
      >
        {/* Soft orange glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#fdba74]/35 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#f97316]/20 blur-3xl"
        />

        {/* Floating food icons */}
        {FOOD_FLOATERS.map((f, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            animate={{ y: [0, -12, 0], rotate: [0, 10, -8, 0] }}
            transition={{ duration: 5 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: f.delay }}
            className={`pointer-events-none absolute z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/55 text-[#f97316]/80 shadow-[0_12px_28px_rgba(249,115,22,0.18)] backdrop-blur-xl ${f.className}`}
          >
            <f.Icon size={f.size} strokeWidth={1.8} />
          </motion.span>
        ))}

        <div className="relative z-20 mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/60 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#c2410c] shadow-[0_8px_24px_rgba(249,115,22,0.12)] backdrop-blur-xl"
          >
            <Sparkles size={13} className="text-[#f97316]" fill="currentColor" />
            AI-powered kitchen studio
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
            className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-[#111827] sm:text-5xl [font-family:var(--font-display)]"
          >
            Create Your{" "}
            <span className="bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#fb923c] bg-clip-text text-transparent">
              Signature
            </span>{" "}
            Recipe
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.26, ease: EASE }}
            className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[#6b7280]"
          >
            Share your creativity with thousands of food lovers. Let our AI chef
            do the heavy lifting — you bring the ideas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34, ease: EASE }}
            className="mt-7 flex flex-wrap items-center justify-center gap-2.5"
          >
            {["10K+ recipes", "120K+ cooks", "4.9 avg rating"].map((stat) => (
              <span
                key={stat}
                className="rounded-full border border-white/80 bg-white/55 px-3.5 py-1.5 text-[12px] font-bold text-[#6b7280] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-0.5"
              >
                {stat}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════ TWO-COLUMN LAYOUT ═══════════════ */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_420px] lg:gap-8">
        {/* Left — form */}
        <div className="min-w-0 space-y-6">
          <SectionCard icon={Sparkles} title="Recipe details" subtitle="Start with a strong name">
            <TitleField
              title={recipe.title}
              onChange={(v) => update({ title: v })}
              suggestions={suggestions}
              duplicate={duplicate}
              onPickSuggestion={(s) => update({ title: s })}
            />
          </SectionCard>

          <SectionCard
            icon={Salad}
            title="Ingredients"
            subtitle="Press Enter to add · drag to reorder"
          >
            <IngredientsEditor
              ingredients={recipe.ingredients}
              onAdd={addIngredient}
              onUpdate={updateIngredient}
              onRemove={removeIngredient}
              onReorder={(items) => update({ ingredients: items })}
            />
          </SectionCard>

          <SectionCard
            icon={ListChecks}
            title="Instructions"
            subtitle="Short, numbered steps your readers will love"
          >
            <InstructionsEditor
              steps={recipe.instructions}
              onAdd={addStep}
              onUpdate={updateStep}
              onRemove={removeStep}
              onReorder={(items) => update({ instructions: items })}
              onImprove={improveStep}
              improvingId={improvingId}
            />
          </SectionCard>

          <SectionCard
            icon={Timer}
            title="Cooking time & servings"
            subtitle="Total time updates automatically"
          >
            <TimeControls
              prepTime={recipe.prepTime}
              cookTime={recipe.cookTime}
              onPrep={(v) => update({ prepTime: v })}
              onCook={(v) => update({ cookTime: v })}
            />
            <div className="my-6 h-px bg-[#F3F4F6]" />
            <ServingsStepper servings={recipe.servings} onChange={(v) => update({ servings: v })} />
            <div className="mt-6">
              <DifficultyToggle difficulty={recipe.difficulty} onChange={(v) => update({ difficulty: v })} />
            </div>
          </SectionCard>

          <SectionCard icon={Globe} title="Cuisine & dietary" subtitle="Reach the right eaters">
            <SearchableSelect
              value={recipe.cuisine}
              onChange={(v) => update({ cuisine: v })}
              options={CUISINES}
            />
            <div className="mt-6">
              <DietaryChips selected={recipe.dietary} onToggle={(option) =>
                update({
                  dietary: recipe.dietary.includes(option)
                    ? recipe.dietary.filter((d) => d !== option)
                    : [...recipe.dietary, option],
                })
              } />
            </div>
          </SectionCard>

          <SectionCard icon={ImagePlus} title="Photo" subtitle="A great photo makes it stand out">
            <ImageUploader recipe={recipe} image={recipe.image} onChange={(img) => update({ image: img })} />
          </SectionCard>

          {/* Bottom actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="rounded-3xl border border-[#F3F4F6] bg-white p-6 shadow-[0_18px_44px_-22px_rgba(111,80,50,0.18)] sm:p-7"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={saveDraft}
                disabled={savingDraft}
                className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-[#F3F4F6] bg-[#FFFCF8] px-5 py-3.5 text-[13.5px] font-bold text-[#6b7280] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#fdba74] hover:text-[#c2410c] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {savingDraft ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {savingDraft ? "Saving draftâ€¦" : "Save Draft"}
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-[#F3F4F6] bg-[#FFFCF8] px-5 py-3.5 text-[13.5px] font-bold text-[#6b7280] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#fdba74] hover:text-[#c2410c]"
              >
                <Eye size={16} />
                Preview Recipe
              </button>
              <motion.button
                type="button"
                onClick={publish}
                disabled={publishing}
                whileHover={publishing ? undefined : { y: -2 }}
                whileTap={publishing ? undefined : { scale: 0.99 }}
                className="group flex h-13 flex-1 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-6 py-3.5 text-[14.5px] font-bold text-white shadow-[0_14px_30px_rgba(249,115,22,0.4),0_4px_10px_rgba(249,115,22,0.22)] transition-shadow duration-300 hover:shadow-[0_20px_42px_rgba(249,115,22,0.5),0_6px_14px_rgba(249,115,22,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {publishing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Creating your recipe…</span>
                  </>
                ) : (
                  <>
                    <Sparkles
                      size={18}
                      className="transition-transform duration-300 group-hover:scale-125"
                    />
                    <span>Create Recipe</span>
                  </>
                )}
              </motion.button>
            </div>
            <p className="mt-4 text-center text-[12px] text-[#9ca3af]">
              Your recipe will be published to the community feed once created.
            </p>
          </motion.div>
        </div>

        {/* Right — assistant + preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="flex flex-col gap-5">
            <AiAssistant
              mode={aiMode}
              onModeChange={setAiMode}
              prompt={aiPrompt}
              onPromptChange={setAiPrompt}
              onGenerate={handleAiGenerate}
              generating={aiGenerating}
            />
            <PreviewCard recipe={recipe} generating={aiGenerating} nutrition={nutrition} />
            <ReadinessCard checks={checks} />
            <ProTips />
          </div>
        </div>
      </div>

      <PreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        recipe={recipe}
        nutrition={nutrition}
      />
      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={recipe.title}
      />
    </div>
  );
}
