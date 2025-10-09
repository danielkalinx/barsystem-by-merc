'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { MainNav } from '@/components/MainNav'
import { useEffect, useState } from 'react'

interface Settings {
  fraternityName: string
  logo?: {
    url: string
    alt?: string
  }
}

export function Navbar() {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    fetch('/api/globals/settings')
      .then((res) => res.json())
      .then((data) => {
        setSettings(data)
      })
      .catch((err) => console.error('Failed to fetch settings:', err))
  }, [])

  const logoSrc = settings?.logo?.url || '/images/merc-logo.png'
  const fraternityName = settings?.fraternityName || 'K.Ö.H.V. Mercuria'

  return (
    <motion.header
      className="fixed top-0 z-50 w-full"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="container mx-auto py-3">
        <div className="flex h-16 items-center justify-between rounded-full border border-border/20 bg-background/95 px-6 backdrop-blur-md">
          <Link
            href="/"
            className="flex items-center gap-3 text-base font-semibold text-foreground transition hover:opacity-80"
          >
            <Image
              src={logoSrc}
              alt={`${fraternityName} Logo`}
              width={32}
              height={32}
              className="size-8"
            />
            <span>{fraternityName}</span>
          </Link>
          <div className="flex items-center gap-4">
            <MainNav />
            <nav className="hidden items-center gap-2 sm:flex">
              {/* Platz für User-Menu, Logout, etc. */}
            </nav>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
