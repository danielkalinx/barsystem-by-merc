'use client'

import { useState } from 'react'
import Image from 'next/image'
import { signIn } from '@/app/(frontend)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Logo } from '@/components/Logo'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [checked, setChecked] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await signIn(email, password)

    if (result.success) {
      window.location.href = '/' // Redirect to dashboard
    } else {
      setError(result.error || 'Anmeldung fehlgeschlagen')
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex lg:flex-row flex-col">
      {/* Left side - Sign in form */}
      <div className="bg-background flex-1 h-screen flex flex-col items-center justify-center px-6 py-24 relative">
        {/* Logo positioned at top left */}
        <div className="absolute top-4 left-4 lg:top-6 lg:left-6">
          <Logo size={36} />
        </div>

        {/* Sign in form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl font-bold leading-9 text-card-foreground">Auf geht's!</h1>
            <p className="text-sm leading-5 text-muted-foreground">
              Paragraph 11: Porro bibitur! Melde dich an, um eine Bar Session zu starten.
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="keep-signed-in"
                  checked={checked}
                  onCheckedChange={(value) => setChecked(value as boolean)}
                  disabled={isLoading}
                />
                <label htmlFor="keep-signed-in" className="text-sm font-medium">
                  Angemeldet bleiben
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-muted-foreground underline"
                disabled={isLoading}
              >
                Passwort vergessen?
              </button>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          {/* Submit button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
          </Button>
        </form>
      </div>

      {/* Right side - Image (hidden on mobile, visible on lg) */}
      <div className="hidden lg:block flex-1 h-screen relative bg-muted">
        <Image
          src="/signin-background.jpg"
          alt="Sign in background"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>
    </div>
  )
}
