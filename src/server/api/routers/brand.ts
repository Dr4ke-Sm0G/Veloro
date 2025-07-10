import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc";

export const brandRouter = router({
  createBrand: publicProcedure
    .input(z.object({ name: z.string().min(2) }))
    .mutation(async ({ input, ctx }) => {
      const slug = input.name.toLowerCase().replace(/\s+/g, "-");

      const brand = await ctx.prisma.brand.create({
        data: {
          name: input.name,
          slug,
        },
      });

      return brand;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.brand.findMany();
  }),

  // 🔥 Nouveau endpoint avec logo + nombre de variantes
  getWithVariantCounts: publicProcedure.query(async ({ ctx }) => {
    const brands = await ctx.prisma.brand.findMany({
      include: {
        models: {
          include: {
            _count: {
              select: { variants: true },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return brands.map((brand) => ({
      id: brand.id,
      name: brand.name,
      logo: brand.logo, // ce champ doit exister dans Brand
      count: brand.models.reduce((sum, model) => sum + model._count.variants, 0),
    }));
  }),
});
