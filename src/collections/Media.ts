import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Medien',
    plural: 'Medien',
  },
  access: {
    admin: ({ req: { user } }) => !!user, // All authenticated users can access media admin
    create: ({ req: { user } }) => !!user, // All users can upload (for profile pictures)
    read: () => true,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      label: 'Alt-Text',
      admin: {
        description: 'Alternativtext für Barrierefreiheit',
      },
    },
  ],
  upload: {
    // Vercel Blob storage limits
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
  },
}
