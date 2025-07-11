'use client';

import { useState } from "react";
import { api } from "@/utils/api";
import { useFilterStore } from "@/store/filter-store";
import CarCard from "@/components/cars/CarCard";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import React from "react";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const { filters } = useFilterStore();
  
  const [page, setPage] = useState(1);
  const limit = 10;
const { data, isLoading, isFetching } = api.variant.filterVariants.useQuery(
  { ...filters, page, limit }
);

  const [allVariants, setAllVariants] = useState<any[]>([]);
  
  // Append results as pages load
  React.useEffect(() => {
  if (data?.variants) {
    setAllVariants(prev => page === 1 ? data.variants : [...prev, ...data.variants]);
  }
}, [data?.variants, page]);


  const handleLoadMore = () => setPage(p => p + 1);
  
  return (
    <div className="flex max-w-7xl mx-auto px-4 py-6 gap-6">
      {/* Sidebar */}
      <FilterSidebar />

      {/* Results */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">
          {isLoading ? "Loading results..." : `${data?.total ?? allVariants.length} results`}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allVariants.map((variant) => (
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
  );
}