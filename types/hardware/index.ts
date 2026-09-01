export type DeviceStatus = "online" | "offline" | "warning"

export interface Device {
  id: string
  /** Etykieta gotowa do wyświetlenia — backend składa ją z cameraId / skróconego deviceId. */
  name: string
  status: DeviceStatus
  /** ISO-8601. Null, gdy urządzenie nie zgłosiło jeszcze kontaktu. */
  lastSeen: string | null
  /** Procent baterii — tylko czujniki IoT. */
  battery?: number | null
  /** RSSI w dBm — tylko czujniki IoT. */
  signalStrength?: number | null
}

export interface DeviceGroup {
  total: number
  online: number
  devices: Device[]
}

/** Pojedyncza usługa z watchdoga serwera edge (klucze w formacie `host:port`). */
export interface ServiceHealth {
  name: string
  up: boolean
  checkedAt: string | null
}

/**
 * Metryki serwera edge.
 *
 * RAM i dysk są BEZWZGLĘDNE (MB/GB), nie procentowe — edge nie raportuje pojemności
 * całkowitej, więc procentu nie da się policzyć. Procentowe jest tylko CPU.
 */
export interface EdgeServer {
  status: DeviceStatus
  cpuPercent: number | null
  ramMb: number | null
  diskGb: number | null
  temperatureC: number | null
  appVersion: string | null
  kafkaConsumerLag: number | null
  /** ISO-8601 — moment odczytu nadany przez edge. Zastępuje uptime, którego edge nie wysyła. */
  lastSeen: string | null
  services: ServiceHealth[]
}

/**
 * Zbiorcza ocena infrastruktury pod pasek stanu w nagłówku.
 * Backend zwraca dane (status + liczniki), tekst składa UI — inaczej polska kopia
 * siedziałaby w API i każda zmiana treści wymagałaby wydania backendu.
 */
export interface OverallHealth {
  status: DeviceStatus
  /** ISO-8601 — ostatnia ramka telemetrii. Null, gdy edge nigdy nie raportował. */
  lastSyncAt: string | null
  offlineDevices: number
  warningDevices: number
}

export interface HardwareSummary {
  farmKey: string | null
  overall: OverallHealth
  cameras: DeviceGroup
  sensors: DeviceGroup
  /** Null, gdy gospodarstwo nigdy nie przysłało telemetrii. */
  edgeServer: EdgeServer | null
}
