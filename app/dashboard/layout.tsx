import { cookies } from "next/headers"
import { UserProvider } from "@/context/UserContext"
import { DashboardContent } from "@/components/dashboard-content"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const sidebarState = cookieStore.get("sidebar_state")?.value
  const defaultOpen = sidebarState !== "false"

  return (
    <UserProvider>
      <DashboardContent defaultOpen={defaultOpen}>
        {children}
      </DashboardContent>
    </UserProvider>
  )
}
