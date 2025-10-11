import { getPayload } from 'payload'
import config from '@payload-config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Member } from '@/payload-types'

interface SessionHistoryProps {
  currentUser: Member
}

export async function SessionHistory({ currentUser: _currentUser }: SessionHistoryProps) {
  const payload = await getPayload({ config })

  const sessions = await payload.find({
    collection: 'sessions',
    where: {
      status: {
        equals: 'closed',
      },
    },
    limit: 10,
    sort: '-createdAt',
    depth: 2,
  })

  if (sessions.docs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vergangene Sitzungen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Noch keine geschlossenen Sitzungen.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vergangene Sitzungen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.docs.map((session) => {
            const startTime = session.startTime ? new Date(session.startTime) : null
            const endTime = session.endTime ? new Date(session.endTime) : null

            const formattedStartTime = startTime
              ? startTime.toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : '-'

            const duration =
              startTime && endTime
                ? Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60))
                : 0

            const revenue =
              typeof session.totalRevenue === 'number'
                ? `€${session.totalRevenue.toFixed(2)}`
                : '€0,00'

            const bartenderCount = session.bartenders?.length || 0

            return (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-2xl border border-transparent bg-background/40 p-4 transition hover:border-border/50 hover:bg-background/70"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {session.sessionName || `Sitzung ${session.id}`}
                    </p>
                    <Badge variant="secondary">Geschlossen</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{formattedStartTime}</span>
                    <span>•</span>
                    <span>{duration}h Dauer</span>
                    <span>•</span>
                    <span>{bartenderCount} Schankwarte</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{revenue}</p>
                  <p className="text-sm text-muted-foreground">Umsatz</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
