import { Home, DollarSign, Users, CalendarDays } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    title: 'Preisliste',
    href: '/prices',
    icon: DollarSign,
  },
  {
    title: 'Sitzung',
    href: '/session',
    icon: CalendarDays,
  },
  {
    title: 'Mitglieder',
    href: '/members',
    icon: Users,
  },
]
