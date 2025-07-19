// app/api/upload/route.ts
import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs'; // Import fs for mkdir

export async function POST(request: Request) {
  try { // Add a top-level try-catch for all potential errors
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.warn("Upload attempt: No file provided.");
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Basic file validation (optional, but good practice)
    if (!file.name || !file.size) {
        console.error("Upload attempt: File name or size missing.");
        return NextResponse.json({ error: 'Invalid file provided.' }, { status: 400 });
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        console.error(`Upload attempt: Unsupported file type: ${file.type}`);
        return NextResponse.json({ error: 'Only JPG, PNG, WEBP images are allowed.' }, { status: 400 });
    }
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
        console.error(`Upload attempt: File size exceeds limit (${file.size} bytes).`);
        return NextResponse.json({ error: 'File size too large (max 5MB).' }, { status: 400 });
    }


    const buffer = Buffer.from(await file.arrayBuffer());
    // Sanitize filename: replace spaces with hyphens, remove special characters, and prefix with timestamp
    const baseFilename = file.name.replace(/\s/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
    const filename = `${Date.now()}-${baseFilename}`;

    // IMPORTANT: In production, consider a cloud storage solution (AWS S3, Cloudinary, Vercel Blob)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'articles');

    // Ensure the directory exists
    try {
      await fs.promises.mkdir(uploadDir, { recursive: true });
      console.log(`Directory ${uploadDir} ensured to exist.`);
    } catch (dirError: any) {
      console.error("Error creating upload directory:", dirError.message, dirError.stack);
      return NextResponse.json({ error: 'Failed to prepare upload directory on server.' }, { status: 500 });
    }

    const filePath = path.join(uploadDir, filename);

    try {
      await writeFile(filePath, buffer);
      const fileUrl = `/uploads/articles/${filename}`; // Publicly accessible URL relative to `public` folder

      console.log(`Successfully uploaded file: ${filename} to ${filePath}`);
      console.log(`Returning URL: ${fileUrl}`);

      // Crucial: Ensure this response structure matches client expectations
      return NextResponse.json({ url: fileUrl }, { status: 200 });

    } catch (writeError: any) {
      console.error("Error writing file to disk:", writeError.message, writeError.stack);
      return NextResponse.json({ error: `Failed to upload file to disk: ${writeError.message}` }, { status: 500 });
    }

  } catch (overallError: any) {
    console.error("Overall error in /api/upload:", overallError.message, overallError.stack);
    return NextResponse.json({ error: `An unexpected server error occurred during upload: ${overallError.message}` }, { status: 500 });
  }
}