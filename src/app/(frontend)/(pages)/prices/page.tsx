import { redirect } from 'next/navigation'
import {
  getActiveSession,
  getAllMembers,
  getAvailableProducts,
  getCurrentUser,
} from '@/app/(frontend)/actions'
import { Card, CardContent } from '@/components/ui/card'
import { PriceList } from '@/components/PriceList'
import type { Member, Product, Session } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function PricesPage() {
  const [user, session, products, members] = await Promise.all([
    getCurrentUser(),
    getActiveSession(),
    getAvailableProducts(),
    getAllMembers(),
  ])

  if (!user) {
    redirect('/')
  }

  const typedUser = user as Member
  const typedSession = session as Session | null
  const typedMembers = (members as Member[]) || []
  const typedProducts = (products as Product[]) || []

  const isAdmin = typedUser.role === 'admin'
  const isBartender =
    typedSession?.bartenders?.some((bartender) => {
      const member = bartender.member
      const bartenderId =
        typeof member === 'string'
          ? member
          : typeof member === 'object'
            ? member.id
            : null
      return bartenderId === typedUser.id
    }) ?? false

  const canOrder = Boolean(typedSession && (isAdmin || isBartender))

  return (
    <div className="container mx-auto px-6 pb-10 pt-32 lg:pt-10 space-y-8">
      <Card>
        <CardContent className="space-y-2">
          <h1 className="text-3xl font-semibold">Preisliste</h1>
          <p className="text-sm text-muted-foreground">
            Übersicht über alle verfügbaren Produkte. Bestellungen sind nur während einer aktiven
            Sitzung für Schenken oder Admins möglich.
          </p>
        </CardContent>
      </Card>
      <PriceList
        session={typedSession}
        products={typedProducts}
        members={typedMembers}
        canOrder={canOrder}
      />
    </div>
  )
}
