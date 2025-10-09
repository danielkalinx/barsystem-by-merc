import { redirect } from 'next/navigation'
import { getActiveSession, getCurrentUser } from '@/app/(frontend)/actions'
import { ActiveSessionView } from '@/components/ActiveSessionView'
import { SessionHistory } from '@/components/SessionHistory'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Member } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function SessionPage() {
  const user = await getCurrentUser()
  const activeSession = await getActiveSession()

  if (!user) {
    redirect('/')
  }

  return (
    <div className="container mx-auto px-6 pt-32 space-y-8">
      <Card>
        <CardContent className="space-y-2">
          <h1 className="text-3xl font-semibold">Sitzungen</h1>
          <p className="text-sm text-muted-foreground">
            Verwalte aktive und vergangene Sitzungen
          </p>
        </CardContent>
      </Card>

      {activeSession ? (
        <ActiveSessionView session={activeSession} currentUser={user as Member} />
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
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Es läuft derzeit keine Bar-Sitzung.
            </p>
          </CardContent>
        </Card>
      )}

      <SessionHistory currentUser={user as Member} />
    </div>
  )
}
