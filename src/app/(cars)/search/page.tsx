"use client";

import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { useFilterStore } from "@/store/filter-store";
import CarCard from "@/components/cars/CarCard";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { keepPreviousData } from '@tanstack/react-query'; // Ajoutez cet import

export default function SearchPage() {
  const { filters } = useFilterStore();
  const [page, setPage] = useState(1);
  const limit = 10;

  // Utilisation de JSON.stringify pour un cache busting efficace si l'objet filters est complexe
  // ou mieux, utilisez un memo pour les filtres si la structure est stable
  const filterQueryParams = JSON.stringify(filters);

  const { data, isLoading, isFetching } = api.variant.filterVariants.useQuery(
    { ...filters, page, limit },
    {
      placeholderData: keepPreviousData,
    }
  );

  const [allVariants, setAllVariants] = useState<any[]>([]);

  useEffect(() => {
    if (data?.variants && data.variants.length > 0) {
      setAllVariants((prev) => (page === 1 ? data.variants : [...prev, ...data.variants]));
    } else if (page === 1 && !isLoading && !isFetching) {
      setAllVariants([]); // Aucune donnée après un chargement initial
    }
  }, [data?.variants, page, isLoading, isFetching]);

  useEffect(() => {
    setPage(1);
  }, [filterQueryParams]);

  const handleLoadMore = () => setPage((p) => p + 1);

  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* BOUTON FILTRES EN MOBILE */}
      <div className="md:hidden mb-4 flex justify-end">
        <Button
          onClick={() => setFilterOpen(true)}
          className="rounded-xl shadow-md text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M4 21v-7m0-4V3M12 21v-7m0-4V3M20 21v-7m0-4V3M1 14h6M9 10h6M17 14h6"></path>
          </svg>
          Filters
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Desktop */}
        <FilterSidebar />

        {/* Résultats */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {isLoading && page === 1 ? "Loading results..." : `${data?.total ?? allVariants.length} results`}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allVariants.length === 0 && !isLoading && !isFetching ? (
              <p className="col-span-full text-center text-gray-500">No cars found matching your criteria.</p>
            ) : (
              allVariants.map((variant) => (
                <CarCard key={variant.id} variant={variant} />
              ))
            )}
            {isLoading && page === 1 && (
                <div className="col-span-full text-center text-gray-500">Loading initial results...</div>
            )}
          </div>

          {data && allVariants.length < data.total && (
            <div className="mt-6 text-center">
              <Button onClick={handleLoadMore} disabled={isFetching} className="rounded-xl">
                {isFetching ? "Loading..." : "Load more"}
              </Button>
            </div>
          )}
          {isFetching && page > 1 && (
            <div className="mt-4 text-center text-gray-500">Loading more...</div>
          )}
        </div>
      </div>

      {/* DRAWER MOBILE (using Shadcn Sheet for better animation/UX) */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* fond semi‑transparent */}
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setFilterOpen(false)}
          />

          {/* panneau */}
          <aside className="w-3/4 max-w-xs bg-white dark:bg-gray-900 p-4 overflow-y-auto transform transition-transform ease-out duration-300 translate-x-0 md:translate-x-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={() => setFilterOpen(false)} aria-label="Close filters">
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