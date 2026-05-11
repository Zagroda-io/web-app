import { AlertTriangle } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatRelativeDate } from '@/lib/utils/date-utils'
import type { CowAlert } from '@/lib/types/stado.types'

interface CowActiveAlertsProps {
  alerts: CowAlert[]
}

export function CowActiveAlerts({ alerts }: CowActiveAlertsProps) {
  if (alerts.length === 0) return null

  return (
    <Card className="mb-4 border-red-200 shadow-sm overflow-hidden p-0 gap-0" size="sm">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-red-50/50 border-b border-red-100">
        <h3 className="text-sm font-bold text-red-800">Aktywne alerty</h3>
        <Badge variant="destructive" className="h-5 px-1.5 text-[10px] font-bold">
          {alerts.length}
        </Badge>
      </CardHeader>
      <div className="divide-y divide-red-100">
        {alerts.map((alert) => (
          <div key={alert.id} className="grid grid-cols-[32px_1fr_100px] gap-3 p-4 bg-white items-start">
            <div
              className={cn(
                'rounded-lg p-1.5 shrink-0 flex items-center justify-center',
                alert.severity === 'red' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
              )}
            >
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 leading-tight mb-0.5">
                {alert.title}
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                {alert.description}
              </div>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground/70 text-right pt-0.5 whitespace-nowrap">
              {formatRelativeDate(alert.detectedAt)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
