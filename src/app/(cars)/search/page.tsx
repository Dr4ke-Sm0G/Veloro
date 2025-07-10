'use client';

import { api } from "@/utils/api";
import { useFilterStore } from "@/store/filter-store";
import CarCard from "@/components/cars/CarCard";
import { FilterSidebar } from "@/components/filters/FilterSidebar";

export default function SearchPage() {
  const { filters } = useFilterStore();
  const { data: variants, isLoading } = api.variant.filterVariants.useQuery(filters);

  return (
    <div className="flex max-w-7xl mx-auto px-4 py-6 gap-6">
      {/* Sidebar */}
      <FilterSidebar />

      {/* Results */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">
          {isLoading ? "Loading results..." : `${variants?.length ?? 0} results`}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {variants?.map((variant) => (
            <CarCard key={variant.id} variant={variant} />
          ))}
        </div>
      </div>
    </div>
  );
}
