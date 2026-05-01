import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing env var ${name}. Copy .env.example to .env.local and fill in your Supabase project values.`,
    );
  }
  return value;
}

let _browser: SupabaseClient | null = null;
let _server: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient {
  if (_browser) return _browser;
  _browser = createClient(
    assertEnv("NEXT_PUBLIC_SUPABASE_URL", url),
    assertEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", anonKey),
    { auth: { persistSession: false } },
  );
  return _browser;
}

export function supabaseServer(): SupabaseClient {
  if (_server) return _server;
  _server = createClient(
    assertEnv("NEXT_PUBLIC_SUPABASE_URL", url),
    assertEnv("SUPABASE_SERVICE_ROLE_KEY", serviceKey),
    { auth: { persistSession: false } },
  );
  return _server;
}
