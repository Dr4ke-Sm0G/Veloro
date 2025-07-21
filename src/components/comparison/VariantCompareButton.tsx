// src/components/comparison/VariantCompareButton.tsx
"use client";

import { useComparisonStore } from "@/store/comparison-store";
import { Columns, Check, Plus } from "lucide-react";

interface VariantCompareButtonProps {
  variantId: string;

}

export default function VariantCompareButton({ variantId }: VariantCompareButtonProps) {
  const { selectedIds, addCar } = useComparisonStore();

  const alreadyAdded = selectedIds.includes(variantId);
  const comparisonLimitReached = selectedIds.length >= 3; 

  const isDisabled = alreadyAdded || comparisonLimitReached;

  let buttonText = "Compare this car";
  let buttonIcon = <Columns size={16} className="mr-1.5" />; 

  if (alreadyAdded) {
    buttonText = "Added to comparison";
    buttonIcon = <Check size={16} className="mr-1.5" />;
  } else if (comparisonLimitReached) {
    buttonText = "Comparison full"; 
    buttonIcon = <Columns size={16} className="mr-1.5" />;
  } else {
    buttonIcon = <Plus size={16} className="mr-1.5" />;
  }

  return (
    <button
      onClick={() => !isDisabled && addCar(variantId)}
      disabled={isDisabled}
      className={`
        mt-4 py-1.5 px-3 rounded-lg text-sm font-semibold
        flex items-center justify-center whitespace-nowrap
        transition-all duration-200 ease-in-out
        w-auto max-w-xs mx-auto

        ${isDisabled
          ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-inner"
          : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        }
      `}
    >
      {buttonIcon}
      <span>{buttonText}</span>
    </button>
  );
}