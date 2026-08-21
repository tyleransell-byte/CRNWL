import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

if (!rawUrl || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing Supabase environment variables. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel.",
  );
}

// Clean up common mistakes such as:
// https://xxxxx.supabase.co/
// https://xxxxx.supabase.co/rest/v1
// https://xxxxx.supabase.co/auth/v1
const SUPABASE_URL = rawUrl
  .replace(/\/rest\/v1\/?$/i, "")
  .replace(/\/auth\/v1\/?$/i, "")
  .replace(/\/storage\/v1\/?$/i, "")
  .replace(/\/+$/, "");

let parsedUrl: URL;

try {
  parsedUrl = new URL(SUPABASE_URL);
} catch {
  throw new Error("The Supabase URL in Vercel is not a valid URL.");
}

if (
  parsedUrl.protocol !== "https:" ||
  !parsedUrl.hostname.endsWith(".supabase.co")
) {
  throw new Error(
    `Wrong Supabase URL: ${parsedUrl.hostname}. It should end in .supabase.co`,
  );
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);