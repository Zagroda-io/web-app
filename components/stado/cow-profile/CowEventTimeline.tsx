"use client"

import { useMemo, useState } from "react"
import { Card, CardHeader } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { CowEventTimelineItem } from "./CowEventTimelineItem"
import type { CowEvent } from "@/lib/types/stado.types"

interface CowEventTimelineProps {
  events: CowEvent[]
  onPlayClip: (eventId: string) => void
}

type EventFilter = "all" | "wet" | "ins" | "alert"

export function CowEventTimeline({
  events,
  onPlayClip,
}: CowEventTimelineProps) {
  const [filter, setFilter] = useState<EventFilter>("all")

  const filteredEvents = useMemo(() => {
    if (filter === "all") return events
    return events.filter((e) => e.category === filter)
  }, [events, filter])

  return (
    <Card
      className="gap-0 overflow-hidden p-0 py-0 shadow-none data-[size=sm]:py-0"
      size="sm"
    >
      <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 px-4 py-3">
        <h3 className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
          Historia zdarzeń
        </h3>

        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(v) => v && setFilter(v as EventFilter)}
          size="sm"
          className="h-7"
        >
          <ToggleGroupItem value="all" className="px-2 text-[10px]">
            Wszystkie
          </ToggleGroupItem>
          <ToggleGroupItem value="wet" className="px-2 text-[10px]">
            Weterynarz
          </ToggleGroupItem>
          <ToggleGroupItem value="ins" className="px-2 text-[10px]">
            Inseminacje
          </ToggleGroupItem>
          <ToggleGroupItem value="alert" className="px-2 text-[10px]">
            Alerty
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>

      <div className="divide-y divide-slate-100">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Brak zdarzeń dla wybranego filtra.
          </div>
        ) : (
          filteredEvents.map((event) => (
            <CowEventTimelineItem
              key={event.id}
              event={event}
              onPlayClip={onPlayClip}
            />
          ))
        )}
      </div>
    </Card>
  )
}
