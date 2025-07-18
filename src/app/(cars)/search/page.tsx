"use client";

import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { useFilterStore } from "@/store/filter-store";
import CarCard from "@/components/cars/CarCard";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function SearchPage() {
  const { filters } = useFilterStore();
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isFetching } = api.variant.filterVariants.useQuery(
    { ...filters, page, limit }
  );

  const [allVariants, setAllVariants] = useState<any[]>([]);
  useEffect(() => {
    if (data?.variants) {
      setAllVariants(prev => page === 1 ? data.variants : [...prev, ...data.variants]);
    }
  }, [data?.variants, page]);

  const handleLoadMore = () => setPage(p => p + 1);

  // État pour drawer mobile
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* BOUTON FILTRES EN MOBILE */}
      <div className="md:hidden mb-4 flex justify-end">
        <Button onClick={() => setFilterOpen(true)}>
          Filters
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Desktop */}
        <FilterSidebar />

        {/* Résultats */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">
            {isLoading ? "Loading results..." : `${data?.total ?? allVariants.length} results`}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allVariants.map(variant => (
              <CarCard key={variant.id} variant={variant} />
            ))}
          </div>

          {data && allVariants.length < data.total && (
            <div className="mt-6 text-center">
              <Button onClick={handleLoadMore} disabled={isFetching}>
                {isFetching ? "Loading..." : "Load more"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* DRAWER MOBILE */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* fond semi‑transparent */}
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setFilterOpen(false)}
          />

          {/* panneau */}
          <aside className="w-3/4 max-w-xs bg-white dark:bg-gray-900 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={() => setFilterOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <FilterSidebar inDrawer onApply={() => setFilterOpen(false)} />
          </aside>
        </div>
      )}
    </div>
  );
}
