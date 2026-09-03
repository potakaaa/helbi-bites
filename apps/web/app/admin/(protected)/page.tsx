import Image from "next/image"

import { Badge } from "@workspace/ui/components/badge"
import { Card } from "@workspace/ui/components/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { AttributeBreakdownChart } from "@/components/admin/attribute-breakdown-chart"
import { BatchTable } from "@/components/admin/batch-table"
import { BuyAgainChart } from "@/components/admin/buy-again-chart"
import { CommentsFeed } from "@/components/admin/comments-feed"
import { DashboardFilters } from "@/components/admin/dashboard-filters"
import { ExportLink } from "@/components/admin/export-link"
import { KpiCard } from "@/components/admin/kpi-card"
import { LogoutButton } from "@/components/admin/logout-button"
import { RatingDistributionChart } from "@/components/admin/rating-distribution-chart"
import { RatingTrendChart } from "@/components/admin/rating-trend-chart"
import { Section } from "@/components/admin/section"
import { SubscribersTable } from "@/components/admin/subscribers-table"
import { RANGES, isRangeKey, type RangeKey } from "@/lib/admin/analytics"
import { formatCount, formatPercent, formatRating } from "@/lib/admin/format"
import { getDashboardData } from "@/lib/admin/queries"

// Feedback arrives continuously, so the dashboard is always rendered fresh.
export const dynamic = "force-dynamic"

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminPage({ searchParams }: PageProps) {
  const params = await searchParams

  const range: RangeKey = isRangeKey(params.range) ? params.range : "30d"
  const batch =
    typeof params.batch === "string" && params.batch ? params.batch : null

  const data = await getDashboardData({ range, batch })
  const rangeLabel = RANGES[range].label.toLowerCase()
  // "All time" has no preceding window to compare against, and reads badly
  // in the "last ..." phrasing the other ranges use.
  const isAllTime = range === "all"
  const periodPhrase = isAllTime ? "all time" : `last ${rangeLabel}`
  const weakest = data.attributes.find((attribute) => attribute.answered > 0)
  const hasResponses =
    data.kpis.responses.value !== null && data.kpis.responses.value > 0
  const buyAgainAnswers = data.buyAgain.reduce(
    (sum, slice) => sum + slice.count,
    0
  )

  return (
    <main className="min-h-svh bg-background pb-[calc(2rem+env(safe-area-inset-bottom))]">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Image
              src="/assets/logo.png"
              alt=""
              width={28}
              height={28}
              className="size-7 rounded-md"
              priority
            />

            <div className="flex flex-col">
              <span className="text-[14px] font-semibold tracking-tight">
                Dashboard
              </span>
              <span className="text-[11px] text-muted-foreground">
                {formatCount(data.kpis.responses.value)} responses ·{" "}
                {periodPhrase}
                {batch ? ` · ${batch}` : ""}
              </span>
            </div>

            <div className="ml-auto">
              <LogoutButton />
            </div>
          </div>

          <DashboardFilters
            range={range}
            batch={batch}
            batches={data.batches}
          />
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:px-6">
        {!hasResponses ? (
          <Card className="items-center gap-1 px-6 py-12 text-center">
            <p className="text-[15px] font-medium">Nothing here yet</p>
            <p className="max-w-xs text-[13px] text-muted-foreground">
              No feedback {isAllTime ? "yet" : `in the ${periodPhrase}`}
              {batch ? ` for batch ${batch}` : ""}. Try a wider range, or share
              the QR code with your next order.
            </p>
          </Card>
        ) : (
          <>
            <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <KpiCard
                label="Responses"
                hint={
                  isAllTime
                    ? "Everything collected so far"
                    : `vs ${formatCount(data.kpis.responses.previous)} the ${rangeLabel} before`
                }
                kpi={data.kpis.responses}
                format={formatCount}
              />
              <KpiCard
                label="Average rating"
                hint="Out of 5 stars"
                kpi={data.kpis.avgRating}
                format={formatRating}
              />
              <KpiCard
                label="Would rebuy"
                hint="Answered “definitely”"
                kpi={data.kpis.rebuy}
                format={(value) => formatPercent(value)}
                deltaSuffix="pp"
              />
              <KpiCard
                label="Email opt-in"
                hint="Left an email, per response"
                kpi={data.kpis.optIn}
                format={(value) => formatPercent(value)}
                deltaSuffix="pp"
              />
            </section>

            <Section
              title="Rating over time"
              description="Bars are how many people replied; the line is their average rating."
            >
              <RatingTrendChart data={data.trend} />
            </Section>

            <Section
              title="What to change next"
              description="How each attribute landed, weakest first. The bar is the share of answers."
            >
              {weakest ? (
                <p className="text-[13px] leading-relaxed">
                  <span className="font-medium">{weakest.label}</span> is
                  furthest off —{" "}
                  <span className="tabular-nums">
                    {formatPercent(weakest.justRightPct)}
                  </span>{" "}
                  said just right
                  {weakest.skew ? (
                    <>
                      , and{" "}
                      <span className="tabular-nums">
                        {formatPercent(weakest.skew.pct)}
                      </span>{" "}
                      said “{weakest.skew.label.toLowerCase()}”
                    </>
                  ) : null}
                  .
                </p>
              ) : null}

              <AttributeBreakdownChart attributes={data.attributes} />
            </Section>

            <div className="grid gap-4 lg:grid-cols-2">
              <Section
                title="Rating spread"
                description="Where the stars landed."
              >
                <RatingDistributionChart data={data.distribution} />
              </Section>

              <Section
                title="Would they buy again?"
                description={`${buyAgainAnswers} of ${formatCount(data.kpis.responses.value)} answered this one.`}
              >
                <BuyAgainChart data={data.buyAgain} />
              </Section>
            </div>

            {data.batchRows.length > 1 ? (
              <Section
                title="Batch comparison"
                description="Same questions, different bakes — this is where a recipe change shows up."
              >
                <BatchTable rows={data.batchRows} />
              </Section>
            ) : null}

            <Tabs defaultValue="comments">
              <Card className="gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2 px-(--card-spacing)">
                  <TabsList>
                    <TabsTrigger value="comments" className="min-h-9">
                      Comments
                      <Badge variant="secondary" className="ml-1.5 text-[10px]">
                        {data.commentTotal}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="subscribers" className="min-h-9">
                      Emails
                      <Badge variant="secondary" className="ml-1.5 text-[10px]">
                        {data.subscriberTotal}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-1">
                    <ExportLink type="feedback">Feedback CSV</ExportLink>
                    <ExportLink type="subscribers">Emails CSV</ExportLink>
                  </div>
                </div>

                <div className="px-(--card-spacing)">
                  <TabsContent value="comments">
                    <CommentsFeed comments={data.comments} />
                  </TabsContent>

                  <TabsContent value="subscribers">
                    <SubscribersTable subscribers={data.subscribers} />
                  </TabsContent>
                </div>
              </Card>
            </Tabs>
          </>
        )}
      </div>
    </main>
  )
}
