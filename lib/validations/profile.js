import { z } from "zod";

export const profileUpdateSchema = z.object({
  full_name: z
    .string()
    .trim()
    .max(80, "Full name must be under 80 characters")
    .optional()
    .nullable(),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be under 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    )
    .optional()
    .nullable(),
  bio: z
    .string()
    .trim()
    .max(300, "Bio must be under 300 characters")
    .optional()
    .nullable(),
  avatar_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .nullable(),
});

export const recipeIdSchema = z.object({
  recipeId: z
    .string({ required_error: "recipeId is required" })
    .min(1, "recipeId is required")
    .max(200, "recipeId is too long"),
});

export const notificationIdSchema = z.object({
  id: z.string().uuid("Invalid notification id"),
});
