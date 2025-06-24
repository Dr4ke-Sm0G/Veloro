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
    <main className="container mx-auto py-20 px-4">
      <h1 className="text-2xl font-bold mb-6">Featured electric cars</h1>
    </main>
  );
}
