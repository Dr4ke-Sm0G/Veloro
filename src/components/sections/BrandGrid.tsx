"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Link from "next/link";

const brands = [
  { name: "Abarth", slug: "abarth" },
  { name: "Alfa Romeo", slug: "alfaromeo" },
  { name: "Alpine", slug: "alpine" },
  { name: "Aston Martin", slug: "astonmartin" },
  { name: "Audi", slug: "audi" },
  { name: "Bentley", slug: "bentley" },
  { name: "BMW", slug: "bmw" },
  { name: "BYD", slug: "byd" },
  { name: "Citroen", slug: "citroen" },
  { name: "Cupra", slug: "cupra" },
  { name: "Dacia", slug: "dacia" },
  { name: "DS", slug: "ds" },
  { name: "Ferrari", slug: "ferrari" },
  { name: "Fiat", slug: "fiat" },
  { name: "Ford", slug: "ford" },
  { name: "Genesis", slug: "genesis" },
  { name: "GWM", slug: "gwm" },
  { name: "GWM Ora", slug: "gwmora" },
  { name: "Honda", slug: "honda" },
  { name: "Hyundai", slug: "hyundai" },
  { name: "INEOS", slug: "ineos" },
  { name: "Infiniti", slug: "infiniti" },
  { name: "Jaecoo", slug: "jaecoo" },
  { name: "Jaguar", slug: "jaguar" },
  { name: "Jeep", slug: "jeep" },
  { name: "KGM Motors", slug: "kgmmotors" },
  { name: "Kia", slug: "kia" },
  { name: "Lamborghini", slug: "lamborghini" },
  { name: "Land Rover", slug: "landrover" },
  { name: "Leapmotor", slug: "leapmotor" },
  { name: "Lexus", slug: "lexus" },
  { name: "Lotus", slug: "lotus" },
  { name: "Maserati", slug: "maserati" },
  { name: "Mazda", slug: "mazda" },
  { name: "McLaren", slug: "mclaren" },
  { name: "Mercedes-Benz", slug: "mercedesbenz" },
  { name: "MG", slug: "mg" },
  { name: "MINI", slug: "mini" },
  { name: "Mitsubishi", slug: "mitsubishi" },
  { name: "Nissan", slug: "nissan" },
  { name: "OMODA", slug: "omoda" },
  { name: "Peugeot", slug: "peugeot" },
  { name: "Polestar", slug: "polestar" },
  { name: "Porsche", slug: "porsche" },
  { name: "Renault", slug: "renault" },
  { name: "Rolls-Royce", slug: "rollsroyce" },
  { name: "SEAT", slug: "seat" },
  { name: "Skoda", slug: "skoda" },
  { name: "Smart", slug: "smart" },
  { name: "SsangYong", slug: "ssangyong" },
  { name: "Subaru", slug: "subaru" },
  { name: "Suzuki", slug: "suzuki" },
  { name: "Tesla", slug: "tesla" },
  { name: "Toyota", slug: "toyota" },
  { name: "Vauxhall", slug: "vauxhall" },
  { name: "Volkswagen", slug: "volkswagen" },
  { name: "Volvo", slug: "volvo" },
  { name: "Xpeng", slug: "xpeng" }
];

export default function BrandGrid() {
  const [selected, setSelected] = useState<string | null>(null);
  const { data: models = [], isLoading } = trpc.model.listByBrandSlug.useQuery(
    { slug: selected! },
    { enabled: !!selected }
  );

  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-8 text-black text-center sm:text-left">
          Browse by manufacturer
        </h2>

        {/* Liste des marques */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {brands.map(({ name, slug }) => (
            <button
              key={slug}
              onClick={() => setSelected(slug)}
              className="flex items-center gap-2 group hover:underline"
            >
              <img
                src={`/BrandLogos/${slug}.svg`}
                alt={name}
                className="w-6 h-6 object-contain"
                onError={(e) => (e.currentTarget.src = "/fallback-icon.svg")}
              />
              <span className="text-sm text-gray-800 group-hover:text-blue-600">
                {name}
              </span>
            </button>
          ))}
        </div>

        {/* Liste des modèles */}
        {selected && (
          <div className="mt-10 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4 capitalize text-gray-800 text-center sm:text-left">
              Models by {selected}
            </h3>

            {isLoading ? (
              <p className="text-sm text-gray-500 text-center sm:text-left">Loading models...</p>
            ) : models.length === 0 ? (
              <p className="text-sm text-gray-500 text-center sm:text-left">No models found.</p>
            ) : (
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 text-sm">
                {models.map((model) => (
                  <li key={model.id}>
                    <Link
                      href={`/${selected}/${model.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      {model.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
