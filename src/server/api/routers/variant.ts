// src/server/api/routers/variant.ts
import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc";
import { prisma } from "@/server/db";

/* ────────────────────────────────────
 * Helpers
 * ──────────────────────────────────*/
const WATT_TO_KW = 1 / 1_000;      // 1 000 W  → 1 kW
const KW_WATTS_THRESHOLD = 600;    // si > 600, on considère que c'est des watts
const PRICE_THOUSAND_THRESHOLD = 300; // < 300 → ×1 000 (39  => 39 000 €)

/** Formate le prix selon le pays (€, £) */
function formatPrice(raw: number, country: string) {
  return country === "United Kingdom"
    ? `£${raw.toLocaleString("en-GB")}`
    : `€${raw.toLocaleString("de-DE")}`;
}

/* ────────────────────────────────────
 * Router
 * ──────────────────────────────────*/
export const variantRouter = router({
  listPreview: publicProcedure
    .input(
      z
        .object({ limit: z.number().min(1).max(100).default(12) })
        .optional(),
    )
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
          prices: {
            where: {
              country: { in: ["Germany", "Netherlands", "United Kingdom"] },
            },
            orderBy: { country: "asc" }, // Germany < Netherlands < UK
          },
        },
      });

      return variants.map((v) => {
        /* ───── Puissance ───── */
        let kW = v.performanceSpec?.totalPowerKw
          ? Number(v.performanceSpec.totalPowerKw)
          : 0;

        // Si la valeur ressemble à des watts, convertis-la
        if (kW > KW_WATTS_THRESHOLD) kW *= WATT_TO_KW;

        const kWint = Math.round(kW);          // 208.283 -> 208
        const hp = kW ? Math.round(kW * 1.341) : null;

        /* ───── Prix ───── */
        const bestPriceRow = v.prices[0];
        let priceStr = "N/A";

        if (bestPriceRow?.price != null) {
          let raw = Number(bestPriceRow.price);

          // Heuristique : si le prix < 300, c'est sûrement “k€” → ×1 000
          if (raw < PRICE_THOUSAND_THRESHOLD) raw *= 1_000;

          priceStr = formatPrice(raw, bestPriceRow.country);
        }

        return {
          id: v.id,

          /* Titre */
          name: `${v.model.brand.name} ${v.model.name}`,
          trim: v.name,

          /* 4 infos clés */
          rangeKm: v.efficiencySpec?.rangeKm ?? null,
          powerKw: kWint || null,
          powerHp: hp,
          seats: v.dimensionSpec?.seats ?? null,
          dcChargeKmH: v.chargingSpec?.dcChargeSpeedKmH ?? null,

          /* Prix + méta */
          price: priceStr,
          priceCountry: bestPriceRow?.country ?? null,

          /* Assets UI */
          img: `/images/cars/${v.id}.webp`,
          score: 9.6,
          dealTag: "Amazing deal",
        };
      });
    }),
});
