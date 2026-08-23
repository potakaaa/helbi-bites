"use client"

import { useState } from "react"
import { ArrowCounterClockwise, CircleNotch, HeartStraight } from "@phosphor-icons/react"

import { Button } from "@workspace/ui/components/button"

import type { SubscribePayload } from "@/lib/feedback"

type SubscribeStatus = "idle" | "submitting" | "done" | "declined"

type ThankYouScreenProps = {
  batch: string | null
  onSubmitAnother: () => void
}

export function ThankYouScreen({ batch, onSubmitAnother }: ThankYouScreenProps) {
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<SubscribeStatus>("idle")
  const [error, setError] = useState<string | null>(null)

  const canSubmit = email.trim().length > 0 && consent && status !== "submitting"

  async function handleSubscribe() {
    if (!canSubmit) return

    setStatus("submitting")
    setError(null)

    try {
      const payload: SubscribePayload = {
        email: email.trim(),
        marketingConsent: consent,
        batch,
      }

      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error()
      }

      setStatus("done")
    } catch {
      setStatus("idle")
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col items-center gap-2 pt-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Thank you! 🤎</h1>
        <p className="text-[15px] text-muted-foreground">
          Your feedback helps us make every batch better.
        </p>
      </div>

      {status !== "declined" ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
          {status === "done" ? (
            <p className="text-center text-[15px] font-medium text-foreground animate-in fade-in duration-300">
              You&apos;re on the list! We&apos;ll be in touch. 🤎
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
                  Want first dibs on the next batch?
                </h2>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  Get updates about fresh brownie drops, new flavors, and occasional promos.
                </p>
              </div>

              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-[15px] text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-ring focus:outline-none focus:ring-4 focus:ring-ring/15"
              />

              <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-relaxed text-foreground">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-0.5 size-4.5 shrink-0 rounded-[5px] border-border accent-primary"
                />
                <span>
                  Send me lil&apos; bites updates, new flavors &amp; occasional promos.
                </span>
              </label>

              {error ? (
                <p role="alert" className="text-sm font-medium text-destructive">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col gap-1 pt-1">
                <Button
                  type="button"
                  size="lg"
                  disabled={!canSubmit}
                  onClick={handleSubscribe}
                  className="h-12 w-full rounded-full text-[15px] font-semibold tracking-tight"
                >
                  {status === "submitting" ? (
                    <>
                      <CircleNotch className="size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Keep me updated"
                  )}
                </Button>
                <button
                  type="button"
                  onClick={() => setStatus("declined")}
                  className="mx-auto py-2 text-[13px] text-muted-foreground underline-offset-4 hover:underline"
                >
                  No thanks
                </button>
              </div>
            </>
          )}
        </div>
      ) : null}

      <p className="flex items-start gap-2 px-1 text-[13px] leading-relaxed text-muted-foreground">
        <HeartStraight weight="fill" className="mt-0.5 size-4 shrink-0 text-primary" />
        Thank you for supporting lil&apos; bites and a small business like ours. Every order,
        review, and bit of feedback means a lot to us. 🤎
      </p>

      <Button
        type="button"
        variant="outline"
        onClick={onSubmitAnother}
        className="h-12 w-full rounded-full text-[15px] font-medium"
      >
        <ArrowCounterClockwise className="size-4" />
        Send another feedback
      </Button>
    </div>
  )
}
