// src/components/filters/PriceRangeSlider.tsx
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceRangeSliderProps {
  min: number | undefined;
  max: number | undefined;
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
  minLimit: number;
  maxLimit: number;
  step?: number;
}

export function PriceRangeSlider({
  min,
  max,
  onMinChange,
  onMaxChange,
  minLimit,
  maxLimit,
  step = 1000,
}: PriceRangeSliderProps) {
  const currentMin = min === undefined ? minLimit : min;
  const currentMax = max === undefined ? maxLimit : max;

  const handleSliderChange = (values: number[]) => {
    onMinChange(values[0]);
    onMaxChange(values[1]);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? undefined : Number(e.target.value);
    onMinChange(value);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? undefined : Number(e.target.value);
    onMaxChange(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center space-x-2">
        <div className="flex-1">
          <Label htmlFor="price-min" className="text-xs">Min (€)</Label>
          <Input
            id="price-min"
            type="number"
            value={min === undefined ? '' : min}
            onChange={handleMinInputChange}
            placeholder={String(minLimit)}
            className="mt-1"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="price-max" className="text-xs">Max (€)</Label>
          <Input
            id="price-max"
            type="number"
            value={max === undefined ? '' : max}
            onChange={handleMaxInputChange}
            placeholder={String(maxLimit)}
            className="mt-1"
          />
        </div>
      </div>
      <Slider
        min={minLimit}
        max={maxLimit}
        step={step}
        value={[currentMin, currentMax]} // Passing an array makes it a range slider
        onValueChange={handleSliderChange}
      />
    </div>
  );
}