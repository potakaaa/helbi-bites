"use client"

import { Cell, Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import type { BuyAgainSlice } from "@/lib/admin/analytics"

const COLORS: Record<string, string> = {
  definitely: "var(--chart-1)",
  maybe: "var(--chart-3)",
  probably_not: "var(--chart-4)",
}

// Entry animations are off throughout: recharts animates marks in from zero,
// and a tab that is backgrounded or throttled while loading never advances the
// animation, leaving the chart visibly empty. A dashboard should paint its
// final state on first frame.
const config = {
  count: { label: "Responses" },
  definitely: { label: "Definitely", color: "var(--chart-1)" },
  maybe: { label: "Maybe", color: "var(--chart-3)" },
  probably_not: { label: "Probably not", color: "var(--chart-4)" },
} satisfies ChartConfig

export function BuyAgainChart({ data }: { data: BuyAgainSlice[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-[220px] w-full">
      <PieChart>
        <ChartTooltip
          content={<ChartTooltipContent nameKey="value" hideLabel />}
        />

        <Pie
          data={data}
          dataKey="count"
          nameKey="value"
          innerRadius={50}
          outerRadius={76}
          paddingAngle={2}
          strokeWidth={0}
          isAnimationActive={false}
        >
          {data.map((slice) => (
            <Cell
              key={slice.value}
              fill={COLORS[slice.value] ?? "var(--chart-5)"}
            />
          ))}
        </Pie>

        <ChartLegend content={<ChartLegendContent nameKey="value" />} />
      </PieChart>
    </ChartContainer>
  )
}
