"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { cn } from "@workspace/ui/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { RANGES, type RangeKey } from "@/lib/admin/analytics"

const ALL_BATCHES = "__all__"

function buildHref(range: RangeKey, batch: string | null) {
  const params = new URLSearchParams()
  if (range !== "30d") params.set("range", range)
  if (batch) params.set("batch", batch)
  const query = params.toString()
  return query ? `/admin?${query}` : "/admin"
}

type DashboardFiltersProps = {
  range: RangeKey
  batch: string | null
  batches: string[]
}

export function DashboardFilters({
  range,
  batch,
  batches,
}: DashboardFiltersProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 transition-opacity",
        pending && "opacity-60"
      )}
    >
      {/* Plain links, so the range is bookmarkable and survives a cold load. */}
      <div
        role="group"
        aria-label="Date range"
        className="flex items-center rounded-lg bg-muted p-0.5"
      >
        {(Object.keys(RANGES) as RangeKey[]).map((key) => (
          <Link
            key={key}
            href={buildHref(key, batch)}
            aria-current={key === range ? "page" : undefined}
            scroll={false}
            className={cn(
              "flex min-h-9 items-center rounded-[7px] px-3 text-[12px] font-medium whitespace-nowrap transition-colors",
              key === range
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {RANGES[key].label}
          </Link>
        ))}
      </div>

      {batches.length > 0 ? (
        <Select
          value={batch ?? ALL_BATCHES}
          onValueChange={(value) => {
            const next = value === ALL_BATCHES ? null : String(value)
            startTransition(() =>
              router.push(buildHref(range, next), { scroll: false })
            )
          }}
        >
          <SelectTrigger aria-label="Batch" className="h-9">
            {/* Base UI renders the raw value unless told how to label it. */}
            <SelectValue>
              {(value) =>
                value === ALL_BATCHES ? "All batches" : String(value)
              }
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL_BATCHES}>All batches</SelectItem>
            {batches.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
    </div>
  )
}
