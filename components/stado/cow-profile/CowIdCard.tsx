import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
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

      {/* Dolna sekcja */}
      <div className="space-y-1 bg-card p-4">
        {animal.birthDate && (
          <DataField label="Data urodzenia" value={animal.birthDate} />
        )}
        {animal.breed && <DataField label="Rasa" value={animal.breed} />}
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
