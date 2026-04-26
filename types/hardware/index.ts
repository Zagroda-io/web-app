export type DeviceStatus = "online" | "offline" | "warning"

export interface Device {
  id: string
  name: string
  status: DeviceStatus
  lastSeen: string
  battery?: number // dla czujników
  signalStrength?: number
}

export interface HardwareSummary {
  cameras: {
    total: number
    online: number
    devices: Device[]
  }
  sensors: {
    total: number
    online: number
    devices: Device[]
  }
  edgeServer: {
    status: DeviceStatus
    cpuUsage: number
    ramUsage: number
    uptime: string
  }
}
