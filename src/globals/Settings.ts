import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Einstellungen',
  admin: {
    description: 'Allgemeine Einstellungen für die Verbindung',
  },
  access: {
    read: () => true, // Public read access for displaying fraternity info
    update: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'fraternityName',
      label: 'Verbindungsname',
      type: 'text',
      required: true,
      defaultValue: 'K.Ö.H.V. Mercuria',
    },
    {
      name: 'fraternityShortName',
      label: 'Kurzname',
      type: 'text',
      defaultValue: 'Mercuria',
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'primaryColor',
      label: 'Primärfarbe (Hell-Modus)',
      type: 'text',
      defaultValue: '#D00507',
      admin: {
        description:
          'Hex-Farbcode für die Primärfarbe im hellen Modus. Standard: #D00507. Diese Farbe wird automatisch als CSS-Variable gesetzt.',
      },
      validate: (value: string) => {
        if (!value) return true
        const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
        if (!hexPattern.test(value)) {
          return 'Bitte geben Sie einen gültigen Hex-Farbcode ein (z.B. #D00507)'
        }
        return true
      },
    },
    {
      name: 'primaryColorDark',
      label: 'Primärfarbe (Dunkel-Modus)',
      type: 'text',
      defaultValue: '#CC3335',
      admin: {
        description:
          'Hex-Farbcode für die Primärfarbe im dunklen Modus. Standard: #CC3335. Optional - falls nicht gesetzt, wird die Hell-Modus-Farbe (#D00507) verwendet.',
      },
      validate: (value: string) => {
        if (!value) return true
        const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
        if (!hexPattern.test(value)) {
          return 'Bitte geben Sie einen gültigen Hex-Farbcode ein (z.B. #CC3335)'
        }
        return true
      },
    },
    {
      name: 'contactEmail',
      label: 'Allgemeine Kontakt E-Mail',
      type: 'email',
      defaultValue: 'kontakt@mercuria.at',
      admin: {
        description: 'Allgemeine Kontakt-E-Mail-Adresse für Anfragen',
      },
    },
    {
      name: 'bartenderEmail',
      label: 'Barkeeper Kontakt E-Mail',
      type: 'email',
      admin: {
        description: 'E-Mail-Adresse für Barkeeper-bezogene Anfragen und Koordination',
      },
    },
    {
      name: 'websiteUrl',
      label: 'Website URL',
      type: 'text',
    },
    {
      name: 'address',
      label: 'Adresse',
      type: 'textarea',
    },
  ],
}
