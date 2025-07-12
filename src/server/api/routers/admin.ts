// src/server/api/routers/admin.ts

import { router, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { prisma } from "@/server/db";

export const adminRouter = router({
  getStats: protectedProcedure.query(async () => {
    const [users, cars, brands, reviews] = await Promise.all([
      prisma.user.count(),
      prisma.variant.count(),
      prisma.brand.count(),
      prisma.review.count(),
    ]);
    return { users, cars, brands, reviews };
  }),

getBrandsWithModels: protectedProcedure.query(async () => {
  return prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: {
      models: {
        include: {
          _count: {
            select: { variants: true },
          },
          variants: {
            select: {
              id: true,
              name: true,
              slug: true,
              year: true,
              _count: {
                select: {
                  carListings: true,
                },
              },
            },
          },
        },
      },
    },
  }).then((brands) =>
    brands.map((brand) => ({
      ...brand,
      models: brand.models.map((model) => ({
        ...model,
        variants: model.variants.map((variant) => ({
          ...variant,
          hasListings: variant._count.carListings > 0,
        })),
      })),
    }))
  );
}),




  getAllUsers: protectedProcedure.query(async () => {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        emailVerified: true,
        image: true,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  getUserById: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return prisma.user.findUnique({
      where: { id: input },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        image: true,
        isActive: true,
      },
    });
  }),

  updateUserRole: protectedProcedure
    .input(z.object({ userId: z.string(), role: z.enum(["USER", "DEALER", "ADMIN"]) }))
    .mutation(async ({ input }) => {
      await prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      });
      return { success: true };
    }),

updateUserDetails: protectedProcedure
  .input(
    z.object({
      userId: z.string(),
      name: z.string().optional(),
      email: z.string().email().optional(),
      image: z.string().optional(),
      isActive: z.boolean().optional(), 
    })
  )
  .mutation(async ({ input }) => {
    const { userId, ...data } = input;
    await prisma.user.update({
      where: { id: userId },
      data,
    });
    return { success: true };
  }),

    deleteUserById: protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    await prisma.user.delete({ where: { id: input.id } });
    return { success: true };
  }),
  createBrand: protectedProcedure
  .input(z.object({ name: z.string(), slug: z.string(), logo: z.string().optional() }))
  .mutation(async ({ input }) => {
    return prisma.brand.create({ data: input });
  }),

createModel: protectedProcedure
  .input(z.object({ name: z.string(), slug: z.string(), brandId: z.string() }))
  .mutation(async ({ input }) => {
    return prisma.model.create({ data: input });
  }),

createVariant: protectedProcedure
  .input(z.object({
    name: z.string(),
    slug: z.string(),
    year: z.number().optional(),
    bodyType: z.string().optional(),
    modelId: z.string()
  }))
  .mutation(async ({ input }) => {
    return prisma.variant.create({ data: input });
  }),
updateModel: protectedProcedure
  .input(z.object({
    modelId: z.string(),
    name: z.string().optional(),
    slug: z.string().optional(),
  }))
  .mutation(async ({ input }) => {
    return prisma.model.update({
      where: { id: input.modelId },
      data: { name: input.name, slug: input.slug },
    });
  }),

updateVariant: protectedProcedure
  .input(z.object({
    variantId: z.string(),
    year: z.number().optional(),
    slug: z.string().optional(),
  }))
  .mutation(async ({ input }) => {
    return prisma.variant.update({
      where: { id: input.variantId },
      data: { year: input.year, slug: input.slug },
    });
  }),
deleteBrand: protectedProcedure
  .input(z.object({ brandId: z.string() }))
  .mutation(async ({ input }) => {
    await prisma.brand.delete({ where: { id: input.brandId } });
    return { success: true };
  }),

deleteModel: protectedProcedure
  .input(z.object({ modelId: z.string() }))
  .mutation(async ({ input }) => {
    await prisma.model.delete({ where: { id: input.modelId } });
    return { success: true };
  }),

deleteVariant: protectedProcedure
  .input(z.object({ variantId: z.string() }))
  .mutation(async ({ input }) => {
    await prisma.variant.delete({ where: { id: input.variantId } });
    return { success: true };
  }),


});
