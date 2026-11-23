import { describe, expect, it } from "vitest"

import {
  farmLocation,
  firstName,
  formatFarmLocation,
  formatHerdNumber,
  initials,
  isCompleteHerdNumber,
  normalizeEarTag,
  plural,
} from "./farm-form"
import { resolveSetup } from "./setup-state"

describe("resolveSetup", () => {
  it("bez gospodarstwa pokazuje powitanie", () => {
    expect(resolveSetup(0, null)).toEqual({ show: "welcome" })
  })
  it("po kliknięciu „Zaczynamy” wraca do kroku 1", () => {
    expect(resolveSetup(0, "farm")).toEqual({ show: "wizard", step: "farm" })
  })
  it("z gospodarstwem wznawia przerwaną konfigurację, ale nie od kroku 1", () => {
    expect(resolveSetup(1, "farm")).toEqual({ show: "wizard", step: "herd" })
    expect(resolveSetup(1, "notifications")).toEqual({ show: "wizard", step: "notifications" })
  })
  it("z gospodarstwem i bez zapisanego kroku pokazuje panel", () => {
    expect(resolveSetup(2, null)).toEqual({ show: "none" })
  })
})

describe("formularz gospodarstwa", () => {
  it("formatuje numer siedziby stada", () => {
    expect(formatHerdNumber("PL 012345678001")).toBe("012345678-001")
    expect(formatHerdNumber("0123")).toBe("0123")
    expect(isCompleteHerdNumber("012345678-001")).toBe(true)
    expect(isCompleteHerdNumber("012345678-01")).toBe(false)
  })
  it("skleja i porządkuje lokalizację", () => {
    expect(farmLocation(" Bystre ", "podlaskie")).toBe("Bystre, podlaskie")
    expect(formatFarmLocation("podlaskie, Bystre")).toBe("Bystre, podlaskie")
    expect(formatFarmLocation("Bystre, podlaskie")).toBe("Bystre, podlaskie")
  })
  it("normalizuje numer kolczyka", () => {
    expect(normalizeEarTag("PL 0051-2340-8825")).toBe("005123408825")
    expect(normalizeEarTag("0051234088259999")).toBe("005123408825")
  })
})

describe("teksty", () => {
  it("imię i inicjały", () => {
    expect(firstName("Brunon Kowalski")).toBe("Brunon")
    expect(firstName("  ")).toBeNull()
    expect(initials("Brunon Kowalski")).toBe("BK")
    expect(initials("Anna")).toBe("A")
  })
  it("odmiana", () => {
    expect(plural(1, "krowa", "krowy", "krów")).toBe("krowa")
    expect(plural(3, "krowa", "krowy", "krów")).toBe("krowy")
    expect(plural(12, "krowa", "krowy", "krów")).toBe("krów")
    expect(plural(22, "krowa", "krowy", "krów")).toBe("krowy")
  })
})
