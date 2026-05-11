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
      className="mb-4 gap-0 overflow-hidden border-red-200 p-0 py-0 shadow-sm data-[size=sm]:py-0"
      size="sm"
    >
      <CardHeader className="flex flex-row items-center justify-between border-b border-red-100 bg-red-50/50 px-4 py-3">
        <h3 className="text-sm font-bold text-red-800">Aktywne alerty</h3>
        <Badge
          variant="destructive"
          className="h-5 px-1.5 text-[10px] font-bold"
        >
          {alerts.length}
        </Badge>
      </CardHeader>
      <div className="divide-y divide-red-100">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="grid grid-cols-[32px_1fr_100px] items-start gap-3 bg-white p-4"
          >
            <div
              className={cn(
                "flex shrink-0 items-center justify-center rounded-lg p-1.5",
                alert.severity === "red"
                  ? "bg-red-100 text-red-600"
                  : "bg-amber-100 text-amber-600"
              )}
            >
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="mb-0.5 text-sm leading-tight font-semibold text-slate-900">
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
