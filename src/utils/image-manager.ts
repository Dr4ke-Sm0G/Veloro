import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { PrismaClient } from '@prisma/client'; // Assuming @prisma/client is installed

// --- Type Definitions and Constants (Add these if not already defined) ---

// Define the structure for image sizes
interface ImageDimensions {
  width: number;
  height: number;
}

// Define the expected structure for IMAGE_SIZES
const IMAGE_SIZES: Record<string, ImageDimensions> = {
  small: { width: 300, height: 200 },
  medium: { width: 800, height: 600 },
  large: { width: 1200, height: 900 },
  // Add other sizes as needed
};

// Define the base directory for car image uploads
const CARS_DIR = path.join(process.cwd(), 'uploads', 'cars'); // Example: Adjust as per your project structure

// --- Corrected Function ---

/**
 * Saves a car image, generates different sizes, and records references in the database.
 *
 * @param imageBuffer The image data as a Buffer.
 * @param variantId The ID of the Variant to associate the image with.
 * @returns The created CarImage record from the database.
 */
export async function saveCarImage(
  imageBuffer: Buffer,
  variantId: string // Changed parameter name to variantId for clarity
) {
  const imageId = uuidv4();
  // Use the first two characters of variantId for the folder, ensuring it's a string.
  const folderPrefix = variantId.substring(0, 2);
  const variantFolder = path.join(CARS_DIR, folderPrefix);

  // Create the folder if necessary
  if (!fs.existsSync(variantFolder)) {
    fs.mkdirSync(variantFolder, { recursive: true });
  }

  // Generate the different sizes
  const imagePaths: Record<string, string> = {};

  for (const [size, dims] of Object.entries(IMAGE_SIZES)) {
    const filename = `${variantId}_${imageId}_${size}.webp`;
    const filePath = path.join(variantFolder, filename);

    await sharp(imageBuffer)
      .resize(dims.width, dims.height, { fit: 'inside' })
      .webp({ quality: 85 })
      .toFile(filePath);

    // Relative path for the URL
    imagePaths[size] = `/uploads/cars/${folderPrefix}/${filename}`;
  }

  // Save references to the database
  const prisma = new PrismaClient();
  try {
    const carImage = await prisma.carImage.create({
      data: {
        url: JSON.stringify(imagePaths), // Store the object as a JSON string
        // Correct way to connect a CarImage to a Variant using its ID
        variant: {
          connect: {
            id: variantId, // Connect to the Variant using its 'id' field
          },
        },
        // Removed 'isPrimary' as it's not in your CarImage model
      },
    });
    return carImage;
  } catch (error) {
    console.error("Error saving car image to database:", error);
    // You might want to clean up the saved files here if the DB save fails
    throw error; // Re-throw the error for upstream handling
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
}
