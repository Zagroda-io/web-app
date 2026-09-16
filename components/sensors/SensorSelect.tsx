"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getFarmSensors } from "@/api/sensors"
import type { FarmSensor } from "@/lib/types/sensor.types"
import { assignableSensors, formatDevEui } from "./sensor-utils"

/** Radix Select nie przyjmuje pustej wartości opcji — „bez czujnika" ma własny znacznik. */
const NO_SENSOR = "__none__"

interface SensorSelectProps {
  id?: string
  /** DevEUI wybranego czujnika albo pusty tekst = bez czujnika. */
  value: string
  onChange: (devEui: string) => void
  /** Czujnik, który krowa już nosi — zostaje na liście, choć formalnie jest zajęty. */
  currentSensorId?: string | null
  disabled?: boolean
}

/**
 * Wybór czujnika z puli gospodarstwa. Pokazuje wyłącznie czujniki, które da się przypisać
 * (aktywne, zwierzęce, wolne) — backend i tak to waliduje, ale nie ma sensu proponować
 * opcji, która skończy się błędem.
 */
export function SensorSelect({
  id,
  value,
  onChange,
  currentSensorId,
  disabled,
}: SensorSelectProps) {
  const [sensors, setSensors] = useState<FarmSensor[] | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    getFarmSensors()
      .then((data) => {
        if (!cancelled) setSensors(data)
      })
      .catch((err) => {
        console.error("Nie udało się pobrać czujników gospodarstwa:", err)
        if (!cancelled) setLoadFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const options = useMemo(
    () => (sensors ? assignableSensors(sensors, currentSensorId) : []),
    [sensors, currentSensorId]
  )

  if (loadFailed) {
    return (
      <p className="text-xs text-destructive">
        Nie udało się pobrać listy czujników.
      </p>
    )
  }

  const isLoading = sensors === null
  const noOptions = !isLoading && options.length === 0

  return (
    <div className="space-y-1.5">
      <Select
        value={value ? value : NO_SENSOR}
        onValueChange={(next) => onChange(next === NO_SENSOR ? "" : next)}
        disabled={disabled || isLoading}
      >
        <SelectTrigger id={id} className="w-full font-mono text-xs">
          <SelectValue
            placeholder={isLoading ? "Ładowanie czujników…" : "Bez czujnika"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NO_SENSOR} className="font-sans">
            Bez czujnika
          </SelectItem>
          {options.map((sensor) => (
            <SelectItem
              key={sensor.id}
              value={sensor.devEui}
              className="font-mono text-xs"
            >
              {formatDevEui(sensor.devEui)}
              {sensor.model ? ` · ${sensor.model}` : ""}
              {sensor.batteryPct !== null ? ` · ${sensor.batteryPct}%` : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {noOptions && (
        <p className="text-xs text-muted-foreground">
          Brak wolnych czujników.{" "}
          <Link
            href="/dashboard/czujniki"
            className="font-medium text-foreground underline underline-offset-2"
          >
            Aktywuj czujnik
          </Link>
          , żeby przypisać go do krowy.
        </p>
      )}
    </div>
  )
}
