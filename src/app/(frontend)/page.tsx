import { getCurrentUser } from './actions'
import SignIn from '@/components/SignIn'
import { Dashboard } from '@/components/Dashboard'

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const user = await getCurrentUser()

  if (!user) {
    return <SignIn />
  }

  return <Dashboard />
}
