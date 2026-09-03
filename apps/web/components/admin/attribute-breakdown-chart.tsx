"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import type { AttributeBreakdown } from "@/lib/admin/analytics"

// The three answers mean the same thing across all four attributes ("not
// enough" / "right" / "too much"), so they share a series here and the tooltip
// restores the attribute's own wording.
// Entry animations are off throughout: recharts animates marks in from zero,
// and a tab that is backgrounded or throttled while loading never advances the
// animation, leaving the chart visibly empty. A dashboard should paint its
// final state on first frame.
const config = {
  low: { label: "Not enough", color: "var(--chart-3)" },
  justRight: { label: "Just right", color: "var(--chart-1)" },
  high: { label: "Too much", color: "var(--chart-4)" },
} satisfies ChartConfig

const SERIES = ["low", "justRight", "high"] as const

type Row = {
  attribute: string
  low: number
  justRight: number
  high: number
  lowLabel: string
  justRightLabel: string
  highLabel: string
  answered: number
}

function toRows(attributes: AttributeBreakdown[]): Row[] {
  return attributes
    .filter((attribute) => attribute.answered > 0)
    .map((attribute) => {
      const [low, justRight, high] = attribute.segments

      return {
        attribute: attribute.label,
        low: low?.pct ?? 0,
        justRight: justRight?.pct ?? 0,
        high: high?.pct ?? 0,
        lowLabel: low?.label ?? "",
        justRightLabel: justRight?.label ?? "",
        highLabel: high?.label ?? "",
        answered: attribute.answered,
      }
    })
}

function AttributeTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: Row }[]
}) {
  if (!active || !payload?.length) return null

  const row = payload[0]!.payload

  const lines = [
    { label: row.lowLabel, value: row.low, color: "var(--color-low)" },
    {
      label: row.justRightLabel,
      value: row.justRight,
      color: "var(--color-justRight)",
    },
    { label: row.highLabel, value: row.high, color: "var(--color-high)" },
  ]

  return (
    <div className="grid min-w-[9rem] gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <p className="font-medium">
        {row.attribute}
        <span className="ml-1 font-normal text-muted-foreground">
          ({row.answered} answered)
        </span>
      </p>

      {lines.map((line) => (
        <div key={line.label} className="flex items-center gap-1.5">
          <span
            className="size-2 shrink-0 rounded-[2px]"
            style={{ backgroundColor: line.color }}
          />
          <span className="text-muted-foreground">{line.label}</span>
          <span className="ml-auto font-mono font-medium text-foreground tabular-nums">
            {line.value}%
          </span>
        </div>
      ))}
    </div>
  )
}

export function AttributeBreakdownChart({
  attributes,
}: {
  attributes: AttributeBreakdown[]
}) {
  const rows = toRows(attributes)

  return (
    <div className="flex flex-col gap-1">
      <ChartContainer config={config} className="aspect-auto h-[200px] w-full">
        <BarChart
          accessibilityLayer
          data={rows}
          layout="vertical"
          margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
          barCategoryGap="28%"
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="attribute"
            tickLine={false}
            axisLine={false}
            width={72}
            tickMargin={4}
          />

          <ChartTooltip cursor={false} content={<AttributeTooltip />} />

          <Bar
            dataKey="low"
            stackId="a"
            fill="var(--color-low)"
            radius={[4, 0, 0, 4]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="justRight"
            stackId="a"
            fill="var(--color-justRight)"
            isAnimationActive={false}
          />
          <Bar
            dataKey="high"
            stackId="a"
            fill="var(--color-high)"
            radius={[0, 4, 4, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ChartContainer>

      {/* Rendered outside the chart: recharts hands stacked series to its own
          legend in reverse paint order, and it cannot be overridden. Colours
          come from `config` rather than the `--color-*` vars, which ChartStyle
          scopes to the container above. */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        {SERIES.map((key) => (
          <span key={key} className="flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-[2px]"
              style={{ backgroundColor: config[key].color }}
            />
            {config[key].label}
          </span>
        ))}
      </div>
    </div>
  )
}
