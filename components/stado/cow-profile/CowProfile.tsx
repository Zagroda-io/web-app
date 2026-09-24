"use client"

import { useState } from "react"
import { AddEventDialog } from "@/components/stado/events/AddEventDialog"
import { useAnimalEvents } from "@/hooks/use-herd"
import type { AnimalDetails, AnimalEventType } from "@/lib/types/stado.types"
import { CowAlertBanner } from "./CowAlertBanner"
import { CowEventHistory } from "./CowEventHistory"
import { CowFacts } from "./CowFacts"
import { CowPedigreeCard } from "./CowPedigreeCard"
import { CowProfileHeader } from "./CowProfileHeader"
import { CowReproductionCard } from "./CowReproductionCard"
import { CowSensorCard } from "./CowSensorCard"

interface CowProfileProps {
  animal: AnimalDetails
  backHref: string
  /** Przeładowanie danych krowy po zmianie (zdarzenie, czujnik). */
  onRefresh: () => void
}

/** Karta krowy: nagłówek z akcjami, alert, liczby kluczowe, rozród, rodowód, czujnik i historia. */
export function CowProfile({ animal, backHref, onRefresh }: CowProfileProps) {
  const [now] = useState(() => new Date())
  const [eventType, setEventType] = useState<AnimalEventType | null>(null)
  const events = useAnimalEvents(animal.id)

  return (
    <div className="flex w-full animate-rise-in flex-col gap-5 px-4 pt-5 pb-10 md:px-6">
      <CowProfileHeader
        animal={animal}
        backHref={backHref}
        onAddEvent={setEventType}
      />

      {animal.activeAlert && (
        <CowAlertBanner alert={animal.activeAlert} now={now} />
      )}

      <CowFacts animal={animal} now={now} />

      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
        <CowReproductionCard animal={animal} now={now} />
        <CowPedigreeCard animal={animal} />
        <CowSensorCard animal={animal} onSensorChanged={onRefresh} />
        <CowEventHistory
          className="md:col-span-2 xl:col-span-3"
          events={events.data}
          error={events.error}
          onRetry={events.reload}
        />
      </div>

      <AddEventDialog
        animal={eventType ? animal : null}
        initialType={eventType ?? undefined}
        onClose={() => setEventType(null)}
        onSaved={() => {
          events.reload()
          onRefresh()
        }}
      />
    </div>
  )
}
