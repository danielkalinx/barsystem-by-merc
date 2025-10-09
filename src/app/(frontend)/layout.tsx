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
      <body className="text-foreground antialiased">
        <Navbar />
        <main className="mx-auto">{children}</main>
      </body>
    </html>
  )
}
