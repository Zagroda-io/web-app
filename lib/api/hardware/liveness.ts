import apiClient from "@/lib/api-client"
import type { DeviceStatus, HardwareSummary } from "@/types/hardware"

/**
 * Kształt odpowiedzi backendu. Różni się od `HardwareSummary` jednym szczegółem:
 * status przychodzi jako enum Javy (ONLINE/WARNING/OFFLINE), a UI operuje na małych literach.
 */
interface HardwareStatusResponse
  extends Omit<HardwareSummary, "cameras" | "sensors" | "edgeServer" | "overall"> {
  overall: RawOverall | null
  cameras: RawDeviceGroup
  sensors: RawDeviceGroup
  edgeServer: RawEdgeServer | null
}

interface RawOverall {
  status: string
  lastSyncAt: string | null
  offlineDevices: number
  warningDevices: number
}

interface RawDeviceGroup {
  total: number
  online: number
  devices: RawDevice[]
}

interface RawDevice {
  id: string
  name: string
  status: string
  lastSeen: string | null
  battery?: number | null
  signalStrength?: number | null
}

interface RawEdgeServer {
  status: string
  cpuPercent: number | null
  ramMb: number | null
  diskGb: number | null
  temperatureC: number | null
  appVersion: string | null
  kafkaConsumerLag: number | null
  lastSeen: string | null
  services: { name: string; up: boolean; checkedAt: string | null }[] | null
}

/**
 * Enum Javy -> literał UI. Nieznana wartość ląduje na "offline", a nie na czymś optymistycznym:
 * jeśli nie rozumiemy statusu, lepiej pokazać, że coś jest nie tak, niż udawać, że działa.
 */
const toDeviceStatus = (value: string | null | undefined): DeviceStatus => {
  switch (value?.toUpperCase()) {
    case "ONLINE":
      return "online"
    case "WARNING":
      return "warning"
    default:
      return "offline"
  }
}

/**
 * Stan infrastruktury aktywnego gospodarstwa.
 * GET /api/v1/telemetry/hardware-status
 */
export const fetchHardwareStatus = async (): Promise<HardwareSummary> => {
  const response = await apiClient.get<HardwareStatusResponse>(
    "/telemetry/hardware-status"
  )
  const data = response.data

  const mapGroup = (group: RawDeviceGroup | null) => ({
    total: group?.total ?? 0,
    online: group?.online ?? 0,
    devices: (group?.devices ?? []).map((device) => ({
      ...device,
      status: toDeviceStatus(device.status),
    })),
  })

  return {
    farmKey: data.farmKey ?? null,
    overall: {
      status: toDeviceStatus(data.overall?.status),
      lastSyncAt: data.overall?.lastSyncAt ?? null,
      offlineDevices: data.overall?.offlineDevices ?? 0,
      warningDevices: data.overall?.warningDevices ?? 0,
    },
    cameras: mapGroup(data.cameras),
    sensors: mapGroup(data.sensors),
    edgeServer: data.edgeServer
      ? {
          ...data.edgeServer,
          status: toDeviceStatus(data.edgeServer.status),
          services: data.edgeServer.services ?? [],
        }
      : null,
  }
}
