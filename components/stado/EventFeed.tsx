import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { EventFeedItem } from './EventFeedItem'
import type { FeedEvent } from '@/lib/types/stado.types'

interface EventFeedProps {
  events: FeedEvent[]
  isLoading?: boolean
  onCowClick: (cowId: number) => void
  onShowAll: () => void
  activeAlertCount: number
}

export function EventFeed({
  events,
  isLoading,
  onCowClick,
  onShowAll,
  activeAlertCount,
}: EventFeedProps) {
  return (
    <Card className="mb-6 overflow-hidden p-0 gap-0" size="sm">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50/50">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Ostatnie zdarzenia
          </span>
          {activeAlertCount > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              {activeAlertCount} aktywne alerty
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs font-medium text-primary hover:text-primary hover:bg-primary/5"
          onClick={onShowAll}
        >
          Pokaż wszystkie
          <ChevronRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex flex-col">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[16px_80px_100px_1fr_120px_24px] items-center gap-4 px-4 py-3 border-b last:border-0 overflow-x-auto md:overflow-x-visible"
            >
              <div className="flex justify-center">
                <Skeleton className="w-2 h-2 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-4 w-16 ml-auto" />
              <div className="flex justify-end">
                <Skeleton className="w-4 h-4 rounded" />
              </div>
            </div>
          ))
        ) : (
          events.slice(0, 3).map((event) => (
            <EventFeedItem key={event.id} event={event} onClick={onCowClick} />
          ))
        )}
      </div>
    </Card>
  )
}
