import {
  BUY_AGAIN_OPTIONS,
  CHOCOLATE_OPTIONS,
  PORTION_OPTIONS,
  SWEETNESS_OPTIONS,
  TEXTURE_OPTIONS,
} from "@/lib/feedback"
import type { Tables } from "@/lib/database.types"

export type FeedbackRow = Tables<"feedback">
export type SubscriberRow = Tables<"subscribers">

// Buckets are computed in this zone, so "today" on the dashboard matches the
// day the owner actually sold the brownies. Change if the business relocates.
const TIME_ZONE = "UTC"

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

export const RANGES = {
  "7d": { label: "7 days", days: 7 },
  "30d": { label: "30 days", days: 30 },
  "90d": { label: "90 days", days: 90 },
  all: { label: "All time", days: null },
} as const

export type RangeKey = keyof typeof RANGES

export function isRangeKey(value: unknown): value is RangeKey {
  return typeof value === "string" && value in RANGES
}

/**
 * The four taste attributes share a shape: a "too little" option, "just right",
 * and a "too much" option, in that order. Labels come from lib/feedback.ts so
 * the dashboard can never drift from the form the customer filled in.
 */
export const ATTRIBUTES = [
  { key: "texture", label: "Texture", options: TEXTURE_OPTIONS },
  { key: "sweetness", label: "Sweetness", options: SWEETNESS_OPTIONS },
  { key: "chocolate_flavor", label: "Chocolate", options: CHOCOLATE_OPTIONS },
  { key: "portion_size", label: "Portion", options: PORTION_OPTIONS },
] as const satisfies ReadonlyArray<{
  key: keyof FeedbackRow
  label: string
  options: ReadonlyArray<{ value: string; label: string }>
}>

const JUST_RIGHT = "just_right"

function dayKey(iso: string) {
  return dayFormatter.format(new Date(iso))
}

function mean(values: number[]) {
  if (values.length === 0) return null
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function share(part: number, total: number) {
  if (total === 0) return null
  return (part / total) * 100
}

function round(value: number | null, places = 1) {
  if (value === null) return null
  const factor = 10 ** places
  return Math.round(value * factor) / factor
}

// ---------------------------------------------------------------------------
// KPIs
// ---------------------------------------------------------------------------

export type Kpi = {
  /** null when there is nothing to average yet. */
  value: number | null
  /** Change vs the immediately preceding window of equal length. */
  delta: number | null
  previous: number | null
}

function kpi(value: number | null, previous: number | null): Kpi {
  return {
    value: round(value),
    previous: round(previous),
    delta: value === null || previous === null ? null : round(value - previous),
  }
}

function responseRate(
  rows: FeedbackRow[],
  predicate: (row: FeedbackRow) => boolean
) {
  const answered = rows.filter((row) => row.buy_again !== null)
  return share(answered.filter(predicate).length, answered.length)
}

export function summarize(
  current: FeedbackRow[],
  previous: FeedbackRow[],
  currentSubscribers: SubscriberRow[],
  previousSubscribers: SubscriberRow[]
) {
  const optIn = (subscribers: SubscriberRow[], feedback: FeedbackRow[]) =>
    share(
      subscribers.filter((row) => row.marketing_consent).length,
      feedback.length
    )

  return {
    responses: kpi(current.length, previous.length),
    avgRating: kpi(
      mean(current.map((row) => row.rating)),
      mean(previous.map((row) => row.rating))
    ),
    // "Definitely" only — a stricter and more honest signal than folding in "maybe".
    rebuy: kpi(
      responseRate(current, (row) => row.buy_again === "definitely"),
      responseRate(previous, (row) => row.buy_again === "definitely")
    ),
    optIn: kpi(
      optIn(currentSubscribers, current),
      optIn(previousSubscribers, previous)
    ),
  }
}

export type Kpis = ReturnType<typeof summarize>

// ---------------------------------------------------------------------------
// Charts
// ---------------------------------------------------------------------------

export type TrendPoint = {
  bucket: string
  label: string
  responses: number
  avgRating: number | null
}

/**
 * Buckets responses by day for short ranges and by week for long ones, and
 * fills empty buckets so gaps in trading read as gaps rather than being
 * silently closed up by the line.
 */
export function ratingOverTime(
  rows: FeedbackRow[],
  range: RangeKey
): TrendPoint[] {
  if (rows.length === 0) return []

  const sorted = [...rows].sort((a, b) =>
    a.created_at.localeCompare(b.created_at)
  )
  const first = new Date(dayKey(sorted[0]!.created_at))
  const last = new Date(dayKey(sorted[sorted.length - 1]!.created_at))

  const spanDays =
    Math.round((last.getTime() - first.getTime()) / 86_400_000) + 1
  const weekly = range === "90d" || (range === "all" && spanDays > 90)
  const step = weekly ? 7 : 1

  const buckets = new Map<string, FeedbackRow[]>()

  for (const row of rows) {
    const date = new Date(dayKey(row.created_at))
    if (weekly) {
      const offset = Math.floor((date.getTime() - first.getTime()) / 86_400_000)
      date.setUTCDate(date.getUTCDate() - (offset % 7))
    }
    const key = date.toISOString().slice(0, 10)
    const bucket = buckets.get(key)
    if (bucket) bucket.push(row)
    else buckets.set(key, [row])
  }

  const points: TrendPoint[] = []

  for (
    let cursor = new Date(first);
    cursor <= last;
    cursor.setUTCDate(cursor.getUTCDate() + step)
  ) {
    const key = cursor.toISOString().slice(0, 10)
    const bucket = buckets.get(key) ?? []

    points.push({
      bucket: key,
      label: new Date(key).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        timeZone: TIME_ZONE,
      }),
      responses: bucket.length,
      avgRating: round(mean(bucket.map((row) => row.rating)), 2),
    })
  }

  return points
}

export type DistributionPoint = { rating: number; count: number; pct: number }

export function ratingDistribution(rows: FeedbackRow[]): DistributionPoint[] {
  return [5, 4, 3, 2, 1].map((rating) => {
    const count = rows.filter((row) => row.rating === rating).length
    return { rating, count, pct: round(share(count, rows.length) ?? 0) ?? 0 }
  })
}

export type AttributeBreakdown = {
  key: string
  label: string
  answered: number
  justRightPct: number | null
  segments: { value: string; label: string; count: number; pct: number }[]
  /** The option pulling hardest away from "just right", if any. */
  skew: { label: string; pct: number } | null
}

/**
 * The most actionable view in the dashboard: for each attribute, how the
 * answers split across "too little / just right / too much", sorted so the
 * weakest attribute — the one to fix in the next batch — sits at the top.
 */
export function attributeBreakdown(rows: FeedbackRow[]): AttributeBreakdown[] {
  const breakdowns = ATTRIBUTES.map(({ key, label, options }) => {
    const answered = rows.filter((row) => row[key] !== null)

    const segments = options.map((option) => {
      const count = answered.filter((row) => row[key] === option.value).length
      return {
        value: option.value,
        label: option.label,
        count,
        pct: round(share(count, answered.length) ?? 0) ?? 0,
      }
    })

    const offTarget = segments
      .filter((segment) => segment.value !== JUST_RIGHT)
      .sort((a, b) => b.pct - a.pct)[0]

    return {
      key,
      label,
      answered: answered.length,
      justRightPct: round(
        share(
          segments.find((segment) => segment.value === JUST_RIGHT)?.count ?? 0,
          answered.length
        )
      ),
      segments,
      skew:
        offTarget && offTarget.pct > 0
          ? { label: offTarget.label, pct: offTarget.pct }
          : null,
    }
  })

  // Worst first; attributes nobody answered sink to the bottom.
  return breakdowns.sort((a, b) => {
    if (a.answered === 0) return 1
    if (b.answered === 0) return -1
    return (a.justRightPct ?? 0) - (b.justRightPct ?? 0)
  })
}

export type BuyAgainSlice = {
  value: string
  label: string
  count: number
  pct: number
}

export function buyAgainBreakdown(rows: FeedbackRow[]): BuyAgainSlice[] {
  const answered = rows.filter((row) => row.buy_again !== null)

  return BUY_AGAIN_OPTIONS.map((option) => {
    const count = answered.filter(
      (row) => row.buy_again === option.value
    ).length
    return {
      value: option.value,
      label: option.label,
      count,
      pct: round(share(count, answered.length) ?? 0) ?? 0,
    }
  })
}

export type BatchRow = {
  batch: string
  responses: number
  avgRating: number | null
  justRightPct: number | null
  rebuyPct: number | null
  firstSeen: string
  lastSeen: string
}

/**
 * Compares batches side by side, which is how a recipe change gets judged:
 * same questions, different bake.
 */
export function batchComparison(rows: FeedbackRow[]): BatchRow[] {
  const groups = new Map<string, FeedbackRow[]>()

  for (const row of rows) {
    const batch = row.batch?.trim()
    if (!batch) continue
    const group = groups.get(batch)
    if (group) group.push(row)
    else groups.set(batch, [row])
  }

  return [...groups.entries()]
    .map(([batch, group]) => {
      const justRightCounts = ATTRIBUTES.map(({ key }) => {
        const answered = group.filter((row) => row[key] !== null)
        return share(
          answered.filter((row) => row[key] === JUST_RIGHT).length,
          answered.length
        )
      }).filter((value): value is number => value !== null)

      const dates = group.map((row) => row.created_at).sort()

      return {
        batch,
        responses: group.length,
        avgRating: round(mean(group.map((row) => row.rating)), 2),
        justRightPct: round(mean(justRightCounts)),
        rebuyPct: round(
          responseRate(group, (row) => row.buy_again === "definitely")
        ),
        firstSeen: dates[0]!,
        lastSeen: dates[dates.length - 1]!,
      }
    })
    .sort((a, b) => b.lastSeen.localeCompare(a.lastSeen))
}

export function listBatches(rows: ReadonlyArray<{ batch: string | null }>) {
  const batches = new Set<string>()

  for (const row of rows) {
    const batch = row.batch?.trim()
    if (batch) batches.add(batch)
  }

  return [...batches].sort()
}
