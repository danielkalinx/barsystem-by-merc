import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

const ranks = [
  {
    label: 'Fuchs',
    value: 'fuchs',
    colors: [{ color: '#E10909' }, { color: '#FFFFFF' }, { color: '#E10909' }],
  },
  {
    label: 'Bursche',
    value: 'bursche',
    colors: [{ color: '#A57D42' }, { color: '#E10909' }, { color: '#FFFFFF' }],
  },
  {
    label: 'Aktive',
    value: 'aktive',
    colors: [{ color: '#000000' }, { color: '#000000' }, { color: '#000000' }],
  },
  {
    label: 'Verkehrsaktive',
    value: 'verkehrsaktive',
    colors: [{ color: '#000000' }, { color: '#000000' }, { color: '#000000' }],
  },
  {
    label: 'Alte Herren',
    value: 'alte-herren',
    colors: [{ color: '#000000' }, { color: '#000000' }, { color: '#000000' }],
  },
  {
    label: 'Externe',
    value: 'externe',
    colors: [{ color: '#000000' }, { color: '#000000' }, { color: '#000000' }],
  },
]

export async function POST() {
  try {
    const payload = await getPayloadHMR({ config: configPromise })

    const results = []
    for (const rank of ranks) {
      try {
        const created = await payload.create({
          collection: 'ranks',
          data: rank,
        })
        results.push({ success: true, label: rank.label, id: created.id })
      } catch (error: any) {
        results.push({ success: false, label: rank.label, error: error.message })
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
