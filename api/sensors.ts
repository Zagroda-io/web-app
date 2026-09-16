import apiClient from "@/lib/api-client"
import type { FarmSensor } from "@/lib/types/sensor.types"

/**
 * Pula czujników aktywnego gospodarstwa: rejestr + przypisana krowa + ostatnia telemetria.
 * GET /api/v1/sensors
 */
export async function getFarmSensors(): Promise<FarmSensor[]> {
  const response = await apiClient.get<FarmSensor[]>("/sensors")
  return response.data
}

/**
 * Aktywuje zakupiony czujnik w gospodarstwie — DevEUI i kod z etykiety.
 * Aplikacja mobilna wyśle te same dwie wartości odczytane z QR / NFC.
 * POST /api/v1/sensors/activate
 */
export async function activateSensor(
  devEui: string,
  activationCode: string
): Promise<FarmSensor> {
  const response = await apiClient.post<FarmSensor>("/sensors/activate", {
    devEui: devEui.trim(),
    activationCode: activationCode.trim(),
  })
  return response.data
}

/**
 * Przypisuje krowie czujnik z puli gospodarstwa.
 * PATCH /api/v1/animals/{animalId}/sensor?sensorId=
 */
export async function assignSensorToAnimal(
  animalId: string,
  devEui: string
): Promise<void> {
  await apiClient.patch(`/animals/${animalId}/sensor`, null, {
    params: { sensorId: devEui },
  })
}

/**
 * Odpina czujnik od krowy — wraca do wolnej puli.
 * DELETE /api/v1/animals/{animalId}/sensor
 */
export async function unassignSensorFromAnimal(animalId: string): Promise<void> {
  await apiClient.delete(`/animals/${animalId}/sensor`)
}
