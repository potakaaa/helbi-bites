import { NextResponse } from "next/server"

import { getSupabaseClient } from "@/lib/supabase"
import type { FeedbackPayload } from "@/lib/feedback"

export async function POST(request: Request) {
  let body: Partial<FeedbackPayload>

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const rating = Number(body.rating)

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "A rating between 1 and 5 is required." },
      { status: 400 }
    )
  }

  const { error } = await getSupabaseClient().from("feedback").insert({
    batch: typeof body.batch === "string" ? body.batch : null,
    rating,
    texture: body.texture ?? null,
    sweetness: body.sweetness ?? null,
    chocolate_flavor: body.chocolateFlavor ?? null,
    portion_size: body.portionSize ?? null,
    buy_again: body.buyAgain ?? null,
    comment: typeof body.comment === "string" ? body.comment.slice(0, 1000) : "",
  })

  if (error) {
    console.error("[feedback:insert]", error)
    return NextResponse.json({ error: "Couldn't save your feedback." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
