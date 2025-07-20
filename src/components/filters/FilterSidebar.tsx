// components/filters/FilterSidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  RefreshCcw,
  ChevronDown,
  ChevronUp,
  Box,
  ShoppingCart,
  Clock,
  Search as MagnifyingGlassIcon,
  DollarSign, // For price filter icon
  Gauge, // For mileage filter icon
} from 'lucide-react';
import { useFilterStore } from '@/store/filter-store';
import { api } from '@/utils/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Assuming you have a Shadcn UI Input component
import { useCallback,startTransition  } from 'react';

// Define the types for filter sections to ensure type safety
type FilterSections = 'availability' | 'year' | 'mileage' | 'make' | 'bodyType' | 'driveAndFeatures' | 'price'; // Added 'price'

interface FilterSidebarProps {
  /** Displayed in mobile drawer mode (e.g., full width, different positioning) */
  inDrawer?: boolean;
  /** Callback to close/apply filters, typically used when inDrawer is true */
  onApply?: () => void;
  /** Optional: Number of results matching the current filters */
  resultCount?: number;
}

/**
 * FilterSidebar component for filtering search results.
 * It manages filter states, synchronizes them with the URL,
 * and displays various filter options like availability, year, mileage, make, and body type.
 */
export function FilterSidebar({ inDrawer = false, onApply, resultCount }: FilterSidebarProps) {
  const router = useRouter();
  const { filters, setFilter, resetAllFilters } = useFilterStore();

  const { data: brands, isLoading: isLoadingBrands } = api.brand.getWithVariantCounts.useQuery();
  const { data: bodyTypes, isLoading: isLoadingBodyTypes } = api.variant.getBodyTypesWithCounts.useQuery();

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState<Record<FilterSections, boolean>>({
    availability: true,
    year: true,
    mileage: true,
    make: true,
    bodyType: true,
    driveAndFeatures: true,
    price: true, // Set to true to open price filter by default
  });

const [minPriceInput, setMinPriceInput] = useState(filters.priceMin?.toString() ?? '');
const [maxPriceInput, setMaxPriceInput] = useState(filters.priceMax?.toString() ?? '');


  // --- Effect for Price Filter Updates ---
  // This useEffect will run only when debouncedMinPrice or debouncedMaxPrice changes.
const commitPrice = useCallback(() => {
  const min = minPriceInput === '' ? undefined : Number(minPriceInput);
  const max = maxPriceInput === '' ? undefined : Number(maxPriceInput);
  if (min !== filters.priceMin) setFilter('priceMin', min);
  if (max !== filters.priceMax) setFilter('priceMax', max);
}, [minPriceInput, maxPriceInput, filters.priceMin, filters.priceMax, setFilter]);

  // Synchronize filters with the URL's query parameters whenever filters change.
  // This useEffect will now react to `setFilter` calls which are triggered by the debounced values.
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      // Ensure we only add defined values to URL params
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });
    // Use replace to avoid polluting browser history with every filter change
    router.replace(`/search?${params.toString()}`);
  }, [filters, router]);

  const availabilityOptions = ['ALL', 'STOCK', 'ORDER'] as const;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2011 + 1 }, (_, i) => 2011 + i).reverse(); // From 2011 to currentYear
  const mileageSteps = [0, 5000, 10000, 20000, 30000, 40000, 50000, 75000, 100000, 150000, 200000, 250000]; // Increased granularity for slider

  // Helper to render filter section
  const FilterSection = ({
    title,
    filterKey,
    children,
    currentValueDisplay,
    icon: Icon, // Optional icon for the title
  }: {
    title: string;
    filterKey: FilterSections;
    children: React.ReactNode;
    currentValueDisplay?: string;
    icon?: React.ElementType; // Type for Lucide React icons
  }) => (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
      <button
        onClick={() => setOpen(p => ({ ...p, [filterKey]: !p[filterKey] }))}
        className="flex justify-between w-full text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 items-center"
        aria-expanded={open[filterKey]}
        aria-controls={`${filterKey}-filter-content`}
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
          {title}
          {currentValueDisplay && (
            <span className="ml-1 text-gray-500 dark:text-gray-400 text-sm font-normal">
              ({currentValueDisplay})
            </span>
          )}
        </span>
        {open[filterKey] ? <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
      </button>
      {open[filterKey] && (
        <div id={`${filterKey}-filter-content`} className="mt-4 px-2"> {/* Added horizontal padding */}
          {children}
        </div>
      )}
    </div>
  );

  const handleResetFilters = () => {
    resetAllFilters();
    // Also reset local states for debounced inputs
    setMinPriceInput('');
    setMaxPriceInput('');
    // Optionally, if `inDrawer` is true and you want to close the drawer after reset
    if (inDrawer && onApply) {
      onApply();
    }
  };

  return (
    <aside
      className={cn(
        inDrawer ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-y-auto transform transition-transform ease-in-out duration-300 translate-x-0' : 'sticky top-20 hidden md:block',
        'max-w-xs w-full h-full md:h-auto' // Ensures it takes full height in drawer, auto otherwise
      )}
      aria-label="Barre latérale des filtres de recherche de véhicules"
    >
      <div className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-850 dark:border-gray-700 px-5 py-6 shadow-lg space-y-6 h-full"> {/* Increased shadow and dark mode adjustments */}
        {/* Header section for filters */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Filtres</h2>
          <div className="flex items-center gap-3">
            {inDrawer && onApply && (
              <Button size="sm" onClick={onApply} className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800">
                Appliquer
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={handleResetFilters} // Use the new handler
              className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-600 flex items-center gap-1 font-semibold text-sm"
              aria-label="Réinitialiser tous les filtres"
            >
              <RefreshCcw className="w-4 h-4" /> Réinitialiser
            </Button>
          </div>
        </div>

        {/* Display result count (if provided) */}
        {resultCount !== undefined && (
          <div className="text-center py-2 text-md font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
            {resultCount} Résultats trouvés
          </div>
        )}

        {/* --- NEW: Price Filter Section (using Input for debouncing) --- */}
        <FilterSection
          title="Prix"
          filterKey="price"
          icon={DollarSign}
          currentValueDisplay={`${filters.priceMin?.toLocaleString('fr-FR') ?? 'Min'} - ${filters.priceMax?.toLocaleString('fr-FR') ?? 'Max'} €`}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="min-price-input" className="sr-only">Prix minimal</label>
              <Input
                id="min-price-input"
                type="number"
                value={minPriceInput} // Bind to local state
                onChange={(e) => setMinPriceInput(e.target.value)} // Update local state immediately
                onBlur={commitPrice}
                onKeyDown={e => e.key === 'Enter' && commitPrice()}
                placeholder="Min"
                className="w-full"
                aria-label="Prix minimum"
              />
            </div>
            <div>
              <label htmlFor="max-price-input" className="sr-only">Prix maximal</label>
              <Input
                id="max-price-input"
                type="number"
                value={maxPriceInput} // Bind to local state
                onChange={(e) => setMaxPriceInput(e.target.value)} // Update local state immediately
                onBlur={commitPrice}
                onKeyDown={e => e.key === 'Enter' && commitPrice()}
                placeholder="Max"
                className="w-full"
                aria-label="Prix maximum"
              />
            </div>
          </div>
        </FilterSection>

        {/* Availability Filter Section (No change needed, uses buttons/discrete selection) */}
        <FilterSection
          title="Condition"
          filterKey="availability"
          currentValueDisplay={filters.availability ? (filters.availability === 'ALL' ? 'Toutes' : filters.availability === 'STOCK' ? 'En stock' : 'Sur commande') : ''}
        >
          <div className="grid grid-cols-3 gap-3">
            {availabilityOptions.map(status => (
              <button
                key={status}
                onClick={() => setFilter('availability', status)}
                className={cn(
                  'flex flex-col items-center justify-center px-3 py-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ease-in-out',
                  filters.availability === status
                    ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-700 dark:border-blue-700 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600'
                )}
                aria-pressed={filters.availability === status}
                aria-label={status === 'ALL' ? 'Toutes les voitures' : status === 'STOCK' ? 'Voitures en stock' : 'Voitures sur commande'}
              >
                {status === 'ALL' ? (
                  <Box className="w-5 h-5 mb-1 text-inherit" />
                ) : status === 'STOCK' ? (
                  <ShoppingCart className="w-5 h-5 mb-1 text-inherit" />
                ) : (
                  <Clock className="w-5 h-5 mb-1 text-inherit" />
                )}
                <span>
                  {status === 'ALL' ? 'Toutes' : status === 'STOCK' ? 'En stock' : 'Sur commande'}
                </span>
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Year Filter Section (No debouncing for selects is usually needed) */}
        <FilterSection
          title="Année"
          filterKey="year"
          currentValueDisplay={`${filters.yearMin ?? 'Min'} - ${filters.yearMax ?? 'Max'}`}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="year-min-select" className="sr-only">Année minimale</label>
              <select
                id="year-min-select"
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.yearMin ?? ''}
                onChange={e => setFilter('yearMin', e.target.value ? Number(e.target.value) : undefined)}
                aria-label="Année minimale"
              >
                <option value="">Min</option>
                {years.map(y => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="year-max-select" className="sr-only">Année maximale</label>
              <select
                id="year-max-select"
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.yearMax ?? ''}
                onChange={e => setFilter('yearMax', e.target.value ? Number(e.target.value) : undefined)}
                aria-label="Année maximale"
              >
                <option value="">Max</option>
                {years.map(y => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </FilterSection>

        {/* Mileage Filter Section (No debouncing for selects is usually needed) */}
        <FilterSection
          title="Kilométrage"
          filterKey="mileage"
          icon={Gauge}
          currentValueDisplay={`${filters.mileageMin?.toLocaleString('fr-FR') ?? 'Min'} - ${filters.mileageMax?.toLocaleString('fr-FR') ?? 'Max'} km`}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="mileage-min-select" className="sr-only">Kilométrage minimal</label>
              <select
                id="mileage-min-select"
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.mileageMin ?? ''}
                onChange={e => setFilter('mileageMin', e.target.value ? Number(e.target.value) : undefined)}
                aria-label="Kilométrage minimal"
              >
                <option value="">Min</option>
                {mileageSteps.map(m => (
                  <option key={m} value={m}>
                    {m.toLocaleString('fr-FR')} km
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="mileage-max-select" className="sr-only">Kilométrage maximal</label>
              <select
                id="mileage-max-select"
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.mileageMax ?? ''}
                onChange={e => setFilter('mileageMax', e.target.value ? Number(e.target.value) : undefined)}
                aria-label="Kilométrage maximal"
              >
                <option value="">Max</option>
                {mileageSteps.map(m => (
                  <option key={m} value={m}>
                    {m.toLocaleString('fr-FR')} km
                  </option>
                ))}
              </select>
            </div>
          </div>
        </FilterSection>

        {/* Make Filter Section (Search input does not need debouncing here as it filters local list, not API) */}
        <FilterSection
          title="Marque"
          filterKey="make"
          icon={ShoppingCart}
        >
          <div className="relative mb-3">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher des marques"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:focus:ring-blue-600"
              aria-label="Rechercher des marques"
            />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {isLoadingBrands ? (
              <div className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">Chargement des marques...</div>
            ) : brands?.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">Aucune marque trouvée.</div>
            ) : (
              brands
                ?.filter(brand => brand.name.toLowerCase().includes(search.toLowerCase()))
                .map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => setFilter('make', filters.make === brand.id ? undefined : brand.id)} // Toggle selection
                    className={cn(
                      'w-full flex justify-between items-center px-4 py-2 rounded-md border-2 text-left transition-all duration-200 ease-in-out',
                      filters.make === brand.id
                        ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-700 dark:border-blue-700 shadow-md'
                        : 'bg-white text-gray-800 border-gray-200 hover:bg-blue-50 hover:border-blue-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600'
                    )}
                    aria-pressed={filters.make === brand.id}
                  >
                    <div className="flex items-center gap-3">
                      {brand.logo && <img src={brand.logo} alt={`Logo ${brand.name}`} className="h-6 w-auto object-contain" />}
                      <span className="text-sm font-medium">{brand.name}</span>
                    </div>
                    <span className="text-xs font-bold text-inherit">{brand.count?.toLocaleString() ?? 0}</span>
                  </button>
                ))
            )}
          </div>
        </FilterSection>

        {/* Body style Filter Section (No change needed, uses radio buttons/discrete selection) */}
        <FilterSection
          title="Carrosserie"
          filterKey="bodyType"
          icon={Box}
        >
          <div className="max-h-64 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg p-3 space-y-2 bg-white dark:bg-gray-900 custom-scrollbar">
            {isLoadingBodyTypes ? (
              <div className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">Chargement des types de carrosserie...</div>
            ) : bodyTypes?.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">Aucun type de carrosserie trouvé.</div>
            ) : (
              bodyTypes?.map(entry => (
                <label
                  key={entry.type}
                  className="flex items-center justify-between text-sm font-medium cursor-pointer py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="bodyType"
                      value={entry.type}
                      checked={filters.bodyType === entry.type}
                      onChange={() => setFilter('bodyType', entry.type)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
                      aria-label={`Type de carrosserie: ${entry.type}`}
                    />
                    <span className="text-gray-800 dark:text-gray-200">{entry.type}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{entry.count.toLocaleString()}</span>
                </label>
              ))
            )}
          </div>
        </FilterSection>

        {/* Drive & Features Section (No debouncing needed, uses selects/checkboxes/discrete selection) */}
        <FilterSection
          title="Conduite & Fonctionnalités"
          filterKey="driveAndFeatures"
          icon={DollarSign}
        >
          <div className="space-y-4">
            {/* Drive type */}
            <div>
              <label htmlFor="drive-type-select" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Type de transmission</label>
              <select
                id="drive-type-select"
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.drive ?? ''}
                onChange={e => setFilter('drive', e.target.value || undefined)}
                aria-label="Sélectionner le type de transmission"
              >
                <option value="">Tous</option>
                <option value="FWD">Traction avant (FWD)</option>
                <option value="RWD">Propulsion arrière (RWD)</option>
                <option value="AWD">Intégrale (AWD)</option>
                <option value="4WD">4x4 (4WD)</option>
              </select>
            </div>

            {/* Seats */}
            <div>
              <label htmlFor="seats-select" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de sièges</label>
              <select
                id="seats-select"
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.seats ?? ''}
                onChange={e => setFilter('seats', e.target.value ? Number(e.target.value) : undefined)}
                aria-label="Sélectionner le nombre de sièges"
              >
                <option value="">Tous</option>
                {[2, 4, 5, 6, 7, 8, 9].map(s => (
                  <option key={s} value={s}>
                    {s} sièges
                  </option>
                ))}
              </select>
            </div>

            {/* Binary options (checkboxes) */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <label className="flex items-center gap-3 text-sm cursor-pointer text-gray-800 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={filters.towHitchPossible ?? false}
                  onChange={e => setFilter('towHitchPossible', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
                  aria-label="Option d'attelage remorque"
                />
                Attelage remorque
              </label>
              <label className="flex items-center gap-3 text-sm cursor-pointer text-gray-800 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={filters.evDedicatedPlatform ?? false}
                  onChange={e => setFilter('evDedicatedPlatform', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
                  aria-label="Plateforme EV dédiée"
                />
                Plateforme EV
              </label>
              <label className="flex items-center gap-3 text-sm cursor-pointer text-gray-800 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={filters.roofRails ?? false}
                  onChange={e => setFilter('roofRails', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
                  aria-label="Rails de toit"
                />
                Rails de toit
              </label>
              <label className="flex items-center gap-3 text-sm cursor-pointer text-gray-800 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={filters.heatPump ?? false}
                  onChange={e => setFilter('heatPump', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
                  aria-label="Pompe à chaleur"
                />
                Pompe à chaleur
              </label>
            </div>
          </div>
        </FilterSection>
      </div>
    </aside>
  );
}