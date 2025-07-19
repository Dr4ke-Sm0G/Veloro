// lib/validators/category.ts
import { z } from 'zod';

export const CategorySchema = z.object({
  name: z.string().min(3, "Le nom de la catégorie doit contenir au moins 3 caractères.").max(100, "Le nom de la catégorie ne peut pas dépasser 100 caractères."),
  slug: z.string().min(3, "Le slug est requis."),
  // Make description nullable if it can be null from the DB, and optional for form input
  description: z.string().optional().nullable(),
  // For image, it's 'any' because it's a File object initially,
  // but after upload (before sending to tRPC) it becomes a string (URL).
  // The client-side form handles the File, and the schema here reflects initial form state flexibility.
  // If you *only* expect string URLs from the form after upload, change 'any' to 'string'.
  image: z.any().optional(), // `any` is flexible for File, `optional()` allows `undefined`
  // Make visible optional because defaultValues might provide 'undefined' for new forms
  visible: z.boolean().default(true).optional(),
});

export type CategorySchemaType = z.infer<typeof CategorySchema>;