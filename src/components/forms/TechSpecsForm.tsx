"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface TechSpecs {
  performanceSpec?: Record<string, any>;
  efficiencySpec?: Record<string, any>;
  chargingSpec?: Record<string, any>;
  batterySpec?: Record<string, any>;
  dimensionSpec?: Record<string, any>;
  realConsumption?: Record<string, any>;
  v2xSpec?: Record<string, any>;
  safetyRating?: Record<string, any>;
}

interface TechSpecsFormProps {
  specs: TechSpecs;
  onSpecsChange: (specs: TechSpecs) => void;
}

const parseInputValue = (value: string, field: string): string | number | undefined => {
  if (value === "") return undefined;
  if (field === "drive" || field.endsWith("Time")) return value;

  const num = parseFloat(value);
  return isNaN(num) ? undefined : num;
};

export function cleanSpecs(specs: TechSpecs): TechSpecs {
  const cleanSection = (section?: Record<string, any>) => {
    if (!section) return undefined;
    
    const cleaned: Record<string, any> = {};
    for (const key in section) {
      const val = section[key];
      if (val !== null && val !== undefined && val !== "") {
        cleaned[key] = typeof val === 'string' ? val.trim() : val;
      }
    }
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  };

  const result: TechSpecs = {
    performanceSpec: cleanSection(specs.performanceSpec),
    efficiencySpec: cleanSection(specs.efficiencySpec),
    chargingSpec: cleanSection(specs.chargingSpec),
    batterySpec: cleanSection(specs.batterySpec),
    dimensionSpec: cleanSection(specs.dimensionSpec),
    realConsumption: cleanSection(specs.realConsumption),
    v2xSpec: cleanSection(specs.v2xSpec),
    safetyRating: cleanSection(specs.safetyRating),
  };

  // Remove undefined values from the result
  return Object.fromEntries(
    Object.entries(result).filter(([_, v]) => v !== undefined)
  ) as TechSpecs;
}

export default function TechSpecsForm({ specs, onSpecsChange }: TechSpecsFormProps) {
  const handleChange = (
    section: keyof TechSpecs,
    field: string,
    value: string
  ) => {
    const current = specs[section] ?? {};
    const parsedValue = parseInputValue(value, field);

    onSpecsChange({
      ...specs,
      [section]: {
        ...current,
        [field]: parsedValue,
      },
    });
  };

  const getValue = (section: keyof TechSpecs, field: string) => {
    const value = specs[section]?.[field];
    if (value === undefined || value === null) return "";
    return typeof value === "number"
      ? value % 1 === 0
        ? value.toString()
        : value.toFixed(2)
      : value;
  };

  return (
    <Card>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {/* PERFORMANCE */}
        <SectionTitle title="Performance" />
        <Field section="performanceSpec" field="totalPowerKw" label="Puissance (kW)" type="number" />
        <Field section="performanceSpec" field="totalTorqueNm" label="Couple (Nm)" type="number" />
        <Field section="performanceSpec" field="acceleration0100Sec" label="0–100 km/h (s)" type="number" step="0.1" />
        <Field section="performanceSpec" field="topSpeedKmh" label="Vitesse max (km/h)" type="number" />
        <Field section="performanceSpec" field="electricRangeKm" label="Autonomie électrique (km)" type="number" />
        <Field section="performanceSpec" field="drive" label="Transmission" />

        {/* EFFICIENCY */}
        <SectionTitle title="Efficacité" />
        <Field section="efficiencySpec" field="rangeKm" label="Autonomie WLTP (km)" type="number" />
        <Field section="efficiencySpec" field="vehicleConsumptionWhKm" label="Conso. (Wh/km)" type="number" />
        <Field section="efficiencySpec" field="ratedFuelEqL100km" label="Fuel Eq. (rated)" type="number" step="0.01" />
        <Field section="efficiencySpec" field="vehicleFuelEqL100km" label="Fuel Eq. (vehicle)" type="number" step="0.01" />

        {/* CHARGING */}
        <SectionTitle title="Recharge" />
        <Field section="chargingSpec" field="acPowerKW" label="Recharge AC (kW)" type="number" />
        <Field section="chargingSpec" field="acChargeTime" label="Temps recharge AC (h)" />
        <Field section="chargingSpec" field="dcMaxPowerKW" label="Recharge DC max (kW)" type="number" />
        <Field section="chargingSpec" field="dcPower10to80KW" label="Recharge DC 10-80 (kW)" type="number" />
        <Field section="chargingSpec" field="dcChargeSpeedKmH" label="Vitesse recharge DC (km/h)" type="number" />

        {/* BATTERY */}
        <SectionTitle title="Batterie" />
        <Field section="batterySpec" field="nominalCapacity" label="Capacité nominale (kWh)" type="number" step="0.1" />
        <Field section="batterySpec" field="useableCapacity" label="Capacité utile (kWh)" type="number" step="0.1" />
        <Field section="batterySpec" field="nominalVoltage" label="Tension nominale (V)" type="number" />

        {/* DIMENSION */}
        <SectionTitle title="Dimensions" />
        <Field section="dimensionSpec" field="turningCircleM" label="Rayon de braquage (m)" type="number" step="0.1" />
      </CardContent>
    </Card>
  );

  function Field({
    section,
    field,
    label,
    type = "text",
    step,
  }: {
    section: keyof TechSpecs;
    field: string;
    label: string;
    type?: string;
    step?: string;
  }) {
    return (
      <div className="md:col-span-1">
        <Label>{label}</Label>
        <Input
          type={type}
          step={step}
          value={getValue(section, field)}
          onChange={(e) => handleChange(section, field, e.target.value)}
        />
      </div>
    );
  }

  function SectionTitle({ title }: { title: string }) {
    return (
      <div className="md:col-span-2 mt-6 mb-2">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      </div>
    );
  }
}
