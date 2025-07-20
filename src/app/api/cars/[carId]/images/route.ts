export const runtime = "nodejs";
export const config = {
  api: {
    bodyParser: false,
  },
};
// app/api/variants/[variantId]/images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import { saveCarImage } from '@/utils/image-manager'; // Assuming this path is correct



export async function POST(
  req: NextRequest,
  { params }: { params: { variantId: string } } // Changed carId to variantId
) {
  const variantId = params.variantId; // Use variantId

  // Create a new formidable instance
  const form = formidable({}); // No need for `multiples: true` here, it's handled by how files are appended to FormData

  // Parse the incoming request using formidable
  // formidable.parse expects a Node.js IncomingMessage, but NextRequest.body is a ReadableStream.
  // We can pipe the NextRequest.body stream directly to formidable.
  const { files } = await new Promise<{ files: formidable.Files }>((resolve, reject) => {
    form.parse(req as any, (err, _fields, files) => { // Cast req to any to satisfy formidable's type expectation for IncomingMessage
      if (err) {
        console.error("Formidable parse error:", err);
        return reject(err);
      }
      resolve({ files });
    });
  });

  // Ensure files.images is an array of formidable.File
  const imageFiles = files.images; // formidable.Files can be a single File or an array of Files
  const fileArray: formidable.File[] = Array.isArray(imageFiles) ? imageFiles : (imageFiles ? [imageFiles] : []);

  if (fileArray.length === 0) {
    return NextResponse.json({ message: "No image files uploaded." }, { status: 400 });
  }

  const createdImages = await Promise.all(
    fileArray.map(async (file: formidable.File) => { // Explicitly type 'file'
      // Read the file content into a Buffer
      const buffer = fs.readFileSync(file.filepath);

      // Call saveCarImage with the buffer and variantId.
      // Removed the third argument (isPrimary) as per your CarImage schema update.
      return saveCarImage(buffer, variantId);
    })
  );

  return NextResponse.json(createdImages);
}
