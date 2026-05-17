import type { HerdKpiData, UpcomingCalving } from "../types/herd.types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const getAuthToken = () => localStorage.getItem("auth_token") ?? ""

interface ApiError extends Error {
  status?: number
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const error = new Error(
      errorData.message || response.statusText
    ) as ApiError
    error.status = response.status
    throw error
  }
  return response.json()
}

/**
 * Fetches all KPI data for the herd overview page.
 * GET /api/v1/farms/{farmId}/herd/kpi
 */
export async function getHerdKpi(
  farmId: string,
  signal?: AbortSignal
): Promise<HerdKpiData> {
  const response = await fetch(`${BASE_URL}/api/v1/farms/${farmId}/herd/kpi`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    signal,
  })
  return handleResponse<HerdKpiData>(response)
}

/**
 * Fetches upcoming calvings for a given farm.
 * Optionally filter by days window (default: 14).
 * GET /api/v1/farms/{farmId}/herd/calvings/upcoming?daysAhead=14
 */
export async function getUpcomingCalvings(
  farmId: string,
  daysAhead: number = 14,
  signal?: AbortSignal
): Promise<UpcomingCalving[]> {
  const response = await fetch(
    `${BASE_URL}/api/v1/farms/${farmId}/herd/calvings/upcoming?daysAhead=${daysAhead}`,
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      signal,
    }
  )
  return handleResponse<UpcomingCalving[]>(response)
}
