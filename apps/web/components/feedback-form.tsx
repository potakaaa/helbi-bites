"use client"

import { CircleNotch } from "@phosphor-icons/react"

import { Button } from "@workspace/ui/components/button"

import { ChoiceGroup } from "@/components/choice-group"
import { StarRating } from "@/components/star-rating"
import {
  BUY_AGAIN_OPTIONS,
  CHOCOLATE_OPTIONS,
  PORTION_OPTIONS,
  SWEETNESS_OPTIONS,
  TEXTURE_OPTIONS,
} from "@/lib/feedback"
import type { FeedbackPayload } from "@/lib/feedback"

export type FeedbackFormState = Omit<FeedbackPayload, "batch">

type FeedbackFormProps = {
  form: FeedbackFormState
  onFieldChange: <K extends keyof FeedbackFormState>(
    key: K,
    value: FeedbackFormState[K]
  ) => void
  onSubmit: () => void
  submitting: boolean
  error: string | null
}

export function FeedbackForm({
  form,
  onFieldChange,
  onSubmit,
  submitting,
  error,
}: FeedbackFormProps) {
  return (
    <div className="flex flex-col gap-9 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col items-center gap-2 pt-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-balance text-foreground">
          How was your Helbi Bites brownie? 🍫
        </h1>
        <p className="text-[15px] text-muted-foreground">Takes less than 20 seconds.</p>
      </div>

      <form
        className="flex flex-col gap-9"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <StarRating value={form.rating} onChange={(rating) => onFieldChange("rating", rating)} />

        <div className="flex flex-col gap-6">
          <ChoiceGroup
            legend="Texture"
            options={TEXTURE_OPTIONS}
            value={form.texture}
            onChange={(value) => onFieldChange("texture", value)}
          />
          <ChoiceGroup
            legend="Sweetness"
            options={SWEETNESS_OPTIONS}
            value={form.sweetness}
            onChange={(value) => onFieldChange("sweetness", value)}
          />
          <ChoiceGroup
            legend="Chocolate flavor"
            options={CHOCOLATE_OPTIONS}
            value={form.chocolateFlavor}
            onChange={(value) => onFieldChange("chocolateFlavor", value)}
          />
          <ChoiceGroup
            legend="Portion size"
            options={PORTION_OPTIONS}
            value={form.portionSize}
            onChange={(value) => onFieldChange("portionSize", value)}
          />
          <ChoiceGroup
            legend="Would you buy again?"
            options={BUY_AGAIN_OPTIONS}
            value={form.buyAgain}
            onChange={(value) => onFieldChange("buyAgain", value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="comment" className="text-[13px] font-medium text-muted-foreground">
            What would make it even better?{" "}
            <span className="font-normal text-muted-foreground/70">(optional)</span>
          </label>
          <textarea
            id="comment"
            rows={3}
            maxLength={500}
            value={form.comment}
            onChange={(event) => onFieldChange("comment", event.target.value)}
            placeholder="Any thoughts, big or small..."
            className="min-h-24 resize-none rounded-xl border border-border bg-card px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-ring focus:outline-none focus:ring-4 focus:ring-ring/15"
          />
        </div>

        {error ? (
          <p role="alert" className="-mt-4 text-sm font-medium text-destructive">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={form.rating === 0 || submitting}
          className="h-14 w-full rounded-full text-[15px] font-semibold tracking-tight"
        >
          {submitting ? (
            <>
              <CircleNotch className="size-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Feedback 🍫"
          )}
        </Button>
      </form>
    </div>
  )
}
