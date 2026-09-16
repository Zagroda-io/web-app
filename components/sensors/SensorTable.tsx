"use client"

import Link from "next/link"
import { BatteryLow } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { formatRelativeDate } from "@/lib/utils/date-utils"
import type { FarmSensor } from "@/lib/types/sensor.types"
import { connectionMeta, formatDevEui, signalLabel } from "./sensor-utils"

const TYPE_LABELS: Record<FarmSensor["type"], string> = {
  ANIMAL: "Zwierzęcy",
  ENVIRONMENT: "Środowiskowy",
}

export function SensorTable({ sensors }: { sensors: FarmSensor[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 text-[10px] tracking-[0.08em] uppercase dark:bg-muted/20">
            <TableHead>Krowa</TableHead>
            <TableHead>Czujnik</TableHead>
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
  )
}

/**
 * Krowa w pierwszej kolumnie: hodowca myśli „co z obrożą Mućki", a nie „co z 0080E115…".
 */
function SensorRow({ sensor }: { sensor: FarmSensor }) {
  const connection = connectionMeta(sensor.connectionStatus)
  const lowBattery = sensor.batteryPct !== null && sensor.batteryPct < 20

  return (
    <TableRow>
      <TableCell className="text-sm">
        {sensor.assignedAnimal ? (
          <Link href={`/dashboard/stado/${sensor.assignedAnimal.id}`} className="hover:underline">
            <span className="font-medium">{sensor.assignedAnimal.name}</span>
            {sensor.assignedAnimal.earTagNumber && (
              <span className="block font-mono text-[11px] text-muted-foreground">
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
        <div className="font-mono text-xs font-semibold">{formatDevEui(sensor.devEui)}</div>
        <div className="text-[11px] text-muted-foreground">
          {[TYPE_LABELS[sensor.type] ?? sensor.type, sensor.model].filter(Boolean).join(" · ")}
        </div>
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
