import { TrendDownIcon, TrendUpIcon } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@workspace/ui/lib/utils"
import { Card } from "@workspace/ui/components/card"
import type { Kpi } from "@/lib/admin/analytics"
import { formatDelta } from "@/lib/admin/format"

type KpiCardProps = {
  label: string
  hint: string
  kpi: Kpi
  format: (value: number | null) => string
  /** Suffix shown on the delta chip, e.g. "pp" for percentage points. */
  deltaSuffix?: string
}

export function KpiCard({
  label,
  hint,
  kpi,
  format,
  deltaSuffix = "",
}: KpiCardProps) {
  const delta = formatDelta(kpi.delta, deltaSuffix)
  const improving = kpi.delta !== null && kpi.delta > 0

  return (
    <Card size="sm" className="gap-0 px-4">
      <p className="text-[12px] font-medium text-muted-foreground">{label}</p>

      <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">
          {format(kpi.value)}
        </span>

        {delta ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-[12px] font-medium tabular-nums",
              improving ? "text-primary" : "text-muted-foreground"
            )}
          >
            {improving ? (
              <TrendUpIcon className="size-3" weight="bold" />
            ) : (
              <TrendDownIcon className="size-3" weight="bold" />
            )}
            {delta}
          </span>
        ) : null}
      </div>

      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
        {hint}
      </p>
    </Card>
  )
}
