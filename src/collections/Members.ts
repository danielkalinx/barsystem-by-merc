import type { CollectionConfig } from 'payload'

export const Members: CollectionConfig = {
  slug: 'members',
  labels: {
    singular: 'Mitglied',
    plural: 'Mitglieder',
  },
  admin: {
    useAsTitle: 'couleurname',
    defaultColumns: ['couleurname', 'firstName', 'lastName', 'rank', 'tabBalance'],
  },
  fields: [
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
    },
    {
      name: 'rank',
      type: 'select',
      required: true,
      label: 'Rang',
      options: [
        { label: 'Bursche', value: 'bursche' },
        { label: 'Fuchs', value: 'fuchs' },
      ],
      defaultValue: 'fuchs',
    },
    {
      name: 'rankColors',
      type: 'array',
      label: 'Rangfarben (3 Hex-Werte)',
      admin: {
        readOnly: true,
        description: 'Automatisch basierend auf Rang gesetzt: Bursche (#A57D42, #E10909, #FFFFFF) oder Fuchs (#E10909, #FFFFFF, #E10909)',
      },
      fields: [
        {
          name: 'color',
          type: 'text',
          label: 'Farbe',
        },
      ],
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            // Set rank colors based on rank
            if (siblingData.rank === 'bursche') {
              return [
                { color: '#A57D42' },
                { color: '#E10909' },
                { color: '#FFFFFF' },
              ]
            } else if (siblingData.rank === 'fuchs') {
              return [
                { color: '#E10909' },
                { color: '#FFFFFF' },
                { color: '#E10909' },
              ]
            }
            return siblingData.rankColors
          },
        ],
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
