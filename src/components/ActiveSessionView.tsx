'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { closeSession } from '@/app/(frontend)/actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Member, Session } from '@/payload-types'

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
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
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
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-border/60 bg-background/50 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Gestartet</p>
              <p className="mt-2 text-sm font-semibold">{formattedStartTime}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/50 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Dauer</p>
              <p className="mt-2 text-sm font-semibold">{durationText}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/50 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Umsatz</p>
              <p className="mt-2 text-sm font-semibold text-green-600">{revenue}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/50 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Bestellungen</p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {typeof session.statistics === 'object' && session.statistics?.totalProductsSold
                  ? session.statistics.totalProductsSold
                  : 0}
              </p>
            </div>
          </div>

          <Separator className="bg-border/60" />

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Schankwarte</p>
            <div className="flex flex-wrap gap-3">
              {session.bartenders?.map((b, idx) => {
                const member = typeof b.member === 'object' ? b.member : null
                const rank = member && typeof member.rank === 'object' ? member.rank : null
                const colors = rank?.colors || []

                return (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="flex items-center gap-2 rounded-full border-border/60 bg-background/60 px-3 py-1.5"
                  >
                    {colors.length === 3 && (
                      <div className="flex h-3 w-6 overflow-hidden rounded-full border border-border/60">
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
            <div className="border-t border-dashed border-border/60 pt-4">
              <Button
                variant="destructive"
                onClick={handleCloseSession}
                disabled={isClosing}
                className="w-full rounded-full md:w-auto"
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
    </motion.div>
  )
}
