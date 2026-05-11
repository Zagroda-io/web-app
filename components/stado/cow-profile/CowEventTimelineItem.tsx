import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatRelativeDate } from '@/lib/utils/date-utils'
import type { CowEvent } from '@/lib/types/stado.types'

interface CowEventTimelineItemProps {
  event: CowEvent
  onPlayClip: (eventId: string) => void
}

const severityColors: Record<string, string> = {
  red: 'bg-destructive',
  amber: 'bg-amber-400',
  green: 'bg-green-500',
  info: 'bg-blue-400',
  neutral: 'bg-slate-300',
}

export function CowEventTimelineItem({ event, onPlayClip }: CowEventTimelineItemProps) {
  return (
    <div className="grid grid-cols-[16px_1fr_110px] gap-3 px-4 py-3 border-b last:border-0 hover:bg-muted/30 transition-colors items-start">
      <div
        className={cn(
          'w-2.5 h-2.5 rounded-full mt-1.5 shrink-0',
          severityColors[event.severity] || severityColors.neutral
        )}
      />

      <div className="min-w-0">
        <div className="text-sm font-medium text-slate-900 mb-0.5">{event.title}</div>
        <div className="text-xs text-muted-foreground leading-relaxed">{event.description}</div>

        {event.hasClip && (
          <Button
            variant="outline"
            size="sm"
            className="mt-2 h-7 text-[10px] px-2 py-0 border-slate-200"
            onClick={() => onPlayClip(event.id)}
          >
            <Play className="mr-1.5 h-3 w-3 fill-current" />
            Odtwórz klip 10s
          </Button>
        )}
      </div>

      <div className="font-mono text-[10px] text-muted-foreground/60 text-right mt-1 whitespace-nowrap">
        {formatRelativeDate(event.occurredAt)}
      </div>
    </div>
  )
}
