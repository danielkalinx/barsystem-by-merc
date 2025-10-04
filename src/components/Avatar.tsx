'use client'

import React from 'react'
import { useAuth } from '@payloadcms/ui'
import type { Member } from '@/payload-types'

const Avatar: React.FC = () => {
  const { user } = useAuth<Member>()

  if (!user) return null

  const profilePicture = user.profilePicture

  if (profilePicture && typeof profilePicture === 'object' && 'url' in profilePicture) {
    return (
      <img
        src={profilePicture.url || ''}
        alt={`${user.couleurname || 'User'} avatar`}
        style={{
          width: '32px',
          height: '32px',
          objectFit: 'cover',
          borderRadius: '50%',
          border: '2px solid var(--theme-elevation-100)',
        }}
      />
    )
  }

  // Fallback to initials
  const initials = user.couleurname
    ? user.couleurname.substring(0, 2).toUpperCase()
    : (user.firstName?.[0] || '') + (user.lastName?.[0] || '')

  return (
    <div
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#333',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '12px',
        border: '1px solid var(--theme-elevation-100)',
      }}
    >
      {initials}
    </div>
  )
}

export { Avatar }
