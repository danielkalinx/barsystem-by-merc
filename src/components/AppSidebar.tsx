'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 48 })
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  const activeIndex = useMemo(
    () => NAV_ITEMS.findIndex((item) => item.href === pathname),
    [pathname],
  )

  const targetIndex = hoveredIndex ?? activeIndex

  // Update indicator position
  useEffect(() => {
    const targetElement = itemRefs.current[targetIndex]
    if (targetElement) {
      setIndicatorStyle({
        top: targetElement.offsetTop,
        height: targetElement.offsetHeight,
      })
    }
  }, [targetIndex])

  // Fetch settings and user
  useEffect(() => {
    fetch('/api/globals/settings')
      .then((res) => res.json())
      .then(setSettings)
      .catch(console.error)

    fetch('/api/members/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data?.user && setUser(data.user))
      .catch(console.error)
  }, [])

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
            src={settings?.logo?.url || '/images/merc-logo.png'}
            alt={`${settings?.fraternityName || 'Logo'}`}
            width={32}
            height={32}
            className="size-8"
          />
          <span className="text-base font-semibold">
            {settings?.fraternityName || 'K.Ö.H.V. Mercuria'}
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="relative">
              {/* Single animated indicator */}
              <div
                className="pointer-events-none absolute left-0 right-0 rounded-xl bg-muted transition-all duration-200 ease-out"
                style={{
                  top: `${indicatorStyle.top}px`,
                  height: `${indicatorStyle.height}px`,
                }}
              />

              {/* Nav items */}
              {NAV_ITEMS.map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <SidebarMenuItem
                    key={item.href}
                    ref={(el) => {
                      itemRefs.current[index] = el
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Link
                      href={item.href}
                      className="relative flex h-12 w-full items-center gap-3 rounded-xl px-3 text-base"
                    >
                      <Icon className="size-5 shrink-0" />
                      <span className={isActive ? 'font-medium' : ''}>{item.title}</span>
                    </Link>
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
              className="flex w-full items-center gap-2 rounded-lg p-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
