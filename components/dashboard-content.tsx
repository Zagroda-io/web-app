'use client';

import { useUser } from "@/context/UserContext"
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ShellHeader } from "@/components/shell-header"
import { AnimatePresence } from "framer-motion"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { CloudOffIcon } from "lucide-react"

export function DashboardContent({ 
  children, 
  defaultOpen 
}: { 
  children: React.ReactNode, 
  defaultOpen: boolean 
}) {
  const { farms, loading, error, refreshUser } = useUser()
  const { logout } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Bez odpowiedzi API nie wiemy, czy gospodarstwa są — nie pokazujemy onboardingu.
  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-6">
        <div role="alert" className="flex max-w-sm flex-col items-center gap-4 text-center">
          <CloudOffIcon className="size-10 text-muted-foreground" aria-hidden />
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold">Nie udało się wczytać panelu</h1>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => refreshUser()}>Spróbuj ponownie</Button>
            <Button variant="ghost" onClick={() => logout()}>
              Wyloguj się
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Jeśli nie ma farm, wyświetlamy ekran onboardingu
  if (farms.length === 0) {
    return <OnboardingScreen />
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <ShellHeader />
        <AnimatePresence mode="wait">
          <PageTransition>{children}</PageTransition>
        </AnimatePresence>
      </SidebarInset>
    </SidebarProvider>
  )
}
