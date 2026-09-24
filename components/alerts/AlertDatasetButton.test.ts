import { describe, expect, it } from "vitest"
import { datasetTooltip } from "./AlertDatasetButton"

describe("datasetTooltip", () => {
  it("dla potwierdzonych wyjaśnia, że to materiał do douczania modelu", () => {
    expect(datasetTooltip("CONFIRMED", false)).toBe(
      "Potwierdzone alerty zasilają materiał do douczania modelu. Pobierz ich klipy jako paczkę ZIP."
    )
  })

  it("dla fałszywych mówi o przykładach negatywnych", () => {
    expect(datasetTooltip("REJECTED", false)).toContain("przykłady negatywne")
  })

  it("dopowiada, dlaczego przycisk jest nieaktywny", () => {
    expect(datasetTooltip("CONFIRMED", true)).toContain("Brak zweryfikowanych alertów")
  })
})
