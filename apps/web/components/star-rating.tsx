"use client"

import { Star } from "@phosphor-icons/react"

import { cn } from "@workspace/ui/lib/utils"

const RATING_LABELS = ["Poor", "Not great", "Okay", "Good", "Excellent!"]

type StarRatingProps = {
  value: number
  onChange: (value: number) => void
}

export function StarRating({ value, onChange }: StarRatingProps) {
  return (
    <fieldset className="flex flex-col items-center gap-2">
      <legend className="sr-only">Overall rating</legend>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= value

          return (
            <button
              key={star}
              type="button"
              aria-pressed={filled}
              aria-label={`${star} star${star === 1 ? "" : "s"}${star === value ? ", selected" : ""}`}
              onClick={() => onChange(star)}
              className="flex size-12 items-center justify-center rounded-full transition-transform duration-150 active:scale-90"
            >
              <Star
                weight={filled ? "fill" : "regular"}
                className={cn(
                  "size-9 transition-colors duration-150",
                  filled ? "text-primary" : "text-stone-300"
                )}
              />
            </button>
          )
        })}
      </div>
      <p
        aria-live="polite"
        className="h-5 text-sm font-medium text-primary animate-in fade-in duration-200"
      >
        {value > 0 ? RATING_LABELS[value - 1] : " "}
      </p>
    </fieldset>
  )
}
