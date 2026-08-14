import { z } from "zod";

export const postIdSchema = z.object({
  postId: z.string().uuid("Invalid post id"),
});

export const createCommunityPostSchema = z.object({
  content: z.string().trim().max(2000, "Post is too long").default(""),
  category: z.string().trim().max(40).default("Dinner"),
  tags: z.array(z.string().trim().max(40)).max(20).default([]),
  images: z.array(z.string().trim().max(500)).max(10).default([]),
  poll: z
    .object({
      options: z.array(z.string().trim().min(1).max(80)).min(2).max(4),
    })
    .optional()
    .nullable()
    .default(null),
  recipeId: z.string().uuid("Invalid recipe id").optional().nullable(),
});

export const createCommentSchema = z.object({
  postId: z.string().uuid("Invalid post id"),
  content: z.string().trim().min(1, "Comment is required").max(1000, "Comment is too long"),
});
