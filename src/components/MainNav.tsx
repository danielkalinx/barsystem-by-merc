'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MainNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: 'Preisliste',
      href: '/prices',
    },
    {
      title: 'Sitzung',
      href: '/session',
    },
    {
      title: 'Mitglieder',
      href: '/members',
    },
  ]

  return (
    <nav className="flex items-center gap-6">
      {navItems.map((item) => {
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              isActive ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
