import { describe, expect, it } from "vitest"
import type { FarmSensor } from "@/lib/types/sensor.types"
import {
  assignableSensors,
  connectionMeta,
  formatDevEui,
  signalLabel,
  summarizePool,
} from "./sensor-utils"

function sensor(overrides: Partial<FarmSensor>): FarmSensor {
  return {
    id: overrides.devEui ?? "id",
    devEui: "0080e115061bf535",
    type: "ANIMAL",
    model: null,
    status: "ACTIVE",
    activatedAt: "2026-09-16T08:00:00Z",
    assignedAnimal: null,
    connectionStatus: null,
    batteryPct: null,
    rssi: null,
    lastSeenAt: null,
    ...overrides,
  }
}

const MUĆKA = { id: "cow-1", name: "Mućka", earTagNumber: "PL005000000001" }

describe("formatDevEui", () => {
  it("formatuje DevEUI jak na etykiecie", () => {
    expect(formatDevEui("0080e115061bf535")).toBe("00:80:E1:15:06:1B:F5:35")
  })

  it("zostawia identyfikatory spoza formatu bez zmian", () => {
    expect(formatDevEui("SENSOR-003")).toBe("SENSOR-003")
  })
})

describe("assignableSensors", () => {
  const free = sensor({ devEui: "0000000000000001" })
  const taken = sensor({ devEui: "0000000000000002", assignedAnimal: MUĆKA })
  const environment = sensor({ devEui: "0000000000000003", type: "ENVIRONMENT" })
  const inStock = sensor({ devEui: "0000000000000004", status: "IN_STOCK" })

  it("proponuje tylko wolne, aktywne czujniki zwierzęce", () => {
    expect(
      assignableSensors([free, taken, environment, inStock]).map((s) => s.devEui)
    ).toEqual(["0000000000000001"])
  })

  /** Przy edycji krowa musi widzieć swój czujnik, choć formalnie jest zajęty — przez nią. */
  it("zostawia czujnik, który krowa już nosi (bez względu na wielkość liter)", () => {
    expect(
      assignableSensors([free, taken], "0000000000000002 ").map((s) => s.devEui)
    ).toEqual(["0000000000000001", "0000000000000002"])
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

describe("summarizePool", () => {
  it("liczy przypisane, wolne i wymagające uwagi", () => {
    expect(
      summarizePool([
        sensor({ assignedAnimal: MUĆKA, connectionStatus: "ONLINE" }),
        sensor({ connectionStatus: "OFFLINE" }),
        sensor({ connectionStatus: "WARNING" }),
        sensor({ connectionStatus: null }),
      ])
    ).toEqual({ total: 4, assigned: 1, free: 3, needsAttention: 2 })
  })
})
