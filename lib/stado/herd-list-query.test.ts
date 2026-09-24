import { describe, expect, it } from "vitest"
import {
  DEFAULT_HERD_LIST_STATE,
  parseHerdListState,
  toAnimalsApiParams,
  toHerdSearchParams,
} from "./herd-list-query"

describe("stan listy stada w adresie", () => {
  it("domyślny stan daje pusty adres", () => {
    expect(toHerdSearchParams(DEFAULT_HERD_LIST_STATE).toString()).toBe("")
  })

  it("zapisuje i odczytuje filtry bez strat", () => {
    const state = {
      search: "basia",
      task: "CALVING_SOON" as const,
      category: "COW" as const,
      lactation: "DRY" as const,
      sort: "calving" as const,
      page: 2,
    }
    const params = toHerdSearchParams(state)
    expect(params.get("strona")).toBe("3")
    expect(parseHerdListState(params)).toEqual(state)
  })

  it("ignoruje nieznane wartości", () => {
    expect(
      parseHerdListState(new URLSearchParams("zadanie=NIC&sort=x&strona=-4"))
    ).toEqual(DEFAULT_HERD_LIST_STATE)
  })

  it("tłumaczy sortowanie na klucze API", () => {
    const params = toAnimalsApiParams(
      { ...DEFAULT_HERD_LIST_STATE, sort: "dim", task: "DRY_OFF" },
      "farm-1"
    )
    expect(params).toMatchObject({
      farmId: "farm-1",
      sort: "dayInMilk,desc",
      task: "DRY_OFF",
      size: 25,
      page: 0,
    })
  })
})
