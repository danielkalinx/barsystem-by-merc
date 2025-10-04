'use client'
import React from 'react'
import Image from 'next/image'

export const Icon = () => {
  return (
    <div className="flex items-center">
      <Image
        src="/merc-icon.png"
        alt="Mercuria Icon"
        width={24}
        height={24}
        className="object-contain"
      />
    </div>
  )
}
