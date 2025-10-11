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
  const [colors, setColors] = useState({
    primary: '',
    primaryForeground: '',
    mutedForeground: '',
  })

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

  // Compute colors after hydration
  useEffect(() => {
    const styles = getComputedStyle(document.documentElement)
    setColors({
      primary: styles.getPropertyValue('--primary'),
      primaryForeground: styles.getPropertyValue('--primary-foreground'),
      mutedForeground: styles.getPropertyValue('--muted-foreground'),
    })
  }, [])

  const NavContent = () => {

    return (
      <>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href} className="shrink-0">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isActive ? colors.primary : 'transparent',
                  color: isActive ? colors.primaryForeground : colors.mutedForeground,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
              >
                <Icon className="size-4 shrink-0" />
                <motion.span
                  initial={false}
                  animate={{
                    width: isActive ? 'auto' : 0,
                    opacity: isActive ? 1 : 0,
                    marginLeft: isActive ? '0.5rem' : 0,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {item.title}
                </motion.span>
              </motion.div>
            </Link>
          )
        })}
      </>
    )
  }

  return (
    <>
      {/* Static Navigation (always visible, scrolls with content) */}
      <header className="absolute top-0 z-50 w-full lg:hidden">
        <div className="container mx-auto px-6 pt-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
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
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide rounded-full border border-border/50 bg-background/95 px-4 py-3 backdrop-blur-md">
                <NavContent />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>
    </>
  )
}
