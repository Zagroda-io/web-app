import { describe, expect, it } from "vitest"
import { alertTypeMeta, formatConfidence, reviewStatusMeta } from "./alert-utils"

describe("reviewStatusMeta", () => {
  it("opisuje każdy werdykt osobną etykietą", () => {
    expect(reviewStatusMeta("PENDING").label).toBe("Do weryfikacji")
    expect(reviewStatusMeta("CONFIRMED").label).toBe("Potwierdzony")
    expect(reviewStatusMeta("REJECTED").label).toBe("Fałszywy alarm")
  })

  /** Backend może kiedyś dorzucić status — UI ma wtedy pokazać „do weryfikacji", nie pustkę. */
  it("nieznany status traktuje jak brak decyzji", () => {
    expect(
      reviewStatusMeta("SOMETHING_NEW" as unknown as "PENDING").label
    ).toBe("Do weryfikacji")
  })
})

describe("alertTypeMeta", () => {
  it("mapuje typ alertu na etykietę i wagę", () => {
    expect(alertTypeMeta("CALVING")).toMatchObject({
      label: "Poród",
      severity: "red",
    })
  })

  it("nieznany typ dostaje neutralne oznaczenie", () => {
    expect(alertTypeMeta("LAMENESS")).toMatchObject({
      label: "Alert",
      severity: "info",
    })
  })
})

describe("formatConfidence", () => {
  it("pokazuje pewność modelu jako procent", () => {
    expect(formatConfidence(0.8697)).toBe("87%")
  })

  it("brak pewności pokazuje jako myślnik", () => {
    expect(formatConfidence(null)).toBe("—")
  })
})
