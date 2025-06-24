"use client";

import { trpc } from "@/lib/trpc";            // client tRPC
import CarCard from "@/components/cars/CarCard";   // carte dynamique
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

/** Type d’un élément renvoyé par listPreview */
type VariantPreview =
  inferRouterOutputs<AppRouter>["variant"]["listPreview"][number];

export default function Home() {
  /* ────────────── tRPC : 7 voitures pour la grille ────────────── */
  const { data = [], isLoading } = trpc.variant.listPreview.useQuery({
    limit: 7,
  });

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Featured electric cars</h1>

      {isLoading ? (
        <p>Loading…</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((car: VariantPreview) => (
            <CarCard key={car.id} car={car} />
          ))}
        </ul>
      )}
    </main>
  );
}
