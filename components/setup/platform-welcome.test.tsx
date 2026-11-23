import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"

import { PlatformWelcome } from "./platform-welcome"

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe("PlatformWelcome", () => {
  it("pokazuje powitanie i nazwę gospodarstwa", () => {
    render(<PlatformWelcome farmName="Gospodarstwo Testowe" farmLocation="podlaskie, Bystre" ready={false} onDone={vi.fn()} />)
    expect(screen.getByRole("heading", { name: "Witaj w platformie Zagroda" })).toBeInTheDocument()
    expect(screen.getByText("Twoje gospodarstwo zostało dodane.")).toBeInTheDocument()
    expect(screen.getByText("Gospodarstwo Testowe")).toBeInTheDocument()
    expect(screen.getByText("Bystre, podlaskie")).toBeInTheDocument()
  })

  it("nie znika od razu, nawet gdy dane są już gotowe", () => {
    const onDone = vi.fn()
    render(<PlatformWelcome farmName="X" ready onDone={onDone} />)
    act(() => vi.advanceTimersByTime(1000))
    expect(onDone).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(2000))
    expect(onDone).toHaveBeenCalled()
  })

  it("czeka na dane konta, ale nie dłużej niż limit", () => {
    const onDone = vi.fn()
    render(<PlatformWelcome farmName="X" ready={false} onDone={onDone} />)
    act(() => vi.advanceTimersByTime(4000))
    expect(onDone).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(4500))
    expect(onDone).toHaveBeenCalled()
  })
})
