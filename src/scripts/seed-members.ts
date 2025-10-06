import { getPayload } from 'payload'
import config from '@payload-config'

// This must be at the top level (not inside a function) for payload run
const payload = await getPayload({ config })

console.log('Fetching ranks...')

// Get all ranks first
const { docs: ranks } = await payload.find({
  collection: 'ranks',
  limit: 10,
})

if (ranks.length === 0) {
  console.error('No ranks found. Please run seed:ranks first.')
  process.exit(1)
}

console.log(`Found ${ranks.length} ranks`)

// Find specific ranks by value
const fuchsRank = ranks.find((r) => r.value === 'fuchs')
const burscheRank = ranks.find((r) => r.value === 'bursche')
const externeRank = ranks.find((r) => r.value === 'externe')

const members = [
  {
    email: 'admin@mercuria.at',
    password: 'admin123',
    role: 'admin' as const,
    firstName: 'Max',
    lastName: 'Mustermann',
    couleurname: 'Maximus',
    rank: burscheRank?.id,
    tabBalance: 0,
  },
  {
    email: 'franz.huber@mercuria.at',
    password: 'member123',
    role: 'member' as const,
    firstName: 'Franz',
    lastName: 'Huber',
    couleurname: 'Franziskus',
    rank: burscheRank?.id,
    tabBalance: 15.50,
  },
  {
    email: 'thomas.meier@mercuria.at',
    password: 'member123',
    role: 'member' as const,
    firstName: 'Thomas',
    lastName: 'Meier',
    couleurname: 'Thor',
    rank: fuchsRank?.id,
    tabBalance: 8.20,
  },
  {
    email: 'peter.schmidt@mercuria.at',
    password: 'member123',
    role: 'member' as const,
    firstName: 'Peter',
    lastName: 'Schmidt',
    couleurname: 'Petrus',
    rank: burscheRank?.id,
    tabBalance: 0,
  },
  {
    email: 'guest@mercuria.at',
    password: 'guest123',
    role: 'member' as const,
    firstName: 'Gast',
    lastName: 'Besucher',
    couleurname: 'Visitor',
    rank: externeRank?.id,
    tabBalance: 5.00,
  },
]

console.log('Seeding members...')

for (const member of members) {
  try {
    const created = await payload.create({
      collection: 'members',
      data: member,
    })
    console.log(`✓ Created member: ${member.couleurname} (${member.email}) - Role: ${member.role}`)
  } catch (error) {
    console.error(`✗ Failed to create member ${member.couleurname}:`, error)
  }
}

console.log('Seeding complete!')
process.exit(0)
