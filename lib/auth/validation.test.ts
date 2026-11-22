import { describe, expect, it } from "vitest"

import {
  formatPhone,
  isCompletePhone,
  isEmail,
  isPasswordValid,
  normalizePhone,
  passwordStrength,
  toE164,
} from "./validation"

describe("isEmail", () => {
  it("przyjmuje poprawny adres, także ze spacjami wokół", () => {
    expect(isEmail(" jan@gospodarstwo.pl ")).toBe(true)
  })
  it("odrzuca adres bez domeny", () => {
    expect(isEmail("jan@")).toBe(false)
    expect(isEmail("jan.gospodarstwo.pl")).toBe(false)
  })
})

describe("hasło", () => {
  it("wymaga 8 znaków i cyfry", () => {
    expect(isPasswordValid("krowa202")).toBe(true)
    expect(isPasswordValid("krowakrowa")).toBe(false)
    expect(isPasswordValid("krowa1")).toBe(false)
  })
  it("ocenia siłę jak aplikacja mobilna", () => {
    expect(passwordStrength("")).toBe(0)
    expect(passwordStrength("krowa")).toBe(1)
    expect(passwordStrength("krowa2026")).toBe(2)
    expect(passwordStrength("krowa2026długa")).toBe(3)
    expect(passwordStrength("Krowa202!")).toBe(3)
  })
})

describe("telefon", () => {
  it("normalizuje wklejony numer z prefiksem", () => {
    expect(normalizePhone("+48 601-234-567")).toBe("601234567")
    expect(normalizePhone("6012345678")).toBe("601234567")
  })
  it("formatuje i zamienia na E.164", () => {
    expect(formatPhone("601234567")).toBe("601 234 567")
    expect(formatPhone("6012")).toBe("601 2")
    expect(isCompletePhone("601234567")).toBe(true)
    expect(isCompletePhone("60123456")).toBe(false)
    expect(toE164("601234567")).toBe("+48601234567")
  })
})
