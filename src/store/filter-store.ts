// src/store/filter-store.ts

import { create } from "zustand";

export type VariantFilterInput = {
  condition?: "NEW" | "USED";
  bodyType?: string;
  drive?: string;
  seats?: number;
  priceMax?: number;
  priceMin?: number;
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
  page?: number;
  limit?: number;
  searchQuery?: string; // Add searchQuery here to be part of the global state
};

// Define the initial state for your filters
const initialState: VariantFilterInput = {
  condition: undefined,
  bodyType: undefined,
  drive: undefined,
  seats: undefined,
  priceMax: undefined,
  priceMin: undefined,
  availability: "ALL", // Default to 'ALL' for availability
  yearMin: undefined,
  yearMax: undefined,
  mileageMin: undefined,
  mileageMax: undefined,
  make: undefined,
  towHitchPossible: undefined,
  evDedicatedPlatform: undefined,
  roofRails: undefined,
  heatPump: undefined,
  page: 1, // Default page
  limit: 10, // Default limit
  searchQuery: undefined,
};

interface FilterStore {
  filters: VariantFilterInput;
  setFilter: <K extends keyof Omit<VariantFilterInput, 'page' | 'limit'>>(key: K, value: VariantFilterInput[K]) => void;
  // A specific action to set page and limit without affecting other filters
  setPagination: (page: number, limit: number) => void;
  resetAllFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  filters: initialState, // Initialize with the defined initialState
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),
  setPagination: (page, limit) =>
    set((state) => ({
      filters: {
        ...state.filters,
        page,
        limit,
      },
    })),
  resetAllFilters: () => set({ filters: initialState }), // Reset to the defined initial state
}));