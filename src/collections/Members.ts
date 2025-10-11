import type { CollectionConfig } from 'payload'

export const Members: CollectionConfig = {
  slug: 'members',
  auth: true, // Enable authentication for this collection
  access: {
    admin: ({ req: { user } }) => !!user, // All authenticated users can access their own profile
    create: ({ req: { user } }) => user?.role === 'admin', // Only admins can create members
    read: () => true, // All can read member data
    update: ({ req: { user } }) => {
      // Admins can update anyone, members can only update themselves
      if (user?.role === 'admin') return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    delete: ({ req: { user } }) => user?.role === 'admin', // Only admins can delete
  },
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
      access: {
        update: ({ req: { user } }) => user?.role === 'admin', // Only admins can change roles
      },
      admin: {
        description: 'Systemrolle für Berechtigungen. Bartender wird über Sitzungen zugewiesen.',
      },
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: 'Vorname',
      access: {
        update: ({ req: { user } }) => user?.role === 'admin', // Only admins can update
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      label: 'Nachname',
      access: {
        update: ({ req: { user } }) => user?.role === 'admin', // Only admins can update
      },
    },
    {
      name: 'couleurname',
      type: 'text',
      required: true,
      label: 'Couleurname',
      access: {
        update: ({ req: { user } }) => user?.role === 'admin', // Only admins can update
      },
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
      required: true,
      label: 'Rang',
      access: {
        update: ({ req: { user } }) => user?.role === 'admin', // Only admins can change rank
      },
      admin: {
        description: 'Rang des Mitglieds - bitte aus Ränge-Sammlung auswählen',
      },
    },
    {
      name: 'tabBalance',
      type: 'number',
      label: 'Zeche (Aktueller Schuldenstand)',
      defaultValue: 0,
      access: {
        update: ({ req: { user } }) => user?.role === 'admin', // Only admins can modify balance
      },
      admin: {
        description: 'Wird automatisch bei Bestellungen und Zahlungen aktualisiert',
      },
    },
  ],
}
