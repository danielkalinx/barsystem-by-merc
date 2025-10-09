'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { MainNav } from '@/components/MainNav'
import { UserAvatar } from '@/components/UserAvatar'
import { useEffect, useState } from 'react'
import type { Member } from '@/payload-types'

interface Settings {
  fraternityName: string
  logo?: {
    url: string
    alt?: string
  }
}

export function Navbar() {
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

  return (
    <motion.header
      className="fixed top-0 z-50 w-full"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Extended gradient overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-background/0" />

      <div className="container relative mx-auto px-6 pt-6">
        <div className="flex h-16 items-center justify-between rounded-full border border-border/50 bg-background/95 px-6 backdrop-blur-md">
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
          <div className="flex items-center gap-6">
            <MainNav />
            {user && (
              <>
                <div className="h-6 w-px bg-border" />
                <UserAvatar user={user} />
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
