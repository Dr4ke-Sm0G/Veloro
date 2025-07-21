"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/utils/api";
import ComparisonTable from "@/components/cars/ComparisonTable";
import CarSelectCombobox from "@/components/cars/CarSelectCombobox";

function CompareContent() {
  const searchParams = useSearchParams();
  const idsFromUrl = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];

  const [selectedIds, setSelectedIds] = useState<string[]>(idsFromUrl);

  const { data: allPreviews, isLoading: loadingPreviews } =
    api.variant.listPreview.useQuery({ limit: 100 });

  const { data: variants, isLoading: loadingVariants } =
    api.variant.getVariantsByIds.useQuery(
      { ids: selectedIds },
      { enabled: selectedIds.length > 0 }
    );

  const options =
    allPreviews?.map((v) => ({
      value: v.id,
      label: `${v.brandName} ${v.trim}`,
    })) ?? [];

  // Si l'URL change, on recharge les IDs (utile pour bouton "Comparer")
  useEffect(() => {
    if (idsFromUrl.length > 0) setSelectedIds(idsFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);               // searchParams is stable; fine for Next

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Car comparison</h1>

      <div className="flex flex-col md:flex-row gap-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="w-full md:w-1/3">
            <CarSelectCombobox
              options={options}
              value={selectedIds[idx]}
              onChange={(value) => {
                const next = [...selectedIds];
                next[idx] = value;
                setSelectedIds(next.filter(Boolean));
              }}
              placeholder={`Sélection ${idx + 1}`}
            />
          </div>
        ))}
      </div>

      {(loadingPreviews || loadingVariants) && (
        <div className="text-center py-12">Loading…</div>
      )}

      {variants && variants.length > 0 && (
        <ComparisonTable variants={variants} />
      )}
    </div>
  );
}
export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <CompareContent />
    </Suspense>
  );
}