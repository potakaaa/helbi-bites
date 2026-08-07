import { NextResponse } from "next/server"

import { getSupabaseClient } from "@/lib/supabase"
import type { SubscribePayload } from "@/lib/feedback"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Marketing consent is intentionally stored separately from feedback, with
// its own timestamp, so it can be honored/revoked independently of feedback data.
export async function POST(request: Request) {
  let body: Partial<SubscribePayload>

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const email = typeof body.email === "string" ? body.email.trim() : ""

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 })
  }

  const { error } = await getSupabaseClient().from("subscribers").insert({
    email,
    marketing_consent: body.marketingConsent === true,
    batch: typeof body.batch === "string" ? body.batch : null,
  })

  if (error) {
    console.error("[subscribe:insert]", error)
    return NextResponse.json({ error: "Couldn't save your details." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
