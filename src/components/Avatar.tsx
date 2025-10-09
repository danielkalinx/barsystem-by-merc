'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import type { Member } from '@/payload-types'

const Avatar: React.FC = () => {
  const [user, setUser] = useState<Member | null>(null)

  useEffect(() => {
    fetch('/api/members/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setUser(data)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch user:', err)
      })
  }, [])

  if (!user) return null

  const profilePicture = user.profilePicture

  if (profilePicture && typeof profilePicture === 'object' && 'url' in profilePicture) {
    return (
      <Image
        src={profilePicture.url || ''}
        alt={`${user.couleurname || 'User'} avatar`}
        width={32}
        height={32}
        className="size-8 rounded-full border-2 border-border object-cover"
      />
    )
  }

  // Fallback to initials
  const initials = user.couleurname
    ? user.couleurname.substring(0, 2).toUpperCase()
    : (user.firstName?.[0] || '') + (user.lastName?.[0] || '')

  return (
    <div className="flex size-8 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground">
      {initials}
    </div>
  )
}

export { Avatar }
