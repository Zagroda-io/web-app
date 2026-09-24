"use client"

import { InlineError } from "@/components/shared/InlineError"
import { SectionCard } from "@/components/shared/SectionCard"
import { StatusDot } from "@/components/shared/StatusDot"
import { ToneBadge } from "@/components/shared/ToneBadge"
import { Skeleton } from "@/components/ui/skeleton"
import { groupAgenda } from "@/lib/stado/agenda"
import { pluralPl } from "@/lib/utils/plural"
import type { HerdAgendaItem } from "@/lib/types/stado.types"

interface HerdAgendaProps {
  items: HerdAgendaItem[] | null
  days: number
  now: Date
  error?: boolean
  onRetry?: () => void
  onOpenAnimal: (animalId: string) => void
}

/** Boczna agenda: co trzeba zrobić dziś, jutro i w ciągu dwóch tygodni. */
export function HerdAgenda({
  items,
  days,
  now,
  error,
  onRetry,
  onOpenAnimal,
}: HerdAgendaProps) {
  const groups = items ? groupAgenda(items, now) : []

  return (
    <SectionCard
      title={`Najbliższe ${days} dni`}
      aside={
        error ? (
          <InlineError onRetry={onRetry} />
        ) : items ? (
          `${items.length} ${pluralPl(items.length, "pozycja", "pozycje", "pozycji")}`
        ) : null
      }
      className="lg:sticky lg:top-5"
      bodyClassName="max-h-[calc(100vh-140px)] overflow-y-auto pb-1.5"
    >
      {items === null && !error && (
        <div className="space-y-3 p-3.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      )}
      {items && groups.length === 0 && (
        <p className="px-3.5 py-8 text-center text-[13px] text-muted-foreground">
          Brak zaplanowanych czynności.
        </p>
      )}
      {groups.map((group) => (
        <div key={group.label}>
          <div className="flex justify-between px-3.5 pt-2.5 pb-1 text-xs font-semibold">
            <span>{group.label}</span>
            <span className="font-normal text-muted-foreground/70">
              {group.dateLabel}
            </span>
          </div>
          <ul>
            {group.entries.map((entry) => (
              <li key={entry.key}>
                <button
                  type="button"
                  onClick={() => onOpenAnimal(entry.animalId)}
                  className="grid w-full grid-cols-[8px_1fr_auto] items-center gap-2.5 px-3.5 py-2 text-left hover:bg-surface-hover"
                >
                  <StatusDot tone={entry.tone} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium">
                      {entry.title}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {entry.subject}
                    </span>
                  </span>
                  <ToneBadge tone={entry.tone} variant="tag">
                    {entry.kind}
                  </ToneBadge>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </SectionCard>
  )
}
