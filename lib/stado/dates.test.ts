import { describe, expect, it } from "vitest"
import {
  daysFromToday,
  formatDayMonth,
  formatDaysAgo,
  formatHoursAgo,
  formatWeekdayLong,
} from "./dates"

const now = new Date(2026, 8, 17, 10, 0)

describe("daty stada", () => {
  it("formatuje dzień i miesiąc z LocalDate i LocalDateTime", () => {
    expect(formatDayMonth("2026-09-03")).toBe("03.09")
    expect(formatDayMonth("2026-12-24T08:30:00")).toBe("24.12")
    expect(formatDayMonth(null)).toBe("—")
  })

  it("liczy dni kalendarzowe niezależnie od godziny", () => {
    expect(daysFromToday("2026-09-18", now)).toBe(1)
    expect(daysFromToday("2026-09-16T23:59:00", now)).toBe(-1)
  })

  it("opisuje, jak dawno było zdarzenie", () => {
    expect(formatDaysAgo("2026-09-17", now)).toBe("dziś")
    expect(formatDaysAgo("2026-09-16", now)).toBe("wczoraj")
    expect(formatDaysAgo("2026-09-05", now)).toBe("12 dni temu")
    expect(formatDaysAgo("2026-06-17", now)).toBe("3 mies. temu")
    expect(formatDaysAgo("2025-03-17", now)).toBe("1,5 r. temu")
  })

  it("dla alertów podaje godziny w pierwszej dobie", () => {
    expect(formatHoursAgo("2026-09-17T09:40:00", now)).toBe("przed chwilą")
    expect(formatHoursAgo("2026-09-17T04:00:00", now)).toBe("ok. 6 h temu")
    expect(formatHoursAgo("2026-09-15T09:00:00", now)).toBe("2 dni temu")
  })

  it("nazywa dzień tygodnia po polsku", () => {
    expect(formatWeekdayLong(now)).toBe("czwartek, 17 września")
  })
})
