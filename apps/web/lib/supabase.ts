import { createClient, type SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"

let client: SupabaseClient<Database> | null = null

// Lazy so a missing env var fails the request that needs it, not the build
// (route handler modules get evaluated during `next build`'s page-data
// collection, before Vercel env vars are necessarily configured).
export function getSupabaseClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
    )
  }

  client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  })

  return client
}
