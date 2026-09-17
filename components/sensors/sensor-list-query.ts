import type {
  SensorAssignmentFilter,
  SensorHealthFilter,
  SensorSort,
} from "@/lib/types/sensor.types"
import type { SensorListParams } from "@/lib/api/sensors"

/**
 * Stan listy czujników trzymany w adresie strony — odświeżenie strony i link wysłany
 * współpracownikowi pokazują tę samą, przefiltrowaną listę.
 */
export interface SensorListState {
  search: string
  assignment: SensorAssignmentFilter | null
  health: SensorHealthFilter | null
  sort: SensorSort
  /** Numer strony od 0 (w adresie od 1, bo tak liczy człowiek). */
  page: number
  size: number
}

export const PAGE_SIZES = [20, 50, 100] as const

export const DEFAULT_SENSOR_LIST_STATE: SensorListState = {
  search: "",
  assignment: null,
  health: null,
  sort: "ATTENTION",
  page: 0,
  size: 20,
}

const ASSIGNMENTS: SensorAssignmentFilter[] = ["ASSIGNED", "FREE"]
const HEALTHS: SensorHealthFilter[] = ["ATTENTION", "ONLINE", "WARNING", "OFFLINE", "NO_DATA"]
const SORTS: SensorSort[] = ["ATTENTION", "BATTERY", "LAST_SEEN", "ANIMAL", "ACTIVATED", "DEV_EUI"]

export const HEALTH_OPTIONS: { value: SensorHealthFilter; label: string }[] = [
  { value: "ATTENTION", label: "Wymaga uwagi" },
  { value: "ONLINE", label: "Online" },
  { value: "WARNING", label: "Niska bateria" },
  { value: "OFFLINE", label: "Offline" },
  { value: "NO_DATA", label: "Brak danych" },
]

export const ASSIGNMENT_OPTIONS: { value: SensorAssignmentFilter; label: string }[] = [
  { value: "ASSIGNED", label: "Na krowach" },
  { value: "FREE", label: "Wolne" },
]

export const SORT_OPTIONS: { value: SensorSort; label: string }[] = [
  { value: "ATTENTION", label: "Najpierw wymagające uwagi" },
  { value: "BATTERY", label: "Najsłabsza bateria" },
  { value: "LAST_SEEN", label: "Najdłużej bez kontaktu" },
  { value: "ANIMAL", label: "Krowa A–Z" },
  { value: "ACTIVATED", label: "Ostatnio aktywowane" },
  { value: "DEV_EUI", label: "DevEUI" },
]

function oneOf<T extends string>(value: string | null, allowed: readonly T[]): T | null {
  return value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : null
}

/** Odczyt stanu z adresu; nieznane lub popsute wartości wracają do domyślnych. */
export function parseSensorListState(params: URLSearchParams): SensorListState {
  const page = Number.parseInt(params.get("strona") ?? "", 10)
  const size = Number.parseInt(params.get("rozmiar") ?? "", 10)
  return {
    search: params.get("q")?.trim() ?? "",
    assignment: oneOf(params.get("przypisanie"), ASSIGNMENTS),
    health: oneOf(params.get("stan"), HEALTHS),
    sort: oneOf(params.get("sort"), SORTS) ?? DEFAULT_SENSOR_LIST_STATE.sort,
    page: Number.isFinite(page) && page > 0 ? page - 1 : 0,
    size: (PAGE_SIZES as readonly number[]).includes(size) ? size : DEFAULT_SENSOR_LIST_STATE.size,
  }
}

/** Zapis stanu do adresu — wartości domyślne pomijamy, żeby link był krótki. */
export function toSearchParams(state: SensorListState): URLSearchParams {
  const params = new URLSearchParams()
  if (state.search.trim()) params.set("q", state.search.trim())
  if (state.assignment) params.set("przypisanie", state.assignment)
  if (state.health) params.set("stan", state.health)
  if (state.sort !== DEFAULT_SENSOR_LIST_STATE.sort) params.set("sort", state.sort)
  if (state.page > 0) params.set("strona", String(state.page + 1))
  if (state.size !== DEFAULT_SENSOR_LIST_STATE.size) params.set("rozmiar", String(state.size))
  return params
}

export function toApiParams(state: SensorListState): SensorListParams {
  return {
    search: state.search.trim() || undefined,
    assignment: state.assignment ?? undefined,
    health: state.health ?? undefined,
    sort: state.sort,
    page: state.page,
    size: state.size,
  }
}

/** Czy lista jest zawężona — steruje przyciskiem „Wyczyść filtry" i treścią pustego stanu. */
export function hasActiveFilters(state: SensorListState): boolean {
  return state.search.trim() !== "" || state.assignment !== null || state.health !== null
}

/** Kafelki nad tabelą działają jak skróty filtrów. */
export type SummaryTile = "ALL" | "ASSIGNED" | "FREE" | "ATTENTION"

export function applyTile(state: SensorListState, tile: SummaryTile): SensorListState {
  const base = { ...state, page: 0 }
  switch (tile) {
    case "ALL":
      return { ...base, assignment: null, health: null }
    case "ASSIGNED":
    case "FREE":
      return { ...base, assignment: tile, health: null }
    case "ATTENTION":
      return { ...base, assignment: null, health: "ATTENTION" }
  }
}

export function isTileActive(state: SensorListState, tile: SummaryTile): boolean {
  switch (tile) {
    case "ALL":
      return state.assignment === null && state.health === null
    case "ASSIGNED":
    case "FREE":
      return state.assignment === tile && state.health === null
    case "ATTENTION":
      return state.assignment === null && state.health === "ATTENTION"
  }
}

/** „21–40 z 45" — zakres widocznych wierszy. */
export function rangeLabel(page: number, size: number, total: number): string {
  if (total === 0) return "0 z 0"
  const from = page * size + 1
  const to = Math.min((page + 1) * size, total)
  return `${from}–${to} z ${total}`
}
