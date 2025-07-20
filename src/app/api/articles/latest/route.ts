// app/api/articles/latest/route.ts (or similar)
import { getLatestArticles } from "@/lib/api"; 
import { NextResponse } from "next/server";

export async function GET(request: Request) { // <-- Make sure this is present and correct
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6', 10);
    const articles = await getLatestArticles(limit); 
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching latest articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}