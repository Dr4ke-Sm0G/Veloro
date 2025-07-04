// src/app/api/upload/avatar/route.ts

import { writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file: File | null = formData.get("avatar") as unknown as File;

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
  const filePath = path.join(process.cwd(), "public/uploads/avatars", fileName);

  await writeFile(filePath, buffer);

  const url = `/uploads/avatars/${fileName}`;
  return NextResponse.json({ url });
}
