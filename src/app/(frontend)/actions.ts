'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import type { Member, Product, Session } from '@/payload-types'

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

export async function getAvailableProducts() {
  try {
    const payload = await getPayload({ config })
    const products = await payload.find({
      collection: 'products',
      where: {
        available: {
          equals: true,
        },
      },
      limit: 1000,
      sort: 'name',
    })

    return products.docs as Product[]
  } catch (error) {
    console.error('Error getting products:', error)
    return []
  }
}

type OrderItemInput = {
  productId: string
  quantity: number
}

export async function createOrder({
  memberId,
  items,
}: {
  memberId: string
  items: OrderItemInput[]
}) {
  try {
    const currentUser = (await getCurrentUser()) as Member | null

    if (!currentUser) {
      throw new Error('Nicht eingeloggt')
    }

    if (!memberId) {
      throw new Error('Bitte ein Mitglied auswählen')
    }

    if (!items?.length) {
      throw new Error('Keine Produkte ausgewählt')
    }

    const payload = await getPayload({ config })

    const activeSessionQuery = await payload.find({
      collection: 'sessions',
      where: {
        status: {
          equals: 'active',
        },
      },
      limit: 1,
      depth: 1,
    })

    const activeSession = activeSessionQuery.docs[0] as Session | undefined

    if (!activeSession) {
      throw new Error('Es ist keine Sitzung aktiv')
    }

    const isAdmin = currentUser.role === 'admin'
    const isBartender =
      activeSession.bartenders?.some((bartender) => {
        const member = bartender.member
        const bartenderId =
          typeof member === 'string'
            ? member
            : typeof member === 'object'
              ? member.id
              : null
        return bartenderId === currentUser.id
      }) ?? false

    if (!isAdmin && !isBartender) {
      throw new Error('Keine Berechtigung zum Bestellen')
    }

    const uniqueProductIds = Array.from(new Set(items.map((item) => item.productId)))
    const productsQuery = await payload.find({
      collection: 'products',
      where: {
        id: {
          in: uniqueProductIds,
        },
      },
      limit: uniqueProductIds.length,
    })

    const productsById = new Map<string, Product>()
    for (const product of productsQuery.docs as Product[]) {
      productsById.set(product.id, product)
    }

    const normalizedItems = items.map((item) => {
      const product = productsById.get(item.productId)

      if (!product) {
        throw new Error('Produkt nicht gefunden')
      }

      if (product.available === false) {
        throw new Error(`Produkt ${product.name} ist nicht verfügbar`)
      }

      const quantity = Number.isFinite(item.quantity) ? Math.max(1, Math.floor(item.quantity)) : 1
      const priceAtOrder = typeof product.price === 'number' ? product.price : 0

      return {
        product: product.id,
        quantity,
        priceAtOrder,
        productName: product.name,
      }
    })

    const totalAmount = normalizedItems.reduce(
      (sum, item) => sum + item.priceAtOrder * item.quantity,
      0,
    )

    const totalProducts = normalizedItems.reduce((sum, item) => sum + item.quantity, 0)

    if (totalAmount <= 0) {
      throw new Error('Bestellsumme muss positiv sein')
    }

    const member = await payload.findByID({
      collection: 'members',
      id: memberId,
      depth: 0,
      overrideAccess: true,
    })

    if (!member) {
      throw new Error('Mitglied nicht gefunden')
    }

    const createdOrder = await payload.create({
      collection: 'orders',
      data: {
        session: activeSession.id,
        member: memberId,
        bartender: currentUser.id,
        items: normalizedItems.map(({ product, quantity, priceAtOrder }) => ({
          product,
          quantity,
          priceAtOrder,
        })),
        totalAmount,
        status: 'completed',
      },
      overrideAccess: !isAdmin,
    })

    const updatedTabBalance =
      typeof member.tabBalance === 'number' ? member.tabBalance + totalAmount : totalAmount

    await payload.update({
      collection: 'members',
      id: memberId,
      data: {
        tabBalance: updatedTabBalance,
      },
      overrideAccess: true,
    })

    const currentTotalRevenue =
      typeof activeSession.totalRevenue === 'number' ? activeSession.totalRevenue : 0
    const currentStatistics =
      typeof activeSession.statistics === 'object' ? activeSession.statistics : null
    const totalProductsSold = currentStatistics?.totalProductsSold ?? 0
    const mostPopularProduct = currentStatistics?.mostPopularProduct

    const topItem = normalizedItems.reduce((acc, item) => {
      if (!acc || item.quantity > acc.quantity) {
        return item
      }
      return acc
    }, null as (typeof normalizedItems)[number] | null)

    await payload.update({
      collection: 'sessions',
      id: activeSession.id,
      data: {
        totalRevenue: currentTotalRevenue + totalAmount,
        statistics: {
          totalProductsSold: totalProductsSold + totalProducts,
          mostPopularProduct: mostPopularProduct || topItem?.productName,
        },
      },
      overrideAccess: true,
    })

    return { success: true, order: createdOrder }
  } catch (error) {
    console.error('Error creating order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bestellung fehlgeschlagen',
    }
  }
}
