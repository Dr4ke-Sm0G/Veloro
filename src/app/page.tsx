"use client";

import { trpc } from "@/lib/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import CarCardSkeleton from "@/components/cars/CarCardSkeleton";

type RouterOutput = inferRouterOutputs<AppRouter>;
type ModelOutput = RouterOutput["model"]["getAll"][number];

export default function Home() {
  const { data = [], refetch } = trpc.model.getAll.useQuery();

  const create = trpc.model.createWithSpecs.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });


  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <CarCardSkeleton />
    </main>
  );
}
