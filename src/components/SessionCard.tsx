import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Session, Member } from '@/payload-types'

interface SessionCardProps {
  session: Session
  currentUser: Member
}

export function SessionCard({ session, currentUser }: SessionCardProps) {
  const isAdmin = currentUser.role === 'admin'
  const isBartender = session.bartenders?.some(
    (b) => typeof b.member === 'object' && b.member.id === currentUser.id,
  )

  const startTime = session.startTime ? new Date(session.startTime) : null
  const formattedTime = startTime
    ? startTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    : '-'

  const bartenderNames =
    session.bartenders
      ?.map((b) => {
        const member = typeof b.member === 'object' ? b.member : null
        return member?.couleurname || member?.firstName || 'Unbekannt'
      })
      .join(', ') || 'Keine'

  const revenue =
    typeof session.totalRevenue === 'number'
      ? `€${session.totalRevenue.toFixed(2)}`
      : '€0,00'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            Aktive Sitzung
          </CardTitle>
          <Badge variant="default">Aktiv</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Gestartet</p>
            <p className="font-medium">{formattedTime} Uhr</p>
          </div>
          <div>
            <p className="text-muted-foreground">Umsatz heute</p>
            <p className="font-medium">{revenue}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">Schankwarte</p>
          <p className="text-sm font-medium">{bartenderNames}</p>
        </div>

        <div className="flex gap-2 pt-2">
          {isBartender && (
            <Button asChild className="flex-1">
              <Link href="/prices">Zur Bestellung</Link>
            </Button>
          )}
          {isAdmin && (
            <Button asChild variant="outline">
              <Link href="/session">Sitzung verwalten</Link>
            </Button>
          )}
          {!isBartender && !isAdmin && (
            <Button variant="outline" className="flex-1" disabled>
              Schankwart werden
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
