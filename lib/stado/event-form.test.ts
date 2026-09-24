import { describe, expect, it } from "vitest"
import {
  buildEventRequest,
  emptyEventForm,
  validateEventForm,
} from "./event-form"

const now = new Date(2026, 8, 17, 10, 0)

describe("formularz zdarzenia", () => {
  it("dzisiejsze zdarzenie zostawia godzinę backendowi", () => {
    const request = buildEventRequest(
      { ...emptyEventForm("ESTRUS", now), note: " rano " },
      now
    )
    expect(request).toEqual({
      type: "ESTRUS",
      occurredAt: undefined,
      description: "rano",
    })
  })

  it("starsze zdarzenie dostaje południe", () => {
    const request = buildEventRequest(
      { ...emptyEventForm("VET", now), date: "2026-09-10" },
      now
    )
    expect(request.occurredAt).toBe("2026-09-10T12:00:00")
  })

  it("badanie cielności zapisuje wynik w metadanych", () => {
    const request = buildEventRequest(
      {
        ...emptyEventForm("PREGNANCY_CHECK", now),
        pregnancyResult: "NEGATIVE",
      },
      now
    )
    expect(JSON.parse(request.metadata!)).toEqual({ result: "NEGATIVE" })
    expect(request.description).toBe("wynik: pusta")
  })

  it("BCS przyjmuje przecinek i waliduje zakres", () => {
    const form = {
      ...emptyEventForm("BCS", now),
      bcs: "3,25",
      note: "po zasuszeniu",
    }
    expect(validateEventForm(form, now)).toBeNull()
    const request = buildEventRequest(form, now)
    expect(JSON.parse(request.metadata!)).toEqual({ score: 3.25 })
    expect(request.description).toBe("BCS 3,25 · po zasuszeniu")

    expect(validateEventForm({ ...form, bcs: "7" }, now)).toMatch(/od 1 do 5/)
  })

  it("nie przyjmuje dat z przyszłości", () => {
    expect(
      validateEventForm(
        { ...emptyEventForm("NOTE", now), date: "2026-09-18" },
        now
      )
    ).toMatch(/przyszłości/)
  })
})
