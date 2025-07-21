// src/components/filters/FilterSection.tsx
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; 

interface FilterSectionProps {
  title: string | React.ReactNode; // <-- CHANGEMENT ICI
  value: string;
  children: React.ReactNode;
}
export function FilterSection({ title, value, children }: FilterSectionProps) {
  return (
    <AccordionItem value={value} className="border-b border-gray-200 dark:border-gray-700">
      <AccordionTrigger className="py-4 text-base font-semibold text-gray-800 dark:text-gray-100 hover:no-underline">
        {title}
      </AccordionTrigger>
      <AccordionContent className="pb-4 pt-2">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}