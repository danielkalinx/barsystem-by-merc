'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { NAV_ITEMS } from '@/lib/navigation'
import { useEffect, useState } from 'react'

export function SidebarMobile() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showFloating, setShowFloating] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // User has scrolled past threshold
      if (currentScrollY > 150) {
        setIsScrolled(true)

        // Scrolling up - show floating nav
        if (currentScrollY < lastScrollY) {
          setShowFloating(true)
        }
        // Scrolling down - hide floating nav
        else if (currentScrollY > lastScrollY) {
          setShowFloating(false)
        }
      } else {
        // At top of page
        setIsScrolled(false)
        setShowFloating(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const NavContent = () => (
    <>
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
    </>
  )

  return (
    <>
      {/* Static Navigation (always visible, scrolls with content) */}
      <header className="absolute top-0 z-50 w-full lg:hidden">
        <div className="container mx-auto px-6 pt-6">
          <div className="flex items-center gap-2 overflow-x-auto">
            <NavContent />
          </div>
        </div>
      </header>

      {/* Floating Navigation (shows on scroll up) */}
      <AnimatePresence>
        {showFloating && (
          <motion.header
            className="fixed top-0 z-50 w-full lg:hidden"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/40 to-background/0" />

            <div className="container relative mx-auto px-6 pt-6">
              <div className="flex items-center gap-2 overflow-x-auto rounded-full border border-border/50 bg-background/95 px-4 py-3 backdrop-blur-md">
                <NavContent />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>
    </>
  )
}
