// src/app/(cars)/[make]/[model]/[variant]/page.tsx
import { serverClient } from "@/lib/trpc/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import CarFeaturesSection from "@/components/sections/CarFeaturesSection";

type Props = {
  params: { make: string; model: string; variant: string };
};
function toNumber(value?: any): number | undefined {
  if (!value) return undefined;
  if (typeof value === "number") return value;
  if (typeof value.toNumber === "function") return value.toNumber();
  return undefined;
}

function serializeDecimal(value: any): any {
  if (Array.isArray(value)) {
    return value.map(serializeDecimal);
  }

  if (value && typeof value === "object") {
    if (typeof value.toNumber === "function") {
      return value.toNumber(); // Prisma.Decimal
    }

    // Recurse inside object
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, serializeDecimal(val)])
    );
  }

  return value;
}


export default async function VariantPage({ params }: Props) {
  // 👉 on résout la Promise params AVANT de s’en servir
  
  const { make, model, variant } = await params;

  const caller = await serverClient();
  const data = await caller.variant.getBySlugs({
    brand: make,
    model,
    variant,
  });

  if (!data) return notFound();

const {
  model: modelData,
  batterySpec,
  chargingSpec,
  performanceSpec,
  efficiencySpec,
  realConsumption,
  dimensionSpec,
  safetyRating,
  v2xSpec,
  prices
} = data;

const brand = modelData.brand;

  const title = `${brand.name} ${modelData.name} ${data.name}`;
  const priceStr =
    prices?.[0]?.price != null
      ? `${prices[0].country === "United Kingdom" ? "£" : "€"}${Number(prices[0].price).toLocaleString()}`
      : "Non disponible";

  return (
    <div className="bg-white text-black">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <nav className="text-sm text-gray-500 mb-6">
          <span className="text-blue-600 font-semibold">{title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Colonne principale gauche */}
          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <span className="inline-block text-xs uppercase tracking-wide text-gray-500">Brand new - In-stock</span>
              <h1 className="text-3xl font-bold mt-1">
                <span className="block leading-tight">{brand.name} {modelData.name}</span>
                <span className="block text-lg font-medium text-gray-700">{data.name}</span>
              </h1>
            </div>

            {/* Galerie statique */}
            <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="col-span-1 md:col-span-1 flex flex-col gap-2">
                {["byd.jpg", "byd.jpg", "byd.jpg"].map((img, i) => (
                  <Image
                    key={i}
                    src={`/images/${img}`}
                    alt={`Thumbnail ${i}`}
                    width={104}
                    height={68}
                    className="rounded-lg border cursor-pointer"
                  />
                ))}
              </div>
              <div className="col-span-1 md:col-span-4">
                <Image
                  src="/images/byd.jpg"
                  alt="Main image"
                  width={800}
                  height={600}
                  className="rounded-xl border"
                />
              </div>
            </section>

            {/* Spécifications */}
            {/* Spécifications principales */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
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
            <CarFeaturesSection
  data={{
    batterySpec: serializeDecimal(batterySpec),
    chargingSpec: serializeDecimal(chargingSpec),
    performanceSpec: serializeDecimal(performanceSpec),
    efficiencySpec: serializeDecimal(efficiencySpec),
    realConsumption: serializeDecimal(realConsumption),
    dimensionSpec: serializeDecimal(dimensionSpec),
    safetyRating: serializeDecimal(safetyRating),
    v2xSpec: serializeDecimal(v2xSpec)
  }}
/>
          </div>


          {/* Colonne droite sticky */}
          <div className="w-full lg:w-96">
            <div className="sticky top-20">
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src="/dealers/default-avatar.jpg"
                    alt="Dealer logo"
                    width={48}
                    height={48}
                    className="rounded-full border"
                  />
                  <div>
                    <div className="font-semibold">Carwow Leasey</div>
                    <div className="text-sm text-gray-500">{brand.name} Partner</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mb-2">Online broker</div>
                <label className="block text-sm font-medium mb-1" htmlFor="message_form">
                  Contact the dealer
                </label>
                <textarea
                  name="message_form"
                  id="message_form"
                  rows={3}
                  defaultValue={`Hi, I'm interested in this ${title}. Is it still available?`}
                  className="w-full border rounded p-2 text-sm"
                ></textarea>
                <button className="mt-3 w-full bg-blue-600 text-white font-semibold py-2 rounded">
                  Enquire now
                </button>
                <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 1,0 22,12A10,10 0 0,0 12,2M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8" />
                  </svg>
                  Fast and free with no obligation
                </p>
              </div>
            </div>
            
          </div>
          
        </div>

      </div>
      
    </div>
    
  );
  
}

/* même principe pour generateMetadata si tu l’utilises */
export async function generateMetadata({ params }: Props) {
  const { make, model } = await params;
  return { title: `${make.toUpperCase()} ${model}` };
}
