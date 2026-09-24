import { SectionCard } from "@/components/shared/SectionCard"
import { ToneBadge } from "@/components/shared/ToneBadge"
import { InlineError } from "@/components/shared/InlineError"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/stado/dates"
import { EVENT_TYPE_META } from "@/lib/stado/labels"
import { pluralPl } from "@/lib/utils/plural"
import type { AnimalEvent } from "@/lib/types/stado.types"

interface CowEventHistoryProps {
  events: AnimalEvent[] | null
  error?: boolean
  onRetry?: () => void
  className?: string
}

export function CowEventHistory({
  events,
  error,
  onRetry,
  className,
}: CowEventHistoryProps) {
  return (
    <SectionCard
      title="Historia zdarzeń"
      className={className}
      aside={
        error ? (
          <InlineError onRetry={onRetry} />
        ) : events ? (
          `${events.length} ${pluralPl(events.length, "zdarzenie", "zdarzenia", "zdarzeń")}`
        ) : null
      }
    >
      {events === null && !error && (
        <div className="space-y-2 p-3.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      )}
      {events?.length === 0 && (
        <p className="px-3.5 py-8 text-center text-[13px] text-muted-foreground">
          Brak zdarzeń — dodaj pierwsze przyciskiem „Zdarzenie”.
        </p>
      )}
      <ol>
        {events?.map((event, index) => {
          const meta = EVENT_TYPE_META[event.type]
          return (
            <li
              key={event.id}
              className="grid grid-cols-[84px_1fr] items-baseline gap-x-3 gap-y-1 px-3.5 py-2.5 data-[first=false]:border-t sm:grid-cols-[90px_130px_1fr]"
              data-first={index === 0}
            >
              <time
                dateTime={event.occurredAt}
                className="font-mono text-xs text-muted-foreground"
              >
                {formatDate(event.occurredAt)}
              </time>
              <div>
                <ToneBadge tone={meta?.tone ?? "neutral"} variant="tag">
                  {meta?.label ?? event.type}
                </ToneBadge>
              </div>
              <p className="col-span-2 min-w-0 sm:col-span-1">
                <span className="font-medium">
                  {event.title || meta?.label || event.type}
                </span>
                {event.description && (
                  <span className="text-muted-foreground">
                    {" "}
                    {event.description}
                  </span>
                )}
              </p>
            </li>
          )
        })}
      </ol>
    </SectionCard>
  )
}
