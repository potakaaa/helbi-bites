"use client"

import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import type { TrendPoint } from "@/lib/admin/analytics"

// Entry animations are off throughout: recharts animates marks in from zero,
// and a tab that is backgrounded or throttled while loading never advances the
// animation, leaving the chart visibly empty. A dashboard should paint its
// final state on first frame.
const config = {
  responses: { label: "Responses", color: "var(--chart-4)" },
  avgRating: { label: "Avg rating", color: "var(--chart-1)" },
} satisfies ChartConfig

export function RatingTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-[220px] w-full">
      <ComposedChart
        data={data}
        margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />

        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
          interval="preserveStartEnd"
        />

        {/* Rating owns the visible axis; volume is scaled behind it. */}
        <YAxis
          yAxisId="rating"
          domain={[1, 5]}
          ticks={[1, 3, 5]}
          tickLine={false}
          axisLine={false}
          width={28}
        />
        <YAxis yAxisId="responses" orientation="right" hide />

        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />

        <Bar
          yAxisId="responses"
          dataKey="responses"
          fill="var(--color-responses)"
          fillOpacity={0.22}
          isAnimationActive={false}
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
        <Line
          yAxisId="rating"
          dataKey="avgRating"
          type="monotone"
          stroke="var(--color-avgRating)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          connectNulls
          isAnimationActive={false}
        />
      </ComposedChart>
    </ChartContainer>
  )
}
