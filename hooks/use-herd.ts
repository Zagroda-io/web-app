"use client"

import {
  getAnimalDetails,
  getAnimalEvents,
  getAnimals,
  getHerdAgenda,
  getHerdKpi,
  getHerdTasks,
} from "@/lib/api/stado"
import {
  toAnimalsApiParams,
  toHerdSearchParams,
  type HerdListState,
} from "@/lib/stado/herd-list-query"
import { useApiResource } from "./use-api-resource"

/** Hooki danych Stada — każdy widok składa się z nich zamiast wołać API bezpośrednio. */

export function useHerdAnimals(
  state: HerdListState,
  farmId: string | undefined
) {
  const key = farmId ? `animals?${toHerdSearchParams(state)}@${farmId}` : null
  return useApiResource(key, () =>
    getAnimals(toAnimalsApiParams(state, farmId!))
  )
}

export function useHerdTasks(farmId: string | undefined) {
  return useApiResource(farmId ? `tasks@${farmId}` : null, getHerdTasks)
}

export function useHerdAgenda(farmId: string | undefined, days = 14) {
  return useApiResource(farmId ? `agenda:${days}@${farmId}` : null, () =>
    getHerdAgenda(days)
  )
}

export function useHerdKpi(farmId: string | undefined) {
  return useApiResource(farmId ? `kpi@${farmId}` : null, getHerdKpi)
}

export function useAnimalDetails(animalId: string | undefined) {
  return useApiResource(animalId ? `animal:${animalId}` : null, () =>
    getAnimalDetails(animalId!)
  )
}

export function useAnimalEvents(animalId: string | undefined) {
  return useApiResource(animalId ? `events:${animalId}` : null, () =>
    getAnimalEvents(animalId!)
  )
}
