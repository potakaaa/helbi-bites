import { cn } from "@workspace/ui/lib/utils"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

type SectionProps = {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function Section({
  title,
  description,
  action,
  className,
  children,
}: SectionProps) {
  return (
    <Card className={cn("gap-4", className)}>
      <CardHeader>
        <CardTitle className="text-[15px]">{title}</CardTitle>
        {description ? (
          <p className="text-[12px] leading-snug text-muted-foreground">
            {description}
          </p>
        ) : null}
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  )
}
