// app/api/variants/[variantId]/images/route.ts
/* ------------------------------------------------------------------ */
/* 1. Config Next — bodyParser désactivé                              */
/* ------------------------------------------------------------------ */
export const runtime = "nodejs";
export const config = { api: { bodyParser: false } };

/* ------------------------------------------------------------------ */
/* 2. Imports                                                          */
/* ------------------------------------------------------------------ */
import { NextRequest, NextResponse } from "next/server";
import formidable, { File } from "formidable";
import { Readable } from "node:stream";
import fs from "node:fs/promises";
import { saveCarImage } from "@/utils/image-manager";

/* ------------------------------------------------------------------ */
/* 3. Handler POST                                                     */
/* ------------------------------------------------------------------ */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ variantId: string }> }
) {
  /* 3‑1. Récupérer le paramètre dynamique (Promise) ----------------- */
  const { variantId } = await params;

  /* 3‑2. Préparer formidable                                          */
  const form = formidable({ multiples: true });

  // Convertit le ReadableStream du web API en stream Node
  const nodeStream = Readable.fromWeb(req.body as any) as any;
  nodeStream.headers = Object.fromEntries(req.headers); // requis par formidable

  const { files } = await new Promise<{ files: formidable.Files }>(
    (resolve, reject) => {
      // `as any` → on passe outre la signature IncomingMessage
      form.parse(nodeStream, (err, _fields, files) => {
        if (err) return reject(err);
        resolve({ files });
      });
    }
  );

  /* 3‑3. Normaliser le champ "images"                                */
  const raw = (files as formidable.Files).images;
  const fileArray: File[] = Array.isArray(raw) ? raw : raw ? [raw] : [];

  if (fileArray.length === 0) {
    return NextResponse.json(
      { message: "No image files uploaded." },
      { status: 400 }
    );
  }

  /* 3‑4. Sauvegarder chaque image                                    */
  const createdImages = await Promise.all(
    fileArray.map(async (file) => {
      const buffer = await fs.readFile(file.filepath);
      return saveCarImage(buffer, variantId);
    })
  );

  /* 3‑5. Répondre                                                    */
  return NextResponse.json(createdImages, { status: 201 });
}
