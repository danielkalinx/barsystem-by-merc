import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const { user } = await payload.auth({
      headers: new Headers({
        cookie: `payload-token=${token}`,
      }),
    })

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    // Fetch user with populated rank to get colors
    const fullUser = await payload.findByID({
      collection: 'members',
      id: user.id,
      depth: 1, // Populate rank with colors
    })

    return NextResponse.json({ user: fullUser })
  } catch (error) {
    console.error('Error fetching current user:', error)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
