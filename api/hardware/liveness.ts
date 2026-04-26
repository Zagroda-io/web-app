import { HardwareSummary } from "@/types/hardware"

// W przyszłości to będzie wołać prawdziwy endpoint np. apiClient.get('/hardware/status')
export const fetchHardwareStatus = async (): Promise<HardwareSummary> => {
  // Symulacja opóźnienia sieciowego
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    cameras: {
      total: 5,
      online: 5,
      devices: [
        {
          id: "cam-1",
          name: "Obora - Wejście",
          status: "online",
          lastSeen: new Date().toISOString(),
        },
        {
          id: "cam-2",
          name: "Obora - Sektor A",
          status: "online",
          lastSeen: new Date().toISOString(),
        },
        {
          id: "cam-3",
          name: "Obora - Sektor B",
          status: "online",
          lastSeen: new Date().toISOString(),
        },
        {
          id: "cam-4",
          name: "Pastwisko Północ",
          status: "online",
          lastSeen: new Date().toISOString(),
        },
        {
          id: "cam-5",
          name: "Pastwisko Zachód",
          status: "online",
          lastSeen: new Date().toISOString(),
        },
      ],
    },
    sensors: {
      total: 40,
      online: 38,
      devices: Array.from({ length: 40 }).map((_, i) => ({
        id: `sensor-${i + 1}`,
        name: `Obroża IoT #${1024 + i}`,
        status: i < 38 ? "online" : "offline",
        lastSeen:
          i < 38
            ? new Date().toISOString()
            : new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        battery: i < 38 ? Math.floor(Math.random() * 60) + 40 : 5,
      })),
    },
    edgeServer: {
      status: "online",
      cpuUsage: 24,
      ramUsage: 42,
      uptime: "12 dni, 4h 12m",
    },
  }
}
