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
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="inline-flex size-2 rounded-full bg-green-500 ring-4 ring-green-500/20" />
            Aktive Sitzung
          </CardTitle>
          <Badge variant="default" className="px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            Aktiv
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-background/60 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Gestartet</p>
            <p className="mt-1 text-base font-semibold text-foreground">{formattedTime} Uhr</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-background/60 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Umsatz heute</p>
            <p className="mt-1 text-base font-semibold text-green-600">{revenue}</p>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-border/60 bg-background/40 p-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Schankwarte</p>
          <p className="text-sm font-medium text-foreground">{bartenderNames}</p>
        </div>

        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          {isBartender && (
            <Button asChild className="flex-1 rounded-full">
              <Link href="/prices">Zur Bestellung</Link>
            </Button>
          )}
          {isAdmin && (
            <Button asChild variant="outline" className="flex-1 rounded-full border-border/80">
              <Link href="/session">Sitzung verwalten</Link>
            </Button>
          )}
          {!isBartender && !isAdmin && (
            <Button variant="outline" className="flex-1 rounded-full border-border/80" disabled>
              Schankwart werden
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
