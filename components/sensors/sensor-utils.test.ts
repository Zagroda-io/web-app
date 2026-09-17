import { describe, expect, it } from "vitest"
import { connectionMeta, formatDevEui, signalLabel } from "./sensor-utils"

describe("formatDevEui", () => {
  it("formatuje DevEUI jak na etykiecie", () => {
    expect(formatDevEui("0080e115061bf535")).toBe("00:80:E1:15:06:1B:F5:35")
  })

  it("zostawia identyfikatory spoza formatu bez zmian", () => {
    expect(formatDevEui("SENSOR-003")).toBe("SENSOR-003")
  })
})

describe("connectionMeta", () => {
  it("brak telemetrii to „Brak danych”, a nie Offline", () => {
    expect(connectionMeta(null).label).toBe("Brak danych")
  })

  it("mapuje stany z backendu", () => {
    expect(connectionMeta("ONLINE").label).toBe("Online")
    expect(connectionMeta("WARNING").label).toBe("Niska bateria")
    expect(connectionMeta("OFFLINE").label).toBe("Offline")
  })
})

describe("signalLabel", () => {
  it("opisuje sygnał słowami", () => {
    expect(signalLabel(-80)).toBe("Dobry (-80 dBm)")
    expect(signalLabel(-100)).toBe("Średni (-100 dBm)")
    expect(signalLabel(-120)).toBe("Słaby (-120 dBm)")
    expect(signalLabel(null)).toBe("—")
  })
})
