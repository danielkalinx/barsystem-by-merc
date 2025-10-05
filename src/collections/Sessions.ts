import type { CollectionConfig } from 'payload'

export const Sessions: CollectionConfig = {
  slug: 'sessions',
  access: {
    admin: ({ req: { user } }) => user?.role === 'admin',
    create: ({ req: { user } }) => user?.role === 'admin',
    read: () => true, // All authenticated users can read sessions
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  labels: {
    singular: 'Sitzung',
    plural: 'Sitzungen',
  },
  admin: {
    useAsTitle: 'sessionName',
    defaultColumns: ['sessionName', 'status', 'startTime', 'totalRevenue'],
  },
  fields: [
    {
      name: 'sessionName',
      type: 'text',
      label: 'Sitzungsname/Nummer',
      admin: {
        description: 'Automatisch generiert oder manuell eingegeben',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      options: [
        { label: 'Aktiv', value: 'active' },
        { label: 'Geschlossen', value: 'closed' },
      ],
      defaultValue: 'closed',
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'members',
      required: true,
      label: 'Erstellt von (Admin)',
    },
    {
      name: 'startTime',
      type: 'date',
      label: 'Startzeit',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endTime',
      type: 'date',
      label: 'Endzeit',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Null wenn Sitzung aktiv ist',
      },
    },
    {
      name: 'bartenders',
      type: 'array',
      label: 'Schenken',
      minRows: 1,
      admin: {
        description: 'Müssen VOR der Sitzungsaktivierung definiert werden',
      },
      fields: [
        {
          name: 'member',
          type: 'relationship',
          relationTo: 'members',
          required: true,
          label: 'Mitglied',
        },
        {
          name: 'estimatedStartTime',
          type: 'date',
          label: 'Geschätzte Startzeit',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'estimatedEndTime',
          type: 'date',
          label: 'Geschätzte Endzeit',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'bartenderStatus',
          type: 'select',
          label: 'Schenk-Status',
          options: [
            { label: 'Aktiv', value: 'active' },
            { label: 'Ausstehend', value: 'pending' },
            { label: 'Genehmigt', value: 'approved' },
          ],
          defaultValue: 'active',
        },
      ],
    },
    {
      name: 'totalRevenue',
      type: 'number',
      label: 'Gesamtumsatz',
      defaultValue: 0,
      admin: {
        description: 'Wird automatisch aus Bestellungen berechnet',
      },
    },
    {
      name: 'statistics',
      type: 'group',
      label: 'Statistiken',
      fields: [
        {
          name: 'totalProductsSold',
          type: 'number',
          label: 'Gesamtanzahl verkaufter Produkte',
          defaultValue: 0,
        },
        {
          name: 'mostPopularProduct',
          type: 'text',
          label: 'Beliebtestes Produkt',
        },
      ],
    },
  ],
}
