/** Rodzaj czujnika — tylko ANIMAL przypisuje się do krowy. */
export type SensorType = "ANIMAL" | "ENVIRONMENT"

/** Stan w rejestrze platformy; w puli gospodarstwa widać wyłącznie ACTIVE. */
export type SensorStatus = "IN_STOCK" | "ACTIVE"

/** Zdrowie wyliczone przez backend z telemetrii (te same progi co popover „Status urządzeń"). */
export type SensorConnectionStatus = "ONLINE" | "WARNING" | "OFFLINE"

/** Czujnik z puli gospodarstwa — GET /api/v1/sensors. */
export interface FarmSensor {
  id: string
  devEui: string
  type: SensorType
  model: string | null
  status: SensorStatus
  activatedAt: string | null // ISO datetime
  assignedAnimal: {
    id: string
    name: string
    earTagNumber: string | null
  } | null
  /** null = edge jeszcze nigdy nie zgłosił czujnika (to nie to samo co OFFLINE). */
  connectionStatus: SensorConnectionStatus | null
  batteryPct: number | null
  rssi: number | null
  lastSeenAt: string | null // ISO datetime
}

/** Filtr przypisania do krowy. */
export type SensorAssignmentFilter = "ASSIGNED" | "FREE"

/** Filtr stanu; ATTENTION = niska bateria albo brak kontaktu. */
export type SensorHealthFilter =
  | "ONLINE"
  | "WARNING"
  | "OFFLINE"
  | "NO_DATA"
  | "ATTENTION"

export type SensorSort =
  | "ATTENTION"
  | "BATTERY"
  | "LAST_SEEN"
  | "ANIMAL"
  | "ACTIVATED"
  | "DEV_EUI"

/** Podsumowanie całej puli — niezależne od filtrów listy. */
export interface SensorPoolSummary {
  total: number
  assigned: number
  free: number
  needsAttention: number
  noData: number
}

/** Strona czujników — GET /api/v1/sensors. */
export interface SensorPage {
  content: FarmSensor[]
  number: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  summary: SensorPoolSummary
}
