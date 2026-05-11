"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { HeaderUser } from "@/components/header-user"
import { LivenessIndicator } from "@/components/liveness-indicator"
import { Input } from "@/components/ui/input"
import { BellIcon, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const routeMap: Record<string, string> = {
  dashboard: "Panel główny",
  stado: "Stado",
  ustawienia: "Ustawienia",
  zalatwienia: "Załatwienia",
}

const user = {
  name: "Użytkownik",
  email: "user@zagroda.io",
  avatar: "/avatars/user.jpg",
}

export function ShellHeader() {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Zagroda</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {pathSegments.map((segment, index) => {
              const isLast = index === pathSegments.length - 1
              const href = `/${pathSegments.slice(0, index + 1).join("/")}`
              const label = routeMap[segment] || segment

              // Jeśli segment to 'dashboard' i jest przedostatni, a po nim jest coś jeszcze,
              // to 'Zagroda' już go reprezentuje (jako link do /dashboard).
              if (segment === "dashboard" && !isLast) return null

              return (
                <React.Fragment key={href}>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={href}>{label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative mr-2 hidden items-center md:flex">
          <SearchIcon className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Szukaj..."
            className="w-64 pl-9 lg:w-80"
          />
        </div>

        <Separator orientation="vertical" className="mx-1 h-4" />

        <Button variant="ghost" size="icon" className="h-9 w-9">
          <BellIcon className="h-5 w-5" />
          <span className="sr-only">Powiadomienia</span>
        </Button>

        <LivenessIndicator />

        <ModeToggle />

        <HeaderUser user={user} />
      </div>
    </header>
  )
}
