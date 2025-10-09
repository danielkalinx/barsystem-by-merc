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
                  className={`${navigationMenuTriggerStyle()} h-10 rounded-full border border-transparent bg-transparent px-4 text-sm font-medium text-muted-foreground transition data-[active=true]:border-border data-[active=true]:bg-primary/10 data-[active=true]:text-foreground hover:border-border hover:bg-muted/60`}
                >
                  <Icon className="mr-2 h-4 w-4" />
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
