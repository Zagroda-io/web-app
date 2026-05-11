import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatRelativeDate } from '@/lib/utils/date-utils'
import type { FeedEvent, AlertSeverity, FeedEventCategory } from '@/lib/types/stado.types'

interface EventFeedItemProps {
  event: FeedEvent
  onClick: (cowId: number) => void
}

const severityColors: Record<AlertSeverity, string> = {
  red: 'bg-destructive',
  amber: 'bg-amber-400',
  green: 'bg-green-500',
  info: 'bg-muted-foreground',
}

const categoryColors: Record<FeedEventCategory, string> = {
  alert: 'bg-red-50 text-red-700 border-red-100',
  estrus: 'bg-amber-50 text-amber-700 border-amber-100',
  yield: 'bg-amber-50 text-amber-700 border-amber-100',
  vet: 'bg-slate-50 text-slate-700 border-slate-100',
  insemination: 'bg-slate-50 text-slate-700 border-slate-100',
  dry: 'bg-slate-50 text-slate-700 border-slate-100',
  info: 'bg-slate-50 text-slate-700 border-slate-100',
}

export function EventFeedItem({ event, onClick }: EventFeedItemProps) {
  const isPulsing = event.severity === 'red' || event.severity === 'amber'

  return (
    <div
      onClick={() => onClick(event.cowId)}
      className="group grid grid-cols-[16px_80px_100px_1fr_120px_24px] items-center gap-4 px-4 py-3 hover:bg-muted/50 cursor-pointer border-b last:border-0 transition-colors overflow-x-auto md:overflow-x-visible"
    >
      <div className="flex justify-center">
        <div
          className={cn(
            'w-2 h-2 rounded-full shrink-0',
            severityColors[event.severity],
            isPulsing && 'animate-pulse'
          )}
        />
      </div>

      <div className="flex">
        <Badge
          variant="outline"
          className={cn(
            'text-[10px] px-1.5 py-0 uppercase font-bold w-full justify-center',
            categoryColors[event.category]
          )}
        >
          {event.categoryLabel}
        </Badge>
      </div>

      <div className="font-mono text-xs font-semibold text-muted-foreground truncate" title={`#${event.earTagShort} ${event.cowName}`}>
        #{event.earTagShort} {event.cowName}
      </div>

      <div className="min-w-0">
        <div className="text-sm font-medium truncate text-slate-900">{event.title}</div>
        <div className="text-xs text-muted-foreground truncate">{event.description}</div>
      </div>

      <div className="font-mono text-[11px] text-muted-foreground/60 text-right whitespace-nowrap">
        {formatRelativeDate(event.occurredAt)}
      </div>

      <div className="flex justify-end">
        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  )
}
