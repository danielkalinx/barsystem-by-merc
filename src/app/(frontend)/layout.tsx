import type { Metadata, Viewport } from 'next'
import { PWAInstaller } from '@/components/PWAInstaller'
import './styles.css'

export const metadata: Metadata = {
  title: 'Merc Barsystem',
  description: 'Bar-Verwaltungssystem für K.Ö.H.V. Mercuria',
  applicationName: 'Merc Barsystem',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Merc Bar',
  },
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon-192x192.png',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f0f0f0' }, // matches --secondary: oklch(0.940 0.000 0.000)
    { media: '(prefers-color-scheme: dark)', color: '#2d2d2d' }, // matches --secondary: oklch(0.348 0.000 0.000)
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/api/theme" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (isDark) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <PWAInstaller />
        {children}
      </body>
    </html>
  )
}
