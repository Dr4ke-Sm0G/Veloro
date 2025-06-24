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
    <div className="max-w-screen-xl mx-auto px-4 pt-[100px] pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CarCardSkeleton />
        <CarCardSkeleton />
        <CarCardSkeleton />
        <CarCardSkeleton />
      </div>
    </div>
      
    </main>
  );
}
