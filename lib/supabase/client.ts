"use client";

import { createBrowserClient } from "@supabase/ssr";

function getValidSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    typeof url === "string" &&
    (url.startsWith("http://") || url.startsWith("https://")) &&
    key &&
    !key.startsWith("your-")
  ) {
    return { url, key };
  }

  return {
    url: "https://placeholder-project.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder",
  };
}

export function createClient() {
  const { url, key } = getValidSupabaseConfig();
  return createBrowserClient(url, key);
}
