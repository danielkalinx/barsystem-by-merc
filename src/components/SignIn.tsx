'use client'

import { useState } from 'react'
import { signIn } from '@/app/(frontend)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Logo } from '@/components/Logo'
import Button3D from '@/components/Button3D'
import { ArrowRight } from 'lucide-react'

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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container max-w-7xl flex lg:flex-row flex-col">
        {/* Left side - Sign in form */}
        <div className="flex-1 flex flex-col items-start justify-center px-8 lg:px-16 py-16 lg:py-24">
          <div className="w-full max-w-sm flex flex-col gap-16">
            {/* Logo */}
            <div>
              <Logo size={36} />
            </div>

            {/* Sign in form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col gap-2 text-left">
                <h1 className="text-5xl lg:text-6xl mb-4 font-bold tracking-tight text-card-foreground">
                  Sign in
                </h1>
                <p className="text-sm leading-5 text-muted-foreground">
                  Log in to unlock tailored content and stay connected with your community.
                </p>
              </div>

              {/* Form */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="keep-signed-in"
                      checked={checked}
                      onCheckedChange={(value) => setChecked(value as boolean)}
                      disabled={isLoading}
                    />
                    <label htmlFor="keep-signed-in" className="text-sm font-medium">
                      Keep me signed in
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-muted-foreground underline"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              {/* Submit button */}
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
                <ArrowRight />
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{' '}
                <button type="button" className="text-primary underline">
                  Sign up
                </button>
              </p>
            </form>
          </div>
        </div>

        {/* Right side - 3D Button Scene (hidden on mobile, visible on lg) */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-muted rounded-4xl overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <Button3D />
          </div>
        </div>
      </div>
    </div>
  )
}
