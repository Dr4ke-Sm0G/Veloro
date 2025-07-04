import { trpc } from "@/lib/trpc";
import CarCard from "@/components/cars/CarCard";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

type VariantPreview = inferRouterOutputs<AppRouter>["variant"]["listPreview"][number];

export default function DealsSection() {
  const { data = [], isLoading } = trpc.variant.listPreview.useQuery({ limit: 3 });

  return (
    <section className="w-full bg-[#e9e7e4] py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-cyan-600 text-4xl">🔥</span>
            Big deals on wheels
          </h2>
          <p className="text-gray-700 mt-2 text-lg">
            Say hello to the hottest deals on the market
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {isLoading ? (
            <div className="col-span-full text-center text-gray-500 text-sm">
              Loading deals...
            </div>
          ) : (
            data.map((variant: VariantPreview) => (
              <CarCard key={variant.id} variant={variant} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
