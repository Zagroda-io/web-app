import type {
  Animal,
  AnimalCategory,
  AnimalDetails,
  AnimalEvent,
  AnimalEventType,
  AlertSeverity,
  Cow,
  CowEvent,
  CowYieldDay,
  EventCategory,
  FeedEvent,
  FeedEventCategory,
  HerdSummary,
  LactationStatus,
  PaginatedResponse,
  Sex,
} from "@/lib/types/stado.types"
import type { HerdKpiData } from "@/types/herd.types"
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
export interface GetAnimalsParams {
  farmId: string
  page?: number
  size?: number
  sort?: string
  search?: string
  sex?: Sex
  category?: AnimalCategory
  lactationStatus?: LactationStatus
  hasSensor?: boolean
  minAgeMonths?: number
  maxAgeMonths?: number
}

export async function getAnimals(
  params: GetAnimalsParams
): Promise<PaginatedResponse<Animal>> {
  const queryParams: Record<string, any> = {
    farmId: params.farmId,
    page: params.page,
    size: params.size,
    sort: params.sort,
    sex: params.sex,
    category: params.category,
    lactationStatus: params.lactationStatus,
    hasSensor: params.hasSensor,
    minAgeMonths: params.minAgeMonths,
    maxAgeMonths: params.maxAgeMonths,
  }

  if (params.search && params.search.trim() !== "") {
    queryParams.search = params.search
  }

  // usuwamy puste/undefined parametry, by nie zaśmiecać query stringa
  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key] === undefined || queryParams[key] === "") {
      delete queryParams[key]
    }
  })

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
 * Pobiera pełne KPI stada (struktura, laktacja, rozród, nadchodzące porody).
 * GET /api/v1/animals/herd/kpi
 */
export async function getHerdKpi(): Promise<HerdKpiData> {
  const response = await apiClient.get<HerdKpiData>("/animals/herd/kpi")
  return response.data
}

/**
 * Pobiera historię zdarzeń zwierzęcia.
 * GET /api/v1/animals/:id/events?type=
 */
export async function getAnimalEvents(
  animalId: string,
  type?: AnimalEventType
): Promise<AnimalEvent[]> {
  const response = await apiClient.get<AnimalEvent[]>(
    `/animals/${animalId}/events`,
    { params: type ? { type } : undefined }
  )
  return response.data
}

/**
 * Dodaje zdarzenie dla zwierzęcia (np. poród zmienia status na "w laktacji").
 * POST /api/v1/animals/:id/events
 */
export async function addAnimalEvent(
  animalId: string,
  body: {
    type: AnimalEventType
    occurredAt?: string
    title?: string
    description?: string
    severity?: string
    metadata?: string
  }
): Promise<AnimalEvent> {
  const response = await apiClient.post<AnimalEvent>(
    `/animals/${animalId}/events`,
    body
  )
  return response.data
}

const EVENT_TYPE_META: Record<
  AnimalEventType,
  { category: FeedEventCategory; label: string }
> = {
  CALVING: { category: "info", label: "Poród" },
  DRY_OFF: { category: "dry", label: "Zasuszenie" },
  INSEMINATION: { category: "insemination", label: "Inseminacja" },
  PREGNANCY_CHECK: { category: "info", label: "Cielność" },
  ESTRUS: { category: "estrus", label: "Ruja" },
  VET: { category: "vet", label: "Weterynarz" },
  ALERT: { category: "alert", label: "Alert" },
  BCS: { category: "info", label: "BCS" },
  NOTE: { category: "info", label: "Notatka" },
}

function toFeedSeverity(severity: string | null): FeedEvent["severity"] {
  if (severity === "red" || severity === "amber" || severity === "green") {
    return severity
  }
  return "info"
}

const EVENT_TIMELINE_CATEGORY: Record<AnimalEventType, EventCategory> = {
  CALVING: "other",
  DRY_OFF: "other",
  INSEMINATION: "ins",
  PREGNANCY_CHECK: "ins",
  ESTRUS: "other",
  VET: "wet",
  ALERT: "alert",
  BCS: "other",
  NOTE: "other",
}

function toAlertSeverity(severity: string | null): AlertSeverity | "neutral" {
  if (
    severity === "red" ||
    severity === "amber" ||
    severity === "green" ||
    severity === "info"
  ) {
    return severity
  }
  return "neutral"
}

/** Mapuje zdarzenie backendu na element osi czasu w profilu krowy. */
export function mapEventToCowEvent(event: AnimalEvent): CowEvent {
  const meta = EVENT_TYPE_META[event.type]
  return {
    id: event.id,
    category: EVENT_TIMELINE_CATEGORY[event.type] ?? "other",
    severity: toAlertSeverity(event.severity),
    title: event.title ?? meta?.label ?? event.type,
    description: event.description ?? "",
    occurredAt: event.occurredAt,
  }
}

/** Mapuje zdarzenie backendu na element feedu widoku stada. */
export function mapEventToFeed(event: AnimalEvent): FeedEvent {
  const meta = EVENT_TYPE_META[event.type] ?? {
    category: "info" as FeedEventCategory,
    label: event.type,
  }
  const earTag = event.earTagNumber ?? ""
  return {
    id: event.id,
    cowId: event.animalId,
    cowName: event.animalName ?? "—",
    earTagShort: earTag ? earTag.slice(-3) : "—",
    severity: toFeedSeverity(event.severity),
    category: meta.category,
    categoryLabel: meta.label,
    title: event.title ?? meta.label,
    description: event.description ?? "",
    occurredAt: event.occurredAt,
  }
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
  const response = await apiClient.get<AnimalEvent[]>(
    "/animals/herd/events/feed",
    {
      params,
    }
  )
  return response.data.map(mapEventToFeed)
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
export interface AddCowRequest {
  name: string
  birthDate: string
  breed: string
  earTagNumber: string
  bookType: string
  sex?: Sex
  sensorId?: string
  mother?: {
    earTagNumber?: string
    name?: string
    birthDate?: string
    bookType?: string
    breed?: string
    efficiency?: string
    lactation?: string
    offspring?: string
    grandmotherLactations?: string
  }
  father?: {
    earTagNumber?: string
    name?: string
    birthDate?: string
    bookType?: string
    breed?: string
  }
  motherMother?: {
    earTagNumber?: string
    name?: string
    birthDate?: string
    bookType?: string
    breed?: string
  }
  motherFather?: {
    earTagNumber?: string
    name?: string
    birthDate?: string
    bookType?: string
    breed?: string
  }
  fatherMother?: {
    earTagNumber?: string
    name?: string
    birthDate?: string
    bookType?: string
    breed?: string
  }
  fatherFather?: {
    earTagNumber?: string
    name?: string
    birthDate?: string
    bookType?: string
    breed?: string
  }
}

export async function addCow(
  data: AddCowRequest
): Promise<Cow> {
  const response = await apiClient.post<Cow>(
    `/animals`,
    data
  )
  return response.data
}
