'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { MainNav } from '@/components/MainNav'

export function Navbar() {
  return (
    <motion.header
      className="border-border/60 sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/40"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="container py-3">
        <div className="flex h-14 items-center justify-between rounded-full border border-border/70 bg-muted/30 px-4 backdrop-blur">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          >
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
              M
            </span>
            <span>K.Ö.H.V. Mercuria</span>
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
