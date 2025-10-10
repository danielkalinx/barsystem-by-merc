import { redirect } from 'next/navigation'
import { getCurrentUser } from '../../actions'
import SignIn from '@/components/SignIn'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const user = await getCurrentUser()

  // If already logged in, redirect to dashboard
  if (user) {
    redirect('/')
  }

  return <SignIn />
}
