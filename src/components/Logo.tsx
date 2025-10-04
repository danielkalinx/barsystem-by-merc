'use client'
import React from 'react'
import Image from 'next/image'

export const Logo = () => {
  return (
    <div className="flex items-center">
      <Image
        src="/merc-icon.png"
        alt="Mercuria Logo"
        width={32}
        height={32}
        className="object-contain"
      />
    </div>
  )
}
