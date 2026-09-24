import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { AddEventDialog } from "./AddEventDialog"

const addAnimalEvent = vi.fn()
vi.mock("@/lib/api/stado", () => ({
  addAnimalEvent: (...args: unknown[]) => addAnimalEvent(...args),
}))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const cow = { id: "cow-1", name: "Basia", earTagNumber: "PL005003001234034" }

describe("AddEventDialog", () => {
  beforeEach(() => addAnimalEvent.mockReset().mockResolvedValue({}))

  it("startuje z typem wybranym przyciskiem akcji", () => {
    render(
      <AddEventDialog animal={cow} initialType="ESTRUS" onClose={vi.fn()} />
    )

    expect(screen.getByRole("radio", { name: "Ruja" })).toHaveAttribute(
      "aria-checked",
      "true"
    )
    expect(
      screen.getByText("Basia #034 · PL005003001234034")
    ).toBeInTheDocument()
  })

  it("zapisuje ocenę BCS z metadanymi i zamyka dialog", async () => {
    const onClose = vi.fn()
    const onSaved = vi.fn()
    render(<AddEventDialog animal={cow} onClose={onClose} onSaved={onSaved} />)

    fireEvent.click(screen.getByRole("radio", { name: "BCS" }))
    fireEvent.change(screen.getByLabelText("Ocena kondycji (1–5)"), {
      target: { value: "3,5" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Zapisz" }))

    await waitFor(() => expect(onClose).toHaveBeenCalled())
    expect(addAnimalEvent).toHaveBeenCalledWith(
      "cow-1",
      expect.objectContaining({
        type: "BCS",
        metadata: JSON.stringify({ score: 3.5 }),
      })
    )
    expect(onSaved).toHaveBeenCalled()
  })

  it("nie wysyła formularza z błędną oceną BCS", async () => {
    render(<AddEventDialog animal={cow} initialType="BCS" onClose={vi.fn()} />)

    fireEvent.change(screen.getByLabelText("Ocena kondycji (1–5)"), {
      target: { value: "9" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Zapisz" }))

    expect(await screen.findByRole("alert")).toHaveTextContent("od 1 do 5")
    expect(addAnimalEvent).not.toHaveBeenCalled()
  })
})
