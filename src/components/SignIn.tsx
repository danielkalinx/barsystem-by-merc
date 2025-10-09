'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { signIn } from '@/app/(frontend)/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [keepSignedIn, setKeepSignedIn] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await signIn(email, password)

    if (result.success) {
      window.location.href = '/'
    } else {
      setError(result.error || 'Anmeldung fehlgeschlagen')
      setIsLoading(false)
    }
  }

  return (
    <div className="relative grid min-h-screen gap-12 overflow-hidden bg-gradient-to-br from-background via-background to-muted/30 lg:grid-cols-2">
      <div className="absolute inset-y-0 right-1/2 hidden w-1/2 translate-x-1/3 rounded-full bg-primary/5 blur-3xl lg:block" />

      <div className="relative flex items-center justify-center px-6 py-12 sm:px-10 lg:py-24">
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="mb-8 flex items-center gap-3">
            <span className="inline-flex size-12 items-center justify-center rounded-full border border-border/60 bg-muted/30">
              <Image
                src="/images/merc-logo.png"
                alt="Merc Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                K.Ö.H.V. Mercuria
              </p>
              <h2 className="text-lg font-semibold text-foreground">Bar Management Portal</h2>
            </div>
          </div>

          <Card className="p-8">
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-3xl font-semibold">Login MercID</CardTitle>
              <CardDescription>
                Melde dich an, um deine Bar-Sitzungen zu verwalten und verbunden zu bleiben.
              </CardDescription>
            </CardHeader>

            <Separator className="bg-border/60" />

            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                    E-Mail Adresse
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="du@mercuria.at"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                      Passwort
                    </label>
                    <button
                      type="button"
                      className="text-xs font-medium text-primary transition hover:text-primary/80"
                      disabled={isLoading}
                    >
                      Passwort vergessen?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-border/60 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="keep-signed-in"
                      checked={keepSignedIn}
                      onCheckedChange={(value) => setKeepSignedIn(value === true)}
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="keep-signed-in"
                      className="text-sm font-medium leading-none text-foreground"
                    >
                      Angemeldet bleiben
                    </label>
                  </div>
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    Sicher auf persönlichen Geräten
                  </span>
                </div>

                {error && (
                  <motion.p
                    className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full justify-center rounded-full text-sm font-semibold"
                >
                  {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
                </Button>
              </form>

              <Separator className="bg-border/60" />

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Neu im System? Schreib uns eine Mail.</span>
                <button
                  type="button"
                  className="font-semibold text-primary underline-offset-4 transition hover:text-primary/80 hover:underline"
                >
                  kontakt@mercuria.at
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="relative hidden min-h-screen lg:block">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/images/signin-background.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-background/60 via-background/20 to-transparent" />
        </motion.div>
      </div>
    </div>
  )
}
