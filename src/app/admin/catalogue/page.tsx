/*
✅ CataloguePage.tsx - Admin
Ajout de marque, modèle, variant via modale + filtres, recherche, édition, suppression
*/

"use client";

import { useState } from "react";
import Image from "next/image";
import { api } from "@/utils/api";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function CataloguePage() {
  const utils = api.useUtils();
  const { data: brands, isPending } = api.admin.getBrandsWithModels.useQuery();
  const updateModel = api.admin.updateModel.useMutation({ onSuccess: () => utils.admin.getBrandsWithModels.invalidate() });
  const updateVariant = api.admin.updateVariant.useMutation({ onSuccess: () => utils.admin.getBrandsWithModels.invalidate() });
  const deleteModel = api.admin.deleteModel.useMutation({ onSuccess: () => utils.admin.getBrandsWithModels.invalidate() });
  const deleteBrand = api.admin.deleteBrand.useMutation({ onSuccess: () => utils.admin.getBrandsWithModels.invalidate() });
  const deleteVariant = api.admin.deleteVariant.useMutation({ onSuccess: () => utils.admin.getBrandsWithModels.invalidate() });

  // Dialog states for delete confirmation
  const [dialogDeleteBrandId, setDialogDeleteBrandId] = useState<string | null>(null);
  const [dialogDeleteModelId, setDialogDeleteModelId] = useState<string | null>(null);
  const [dialogDeleteVariantId, setDialogDeleteVariantId] = useState<string | null>(null);

  // Edition states
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  const [editingModelName, setEditingModelName] = useState("");
  const [editingModelSlug, setEditingModelSlug] = useState("");
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [editingVariantYear, setEditingVariantYear] = useState<number>(2025);
  const [editingVariantSlug, setEditingVariantSlug] = useState("");

  // Filtres et recherche
  const [search, setSearch] = useState("");
  const [minModelCount, setMinModelCount] = useState(0);
  const [minVariantCount, setMinVariantCount] = useState(0);
  const [variantYearMin, setVariantYearMin] = useState(0);
  const [onlyEmptyBrands, setOnlyEmptyBrands] = useState(false);

  // Ajout de marque, modèle, variante (à compléter selon besoin)
  // ...

  // Filtrage des marques
  const filteredBrands = brands?.filter((brand) => {
    const modelNames = brand.models.map((m) => m.name.toLowerCase()).join(" ");
    const matchesSearch = brand.name.toLowerCase().includes(search.toLowerCase()) || modelNames.includes(search.toLowerCase());

    const modelCount = brand.models.length;
    const variantCount = brand.models.reduce((total, m) => total + (m._count?.variants || 0), 0);
    const mostRecentVariantYear = brand.models.reduce((latest, model) => {
      const variantYears = model.variants?.map((v) => v.year ?? 0) ?? [];
      const modelMax = Math.max(...variantYears, 0);
      return Math.max(latest, modelMax);
    }, 0);

    const matchesEmpty = onlyEmptyBrands ? modelCount === 0 : true;
    const matchesModelCount = modelCount >= minModelCount;
    const matchesVariantCount = variantCount >= minVariantCount;
    const matchesVariantYear = variantYearMin ? mostRecentVariantYear >= variantYearMin : true;

    return matchesSearch && matchesEmpty && matchesModelCount && matchesVariantCount && matchesVariantYear;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion du Catalogue</h1>
        {/* Ajout Marque ici si besoin */}
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 items-end">
        <Input placeholder="🔎 Rechercher une marque ou un modèle..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
        <Input type="number" min={0} value={minModelCount} onChange={(e) => setMinModelCount(Number(e.target.value))} className="w-32" placeholder="Min modèles" />
        <Input type="number" min={0} value={minVariantCount} onChange={(e) => setMinVariantCount(Number(e.target.value))} className="w-36" placeholder="Min variantes" />
        <Input type="number" min={0} value={variantYearMin} onChange={(e) => setVariantYearMin(Number(e.target.value))} className="w-36" placeholder="Année min variant" />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={onlyEmptyBrands} onChange={(e) => setOnlyEmptyBrands(e.target.checked)} />
          <span className="text-sm">Seulement marques vides</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredBrands?.map((brand) => (
          <Card key={brand.id} className="border border-gray-200 rounded-xl">
            <CardHeader className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                {brand.logo ? (
                  <Image src={`/logos/${brand.logo}`} alt={brand.name} width={40} height={40} className="rounded" />
                ) : <div className="w-10 h-10 bg-gray-200 rounded" />}
                <CardTitle>{brand.name}</CardTitle>
              </div>
              {brand.models.length === 0 && (
                <Dialog open={dialogDeleteBrandId === brand.id} onOpenChange={(open) => setDialogDeleteBrandId(open ? brand.id : null)}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">🗑️</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Supprimer la marque "{brand.name}" ?</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setDialogDeleteBrandId(null)}>Annuler</Button>
                      <Button variant="destructive" onClick={() => {
                        deleteBrand.mutate({ brandId: brand.id });
                        setDialogDeleteBrandId(null);
                      }}>Confirmer</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>

            <CardContent className="space-y-2">
              {brand.models.length > 0 ? (
                brand.models.map((model) => (
                  <div key={model.id} className="space-y-1">
                    {editingModelId === model.id ? (
                      <div className="flex gap-2">
                        <Input value={editingModelName} onChange={(e) => setEditingModelName(e.target.value)} className="w-1/2" />
                        <Input value={editingModelSlug} onChange={(e) => setEditingModelSlug(e.target.value)} className="w-1/3" />
                        <Button size="sm" onClick={() => {
                          updateModel.mutate({ modelId: model.id, name: editingModelName, slug: editingModelSlug });
                          setEditingModelId(null);
                        }}>💾</Button>
                        <Dialog open={dialogDeleteModelId === model.id} onOpenChange={(open) => setDialogDeleteModelId(open ? model.id : null)}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="destructive">🗑️</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Supprimer le modèle "{model.name}" ?</DialogTitle></DialogHeader>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setDialogDeleteModelId(null)}>Annuler</Button>
                              <Button variant="destructive" onClick={() => {
                                deleteModel.mutate({ modelId: model.id });
                                setDialogDeleteModelId(null);
                              }}>Confirmer</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{model.name}</Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => {
                            setEditingModelId(model.id);
                            setEditingModelName(model.name);
                            setEditingModelSlug(model.slug || "");
                          }}>✏️</Button>
                        </div>
                      </div>
                    )}

                    {model.variants?.map((variant) => (
                      <div key={variant.id} className="ml-4 flex gap-2 items-center">
                        {editingVariantId === variant.id ? (
                          <>
                            <Input type="number" value={editingVariantYear} onChange={(e) => setEditingVariantYear(parseInt(e.target.value))} className="w-24" />
                            <Input value={editingVariantSlug} onChange={(e) => setEditingVariantSlug(e.target.value)} className="w-40" />
                            <Button size="sm" onClick={() => {
                              updateVariant.mutate({ variantId: variant.id, year: editingVariantYear, slug: editingVariantSlug });
                              setEditingVariantId(null);
                            }}>💾</Button>
                            {!variant.hasListings && (
                              <Dialog open={dialogDeleteVariantId === variant.id} onOpenChange={(open) => setDialogDeleteVariantId(open ? variant.id : null)}>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="destructive">🗑️</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader><DialogTitle>Supprimer la variante "{variant.name}" ?</DialogTitle></DialogHeader>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setDialogDeleteVariantId(null)}>Annuler</Button>
                                    <Button variant="destructive" onClick={() => {
                                      deleteVariant.mutate({ variantId: variant.id });
                                      setDialogDeleteVariantId(null);
                                    }}>Confirmer</Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-gray-600">{variant.name} - {variant.year ?? "—"}</span>
                            <Button size="sm" variant="ghost" onClick={() => {
                              setEditingVariantId(variant.id);
                              setEditingVariantYear(variant.year ?? 2025);
                              setEditingVariantSlug(variant.slug || "");
                            }}>✏️</Button>
                            {!variant.hasListings && (
                              <Dialog open={dialogDeleteVariantId === variant.id} onOpenChange={(open) => setDialogDeleteVariantId(open ? variant.id : null)}>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="destructive">🗑️</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader><DialogTitle>Supprimer la variante "{variant.name}" ?</DialogTitle></DialogHeader>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setDialogDeleteVariantId(null)}>Annuler</Button>
                                    <Button variant="destructive" onClick={() => {
                                      deleteVariant.mutate({ variantId: variant.id });
                                      setDialogDeleteVariantId(null);
                                    }}>Confirmer</Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              ) : <p className="text-gray-400">Aucun modèle</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
