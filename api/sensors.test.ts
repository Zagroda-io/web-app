import { beforeEach, describe, expect, it, vi } from "vitest"

const get = vi.fn()
const post = vi.fn()
const patch = vi.fn()
const del = vi.fn()

vi.mock("@/lib/api-client", () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    post: (...args: unknown[]) => post(...args),
    patch: (...args: unknown[]) => patch(...args),
    delete: (...args: unknown[]) => del(...args),
  },
}))

import {
  activateSensor,
  assignSensorToAnimal,
  getFarmSensors,
  unassignSensorFromAnimal,
} from "./sensors"

describe("api/sensors", () => {
  beforeEach(() => {
    for (const fn of [get, post, patch, del]) fn.mockReset()
  })

  it("pobiera pulę czujników gospodarstwa", async () => {
    get.mockResolvedValue({ data: [{ devEui: "0080e115061bf535" }] })

    const sensors = await getFarmSensors()

    expect(get).toHaveBeenCalledWith("/sensors")
    expect(sensors).toHaveLength(1)
  })

  it("aktywuje czujnik danymi z etykiety bez zbędnych spacji", async () => {
    post.mockResolvedValue({ data: { devEui: "0080e115061bf535", status: "ACTIVE" } })

    const sensor = await activateSensor(" 00:80:E1:15:06:1B:F5:35 ", " 7KQ4M-X2PDR ")

    expect(post).toHaveBeenCalledWith("/sensors/activate", {
      devEui: "00:80:E1:15:06:1B:F5:35",
      activationCode: "7KQ4M-X2PDR",
    })
    expect(sensor.status).toBe("ACTIVE")
  })

  it("przypisuje czujnik krowie", async () => {
    patch.mockResolvedValue({})

    await assignSensorToAnimal("cow-1", "0080e115061bf535")

    expect(patch).toHaveBeenCalledWith("/animals/cow-1/sensor", null, {
      params: { sensorId: "0080e115061bf535" },
    })
  })

  it("odłącza czujnik od krowy", async () => {
    del.mockResolvedValue({})

    await unassignSensorFromAnimal("cow-1")

    expect(del).toHaveBeenCalledWith("/animals/cow-1/sensor")
  })
})
