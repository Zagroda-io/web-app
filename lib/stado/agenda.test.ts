import { describe, expect, it } from "vitest"
import type { HerdAgendaItem } from "@/lib/types/stado.types"
import { agendaItemTitle, groupAgenda } from "./agenda"

const now = new Date(2026, 8, 17, 10, 0)

const item = (overrides: Partial<HerdAgendaItem>): HerdAgendaItem => ({
  type: "CALVING",
  date: "2026-09-17",
  overdueDays: 0,
  animalId: "a1",
  animalName: "Krasula",
  earTagNumber: "PL005003001234078",
  category: "COW",
  title: null,
  referenceAt: null,
  ...overrides,
})

describe("agenda stada", () => {
  it("grupuje pozycje w dziś, jutro, ten tydzień i za tydzień", () => {
    const groups = groupAgenda(
      [
        item({ date: "2026-09-17" }),
        item({ date: "2026-09-18", type: "PREGNANCY_CHECK" }),
        item({ date: "2026-09-22", type: "DRY_OFF" }),
        item({ date: "2026-09-30" }),
      ],
      now
    )
    expect(groups.map((g) => [g.label, g.dateLabel, g.entries.length])).toEqual(
      [
        ["Dziś", "17.09", 1],
        ["Jutro", "18.09", 1],
        ["Ten tydzień", "19.09 – 24.09", 1],
        ["Za tydzień", "25.09 – 01.10", 1],
      ]
    )
  })

  it("opisuje zaległości i pierwiastki", () => {
    const heifer = item({ category: "HEIFER", animalName: "Mela" })
    const [today] = groupAgenda([heifer], now)
    expect(today.entries[0]).toMatchObject({
      title: "Spodziewany poród",
      subject: "Mela #078 · pierwiastka",
      kind: "poród",
    })

    expect(
      agendaItemTitle(item({ type: "DRY_OFF", overdueDays: 5 }), now)
    ).toBe("Zasuszenie — zaległe o 5 dni")
    expect(
      agendaItemTitle(
        item({ type: "INSEMINATION", referenceAt: "2026-09-17T06:00:00" }),
        now
      )
    ).toBe("Inseminacja — ruja ok. 4 h temu")
  })
})
