'use client'

import { useMemo, useState, useTransition } from 'react'
import { motion } from 'motion/react'
import { createOrder } from '@/app/(frontend)/actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import type { Member, Product, Session } from '@/payload-types'

type PriceListProps = {
  session: Session | null
  products: Product[]
  members: Member[]
  canOrder: boolean
}

type CartState = Record<
  string,
  {
    product: Product
    quantity: number
  }
>

export function PriceList({ session, products, members, canOrder }: PriceListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('alle')
  const [selectedMember, setSelectedMember] = useState('')
  const [cart, setCart] = useState<CartState>({})
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const categories = useMemo(() => {
    const categorySet = new Set<string>()
    products.forEach((product) => {
      if (product.category) {
        categorySet.add(product.category)
      }
    })
    return ['alle', ...Array.from(categorySet).sort((a, b) => a.localeCompare(b, 'de'))]
  }, [products])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return products.filter((product) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        (product.category ? product.category.toLowerCase().includes(normalizedSearch) : false)

      const matchesCategory =
        categoryFilter === 'alle' ||
        (product.category ? product.category.toLowerCase() === categoryFilter.toLowerCase() : false)

      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, categoryFilter])

  const cartItems = useMemo(() => Object.values(cart), [cart])
  const cartTotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const price = typeof item.product.price === 'number' ? item.product.price : 0
        return sum + price * item.quantity
      }, 0),
    [cartItems],
  )

  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )

  const isSessionActive = Boolean(session)
  const sessionStartTime = session?.startTime ? new Date(session.startTime) : null
  const formattedSessionStart = sessionStartTime
    ? sessionStartTime.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart[product.id]
      const nextQuantity = existing ? existing.quantity + 1 : 1

      return {
        ...prevCart,
        [product.id]: {
          product,
          quantity: nextQuantity,
        },
      }
    })
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        const { [productId]: _, ...rest } = prevCart
        return rest
      }

      const existing = prevCart[productId]
      if (!existing) {
        return prevCart
      }

      return {
        ...prevCart,
        [productId]: {
          ...existing,
          quantity,
        },
      }
    })
  }

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => {
      const { [productId]: _, ...rest } = prevCart
      return rest
    })
  }

  const handleOrderSubmit = () => {
    if (!canOrder || !selectedMember || cartItems.length === 0) {
      return
    }

    setFeedback(null)
    startTransition(() => {
      ;(async () => {
        const response = await createOrder({
          memberId: selectedMember,
          items: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        })

        if (response.success) {
          setCart({})
          setFeedback({
            type: 'success',
            text: 'Bestellung wurde gespeichert.',
          })
        } else {
          setFeedback({
            type: 'error',
            text: response.error || 'Bestellung fehlgeschlagen.',
          })
        }
      })()
    })
  }

  const renderFeedback = () => {
    if (!feedback) {
      return null
    }

    const colorClass = feedback.type === 'success' ? 'text-green-600' : 'text-red-600'

    return <p className={`text-sm font-medium ${colorClass}`}>{feedback.text}</p>
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {isSessionActive ? 'Aktive Sitzung' : 'Keine aktive Sitzung'}
            </CardTitle>
            <Badge variant={isSessionActive ? 'default' : 'secondary'} className="px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              {isSessionActive ? 'Bestellungen möglich' : 'Nur Ansicht'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {isSessionActive ? (
            <>
              <p>Bestellungen sind für Schenken der aktuellen Sitzung und Admins freigeschaltet.</p>
              {formattedSessionStart && <p>Gestartet am {formattedSessionStart}</p>}
              {!canOrder && (
                <p className="font-medium text-orange-600">
                  Du bist nicht als Schenk eingetragen – Bestellungen sind nur als Admin möglich.
                </p>
              )}
            </>
          ) : (
            <p>Ohne aktive Sitzung können keine Bestellungen aufgegeben werden.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Card>
            <CardContent className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Nach Produkt oder Kategorie suchen…"
                className="h-11 rounded-full md:max-w-sm"
              />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-11 w-full rounded-full md:w-56">
                  <SelectValue placeholder="Kategorie wählen" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border/60">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === 'alle' ? 'Alle Kategorien' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Keine Produkte gefunden.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {filteredProducts.map((product, index) => {
                const price = typeof product.price === 'number' ? product.price : 0

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                  >
                    <Card className="group flex h-full flex-col justify-between p-5 transition hover:-translate-y-1">
                      <div>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
                          {product.popular && (
                            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs font-medium">
                              Beliebt
                            </Badge>
                          )}
                        </div>
                        {product.category && (
                          <Badge variant="outline" className="mt-3 w-fit rounded-full border-border/60">
                            {product.category}
                          </Badge>
                        )}
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <p className="text-2xl font-semibold text-foreground">€{price.toFixed(2)}</p>
                        <Button
                          type="button"
                          size="sm"
                          className="rounded-full px-5"
                          onClick={() => handleAddToCart(product)}
                          disabled={!canOrder}
                        >
                          {canOrder ? 'In den Warenkorb' : 'Nur Ansicht'}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>Warenkorb</CardTitle>
            <p className="text-sm text-muted-foreground">
              {canOrder ? 'Stelle deine Bestellung zusammen.' : 'Nur Ansicht verfügbar.'}
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Mitglied auswählen</p>
              <Select value={selectedMember} onValueChange={setSelectedMember} disabled={!canOrder}>
                <SelectTrigger className="h-11 w-full rounded-full">
                  <SelectValue placeholder="Mitglied wählen" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border/60">
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.couleurname || `${member.firstName} ${member.lastName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {cartItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-background/50 p-5 text-sm text-muted-foreground">
                Noch keine Produkte ausgewählt.
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const price = typeof item.product.price === 'number' ? item.product.price : 0
                  return (
                    <div
                      key={item.product.id}
                      className="space-y-2 rounded-2xl border border-border/60 bg-background/60 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            €{price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="rounded-full px-3"
                          onClick={() => handleRemoveFromCart(item.product.id)}
                        >
                          Entfernen
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(event) =>
                            handleQuantityChange(
                              item.product.id,
                              Math.max(1, Number.parseInt(event.target.value, 10) || 1),
                            )
                          }
                          className="h-10 w-20 rounded-full"
                          disabled={!canOrder}
                        />
                        <span className="text-sm font-medium">
                          Zwischensumme: €{(price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <Separator className="bg-border/60" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Anzahl Produkte</span>
                <span className="font-medium text-foreground">{totalQuantity}</span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>Gesamt</span>
                <span>€{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {renderFeedback()}

            <Button
              type="button"
              onClick={handleOrderSubmit}
              disabled={!canOrder || cartItems.length === 0 || !selectedMember || isPending}
              className="w-full rounded-full py-2.5 font-semibold"
            >
              {isPending ? 'Wird gespeichert…' : 'Bestellung abschicken'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
