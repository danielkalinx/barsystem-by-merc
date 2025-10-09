'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Beer, Users, ListOrdered } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

export function MainNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: 'Preisliste',
      href: '/prices',
      icon: ListOrdered,
      description: 'Getränke & Toast bestellen',
    },
    {
      title: 'Sitzung',
      href: '/session',
      icon: Beer,
      description: 'Aktuelle & vergangene Sitzungen',
    },
    {
      title: 'Mitglieder',
      href: '/members',
      icon: Users,
      description: 'Zechen & Profile',
    },
  ]

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink asChild active={isActive}>
                <Link
                  href={item.href}
                  className={`${navigationMenuTriggerStyle()} h-10 rounded-full px-4 text-base font-medium transition data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-muted`}
                >
                  <Icon className="mr-2 size-4" />
                  {item.title}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
