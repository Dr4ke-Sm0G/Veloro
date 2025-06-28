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
    .normalize('NFD') // pour enlever accents
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-') // remplace espaces et caractères spéciaux par -
    .replace(/(^-|-$)/g, ''); // enlève les - en début/fin
}

function extractSeatsFromLongdistance(longdistance: any[]): number | null {
  if (!Array.isArray(longdistance)) return null;

  const obj = longdistance.find((entry) => entry.Seats);
  if (!obj?.Seats) return null;

  const match = obj.Seats.match(/\d+/); // extrait "5" depuis "5 people"
  return match ? parseInt(match[0], 10) : null;
}

const importLog: { variant: string; brand: string; status: string; message?: string }[] = [];

async function importCars(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const cars = JSON.parse(raw);

  for (const car of cars) {
    try {
      const { brand, model } = extractBrandAndModel(car.model);

      const brandSlug = slugify(brand);

      const brandRecord = await prisma.brand.upsert({
        where: { name: brand },
        update: {},
        create: {
          name: brand,
          slug: brandSlug,
        },
      });
      const modelSlug = slugify(model);
      const variantSlug = slugify(car.model);
      const modelRecord = await prisma.model.upsert({
        where: {
          name_brandId: {
            name: model,
            brandId: brandRecord.id,
          },
        },
        update: {
          slug: modelSlug, // en cas de mise à jour
        },
        create: {
          name: model,
          slug: modelSlug,
          brandId: brandRecord.id,
        },
      });
      const variant = await prisma.variant.create({
        data: {
          name: car.model,
          slug: variantSlug,
          modelId: modelRecord.id,
          year: parseInt(car.availability?.match(/\d{4}/)?.[0] || '2020'),

          batterySpec: {
            create: {
              nominalCapacity: parseNumber(car.summary_icons?.['Useable Battery']),
              useableCapacity: parseNumber(car.summary_icons?.['Useable Battery']),
            },
          },

          chargingSpec: {
            create: {
              acPortType: car.charging?.[0]?.['Charge Port'] || undefined,
              portLocation: car.charging?.[0]?.['Port Location'] || undefined,
              acPowerKW: parseNumber(car.charging?.[0]?.['Charge Power']),
            },
          },

          performanceSpec: {
            create: {
              acceleration0100Sec: parseNumber(
                car.performance?.[0]?.['Acceleration 0 - 100 km/h'] ||
                car.performance?.[0]?.['Acceleration 0 - 100 km/h *']
              ),
              topSpeedKmh: (() => {
                const top = parseNumber(car.performance?.[0]?.['Top Speed']);
                return top !== undefined ? Math.round(top) : null;
              })(),
              electricRangeKm: parseNumber(car.performance?.[0]?.['Electric Range']) ||
                parseNumber(car.summary_icons?.['Real Range']),
              totalPowerKw: parseNumber(car.performance?.[1]?.['Total Power']),
              totalTorqueNm: parseNumber(car.performance?.[1]?.['Total Torque']),
              drive: car.performance?.[1]?.['Drive'],
            },
          },

          efficiencySpec: {
            create: {
              rangeKm: parseNumber(car.summary_icons?.['Real Range']),
              vehicleConsumptionWhKm: parseNumber(car.summary_icons?.['Efficiency']),
            },
          },

          realConsumption: {
            create: {
              cityColdWhKm: parseNumber(car['real-consumption']?.[0]?.['City - Cold Weather']),
              highwayColdWhKm: parseNumber(car['real-consumption']?.[0]?.['Highway - Cold Weather']),
              combinedColdWhKm: parseNumber(car['real-consumption']?.[0]?.['Combined - Cold Weather']),
              cityMildWhKm: parseNumber(car['real-consumption']?.[1]?.['City - Mild Weather']),
              highwayMildWhKm: parseNumber(car['real-consumption']?.[1]?.['Highway - Mild Weather']),
              combinedMildWhKm: parseNumber(car['real-consumption']?.[1]?.['Combined - Mild Weather']),
            },
          },

          dimensionSpec: {
            create: {
              seats: parseNumber(
                car.longdistance?.find((b: any) => b['Seats'])?.['Seats']
              ),
              lengthMm: parseNumber(car.dimensions?.[0]?.['Length']),
              widthMm: parseNumber(car.dimensions?.[0]?.['Width']),
              heightMm: parseNumber(car.dimensions?.[0]?.['Height']),
              wheelbaseMm: parseNumber(car.dimensions?.[0]?.['Wheelbase']),
              weightUnladenKg: parseNumber(car.dimensions?.[0]?.['Weight Unladen (EU)']),
              grossVehicleWeightKg: parseNumber(car.dimensions?.[0]?.['Gross Vehicle Weight (GVWR)']),
              maxPayloadKg: parseNumber(car.dimensions?.[0]?.['Max. Payload']),
            },
          },

          availability: {
            create: {
              availableFrom: new Date(car.availability?.split(' - ')[0] + ' 1'),
              availableTo: new Date(car.availability?.split(' - ')[1] + ' 1'),
            },
          },
        },
      });
      // Ajouter les prix par pays
      const prices = car.pricing?.[0] ?? {};
      const priceRecords = Object.entries(prices)
        .filter(([_, val]) => typeof val === 'string' && !val.includes('Not Available'))
        .map(([country, val]) => {
          const price = parseNumber(val);
          return price !== undefined
            ? {
              country,
              price,
              variantId: variant.id,
            }
            : null;
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

  // Générer le fichier CSV de log
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
importCars(inputPath).then(() => {
  console.log('✅ Import complete');
  prisma.$disconnect();
}).catch(e => {
  console.error('❌ Import failed:', e);
  prisma.$disconnect();
  process.exit(1);
});