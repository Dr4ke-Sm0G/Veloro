// src/lib/validators/variantSchema.ts
import { z } from "zod";

/** Utilitaire pour Decimal : accepte string ou number */
const asDecimal = () =>
  z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) =>
      val != null && !isNaN(+val) ? parseFloat(val.toString()) : undefined
    );

/** Utilitaire pour Int */
const asInt = () =>
  z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) =>
      val != null && !isNaN(+val) ? Math.round(Number(val)) : undefined
    );

/** Boolean sûr */
const asBoolean = () =>
  z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((v) => {
      if (typeof v === "boolean") return v;
      if (v === "true") return true;
      if (v === "false") return false;
      return undefined;
    });

export const BatterySpecSchema = z.object({
  nominalCapacity: asDecimal(),
  useableCapacity: asDecimal(),
  batteryType: z.string().optional(),
  architecture: z.string().optional(),
  cathodeMaterial: z.string().optional(),
  packConfiguration: z.string().optional(),
  nominalVoltage: asDecimal(),
  formFactor: z.string().optional(),
  warrantyPeriod: z.string().optional(),
  warrantyMileage: z.string().optional(),
});

export const ChargingSpecSchema = z.object({
  acPortType: z.string().optional(),
  portLocation: z.string().optional(),
  acPowerKW: asDecimal(),
  acChargeTime: z.string().optional(),
  acChargeSpeedKmH: asInt(),
  dcPortType: z.string().optional(),
  dcMaxPowerKW: asDecimal(),
  dcPower10to80KW: asDecimal(),
  dcChargeSpeedKmH: asInt(),
  plugAndChargeSupported: asBoolean(),
  autochargeSupported: asBoolean(),
  iso15118Supported: asBoolean(),
  preconditioningPossible: asBoolean(),
  preconditioningNav: asBoolean(),
});

export const PerformanceSpecSchema = z.object({
  acceleration0100Sec: asDecimal(),
  topSpeedKmh: asInt(),
  electricRangeKm: asInt(),
  totalPowerKw: asDecimal(),
  totalTorqueNm: asDecimal(),
  drive: z.string().optional(),
});

export const EfficiencySpecSchema = z.object({
  rangeKm: asInt(),
  vehicleConsumptionWhKm: asInt(),
  ratedConsumptionWhKm: asInt(),
  co2EmissionsGKm: asInt(),
  ratedFuelEqL100km: asDecimal(),
  vehicleFuelEqL100km: asDecimal(),
});

export const RealConsumptionSchema = z.object({
  cityColdWhKm: asInt(),
  highwayColdWhKm: asInt(),
  combinedColdWhKm: asInt(),
  cityMildWhKm: asInt(),
  highwayMildWhKm: asInt(),
  combinedMildWhKm: asInt(),
});

export const DimensionSpecSchema = z.object({
  seats: asInt(),
  lengthMm: asInt(),
  widthMm: asInt(),
  widthWithMirrorsMm: asInt(),
  heightMm: asInt(),
  wheelbaseMm: asInt(),
  weightUnladenKg: asInt(),
  grossVehicleWeightKg: asInt(),
  maxPayloadKg: asInt(),
  cargoVolumeL: asInt(),
  cargoVolumeMaxL: asInt(),
  frunkVolumeL: asInt(),
  roofLoadKg: asInt(),
  towingWeightUnbrakedKg: asInt(),
  towingWeightBrakedKg: asInt(),
  verticalLoadMaxKg: asInt(),
  towHitchPossible: asBoolean(),
  isofix: asBoolean(),
  turningCircleM: asDecimal(),
  platform: z.string().optional(),
  evDedicatedPlatform: asBoolean(),
  carBody: z.string().optional(),
  segment: z.string().optional(),
  roofRails: asBoolean(),
  heatPump: asBoolean(),
});

export const V2XSpecSchema = z.object({
  v2lSupported: asBoolean(),
  exteriorOutlet: z.string().optional(),
  interiorOutlet: z.string().optional(),
  v2hAcSupported: asBoolean(),
  v2hDcSupported: asBoolean(),
  v2gAcSupported: asBoolean(),
  v2gDcSupported: asBoolean(),
});

export const SafetyRatingSchema = z.object({
  ratingYear: asInt(),
  adultOccupantPercent: asInt(),
  childOccupantPercent: asInt(),
  vulnerableRoadUsersPct: asInt(),
  safetyAssistPercent: asInt(),
});

export const AvailabilitySchema = z.object({
  availableFrom: z.coerce.date().optional(),
  availableTo: z.coerce.date().optional(),
});

export const PriceSchema = z.object({
  country: z.string(),
  price: asDecimal(), // Prisma.Decimal
});

export const VariantSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  slug: z.string(),
  year: asInt(),
  bodyType: z.string().optional(),
  modelId: z.string().optional(),

  // Specs
  batterySpec: BatterySpecSchema.optional(),
  chargingSpec: ChargingSpecSchema.optional(),
  performanceSpec: PerformanceSpecSchema.optional(),
  efficiencySpec: EfficiencySpecSchema.optional(),
  realConsumption: RealConsumptionSchema.optional(),
  dimensionSpec: DimensionSpecSchema.optional(),
  v2xSpec: V2XSpecSchema.optional(),
  safetyRating: SafetyRatingSchema.optional(),
  availability: AvailabilitySchema.optional(),

  prices: z.array(PriceSchema).optional(),
});

export const TechSpecsSchema = VariantSchema.pick({
  performanceSpec: true,
  efficiencySpec: true,
  chargingSpec: true,
  batterySpec: true,
  dimensionSpec: true,
  realConsumption: true,
  v2xSpec: true,
  safetyRating: true,
});
