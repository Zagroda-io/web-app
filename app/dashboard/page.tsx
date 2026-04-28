import { DashboardHeader } from "@/components/dashboard/header"
import { HerdAlerts } from "@/components/dashboard/herd-alerts"
import { HerdStatusCard } from "@/components/dashboard/herd-status"
import { MilkYieldCard } from "@/components/dashboard/milk-yield"
import { ModeToggle } from "@/components/mode-toggle"
import { herdStatusMock } from "@/mocks/dashboard/herd-status"
import { milkYieldMock } from "@/mocks/dashboard/milk-yield"
import { herdAlertsMock } from "@/mocks/dashboard/herd-alerts"
import Link from "next/link"
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

export default function Page() {
  return (
    <>
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
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Panel główny</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <DashboardHeader />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-3">
            <div className="grid gap-4 md:grid-cols-3">
              <MilkYieldCard {...milkYieldMock} className="md:col-span-2" />
              <HerdStatusCard {...herdStatusMock} />
            </div>
            <div className="min-h-[400px] flex-1 rounded-xl bg-muted/50" />
          </div>
          <div className="lg:col-span-1">
            <HerdAlerts alerts={herdAlertsMock} />
          </div>
        </div>
      </div>
    </>
  )
}
