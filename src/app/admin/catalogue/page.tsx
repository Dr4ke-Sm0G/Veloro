"use client";

import CatalogueTable from "../components/CatalogueTable";

export default function CataloguePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion du Catalogue</h1>
        {/* Tu pourras ajouter un bouton "Ajouter une voiture" ici */}
      </div>

      <CatalogueTable />
    </div>
  );
}
// Note: This page is for managing the catalogue of car variants.
// It includes a table that displays all car variants with their details.