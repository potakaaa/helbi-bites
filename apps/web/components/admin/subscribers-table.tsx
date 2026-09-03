import { Badge } from "@workspace/ui/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import type { SubscriberRow } from "@/lib/admin/analytics"
import { formatDate } from "@/lib/admin/format"

export function SubscribersTable({
  subscribers,
}: {
  subscribers: SubscriberRow[]
}) {
  if (subscribers.length === 0) {
    return (
      <p className="px-1 py-8 text-center text-[13px] text-muted-foreground">
        No one has left their email in this range yet.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Marketing</TableHead>
            <TableHead className="text-right">Joined</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {subscribers.map((subscriber) => (
            <TableRow key={subscriber.id}>
              <TableCell className="font-medium">{subscriber.email}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    subscriber.marketing_consent ? "default" : "secondary"
                  }
                >
                  {subscriber.marketing_consent ? "Opted in" : "No"}
                </Badge>
              </TableCell>
              <TableCell className="text-right whitespace-nowrap text-muted-foreground">
                {formatDate(subscriber.consented_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
