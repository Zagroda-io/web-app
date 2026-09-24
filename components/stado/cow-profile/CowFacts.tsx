import { FactGrid, type Fact } from "@/components/shared/FactGrid"
import { formatDaysAgo, formatDate } from "@/lib/stado/dates"
import { formatDevEui } from "@/components/sensors/sensor-utils"
import { lactationSummary, reproductionSummary } from "@/lib/stado/presenters"
import type { AnimalDetails } from "@/lib/types/stado.types"
import { bcsTone, formatBcs } from "./bcs"

/** Kafelki z najważniejszymi liczbami krowy. */
export function CowFacts({
  animal,
  now,
}: {
  animal: AnimalDetails
  now: Date
}) {
  const lactation = lactationSummary(animal)
  const reproduction = reproductionSummary(animal, now)
  const bcs = animal.latestBcs

  const facts: Fact[] = [
    {
      label: "Laktacja",
      value:
        animal.lactationStatus === "NONE" || !animal.lactationStatus
          ? "—"
          : `${animal.lactationNumber}.`,
      sub: lactation.label === "—" ? lactation.detail : lactation.label,
      tone: lactation.tone,
    },
    {
      label: "DIM",
      value: animal.dayInMilk ?? "—",
      sub:
        animal.lactationStatus === "LACTATING"
          ? "dni w mleku"
          : animal.lactationStatus === "DRY"
            ? "zasuszona"
            : "",
    },
    {
      label: "Rozród",
      value: reproduction.label,
      sub: reproduction.detail,
      tone: reproduction.tone,
    },
    {
      label: "Kondycja (BCS)",
      value: bcs ? formatBcs(bcs.score) : "—",
      sub: bcs ? `ocena ${formatDaysAgo(bcs.measuredAt, now)}` : "brak oceny",
      tone: bcs ? bcsTone(bcs.score) : "muted",
    },
    {
      label: "Wiek",
      value: animal.ageLabel ?? "—",
      sub: animal.birthDate ? `ur. ${formatDate(animal.birthDate)}` : "",
    },
    {
      label: "Czujnik",
      value: animal.sensorId ? formatDevEui(animal.sensorId) : "brak",
      sub: animal.sensorId ? "przypisany" : "przypisz czujnik",
      tone: animal.sensorId ? "default" : "muted",
    },
  ]

  return <FactGrid facts={facts} />
}
