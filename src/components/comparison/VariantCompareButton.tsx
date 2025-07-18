// src/components/comparison/VariantCompareButton.tsx
"use client";

import { useComparisonStore } from "@/store/comparison-store";

export default function VariantCompareButton({ variantId }: { variantId: string }) {
  const { selectedIds, addCar } = useComparisonStore();

  const alreadyAdded = selectedIds.includes(variantId);

  return (
    <button
      onClick={() => addCar(variantId)}
      disabled={alreadyAdded}
      className={`mt-4 w-full py-2 rounded-md text-sm font-semibold transition ${
        alreadyAdded
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-amber-500 hover:bg-amber-600 text-white"
      }`}
    >
      {alreadyAdded ? "Déjà dans le comparateur" : "Comparer cette voiture"}
    </button>
  );
}
