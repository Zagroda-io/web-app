import { AlertTriangle } from "lucide-react"
import { Card, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatRelativeDate } from "@/lib/utils/date-utils"
import type { CowAlert } from "@/lib/types/stado.types"

interface CowActiveAlertsProps {
  alerts: CowAlert[]
}

export function CowActiveAlerts({ alerts }: CowActiveAlertsProps) {
  if (alerts.length === 0) return null

  return (
    <Card
      className="mb-4 gap-0 overflow-hidden p-0 py-0 shadow-none data-[size=sm]:py-0"
      size="sm"
    >
      <CardHeader className="flex flex-row items-center justify-between border-b border-red-100 bg-red-50/50 px-4 py-3 dark:border-red-900/30 dark:bg-red-950/20">
        <h3 className="text-[11px] font-semibold tracking-[0.08em] text-red-800 uppercase dark:text-red-400">
          Aktywne alerty
        </h3>
        <Badge
          variant="destructive"
          className="h-5 rounded-[20px] border-none px-2 text-[10px] font-bold"
        >
          {alerts.length}
        </Badge>
      </CardHeader>
      <div className="divide-y divide-red-100 dark:divide-red-900/20">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="grid grid-cols-[32px_1fr_100px] items-start gap-3 bg-white p-4 dark:bg-card"
          >
            <div
              className={cn(
                "flex shrink-0 items-center justify-center rounded-lg p-1.5",
                alert.severity === "red"
                  ? "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                  : "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
              )}
            >
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="mb-0.5 text-sm leading-tight font-semibold text-slate-900 dark:text-foreground">
                {alert.title}
              </div>
              <div className="text-xs leading-relaxed text-muted-foreground">
                {alert.description}
              </div>
            </div>
            <div className="pt-0.5 text-right font-mono text-[10px] whitespace-nowrap text-muted-foreground/70">
              {formatRelativeDate(alert.detectedAt)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
