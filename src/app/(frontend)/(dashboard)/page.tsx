import { redirect } from 'next/navigation'
import { getCurrentUser } from '../actions'
import { Dashboard } from '@/components/Dashboard'

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return <Dashboard />
}
