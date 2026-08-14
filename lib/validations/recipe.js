import { z } from "zod";

export const GENERATE_MODES = [
  "ingredients",
  "dish",
  "healthy",
  "suggest",
  "improve",
  "improve-step",
  "nutrition",
];

export const generateRequestSchema = z.object({
  mode: z.enum(GENERATE_MODES).default("dish"),
  prompt: z.string().max(2000, "Prompt is too long").default(""),
  stepText: z.string().max(1000, "Step is too long").optional(),
  stepIndex: z.number().int().min(0).max(60).optional(),
  recipe: z.record(z.unknown()).optional().default({}),
});

export const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required").max(120),
  quantity: z.string().max(60).default(""),
});

export const instructionSchema = z.object({
  text: z.string().min(1, "Instruction text is required").max(1000),
});

/**
 * Schemas for validating the AI provider's structured output before it reaches
 * the frontend. AI output is untrusted: these enforce required fields, string
 * lengths, array counts, number ranges and the difficulty enum. Numeric fields
 * accept any number (providers occasionally emit fractions); callers round.
 */
export const aiIngredientSchema = z.object({
  name: z.string().trim().min(1, "Ingredient name is required").max(120),
  quantity: z.string().max(60).default(""),
});

export const aiFillSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).default(""),
  ingredients: z.array(aiIngredientSchema).min(2).max(60),
  instructions: z.array(instructionSchema).min(2).max(60),
  prepTime: z.number().min(0).max(600),
  cookTime: z.number().min(0).max(600),
  servings: z.number().min(1).max(100),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  cuisine: z.string().trim().max(80),
  dietary: z.array(z.string().max(40)).max(20).default([]),
  calories: z.number().min(0).max(10000),
});

export const aiSuggestSchema = z.object({
  ingredients: z.array(aiIngredientSchema).min(1).max(20),
});

export const aiInstructionsSchema = z.object({
  instructions: z.array(instructionSchema).min(2).max(60),
});

export const aiStepSchema = z.object({
  step: z.string().trim().min(1, "Step text is required").max(1000),
});

export const aiNutritionSchema = z.object({
  calories: z.number().min(0).max(10000),
  protein: z.number().min(0).max(2000),
  carbs: z.number().min(0).max(4000),
  fat: z.number().min(0).max(2000),
});

/**
 * Request body for POST /api/recipes/generate-image. Only the fields the
 * food-image prompt needs are accepted; everything else (image objects,
 * instruction ids, etc.) is stripped. Field caps mirror the prompt builder.
 */
export const generateImageRequestSchema = z.object({
  recipe: z
    .object({
      title: z.string().trim().max(150).default(""),
      description: z.string().trim().max(1000).default(""),
      cuisine: z.string().trim().max(80).default(""),
      ingredients: z
        .array(
          z.object({
            name: z.string().trim().max(120).default(""),
            quantity: z.string().trim().max(60).default(""),
          })
        )
        .max(50)
        .default([]),
    })
    .default({}),
});

export const recipePayloadSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(500).default(""),
  image: z.string().max(500).nullable().optional(),
  cuisine: z.string().trim().max(80).default(""),
  prepTime: z.number().int().min(0).max(600).default(10),
  cookTime: z.number().int().min(0).max(600).default(20),
  servings: z.number().int().min(1).max(100).default(4),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).default("Medium"),
  dietary: z.array(z.string().max(40)).max(20).default([]),
  calories: z.number().int().min(0).max(10000).default(0),
  ingredients: z.array(ingredientSchema).max(60).default([]),
  instructions: z.array(instructionSchema).max(60).default([]),
});

/**
 * Payload for saving/publishing a recipe. `recipeId` is optional — used to
 * update an existing draft the user already owns (verified server-side).
 */
export const saveRecipeSchema = z.object({
  recipe: recipePayloadSchema,
  recipeId: z.string().uuid("Invalid recipe id").optional(),
});
