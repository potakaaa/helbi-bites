import "server-only"

import { getSupabaseAdminClient } from "@/lib/supabase-admin"
import {
  RANGES,
  attributeBreakdown,
  batchComparison,
  buyAgainBreakdown,
  listBatches,
  ratingDistribution,
  ratingOverTime,
  summarize,
  type FeedbackRow,
  type RangeKey,
  type SubscriberRow,
} from "@/lib/admin/analytics"

// Everything is aggregated in TypeScript rather than SQL: at this volume one
// round trip per table beats several, and it keeps the dashboard free of
// database migrations. Revisit if a single window ever approaches this cap.
const MAX_ROWS = 10_000

const COMMENT_LIMIT = 50
const SUBSCRIBER_LIMIT = 50

export type DashboardFilters = {
  range: RangeKey
  batch: string | null
}

function windowStarts(range: RangeKey, now = Date.now()) {
  const days = RANGES[range].days

  if (days === null) return { currentStart: null, previousStart: null }

  const span = days * 86_400_000

  return {
    currentStart: new Date(now - span),
    previousStart: new Date(now - span * 2),
  }
}

function inWindow(createdAt: string, start: Date | null) {
  return start === null || new Date(createdAt) >= start
}

export async function getDashboardData({ range, batch }: DashboardFilters) {
  const supabase = getSupabaseAdminClient()
  const { currentStart, previousStart } = windowStarts(range)

  // One fetch covers both the current window and the preceding window of equal
  // length, which is what the KPI deltas compare against.
  const feedbackQuery = supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(MAX_ROWS)

  const subscriberQuery = supabase
    .from("subscribers")
    .select("*")
    .order("consented_at", { ascending: false })
    .limit(MAX_ROWS)

  if (previousStart) {
    feedbackQuery.gte("created_at", previousStart.toISOString())
    subscriberQuery.gte("consented_at", previousStart.toISOString())
  }

  const [feedbackResult, subscriberResult, batchResult] = await Promise.all([
    feedbackQuery,
    subscriberQuery,
    // Batch options are listed across all of time, so switching range never
    // makes a batch disappear from the filter.
    supabase.from("feedback").select("batch").limit(MAX_ROWS),
  ])

  if (feedbackResult.error) throw feedbackResult.error
  if (subscriberResult.error) throw subscriberResult.error
  if (batchResult.error) throw batchResult.error

  const matchesBatch = (row: { batch: string | null }) =>
    batch === null || row.batch === batch

  const allFeedback = (feedbackResult.data as FeedbackRow[]).filter(
    matchesBatch
  )
  const allSubscribers = (subscriberResult.data as SubscriberRow[]).filter(
    matchesBatch
  )

  const current = allFeedback.filter((row) =>
    inWindow(row.created_at, currentStart)
  )
  const previous = allFeedback.filter(
    (row) =>
      !inWindow(row.created_at, currentStart) &&
      inWindow(row.created_at, previousStart)
  )
  const currentSubscribers = allSubscribers.filter((row) =>
    inWindow(row.consented_at, currentStart)
  )
  const previousSubscribers = allSubscribers.filter(
    (row) =>
      !inWindow(row.consented_at, currentStart) &&
      inWindow(row.consented_at, previousStart)
  )

  const commented = current.filter(
    (row) => row.comment !== null && row.comment.trim().length > 0
  )

  return {
    range,
    batch,
    batches: listBatches(batchResult.data),
    kpis: summarize(current, previous, currentSubscribers, previousSubscribers),
    trend: ratingOverTime(current, range),
    distribution: ratingDistribution(current),
    attributes: attributeBreakdown(current),
    buyAgain: buyAgainBreakdown(current),
    batchRows: batchComparison(current),
    comments: commented.slice(0, COMMENT_LIMIT),
    commentTotal: commented.length,
    subscribers: currentSubscribers.slice(0, SUBSCRIBER_LIMIT),
    subscriberTotal: currentSubscribers.length,
  }
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>

export async function getExportRows(type: "feedback" | "subscribers") {
  const supabase = getSupabaseAdminClient()

  if (type === "subscribers") {
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("consented_at", { ascending: false })
      .limit(MAX_ROWS)

    if (error) throw error
    return data as SubscriberRow[]
  }

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(MAX_ROWS)

  if (error) throw error
  return data as FeedbackRow[]
}
