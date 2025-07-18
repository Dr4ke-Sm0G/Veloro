// src/app/(cars)/layout.tsx
import { ReactNode } from "react";
import ComparisonBar from "@/components/comparison/ComparisonBar";

export default function CarsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ComparisonBar />
    </>
  );
}
