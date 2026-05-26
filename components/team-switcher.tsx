"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useUser } from "@/context/UserContext"
import {
  BeefIcon,
  ChevronsUpDownIcon,
  PlusIcon,
  SproutIcon,
  TractorIcon,
  WheatIcon,
} from "lucide-react"
import { CreateFarmDialog } from "@/components/farm/CreateFarmDialog"

const getLogo = (type?: string) => {
  switch (type) {
    case "livestock":
      return <BeefIcon className="size-4" />
    case "crops":
      return <WheatIcon className="size-4" />
    case "mixed":
      return <SproutIcon className="size-4" />
    default:
      return <TractorIcon className="size-4" />
  }
}

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const { farms, activeFarm, switchFarm, loading } = useUser()
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="flex aspect-square size-8 animate-pulse items-center justify-center rounded-lg bg-sidebar-accent" />
            <div className="grid flex-1 gap-1">
              <div className="h-3 w-24 animate-pulse rounded bg-sidebar-accent" />
              <div className="h-2 w-16 animate-pulse rounded bg-sidebar-accent" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const currentFarm = activeFarm || farms[0]

  if (!currentFarm && farms.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" onClick={() => setShowCreateDialog(true)}>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <PlusIcon className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Brak gospodarstw</span>
              <span className="truncate text-xs">Dodaj swoje pierwsze</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <CreateFarmDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {getLogo(currentFarm?.type)}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {currentFarm?.name}
                </span>
                <span className="truncate text-xs">Gospodarstwo</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Gospodarstwa
            </DropdownMenuLabel>
            {farms.map((farm, index) => (
              <DropdownMenuItem
                key={farm.id}
                onClick={() => switchFarm(farm.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {getLogo(farm.type)}
                </div>
                {farm.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onSelect={() => {
                setTimeout(() => {
                  setShowCreateDialog(true)
                }, 0)
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <PlusIcon className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Dodaj gospodarstwo
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <CreateFarmDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </SidebarMenu>
  )
}
