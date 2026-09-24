import type { GetAnimalsParams } from "@/lib/api/stado"
import type {
  AnimalCategory,
  HerdTask,
  LactationStatus,
} from "@/lib/types/stado.types"
import { CATEGORY_ORDER, LACTATION_OPTIONS, TASK_ORDER } from "./labels"

/**
 * Stan listy stada trzymany w adresie strony — powrót z karty krowy i odświeżenie
 * pokazują tę samą, przefiltrowaną listę.
 */
export type HerdSort = "urgency" | "name" | "dim" | "calving"

export interface HerdListState {
  search: string
  task: HerdTask | null
  category: AnimalCategory | null
  lactation: LactationStatus | null
  sort: HerdSort
  /** Numer strony od 0 (w adresie od 1). */
  page: number
}

export const HERD_PAGE_SIZE = 25

export const DEFAULT_HERD_LIST_STATE: HerdListState = {
  search: "",
  task: null,
  category: null,
  lactation: null,
  sort: "urgency",
  page: 0,
}

export const HERD_SORT_OPTIONS: {
  value: HerdSort
  label: string
  api: string
}[] = [
  { value: "urgency", label: "Pilne najpierw", api: "urgency" },
  { value: "name", label: "Imię A–Z", api: "name" },
  { value: "dim", label: "DIM malejąco", api: "dayInMilk,desc" },
  { value: "calving", label: "Najbliższy poród", api: "expectedCalvingDate" },
]

const SORTS = HERD_SORT_OPTIONS.map((o) => o.value)
const LACTATIONS = LACTATION_OPTIONS.map((o) => o.value)

function oneOf<T extends string>(
  value: string | null,
  allowed: readonly T[]
): T | null {
  return value !== null && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : null
}

export function parseHerdListState(params: URLSearchParams): HerdListState {
  const page = Number.parseInt(params.get("strona") ?? "", 10)
  return {
    search: params.get("q")?.trim() ?? "",
    task: oneOf(params.get("zadanie"), TASK_ORDER),
    category: oneOf(params.get("kategoria"), CATEGORY_ORDER),
    lactation: oneOf(params.get("laktacja"), LACTATIONS),
    sort: oneOf(params.get("sort"), SORTS) ?? DEFAULT_HERD_LIST_STATE.sort,
    page: Number.isFinite(page) && page > 1 ? page - 1 : 0,
  }
}

export function toHerdSearchParams(state: HerdListState): URLSearchParams {
  const params = new URLSearchParams()
  if (state.search) params.set("q", state.search)
  if (state.task) params.set("zadanie", state.task)
  if (state.category) params.set("kategoria", state.category)
  if (state.lactation) params.set("laktacja", state.lactation)
  if (state.sort !== DEFAULT_HERD_LIST_STATE.sort)
    params.set("sort", state.sort)
  if (state.page > 0) params.set("strona", String(state.page + 1))
  return params
}

export function toAnimalsApiParams(
  state: HerdListState,
  farmId: string
): GetAnimalsParams {
  return {
    farmId,
    page: state.page,
    size: HERD_PAGE_SIZE,
    sort: HERD_SORT_OPTIONS.find((o) => o.value === state.sort)?.api,
    search: state.search || undefined,
    task: state.task ?? undefined,
    category: state.category ?? undefined,
    lactationStatus: state.lactation ?? undefined,
  }
}
