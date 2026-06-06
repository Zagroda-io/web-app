import type {
  Animal,
  AnimalDetails,
  Cow,
  CowYieldDay,
  FeedEvent,
  HerdSummary,
  PaginatedResponse,
} from "@/lib/types/stado.types"
import apiClient from "@/lib/api-client"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = "ApiError"
  }
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

  if (params.search && params.search.trim() !== "") {
    queryParams.search = params.search
  }

  const response = await apiClient.get<PaginatedResponse<Animal>>("/animals", {
    params: queryParams,
  })
  return response.data
}

/**
 * Pobiera szczegółowe dane pojedynczego zwierzęcia.
 * GET /api/v1/animals/:id
 */
export async function getAnimalDetails(id: string): Promise<AnimalDetails> {
  const response = await apiClient.get<AnimalDetails>(`/animals/${id}`)
  return response.data
}

/**
 * Pobiera podsumowanie stada (liczniki w nagłówku).
 * GET /api/v1/animals/herd/summary
 */
export async function getHerdSummary(): Promise<HerdSummary> {
  const response = await apiClient.get<HerdSummary>("/animals/herd/summary")
  return response.data
}

/**
 * Pobiera listę wszystkich krów dla tabeli.
 * GET /api/v1/animals/herd/cows
 * Query params: status?: CowStatus, search?: string
 */
export async function getCows(params?: {
  status?: string
  search?: string
}): Promise<Cow[]> {
  const response = await apiClient.get<Cow[]>("/animals/herd/cows", { params })
  return response.data
}

/**
 * Pobiera pełne dane pojedynczej krowy (profil).
 * GET /api/v1/animals/herd/cows/:id
 */
export async function getCowById(id: number): Promise<Cow> {
  const response = await apiClient.get<Cow>(`/animals/herd/cows/${id}`)
  return response.data
}

/**
 * Pobiera feed ostatnich zdarzeń stada (domyślnie 3 najnowsze).
 * GET /api/v1/animals/herd/events/feed
 * Query params: limit?: number
 */
export async function getHerdFeed(params?: {
  limit?: number
}): Promise<FeedEvent[]> {
  const response = await apiClient.get<FeedEvent[]>(
    "/animals/herd/events/feed",
    {
      params,
    }
  )
  return response.data
}

/**
 * Pobiera historię wydajności krowy.
 * GET /api/v1/animals/herd/cows/:id/yield?days=14
 */
export async function getCowYieldHistory(
  cowId: number,
  days: number = 14
): Promise<CowYieldDay[]> {
  const response = await apiClient.get<CowYieldDay[]>(
    `/animals/herd/cows/${cowId}/yield`,
    {
      params: { days },
    }
  )
  return response.data
}

/**
 * Pobiera URL klipu wideo dla zdarzenia.
 * GET /api/v1/animals/herd/events/:eventId/clip
 * Zwraca: { url: string; expiresAt: string }
 */
export async function getEventClipUrl(
  eventId: string
): Promise<{ url: string; expiresAt: string }> {
  const response = await apiClient.get<{ url: string; expiresAt: string }>(
    `/animals/herd/events/${eventId}/clip`
  )
  return response.data
}

/**
 * Dodaje nową krowę do stada.
 * POST /api/v1/farms/{farmId}/herd/cows
 */
export async function addCow(
  farmId: string,
  data: {
    earTagNumber: string
    name: string
    breed?: string
    birthDate?: string
  }
): Promise<Cow> {
  const response = await apiClient.post<Cow>(
    `/v1/farms/${farmId}/herd/cows`,
    data
  )
  return response.data
}
