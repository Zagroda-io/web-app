import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

const assignSensorToAnimal = vi.fn()
const unassignSensorFromAnimal = vi.fn()
const toastError = vi.fn()

vi.mock("@/lib/api/sensors", () => ({
  assignSensorToAnimal: (...args: unknown[]) => assignSensorToAnimal(...args),
  unassignSensorFromAnimal: (...args: unknown[]) => unassignSensorFromAnimal(...args),
}))
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: (...args: unknown[]) => toastError(...args) },
}))
// Radix Select w jsdom jest kłopotliwy; tu testujemy logikę dialogu, nie listę opcji.
vi.mock("./SensorSelect", () => ({
  SensorSelect: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <input aria-label="Czujnik" value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}))

import { AssignSensorDialog } from "./AssignSensorDialog"

const cow = (sensorId: string | null) => ({ id: "cow-1", name: "Mućka", sensorId })

describe("AssignSensorDialog", () => {
  beforeEach(() => {
    assignSensorToAnimal.mockReset().mockResolvedValue(undefined)
    unassignSensorFromAnimal.mockReset().mockResolvedValue(undefined)
    toastError.mockReset()
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  it("bez zmiany wyboru nie ma czego zapisać", () => {
    render(<AssignSensorDialog animal={cow("0080e115061bf535")} open onOpenChange={vi.fn()} onChanged={vi.fn()} />)

    expect(screen.getByRole("button", { name: "Zapisz" })).toBeDisabled()
  })

  it("przypisuje wybrany czujnik i odświeża krowę", async () => {
    const onChanged = vi.fn()
    render(<AssignSensorDialog animal={cow(null)} open onOpenChange={vi.fn()} onChanged={onChanged} />)

    fireEvent.change(screen.getByLabelText("Czujnik"), { target: { value: "0080e115061bf535" } })
    fireEvent.click(screen.getByRole("button", { name: "Zapisz" }))

    await waitFor(() => expect(onChanged).toHaveBeenCalled())
    expect(assignSensorToAnimal).toHaveBeenCalledWith("cow-1", "0080e115061bf535")
    expect(unassignSensorFromAnimal).not.toHaveBeenCalled()
  })

  it("wybór „bez czujnika” odłącza obecny czujnik", async () => {
    render(<AssignSensorDialog animal={cow("0080e115061bf535")} open onOpenChange={vi.fn()} onChanged={vi.fn()} />)

    fireEvent.change(screen.getByLabelText("Czujnik"), { target: { value: "" } })
    fireEvent.click(screen.getByRole("button", { name: "Zapisz" }))

    await waitFor(() => expect(unassignSensorFromAnimal).toHaveBeenCalledWith("cow-1"))
    expect(assignSensorToAnimal).not.toHaveBeenCalled()
  })

  it("przycisk „Odłącz czujnik” jest tylko dla krowy z czujnikiem", async () => {
    const { unmount } = render(
      <AssignSensorDialog animal={cow(null)} open onOpenChange={vi.fn()} onChanged={vi.fn()} />
    )
    expect(screen.queryByRole("button", { name: /odłącz czujnik/i })).not.toBeInTheDocument()
    unmount()

    render(<AssignSensorDialog animal={cow("0080e115061bf535")} open onOpenChange={vi.fn()} onChanged={vi.fn()} />)
    fireEvent.click(screen.getByRole("button", { name: /odłącz czujnik/i }))
    await waitFor(() => expect(unassignSensorFromAnimal).toHaveBeenCalledWith("cow-1"))
  })

  it("błąd zapisu zostawia dialog otwarty i pokazuje komunikat", async () => {
    assignSensorToAnimal.mockRejectedValue(new Error("409"))
    const onOpenChange = vi.fn()
    const onChanged = vi.fn()
    render(<AssignSensorDialog animal={cow(null)} open onOpenChange={onOpenChange} onChanged={onChanged} />)

    fireEvent.change(screen.getByLabelText("Czujnik"), { target: { value: "0080e115061bf535" } })
    fireEvent.click(screen.getByRole("button", { name: "Zapisz" }))

    await waitFor(() => expect(toastError).toHaveBeenCalled())
    expect(onChanged).not.toHaveBeenCalled()
    expect(onOpenChange).not.toHaveBeenCalledWith(false)
  })
})
