import type { FarmAlert, PaginatedResponse } from "@/lib/types/stado.types"
import apiClient from "@/lib/api-client"

/**
 * Pobiera alerty AI aktywnego gospodarstwa (najnowsze najpierw).
 * GET /api/v1/alerts?page=&size=
 */
export interface GetFarmAlertsParams {
  page?: number
  size?: number
}

export async function getFarmAlerts(
  params: GetFarmAlertsParams = {}
): Promise<PaginatedResponse<FarmAlert>> {
  const response = await apiClient.get<PaginatedResponse<FarmAlert>>(
    "/alerts",
    {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 20,
      },
    }
  )
  return response.data
}

/**
 * Pobiera treść klipu wideo alertu jako obiekt URL (blob) do odtworzenia w `<video>`.
 * Endpoint wymaga tokena (interceptor apiClient go dołącza), więc nie da się użyć
 * bezpośrednio `<video src>` — pobieramy blob i tworzymy lokalny URL.
 * GET /api/v1/farms/{farmId}/alerts/{alertId}/video/content
 *
 * Wołający odpowiada za zwolnienie URL (`URL.revokeObjectURL`) po zamknięciu odtwarzacza.
 */
export async function getAlertVideoObjectUrl(
  farmId: string,
  alertId: string
): Promise<string> {
  const response = await apiClient.get(
    `/farms/${farmId}/alerts/${alertId}/video/content`,
    { responseType: "blob" }
  )
  return URL.createObjectURL(response.data as Blob)
}
