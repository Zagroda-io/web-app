import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { SensorSearchBox } from "./SensorSearchBox"

describe("SensorSearchBox", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  const type = (value: string) =>
    fireEvent.change(screen.getByRole("searchbox", { name: "Szukaj czujnika" }), { target: { value } })

  it("szuka dopiero, gdy hodowca przestanie pisać", () => {
    const onSearch = vi.fn()
    render(<SensorSearchBox initialValue="" onSearch={onSearch} />)

    type("mu")
    act(() => vi.advanceTimersByTime(200))
    type("mucka")
    act(() => vi.advanceTimersByTime(399))
    expect(onSearch).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(1))
    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith("mucka")
  })

  it("Enter szuka od razu", () => {
    const onSearch = vi.fn()
    render(<SensorSearchBox initialValue="" onSearch={onSearch} />)

    type(" Łatka ")
    fireEvent.keyDown(screen.getByRole("searchbox"), { key: "Enter" })

    expect(onSearch).toHaveBeenCalledWith("Łatka")
  })

  it("krzyżyk czyści pole i wyniki", () => {
    const onSearch = vi.fn()
    render(<SensorSearchBox initialValue="mućka" onSearch={onSearch} />)

    fireEvent.click(screen.getByRole("button", { name: "Wyczyść wyszukiwanie" }))

    expect(onSearch).toHaveBeenCalledWith("")
    expect(screen.getByRole("searchbox")).toHaveValue("")
  })

  it("nie wysyła zapytania, gdy tekst się nie zmienił", () => {
    const onSearch = vi.fn()
    render(<SensorSearchBox initialValue="mućka" onSearch={onSearch} />)

    act(() => vi.advanceTimersByTime(1000))
    expect(onSearch).not.toHaveBeenCalled()
  })
})
