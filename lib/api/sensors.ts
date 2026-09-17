import apiClient from "@/lib/api-client"
import type {
  FarmSensor,
  SensorAssignmentFilter,
  SensorHealthFilter,
  SensorPage,
  SensorSort,
} from "@/lib/types/sensor.types"

export interface SensorListParams {
  search?: string
  assignment?: SensorAssignmentFilter
  health?: SensorHealthFilter
  sort?: SensorSort
  page?: number
  size?: number
}

/**
 * Strona puli czujników gospodarstwa z podsumowaniem całej puli.
 * GET /api/v1/sensors?search=&assignment=&health=&sort=&page=&size=
 */
export async function getFarmSensors(
  params: SensorListParams = {}
): Promise<SensorPage> {
  // Puste filtry pomijamy — dla backendu brak parametru znaczy „bez zawężenia".
  const query = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  )
  const response = await apiClient.get<SensorPage>("/sensors", { params: query })
  return response.data
}

/**
 * Czujniki do wyboru dla krowy: aktywne, zwierzęce, wolne — plus czujnik, który krowa
 * `animalId` już nosi. Reguły są po stronie backendu, te same co przy zapisie.
 * GET /api/v1/sensors/assignable?animalId=
 */
export async function getAssignableSensors(
  animalId?: string
): Promise<FarmSensor[]> {
  const response = await apiClient.get<FarmSensor[]>("/sensors/assignable", {
    params: animalId ? { animalId } : {},
  })
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
