'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { NAV_ITEMS } from '@/lib/navigation'

export function MobileNav() {
  const pathname = usePathname()

  return (
    <motion.nav
      className="fixed left-0 right-0 top-0 z-50 lg:hidden"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-background/0" />

      <div className="container relative mx-auto px-6 pt-6">
        <div className="flex items-center gap-2 overflow-x-auto rounded-full border border-border/50 bg-background/95 px-4 py-3 backdrop-blur-md">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="size-4" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )
}
