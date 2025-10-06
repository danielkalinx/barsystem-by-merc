'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function getCurrentUser() {
  try {
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return null
    }

    // Verify token and get user
    const { user } = await payload.auth({ headers: new Headers({ cookie: `payload-token=${token}` }) })
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function getActiveSession() {
  try {
    const payload = await getPayload({ config })
    const sessions = await payload.find({
      collection: 'sessions',
      where: {
        status: {
          equals: 'active',
        },
      },
      limit: 1,
      depth: 2, // Populate relationships (bartenders.member, createdBy)
    })

    return sessions.docs[0] || null
  } catch (error) {
    console.error('Error getting active session:', error)
    return null
  }
}

export async function getAllMembers() {
  try {
    const payload = await getPayload({ config })
    const members = await payload.find({
      collection: 'members',
      limit: 1000,
      depth: 1, // Populate rank
      sort: 'couleurname',
    })

    return members.docs
  } catch (error) {
    console.error('Error getting members:', error)
    return []
  }
}

export async function createSession(data: {
  bartenders: Array<{
    memberId: string
    estimatedStartTime?: string
    estimatedEndTime?: string
  }>
  notes?: string
}) {
  try {
    const payload = await getPayload({ config })
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can create sessions')
    }

    // Check if there's already an active session
    const activeSession = await getActiveSession()
    if (activeSession) {
      throw new Error('Es gibt bereits eine aktive Sitzung')
    }

    // Create new session
    const session = await payload.create({
      collection: 'sessions',
      data: {
        status: 'active',
        createdBy: currentUser.id,
        startTime: new Date().toISOString(),
        bartenders: data.bartenders.map((b) => ({
          member: b.memberId,
          estimatedStartTime: b.estimatedStartTime || undefined,
          estimatedEndTime: b.estimatedEndTime || undefined,
          bartenderStatus: 'active',
        })),
        totalRevenue: 0,
        statistics: {
          totalProductsSold: 0,
        },
      },
    })

    return { success: true, session }
  } catch (error) {
    console.error('Error creating session:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create session',
    }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const payload = await getPayload({ config })
    const result = await payload.login({
      collection: 'members',
      data: { email, password },
    })

    if (result.token) {
      const cookieStore = await cookies()
      cookieStore.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    return { success: true, user: result.user }
  } catch (error) {
    console.error('Error signing in:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sign in',
    }
  }
}

export async function signOut() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('payload-token')
    return { success: true }
  } catch (error) {
    console.error('Error signing out:', error)
    return { success: false }
  }
}

export async function closeSession(sessionId: string) {
  try {
    const payload = await getPayload({ config })
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can close sessions')
    }

    // Update session to closed
    const session = await payload.update({
      collection: 'sessions',
      id: sessionId,
      data: {
        status: 'closed',
        endTime: new Date().toISOString(),
      },
    })

    return { success: true, session }
  } catch (error) {
    console.error('Error closing session:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to close session',
    }
  }
}
