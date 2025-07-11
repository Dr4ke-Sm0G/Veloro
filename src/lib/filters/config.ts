// lib/filters/config.ts
import type { VariantFilterInput } from "@/store/filter-store";

export type FilterType = "select" | "multi-select" | "checkbox" | "range";

export interface FilterOption<T = any> {
  label: string;
  value: T;
}

export interface FilterConfig<K extends keyof VariantFilterInput = keyof VariantFilterInput> {
  key: K;
  label: string;
  type: FilterType;
  options?: FilterOption<VariantFilterInput[K]>[];
  group?: string; // (facultatif) pour regrouper les filtres en UI
  defaultValue?: VariantFilterInput[K];
  placeholder?: string;
}

export const FILTERS: FilterConfig[] = [
  {
    key: "condition",
    label: "Condition",
    type: "select",
    placeholder: "Select condition",
    options: [
      { label: "New", value: "NEW" },
      { label: "Used", value: "USED" },
    ],
    group: "General",
  },
  {
    key: "availability",
    label: "Availability",
    type: "select",
    placeholder: "Select availability",
    options: [
      { label: "All", value: "ALL" },
      { label: "In Stock", value: "STOCK" },
      { label: "To Order", value: "ORDER" },
    ],
    group: "General",
  },
  {
    key: "bodyType",
    label: "Body Style",
    type: "select",
    placeholder: "Select body style",
    options: [
      { label: "SUV", value: "SUV" },
      { label: "Hatchback", value: "Hatchback" },
      { label: "Sedan", value: "Sedan" },
      { label: "Estate", value: "Estate" },
      { label: "Coupé", value: "Coupé" },
      { label: "Convertible", value: "Convertible" },
      { label: "MPV", value: "MPV" },
      { label: "Pickup", value: "Pickup" },
    ],
    group: "Body & Drive",
  },
  {
    key: "drive",
    label: "Drive Type",
    type: "multi-select",
    options: [
      { label: "FWD", value: "Front" },
      { label: "RWD", value: "Rear" },
      { label: "AWD", value: "AWD" },
      { label: "4WD", value: "4WD" },
    ],
    group: "Body & Drive",
  },
  {
    key: "seats",
    label: "Number of Seats",
    type: "select",
    placeholder: "Select number of seats",
    options: [2, 4, 5, 6, 7, 8, 9].map((n) => ({
      label: `${n} seats`,
      value: n,
    })),
    group: "Body & Drive",
  },
  {
    key: "yearMin",
    label: "Year (From)",
    type: "select",
    options: Array.from({ length: 2025 - 2000 + 1 }, (_, i) => {
      const year = 2000 + i;
      return { label: `${year}`, value: year };
    }),
    group: "Age",
  },
  {
    key: "yearMax",
    label: "Year (To)",
    type: "select",
    options: Array.from({ length: 2025 - 2000 + 1 }, (_, i) => {
      const year = 2000 + i;
      return { label: `${year}`, value: year };
    }),
    group: "Age",
  },
  {
    key: "mileageMin",
    label: "Mileage (From)",
    type: "select",
    options: [0, 10000, 20000, 30000, 40000, 50000, 100000].map((m) => ({
      label: `${m.toLocaleString()} mi`,
      value: m,
    })),
    group: "Mileage",
  },
  {
    key: "mileageMax",
    label: "Mileage (To)",
    type: "select",
    options: [0, 10000, 20000, 30000, 40000, 50000, 100000].map((m) => ({
      label: `${m.toLocaleString()} mi`,
      value: m,
    })),
    group: "Mileage",
  },
  {
    key: "towHitchPossible",
    label: "Tow Hitch",
    type: "checkbox",
    group: "Features",
  },
  {
    key: "evDedicatedPlatform",
    label: "EV Platform",
    type: "checkbox",
    group: "Features",
  },
  {
    key: "roofRails",
    label: "Roof Rails",
    type: "checkbox",
    group: "Features",
  },
  {
    key: "heatPump",
    label: "Heat Pump",
    type: "checkbox",
    group: "Features",
  },
  {
    key: "priceMax",
    label: "Price Max",
    type: "select",
    options: [10000, 20000, 30000, 40000, 50000].map((p) => ({
      label: `Up to £${(p / 1000).toFixed(0)}k`,
      value: p,
    })),
    group: "Pricing",
  },
];
