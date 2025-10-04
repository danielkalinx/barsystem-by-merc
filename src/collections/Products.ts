import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Produkt',
    plural: 'Produkte',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'available'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      label: 'Preis',
      admin: {
        description: 'Preis in EUR',
      },
    },
    {
      name: 'category',
      type: 'text',
      label: 'Kategorie',
      admin: {
        description: 'z.B. Getränke, Toast, Zigarren, Snus, etc.',
      },
    },
    {
      name: 'available',
      type: 'checkbox',
      label: 'Verfügbar zum Bestellen',
      defaultValue: true,
    },
  ],
}
