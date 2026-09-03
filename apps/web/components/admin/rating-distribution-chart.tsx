"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import type { DistributionPoint } from "@/lib/admin/analytics"

// Entry animations are off throughout: recharts animates marks in from zero,
// and a tab that is backgrounded or throttled while loading never advances the
// animation, leaving the chart visibly empty. A dashboard should paint its
// final state on first frame.
const config = {
  count: { label: "Responses", color: "var(--chart-1)" },
} satisfies ChartConfig

export function RatingDistributionChart({
  data,
}: {
  data: DistributionPoint[]
}) {
  // ratingDistribution already returns 5★ first, which is the order a vertical
  // category axis renders top-down.
  const rows = data.map((point) => ({
    ...point,
    label: `${point.rating}★`,
  }))

  return (
    <ChartContainer config={config} className="aspect-auto h-[180px] w-full">
      <BarChart
        accessibilityLayer
        data={rows}
        layout="vertical"
        margin={{ top: 0, right: 32, bottom: 0, left: 0 }}
      >
        <XAxis type="number" dataKey="count" hide />
        <YAxis
          type="category"
          dataKey="label"
          tickLine={false}
          axisLine={false}
          width={32}
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="count" />}
        />

        <Bar
          dataKey="count"
          fill="var(--color-count)"
          radius={4}
          maxBarSize={22}
          isAnimationActive={false}
        >
          <LabelList
            dataKey="count"
            position="right"
            offset={8}
            className="fill-muted-foreground"
            fontSize={11}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
