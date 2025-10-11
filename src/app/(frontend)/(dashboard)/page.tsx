import { Dashboard } from '@/components/Dashboard'

export const revalidate = 10 // Revalidate every 10 seconds instead of on every request

export default async function LandingPage() {
  return <Dashboard />
}
