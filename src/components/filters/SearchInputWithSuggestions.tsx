// src/components/filters/SearchInputWithSuggestions.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Car, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { useDebounce } from "use-debounce";
import { keepPreviousData } from '@tanstack/react-query'; // Ajoutez cet import

interface Suggestion {
  id: string;
  label: string;
  value: string; // La valeur à utiliser pour le filtre (ex: nom de la marque, ou slug)
  logoUrl?: string | null;
  type?: string; // e.g., 'brand', 'model', 'variant'
}

interface SearchInputWithSuggestionsProps {
  initialSearchQuery?: string;
  // onSelectSuggestion gérera le 'searchQuery' et le 'make'
  onSelectSuggestion: (query: string, make?: string) => void;
  onOpenChange?: (open: boolean) => void;
}

export function SearchInputWithSuggestions({
  initialSearchQuery = "",
  onSelectSuggestion,
  onOpenChange,
}: SearchInputWithSuggestionsProps) {
  const [inputValue, setInputValue] = useState(initialSearchQuery);
  const [debouncedInputValue] = useDebounce(inputValue, 500);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // CHANGEMENT ICI: Appel à la nouvelle procédure dans variantRouter
  const { data: suggestions, isLoading: suggestionsLoading } = api.variant.getSearchSuggestions.useQuery(
    { query: debouncedInputValue },
    {
      enabled: debouncedInputValue.length > 1,
      staleTime: 60 * 1000,
      placeholderData: keepPreviousData,
    }
  );

  useEffect(() => {
    setInputValue(initialSearchQuery);
  }, [initialSearchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setOpen(true);
  };

  const handleSelect = (suggestion: Suggestion) => {
    setInputValue(suggestion.label); // Affiche le label complet dans l'input
    setOpen(false); // Ferme le popover
    // Appelle la fonction de sélection passée en prop
    // Ici, nous passons le label comme 'searchQuery' et la 'value' (nom de la marque) comme 'make'
    onSelectSuggestion(suggestion.label, suggestion.value);
  };

  return (
    <Popover open={open} onOpenChange={(val) => {
        setOpen(val);
        onOpenChange?.(val);
    }}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search by make, model, year..."
            value={inputValue}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 focus-visible:ring-offset-0 focus-visible:ring-transparent focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 mt-2 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2">
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="Search..."
            value={inputValue}
            onValueChange={setInputValue}
            className="h-9"
          />
          <CommandList>
            {suggestionsLoading && debouncedInputValue.length > 1 && (
              <CommandEmpty>Loading suggestions...</CommandEmpty>
            )}
            {!suggestionsLoading && debouncedInputValue.length <= 1 && (
              <CommandEmpty>Type at least 2 characters to search.</CommandEmpty>
            )}
            {!suggestionsLoading && suggestions?.length === 0 && debouncedInputValue.length > 1 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            <ScrollArea className="h-[200px] overflow-y-auto">
              <CommandGroup>
                {suggestions?.map((suggestion) => (
                  <CommandItem
                    key={suggestion.id}
                    value={suggestion.label}
                    onSelect={() => handleSelect(suggestion)}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
{suggestion.logoUrl ? (
  // Si c'est un SVG direct, utilisez dangerouslySetInnerHTML
  <div
    className="h-6 w-6 flex items-center justify-center" // Conteneur pour centrer le SVG
    dangerouslySetInnerHTML={{ __html: suggestion.logoUrl }}
  />
) : (
  <Car className="h-6 w-6 text-gray-500" />
)}
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{suggestion.label}</span>
                      {/* Vous pouvez ajouter plus de détails ici si nécessaire */}
                      {suggestion.type === 'variant' && (
                          <span className="text-xs text-gray-500">Variant</span>
                      )}
                      {suggestion.type === 'model' && (
                          <span className="text-xs text-gray-500">Model</span>
                      )}
                      {suggestion.type === 'brand' && (
                          <span className="text-xs text-gray-500">Brand</span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}