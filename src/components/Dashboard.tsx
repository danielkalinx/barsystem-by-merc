import { getCurrentUser, getActiveSession, getAllMembers } from '@/app/(frontend)/actions'
import { SessionCard } from '@/components/SessionCard'
import { CreateSessionDialog } from '@/components/CreateSessionDialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Member } from '@/payload-types'

export async function Dashboard() {
  const user = await getCurrentUser()
  const activeSession = await getActiveSession()
  const members = await getAllMembers()

  if (!user) {
    return null
  }

  const tabBalance = typeof user.tabBalance === 'number' ? user.tabBalance : 0
  const balanceFormatted = `€${Math.abs(tabBalance).toFixed(2)}`
  const balanceColor = tabBalance <= 0 ? 'text-green-600' : 'text-red-600'

  const rank = typeof user.rank === 'object' ? user.rank : null
  const colors = rank?.colors || []

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <Card className="p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              {colors.length === 3 && (
                <div className="flex h-10 w-24 overflow-hidden rounded-full border border-border/60">
                  {colors.map((colorObj, idx) => (
                    <div
                      key={idx}
                      className="flex-1"
                      style={{
                        backgroundColor: typeof colorObj === 'object' ? colorObj.color : colorObj,
                      }}
                    />
                  ))}
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Willkommen zurück
                </p>
                <h1 className="text-3xl font-semibold">
                  {user.couleurname || `${user.firstName} ${user.lastName}`}
                </h1>
                {rank && <p className="text-sm text-muted-foreground">{rank.label}</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/80 px-5 py-4 text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Kontostand
              </p>
              <p className={`text-3xl font-semibold ${balanceColor}`}>
                {tabBalance > 0 ? '-' : ''}
                {balanceFormatted}
              </p>
            </div>
          </div>
        </Card>

        <section className="space-y-4">
          {activeSession ? (
            <SessionCard session={activeSession} currentUser={user as Member} />
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="size-2 rounded-full bg-muted" />
                    Keine aktive Sitzung
                  </CardTitle>
                  <Badge variant="secondary">Inaktiv</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Es läuft derzeit keine Bar-Sitzung. Warte auf einen Admin, um eine Sitzung zu
                  eröffnen.
                </p>

                {user.role === 'admin' && (
                  <div className="pt-2">
                    <CreateSessionDialog members={members as Member[]} />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </section>
      </div>

      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Deine Statistiken</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="rounded-xl border border-border/50 bg-background/60 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Letzter Konsum
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">Noch keine Daten</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/60 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Lieblings-Getränk
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">Noch keine Daten</p>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}
