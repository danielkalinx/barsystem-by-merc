'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { UserAvatar } from '@/components/UserAvatar'
import { NAV_ITEMS } from '@/lib/navigation'
import { useEffect, useState, useMemo } from 'react'
import type { Member } from '@/payload-types'
import { Menu, X } from 'lucide-react'

interface Settings {
  fraternityName: string
  logo?: {
    url: string
    alt?: string
  }
}

export function Navbar() {
  const pathname = usePathname()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [user, setUser] = useState<Member | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showFloating, setShowFloating] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // User has scrolled past threshold
      if (currentScrollY > 75) {
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

  const logoSrc = settings?.logo?.url || '/images/merc-logo.png'
  const fraternityName = settings?.fraternityName || 'K.Ö.H.V. Mercuria'

  // Memoize NavContent to prevent recreation on every scroll
  const NavContent = useMemo(() => {
    const Component = ({ isFloating = false }: { isFloating?: boolean }) => (
      <>
        <Link
          href="/"
          className="flex items-center gap-3 text-base font-semibold text-foreground transition hover:opacity-80"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt={`${fraternityName} Logo`}
            width={32}
            height={32}
            className="size-8"
            key={`logo-${isFloating ? 'floating' : 'static'}`}
          />
          <span className="hidden sm:inline">{fraternityName}</span>
        </Link>

        <div className="flex items-center gap-6">
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_ITEMS.filter((item) => item.href !== '/').map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-base font-medium transition-colors hover:text-foreground ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {item.title}
                </Link>
              )
            })}
          </nav>

          {user && (
            <>
              <div className="hidden h-6 w-px bg-border md:block" />
              <UserAvatar user={user} />
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-muted md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </>
    )
    return Component
  }, [logoSrc, fraternityName, pathname, user, isMobileMenuOpen])

  return (
    <>
      {/* Backdrop Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Static Navigation (always visible, scrolls with content) */}
      <header className="absolute top-0 z-50 w-full">
        <div className="container mx-auto px-6 pt-6">
          <div className="flex h-16 items-center justify-between">
            <NavContent isFloating={false} />
          </div>

          {/* Mobile Menu Dropdown for Static Nav */}
          <AnimatePresence>
            {isMobileMenuOpen && !isScrolled && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="relative z-50 mt-2 overflow-hidden rounded-4xl border border-border/50 bg-background/95 backdrop-blur-md md:hidden"
              >
                <nav className="flex flex-col px-2 py-4">
                  {NAV_ITEMS.filter((item) => item.href !== '/').map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-2xl px-4 py-3 text-lg font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Floating Navigation (shows on scroll up) */}
      <AnimatePresence>
        {showFloating && (
          <motion.header
            className="fixed top-0 z-50 w-full"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Extended gradient overlay */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/40 to-background/0" />

            <div className="container relative mx-auto px-6 pt-6">
              <div className="flex h-16 items-center justify-between rounded-full border border-border/50 bg-background/95 px-6 backdrop-blur-md">
                <NavContent isFloating={true} />
              </div>

              {/* Mobile Menu Dropdown for Floating Nav */}
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="mt-2 overflow-hidden rounded-4xl border border-border/50 bg-background/95 backdrop-blur-md md:hidden"
                  >
                    <nav className="flex flex-col px-2 py-4">
                      {NAV_ITEMS.filter((item) => item.href !== '/').map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="rounded-2xl px-4 py-3 text-lg font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.header>
        )}
      </AnimatePresence>
    </>
  )
}
