import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

const reviewFarmAlert = vi.fn()
const success = vi.fn()
const error = vi.fn()

vi.mock("@/api/alerts", () => ({
  reviewFarmAlert: (...args: unknown[]) => reviewFarmAlert(...args),
}))

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => success(...args),
    error: (...args: unknown[]) => error(...args),
  },
}))

import { AlertReviewControls } from "./AlertReviewControls"
import type { AlertReviewStatus, FarmAlert } from "@/lib/types/stado.types"

function alert(reviewStatus: AlertReviewStatus): FarmAlert {
  return {
    alertId: "11111111-1111-1111-1111-111111111111",
    farmId: "22222222-2222-2222-2222-222222222222",
    farmKey: "FARM-0005",
    cowId: null,
    type: "CALVING",
    detectedAt: "2026-09-14T08:30:00Z",
    confidence: 0.91,
    videoRef: null,
    hasVideo: true,
    receivedAt: "2026-09-14T08:30:05Z",
    reviewStatus,
    reviewedBy: null,
    reviewedAt: null,
    reviewNote: null,
  }
}

describe("AlertReviewControls", () => {
  beforeEach(() => {
    reviewFarmAlert.mockReset()
    success.mockReset()
    error.mockReset()
  })

  it("dla alertu bez werdyktu pokazuje obie decyzje", () => {
    render(<AlertReviewControls alert={alert("PENDING")} onReviewed={vi.fn()} />)

    expect(screen.getByRole("button", { name: /prawdziwy/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /fałszywy/i })).toBeInTheDocument()
  })

  it("potwierdzenie zapisuje werdykt i oddaje rodzicowi alert z backendu", async () => {
    const confirmed = { ...alert("CONFIRMED"), reviewedBy: "user-1" }
    reviewFarmAlert.mockResolvedValue(confirmed)
    const onReviewed = vi.fn()

    render(<AlertReviewControls alert={alert("PENDING")} onReviewed={onReviewed} />)
    fireEvent.click(screen.getByRole("button", { name: /prawdziwy/i }))

    await waitFor(() => expect(onReviewed).toHaveBeenCalledWith(confirmed))
    expect(reviewFarmAlert).toHaveBeenCalledWith(
      "11111111-1111-1111-1111-111111111111",
      "CONFIRMED"
    )
    expect(success).toHaveBeenCalled()
  })

  it("odrzucenie wysyła status REJECTED", async () => {
    reviewFarmAlert.mockResolvedValue(alert("REJECTED"))

    render(<AlertReviewControls alert={alert("PENDING")} onReviewed={vi.fn()} />)
    fireEvent.click(screen.getByRole("button", { name: /fałszywy/i }))

    await waitFor(() =>
      expect(reviewFarmAlert).toHaveBeenCalledWith(
        "11111111-1111-1111-1111-111111111111",
        "REJECTED"
      )
    )
  })

  /** Werdykt musi dać się cofnąć — inaczej pomyłka zostaje w danych treningowych na zawsze. */
  it("dla zweryfikowanego alertu pokazuje etykietę i pozwala cofnąć decyzję", async () => {
    reviewFarmAlert.mockResolvedValue(alert("PENDING"))
    const onReviewed = vi.fn()

    render(
      <AlertReviewControls alert={alert("CONFIRMED")} onReviewed={onReviewed} />
    )
    expect(screen.getByText("Potwierdzony")).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: /prawdziwy/i })
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /cofnij weryfikację/i }))

    await waitFor(() =>
      expect(reviewFarmAlert).toHaveBeenCalledWith(
        "11111111-1111-1111-1111-111111111111",
        "PENDING"
      )
    )
  })

  it("błąd zapisu nie zmienia stanu listy i pokazuje komunikat", async () => {
    reviewFarmAlert.mockRejectedValue(new Error("503"))
    const onReviewed = vi.fn()
    vi.spyOn(console, "error").mockImplementation(() => {})

    render(<AlertReviewControls alert={alert("PENDING")} onReviewed={onReviewed} />)
    fireEvent.click(screen.getByRole("button", { name: /prawdziwy/i }))

    await waitFor(() => expect(error).toHaveBeenCalled())
    expect(onReviewed).not.toHaveBeenCalled()
  })
})
