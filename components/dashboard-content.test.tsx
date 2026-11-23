import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

const refreshUser = vi.fn()
let user: { farms: unknown[]; loading: boolean; error: string | null } = {
  farms: [],
  loading: false,
  error: null,
}

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/dashboard",
}))

vi.mock("@/context/UserContext", () => ({
  useUser: () => ({ ...user, activeFarm: null, fullName: null, email: null, refreshUser }),
}))
vi.mock("@/hooks/use-auth", () => ({ useAuth: () => ({ logout: vi.fn() }) }))
vi.mock("@/components/setup/setup-flow", () => ({
  SetupFlow: () => <div>onboarding</div>,
}))
vi.mock("@/components/app-sidebar", () => ({ AppSidebar: () => null }))
vi.mock("@/components/shell-header", () => ({ ShellHeader: () => null }))
vi.mock("@/components/ui/sidebar", () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SidebarInset: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

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

  it("powitanie i konfiguracja tylko wtedy, gdy API potwierdzi brak gospodarstw", () => {
    user = { farms: [], loading: false, error: null }
    render(<DashboardContent defaultOpen>treść</DashboardContent>)
    expect(screen.getByText("onboarding")).toBeInTheDocument()
  })

  it("z gospodarstwem i bez przerwanej konfiguracji pokazuje panel", () => {
    user = { farms: [{ id: "f1" }], loading: false, error: null }
    render(<DashboardContent defaultOpen>treść</DashboardContent>)
    expect(screen.queryByText("onboarding")).toBeNull()
    expect(screen.getByText("treść")).toBeInTheDocument()
  })
})
