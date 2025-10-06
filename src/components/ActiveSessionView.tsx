'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { closeSession } from '@/app/(frontend)/actions'
import type { Session, Member, Order } from '@/payload-types'

interface ActiveSessionViewProps {
  session: Session
  currentUser: Member
}

export function ActiveSessionView({ session, currentUser }: ActiveSessionViewProps) {
  const [isClosing, setIsClosing] = useState(false)
  const isAdmin = currentUser.role === 'admin'

  const startTime = session.startTime ? new Date(session.startTime) : null
  const formattedStartTime = startTime
    ? startTime.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-'

  const duration = startTime
    ? Math.floor((Date.now() - startTime.getTime()) / (1000 * 60))
    : 0
  const durationText =
    duration < 60 ? `${duration} Minuten` : `${Math.floor(duration / 60)} Stunden`

  const revenue =
    typeof session.totalRevenue === 'number'
      ? `€${session.totalRevenue.toFixed(2)}`
      : '€0,00'

  const bartenderNames =
    session.bartenders
      ?.map((b) => {
        const member = typeof b.member === 'object' ? b.member : null
        return member?.couleurname || member?.firstName || 'Unbekannt'
      })
      .join(', ') || 'Keine'

  const handleCloseSession = async () => {
    if (!confirm('Sitzung wirklich schließen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      return
    }

    setIsClosing(true)
    const result = await closeSession(session.id)

    if (result.success) {
      window.location.reload()
    } else {
      alert(result.error || 'Fehler beim Schließen der Sitzung')
      setIsClosing(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Aktive Sitzung
            </CardTitle>
            <Badge variant="default">Aktiv</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Gestartet</p>
              <p className="font-medium">{formattedStartTime}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dauer</p>
              <p className="font-medium">{durationText}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Umsatz</p>
              <p className="font-medium text-green-600">{revenue}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bestellungen</p>
              <p className="font-medium">
                {typeof session.statistics === 'object' && session.statistics?.totalProductsSold
                  ? session.statistics.totalProductsSold
                  : 0}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Schankwarte</p>
            <div className="flex flex-wrap gap-2">
              {session.bartenders?.map((b, idx) => {
                const member = typeof b.member === 'object' ? b.member : null
                const rank = member && typeof member.rank === 'object' ? member.rank : null
                const colors = rank?.colors || []

                return (
                  <Badge key={idx} variant="outline" className="flex items-center gap-2">
                    {colors.length === 3 && (
                      <div className="flex h-3 w-6 border border-border overflow-hidden">
                        {colors.map((colorObj, colorIdx) => (
                          <div
                            key={colorIdx}
                            className="flex-1"
                            style={{
                              backgroundColor:
                                typeof colorObj === 'object' ? colorObj.color : colorObj,
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {member?.couleurname || member?.firstName || 'Unbekannt'}
                  </Badge>
                )
              })}
            </div>
          </div>

          {isAdmin && (
            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                onClick={handleCloseSession}
                disabled={isClosing}
                className="w-full md:w-auto"
              >
                {isClosing ? 'Wird geschlossen...' : 'Sitzung schließen'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Letzte Bestellungen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Bestellungsverlauf wird in Kürze verfügbar sein.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
