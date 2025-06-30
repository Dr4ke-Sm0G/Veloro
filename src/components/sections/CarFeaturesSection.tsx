"use client";

import { useState } from "react";
import { ChevronDown, BatteryCharging, PlugZap, GaugeCircle, Leaf, ThermometerSnowflake, Ruler, ShieldCheck, Share2 } from "lucide-react";

function displayFeature(label: string, value?: string | number | boolean | null): string | null {
  if (typeof value === "boolean") return `${value ? "✅" : "❌"} ${label}`;
  if (value != null && value !== "") return `${label}: ${value}`;
  return null;
}

type Props = {
  data: {
    batterySpec?: any;
    chargingSpec?: any;
    performanceSpec?: any;
    efficiencySpec?: any;
    dimensionSpec?: any;
    realConsumption?: any;
    safetyRating?: any;
    v2xSpec?: any;
  };
};

import type { ReactNode } from "react";

const ICONS: Record<string, ReactNode> = {

  Battery: <BatteryCharging className="w-5 h-5 text-gray-500" />,
  Charging: <PlugZap className="w-5 h-5 text-gray-500" />,
  Performance: <GaugeCircle className="w-5 h-5 text-gray-500" />,
  Efficiency: <Leaf className="w-5 h-5 text-gray-500" />,
  "Real World Consumption": <ThermometerSnowflake className="w-5 h-5 text-gray-500" />,
  Dimensions: <Ruler className="w-5 h-5 text-gray-500" />,
  "Safety & Ratings": <ShieldCheck className="w-5 h-5 text-gray-500" />,
  "V2X Features": <Share2 className="w-5 h-5 text-gray-500" />,
};

export default function CarFeaturesSection({ data }: Props) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggle = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const categories = [
    {
      question: "Battery",
      features: [
        displayFeature("Battery Type", data.batterySpec?.batteryType),
        displayFeature("Usable Capacity", data.batterySpec?.useableCapacity ? data.batterySpec.useableCapacity + " kWh" : "N/A"),
        displayFeature("Architecture", data.batterySpec?.architecture),
        displayFeature("Cathode Material", data.batterySpec?.cathodeMaterial),
        displayFeature("Voltage", data.batterySpec?.nominalVoltage + " V"),
        displayFeature("Warranty Period", data.batterySpec?.warrantyPeriod),
        displayFeature("Warranty Mileage", data.batterySpec?.warrantyMileage),
      ].filter(Boolean) as string[],
    },
    {
      question: "Charging",
      features: [
        displayFeature("AC Port", data.chargingSpec?.acPortType),
        displayFeature("AC Power", data.chargingSpec?.acPowerKW + " kW"),
        displayFeature("AC Time", data.chargingSpec?.acChargeTime),
        displayFeature("DC Max Power", data.chargingSpec?.dcMaxPowerKW + " kW"),
        displayFeature("DC Power 10-80%", data.chargingSpec?.dcPower10to80KW + " kW"),
        displayFeature("Plug & Charge", data.chargingSpec?.plugAndChargeSupported),
        displayFeature("Preconditioning", data.chargingSpec?.preconditioningPossible),
      ].filter(Boolean) as string[],
    },
    {
      question: "Performance",
      features: [
        displayFeature("0–100 km/h", data.performanceSpec?.acceleration0100Sec + " s"),
        displayFeature("Top Speed", data.performanceSpec?.topSpeedKmh + " km/h"),
        displayFeature("Range", data.performanceSpec?.electricRangeKm + " km"),
        displayFeature("Power", data.performanceSpec?.totalPowerKw + " kW"),
        displayFeature("Torque", data.performanceSpec?.totalTorqueNm + " Nm"),
      ].filter(Boolean) as string[],
    },
    {
      question: "Efficiency",
      features: [
        displayFeature("Vehicle Consumption", data.efficiencySpec?.vehicleConsumptionWhKm + " Wh/km"),
        displayFeature("Rated Consumption", data.efficiencySpec?.ratedConsumptionWhKm + " Wh/km"),
        displayFeature("Fuel Eq (rated)", data.efficiencySpec?.ratedFuelEqL100km + " L/100km"),
        displayFeature("CO2 Emissions", data.efficiencySpec?.co2EmissionsGKm + " g/km"),
      ].filter(Boolean) as string[],
    },
    {
      question: "Real World Consumption",
      features: [
        displayFeature("Cold City", data.realConsumption?.cityColdWhKm + " Wh/km"),
        displayFeature("Cold Highway", data.realConsumption?.highwayColdWhKm + " Wh/km"),
        displayFeature("Mild Combined", data.realConsumption?.combinedMildWhKm + " Wh/km"),
      ].filter(Boolean) as string[],
    },
    {
      question: "Dimensions",
      features: [
        displayFeature("Length", data.dimensionSpec?.lengthMm + " mm"),
        displayFeature("Width", data.dimensionSpec?.widthMm + " mm"),
        displayFeature("Wheelbase", data.dimensionSpec?.wheelbaseMm + " mm"),
        displayFeature("Seats", data.dimensionSpec?.seats),
        displayFeature("Roof Load", data.dimensionSpec?.roofLoadKg + " kg"),
        displayFeature("Tow Hitch", data.dimensionSpec?.towHitchPossible),
      ].filter(Boolean) as string[],
    },
    {
      question: "Safety & Ratings",
      features: [
        displayFeature("Adult Occupant", data.safetyRating?.adultOccupantPercent + "%"),
        displayFeature("Child Occupant", data.safetyRating?.childOccupantPercent + "%"),
        displayFeature("Assist Systems", data.safetyRating?.safetyAssistPercent + "%"),
      ].filter(Boolean) as string[],
    },
    {
      question: "V2X Features",
      features: [
        displayFeature("V2L Supported", data.v2xSpec?.v2lSupported),
        displayFeature("V2H AC", data.v2xSpec?.v2hAcSupported),
        displayFeature("V2G DC", data.v2xSpec?.v2gDcSupported),
      ].filter(Boolean) as string[],
    },
  ];

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Car Features</h2>
      <div className="rounded-xl border overflow-hidden divide-y divide-gray-200">
        {categories.map((item, index) => {
          const isOpen = openIndexes.includes(index);
          const icon = ICONS[item.question] ?? null;
          return (
            item.features.length > 0 && (
              <div key={index}>
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between font-semibold hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    {icon}
                    <span>{item.question}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 px-4 py-3" : "max-h-0 px-4 py-0"
                    } text-gray-700`}
                >
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {item.features.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              </div>
            )
          );
        })}
      </div>
    </section>
  );
}
