import './styles.css'

export const metadata = {
  title: 'Bar Management System',
  description: 'K.Ö.H.V. Mercuria Bar Management',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head></head>
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  )
}
