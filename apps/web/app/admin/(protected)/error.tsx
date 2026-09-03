"use client"

import { useEffect } from "react"

import { Button } from "@workspace/ui/components/button"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[admin:dashboard]", error)
  }, [error])

  // By far the likeliest cause in production is a missing SUPABASE_SECRET_KEY,
  // so say that out loud rather than showing a bare "something went wrong".
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-base font-semibold tracking-tight">
          Couldn&apos;t load the dashboard
        </h1>
        <p className="max-w-sm text-[13px] leading-relaxed text-muted-foreground">
          The feedback data didn&apos;t come back. If this deployment is new,
          check that{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-[12px]">
            SUPABASE_SECRET_KEY
          </code>{" "}
          is set in the environment.
        </p>
      </div>

      <Button onClick={reset} variant="outline" size="sm">
        Try again
      </Button>
    </main>
  )
}
