import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc";
import { prisma } from "@/server/db";
import { Prisma } from "@prisma/client";

type VariantPreviewInput = Prisma.VariantGetPayload<{
  include: {
    model: {
      include: {
        brand: true;
      };
    };
    performanceSpec: true;
    efficiencySpec: true;
    chargingSpec: true;
    dimensionSpec: true;
    prices: true;
  };
}>;

/* ────────────────────────────────────
 * Helpers
 * ──────────────────────────────────*/
const WATT_TO_KW = 1 / 1_000;
const KW_WATTS_THRESHOLD = 600;
const PRICE_THOUSAND_THRESHOLD = 300;

function formatPrice(raw: number, country: string) {
  return country === "United Kingdom"
    ? `£${raw.toLocaleString("en-GB")}`
    : `€${raw.toLocaleString("de-DE")}`;
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function mapVariantToCardPreview(v: VariantPreviewInput) {
  let kW = v.performanceSpec?.totalPowerKw
    ? Number(v.performanceSpec.totalPowerKw)
    : 0;
  if (kW > KW_WATTS_THRESHOLD) kW *= WATT_TO_KW;

  const kWint = Math.round(kW);
  const hp = kW ? Math.round(kW * 1.341) : null;

  const bestPriceRow = v.prices[0];
  let priceStr = "N/A";

  if (bestPriceRow?.price != null) {
    let raw = Number(bestPriceRow.price);
    if (raw < PRICE_THOUSAND_THRESHOLD) raw *= 1_000;
    priceStr = formatPrice(raw, bestPriceRow.country);
  }

  return {
    id: v.id,
    name: `${v.model.brand.name} ${v.model.name}`,
    trim: v.name,
    slug: slugify(v.name),
    rangeKm: v.efficiencySpec?.rangeKm ?? null,
    powerKw: kWint || null,
    powerHp: hp,
    seats: v.dimensionSpec?.seats ?? null,
    dcChargeKmH: v.chargingSpec?.dcChargeSpeedKmH ?? null,
    price: priceStr,
    priceCountry: bestPriceRow?.country ?? null,
    img: `/images/cars/${v.id}.webp`,
    score: 9.6,
    dealTag: "Amazing deal",
    brandName: v.model.brand.name,
    modelName: v.model.name,
  };
}

/* ────────────────────────────────────
 * Router
 * ──────────────────────────────────*/
export const variantRouter = router({
  /**
   * 🔍 Liste des variantes récentes (ex: page d’accueil)
   */
  listPreview: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(12) }).optional())
    .query(async ({ input }) => {
      const limit = input?.limit ?? 12;

      const variants = await prisma.variant.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          model: { include: { brand: true } },
          performanceSpec: true,
          efficiencySpec: true,
          chargingSpec: true,
          dimensionSpec: true,
          safetyRating: true,
          v2xSpec: true,
          prices: {
            where: {
              country: { in: ["Germany", "Netherlands", "United Kingdom"] },
            },
            orderBy: { country: "asc" },
          },
        },
      });

      return variants.map(mapVariantToCardPreview);
    }),

  /**
   * 📄 Détail d'une fiche variante via slugs
   */
  getBySlugs: publicProcedure
    .input(z.object({
      brand: z.string(),
      model: z.string(),
      variant: z.string(),
    }))
    .query(async ({ input }) => {
      return prisma.variant.findFirst({
        where: {
          slug: input.variant,
          model: {
            slug: input.model,
            brand: {
              slug: input.brand,
            },
          },
        },
        include: {
          model: { include: { brand: true } },
          batterySpec: true,
          chargingSpec: true,
          performanceSpec: true,
          efficiencySpec: true,
          realConsumption: true,
          dimensionSpec: true,
          availability: true,
          safetyRating: true,
          v2xSpec: true,
          prices: {
            orderBy: { country: "asc" },
          },
          images: true,
        },
      });
    }),

  /**
   * 🔍 Variantes d'un modèle (ex: /kia/ev6)
   */
  listByModel: publicProcedure
    .input(z.object({ brand: z.string(), model: z.string() }))
    .query(async ({ input }) => {
      const variants = await prisma.variant.findMany({
        where: {
          model: {
            slug: input.model,
            brand: {
              slug: input.brand,
            },
          },
        },
        include: {
          model: { include: { brand: true } },
          performanceSpec: true,
          efficiencySpec: true,
          chargingSpec: true,
          dimensionSpec: true,
          prices: {
            where: {
              country: { in: ["Germany", "Netherlands", "United Kingdom"] },
            },
            orderBy: { country: "asc" },
          },
        },
        orderBy: { name: "asc" },
      });

      return variants.map(mapVariantToCardPreview);
    }),

  /**
   * 🔍 Variantes d'une marque entière (ex: /kia)
   */
  listByBrand: publicProcedure
    .input(z.object({ make: z.string() }))
    .query(async ({ input }) => {
      const variants = await prisma.variant.findMany({
        where: {
          model: {
            brand: {
              slug: input.make,
            },
          },
        },
        include: {
          model: { include: { brand: true } },
          performanceSpec: true,
          efficiencySpec: true,
          chargingSpec: true,
          dimensionSpec: true,
          prices: {
            where: {
              country: { in: ["Germany", "Netherlands", "United Kingdom"] },
            },
            orderBy: { country: "asc" },
          },
        },
        orderBy: { name: "asc" },
      });

      return variants.map(mapVariantToCardPreview);
    }),
  getByBrandAndVariant: publicProcedure
    .input(z.object({
      brand: z.string(),
      variant: z.string(),
    }))
    .query(async ({ input }) => {
      return prisma.variant.findFirst({
        where: {
          slug: input.variant,
          model: {
            brand: {
              slug: input.brand,
            },
          },
        },
        include: {
          model: { include: { brand: true } },
          
          batterySpec: true,
          chargingSpec: true,
          performanceSpec: true,
          efficiencySpec: true,
          realConsumption: true,
          dimensionSpec: true,
          availability: true,
          safetyRating: true,
          v2xSpec: true,
          prices: {
            orderBy: { country: "asc" },
          },
        },
      });
    }),

filterVariants: publicProcedure
  .input(
    z.object({
      condition: z.enum(["NEW", "USED"]).optional(),
      bodyType: z.string().optional(),
      priceMax: z.number().optional(),
      yearMin: z.number().optional(),
      yearMax: z.number().optional(),
      mileageMin: z.number().optional(),
      mileageMax: z.number().optional(),
      availability: z.enum(["ALL", "STOCK", "ORDER"]).optional(),
      make: z.string().optional(),
      drive: z.string().optional(),
      seats: z.number().optional(),
      towHitchPossible: z.boolean().optional(),
      evDedicatedPlatform: z.boolean().optional(),
      roofRails: z.boolean().optional(),
      heatPump: z.boolean().optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
    })
  )
  .query(async ({ input }) => {
    const skip = (input.page - 1) * input.limit;

    const where: Prisma.VariantWhereInput = {
      AND: [
        input.bodyType ? { bodyType: input.bodyType } : {},
        input.drive ? { drive: input.drive } : {},
        input.yearMin ? { year: { gte: input.yearMin } } : {},
        input.yearMax ? { year: { lte: input.yearMax } } : {},
        input.availability && input.availability !== "ALL"
          ? { availabilityId: input.availability }
          : {},
        input.priceMax
          ? {
              prices: {
                some: {
                  price: { lt: input.priceMax },
                  country: {
                    in: ["Germany", "United Kingdom", "Netherlands"],
                  },
                },
              },
            }
          : {},
        input.condition || input.mileageMin || input.mileageMax
          ? {
              carListings: {
                some: {
                  status: "ACTIVE",
                  seller: { isActive: true },
                  ...(input.condition && {
                    car: {
                      condition: input.condition,
                    },
                  }),
                  ...(input.mileageMin || input.mileageMax
                    ? {
                        car: {
                          mileage: {
                            ...(input.mileageMin
                              ? { gte: input.mileageMin }
                              : {}),
                            ...(input.mileageMax
                              ? { lte: input.mileageMax }
                              : {}),
                          },
                        },
                      }
                    : {}),
                },
              },
            }
          : {},
        input.make
          ? {
              model: {
                brand: {
                  id: input.make,
                },
              },
            }
          : {},
        {
          dimensionSpec: {
            ...(input.seats !== undefined && { seats: input.seats }),
            ...(input.towHitchPossible !== undefined && {
              towHitchPossible: input.towHitchPossible,
            }),
            ...(input.evDedicatedPlatform !== undefined && {
              evDedicatedPlatform: input.evDedicatedPlatform,
            }),
            ...(input.roofRails !== undefined && {
              roofRails: input.roofRails,
            }),
            ...(input.heatPump !== undefined && {
              heatPump: input.heatPump,
            }),
          },
        },
      ],
    };

    const [variants, total] = await Promise.all([
      prisma.variant.findMany({
        where,
        skip,
        take: input.limit,
        include: {
          model: { include: { brand: true } },
          performanceSpec: true,
          efficiencySpec: true,
          chargingSpec: true,
          dimensionSpec: true,
          prices: {
            where: {
              country: {
                in: ["Germany", "Netherlands", "United Kingdom"],
              },
            },
            orderBy: { country: "asc" },
          },
        },
      }),
      prisma.variant.count({ where }),
    ]);

    return {
      variants: variants.map(mapVariantToCardPreview),
      total,
    };
  }),

getBodyTypesWithCounts: publicProcedure.query(async () => {
  const results = await prisma.variant.groupBy({
    by: ["bodyType"],
    where: {
      bodyType: {
        not: null,
      },
    },
    _count: {
      bodyType: true,
    },
    orderBy: {
      _count: {
        bodyType: "desc",
      },
    },
  });

  return results.map((entry) => ({
    type: entry.bodyType!,
    count: entry._count.bodyType,
  }));
}),

});
