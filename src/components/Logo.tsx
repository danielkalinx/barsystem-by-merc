'use client'
import React from 'react'
import Image from 'next/image'

interface LogoProps {
  className?: string
  color?: 'Default'
  size?: number
}

export const Logo = ({ className, color = 'Default', size = 36 }: LogoProps) => {
  return (
    <div className={className} data-color={color}>
      <div className="relative" style={{ width: size, height: size }}>
        <Image
          src="/merc-icon.png"
          alt="Mercuria Logo"
          width={size}
          height={size}
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}
