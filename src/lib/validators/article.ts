// lib/validators/article.ts
import { z } from "zod";

const imageFileSchema = z.custom<File>(file => file instanceof File, {
  message: "Image must be a File.",
}).refine(file => file.size < 5 * 1024 * 1024, `Max image size is 5MB.`)
  .refine(file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), "Only .jpg, .jpeg, .png, and .webp formats are supported.");

export const createArticleFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  link: z.string().min(1, "Link is required for slug generation."),
  slug: z.string()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens.")
    .max(100, "Slug cannot exceed 100 characters."),
  image: z.union([imageFileSchema, z.string().url("Must be a valid URL.").optional().nullable()])
    .optional()
    .nullable(),
  content: z.string().min(10, "Content must be at least 10 characters.").max(65535, "Content is too long."),
  excerpt: z.string().max(500, "Excerpt cannot exceed 500 characters.").nullable().optional(),
  published: z.boolean(),
  // For the form, we allow string | Date because of the datetime-local input
  publishedAt: z.union([z.date(), z.string().datetime()]).nullable().optional(),
  categoryIds: z.array(z.string().cuid("Invalid category ID.")).optional(),
});

export type CreateArticleFormValues = z.infer<typeof createArticleFormSchema>;

export const articleCreateMutationSchema = createArticleFormSchema
  .omit({
    image: true,
    link: true,
    publishedAt: true,
  })
  .extend({
    // --- Ensure this is correct ---
coverImage: z.string()
  .trim()
  .optional()
  .nullable()
  .refine(val => !val || /^https?:\/\//.test(val), {
    message: "Must be a valid URL",
  }),
    // --- It should be nullable and optional if no image is selected ---
    publishedAt: z.date().nullable().optional(),
  });

export type ArticleCreateMutationPayload = z.infer<typeof articleCreateMutationSchema>;