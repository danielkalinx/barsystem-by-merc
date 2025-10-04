import type { CollectionConfig } from 'payload'

export const Ranks: CollectionConfig = {
  slug: 'ranks',
  access: {
    admin: ({ req: { user } }) => user?.role === 'admin',
    create: ({ req: { user } }) => user?.role === 'admin',
    read: () => true, // All authenticated users can read ranks
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  labels: {
    singular: 'Rang',
    plural: 'Ränge',
  },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'value'],
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      label: 'Rangname',
    },
    {
      name: 'value',
      type: 'text',
      required: true,
      unique: true,
      label: 'Wert (Slug)',
      admin: {
        description: 'Eindeutiger Wert für den Rang (z.B. "fuchs", "bursche")',
      },
    },
    {
      name: 'colors',
      type: 'array',
      label: 'Rangfarben (3 Hex-Werte)',
      minRows: 3,
      maxRows: 3,
      required: true,
      fields: [
        {
          name: 'color',
          type: 'text',
          required: true,
          label: 'Farbe',
          admin: {
            description: 'Hex-Farbwert (z.B. #E10909)',
          },
        },
      ],
    },
  ],
}
