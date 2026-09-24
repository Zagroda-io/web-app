import type {
  Animal,
  AnimalCategory,
  AnimalDetails,
  AnimalEvent,
  AnimalEventType,
  HerdAgendaItem,
  HerdTask,
  HerdTasks,
  LactationStatus,
  PaginatedResponse,
  Sex,
} from "@/lib/types/stado.types"
import type { HerdKpiData } from "@/types/herd.types"
import apiClient from "@/lib/api-client"

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
  task?: HerdTask
}

export async function getAnimals(
  params: GetAnimalsParams
): Promise<PaginatedResponse<Animal>> {
  const queryParams: Record<string, unknown> = {
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
    task: params.task,
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
 * Pobiera pełne KPI stada (struktura, laktacja, rozród, nadchodzące porody).
 * GET /api/v1/animals/herd/kpi
 */
export async function getHerdKpi(): Promise<HerdKpiData> {
  const response = await apiClient.get<HerdKpiData>("/animals/herd/kpi")
  return response.data
}

/**
 * Liczniki zadań hodowcy dla całego stada (pasek „Do zrobienia").
 * GET /api/v1/animals/herd/tasks
 */
export async function getHerdTasks(): Promise<HerdTasks> {
  const response = await apiClient.get<HerdTasks>("/animals/herd/tasks")
  return response.data
}

/**
 * Agenda stada na najbliższe dni.
 * GET /api/v1/animals/herd/agenda?days=14
 */
export async function getHerdAgenda(days = 14): Promise<HerdAgendaItem[]> {
  const response = await apiClient.get<HerdAgendaItem[]>(
    "/animals/herd/agenda",
    {
      params: { days },
    }
  )
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

export async function addCow(data: AddCowRequest): Promise<Animal> {
  const response = await apiClient.post<Animal>(`/animals`, data)
  return response.data
}
