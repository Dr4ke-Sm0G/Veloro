// src/components/filters/FilterSidebar.tsx
import React, { useState, useEffect, useMemo } from "react"; // Ensure React is imported
import { useFilterStore, VariantFilterInput } from "@/store/filter-store";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterSection } from "./FilterSection";
import { PriceRangeSlider } from "./PriceRangeSlider";
import { YearRangeSlider } from "./YearRangeSlider";
import { SearchInputWithSuggestions } from "./SearchInputWithSuggestions";
import {
  Tag,
  Car,
  DollarSign,
  Calendar,
  Gauge,
  Package,
  CarFront,
  HardHat,
  Armchair,
  Truck,
  BatteryCharging,
  Sun
} from "lucide-react";


type LocalFilterState = Partial<VariantFilterInput>;

interface FilterSidebarProps {
  inDrawer?: boolean;
  onApply?: () => void;
}

export function FilterSidebar({ inDrawer, onApply }: FilterSidebarProps) {
  const { filters, setFilter, resetAllFilters } = useFilterStore();

  const [localFilters, setLocalFilters] = useState<LocalFilterState>(filters);
  const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);


  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (name: keyof LocalFilterState, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : Number(value),
    }));
  };

  const handleSelectChange = (name: keyof LocalFilterState, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: keyof LocalFilterState, checked: boolean) => {
    setLocalFilters((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSearchSuggestion = (fullQuery: string, make?: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      searchQuery: fullQuery,
      make: make,
    }));
  };

  const handleApplyFilters = () => {
    for (const key in localFilters) {
      if (Object.prototype.hasOwnProperty.call(localFilters, key)) {
        if (key !== 'page' && key !== 'limit') {
           setFilter(key as keyof Omit<VariantFilterInput, 'page' | 'limit'>, localFilters[key as keyof LocalFilterState]);
        }
      }
    }
    onApply?.();
  };

  const handleResetFilters = () => {
    resetAllFilters();
    setLocalFilters(useFilterStore.getState().filters);
    onApply?.();
  };

  const bodyTypeOptions = [
    "Sedan", "SUV", "Hatchback", "Coupe", "Wagon", "Minivan", "Pickup",
  ];
  const driveOptions = ["FWD", "RWD", "AWD", "4WD"];
  const seatsOptions = [2, 4, 5, 7];
  const currentYear = useMemo(() => new Date().getFullYear(), []);


  return ( // <-- ADD THIS RETURN STATEMENT
    <aside
      className={`relative w-64 flex-shrink-0 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-xl transition-all ${
        inDrawer ? "" : "hidden md:block"
      }`}
      tabIndex={inDrawer ? 0 : -1}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Filters</h2>
        <Button
          variant="ghost"
          onClick={handleResetFilters}
          className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        >
          Reset
        </Button>
      </div>

      <div className="mb-6 z-20">
        <SearchInputWithSuggestions
          initialSearchQuery={localFilters.searchQuery}
          onSelectSuggestion={handleSearchSuggestion}
          onOpenChange={setIsSearchPopoverOpen}
        />
      </div>

      <div className={isSearchPopoverOpen ? "opacity-50 pointer-events-none" : ""}>
        <Accordion type="multiple" defaultValue={["price", "condition", "year"]} className="w-full">
          <FilterSection title="Condition" value="condition">
            <div className="flex items-center space-x-4">
              <RadioGroup
                value={localFilters.condition || ""}
                onValueChange={(value: "NEW" | "USED") =>
                  handleSelectChange("condition", value)
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NEW" id="condition-new" />
                  <Label htmlFor="condition-new">New</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="USED" id="condition-used" />
                  <Label htmlFor="condition-used">Used</Label>
                </div>
              </RadioGroup>
            </div>
          </FilterSection>

          <FilterSection title={<div className="flex items-center gap-2"><DollarSign size={16} /> Price Range</div>} value="price">
            <PriceRangeSlider
              min={localFilters.priceMin}
              max={localFilters.priceMax}
              onMinChange={(val) => setLocalFilters((prev) => ({ ...prev, priceMin: val }))}
              onMaxChange={(val) => setLocalFilters((prev) => ({ ...prev, priceMax: val }))}
              minLimit={0}
              maxLimit={200000}
              step={1000}
            />
          </FilterSection>

          <FilterSection title={<div className="flex items-center gap-2"><Calendar size={16} /> Year</div>} value="year">
            <YearRangeSlider
              min={localFilters.yearMin}
              max={localFilters.yearMax}
              onMinChange={(val) => setLocalFilters((prev) => ({ ...prev, yearMin: val }))}
              onMaxChange={(val) => setLocalFilters((prev) => ({ ...prev, yearMax: val }))}
              minLimit={1990}
              maxLimit={currentYear + 1}
            />
          </FilterSection>

          <FilterSection title={<div className="flex items-center gap-2"><Car size={16} /> Body Type</div>} value="bodyType">
            <Select
              value={localFilters.bodyType || ""}
              onValueChange={(value) => handleSelectChange("bodyType", value)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select Body Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {bodyTypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterSection>

          <FilterSection title={<div className="flex items-center gap-2"><Gauge size={16} /> Mileage</div>} value="mileage">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="mileage-min" className="text-xs">Min (km)</Label>
                <Input
                  id="mileage-min"
                  type="number"
                  value={localFilters.mileageMin === undefined ? '' : localFilters.mileageMin}
                  onChange={(e) => handleNumberInputChange("mileageMin", e.target.value)}
                  placeholder="0"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="mileage-max" className="text-xs">Max (km)</Label>
                <Input
                  id="mileage-max"
                  type="number"
                  value={localFilters.mileageMax === undefined ? '' : localFilters.mileageMax}
                  onChange={(e) => handleNumberInputChange("mileageMax", e.target.value)}
                  placeholder="200000"
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>
          </FilterSection>

          <FilterSection title={<div className="flex items-center gap-2"><Package size={16} /> Availability</div>} value="availability">
            <RadioGroup
              value={localFilters.availability || "ALL"}
              onValueChange={(value: "ALL" | "STOCK" | "ORDER") =>
                handleSelectChange("availability", value)
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ALL" id="availability-all" />
                <Label htmlFor="availability-all">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="STOCK" id="availability-stock" />
                <Label htmlFor="availability-stock">In Stock</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ORDER" id="availability-order" />
                <Label htmlFor="availability-order">On Order</Label>
              </div>
            </RadioGroup>
          </FilterSection>

          <FilterSection title={<div className="flex items-center gap-2"><CarFront size={16} /> Drive Type</div>} value="drive">
            <Select
              value={localFilters.drive || ""}
              onValueChange={(value) => handleSelectChange("drive", value)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select Drive Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {driveOptions.map((drive) => (
                  <SelectItem key={drive} value={drive}>
                    {drive}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterSection>

          <FilterSection title={<div className="flex items-center gap-2"><Armchair size={16} /> Seats</div>} value="seats">
            <Select
              value={localFilters.seats?.toString() || ""}
              onValueChange={(value) => handleSelectChange("seats", Number(value))}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Number of Seats" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {seatsOptions.map((seats) => (
                  <SelectItem key={seats} value={seats.toString()}>
                    {seats}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterSection>

          <FilterSection title={<div className="flex items-center gap-2"><HardHat size={16} /> Features</div>} value="features">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="towHitchPossible"
                  checked={localFilters.towHitchPossible || false}
                  onCheckedChange={(checked: boolean) =>
                    handleCheckboxChange("towHitchPossible", checked)
                  }
                  className="rounded"
                />
                <Label htmlFor="towHitchPossible">Tow Hitch Possible</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="evDedicatedPlatform"
                  checked={localFilters.evDedicatedPlatform || false}
                  onCheckedChange={(checked: boolean) =>
                    handleCheckboxChange("evDedicatedPlatform", checked)
                  }
                  className="rounded"
                />
                <Label htmlFor="evDedicatedPlatform">EV Dedicated Platform</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="roofRails"
                  checked={localFilters.roofRails || false}
                  onCheckedChange={(checked: boolean) =>
                    handleCheckboxChange("roofRails", checked)
                  }
                  className="rounded"
                />
                <Label htmlFor="roofRails">Roof Rails</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="heatPump"
                  checked={localFilters.heatPump || false}
                  onCheckedChange={(checked: boolean) =>
                    handleCheckboxChange("heatPump", checked)
                  }
                  className="rounded"
                />
                <Label htmlFor="heatPump">Heat Pump</Label>
              </div>
            </div>
          </FilterSection>
        </Accordion>
      </div>

      <div className="mt-8 flex flex-col space-y-4">
        <Button
          onClick={handleApplyFilters}
          className="w-full py-3 text-lg font-semibold rounded-2xl shadow-lg transition-all hover:scale-[1.01]"
        >
          Apply Filters
        </Button>
        <Button
          variant="outline"
          onClick={handleResetFilters}
          className="w-full py-3 text-lg font-semibold rounded-2xl transition-all hover:scale-[1.01]"
        >
          Clear All Filters
        </Button>
      </div>
    </aside>
  ); // <-- END OF RETURN STATEMENT
}