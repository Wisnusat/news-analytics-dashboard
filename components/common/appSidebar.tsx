"use client"

import {
  LayoutDashboard,
  FileText,
  RefreshCw,
} from "lucide-react"

import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Article Management",
      url: "/articles",
      icon: FileText,
    },
    // {
    //   title: "Sync Status",
    //   url: "/sync",
    //   icon: RefreshCw,
    // },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-between px-4 py-4">

        {/* Collapse Button */}
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.url

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`
                        transition-colors
                        ${isActive 
                          ? "bg-blue-600 text-white hover:bg-blue-600" 
                          : "hover:bg-muted"
                        }
                      `}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}