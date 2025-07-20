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

const toNum = (d?: Prisma.Decimal | number | null): number | null => {
  if (d == null) return null;
  if (typeof d === "number") return d;
  return d instanceof Prisma.Decimal ? d.toNumber() : null;
};

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
    year: v.year,
    bodyType: v.bodyType,
    transmission: v.drive,                        // ✚ année
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

type VariantFullInput = Prisma.VariantGetPayload<{
  include: {
    model: { include: { brand: true } };
    performanceSpec: true;
    batterySpec: true;
    chargingSpec: true;
    dimensionSpec: true;
    v2xSpec: true;
    efficiencySpec: true;
    prices: true;
  };
}>;

export function mapVariantToComparison(v: VariantFullInput) {
  const perf = v.performanceSpec;
  const bat = v.batterySpec;
  const ch = v.chargingSpec;
  const dim = v.dimensionSpec;
  const v2x = v.v2xSpec;
  const eff = v.efficiencySpec;
  const best = v.prices[0];

  // Calcul puissance
  let kW = toNum(perf?.totalPowerKw) ?? 0;
  if (kW > KW_WATTS_THRESHOLD) kW *= WATT_TO_KW;
  const kWint = Math.round(kW);
  const hp = kW ? Math.round(kW * 1.341) : null;

  // Format prix
  let priceStr = "N/A";
  if (best?.price != null) {
    let raw = Number(best.price);
    if (raw < PRICE_THOUSAND_THRESHOLD) raw *= 1000;
    priceStr = formatPrice(raw, best.country);
  }

  return {
    id: v.id,
    trim: v.name,
    year: v.year,
    brandName: v.model.brand.name,
    modelName: v.model.name,
    price: priceStr,
    bodyType: v.bodyType,

    performanceSpec: {
      acceleration0100Sec: toNum(perf?.acceleration0100Sec),
      topSpeedKmh: toNum(perf?.topSpeedKmh),
      electricRangeKm: toNum(perf?.electricRangeKm),
      totalPowerKw: kWint || null,
      totalTorqueNm: toNum(perf?.totalTorqueNm),
      drive: v.drive ?? null,
    },

    batterySpec: {
      useableCapacity: toNum(bat?.useableCapacity),
      architecture: bat?.architecture ?? null,
      warrantyPeriod: bat?.warrantyPeriod ?? null,
      warrantyMileage: bat?.warrantyMileage ?? null,
    },

    chargingSpec: {
      acPowerKW: toNum(ch?.acPowerKW),
      dcMaxPowerKW: toNum(ch?.dcMaxPowerKW),
      dcChargeSpeedKmH: toNum(ch?.dcChargeSpeedKmH),
      preconditioningNav: ch?.preconditioningNav ?? null,
    },

    dimensionSpec: {
      seats: dim?.seats ?? null,
      lengthMm: dim?.lengthMm ?? null,
      widthMm: dim?.widthMm ?? null,
      heightMm: dim?.heightMm ?? null,
      weightUnladenKg: dim?.weightUnladenKg ?? null,
      cargoVolumeL: dim?.cargoVolumeL ?? null,
      frunkVolumeL: dim?.frunkVolumeL ?? null,
      towingWeightBrakedKg: dim?.towingWeightBrakedKg ?? null,
      towHitchPossible: dim?.towHitchPossible ?? null,
      heatPump: dim?.heatPump ?? null,
      evDedicatedPlatform: dim?.evDedicatedPlatform ?? null,
    },

    v2xSpec: {
      v2lSupported: v2x?.v2lSupported ?? null,
    },

    efficiencySpec: {
      vehicleConsumptionWhKm: toNum(eff?.vehicleConsumptionWhKm),
    },
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
    .input(z.object({ limit: z.number().min(1).max(100).default(12) }))
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
        priceMin: z.number().optional(),
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

          (input.priceMin || input.priceMax)
            ? {
              prices: {
                some: {
                  country: {
                    in: ["Germany", "United Kingdom", "Netherlands"],
                  },
                  ...(input.priceMin ? { price: { gte: input.priceMin } } : {}),
                  ...(input.priceMax ? { price: { lte: input.priceMax } } : {}),
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


  getVariantsByIds: publicProcedure
    .input(z.object({ ids: z.array(z.string()).max(3) }))
    .query(async ({ ctx, input }) => {
      const raws = await ctx.prisma.variant.findMany({
        where: { id: { in: input.ids } },
        include: {
          model: { include: { brand: true } },
          performanceSpec: true,
          batterySpec: true,
          chargingSpec: true,
          dimensionSpec: true,
          v2xSpec: true,
          efficiencySpec: true,
          prices: true,
        },
      });
      // on renvoie des ComparisonVariant[]
      return raws.map(mapVariantToComparison);
    }),
});


