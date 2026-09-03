import { StarIcon } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@workspace/ui/lib/utils"
import { Badge } from "@workspace/ui/components/badge"
import type { FeedbackRow } from "@/lib/admin/analytics"
import { formatRelative } from "@/lib/admin/format"

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="flex items-center gap-px"
      aria-label={`${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          weight={star <= rating ? "fill" : "regular"}
          className={cn(
            "size-3",
            star <= rating ? "text-primary" : "text-muted-foreground/40"
          )}
        />
      ))}
    </span>
  )
}

export function CommentsFeed({ comments }: { comments: FeedbackRow[] }) {
  if (comments.length === 0) {
    return (
      <p className="px-1 py-8 text-center text-[13px] text-muted-foreground">
        No written comments in this range yet.
      </p>
    )
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {comments.map((comment) => (
        <li key={comment.id} className="flex flex-col gap-1.5 py-3 first:pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <Stars rating={comment.rating} />

            <span className="text-[11px] text-muted-foreground">
              {formatRelative(comment.created_at)}
            </span>

            {comment.batch ? (
              <Badge variant="secondary" className="text-[10px]">
                {comment.batch}
              </Badge>
            ) : null}
          </div>

          <p className="text-[13px] leading-relaxed text-foreground">
            {comment.comment}
          </p>
        </li>
      ))}
    </ul>
  )
}
