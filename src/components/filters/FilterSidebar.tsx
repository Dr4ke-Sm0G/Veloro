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
  Search as MagnifyingGlassIcon, // Renamed for clarity, though 'Search' is also fine
} from 'lucide-react';
import { useFilterStore } from '@/store/filter-store'; // Assuming this is a Zustand store
import { api } from '@/utils/api'; // Assuming this is a tRPC client
import { cn } from '@/lib/utils'; // Assuming this is a utility for combining class names (e.g., clsx/class-variance-authority)
import { Button } from '@/components/ui/button'; // Assuming this is a Shadcn UI button component

// Define the types for filter sections to ensure type safety
type FilterSections = 'availability' | 'age' | 'mileage' | 'make' | 'bodyType';

interface FilterSidebarProps {
  /** Displayed in mobile drawer mode (e.g., full width, different positioning) */
  inDrawer?: boolean;
  /** Callback to close/apply filters, typically used when inDrawer is true */
  onApply?: () => void;
}

/**
 * FilterSidebar component for filtering search results.
 * It manages filter states, synchronizes them with the URL,
 * and displays various filter options like availability, age, mileage, make, and body type.
 */
export function FilterSidebar({ inDrawer = false, onApply }: FilterSidebarProps) {
  const router = useRouter();
  // Destructure filter state and actions from the Zustand store
  const { filters, setFilter, resetAllFilters } = useFilterStore();

  // Fetch brand data with variant counts using tRPC query
  const { data: brands } = api.brand.getWithVariantCounts.useQuery();
  // Fetch body types data with counts using tRPC query
  const { data: bodyTypes } = api.variant.getBodyTypesWithCounts.useQuery();

  // State for the search input within the 'Make' filter section
  const [search, setSearch] = useState('');
  // State to manage the open/closed status of each filter section (accordion-like behavior)
  const [open, setOpen] = useState<Record<FilterSections, boolean>>({
    availability: true,
    age: true,
    mileage: true,
    make: true,
    bodyType: true,
  });

  // Synchronize filters with the URL's query parameters whenever filters change.
  // This ensures that the URL reflects the current filter state, making it shareable.
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      // Only add defined filter values to the URL
      if (value !== undefined) {
        params.set(key, String(value));
      }
    });
    // Replace the current URL without adding a new entry to the browser history
    router.replace(`/search?${params.toString()}`);
  }, [filters, router]); // Dependencies: re-run effect when filters or router object changes

  // Static data for filter options
  const availabilityOptions = ['ALL', 'STOCK', 'ORDER'] as const;
  // Generate years from 2000 to the current year (2025)
  const years = Array.from({ length: 2025 - 2000 + 1 }, (_, i) => 2000 + i);
  // Define mileage steps for filter options
  const mileageSteps = [0, 10000, 20000, 30000, 40000, 50000, 100000];

  return (
    <aside
      className={cn(
        // Conditional styling based on 'inDrawer' prop
        inDrawer ? '' : 'sticky top-20 hidden md:block', // 'hidden md:block' hides on small screens, shows on medium+
        'max-w-xs w-full' // Ensures it takes full width up to max-w-xs
      )}
      aria-label="Filter sidebar" // Accessibility: describe the purpose of the aside
    >
      <div className="rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-800 px-5 py-6 shadow-sm space-y-6">
        {/* Header section for filters */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Filters</h2>
          <div className="flex items-center gap-2">
            {/* Apply button, only shown when inDrawer mode and onApply callback is provided */}
            {inDrawer && onApply && (
              <Button size="sm" onClick={onApply}>
                Apply
              </Button>
            )}
            {/* Reset Filters button */}
            <button
              onClick={resetAllFilters}
              className="text-sm text-red-500 hover:underline flex items-center gap-1"
              aria-label="Reset all filters" // Accessibility: describe button action
            >
              <RefreshCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>

        {/* Availability Filter Section */}
        <div className="border-t pt-6"> {/* Added top border for separation */}
          <button
            onClick={() => setOpen(p => ({ ...p, availability: !p.availability }))}
            className="flex justify-between w-full text-sm font-medium mb-2"
            aria-expanded={open.availability} // Accessibility: indicate if section is expanded
            aria-controls="availability-filter-content" // Accessibility: link to controlled content
          >
            <span>
              Availability{' '}
              {filters.availability && (
                <span className="ml-1 text-gray-500 text-xs font-normal">
                  ({filters.availability})
                </span>
              )}
            </span>
            {open.availability ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {open.availability && (
            <div id="availability-filter-content" className="grid grid-cols-3 gap-2">
              {availabilityOptions.map(status => (
                <button
                  key={status}
                  onClick={() => setFilter('availability', status)}
                  className={cn(
                    'flex flex-col items-center justify-center px-2 py-3 rounded-xl border text-xs transition-all',
                    filters.availability === status
                      ? 'bg-black text-white border-black dark:bg-gray-700 dark:border-gray-700' // Dark mode styles
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700' // Dark mode styles
                  )}
                  aria-pressed={filters.availability === status} // Accessibility: indicate if button is pressed
                >
                  {status === 'ALL' ? (
                    <Box className="w-4 h-4 mb-1" />
                  ) : status === 'STOCK' ? (
                    <ShoppingCart className="w-4 h-4 mb-1" />
                  ) : (
                    <Clock className="w-4 h-4 mb-1" />
                  )}
                  <span>
                    {status === 'ALL'
                      ? 'All'
                      : status === 'STOCK'
                      ? 'In stock'
                      : 'To order'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Age Filter Section */}
        <div className="border-t pt-6"> {/* Added top border for separation */}
          <button
            onClick={() => setOpen(p => ({ ...p, age: !p.age }))}
            className="flex justify-between w-full text-sm font-medium mb-2"
            aria-expanded={open.age}
            aria-controls="age-filter-content"
          >
            <span>
              Age{' '}
              {(filters.yearMin || filters.yearMax) && (
                <span className="ml-1 text-gray-500 text-xs font-normal">
                  ({filters.yearMin ?? '?'} - {filters.yearMax ?? '?'})
                </span>
              )}
            </span>
            {open.age ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {open.age && (
            <div id="age-filter-content" className="flex gap-2">
              <select
                className="w-full border px-2 py-2 rounded text-sm bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300" // Dark mode styles
                value={filters.yearMin ?? ''}
                onChange={e => setFilter('yearMin', e.target.value ? Number(e.target.value) : undefined)}
                aria-label="Minimum year" // Accessibility: describe select purpose
              >
                <option value="">From</option>
                {years.map(y => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <select
                className="w-full border px-2 py-2 rounded text-sm bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300" // Dark mode styles
                value={filters.yearMax ?? ''}
                onChange={e => setFilter('yearMax', e.target.value ? Number(e.target.value) : undefined)}
                aria-label="Maximum year" // Accessibility: describe select purpose
              >
                <option value="">To</option>
                {years.map(y => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Mileage Filter Section */}
        <div className="border-t pt-6"> {/* Added top border for separation */}
          <button
            onClick={() => setOpen(p => ({ ...p, mileage: !p.mileage }))}
            className="flex justify-between w-full text-sm font-medium mb-2"
            aria-expanded={open.mileage}
            aria-controls="mileage-filter-content"
          >
            <span>
              Mileage{' '}
              {(filters.mileageMin || filters.mileageMax) && (
                <span className="ml-1 text-gray-500 text-xs font-normal">
                  ({filters.mileageMin?.toLocaleString() ?? '?'} - {filters.mileageMax?.toLocaleString() ?? '?'} mi)
                </span>
              )}
            </span>
            {open.mileage ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {open.mileage && (
            <div id="mileage-filter-content" className="flex gap-2">
              <select
                className="w-full border px-2 py-2 rounded text-sm bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300" // Dark mode styles
                value={filters.mileageMin ?? ''}
                onChange={e => setFilter('mileageMin', e.target.value ? Number(e.target.value) : undefined)}
                aria-label="Minimum mileage"
              >
                <option value="">From</option>
                {mileageSteps.map(m => (
                  <option key={m} value={m}>
                    {m.toLocaleString()} mi
                  </option>
                ))}
              </select>
              <select
                className="w-full border px-2 py-2 rounded text-sm bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300" // Dark mode styles
                value={filters.mileageMax ?? ''}
                onChange={e => setFilter('mileageMax', e.target.value ? Number(e.target.value) : undefined)}
                aria-label="Maximum mileage"
              >
                <option value="">To</option>
                {mileageSteps.map(m => (
                  <option key={m} value={m}>
                    {m.toLocaleString()} mi
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Make Filter Section */}
        <div className="border-t pt-6"> {/* Added top border for separation */}
          <button
            onClick={() => setOpen(p => ({ ...p, make: !p.make }))}
            className="flex justify-between w-full text-sm font-medium mb-2"
            aria-expanded={open.make}
            aria-controls="make-filter-content"
          >
            <span>Make</span>
            {open.make ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {open.make && (
            <div id="make-filter-content">
              <div className="relative mb-2">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search makes"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:focus:ring-blue-600" // Dark mode styles
                  aria-label="Search makes"
                />
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {/* Display a message if no brands are loaded or found */}
                {!brands ? (
                  <div className="text-gray-500 text-sm text-center py-4">Loading brands...</div>
                ) : brands.length === 0 ? (
                  <div className="text-gray-500 text-sm text-center py-4">No brands found.</div>
                ) : (
                  brands
                    ?.filter(brand => brand.name.toLowerCase().includes(search.toLowerCase()))
                    .map(brand => (
                      <button
                        key={brand.id}
                        onClick={() => setFilter('make', brand.id)}
                        className={cn(
                          'w-full flex justify-between items-center px-3 py-2 rounded-md border',
                          filters.make === brand.id
                            ? 'bg-black text-white border-black dark:bg-gray-700 dark:border-gray-700' // Dark mode styles
                            : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700' // Dark mode styles
                        )}
                        aria-pressed={filters.make === brand.id}
                      >
                        <div className="flex items-center gap-2">
                          {/* Ensure alt text for images */}
                          {brand.logo && <img src={brand.logo} alt={`${brand.name} logo`} className="h-5 w-auto" />}
                          <span className="text-sm">{brand.name}</span>
                        </div>
                        <span className="text-xs font-semibold">{brand.count}</span>
                      </button>
                    ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Body style Filter Section */}
        <div className="border-t pt-6"> {/* Added top border for separation */}
          <button
            onClick={() => setOpen(p => ({ ...p, bodyType: !p.bodyType }))}
            className="flex justify-between w-full text-sm font-medium mb-2"
            aria-expanded={open.bodyType}
            aria-controls="bodytype-filter-content"
          >
            <span>Body style</span>
            {open.bodyType ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {open.bodyType && (
            <div id="bodytype-filter-content" className="max-h-64 overflow-y-auto border rounded-lg p-2 space-y-2 bg-white dark:bg-gray-900 dark:border-gray-700"> {/* Dark mode styles */}
              {/* Display a message if no body types are loaded or found */}
              {!bodyTypes ? (
                <div className="text-gray-500 text-sm text-center py-4">Loading body types...</div>
              ) : bodyTypes.length === 0 ? (
                <div className="text-gray-500 text-sm text-center py-4">No body types found.</div>
              ) : (
                bodyTypes?.map(entry => (
                  <label key={entry.type} className="flex items-center justify-between text-sm cursor-pointer dark:text-gray-300"> {/* Dark mode styles */}
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="bodyType"
                        value={entry.type}
                        checked={filters.bodyType === entry.type}
                        onChange={() => setFilter('bodyType', entry.type)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600" // Dark mode styles
                      />
                      <span>{entry.type}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{entry.count.toLocaleString()}</span> {/* Dark mode styles */}
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        {/* Drive & Features Section */}
        <div className="space-y-4 border-t pt-4 mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Drive & Features</h3> {/* Dark mode styles */}

          {/* Drive type */}
          <div>
            <label htmlFor="drive-type-select" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Drive Type</label> {/* Dark mode styles and htmlFor */}
            <select
              id="drive-type-select" // Added ID for accessibility
              className="w-full border px-2 py-2 rounded text-sm bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300" // Dark mode styles
              value={filters.drive ?? ''}
              onChange={e => setFilter('drive', e.target.value || undefined)}
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
            <label htmlFor="seats-select" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Seats</label> {/* Dark mode styles and htmlFor */}
            <select
              id="seats-select" // Added ID for accessibility
              className="w-full border px-2 py-2 rounded text-sm bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300" // Dark mode styles
              value={filters.seats ?? ''}
              onChange={e => setFilter('seats', e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">Any</option>
              {[2, 4, 5, 6, 7, 8, 9].map(s => (
                <option key={s} value={s}>
                  {s} seats
                </option>
              ))}
            </select>
          </div>

          {/* Binary options (checkboxes) */}
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray-300"> {/* Dark mode styles */}
              <input
                type="checkbox"
                checked={filters.towHitchPossible ?? false}
                onChange={e => setFilter('towHitchPossible', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600" // Dark mode styles
              />
              Tow Hitch
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray-300"> {/* Dark mode styles */}
              <input
                type="checkbox"
                checked={filters.evDedicatedPlatform ?? false}
                onChange={e => setFilter('evDedicatedPlatform', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600" // Dark mode styles
              />
              EV Platform
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray-300"> {/* Dark mode styles */}
              <input
                type="checkbox"
                checked={filters.roofRails ?? false}
                onChange={e => setFilter('roofRails', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600" // Dark mode styles
              />
              Roof Rails
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray-300"> {/* Dark mode styles */}
              <input
                type="checkbox"
                checked={filters.heatPump ?? false}
                onChange={e => setFilter('heatPump', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600" // Dark mode styles
              />
              Heat Pump
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}
