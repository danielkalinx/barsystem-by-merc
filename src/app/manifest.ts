import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Merc Barsystem',
    short_name: 'Merc Bar',
    description: 'Bar-Verwaltungssystem für K.Ö.H.V. Mercuria',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#E10909',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  }
}
