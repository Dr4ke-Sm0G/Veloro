"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { RouterOutputs } from "@/types/trpc";

type CarPreview = RouterOutputs["variant"]["listPreview"][number];

interface CarCardProps {
  variant: CarPreview;
  className?: string;
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function CarCard({ variant }: CarCardProps) {
  const {
    name,
    trim,
    rangeKm,
    powerHp,
    powerKw,
    seats,
    dcChargeKmH,
    price,
    img,
    score,
    dealTag,
    brandName,
    modelName,
    slug,
  } = variant;

  const specs: (string | null)[] = [
    rangeKm ? `${rangeKm} km range` : null,
    powerHp ? `${powerHp} HP${powerKw ? ` (${powerKw} kW)` : ""}` : null,
    seats ? `${seats} seats` : null,
    dcChargeKmH ? `${dcChargeKmH} km/h DC` : null,
  ].filter(Boolean);

  const [src, setSrc] = useState(img || "/images/fallback.png");
  const href = `/${slugify(brandName)}/${slug}`;

  return (
    <div className="bg-gray-200 rounded-xl w-full max-w-lg aspect-square h-[400px] shadow-md flex flex-col p-3">
      {/* ────────── Haut ────────── */}
      <div className="flex flex-col gap-1 text-sm text-black flex-shrink">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-sm text-gray-700">{trim}</p>

        <ul className="text-sm text-gray-600 flex flex-wrap gap-x-2 items-center">
          {specs.map((s, i) => (
            <li key={i} className="flex items-center">
              {i > 0 && <span className="mx-1">•</span>}
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* ────────── Image cliquable ────────── */}
      <Link href={href} className="relative w-full h-[80%] rounded-lg overflow-hidden my-2 block">
        <Image
          src={src}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          placeholder="blur"
          blurDataURL="/images/fallback.png"
          className="object-cover"
          onError={() => setSrc("/images/vw.png")}
        />
      </Link>

      {/* ────────── Prix et chevron cliquable ────────── */}
      <div className="bg-[#eeeeee] rounded-2xl flex justify-between items-center px-3 py-1 flex-shrink">
        <div className="text-xs flex flex-col gap-1">
          <div className="flex items-center">
            <span className="bg-[#00e0b8] text-black text-sm font-semibold px-2 py-[2px] rounded-l-md">
              {dealTag}
            </span>
            <span className="bg-black text-white text-sm font-bold px-2 py-[2px] rounded-r-md">
              {score.toFixed(1)}
            </span>
          </div>
          <div className="text-black text-sm">Buy {name}</div>
          <div className="text-black font-bold text-base">{price}</div>
        </div>

        <Link href={href}>
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition">
            <ChevronRight className="text-white w-4 h-4" />
          </div>
        </Link>
      </div>

      <div className="pt-2 text-center text-xs font-semibold underline text-black">
        BUYING DETAILS
      </div>
    </div>
  );
}
