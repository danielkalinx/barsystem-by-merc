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
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 space-y-6">
        {/* User Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {colors.length === 3 && (
              <div className="flex h-8 w-16 border border-border overflow-hidden rounded">
                {colors.map((colorObj, idx) => (
                  <div
                    key={idx}
                    className="flex-1"
                    style={{
                      backgroundColor:
                        typeof colorObj === 'object' ? colorObj.color : colorObj,
                    }}
                  />
                ))}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">
                {user.couleurname || `${user.firstName} ${user.lastName}`}
              </h1>
              {rank && <p className="text-sm text-muted-foreground">{rank.label}</p>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Kontostand</p>
            <p className={`text-2xl font-bold ${balanceColor}`}>
              {tabBalance > 0 ? '-' : ''}
              {balanceFormatted}
            </p>
          </div>
        </div>

        {/* Active Session or Create Session */}
        {activeSession ? (
          <SessionCard session={activeSession} currentUser={user as Member} />
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-muted" />
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

        {/* User Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Deine Statistiken</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Letzter Konsum</span>
              <span className="font-medium">Noch keine Daten</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Lieblings-Getränk</span>
              <span className="font-medium">Noch keine Daten</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
