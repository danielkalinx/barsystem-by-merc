'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { NAV_ITEMS } from '@/lib/navigation'

export function AppSidebar() {
  const pathname = usePathname()
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

  return (
    <Sidebar className="top-16">
      <SidebarContent className="pt-8">
        <SidebarGroup>
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
    </Sidebar>
  )
}
