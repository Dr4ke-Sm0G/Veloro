import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc";
import { prisma } from "@/server/db";



function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}
// Routeur pour le modèle Model
export const modelRouter = router({
  create: publicProcedure
    .input(z.object({ name: z.string().min(2), brandId: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.model.create({
        data: {
          name: input.name,
          brandId: input.brandId,
          slug: slugify(input.name),
        },
        include: { brand: true },
      });
    }),

  getAll: publicProcedure.query(async () => {
    return prisma.model.findMany({
      include: {
        brand: true,
        variants: {
          include: {
            performanceSpec: true,
            dimensionSpec: true,
            efficiencySpec: true,
            prices: true,
          },
        },
      },
    });
  }),

  getByBrand: publicProcedure
    .input(z.object({ brandId: z.string() }))
    .query(async ({ input }) => {
      return prisma.model.findMany({
        where: { brandId: input.brandId },
        include: {
          variants: {
            include: {
              performanceSpec: true,
              dimensionSpec: true,
              efficiencySpec: true,
              prices: true,
            },
          },
        },
      });
    }),

  listByBrandSlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return prisma.model.findMany({
        where: {
          brand: { slug: input.slug },
        },
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });
    }),
});
