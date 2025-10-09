import { getPayload } from 'payload'
import config from '@payload-config'

// Helper to convert hex to OKLCH (approximation)
function hexToOklch(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '')

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  // Simple approximation - for production, use a proper color conversion library
  // This is a rough conversion that works for most red colors
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  const chroma = Math.sqrt(Math.pow(r - g, 2) + Math.pow(g - b, 2) + Math.pow(b - r, 2)) * 0.3
  const hue = Math.atan2(b - g, r - g) * 180 / Math.PI

  return `oklch(${luminance.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(3)})`
}

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const settings = await payload.findGlobal({
      slug: 'settings',
    })

    const primaryColor = settings?.primaryColor || '#D00507'
    const primaryColorDark = settings?.primaryColorDark || primaryColor

    // Convert hex to OKLCH format
    const primaryOklch = hexToOklch(primaryColor)
    const primaryOklchDark = hexToOklch(primaryColorDark)

    // Generate CSS with custom properties that override all primary-related variables
    const css = `
:root {
  --primary: ${primaryOklch};
  --sidebar-primary: ${primaryOklch};
  --ring: ${primaryOklch};
  --accent-foreground: ${primaryOklch};
  --sidebar-ring: ${primaryOklch};
  --sidebar-accent-foreground: ${primaryOklch};
}

.dark {
  --primary: ${primaryOklchDark};
  --sidebar-primary: ${primaryOklchDark};
  --ring: ${primaryOklchDark};
  --sidebar-ring: ${primaryOklchDark};
  --sidebar-accent-foreground: ${primaryOklchDark};
}
    `.trim()

    return new Response(css, {
      headers: {
        'Content-Type': 'text/css',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Failed to generate theme CSS:', error)
    return new Response('', {
      headers: {
        'Content-Type': 'text/css',
      },
    })
  }
}
