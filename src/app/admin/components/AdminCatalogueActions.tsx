"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Upload, Filter, Pencil, Trash2 } from "lucide-react";

interface AdminCatalogueActionsProps {
  onAddVariant: (brand: string, model: string) => void; // Modifié pour accepter brand et model
  onImportJSON: (file: File) => void;
  onFilterChange: (filters: Record<string, string>) => void;
  filters: Record<string, string>;
}

export default function AdminCatalogueActions({
  onAddVariant,
  onImportJSON,
  onFilterChange,
  filters,
}: AdminCatalogueActionsProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
    }
  };

  const canAddVariant = !!filters.brand && !!filters.model; // Nouvelle vérification

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
      {/* Left side: Add + Import */}
      <div className="flex gap-2 items-center">
        <Button
          onClick={() => onAddVariant(filters.brand, filters.model)} // Appel modifié
          disabled={!canAddVariant} // Nouveau statut disabled
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Ajouter une variante
        </Button>

        <Input
          type="file"
          accept="application/json"
          onChange={handleFileChange}
          ref={fileRef}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" /> Import JSON
        </Button>
      </div>

      {/* Right side: Filters */}
      <div className="flex gap-2 flex-wrap items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Marque</label>
          <Input
            value={filters.brand || ""}
            onChange={(e) => onFilterChange({ ...filters, brand: e.target.value })}
            placeholder="Filtrer par marque"
            className="w-40"
          />
        </div>
        
        {/* Nouveau filtre modèle ajouté */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Modèle</label>
          <Input
            value={filters.model || ""}
            onChange={(e) => onFilterChange({ ...filters, model: e.target.value })}
            placeholder="Filtrer par modèle"
            className="w-40"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Année</label>
          <Input
            value={filters.year || ""}
            onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
            placeholder="Année min."
            className="w-32"
          />
        </div>
      </div>
    </div>
  );
}