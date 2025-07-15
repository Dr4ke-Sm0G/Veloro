import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tableau des marques et slugs
const brands: { name: string; slug: string }[] = [
  { name: "Abarth", slug: "abarth" },
  { name: "Alfa Romeo", slug: "alfaromeo" },
  { name: "Alpine", slug: "alpine" },
  { name: "Aston Martin", slug: "astonmartin" },
  { name: "Audi", slug: "audi" },
  { name: "Bentley", slug: "bentley" },
  { name: "BMW", slug: "bmw" },
  { name: "BYD", slug: "byd" },
  { name: "Citroen", slug: "citroen" },
  { name: "Cupra", slug: "cupra" },
  { name: "Dacia", slug: "dacia" },
  { name: "DS", slug: "ds" },
  { name: "Ferrari", slug: "ferrari" },
  { name: "Fiat", slug: "fiat" },
  { name: "Ford", slug: "ford" },
  { name: "Genesis", slug: "genesis" },
  { name: "GWM", slug: "gwm" },
  { name: "GWM Ora", slug: "gwmora" },
  { name: "Honda", slug: "honda" },
  { name: "Hyundai", slug: "hyundai" },
  { name: "INEOS", slug: "ineos" },
  { name: "Infiniti", slug: "infiniti" },
  { name: "Jaecoo", slug: "jaecoo" },
  { name: "Jaguar", slug: "jaguar" },
  { name: "Jeep", slug: "jeep" },
  { name: "KGM Motors", slug: "kgmmotors" },
  { name: "Kia", slug: "kia" },
  { name: "Lamborghini", slug: "lamborghini" },
  { name: "Land Rover", slug: "landrover" },
  { name: "Leapmotor", slug: "leapmotor" },
  { name: "Lexus", slug: "lexus" },
  { name: "Lotus", slug: "lotus" },
  { name: "Maserati", slug: "maserati" },
  { name: "Mazda", slug: "mazda" },
  { name: "McLaren", slug: "mclaren" },
  { name: "Mercedes-Benz", slug: "mercedesbenz" },
  { name: "MG", slug: "mg" },
  { name: "MINI", slug: "mini" },
  { name: "Mitsubishi", slug: "mitsubishi" },
  { name: "Nissan", slug: "nissan" },
  { name: "OMODA", slug: "omoda" },
  { name: "Peugeot", slug: "peugeot" },
  { name: "Polestar", slug: "polestar" },
  { name: "Porsche", slug: "porsche" },
  { name: "Renault", slug: "renault" },
  { name: "Rolls-Royce", slug: "rollsroyce" },
  { name: "SEAT", slug: "seat" },
  { name: "Skoda", slug: "skoda" },
  { name: "Smart", slug: "smart" },
  { name: "SsangYong", slug: "ssangyong" },
  { name: "Subaru", slug: "subaru" },
  { name: "Suzuki", slug: "suzuki" },
  { name: "Tesla", slug: "tesla" },
  { name: "Toyota", slug: "toyota" },
  { name: "Vauxhall", slug: "vauxhall" },
  { name: "Volkswagen", slug: "volkswagen" },
  { name: "Volvo", slug: "volvo" },
  { name: "Xpeng", slug: "xpeng" },
];

async function updateLogos() {
  const logosPath = path.resolve(__dirname, "../../public/BrandLogos");

  for (const { name, slug } of brands) {
    const possibleExtensions = [".png", ".svg", ".jpg", ".webp"];
    let logoFile = null;

    for (const ext of possibleExtensions) {
      const fullPath = path.join(logosPath, `${slug}${ext}`);
      if (fs.existsSync(fullPath)) {
        logoFile = `${slug}${ext}`;
        break;
      }
    }

    if (!logoFile) {
      console.warn(`⚠️  Logo introuvable pour ${name} (${slug})`);
      continue;
    }

    const updated = await prisma.brand.updateMany({
      where: { name },
      data: { logo: logoFile },
    });

    if (updated.count > 0) {
      console.log(`✅ Marque mise à jour : ${name} → ${logoFile}`);
    } else {
      console.warn(`❌ Aucune marque trouvée pour : ${name}`);
    }
  }

  await prisma.$disconnect();
  console.log("🎉 Mise à jour des logos terminée.");
}

updateLogos().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
