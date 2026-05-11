import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatRelativeDate } from "@/lib/utils/date-utils"
import type {
  AlertSeverity,
  FeedEvent,
  FeedEventCategory,
} from "@/lib/types/stado.types"

interface EventFeedItemProps {
  event: FeedEvent
  onClick: (event: FeedEvent) => void
  onClickUrlBase?: string
}

const severityColors: Record<AlertSeverity, string> = {
  red: "bg-destructive",
  amber: "bg-amber-400",
  green: "bg-green-500",
  info: "bg-muted-foreground",
}

const categoryColors: Record<FeedEventCategory, string> = {
  alert:
    "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30",
  estrus:
    "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30",
  yield:
    "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30",
  vet: "bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/30",
  insemination:
    "bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/30",
  dry: "bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/30",
  info: "bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/30",
}

export function EventFeedItem({
  event,
  onClick,
  onClickUrlBase,
}: EventFeedItemProps) {
  const isPulsing = event.severity === "red" || event.severity === "amber"

  const ItemContent = () => (
    <>
      <div className="flex justify-center">
        <div
          className={cn(
            "h-2 w-2 shrink-0 rounded-full",
            severityColors[event.severity],
            isPulsing && "animate-pulse"
          )}
        />
      </div>

      <div className="flex">
        <Badge
          variant="outline"
          className={cn(
            "w-full justify-center px-1.5 py-0 text-[10px] font-bold uppercase",
            categoryColors[event.category]
          )}
        >
          {event.categoryLabel}
        </Badge>
      </div>

      <div
        className="truncate font-mono text-xs font-semibold text-muted-foreground"
        title={`#${event.earTagShort} ${event.cowName}`}
      >
        #{event.earTagShort} {event.cowName}
      </div>

      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-slate-900 dark:text-foreground">
          {event.title}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {event.description}
        </div>
      </div>

      <div className="text-right font-mono text-[11px] whitespace-nowrap text-muted-foreground/60">
        {formatRelativeDate(event.occurredAt)}
      </div>

      <div className="flex justify-end">
        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </>
  )

  if (onClickUrlBase && !(event.category === "alert" && event.details)) {
    return (
      <Link href={`${onClickUrlBase}/${event.cowId}`}>
        <div className="group grid cursor-pointer grid-cols-[16px_80px_100px_1fr_120px_24px] items-center gap-4 overflow-x-auto border-b px-4 py-3 transition-colors last:border-0 hover:bg-muted/50 md:overflow-x-visible">
          <ItemContent />
        </div>
      </Link>
    )
  }

  return (
    <div
      onClick={() => onClick(event)}
      className="group grid cursor-pointer grid-cols-[16px_80px_100px_1fr_120px_24px] items-center gap-4 overflow-x-auto border-b px-4 py-3 transition-colors last:border-0 hover:bg-muted/50 md:overflow-x-visible"
    >
      <ItemContent />
    </div>
  )
}
