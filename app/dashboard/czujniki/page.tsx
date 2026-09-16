"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { BatteryLow, Plus, Radio } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ApiErrorState } from "@/components/shared/ApiErrorState"
import { ActivateSensorDialog } from "@/components/sensors/ActivateSensorDialog"
import {
  connectionMeta,
  formatDevEui,
  signalLabel,
  summarizePool,
} from "@/components/sensors/sensor-utils"
import { getFarmSensors } from "@/api/sensors"
import { cn } from "@/lib/utils"
import { formatRelativeDate } from "@/lib/utils/date-utils"
import type { FarmSensor } from "@/lib/types/sensor.types"

const TYPE_LABELS: Record<FarmSensor["type"], string> = {
  ANIMAL: "Zwierzęcy",
  ENVIRONMENT: "Środowiskowy",
}

/**
 * Pula czujników gospodarstwa: co jest aktywowane, na której krowie i czy nadaje.
 * Stąd hodowca aktywuje nowo kupiony czujnik; przypisanie do krowy robi w jej profilu
 * albo przy dodawaniu krowy.
 */
export default function CzujnikiPage() {
  const [sensors, setSensors] = useState<FarmSensor[] | null>(null)
  const [error, setError] = useState(false)
  const [activateOpen, setActivateOpen] = useState(false)

  // Stan ustawiamy dopiero w odpowiedzi na zapytanie — nie synchronicznie w efekcie.
  const loadSensors = useCallback(
    () =>
      getFarmSensors().then(setSensors, (err) => {
        console.error("Błąd ładowania czujników:", err)
        setError(true)
      }),
    []
  )

  useEffect(() => {
    loadSensors()
  }, [loadSensors])

  const retry = () => {
    setError(false)
    setSensors(null)
    loadSensors()
  }

  const summary = useMemo(() => summarizePool(sensors ?? []), [sensors])

  return (
    <div className="flex flex-1 flex-col gap-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Czujniki</h1>
          <p className="text-xs text-muted-foreground">
            Czujniki aktywowane w Twoim gospodarstwie i ich przypisanie do krów
          </p>
        </div>
        <Button className="gap-2" onClick={() => setActivateOpen(true)}>
          <Plus className="h-4 w-4" />
          Aktywuj czujnik
        </Button>
      </div>

      {error ? (
        <ApiErrorState
          message="Nie udało się pobrać listy czujników."
          onRetry={retry}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <SummaryTile label="Wszystkie" value={summary.total} loading={!sensors} />
            <SummaryTile label="Na krowach" value={summary.assigned} loading={!sensors} />
            <SummaryTile label="Wolne" value={summary.free} loading={!sensors} />
            <SummaryTile
              label="Wymaga uwagi"
              value={summary.needsAttention}
              loading={!sensors}
              highlight={summary.needsAttention > 0}
            />
          </div>

          <Card
            className="gap-0 overflow-hidden p-0 py-0 shadow-none data-[size=sm]:py-0"
            size="sm"
          >
            {sensors === null ? (
              <div className="flex flex-col gap-3 p-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : sensors.length === 0 ? (
              <EmptyState onActivate={() => setActivateOpen(true)} />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 text-[10px] tracking-[0.08em] uppercase dark:bg-muted/20">
                      <TableHead>Czujnik</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead>Krowa</TableHead>
                      <TableHead>Połączenie</TableHead>
                      <TableHead className="text-right">Bateria</TableHead>
                      <TableHead>Sygnał</TableHead>
                      <TableHead className="text-right">Ostatni kontakt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sensors.map((sensor) => (
                      <SensorRow key={sensor.id} sensor={sensor} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </>
      )}

      <ActivateSensorDialog
        open={activateOpen}
        onOpenChange={setActivateOpen}
        onActivated={(sensor) =>
          setSensors((current) => [
            sensor,
            ...(current ?? []).filter((s) => s.id !== sensor.id),
          ])
        }
      />
    </div>
  )
}

function SensorRow({ sensor }: { sensor: FarmSensor }) {
  const connection = connectionMeta(sensor.connectionStatus)
  const lowBattery = sensor.batteryPct !== null && sensor.batteryPct < 20

  return (
    <TableRow>
      <TableCell>
        <div className="font-mono text-xs font-semibold">
          {formatDevEui(sensor.devEui)}
        </div>
        {sensor.model && (
          <div className="text-[11px] text-muted-foreground">{sensor.model}</div>
        )}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {TYPE_LABELS[sensor.type] ?? sensor.type}
      </TableCell>
      <TableCell className="text-xs">
        {sensor.assignedAnimal ? (
          <Link
            href={`/dashboard/stado/${sensor.assignedAnimal.id}`}
            className="font-medium hover:underline"
          >
            {sensor.assignedAnimal.name}
            {sensor.assignedAnimal.earTagNumber && (
              <span className="ml-1 font-mono text-muted-foreground">
                {sensor.assignedAnimal.earTagNumber}
              </span>
            )}
          </Link>
        ) : (
          <span className="text-muted-foreground">
            {sensor.type === "ANIMAL" ? "Wolny" : "—"}
          </span>
        )}
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={cn("gap-1.5 px-1.5 py-0 text-[10px] font-bold uppercase", connection.badgeClass)}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", connection.dotClass)} />
          {connection.label}
        </Badge>
      </TableCell>
      <TableCell
        className={cn(
          "text-right font-mono text-xs",
          lowBattery && "font-semibold text-amber-700 dark:text-amber-400"
        )}
      >
        <span className="inline-flex items-center gap-1">
          {lowBattery && <BatteryLow className="h-3.5 w-3.5" />}
          {sensor.batteryPct !== null ? `${sensor.batteryPct}%` : "—"}
        </span>
      </TableCell>
      <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
        {signalLabel(sensor.rssi)}
      </TableCell>
      <TableCell className="text-right font-mono text-[11px] whitespace-nowrap text-muted-foreground">
        {sensor.lastSeenAt ? formatRelativeDate(sensor.lastSeenAt) : "—"}
      </TableCell>
    </TableRow>
  )
}

function SummaryTile({
  label,
  value,
  loading,
  highlight,
}: {
  label: string
  value: number
  loading: boolean
  highlight?: boolean
}) {
  return (
    <Card className="gap-1 px-4 py-3 shadow-none" size="sm">
      <span className="text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
        {label}
      </span>
      {loading ? (
        <Skeleton className="h-6 w-10" />
      ) : (
        <span
          className={cn(
            "text-xl font-semibold tabular-nums",
            highlight && "text-amber-700 dark:text-amber-400"
          )}
        >
          {value}
        </span>
      )}
    </Card>
  )
}

function EmptyState({ onActivate }: { onActivate: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Radio className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Nie masz jeszcze aktywnych czujników</p>
        <p className="max-w-sm text-xs text-muted-foreground">
          Aktywuj zakupiony czujnik danymi z etykiety. Potem przypiszesz go do krowy
          przy jej dodawaniu albo w profilu krowy.
        </p>
      </div>
      <Button variant="outline" size="sm" className="gap-2" onClick={onActivate}>
        <Plus className="h-4 w-4" />
        Aktywuj czujnik
      </Button>
    </div>
  )
}
