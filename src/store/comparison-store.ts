import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ComparisonState {
  selectedIds: string[];
  addCar: (id: string) => void;
  removeCar: (id: string) => void;
  clear: () => void;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set) => ({
      selectedIds: [],
      addCar: (id) =>
        set((state) =>
          state.selectedIds.includes(id) || state.selectedIds.length >= 3
            ? state
            : { selectedIds: [...state.selectedIds, id] }
        ),
      removeCar: (id) =>
        set((state) => ({
          selectedIds: state.selectedIds.filter((carId) => carId !== id),
        })),
      clear: () => set({ selectedIds: [] }),
    }),
    {
      name: "comparison-storage",
    }
  )
);
