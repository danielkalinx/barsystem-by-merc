import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/AppSidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { SidebarMobile } from '@/components/SidebarMobile'
import { getCurrentUser } from '../actions'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="pt-32 lg:pt-10">
        <SidebarMobile />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
