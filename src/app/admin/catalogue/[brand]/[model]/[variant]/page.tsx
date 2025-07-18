'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PageHeader from "@/components/layout/PageHeader"; // Assuming this handles its own responsiveness
import TechSpecsForm from "@/components/forms/TechSpecsForm"; // This component should also be made responsive internally
import PricingForm from "@/components/forms/PricingForm";   // This component should also be made responsive internally
import Link from "next/link";
import { cleanSpecs } from "@/components/forms/TechSpecsForm"; // Assuming this utility is correctly imported
import { CarImage } from "@prisma/client"; // Import CarImage type

// 🔧 Types for nested Prisma models (based on your schema)
// Note: Decimal types from Prisma are often handled as 'string' or 'number' in JS/TS
// depending on your Prisma client configuration. Using 'number | string' for flexibility.

interface BatterySpec {
  id: string;
  variantId: string;
  nominalCapacity?: number | string | null; // kWh
  useableCapacity?: number | string | null; // kWh
  batteryType?: string | null;
  architecture?: string | null; // "400 V" / "800 V"
  cathodeMaterial?: string | null;
  packConfiguration?: string | null;
  nominalVoltage?: number | string | null;
  formFactor?: string | null;
  warrantyPeriod?: string | null;
  warrantyMileage?: string | null;
}

interface ChargingSpec {
  id: string;
  variantId: string;
  acPortType?: string | null;
  acPowerKW?: number | string | null;
  acChargeTime?: string | null; // formatted string "9h45m"
  acChargeSpeedKmH?: number | null;
  dcPortType?: string | null;
  dcMaxPowerKW?: number | string | null;
  dcPower10to80KW?: number | string | null;
  dcChargeSpeedKmH?: number | null;
  portLocation?: string | null;
  autochargeSupported?: boolean | null;
  plugAndChargeSupported?: boolean | null;
  iso15118Supported?: boolean | null;
  preconditioningPossible?: boolean | null;
  preconditioningNav?: boolean | null;
}

interface PerformanceSpec {
  id: string;
  variantId: string;
  acceleration0100Sec?: number | string | null;
  topSpeedKmh?: number | null;
  electricRangeKm?: number | null;
  totalPowerKw?: number | string | null;
  totalTorqueNm?: number | string | null;
  drive?: string | null;
}

interface EfficiencySpec {
  id: string;
  variantId: string;
  rangeKm?: number | null;
  vehicleConsumptionWhKm?: number | null;
  ratedConsumptionWhKm?: number | null;
  vehicleFuelEqL100km?: number | string | null;
  ratedFuelEqL100km?: number | string | null;
  co2EmissionsGKm?: number | null;
}

interface RealConsumptionSpec {
  id: string;
  variantId: string;
  cityColdWhKm?: number | null;
  highwayColdWhKm?: number | null;
  combinedColdWhKm?: number | null;
  cityMildWhKm?: number | null;
  highwayMildWhKm?: number | null;
  combinedMildWhKm?: number | null;
}

interface DimensionSpec {
  id: string;
  variantId: string;
  lengthMm?: number | null;
  widthMm?: number | null;
  widthWithMirrorsMm?: number | null;
  heightMm?: number | null;
  wheelbaseMm?: number | null;
  weightUnladenKg?: number | null;
  grossVehicleWeightKg?: number | null;
  maxPayloadKg?: number | null;
  cargoVolumeL?: number | null;
  cargoVolumeMaxL?: number | null;
  frunkVolumeL?: number | null;
  roofLoadKg?: number | null;
  towHitchPossible?: boolean | null;
  towingWeightUnbrakedKg?: number | null;
  towingWeightBrakedKg?: number | null;
  verticalLoadMaxKg?: number | null;
  seats?: number | null;
  isofix?: boolean | null;
  turningCircleM?: number | string | null;
  platform?: string | null;
  evDedicatedPlatform?: boolean | null;
  carBody?: string | null;
  segment?: string | null;
  roofRails?: boolean | null;
  heatPump?: boolean | null;
}

interface SafetyRating {
  id: string;
  variantId: string;
  ratingYear?: number | null;
  adultOccupantPercent?: number | null;
  childOccupantPercent?: number | null;
  vulnerableRoadUsersPct?: number | null;
  safetyAssistPercent?: number | null;
}

interface V2XSpec {
  id: string;
  variantId: string;
  v2lSupported?: boolean | null;
  exteriorOutlet?: string | null;
  interiorOutlet?: string | null;
  v2hAcSupported?: boolean | null;
  v2hDcSupported?: boolean | null;
  v2gAcSupported?: boolean | null;
  v2gDcSupported?: boolean | null;
}

interface Availability {
  id: string;
  variantId: string;
  availableFrom?: Date | null;
  availableTo?: Date | null;
}

// TechSpecs interface for the form state (can be partial)
interface TechSpecs {
  performanceSpec?: PerformanceSpec | Record<string, unknown>;
  efficiencySpec?: EfficiencySpec | Record<string, unknown>;
  chargingSpec?: ChargingSpec | Record<string, unknown>;
  batterySpec?: BatterySpec | Record<string, unknown>;
  dimensionSpec?: DimensionSpec | Record<string, unknown>;
  realConsumption?: RealConsumptionSpec | Record<string, unknown>;
  v2xSpec?: V2XSpec | Record<string, unknown>;
  safetyRating?: SafetyRating | Record<string, unknown>;
}

interface Price {
  country: string;
  price: number;
}

// Define the expected structure of variantData returned from the API query
interface VariantData {
  id: string;
  name: string;
  slug: string;
  year?: number | null;
  bodyType?: string | null;
  model: {
    name: string;
    brand: {
      name: string;
    };
  };
  performanceSpec?: PerformanceSpec | null;
  efficiencySpec?: EfficiencySpec | null;
  chargingSpec?: ChargingSpec | null;
  batterySpec?: BatterySpec | null;
  dimensionSpec?: DimensionSpec | null;
  realConsumption?: RealConsumptionSpec | null;
  v2xSpec?: V2XSpec | null;
  safetyRating?: SafetyRating | null;
  availability?: Availability | null;
  prices: { country: string; price: number | string }[];
  images: CarImage[];
}


export default function VariantEditPage() {
  const router = useRouter();
  const params = useParams();
  const { brand, model, variant } = params as {
    brand: string;
    model: string;
    variant: string;
  };

  const { data: variantData, isLoading } = api.variant.getBySlugs.useQuery(
    { brand, model, variant },
    { enabled: !!brand && !!model && !!variant }
  );

  const updateVariant = api.admin.updateVariant.useMutation();

  const [existingImages, setExistingImages] = useState<CarImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    if (variantData) {
      setExistingImages(variantData.images || []);
    }
  }, [variantData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const [name, setName] = useState<string>("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [bodyType, setBodyType] = useState<string>("");
  const [slugPreview, setSlugPreview] = useState<string>("");
  const [techSpecs, setTechSpecs] = useState<TechSpecs>({});
  const [pricing, setPricing] = useState<Price[]>([]);

  useEffect(() => {
    if (variantData) {
      setName(variantData.name ?? "");
      setYear(variantData.year ?? new Date().getFullYear());
      setBodyType(variantData.bodyType ?? "");
      setSlugPreview(variantData.slug ?? "");

      setTechSpecs({
        performanceSpec: variantData.performanceSpec ?? {},
        efficiencySpec: variantData.efficiencySpec ?? {},
        chargingSpec: variantData.chargingSpec ?? {},
        batterySpec: variantData.batterySpec ?? {},
        dimensionSpec: variantData.dimensionSpec ?? {},
        realConsumption: variantData.realConsumption ?? {},
        v2xSpec: variantData.v2xSpec ?? {},
        safetyRating: variantData.safetyRating ?? {},
      });

      setPricing(
        (variantData.prices ?? []).map((p) => ({
          country: p.country,
          price: Number(p.price),
        }))
      );
    }
  }, [variantData]);

  useEffect(() => {
    if (name) {
      setSlugPreview(
        name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .replace(/--+/g, "-")
      );
    }
  }, [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!variantData?.id) {
      toast.error("Aucun ID de variante trouvé");
      return;
    }

    try {
      const cleanedSpecs = cleanSpecs(techSpecs);
      const payload = {
        variantId: variantData.id,
        name,
        slug: slugPreview,
        year,
        bodyType,
        ...cleanedSpecs,
        prices: pricing.length > 0 ? pricing : undefined,
      };

      await updateVariant.mutateAsync(payload);
      toast.success("Modifications enregistrées avec succès");
      router.push("/admin/catalogue");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la variante");
      console.error("Erreur détaillée:", error);
    }
  };

  if (isLoading || !variantData) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <PageHeader title="Modifier la variante" backLink="/admin/catalogue" />
        <div className="space-y-4 mt-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /> {/* Placeholder for forms */}
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /> {/* Placeholder for media */}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 min-h-screen rounded-lg shadow-inner">
      <PageHeader title="Modifier la variante" backLink="/admin/catalogue" />

      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 px-2">
        {variantData.model.brand.name} / {variantData.model.name} / {variantData.name}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-md"
      >
        <Tabs defaultValue="basic" className="w-full">
          {/* TabsList: Responsive for mobile */}
          <TabsList className="flex flex-wrap h-auto p-1 gap-1 justify-center sm:justify-start bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
            <TabsTrigger
              value="basic"
              className="flex-1 sm:flex-auto data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-blue-700 dark:data-[state=active]:text-white text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded-md py-2 px-3 text-sm font-medium"
            >
              Informations de base
            </TabsTrigger>
            <TabsTrigger
              value="tech"
              className="flex-1 sm:flex-auto data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-blue-700 dark:data-[state=active]:text-white text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded-md py-2 px-3 text-sm font-medium"
            >
              Spécifications techniques
            </TabsTrigger>
            <TabsTrigger
              value="pricing"
              className="flex-1 sm:flex-auto data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-blue-700 dark:data-[state=active]:text-white text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded-md py-2 px-3 text-sm font-medium"
            >
              Prix & Disponibilité
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="flex-1 sm:flex-auto data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-blue-700 dark:data-[state=active]:text-white text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded-md py-2 px-3 text-sm font-medium"
            >
              Médias
            </TabsTrigger>
          </TabsList>

          {/* Tabs Content */}
          <TabsContent value="basic" className="mt-6">
            <Card className="border-none shadow-none bg-transparent dark:bg-transparent">
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 mb-1 block">Nom</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    aria-label="Variant name"
                  />
                </div>
                <div>
                  <Label htmlFor="slug-preview" className="text-gray-700 dark:text-gray-300 mb-1 block">Slug (auto)</Label>
                  <Input
                    id="slug-preview"
                    value={slugPreview}
                    disabled
                    className="w-full border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed rounded-md"
                    aria-label="Auto-generated slug"
                  />
                </div>
                <div>
                  <Label htmlFor="year" className="text-gray-700 dark:text-gray-300 mb-1 block">Année</Label>
                  <Input
                    id="year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    aria-label="Variant year"
                  />
                </div>
                <div>
                  <Label htmlFor="body-type" className="text-gray-700 dark:text-gray-300 mb-1 block">Type de carrosserie</Label>
                  <Input
                    id="body-type"
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value)}
                    className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    aria-label="Body type"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tech" className="mt-6">
            {/* TechSpecsForm should be made responsive internally */}
            <TechSpecsForm specs={techSpecs} onSpecsChange={setTechSpecs} />
          </TabsContent>

          <TabsContent value="pricing" className="mt-6">
            {/* PricingForm should be made responsive internally */}
            <PricingForm prices={pricing} onPricesChange={setPricing} />
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <Card className="border-none shadow-none bg-transparent dark:bg-transparent">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Images</h3>

                {/* Existing Images */}
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Images existantes</Label>
                <div className="flex flex-wrap gap-4 my-2">
                  {existingImages.length > 0 ? (
                    existingImages.map(img => (
                      <img
                        key={img.id}
                        src={JSON.parse(img.url).thumbnail}
                        alt={`Existing image ${img.id}`}
                        className="h-24 w-24 rounded-lg object-cover shadow-sm border border-gray-200 dark:border-gray-700"
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Aucune image existante.</p>
                  )}
                </div>

                {/* Add New Images */}
                <Label htmlFor="new-images-upload" className="mt-6 text-gray-700 dark:text-gray-300 mb-2 block">Ajouter des images</Label>
                <Input
                  id="new-images-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 file:bg-blue-500 file:text-white file:border-none file:rounded-md file:px-4 file:py-2 file:mr-4 file:cursor-pointer hover:file:bg-blue-600 dark:file:bg-blue-700 dark:hover:file:bg-blue-800 rounded-md"
                  aria-label="Upload new images"
                />
                <div className="flex flex-wrap gap-4 my-4">
                  {newImages.length > 0 ? (
                    newImages.map((file, i) => (
                      <img
                        key={i}
                        src={URL.createObjectURL(file)}
                        alt={`New image preview ${i}`}
                        className="h-24 w-24 rounded-lg opacity-80 object-cover shadow-sm border border-gray-200 dark:border-gray-700"
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Aucune nouvelle image sélectionnée.</p>
                  )}
                </div>

                <Button
                  onClick={async () => {
                    if (!variantData?.id || newImages.length === 0) {
                      toast.error("Aucun ID de variante trouvé ou aucune nouvelle image sélectionnée.");
                      return;
                    }
                    const form = new FormData();
                    newImages.forEach(f => form.append('images', f));

                    const res = await fetch(
                      `/api/variants/${variantData.id}/images`,
                      { method: 'POST', body: form }
                    );

                    if (!res.ok) {
                      toast.error("Échec du téléversement des images.");
                      console.error("Upload error:", await res.text());
                      return;
                    }

                    const uploaded: CarImage[] = await res.json();
                    setExistingImages(prev => [...prev, ...uploaded]);
                    setNewImages([]);
                    toast.success("Images téléversées avec succès !");
                  }}
                  disabled={newImages.length === 0}
                  className="mt-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
                >
                  Téléverser les nouvelles images
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 p-4 sm:p-0"> {/* Added padding for mobile */}
          <Link href="/admin/catalogue">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Annuler
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={updateVariant.isPending}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
          >
            {updateVariant.isPending
              ? "Enregistrement..."
              : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </div>
  );
}
