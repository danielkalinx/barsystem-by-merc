import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    admin: ({ req: { user } }) => user?.role === 'admin',
    create: ({ req: { user } }) => user?.role === 'admin',
    read: () => true, // All authenticated users can read products
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  labels: {
    singular: 'Produkt',
    plural: 'Produkte',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'available', 'popular'],
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
    {
      name: 'popular',
      type: 'checkbox',
      label: 'Beliebt / Häufig bestellt',
      defaultValue: false,
      admin: {
        description: 'Markiert beliebte oder häufig bestellte Produkte',
      },
    },
  ],
}
