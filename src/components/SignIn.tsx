'use client'

import { useState } from 'react'
import { signIn } from '@/app/(frontend)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [keepSignedIn, setKeepSignedIn] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    <div className="flex items-start lg:items-center relative size-full min-h-screen">
      {/* Left side - Form Container */}
      <div className="flex-1 bg-background flex items-start lg:items-center justify-center px-6 py-12 lg:py-24 h-full min-h-screen relative overflow-y-auto">
        {/* Logo - Top Left */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <div className="relative size-10 overflow-hidden">
            <Image
              src="/images/merc-logo.png"
              alt="Merc Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Form Content - Centered */}
        <div className="flex flex-col gap-6 items-start max-w-sm w-full mt-16 lg:mt-0">
          {/* Header */}
          <div className="flex flex-col gap-2 items-start w-full text-center">
            <h1 className="font-bold text-3xl leading-9 text-card-foreground w-full">
              Login MercID
            </h1>
            <p className="font-normal text-sm leading-5 text-muted-foreground w-full">
              Melde dich an, um auf maßgeschneiderte Inhalte zuzugreifen und mit deiner
              Community in Verbindung zu bleiben.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            {/* Email Input */}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-14 rounded-2xl bg-[rgba(0,0,0,0.03)] border-input"
            />

            {/* Password Input */}
            <Input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="h-14 rounded-2xl bg-[rgba(0,0,0,0.03)] border-input"
            />

            {/* Checkbox and Forgot Password Row */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="keep-signed-in"
                  checked={keepSignedIn}
                  onCheckedChange={(value) => setKeepSignedIn(value as boolean)}
                  disabled={isLoading}
                  className="size-4 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor="keep-signed-in"
                  className="text-sm font-medium leading-none text-foreground"
                >
                  Angemeldet bleiben
                </label>
              </div>
              <button
                type="button"
                className="text-sm leading-5 text-muted-foreground underline"
                disabled={isLoading}
              >
                Passwort vergessen?
              </button>
            </div>

            {/* Error Message */}
            {error && <p className="text-sm text-destructive">{error}</p>}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 rounded-full bg-primary text-primary-foreground px-6 py-3 font-medium text-sm"
            >
              {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="flex items-center justify-center gap-1 w-full text-sm leading-5 text-center">
            <p className="text-muted-foreground">Neu hier?</p>
            <button type="button" className="text-primary underline">
              email@com.com
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Background Image (Desktop only) */}
      <div className="hidden lg:block flex-1 h-full min-h-screen relative">
        <Image
          src="/images/signin-background.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}
