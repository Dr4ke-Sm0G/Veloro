"use client";

import { trpc } from "@/lib/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

type Variant = inferRouterOutputs<AppRouter>["variant"]["listPreview"][number];

function slugify(str: string): string {
    return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}


export default function PopularVariants() {
    const { data = [], isLoading } = trpc.variant.listPreview.useQuery({
        limit: 20,
    });

    if (isLoading) return null;

    return (
        <section className="bg-[#e9e7e4] py-16">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-2xl font-bold mb-8 text-gray-900">
                    Popular car models
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-4 gap-x-6">
                    {data.map((variant: Variant) => (
                        <a
                            key={variant.id}
                            href={`/${slugify(variant.brandName)}/${variant.slug}`}
                            className="text-sm font-semibold text-gray-900 hover:underline"
                        >
                            {variant.brandName} {variant.modelName}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}