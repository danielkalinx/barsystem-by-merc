import type { CollectionConfig } from 'payload'

export const Members: CollectionConfig = {
  slug: 'members',
  auth: true, // Enable authentication for this collection
  labels: {
    singular: 'Mitglied',
    plural: 'Mitglieder',
  },
  admin: {
    useAsTitle: 'couleurname',
    defaultColumns: ['couleurname', 'firstName', 'lastName', 'role', 'rank', 'tabBalance'],
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      label: 'Rolle',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Mitglied', value: 'member' },
      ],
      defaultValue: 'member',
      admin: {
        description: 'Systemrolle für Berechtigungen. Bartender wird über Sitzungen zugewiesen.',
      },
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: 'Vorname',
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      label: 'Nachname',
    },
    {
      name: 'couleurname',
      type: 'text',
      required: true,
      label: 'Couleurname',
    },
    {
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media',
      label: 'Profilbild',
      required: false,
      admin: {
        description: 'Optional: Profilbild hochladen',
        condition: (data, siblingData, { user }) => !!user, // Only show when user is logged in (hide during first-user creation)
      },
    },
    {
      name: 'rank',
      type: 'relationship',
      relationTo: 'ranks',
      required: false,
      label: 'Rang',
      admin: {
        description: 'Rang des Mitglieds - bitte aus Ränge-Sammlung auswählen',
      },
    },
    {
      name: 'tabBalance',
      type: 'number',
      label: 'Zeche (Aktueller Schuldenstand)',
      defaultValue: 0,
      admin: {
        description: 'Wird automatisch bei Bestellungen und Zahlungen aktualisiert',
      },
    },
  ],
}
