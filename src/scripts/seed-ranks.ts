import { getPayload } from 'payload'
import config from '@payload-config'

const ranks = [
  {
    label: 'Fuchs',
    value: 'fuchs',
    colors: [
      { color: '#E10909' },
      { color: '#FFFFFF' },
      { color: '#E10909' },
    ],
  },
  {
    label: 'Bursche',
    value: 'bursche',
    colors: [
      { color: '#A57D42' },
      { color: '#E10909' },
      { color: '#FFFFFF' },
    ],
  },
  {
    label: 'Externe',
    value: 'externe',
    colors: [
      { color: '#CCCCCC' },
      { color: '#CCCCCC' },
      { color: '#CCCCCC' },
    ],
  },
]

// This must be at the top level (not inside a function) for payload run
const payload = await getPayload({ config })

console.log('Seeding ranks...')

for (const rank of ranks) {
  try {
    const created = await payload.create({
      collection: 'ranks',
      data: rank,
    })
    console.log(`✓ Created rank: ${rank.label} (ID: ${created.id})`)
  } catch (error) {
    console.error(`✗ Failed to create rank ${rank.label}:`, error)
  }
}

console.log('Seeding complete!')
process.exit(0)
