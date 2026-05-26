import type { Cow, HerdSummary, FeedEvent, CowYieldDay, Animal, PaginatedResponse } from '@/lib/types/stado.types'
import { MOCK_COWS, MOCK_FEED, MOCK_SUMMARY } from './stado.mock'
import apiClient from '@/lib/api-client'

const BASE = process.env.NEXT_PUBLIC_API_URL
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true' || true // Domyślnie true dla developmentu

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(response.status, `API Error: ${response.statusText}`)
  }
  return response.json()
}

/**
 * Pobiera listę zwierząt dla widoku stado z paginacją, sortowaniem i filtrowaniem.
 * GET /api/v1/animals
 */
export async function getAnimals(params: {
  farmId: string
  page?: number
  size?: number
  sort?: string
  search?: string
}): Promise<PaginatedResponse<Animal>> {
  const queryParams: Record<string, any> = {
    farmId: params.farmId,
    page: params.page,
    size: params.size,
    sort: params.sort,
  }

  if (params.search && params.search.trim() !== '') {
    queryParams.search = params.search
  }

  const response = await apiClient.get<PaginatedResponse<Animal>>('/animals', {
    params: queryParams,
  })
  return response.data
}

/**
 * Pobiera podsumowanie stada (liczniki w nagłówku).
 * GET /api/herd/summary
 */
export async function getHerdSummary(signal?: AbortSignal): Promise<HerdSummary> {
  if (USE_MOCKS) return MOCK_SUMMARY
  
  const response = await fetch(`${BASE}/api/herd/summary`, { signal })
  return handleResponse<HerdSummary>(response)
}

/**
 * Pobiera listę wszystkich krów dla tabeli.
 * GET /api/herd/cows
 * Query params: status?: CowStatus, search?: string
 */
export async function getCows(
  params?: { status?: string; search?: string },
  signal?: AbortSignal
): Promise<Cow[]> {
  if (USE_MOCKS) {
    let filtered = [...MOCK_COWS]
    if (params?.status && params.status !== 'all') {
      filtered = filtered.filter(c => c.status === params.status)
    }
    if (params?.search) {
      const s = params.search.toLowerCase()
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(s) || 
        c.earTagNumber.toLowerCase().includes(s)
      )
    }
    return filtered
  }

  const url = new URL(`${BASE}/api/herd/cows`)
  if (params?.status) url.searchParams.append('status', params.status)
  if (params?.search) url.searchParams.append('search', params.search)
  
  const response = await fetch(url.toString(), { signal })
  return handleResponse<Cow[]>(response)
}

/**
 * Pobiera pełne dane pojedynczej krowy (profil).
 * GET /api/herd/cows/:id
 */
export async function getCowById(id: number, signal?: AbortSignal): Promise<Cow> {
  if (USE_MOCKS) {
    const cow = MOCK_COWS.find(c => c.id === id)
    if (!cow) throw new ApiError(404, 'Cow not found')
    return cow
  }

  const response = await fetch(`${BASE}/api/herd/cows/${id}`, { signal })
  return handleResponse<Cow>(response)
}

/**
 * Pobiera feed ostatnich zdarzeń stada (domyślnie 3 najnowsze).
 * GET /api/herd/events/feed
 * Query params: limit?: number
 */
export async function getHerdFeed(
  params?: { limit?: number },
  signal?: AbortSignal
): Promise<FeedEvent[]> {
  if (USE_MOCKS) {
    return MOCK_FEED.slice(0, params?.limit || 3)
  }

  const url = new URL(`${BASE}/api/herd/events/feed`)
  if (params?.limit) url.searchParams.append('limit', params.limit.toString())
  
  const response = await fetch(url.toString(), { signal })
  return handleResponse<FeedEvent[]>(response)
}

/**
 * Pobiera historię wydajności krowy.
 * GET /api/herd/cows/:id/yield?days=14
 */
export async function getCowYieldHistory(
  cowId: number,
  days: number = 14,
  signal?: AbortSignal
): Promise<CowYieldDay[]> {
  if (USE_MOCKS) {
    const cow = MOCK_COWS.find(c => c.id === cowId)
    if (!cow) throw new ApiError(404, 'Cow not found')
    return cow.yieldHistory.slice(-days)
  }

  const response = await fetch(`${BASE}/api/herd/cows/${cowId}/yield?days=${days}`, { signal })
  return handleResponse<CowYieldDay[]>(response)
}

/**
 * Pobiera URL klipu wideo dla zdarzenia.
 * GET /api/herd/events/:eventId/clip
 * Zwraca: { url: string; expiresAt: string }
 */
export async function getEventClipUrl(
  eventId: string,
  signal?: AbortSignal
): Promise<{ url: string; expiresAt: string }> {
  if (USE_MOCKS) {
    return { 
      url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', 
      expiresAt: new Date(Date.now() + 3600000).toISOString() 
    }
  }

  const response = await fetch(`${BASE}/api/herd/events/${eventId}/clip`, { signal })
  return handleResponse<{ url: string; expiresAt: string }>(response)
}

/**
 * Dodaje nową krowę do stada.
 * POST /api/v1/farms/{farmId}/herd/cows
 */
export async function addCow(
  farmId: string,
  data: { earTagNumber: string; name: string; breed?: string; birthDate?: string }
): Promise<Cow> {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BASE}/api/v1/farms/${farmId}/herd/cows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse<Cow>(response);
}
