// src/app/(cars)/[make]/[model]/[variant]/page.tsx
import { serverClient } from "@/lib/trpc/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import CarFeaturesSection from "@/components/sections/CarFeaturesSection";
import CarImageDisplay from "@/components/sections/CarImageDisplay";

type Props = {
  params: { make: string; variant: string };
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


export default async function VariantPage({
  params,
}: {
  params: Promise<{ make: string; variant: string }>;
}) {
  const { make, variant } = await params;

  const caller = await serverClient();
  const data = await caller.variant.getByBrandAndVariant({
    brand: make,
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
      ? `${prices[0].country === "United Kingdom" ? "£" : "€"}${Number(prices[0].price).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`
      : "Non disponible";
  return (
    <div className="bg-white text-black">
      <div className="max-w-7xl mx-auto px-6 py-6">


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

            <CarImageDisplay images={["byd.jpg", "byd.jpg", "byd.jpg"]} />
            {/* Prix */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-1">Indicative price</h2>
              <p className="text-2xl font-bold text-gray-800">
                {priceStr}
              </p>
              <p className="text-sm text-gray-500">Price shown for the country : {prices?.[0]?.country ?? "non précisé"}</p>
            </div>
            {/* Spécifications */}
            {/* Spécifications principales */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h2 className="text-xl font-semibold mb-2"> Key specifications</h2>
                <ul className="space-y-1">
                  <li><strong>Usable battery :</strong> {toNumber(batterySpec?.useableCapacity) ?? "—"} kWh</li>
                  <li><strong>Real-world range :</strong> {toNumber(performanceSpec?.electricRangeKm) ?? "—"} km</li>
                  <li><strong>Power :</strong> {toNumber(performanceSpec?.totalPowerKw) ?? "—"} kW</li>
                  <li><strong>Top speed :</strong> {performanceSpec?.topSpeedKmh ?? "—"} km/h</li>
                  <li><strong>0–100 km/h :</strong> {toNumber(performanceSpec?.acceleration0100Sec) ?? "—"} s</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Consumption and dimensions</h2>
                <ul className="space-y-1">
                  <li><strong>Consumption :</strong> {efficiencySpec?.vehicleConsumptionWhKm ?? "—"} Wh/km</li>
                  <li><strong>Length :</strong> {dimensionSpec?.lengthMm ?? "—"} mm</li>
                  <li><strong>Width :</strong> {dimensionSpec?.widthMm ?? "—"} mm</li>
                  <li><strong>Wheelbase :</strong> {dimensionSpec?.wheelbaseMm ?? "—"} mm</li>
                  <li><strong>Seats :</strong> {dimensionSpec?.seats ?? "—"}</li>
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
          <div className="w-full lg:w-96 mt-10">
            <div className="sticky top-25">
              <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
                {/* Header Dealer */}
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src="/BrandLogos/kia.svg"
                    alt="Dealer logo"
                    width={48}
                    height={48}
                    className="rounded-full border border-gray-300"
                  />
                  <div>
                    <div className="text-sm font-bold text-gray-900">Valero service</div>
                    <div className="text-sm text-gray-500">Valero service to buy {brand.name}</div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 text-xs mb-2">
                  <span className="inline-block px-2 py-0.5 border border-gray-400 rounded-full text-gray-800 text-xs font-medium">
                    Buy online
                  </span>
                  <span className="text-gray-500">Online broker</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500">No reviews</span>
                </div>

                {/* Contact Form */}
                <div className="bg-purple-50 p-4 rounded-lg mt-3">
                  <label
                    htmlFor="message_form"
                    className="block text-sm font-bold text-gray-800 mb-2"
                  >
                    Contact the dealer
                  </label>
                  <textarea
                    id="message_form"
                    rows={3}
                    defaultValue={`Hi, I'm interested in this ${title}. Is it still available?`}
                    className="w-full text-sm rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  ></textarea>
                </div>

                {/* Bouton */}
                <button className="mt-4 w-full bg-cyan-400 hover:bg-cyan-500 transition text-white font-semibold py-2 rounded-md text-sm">
                  Enquire now
                </button>

                {/* Note */}
                <p className="mt-3 text-sm text-green-600 flex items-center gap-2">
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
export async function generateMetadata({
  params,
}: {
  params: Promise<{ make: string;  variant: string }>;
}) {
  const { make, variant } = await params;
  return {
    title: `${make.toUpperCase()} ${variant} ${variant}`,
  };
}
