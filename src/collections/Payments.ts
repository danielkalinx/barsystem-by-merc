import type { CollectionConfig } from 'payload'

export const Payments: CollectionConfig = {
  slug: 'payments',
  labels: {
    singular: 'Zahlung',
    plural: 'Zahlungen',
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['member', 'amount', 'type', 'date', 'admin'],
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
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Betrag',
      admin: {
        description: 'Positiv für Zahlungen, negativ für Strafen',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Typ',
      options: [
        { label: 'Zahlung', value: 'payment' },
        { label: 'Strafe', value: 'penalty' },
        { label: 'Anpassung', value: 'adjustment' },
      ],
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Datum',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Admin-Notizen',
      admin: {
        description: 'Notizen zu dieser Transaktion',
      },
    },
    {
      name: 'admin',
      type: 'relationship',
      relationTo: 'users',
      label: 'Bearbeitet von (Admin)',
    },
  ],
}
