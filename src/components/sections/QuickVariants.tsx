// src/components/QuickVariants.tsx

"use client";

import { trpc } from "@/lib/trpc";

export default function QuickVariants() {
  const { data: variants, isLoading } = trpc.variant.listPreview.useQuery({ limit: 6 });

  if (isLoading) return <p>Chargement...</p>;

  return (
    <section className="w-full bg-[#f9f9f9] py-6">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap gap-3 justify-center">
        {variants?.map((v) => (
          <a
            key={v.id}
            href={`/${v.brandName.toLowerCase()}/${v.modelName.toLowerCase()}/${v.trim.toLowerCase().replace(/\s+/g, "-")}`}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full bg-white text-sm text-gray-800 hover:bg-gray-100 transition"
          >
            <span className="w-5 h-5">{/* icône possible */}</span>
            {v.name} {v.trim}
          </a>
        ))}
      </div>
    </section>
  );
}
