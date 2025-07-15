// admin/components/BrandFilters.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface BrandFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  minModelCount: number;
  setMinModelCount: (val: number) => void;
  minVariantCount: number;
  setMinVariantCount: (val: number) => void;
  variantYearMin: number;
  setVariantYearMin: (val: number) => void;
  onlyEmptyBrands: boolean;
  setOnlyEmptyBrands: (val: boolean) => void;
}

export default function BrandFilters({
  search,
  setSearch,
  minModelCount,
  setMinModelCount,
  minVariantCount,
  setMinVariantCount,
  variantYearMin,
  setVariantYearMin,
  onlyEmptyBrands,
  setOnlyEmptyBrands,
}: BrandFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex flex-col space-y-1">
        <Label htmlFor="search">Recherche</Label>
        <Input
          id="search"
          placeholder="Rechercher une marque ou un modèle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <Label htmlFor="min-models">Min modèles</Label>
        <Input
          id="min-models"
          type="number"
          min={0}
          value={minModelCount}
          onChange={(e) => setMinModelCount(Number(e.target.value))}
          className="w-32"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <Label htmlFor="min-variants">Min variantes</Label>
        <Input
          id="min-variants"
          type="number"
          min={0}
          value={minVariantCount}
          onChange={(e) => setMinVariantCount(Number(e.target.value))}
          className="w-36"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <Label htmlFor="min-year">Année min variant</Label>
        <Input
          id="min-year"
          type="number"
          min={0}
          value={variantYearMin}
          onChange={(e) => setVariantYearMin(Number(e.target.value))}
          className="w-36"
        />
      </div>

      <div className="flex items-center space-x-2 mt-5">
        <Checkbox
          id="empty-brands"
          checked={onlyEmptyBrands}
          onCheckedChange={(checked) => setOnlyEmptyBrands(!!checked)}
        />
        <Label htmlFor="empty-brands" className="text-sm">
          Seulement marques vides
        </Label>
      </div>
    </div>
  );
}
