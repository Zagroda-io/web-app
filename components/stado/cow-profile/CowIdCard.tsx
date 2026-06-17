import { AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  CategoryBadge,
  LactationBadge,
  SEX_LABELS,
} from "@/components/stado/AnimalBadges"
import type { AnimalDetails } from "@/lib/types/stado.types"

interface CowIdCardProps {
  animal: AnimalDetails
}

export function CowIdCard({ animal }: CowIdCardProps) {
  return (
    <Card
      className="mb-4 gap-0 overflow-hidden p-0 py-0 shadow-none data-[size=sm]:py-0"
      size="sm"
    >
      {/* Górna sekcja */}
      <div className="bg-slate-800 p-6 text-white dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-700 text-2xl dark:bg-slate-800">
            🐄
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-bold">{animal.name}</h2>
            <p className="truncate font-mono text-sm text-slate-300 dark:text-slate-400">
              {animal.earTagNumber || "Brak numeru"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {animal.bookType && (
            <Badge
              variant="secondary"
              className="border-none bg-slate-600 text-slate-100 hover:bg-slate-600 dark:bg-slate-700"
            >
              Księga: {animal.bookType}
            </Badge>
          )}
          {animal.breed && (
            <Badge
              variant="outline"
              className="border-slate-600 text-slate-100 dark:border-slate-700"
            >
              {animal.breed}
            </Badge>
          )}
          {animal.sensorId && (
            <Badge
              variant="outline"
              className="border-slate-600 text-slate-100 dark:border-slate-700"
            >
              Sensor: {animal.sensorId}
            </Badge>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-wrap items-center gap-2 border-b bg-muted/30 p-4">
        <CategoryBadge category={animal.category} />
        <LactationBadge status={animal.lactationStatus} />
        {animal.sex && (
          <Badge variant="outline" className="font-medium text-muted-foreground">
            {SEX_LABELS[animal.sex]}
          </Badge>
        )}
      </div>

      {/* Sugestia zasuszenia */}
      {animal.dryOffSuggested && (
        <div className="flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="text-xs leading-relaxed">
            <span className="font-semibold">Sugerowane zasuszenie.</span>{" "}
            {animal.suggestedDryOffDate
              ? `Zalecany termin: ${animal.suggestedDryOffDate.slice(0, 10)}.`
              : "Krowa przekroczyła próg długości laktacji."}
          </div>
        </div>
      )}

      {/* Dolna sekcja */}
      <div className="space-y-1 bg-card p-4">
        {animal.birthDate && (
          <DataField label="Data urodzenia" value={animal.birthDate} />
        )}
        {animal.ageLabel && <DataField label="Wiek" value={animal.ageLabel} />}
        {animal.lactationNumber > 0 && (
          <DataField
            label="Numer laktacji"
            value={String(animal.lactationNumber)}
          />
        )}
        {animal.dayInMilk != null && (
          <DataField
            label="Dni laktacji (DIM)"
            value={String(animal.dayInMilk)}
          />
        )}
        {animal.lastCalvingDate && (
          <DataField
            label="Ostatnie wycielenie"
            value={animal.lastCalvingDate.slice(0, 10)}
          />
        )}
        {animal.expectedCalvingDate && (
          <DataField
            label="Przewidywane wycielenie"
            value={animal.expectedCalvingDate.slice(0, 10)}
          />
        )}
        <DataField label="ID" value={animal.id.split("-")[0] + "..."} />
      </div>
    </Card>
  )
}

function DataField({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex justify-between border-b border-border/50 py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium text-foreground", valueClassName)}>
        {value}
      </span>
    </div>
  )
}
