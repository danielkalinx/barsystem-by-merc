import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Bestellung',
    plural: 'Bestellungen',
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['session', 'member', 'bartender', 'totalAmount', 'createdAt'],
  },
  fields: [
    {
      name: 'session',
      type: 'relationship',
      relationTo: 'sessions',
      required: true,
      label: 'Sitzung',
    },
    {
      name: 'member',
      type: 'relationship',
      relationTo: 'members',
      required: true,
      label: 'Mitglied (Wird belastet)',
    },
    {
      name: 'bartender',
      type: 'relationship',
      relationTo: 'members',
      required: true,
      label: 'Schenk (Hat bestellt)',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Bestellpositionen',
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          label: 'Produkt',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
          label: 'Anzahl',
        },
        {
          name: 'priceAtOrder',
          type: 'number',
          required: true,
          label: 'Preis zum Bestellzeitpunkt',
          admin: {
            description: 'Historische Preisführung - speichert Produktpreis zum Bestellzeitpunkt',
          },
        },
      ],
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      label: 'Gesamtbetrag',
      admin: {
        description: 'Berechnet aus Positionen (Anzahl × Preis zum Bestellzeitpunkt)',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Ausstehend', value: 'pending' },
        { label: 'Abgeschlossen', value: 'completed' },
        { label: 'Storniert', value: 'cancelled' },
      ],
      defaultValue: 'completed',
    },
  ],
  timestamps: true,
}
