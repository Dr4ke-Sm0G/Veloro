import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc";
import { prisma } from "@/server/db";



// Schéma Zod pour validation
const specInputSchema = z.object({
  engineType: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  driveType: z.string().optional(),
  horsepower: z.string().optional(),
  torque: z.string().optional(),
  acceleration: z.string().optional(),
  topSpeed: z.string().optional(),

  length: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  wheelbase: z.string().optional(),
  trunkCapacity: z.string().optional(),
  weight: z.string().optional(),
  groundClearance: z.string().optional(),

  fuelConsumption: z.string().optional(),
  co2Emissions: z.string().optional(),
  emissionStandard: z.string().optional(),
  fuelTankCapacity: z.string().optional(),
  rangeWLTP: z.string().optional(),
});

// Routeur complet
export const modelRouter = router({
  // Ajouter un model avec specs
  createWithSpecs: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        brandId: z.string(),
        specs: specInputSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const model = await prisma.model.create({
        data: {
          name: input.name,
          brandId: input.brandId,
          technical: {
            create: {
              engineType: input.specs.engineType,
              fuelType: input.specs.fuelType,
              transmission: input.specs.transmission,
              driveType: input.specs.driveType,
              horsepower: input.specs.horsepower,
              torque: input.specs.torque,
              acceleration: input.specs.acceleration,
              topSpeed: input.specs.topSpeed,
            },
          },
          dimensions: {
            create: {
              length: input.specs.length,
              width: input.specs.width,
              height: input.specs.height,
              wheelbase: input.specs.wheelbase,
              trunkCapacity: input.specs.trunkCapacity,
              weight: input.specs.weight,
              groundClearance: input.specs.groundClearance,
            },
          },
          consumption: {
            create: {
              fuelConsumption: input.specs.fuelConsumption,
              co2Emissions: input.specs.co2Emissions,
              emissionStandard: input.specs.emissionStandard,
              fuelTankCapacity: input.specs.fuelTankCapacity,
              rangeWLTP: input.specs.rangeWLTP,
            },
          },
        },
        include: {
          technical: true,
          dimensions: true,
          consumption: true,
        },
      });

      return model;
    }),

  // Récupérer tous les modèles
  getAll: publicProcedure.query(async () => {
    return prisma.model.findMany({
      include: {
        brand: true,
        technical: true,
        dimensions: true,
        consumption: true,
      },
    });
  }),

  // Récupérer les modèles d'une marque
  getByBrand: publicProcedure
    .input(z.object({ brandId: z.string() }))
    .query(async ({ input }) => {
      return prisma.model.findMany({
        where: { brandId: input.brandId },
        include: {
          technical: true,
          dimensions: true,
          consumption: true,
        },
      });
    }),
});
