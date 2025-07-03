"use client";

import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc";
import CarCard from "@/components/cars/CarCard";

export default function BrandPage() {
  const { make } = useParams() as { make: string };

  const { data = [], isLoading, error } = trpc.variant.listByBrand.useQuery({
    make,
  });

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 capitalize">
          {make} cars
        </h1>

        {error && (
          <p className="text-red-600 font-semibold">Erreur : {error.message}</p>
        )}

        {isLoading ? (
          <p className="text-gray-600">Chargement des véhicules...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-600">Aucun véhicule trouvé pour cette marque.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((variant) => (
              <CarCard key={variant.id} variant={variant} className="h-[500px]" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
