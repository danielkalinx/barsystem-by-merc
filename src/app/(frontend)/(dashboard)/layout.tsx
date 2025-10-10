import { AppSidebar } from '@/components/AppSidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { SidebarMobile } from '@/components/SidebarMobile'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarMobile />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
