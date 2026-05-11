import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatRelativeDate } from "@/lib/utils/date-utils"
import type { CowAlert, CowEvent } from "@/lib/types/stado.types"

interface CowEventTimelineItemProps {
  event: CowEvent
  onPlayClip: (eventId: string) => void
  onAlertClick: (alert: CowAlert) => void
}

const severityColors: Record<string, string> = {
  red: "bg-destructive",
  amber: "bg-amber-400",
  green: "bg-green-500",
  info: "bg-blue-400",
  neutral: "bg-slate-300",
}

export function CowEventTimelineItem({
  event,
  onPlayClip,
  onAlertClick,
}: CowEventTimelineItemProps) {
  const isAlertWithDetails = event.category === "alert" && event.details

  return (
    <div
      onClick={() => {
        if (isAlertWithDetails && event.severity !== "neutral") {
          onAlertClick({
            id: event.id,
            severity: event.severity,
            title: event.title,
            description: event.description,
            detectedAt: event.occurredAt,
            details: event.details,
          })
        }
      }}
      className={cn(
        "grid grid-cols-[16px_1fr_110px] items-start gap-3 border-b px-4 py-3 transition-colors last:border-0",
        isAlertWithDetails
          ? "cursor-pointer hover:bg-red-50/50 dark:hover:bg-red-950/10"
          : "hover:bg-muted/30"
      )}
    >
      <div
        className={cn(
          "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
          severityColors[event.severity] || severityColors.neutral
        )}
      />

      <div className="min-w-0">
        <div className="mb-0.5 text-sm font-medium text-slate-900 dark:text-foreground">
          {event.title}
        </div>
        <div className="text-xs leading-relaxed text-muted-foreground">
          {event.description}
        </div>

        {event.hasClip && (
          <Button
            variant="outline"
            size="sm"
            className="mt-2 h-7 border-slate-200 px-2 py-0 text-[10px] dark:border-border/50"
            onClick={() => onPlayClip(event.id)}
          >
            <Play className="mr-1.5 h-3 w-3 fill-current" />
            Odtwórz klip 10s
          </Button>
        )}
      </div>

      <div className="mt-1 text-right font-mono text-[10px] whitespace-nowrap text-muted-foreground/60">
        {formatRelativeDate(event.occurredAt)}
      </div>
    </div>
  )
}
