// src/components/CarCard.tsx (or wherever your component is)
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight, BatteryCharging, Power, Gauge, Users } from "lucide-react"; // Added icons
import type { RouterOutputs } from "@/types/trpc";
import { JSX } from "react/jsx-runtime";

type CarPreview = RouterOutputs["variant"]["listPreview"][number];

interface CarCardProps {
  variant: CarPreview;
  className?: string; // Prop for external styling if needed
}

// KEPT AS IS: slugify function as originally provided
function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function CarCard({ variant, className }: CarCardProps) {
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

  // Reverted image path to original logic
  const [src, setSrc] = useState(img || "/images/fallback.png");

  // KEPT AS IS: href construction as originally provided
  const href = `/${slugify(brandName)}/${slug}`;

  // Optimized specs array with icons
  const specs = [
    rangeKm ? { value: `${rangeKm} km`, icon: <Gauge size={14} className="inline-block mr-1 text-gray-500" /> } : null,
    powerHp ? { value: `${powerHp} HP${powerKw ? ` (${powerKw} kW)` : ""}`, icon: <Power size={14} className="inline-block mr-1 text-gray-500" /> } : null,
    seats ? { value: `${seats} seats`, icon: <Users size={14} className="inline-block mr-1 text-gray-500" /> } : null,
    dcChargeKmH ? { value: `${dcChargeKmH} km/h DC`, icon: <BatteryCharging size={14} className="inline-block mr-1 text-gray-500" /> } : null,
  ].filter(Boolean) as { value: string; icon: JSX.Element }[]; // Type assertion for filtered array

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col p-3 ${className}`}
    >
      {/* ────────── Header Section ────────── */}
      <div className="flex flex-col gap-1 text-gray-900 dark:text-gray-100 mb-2 flex-shrink-0">
        <h3 className="text-xl font-extrabold leading-tight">{name}</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{trim}</p>

        <ul className="text-xs text-gray-700 dark:text-gray-400 flex flex-wrap gap-x-2 items-center mt-1">
          {specs.map((spec, i) => (
            <li key={i} className="flex items-center">
              {i > 0 && <span className="mx-1.5 text-gray-400 dark:text-gray-600">•</span>}
              {spec.icon}
              {spec.value}
            </li>
          ))}
        </ul>
      </div>

      {/* ────────── Clickable Image ────────── */}
      <Link href={href} className="relative w-full h-40 rounded-lg overflow-hidden my-2 block group">
        <Image
          src={src}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 350px"
          placeholder="blur"
          blurDataURL="images/vw.png"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setSrc("/images/vw.png")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> {/* Subtle overlay */}
      </Link>

      {/* ────────── Price & Action Section ────────── */}
      <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl flex justify-between items-end p-3 flex-shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center space-x-1.5">
            {dealTag && (
                <span className="bg-green-400 dark:bg-green-600 text-gray-900 dark:text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {dealTag}
                </span>
            )}
            {score && (
                <span className="bg-gray-900 dark:bg-gray-950 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {score.toFixed(1)}/10
                </span>
            )}
          </div>
          <div className="text-gray-800 dark:text-gray-200 text-xs mt-0.5">Starting from</div>
          <div className="text-gray-900 dark:text-white font-extrabold text-xl leading-none">{price}</div>
        </div>

        <Link href={href} className="group flex items-center justify-center">
          <div className="w-10 h-10 bg-black dark:bg-gray-950 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 dark:group-hover:bg-blue-500">
            <ChevronRight className="text-white w-4 h-4 group-hover:rotate-6 transition-transform duration-300" />
          </div>
        </Link>
      </div>

    
    </div>
  );
}