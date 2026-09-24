import { describe, expect, it } from "vitest"
import {
  alertView,
  attentionDot,
  herdStatsLine,
  lactationSummary,
  lastActivity,
  reproductionSummary,
  reproductionTimeline,
  shortTag,
} from "./presenters"
import { animalFixture } from "./test-fixtures"

const now = new Date(2026, 8, 17, 10, 0)
const repro = (overrides: object) => ({
  ...animalFixture().reproduction!,
  ...overrides,
})

describe("prezentery stada", () => {
  it("skraca kolczyk do numeru w stadzie", () => {
    expect(shortTag("PL005003001234034")).toBe("034")
    expect(shortTag(null)).toBe("—")
  })

  it("opisuje laktację", () => {
    expect(lactationSummary(animalFixture())).toEqual({
      label: "W laktacji · 3.",
      detail: "DIM 120",
      tone: "success",
    })
    expect(
      lactationSummary(
        animalFixture({ lactationStatus: "DRY", lactationNumber: 2 })
      ).label
    ).toBe("Zasuszona")
    expect(
      lactationSummary(
        animalFixture({ lactationStatus: "NONE", category: "CALF" })
      ).detail
    ).toBe("odchów")
  })

  it("ostrzega o zbliżającym się porodzie", () => {
    const animal = animalFixture({
      reproduction: repro({
        status: "PREGNANT",
        expectedCalvingDate: "2026-09-20",
        daysToCalving: 3,
      }),
    })
    expect(reproductionSummary(animal, now)).toEqual({
      label: "Poród za 3 dni",
      detail: "termin 20.09",
      tone: "warning",
    })
  })

  it("pokazuje poród po terminie", () => {
    const animal = animalFixture({
      reproduction: repro({
        status: "PREGNANT",
        expectedCalvingDate: "2026-09-16",
        daysToCalving: -1,
      }),
    })
    expect(reproductionSummary(animal, now).label).toBe(
      "Poród po terminie 1 dzień"
    )
  })

  it("dla cielnej daleko od porodu dopisuje sugestię zasuszenia", () => {
    const animal = animalFixture({
      dryOffSuggested: true,
      reproduction: repro({
        status: "PREGNANT",
        expectedCalvingDate: "2026-11-10",
        daysToCalving: 54,
      }),
    })
    expect(reproductionSummary(animal, now)).toEqual({
      label: "Cielna",
      detail: "poród 10.11 · za 54 dni · do zasuszenia",
      tone: "warning",
    })
  })

  it("liczy termin badania cielności inseminowanej", () => {
    const animal = animalFixture({
      reproduction: repro({
        status: "INSEMINATED",
        lastInseminationDate: "2026-08-22",
        pregnancyCheckDate: "2026-09-21",
      }),
    })
    expect(reproductionSummary(animal, now)).toEqual({
      label: "Inseminowana 22.08",
      detail: "badanie cielności za 4 dni",
      tone: "warning",
    })
  })

  it("aktywny alert ma pierwszeństwo w kolumnie ostatniego zdarzenia", () => {
    const animal = animalFixture({
      lastEvent: {
        type: "BCS",
        title: null,
        description: "BCS 3,25",
        occurredAt: "2026-09-10T12:00:00",
      },
      activeAlert: {
        source: "AI",
        type: "ESTRUS",
        title: null,
        description: null,
        severity: "amber",
        confidence: 0.8,
        detectedAt: "2026-09-17T04:00:00",
      },
    })
    expect(lastActivity(animal, now)).toEqual({
      title: "Wykryto ruję",
      when: "ok. 6 h temu",
    })
    expect(lastActivity({ ...animal, activeAlert: null }, now)).toEqual({
      title: "BCS · BCS 3,25",
      when: "7 dni temu",
    })
  })

  it("alert modelu opisuje pewnością", () => {
    const view = alertView(
      {
        source: "AI",
        type: "FALL",
        title: null,
        description: null,
        severity: "red",
        confidence: 0.93,
        detectedAt: "2026-09-17T09:00:00",
      },
      now
    )
    expect(view).toMatchObject({ title: "Wykryto upadek", tone: "critical" })
    expect(view.description).toContain("93%")
  })

  it("kropka pulsuje przy alercie krytycznym", () => {
    expect(attentionDot(animalFixture({ attentionLevel: "CRITICAL" }))).toEqual(
      { tone: "critical", pulse: true }
    )
    expect(attentionDot(animalFixture({ attentionLevel: "OK" }))).toEqual({
      tone: "success",
      pulse: false,
    })
  })

  it("oś rozrodu cielnej krowy prowadzi od inseminacji do porodu", () => {
    const animal = animalFixture({
      suggestedDryOffDate: "2026-10-01",
      reproduction: repro({
        status: "PREGNANT",
        lastInseminationDate: "2026-02-01",
        pregnancyConfirmedDate: "2026-03-05",
        expectedCalvingDate: "2026-11-11",
        daysToCalving: 55,
      }),
    })
    const timeline = reproductionTimeline(animal, now)
    expect(timeline.startLabel).toBe("Inseminacja 01.02")
    expect(timeline.endLabel).toBe("Poród 11.11")
    expect(timeline.progress).toBeGreaterThan(75)
    expect(timeline.stages.map((s) => s.label)).toEqual([
      "Inseminacja",
      "Cielność",
      "Zasuszenie",
      "Poród",
    ])
    expect(timeline.nextStep).toBe("zasuszenie 01.10")
  })

  it("po porodzie oś pokazuje okres spoczynku", () => {
    const animal = animalFixture({
      dayInMilk: 20,
      lastCalvingDate: "2026-08-28",
      reproduction: repro({ status: "FRESH" }),
    })
    const timeline = reproductionTimeline(animal, now)
    expect(timeline.endLabel).toBe("Krycie od 27.10")
    expect(timeline.stages[1]).toMatchObject({
      label: "Okres spoczynku",
      value: "40 dni",
    })
    expect(timeline.nextStep).toBe("okres spoczynku do DIM 60")
  })

  it("składa linię statystyk z polską odmianą", () => {
    expect(
      herdStatsLine({
        herdSize: { total: 164, cows: 122, heifers: 30, calves: 10, bulls: 2 },
        lactation: {
          inLactation: 104,
          inLactationPercentage: 85.2,
          dry: 18,
          avgDim: 142,
        },
        reproduction: {
          pregnant: 1,
          conceptionRate: 40,
          waitingForInsemination: 12,
          overdueCount: 2,
        },
        upcomingCalvings: [],
      })
    ).toBe(
      "122 krowy · 104 w laktacji (85%) · 18 zasuszonych · 1 cielna · śr. DIM 142"
    )
  })
})
