"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  activeItem,
  onItemClick,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
  }[];
  activeItem?: string;
  onItemClick?: (title: string) => void;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Gospodarstwo</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title} 
                isActive={activeItem === item.title}
                onClick={() => onItemClick?.(item.title)}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
