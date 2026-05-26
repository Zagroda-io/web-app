'use client';

import { useUser } from "@/context/UserContext"
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ShellHeader } from "@/components/shell-header"
import { AnimatePresence } from "framer-motion"
import { PageTransition } from "@/components/page-transition"

export function DashboardContent({ 
  children, 
  defaultOpen 
}: { 
  children: React.ReactNode, 
  defaultOpen: boolean 
}) {
  const { farms, loading } = useUser()

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
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
