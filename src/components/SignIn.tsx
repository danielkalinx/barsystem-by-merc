'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { signIn } from '@/app/(frontend)/actions'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [keepSignedIn, setKeepSignedIn] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.body.classList.add('no-navbar')
    return () => {
      document.body.classList.remove('no-navbar')
    }
  }, [])

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
    <div className="relative flex min-h-screen overflow-x-clip">
      <div className="absolute -right-1/4 top-0 hidden h-full w-[150%] bg-[radial-gradient(circle_at_50%_35%,rgba(255,122,122,0.45),transparent_60%),radial-gradient(circle_at_65%_65%,rgba(255,180,180,0.3),transparent_65%)] lg:block" />

      <div className="relative z-10 flex w-full flex-col justify-center px-6 py-16 sm:px-12 lg:w-1/2 lg:pl-24 xl:pl-32">
        <motion.div
          className="w-full max-w-sm space-y-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Login MercID</h1>
            <p className="text-base text-muted-foreground">
              Logge dich ein, um personalisierte Inhalte freizuschalten und mit deiner Community
              verbunden zu bleiben.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isLoading}
            />

            <Input
              id="password"
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isLoading}
            />

            <div className="flex items-center justify-between text-base text-muted-foreground">
              <label className="flex items-center gap-2">
                <Checkbox
                  id="keep-signed-in"
                  checked={keepSignedIn}
                  onCheckedChange={(value) => setKeepSignedIn(value === true)}
                  disabled={isLoading}
                  className="rounded-[6px] border border-muted-foreground/30 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                Angemeldet bleiben
              </label>
              <button
                type="button"
                className="text-sm font-medium text-primary underline-offset-4 transition hover:underline"
                disabled={isLoading}
              >
                Passwort vergessen?
              </button>
            </div>

            {error && (
              <motion.p
                className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-base font-medium text-destructive"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full justify-center rounded-full bg-primary text-primary-foreground text-base font-semibold transition hover:bg-primary/90"
            >
              {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
            </Button>
          </form>

          <Separator />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Neu im System?</span>
            <button
              type="button"
              className="font-semibold text-primary underline-offset-4 transition hover:underline"
            >
              kontakt@mercuria.at
            </button>
          </div>
        </motion.div>
      </div>

      <div className="relative hidden min-h-screen flex-1 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,160,160,0.35),transparent_65%)]" />
      </div>
    </div>
  )
}
