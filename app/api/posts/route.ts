import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json([]);
  }

  const supabase = createClient(url, key);

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image_url, tags, published_at, content")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Posts API error:", error);
    return NextResponse.json([]);
  }

  return NextResponse.json(posts ?? [], {
    headers: {
      // Cache for 60s on CDN, serve stale for 5min while revalidating
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
