import { Navbar } from '@/components/Navbar'

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 lg:pt-10">{children}</main>
    </>
  )
}
