// src/app/(cars)/[make]/[model]/[variant]/page.tsx

import { serverClient } from "@/lib/trpc/server"; // ou adapter si tu as un alias différent
import { notFound } from "next/navigation";

type Props = {
  params: {
    make: string;
    model: string;
    variant: string;
  };
};

export default async function VariantPage({ params }: Props) {
  const caller = await serverClient(); // 👈 très important
  const data = await caller.variant.getBySlugs({
    brand: params.make,
    model: params.model,
    variant: params.variant,
  });

  if (!data) return notFound(); // Renvoie la page 404

  const { model, batterySpec, performanceSpec, efficiencySpec, dimensionSpec, prices } = data;
  const brand = model.brand;

  const title = `${brand.name} ${model.name} ${data.name}`;
  const priceStr =
    prices?.[0]?.price != null
      ? `${prices[0].country === "United Kingdom" ? "£" : "€"}${Number(prices[0].price).toLocaleString()}`
      : "Non disponible";
  function toNumber(value?: any): number | undefined {
    if (!value) return undefined;
    if (typeof value === "number") return value;
    if (typeof value.toNumber === "function") return value.toNumber();
    return undefined;
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      <p className="text-gray-600 text-sm mb-8">
        Prix (approx.) : <span className="font-medium">{priceStr}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <h2 className="text-xl font-semibold mb-2">Spécifications principales</h2>
          <ul className="space-y-1">
            <li><strong>Batterie utile :</strong> {toNumber(batterySpec?.useableCapacity) ?? "—"} kWh</li>
            <li><strong>Autonomie réelle :</strong> {toNumber(performanceSpec?.electricRangeKm) ?? "—"} km</li>
            <li><strong>Puissance :</strong> {toNumber(performanceSpec?.totalPowerKw) ?? "—"} kW</li>
            <li><strong>Vitesse max :</strong> {performanceSpec?.topSpeedKmh ?? "—"} km/h</li>
            <li><strong>0–100 km/h :</strong> {toNumber(performanceSpec?.acceleration0100Sec) ?? "—"} s</li>

          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Consommation et dimensions</h2>
          <ul className="space-y-1">
            <li><strong>Consommation :</strong> {efficiencySpec?.vehicleConsumptionWhKm ?? "—"} Wh/km</li>
            <li><strong>Longueur :</strong> {dimensionSpec?.lengthMm ?? "—"} mm</li>
            <li><strong>Largeur :</strong> {dimensionSpec?.widthMm ?? "—"} mm</li>
            <li><strong>Empattement :</strong> {dimensionSpec?.wheelbaseMm ?? "—"} mm</li>
            <li><strong>Places :</strong> {dimensionSpec?.seats ?? "—"}</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
