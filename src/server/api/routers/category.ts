// server/routers/category.ts
import { z } from "zod";
import {
  router,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

// Re-using and extending schemas for new fields (description, image, visible)
// Ensure these are consistent with your Prisma schema.

// Zod schema for Category creation (unchanged from previous update)
const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100, "Category name cannot exceed 100 characters."),
  slug: z.string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
    .max(120, "Slug cannot exceed 120 characters."),
  description: z.string().optional().nullable(),
  image: z.string().url("Image must be a valid URL").optional().nullable(),
  visible: z.boolean().default(true),
});

// Zod schema for Category update (unchanged from previous update)
const updateCategorySchema = z.object({
  id: z.string().cuid("Invalid category ID"), // Keep ID for updates
  name: z.string().min(1, "Category name is required").max(100, "Category name cannot exceed 100 characters.").optional(),
  slug: z.string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
    .max(120, "Slug cannot exceed 120 characters.")
    .optional(),
  description: z.string().optional().nullable(),
  image: z.string().url("Image must be a valid URL").optional().nullable(),
  visible: z.boolean().optional(),
});

// Zod schema for getting a Category by ID (unchanged)
const getCategorySchema = z.object({
  id: z.string().cuid("Invalid category ID"),
});

// *NEW* Zod schema for getting a Category by Slug
const getCategoryBySlugSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

// Zod schema for deleting a Category (unchanged)
const deleteCategorySchema = z.object({
  id: z.string().cuid("Invalid category ID"),
});

// Zod schema for listing categories (unchanged)
const listCategoriesSchema = z.object({
  search: z.string().optional(),
  visible: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).default(10),
  cursor: z.string().cuid().optional(),
});

export const categoryRouter = router({
  // Existing procedures...
  getById: publicProcedure
    .input(getCategorySchema)
    .query(async ({ ctx, input }) => {
      try {
        const category = await ctx.prisma.category.findUnique({
          where: { id: input.id },
        });
        if (!category) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found.' });
        }
        return category;
      } catch (error) {
        console.error("Error fetching category by ID:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred while fetching the category.' });
      }
    }),

  // *NEW* Procedure to get a category by Slug
  getBySlug: publicProcedure
    .input(getCategoryBySlugSchema)
    .query(async ({ ctx, input }) => {
      try {
        const category = await ctx.prisma.category.findUnique({
          where: { slug: input.slug },
        });
        if (!category) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found.' });
        }
        return category;
      } catch (error) {
        console.error("Error fetching category by Slug:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred while fetching the category by slug.' });
      }
    }),

  create: protectedProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const existingCategory = await ctx.prisma.category.findUnique({
          where: { slug: input.slug },
        });
        if (existingCategory) {
          throw new TRPCError({ code: 'CONFLICT', message: 'A category with this slug already exists.' });
        }
        const newCategory = await ctx.prisma.category.create({
          data: {
            name: input.name,
            slug: input.slug,
            description: input.description,
            image: input.image,
            visible: input.visible,
          },
        });
        return newCategory;
      } catch (error) {
        console.error("Error creating category:", error);
        if (error instanceof TRPCError) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          throw new TRPCError({ code: 'CONFLICT', message: 'A category with this name or slug already exists.' });
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred while creating the category.' });
      }
    }),

  update: protectedProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      try {
        if (updateData.slug) {
          const existingCategory = await ctx.prisma.category.findUnique({
            where: { slug: updateData.slug },
          });
          if (existingCategory && existingCategory.id !== id) {
            throw new TRPCError({ code: 'CONFLICT', message: 'A category with this slug already exists.' });
          }
        }
        const updatedCategory = await ctx.prisma.category.update({
          where: { id },
          data: updateData,
        });
        return updatedCategory;
      } catch (error) {
        console.error("Error updating category:", error);
        if (error instanceof TRPCError) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found or already deleted.' });
          }
          if (error.code === 'P2002') {
            throw new TRPCError({ code: 'CONFLICT', message: 'A category with this name or slug already exists.' });
          }
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred while updating the category.' });
      }
    }),

  delete: protectedProcedure
    .input(deleteCategorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const deletedCategory = await ctx.prisma.category.delete({
          where: { id: input.id },
        });
        return deletedCategory;
      } catch (error) {
        console.error("Error deleting category:", error);
        if (error instanceof TRPCError) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found or already deleted.' });
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred while deleting the category.' });
      }
    }),

  list: publicProcedure
    .input(listCategoriesSchema.optional())
    .query(async ({ ctx, input }) => {
      try {
        const { search, visible, limit, cursor } = input || {};
        const whereClause: Prisma.CategoryWhereInput = {};
        if (search) {
          whereClause.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ];
        }
        if (typeof visible === 'boolean') {
          whereClause.visible = visible;
        }
        const categories = await ctx.prisma.category.findMany({
          where: whereClause,
          take: limit,
          cursor: cursor ? { id: cursor } : undefined,
          skip: cursor ? 1 : undefined,
          orderBy: { name: "asc" },
        });
        let nextCursor: typeof cursor | undefined = undefined;
        if (categories.length === limit) {
          nextCursor = categories[categories.length - 1]?.id;
        }
        return { categories, nextCursor };
      } catch (error) {
        console.error("Error listing categories:", error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred while fetching categories.' });
      }
    }),
});