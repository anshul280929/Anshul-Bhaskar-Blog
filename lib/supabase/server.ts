import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

export async function createClient() {
  const cookieStore = await cookies();
  const { url, key } = getValidSupabaseConfig();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignored if called from a Server Component
        }
      },
    },
  });
}

export async function createServiceClient() {
  const { createClient } = await import("@supabase/supabase-js");
  const { url } = getValidSupabaseConfig();
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith("your-")
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder";

  return createClient(url, serviceKey);
}
