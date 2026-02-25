"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, LayoutDashboard, FileText, RefreshCw } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

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
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="p-2">
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>

        <SheetContent side="right" className="w-64 p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">
                News Analytics Dashboard
              </h2>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.url

                return (
                  <Link
                    key={item.title}
                    href={item.url}
                    onClick={() => setOpen(false)}
                    className={`
                      flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors
                      ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "hover:bg-muted"
                      }
                    `}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                )
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}