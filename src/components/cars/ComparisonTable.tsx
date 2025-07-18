// src/components/cars/ComparisonTable.tsx
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Rocket, BatteryCharging, Ruler, Weight, Box, Thermometer, Zap,
  CheckCircle2, XCircle, Anchor, Plug, Power, Car, Users
} from "lucide-react";
import React from "react";

// ──────────────────────────────────────
// TYPES (INCHANGÉS)
// ──────────────────────────────────────

interface PerformanceSpec {
  acceleration0100Sec: number | null;
  topSpeedKmh: number | null;
  electricRangeKm: number | null;
  totalPowerKw: number | null;
  totalTorqueNm: number | null;
  drive: string | null;
}
interface BatterySpec {
  useableCapacity: number | null;
  architecture: string | null;
  warrantyPeriod: string | null;
  warrantyMileage: string | null;
}
interface ChargingSpec {
  acPowerKW: number | null;
  dcMaxPowerKW: number | null;
  dcChargeSpeedKmH: number | null;
  preconditioningNav: boolean | null;
}
interface DimensionSpec {
  seats: number | null;
  lengthMm: number | null;
  widthMm: number | null;
  heightMm: number | null;
  weightUnladenKg: number | null;
  cargoVolumeL: number | null;
  frunkVolumeL: number | null;
  towingWeightBrakedKg: number | null;
  towHitchPossible: boolean | null;
  heatPump: boolean | null;
  evDedicatedPlatform: boolean | null;
}
interface V2XSpec {
  v2lSupported: boolean | null;
}
interface EfficiencySpec {
  vehicleConsumptionWhKm: number | null;
}
interface ComparisonVariant {
  id: string;
  trim: string;
  year: number | null;
  brandName: string;
  modelName: string;
  price: string;
  bodyType: string | null;
  performanceSpec: PerformanceSpec;
  batterySpec: BatterySpec;
  chargingSpec: ChargingSpec;
  dimensionSpec: DimensionSpec;
  v2xSpec: V2XSpec;
  efficiencySpec: EfficiencySpec;
}
interface ComparisonTableProps {
  variants: Array<ComparisonVariant>;
}

// ──────────────────────────────────────
// DÉFINITION DES SPÉCIFICATIONS (INCHANGÉES)
// ──────────────────────────────────────

const renderBoolean = (value: any) => {
  if (value === null || typeof value === "undefined") return "–";
  return value ? (
    <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-500" />
  ) : (
    <XCircle className="mx-auto h-5 w-5 text-rose-500" />
  );
};

const specGroups = [
  {
    groupName: "Général",
    icon: Car,
    specs: [
      { key: "price", label: "Prix (indicatif)", unit: " €" },
      { key: "bodyType", label: "Carrosserie" },
    ],
  },
  {
    groupName: "Performances & Efficacité",
    icon: Rocket,
    specs: [
      { key: "performanceSpec.electricRangeKm", label: "Autonomie (cycle mixte)", unit: " km" },
      { key: "efficiencySpec.vehicleConsumptionWhKm", label: "Consommation", unit: " Wh/km" },
      { key: "performanceSpec.acceleration0100Sec", label: "0-100 km/h", unit: " s" },
      { key: "performanceSpec.topSpeedKmh", label: "Vitesse maximale", unit: " km/h" },
      { key: "performanceSpec.totalPowerKw", label: "Puissance (kW/ch)", render: (val: number | null) => val ? `${val} / ${Math.round(val * 1.341)}` : "–" },
      { key: "performanceSpec.totalTorqueNm", label: "Couple", unit: " Nm" },
      { key: "performanceSpec.drive", label: "Transmission" },
    ],
  },
  {
    groupName: "Batterie & Recharge",
    icon: BatteryCharging,
    specs: [
      { key: "batterySpec.useableCapacity", label: "Capacité batterie (utile)", unit: " kWh" },
      { key: "chargingSpec.dcMaxPowerKW", label: "Puissance de charge DC (max)", unit: " kW" },
      { key: "chargingSpec.dcChargeSpeedKmH", label: "Vitesse de charge DC", unit: " km/h" },
      { key: "chargingSpec.acPowerKW", label: "Puissance de charge AC", unit: " kW" },
      { key: "batterySpec.architecture", label: "Architecture" },
      { key: "chargingSpec.preconditioningNav", label: "Pré-conditionnement auto.", render: renderBoolean },
    ],
  },
  {
    groupName: "Dimensions & Aspects Pratiques",
    icon: Ruler,
    specs: [
      { key: "dimensionSpec.seats", label: "Places", icon: Users },
      { key: "dimensionSpec.cargoVolumeL", label: "Volume du coffre", unit: " L", icon: Box,
        render: (val: number | null, variant: ComparisonVariant) => {
            const frunk = variant.dimensionSpec.frunkVolumeL;
            if (!val) return frunk ? `– (+ ${frunk} L frunk)` : "–";
            return `${val}${frunk ? ` (+ ${frunk} L frunk)` : ""}`;
        }
      },
      { key: "dimensionSpec.weightUnladenKg", label: "Poids à vide (EU)", unit: " kg", icon: Weight },
      { key: "dimensionSpec.towingWeightBrakedKg", label: "Capacité de remorquage", unit: " kg", icon: Anchor, render: (val: number | null) => val ? `${val} kg` : "Non spécifié" },
      { key: "dimensionSpec.lengthMm", label: "Dimensions (L×l×h)",
        render: (_: any, v: ComparisonVariant) => {
          const { lengthMm, widthMm, heightMm } = v.dimensionSpec;
          if (!lengthMm || !widthMm || !heightMm) return "–";
          return `${lengthMm}×${widthMm}×${heightMm} mm`;
        },
      },
    ],
  },
  {
    groupName: "Équipements & Technologies",
    icon: Zap,
    specs: [
      { key: "dimensionSpec.heatPump", label: "Pompe à chaleur", render: renderBoolean, icon: Thermometer },
      { key: "v2xSpec.v2lSupported", label: "Vehicle-to-Load (V2L)", render: renderBoolean, icon: Plug },
      { key: "dimensionSpec.evDedicatedPlatform", label: "Plateforme 100% électrique", render: renderBoolean, icon: Power },
    ],
  },
];

// ──────────────────────────────────────
// HELPER (INCHANGÉ)
// ──────────────────────────────────────
function getNestedValue(obj: any, path: string): any {
  if (!path) return undefined;
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

// ──────────────────────────────────────
// COMPOSANT PRINCIPAL (REMANIÉ)
// ──────────────────────────────────────
export default function ComparisonTable({ variants }: ComparisonTableProps) {
  if (!variants || variants.length === 0) {
    return <p className="mt-6 text-center text-gray-500">Aucun véhicule à comparer.</p>;
  }

  // Fonction pour calculer la valeur à afficher
  const getDisplayValue = (spec: any, variant: ComparisonVariant) => {
    const value = getNestedValue(variant, spec.key);
    if (spec.render) {
      return spec.render(value, variant);
    }
    if (value !== null && typeof value !== 'undefined') {
      return `${value}${spec.unit || ""}`;
    }
    return "–";
  };
  
  return (
    <section className="mt-8 sm:mt-12">
      {/* VUE ORDINATEUR (Tableau) */}
      <div className="hidden md:block border border-gray-200/75 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader className="bg-gray-50/75">
              <TableRow>
                <TableHead className="sticky left-0 bg-gray-50/75 z-20 py-3.5 px-4 text-left text-sm font-semibold text-gray-900 w-1/4">
                  Spécification
                </TableHead>
                {variants.map((v) => (
                  <TableHead key={v.id} className="px-4 py-3.5 text-center text-sm font-semibold text-gray-900">
                    <div className="font-bold text-base">{v.brandName} {v.modelName}</div>
                    <div className="font-normal text-gray-500">{v.trim} • {v.year}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 bg-white">
              {specGroups.map((group) => (
                <React.Fragment key={group.groupName}>
                  <TableRow className="bg-slate-50">
                    <TableCell colSpan={variants.length + 1} className="sticky left-0 bg-slate-50 z-10 px-4 py-2 text-sm font-semibold text-slate-700">
                      <div className="flex items-center gap-2.5">
                        {group.icon && <group.icon className="h-4 w-4" />}
                        {group.groupName}
                      </div>
                    </TableCell>
                  </TableRow>
                  {group.specs.map((spec) => (
                    <TableRow key={spec.key}>
                      <TableCell className="sticky left-0 bg-white z-10 py-3 px-4 text-sm font-medium text-gray-800">
                        {spec.label}
                      </TableCell>
                      {variants.map((v) => (
                        <TableCell key={`${v.id}-${spec.key}`} className="px-4 py-3 text-center text-sm text-gray-600">
                          {getDisplayValue(spec, v)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* VUE MOBILE (Cartes) */}
      <div className="md:hidden space-y-8">
        {specGroups.map((group) => (
          <div key={group.groupName} className="bg-white border rounded-lg p-4 shadow-sm">
             <div className="flex items-center gap-2.5 mb-4">
                {group.icon && <group.icon className="h-5 w-5 text-slate-600" />}
                <h2 className="text-lg font-bold text-slate-800">{group.groupName}</h2>
              </div>
              <div className="space-y-4">
                {group.specs.map((spec) => (
                  <div key={spec.key} className="border-t border-gray-200/80 pt-3">
                    <p className="text-sm font-semibold text-gray-800 mb-2">{spec.label}</p>
                    <div className="space-y-2">
                    {variants.map((v) => (
                        <div key={v.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">{v.brandName} {v.modelName}</span>
                            <span className="font-medium text-gray-700 text-right">{getDisplayValue(spec, v)}</span>
                        </div>
                    ))}
                    </div>
                  </div>
                ))}
              </div>
          </div>
        ))}
      </div>
    </section>
  );
}