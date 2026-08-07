"use client"

import { useState } from "react"

import { BrandHeader } from "@/components/brand-header"
import { FeedbackForm, type FeedbackFormState } from "@/components/feedback-form"
import { ThankYouScreen } from "@/components/thank-you-screen"
import type { FeedbackPayload } from "@/lib/feedback"

const EMPTY_FORM: FeedbackFormState = {
  rating: 0,
  texture: null,
  sweetness: null,
  chocolateFlavor: null,
  portionSize: null,
  buyAgain: null,
  comment: "",
}

type FeedbackFlowProps = {
  batch: string | null
}

export function FeedbackFlow({ batch }: FeedbackFlowProps) {
  const [view, setView] = useState<"form" | "thanks">("form")
  const [form, setForm] = useState<FeedbackFormState>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateField<K extends keyof FeedbackFormState>(key: K, value: FeedbackFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit() {
    if (form.rating === 0 || submitting) return

    setSubmitting(true)
    setError(null)

    try {
      const payload: FeedbackPayload = { ...form, batch }

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error()
      }

      setView("thanks")
    } catch {
      setError("Couldn't send your feedback. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  function handleSubmitAnother() {
    setForm(EMPTY_FORM)
    setError(null)
    setView("form")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-5 pt-8 pb-10 sm:pt-12">
      <BrandHeader />
      {view === "form" ? (
        <FeedbackForm
          form={form}
          onFieldChange={updateField}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
        />
      ) : (
        <ThankYouScreen batch={batch} onSubmitAnother={handleSubmitAnother} />
      )}
    </div>
  )
}
