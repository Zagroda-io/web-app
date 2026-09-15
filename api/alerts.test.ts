import { beforeEach, describe, expect, it, vi } from "vitest"

const get = vi.fn()
const patch = vi.fn()

vi.mock("@/lib/api-client", () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    patch: (...args: unknown[]) => patch(...args),
  },
}))

import {
  downloadAlertDataset,
  filenameFromContentDisposition,
  getFarmAlerts,
  reviewFarmAlert,
  saveBlobAsFile,
} from "./alerts"

describe("getFarmAlerts", () => {
  beforeEach(() => {
    get.mockReset()
    get.mockResolvedValue({ data: { content: [] } })
  })

  it("pyta o pierwszą stronę bez filtra weryfikacji", async () => {
    await getFarmAlerts()

    expect(get).toHaveBeenCalledWith("/alerts", {
      params: { page: 0, size: 20 },
    })
  })

  /** Pusty parametr znaczyłby dla backendu co innego niż jego brak — nie wysyłamy go wcale. */
  it("dokłada reviewStatus tylko wtedy, gdy filtr jest ustawiony", async () => {
    await getFarmAlerts({ page: 2, size: 50, reviewStatus: "CONFIRMED" })

    expect(get).toHaveBeenCalledWith("/alerts", {
      params: { page: 2, size: 50, reviewStatus: "CONFIRMED" },
    })
  })
})

describe("reviewFarmAlert", () => {
  beforeEach(() => {
    patch.mockReset()
    patch.mockResolvedValue({ data: { alertId: "a-1", reviewStatus: "CONFIRMED" } })
  })

  it("wysyła werdykt z przyciętą notatką", async () => {
    const alert = await reviewFarmAlert("a-1", "CONFIRMED", "  cielę urodzone  ")

    expect(patch).toHaveBeenCalledWith("/alerts/a-1/review", {
      status: "CONFIRMED",
      note: "cielę urodzone",
    })
    expect(alert.reviewStatus).toBe("CONFIRMED")
  })

  it("pustą notatkę zamienia na null", async () => {
    await reviewFarmAlert("a-1", "REJECTED", "   ")

    expect(patch).toHaveBeenCalledWith("/alerts/a-1/review", {
      status: "REJECTED",
      note: null,
    })
  })
})

describe("filenameFromContentDisposition", () => {
  it("czyta zwykłe filename", () => {
    expect(
      filenameFromContentDisposition(
        'attachment; filename="zagroda-dataset-confirmed-2026-09-15T10-00.zip"',
        "fallback.zip"
      )
    ).toBe("zagroda-dataset-confirmed-2026-09-15T10-00.zip")
  })

  it("czyta wariant RFC 5987 z kodowaniem UTF-8", () => {
    expect(
      filenameFromContentDisposition(
        "attachment; filename*=UTF-8''paczka%20tre%C5%9Bci.zip",
        "fallback.zip"
      )
    ).toBe("paczka treści.zip")
  })

  it("bez nagłówka używa nazwy zapasowej", () => {
    expect(filenameFromContentDisposition(undefined, "fallback.zip")).toBe(
      "fallback.zip"
    )
  })
})

describe("downloadAlertDataset", () => {
  beforeEach(() => {
    get.mockReset()
  })

  it("domyślnie pobiera zbiór potwierdzonych alertów jako blob", async () => {
    const blob = new Blob(["zip"])
    get.mockResolvedValue({
      data: blob,
      headers: { "content-disposition": 'attachment; filename="paczka.zip"' },
    })

    const result = await downloadAlertDataset()

    expect(get).toHaveBeenCalledWith("/alerts/dataset", {
      params: { reviewStatus: "CONFIRMED" },
      responseType: "blob",
    })
    expect(result.blob).toBe(blob)
    expect(result.filename).toBe("paczka.zip")
  })

  it("przekazuje limit i status oraz nazywa plik, gdy backend nie poda nagłówka", async () => {
    get.mockResolvedValue({ data: new Blob([]), headers: {} })

    const result = await downloadAlertDataset({
      reviewStatus: "REJECTED",
      limit: 50,
    })

    expect(get).toHaveBeenCalledWith("/alerts/dataset", {
      params: { reviewStatus: "REJECTED", limit: 50 },
      responseType: "blob",
    })
    expect(result.filename).toBe("zagroda-dataset-rejected.zip")
  })
})

describe("saveBlobAsFile", () => {
  it("klika w tymczasowy link i zwalnia obiekt URL", () => {
    const createObjectURL = vi.fn(() => "blob:paczka")
    const revokeObjectURL = vi.fn()
    vi.stubGlobal("URL", { ...URL, createObjectURL, revokeObjectURL })
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {})

    saveBlobAsFile(new Blob(["zip"]), "paczka.zip")

    expect(createObjectURL).toHaveBeenCalled()
    expect(click).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:paczka")
    // Link nie może zostać w DOM po pobraniu.
    expect(document.querySelectorAll("a")).toHaveLength(0)

    click.mockRestore()
    vi.unstubAllGlobals()
  })
})
