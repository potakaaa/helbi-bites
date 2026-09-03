import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import type { BatchRow } from "@/lib/admin/analytics"
import {
  formatCount,
  formatDate,
  formatPercent,
  formatRating,
} from "@/lib/admin/format"

export function BatchTable({ rows }: { rows: BatchRow[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch</TableHead>
            <TableHead className="text-right">Responses</TableHead>
            <TableHead className="text-right">Rating</TableHead>
            <TableHead className="text-right">Just right</TableHead>
            <TableHead className="text-right">Rebuy</TableHead>
            <TableHead className="text-right">Last seen</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.batch}>
              <TableCell className="font-medium whitespace-nowrap">
                {row.batch}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCount(row.responses)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatRating(row.avgRating)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatPercent(row.justRightPct)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatPercent(row.rebuyPct)}
              </TableCell>
              <TableCell className="text-right whitespace-nowrap text-muted-foreground">
                {formatDate(row.lastSeen)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
