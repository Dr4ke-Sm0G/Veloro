import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc";
import { prisma } from "@/server/db";

// Routeur pour le modèle Model
export const modelRouter = router({
  /**
   * Créer un modèle (Model) simple sans specs (les specs sont rattachées au Variant)
   */
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        brandId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const model = await prisma.model.create({
        data: {
          name: input.name,
          brandId: input.brandId,
        },
        include: {
          brand: true,
        },
      });

      return model;
    }),

  /**
   * Récupérer tous les modèles avec leurs variantes et specs associées
   */
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

  /**
   * Récupérer les modèles d'une marque
   */
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
});
