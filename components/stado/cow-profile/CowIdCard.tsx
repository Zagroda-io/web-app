import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Cow } from "@/lib/types/stado.types"

interface CowIdCardProps {
  cow: Cow
}

export function CowIdCard({ cow }: CowIdCardProps) {
  const getBcsColor = (bcs: number) => {
    if (bcs < 2.5) return "text-destructive"
    if (bcs < 3.0) return "text-amber-600"
    if (bcs <= 3.75) return "text-green-600"
    return "text-amber-600"
  }

  const getYieldColor = (status: string) => {
    if (status === "alert") return "text-destructive"
    if (status === "warn") return "text-amber-600"
    return "text-green-600"
  }

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
          <div>
            <h2 className="text-2xl font-bold">
              #{cow.id} {cow.name}
            </h2>
            <p className="font-mono text-sm text-slate-300 dark:text-slate-400">
              {cow.earTagNumber}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {cow.activeAlerts.length > 0 && (
            <Badge
              variant="destructive"
              className="bg-red-500 hover:bg-red-500"
            >
              {cow.activeAlerts.length} aktywne alerty
            </Badge>
          )}
          {cow.status === "dry" && (
            <Badge
              variant="secondary"
              className="border-none bg-slate-600 text-slate-100 hover:bg-slate-600 dark:bg-slate-700"
            >
              Zasuszenie
            </Badge>
          )}
          <Badge variant="outline" className="border-slate-600 text-slate-100 dark:border-slate-700">
            {cow.breed}
          </Badge>
        </div>
      </div>

      {/* Dolna sekcja */}
      <div className="space-y-1 p-4 bg-card">
        <DataField label="Wiek" value={cow.ageLabel} />
        <DataField
          label="Laktacja"
          value={`${cow.lactationNumber}. laktacja`}
        />
        <DataField
          label="Wydajność dziś"
          value={cow.status === "dry" ? "—" : `${cow.yieldToday} l`}
          valueClassName={
            cow.status === "dry"
              ? ""
              : cn("font-bold", getYieldColor(cow.status))
          }
        />
        <DataField
          label="BCS"
          value={cow.bcs.toFixed(2)}
          valueClassName={cn("font-bold", getBcsColor(cow.bcs))}
        />
        <DataField label="Rasa" value="Holstein-Friesian" />
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
      <div className="flex justify-between border-b py-2 text-sm last:border-0 border-border/50">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn("text-foreground font-medium", valueClassName)}>{value}</span>
      </div>
  )
}
