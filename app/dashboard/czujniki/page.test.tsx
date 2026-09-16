import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FarmSensor, SensorPage } from "@/lib/types/sensor.types"

const replace = vi.fn()
let currentQuery = ""
const getFarmSensors = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/dashboard/czujniki",
  useSearchParams: () => new URLSearchParams(currentQuery),
}))
vi.mock("@/api/sensors", () => ({
  getFarmSensors: (...args: unknown[]) => getFarmSensors(...args),
  activateSensor: vi.fn(),
}))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() } }))

import CzujnikiPage from "./page"

function sensor(devEui: string, cow: string | null): FarmSensor {
  return {
    id: devEui,
    devEui,
    type: "ANIMAL",
    model: null,
    status: "ACTIVE",
    activatedAt: "2026-09-16T08:00:00Z",
    assignedAnimal: cow ? { id: `cow-${cow}`, name: cow, earTagNumber: "PL005432167891" } : null,
    connectionStatus: "ONLINE",
    batteryPct: 80,
    rssi: -85,
    lastSeenAt: null,
  }
}

function page(content: FarmSensor[], overrides: Partial<SensorPage> = {}): SensorPage {
  return {
    content,
    number: 0,
    size: 20,
    totalElements: content.length,
    totalPages: content.length ? 1 : 0,
    first: true,
    last: true,
    summary: { total: 4, assigned: 3, free: 1, needsAttention: 2, noData: 0 },
    ...overrides,
  }
}

describe("widok Czujniki", () => {
  beforeEach(() => {
    replace.mockReset()
    getFarmSensors.mockReset()
    currentQuery = ""
  })

  it("pyta API o filtry zapisane w adresie", async () => {
    currentQuery = "q=mucka&stan=ATTENTION&strona=2&rozmiar=50"
    getFarmSensors.mockResolvedValue(page([sensor("0080e115061bf535", "Mućka")], { number: 1, size: 50 }))

    render(<CzujnikiPage />)

    expect(await screen.findByText("Mućka")).toBeInTheDocument()
    expect(getFarmSensors).toHaveBeenCalledWith({
      search: "mucka",
      assignment: undefined,
      health: "ATTENTION",
      sort: "ATTENTION",
      page: 1,
      size: 50,
    })
  })

  it("kafelki pokazują całą pulę i filtrują jednym kliknięciem", async () => {
    getFarmSensors.mockResolvedValue(page([sensor("0080e115061bf535", "Mućka")]))

    render(<CzujnikiPage />)
    const attention = await screen.findByRole("button", { name: /wymaga uwagi\s*2/i })
    expect(screen.getByRole("button", { name: /wszystkie\s*4/i })).toHaveAttribute("aria-pressed", "true")

    fireEvent.click(attention)

    expect(replace).toHaveBeenCalledWith("/dashboard/czujniki?stan=ATTENTION", { scroll: false })
  })

  it("gdy filtry nic nie znajdują — podpowiada ich wyczyszczenie", async () => {
    currentQuery = "q=krasula&przypisanie=FREE&sort=BATTERY"
    getFarmSensors.mockResolvedValue(page([]))

    render(<CzujnikiPage />)
    expect(await screen.findByText("Brak czujników pasujących do filtrów")).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole("button", { name: "Wyczyść filtry" })[0])

    // Sortowanie zostaje — to preferencja, nie filtr.
    expect(replace).toHaveBeenCalledWith("/dashboard/czujniki?sort=BATTERY", { scroll: false })
  })

  it("pusta pula zachęca do aktywacji zamiast pokazywać filtry", async () => {
    getFarmSensors.mockResolvedValue(
      page([], { summary: { total: 0, assigned: 0, free: 0, needsAttention: 0, noData: 0 } })
    )

    render(<CzujnikiPage />)

    expect(await screen.findByText("Nie masz jeszcze aktywnych czujników")).toBeInTheDocument()
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument()
  })

  /** Link do strony 9 po usunięciu czujników — backend oddaje ostatnią stronę, adres się wyrównuje. */
  it("wyrównuje numer strony w adresie do tego, co zwrócił backend", async () => {
    currentQuery = "strona=9"
    getFarmSensors.mockResolvedValue(page([sensor("0080e115061bf535", "Mućka")], { number: 0 }))

    render(<CzujnikiPage />)

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith("/dashboard/czujniki", { scroll: false })
    )
  })

  it("błąd bez wcześniejszych danych pokazuje ekran błędu z ponowieniem", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    getFarmSensors.mockRejectedValueOnce(new Error("503")).mockResolvedValue(page([sensor("0080e115061bf535", "Mućka")]))

    render(<CzujnikiPage />)
    fireEvent.click(await screen.findByRole("button", { name: /spróbuj ponownie/i }))

    expect(await screen.findByText("Mućka")).toBeInTheDocument()
    expect(getFarmSensors).toHaveBeenCalledTimes(2)
  })
})
