"use client"

import { useUser } from "@/context/UserContext"
import { SetupFlow } from "@/components/setup/setup-flow"
import { PlatformWelcome } from "@/components/setup/platform-welcome"
import type { Farm } from "@/types/farm"
import { getSetupStep, resolveSetup } from "@/lib/setup/setup-state"
import { useRouter } from "next/navigation"
import { useState } from "react"
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
  defaultOpen,
}: {
  children: React.ReactNode
  defaultOpen: boolean
}) {
  const { loading, error, refreshUser } = useUser()
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
        <div
          role="alert"
          className="flex max-w-sm flex-col items-center gap-4 text-center"
        >
          <CloudOffIcon className="size-10 text-muted-foreground" aria-hidden />
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold">
              Nie udało się wczytać panelu
            </h1>
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

  return <DashboardReady defaultOpen={defaultOpen}>{children}</DashboardReady>
}

/**
 * Dane konta są już wczytane. Raz, przy montowaniu, decydujemy, czy pokazać powitanie
 * i konfigurację (brak gospodarstwa albo przerwana konfiguracja), czy panel.
 */
function DashboardReady({
  children,
  defaultOpen,
}: {
  children: React.ReactNode
  defaultOpen: boolean
}) {
  const { farms, activeFarm, fullName, email, refreshUser } = useUser()
  const router = useRouter()
  const [setup] = useState(() =>
    resolveSetup(farms.length, getSetupStep(email))
  )
  const [setupDone, setSetupDone] = useState(false)
  // „Witaj w platformie Zagroda” nad panelem, który w tym czasie wczytuje się pod spodem.
  // `covered` — nakładka zakryła już ekran „gotowe”; dopiero wtedy pod spodem montuje się panel,
  // żeby między konfiguracją a powitaniem nie mignął panel.
  const [welcome, setWelcome] = useState<{
    farm: Farm | null
    ready: boolean
    covered: boolean
  } | null>(null)

  const overlay = (
    <AnimatePresence>
      {welcome ? (
        <PlatformWelcome
          key="platform-welcome"
          farmName={welcome.farm?.name ?? null}
          farmLocation={welcome.farm?.location}
          ready={welcome.ready}
          onCovered={() => setWelcome((w) => (w ? { ...w, covered: true } : w))}
          onDone={() => setWelcome(null)}
        />
      ) : null}
    </AnimatePresence>
  )

  if (setup.show !== "none" && (!setupDone || (welcome && !welcome.covered))) {
    return (
      <>
        <SetupFlow
          initialStep={setup.show === "wizard" ? setup.step : null}
          farm={activeFarm ?? farms[0] ?? null}
          owner={email}
          fullName={fullName}
          email={email}
          onFinish={(href, farm) => {
            setSetupDone(true)
            setWelcome({ farm, ready: false, covered: false })
            if (href) router.push(href)
            // Nowe gospodarstwo w sidebarze i nagłówku — po cichu, bez spinnera zamiast panelu.
            refreshUser({ silent: true }).finally(() =>
              setWelcome((w) => (w ? { ...w, ready: true } : w))
            )
          }}
        />
        {overlay}
      </>
    )
  }

  return (
    <>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <ShellHeader />
          <AnimatePresence mode="wait">
            <PageTransition>{children}</PageTransition>
          </AnimatePresence>
        </SidebarInset>
      </SidebarProvider>
      {overlay}
    </>
  )
}
