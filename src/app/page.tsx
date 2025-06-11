"use client";

import { trpc } from "@/lib/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

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
    <main className="p-6 space-y-4">
      <div>Hello Carwow 👋</div>
    </main>
  );
}
