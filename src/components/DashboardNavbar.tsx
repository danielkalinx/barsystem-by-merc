'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { UserAvatar } from '@/components/UserAvatar'
import type { Member } from '@/payload-types'

interface Settings {
  fraternityName: string
  logo?: {
    url: string
    alt?: string
  }
}

export function DashboardNavbar() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [user, setUser] = useState<Member | null>(null)

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 hidden lg:block">
      <div className="flex h-full items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={settings?.logo?.url || '/images/merc-logo.png'}
            alt={`${settings?.fraternityName || 'Logo'}`}
            width={32}
            height={32}
            className="size-8"
          />
          <span className="hidden text-base font-semibold sm:inline">
            {settings?.fraternityName || 'K.Ö.H.V. Mercuria'}
          </span>
        </Link>

        {/* Right side - User avatar */}
        {user && (
          <button className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted">
            <UserAvatar user={user} size="sm" />
            <span className="hidden text-sm font-medium lg:inline">
              {user.couleurname || `${user.firstName} ${user.lastName}`}
            </span>
          </button>
        )}
      </div>
    </header>
  )
}
