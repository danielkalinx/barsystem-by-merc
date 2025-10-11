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
  const hasProfilePicture =
    profilePicture && typeof profilePicture === 'object' && 'url' in profilePicture

  const initials = user.couleurname
    ? user.couleurname.substring(0, 2).toUpperCase()
    : (user.firstName?.[0] || '') + (user.lastName?.[0] || '')

  const rank = typeof user.rank === 'object' ? user.rank : null
  const colors = rank?.colors || []

  if (hasProfilePicture) {
    return (
      <div className="relative size-8">
        <Image
          src={profilePicture.url || ''}
          alt={`${user.couleurname || 'User'} avatar`}
          width={32}
          height={32}
          className="size-8 rounded-full border border-border object-cover"
        />
        {colors.length === 3 && (
          <div className="absolute bottom-0 left-0 right-0 flex h-1 overflow-hidden rounded-b-full">
            {colors.map((colorObj, idx) => (
              <div
                key={idx}
                className="flex-1"
                style={{
                  backgroundColor: typeof colorObj === 'object' ? colorObj.color : colorObj,
                }}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative size-8">
      <div className="flex size-8 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground">
        {initials}
      </div>
      {colors.length === 3 && (
        <div className="absolute bottom-0 left-0 right-0 flex h-1 overflow-hidden rounded-b-full">
          {colors.map((colorObj, idx) => (
            <div
              key={idx}
              className="flex-1"
              style={{
                backgroundColor: typeof colorObj === 'object' ? colorObj.color : colorObj,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export { Avatar }
