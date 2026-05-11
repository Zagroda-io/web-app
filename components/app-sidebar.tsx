"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  BeefIcon,
  BookOpenIcon,
  FrameIcon,
  LayoutDashboardIcon,
  MapIcon,
  PieChartIcon,
  Settings2Icon,
  SproutIcon,
  TractorIcon,
  WheatIcon,
} from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "Użytkownik",
    email: "user@zagroda.io",
    avatar: "/avatars/user.jpg",
  },
  teams: [
    {
      name: "Zagroda Słoneczna",
      logo: <SproutIcon />,
      plan: "Gospodarstwo",
    },
    {
      name: "Pole Pszenicy",
      logo: <WheatIcon />,
      plan: "Gospodarstwo",
    },
    {
      name: "Agro-Technika",
      logo: <TractorIcon />,
      plan: "Usługi",
    },
  ],
  navMain: [
    {
      title: "Panel Główny",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
      isActive: true,
    },
    {
      title: "Stado",
      url: "/dashboard/stado",
      icon: <BeefIcon />,
    },
    {
      title: "Uprawy",
      url: "#",
      icon: <SproutIcon />,
      items: [
        {
          title: "Zasiewy",
          url: "#",
        },
        {
          title: "Zbiory",
          url: "#",
        },
        {
          title: "Magazyn",
          url: "#",
        },
      ],
    },
    {
      title: "Dokumentacja",
      url: "#",
      icon: <BookOpenIcon />,
      items: [
        {
          title: "Wprowadzenie",
          url: "#",
        },
        {
          title: "Raporty",
          url: "#",
        },
      ],
    },
    {
      title: "Ustawienia",
      url: "#",
      icon: <Settings2Icon />,
      items: [
        {
          title: "Ogólne",
          url: "#",
        },
        {
          title: "Gospodarstwo",
          url: "#",
        },
        {
          title: "Płatności",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Infrastruktura",
      url: "#",
      icon: <FrameIcon />,
    },
    {
      name: "Finanse",
      url: "#",
      icon: <PieChartIcon />,
    },
    {
      name: "Logistyka",
      url: "#",
      icon: <MapIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
