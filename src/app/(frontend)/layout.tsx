import './styles.css'
import { Navbar } from '@/components/Navbar'

export const metadata = {
  title: 'Bar Management System',
  description: 'K.Ö.H.V. Mercuria Bar Management',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head></head>
      <body className="bg-gradient-to-br from-background via-background to-muted/20 text-foreground antialiased">
        <Navbar />
        <main className="container py-12 lg:py-16">{children}</main>
      </body>
    </html>
  )
}
