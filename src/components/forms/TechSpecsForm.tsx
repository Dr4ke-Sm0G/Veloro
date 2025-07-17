"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent } from "react";

// 🔧 INTERFACES & TYPES
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

interface FieldProps {
  label: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  step?: string;
}

// 헬 FONCTIONS UTILITAIRES
const parseInputValue = (value: string, field: string): string | number | undefined => {
  if (value === "") return undefined;
  // Champs qui doivent rester des chaînes de caractères
  if (field === "drive" || field.endsWith("Time")) return value;

  const num = parseFloat(value);
  return isNaN(num) ? undefined : num;
};

// Cette fonction peut rester exportée pour être utilisée dans la page parente
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

  return Object.fromEntries(
    Object.entries(result).filter(([_, v]) => v !== undefined)
  ) as TechSpecs;
}

// ✅ SOUS-COMPOSANTS STABLES (définis en dehors du composant principal)
function SectionTitle({ title }: { title: string }) {
  return (
    <div className="md:col-span-2 mt-6 mb-2">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", step }: FieldProps) {
  return (
    <div className="md:col-span-1">
      <Label>{label}</Label>
      <Input
        type={type}
        step={step}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

// ✨ COMPOSANT PRINCIPAL
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
    // Gère l'affichage des nombres pour éviter les décimales inutiles
    return typeof value === "number"
      ? value.toString() // Laisser l'input gérer le formatage pour une meilleure UX
      : value;
  };

  return (
    <Card>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {/* PERFORMANCE */}
        <SectionTitle title="Performance" />
        <Field label="Puissance (kW)" type="number" value={getValue("performanceSpec", "totalPowerKw")} onChange={(e) => handleChange("performanceSpec", "totalPowerKw", e.target.value)} />
        <Field label="Couple (Nm)" type="number" value={getValue("performanceSpec", "totalTorqueNm")} onChange={(e) => handleChange("performanceSpec", "totalTorqueNm", e.target.value)} />
        <Field label="0–100 km/h (s)" type="number" step="0.1" value={getValue("performanceSpec", "acceleration0100Sec")} onChange={(e) => handleChange("performanceSpec", "acceleration0100Sec", e.target.value)} />
        <Field label="Vitesse max (km/h)" type="number" value={getValue("performanceSpec", "topSpeedKmh")} onChange={(e) => handleChange("performanceSpec", "topSpeedKmh", e.target.value)} />
        <Field label="Autonomie électrique (km)" type="number" value={getValue("performanceSpec", "electricRangeKm")} onChange={(e) => handleChange("performanceSpec", "electricRangeKm", e.target.value)} />
        <Field label="Transmission" value={getValue("performanceSpec", "drive")} onChange={(e) => handleChange("performanceSpec", "drive", e.target.value)} />

        {/* EFFICACITÉ */}
        <SectionTitle title="Efficacité" />
        <Field label="Autonomie WLTP (km)" type="number" value={getValue("efficiencySpec", "rangeKm")} onChange={(e) => handleChange("efficiencySpec", "rangeKm", e.target.value)} />
        <Field label="Conso. (Wh/km)" type="number" value={getValue("efficiencySpec", "vehicleConsumptionWhKm")} onChange={(e) => handleChange("efficiencySpec", "vehicleConsumptionWhKm", e.target.value)} />
        <Field label="Fuel Eq. (rated)" type="number" step="0.01" value={getValue("efficiencySpec", "ratedFuelEqL100km")} onChange={(e) => handleChange("efficiencySpec", "ratedFuelEqL100km", e.target.value)} />
        <Field label="Fuel Eq. (vehicle)" type="number" step="0.01" value={getValue("efficiencySpec", "vehicleFuelEqL100km")} onChange={(e) => handleChange("efficiencySpec", "vehicleFuelEqL100km", e.target.value)} />

        {/* RECHARGE */}
        <SectionTitle title="Recharge" />
        <Field label="Recharge AC (kW)" type="number" value={getValue("chargingSpec", "acPowerKW")} onChange={(e) => handleChange("chargingSpec", "acPowerKW", e.target.value)} />
        <Field label="Temps recharge AC (h)" value={getValue("chargingSpec", "acChargeTime")} onChange={(e) => handleChange("chargingSpec", "acChargeTime", e.target.value)} />
        <Field label="Recharge DC max (kW)" type="number" value={getValue("chargingSpec", "dcMaxPowerKW")} onChange={(e) => handleChange("chargingSpec", "dcMaxPowerKW", e.target.value)} />
        <Field label="Recharge DC 10-80 (kW)" type="number" value={getValue("chargingSpec", "dcPower10to80KW")} onChange={(e) => handleChange("chargingSpec", "dcPower10to80KW", e.target.value)} />
        <Field label="Vitesse recharge DC (km/h)" type="number" value={getValue("chargingSpec", "dcChargeSpeedKmH")} onChange={(e) => handleChange("chargingSpec", "dcChargeSpeedKmH", e.target.value)} />

        {/* BATTERIE */}
        <SectionTitle title="Batterie" />
        <Field label="Capacité nominale (kWh)" type="number" step="0.1" value={getValue("batterySpec", "nominalCapacity")} onChange={(e) => handleChange("batterySpec", "nominalCapacity", e.target.value)} />
        <Field label="Capacité utile (kWh)" type="number" step="0.1" value={getValue("batterySpec", "useableCapacity")} onChange={(e) => handleChange("batterySpec", "useableCapacity", e.target.value)} />
        <Field label="Tension nominale (V)" type="number" value={getValue("batterySpec", "nominalVoltage")} onChange={(e) => handleChange("batterySpec", "nominalVoltage", e.target.value)} />

        {/* DIMENSIONS */}
        <SectionTitle title="Dimensions" />
        <Field label="Rayon de braquage (m)" type="number" step="0.1" value={getValue("dimensionSpec", "turningCircleM")} onChange={(e) => handleChange("dimensionSpec", "turningCircleM", e.target.value)} />

      </CardContent>
    </Card>
  );
}