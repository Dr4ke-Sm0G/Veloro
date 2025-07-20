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
import PageHeader from "@/components/layout/PageHeader";
import TechSpecsForm, { cleanSpecs } from "@/components/forms/TechSpecsForm";
import PricingForm from "@/components/forms/PricingForm";
import Link from "next/link";

// Define CarImage type for image handling, consistent with Prisma schema
interface CarImage {
  id: string;
  variantId: string;
  url: string; // Corrected: Assuming this is the direct URL string, not a JSON string.
  createdAt: Date;
  updatedAt: Date;
}

// TechSpecs interface for the form state (can be partial)
interface TechSpecs {
  performanceSpec?: Record<string, unknown>;
  efficiencySpec?: Record<string, unknown>;
  chargingSpec?: Record<string, unknown>;
  batterySpec?: Record<string, unknown>;
  dimensionSpec?: Record<string, unknown>;
  realConsumption?: Record<string, unknown>;
  v2xSpec?: Record<string, unknown>;
  safetyRating?: Record<string, unknown>;
}

interface Price {
  country: string;
  price: number;
}

export default function VariantCreatePage() {
  const router = useRouter();
  const params = useParams();
  const { brand, model } = params as { brand: string; model: string };

  const createVariant = api.admin.createVariant.useMutation();

  const [name, setName] = useState<string>("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [bodyType, setBodyType] = useState<string>("");
  const [slugPreview, setSlugPreview] = useState<string>("");
  const [techSpecs, setTechSpecs] = useState<TechSpecs>({});
  const [pricing, setPricing] = useState<Price[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]); // State for new images

  // Generate slug preview based on name
  useEffect(() => {
    if (name) {
      setSlugPreview(
        name
          .toLowerCase()
          .normalize("NFD") // Normalize Unicode characters
          .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
          .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
          .replace(/^-+|-+$/g, "") // Trim leading/trailing hyphens
          .replace(/--+/g, "-") // Replace multiple hyphens with single
      );
    } else {
      setSlugPreview(""); // Clear slug if name is empty
    }
  }, [name]);

  // Handle file input change for images
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const cleanedSpecs = cleanSpecs(techSpecs); // Clean tech specs before sending
      const payload = {
        brandSlug: brand,
        modelSlug: model,
        name,
        slug: slugPreview,
        year,
        bodyType,
        ...cleanedSpecs,
        prices: pricing.length > 0 ? pricing : undefined, // Only send prices if available
      };

      // Create the variant in the database
      const newVariant = await createVariant.mutateAsync(payload);
      toast.success("Nouvelle variante créée avec succès");

      // If images are selected, upload them after variant creation
      // Corrected: Access newVariant.variantId as per the inferred type
      if (newImages.length > 0 && newVariant?.variantId) {
        const form = new FormData();
        newImages.forEach(f => form.append('images', f));

        const res = await fetch(
          `/api/variants/${newVariant.variantId}/images`, // Use newVariant.variantId
          { method: 'POST', body: form }
        );

        if (!res.ok) {
          toast.error("Échec du téléversement des images.");
          console.error("Upload error:", await res.text());
          // Consider if you want to revert variant creation or just log error
        } else {
          toast.success("Images téléversées avec succès !");
          setNewImages([]); // Clear new images after successful upload
        }
      }

      router.push("/admin/catalogue"); // Redirect to catalogue after creation
    } catch (error) {
      toast.error("Erreur lors de la création de la variante");
      console.error("Erreur d'envoi:", error);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 min-h-screen rounded-lg shadow-inner">
      <PageHeader title="Ajouter une nouvelle variante" backLink="/admin/catalogue" />

      {/* Breadcrumb/Path Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 px-2">
        {brand} / {model} / nouvelle variante
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
            <TechSpecsForm specs={techSpecs} onSpecsChange={setTechSpecs} />
          </TabsContent>

          <TabsContent value="pricing" className="mt-6">
            <PricingForm prices={pricing} onPricesChange={setPricing} />
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <Card className="border-none shadow-none bg-transparent dark:bg-transparent">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Images</h3>

                {/* Add New Images Section */}
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

                {/* Note: The image upload button is integrated into the main form submission for this page.
                    If you want a separate upload button here, you'd need to handle the API call
                    for image upload separately, similar to the VariantEditPage.
                    For now, images will be uploaded as part of the variant creation. */}
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
                  Les images seront téléversées lorsque vous cliquerez sur Créer la variante.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 p-4 sm:p-0">
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
            disabled={createVariant.isPending}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
          >
            {createVariant.isPending ? "Création en cours..." : "Créer la variante"}
          </Button>
        </div>
      </form>
    </div>
  );
}
