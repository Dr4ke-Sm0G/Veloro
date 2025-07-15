// src/server/api/routers/admin.ts

import { router, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { prisma } from "@/server/db";
import { PerformanceSpecSchema, EfficiencySpecSchema, ChargingSpecSchema, BatterySpecSchema, DimensionSpecSchema, RealConsumptionSchema, V2XSpecSchema, SafetyRatingSchema, AvailabilitySchema } from "@/lib/validators/variantSchema";

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
            include: {
              _count: {
                select: {
                  carListings: true,
                },
              },
              dimensionSpec: true,
              performanceSpec: true,
              efficiencySpec: true,
              prices: {
                take: 1,
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
  .input(
    z.object({
      variantId: z.string(),
      name: z.string().optional(),
      slug: z.string().optional(),
      year: z.number().optional(),
      bodyType: z.string().optional(),
      performanceSpec: PerformanceSpecSchema.optional(),
      efficiencySpec: EfficiencySpecSchema.optional(),
      chargingSpec: ChargingSpecSchema.optional(),
      batterySpec: BatterySpecSchema.optional(),
      dimensionSpec: DimensionSpecSchema.optional(),
      realConsumption: RealConsumptionSchema.optional(),
      v2xSpec: V2XSpecSchema.optional(),
      safetyRating: SafetyRatingSchema.optional(),
      availability: AvailabilitySchema.optional(),
      prices: z.array(
        z.object({
          country: z.string(),
          price: z.number(),
        })
      ).optional(),
    })
  )
  .mutation(async ({ input }) => {
    const {
      variantId,
      prices,
      performanceSpec,
      efficiencySpec,
      chargingSpec,
      batterySpec,
      dimensionSpec,
      realConsumption,
      v2xSpec,
      safetyRating,
      availability,
      ...rest
    } = input as {
      variantId: string;
      prices?: { country: string; price: number }[];
      performanceSpec?: any;
      efficiencySpec?: any;
      chargingSpec?: any;
      batterySpec?: any;
      dimensionSpec?: any;
      realConsumption?: any;
      v2xSpec?: any;
      safetyRating?: any;
      availability?: any;
      [key: string]: any;
    };

    const update = await prisma.variant.update({
      where: { id: variantId },
      data: {
        ...rest,

        // Upsert chaque bloc imbriqué
        performanceSpec: performanceSpec
          ? { upsert: { update: performanceSpec, create: performanceSpec } }
          : undefined,

        efficiencySpec: efficiencySpec
          ? { upsert: { update: efficiencySpec, create: efficiencySpec } }
          : undefined,

        chargingSpec: chargingSpec
          ? { upsert: { update: chargingSpec, create: chargingSpec } }
          : undefined,

        batterySpec: batterySpec
          ? { upsert: { update: batterySpec, create: batterySpec } }
          : undefined,

        dimensionSpec: dimensionSpec
          ? { upsert: { update: dimensionSpec, create: dimensionSpec } }
          : undefined,

        realConsumption: realConsumption
          ? { upsert: { update: realConsumption, create: realConsumption } }
          : undefined,

        v2xSpec: v2xSpec
          ? { upsert: { update: v2xSpec, create: v2xSpec } }
          : undefined,

        safetyRating: safetyRating
          ? { upsert: { update: safetyRating, create: safetyRating } }
          : undefined,

        availability: availability
          ? { upsert: { update: availability, create: availability } }
          : undefined,

        prices: prices
          ? {
              deleteMany: {}, // supprime tous les anciens
              createMany: {
                data: prices.map((p) => ({
                  country: p.country,
                  price: p.price,
                })),
              },
            }
          : undefined,
      },
    });

    return update;
  }),


  deleteBrand: protectedProcedure
    .input(z.object({ brandId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const models = await prisma.model.findMany({
          where: { brandId: input.brandId },
          select: { id: true },
        });

        const modelIds = models.map((m) => m.id);

        // on peut chaîner avec deleteModel si tu veux les réutiliser en interne

        for (const modelId of modelIds) {
          await prisma.model.delete({
            where: { id: modelId },
          });
        }

        await prisma.brand.delete({ where: { id: input.brandId } });

        return { success: true };
      } catch (err) {
        console.error("Erreur suppression marque :", err);
        throw new Error("Impossible de supprimer la marque.");
      }
    }),


  deleteModel: protectedProcedure
    .input(z.object({ modelId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const variants = await prisma.variant.findMany({
          where: { modelId: input.modelId },
          select: { id: true },
        });

        const variantIds = variants.map((v) => v.id);

        await prisma.$transaction([
          // 🔁 Supprimer toutes les relations liées aux variants
          prisma.batterySpec.deleteMany({ where: { variantId: { in: variantIds } } }),
          prisma.chargingSpec.deleteMany({ where: { variantId: { in: variantIds } } }),
          prisma.performanceSpec.deleteMany({ where: { variantId: { in: variantIds } } }),
          prisma.efficiencySpec.deleteMany({ where: { variantId: { in: variantIds } } }),
          prisma.realConsumptionSpec.deleteMany({ where: { variantId: { in: variantIds } } }),
          prisma.dimensionSpec.deleteMany({ where: { variantId: { in: variantIds } } }),
          prisma.safetyRating.deleteMany({ where: { variantId: { in: variantIds } } }),
          prisma.v2XSpec.deleteMany({ where: { variantId: { in: variantIds } } }),
          prisma.availability.deleteMany({ where: { variantId: { in: variantIds } } }),

          prisma.price.deleteMany({ where: { variantId: { in: variantIds } } }),
          prisma.favorite.deleteMany({ where: { variantId: { in: variantIds } } }),
          prisma.wishlist.deleteMany({ where: { variantId: { in: variantIds } } }),
          prisma.carListing.deleteMany({ where: { variantId: { in: variantIds } } }),

          // 🔁 Supprimer les variants
          prisma.variant.deleteMany({ where: { modelId: input.modelId } }),

          // 🔁 Supprimer les commentaires et avis liés au modèle
          prisma.review.deleteMany({ where: { modelId: input.modelId } }),
          prisma.comment.deleteMany({ where: { modelId: input.modelId } }),

          // 🗑️ Supprimer le modèle
          prisma.model.delete({ where: { id: input.modelId } }),
        ]);

        return { success: true };
      } catch (err) {
        console.error("Erreur suppression modèle :", err);
        throw new Error("Impossible de supprimer le modèle.");
      }
    }),


  deleteVariant: protectedProcedure
    .input(z.object({ variantId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await prisma.$transaction([
          // 🔁 Supprimer les relations 1:1 si présentes
          prisma.batterySpec.deleteMany({ where: { variantId: input.variantId } }),
          prisma.chargingSpec.deleteMany({ where: { variantId: input.variantId } }),
          prisma.performanceSpec.deleteMany({ where: { variantId: input.variantId } }),
          prisma.efficiencySpec.deleteMany({ where: { variantId: input.variantId } }),
          prisma.realConsumptionSpec.deleteMany({ where: { variantId: input.variantId } }),
          prisma.dimensionSpec.deleteMany({ where: { variantId: input.variantId } }),
          prisma.safetyRating.deleteMany({ where: { variantId: input.variantId } }),
          prisma.v2XSpec.deleteMany({ where: { variantId: input.variantId } }),
          prisma.availability.deleteMany({ where: { variantId: input.variantId } }),

          // 🔁 Supprimer les relations 1:N
          prisma.price.deleteMany({ where: { variantId: input.variantId } }),
          prisma.favorite.deleteMany({ where: { variantId: input.variantId } }),
          prisma.wishlist.deleteMany({ where: { variantId: input.variantId } }),
          prisma.carListing.deleteMany({ where: { variantId: input.variantId } }),

          // 🗑️ Supprimer la variant
          prisma.variant.delete({ where: { id: input.variantId } }),
        ]);

        return { success: true };
      } catch (err) {
        console.error("Erreur suppression variant :", err);
        throw new Error("Impossible de supprimer la variante. Vérifie les relations existantes.");
      }
    }),

  getVariantsPage: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const skip = (input.page - 1) * input.limit;

      const where = input.search
        ? {
            OR: [
              { name: { contains: input.search, mode: "insensitive" as const } },
              { model: { name: { contains: input.search, mode: "insensitive" as const } } },
              { model: { brand: { name: { contains: input.search, mode: "insensitive" as const } } } },
            ],
          }
        : {};

      const [totalCount, variants] = await Promise.all([
        prisma.variant.count({ where }),
        prisma.variant.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: input.limit,
          include: {
            model: {
              include: {
                brand: true,
              },
            },
            dimensionSpec: true,
            performanceSpec: true,
            efficiencySpec: true,
            prices: {
              take: 1,
            },
            _count: {
              select: { carListings: true },
            },
          },
        }),
      ]);

      const items = variants.map((variant) => ({
        id: variant.id,
        brand: variant.model.brand.name,
        brandLogo: variant.model.brand.logo ?? undefined,
        model: variant.model.name,
        name: variant.name,
        year: variant.year ?? 0,
        bodyType: variant.bodyType ?? undefined,
        seats: variant.dimensionSpec?.seats ?? undefined,
        powerHp: variant.performanceSpec?.totalPowerKw
          ? Math.round(Number(variant.performanceSpec.totalPowerKw) * 1.341)
          : undefined,
        rangeKm: variant.efficiencySpec?.rangeKm
          ? Number(variant.efficiencySpec.rangeKm)
          : undefined,
        price: variant.prices?.[0]?.price
          ? Number(variant.prices[0].price)
          : undefined,
        slug: variant.slug ?? "",
        hasListings: variant._count.carListings > 0,
      }));

      return {
        totalCount,
        totalPages: Math.ceil(totalCount / input.limit),
        currentPage: input.page,
        items,
      };
    }),
getFilteredVariants: protectedProcedure
  .input(
    z.object({
      brand: z.string().optional(),
      year: z.string().optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    })
  )
  .query(async ({ input }) => {
    const where: any = {};

    if (input.brand) {
      where.model = {
        brand: {
          name: {
            contains: input.brand,
            mode: "insensitive",
          },
        },
      };
    }

    if (input.year) {
      where.year = parseInt(input.year);
    }

    const skip = (input.page - 1) * input.limit;

    const [totalCount, variants] = await Promise.all([
      prisma.variant.count({ where }),
      prisma.variant.findMany({
        where,
        skip,
        take: input.limit,
        orderBy: { createdAt: "desc" },
        include: {
          model: { include: { brand: true } },
          dimensionSpec: true,
          performanceSpec: true,
          efficiencySpec: true,
          prices: { take: 1 },
          _count: { select: { carListings: true } },
        },
      }),
    ]);

    const items = variants.map((variant) => ({
      id: variant.id,
      brand: variant.model.brand.name,
      brandLogo: variant.model.brand.logo ?? undefined,
      model: variant.model.name,
      name: variant.name,
      year: variant.year ?? 0,
      bodyType: variant.bodyType ?? undefined,
      seats: variant.dimensionSpec?.seats ?? undefined,
      powerHp: variant.performanceSpec?.totalPowerKw
        ? Math.round(Number(variant.performanceSpec.totalPowerKw) * 1.341)
        : undefined,
      rangeKm: variant.efficiencySpec?.rangeKm
        ? Number(variant.efficiencySpec.rangeKm)
        : undefined,
      price: variant.prices?.[0]?.price
        ? Number(variant.prices[0].price)
        : undefined,
      slug: variant.slug ?? "",
      hasListings: variant._count.carListings > 0,
    }));

    return {
      totalCount,
      totalPages: Math.ceil(totalCount / input.limit),
      currentPage: input.page,
      items,
    };
  }),


});