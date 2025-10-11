'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, LayoutGroup } from 'motion/react'
import { NAV_ITEMS } from '@/lib/navigation'
import { useEffect, useState } from 'react'

// Shared navigation content component
function NavContent({ disableAnimation = false }: { disableAnimation?: boolean }) {
  const pathname = usePathname()

  return (
    <LayoutGroup>
      <div className="flex items-center gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            >
              {/* Animated pill background */}
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={
                    disableAnimation
                      ? { duration: 0 }
                      : {
                          type: 'spring',
                          stiffness: 400,
                          damping: 35,
                        }
                  }
                />
              )}

              {/* Icon */}
              <Icon
                className={`relative z-10 size-4 shrink-0 transition-colors duration-200 ${
                  isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}
              />

              {/* Active text */}
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.span
                    key="text"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{
                      duration: 0.25,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="relative z-10 overflow-hidden whitespace-nowrap text-primary-foreground"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </div>
    </LayoutGroup>
  )
}

export function SidebarMobile() {
  const pathname = usePathname()
  const [showFloating, setShowFloating] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  // Reset scrolling state on navigation
  useEffect(() => {
    setIsScrolling(false)
  }, [pathname])

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Set scrolling state
      setIsScrolling(true)
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 150)

      // User has scrolled past threshold
      if (currentScrollY > 150) {
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
        setShowFloating(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [lastScrollY])

  return (
    <>
      {/* Static Navigation (always visible, scrolls with content) */}
      <header className="absolute top-0 z-50 w-full lg:hidden">
        <div className="container mx-auto px-6 pt-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <NavContent disableAnimation={isScrolling} />
          </div>
        </div>
      </header>

      {/* Floating Navigation (shows on scroll up) */}
      <AnimatePresence mode="wait">
        {showFloating && (
          <motion.header
            key="floating-nav"
            className="fixed top-0 z-50 w-full lg:hidden"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/40 to-background/0" />

            <div className="container relative mx-auto px-6 pt-6">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide rounded-full border border-border/50 bg-background/95 px-4 py-3 backdrop-blur-md">
                <NavContent disableAnimation={isScrolling} />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>
    </>
  )
}
