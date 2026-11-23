import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

const refreshUser = vi.fn()
let user: { farms: unknown[]; loading: boolean; error: string | null } = {
  farms: [],
  loading: false,
  error: null,
}

vi.mock("@/context/UserContext", () => ({
  useUser: () => ({ ...user, refreshUser }),
}))
vi.mock("@/hooks/use-auth", () => ({ useAuth: () => ({ logout: vi.fn() }) }))
vi.mock("@/components/onboarding/OnboardingScreen", () => ({
  OnboardingScreen: () => <div>onboarding</div>,
}))
vi.mock("@/components/app-sidebar", () => ({ AppSidebar: () => null }))
vi.mock("@/components/shell-header", () => ({ ShellHeader: () => null }))

import { DashboardContent } from "./dashboard-content"

beforeEach(() => {
  refreshUser.mockClear()
})

describe("DashboardContent", () => {
  it("gdy API nie odpowiada, pokazuje błąd zamiast onboardingu", () => {
    user = { farms: [], loading: false, error: "Nie możemy połączyć się z serwerem." }
    render(<DashboardContent defaultOpen>treść</DashboardContent>)

    expect(screen.getByRole("alert")).toHaveTextContent("Nie możemy połączyć się z serwerem.")
    expect(screen.queryByText("onboarding")).toBeNull()

    fireEvent.click(screen.getByRole("button", { name: "Spróbuj ponownie" }))
    expect(refreshUser).toHaveBeenCalled()
  })

  it("onboarding tylko wtedy, gdy API potwierdzi brak gospodarstw", () => {
    user = { farms: [], loading: false, error: null }
    render(<DashboardContent defaultOpen>treść</DashboardContent>)
    expect(screen.getByText("onboarding")).toBeInTheDocument()
  })
})
