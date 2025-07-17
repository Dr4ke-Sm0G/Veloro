"use client";

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

  useEffect(() => {
    if (name) {
      setSlugPreview(
        name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
      );
    }
  }, [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const cleanedSpecs = cleanSpecs(techSpecs);
      const payload = {
        brandSlug: brand,
        modelSlug: model,
        name,
        slug: slugPreview,
        year,
        bodyType,
        ...cleanedSpecs,
        prices: pricing.length > 0 ? pricing : undefined,
      };

      await createVariant.mutateAsync(payload);
      toast.success("Nouvelle variante créée avec succès");
      router.push("/admin/catalogue");
    } catch (error) {
      toast.error("Erreur lors de la création de la variante");
      console.error("Erreur d'envoi:", error);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-10 px-4">
      <PageHeader title="Ajouter une nouvelle variante" backLink="/admin/catalogue" />

      <div className="text-sm text-muted-foreground mb-4">
        {brand} / {model} / nouvelle variante
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-xl shadow-md"
      >
        <Tabs defaultValue="basic">
          <TabsList>
            <TabsTrigger value="basic">Informations de base</TabsTrigger>
            <TabsTrigger value="tech">Spécifications techniques</TabsTrigger>
            <TabsTrigger value="pricing">Prix & Disponibilité</TabsTrigger>
            <TabsTrigger value="media">Médias</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                <div>
                  <Label>Nom</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label>Slug (auto)</Label>
                  <Input value={slugPreview} disabled />
                </div>
                <div>
                  <Label>Année</Label>
                  <Input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Type de carrosserie</Label>
                  <Input
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tech">
            <TechSpecsForm specs={techSpecs} onSpecsChange={setTechSpecs} />
          </TabsContent>

          <TabsContent value="pricing">
            <PricingForm prices={pricing} onPricesChange={setPricing} />
          </TabsContent>

          <TabsContent value="media">
            <Card>
              <CardContent className="p-6">
                <Label>Téléversement d'image (non implémenté)</Label>
                <Input type="file" disabled />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Link href="/admin/catalogue">
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </Link>
          <Button type="submit" disabled={createVariant.isPending}>
            {createVariant.isPending ? "Création en cours..." : "Créer la variante"}
          </Button>
        </div>
      </form>
    </div>
  );
}
