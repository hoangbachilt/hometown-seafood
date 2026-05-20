import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ============================================================
// Types
// ============================================================

export type Product = {
  id: string;
  name: string;
  price_per_kg: number;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
};

export type OrderItem = {
  name: string;
  quantity: number;
  price_per_kg: number;
  subtotal: number;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  total_amount: number;
  status: "pending" | "delivered";
  created_at: string;
};

// ============================================================
// Lazy client creation (avoids build-time errors with placeholder env vars)
// ============================================================

let _supabase: SupabaseClient | null = null;

/**
 * Browser Supabase client (anon key — public read only).
 * Call this function; do not import a module-level singleton.
 */
export function getSupabaseClient(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
    _supabase = createClient(url, key);
  }
  return _supabase;
}

/** Convenience re-export for client components */
export const supabase = {
  from: (...args: Parameters<SupabaseClient["from"]>) =>
    getSupabaseClient().from(...args),
};

/**
 * Admin Supabase client (service role — server-side ONLY).
 * Creates a new instance every call to avoid singleton issues in serverless.
 * NEVER import in client components.
 */
export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
