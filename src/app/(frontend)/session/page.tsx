import { getCurrentUser, getActiveSession } from '@/app/(frontend)/actions'
import { ActiveSessionView } from '@/components/ActiveSessionView'
import { SessionHistory } from '@/components/SessionHistory'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Member } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function SessionPage() {
  const user = await getCurrentUser()
  const activeSession = await getActiveSession()

  if (!user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Sitzungen</h1>
          <p className="text-muted-foreground">Verwalte aktive und vergangene Sitzungen</p>
        </div>

        {activeSession ? (
          <ActiveSessionView session={activeSession} currentUser={user as Member} />
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
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Es läuft derzeit keine Bar-Sitzung.
              </p>
            </CardContent>
          </Card>
        )}

        <SessionHistory currentUser={user as Member} />
      </div>
    </div>
  )
}
