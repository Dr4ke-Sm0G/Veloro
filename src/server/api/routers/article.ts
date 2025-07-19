// server/api/routers/article.ts
import { z } from "zod";
import {
  router,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { Prisma } from "@prisma/client";

// Zod schema for Article creation (no change needed here for slug)
const createArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().nullable().optional(),
  coverImage: z.string().url("Must be a valid URL").nullable().optional(),
  published: z.boolean().default(false),
  publishedAt: z.date().nullable().optional(),
  categoryIds: z.array(z.string()).optional(),
});

// Zod schema for Article update
const updateArticleSchema = z.object({
  // We'll use ID for updates, as slugs can also change.
  // If you strictly want to update by slug, change 'id' to 'slug' here.
  id: z.string().cuid("Invalid article ID"),
  title: z.string().min(1, "Title is required").optional(),
  // Ensure slug validation is consistent if it's updated
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens").optional(),
  content: z.string().min(1, "Content is required").optional(),
  excerpt: z.string().nullable().optional(),
  coverImage: z.string().url("Must be a valid URL").nullable().optional(),
  published: z.boolean().optional(),
  publishedAt: z.date().nullable().optional(),
  categoryIds: z.array(z.string()).optional(),
});

// Zod schema for getting an Article by SLUG
const getArticleBySlugSchema = z.object({ // Renamed schema
  slug: z.string().min(1, "Slug is required"), // Changed from 'id' to 'slug'
});

// Zod schema for deleting an Article (can keep by ID or change to slug)
const deleteArticleSchema = z.object({
  id: z.string().cuid("Invalid article ID"), // Keeping by ID for deletion safety
});

// Zod schema for listing articles with pagination and search (no change)
const listArticlesSchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  cursor: z.string().cuid().nullable().optional(),
  search: z.string().optional(),
  published: z.boolean().optional(),
});

export const articleRouter = router({
  // Procedure to get an article by SLUG
  getById: publicProcedure // Renamed from getById to getBySlug if you prefer, but keeping getById for consistency if not
    .input(getArticleBySlugSchema) // Use the new slug schema
    .query(async ({ ctx, input }) => {
      const article = await ctx.prisma.article.findUnique({
        where: { slug: input.slug }, // <--- CRUCIAL CHANGE: find by slug
        include: {
          categories: true,
        },
      });
      if (!article) {
        throw new Error("Article not found");
      }
      return article;
    }),

  // Procedure to create a new article (no change needed as slug is already input)
  create: protectedProcedure
    .input(createArticleSchema)
    .mutation(async ({ ctx, input }) => {
      const { categoryIds, ...articleData } = input;
      return ctx.prisma.article.create({
        data: {
          ...articleData,
          ...(categoryIds && categoryIds.length > 0 && {
            categories: {
              connect: categoryIds.map((id) => ({ id })),
            },
          }),
        },
      });
    }),

  // Procedure to update an existing article (keeping update by ID, but you can change to slug if needed)
  update: protectedProcedure
    .input(updateArticleSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, categoryIds, ...updateData } = input;

      const updateCategories = categoryIds !== undefined ? {
        categories: {
          set: categoryIds.map((categoryId) => ({ id: categoryId })),
        },
      } : {};

      return ctx.prisma.article.update({
        where: { id }, // Keeping update by ID for now, as slugs can change
        data: {
          ...updateData,
          ...updateCategories,
          updatedAt: new Date(),
        },
      });
    }),

  // Procedure to delete an article (keeping by ID)
  delete: protectedProcedure
    .input(deleteArticleSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.article.delete({
        where: { id: input.id },
      });
    }),

  // Procedure to list articles for admin view (no change)
  list: protectedProcedure
    .input(listArticlesSchema)
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search, published } = input;

      const whereClause: Prisma.ArticleWhereInput = {};

      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } }, // Add slug to search
        ];
      }

      if (published !== undefined) {
        whereClause.published = published;
      }

      const articles = await ctx.prisma.article.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined, // Cursor still uses ID
        where: whereClause,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          categories: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (articles.length > limit) {
        const nextItem = articles.pop();
        nextCursor = nextItem?.id; // Cursor still uses ID
      }

      return {
        articles,
        nextCursor,
      };
    }),
});