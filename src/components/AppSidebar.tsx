'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { UserAvatar } from '@/components/UserAvatar'
import { NAV_ITEMS } from '@/lib/navigation'
import type { Member } from '@/payload-types'

interface Settings {
  fraternityName: string
  logo?: {
    url: string
    alt?: string
  }
}

export function AppSidebar() {
  const pathname = usePathname()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [user, setUser] = useState<Member | null>(null)

  useEffect(() => {
    // Fetch settings
    fetch('/api/globals/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error('Failed to fetch settings:', err))

    // Fetch current user
    fetch('/api/members/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user)
        }
      })
      .catch((err) => console.error('Failed to fetch user:', err))
  }, [])

  const logoSrc = settings?.logo?.url || '/images/merc-logo.png'
  const fraternityName = settings?.fraternityName || 'K.Ö.H.V. Mercuria'

  const handleLogout = async () => {
    try {
      await fetch('/api/members/logout', { method: 'POST' })
      window.location.href = '/login'
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={logoSrc}
            alt={`${fraternityName} Logo`}
            width={32}
            height={32}
            className="size-8"
          />
          <span className="text-base font-semibold">{fraternityName}</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon />
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

      <SidebarFooter className="border-t p-4">
        {user && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <UserAvatar user={user} />
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">
                  {user.couleurname || `${user.firstName} ${user.lastName}`}
                </p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg p-2 text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="size-4" />
              <span>Abmelden</span>
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
