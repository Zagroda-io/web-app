import type {
  FarmSensor,
  SensorConnectionStatus,
} from "@/lib/types/sensor.types"

interface ConnectionMeta {
  label: string
  dotClass: string
  badgeClass: string
}

const NO_DATA: ConnectionMeta = {
  label: "Brak danych",
  dotClass: "bg-slate-300 dark:bg-slate-600",
  badgeClass:
    "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/40",
}

const CONNECTION_META: Record<SensorConnectionStatus, ConnectionMeta> = {
  ONLINE: {
    label: "Online",
    dotClass: "bg-green-500",
    badgeClass:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/40",
  },
  WARNING: {
    label: "Niska bateria",
    dotClass: "bg-amber-400",
    badgeClass:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40",
  },
  OFFLINE: {
    label: "Offline",
    dotClass: "bg-destructive",
    badgeClass:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/40",
  },
}

/**
 * Stan połączenia do wyświetlenia. `null` od backendu znaczy „edge jeszcze nie słyszał
 * czujnika" — typowe tuż po aktywacji, więc nie straszymy hodowcy czerwonym „Offline".
 */
export function connectionMeta(
  status: SensorConnectionStatus | null
): ConnectionMeta {
  return status ? CONNECTION_META[status] ?? NO_DATA : NO_DATA
}

/**
 * DevEUI w formie z etykiety: `0080e115061bf535` → `00:80:E1:15:06:1B:F5:35`.
 * Identyfikatory spoza formatu (czujniki sprzed rejestru) zostają bez zmian.
 */
export function formatDevEui(devEui: string): string {
  if (!/^[0-9a-fA-F]{16}$/.test(devEui)) return devEui
  return devEui.toUpperCase().match(/.{2}/g)!.join(":")
}

function sameSensor(a: string | null | undefined, b: string | null | undefined) {
  return !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase()
}

/**
 * Czujniki, które można wybrać dla krowy: zwierzęce, aktywne i wolne — plus czujnik,
 * który ta krowa już nosi (żeby formularz edycji pokazywał bieżącą wartość).
 */
export function assignableSensors(
  sensors: FarmSensor[],
  currentSensorId?: string | null
): FarmSensor[] {
  return sensors.filter(
    (sensor) =>
      sameSensor(sensor.devEui, currentSensorId) ||
      (sensor.type === "ANIMAL" &&
        sensor.status === "ACTIVE" &&
        sensor.assignedAnimal === null)
  )
}

/** Poziom sygnału LoRa w słowach — dBm niewiele mówi hodowcy. */
export function signalLabel(rssi: number | null): string {
  if (rssi === null || rssi === undefined) return "—"
  if (rssi >= -90) return `Dobry (${rssi} dBm)`
  if (rssi >= -110) return `Średni (${rssi} dBm)`
  return `Słaby (${rssi} dBm)`
}

export interface SensorPoolSummary {
  total: number
  assigned: number
  free: number
  needsAttention: number
}

/** Liczniki nad tabelą; „wymaga uwagi" = offline albo niska bateria. */
export function summarizePool(sensors: FarmSensor[]): SensorPoolSummary {
  const assigned = sensors.filter((s) => s.assignedAnimal !== null).length
  return {
    total: sensors.length,
    assigned,
    free: sensors.length - assigned,
    needsAttention: sensors.filter(
      (s) => s.connectionStatus === "OFFLINE" || s.connectionStatus === "WARNING"
    ).length,
  }
}
