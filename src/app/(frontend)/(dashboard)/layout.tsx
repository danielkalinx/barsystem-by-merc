import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/AppSidebar'
import { DashboardNavbar } from '@/components/DashboardNavbar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { SidebarMobile } from '@/components/SidebarMobile'
import { getCurrentUser } from '../actions'

export const dynamic = 'force-dynamic' // Layout uses cookies for authentication

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <>
      <DashboardNavbar />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="pt-22 lg:pt-24">
          <SidebarMobile />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
