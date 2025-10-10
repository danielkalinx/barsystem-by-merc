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
  const balanceColor = tabBalance <= 0 ? 'text-primary' : 'text-destructive'

  const rank = typeof user.rank === 'object' ? user.rank : null

  return (
    <div className="container mx-auto px-6 pb-10">
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
            <Card>
              <CardContent className="space-y-8">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-4">
                    <CardTitle>Willkommen zurück</CardTitle>
                    <div>
                      <h1 className="text-4xl font-semibold sm:text-5xl">
                        {user.couleurname || `${user.firstName} ${user.lastName}`}
                      </h1>
                      {rank && (
                        <Badge variant="secondary" className="mt-4">
                          {rank.label}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl border bg-card p-6 text-right">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Kontostand
                    </p>
                    <p className={`mt-3 text-4xl font-semibold ${balanceColor}`}>
                      {tabBalance > 0 ? '-' : ''}
                      {balanceFormatted}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">Aktualisiert in Echtzeit</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border bg-card p-5">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Status
                    </p>
                    <p className="mt-2 text-base font-medium">
                      {user.role === 'admin' ? 'Admin' : 'Mitglied'}
                    </p>
                  </div>
                  <div className="rounded-2xl border bg-card p-5">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Mitglied seit
                    </p>
                    <p className="mt-2 text-base font-medium">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('de-DE') : '—'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-5">
              {activeSession ? (
                <SessionCard session={activeSession} currentUser={user as Member} />
              ) : (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Keine aktive Sitzung</CardTitle>
                      <Badge variant="secondary">Inaktiv</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <p className="text-sm text-muted-foreground">
                      Es läuft derzeit keine Bar-Sitzung. Warte auf einen Admin, um eine Sitzung zu
                      eröffnen.
                    </p>

                    {user.role === 'admin' && <CreateSessionDialog members={members as Member[]} />}
                  </CardContent>
                </Card>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Deine Statistiken</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="rounded-2xl border bg-card p-5">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Letzter Konsum
                  </p>
                  <p className="mt-3 text-base font-medium">Noch keine Daten</p>
                </div>
                <div className="rounded-2xl border bg-card p-5">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Lieblings-Getränk
                  </p>
                  <p className="mt-3 text-base font-medium">Noch keine Daten</p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
  )
}
