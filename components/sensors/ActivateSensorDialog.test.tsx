import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

const activateSensor = vi.fn()
const success = vi.fn()

vi.mock("@/lib/api/sensors", () => ({
  activateSensor: (...args: unknown[]) => activateSensor(...args),
}))
vi.mock("sonner", () => ({
  toast: { success: (...args: unknown[]) => success(...args), error: vi.fn() },
}))

import { AxiosError, AxiosHeaders } from "axios"
import { ActivateSensorDialog } from "./ActivateSensorDialog"

function fillAndSubmit(devEui: string, code: string) {
  fireEvent.change(screen.getByLabelText("DevEUI"), { target: { value: devEui } })
  fireEvent.change(screen.getByLabelText("Kod aktywacyjny"), { target: { value: code } })
  fireEvent.click(screen.getByRole("button", { name: "Aktywuj" }))
}

describe("ActivateSensorDialog", () => {
  beforeEach(() => {
    activateSensor.mockReset()
    success.mockReset()
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  it("nie pozwala wysłać formularza bez obu pól", () => {
    render(<ActivateSensorDialog open onOpenChange={vi.fn()} onActivated={vi.fn()} />)

    const submit = screen.getByRole("button", { name: "Aktywuj" })
    expect(submit).toBeDisabled()
    fireEvent.change(screen.getByLabelText("DevEUI"), { target: { value: "0080e115061bf535" } })
    expect(submit).toBeDisabled()
  })

  it("aktywuje czujnik, oddaje go rodzicowi i zamyka dialog", async () => {
    const activated = { id: "s-1", devEui: "0080e115061bf535", status: "ACTIVE" }
    activateSensor.mockResolvedValue(activated)
    const onActivated = vi.fn()
    const onOpenChange = vi.fn()

    render(
      <ActivateSensorDialog open onOpenChange={onOpenChange} onActivated={onActivated} />
    )
    fillAndSubmit("00:80:E1:15:06:1B:F5:35", "7KQ4M-X2PDR")

    await waitFor(() => expect(onActivated).toHaveBeenCalledWith(activated))
    expect(activateSensor).toHaveBeenCalledWith("00:80:E1:15:06:1B:F5:35", "7KQ4M-X2PDR")
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(success).toHaveBeenCalled()
  })

  /** Hodowca musi zobaczyć, dlaczego się nie udało — np. czujnik aktywny w innym gospodarstwie. */
  it("pokazuje powód odmowy z backendu i zostawia dialog otwarty", async () => {
    activateSensor.mockRejectedValue(
      new AxiosError("Conflict", "ERR_BAD_REQUEST", undefined, undefined, {
        status: 409,
        statusText: "",
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: { detail: "Ten czujnik został już aktywowany w innym gospodarstwie." },
      })
    )
    const onOpenChange = vi.fn()

    render(<ActivateSensorDialog open onOpenChange={onOpenChange} onActivated={vi.fn()} />)
    fillAndSubmit("0080e115061bf535", "7KQ4M-X2PDR")

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Ten czujnik został już aktywowany w innym gospodarstwie."
    )
    expect(onOpenChange).not.toHaveBeenCalledWith(false)
    expect(screen.getByRole("button", { name: "Aktywuj" })).toBeEnabled()
  })
})
