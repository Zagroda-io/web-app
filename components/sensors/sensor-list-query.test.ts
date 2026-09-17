import { describe, expect, it } from "vitest"
import {
  DEFAULT_SENSOR_LIST_STATE,
  applyTile,
  hasActiveFilters,
  isTileActive,
  parseSensorListState,
  rangeLabel,
  toApiParams,
  toSearchParams,
  type SensorListState,
} from "./sensor-list-query"

const state = (overrides: Partial<SensorListState> = {}): SensorListState => ({
  ...DEFAULT_SENSOR_LIST_STATE,
  ...overrides,
})

describe("adres strony ↔ stan listy", () => {
  it("pusty adres to domyślna lista", () => {
    expect(parseSensorListState(new URLSearchParams())).toEqual(DEFAULT_SENSOR_LIST_STATE)
  })

  it("odczytuje filtry, a stronę liczy od 1 jak człowiek", () => {
    expect(
      parseSensorListState(
        new URLSearchParams("q=mućka&przypisanie=FREE&stan=ATTENTION&sort=BATTERY&strona=3&rozmiar=50")
      )
    ).toEqual({ search: "mućka", assignment: "FREE", health: "ATTENTION", sort: "BATTERY", page: 2, size: 50 })
  })

  /** Ręcznie popsuty albo stary link nie może wywrócić widoku. */
  it("nieznane wartości wracają do domyślnych", () => {
    expect(
      parseSensorListState(new URLSearchParams("przypisanie=X&stan=zepsuty&sort=?&strona=-4&rozmiar=7"))
    ).toEqual(DEFAULT_SENSOR_LIST_STATE)
  })

  it("zapisuje tylko to, co odbiega od domyślnych", () => {
    expect(toSearchParams(DEFAULT_SENSOR_LIST_STATE).toString()).toBe("")
    expect(toSearchParams(state({ search: " Łatka ", health: "OFFLINE", page: 1 })).toString()).toBe(
      "q=%C5%81atka&stan=OFFLINE&strona=2"
    )
  })

  it("zapis i odczyt dają ten sam stan", () => {
    const original = state({ search: "PL0054", assignment: "ASSIGNED", sort: "ANIMAL", page: 4, size: 100 })
    expect(parseSensorListState(toSearchParams(original))).toEqual(original)
  })
})

describe("toApiParams", () => {
  it("pomija puste filtry", () => {
    expect(toApiParams(state({ search: "  " }))).toEqual({
      search: undefined,
      assignment: undefined,
      health: undefined,
      sort: "ATTENTION",
      page: 0,
      size: 20,
    })
  })
})

describe("hasActiveFilters", () => {
  it("sortowanie i rozmiar strony nie są filtrami", () => {
    expect(hasActiveFilters(state({ sort: "BATTERY", size: 50, page: 3 }))).toBe(false)
    expect(hasActiveFilters(state({ search: "mućka" }))).toBe(true)
    expect(hasActiveFilters(state({ health: "NO_DATA" }))).toBe(true)
  })
})

describe("kafelki jako szybkie filtry", () => {
  it("„Wymaga uwagi” ustawia stan i zdejmuje przypisanie, wracając na 1. stronę", () => {
    const next = applyTile(state({ assignment: "FREE", page: 3, search: "mućka" }), "ATTENTION")

    expect(next).toMatchObject({ assignment: null, health: "ATTENTION", page: 0, search: "mućka" })
    expect(isTileActive(next, "ATTENTION")).toBe(true)
    expect(isTileActive(next, "ALL")).toBe(false)
  })

  it("„Wszystkie” czyści przypisanie i stan", () => {
    const next = applyTile(state({ assignment: "ASSIGNED", health: "OFFLINE" }), "ALL")

    expect(next).toMatchObject({ assignment: null, health: null })
    expect(isTileActive(next, "ALL")).toBe(true)
  })

  it("kafelek nie jest aktywny, gdy filtr jest szerszy niż jego skrót", () => {
    expect(isTileActive(state({ assignment: "FREE", health: "OFFLINE" }), "FREE")).toBe(false)
  })
})

describe("rangeLabel", () => {
  it("pokazuje zakres widocznych wierszy", () => {
    expect(rangeLabel(0, 20, 45)).toBe("1–20 z 45")
    expect(rangeLabel(2, 20, 45)).toBe("41–45 z 45")
    expect(rangeLabel(0, 20, 0)).toBe("0 z 0")
  })
})
