// src/store/filter-store.ts
import { create } from "zustand";

export type VariantFilterInput = {
  condition?: "NEW" | "USED";
  bodyType?: string;
  drive?: string;
  seats?: number;
  priceMax?: number;
  availability?: "ALL" | "STOCK" | "ORDER";
  yearMin?: number;
  yearMax?: number;
  mileageMin?: number;
  mileageMax?: number;
  make?: string;
  towHitchPossible?: boolean;
  evDedicatedPlatform?: boolean;
  roofRails?: boolean;
  heatPump?: boolean;
};

interface FilterStore {
  filters: VariantFilterInput;
  setFilter: <K extends keyof VariantFilterInput>(
    key: K,
    value: VariantFilterInput[K]
  ) => void;
  resetAllFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  filters: {},
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),
  resetAllFilters: () => set({ filters: {} }),
}));
