"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { KeyValueList } from "@/components/shared/KeyValueList"
import { SectionCard } from "@/components/shared/SectionCard"
import { AssignSensorDialog } from "@/components/sensors/AssignSensorDialog"
import { formatDevEui } from "@/components/sensors/sensor-utils"
import { textToneClass } from "@/lib/theme/tone"
import { formatDate } from "@/lib/stado/dates"
import type { AnimalDetails } from "@/lib/types/stado.types"
import { bcsTone, formatBcs } from "./bcs"

interface CowSensorCardProps {
  animal: AnimalDetails
  /** Po przypisaniu/odłączeniu czujnika — karta przeładowuje dane krowy. */
  onSensorChanged: () => void
}

export function CowSensorCard({ animal, onSensorChanged }: CowSensorCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const bcs = animal.latestBcs

  return (
    <SectionCard
      title="Czujnik i dane"
      aside={
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => setDialogOpen(true)}
        >
          {animal.sensorId ? "Zmień czujnik" : "Przypisz czujnik"}
        </Button>
      }
    >
      <KeyValueList
        items={[
          {
            label: "Czujnik",
            value: animal.sensorId ? formatDevEui(animal.sensorId) : "brak",
            mono: !!animal.sensorId,
          },
          {
            label: "Kondycja (BCS)",
            value: bcs ? formatBcs(bcs.score) : "—",
            valueClassName: bcs
              ? `font-medium ${textToneClass(bcsTone(bcs.score))}`
              : undefined,
          },
          { label: "Księga", value: animal.bookType ?? "—" },
          {
            label: "Ostatnie wycielenie",
            value: formatDate(animal.lastCalvingDate),
          },
          {
            label: "Sugerowane zasuszenie",
            value: formatDate(animal.suggestedDryOffDate),
            valueClassName: animal.dryOffSuggested
              ? textToneClass("warning")
              : undefined,
          },
        ]}
      />
      <AssignSensorDialog
        animal={{ id: animal.id, name: animal.name, sensorId: animal.sensorId }}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onChanged={onSensorChanged}
      />
    </SectionCard>
  )
}
