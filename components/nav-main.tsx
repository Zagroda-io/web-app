"use client"

import { useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItem {
  title: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Nawigacja</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (!item.items || item.items.length === 0) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={item.isActive}
                >
                  <Link href={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          return (
            <NavSection key={item.title} item={item} pathname={pathname} />
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function isInSection(pathname: string, url: string): boolean {
  return url !== "#" && (pathname === url || pathname.startsWith(`${url}/`))
}

/**
 * Pozycja z podstronami. Gdy sekcja ma własny adres (np. Czujniki), nazwa pozostaje linkiem,
 * a podstrony rozwija osobna strzałka — w zwiniętym pasku (same ikony) link nadal działa.
 */
function NavSection({ item, pathname }: { item: NavItem; pathname: string }) {
  const inSection = isInSection(pathname, item.url)
  const [open, setOpen] = useState(item.isActive || inSection)

  // Wejście do sekcji z innego miejsca aplikacji rozwija jej podstrony.
  const [wasInSection, setWasInSection] = useState(inSection)
  if (inSection !== wasInSection) {
    setWasInSection(inSection)
    if (inSection) setOpen(true)
  }

  const hasOwnPage = item.url !== "#"

  return (
    <Collapsible
      asChild
      open={open}
      onOpenChange={setOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        {hasOwnPage ? (
          <>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={item.isActive}
            >
              <Link href={item.url}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
            <CollapsibleTrigger asChild>
              <SidebarMenuAction className="transition-transform duration-200 data-[state=open]:rotate-90">
                <ChevronRightIcon />
                <span className="sr-only">
                  {open ? "Zwiń" : "Rozwiń"}: {item.title}
                </span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
          </>
        ) : (
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon}
              <span>{item.title}</span>
              <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
        )}
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={subItem.url !== "#" && pathname === subItem.url}
                >
                  <Link href={subItem.url}>
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
