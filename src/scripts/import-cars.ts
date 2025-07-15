// src/scripts/import-cars.ts
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { createObjectCsvWriter } from 'csv-writer';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parseNumber = (val?: unknown): number | undefined => {
  if (typeof val !== 'string') return undefined;
  if (!val || val.includes('No Data') || val.includes('-')) return undefined;
  const cleaned = parseFloat(val.replace(/[^\d.,-]/g, '').replace(',', '.'));
  return isNaN(cleaned) ? undefined : cleaned;
};

function getField(obj: any, key: string): string | undefined {
  return obj?.[`${key} *`] ?? obj?.[key];
}
function getFromLongdistance(car: any, key: string): string | undefined {
  return car.longdistance?.find((entry: any) => key in entry)?.[key];
}

const getRealConsumption = (obj: any, key: string): number | undefined => {
  return parseNumber(obj?.[`${key} *`] ?? obj?.[key]);
};

const extractBrandAndModel = (fullName: string) => {
  const parts = fullName.split(' ');
  if (parts.length < 2) throw new Error(`Invalid model name: ${fullName}`);
  return {
    brand: parts[0],
    model: fullName.replace(parts[0], '').trim(),
  };
};

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD") // transforme les lettres accentuées
    .replace(/[\u0300-\u036f]/g, "") // supprime les diacritiques
    .replace(/[^a-z0-9]+/g, "-") // remplace tout caractère non alphanumérique
    .replace(/^-+|-+$/g, "") // supprime les tirets au début et à la fin
    .replace(/--+/g, "-"); // évite les doubles tirets
}


function mergeObjectArray(arr: any[]): Record<string, string> {
  return arr.reduce((acc, obj) => ({ ...acc, ...obj }), {});
}

function parseBoolean(value: any): boolean | undefined {
  if (typeof value !== 'string') return undefined;
  return value.trim().toLowerCase() === 'yes';
}

function extractEfficiencyDetails(eff: any[]): Record<string, number | undefined> {
  if (!Array.isArray(eff)) return {};
  const merged = Object.assign({}, ...eff);


  return {
    rangeKm: parseNumber(merged['Range']),
    vehicleConsumptionWhKm: parseNumber(merged['Vehicle Consumption']),
    ratedConsumptionWhKm: parseNumber(merged['Rated Consumption']),
    co2EmissionsGKm: parseNumber(merged['CO2 Emissions']),
    ratedFuelEqL100km: parseNumber(merged['Rated Fuel Equivalent']),
    vehicleFuelEqL100km: parseNumber(merged['Vehicle Fuel Equivalent']),
  };
}
function extractSafetyRating(car: any): Record<string, number | null> {
  const data = car.longdistance?.find((entry: any) => entry['Adult Occupant'] || entry['Safety Assist']) ?? {};
  const percent = (val: string) => parseInt(val?.replace('%', '').trim(), 10) || null;

  return {
    ratingYear: parseInt(data['Year']) || null,
    adultOccupantPercent: percent(data['Adult Occupant']),
    childOccupantPercent: percent(data['Child Occupant']),
    vulnerableRoadUsersPct: percent(data['Vulnerable Road Users']),
    safetyAssistPercent: percent(data['Safety Assist']),
  };
}

const importLog: { variant: string; brand: string; status: string; message?: string }[] = [];

async function importCars(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const cars = JSON.parse(raw);

  for (const car of cars) {
    try {
      const { brand, model } = extractBrandAndModel(car.model);

      const brandRecord = await prisma.brand.upsert({
        where: { name: brand },
        update: {},
        create: { name: brand, slug: slugify(brand) },
      });

      const modelRecord = await prisma.model.upsert({
        where: {
          name_brandId: {
            name: model,
            brandId: brandRecord.id,
          },
        },
        update: { slug: slugify(model) },
        create: {
          name: model,
          slug: slugify(model),
          brandId: brandRecord.id,
        },
      });

      const variant = await prisma.variant.create({
        data: {
          name: car.model,
          slug: slugify(car.model),
          modelId: modelRecord.id,
          year: parseInt(car.availability?.match(/\d{4}/)?.[0] || '2020'),
          bodyType: getFromLongdistance(car, 'Car Body'),
          drive: car.performance?.find((obj: any) => obj['Drive'])?.['Drive'],

          batterySpec: {
            create: {
              nominalCapacity: parseNumber(getField(car.battery?.[0], 'Nominal Capacity')),
              useableCapacity:
                parseNumber(getField(car.battery?.[1], "Useable Capacity")) ??
                parseNumber(getField(car.battery?.[0], "Useable Capacity")) ??
                parseNumber(car.summary_icons?.['Useable Battery']) ??
                parseNumber(car.longdistance?.find((b: any) => b['Useable Capacity'])?.['Useable Capacity']),
              batteryType: getField(car.battery?.[0], 'Battery Type'),
              architecture: getField(car.battery?.[0], 'Architecture'),
              cathodeMaterial: getField(car.battery?.[1], 'Cathode Material'),
              packConfiguration: getField(car.battery?.[1], 'Pack Configuration'),
              nominalVoltage: parseNumber(getField(car.battery?.[1], 'Nominal Voltage')),
              formFactor: getField(car.battery?.[1], 'Form Factor'),
              warrantyPeriod: getField(car.battery?.[0], 'Warranty Period'),
              warrantyMileage: getField(car.battery?.[0], 'Warranty Mileage'),
              
            },
          },

          chargingSpec: {
            create: (() => {
              const merged = mergeObjectArray(car.charging || []);
              return {
                acPortType: merged['Charge Port'],
                portLocation: merged['Port Location'],
                acPowerKW: parseNumber(merged['Charge Power']),
                acChargeTime: merged['Charge Time (0->235 km)'],
                acChargeSpeedKmH: parseNumber(merged['Charge Speed']),
                dcPortType: merged['Charge Port'],
                dcMaxPowerKW: parseNumber(merged['Charge Power (max)']),
                dcPower10to80KW: parseNumber(merged['Charge Power (10-80%)']),
                dcChargeSpeedKmH: parseNumber(merged['Charge Speed']),
                plugAndChargeSupported: merged['Plug & Charge Supported'] === 'Yes',
                autochargeSupported: merged['Autocharge Supported'] === 'Yes',
                iso15118Supported: merged['Supported Protocol']?.includes('ISO 15118') ?? false,
                preconditioningPossible: merged['Preconditioning Possible'] === 'Yes',
                preconditioningNav: merged['Automatically using Navigation'] === 'Yes',
              };
            })(),
          },

          performanceSpec: {
            create: {
              acceleration0100Sec: parseNumber(getField(car.performance?.[0], 'Acceleration 0 - 100 km/h')),
              topSpeedKmh: Math.round(parseNumber(getField(car.performance?.[0], 'Top Speed')) ?? 0),
              electricRangeKm: parseNumber(getField(car.performance?.[0], 'Electric Range')) ?? parseNumber(car.summary_icons?.['Real Range']),
              totalPowerKw: parseNumber(getField(car.performance?.[1], 'Total Power')),
              totalTorqueNm: parseNumber(getField(car.performance?.[1], 'Total Torque')),
              drive: getField(car.performance?.[1], 'Drive'),
            },
          },

          efficiencySpec: {
            create: {
              ...extractEfficiencyDetails(car.efficiency),
            },
          },

          realConsumption: {
            create: {
              cityColdWhKm: getRealConsumption(car['real-consumption']?.[0], 'City - Cold Weather'),
              highwayColdWhKm: getRealConsumption(car['real-consumption']?.[0], 'Highway - Cold Weather'),
              combinedColdWhKm: getRealConsumption(car['real-consumption']?.[0], 'Combined - Cold Weather'),
              cityMildWhKm: getRealConsumption(car['real-consumption']?.[1], 'City - Mild Weather'),
              highwayMildWhKm: getRealConsumption(car['real-consumption']?.[1], 'Highway - Mild Weather'),
              combinedMildWhKm: getRealConsumption(car['real-consumption']?.[1], 'Combined - Mild Weather'),
            },
          },

          dimensionSpec: {
            create: {
              seats: parseNumber(getFromLongdistance(car, 'Seats')?.split(' ')[0]),
              lengthMm: parseNumber(getFromLongdistance(car, 'Length')),
              widthMm: parseNumber(getFromLongdistance(car, 'Width')),
              widthWithMirrorsMm: parseNumber(getFromLongdistance(car, 'Width with mirrors')),
              heightMm: parseNumber(getFromLongdistance(car, 'Height')),
              wheelbaseMm: parseNumber(getFromLongdistance(car, 'Wheelbase')),
              weightUnladenKg: parseNumber(getFromLongdistance(car, 'Weight Unladen (EU)')),
              grossVehicleWeightKg: parseNumber(getFromLongdistance(car, 'Gross Vehicle Weight (GVWR)')),
              maxPayloadKg: parseNumber(getFromLongdistance(car, 'Max. Payload')),
              cargoVolumeL: parseNumber(getFromLongdistance(car, 'Cargo Volume')),
              cargoVolumeMaxL: parseNumber(getFromLongdistance(car, 'Cargo Volume Max')),
              frunkVolumeL: parseNumber(getFromLongdistance(car, 'Cargo Volume Frunk')),
              roofLoadKg: parseNumber(getFromLongdistance(car, 'Roof Load')),
              towingWeightUnbrakedKg: parseNumber(getFromLongdistance(car, 'Towing Weight Unbraked')),
              towingWeightBrakedKg: parseNumber(getFromLongdistance(car, 'Towing Weight Braked')),
              verticalLoadMaxKg: parseNumber(getFromLongdistance(car, 'Vertical Load Max')),
              towHitchPossible: parseBoolean(getFromLongdistance(car, 'Tow Hitch Possible')),
              isofix: parseBoolean(getFromLongdistance(car, 'Isofix')),
              turningCircleM: parseNumber(getFromLongdistance(car, 'Turning Circle')),
              platform: getFromLongdistance(car, 'Platform'),
              evDedicatedPlatform: parseBoolean(getFromLongdistance(car, 'EV Dedicated Platform')),
              carBody: getFromLongdistance(car, 'Car Body'),
              segment: getFromLongdistance(car, 'Segment'),
              roofRails: parseBoolean(getFromLongdistance(car, 'Roof Rails')),
              heatPump: parseBoolean(getFromLongdistance(car, 'Heat pump (HP)')),
            },
          },



          v2xSpec: {
            create: {
              v2lSupported: car.v2x?.some((v: any) => v['V2L Supported'] === 'Yes'),
              exteriorOutlet: getField(car.v2x?.[1], 'Exterior Outlet(s)'),
              interiorOutlet: getField(car.v2x?.[1], 'Interior Outlet(s)'),
              v2hAcSupported: car.v2x?.some((v: any) => v['V2H via AC Supported'] === 'Yes'),
              v2hDcSupported: car.v2x?.some((v: any) => v['V2H via DC Supported'] === 'Yes'),
              v2gAcSupported: car.v2x?.some((v: any) => v['V2G via AC Supported'] === 'Yes'),
              v2gDcSupported: car.v2x?.some((v: any) => v['V2G via DC Supported'] === 'Yes'),
            },
          },
          safetyRating: {
            create: extractSafetyRating(car),
          },

          availability: {
            create: {
              availableFrom: new Date(car.availability?.split(' - ')[0] + ' 1'),
              availableTo: new Date(car.availability?.split(' - ')[1] + ' 1'),
              
            },
          },
        },
      });

      const prices = car.pricing?.[0] ?? {};
      const priceRecords = Object.entries(prices)
        .filter(([_, val]) => typeof val === 'string' && !val.includes('Not Available'))
        .map(([country, val]) => {
          const price = parseNumber(val);
          return price !== undefined ? { country, price, variantId: variant.id } : null;
        })
        .filter((p): p is { country: string; price: number; variantId: string } => p !== null);

      if (priceRecords.length) {
        await prisma.price.createMany({ data: priceRecords });
      }

      importLog.push({ variant: variant.name, brand, status: 'Imported' });
      console.log(`✅ Imported ${variant.name}`);
    } catch (e: any) {
      importLog.push({ variant: car.model, brand: car.model.split(' ')[0], status: 'Failed', message: e.message });
      console.error(`❌ Failed to import ${car.model}:`, e);
    }
  }

  const logWriter = createObjectCsvWriter({
    path: path.resolve(__dirname, '../../import-log.csv'),
    header: [
      { id: 'variant', title: 'Variant' },
      { id: 'brand', title: 'Brand' },
      { id: 'status', title: 'Status' },
      { id: 'message', title: 'Message' },
    ],
  });
  await logWriter.writeRecords(importLog);
  console.log('📝 Log written to import-log.csv');
}

const inputPath = path.resolve(__dirname, '../../data/ev-database.json');
importCars(inputPath)
  .then(() => {
    console.log('✅ Import complete');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error('❌ Import failed:', e);
    prisma.$disconnect();
    process.exit(1);
  });