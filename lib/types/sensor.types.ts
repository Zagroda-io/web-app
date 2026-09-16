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
