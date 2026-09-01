import { Video } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatRelativeDate } from "@/lib/utils/date-utils"
import { alertTypeMeta, formatConfidence } from "./alert-utils"
import type { AlertSeverity, FarmAlert } from "@/lib/types/stado.types"

const severityColors: Record<AlertSeverity, string> = {
  red: "bg-destructive",
  amber: "bg-amber-400",
  green: "bg-green-500",
  info: "bg-muted-foreground",
}

interface AlertFeedItemProps {
  alert: FarmAlert
}

/**
 * Wiersz alertu AI w sekcji „Ostatnie zdarzenia" — ten sam grid co EventFeedItem.
 * Brak nawigacji per-alert (alert nie jest jeszcze skojarzony ze zwierzęciem).
 */
export function AlertFeedItem({ alert }: AlertFeedItemProps) {
  const meta = alertTypeMeta(alert.type)
  const isPulsing = meta.severity === "red" || meta.severity === "amber"

  return (
    <div className="grid grid-cols-[16px_80px_100px_1fr_120px_24px] items-center gap-4 overflow-x-auto border-b px-4 py-3 last:border-0 md:overflow-x-visible">
      <div className="flex justify-center">
        <div
          className={cn(
            "h-2 w-2 shrink-0 rounded-full",
            severityColors[meta.severity],
            isPulsing && "animate-pulse"
          )}
        />
      </div>

      <div className="flex">
        <Badge
          variant="outline"
          className={cn(
            "w-full justify-center px-1.5 py-0 text-[10px] font-bold uppercase",
            meta.badgeClass
          )}
        >
          {meta.label}
        </Badge>
      </div>

      <div
        className="truncate font-mono text-xs font-semibold text-muted-foreground"
        title={alert.cowId ?? "Nieprzypisane zwierzę"}
      >
        {alert.cowId ? `#${alert.cowId.slice(0, 8)}` : "—"}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5 truncate text-sm font-medium text-slate-900 dark:text-foreground">
          {meta.label} — pewność {formatConfidence(alert.confidence)}
          {alert.hasVideo && (
            <Video className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {alert.farmKey} · alert {alert.alertId.slice(0, 8)}
        </div>
      </div>

      <div className="text-right font-mono text-[11px] whitespace-nowrap text-muted-foreground/60">
        {formatRelativeDate(alert.detectedAt)}
      </div>

      <div />
    </div>
  )
}
