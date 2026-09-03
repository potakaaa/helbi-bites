import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"

let client: SupabaseClient<Database> | null = null

// Same lazy pattern as lib/supabase.ts: route and page modules are evaluated
// during `next build`, before Vercel env vars are necessarily configured, so a
// missing key must fail the request rather than the build.
//
// This client uses the Supabase secret key and therefore bypasses RLS. It must
// only ever be reached from code behind the admin session guard.
export function getSupabaseAdminClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secretKey = process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl || !secretKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY environment variables."
    )
  }

  client = createClient<Database>(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  return client
}
