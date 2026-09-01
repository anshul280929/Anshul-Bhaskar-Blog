import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/news";

export async function GET() {
  const articles = await fetchNews("technology");

  return NextResponse.json(articles, {
    headers: {
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
    },
  });
}
