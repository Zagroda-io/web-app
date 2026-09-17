import apiClient from "@/lib/api-client"
import { HerdKpiData, UpcomingCalving } from "@/types/herd.types"

export const getHerdKpi = async (
  farmId: string,
  signal?: AbortSignal
): Promise<HerdKpiData> => {
  try {
    const response = await apiClient.get<HerdKpiData>(`/farms/${farmId}/kpi`, {
      signal,
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const getUpcomingCalvings = async (
  farmId: string,
  daysAhead: number = 14,
  signal?: AbortSignal
): Promise<UpcomingCalving[]> => {
  try {
    const response = await apiClient.get<UpcomingCalving[]>(
      `/farms/${farmId}/upcoming-calvings`,
      {
        params: { daysAhead },
        signal,
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}
