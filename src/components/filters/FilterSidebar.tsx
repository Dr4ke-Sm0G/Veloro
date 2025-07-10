"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Check, Box, ShoppingCart, Clock, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFilterStore } from "@/store/filter-store";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { Search as MagnifyingGlassIcon } from "lucide-react";


const availabilityOptions = ["ALL", "STOCK", "ORDER"] as const;
const years = Array.from({ length: 2025 - 2000 + 1 }, (_, i) => 2000 + i);
const mileageSteps = [0, 10000, 20000, 30000, 40000, 50000, 100000];


function useSyncFiltersToURL() {
  const router = useRouter();
  const { filters } = useFilterStore();

  useEffect(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined) {
        params.set(key, String(value));
      }
    }
    router.replace(`/search?${params.toString()}`);
  }, [filters, router]);
}


type FilterSections = 'availability' | 'age' | 'mileage' | 'make' | 'bodyType';

export function FilterSidebar() {
  const { data: brands } = api.brand.getWithVariantCounts.useQuery();
  const { filters, setFilter, resetAllFilters } = useFilterStore();
  useSyncFiltersToURL();

  const [open, setOpen] = useState<Record<FilterSections, boolean>>({
    availability: true,
    age: true,
    mileage: true,
    make: true,
    bodyType: true,
  });
  const [search, setSearch] = useState("");
  const { data: bodyTypes } = api.variant.getBodyTypesWithCounts.useQuery();

  return (
    <aside className="sticky top-20 hidden md:block max-w-xs w-full">
      <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold px-2">Filters</h2>
          <button
            onClick={resetAllFilters}
            className="text-sm text-red-500 hover:underline flex items-center gap-1"
          >
            <RefreshCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Availability */}
        <div>
          <button
            onClick={() => setOpen((p) => ({ ...p, availability: !p.availability }))}
            className="flex justify-between w-full text-sm font-medium mb-2"
          >
            <span>
              Availability{" "}
              {filters.availability && (
                <span className="ml-1 text-gray-500 text-xs font-normal">
                  ({filters.availability})
                </span>
              )}
            </span>
            {open.availability ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {open.availability && (
            <div className="grid grid-cols-3 gap-2">
              {availabilityOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter("availability", status)}
                  className={cn(
                    "flex flex-col items-center justify-center px-2 py-3 rounded-xl border text-xs transition-all",
                    filters.availability === status
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                  )}
                >
                  {status === "ALL" ? (
                    <Box className="w-4 h-4 mb-1" />
                  ) : status === "STOCK" ? (
                    <ShoppingCart className="w-4 h-4 mb-1" />
                  ) : (
                    <Clock className="w-4 h-4 mb-1" />
                  )}
                  <span>{status === "ALL" ? "All" : status === "STOCK" ? "In stock" : "To order"}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Age */}
        <div>
          <button
            onClick={() => setOpen((p) => ({ ...p, age: !p.age }))}
            className="flex justify-between w-full text-sm font-medium mb-2"
          >
            <span>
              Age{" "}
              {(filters.yearMin || filters.yearMax) && (
                <span className="ml-1 text-gray-500 text-xs font-normal">
                  ({filters.yearMin ?? "?"} - {filters.yearMax ?? "?"})
                </span>
              )}
            </span>
            {open.age ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {open.age && (
            <div className="flex gap-2">
              <select
                className="w-full border px-2 py-2 rounded text-sm bg-white"
                value={filters.yearMin ?? ""}
                onChange={(e) => setFilter("yearMin", e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">From</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select
                className="w-full border px-2 py-2 rounded text-sm bg-white"
                value={filters.yearMax ?? ""}
                onChange={(e) => setFilter("yearMax", e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">To</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Mileage */}
        <div>
          <button
            onClick={() => setOpen((p) => ({ ...p, mileage: !p.mileage }))}
            className="flex justify-between w-full text-sm font-medium mb-2"
          >
            <span>
              Mileage{" "}
              {(filters.mileageMin || filters.mileageMax) && (
                <span className="ml-1 text-gray-500 text-xs font-normal">
                  ({filters.mileageMin?.toLocaleString() ?? "?"} - {filters.mileageMax?.toLocaleString() ?? "?"} mi)
                </span>
              )}
            </span>
            {open.mileage ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {open.mileage && (
            <div className="flex gap-2">
              <select
                className="w-full border px-2 py-2 rounded text-sm bg-white"
                value={filters.mileageMin ?? ""}
                onChange={(e) => setFilter("mileageMin", e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">From</option>
                {mileageSteps.map((m) => (
                  <option key={m} value={m}>{m.toLocaleString()} mi</option>
                ))}
              </select>
              <select
                className="w-full border px-2 py-2 rounded text-sm bg-white"
                value={filters.mileageMax ?? ""}
                onChange={(e) => setFilter("mileageMax", e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">To</option>
                {mileageSteps.map((m) => (
                  <option key={m} value={m}>{m.toLocaleString()} mi</option>
                ))}
              </select>

            </div>

          )}
        </div>

        {/* Make */}
        <div>
          <button
            onClick={() => setOpen((p) => ({ ...p, make: !p.make }))}
            className="flex justify-between w-full text-sm font-medium mb-2"
          >
            <span>Make</span>
            {open.make ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {open.make && (
            <>
              {/* Search bar */}
              <div className="relative mb-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <MagnifyingGlassIcon className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search makes"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1">
                {brands
                  ?.filter((brand) =>
                    brand.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => setFilter("make", brand.id)}
                      className={cn(
                        "w-full flex justify-between items-center px-3 py-2 rounded-md border",
                        filters.make === brand.id
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-800 border-gray-200"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {brand.logo && (
                          <img src={brand.logo} alt={brand.name} className="h-5 w-auto" />
                        )}
                        <span className="text-sm">{brand.name}</span>
                      </div>
                      <span className="text-xs font-semibold">{brand.count}</span>
                    </button>
                  ))}
              </div>
            </>
          )}
        </div>
        {/* Body style */}
<div>
  <button
    onClick={() => setOpen((p) => ({ ...p, bodyType: !p.bodyType }))}
    className="flex justify-between w-full text-sm font-medium mb-2"
  >
    <span>Body style</span>
    {open.bodyType ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
  </button>

  {open.bodyType && (
    <div className="max-h-64 overflow-y-auto border rounded-lg p-2 space-y-2 bg-white">
      {bodyTypes?.map((entry) => (
        <label key={entry.type} className="flex items-center justify-between text-sm cursor-pointer">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="bodyType"
              value={entry.type}
              checked={filters.bodyType === entry.type}
              onChange={() => setFilter("bodyType", entry.type)}
              className="h-4 w-4"
            />
            <span>{entry.type}</span>
          </div>
          <span className="text-sm font-semibold text-gray-600">{entry.count.toLocaleString()}</span>
        </label>
      ))}
    </div>
  )}
</div>
{/* Body & Drive */ }
<div className="space-y-4 border-t pt-4 mt-4">
  <h3 className="text-sm font-medium text-gray-700">Drive & Features</h3>

  {/* Drive type */}
  <div>
    <label className="block mb-1 text-sm font-medium text-gray-700">Drive Type</label>
    <select
      className="w-full border px-2 py-2 rounded text-sm bg-white"
      value={filters.drive ?? ""}
      onChange={(e) => setFilter("drive", e.target.value || undefined)}
    >
      <option value="">Any</option>
      <option value="FWD">Front-wheel (FWD)</option>
      <option value="RWD">Rear-wheel (RWD)</option>
      <option value="AWD">All-wheel (AWD)</option>
      <option value="4WD">4WD</option>
    </select>
  </div>

  {/* Seats */}
  <div>
    <label className="block mb-1 text-sm font-medium text-gray-700">Seats</label>
    <select
      className="w-full border px-2 py-2 rounded text-sm bg-white"
      value={filters.seats ?? ""}
      onChange={(e) => setFilter("seats", e.target.value ? Number(e.target.value) : undefined)}
    >
      <option value="">Any</option>
      {[2, 4, 5, 6, 7, 8, 9].map((s) => (
        <option key={s} value={s}>
          {s} seats
        </option>
      ))}
    </select>
  </div>

  {/* Binary options (checkboxes) */}
  <div className="grid grid-cols-2 gap-2">
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={filters.towHitchPossible ?? false}
        onChange={(e) => setFilter("towHitchPossible", e.target.checked)}
      />
      Tow Hitch
    </label>
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={filters.evDedicatedPlatform ?? false}
        onChange={(e) => setFilter("evDedicatedPlatform", e.target.checked)}
      />
      EV Platform
    </label>
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={filters.roofRails ?? false}
        onChange={(e) => setFilter("roofRails", e.target.checked)}
      />
      Roof Rails
    </label>
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={filters.heatPump ?? false}
        onChange={(e) => setFilter("heatPump", e.target.checked)}
      />
      Heat Pump
    </label>
  </div>
</div>

      </div>
    </aside>
  );
}
