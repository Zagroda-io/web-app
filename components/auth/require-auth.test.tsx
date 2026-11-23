import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

const replace = vi.fn()
let auth = { isAuthenticated: false, isLoading: false }

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }))
vi.mock("@/hooks/use-auth", () => ({ useAuth: () => auth }))

import { RequireAuth } from "./require-auth"

beforeEach(() => {
  replace.mockClear()
})

describe("RequireAuth", () => {
  it("bez sesji przenosi do logowania i nie pokazuje panelu", () => {
    auth = { isAuthenticated: false, isLoading: false }
    render(<RequireAuth>panel</RequireAuth>)
    expect(replace).toHaveBeenCalledWith("/login")
    expect(screen.queryByText("panel")).toBeNull()
  })

  it("czeka, aż AuthProvider odczyta sesję", () => {
    auth = { isAuthenticated: false, isLoading: true }
    render(<RequireAuth>panel</RequireAuth>)
    expect(replace).not.toHaveBeenCalled()
    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("z sesją pokazuje panel", () => {
    auth = { isAuthenticated: true, isLoading: false }
    render(<RequireAuth>panel</RequireAuth>)
    expect(replace).not.toHaveBeenCalled()
    expect(screen.getByText("panel")).toBeInTheDocument()
  })
})
